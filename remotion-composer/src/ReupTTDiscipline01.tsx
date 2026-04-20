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
import wordsData from "./reup_tt_discipline_01_words.json";

loadEBGaramond("normal", { weights: ["400", "500", "600"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300", "400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E03A2A";
const GOLD = "#E5A53B";
const SKIN = "#F5C8A8";

type Word = { word: string; start: number; end: number };
const words = wordsData as Word[];

type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  for (const w of words) {
    buf.push(w);
    if (/[.!?…]$/.test(w.word)) {
      out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
      buf = [];
    }
  }
  if (buf.length) out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
  return out;
})();

const EMPH = new Set<string>([
  "mày", "kìa.", "vô", "hồn,", "vuốt", "vuốt", "màn", "hình.",
  "mục", "tiêu,", "ước", "mơ,", "tương", "lai.",
  "video", "nữa", "thôi…", "thêm", "nữa.",
  "hít", "đất", "đi!", "Đứng", "dậy", "đi!", "Đặt", "điện", "thoại", "xuống!",
  "bàn,", "việc,", "ngay", "bây", "giờ!", "Dậy",
]);
const isEmph = (w: string) => EMPH.has(w);

// ============================== BG ==============================
const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="paperGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.22 0" />
      </filter>
      <radialGradient id="vig" cx="50%" cy="50%" r="78%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.45" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#paperGrain)" />
    <rect width={W} height={H} fill="url(#vig)" />
  </svg>
);

// ============================== VIEWER (couch potato) ==============================
const Viewer: React.FC<{
  x: number;
  y: number;
  scale: number;
  scrolling?: boolean;
  alert?: boolean;
  phase: number;
}> = ({ x, y, scale, scrolling = true, alert = false, phase }) => {
  const thumbY = scrolling ? Math.sin(phase * 4) * 4 : 0;
  const eyeOpen = alert ? 12 : 4;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Body — slumped torso */}
      <path
        d="M -75 60 Q -85 -10 -55 -40 L 55 -40 Q 90 -10 75 60 Z"
        fill="#7B8A6E"
        stroke={INK}
        strokeWidth={4}
      />
      {/* Hoodie collar */}
      <path d="M -55 -40 Q 0 -25 55 -40" stroke={INK} strokeWidth={3} fill="none" />
      {/* Neck */}
      <rect x={-15} y={-58} width={30} height={22} fill={SKIN} stroke={INK} strokeWidth={3} />
      {/* Head */}
      <ellipse cx={0} cy={-100} rx={56} ry={62} fill={SKIN} stroke={INK} strokeWidth={4} />
      {/* Hair top messy */}
      <path
        d="M -50 -150 Q -40 -170 -20 -160 Q 0 -178 22 -160 Q 42 -172 52 -148 Q 50 -130 30 -135 Q 10 -130 -10 -136 Q -30 -130 -50 -132 Z"
        fill="#3B2A20"
        stroke={INK}
        strokeWidth={3}
      />
      {/* Eyes — vacant or alert */}
      <ellipse cx={-18} cy={-105} rx={9} ry={eyeOpen} fill="#FFF" stroke={INK} strokeWidth={2.5} />
      <ellipse cx={18} cy={-105} rx={9} ry={eyeOpen} fill="#FFF" stroke={INK} strokeWidth={2.5} />
      <circle cx={-18} cy={-103} r={3} fill={INK} />
      <circle cx={18} cy={-103} r={3} fill={INK} />
      {/* Eye bags */}
      {!alert && (
        <>
          <path d="M -28 -94 Q -18 -88 -8 -94" stroke={INK} strokeWidth={2} fill="none" opacity={0.55} />
          <path d="M 8 -94 Q 18 -88 28 -94" stroke={INK} strokeWidth={2} fill="none" opacity={0.55} />
        </>
      )}
      {/* Mouth */}
      {alert ? (
        <ellipse cx={0} cy={-72} rx={11} ry={14} fill="#5A1818" stroke={INK} strokeWidth={3} />
      ) : (
        <path d="M -16 -75 Q 0 -68 16 -75" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      )}
      {/* Right arm extending forward holding phone */}
      <path
        d="M 50 -10 Q 110 0 140 50 L 130 80 Q 95 35 35 25 Z"
        fill="#7B8A6E"
        stroke={INK}
        strokeWidth={4}
      />
      {/* Hand */}
      <ellipse cx={140} cy={70} rx={18} ry={22} fill={SKIN} stroke={INK} strokeWidth={3} />
      {/* Phone */}
      <g transform="translate(165, 70)">
        <rect x={-26} y={-44} width={52} height={88} rx={8} fill={INK} />
        <rect x={-22} y={-40} width={44} height={80} rx={5} fill="#222630" />
        {/* Reels colored block */}
        <rect x={-22} y={-40 + (thumbY % 30)} width={44} height={26} fill="#E03A2A" opacity={0.85} />
        <rect x={-22} y={-12 + (thumbY % 30)} width={44} height={26} fill="#3A8AE0" opacity={0.85} />
        <rect x={-22} y={16 + (thumbY % 30)} width={44} height={26} fill="#E5A53B" opacity={0.85} />
      </g>
      {/* Thumb on phone */}
      <ellipse cx={155} cy={50 + thumbY} rx={6} ry={10} fill={SKIN} stroke={INK} strokeWidth={2} />
      {/* Left arm hanging */}
      <path
        d="M -75 -10 Q -100 30 -90 80 L -70 80 Q -65 30 -50 10 Z"
        fill="#7B8A6E"
        stroke={INK}
        strokeWidth={4}
      />
    </g>
  );
};

