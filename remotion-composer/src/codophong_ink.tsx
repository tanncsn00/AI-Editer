import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const INK = "#0F0C0A";
export const INK_HI = "#1C1712";
export const BODY = "#EDE4CE";
export const EMPHASIS = "#C9A227";
export const CINNABAR = "#B23A2E";
export const WASH = "#5A6460";

const FPS = 30;

const seeded = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const ridgePath = (seed: number, baseY: number, amp: number, steps: number): string => {
  const pts: string[] = [`M -100 1920`, `L -100 ${baseY}`];
  for (let i = 0; i <= steps; i++) {
    const x = -100 + (1280 / steps) * i;
    const n = seeded(seed + i) + seeded(seed * 2.7 + i * 1.9) * 0.6;
    const y = baseY - Math.sin((i / steps) * Math.PI) * amp * (0.55 + n * 0.5);
    pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  pts.push(`L 1180 1920 Z`);
  return pts.join(" ");
};

const RIDGES = [
  { seed: 3.1, baseY: 1210, amp: 430, steps: 13, fill: "#2A302E", blur: 7, drift: 26, op: 0.85 },
  { seed: 8.4, baseY: 1330, amp: 330, steps: 11, fill: "#202523", blur: 4, drift: 17, op: 0.9 },
  { seed: 15.9, baseY: 1470, amp: 250, steps: 9, fill: "#171B19", blur: 2, drift: 9, op: 0.95 },
  { seed: 22.3, baseY: 1660, amp: 170, steps: 7, fill: "#101312", blur: 0, drift: 4, op: 1 },
];

export const InkScape: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 55% at 50% 34%, ${INK_HI} 0%, ${INK} 68%, #070505 100%)` }} />
      <AbsoluteFill>
        <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ width: "100%", height: "100%" }}>
          <defs>
            {RIDGES.map((r, i) => (
              <filter key={i} id={`rb${i}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation={r.blur} />
              </filter>
            ))}
            <radialGradient id="moon" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#D8CFB4" stopOpacity="0.30" />
              <stop offset="55%" stopColor="#D8CFB4" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#D8CFB4" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="742" cy="360" r="330" fill="url(#moon)" />
          {RIDGES.map((r, i) => (
            <g key={i} transform={`translate(${Math.sin(t * 0.045 + i * 1.3) * r.drift} ${Math.sin(t * 0.03 + i) * 5})`}>
              <path d={ridgePath(r.seed, r.baseY, r.amp, r.steps)} fill={r.fill} opacity={r.op} filter={`url(#rb${i})`} />
            </g>
          ))}
        </svg>
      </AbsoluteFill>
      <Fog />
      <Grain />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 26%, rgba(0,0,0,0.82) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.16) 28%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.18) 72%, rgba(0,0,0,0.7) 100%)" }} />
    </AbsoluteFill>
  );
};

const FOG = [
  { y: 900, h: 300, dur: 74, op: 0.13 },
  { y: 1180, h: 260, dur: 97, op: 0.1 },
  { y: 640, h: 220, dur: 123, op: 0.07 },
];

const Fog: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill>
      {FOG.map((f, i) => {
        const x = ((t / f.dur) % 1) * 2200 - 1100;
        return (
          <div key={i} style={{
            position: "absolute", top: f.y, left: x, width: 1500, height: f.h,
            background: `radial-gradient(ellipse at center, rgba(216,207,180,${f.op}) 0%, rgba(216,207,180,0) 70%)`,
            filter: "blur(42px)",
          }} />
        );
      })}
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.2, mixBlendMode: "overlay" }}>
    <svg width="100%" height="100%">
      <filter id="paperGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={4} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#paperGrain)" />
    </svg>
  </AbsoluteFill>
);

export const ScrollRule: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.3 }}>
    <div style={{ position: "absolute", right: 54, top: 250, bottom: 250, width: 1, background: `linear-gradient(to bottom, rgba(201,162,39,0) 0%, rgba(201,162,39,0.55) 18%, rgba(201,162,39,0.55) 82%, rgba(201,162,39,0) 100%)` }} />
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} style={{ position: "absolute", right: 48, top: 380 + i * 270, width: 13, height: 1, background: "rgba(201,162,39,0.5)" }} />
    ))}
  </AbsoluteFill>
);

export const Seal: React.FC<{ label: string; start: number; end: number }> = ({ label, start, end }) => {
  const frame = useCurrentFrame();
  const sf = start * FPS;
  const ef = end * FPS;
  if (frame < sf || frame > ef) return null;
  const stamp = interpolate(frame, [sf, sf + 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fade = interpolate(frame, [ef - 14, ef], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(stamp, [0, 1], [1.5, 1]);
  return (
    <AbsoluteFill style={{ opacity: stamp * fade * 0.94 }}>
      <div style={{
        position: "absolute", left: 74, top: 250,
        transform: `scale(${scale}) rotate(-4deg)`,
        border: `4px solid ${CINNABAR}`, borderRadius: 8,
        padding: "16px 12px", width: 104,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        boxShadow: `0 0 26px rgba(178,58,46,0.4)`,
      }}>
        {label.replace(/\s/g, "").split("").map((ch, i) => (
          <span key={i} style={{
            fontFamily: "'EB Garamond', Georgia, serif", fontWeight: 600, fontSize: 40,
            color: CINNABAR, lineHeight: 1, textShadow: "0 0 14px rgba(178,58,46,0.5)",
          }}>{ch}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
