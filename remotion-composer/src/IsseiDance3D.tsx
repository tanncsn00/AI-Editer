/**
 * IsseiDance3D — 3D rigged Mixamo character driven by Issei pose tracking,
 * via @remotion/three. Renders on night-street background with Justin audio.
 */

import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { GlbPosedFromTracking } from "./fx/GlbPosedFromTracking";
import type { Tracking } from "./fx/PoseAttachedFX";
import tracking from "./issei_dance_tracking.json";

const T = tracking as Tracking;
const W = 1080;
const H = 1920;

const NightBg: React.FC = () => {
  const frame = useCurrentFrame();
  const lampPulse = 0.85 + Math.sin(frame * 0.18) * 0.1;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="nightsky3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070912" />
          <stop offset="60%" stopColor="#11141F" />
          <stop offset="100%" stopColor="#1A1820" />
        </linearGradient>
        <radialGradient id="moonglow3" cx="50%" cy="6%" r="22%">
          <stop offset="0%" stopColor="#FFE9B0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFE9B0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H * 0.78} fill="url(#nightsky3)" />
      <circle cx={W / 2} cy={H * 0.05} r={18} fill="#FFE9B0" opacity={lampPulse} />
      <ellipse cx={W / 2} cy={H * 0.10} rx={W * 0.45} ry={H * 0.35} fill="url(#moonglow3)" opacity={lampPulse} />
      <rect y={H * 0.78} width={W} height={H * 0.22} fill="#0A0A12" />
      {[0.10, 0.30, 0.50, 0.70, 0.90].map((x, i) => (
        <rect key={i} x={W * x - 8} y={H * 0.84} width={16} height={42} fill="#0A0612" stroke="#1A1A24" strokeWidth={2} />
      ))}
    </svg>
  );
};

export const IsseiDance3D: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#070912" }}>
      <Audio src={staticFile("singer_mascot/audio.aac")} volume={0.92} />
      <NightBg />
      <ThreeCanvas width={W} height={H}
        camera={{ position: [0, 1.0, 3.0], fov: 42 }}
        gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 4]} intensity={1.5} />
        <directionalLight position={[-3, 3, 2]} intensity={0.5} color="#FFD9A0" />
        <GlbPosedFromTracking
          url={staticFile("Dying.glb")}
          tracking={T}
          scale={1.2}
          position={[0, -1.0, 0]}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