// ============================== SOFA ==============================
const Sofa: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x={-w / 2} y={-50} width={w} height={70} rx={14} fill="#A0605A" stroke={INK} strokeWidth={4} />
    <rect x={-w / 2 - 12} y={0} width={w + 24} height={50} rx={12} fill="#A0605A" stroke={INK} strokeWidth={4} />
    <ellipse cx={0} cy={6} rx={w / 2 - 16} ry={9} fill="#000" opacity={0.18} />
    <rect x={-w / 2 + 18} y={-42} width={w / 2 - 28} height={52} rx={6} fill="#8E4A46" stroke={INK} strokeWidth={3} />
    <rect x={18} y={-42} width={w / 2 - 28} height={52} rx={6} fill="#8E4A46" stroke={INK} strokeWidth={3} />
    <rect x={-w / 2 - 6} y={50} width={10} height={22} fill={INK} />
    <rect x={w / 2 - 4} y={50} width={10} height={22} fill={INK} />
  </g>
);

// ============================== SIGMA MASCOT (point + shout) ==============================
const Mascot: React.FC<{
  x: number;
  y: number;
  scale: number;
  shouting?: boolean;
  pointing?: boolean;
  phase: number;
}> = ({ x, y, scale, shouting = false, pointing = false, phase }) => {
  const shake = shouting ? Math.sin(phase * 25) * 3 : 0;
  return (
    <g transform={`translate(${x + shake}, ${y}) scale(${scale})`}>
      {/* Suit body */}
      <path
        d="M -70 60 Q -90 -20 -55 -55 L 55 -55 Q 90 -20 70 60 Z"
        fill="#1F2630"
        stroke={INK}
        strokeWidth={5}
      />
      {/* Shirt collar V */}
      <path d="M -22 -55 L 0 -25 L 22 -55 Z" fill="#FFF" stroke={INK} strokeWidth={3} />
      {/* Tie */}
      <path d="M -8 -25 L 8 -25 L 14 60 L 0 80 L -14 60 Z" fill={ACCENT} stroke={INK} strokeWidth={3} />
      {/* Neck */}
      <rect x={-14} y={-72} width={28} height={20} fill={SKIN} stroke={INK} strokeWidth={3} />
      {/* Head — chiseled jaw */}
      <path
        d="M -52 -110 Q -54 -148 -28 -160 Q 0 -168 28 -160 Q 54 -148 52 -110 Q 50 -88 35 -78 Q 18 -64 0 -62 Q -18 -64 -35 -78 Q -50 -88 -52 -110 Z"
        fill={SKIN}
        stroke={INK}
        strokeWidth={4}
      />
      {/* Slick hair undercut */}
      <path
        d="M -52 -130 Q -45 -170 -8 -172 Q 28 -174 52 -150 Q 50 -135 28 -138 Q 0 -132 -28 -138 Q -48 -132 -52 -130 Z"
        fill="#1A1A22"
        stroke={INK}
        strokeWidth={3}
      />
      {/* Brow furrowed */}
      <path d="M -32 -128 L -10 -120" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M 10 -120 L 32 -128" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      {/* Eyes intense */}
      <ellipse cx={-17} cy={-110} rx={7} ry={5} fill="#FFF" stroke={INK} strokeWidth={2.5} />
      <ellipse cx={17} cy={-110} rx={7} ry={5} fill="#FFF" stroke={INK} strokeWidth={2.5} />
      <circle cx={-17} cy={-110} r={3} fill={INK} />
      <circle cx={17} cy={-110} r={3} fill={INK} />
      {/* Mouth */}
      {shouting ? (
        <ellipse cx={0} cy={-78} rx={18} ry={20} fill="#5A1818" stroke={INK} strokeWidth={3.5} />
      ) : (
        <path d="M -14 -82 Q 0 -76 14 -82" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      )}
      {/* Pointing arm forward */}
      {pointing && (
        <g>
          <path
            d="M 60 -20 Q 130 -10 175 30 L 168 50 Q 120 22 50 10 Z"
            fill="#1F2630"
            stroke={INK}
            strokeWidth={4}
          />
          {/* Index finger pointing */}
          <ellipse cx={185} cy={40} rx={26} ry={14} fill={SKIN} stroke={INK} strokeWidth={3} />
          <rect x={205} y={36} width={32} height={8} rx={3} fill={SKIN} stroke={INK} strokeWidth={3} />
        </g>
      )}
      {/* Other arm */}
      <path
        d="M -70 -20 Q -100 20 -85 70 L -65 70 Q -60 25 -45 0 Z"
        fill="#1F2630"
        stroke={INK}
        strokeWidth={4}
      />
      {/* Spit lines if shouting */}
      {shouting && (
        <>
          <line x1={20} y1={-78} x2={50} y2={-90} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={22} y1={-72} x2={52} y2={-70} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={56} cy={-82} r={3} fill={INK} />
          <circle cx={58} cy={-74} r={2.5} fill={INK} />
        </>
      )}
    </g>
  );
};

