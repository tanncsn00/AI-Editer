/**
 * GlbPosedFromTracking — load Mixamo-rigged GLB and drive its skeleton from
 * MediaPipe pose_world_landmarks (true 3D meters, hip-relative).
 *
 * Algorithm:
 *  1. At load: cache rest LOCAL quaternion + rest WORLD quaternion per bone.
 *  2. Per frame: for each (parentBone, childBone) pair, compute target world
 *     direction from MP world coords (Y/Z flipped to Three convention),
 *     then deltaQ such that  parentBone.restWorldQ * deltaQ * restChildPos
 *     points along targetWorldDir, and set parentBone.quaternion = restQ * deltaQ.
 *  3. Hips: rotate root around Y from left→right hip vector (so character turns).
 *  4. Spine: rotate from midHip→midShoulder vector.
 *
 * Coordinate flip MP (right, down, away-camera) → Three (right, up, toward-camera):
 *   threeX = mpX,  threeY = -mpY,  threeZ = -mpZ
 */

import { useCurrentFrame, useVideoConfig, delayRender, continueRender } from "remotion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type WorldLm = { name: string; x: number; y: number; z: number };
type Lm = WorldLm & { visibility?: number };

type TrackingFull = {
  fps: number; width: number; height: number;
  frames: Array<{ landmarks: Lm[]; world_landmarks?: WorldLm[] }>;
};

const pickW = (lms: WorldLm[] | undefined, name: string): THREE.Vector3 | null => {
  if (!lms) return null;
  const lm = lms.find((l) => l.name === name);
  if (!lm) return null;
  // MP world → Three world (flip Y, flip Z)
  return new THREE.Vector3(lm.x, -lm.y, -lm.z);
};

const dir = (a: THREE.Vector3 | null, b: THREE.Vector3 | null): THREE.Vector3 | null => {
  if (!a || !b) return null;
  return b.clone().sub(a).normalize();
};

