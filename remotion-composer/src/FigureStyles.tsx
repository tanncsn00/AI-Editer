import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// Signature figure style previews — testing 3 mascot concepts
// Each shown large on Golden Hour background for comparison

const W = 1080;
const H = 1920;
const CREAM = "#EBE4D2";
const GOLD = "#E5C68A";
const DIM = "#8A7260";

// ================================================================
// FIGURE 1 — HÀNH GIẢ (Hooded wanderer, solid fill silhouette)
// ================================================================
const HanhGia: React.FC<{ x: number; y: number; scale: number; phase: number; color: string }> = ({ x, y, scale, phase, color }) => {
  const sw = Math.sin(phase);
  const lean = sw * 2;
  // legs swing
  const leg1x = -10 + sw * 6;
  const leg2x = 10 - sw * 6;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Robe body — trapezoid widening */}
      <path d={`M ${-32 + lean} 0 L ${-46 + lean} 100 L ${46 + lean} 100 L ${32 + lean} 0 Z`} fill={color} />
      {/* Hood shape over head */}
      <path d={`M -34 ${-8 + lean/2} Q -42 -70 ${0 + lean} -78 Q 42 -70 34 ${-8 + lean/2} L 32 0 L -32 0 Z`} fill={color} />
      {/* Head circle inside hood */}
      <circle cx={0 + lean} cy={-38 + lean/2} r={20} fill={color} />
      {/* Face shadow — dark inside hood showing only partial face */}
      <path d={`M ${-14 + lean} -44 Q ${0 + lean} -28 ${14 + lean} -44 L ${14 + lean} -22 L ${-14 + lean} -22 Z`} fill="#000" opacity={0.75} />
      {/* Legs visible under robe */}
      <rect x={leg1x - 4} y={100} width={8} height={34} fill={color} />
      <rect x={leg2x - 4} y={100} width={8} height={34} fill={color} />
      {/* Small feet */}
      <ellipse cx={leg1x} cy={136} rx={8} ry={3} fill={color} />
      <ellipse cx={leg2x} cy={136} rx={8} ry={3} fill={color} />
      {/* Staff (signature prop) */}
      <line x1={32 + lean} y1={-20} x2={48 + lean} y2={120} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <circle cx={32 + lean} cy={-20} r={6} fill={color} />
    </g>
  );
};

// ================================================================
// FIGURE 2 — NOODLE (Thick bezier curves, scarf, rounded organic)
// ================================================================
const Noodle: React.FC<{ x: number; y: number; scale: number; phase: number; color: string }> = ({ x, y, scale, phase, color }) => {
  const s = Math.sin(phase);
  const swRight = s * 12;
  const swLeft = -s * 12;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Scarf — flowing behind */}
      <path
        d={`M -18 -48 Q -55 -25 -62 10 Q -58 14 -52 10 Q -38 -15 -12 -38`}
        fill={color}
        opacity={0.85}
      />
      <path
        d={`M -18 -48 Q -55 -25 -62 10`}
        stroke={color}
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
      />
      {/* Head — filled circle with beanie */}
      <circle cx={0} cy={-68} r={26} fill={color} />
      {/* Beanie stripe (signature detail) */}
      <path d="M -26 -80 Q 0 -100 26 -80 L 26 -68 L -26 -68 Z" fill="#000" opacity={0.35} />
      <circle cx={0} cy={-98} r={5} fill={color} />
      {/* Body — thick bezier S curve */}
      <path d="M 0 -42 Q 4 -15 0 15" stroke={color} strokeWidth={24} fill="none" strokeLinecap="round" />
      {/* Arms — thick curves */}
      <path d={`M 0 -30 Q ${18 + swRight * 0.4} -5 ${22 + swRight} ${22}`} stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d={`M 0 -30 Q ${-18 + swLeft * 0.4} -5 ${-22 + swLeft} ${22}`} stroke={color} strokeWidth={14} fill="none" strokeLinecap="round" />
      {/* Hand blobs */}
      <circle cx={22 + swRight} cy={22} r={8} fill={color} />
      <circle cx={-22 + swLeft} cy={22} r={8} fill={color} />
      {/* Legs — thick curves */}
      <path d={`M 0 15 Q ${8 + swRight * 0.3} 40 ${12 + swRight * 0.5} 72`} stroke={color} strokeWidth={16} fill="none" strokeLinecap="round" />
      <path d={`M 0 15 Q ${-8 + swLeft * 0.3} 40 ${-12 + swLeft * 0.5} 72`} stroke={color} strokeWidth={16} fill="none" strokeLinecap="round" />
      {/* Feet ovals */}
      <ellipse cx={16 + swRight * 0.5} cy={76} rx={13} ry={6} fill={color} />
      <ellipse cx={-16 + swLeft * 0.5} cy={76} rx={13} ry={6} fill={color} />
    </g>
  );
};

// ================================================================
// FIGURE 3 — READER (Stick with book + glasses, signature for book aff)
// ================================================================
const Reader: React.FC<{ x: number; y: number; scale: number; phase: number; color: string; bookColor?: string }> = ({ x, y, scale, phase, color, bookColor = GOLD }) => {
  const s = Math.sin(phase);
  const legSw = s * 12;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Head outline */}
      <circle cx={0} cy={-72} r={22} fill="none" stroke={color} strokeWidth={6} />
      {/* Hair tuft — signature messy top */}
      <path d="M -16 -90 Q -10 -100 -5 -92 Q 0 -102 6 -92 Q 12 -100 16 -88" stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" />
      {/* Glasses — 2 round frames */}
      <circle cx={-8} cy={-70} r={7} fill="none" stroke={color} strokeWidth={3} />
      <circle cx={8} cy={-70} r={7} fill="none" stroke={color} strokeWidth={3} />
      <line x1={-1} y1={-70} x2={1} y2={-70} stroke={color} strokeWidth={3} />
      {/* Small smile */}
      <path d="M -5 -60 Q 0 -56 5 -60" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* Body — slightly thicker */}
      <line x1={0} y1={-50} x2={0} y2={18} stroke={color} strokeWidth={8} strokeLinecap="round" />
      {/* Left arm holds book */}
      <line x1={0} y1={-32} x2={22} y2={-8} stroke={color} strokeWidth={7} strokeLinecap="round" />
      {/* Book — rectangular with spine */}
      <g transform="translate(22, -8) rotate(-12)">
        <rect x={-4} y={-4} width={34} height={40} fill={bookColor} stroke={color} strokeWidth={3} />
        <line x1={13} y1={-4} x2={13} y2={36} stroke={color} strokeWidth={2} />
        <line x1={2} y1={6} x2={11} y2={6} stroke={color} strokeWidth={1.5} />
        <line x1={2} y1={12} x2={11} y2={12} stroke={color} strokeWidth={1.5} />
        <line x1={2} y1={18} x2={11} y2={18} stroke={color} strokeWidth={1.5} />
        <line x1={15} y1={6} x2={25} y2={6} stroke={color} strokeWidth={1.5} />
        <line x1={15} y1={12} x2={25} y2={12} stroke={color} strokeWidth={1.5} />
        <line x1={15} y1={18} x2={25} y2={18} stroke={color} strokeWidth={1.5} />
      </g>
      {/* Right arm down */}
      <line x1={0} y1={-32} x2={-18} y2={15} stroke={color} strokeWidth={7} strokeLinecap="round" />
      <circle cx={-18} cy={15} r={4} fill={color} />
      {/* Legs */}
      <line x1={0} y1={18} x2={-12 + legSw} y2={70} stroke={color} strokeWidth={8} strokeLinecap="round" />
      <line x1={0} y1={18} x2={12 - legSw} y2={70} stroke={color} strokeWidth={8} strokeLinecap="round" />
      {/* Shoes */}
      <ellipse cx={-14 + legSw} cy={72} rx={9} ry={4} fill={color} />
      <ellipse cx={14 - legSw} cy={72} rx={9} ry={4} fill={color} />
    </g>
  );
};

