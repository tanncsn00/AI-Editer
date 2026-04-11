import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import wordsData from "./gtl_tap_01_words.json";

loadEBGaramond("normal", { weights: ["500","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// GIẢI THÍCH KIỂU LƯỜI · Tập 1 — Blueprint Chalk Style v2
// 90s · single voice minhkhang
// Rich tableau scenes with environment details

const FPS = 30;
const W = 1080;
const H = 1920;
const BG_DEEP = "#050E1E";
const BG_MID = "#0A1838";
const BG_GLOW = "#1E4878";
const CHALK = "#F5F7FA";
const DIM = "#7090B0";
const YELLOW = "#FFD93D";
const RED = "#FF5542";

type Word = { word: string; start: number; end: number };
const words = wordsData as Word[];
type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  for (const w of words) {
    buf.push(w);
    if (/[.!?]$/.test(w.word)) {
      out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
      buf = [];
    }
  }
  if (buf.length) out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
  return out;
})();

const T = {
  hook:  [0.0, 10.0] as const,
  bay1:  [10.0, 32.0] as const,
  bay2:  [32.0, 54.2] as const,
  bay3:  [54.2, 72.3] as const,
  bay4:  [72.3, 98.2] as const,
  bay5:  [98.2, 120.0] as const,
  punch: [120.0, 130.6] as const,
  outro: [130.6, 135.0] as const,
};
const inRange = (t: number, r: readonly [number, number]) => t >= r[0] && t < r[1];

// ---------- GLOBAL DEFS ----------
const Defs: React.FC = () => (
  <defs>
    <radialGradient id="bpGlow" cx="50%" cy="52%" r="58%">
      <stop offset="0%" stopColor={BG_GLOW} stopOpacity="1" />
      <stop offset="55%" stopColor={BG_MID} stopOpacity="1" />
      <stop offset="100%" stopColor={BG_DEEP} stopOpacity="1" />
    </radialGradient>
    <filter id="chalkGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="chalkGlowStrong" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3.5" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="chalkGrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
      <feColorMatrix values="0 0 0 0 0.95  0 0 0 0 0.97  0 0 0 0 1  0 0 0 0.08 0" />
    </filter>
    <radialGradient id="vigEdge" cx="50%" cy="50%" r="78%">
      <stop offset="55%" stopColor="#000" stopOpacity="0" />
      <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
    </radialGradient>
  </defs>
);

// ---------- STICK FIGURE helper ----------
const stick = (opts: {
  cx: number; cy: number; scale?: number;
  pose?: "sit" | "stand" | "slump" | "reach";
  prop?: "glasses" | "hat" | "smoke" | "belly" | "none";
  speaking?: boolean;
  phase?: number;
}) => {
  const { cx, cy, scale = 1, pose = "stand", prop = "none", speaking = false, phase = 0 } = opts;
  const bob = Math.sin((phase || 0) / 2.5) * (speaking ? 2.5 : 1);
  const mouthOpen = speaking && Math.sin(phase * 6) > 0;
  const blinkCycle = (phase * 2) % 8;
  const blinking = blinkCycle < 0.3;

  const legStance = pose === "sit" ? { l1: [-18, 40], l2: [18, 40] } : { l1: [-14, 70], l2: [14, 70] };

  return (
    <g transform={`translate(${cx}, ${cy + bob}) scale(${scale})`}>
      {/* Head */}
      <circle cx={0} cy={-85} r={22} fill="none" stroke={CHALK} strokeWidth={4} />
      {/* Glasses variant for Cục Gạch */}
      {prop === "glasses" && (
        <>
          <rect x={-14} y={-90} width={10} height={10} fill="none" stroke={CHALK} strokeWidth={2.5} />
          <rect x={4} y={-90} width={10} height={10} fill="none" stroke={CHALK} strokeWidth={2.5} />
          <line x1={-4} y1={-86} x2={4} y2={-86} stroke={CHALK} strokeWidth={2} />
        </>
      )}
      {/* Hat for Nón Cối */}
      {prop === "hat" && (
        <path d="M -32 -102 L 0 -134 L 32 -102 Z" fill="none" stroke={CHALK} strokeWidth={3} />
      )}
      {/* Cigarette smoke for Thuốc Lá */}
      {prop === "smoke" && (
        <>
          <line x1={-28} y1={-86} x2={-40} y2={-84} stroke={CHALK} strokeWidth={3} strokeLinecap="round" />
          <path d="M -44 -90 Q -48 -100 -40 -108 Q -50 -116 -42 -126" stroke={CHALK} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.7} />
        </>
      )}
      {/* Belly for Bát Phở */}
      {prop === "belly" && (
        <path d="M 0 -55 Q 20 -35 22 -5 Q 20 15 0 20" stroke={CHALK} strokeWidth={4} fill="none" strokeLinecap="round" />
      )}
      {/* Eyes */}
      {!blinking ? (
        <>
          <line x1={-10} y1={-86} x2={-5} y2={-86} stroke={CHALK} strokeWidth={3} strokeLinecap="round" />
          <line x1={5} y1={-86} x2={10} y2={-86} stroke={CHALK} strokeWidth={3} strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M -10 -85 Q -7 -82 -4 -85" stroke={CHALK} strokeWidth={2.5} fill="none" />
          <path d="M 4 -85 Q 7 -82 10 -85" stroke={CHALK} strokeWidth={2.5} fill="none" />
        </>
      )}
      {/* Mouth */}
      {speaking && mouthOpen ? (
        <ellipse cx={0} cy={-74} rx={5} ry={3} fill={CHALK} />
      ) : (
        <line x1={-5} y1={-75} x2={5} y2={-75} stroke={CHALK} strokeWidth={3} strokeLinecap="round" />
      )}
      {/* Body (unless belly replaced it) */}
      {prop !== "belly" && (
        <line x1={0} y1={-60} x2={0} y2={0} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
      )}
      {/* Arms */}
      {pose === "reach" ? (
        <>
          <line x1={0} y1={-40} x2={30} y2={-50} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <line x1={0} y1={-40} x2={-22} y2={-10} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
        </>
      ) : pose === "slump" ? (
        <>
          <line x1={0} y1={-40} x2={-18} y2={10} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <line x1={0} y1={-40} x2={22} y2={20} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1={0} y1={-40} x2={-22} y2={10} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <line x1={0} y1={-40} x2={22} y2={10} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
        </>
      )}
      {/* Legs */}
      <line x1={0} y1={0} x2={legStance.l1[0]} y2={legStance.l1[1]} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
      <line x1={0} y1={0} x2={legStance.l2[0]} y2={legStance.l2[1]} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

// ---------- COMMON: Title bar top ----------
const TitleBar: React.FC = () => (
  <g>
    <text
      x={W/2}
      y={240}
      fontSize={56}
      fill={YELLOW}
      textAnchor="middle"
      fontFamily="'Be Vietnam Pro', sans-serif"
      fontWeight={800}
      letterSpacing="2"
      stroke={RED}
      strokeWidth={2}
      paintOrder="stroke"
    >
      GIẢI THÍCH KIỂU LƯỜI
    </text>
  </g>
);

// ---------- SCENES ----------

// SCENE 1 — HOOK — ATM room
const SceneHook: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 2;
  return (
    <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
      {/* Floor */}
      <line x1={80} y1={1420} x2={W - 80} y2={1420} strokeWidth={4} />
      {/* ATM machine */}
      <g>
        <rect x={180} y={780} width={340} height={620} fill="none" strokeWidth={4} />
        {/* Screen */}
        <rect x={210} y={830} width={280} height={170} fill="none" strokeWidth={3} />
        <text x={350} y={900} fontSize={28} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>SỐ DƯ</text>
        <text x={350} y={960} fontSize={52} fill={RED} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={800}>0 đ</text>
        {/* Keypad */}
        {[0, 1, 2, 3].map(row =>
          [0, 1, 2].map(col => (
            <rect key={`${row}-${col}`} x={240 + col * 70} y={1040 + row * 60} width={50} height={44} fill="none" strokeWidth={2.5} />
          ))
        )}
        {/* Card slot */}
        <rect x={230} y={1300} width={260} height={14} fill="none" strokeWidth={3} />
        <text x={350} y={1350} fontSize={16} fill={DIM} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif">INSERT CARD</text>
      </g>

      {/* Receipt flying out with dust */}
      <g transform="translate(560, 1050)">
        <rect x={0} y={-8} width={140} height={18} fill="none" strokeWidth={2.5} />
        <line x1={14} y1={0} x2={120} y2={0} strokeWidth={1.5} opacity={0.6} />
        <line x1={14} y1={4} x2={100} y2={4} strokeWidth={1.5} opacity={0.6} />
      </g>
      <g transform="translate(610, 1110) rotate(20)">
        <rect x={0} y={-8} width={120} height={18} fill="none" strokeWidth={2} opacity={0.55} />
      </g>

      {/* Character Cục Gạch looking at ATM */}
      {stick({ cx: 800, cy: 1420, scale: 2.8, pose: "stand", prop: "glasses", speaking: true, phase })}

      {/* Money flying away — tiny $ symbols with arrows */}
      {[[900, 900], [960, 850], [820, 780]].map(([mx, my], i) => (
        <g key={i} transform={`translate(${mx}, ${my})`}>
          <rect x={-20} y={-12} width={40} height={24} fill="none" strokeWidth={2} opacity={0.6} />
          <text x={0} y={6} fontSize={18} fill={CHALK} textAnchor="middle" fontWeight="bold" opacity={0.6}>$</text>
          <line x1={0} y1={-20} x2={-6} y2={-40} strokeWidth={2} opacity={0.5} />
          <line x1={-6} y1={-40} x2={-12} y2={-34} strokeWidth={2} opacity={0.5} />
          <line x1={-6} y1={-40} x2={0} y2={-36} strokeWidth={2} opacity={0.5} />
        </g>
      ))}

      {/* Wall lights */}
      <circle cx={200} cy={720} r={14} fill="none" strokeWidth={2} opacity={0.5} />
      <line x1={200} y1={740} x2={200} y2={780} strokeWidth={2} opacity={0.5} />
      <circle cx={880} cy={720} r={14} fill="none" strokeWidth={2} opacity={0.5} />
      <line x1={880} y1={740} x2={880} y2={780} strokeWidth={2} opacity={0.5} />
    </g>
  );
};

// SCENE 2 — BẪY 1 — Dân dã VN items (cà phê, trà sữa, nhậu, son, vé số)
const SceneBay1: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 2;
  return (
    <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
      {/* Floor line */}
      <line x1={80} y1={1520} x2={W - 80} y2={1520} strokeWidth={4} />
      {/* Wall line */}
      <line x1={80} y1={640} x2={W - 80} y2={640} strokeWidth={2} opacity={0.5} />

      {/* Low table spread of items */}
      <g transform="translate(540, 1420)">
        {/* Table top */}
        <rect x={-420} y={-10} width={840} height={16} fill="none" strokeWidth={4} />
        <line x1={-410} y1={6} x2={-410} y2={80} strokeWidth={3} />
        <line x1={410} y1={6} x2={410} y2={80} strokeWidth={3} />
      </g>

      {/* Item 1 — Cà phê sáng (coffee mug steaming) */}
      {(() => {
        const appear = spring({ frame: lf - 0 * 14, fps: FPS, config: { damping: 12, stiffness: 180 } });
        return (
          <g transform={`translate(200, 1340) scale(${appear})`}>
            {/* Mug */}
            <path d="M -30 -40 L -30 30 Q -25 40 0 40 Q 25 40 30 30 L 30 -40 Z" fill="none" strokeWidth={3.5} />
            <ellipse cx={0} cy={-40} rx={30} ry={6} fill="none" strokeWidth={3} />
            <path d="M 30 -24 Q 48 -18 48 -4 Q 48 10 30 8" fill="none" strokeWidth={3} />
            {/* Steam */}
            <path d="M -12 -54 Q -8 -66 -12 -78" strokeWidth={2} fill="none" opacity={0.55} />
            <path d="M 4 -54 Q 8 -66 4 -78" strokeWidth={2} fill="none" opacity={0.55} />
            {/* Label */}
            <text x={0} y={80} fontSize={22} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>cà phê sáng</text>
            <text x={0} y={108} fontSize={28} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={800}>40k</text>
          </g>
        );
      })()}

      {/* Item 2 — Trà sữa (bubble tea cup) */}
      {(() => {
        const appear = spring({ frame: lf - 1 * 14, fps: FPS, config: { damping: 12, stiffness: 180 } });
        return (
          <g transform={`translate(390, 1340) scale(${appear})`}>
            {/* Cup */}
            <path d="M -26 -50 L -32 40 Q -28 46 0 46 Q 28 46 32 40 L 26 -50 Z" fill="none" strokeWidth={3.5} />
            <ellipse cx={0} cy={-50} rx={26} ry={5} fill="none" strokeWidth={3} />
            {/* Dome lid */}
            <path d="M -26 -50 Q 0 -64 26 -50" strokeWidth={3} fill="none" />
            {/* Straw */}
            <line x1={6} y1={-64} x2={14} y2={-30} strokeWidth={3} />
            {/* Pearls */}
            <circle cx={-8} cy={20} r={3} fill={CHALK} opacity={0.7} />
            <circle cx={4} cy={24} r={3} fill={CHALK} opacity={0.7} />
            <circle cx={-2} cy={12} r={3} fill={CHALK} opacity={0.7} />
            <circle cx={10} cy={10} r={3} fill={CHALK} opacity={0.7} />
            <text x={0} y={88} fontSize={22} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>trà sữa</text>
            <text x={0} y={116} fontSize={28} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={800}>55k</text>
          </g>
        );
      })()}

      {/* Item 3 — Chai bia nhậu */}
      {(() => {
        const appear = spring({ frame: lf - 2 * 14, fps: FPS, config: { damping: 12, stiffness: 180 } });
        return (
          <g transform={`translate(580, 1340) scale(${appear})`}>
            {/* Bottle */}
            <path d="M -10 -80 L -10 -50 Q -22 -40 -22 -20 L -22 50 Q -18 56 0 56 Q 18 56 22 50 L 22 -20 Q 22 -40 10 -50 L 10 -80 Z" fill="none" strokeWidth={3.5} />
            {/* Cap */}
            <rect x={-10} y={-88} width={20} height={8} fill="none" strokeWidth={3} />
            {/* Label */}
            <rect x={-18} y={-10} width={36} height={36} fill="none" strokeWidth={2} />
            <text x={0} y={14} fontSize={14} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BIA</text>
            {/* Foam/drops */}
            <path d="M -14 -76 Q -18 -86 -14 -94" strokeWidth={1.5} fill="none" opacity={0.55} />
            <path d="M 14 -76 Q 18 -86 14 -94" strokeWidth={1.5} fill="none" opacity={0.55} />
            <text x={0} y={98} fontSize={22} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhậu</text>
            <text x={0} y={126} fontSize={28} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={800}>400k</text>
          </g>
        );
      })()}

      {/* Item 4 — Son (lipstick tube) */}
      {(() => {
        const appear = spring({ frame: lf - 3 * 14, fps: FPS, config: { damping: 12, stiffness: 180 } });
        return (
          <g transform={`translate(760, 1340) scale(${appear})`}>
            {/* Cap */}
            <rect x={-14} y={-80} width={28} height={50} fill="none" strokeWidth={3} />
            <line x1={-12} y1={-65} x2={12} y2={-65} strokeWidth={2} opacity={0.6} />
            {/* Base */}
            <rect x={-16} y={-30} width={32} height={70} fill="none" strokeWidth={3.5} />
            {/* Ring */}
            <line x1={-16} y1={-20} x2={16} y2={-20} strokeWidth={2.5} />
            {/* Lipstick tip (when open concept — here it's closed) */}
            <text x={0} y={82} fontSize={22} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>son mới</text>
            <text x={0} y={110} fontSize={28} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={800}>500k</text>
          </g>
        );
      })()}

      {/* Item 5 — Vé số (lottery ticket) */}
      {(() => {
        const appear = spring({ frame: lf - 4 * 14, fps: FPS, config: { damping: 12, stiffness: 180 } });
        return (
          <g transform={`translate(940, 1340) scale(${appear}) rotate(-8)`}>
            {/* Ticket */}
            <rect x={-50} y={-30} width={100} height={60} fill="none" strokeWidth={3} />
            <line x1={-50} y1={-12} x2={50} y2={-12} strokeWidth={2} opacity={0.6} />
            <text x={0} y={-16} fontSize={11} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>VÉ SỐ</text>
            <text x={0} y={10} fontSize={18} fill={CHALK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={800}>8 8 8</text>
            <text x={0} y={24} fontSize={8} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" opacity={0.7}>CHIỀU</text>
            {/* Tear edge */}
            <line x1={-50} y1={-30} x2={-50} y2={30} strokeWidth={1.5} strokeDasharray="2 2" opacity={0.5} />
            <text x={0} y={90} fontSize={22} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} transform="rotate(8 0 90)">vé số</text>
            <text x={0} y={118} fontSize={28} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={800} transform="rotate(8 0 118)">10k × ngày</text>
          </g>
        );
      })()}

      {/* Total brace + sum */}
      <path d="M 120 1240 Q 80 1180 120 1120" strokeWidth={3} fill="none" opacity={0.7} />
      <text x={260} y={1000} fontSize={32} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic">
        = 4 triệu rưỡi
      </text>
      <text x={260} y={1040} fontSize={24} fill={CHALK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontStyle="italic" opacity={0.8}>
        mỗi tháng
      </text>

      {/* Character Cục Gạch on left looking at mess */}
      {stick({ cx: 180, cy: 1320, scale: 1.9, pose: "stand", prop: "glasses", speaking: true, phase })}
    </g>
  );
};

// SCENE 3 — BẪY 2 — Desk with unopened courses
const SceneBay2: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 2;
  return (
    <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
      {/* Floor */}
      <line x1={80} y1={1520} x2={W - 80} y2={1520} strokeWidth={4} />
      {/* Wall clock */}
      <circle cx={880} cy={780} r={42} fill="none" strokeWidth={3} />
      <line x1={880} y1={780} x2={880} y2={748} strokeWidth={3} />
      <line x1={880} y1={780} x2={905} y2={795} strokeWidth={3} />
      <line x1={880} y1={742} x2={880} y2={748} strokeWidth={2} />
      <line x1={918} y1={780} x2={912} y2={780} strokeWidth={2} />
      <line x1={880} y1={818} x2={880} y2={812} strokeWidth={2} />
      <line x1={842} y1={780} x2={848} y2={780} strokeWidth={2} />

      {/* Desk */}
      <g>
        <line x1={160} y1={1180} x2={780} y2={1180} strokeWidth={4} />
        <line x1={160} y1={1180} x2={160} y2={1520} strokeWidth={4} />
        <line x1={780} y1={1180} x2={780} y2={1520} strokeWidth={4} />
        {/* Drawer */}
        <rect x={180} y={1210} width={580} height={80} fill="none" strokeWidth={3} />
        <circle cx={470} cy={1250} r={4} fill={CHALK} />
      </g>

      {/* Laptop open */}
      <g>
        <path d="M 260 1100 L 240 1180 L 580 1180 L 560 1100 Z" fill="none" strokeWidth={3} />
        <rect x={220} y={900} width={380} height={200} fill="none" strokeWidth={4} />
        {/* Screen: incomplete course */}
        <line x1={240} y1={950} x2={460} y2={950} strokeWidth={2} />
        <text x={240} y={990} fontSize={20} fill={CHALK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>COURSE 1</text>
        <rect x={240} y={1000} width={340} height={10} fill="none" strokeWidth={2} />
        <rect x={240} y={1000} width={34} height={10} fill={CHALK} />
        <text x={240} y={1040} fontSize={16} fill={RED} fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic">10% · UNFINISHED</text>
        <rect x={240} y={1060} width={340} height={8} fill="none" strokeWidth={1.5} opacity={0.4} />
      </g>

      {/* Stack of books (unread courses) */}
      <g transform="translate(680, 1100)">
        <rect x={-60} y={0} width={120} height={22} fill="none" strokeWidth={3} />
        <text x={0} y={16} fontSize={12} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif">KHOÁ HỌC 2</text>
        <rect x={-66} y={-22} width={120} height={22} fill="none" strokeWidth={3} />
        <text x={-6} y={-6} fontSize={12} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif">KHOÁ HỌC 3</text>
        <rect x={-56} y={-44} width={120} height={22} fill="none" strokeWidth={3} />
        <text x={4} y={-28} fontSize={12} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif">KHOÁ HỌC 4</text>
        {/* Dust particles */}
        {[[-50, -60], [-20, -68], [30, -72], [50, -58]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={2} fill={CHALK} opacity={0.5} />
        ))}
      </g>

      {/* Coffee mug */}
      <g transform="translate(200, 1120)">
        <path d="M -25 -40 L -25 -6 Q -20 6 0 6 Q 20 6 25 -6 L 25 -40 Z" fill="none" strokeWidth={3} />
        <ellipse cx={0} cy={-40} rx={25} ry={5} fill="none" strokeWidth={3} />
        <path d="M 25 -30 Q 40 -26 40 -16 Q 40 -6 25 -10" fill="none" strokeWidth={3} />
        {/* Steam lines */}
        <path d="M -10 -48 Q -6 -58 -10 -68" strokeWidth={2} fill="none" opacity={0.5} />
        <path d="M 4 -48 Q 8 -58 4 -68" strokeWidth={2} fill="none" opacity={0.5} />
      </g>

      {/* Character Thuốc Lá at desk — behind desk */}
      {stick({ cx: 450, cy: 1100, scale: 2.4, pose: "reach", prop: "smoke", speaking: true, phase })}

      {/* Money flying away */}
      {[[880, 1080, -15], [940, 1150, 10], [840, 1180, -5]].map(([mx, my, r], i) => (
        <g key={i} transform={`translate(${mx}, ${my}) rotate(${r})`} opacity={0.55}>
          <rect x={-20} y={-12} width={40} height={24} fill="none" strokeWidth={2} />
          <text x={0} y={6} fontSize={16} fill={CHALK} textAnchor="middle" fontWeight="bold">$</text>
        </g>
      ))}
    </g>
  );
};