// ============================== GOAL ICON (with red X) ==============================
const GoalSlash: React.FC<{ x: number; y: number; label: string; icon: "trophy" | "diploma" | "muscle"; revealT: number }> = ({ x, y, label, icon, revealT }) => {
  const slashLen = 200;
  const slashOpacity = revealT;
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Frame */}
      <rect x={-110} y={-110} width={220} height={220} rx={20} fill="#FFF8EC" stroke={INK} strokeWidth={5} />
      {/* Icon */}
      {icon === "trophy" && (
        <g transform="translate(0, -10)">
          <path d="M -45 -50 L 45 -50 L 38 30 L -38 30 Z" fill={GOLD} stroke={INK} strokeWidth={4} />
          <ellipse cx={0} cy={-50} rx={45} ry={6} fill={GOLD} stroke={INK} strokeWidth={3} />
          <path d="M -45 -36 Q -70 -30 -68 0 Q -66 18 -50 22" stroke={INK} strokeWidth={4} fill="none" />
          <path d="M 45 -36 Q 70 -30 68 0 Q 66 18 50 22" stroke={INK} strokeWidth={4} fill="none" />
          <rect x={-22} y={30} width={44} height={20} fill={GOLD} stroke={INK} strokeWidth={3} />
          <rect x={-32} y={50} width={64} height={12} rx={3} fill={GOLD} stroke={INK} strokeWidth={3} />
        </g>
      )}
      {icon === "diploma" && (
        <g transform="translate(0, 0)">
          <rect x={-58} y={-44} width={116} height={88} rx={4} fill="#FFF8EC" stroke={INK} strokeWidth={4} />
          <line x1={-44} y1={-22} x2={44} y2={-22} stroke={INK} strokeWidth={3} />
          <line x1={-44} y1={-6} x2={32} y2={-6} stroke={INK} strokeWidth={3} />
          <line x1={-44} y1={10} x2={40} y2={10} stroke={INK} strokeWidth={3} />
          <circle cx={36} cy={32} r={12} fill={ACCENT} stroke={INK} strokeWidth={3} />
          <path d="M 30 38 L 30 56 L 36 50 L 42 56 L 42 38" fill={ACCENT} stroke={INK} strokeWidth={3} />
        </g>
      )}
      {icon === "muscle" && (
        <g transform="translate(0, 0)">
          {/* Bicep flex arm */}
          <path
            d="M -60 30 Q -68 -10 -40 -32 Q -10 -50 30 -38 Q 60 -28 50 8 L 30 14 Q 28 -10 0 -16 Q -22 -10 -32 14 L -50 40 Z"
            fill={SKIN}
            stroke={INK}
            strokeWidth={4}
          />
          {/* Bicep bulge */}
          <ellipse cx={-10} cy={-22} rx={28} ry={20} fill={SKIN} stroke={INK} strokeWidth={3.5} />
          <path d="M -22 -20 Q -10 -28 0 -22" stroke={INK} strokeWidth={2.5} fill="none" />
          {/* Fist */}
          <circle cx={45} cy={-10} r={20} fill={SKIN} stroke={INK} strokeWidth={4} />
          <path d="M 35 -16 L 38 -2 M 42 -18 L 45 -2 M 50 -16 L 52 -2" stroke={INK} strokeWidth={2} />
        </g>
      )}
      {/* Red slash */}
      <line
        x1={-slashLen / 2}
        y1={-slashLen / 2}
        x2={slashLen / 2 - (1 - slashOpacity) * slashLen}
        y2={slashLen / 2 - (1 - slashOpacity) * slashLen}
        stroke={ACCENT}
        strokeWidth={14}
        strokeLinecap="round"
        opacity={slashOpacity > 0 ? 1 : 0}
      />
      {/* Label */}
      <text
        x={0}
        y={150}
        fontSize={32}
        fill={INK}
        textAnchor="middle"
        fontFamily="'Be Vietnam Pro', sans-serif"
        fontWeight={800}
      >
        {label}
      </text>
    </g>
  );
};