// ================================================================
// SHARED BACKGROUND — Golden Hour environment
// ================================================================
const BgGoldenHour: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#050405" />
        <stop offset="45%" stopColor="#120A06" />
        <stop offset="78%" stopColor="#2A1506" />
        <stop offset="100%" stopColor="#4A2408" />
      </linearGradient>
      <filter id="grainG">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" />
        <feColorMatrix values="0 0 0 0 0.6  0 0 0 0 0.45  0 0 0 0 0.25  0 0 0 0.09 0" />
      </filter>
      <radialGradient id="sunG" cx="50%" cy="72%" r="50%">
        <stop offset="0%" stopColor="#E5C68A" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#E5C68A" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="fogG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1A0F06" stopOpacity="0" />
        <stop offset="100%" stopColor="#4A2808" stopOpacity="0.7" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#skyG)" />
    <rect width={W} height={H} fill="url(#sunG)" />
    {/* Mountain silhouette */}
    <path d="M 0 1550 L 150 1420 L 280 1490 L 440 1360 L 600 1450 L 780 1380 L 920 1470 L 1080 1400 L 1080 1920 L 0 1920 Z" fill="#080606" />
    <path d="M 0 1650 L 200 1560 L 380 1620 L 560 1540 L 740 1600 L 920 1530 L 1080 1580 L 1080 1920 L 0 1920 Z" fill="#0C0906" opacity={0.9} />
    {/* Fog */}
    <rect x={0} y={1500} width={W} height={H - 1500} fill="url(#fogG)" />
    {/* Grain */}
    <rect width={W} height={H} filter="url(#grainG)" opacity={0.6} />
  </svg>
);

const Label: React.FC<{ title: string; subtitle: string; tagline: string }> = ({ title, subtitle, tagline }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    {/* top */}
    <text x={W/2} y={180} fontSize={24} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} letterSpacing="8" opacity={0.85}>
      — STICK FIGURE STUDY —
    </text>
    {/* main title */}
    <text x={W/2} y={320} fontSize={120} fill={CREAM} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={500} letterSpacing="4">
      {title}
    </text>
    <text x={W/2} y={380} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'EB Garamond', serif" fontStyle="italic" opacity={0.9}>
      {subtitle}
    </text>
    {/* bottom tagline */}
    <text x={W/2} y={H - 200} fontSize={26} fill={CREAM} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} opacity={0.75}>
      {tagline}
    </text>
    <line x1={W/2 - 100} y1={H - 160} x2={W/2 + 100} y2={H - 160} stroke={GOLD} strokeWidth={1} opacity={0.5} />
  </svg>
);

// ================================================================
// PREVIEW COMPOSITIONS
// ================================================================
export const FigStyleHooded: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BgGoldenHour />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <HanhGia x={540} y={1250} scale={3.2} phase={frame / 8} color={CREAM} />
      </svg>
      <Label title="HÀNH GIẢ" subtitle="the wanderer" tagline="hooded · silent · walks alone" />
    </AbsoluteFill>
  );
};

export const FigStyleNoodle: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BgGoldenHour />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Noodle x={540} y={1250} scale={3.0} phase={frame / 6} color={CREAM} />
      </svg>
      <Label title="NOODLE" subtitle="the thinker" tagline="rounded · warm · wears a scarf" />
    </AbsoluteFill>
  );
};