// SCENE 4 — BẪY 3 — Kitchen with leftover + lonely eater (from prototype)
const SceneBay3: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 2;
  return (
    <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
      {/* Floor */}
      <line x1={80} y1={1500} x2={W - 80} y2={1500} strokeWidth={4} />
      {/* Wall lines */}
      <line x1={120} y1={640} x2={120} y2={1500} strokeWidth={2} opacity={0.5} />

      {/* Fridge with leftover tupperware */}
      <g>
        <rect x={170} y={800} width={260} height={580} fill="none" strokeWidth={4} />
        <line x1={170} y1={1000} x2={430} y2={1000} strokeWidth={3} />
        <rect x={395} y={840} width={10} height={60} fill="none" strokeWidth={2} />
        <rect x={395} y={1050} width={10} height={60} fill="none" strokeWidth={2} />
        {/* Top shelf: bottle + egg */}
        <rect x={204} y={880} width={32} height={50} fill="none" strokeWidth={2} />
        <rect x={260} y={850} width={18} height={80} fill="none" strokeWidth={2} />
        <ellipse cx={340} cy={920} rx={10} ry={13} fill="none" strokeWidth={2} />
        {/* Tupperware */}
        <rect x={200} y={1060} width={70} height={50} fill="none" strokeWidth={2.5} />
        <rect x={290} y={1080} width={80} height={60} fill="none" strokeWidth={2.5} />
        <rect x={200} y={1140} width={100} height={50} fill="none" strokeWidth={2.5} />
        <rect x={320} y={1160} width={60} height={80} fill="none" strokeWidth={2.5} />
        <rect x={200} y={1210} width={60} height={60} fill="none" strokeWidth={2.5} />
        <rect x={280} y={1250} width={100} height={50} fill="none" strokeWidth={2.5} />
        {/* Content marks */}
        <line x1={215} y1={1075} x2={255} y2={1075} strokeWidth={1.5} opacity={0.6} />
        <line x1={305} y1={1095} x2={355} y2={1095} strokeWidth={1.5} opacity={0.6} />
        <line x1={215} y1={1225} x2={245} y2={1225} strokeWidth={1.5} opacity={0.6} />
        {/* Cold mist */}
        <path d="M 250 780 Q 240 760 260 740" strokeWidth={1.5} fill="none" opacity={0.5} />
        <path d="M 310 780 Q 320 760 300 740" strokeWidth={1.5} fill="none" opacity={0.5} />
      </g>

      {/* Cat on top of fridge */}
      <g opacity={0.7}>
        <ellipse cx={280} cy={790} rx={40} ry={10} fill="none" strokeWidth={2} />
        <circle cx={250} cy={775} r={10} fill="none" strokeWidth={2} />
        <path d="M 244 770 L 240 762 L 246 768" strokeWidth={2} fill="none" />
        <path d="M 256 770 L 260 762 L 254 768" strokeWidth={2} fill="none" />
        <path d="M 310 790 Q 330 760 320 745" strokeWidth={2} fill="none" />
      </g>

      {/* Window + moon */}
      <g opacity={0.65}>
        <rect x={700} y={700} width={220} height={180} fill="none" strokeWidth={3} />
        <line x1={810} y1={700} x2={810} y2={880} strokeWidth={2} />
        <line x1={700} y1={790} x2={920} y2={790} strokeWidth={2} />
        <circle cx={760} cy={760} r={22} fill="none" strokeWidth={2} />
        <circle cx={754} cy={755} r={5} fill="none" strokeWidth={1.5} />
      </g>

      {/* Wall clock */}
      <g opacity={0.7}>
        <circle cx={610} cy={760} r={35} fill="none" strokeWidth={3} />
        <line x1={610} y1={760} x2={610} y2={735} strokeWidth={3} />
        <line x1={610} y1={760} x2={625} y2={770} strokeWidth={3} />
      </g>

      {/* Dining table */}
      <g>
        <line x1={540} y1={1200} x2={940} y2={1200} strokeWidth={4} />
        <line x1={560} y1={1200} x2={560} y2={1380} strokeWidth={4} />
        <line x1={920} y1={1200} x2={920} y2={1380} strokeWidth={4} />
        <line x1={560} y1={1380} x2={560} y2={1460} strokeWidth={3} />
        <line x1={920} y1={1380} x2={920} y2={1460} strokeWidth={3} />

        {/* Bowl of leftover rice */}
        <ellipse cx={660} cy={1200} rx={56} ry={12} fill="none" strokeWidth={3} />
        <path d="M 604 1200 Q 604 1240 660 1248 Q 716 1240 716 1200" fill="none" strokeWidth={3} />
        <path d="M 620 1196 Q 640 1186 660 1196 Q 680 1186 700 1196" strokeWidth={2} fill="none" />
        {/* Steam weak */}
        <path d="M 660 1185 Q 655 1170 665 1155" strokeWidth={1.5} fill="none" opacity={0.5} />

        {/* Plate with leftover */}
        <ellipse cx={820} cy={1195} rx={54} ry={10} fill="none" strokeWidth={3} />
        <path d="M 766 1195 Q 766 1218 820 1222 Q 874 1218 874 1195" fill="none" strokeWidth={2.5} />
        <ellipse cx={800} cy={1200} rx={10} ry={4} fill="none" strokeWidth={2} />
        <ellipse cx={828} cy={1204} rx={12} ry={4} fill="none" strokeWidth={2} />

        {/* Chopsticks */}
        <line x1={710} y1={1185} x2={760} y2={1160} strokeWidth={3} />
        <line x1={714} y1={1192} x2={762} y2={1166} strokeWidth={3} />

        {/* Water glass */}
        <rect x={555} y={1160} width={30} height={40} fill="none" strokeWidth={2.5} />
      </g>

      {/* Character sitting tired at table */}
      {stick({ cx: 760, cy: 1300, scale: 1.7, pose: "slump", prop: "belly", speaking: true, phase })}
    </g>
  );
};

