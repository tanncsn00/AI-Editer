import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });
loadJetBrainsMono("normal", { weights: ["400","500","700"], subsets: ["latin","latin-ext"] });

// Stick figure theme previews — frozen scene 3 "diverging paths"
// Goal: compare 3 aesthetic directions before committing to 1

const W = 1080;
const H = 1920;

// Deterministic pseudo-random for wobble
const rnd = (seed: number): number => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

// ------------- STICK FIGURE (reusable) -------------
type Pose = "walk" | "idle" | "arms_up" | "cheer";

type FigureProps = {
  x: number; y: number; scale: number; phase?: number;
  pose: Pose; color: string; strokeWidth?: number;
  flip?: boolean; jitter?: number; filter?: string;
  headFill?: string;
};

const StickFigure: React.FC<FigureProps> = ({
  x, y, scale, phase = 0, pose, color,
  strokeWidth = 5, flip = false, jitter = 0, filter, headFill = "none",
}) => {
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  let la = [0, 0], ra = [0, 0], ll = [0, 0], rl = [0, 0];
  let bob = 0;
  switch (pose) {
    case "walk":
      la = [s * 16, 42]; ra = [-s * 16, 42];
      ll = [s * 14, 52]; rl = [-s * 14, 52];
      bob = Math.abs(c) * 2.5;
      break;
    case "idle":
      la = [3, 48]; ra = [-3, 48];
      ll = [-8, 54]; rl = [8, 54];
      break;
    case "arms_up":
      la = [-26, -34]; ra = [26, -34];
      ll = [-9, 54]; rl = [9, 54];
      break;
    case "cheer":
      la = [-20, -28]; ra = [20, -28];
      ll = [-9, 54]; rl = [9, 54];
      break;
  }
  const sx = flip ? -1 : 1;
  const sw = strokeWidth / scale;
  // Jitter: small random offset per endpoint for hand-drawn feel
  const jx = (seed: number) => (jitter ? (rnd(seed) - 0.5) * jitter : 0);
  return (
    <g transform={`translate(${x}, ${y + bob}) scale(${scale * sx}, ${scale})`} filter={filter}>
      <circle cx={0 + jx(1)} cy={-62 + jx(2)} r={13} fill={headFill} stroke={color} strokeWidth={sw} />
      <line x1={0 + jx(3)} y1={-48} x2={0 + jx(4)} y2={10} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={0} y1={-32} x2={la[0] + jx(5)} y2={-32 + la[1] + jx(6)} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={0} y1={-32} x2={ra[0] + jx(7)} y2={-32 + ra[1] + jx(8)} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={0} y1={10} x2={ll[0] + jx(9)} y2={10 + ll[1] + jx(10)} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={0} y1={10} x2={rl[0] + jx(11)} y2={10 + rl[1] + jx(12)} stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </g>
  );
};

