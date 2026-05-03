import { AbsoluteFill, Audio, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CartoonMascotFromPose } from "./fx/CartoonMascotFromPose";
import type { Tracking } from "./fx/PoseAttachedFX";
import tracking from "./singer_mascot_tracking.json";

const T = tracking as Tracking;

const W = 1080;
const H = 1920;

// Trim to first 30s for POC
const POC_DURATION = 30;

const CoachellaBg: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = (Math.sin(frame * 0.04) + 1) * 0.5;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A0830" />
          <stop offset="50%" stopColor="#5A1A60" />
          <stop offset="100%" stopColor="#A03A6E" />
        </linearGradient>
        <radialGradient id="spot" cx="50%" cy="40%" r="40%">
          <stop offset="0%" stopColor="#FFE066" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFE066" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A0612" stopOpacity="0" />
          <stop offset="100%" stopColor="#0A0612" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width={W} height={H * 0.7} fill="url(#sky)" />
      <rect y={H * 0.65} width={W} height={H * 0.4} fill="#0A0612" />
      {/* Sweeping spotlight */}
      <ellipse cx={W / 2 + (sweep - 0.5) * 400} cy={H * 0.35} rx={500} ry={420} fill="url(#spot)" opacity={0.9} />
      {/* Stage strip */}
      <rect y={H * 0.55} width={W} height={H * 0.05} fill="#3A1A50" stroke="#FFE066" strokeWidth={3} />
      {/* Distant stage truss frame */}
      <line x1={W * 0.18} y1={H * 0.18} x2={W * 0.18} y2={H * 0.55} stroke="#1A1A28" strokeWidth={8} />
      <line x1={W * 0.82} y1={H * 0.18} x2={W * 0.82} y2={H * 0.55} stroke="#1A1A28" strokeWidth={8} />
      <line x1={W * 0.18} y1={H * 0.18} x2={W * 0.82} y2={H * 0.18} stroke="#1A1A28" strokeWidth={8} />
      {/* Truss lights */}
      {[0.25, 0.4, 0.55, 0.7].map((x, i) => (
        <circle key={i} cx={W * x} cy={H * 0.20} r={6}
          fill={["#FFE066", "#FF1A8C", "#1AFFE0", "#FFD400"][i]}
          opacity={0.9 + Math.sin(frame * 0.3 + i) * 0.1} />
      ))}
      {/* Distant singer silhouette (no specific likeness) */}
      <g transform={`translate(${W / 2}, ${H * 0.42})`}>
        <ellipse cx={0} cy={-25} rx={14} ry={18} fill="#0A0612" />
        <rect x={-13} y={-7} width={26} height={50} rx={8} fill="#0A0612" />
        <line x1={-12} y1={5} x2={-22} y2={28} stroke="#0A0612" strokeWidth={6} strokeLinecap="round" />
        <line x1={12} y1={5} x2={22 + Math.sin(frame * 0.2) * 4} y2={28} stroke="#0A0612" strokeWidth={6} strokeLinecap="round" />
        {/* Mic */}
        <circle cx={22} cy={28} r={4} fill="#FFE066" />
      </g>
      {/* Palm tree silhouettes */}
      <g transform={`translate(60, ${H * 0.55})`}>
        <line x1={0} y1={0} x2={0} y2={-180} stroke="#0A0612" strokeWidth={10} />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i - 2) * 0.4;
          return <path key={i} d={`M 0 -180 Q ${Math.sin(a) * 50} ${-200 + Math.cos(a) * 10} ${Math.sin(a) * 100} ${-185 + Math.cos(a) * 30}`} stroke="#0A0612" strokeWidth={6} fill="none" strokeLinecap="round" />;
        })}
      </g>
      <g transform={`translate(${W - 60}, ${H * 0.55})`}>
        <line x1={0} y1={0} x2={0} y2={-220} stroke="#0A0612" strokeWidth={10} />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = (i - 2) * 0.4;
          return <path key={i} d={`M 0 -220 Q ${Math.sin(a) * 50} ${-240 + Math.cos(a) * 10} ${Math.sin(a) * 100} ${-225 + Math.cos(a) * 30}`} stroke="#0A0612" strokeWidth={6} fill="none" strokeLinecap="round" />;
        })}
      </g>
      {/* Ground darkness fade */}
      <rect width={W} height={H} fill="url(#floor)" opacity={0.4} />
    </svg>
  );
};

