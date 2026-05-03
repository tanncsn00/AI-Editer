/**
 * DanceVfxPoc — full-body solo dance pose-driven cartoon.
 * Source: Pexels id=6940477 (10s vertical), 100% pose detection.
 * Two layouts side by side could be added later; this renders the cartoon alone on stage.
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CartoonMascotFromPose } from "./fx/CartoonMascotFromPose";
import type { Tracking } from "./fx/PoseAttachedFX";
import tracking from "./dance_vfx_tracking.json";

const T = tracking as Tracking;
const W = 1080;
const H = 1920;

const DiscoBg: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = (Math.sin(frame * 0.05) + 1) * 0.5;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A0830" />
          <stop offset="55%" stopColor="#5A1A60" />
          <stop offset="100%" stopColor="#0A0612" />
        </linearGradient>
        <radialGradient id="spotA" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#FFE066" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFE066" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="spotB" cx="50%" cy="60%" r="40%">
          <stop offset="0%" stopColor="#FF1A8C" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FF1A8C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A0612" stopOpacity="0" />
          <stop offset="100%" stopColor="#FFD400" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#bg)" />
      <ellipse cx={W * 0.5 + (sweep - 0.5) * 350} cy={H * 0.32} rx={W * 0.55} ry={H * 0.28} fill="url(#spotA)" />
      <ellipse cx={W * 0.5} cy={H * 0.72} rx={W * 0.55} ry={H * 0.20} fill="url(#spotB)" />
      <rect y={H * 0.7} width={W} height={H * 0.4} fill="url(#floor)" />
      {/* Stage strip */}
      <line x1={0} y1={H * 0.92} x2={W} y2={H * 0.92}
        stroke="#FFE066" strokeWidth={3} opacity={0.55} />
      {/* Neon side strips */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={W * 0.02 + i * 18} y={H * 0.10} width={6} height={H * 0.75}
          fill={["#FF1A8C", "#1AFFE0", "#FFD400"][i]} opacity={0.35 + Math.sin(frame * 0.2 + i) * 0.15} rx={3} />
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={`r${i}`} x={W * 0.96 - i * 18} y={H * 0.10} width={6} height={H * 0.75}
          fill={["#FFD400", "#1AFFE0", "#FF1A8C"][i]} opacity={0.35 + Math.sin(frame * 0.2 + i + 1.2) * 0.15} rx={3} />
      ))}
      {/* Disco label */}
      <text x={W / 2} y={H * 0.07} textAnchor="middle"
        fontSize="78" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight="800"
        fill="#FFD400" stroke="#FF1A8C" strokeWidth="3" letterSpacing="6">
        DANCE FLOOR
      </text>
    </svg>
  );
};

export const DanceVfxPoc: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0A0612" }}>
      <DiscoBg />
      <CartoonMascotFromPose
        tracking={T}
        style={{
          face: "sigma",
          shirtColor: "#7B3FE4",
          pantsColor: "#1A1A28",
          skinColor: "#F2C8A0",
          hairColor: "#0A0A0F",
          headSize: 1.5,
        }}
      />
    </AbsoluteFill>
  );
};