// SCENE 5 — BẪY 4 — Bicycle vs PCX showroom
const SceneBay4: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 2;
  return (
    <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
      {/* Showroom floor */}
      <line x1={80} y1={1520} x2={W - 80} y2={1520} strokeWidth={4} />
      {/* Showroom back wall */}
      <line x1={80} y1={640} x2={W - 80} y2={640} strokeWidth={2} opacity={0.5} />
      {/* Spotlights */}
      {[260, 540, 820].map((sx, i) => (
        <g key={i}>
          <circle cx={sx} cy={680} r={16} fill="none" strokeWidth={2} opacity={0.55} />
          <line x1={sx - 80} y1={760} x2={sx + 80} y2={760} strokeWidth={1.5} opacity={0.3} />
          <line x1={sx - 100} y1={820} x2={sx + 100} y2={820} strokeWidth={1} opacity={0.2} />
        </g>
      ))}

      {/* LEFT — bicycle */}
      <g transform="translate(260, 1200)">
        <circle cx={-70} cy={100} r={60} fill="none" strokeWidth={4} />
        <circle cx={70} cy={100} r={60} fill="none" strokeWidth={4} />
        <circle cx={-70} cy={100} r={5} fill="none" strokeWidth={2} />
        <circle cx={70} cy={100} r={5} fill="none" strokeWidth={2} />
        {/* Spokes */}
        <line x1={-70} y1={40} x2={-70} y2={160} strokeWidth={1.5} opacity={0.5} />
        <line x1={-130} y1={100} x2={-10} y2={100} strokeWidth={1.5} opacity={0.5} />
        <line x1={10} y1={100} x2={130} y2={100} strokeWidth={1.5} opacity={0.5} />
        <line x1={70} y1={40} x2={70} y2={160} strokeWidth={1.5} opacity={0.5} />
        {/* Frame */}
        <line x1={-70} y1={100} x2={0} y2={30} strokeWidth={5} />
        <line x1={0} y1={30} x2={70} y2={100} strokeWidth={5} />
        <line x1={0} y1={30} x2={-20} y2={100} strokeWidth={5} />
        {/* Seat */}
        <line x1={-30} y1={20} x2={-10} y2={20} strokeWidth={4} />
        <line x1={-20} y1={20} x2={-20} y2={40} strokeWidth={3} />
        {/* Handle */}
        <line x1={0} y1={30} x2={10} y2={-10} strokeWidth={4} />
        <line x1={-10} y1={-10} x2={30} y2={-10} strokeWidth={4} />
        {/* Label */}
        <text x={0} y={220} fontSize={28} fill={CHALK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600}>
          xe đạp
        </text>
        <text x={0} y={256} fontSize={32} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic">
          0 đ nợ
        </text>
      </g>

      {/* CENTER — Nón Cối character */}
      {stick({ cx: 540, cy: 1520, scale: 2.4, pose: "stand", prop: "hat", speaking: true, phase })}

      {/* RIGHT — PCX motorbike */}
      <g transform="translate(830, 1200)">
        <path d="M -100 40 Q -110 0 -60 -20 L 40 -20 Q 70 -20 80 10 L 90 50 Q 50 70 -40 70 Q -90 60 -100 40 Z" fill="none" strokeWidth={4} />
        {/* Seat */}
        <path d="M -40 -20 L 40 -20 L 40 -8 L -40 -8 Z" fill="none" strokeWidth={3} />
        {/* Wheels */}
        <circle cx={-70} cy={70} r={40} fill="none" strokeWidth={5} />
        <circle cx={70} cy={70} r={40} fill="none" strokeWidth={5} />
        <circle cx={-70} cy={70} r={4} fill="none" strokeWidth={2} />
        <circle cx={70} cy={70} r={4} fill="none" strokeWidth={2} />
        {/* Headlight */}
        <circle cx={75} cy={5} r={8} fill="none" strokeWidth={3} />
        {/* Mirror */}
        <line x1={-30} y1={-20} x2={-38} y2={-44} strokeWidth={3} />
        <ellipse cx={-40} cy={-48} rx={8} ry={5} fill="none" strokeWidth={2} />
        {/* Label */}
        <text x={0} y={170} fontSize={28} fill={CHALK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600}>
          PCX mới
        </text>
        <text x={0} y={206} fontSize={34} fill={RED} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={800}>
          80 triệu
        </text>
        <text x={0} y={240} fontSize={20} fill={DIM} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic">
          trả góp 5 năm
        </text>
      </g>
    </g>
  );
};

