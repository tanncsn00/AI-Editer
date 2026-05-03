/**
 * IsseiDanceSideBySide — left: Issei source, right: Issei-coded cartoon driven by his pose.
 */

import { AbsoluteFill, Audio, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { IsseiMascotFromPose } from "./fx/IsseiMascotFromPose";
import type { Tracking } from "./fx/PoseAttachedFX";
import tracking from "./issei_dance_tracking.json";

const T = tracking as Tracking;
const PANEL = 1080;
const H = 1920;

const NightBg: React.FC = () => {
  const frame = useCurrentFrame();
  const lampPulse = 0.85 + Math.sin(frame * 0.18) * 0.1;
  return (
    <svg width={PANEL} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="nightsky2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070912" />
          <stop offset="60%" stopColor="#11141F" />
          <stop offset="100%" stopColor="#1A1820" />
        </linearGradient>
        <radialGradient id="moonglow2" cx="50%" cy="6%" r="22%">
          <stop offset="0%" stopColor="#FFE9B0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFE9B0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={PANEL} height={H * 0.78} fill="url(#nightsky2)" />
      <circle cx={PANEL / 2} cy={H * 0.05} r={18} fill="#FFE9B0" opacity={lampPulse} />
      <ellipse cx={PANEL / 2} cy={H * 0.10} rx={PANEL * 0.45} ry={H * 0.35} fill="url(#moonglow2)" opacity={lampPulse} />
      <rect y={H * 0.78} width={PANEL} height={H * 0.22} fill="#0A0A12" />
      {[0.10, 0.30, 0.50, 0.70, 0.90].map((x, i) => (
        <rect key={i} x={PANEL * x - 8} y={H * 0.84} width={16} height={42} fill="#0A0612" stroke="#1A1A24" strokeWidth={2} />
      ))}
    </svg>
  );
};

export const IsseiDanceSideBySide: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#070912", flexDirection: "row" }}>
      <Audio src={staticFile("singer_mascot/audio.aac")} volume={0.92} />
      <div style={{ position: "relative", width: PANEL, height: H }}>
        <OffthreadVideo src={staticFile("issei_dance/source.mp4")} muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{
          position: "absolute", top: 30, left: 30, padding: "8px 18px",
          background: "rgba(0,0,0,0.55)", color: "#FFE066",
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800, fontSize: 36,
          borderRadius: 8, letterSpacing: 2,
        }}>
          NGUỒN
        </div>
      </div>
      <div style={{ position: "relative", width: PANEL, height: H }}>
        <NightBg />
        <IsseiMascotFromPose tracking={T} />
        <div style={{
          position: "absolute", top: 30, left: 30, padding: "8px 18px",
          background: "rgba(0,0,0,0.55)", color: "#1AFFE0",
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800, fontSize: 36,
          borderRadius: 8, letterSpacing: 2,
        }}>
          HOẠT HÌNH
        </div>
      </div>
    </AbsoluteFill>
  );
};