// ================================================================
// FIGURE 4 — HERO (Self-portrait style: VN guy, 6-pack, anime-minimal)
// ================================================================
const HeroYou: React.FC<{ x: number; y: number; scale: number; phase: number; skinColor: string; hairColor: string }> = ({ x, y, scale, phase, skinColor, hairColor }) => {
  const s = Math.sin(phase);
  const legSw = s * 6;
  const breathY = Math.sin(phase / 2) * 1.5;
  return (
    <g transform={`translate(${x}, ${y + breathY}) scale(${scale})`}>
      {/* ---------- LEGS ---------- */}
      <path d={`M -22 150 Q ${-26 + legSw} 220 ${-24 + legSw} 290`} stroke={skinColor} strokeWidth={32} strokeLinecap="round" fill="none" />
      <path d={`M 22 150 Q ${26 - legSw} 220 ${24 - legSw} 290`} stroke={skinColor} strokeWidth={32} strokeLinecap="round" fill="none" />
      {/* Quad line hints */}
      <line x1={-22} y1={175} x2={-25 + legSw * 0.5} y2={230} stroke="#1A1A1A" strokeWidth={2} opacity={0.55} />
      <line x1={22} y1={175} x2={25 - legSw * 0.5} y2={230} stroke="#1A1A1A" strokeWidth={2} opacity={0.55} />
      {/* Feet */}
      <ellipse cx={-24 + legSw} cy={296} rx={18} ry={6} fill="#1A1A1A" />
      <ellipse cx={24 - legSw} cy={296} rx={18} ry={6} fill="#1A1A1A" />

      {/* ---------- TORSO (6-pack body) ---------- */}
      {/* Torso outline — broad shoulders, narrow waist */}
      <path
        d="M -62 -35
           Q -70 -20 -64 0
           L -52 80
           Q -48 100 -38 115
           Q -20 130 0 130
           Q 20 130 38 115
           Q 48 100 52 80
           L 64 0
           Q 70 -20 62 -35
           Q 48 -48 28 -46
           L 0 -44
           L -28 -46
           Q -48 -48 -62 -35 Z"
        fill={skinColor}
        stroke="#1A1A1A"
        strokeWidth={3}
      />
      {/* Pectoral lines */}
      <path d="M -50 -18 Q -28 -2 -3 -10" stroke="#1A1A1A" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M 50 -18 Q 28 -2 3 -10" stroke="#1A1A1A" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* Pec shadows (subtle) */}
      <path d="M -48 -25 Q -25 -18 -3 -22" stroke="#1A1A1A" strokeWidth={1.5} fill="none" opacity={0.5} />
      <path d="M 48 -25 Q 25 -18 3 -22" stroke="#1A1A1A" strokeWidth={1.5} fill="none" opacity={0.5} />
      {/* Center line down torso */}
      <line x1={0} y1={-8} x2={0} y2={108} stroke="#1A1A1A" strokeWidth={2.5} />
      {/* 6-pack blocks */}
      {/* Row 1 */}
      <rect x={-20} y={12} width={18} height={22} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      <rect x={2} y={12} width={18} height={22} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      {/* Row 2 */}
      <rect x={-20} y={38} width={18} height={22} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      <rect x={2} y={38} width={18} height={22} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      {/* Row 3 */}
      <rect x={-18} y={64} width={16} height={20} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      <rect x={2} y={64} width={16} height={20} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      {/* V-line obliques */}
      <path d="M -40 90 Q -20 115 -4 120" stroke="#1A1A1A" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M 40 90 Q 20 115 4 120" stroke="#1A1A1A" strokeWidth={2.5} fill="none" strokeLinecap="round" />

      {/* ---------- ARMS ---------- */}
      {/* Left arm (bicep) */}
      <path d="M -62 -25 Q -85 10 -80 55 Q -72 95 -58 120" stroke={skinColor} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M -62 -25 Q -85 10 -80 55 Q -72 95 -58 120" stroke="#1A1A1A" strokeWidth={3} fill="none" />
      <path d="M -76 5 Q -92 25 -84 50" stroke="#1A1A1A" strokeWidth={2} fill="none" opacity={0.6} />
      {/* Right arm */}
      <path d="M 62 -25 Q 85 10 80 55 Q 72 95 58 120" stroke={skinColor} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M 62 -25 Q 85 10 80 55 Q 72 95 58 120" stroke="#1A1A1A" strokeWidth={3} fill="none" />
      <path d="M 76 5 Q 92 25 84 50" stroke="#1A1A1A" strokeWidth={2} fill="none" opacity={0.6} />
      {/* Fists */}
      <circle cx={-58} cy={125} r={11} fill={skinColor} stroke="#1A1A1A" strokeWidth={3} />
      <circle cx={58} cy={125} r={11} fill={skinColor} stroke="#1A1A1A" strokeWidth={3} />

      {/* ---------- NECK ---------- */}
      <path d="M -14 -48 L -16 -68 L 16 -68 L 14 -48 Z" fill={skinColor} stroke="#1A1A1A" strokeWidth={3} />
      {/* neck shadow */}
      <line x1={-12} y1={-50} x2={12} y2={-50} stroke="#1A1A1A" strokeWidth={1.5} opacity={0.5} />

      {/* ---------- HEAD (anime-refined, V-line) ---------- */}
      {/* Face base — sharp V jaw */}
      <path
        d="M -36 -142
           Q -44 -105 -36 -82
           Q -28 -68 -14 -60
           Q 0 -55 14 -60
           Q 28 -68 36 -82
           Q 44 -105 36 -142
           Q 30 -168 0 -170
           Q -30 -168 -36 -142 Z"
        fill={skinColor}
        stroke="#1A1A1A"
        strokeWidth={3}
      />

      {/* Ears */}
      <path d="M -36 -108 Q -42 -98 -40 -88 Q -38 -82 -34 -85" fill={skinColor} stroke="#1A1A1A" strokeWidth={2.5} />
      <path d="M 36 -108 Q 42 -98 40 -88 Q 38 -82 34 -85" fill={skinColor} stroke="#1A1A1A" strokeWidth={2.5} />

      {/* ---------- HAIR (side-part: left fringe falls, right swept up) ---------- */}
      {/* Hair base volume on top */}
      <path
        d="M -38 -138
           Q -46 -172 -16 -180
           Q 4 -184 22 -180
           Q 40 -174 42 -150
           Q 38 -160 30 -160
           L 6 -164
           Q -12 -160 -22 -158
           Q -34 -152 -38 -138 Z"
        fill={hairColor}
      />
      {/* LEFT side (viewer left) — long fringe falling down across forehead */}
      <path
        d="M -38 -145
           Q -42 -168 -20 -172
           Q -4 -170 4 -155
           Q 2 -140 -4 -128
           Q -8 -118 -14 -110
           Q -22 -108 -28 -115
           Q -34 -128 -38 -145 Z"
        fill={hairColor}
      />
      {/* Individual falling strands (left) */}
      <path d="M -24 -160 Q -18 -135 -10 -120" stroke={hairColor} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M -14 -162 Q -10 -138 -2 -122" stroke={hairColor} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M -4 -162 Q 0 -142 4 -128" stroke={hairColor} strokeWidth={3.5} fill="none" strokeLinecap="round" />

      {/* Part line — around x=6, slightly right of center */}
      {/* RIGHT side (viewer right) — swept up & back */}
      <path
        d="M 6 -162
           Q 14 -178 34 -175
           Q 46 -168 44 -150
           Q 42 -145 36 -148
           Q 26 -158 18 -152
           Q 10 -150 6 -148 Z"
        fill={hairColor}
      />
      {/* Swept-up strands on right */}
      <path d="M 10 -158 Q 22 -172 38 -168" stroke={hairColor} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M 14 -152 Q 26 -166 40 -160" stroke={hairColor} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M 18 -148 Q 30 -158 42 -152" stroke={hairColor} strokeWidth={3} fill="none" strokeLinecap="round" />

      {/* Sideburn hints */}
      <path d="M -34 -108 L -32 -92" stroke={hairColor} strokeWidth={3} strokeLinecap="round" />
      <path d="M 34 -108 L 32 -92" stroke={hairColor} strokeWidth={3} strokeLinecap="round" />

      {/* ---------- EYEBROWS ---------- */}
      {/* Left eyebrow — partially covered by fringe (just tip visible) */}
      <path d="M -24 -118 Q -17 -122 -10 -118" stroke="#1A1A1A" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.5} />
      {/* Right eyebrow — fully visible, slight angle */}
      <path d="M 8 -120 Q 16 -124 24 -118" stroke="#1A1A1A" strokeWidth={4} fill="none" strokeLinecap="round" />

      {/* ---------- EYES (anime almond, larger) ---------- */}
      {/* Left eye */}
      <path d="M -25 -105 Q -17 -112 -9 -105 Q -17 -98 -25 -105 Z" fill={skinColor} stroke="#1A1A1A" strokeWidth={2.5} />
      {/* Iris */}
      <circle cx={-17} cy={-105} r={4.5} fill="#1A1A1A" />
      {/* Highlight */}
      <circle cx={-15.5} cy={-106.5} r={1.8} fill={skinColor} />
      <circle cx={-18} cy={-104} r={0.8} fill={skinColor} />
      {/* Upper lash line thicker */}
      <path d="M -25 -105 Q -17 -112 -9 -105" stroke="#1A1A1A" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {/* Double eyelid crease */}
      <path d="M -23 -110 Q -17 -113 -11 -110" stroke="#1A1A1A" strokeWidth={1.2} fill="none" opacity={0.6} />

      {/* Right eye */}
      <path d="M 9 -105 Q 17 -112 25 -105 Q 17 -98 9 -105 Z" fill={skinColor} stroke="#1A1A1A" strokeWidth={2.5} />
      <circle cx={17} cy={-105} r={4.5} fill="#1A1A1A" />
      <circle cx={18.5} cy={-106.5} r={1.8} fill={skinColor} />
      <circle cx={16} cy={-104} r={0.8} fill={skinColor} />
      <path d="M 9 -105 Q 17 -112 25 -105" stroke="#1A1A1A" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M 11 -110 Q 17 -113 23 -110" stroke="#1A1A1A" strokeWidth={1.2} fill="none" opacity={0.6} />

      {/* ---------- NOSE (thin, angular) ---------- */}
      <path d="M -3 -96 Q -4 -85 -2 -80 L 2 -80 Q 4 -85 3 -96" stroke="#1A1A1A" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      {/* nostril hints */}
      <line x1={-3} y1={-79} x2={-1} y2={-78} stroke="#1A1A1A" strokeWidth={1.2} opacity={0.6} />
      <line x1={1} y1={-78} x2={3} y2={-79} stroke="#1A1A1A" strokeWidth={1.2} opacity={0.6} />

      {/* ---------- MOUTH (thin, subtle smirk) ---------- */}
      <path d="M -9 -70 Q -3 -67 3 -69 Q 8 -70 10 -72" stroke="#1A1A1A" strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {/* Lower lip shadow */}
      <path d="M -6 -67 Q 0 -65 6 -67" stroke="#1A1A1A" strokeWidth={1} fill="none" opacity={0.4} />

      {/* ---------- JAW SHARPNESS ---------- */}
      <path d="M -28 -82 Q -14 -64 0 -58 Q 14 -64 28 -82" stroke="#1A1A1A" strokeWidth={1.5} fill="none" opacity={0.35} />
    </g>
  );
};