// SCENE 6 — BẪY 5 — Bedroom with Shopee boxes piled
const SceneBay5: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 2;
  const countdown = 9 - Math.floor((lf / FPS) % 10);
  return (
    <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
      {/* Floor */}
      <line x1={80} y1={1500} x2={W - 80} y2={1500} strokeWidth={4} />
      {/* Wall */}
      <line x1={80} y1={700} x2={W - 80} y2={700} strokeWidth={2} opacity={0.5} />

      {/* Bed frame */}
      <g>
        <rect x={120} y={1180} width={460} height={130} fill="none" strokeWidth={4} />
        {/* Pillow */}
        <rect x={140} y={1140} width={120} height={50} rx={10} fill="none" strokeWidth={3} />
        {/* Blanket wave */}
        <path d="M 270 1200 Q 330 1180 390 1210 Q 450 1180 510 1200 Q 550 1210 560 1230" strokeWidth={3} fill="none" opacity={0.7} />
      </g>

      {/* Stack of Shopee boxes on right */}
      <g transform="translate(720, 1200)">
        {[[0, 0, 100, 80], [-10, -80, 120, 80], [10, -160, 90, 80], [-20, -240, 110, 80], [30, -320, 80, 80]].map(([ox, oy, bw, bh], i) => (
          <g key={i} transform={`translate(${ox}, ${oy})`}>
            <rect x={-bw/2} y={-bh/2} width={bw} height={bh} fill="none" strokeWidth={3} />
            {/* Shopee logo */}
            <rect x={-bw/2 + 6} y={-bh/2 + 6} width={24} height={14} fill="none" strokeWidth={1.5} />
            <text x={-bw/2 + 18} y={-bh/2 + 18} fontSize={10} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>S</text>
            {/* Tape seal */}
            <line x1={-bw/2} y1={0} x2={bw/2} y2={0} strokeWidth={1.5} opacity={0.6} />
          </g>
        ))}
        {/* Dust */}
        {[[-40, -350], [20, -320], [50, -280]].map(([dx, dy], i) => (
          <circle key={i} cx={dx} cy={dy} r={2} fill={CHALK} opacity={0.5} />
        ))}
      </g>

      {/* Character on bed with phone */}
      <g transform="translate(340, 1110)">
        {/* Body lying slump */}
        <g filter="url(#chalkGlow)">
          <circle cx={0} cy={0} r={22} fill="none" strokeWidth={4} />
          {/* Eyes zombie */}
          <line x1={-10} y1={0} x2={-5} y2={0} strokeWidth={3} />
          <line x1={5} y1={0} x2={10} y2={0} strokeWidth={3} />
          {/* Mouth */}
          <line x1={-5} y1={10} x2={5} y2={10} strokeWidth={3} />
          {/* Neck + body lying */}
          <line x1={0} y1={22} x2={40} y2={32} strokeWidth={4} />
          <line x1={40} y1={32} x2={120} y2={30} strokeWidth={4} />
          {/* Arm holding phone */}
          <line x1={60} y1={25} x2={90} y2={-30} strokeWidth={4} />
          {/* Legs */}
          <line x1={120} y1={30} x2={180} y2={50} strokeWidth={4} />
          <line x1={120} y1={30} x2={180} y2={10} strokeWidth={4} />
        </g>
      </g>

      {/* Phone in hand showing Shopee flash sale */}
      <g transform="translate(440, 920)">
        <rect x={-60} y={-100} width={120} height={200} rx={10} fill="none" strokeWidth={3} />
        <rect x={-54} y={-94} width={108} height={188} fill="none" strokeWidth={1.5} />
        {/* Shopee header */}
        <text x={0} y={-68} fontSize={16} fill={YELLOW} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>SHOPEE</text>
        {/* Flash sale */}
        <text x={0} y={-38} fontSize={18} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FLASH SALE</text>
        {/* Timer */}
        <rect x={-48} y={-22} width={96} height={28} fill="none" strokeWidth={2} />
        <text x={0} y={-2} fontSize={22} fill={YELLOW} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
          02:0{Math.max(0, countdown)}
        </text>
        {/* Item */}
        <rect x={-40} y={20} width={80} height={30} fill="none" strokeWidth={2} />
        <text x={0} y={40} fontSize={12} fill={CHALK} textAnchor="middle">-70%</text>
        {/* Buy button */}
        <rect x={-50} y={60} width={100} height={22} fill="none" strokeWidth={2} />
        <text x={0} y={76} fontSize={14} fill={YELLOW} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>MUA NGAY</text>
      </g>
    </g>
  );
};