/** Simple background fan silhouette: arms raised, head, swaying. NOT pose-driven. */
const BgFan: React.FC<{ x: number; y: number; scale: number; phase: number; color?: string }> = ({
  x, y, scale, phase, color = "#0A0612",
}) => {
  const frame = useCurrentFrame();
  const sway = Math.sin((frame + phase) * 0.12) * 8;
  const armRaise = Math.sin((frame + phase) * 0.18) * 0.3;
  return (
    <g transform={`translate(${x + sway}, ${y}) scale(${scale})`}>
      {/* Head */}
      <circle cx={0} cy={-90} r={25} fill={color} />
      {/* Body */}
      <path d="M -22 -65 L -28 50 L 28 50 L 22 -65 Z" fill={color} />
      {/* Arms raised — 'vẫy tay' */}
      <line x1={-22} y1={-60} x2={-50 + armRaise * 10} y2={-180 + armRaise * 20} stroke={color} strokeWidth={14} strokeLinecap="round" />
      <line x1={22} y1={-60} x2={50 - armRaise * 10} y2={-170 - armRaise * 20} stroke={color} strokeWidth={14} strokeLinecap="round" />
      {/* Phone in one hand (Coachella crowd vibe) */}
      <rect x={-58 + armRaise * 10} y={-205 + armRaise * 20} width={20} height={32} rx={3} fill="#1A1A28" stroke="#FFE066" strokeWidth={2} />
      {/* Phone screen glow */}
      <rect x={-55 + armRaise * 10} y={-202 + armRaise * 20} width={14} height={20} fill="#FFE066" opacity={0.7} />
    </g>
  );
};

const Crowd: React.FC = () => {
  // Multi-layer crowd: 8 fans across 3 depth layers (back small dark, mid medium, front darker)
  const back = [
    { x: 80, y: H * 0.7, scale: 0.55, phase: 0 },
    { x: 250, y: H * 0.7, scale: 0.55, phase: 12 },
    { x: 420, y: H * 0.7, scale: 0.55, phase: 23 },
    { x: 620, y: H * 0.7, scale: 0.55, phase: 8 },
    { x: 820, y: H * 0.7, scale: 0.55, phase: 19 },
    { x: 970, y: H * 0.7, scale: 0.55, phase: 30 },
  ];
  const mid = [
    { x: 160, y: H * 0.82, scale: 0.85, phase: 5, color: "#100712" },
    { x: 460, y: H * 0.82, scale: 0.85, phase: 18, color: "#100712" },
    { x: 720, y: H * 0.82, scale: 0.85, phase: 11, color: "#100712" },
    { x: 920, y: H * 0.82, scale: 0.85, phase: 27, color: "#100712" },
  ];
  const front = [
    { x: 220, y: H * 0.95, scale: 1.1, phase: 9, color: "#050208" },
    { x: 850, y: H * 0.95, scale: 1.1, phase: 21, color: "#050208" },
  ];
  return (
    <g>
      {back.map((p, i) => <BgFan key={`b${i}`} {...p} color="#1A0E20" />)}
      {mid.map((p, i) => <BgFan key={`m${i}`} {...p} />)}
      {front.map((p, i) => <BgFan key={`f${i}`} {...p} />)}
    </g>
  );
};

export const CoachellaCrowdPoc: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0A0612" }}>
      {/* Audio (original concert audio for private POC; replace with copyright-safe music for public release) */}
      <Audio src={staticFile("singer_mascot/audio.aac")} volume={0.85} />

      <CoachellaBg />

      {/* Crowd silhouettes */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <Crowd />
      </svg>

      {/* HERO FAN — pose-driven cartoon, foreground center-right */}
      <div style={{ position: "absolute", inset: 0, transform: "scale(0.85) translate(-5%, 18%)", transformOrigin: "center" }}>
        <CartoonMascotFromPose
          tracking={T}
          style={{
            face: "sigma",
            shirtColor: "#FFFFFF",
            pantsColor: "#0F1A40",
            skinColor: "#F2C8A0",
            hairColor: "#3A1F0E",
            headSize: 1.5,
          }}
        />
      </div>

      {/* Heart on white tank top — match source (lol) */}
      {/* This is purely cosmetic to match the source vibe */}
    </AbsoluteFill>
  );
};