// ================================================================
// THEME A — "GIẤY & MỰC" (Ink on Paper)
// ================================================================
export const StickThemeA: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = frame / 6;
  // Fork at (540, 1220). Crowd walks to (860, 1620), Hero to (220, 1620).
  const tWalk = Math.min(1, frame / 60);
  const crowdCX = 540 + (860 - 540) * tWalk;
  const crowdCY = 1220 + (1620 - 1220) * tWalk;
  const heroX = 540 + (220 - 540) * tWalk;
  const heroY = 1220 + (1620 - 1220) * tWalk;
  return (
    <AbsoluteFill>
      {/* Paper bg */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="paperNoise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.25 0" />
          </filter>
          <radialGradient id="vigA" cx="50%" cy="50%" r="70%">
            <stop offset="40%" stopColor="#F1EADC" stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.55" />
          </radialGradient>
          <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
            <feOffset dx="0" dy="4" />
            <feComponentTransfer><feFuncA type="linear" slope="0.35" /></feComponentTransfer>
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill="#F1EADC" />
        <rect width={W} height={H} filter="url(#paperNoise)" />
        <rect width={W} height={H} fill="url(#vigA)" />

        {/* Corner ink marks (editorial frame) */}
        <line x1={60} y1={60} x2={140} y2={60} stroke="#1A1A22" strokeWidth={3} />
        <line x1={60} y1={60} x2={60} y2={140} stroke="#1A1A22" strokeWidth={3} />
        <line x1={W-60} y1={60} x2={W-140} y2={60} stroke="#1A1A22" strokeWidth={3} />
        <line x1={W-60} y1={60} x2={W-60} y2={140} stroke="#1A1A22" strokeWidth={3} />
        <line x1={60} y1={H-60} x2={140} y2={H-60} stroke="#1A1A22" strokeWidth={3} />
        <line x1={60} y1={H-60} x2={60} y2={H-140} stroke="#1A1A22" strokeWidth={3} />
        <line x1={W-60} y1={H-60} x2={W-140} y2={H-60} stroke="#1A1A22" strokeWidth={3} />
        <line x1={W-60} y1={H-60} x2={W-60} y2={H-140} stroke="#1A1A22" strokeWidth={3} />

        {/* Editorial header */}
        <text x={W/2} y={200} fontSize={28} fill="#1A1A22" textAnchor="middle" fontFamily="'EB Garamond', serif" fontStyle="italic" letterSpacing="4">— tư duy mở —</text>
        <line x1={W/2 - 80} y1={225} x2={W/2 + 80} y2={225} stroke="#1A1A22" strokeWidth={1} />

        {/* Caption */}
        <g transform={`translate(${W/2}, 340)`}>
          <text fontSize={54} fill="#1A1A22" textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={500}>
            Họ chỉ đang đi
          </text>
          <text y={72} fontSize={54} fill="#B83A2A" textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic">
            đường khác.
          </text>
        </g>

        {/* Paths — uneven ink */}
        <path d={`M 540 1080 Q 538 1150 540 1220`} stroke="#1A1A22" strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d={`M 540 1220 Q 700 1420 860 1620`} stroke="#1A1A22" strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d={`M 540 1220 Q 380 1420 220 1620`} stroke="#B83A2A" strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray="14 10" />

        {/* Fork node */}
        <circle cx={540} cy={1220} r={10} fill="#B83A2A" />
        <circle cx={540} cy={1220} r={18} fill="none" stroke="#B83A2A" strokeWidth={2} opacity={0.5} />

        {/* Ground */}
        <line x1={80} y1={1720} x2={W-80} y2={1720} stroke="#1A1A22" strokeWidth={2} opacity={0.6} />

        {/* Crowd — small, ink black */}
        <StickFigure x={crowdCX} y={crowdCY} scale={0.85} phase={phase*1.4} pose="walk" color="#1A1A22" strokeWidth={6} jitter={1.8} filter="url(#softShadow)" />
        <StickFigure x={crowdCX - 55} y={crowdCY - 18} scale={0.8} phase={phase*1.4+1.2} pose="walk" color="#1A1A22" strokeWidth={6} jitter={1.8} />
        <StickFigure x={crowdCX - 110} y={crowdCY - 32} scale={0.82} phase={phase*1.4+0.5} pose="walk" color="#1A1A22" strokeWidth={6} jitter={1.8} />

        {/* Hero — slightly bigger, red accent stroke */}
        <StickFigure x={heroX} y={heroY} scale={1.1} phase={phase*1.2} pose="walk" color="#B83A2A" strokeWidth={7} flip jitter={2.2} filter="url(#softShadow)" headFill="#F1EADC" />

        {/* Page number */}
        <text x={W/2} y={H-110} fontSize={22} fill="#1A1A22" textAnchor="middle" fontFamily="'EB Garamond', serif" fontStyle="italic" opacity={0.7}>— 01 —</text>
      </svg>
    </AbsoluteFill>
  );
};