// SCENE 7 — PUNCHLINE — 4 ông lineup at bàn trà
const ScenePunch: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 2;
  return (
    <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
      {/* Floor */}
      <line x1={80} y1={1560} x2={W - 80} y2={1560} strokeWidth={4} />
      {/* Long table */}
      <g>
        <rect x={100} y={1440} width={880} height={18} fill="none" strokeWidth={3} />
        <line x1={130} y1={1458} x2={130} y2={1540} strokeWidth={3} />
        <line x1={950} y1={1458} x2={950} y2={1540} strokeWidth={3} />
        {/* Tea cups */}
        {[260, 460, 660, 860].map((cx, i) => (
          <g key={i}>
            <ellipse cx={cx} cy={1440} rx={18} ry={4} fill="none" strokeWidth={2} />
            <rect x={cx - 16} y={1418} width={32} height={22} fill="none" strokeWidth={2} />
            <path d="M -4 -12 Q 0 -18 4 -12" transform={`translate(${cx}, 1418)`} strokeWidth={1.5} fill="none" opacity={0.5} />
          </g>
        ))}
      </g>

      {/* 4 characters seated */}
      {stick({ cx: 220, cy: 1440, scale: 1.8, pose: "sit", prop: "smoke", speaking: false, phase: phase + 1 })}
      {stick({ cx: 420, cy: 1440, scale: 1.8, pose: "sit", prop: "hat", speaking: true, phase: phase + 2 })}
      {stick({ cx: 620, cy: 1440, scale: 1.8, pose: "sit", prop: "glasses", speaking: false, phase: phase + 3 })}
      {stick({ cx: 820, cy: 1440, scale: 1.8, pose: "sit", prop: "belly", speaking: false, phase: phase + 4 })}

      {/* Big punchline text */}
      <text x={W/2} y={720} fontSize={50} fill={CHALK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} letterSpacing="2">
        Tiền không tự mất.
      </text>
      <text x={W/2} y={820} fontSize={40} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic">
        Nó đi theo những thứ mày tưởng
      </text>
      <text x={W/2} y={920} fontSize={64} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={800} stroke={RED} strokeWidth={2} paintOrder="stroke">
        "chỉ một ít"
      </text>
    </g>
  );
};