export const FigStyleHero: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BgGoldenHour />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <HeroYou x={540} y={1100} scale={1.8} phase={frame / 10} skinColor={CREAM} hairColor="#1A1A1A" />
      </svg>
      <Label title="THE AUTHOR" subtitle="tác giả · bản thân hoá" tagline="anime minimal · 6-pack · fringe hair" />
    </AbsoluteFill>
  );
};

// ================================================================
// FIGURE 5 — DERP (Goofy meme mascot, intentionally bựa)
// ================================================================
export const DerpHead: React.FC<{ x: number; y: number; scale: number; phase: number; skinColor: string; hairColor: string }> = ({ x, y, scale, phase, skinColor, hairColor }) => {
  const wiggle = Math.sin(phase) * 3;
  const tongueWiggle = Math.sin(phase * 2) * 2;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* ---------- HEAD — slightly wonky oval ---------- */}
      <path
        d="M -38 -138
           Q -48 -100 -34 -70
           Q -20 -52 4 -50
           Q 30 -54 38 -76
           Q 46 -108 34 -142
           Q 24 -168 -6 -168
           Q -34 -164 -38 -138 Z"
        fill={skinColor}
        stroke="#1A1A1A"
        strokeWidth={3.5}
      />

      {/* Ears — uneven size */}
      <path d="M -40 -108 Q -48 -95 -42 -82 Q -38 -78 -34 -84" fill={skinColor} stroke="#1A1A1A" strokeWidth={2.5} />
      <path d="M 38 -100 Q 50 -88 44 -74 Q 40 -70 34 -76" fill={skinColor} stroke="#1A1A1A" strokeWidth={2.5} />

      {/* ---------- HAIR (messy spikes all over) ---------- */}
      {/* base hair blob */}
      <path
        d="M -40 -138
           Q -48 -172 -10 -182
           Q 24 -188 40 -168
           Q 46 -148 38 -135
           L 34 -140
           Q 26 -155 16 -148
           Q 8 -160 -2 -148
           Q -12 -160 -22 -150
           Q -32 -158 -40 -138 Z"
        fill={hairColor}
      />
      {/* Chaotic spikes */}
      <path d="M -28 -172 L -30 -195 L -22 -178 Z" fill={hairColor} />
      <path d="M -10 -180 L -6 -205 L 0 -180 Z" fill={hairColor} />
      <path d="M 8 -182 L 14 -200 L 20 -178 Z" fill={hairColor} />
      <path d="M 24 -176 L 32 -192 L 30 -170 Z" fill={hairColor} />
      {/* a stray strand dangling on right */}
      <path d="M 38 -150 Q 48 -125 42 -100" stroke={hairColor} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* fringe strand crossing forehead wonky */}
      <path d="M -20 -160 Q -5 -130 18 -145" stroke={hairColor} strokeWidth={6} fill="none" strokeLinecap="round" />

      {/* ---------- EYEBROWS — one up, one down ---------- */}
      {/* Left eyebrow — super high surprised */}
      <path d="M -28 -130 Q -18 -138 -8 -128" stroke="#1A1A1A" strokeWidth={4.5} fill="none" strokeLinecap="round" />
      {/* Right eyebrow — dropped low frowny */}
      <path d="M 8 -112 Q 18 -110 26 -116" stroke="#1A1A1A" strokeWidth={4.5} fill="none" strokeLinecap="round" />

      {/* ---------- EYES — uneven, looking different ways ---------- */}
      {/* Left eye — BIG and round, pupil up-left (looking at ceiling) */}
      <ellipse cx={-18} cy={-108} rx={12} ry={13} fill={skinColor} stroke="#1A1A1A" strokeWidth={3} />
      <circle cx={-21} cy={-113} r={5} fill="#1A1A1A" />
      <circle cx={-19} cy={-115} r={1.8} fill={skinColor} />

      {/* Right eye — SMALL squint, pupil down-right */}
      <ellipse cx={18} cy={-102} rx={8} ry={5} fill={skinColor} stroke="#1A1A1A" strokeWidth={3} />
      <circle cx={20} cy={-100} r={3} fill="#1A1A1A" />
      <circle cx={20.5} cy={-101} r={1} fill={skinColor} />

      {/* ---------- NOSE — snub crooked ---------- */}
      <path d={`M ${-4 + wiggle * 0.3} -92 Q -6 -82 ${-2 + wiggle * 0.3} -78 Q 4 -76 5 -82 Q 4 -92 ${2 + wiggle * 0.3} -92`} stroke="#1A1A1A" strokeWidth={2.2} fill="none" strokeLinecap="round" />

      {/* ---------- MOUTH — open derp, tongue out ---------- */}
      {/* Open mouth oval */}
      <path
        d={`M -18 -68 Q -12 -54 ${0} ${-52 + tongueWiggle * 0.5} Q 14 -54 20 -70 Q 10 -66 0 -66 Q -10 -66 -18 -68 Z`}
        fill="#2A0F0F"
        stroke="#1A1A1A"
        strokeWidth={3}
      />
      {/* Tongue flopping out */}
      <path
        d={`M -8 -60 Q 0 ${-50 + tongueWiggle} 8 -58 Q 12 ${-46 + tongueWiggle} 2 ${-42 + tongueWiggle} Q -8 ${-45 + tongueWiggle} -8 -60 Z`}
        fill="#D97777"
        stroke="#1A1A1A"
        strokeWidth={2.5}
      />
      {/* Tongue center line */}
      <path d={`M 0 ${-52 + tongueWiggle} L 2 ${-45 + tongueWiggle}`} stroke="#1A1A1A" strokeWidth={1.5} fill="none" />
      {/* 1 visible tooth */}
      <rect x={-14} y={-67} width={5} height={7} fill={skinColor} stroke="#1A1A1A" strokeWidth={1.5} />

      {/* ---------- DROOL DROP (meme signature) ---------- */}
      <path d="M 14 -60 Q 18 -50 16 -42 Q 14 -38 12 -42 Q 12 -52 14 -60 Z" fill="#A8C8E8" stroke="#1A1A1A" strokeWidth={1.5} />

      {/* ---------- CHEEK BLUSH (dumb excited) ---------- */}
      <ellipse cx={-26} cy={-88} rx={8} ry={3} fill="#D97777" opacity={0.55} />
      <ellipse cx={26} cy={-85} rx={8} ry={3} fill="#D97777" opacity={0.55} />

      {/* ---------- SWEAT DROP (top corner, extra dumb) ---------- */}
      <path d="M 44 -148 Q 48 -135 44 -128 Q 40 -132 42 -140 Q 42 -146 44 -148 Z" fill="#A8C8E8" stroke="#1A1A1A" strokeWidth={1.5} />
    </g>
  );
};

