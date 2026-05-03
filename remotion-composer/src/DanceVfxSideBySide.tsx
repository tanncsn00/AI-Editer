/**
 * DanceVfxSideBySide — left: source dancer, right: cartoon driven by her pose.
 * Renders at 2160x1920 (two 1080-wide panels).
 */

import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CartoonMascotFromPose } from "./fx/CartoonMascotFromPose";
import type { Tracking } from "./fx/PoseAttachedFX";
import tracking from "./dance_vfx_tracking.json";

const T = tracking as Tracking;
const PANEL = 1080;
const H = 1920;

const DiscoBg: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = (Math.sin(frame * 0.05) + 1) * 0.5;
  return (
    <svg width={PANEL} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A0830" />
          <stop offset="55%" stopColor="#5A1A60" />
          <stop offset="100%" stopColor="#0A0612" />
        </linearGradient>
        <radialGradient id="spotA2" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#FFE066" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFE066" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={PANEL} height={H} fill="url(#bg2)" />
      <ellipse cx={PANEL * 0.5 + (sweep - 0.5) * 250} cy={H * 0.32}
        rx={PANEL * 0.55} ry={H * 0.28} fill="url(#spotA2)" />
    </svg>
  );
};

export const DanceVfxSideBySide: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0A0612", flexDirection: "row" }}>
      {/* Left: source */}
      <div style={{ position: "relative", width: PANEL, height: H }}>
        <OffthreadVideo src={staticFile("dance_vfx/source.mp4")} muted
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
      {/* Right: cartoon driven by her pose */}
      <div style={{ position: "relative", width: PANEL, height: H }}>
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
