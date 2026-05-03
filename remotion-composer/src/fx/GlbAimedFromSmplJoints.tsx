/**
 * GlbAimedFromSmplJoints — proper retargeting using aim-bone with SMPL joint
 * positions. Each Mixamo bone is rotated so its child direction aligns with
 * the corresponding SMPL bone direction in world space, accounting for the
 * bone's rest-world quaternion (so the offset between SMPL and Mixamo rest
 * poses is automatically baked in via the rest world quaternion).
 *
 * SMPL joints (24) are world-space 3D meters from the SMPL forward pass.
 * SMPL→Three coord: x=right (same), y=up (same), z=forward (same). No flip needed.
 */

import { useCurrentFrame, useVideoConfig, delayRender, continueRender } from "remotion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type WL = { name: string; x: number; y: number; z: number };
type Frame = { world_landmarks: WL[]; landmarks?: any[] };
type Joints = { fps: number; frame_count: number; frames: Frame[] };

// Pairs: (parent_bone_to_rotate, child_smpl_joint_for_aim_target, parent_smpl_joint_for_origin)
// We aim parent_bone such that its child direction (in world) matches
// (target_smpl_pos - parent_smpl_pos).normalized.
const AIM_RULES: Array<[string, string, string]> = [
  // Arms — character LEFT == subject left (we apply 180° face-camera, so SMPL left maps to character right)
  // Actually with 180° rotation, SMPL coord stays in world but character bones are flipped.
  // After much testing: the simplest is to map SMPL.left → mixamorig.Right and vice versa.
  ["mixamorigRightArm", "left_elbow", "left_shoulder"],
  ["mixamorigRightForeArm", "left_wrist", "left_elbow"],
  ["mixamorigLeftArm", "right_elbow", "right_shoulder"],
  ["mixamorigLeftForeArm", "right_wrist", "right_elbow"],
  // Legs
  ["mixamorigRightUpLeg", "left_knee", "left_hip"],
  ["mixamorigRightLeg", "left_ankle", "left_knee"],
  ["mixamorigLeftUpLeg", "right_knee", "right_hip"],
  ["mixamorigLeftLeg", "right_ankle", "right_knee"],
  // Spine + neck
  ["mixamorigSpine1", "spine2", "spine1"],
  ["mixamorigSpine2", "neck", "spine2"],
  ["mixamorigNeck", "head", "neck"],
];

const lookup = (frame: Frame, name: string): THREE.Vector3 | null => {
  const lm = frame.world_landmarks.find((l) => l.name === name);
  if (!lm) return null;
  return new THREE.Vector3(lm.x, lm.y, lm.z);
};

export const GlbAimedFromSmplJoints: React.FC<{
  url: string;
  joints: Joints;
  scale?: number;
  position?: [number, number, number];
}> = ({ url, joints, scale = 1.0, position = [0, -1.0, 0] }) => {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [handle] = useState(() => delayRender(`Loading GLB ${url}`));
  const bones = useRef<Record<string, THREE.Bone>>({});
  const restLocalQ = useRef<Record<string, THREE.Quaternion>>({});
  const restWorldQ = useRef<Record<string, THREE.Quaternion>>({});
  const restChildLocal = useRef<Record<string, THREE.Vector3>>({});

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      const s = gltf.scene;
      // Mixamo default faces -Z, rotate 180° to face camera
      s.rotation.y = Math.PI;
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

      // For each rule: cache the rest direction of the rotation bone toward its
      // aim child (the child Mixamo bone that lies on the same chain). We pick
      // the first child of the parent bone in Three hierarchy (typically there
      // is a single relevant child for limbs).
      for (const [parentName] of AIM_RULES) {
        const parent = b[parentName];
        if (!parent) continue;
        const childBone = parent.children.find((c) => (c as any).isBone) as THREE.Bone | undefined;
        if (childBone) {
          restChildLocal.current[parentName] = childBone.position.clone().normalize();
        }
      }

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
    return Math.min(joints.frames.length - 1, Math.round(t * joints.fps));
  }, [frame, fps, joints]);

  if (scene) {
    const f = joints.frames[idx];
    if (f) {
      // Reset to rest
      Object.entries(bones.current).forEach(([k, bone]) => {
        if (restLocalQ.current[k]) bone.quaternion.copy(restLocalQ.current[k]);
      });

      // Apply each aim rule (in hierarchical order — spine/legs/arms can be
      // independent so just process linearly).
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

        // Express target in this bone's REST world frame
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