// Wrap HeroYou but swap face/head → reuse body
export const DerpHero: React.FC<{ x: number; y: number; scale: number; phase: number; skinColor: string; hairColor: string }> = ({ x, y, scale, phase, skinColor, hairColor }) => {
  const s = Math.sin(phase);
  const legSw = s * 6;
  const breathY = Math.sin(phase / 2) * 1.5;
  return (
    <g transform={`translate(${x}, ${y + breathY}) scale(${scale})`}>
      {/* LEGS */}
      <path d={`M -22 150 Q ${-26 + legSw} 220 ${-24 + legSw} 290`} stroke={skinColor} strokeWidth={32} strokeLinecap="round" fill="none" />
      <path d={`M 22 150 Q ${26 - legSw} 220 ${24 - legSw} 290`} stroke={skinColor} strokeWidth={32} strokeLinecap="round" fill="none" />
      <ellipse cx={-24 + legSw} cy={296} rx={18} ry={6} fill="#1A1A1A" />
      <ellipse cx={24 - legSw} cy={296} rx={18} ry={6} fill="#1A1A1A" />
      {/* TORSO with 6-pack */}
      <path
        d="M -62 -35 Q -70 -20 -64 0 L -52 80 Q -48 100 -38 115 Q -20 130 0 130 Q 20 130 38 115 Q 48 100 52 80 L 64 0 Q 70 -20 62 -35 Q 48 -48 28 -46 L 0 -44 L -28 -46 Q -48 -48 -62 -35 Z"
        fill={skinColor} stroke="#1A1A1A" strokeWidth={3}
      />
      <path d="M -50 -18 Q -28 -2 -3 -10" stroke="#1A1A1A" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M 50 -18 Q 28 -2 3 -10" stroke="#1A1A1A" strokeWidth={3} fill="none" strokeLinecap="round" />
      <line x1={0} y1={-8} x2={0} y2={108} stroke="#1A1A1A" strokeWidth={2.5} />
      <rect x={-20} y={12} width={18} height={22} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      <rect x={2} y={12} width={18} height={22} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      <rect x={-20} y={38} width={18} height={22} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      <rect x={2} y={38} width={18} height={22} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      <rect x={-18} y={64} width={16} height={20} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      <rect x={2} y={64} width={16} height={20} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      <path d="M -40 90 Q -20 115 -4 120" stroke="#1A1A1A" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <path d="M 40 90 Q 20 115 4 120" stroke="#1A1A1A" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {/* ARMS */}
      <path d="M -62 -25 Q -85 10 -80 55 Q -72 95 -58 120" stroke={skinColor} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M -62 -25 Q -85 10 -80 55 Q -72 95 -58 120" stroke="#1A1A1A" strokeWidth={3} fill="none" />
      <path d="M 62 -25 Q 85 10 80 55 Q 72 95 58 120" stroke={skinColor} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d="M 62 -25 Q 85 10 80 55 Q 72 95 58 120" stroke="#1A1A1A" strokeWidth={3} fill="none" />
      <circle cx={-58} cy={125} r={11} fill={skinColor} stroke="#1A1A1A" strokeWidth={3} />
      <circle cx={58} cy={125} r={11} fill={skinColor} stroke="#1A1A1A" strokeWidth={3} />
      {/* NECK */}
      <path d="M -14 -48 L -16 -68 L 16 -68 L 14 -48 Z" fill={skinColor} stroke="#1A1A1A" strokeWidth={3} />
      {/* DERP HEAD */}
      <DerpHead x={0} y={0} scale={1} phase={phase} skinColor={skinColor} hairColor={hairColor} />
    </g>
  );
};

export const FigStyleDerp: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BgGoldenHour />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <DerpHero x={540} y={1100} scale={1.8} phase={frame / 8} skinColor={CREAM} hairColor="#1A1A1A" />
      </svg>
      <Label title="THE DERP" subtitle="mặt bựa · 6-pack" tagline="meme mode · derp eyes · tongue out" />
    </AbsoluteFill>
  );
};

export const FigStyleDerpFace: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BgGoldenHour />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <DerpHead x={540} y={1400} scale={5.5} phase={frame / 8} skinColor={CREAM} hairColor="#1A1A1A" />
      </svg>
      <Label title="DERP FACE" subtitle="bựa mode on" tagline="uneven eyes · tongue out · drool · sweat drop" />
    </AbsoluteFill>
  );
};

