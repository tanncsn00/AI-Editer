/**
 * BieberCoachellaRemake — 1:1 cartoon recreation of the Coachella Live segment.
 * Switches between 3 scene types per detected shot:
 *   - JUSTIN: pose-driven Bieber-coded cartoon, LED stage backdrop
 *   - CROWD: fan POV cartoon (looking up at stage from below, phones raised)
 *   - WIDE/MIXED: massive crowd silhouette + tiny Justin on far stage
 */

import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { JustinMascotFromPose } from "./fx/JustinMascotFromPose";
import type { Tracking } from "./fx/PoseAttachedFX";
import tracking from "./singer_mascot_tracking.json";
import shotsData from "../../projects/singer-mascot-poc/source/shots.json";

const T = tracking as Tracking;
const W = 1080;
const H = 1920;
const FPS = 30;

type Shot = { start: number; end: number; dur: number; pose_pct?: number; kind?: string };
const SHOTS = shotsData as Shot[];

/* ─────────────────── Stage scene (LED + lights) for JUSTIN shots ─────────────────── */

const StageBg: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + Math.sin(frame * 0.18) * 0.2;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="stagedark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E1120" />
          <stop offset="100%" stopColor="#04050A" />
        </linearGradient>
        <radialGradient id="spot1" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FFE066" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFE066" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ledcenter" cx="50%" cy="35%" r="40%">
          <stop offset="0%" stopColor="#D62E5C" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0E1120" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#stagedark)" />
      {/* LED video wall behind */}
      <rect x={W * 0.05} y={H * 0.02} width={W * 0.9} height={H * 0.65}
        fill="url(#ledcenter)" />
      {/* LED grid texture */}
      {[...Array(8)].map((_, row) =>
        [...Array(11)].map((_, col) => {
          const colors = ["#1B0010", "#3A0014", "#7A0930", "#A52F54", "#D94872", "#0E1120"];
          const c = colors[(row + col + Math.floor(frame / 8)) % colors.length];
          return (
            <rect key={`${row}-${col}`}
              x={W * 0.06 + col * (W * 0.078)}
              y={H * 0.04 + row * (H * 0.075)}
              width={W * 0.075} height={H * 0.07}
              fill={c} opacity={0.35 * pulse} />
          );
        })
      )}
      {/* Stage spot */}
      <ellipse cx={W / 2} cy={H * 0.55} rx={W * 0.55} ry={H * 0.35} fill="url(#spot1)" />
      {/* Coachella corner label */}
      <text x={W - 30} y={70} fontSize={24} fill="#E8E8F0" textAnchor="end"
        fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="2">
        COACHELLA
      </text>
      <text x={W - 30} y={96} fontSize={14} fill="#FF1A8C" textAnchor="end"
        fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} letterSpacing="4">
        LIVE
      </text>
      {/* Truss top */}
      <rect x={0} y={0} width={W} height={H * 0.02} fill="#0A0A14" />
      {/* Hanging lights */}
      {[0.15, 0.32, 0.48, 0.65, 0.82].map((x, i) => (
        <g key={i}>
          <line x1={W * x} y1={H * 0.02} x2={W * x} y2={H * 0.07} stroke="#1A1A28" strokeWidth={3} />
          <circle cx={W * x} cy={H * 0.075} r={8}
            fill={["#FFE066", "#FF1A8C", "#1AFFE0", "#FFD400", "#FFE066"][i]}
            opacity={0.85 + Math.sin(frame * 0.25 + i) * 0.15} />
        </g>
      ))}
    </svg>
  );
};

/* ─────────────────── Crowd POV scene (looking up at stage) ─────────────────── */

const CrowdLookupScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="skylookup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B0825" />
          <stop offset="60%" stopColor="#3A0A40" />
          <stop offset="100%" stopColor="#0A0612" />
        </linearGradient>
        <radialGradient id="stagespot" cx="50%" cy="22%" r="45%">
          <stop offset="0%" stopColor="#FFE066" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFE066" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#skylookup)" />
      <ellipse cx={W / 2} cy={H * 0.18} rx={W * 0.6} ry={H * 0.25} fill="url(#stagespot)" />
      {/* Far stage strip */}
      <rect x={W * 0.18} y={H * 0.30} width={W * 0.64} height={H * 0.05} fill="#1A0A20" />
      {/* Tiny singer silhouette */}
      <g transform={`translate(${W / 2}, ${H * 0.27})`}>
        <ellipse cx={0} cy={-12} rx={8} ry={10} fill="#FFE066" opacity={0.8} />
        <rect x={-7} y={-3} width={14} height={24} rx={3} fill="#D94872" />
      </g>
      {/* Crowd silhouettes (from below — many heads + raised hands + phones) */}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = (i % 6) * (W / 6) + Math.random() * 40;
        const y = H * 0.55 + Math.floor(i / 6) * 80;
        const sway = Math.sin((frame + i * 7) * 0.1) * 4;
        const handY = y - 80 - Math.sin((frame + i * 11) * 0.15) * 12;
        return (
          <g key={i}>
            {/* Head */}
            <circle cx={x + sway} cy={y + 10} r={28} fill="#0A0612" />
            {/* Body */}
            <path d={`M ${x + sway - 28} ${y + 35} L ${x + sway - 38} ${y + 200} L ${x + sway + 38} ${y + 200} L ${x + sway + 28} ${y + 35} Z`} fill="#0A0612" />
            {/* Raised arm */}
            <line x1={x + sway} y1={y + 28} x2={x + sway + 8} y2={handY} stroke="#0A0612" strokeWidth={16} strokeLinecap="round" />
            {/* Phone */}
            <rect x={x + sway + 2} y={handY - 30} width={20} height={32} rx={3} fill="#1A1A2A" stroke="#FFE066" strokeWidth={2} />
            <rect x={x + sway + 4} y={handY - 28} width={16} height={22} fill="#FFE066" opacity={0.7} />
          </g>
        );
      })}
    </svg>
  );
};