// ---------- BEAT TITLE POP ----------
const BeatTitle: React.FC<{ text: string; from: number; to: number }> = ({ text, from, to }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < from || t > to) return null;
  const sp = spring({ frame: (t - from) * FPS, fps: FPS, config: { damping: 12, stiffness: 140, mass: 0.5 } });
  const out = interpolate(t, [to - 0.3, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = sp * out;
  const scale = 0.6 + sp * 0.4;
  return (
    <g transform={`translate(${W/2}, 400) scale(${scale})`} opacity={op}>
      <rect x={-380} y={-48} width={760} height={88} fill={RED} stroke={CHALK} strokeWidth={4} />
      <text x={0} y={22} fontSize={50} fill={CHALK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={700} letterSpacing="2">
        {text}
      </text>
    </g>
  );
};

// ---------- CAPTION bottom ----------
const Caption: React.FC<{ hide: boolean }> = ({ hide }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (hide) return null;
  let active: Sentence | null = null;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i + 1];
    const boundary = next ? next.start : s.end + 0.5;
    if (t >= s.start - 0.1 && t < boundary) { active = s; break; }
  }
  if (!active) return null;
  const LEAD = 0.1;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 180 }}>
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center",
        gap: "0 10px", maxWidth: 980, padding: "12px 32px",
      }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [6, 0]);
          const isActive = t >= w.start - LEAD && t < w.end;
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 800,
              fontSize: 42,
              color: isActive ? RED : YELLOW,
              opacity: visible ? sp : 0,
              transform: `translateY(${y}px)`,
              lineHeight: 1.2,
              WebkitTextStroke: "3px #000000",
              textShadow: "0 0 12px rgba(0,0,0,0.95)",
            }}>{w.word}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- OUTRO ----------
