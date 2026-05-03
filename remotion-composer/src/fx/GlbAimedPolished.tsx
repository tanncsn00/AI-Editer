/**
 * GlbAimedPolished — like GlbAimedFromSmplJoints but consumes the polished
 * SMPL output (smoothed + foot-locked) and additionally applies:
 *   - per-frame global root quaternion (so character orientation matches subject)
 *   - per-frame translation (so character moves around the stage)
 *
 * SMPL/Three coord: x=right, y=up, z=forward — same convention.
 */

import { useCurrentFrame, useVideoConfig, delayRender, continueRender } from "remotion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type WL = { name: string; x: number; y: number; z: number };
type Frame = {
  world_landmarks: WL[];
  root_quat: [number, number, number, number];
  transl: [number, number, number];
};
type Polished = { fps: number; frame_count: number; frames: Frame[] };

const AIM_RULES: Array<[string, string, string]> = [
  // Mirror SMPL left/right because we rotate character 180° (face camera)
  ["mixamorigRightArm", "left_elbow", "left_shoulder"],
  ["mixamorigRightForeArm", "left_wrist", "left_elbow"],
  ["mixamorigLeftArm", "right_elbow", "right_shoulder"],
  ["mixamorigLeftForeArm", "right_wrist", "right_elbow"],
  ["mixamorigRightUpLeg", "left_knee", "left_hip"],
  ["mixamorigRightLeg", "left_ankle", "left_knee"],
  ["mixamorigLeftUpLeg", "right_knee", "right_hip"],
  ["mixamorigLeftLeg", "right_ankle", "right_knee"],
  ["mixamorigSpine1", "spine2", "spine1"],
  ["mixamorigSpine2", "neck", "spine2"],
  ["mixamorigNeck", "head", "neck"],
];

const lookup = (frame: Frame, name: string): THREE.Vector3 | null => {
  const lm = frame.world_landmarks.find((l) => l.name === name);
  if (!lm) return null;
  return new THREE.Vector3(lm.x, lm.y, lm.z);
};

export const GlbAimedPolished: React.FC<{
  url: string;
  motion: Polished;
  scale?: number;
  position?: [number, number, number];
  applyRootRotation?: boolean;
  applyTransl?: boolean;
}> = ({
  url, motion, scale = 1.0, position = [0, -1.0, 0],
  applyRootRotation = true, applyTransl = true,
}) => {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender(`Loading GLB ${url}`));
  const bones = useRef<Record<string, THREE.Bone>>({});
  const restLocalQ = useRef<Record<string, THREE.Quaternion>>({});
  const restWorldQ = useRef<Record<string, THREE.Quaternion>>({});
  const restChildLocal = useRef<Record<string, THREE.Vector3>>({});
  const restHipsPos = useRef<THREE.Vector3>(new THREE.Vector3());

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      const s = gltf.scene;
      // Reset rotation; we'll set it per frame based on global_orient
      s.rotation.y = 0;
      const b: Record<string, THREE.Bone> = {};
      s.traverse((o: THREE.Object3D) => {
        if ((o as any).isBone) b[o.name] = o as THREE.Bone;
      });
      bones.current = b;
      Object.entries(b).forEach(([k, bone]) => {
        restLocalQ.current[k] = bone.quaternion.clone();
      });
      s.updateMatrixWorld(true);
      Object.entries(b).forEach(([k, bone]) => {
        const wq = new THREE.Quaternion();
        bone.getWorldQuaternion(wq);
        restWorldQ.current[k] = wq;
      });
      for (const [parentName] of AIM_RULES) {
        const parent = b[parentName];
        if (!parent) continue;
        const childBone = parent.children.find((c) => (c as any).isBone) as THREE.Bone | undefined;
        if (childBone) restChildLocal.current[parentName] = childBone.position.clone().normalize();
      }
      if (b.mixamorigHips) restHipsPos.current.copy(b.mixamorigHips.position);
      setScene(s);
      continueRender(handle);
    }, undefined, (err) => {
      console.error("GLB load error", err);
      continueRender(handle);
    });
  }, [url, handle]);

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = useMemo(() => {
    const t = frame / fps;
    return Math.min(motion.frames.length - 1, Math.round(t * motion.fps));
  }, [frame, fps, motion]);

  if (scene) {
    const f = motion.frames[idx];
    if (f) {
      // Reset bones to rest
      Object.entries(bones.current).forEach(([k, bone]) => {
        if (restLocalQ.current[k]) bone.quaternion.copy(restLocalQ.current[k]);
      });

      // Apply root rotation (subject orientation in world).
      // SMPL root_quat is the global_orient axis-angle → quat (xyzw).
      // Compose with face-camera 180° so character faces +Z by default.
      if (applyRootRotation) {
        const rq = f.root_quat;
        const rootQ = new THREE.Quaternion(rq[0], rq[1], rq[2], rq[3]);
        const faceQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
        scene.quaternion.copy(faceQ).multiply(rootQ);
      } else {
        scene.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
      }

      // Apply translation to scene position (relative to base position prop)
      if (applyTransl) {
        // SMPL transl: x=right, y=up, z=forward. After 180° face rotation,
        // the world position is: faceQ.applyVec(transl) — so x flips, z flips.
        // But since the polished JSON already accounts for centering at frame 0,
        // and we want the character to move on stage, apply directly.
        const t = f.transl;
        scene.position.set(position[0] - t[0], position[1] + t[1], position[2] - t[2]);
      } else {
        scene.position.set(position[0], position[1], position[2]);
      }

      // Aim limbs
      for (const [parentName, childSmpl, parentSmpl] of AIM_RULES) {
        const bone = bones.current[parentName];
        const restChild = restChildLocal.current[parentName];
        const restW = restWorldQ.current[parentName];
        const restL = restLocalQ.current[parentName];
        if (!bone || !restChild || !restW || !restL) continue;
        const a = lookup(f, parentSmpl);
        const b = lookup(f, childSmpl);
        if (!a || !b) continue;
        const targetWorldDir = b.clone().sub(a).normalize();
        const restWInv = restW.clone().invert();
        const targetLocal = targetWorldDir.clone().applyQuaternion(restWInv).normalize();
        const deltaQ = new THREE.Quaternion().setFromUnitVectors(restChild, targetLocal);
        bone.quaternion.copy(restL).multiply(deltaQ);
      }

      scene.updateMatrixWorld(true);
    }
  }

  if (!scene) return null;
  return (
    <group scale={scale}>
      <primitive object={scene} />
    </group>
  );
};
