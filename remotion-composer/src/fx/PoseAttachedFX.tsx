/**
 * PoseAttachedFX — generic R3F overlay attaching VFX (fire, lightning, glow, particles)
 * to body joints from a MediaPipe tracking.json.
 *
 * Usage in a Remotion composition:
 *
 *   import { ThreeCanvas } from "@remotion/three";
 *   import { PoseAttachedFX } from "./fx/PoseAttachedFX";
 *   import tracking from "../public/clip01/tracking.json";
 *
 *   <ThreeCanvas width={1080} height={1920}>
 *     <PoseAttachedFX tracking={tracking} attach={[
 *       { joint: "left_wrist", fx: "fire" },
 *       { joint: "right_wrist", fx: "fire" },
 *       { joint: "left_palm", fx: "lightning" },
 *     ]} />
 *   </ThreeCanvas>
 *
 * For the underlying source video, render a regular <OffthreadVideo> as a sibling
 * AbsoluteFill *behind* the ThreeCanvas, and ThreeCanvas with transparent bg.
 */

import { useCurrentFrame, useVideoConfig } from "remotion";
import { useMemo } from "react";
import * as THREE from "three";

type Landmark = { name: string; x: number; y: number; z: number; visibility?: number };
type Frame = { t: number; frame: number; landmarks: Landmark[] };
export type Tracking = {
  fps: number;
  width: number;
  height: number;
  frame_count: number;
  joint_names: string[];
  frames: Frame[];
};

export type FxKind = "fire" | "lightning" | "glow" | "spark";
export type AttachSpec = { joint: string; fx: FxKind; color?: string; size?: number };

export const useJointAtFrame = (
  tracking: Tracking,
  jointName: string,
): { x: number; y: number; z: number; visible: boolean } => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = Math.min(tracking.frames.length - 1, Math.round(t * tracking.fps));
  const f = tracking.frames[idx];
  const lm = f?.landmarks.find((l) => l.name === jointName);
  if (!lm) return { x: 0, y: 0, z: 0, visible: false };
  return { x: lm.x, y: lm.y, z: lm.z, visible: (lm.visibility ?? 1) > 0.4 };
};

/**
 * Convert MediaPipe normalized 2D coords (0..1, top-left origin) to R3F world coords.
 * Default plane: z=0, x in [-aspect, +aspect], y in [-1, +1].
 */
const toWorld = (x: number, y: number, aspect: number): [number, number, number] => {
  const wx = (x - 0.5) * 2 * aspect;
  const wy = -(y - 0.5) * 2;
  return [wx, wy, 0];
};

/* ─────────────── FX primitives (placeholder, swap with GLSL shaders later) ─────────────── */

const FireBlob: React.FC<{ pos: [number, number, number]; color?: string; size?: number }> = ({
  pos, color = "#FF8C2E", size = 0.18,
}) => {
  const frame = useCurrentFrame();
  const flicker = 1 + Math.sin(frame * 0.6) * 0.15 + Math.sin(frame * 0.31) * 0.1;
  return (
    <mesh position={pos}>
      <sphereGeometry args={[size * flicker, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} blending={THREE.AdditiveBlending} />
    </mesh>
  );
};

const LightningBolt: React.FC<{ pos: [number, number, number]; color?: string; size?: number }> = ({
  pos, color = "#9DD7FF", size = 0.25,
}) => {
  const frame = useCurrentFrame();
  const on = Math.sin(frame * 1.2) > 0.5;
  return (
    <mesh position={pos} visible={on}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
    </mesh>
  );
};

const Glow: React.FC<{ pos: [number, number, number]; color?: string; size?: number }> = ({
  pos, color = "#F4B860", size = 0.12,
}) => (
  <mesh position={pos}>
    <sphereGeometry args={[size, 12, 12]} />
    <meshBasicMaterial color={color} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
  </mesh>
);

const Spark: React.FC<{ pos: [number, number, number]; color?: string }> = ({
  pos, color = "#FFFFFF",
}) => {
  const frame = useCurrentFrame();
  const offsets = useMemo(
    () => Array.from({ length: 8 }, (_, i) => ({
      a: (i / 8) * Math.PI * 2,
      r: 0.05 + Math.random() * 0.08,
    })),
    [],
  );
  return (
    <group position={pos}>
      {offsets.map((o, i) => {
        const phase = (frame * 0.2 + i) % (Math.PI * 2);
        const r = o.r * (1 + Math.sin(phase) * 0.4);
        return (
          <mesh key={i} position={[Math.cos(o.a) * r, Math.sin(o.a) * r, 0]}>
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshBasicMaterial color={color} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
          </mesh>
        );
      })}
    </group>
  );
};

const FX_MAP: Record<FxKind, React.FC<{ pos: [number, number, number]; color?: string; size?: number }>> = {
  fire: FireBlob,
  lightning: LightningBolt,
  glow: Glow,
  spark: Spark,
};

/* ─────────────── Main component ─────────────── */

export const PoseAttachedFX: React.FC<{
  tracking: Tracking;
  attach: AttachSpec[];
}> = ({ tracking, attach }) => {
  const aspect = tracking.width / tracking.height;
  return (
    <>
      {attach.map((spec, i) => {
        const lm = useJointAtFrame(tracking, spec.joint);
        if (!lm.visible) return null;
        const pos = toWorld(lm.x, lm.y, aspect);
        const Comp = FX_MAP[spec.fx];
        return <Comp key={`${spec.joint}-${i}`} pos={pos} color={spec.color} size={spec.size} />;
      })}
    </>
  );
};
