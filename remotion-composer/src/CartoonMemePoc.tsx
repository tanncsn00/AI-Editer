import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { CartoonMascotFromPose } from "./fx/CartoonMascotFromPose";
import type { Tracking } from "./fx/PoseAttachedFX";
import tracking from "./cartoon_meme_tracking.json";

const T = tracking as Tracking;

const SCENE: "white" | "neon" | "overlay" = "neon";

export const CartoonMemePoc: React.FC = () => {
  if (SCENE === "overlay") {
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        <OffthreadVideo src={staticFile("cartoon_meme/source.mp4")} muted />
        <CartoonMascotFromPose tracking={T} style={{ face: "sigma" }} />
      </AbsoluteFill>
    );
  }

  if (SCENE === "white") {
    return (
      <AbsoluteFill style={{ background: "#FAF6EE" }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
          <defs>
            <pattern id="grid2" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0A0A0F" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid2)" />
        </svg>
        <CartoonMascotFromPose tracking={T} style={{ face: "sigma" }} />
      </AbsoluteFill>
    );
  }

  // Neon disco scene to keep meme vibe
  return (
    <AbsoluteFill style={{ background: "#0A0814" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="neonbg" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stopColor="#3D1A4A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0A0814" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="floor" x1="0" y1="0.7" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A0814" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF1A8C" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#neonbg)" />
        <rect width="100%" height="40%" y="60%" fill="url(#floor)" />
        {/* Neon strips */}
        {[0.1, 0.25, 0.4].map((y, i) => (
          <line key={i}
            x1="0" y1={`${y * 100}%`}
            x2="100%" y2={`${y * 100}%`}
            stroke={["#FF1A8C", "#1AFFE0", "#FFD400"][i]}
            strokeWidth="3" opacity="0.5" />
        ))}
        {/* Sigma label */}
        <text x="50%" y="9%" textAnchor="middle"
          fontSize="80" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight="800"
          fill="#FFD400" stroke="#FF1A8C" strokeWidth="3"
          opacity="0.95" letterSpacing="8">SIGMA DANCE</text>
      </svg>
      <CartoonMascotFromPose
        tracking={T}
        style={{ face: "sigma", shirtColor: "#7B3FE4", pantsColor: "#1A1A28" }}
      />
    </AbsoluteFill>
  );
};