/* ─────────────────── Wide/mixed scene (huge stage + sea of crowd) ─────────────────── */

const WideStageScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="widebg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A0830" />
          <stop offset="50%" stopColor="#3D0E50" />
          <stop offset="100%" stopColor="#06030C" />
        </linearGradient>
        <radialGradient id="widespot" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFE066" stopOpacity="0.40" />
          <stop offset="100%" stopColor="#FFE066" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H * 0.7} fill="url(#widebg)" />
      <rect y={H * 0.65} width={W} height={H * 0.4} fill="#03020A" />
      <ellipse cx={W / 2} cy={H * 0.30} rx={W * 0.5} ry={H * 0.20} fill="url(#widespot)" />
      {/* Distant stage truss */}
      <rect x={W * 0.20} y={H * 0.18} width={W * 0.60} height={H * 0.04} fill="#1A1A28" />
      <rect x={W * 0.22} y={H * 0.45} width={W * 0.56} height={H * 0.06} fill="#1A0A26" />
      {/* Hanging stage lights */}
      {[0.27, 0.4, 0.5, 0.6, 0.73].map((x, i) => (
        <circle key={i} cx={W * x} cy={H * 0.21} r={5}
          fill={["#FFE066", "#FF1A8C", "#1AFFE0", "#FFD400", "#FFE066"][i]}
          opacity={0.85} />
      ))}
      {/* Tiny singer on stage */}
      <g transform={`translate(${W / 2}, ${H * 0.45})`}>
        <ellipse cx={0} cy={-22} rx={9} ry={11} fill="#F5C9A8" />
        <ellipse cx={0} cy={-26} rx={9} ry={3} fill="#3A2A1E" />
        <rect x={-10} y={-12} width={20} height={36} rx={5} fill="#D94872" />
        <line x1={-9} y1={5} x2={-18} y2={28} stroke="#D94872" strokeWidth={6} strokeLinecap="round" />
        <line x1={9} y1={5} x2={18 + Math.sin(frame * 0.3) * 4} y2={28} stroke="#D94872" strokeWidth={6} strokeLinecap="round" />
        {/* Mic */}
        <circle cx={20} cy={28} r={4} fill="#0A0A12" />
      </g>
      {/* Sea of crowd silhouettes */}
      {Array.from({ length: 60 }).map((_, i) => {
        const row = Math.floor(i / 10);
        const col = i % 10;
        const x = col * (W / 10) + (row % 2) * (W / 20);
        const y = H * 0.62 + row * 50;
        const sway = Math.sin((frame + i * 5) * 0.1) * 2;
        const headSize = 12 + (5 - row) * 2;
        return (
          <g key={i}>
            <circle cx={x + sway} cy={y} r={headSize} fill="#01010A" opacity={0.95 - row * 0.05} />
            {/* Sparse phones */}
            {i % 7 === 0 && (
              <rect x={x + sway - 3} y={y - 60} width={6} height={10} fill="#FFE066" opacity={0.8} />
            )}
          </g>
        );
      })}
    </svg>
  );
};

/* ─────────────────── Main composition (global-frame aware, no Sequence reset) ─────────────────── */

export const BieberCoachellaRemake: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // Find current shot
  const current = SHOTS.find((s) => t >= s.start && t < s.end) ?? SHOTS[SHOTS.length - 1];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("singer_mascot/audio.aac")} volume={0.92} />
      {current.kind === "JUSTIN" && (
        <AbsoluteFill style={{ background: "#04050A" }}>
          <StageBg />
          <JustinMascotFromPose tracking={T} />
        </AbsoluteFill>
      )}
      {current.kind === "CROWD" && (
        <AbsoluteFill style={{ background: "#0A0612" }}>
          <CrowdLookupScene />
        </AbsoluteFill>
      )}
      {current.kind === "MIXED" && (
        <AbsoluteFill style={{ background: "#04050A" }}>
          <WideStageScene />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
