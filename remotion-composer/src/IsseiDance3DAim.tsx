/**
 * IsseiDance3DAim — 3D Mixamo Soldier driven by GVHMR SMPL joint positions
 * via aim-bone retargeting (handles SMPL/Mixamo rest-pose mismatch correctly).
 */

import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { GlbAimedFromSmplJoints } from "./fx/GlbAimedFromSmplJoints";
import joints from "./issei_smpl_joints.json";

const W = 1080;
const H = 1920;

/* ─────────── LED Concert Stage ─────────── */

const LedStage: React.FC = () => {
  const frame = useCurrentFrame();
  // beat-driven pulse (~110 BPM = ~1.83 beats/sec at 30fps = beat every 16 frames)
  const beat = (frame % 16) / 16;
  const beatPulse = 1 - Math.pow(beat, 2.5);
  const slowSweep = (Math.sin(frame * 0.04) + 1) * 0.5;
  const fastStrobe = Math.sin(frame * 0.6) > 0.85 ? 1 : 0;

  // LED wall pixel grid colors cycling
  const ledColors = ["#FF1A8C", "#1AFFE0", "#FFD400", "#7B3FE4", "#FF5A1F"];

  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="stageDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#02020A" />
          <stop offset="60%" stopColor="#06061A" />
          <stop offset="100%" stopColor="#0A0814" />
        </linearGradient>
        <linearGradient id="floorGloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF1A8C" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#FF1A8C" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="hazeA" cx="20%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FF1A8C" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FF1A8C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hazeB" cx="80%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#1AFFE0" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#1AFFE0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="centerSpot" cx="50%" cy="55%" r="38%">
          <stop offset="0%" stopColor="#FFE9B0" stopOpacity={0.45 * beatPulse + 0.15} />
          <stop offset="100%" stopColor="#FFE9B0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ledWallBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#180A2A" />
          <stop offset="100%" stopColor="#0A0814" />
        </linearGradient>
        {/* sweep beams */}
        <linearGradient id="beam1" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFD400" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFD400" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFD400" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beam2" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FF1A8C" stopOpacity="0" />
          <stop offset="50%" stopColor="#FF1A8C" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FF1A8C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beam3" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#1AFFE0" stopOpacity="0" />
          <stop offset="50%" stopColor="#1AFFE0" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1AFFE0" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sky / venue dark backdrop */}
      <rect width={W} height={H} fill="url(#stageDark)" />

      {/* Haze blobs (atmosphere fog) */}
      <rect width={W} height={H * 0.7} fill="url(#hazeA)" />
      <rect width={W} height={H * 0.7} fill="url(#hazeB)" />

      {/* LED Video Wall — big rect behind character */}
      <g>
        <rect x={W * 0.06} y={H * 0.05} width={W * 0.88} height={H * 0.55}
          fill="url(#ledWallBg)" stroke="#1A1A2A" strokeWidth={3} rx={6} />
        {/* LED pixels grid (animated colors) */}
        {Array.from({ length: 9 }).map((_, row) =>
          Array.from({ length: 14 }).map((_, col) => {
            const ci = (row * 14 + col + Math.floor(frame / 5)) % ledColors.length;
            const o = 0.22 + ((Math.sin((frame * 0.12) + row + col * 0.6) + 1) * 0.5) * 0.45 * (0.6 + beatPulse * 0.4);
            return (
              <rect key={`${row}-${col}`}
                x={W * 0.07 + col * (W * 0.062)}
                y={H * 0.06 + row * (H * 0.058)}
                width={W * 0.058} height={H * 0.054}
                rx={3}
                fill={ledColors[ci]}
                opacity={o} />
            );
          })
        )}
        {/* Big text overlay on LED wall */}
        <text x={W / 2} y={H * 0.20} textAnchor="middle"
          fontSize="120" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight="900"
          fill="#FFFFFF" opacity={0.92}
          stroke="#FF1A8C" strokeWidth="4" letterSpacing="6">
          LIVE
        </text>
        <text x={W / 2} y={H * 0.30} textAnchor="middle"
          fontSize="46" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight="700"
          fill="#FFD400" letterSpacing="14">
          TOKYO · 2026
        </text>
      </g>

      {/* Truss top */}
      <rect x={0} y={0} width={W} height={H * 0.04} fill="#1A1A24" />
      <rect x={0} y={H * 0.038} width={W} height={2} fill="#3A3A4A" />
      {/* Truss vertical legs */}
      <rect x={W * 0.02} y={0} width={10} height={H * 0.66} fill="#1A1A24" />
      <rect x={W * 0.97} y={0} width={10} height={H * 0.66} fill="#1A1A24" />

      {/* Hanging spotlights */}
      {[0.1, 0.22, 0.34, 0.5, 0.66, 0.78, 0.9].map((x, i) => {
        const c = ledColors[(i + Math.floor(frame / 8)) % ledColors.length];
        const flick = 0.85 + Math.sin(frame * 0.4 + i * 1.3) * 0.15;
        return (
          <g key={`l${i}`}>
            <line x1={W * x} y1={H * 0.04} x2={W * x} y2={H * 0.07}
              stroke="#1A1A24" strokeWidth={3} />
            <rect x={W * x - 12} y={H * 0.07} width={24} height={18}
              fill="#1A1A24" rx={3} />
            <circle cx={W * x} cy={H * 0.085} r={9} fill={c} opacity={flick} />
          </g>
        );
      })}

      {/* Sweeping beams from above (moving) */}
      {[
        { angle: -28 + slowSweep * 30, x: W * 0.18, color: "url(#beam1)" },
        { angle: 22 - slowSweep * 30, x: W * 0.5, color: "url(#beam2)" },
        { angle: -12 + slowSweep * 16, x: W * 0.82, color: "url(#beam3)" },
      ].map((b, i) => (
        <g key={`b${i}`} transform={`translate(${b.x}, ${H * 0.085}) rotate(${b.angle})`}>
          <polygon points={`-30,0 30,0 220,${H * 0.62} -220,${H * 0.62}`}
            fill={b.color} opacity={0.55 + beatPulse * 0.25} />
        </g>
      ))}

      {/* Center key spotlight on dancer */}
      <ellipse cx={W * 0.5} cy={H * 0.55} rx={W * 0.42} ry={H * 0.32}
        fill="url(#centerSpot)" />

      {/* Strobe flash overlay */}
      {fastStrobe > 0 && (
        <rect width={W} height={H} fill="#FFFFFF" opacity={0.08} />
      )}

      {/* Stage front edge + floor */}
      <rect x={0} y={H * 0.78} width={W} height={H * 0.22} fill="#01010A" />
      <rect y={H * 0.78} width={W} height={H * 0.22} fill="url(#floorGloss)" />
      {/* Stage strip lights along edge */}
      <line x1={0} y1={H * 0.78} x2={W} y2={H * 0.78}
        stroke="#FFD400" strokeWidth={4} opacity={0.7 * beatPulse + 0.3} />
      {/* Floor reflection of LED wall (fading) */}
      {Array.from({ length: 6 }).map((_, row) => (
        <rect key={`r${row}`}
          x={W * 0.1} y={H * 0.79 + row * (H * 0.025)}
          width={W * 0.8} height={H * 0.02}
          fill={ledColors[(row + Math.floor(frame / 5)) % ledColors.length]}
          opacity={0.18 - row * 0.025}
          rx={2} />
      ))}

      {/* Speaker stacks left/right */}
      {[0.04, 0.92].map((sx, i) => (
        <g key={`sp${i}`} transform={`translate(${W * sx}, ${H * 0.50})`}>
          {[0, 1, 2, 3].map((j) => (
            <g key={j}>
              <rect x={0} y={j * 60} width={W * 0.04} height={56}
                fill="#0A0A12" stroke="#1A1A24" strokeWidth={2} rx={3} />
              <circle cx={W * 0.02} cy={j * 60 + 18} r={9}
                fill="#1A1A24" stroke="#3A3A48" strokeWidth={1} />
              <circle cx={W * 0.02} cy={j * 60 + 38} r={11}
                fill="#0A0A12" stroke="#3A3A48" strokeWidth={1} />
            </g>
          ))}
        </g>
      ))}

      {/* Crowd silhouette at bottom */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i / 19) * W;
        const headSize = 14 + (i % 3) * 4;
        const sway = Math.sin((frame + i * 7) * 0.12) * 3;
        return (
          <g key={`c${i}`}>
            <circle cx={x + sway} cy={H * 0.86} r={headSize} fill="#000" opacity={0.95} />
            {/* Phone screens */}
            {i % 4 === 0 && (
              <>
                <rect x={x + sway - 4} y={H * 0.81} width={8} height={14}
                  fill="#FFE066" opacity={0.85} />
                <line x1={x + sway} y1={H * 0.83} x2={x + sway + 6} y2={H * 0.86 - headSize}
                  stroke="#000" strokeWidth={3} strokeLinecap="round" />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export const IsseiDance3DAim: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#070912" }}>
      <Audio src={staticFile("singer_mascot/audio.aac")} volume={0.92} />
      <LedStage />
      <ThreeCanvas width={W} height={H}
        camera={{ position: [0, 1.0, 3.0], fov: 42 }}
        gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 4]} intensity={1.5} />
        <directionalLight position={[-3, 3, 2]} intensity={0.5} color="#FFD9A0" />
        <GlbAimedFromSmplJoints
          url={staticFile("Dying.glb")}
          joints={joints as any}
          scale={1.2}
          position={[0, -1.0, 0]}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
