/**
 * GlbSmplDriven — load Mixamo-rigged GLB and apply per-bone quaternions
 * from GVHMR SMPL motion JSON. Each bone gets the SMPL joint rotation directly
 * (assumes SMPL rest pose ≈ Mixamo T-pose; small offset corrections may be needed).
 *
 * Motion JSON shape:
 *   { fps, frame_count, frames: [{ transl:[x,y,z], root_quat:[x,y,z,w], bones:{name:[x,y,z,w]} }] }
 */

import { useCurrentFrame, useVideoConfig, delayRender, continueRender } from "remotion";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Frame = {
  transl: [number, number, number];
  root_quat: [number, number, number, number];
  bones: Record<string, [number, number, number, number]>;
};
type Motion = { fps: number; frame_count: number; frames: Frame[] };

export const GlbSmplDriven: React.FC<{
  url: string;
  motion: Motion;
  scale?: number;
  position?: [number, number, number];
  applyTransl?: boolean;
}> = ({ url, motion, scale = 1.0, position = [0, -1.0, 0], applyTransl = false }) => {
  const [scene, setScene] = useState<THREE.Group | null>(null);
  const [hipsBone, setHipsBone] = useState<THREE.Bone | null>(null);
  const [handle] = useState(() => delayRender(`Loading GLB ${url}`));
  const bones = useRef<Record<string, THREE.Bone>>({});
  const restLocalQ = useRef<Record<string, THREE.Quaternion>>({});
  const restHipsPos = useRef<THREE.Vector3>(new THREE.Vector3());

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      const s = gltf.scene;
      // Mixamo default faces -Z; rotate so character faces camera (+Z)
      s.rotation.y = Math.PI;
      const b: Record<string, THREE.Bone> = {};
      s.traverse((o: THREE.Object3D) => {
        if ((o as any).isBone) b[o.name] = o as THREE.Bone;
      });
      bones.current = b;
      Object.entries(b).forEach(([k, bone]) => {
        restLocalQ.current[k] = bone.quaternion.clone();
      });
      if (b.mixamorigHips) {
        restHipsPos.current.copy(b.mixamorigHips.position);
        setHipsBone(b.mixamorigHips);
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
    return Math.min(motion.frames.length - 1, Math.round(t * motion.fps));
  }, [frame, fps, motion]);

  if (scene) {
    const f = motion.frames[idx];
    if (f) {
      // Reset all bones to rest first
      Object.entries(bones.current).forEach(([k, bone]) => {
        if (restLocalQ.current[k]) bone.quaternion.copy(restLocalQ.current[k]);
      });

      // Apply per-bone quaternions (SMPL local rotation)
      // SMPL coord: x-right, y-up, z-forward.
      // Mixamo rest pose typically aligned similarly. Apply as local quat.
      // Since we already rotated character 180° around Y for camera-facing,
      // the SMPL rotations apply in character's local frame consistently.
      Object.entries(f.bones).forEach(([name, q]) => {
        const bone = bones.current[name];
        if (!bone) return;
        // SMPL rotation is the LOCAL rotation of the bone relative to its rest.
        // In Mixamo, bones already have rest local quaternions. We replace local with
        // restLocal * smplRot (smplRot is the deviation from rest).
        const smplQ = new THREE.Quaternion(q[0], q[1], q[2], q[3]);
        const restQ = restLocalQ.current[name];
        if (restQ) {
          bone.quaternion.copy(restQ).multiply(smplQ);
        } else {
          bone.quaternion.copy(smplQ);
        }
      });

      // Root rotation (global_orient)
      if (hipsBone) {
        const rq = f.root_quat;
        const rootQ = new THREE.Quaternion(rq[0], rq[1], rq[2], rq[3]);
        // Apply to scene root (so character orientation in world reflects subject orientation)
        // Compose with the 180° face-camera rotation
        const faceQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
        scene.quaternion.copy(faceQ).multiply(rootQ);

        if (applyTransl) {
          // SMPL transl is in meters; flip Y for Three coord (down→up)
          hipsBone.position.set(
            restHipsPos.current.x + f.transl[0],
            restHipsPos.current.y - f.transl[1],
            restHipsPos.current.z - f.transl[2],
          );
        }
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