// ================================================================
// THEME B — "GOLDEN HOUR" (Warm cinematic)
// ================================================================
export const StickThemeB: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = frame / 6;
  const tWalk = Math.min(1, frame / 60);
  const crowdCX = 540 + (860 - 540) * tWalk;
  const crowdCY = 1220 + (1620 - 1220) * tWalk;
  const heroX = 540 + (220 - 540) * tWalk;
  const heroY = 1220 + (1620 - 1220) * tWalk;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="skyB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050405" />
            <stop offset="45%" stopColor="#120A06" />
            <stop offset="78%" stopColor="#2A1506" />
            <stop offset="100%" stopColor="#4A2408" />
          </linearGradient>
          <filter id="grainB">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feColorMatrix values="0 0 0 0 0.6  0 0 0 0 0.45  0 0 0 0 0.25  0 0 0 0.09 0" />
          </filter>
          <filter id="glowCream" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glowGold" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="fogB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A0F06" stopOpacity="0" />
            <stop offset="100%" stopColor="#4A2808" stopOpacity="0.75" />
          </linearGradient>
          <radialGradient id="sunBloom" cx="50%" cy="72%" r="50%">
            <stop offset="0%" stopColor="#E5C68A" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#E5C68A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#skyB)" />
        <rect width={W} height={H} fill="url(#sunBloom)" />

        {/* Distant city silhouette (parallax BG layer) */}
        <g opacity={0.72}>
          <rect x={0}   y={1430} width={80}  height={160} fill="#050303" />
          <rect x={90}  y={1380} width={110} height={210} fill="#070404" />
          <rect x={210} y={1450} width={70}  height={140} fill="#050303" />
          <rect x={290} y={1400} width={90}  height={190} fill="#060404" />
          <rect x={390} y={1350} width={120} height={240} fill="#070404" />
          <rect x={520} y={1420} width={80}  height={170} fill="#050303" />
          <rect x={610} y={1380} width={100} height={210} fill="#060404" />
          <rect x={720} y={1440} width={70}  height={150} fill="#050303" />
          <rect x={800} y={1390} width={110} height={200} fill="#070404" />
          <rect x={920} y={1430} width={90}  height={160} fill="#060404" />
          {/* windows: tiny warm dots */}
          {[[120,1450],[140,1480],[310,1440],[330,1470],[430,1400],[460,1440],[640,1410],[670,1450],[830,1420],[860,1460]].map(([x,y], i) => (
            <rect key={i} x={x} y={y} width={4} height={6} fill="#E5C68A" opacity={0.8} />
          ))}
        </g>

        {/* Mid horizon line */}
        <line x1={0} y1={1590} x2={W} y2={1590} stroke="#2A1A0A" strokeWidth={2} />

        {/* Fog bottom */}
        <rect x={0} y={1450} width={W} height={H-1450} fill="url(#fogB)" />

        {/* Caption */}
        <g transform={`translate(${W/2}, 340)`}>
          <text fontSize={48} fill="#EBE4D2" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} filter="url(#glowCream)">
            Họ chỉ đang đi
          </text>
          <text y={66} fontSize={56} fill="#E5C68A" textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic" filter="url(#glowGold)">
            đường khác.
          </text>
        </g>

        {/* Paths */}
        <path d={`M 540 1080 L 540 1220`} stroke="#EBE4D2" strokeWidth={4} fill="none" opacity={0.7} filter="url(#glowCream)" />
        <path d={`M 540 1220 L 860 1620`} stroke="#8A7260" strokeWidth={3} fill="none" opacity={0.7} />
        <path d={`M 540 1220 L 220 1620`} stroke="#E5C68A" strokeWidth={4} fill="none" strokeDasharray="14 9" filter="url(#glowGold)" />

        {/* Fork glow node */}
        <circle cx={540} cy={1220} r={22} fill="#E5C68A" opacity={0.15} />
        <circle cx={540} cy={1220} r={12} fill="#E5C68A" opacity={0.35} />
        <circle cx={540} cy={1220} r={6} fill="#E5C68A" />

        {/* Crowd — dim cream */}
        <StickFigure x={crowdCX} y={crowdCY} scale={0.88} phase={phase*1.4} pose="walk" color="#8A7260" strokeWidth={5} />
        <StickFigure x={crowdCX - 55} y={crowdCY - 18} scale={0.83} phase={phase*1.4+1.2} pose="walk" color="#8A7260" strokeWidth={5} />
        <StickFigure x={crowdCX - 110} y={crowdCY - 32} scale={0.85} phase={phase*1.4+0.5} pose="walk" color="#8A7260" strokeWidth={5} />

        {/* Hero — glow gold */}
        <StickFigure x={heroX} y={heroY} scale={1.15} phase={phase*1.2} pose="walk" color="#E5C68A" strokeWidth={6} flip filter="url(#glowGold)" />

        {/* Film grain overlay */}
        <rect width={W} height={H} filter="url(#grainB)" />
      </svg>
    </AbsoluteFill>
  );
};