// ================================================================
// FIGURE 6 — SIGMA (Gigachad parody, chiseled jaw meme)
// ================================================================
export const SigmaHead: React.FC<{ x: number; y: number; scale: number; skinColor: string; hairColor: string; shadowColor: string; mouthOpen?: number; blink?: number }> = ({ x, y, scale, skinColor, hairColor, shadowColor, mouthOpen = 0, blink = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* ---------- HEAD — extreme V chiseled jaw ---------- */}
      <path
        d="M -48 -150
           Q -58 -110 -56 -85
           L -48 -60
           Q -38 -40 -22 -22
           L -6 -6
           Q 0 2 6 -6
           L 22 -22
           Q 38 -40 48 -60
           L 56 -85
           Q 58 -110 48 -150
           Q 36 -180 0 -182
           Q -36 -180 -48 -150 Z"
        fill={skinColor}
        stroke="#0A0A0F"
        strokeWidth={4}
      />

      {/* Jaw shadow — deep V definition */}
      <path
        d="M -46 -88
           Q -40 -50 -18 -20
           L 0 0
           L 18 -20
           Q 40 -50 46 -88
           L 40 -88
           Q 32 -52 14 -28
           L 0 -12
           L -14 -28
           Q -32 -52 -40 -88 Z"
        fill={shadowColor}
        opacity={0.55}
      />

      {/* Cheekbone cut lines */}
      <path d="M -46 -100 Q -36 -90 -28 -70" stroke="#0A0A0F" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M 46 -100 Q 36 -90 28 -70" stroke="#0A0A0F" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* Under-cheek shadow */}
      <path d="M -44 -86 Q -30 -72 -18 -58" stroke={shadowColor} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.5} />
      <path d="M 44 -86 Q 30 -72 18 -58" stroke={shadowColor} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.5} />

      {/* Ears — square sharp */}
      <path d="M -52 -118 Q -62 -108 -58 -88 L -52 -82 Z" fill={skinColor} stroke="#0A0A0F" strokeWidth={3} />
      <path d="M 52 -118 Q 62 -108 58 -88 L 52 -82 Z" fill={skinColor} stroke="#0A0A0F" strokeWidth={3} />

      {/* ---------- HAIR — slicked back, hard part, undercut ---------- */}
      {/* Undercut sides (short dark) */}
      <path d="M -52 -118 Q -56 -145 -40 -155 L -40 -110 Z" fill={hairColor} />
      <path d="M 52 -118 Q 56 -145 40 -155 L 40 -110 Z" fill={hairColor} />
      {/* Top slicked-back hair volume */}
      <path
        d="M -44 -145
           Q -52 -185 -10 -190
           Q 30 -192 44 -168
           Q 48 -148 40 -140
           L 32 -138
           Q 36 -155 22 -160
           L 8 -162
           Q -8 -160 -22 -158
           Q -36 -155 -44 -145 Z"
        fill={hairColor}
      />
      {/* Slicked-back strand lines (horizontal combing) */}
      <path d="M -34 -158 Q -10 -168 18 -164" stroke="#000" strokeWidth={2} fill="none" opacity={0.5} />
      <path d="M -36 -148 Q -10 -158 22 -152" stroke="#000" strokeWidth={2} fill="none" opacity={0.5} />
      <path d="M -32 -172 Q -5 -180 24 -172" stroke="#000" strokeWidth={2} fill="none" opacity={0.5} />
      {/* Hard part line */}
      <line x1={-18} y1={-168} x2={-22} y2={-145} stroke={skinColor} strokeWidth={2} />

      {/* ---------- EYEBROWS — thick, angled down = intense ---------- */}
      <path d="M -32 -120 L -10 -116 L -10 -110 L -30 -114 Z" fill="#0A0A0F" />
      <path d="M 32 -120 L 10 -116 L 10 -110 L 30 -114 Z" fill="#0A0A0F" />

      {/* ---------- EYES — narrow intense slit (blink via scaleY) ---------- */}
      <g transform={`translate(-20, -103) scale(1, ${Math.max(0.05, 1 - blink)}) translate(20, 103)`}>
        <path d="M -32 -104 Q -20 -108 -8 -104 L -10 -100 Q -20 -103 -30 -100 Z" fill="#0A0A0F" />
        <circle cx={-20} cy={-104} r={2.5} fill={skinColor} />
      </g>
      <g transform={`translate(20, -103) scale(1, ${Math.max(0.05, 1 - blink)}) translate(-20, 103)`}>
        <path d="M 32 -104 Q 20 -108 8 -104 L 10 -100 Q 20 -103 30 -100 Z" fill="#0A0A0F" />
        <circle cx={20} cy={-104} r={2.5} fill={skinColor} />
      </g>
      {/* Eye bag shadows (cut look) */}
      <path d="M -28 -97 Q -20 -93 -12 -97" stroke={shadowColor} strokeWidth={2} fill="none" opacity={0.6} />
      <path d="M 28 -97 Q 20 -93 12 -97" stroke={shadowColor} strokeWidth={2} fill="none" opacity={0.6} />

      {/* ---------- NOSE — strong angular Roman ---------- */}
      <path
        d="M -5 -98 L -8 -72 Q -6 -62 -2 -60 L 2 -60 Q 6 -62 8 -72 L 5 -98"
        fill="none"
        stroke="#0A0A0F"
        strokeWidth={3}
        strokeLinecap="round"
      />
      {/* Nose bridge shadow */}
      <line x1={-7} y1={-90} x2={-7} y2={-72} stroke={shadowColor} strokeWidth={3} opacity={0.5} />
      {/* Nostrils */}
      <path d="M -5 -60 Q -2 -56 0 -60" stroke="#0A0A0F" strokeWidth={1.5} fill="none" />
      <path d="M 0 -60 Q 2 -56 5 -60" stroke="#0A0A0F" strokeWidth={1.5} fill="none" />

      {/* ---------- MOUTH — smirk or open (lip sync) ---------- */}
      {mouthOpen <= 0.05 ? (
        <>
          <path d="M -18 -48 Q -8 -52 0 -50 Q 10 -52 20 -46" stroke="#0A0A0F" strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M -16 -44 Q 0 -38 18 -42" stroke={shadowColor} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.5} />
          <path d="M 18 -46 Q 22 -50 24 -48" stroke="#0A0A0F" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Open mouth dark cavity */}
          <ellipse
            cx={0}
            cy={-44}
            rx={18 + mouthOpen * 4}
            ry={3 + mouthOpen * 11}
            fill="#0A0204"
            stroke="#0A0A0F"
            strokeWidth={3}
          />
          {/* Upper lip outline */}
          <path d={`M ${-18 - mouthOpen * 4} -48 Q 0 ${-53 - mouthOpen * 2} ${18 + mouthOpen * 4} -48`} stroke="#0A0A0F" strokeWidth={3} fill="none" strokeLinecap="round" />
          {/* Lower lip */}
          <path d={`M ${-18 - mouthOpen * 4} -40 Q 0 ${-32 - mouthOpen * 4} ${18 + mouthOpen * 4} -40`} stroke="#0A0A0F" strokeWidth={3} fill="none" strokeLinecap="round" />
          {/* Top teeth row when mouth more open */}
          {mouthOpen > 0.4 && (
            <rect
              x={-14}
              y={-50}
              width={28}
              height={3 + mouthOpen * 2}
              fill={skinColor}
              stroke="#0A0A0F"
              strokeWidth={1}
            />
          )}
          {/* Tongue hint when mouth very open */}
          {mouthOpen > 0.7 && (
            <ellipse cx={0} cy={-38} rx={10} ry={3} fill="#7A2020" opacity={0.8} />
          )}
        </>
      )}

      {/* ---------- CHIN — sharp cleft ---------- */}
      <path d="M -4 -14 Q 0 -8 4 -14" stroke="#0A0A0F" strokeWidth={2.5} fill="none" />
      <line x1={0} y1={-14} x2={0} y2={-2} stroke={shadowColor} strokeWidth={2} opacity={0.5} />

      {/* ---------- JAW MUSCLE LINES ---------- */}
      <path d="M -30 -50 Q -22 -38 -14 -28" stroke="#0A0A0F" strokeWidth={2} fill="none" opacity={0.4} />
      <path d="M 30 -50 Q 22 -38 14 -28" stroke="#0A0A0F" strokeWidth={2} fill="none" opacity={0.4} />

      {/* Stubble dots (5 o'clock shadow) */}
      {[[-30,-60],[-22,-52],[-14,-44],[-6,-40],[6,-40],[14,-44],[22,-52],[30,-60],[-20,-38],[0,-32],[20,-38]].map(([cx,cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={1.2} fill="#0A0A0F" opacity={0.45} />
      ))}
    </g>
  );
};

