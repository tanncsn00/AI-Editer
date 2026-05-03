/**
 * CamiksRedraw v3 — real 3s then hard-cut to a redrawn still of the same
 * scene (no text, no speech bubbles). The drawing recreates the composition:
 * kid LEFT pouring white salt bag → pan; mom RIGHT turning to stare, gaping.
 *
 * Timeline (1080×1920 @ 30fps, 180f = 6s):
 *   [  0..90 ]  Real clip (3s)
 *   [ 90..180]  Hand-drawn still of the same frame (3s)
 */

import { AbsoluteFill, OffthreadVideo, Audio, staticFile, Sequence, useCurrentFrame } from "remotion";
import { RoughRedraw } from "./fx/RoughRedraw";
import { CamiksKitchenScene } from "./fx/CamiksKitchenScene";

const W = 1080;
const H = 1920;

// --- paper texture ---
const PaperBg: React.FC<{ tint?: string }> = ({ tint = "#EFE6D0" }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="paper3">
        <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="11" />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.11 0" />
        <feComposite in2="SourceGraphic" operator="in" />
      </filter>
    </defs>
    <rect width={W} height={H} fill={tint} />
    <rect width={W} height={H} fill={tint} filter="url(#paper3)" opacity={0.95} />
  </svg>
);

// ============================================================
// Real clip
// ============================================================

const RealClip: React.FC = () => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile("fb_real_clip.mp4")} />
  </AbsoluteFill>
);

// ============================================================
// Redrawn still — same composition as the photo
// ============================================================

const RedrawStill: React.FC = () => {
  return (
    <AbsoluteFill>
      <PaperBg tint="#EFE4C9" />
      <CamiksKitchenScene shakePerFrame={8} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <text x={80} y={1890} fontFamily="'Patrick Hand','Comic Sans MS'" fontSize={30}
          fill="#4E4436" opacity={0.55}>clawmiks</text>
      </svg>
    </AbsoluteFill>
  );
};