// ================================================================
// THEME C — "BLUEPRINT" (Architectural schematic)
// ================================================================
export const StickThemeC: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = frame / 6;
  const tWalk = Math.min(1, frame / 60);
  const crowdCX = 540 + (860 - 540) * tWalk;
  const crowdCY = 1220 + (1620 - 1220) * tWalk;
  const heroX = 540 + (220 - 540) * tWalk;
  const heroY = 1220 + (1620 - 1220) * tWalk;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="blueGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" />
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="whiteGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
            <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill="#0C2340" />

        {/* Fine grid */}
        <g stroke="#1E3A5F" strokeWidth={1}>
          {Array.from({ length: 40 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 50} x2={W} y2={i * 50} />
          ))}
          {Array.from({ length: 22 }, (_, i) => (
            <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={H} />
          ))}
        </g>
        {/* Major grid every 250px */}
        <g stroke="#2E547F" strokeWidth={1.5}>
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`H${i}`} x1={0} y1={i * 250} x2={W} y2={i * 250} />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={`V${i}`} x1={i * 250} y1={0} x2={i * 250} y2={H} />
          ))}
        </g>

        {/* Corner labels */}
        <g fontFamily="'JetBrains Mono', monospace" fill="#A7C7E7" fontSize={18}>
          <text x={80} y={100}>FIG.01 — DIVERGENCE</text>
          <text x={80} y={130} opacity={0.6}>SCALE 1:20</text>
          <text x={W-80} y={100} textAnchor="end">PROJECT: TƯ DUY MỞ</text>
          <text x={W-80} y={130} textAnchor="end" opacity={0.6}>REV 01 · 2026</text>
          <text x={80} y={H-80} opacity={0.6}>DRAWN BY: NGUYEN A.D.</text>
          <text x={W-80} y={H-80} textAnchor="end" opacity={0.6}>SHEET 01 / 05</text>
        </g>

        {/* Caption */}
        <g transform={`translate(${W/2}, 340)`}>
          <text fontSize={44} fill="#A7C7E7" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} filter="url(#blueGlow)">
            HO CHI DANG DI
          </text>
          <text y={62} fontSize={56} fill="#FFFFFF" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} filter="url(#whiteGlow)">
            DUONG KHAC.
          </text>
          <text y={115} fontSize={20} fill="#A7C7E7" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" opacity={0.5}>[ Họ chỉ đang đi đường khác ]</text>
        </g>

        {/* Paths as schematic lines */}
        <path d={`M 540 1080 L 540 1220`} stroke="#A7C7E7" strokeWidth={3} fill="none" filter="url(#blueGlow)" />
        <path d={`M 540 1220 L 860 1620`} stroke="#A7C7E7" strokeWidth={3} fill="none" opacity={0.55} />
        <path d={`M 540 1220 L 220 1620`} stroke="#FFFFFF" strokeWidth={4} fill="none" strokeDasharray="16 8" filter="url(#whiteGlow)" />

        {/* Dimension labels (technical annotation) */}
        <g fontFamily="'JetBrains Mono', monospace" fill="#A7C7E7" fontSize={16}>
          {/* Fork angle */}
          <path d="M 540 1270 A 50 50 0 0 1 576 1262" stroke="#A7C7E7" strokeWidth={1.5} fill="none" />
          <path d="M 540 1270 A 50 50 0 0 0 504 1262" stroke="#A7C7E7" strokeWidth={1.5} fill="none" />
          <text x={605} y={1290}>θ = 45°</text>
          {/* Hero path label */}
          <text x={260} y={1530} fill="#FFFFFF" opacity={0.9}>PATH_B</text>
          <line x1={260} y1={1540} x2={310} y2={1570} stroke="#FFFFFF" strokeWidth={1} />
          {/* Crowd path label */}
          <text x={820} y={1530} opacity={0.6}>PATH_A</text>
          <line x1={820} y1={1540} x2={780} y2={1570} stroke="#A7C7E7" strokeWidth={1} opacity={0.6} />
          {/* Fork node label */}
          <text x={570} y={1210} fill="#FFFFFF">◆ NODE_0</text>
        </g>

        {/* Dashed vertical dimension lines */}
        <line x1={150} y1={1080} x2={150} y2={1620} stroke="#A7C7E7" strokeWidth={1} strokeDasharray="4 4" opacity={0.5} />
        <line x1={150} y1={1080} x2={170} y2={1080} stroke="#A7C7E7" strokeWidth={1} opacity={0.5} />
        <line x1={150} y1={1620} x2={170} y2={1620} stroke="#A7C7E7" strokeWidth={1} opacity={0.5} />
        <text x={100} y={1360} fontSize={14} fill="#A7C7E7" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" opacity={0.6} transform="rotate(-90 100 1360)">540 U</text>

        {/* Fork node — diamond */}
        <g transform="translate(540, 1220)">
          <rect x={-10} y={-10} width={20} height={20} transform="rotate(45)" fill="#FFFFFF" filter="url(#whiteGlow)" />
        </g>

        {/* Crowd */}
        <StickFigure x={crowdCX} y={crowdCY} scale={0.88} phase={phase*1.4} pose="walk" color="#A7C7E7" strokeWidth={5} filter="url(#blueGlow)" />
        <StickFigure x={crowdCX - 55} y={crowdCY - 18} scale={0.83} phase={phase*1.4+1.2} pose="walk" color="#A7C7E7" strokeWidth={5} filter="url(#blueGlow)" />
        <StickFigure x={crowdCX - 110} y={crowdCY - 32} scale={0.85} phase={phase*1.4+0.5} pose="walk" color="#A7C7E7" strokeWidth={5} filter="url(#blueGlow)" />

        {/* Hero — white */}
        <StickFigure x={heroX} y={heroY} scale={1.15} phase={phase*1.2} pose="walk" color="#FFFFFF" strokeWidth={6} flip filter="url(#whiteGlow)" />
      </svg>
    </AbsoluteFill>
  );
};