// ============================== BUBBLE ==============================
const Bubble: React.FC<{ x: number; y: number; w: number; h: number; text: string; size?: number }> = ({ x, y, w, h, text, size = 30 }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={20} fill="#FFF8EC" stroke={INK} strokeWidth={4} />
    <path d={`M ${-w / 4} ${h / 2 - 2} L ${-w / 4 - 18} ${h / 2 + 26} L ${-w / 4 + 18} ${h / 2 - 4} Z`} fill="#FFF8EC" stroke={INK} strokeWidth={4} />
    <foreignObject x={-w / 2 + 14} y={-h / 2 + 8} width={w - 28} height={h - 16}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontWeight: 800,
          fontSize: size,
          color: INK,
          lineHeight: 1.15,
        }}
      >
        {text}
      </div>
    </foreignObject>
  </g>
);

// ============================== DESK / LAMP ==============================
const Desk: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Desk top */}
    <rect x={-220} y={0} width={440} height={26} fill="#A07050" stroke={INK} strokeWidth={4} />
    {/* Legs */}
    <rect x={-200} y={26} width={14} height={130} fill="#A07050" stroke={INK} strokeWidth={3} />
    <rect x={186} y={26} width={14} height={130} fill="#A07050" stroke={INK} strokeWidth={3} />
    {/* Lamp base + neck + shade */}
    <rect x={130} y={-12} width={50} height={12} rx={4} fill={INK} />
    <line x1={155} y1={-12} x2={155} y2={-90} stroke={INK} strokeWidth={5} />
    <line x1={155} y1={-90} x2={100} y2={-130} stroke={INK} strokeWidth={5} />
    <path d="M 70 -156 L 130 -156 L 110 -110 L 90 -110 Z" fill={GOLD} stroke={INK} strokeWidth={4} />
    {/* Light cone */}
    <path d="M 100 -110 L 30 -10 L 170 -10 Z" fill={GOLD} opacity={0.18} />
    {/* Laptop on desk */}
    <g transform="translate(-100, -8)">
      <rect x={-60} y={-46} width={120} height={66} rx={4} fill="#3A3A42" stroke={INK} strokeWidth={3} />
      <rect x={-54} y={-40} width={108} height={54} fill="#1F2630" stroke={INK} strokeWidth={2} />
      <rect x={-66} y={20} width={132} height={8} rx={2} fill="#5A5A66" stroke={INK} strokeWidth={3} />
    </g>
  </g>
);

