/**
 * IsseiDanceCartoon — Issei-coded cartoon dancer rigged from his pose,
 * on a night-street stage, with Justin-style music underneath.
 */

import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { IsseiMascotFromPose } from "./fx/IsseiMascotFromPose";
import type { Tracking } from "./fx/PoseAttachedFX";
import tracking from "./issei_dance_tracking.json";

const T = tracking as Tracking;
const W = 1080;
const H = 1920;

const NightStreetBg: React.FC = () => {
  const frame = useCurrentFrame();
  const lampPulse = 0.85 + Math.sin(frame * 0.18) * 0.1;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="nightsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070912" />
          <stop offset="60%" stopColor="#11141F" />
          <stop offset="100%" stopColor="#1A1820" />
        </linearGradient>
        <radialGradient id="moonglow" cx="50%" cy="6%" r="22%">
          <stop offset="0%" stopColor="#FFE9B0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFE9B0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A1820" />
          <stop offset="100%" stopColor="#0A0A12" />
        </linearGradient>
      </defs>
      {/* Sky */}
      <rect width={W} height={H * 0.78} fill="url(#nightsky)" />
      {/* Street lamp glow above head */}
      <circle cx={W / 2} cy={H * 0.05} r={18} fill="#FFE9B0" opacity={lampPulse} />
      <ellipse cx={W / 2} cy={H * 0.10} rx={W * 0.45} ry={H * 0.35} fill="url(#moonglow)" opacity={lampPulse} />
      {/* Distant houses */}
      <g opacity={0.85}>
        <rect x={0} y={H * 0.66} width={W * 0.30} height={H * 0.18} fill="#0A0E18" />
        <polygon points={`0,${H * 0.66} ${W * 0.15},${H * 0.60} ${W * 0.30},${H * 0.66}`} fill="#080C16" />
        {/* Lit window */}
        <rect x={W * 0.02} y={H * 0.74} width={20} height={28} fill="#FFD075" opacity={0.85} />
        <rect x={W * 0.07} y={H * 0.78} width={20} height={28} fill="#FFD075" opacity={0.65} />
        <rect x={W * 0.70} y={H * 0.68} width={W * 0.30} height={H * 0.16} fill="#0A0E18" />
        <polygon points={`${W * 0.70},${H * 0.68} ${W * 0.85},${H * 0.62} ${W},${H * 0.68}`} fill="#080C16" />
        <rect x={W * 0.92} y={H * 0.76} width={20} height={28} fill="#FFD075" opacity={0.7} />
      </g>
      {/* Ground / sidewalk */}
      <rect y={H * 0.78} width={W} height={H * 0.22} fill="url(#ground)" />
      {/* Bollards (like the source) */}
      {[0.10, 0.30, 0.50, 0.70, 0.90].map((x, i) => (
        <g key={i}>
          <rect x={W * x - 8} y={H * 0.84} width={16} height={42} fill="#0A0612" stroke="#1A1A24" strokeWidth={2} />
          <rect x={W * x - 10} y={H * 0.84 - 4} width={20} height={6} fill="#1A1A24" />
        </g>
      ))}
      {/* Sidewalk seam line */}
      <line x1={0} y1={H * 0.92} x2={W} y2={H * 0.92}
        stroke="#1A1A24" strokeWidth={2} />
    </svg>
  );
};

export const IsseiDanceCartoon: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#070912" }}>
      <Audio src={staticFile("singer_mascot/audio.aac")} volume={0.92} />
      <NightStreetBg />
      <IsseiMascotFromPose tracking={T} />
    </AbsoluteFill>
  );
};