// Sigma body — extra yoked trap muscles + thicker neck
// walkPhase: 0 = idle, or cycle value for walking (legs + arms swing)
export const SigmaBody: React.FC<{ x: number; y: number; scale: number; phase: number; skinColor: string; shadowColor: string; walkPhase?: number }> = ({ x, y, scale, phase, skinColor, shadowColor, walkPhase = 0 }) => {
  const walking = walkPhase !== 0;
  const sw = Math.sin(walkPhase);
  const breathY = walking ? Math.abs(Math.cos(walkPhase)) * 5 : Math.sin(phase / 2) * 1.5;

  // Leg swing parameters (walking only)
  const legSwing = walking ? sw * 32 : 0;
  const lfX = -28 + legSwing;     // left foot x swings forward
  const rfX = 28 - legSwing;      // right foot x swings opposite
  const lkX = -29 + legSwing * 0.45;
  const rkX = 29 - legSwing * 0.45;
  // Lift whichever foot is swinging forward
  const lfY = 306 + (legSwing > 0 ? -Math.abs(legSwing) * 0.25 : 0);
  const rfY = 306 + (legSwing < 0 ? -Math.abs(legSwing) * 0.25 : 0);

  // Arm swing — opposite to legs
  const armSwing = walking ? -sw * 18 : 0;

  return (
    <g transform={`translate(${x}, ${y - breathY}) scale(${scale})`}>
      {/* Legs with walk cycle */}
      <path d={`M -26 160 Q ${lkX} 230 ${lfX} ${lfY - 6}`} stroke={skinColor} strokeWidth={38} strokeLinecap="round" fill="none" />
      <path d={`M 26 160 Q ${rkX} 230 ${rfX} ${rfY - 6}`} stroke={skinColor} strokeWidth={38} strokeLinecap="round" fill="none" />
      <ellipse cx={lfX} cy={lfY} rx={22} ry={7} fill="#0A0A0F" />
      <ellipse cx={rfX} cy={rfY} rx={22} ry={7} fill="#0A0A0F" />
      {/* Quad shadow */}
      <path d={`M -26 180 Q ${lkX - 4} 230 ${lfX - 4} 280`} stroke={shadowColor} strokeWidth={8} fill="none" opacity={0.45} />
      <path d={`M 26 180 Q ${rkX + 4} 230 ${rfX + 4} 280`} stroke={shadowColor} strokeWidth={8} fill="none" opacity={0.45} />

      {/* TORSO — broad shoulders with trap muscles */}
      <path
        d="M -78 -30
           Q -90 -10 -82 12
           L -60 90
           Q -54 115 -42 130
           Q -22 148 0 148
           Q 22 148 42 130
           Q 54 115 60 90
           L 82 12
           Q 90 -10 78 -30
           Q 62 -48 36 -48
           L 0 -48
           L -36 -48
           Q -62 -48 -78 -30 Z"
        fill={skinColor}
        stroke="#0A0A0F"
        strokeWidth={4}
      />

      {/* Trap muscles (neck to shoulder) */}
      <path d="M -38 -48 Q -28 -62 -14 -58" stroke="#0A0A0F" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M 38 -48 Q 28 -62 14 -58" stroke="#0A0A0F" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M -38 -44 Q -24 -54 -14 -54" stroke={shadowColor} strokeWidth={6} fill="none" opacity={0.5} />
      <path d="M 38 -44 Q 24 -54 14 -54" stroke={shadowColor} strokeWidth={6} fill="none" opacity={0.5} />

      {/* Massive pecs */}
      <path d="M -62 -12 Q -32 8 -4 -4" stroke="#0A0A0F" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M 62 -12 Q 32 8 4 -4" stroke="#0A0A0F" strokeWidth={4} fill="none" strokeLinecap="round" />
      {/* Pec shadow underside */}
      <path d="M -58 -5 Q -32 15 -4 5" stroke={shadowColor} strokeWidth={6} fill="none" opacity={0.55} />
      <path d="M 58 -5 Q 32 15 4 5" stroke={shadowColor} strokeWidth={6} fill="none" opacity={0.55} />
      {/* Pec nipples */}
      <circle cx={-32} cy={6} r={2.5} fill="#0A0A0F" />
      <circle cx={32} cy={6} r={2.5} fill="#0A0A0F" />
      {/* Sternum line */}
      <line x1={0} y1={-2} x2={0} y2={120} stroke="#0A0A0F" strokeWidth={3} />

      {/* 8-pack (sigma has 8 not 6) */}
      <rect x={-22} y={20} width={20} height={22} rx={3} fill="none" stroke="#0A0A0F" strokeWidth={2.5} />
      <rect x={2} y={20} width={20} height={22} rx={3} fill="none" stroke="#0A0A0F" strokeWidth={2.5} />
      <rect x={-22} y={46} width={20} height={22} rx={3} fill="none" stroke="#0A0A0F" strokeWidth={2.5} />
      <rect x={2} y={46} width={20} height={22} rx={3} fill="none" stroke="#0A0A0F" strokeWidth={2.5} />
      <rect x={-22} y={72} width={20} height={22} rx={3} fill="none" stroke="#0A0A0F" strokeWidth={2.5} />
      <rect x={2} y={72} width={20} height={22} rx={3} fill="none" stroke="#0A0A0F" strokeWidth={2.5} />
      <rect x={-20} y={98} width={18} height={20} rx={3} fill="none" stroke="#0A0A0F" strokeWidth={2.5} />
      <rect x={2} y={98} width={18} height={20} rx={3} fill="none" stroke="#0A0A0F" strokeWidth={2.5} />
      {/* Ab shadows */}
      {[32, 58, 84].map((y, i) => (
        <line key={i} x1={-22} y1={y} x2={22} y2={y} stroke={shadowColor} strokeWidth={3} opacity={0.5} />
      ))}

      {/* V-line obliques extreme */}
      <path d="M -52 100 Q -24 130 -4 138" stroke="#0A0A0F" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M 52 100 Q 24 130 4 138" stroke="#0A0A0F" strokeWidth={3.5} fill="none" strokeLinecap="round" />

      {/* Arms — yoked, swing opposite to legs when walking */}
      <path d={`M -78 -20 Q -108 15 ${-102 + armSwing * 0.3} 65 Q ${-92 + armSwing * 0.6} 110 ${-76 + armSwing} 135`} stroke={skinColor} strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d={`M -78 -20 Q -108 15 ${-102 + armSwing * 0.3} 65 Q ${-92 + armSwing * 0.6} 110 ${-76 + armSwing} 135`} stroke="#0A0A0F" strokeWidth={4} fill="none" />
      <path d="M -94 10 Q -112 30 -102 60" stroke="#0A0A0F" strokeWidth={3} fill="none" opacity={0.8} />
      <path d="M -88 25 Q -104 40 -98 60" stroke={shadowColor} strokeWidth={5} fill="none" opacity={0.5} />

      <path d={`M 78 -20 Q 108 15 ${102 - armSwing * 0.3} 65 Q ${92 - armSwing * 0.6} 110 ${76 - armSwing} 135`} stroke={skinColor} strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d={`M 78 -20 Q 108 15 ${102 - armSwing * 0.3} 65 Q ${92 - armSwing * 0.6} 110 ${76 - armSwing} 135`} stroke="#0A0A0F" strokeWidth={4} fill="none" />
      <path d="M 94 10 Q 112 30 102 60" stroke="#0A0A0F" strokeWidth={3} fill="none" opacity={0.8} />
      <path d="M 88 25 Q 104 40 98 60" stroke={shadowColor} strokeWidth={5} fill="none" opacity={0.5} />

      {/* Fists swing with arms */}
      <circle cx={-76 + armSwing} cy={140} r={14} fill={skinColor} stroke="#0A0A0F" strokeWidth={4} />
      <circle cx={76 - armSwing} cy={140} r={14} fill={skinColor} stroke="#0A0A0F" strokeWidth={4} />

      {/* Thick neck */}
      <path d="M -20 -48 L -24 -72 L 24 -72 L 20 -48 Z" fill={skinColor} stroke="#0A0A0F" strokeWidth={4} />
      {/* Sternocleidomastoid */}
      <line x1={-14} y1={-70} x2={-10} y2={-50} stroke="#0A0A0F" strokeWidth={2} opacity={0.55} />
      <line x1={14} y1={-70} x2={10} y2={-50} stroke="#0A0A0F" strokeWidth={2} opacity={0.55} />
    </g>
  );
};