// ============================== PHONE FALLING ==============================
const FallingPhone: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
    <rect x={-40} y={-70} width={80} height={140} rx={12} fill={INK} />
    <rect x={-34} y={-64} width={68} height={128} rx={8} fill="#222630" />
    <rect x={-34} y={-64} width={68} height={42} fill="#E03A2A" opacity={0.9} />
    <rect x={-34} y={-22} width={68} height={42} fill="#3A8AE0" opacity={0.9} />
    <rect x={-34} y={20} width={68} height={42} fill="#E5A53B" opacity={0.9} />
  </g>
);

// ============================== MOTION LINES ==============================
const MotionLines: React.FC<{ x: number; y: number; n: number; len: number }> = ({ x, y, n, len }) => (
  <g transform={`translate(${x}, ${y})`}>
    {Array.from({ length: n }).map((_, i) => (
      <line
        key={i}
        x1={0}
        y1={-i * 18}
        x2={-len}
        y2={-i * 18}
        stroke={INK}
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.7 - i * 0.08}
      />
    ))}
  </g>
);

// ============================== SCENES ==============================
type Scene = {
  start: number;
  end: number;
  render: (frame: number, t: number, opacity: number) => React.ReactNode;
};

const SCENES: Scene[] = [
  // S1 — HOOK relate (0 → 2.4)
  {
    start: 0,
    end: 2.4,
    render: (frame, t, op) => (
      <g opacity={op}>
        {/* Floor line */}
        <line x1={0} y1={1500} x2={W} y2={1500} stroke={INK} strokeWidth={5} />
        <Sofa x={W / 2} y={1490} w={760} />
        <Viewer x={W / 2 - 60} y={1380} scale={2.0} scrolling phase={frame / 6} />
      </g>
    ),
  },
  // S2 — closeup vacant eyes (2.4 → 5.84)
  {
    start: 2.4,
    end: 5.84,
    render: (frame, t, op) => {
      const tIn = (t - 2.4) / (5.84 - 2.4);
      const zoom = interpolate(tIn, [0, 1], [2.6, 3.4]);
      return (
        <g opacity={op}>
          <Sofa x={W / 2} y={1500} w={760} />
          <Viewer x={W / 2 - 100} y={1450} scale={zoom} scrolling phase={frame / 5} />
          {/* Stink lines on top */}
          <g transform={`translate(${W / 2 - 60}, 380)`}>
            <path d="M -40 0 Q -36 -30 -42 -60" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
            <path d="M 0 -10 Q 4 -40 -4 -70" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
            <path d="M 40 0 Q 36 -30 42 -60" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.6} />
          </g>
        </g>
      );
    },
  },
  // S3 — DISS goals: 3 panels with red X (5.84 → 10.06)
  {
    start: 5.84,
    end: 10.06,
    render: (frame, t, op) => {
      const tIn = (t - 5.84) / (10.06 - 5.84);
      const r1 = Math.max(0, Math.min(1, (tIn - 0.05) * 4));
      const r2 = Math.max(0, Math.min(1, (tIn - 0.35) * 4));
      const r3 = Math.max(0, Math.min(1, (tIn - 0.65) * 4));
      return (
        <g opacity={op}>
          <GoalSlash x={W / 2} y={420} label="MỤC TIÊU" icon="trophy" revealT={r1} />
          <GoalSlash x={W / 2} y={800} label="ƯỚC MƠ" icon="diploma" revealT={r2} />
          <GoalSlash x={W / 2} y={1180} label="TƯƠNG LAI" icon="muscle" revealT={r3} />
        </g>
      );
    },
  },
  // S4 — EXCUSE LOOP (10.06 → 14.26)
  {
    start: 10.06,
    end: 14.26,
    render: (frame, t, op) => {
      const tIn = (t - 10.06) / (14.26 - 10.06);
      const b1 = Math.max(0, Math.min(1, (tIn - 0.0) * 5));
      const b2 = Math.max(0, Math.min(1, (tIn - 0.30) * 5));
      const b3 = Math.max(0, Math.min(1, (tIn - 0.60) * 5));
      return (
        <g opacity={op}>
          <Sofa x={W / 2} y={1620} w={760} />
          <Viewer x={W / 2 - 110} y={1500} scale={1.7} scrolling phase={frame / 4} />
          {/* 3 stacked bubbles, growing */}
          <g opacity={b1} transform={`translate(0, ${(1 - b1) * 30})`}>
            <Bubble x={W / 2 + 80} y={420} w={520} h={120} text="Một video nữa thôi…" size={42} />
          </g>
          <g opacity={b2} transform={`translate(0, ${(1 - b2) * 30})`}>
            <Bubble x={W / 2 + 60} y={620} w={580} h={130} text="Một cái nữa thôi…" size={48} />
          </g>
          <g opacity={b3} transform={`translate(0, ${(1 - b3) * 30})`}>
            <Bubble x={W / 2 + 40} y={840} w={680} h={150} text="Rồi lại thêm một cái nữa…" size={54} />
          </g>
        </g>
      );
    },
  },
  // S5 — PUSHUP demand (14.26 → 16.68)
  {
    start: 14.26,
    end: 16.68,
    render: (frame, t, op) => {
      const tIn = (t - 14.26) / (16.68 - 14.26);
      const punch = interpolate(tIn, [0, 0.3, 1], [1.0, 1.15, 1.05]);
      return (
        <g opacity={op}>
          <Mascot x={W / 2 - 120} y={1300} scale={2.4 * punch} shouting pointing phase={frame / 3} />
          {/* Pushup icon big in corner */}
          <g transform="translate(820, 600)">
            <circle cx={0} cy={0} r={130} fill="#FFF8EC" stroke={INK} strokeWidth={6} />
            <text x={0} y={50} fontSize={140} textAnchor="middle">💪</text>
          </g>
          {/* Action lines */}
          <MotionLines x={W - 100} y={1100} n={6} len={140} />
          <MotionLines x={120} y={1100} n={6} len={140} />
        </g>
      );
    },
  },
  // S6 — STAND UP (16.68 → 17.8)
  {
    start: 16.68,
    end: 17.8,
    render: (frame, t, op) => {
      const tIn = (t - 16.68) / (17.8 - 16.68);
      const jolt = Math.sin(tIn * 30) * 8;
      return (
        <g opacity={op}>
          <Sofa x={W / 2} y={1600} w={760} />
          <g transform={`translate(${jolt}, 0)`}>
            <Viewer x={W / 2 - 60} y={1380} scale={2.0} scrolling={false} alert phase={frame / 4} />
          </g>
          {/* SHOCK marks */}
          <text x={W / 2 + 220} y={760} fontSize={120} fill={ACCENT} fontFamily="'EB Garamond', serif" fontWeight={700}>!</text>
          <text x={W / 2 - 280} y={760} fontSize={120} fill={ACCENT} fontFamily="'EB Garamond', serif" fontWeight={700}>!</text>
        </g>
      );
    },
  },
  // S7 — PUT PHONE DOWN (17.8 → 19.4)
  {
    start: 17.8,
    end: 19.4,
    render: (frame, t, op) => {
      const tIn = (t - 17.8) / (19.4 - 17.8);
      const fallY = interpolate(tIn, [0, 1], [400, 1500]);
      const rot = interpolate(tIn, [0, 1], [-20, 90]);
      return (
        <g opacity={op}>
          <Sofa x={W / 2} y={1620} w={760} />
          <Viewer x={W / 2 - 60} y={1380} scale={2.0} scrolling={false} alert phase={frame / 4} />
          <FallingPhone x={W / 2 + 320} y={fallY} rot={rot} />
          {/* Motion blur lines on phone */}
          <line x1={W / 2 + 280} y1={fallY - 80} x2={W / 2 + 280} y2={fallY - 200} stroke={INK} strokeWidth={3} opacity={0.5} />
          <line x1={W / 2 + 360} y1={fallY - 80} x2={W / 2 + 360} y2={fallY - 200} stroke={INK} strokeWidth={3} opacity={0.5} />
        </g>
      );
    },
  },
  // S8 — DESK + WORK (19.4 → 23.1)
  {
    start: 19.4,
    end: 23.1,
    render: (frame, t, op) => {
      const tIn = (t - 19.4) / (23.1 - 19.4);
      const slideIn = interpolate(tIn, [0, 0.4], [-400, 0], { extrapolateRight: "clamp" });
      return (
        <g opacity={op}>
          <Desk x={W / 2 + slideIn} y={1300} />
          {/* Viewer sitting at desk */}
          <g transform={`translate(${slideIn - 40}, 0)`}>
            <Viewer x={W / 2 - 80} y={1280} scale={1.6} scrolling={false} alert phase={frame / 6} />
          </g>
          <MotionLines x={W - 160} y={1200} n={5} len={160} />
        </g>
      );
    },
  },
  // S9 — OUTRO BIG TEXT (23.1 → 26)
  {
    start: 23.1,
    end: 26,
    render: (frame, t, op) => {
      const tIn = (t - 23.1) / (26 - 23.1);
      const sp = spring({ frame: (t - 23.1) * FPS, fps: FPS, config: { damping: 11, stiffness: 90, mass: 1.2 } });
      const scale = interpolate(sp, [0, 1], [0.4, 1.0]);
      return (
        <g opacity={op}>
          <g transform={`translate(${W / 2}, ${H / 2 - 40}) scale(${scale})`}>
            <text
              x={0}
              y={0}
              textAnchor="middle"
              fontFamily="'EB Garamond', serif"
              fontWeight={600}
              fontSize={240}
              fill={INK}
              letterSpacing="10"
            >
              DẬY ĐI.
            </text>
            <text
              x={0}
              y={120}
              textAnchor="middle"
              fontFamily="'Be Vietnam Pro', sans-serif"
              fontWeight={300}
              fontSize={36}
              fill={INK}
              letterSpacing="6"
              opacity={0.7}
            >
              KỶ LUẬT · MỖI · NGÀY
            </text>
          </g>
        </g>
      );
    },
  },
];