export const GlbPosedFromTracking: React.FC<{
  url: string;
  tracking: TrackingFull;
  scale?: number;
  position?: [number, number, number];
}> = ({ url, tracking, scale = 1.0, position = [0, -1.0, 0] }) => {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender(`Loading GLB ${url}`));
  const bones = useRef<Record<string, THREE.Bone>>({});
  const restLocalQ = useRef<Record<string, THREE.Quaternion>>({});
  const restWorldQ = useRef<Record<string, THREE.Quaternion>>({});
  const restChildPos = useRef<Record<string, THREE.Vector3>>({}); // child rest pos in parent local

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        const s = gltf.scene;

        // Face camera: Mixamo default faces -Z. Rotate so character faces +Z (toward camera at z>0).
        s.rotation.y = Math.PI;

        const b: Record<string, THREE.Bone> = {};
        s.traverse((o: THREE.Object3D) => {
          if ((o as any).isBone) b[o.name] = o as THREE.Bone;
        });
        bones.current = b;

        // Cache rest local quaternions
        Object.entries(b).forEach(([k, bone]) => {
          restLocalQ.current[k] = bone.quaternion.clone();
        });
        // Force matrix update with rest pose, then cache world quaternions
        s.updateMatrixWorld(true);
        Object.entries(b).forEach(([k, bone]) => {
          const wq = new THREE.Quaternion();
          bone.getWorldQuaternion(wq);
          restWorldQ.current[k] = wq;
        });

        // Compute and cache child rest position for each parent bone we drive
        const pairs: [string, string][] = [
          ["mixamorigRightArm", "mixamorigRightForeArm"],
          ["mixamorigRightForeArm", "mixamorigRightHand"],
          ["mixamorigLeftArm", "mixamorigLeftForeArm"],
          ["mixamorigLeftForeArm", "mixamorigLeftHand"],
          ["mixamorigRightUpLeg", "mixamorigRightLeg"],
          ["mixamorigRightLeg", "mixamorigRightFoot"],
          ["mixamorigLeftUpLeg", "mixamorigLeftLeg"],
          ["mixamorigLeftLeg", "mixamorigLeftFoot"],
          ["mixamorigSpine1", "mixamorigSpine2"],
          ["mixamorigSpine2", "mixamorigNeck"],
          ["mixamorigNeck", "mixamorigHead"],
        ];
        for (const [p, c] of pairs) {
          const parent = b[p], child = b[c];
          if (parent && child) {
            restChildPos.current[p] = child.position.clone().normalize();
          }
        }

        setScene(s);
        continueRender(handle);
      },
      undefined,
      (err) => {
        console.error("GLB load error", err);
        continueRender(handle);
      }
    );
  }, [url, handle]);

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tIdx = useMemo(() => {
    const t = frame / fps;
    return Math.min(tracking.frames.length - 1, Math.round(t * tracking.fps));
  }, [frame, fps, tracking]);

  if (scene) {
    const f = tracking.frames[tIdx];
    const wlms = f?.world_landmarks;
    if (wlms?.length) {
      const sL = pickW(wlms, "left_shoulder"), sR = pickW(wlms, "right_shoulder");
      const eL = pickW(wlms, "left_elbow"), eR = pickW(wlms, "right_elbow");
      const wL = pickW(wlms, "left_wrist"), wR = pickW(wlms, "right_wrist");
      const hL = pickW(wlms, "left_hip"), hR = pickW(wlms, "right_hip");
      const kL = pickW(wlms, "left_knee"), kR = pickW(wlms, "right_knee");
      const aL = pickW(wlms, "left_ankle"), aR = pickW(wlms, "right_ankle");
      const nose = pickW(wlms, "nose");

      const midShoulder = sL && sR ? sL.clone().add(sR).multiplyScalar(0.5) : null;
      const midHip = hL && hR ? hL.clone().add(hR).multiplyScalar(0.5) : null;

      // Reset all bones to rest first
      Object.entries(bones.current).forEach(([k, bone]) => {
        if (restLocalQ.current[k]) bone.quaternion.copy(restLocalQ.current[k]);
      });

      const B = bones.current;

      // ─── Hip rotation (root yaw/pitch from hip vector + spine) ───
      // Mixamo Hips bone — rotate so left_hip→right_hip and midHip→midShoulder match MP.
      if (B.mixamorigHips && hL && hR && midHip && midShoulder) {
        const hipRight = hR.clone().sub(hL).normalize(); // body's right
        const spineUp = midShoulder.clone().sub(midHip).normalize();
        // Build a basis: x=right, y=up, z = right × up (forward)
        const fwd = new THREE.Vector3().crossVectors(hipRight, spineUp).normalize();
        const up = new THREE.Vector3().crossVectors(fwd, hipRight).normalize();
        const m = new THREE.Matrix4().makeBasis(hipRight, up, fwd);
        const targetHipQ = new THREE.Quaternion().setFromRotationMatrix(m);

        // Hips parent is the scene root (after we rotated 180°). We want hips world quat = scene.rot * hips.local.
        // We set local = scene.rot.inverse() * targetHipQ
        const sceneInvQ = new THREE.Quaternion().copy(scene.quaternion).invert();
        B.mixamorigHips.quaternion.copy(sceneInvQ).multiply(targetHipQ);
      }
      scene.updateMatrixWorld(true);

      // ─── Limb chain aiming ───
      const aimPairs: Array<[string, THREE.Vector3 | null]> = [
        // Mixamo's character-LEFT corresponds to subject's LEFT (when facing camera).
        // MP labels are also subject's left/right. So no mirror needed once character faces camera.
        ["mixamorigLeftArm", dir(sL, eL)],
        ["mixamorigLeftForeArm", dir(eL, wL)],
        ["mixamorigRightArm", dir(sR, eR)],
        ["mixamorigRightForeArm", dir(eR, wR)],
        ["mixamorigLeftUpLeg", dir(hL, kL)],
        ["mixamorigLeftLeg", dir(kL, aL)],
        ["mixamorigRightUpLeg", dir(hR, kR)],
        ["mixamorigRightLeg", dir(kR, aR)],
      ];

      for (const [boneName, targetWorldDir] of aimPairs) {
        if (!targetWorldDir) continue;
        const bone = B[boneName];
        const restChild = restChildPos.current[boneName];
        const restW = restWorldQ.current[boneName];
        if (!bone || !restChild || !restW) continue;

        // Express target dir in bone's REST local space
        const targetLocal = targetWorldDir.clone().applyQuaternion(restW.clone().invert()).normalize();
        const deltaQ = new THREE.Quaternion().setFromUnitVectors(restChild, targetLocal);
        // bone.local = restLocal * deltaQ
        bone.quaternion.copy(restLocalQ.current[boneName]).multiply(deltaQ);
      }

      // Head aim
      if (nose && midShoulder && B.mixamorigNeck && restChildPos.current.mixamorigNeck && restWorldQ.current.mixamorigNeck) {
        const headDir = nose.clone().sub(midShoulder).normalize();
        const restW = restWorldQ.current.mixamorigNeck;
        const restChild = restChildPos.current.mixamorigNeck;
        const targetLocal = headDir.clone().applyQuaternion(restW.clone().invert()).normalize();
        const deltaQ = new THREE.Quaternion().setFromUnitVectors(restChild, targetLocal);
        B.mixamorigNeck.quaternion.copy(restLocalQ.current.mixamorigNeck).multiply(deltaQ);
      }

      scene.updateMatrixWorld(true);
    }
  }

  if (!scene) return null;
  return (
    <group position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
};