const RedrawStillOLD: React.FC = () => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame * 0.08) * 2;
  return (
    <AbsoluteFill>
      <PaperBg tint="#EFE6D0" />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <defs>
          <filter id="handLine3">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="2.4" />
          </filter>
          <linearGradient id="gasBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7FD0FF" />
            <stop offset="100%" stopColor="#2E7FC9" />
          </linearGradient>
        </defs>

        <g transform={`translate(0, ${bob})`} filter="url(#handLine3)">
          {/* === BACKGROUND === */}
          {/* Tile wall left */}
          <rect x={0} y={0} width={260} height={1200} fill="#D8CFB8" stroke="#4E4436" strokeWidth={3} />
          {[0, 1, 2, 3, 4, 5].map((r) =>
            [0, 1].map((c) => (
              <rect key={`${r}-${c}`} x={20 + c * 120} y={40 + r * 180} width={100} height={160}
                fill="none" stroke="#4E4436" strokeWidth={2} opacity={0.55} />
            ))
          )}

          {/* Back wall */}
          <rect x={260} y={0} width={820} height={1000} fill="#E6D9B8" stroke="#4E4436" strokeWidth={3} />

          {/* Hanging rattan fan/basket center-top */}
          <g transform="translate(620, 280)">
            <path d="M 0,-140 L 0,-30" stroke="#3E3020" strokeWidth={4} />
            <ellipse cx={0} cy={20} rx={120} ry={70} fill="#C99A68" stroke="#4E4436" strokeWidth={4} />
            <ellipse cx={0} cy={5} rx={100} ry={55} fill="#A8794E" stroke="#4E4436" strokeWidth={3} />
            <path d="M -80,0 L 80,0" stroke="#4E4436" strokeWidth={2} />
            <path d="M -60,-30 L 60,20" stroke="#4E4436" strokeWidth={2} opacity={0.5} />
          </g>

          {/* Red curtain right */}
          <g transform="translate(880, 0)">
            <rect x={0} y={0} width={200} height={980} fill="#E6D9B8" stroke="#4E4436" strokeWidth={3} />
            {[0, 1, 2, 3].map((i) => (
              <path key={i}
                d={`M ${10 + i * 48},40 Q ${20 + i * 48},500 ${10 + i * 48},960`}
                stroke="#B94A4A" strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.92} />
            ))}
            {[0, 1, 2, 3].map((i) => (
              <path key={`d${i}`}
                d={`M ${30 + i * 48},40 Q ${40 + i * 48},500 ${30 + i * 48},960`}
                stroke="#8B2F2F" strokeWidth={6} fill="none" opacity={0.7} />
            ))}
          </g>

          {/* Clothes / bag hanging top-center */}
          <g transform="translate(760, 150)">
            <ellipse cx={0} cy={-20} rx={90} ry={12} fill="none" stroke="#3E3020" strokeWidth={4} />
            <path d="M -60,-10 L -80,180 L 60,180 L 80,-10 Z" fill="#F2ECD8" stroke="#4E4436" strokeWidth={4} />
            <path d="M -40,10 L -40,160" stroke="#4E4436" strokeWidth={2} opacity={0.6} />
          </g>
        </g>

        {/* === MOM RIGHT (crouched, turning to stare) === */}
        <g transform="translate(780, 900)" filter="url(#handLine3)">
          {/* legs (bent, black pants) */}
          <path d="M -40,300 C -80,480 60,560 120,540 L 200,540 C 260,520 260,380 200,300 Z"
            fill="#1E1E28" stroke="#0A0A14" strokeWidth={6} />
          <path d="M -60,280 C -100,440 10,520 60,500 L 120,500 C 170,480 180,360 130,280 Z"
            fill="#2A2A36" stroke="#0A0A14" strokeWidth={5} />
          {/* torso — grey shirt */}
          <path d="M -100,40 C -140,180 -120,300 -40,320 L 180,310 C 240,240 230,100 180,20 C 140,-40 -80,-40 -100,40 Z"
            fill="#6B6677" stroke="#0A0A14" strokeWidth={6} />
          {/* arm holding something (to right, out of frame) */}
          <path d="M 180,60 C 280,60 340,140 320,240 L 280,240 C 270,160 220,120 170,130 Z"
            fill="#6B6677" stroke="#0A0A14" strokeWidth={6} />
          <ellipse cx={310} cy={240} rx={32} ry={22} fill="#F0D4BC" stroke="#0A0A14" strokeWidth={5} />
          {/* head — turned LEFT toward kid */}
          <g transform="translate(-10, -120)">
            {/* hair — dark short */}
            <path d="M -140,-110 C -130,-170 130,-180 150,-100 C 160,-40 140,40 80,60 L -80,60 C -130,30 -160,-40 -140,-110 Z"
              fill="#0A0814" stroke="#000" strokeWidth={5} />
            {/* face */}
            <ellipse cx={0} cy={20} rx={120} ry={130} fill="#F2D9BE" stroke="#0A0A14" strokeWidth={6} />
            {/* bangs over forehead */}
            <path d="M -110,-60 C -90,-110 80,-120 110,-50 C 90,-20 40,-70 0,-40 C -40,-70 -80,-20 -110,-60 Z"
              fill="#0A0814" />
            {/* eyebrows — raised / shocked flat */}
            <path d="M -90,-20 L -40,-22" stroke="#0A0A14" strokeWidth={8} strokeLinecap="round" />
            <path d="M  90,-20 L  40,-22" stroke="#0A0A14" strokeWidth={8} strokeLinecap="round" />
            {/* eyes — WIDE open, mostly white, tiny pupils offset LEFT (looking at kid) */}
            <circle cx={-45} cy={20} r={34} fill="#FFFFFF" stroke="#0A0A14" strokeWidth={5} />
            <circle cx={ 45} cy={20} r={34} fill="#FFFFFF" stroke="#0A0A14" strokeWidth={5} />
            <circle cx={-58} cy={22} r={10} fill="#0A0A14" />
            <circle cx={ 32} cy={22} r={10} fill="#0A0A14" />
            {/* small highlight */}
            <circle cx={-54} cy={18} r={3} fill="#FFFFFF" />
            <circle cx={ 36} cy={18} r={3} fill="#FFFFFF" />
            {/* nose */}
            <path d="M -4,40 Q 0,80 10,90 Q 0,96 -6,92" stroke="#0A0A14" strokeWidth={4} fill="none" strokeLinecap="round" />
            {/* mouth — agape O */}
            <ellipse cx={0} cy={110} rx={18} ry={24} fill="#5A2230" stroke="#0A0A14" strokeWidth={5} />
            {/* cheek blush */}
            <ellipse cx={-80} cy={60} rx={20} ry={8} fill="#F5A7A3" opacity={0.6} />
            <ellipse cx={ 80} cy={60} rx={20} ry={8} fill="#F5A7A3" opacity={0.6} />
          </g>
        </g>

        {/* === KID LEFT (sitting, pouring white bag) === */}
        <g transform="translate(320, 1060)" filter="url(#handLine3)">
          {/* crossed legs — yellow/olive pants */}
          <path d="M -90,180 C -140,290 -50,360 20,350 L 120,340 C 180,320 170,230 120,190 Z"
            fill="#8A7C3A" stroke="#0A0A14" strokeWidth={6} />
          {/* white t-shirt with small dark print */}
          <path d="M -120,0 C -150,110 -140,200 -80,220 L 120,210 C 160,180 160,60 130,-10 C 100,-70 -90,-70 -120,0 Z"
            fill="#FAFAF4" stroke="#0A0A14" strokeWidth={6} />
          {/* shirt graphic (small dark scribble) */}
          <g transform="translate(-20, 100)" opacity={0.7}>
            <path d="M 0,0 L 20,-10 L 30,10 L 10,20 Z" fill="#0A0A14" />
            <text x={45} y={12} fontFamily="'Patrick Hand'" fontSize={18} fill="#0A0A14">MOLA</text>
          </g>
          {/* left arm (back side, down) */}
          <path d="M -120,-20 C -170,0 -190,60 -170,110 C -150,130 -130,120 -120,100 Z"
            fill="#F6E1CA" stroke="#0A0A14" strokeWidth={6} />
          {/* right arm — extended, holding bag */}
          <path d="M 100,-30 C 190,-40 260,20 280,90 C 290,130 260,150 240,150 L 220,150 C 215,90 180,30 100,30 Z"
            fill="#F6E1CA" stroke="#0A0A14" strokeWidth={6} />
          {/* head — short bob, tilted slight right, looking down at pan */}
          <g transform="translate(-10, -160)">
            {/* hair bob */}
            <path d="M -130,-90 C -140,-190 130,-190 130,-80 C 125,-20 70,-60 0,-50 C -70,-60 -120,-30 -130,-90 Z"
              fill="#1A0F14" stroke="#000" strokeWidth={5} />
            {/* face */}
            <ellipse cx={0} cy={20} rx={130} ry={140} fill="#FCE8D3" stroke="#0A0A14" strokeWidth={6} />
            {/* fringe */}
            <path d="M -120,-40 C -100,-90 100,-110 120,-30 C 100,-10 50,-60 10,-30 C -30,-60 -90,-10 -120,-40 Z"
              fill="#1A0F14" />
            {/* eyebrows — playful arch */}
            <path d="M -75,-5 Q -55,-20 -30,-5" stroke="#0A0A14" strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M  75,-5 Q  55,-20  30,-5" stroke="#0A0A14" strokeWidth={6} fill="none" strokeLinecap="round" />
            {/* eyes — rounded, mischief, looking down-right toward pan */}
            <circle cx={-45} cy={28} r={28} fill="#FFFFFF" stroke="#0A0A14" strokeWidth={5} />
            <circle cx={ 45} cy={28} r={28} fill="#FFFFFF" stroke="#0A0A14" strokeWidth={5} />
            <circle cx={-37} cy={36} r={12} fill="#0A0A14" />
            <circle cx={ 53} cy={36} r={12} fill="#0A0A14" />
            <circle cx={-33} cy={30} r={4} fill="#FFFFFF" />
            <circle cx={ 57} cy={30} r={4} fill="#FFFFFF" />
            {/* nose tiny */}
            <path d="M -4,55 Q 0,70 8,72" stroke="#0A0A14" strokeWidth={4} fill="none" strokeLinecap="round" />
            {/* mouth — slight open smile (concentrating) */}
            <path d="M -25,95 Q 0,115 25,95" stroke="#0A0A14" strokeWidth={5} fill="#6B2A3A" strokeLinecap="round" />
            {/* cheek blush */}
            <ellipse cx={-85} cy={65} rx={20} ry={8} fill="#F5A7A3" opacity={0.8} />
            <ellipse cx={ 85} cy={65} rx={20} ry={8} fill="#F5A7A3" opacity={0.8} />
          </g>
          {/* === WHITE SALT BAG in right hand, tilted to pour === */}
          <g transform="translate(260, 60) rotate(75)">
            {/* bag body */}
            <path d="M -55,-160 C -70,-140 -70,100 -55,130 L 55,130 C 70,100 70,-140 55,-160 C 30,-175 -30,-175 -55,-160 Z"
              fill="#F8F4EE" stroke="#0A0A14" strokeWidth={5} />
            {/* twisted top */}
            <path d="M -40,-170 C -20,-200 20,-200 40,-170 L 30,-160 L -30,-160 Z"
              fill="#F8F4EE" stroke="#0A0A14" strokeWidth={4} />
            {/* bag highlights */}
            <path d="M -30,-130 L -30,100" stroke="#0A0A14" strokeWidth={2} opacity={0.3} />
            <path d="M  30,-130 L  30,100" stroke="#0A0A14" strokeWidth={2} opacity={0.3} />
            {/* salt pouring out — chunky stream */}
            <path d="M 0,130 C 10,200 -10,260 5,340 C 20,400 -5,480 10,560"
              stroke="#FFFFFF" strokeWidth={22} fill="none" strokeLinecap="round" />
            <path d="M 0,130 C 10,200 -10,260 5,340 C 20,400 -5,480 10,560"
              stroke="#0A0A14" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.35} />
            {/* salt grains scatter */}
            {Array.from({ length: 18 }).map((_, i) => {
              const x = -20 + (i * 7) % 40;
              const y = 200 + i * 22;
              return <circle key={i} cx={x + (i % 3 - 1) * 8} cy={y} r={3} fill="#FFFFFF" stroke="#8A8A8A" strokeWidth={1} />;
            })}
          </g>
        </g>

        {/* === PAN / STOVE bottom === */}
        <g transform="translate(480, 1560)" filter="url(#handLine3)">
          {/* stove body */}
          <rect x={-360} y={160} width={720} height={220} rx={14} fill="#1E1E1E" stroke="#000" strokeWidth={6} />
          <rect x={-360} y={340} width={720} height={30} fill="#2C2C2C" stroke="#000" strokeWidth={4} />
          {/* gas flame */}
          <g>
            {[-50, 0, 50].map((dx, i) => (
              <path key={i}
                d={`M ${dx - 36},140 Q ${dx - 20},${70 + Math.sin(frame*0.25 + i) * 6} ${dx},${50 + Math.cos(frame*0.3 + i)*5} Q ${dx + 20},${70 + Math.sin(frame*0.28 + i) * 6} ${dx + 36},140 Z`}
                fill="url(#gasBlue)" stroke="#0A5AA0" strokeWidth={3} opacity={0.9} />
            ))}
            <path d="M -26,100 Q 0,68 26,100 Q 18,115 0,105 Q -18,115 -26,100 Z" fill="#FFE066" opacity={0.85} />
          </g>
          {/* pan (oval) */}
          <ellipse cx={0} cy={40} rx={280} ry={58} fill="#1B1B1B" stroke="#000" strokeWidth={6} />
          <ellipse cx={0} cy={30} rx={270} ry={50} fill="#2E2E2E" stroke="#000" strokeWidth={3} />
          {/* pan handle */}
          <rect x={265} y={16} width={220} height={30} rx={14} fill="#1E1E1E" stroke="#000" strokeWidth={5} />
          <rect x={470} y={14} width={28} height={34} rx={6} fill="#2E2E2E" stroke="#000" strokeWidth={4} />
          {/* rice pile (off-center left) */}
          <ellipse cx={-70} cy={16} rx={180} ry={30} fill="#FBF8EC" stroke="#7B6F4A" strokeWidth={3} />
          <ellipse cx={-70} cy={8} rx={160} ry={22} fill="#FFFDF1" />
          {/* rice grains texture */}
          {Array.from({ length: 28 }).map((_, i) => {
            const a = i * 0.45;
            return <ellipse key={i}
              cx={-70 + Math.cos(a) * (50 + (i % 4) * 22)}
              cy={2 + Math.sin(a) * 14}
              rx={3.2} ry={1.8} fill="#F3E8C8" stroke="#B89A60" strokeWidth={1} />;
          })}
          {/* egg yolk */}
          <circle cx={100} cy={16} r={22} fill="#FFB13A" stroke="#C97A1A" strokeWidth={3} />
          <ellipse cx={95} cy={10} r={5} fill="#FFD580" />
          {/* salt pile forming in pan where stream lands */}
          <ellipse cx={-20} cy={-4} rx={50} ry={14} fill="#FFFFFF" stroke="#9E9E9E" strokeWidth={2} />
          <ellipse cx={-20} cy={-10} rx={38} ry={9} fill="#FFFFFF" />
        </g>

        {/* === FLOOR line hint === */}
        <line x1={0} y1={1810} x2={W} y2={1820} stroke="#4E4436" strokeWidth={4} opacity={0.55} />

        {/* Small Camiks-like signature bottom */}
        <text x={80} y={1890} fontFamily="'Patrick Hand','Comic Sans MS'" fontSize={30}
          fill="#4E4436" opacity={0.55}>clawmiks</text>
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================
// Root
// ============================================================

export const CamiksRedraw: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("fb_real_clip.mp4")} startFrom={0} endAt={90} volume={0.95} />
      <Sequence from={0} durationInFrames={90}>
        <RealClip />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <RedrawStill />
      </Sequence>
    </AbsoluteFill>
  );
};
