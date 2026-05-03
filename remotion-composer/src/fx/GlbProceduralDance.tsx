/**
 * GlbProceduralDance — Mixamo character driven by hand-authored keyframe poses.
 * Each pose: { boneName: [eulerX_deg, eulerY_deg, eulerZ_deg] } — local rotation
 * deltas relative to rest pose. Per render frame, slerp between adjacent poses.
 *
 * Rotation convention (Mixamo bone local frame, character facing -Z by default):
 *   For arms: bone Y-axis runs along the bone (shoulder→elbow→wrist)
 *     - Z rotation: swings arm up/down in front plane
 *     - X rotation: swings arm forward/back
 *     - Y rotation: twist along bone
 *   For legs: similar, bone Y runs hip→knee→ankle
 *   For spine: Y up, rotate around X = lean fwd/back, Z = side bend, Y = twist
 */

import { useCurrentFrame, useVideoConfig, delayRender, continueRender } from "remotion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Pose = Record<string, [number, number, number]>; // bone → euler degrees [x,y,z]
type Keyframe = { frame: number; pose: Pose };

const D = Math.PI / 180;

const eulerToQuat = (xDeg: number, yDeg: number, zDeg: number): THREE.Quaternion => {
  const e = new THREE.Euler(xDeg * D, yDeg * D, zDeg * D, "XYZ");
  return new THREE.Quaternion().setFromEuler(e);
};

export const GlbProceduralDance: React.FC<{
  url: string;
  keyframes: Keyframe[];
  scale?: number;
  position?: [number, number, number];
  faceCamera?: boolean;
}> = ({ url, keyframes, scale = 1.0, position = [0, -1.0, 0], faceCamera = true }) => {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender(`GLB ${url}`));
  const bones = useRef<Record<string, THREE.Bone>>({});
  const restLocalQ = useRef<Record<string, THREE.Quaternion>>({});

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      const s = gltf.scene;
      if (faceCamera) s.rotation.y = Math.PI;
      const b: Record<string, THREE.Bone> = {};
      s.traverse((o: THREE.Object3D) => { if ((o as any).isBone) b[o.name] = o as THREE.Bone; });
      bones.current = b;
      Object.entries(b).forEach(([k, bone]) => { restLocalQ.current[k] = bone.quaternion.clone(); });
      setScene(s);
      continueRender(handle);
    }, undefined, (err) => { console.error("GLB load error", err); continueRender(handle); });
  }, [url, handle, faceCamera]);

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (scene && keyframes.length > 0) {
    // Find surrounding keyframes
    let kA = keyframes[0], kB = keyframes[0];
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (frame >= keyframes[i].frame && frame <= keyframes[i + 1].frame) {
        kA = keyframes[i];
        kB = keyframes[i + 1];
        break;
      }
    }
    if (frame >= keyframes[keyframes.length - 1].frame) {
      kA = kB = keyframes[keyframes.length - 1];
    }
    const span = Math.max(1, kB.frame - kA.frame);
    let t = (frame - kA.frame) / span;
    // Ease in-out for smoother motion
    t = 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, t)));

    // Reset all driven bones to rest, then apply slerped delta
    const allBoneNames = new Set<string>([...Object.keys(kA.pose), ...Object.keys(kB.pose)]);
    Object.entries(bones.current).forEach(([k, bone]) => {
      if (restLocalQ.current[k]) bone.quaternion.copy(restLocalQ.current[k]);
    });
    allBoneNames.forEach((name) => {
      const bone = bones.current[name];
      const restL = restLocalQ.current[name];
      if (!bone || !restL) return;
      const aE = kA.pose[name] || [0, 0, 0];
      const bE = kB.pose[name] || [0, 0, 0];
      const qA = eulerToQuat(aE[0], aE[1], aE[2]);
      const qB = eulerToQuat(bE[0], bE[1], bE[2]);
      const qDelta = qA.clone().slerp(qB, t);
      bone.quaternion.copy(restL).multiply(qDelta);
    });

    scene.updateMatrixWorld(true);
  }

  if (!scene) return null;
  return (
    <group position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
};