// ============================== CAPTION ==============================
const Caption: React.FC<{ hide: boolean }> = ({ hide }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let active: Sentence | null = null;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i + 1];
    const boundary = next ? next.start : s.end + 0.5;
    if (t >= s.start - 0.15 && t < boundary) {
      active = s;
      break;
    }
  }
  if (!active || hide) return null;
  const LEAD = 0.08;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 200 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 14px",
          maxWidth: 920,
          padding: "20px 44px",
          backgroundColor: "rgba(255, 248, 236, 0.94)",
          borderRadius: 28,
          border: `5px solid ${INK}`,
          boxShadow: "0 8px 0 rgba(26,24,32,0.85)",
        }}
      >
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [10, 0]);
          const blur = interpolate(sp, [0, 1], [3, 0]);
          const emph = isEmph(w.word);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontWeight: emph ? 800 : 700,
                fontSize: emph ? 56 : 46,
                color: emph ? ACCENT : INK,
                opacity: visible ? sp : 0,
                transform: `translateY(${y}px)`,
                filter: `blur(${blur}px)`,
                lineHeight: 1.25,
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ============================== ROOT ==============================
export const ReupTTDiscipline01: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const globalOp = interpolate(
    frame,
    [0, 12, durationInFrames - 14, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const outroActive = t >= 23.1;
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, opacity: globalOp }}>
      <Bg />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {SCENES.map((s, i) => {
          if (t < s.start - 0.25 || t > s.end + 0.25) return null;
          const fadeIn = interpolate(t, [s.start - 0.2, s.start + 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const fadeOut = interpolate(t, [s.end - 0.15, s.end + 0.2], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const op = Math.min(fadeIn, fadeOut);
          if (op <= 0) return null;
          return <g key={i}>{s.render(frame, t, op)}</g>;
        })}
      </svg>
      {/* Corner editorial marks */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <g stroke={INK} strokeWidth={4} fill="none" opacity={0.55}>
          <path d="M 50 50 L 50 110 M 50 50 L 110 50" />
          <path d="M 1030 50 L 1030 110 M 1030 50 L 970 50" />
          <path d="M 50 1870 L 50 1810 M 50 1870 L 110 1870" />
          <path d="M 1030 1870 L 1030 1810 M 1030 1870 L 970 1870" />
        </g>
      </svg>
      <Caption hide={outroActive} />
      <Audio src={staticFile("reup-tt-discipline-01/voice.mp3")} volume={1.0} />
    </AbsoluteFill>
  );
};
