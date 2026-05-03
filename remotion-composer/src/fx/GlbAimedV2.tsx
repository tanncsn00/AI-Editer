/**
 * GlbAimedV2 — fixed-orientation aim-bone retarget.
 *
 * Key fixes vs V1:
 *  - Character starts WITHOUT 180° rotation (faces -Z = camera default).
 *    Camera placed at -Z to look at character's front.
 *  - Author joint positions in SMPL convention directly (subject's left = -X).
 *    Camera at -Z viewing +Z direction sees subject's left at viewport's right
 *    (mirror) — so AIM_RULES use natural mapping (no swap).
 *  - Includes per-bone restWorldQ caching done with rotation=0 (clean rest).
 */

import { useCurrentFrame, useVideoConfig, delayRender, continueRender } from "remotion";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type WL = { name: string; x: number; y: number; z: number };
type Frame = { world_landmarks: WL[] };
type Motion = { fps: number; frame_count: number; frames: Frame[] };

// SMPL-name aim chains. Mixamo's character LEFT == subject's LEFT (no mirror)
// because we don't apply scene rotation — character faces -Z natively, camera
// at -Z views the front, so character's left arm is on viewport's right
// (which is what a viewer naturally calls "his left, my right").
const AIM_RULES: Array<[string, string, string]> = [
  ["mixamorigLeftArm", "left_elbow", "left_shoulder"],
  ["mixamorigLeftForeArm", "left_wrist", "left_elbow"],
  ["mixamorigRightArm", "right_elbow", "right_shoulder"],
  ["mixamorigRightForeArm", "right_wrist", "right_elbow"],
  ["mixamorigLeftUpLeg", "left_knee", "left_hip"],
  ["mixamorigLeftLeg", "left_ankle", "left_knee"],
  ["mixamorigRightUpLeg", "right_knee", "right_hip"],
  ["mixamorigRightLeg", "right_ankle", "right_knee"],
  ["mixamorigSpine1", "spine2", "spine1"],
  ["mixamorigSpine2", "neck", "spine2"],
  ["mixamorigNeck", "head", "neck"],
];

const lookup = (frame: Frame, name: string): THREE.Vector3 | null => {
  const lm = frame.world_landmarks.find((l) => l.name === name);
  if (!lm) return null;
  return new THREE.Vector3(lm.x, lm.y, lm.z);
};

export const GlbAimedV2: React.FC<{
  url: string;
  motion: Motion;
  scale?: number;
  position?: [number, number, number];
}> = ({ url, motion, scale = 1.0, position = [0, -1.0, 0] }) => {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender(`GLB ${url}`));
  const bones = useRef<Record<string, THREE.Bone>>({});
  const restLocalQ = useRef<Record<string, THREE.Quaternion>>({});
  const restWorldQ = useRef<Record<string, THREE.Quaternion>>({});
  const restChildLocal = useRef<Record<string, THREE.Vector3>>({});

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      const s = gltf.scene;
      // No scene rotation. Camera will be placed in front of character.
      const b: Record<string, THREE.Bone> = {};
      s.traverse((o: THREE.Object3D) => { if ((o as any).isBone) b[o.name] = o as THREE.Bone; });
      bones.current = b;
      Object.entries(b).forEach(([k, bone]) => { restLocalQ.current[k] = bone.quaternion.clone(); });
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
      setScene(s);
      continueRender(handle);
    }, undefined, (err) => { console.error("GLB load error", err); continueRender(handle); });
  }, [url, handle]);

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = Math.min(motion.frames.length - 1, Math.round((frame / fps) * motion.fps));

  if (scene) {
    const f = motion.frames[idx];
    if (f) {
      Object.entries(bones.current).forEach(([k, bone]) => {
        if (restLocalQ.current[k]) bone.quaternion.copy(restLocalQ.current[k]);
      });
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
    <group position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
};