const SigmaHero: React.FC<{ x: number; y: number; scale: number; phase: number }> = ({ x, y, scale, phase }) => {
  const SKIN = "#C8C4BE";
  const SHADOW = "#3A3A42";
  const HAIR = "#0A0A0F";
  return (
    <g>
      <SigmaBody x={x} y={y} scale={scale} phase={phase} skinColor={SKIN} shadowColor={SHADOW} />
      <g transform={`translate(${x}, ${y - (75 * scale) * 1}) scale(${scale})`} />
      <SigmaHead x={x} y={y - 72 * scale} scale={scale} skinColor={SKIN} hairColor={HAIR} shadowColor={SHADOW} />
    </g>
  );
};

// Sigma poster background — steel blue-grey with SIGMA text
const BgSigmaPoster: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="sigmaBg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3A3F48" />
        <stop offset="100%" stopColor="#1A1D24" />
      </linearGradient>
      <filter id="posterGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
        <feColorMatrix values="0 0 0 0 0.8  0 0 0 0 0.8  0 0 0 0 0.85  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="sigmaSpot" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#6A7080" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#6A7080" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#sigmaBg)" />
    <rect width={W} height={H} fill="url(#sigmaSpot)" />
    {/* Big SIGMA text behind */}
    <text
      x={W/2}
      y={380}
      fontSize={260}
      fill="#4A5060"
      textAnchor="middle"
      fontFamily="'EB Garamond', Georgia, serif"
      fontWeight={700}
      letterSpacing="12"
      opacity={0.75}
    >
      SIGMA
    </text>
    <text
      x={W/2}
      y={430}
      fontSize={28}
      fill="#A8B0C0"
      textAnchor="middle"
      fontFamily="'Be Vietnam Pro', sans-serif"
      fontWeight={400}
      letterSpacing="10"
      opacity={0.7}
    >
      — THE GRINDSET —
    </text>
    <rect width={W} height={H} filter="url(#posterGrain)" opacity={0.5} />
  </svg>
);

export const FigStyleSigma: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BgSigmaPoster />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <SigmaHero x={540} y={1100} scale={1.7} phase={frame / 12} />
      </svg>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <text x={W/2} y={H - 180} fontSize={26} fill="#A8B0C0" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} letterSpacing="3" opacity={0.85}>
          chiseled · undercut · 8-pack · smirk
        </text>
        <line x1={W/2 - 100} y1={H - 145} x2={W/2 + 100} y2={H - 145} stroke="#A8B0C0" strokeWidth={1} opacity={0.5} />
      </svg>
    </AbsoluteFill>
  );
};

export const FigStyleSigmaFace: React.FC = () => {
  return (
    <AbsoluteFill>
      <BgSigmaPoster />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <SigmaHead x={540} y={1300} scale={5.0} skinColor="#C8C4BE" hairColor="#0A0A0F" shadowColor="#3A3A42" />
      </svg>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <text x={W/2} y={H - 180} fontSize={26} fill="#A8B0C0" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} letterSpacing="3" opacity={0.85}>
          V-jaw · slicked back · intense eyes
        </text>
        <line x1={W/2 - 100} y1={H - 145} x2={W/2 + 100} y2={H - 145} stroke="#A8B0C0" strokeWidth={1} opacity={0.5} />
      </svg>
    </AbsoluteFill>
  );
};

// Face closeup preview
export const FigStyleHeroFace: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BgGoldenHour />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <HeroYou x={540} y={1500} scale={5.5} phase={frame / 10} skinColor={CREAM} hairColor="#1A1A1A" />
      </svg>
      <Label title="FACE STUDY" subtitle="side-part · anime almond" tagline="left fringe falls · right swept up" />
    </AbsoluteFill>
  );
};

export const FigStyleReader: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <BgGoldenHour />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Reader x={540} y={1270} scale={3.2} phase={frame / 8} color={CREAM} bookColor={GOLD} />
      </svg>
      <Label title="THE READER" subtitle="người đọc" tagline="always carries a book · signature for book content" />
    </AbsoluteFill>
  );
};