const SceneOutro: React.FC<{ lf: number }> = ({ lf }) => {
  const sp = spring({ frame: lf, fps: FPS, config: { damping: 12, stiffness: 80, mass: 1.2 } });
  return (
    <g opacity={sp}>
      <rect x={0} y={0} width={W} height={H} fill="#040812" />
      <text x={W/2} y={H/2 - 80} fontSize={28} fill={DIM} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} letterSpacing="8">
        — CASUALLY EXPLAINED VN —
      </text>
      <text x={W/2} y={H/2 + 40} fontSize={94} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={700} letterSpacing="2" stroke={RED} strokeWidth={3} paintOrder="stroke">
        GIẢI THÍCH
      </text>
      <text x={W/2} y={H/2 + 140} fontSize={94} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={700} letterSpacing="2" stroke={RED} strokeWidth={3} paintOrder="stroke">
        KIỂU LƯỜI
      </text>
      <line x1={W/2 - 180} y1={H/2 + 180} x2={W/2 + 180} y2={H/2 + 180} stroke={CHALK} strokeWidth={2} opacity={0.6} />
      <text x={W/2} y={H/2 + 230} fontSize={30} fill={CHALK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontStyle="italic" opacity={0.85}>
        follow để xem tập sau
      </text>
    </g>
  );
};

// ---------- MAIN ----------
export const GtlTap01: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const globalOp = interpolate(frame, [0, 10, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const scenes: Array<[readonly [number, number], (lf: number) => React.ReactNode, string?]> = [
    [T.hook, (lf) => <SceneHook lf={lf} />],
    [T.bay1, (lf) => <SceneBay1 lf={lf} />, "BẪY 1 · SUBSCRIPTION"],
    [T.bay2, (lf) => <SceneBay2 lf={lf} />, "BẪY 2 · ĐẦU TƯ BẢN THÂN"],
    [T.bay3, (lf) => <SceneBay3 lf={lf} />, "BẪY 3 · ĂN CHO NHANH"],
    [T.bay4, (lf) => <SceneBay4 lf={lf} />, "BẪY 4 · NÂNG CẤP XE"],
    [T.bay5, (lf) => <SceneBay5 lf={lf} />, "BẪY 5 · MUA CẢM GIÁC"],
    [T.punch, (lf) => <ScenePunch lf={lf} />],
  ];

  const outroActive = t >= T.outro[0];

  return (
    <AbsoluteFill style={{ backgroundColor: BG_DEEP, opacity: globalOp }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Defs />
        {/* BG */}
        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#bpGlow)" />

        {/* Title bar top */}
        {!outroActive && <TitleBar />}

        {/* Scenes */}
        {scenes.map(([range, renderFn, title], i) => {
          if (!inRange(t, range)) return null;
          const lf = frame - range[0] * FPS;
          const fadeIn = interpolate(t, [range[0], range[0] + 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const fadeOut = interpolate(t, [range[1] - 0.3, range[1]], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const op = Math.min(fadeIn, fadeOut);
          return (
            <g key={i} opacity={op}>
              {renderFn(lf)}
              {title && <BeatTitle text={title} from={range[0] + 0.2} to={range[0] + 2.5} />}
            </g>
          );
        })}

        {/* Vignette */}
        <rect width={W} height={H} fill="url(#vigEdge)" />
        {/* Chalk grain */}
        <rect width={W} height={H} filter="url(#chalkGrain)" opacity={0.4} />

        {outroActive && <SceneOutro lf={frame - T.outro[0] * FPS} />}
      </svg>
      <Caption hide={outroActive} />
      <Audio src={staticFile("gtl_tap_01/voice.mp3")} volume={0.95} />
      <Audio src={staticFile("gtl_tap_01/music.mp3")} volume={0.06} />
    </AbsoluteFill>
  );
};
