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
import wordsData from "./reup_tt_01_words.json";
import { EmMituOt, AnhGach } from "./CoupleChars";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// REUP TT-01 — "Tưởng là vậy" bựa stick figure version
// 34s satirical observational humor: expectation vs reality
// Duration 1030 frames @30fps (34.3s)

const FPS = 30;
const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";

type Word = { word: string; start: number; end: number };
const words = wordsData as Word[];
type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  for (const w of words) {
    buf.push(w);
    if (/[.!?]$/.test(w.word)) {
      out.push({ words: buf, start: buf[0].start, end: buf[buf.length-1].end });
      buf = [];
    }
  }
  if (buf.length) out.push({ words: buf, start: buf[0].start, end: buf[buf.length-1].end });
  return out;
})();

// ---------- BEAT TIMINGS ----------
const T = {
  setup:    [0.0, 7.38] as const,
  pivot1:   [7.38, 9.66] as const,
  dog:      [9.66, 11.44] as const,
  cat:      [11.44, 13.66] as const,
  son:      [13.66, 17.46] as const,
  pivot2:   [17.46, 19.92] as const,
  fridge:   [19.92, 24.20] as const,
  house:    [24.20, 28.60] as const,
  marriage: [28.60, 34.30] as const,
};
const inRange = (t: number, r: readonly [number, number]) => t >= r[0] && t < r[1];

// ---------- BG ----------
const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="paperN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.22 0" />
      </filter>
      <radialGradient id="vigTT" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.45" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#paperN)" />
    <rect width={W} height={H} fill="url(#vigTT)" />
  </svg>
);

// ---------- DOG ----------
const Dog: React.FC<{ x: number; y: number; scale: number; tongueOut?: boolean; phase: number }> = ({ x, y, scale, tongueOut = false, phase }) => {
  const wag = Math.sin(phase) * 8;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Body */}
      <ellipse cx={0} cy={0} rx={55} ry={30} fill="#C8935A" stroke={INK} strokeWidth={4} />
      {/* Back legs */}
      <ellipse cx={40} cy={28} rx={10} ry={14} fill="#C8935A" stroke={INK} strokeWidth={3} />
      <ellipse cx={-40} cy={28} rx={10} ry={14} fill="#C8935A" stroke={INK} strokeWidth={3} />
      {/* Tail */}
      <path d={`M 55 -8 Q ${75 + wag} ${-18 + wag*0.3} ${70 + wag} ${-30 + wag*0.5}`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* Head */}
      <g transform="translate(-55, -15)">
        <circle cx={0} cy={0} r={26} fill="#C8935A" stroke={INK} strokeWidth={4} />
        {/* Ears floppy */}
        <ellipse cx={-18} cy={-8} rx={9} ry={18} fill="#8B5A2A" stroke={INK} strokeWidth={3} transform="rotate(-20 -18 -8)" />
        <ellipse cx={18} cy={-8} rx={9} ry={18} fill="#8B5A2A" stroke={INK} strokeWidth={3} transform="rotate(20 18 -8)" />
        {/* Eyes */}
        <circle cx={-8} cy={-4} r={3.5} fill={INK} />
        <circle cx={8} cy={-4} r={3.5} fill={INK} />
        <circle cx={-7} cy={-5} r={1.2} fill="#FFF" />
        <circle cx={9} cy={-5} r={1.2} fill="#FFF" />
        {/* Snout */}
        <ellipse cx={0} cy={10} rx={10} ry={7} fill="#E8B880" stroke={INK} strokeWidth={2.5} />
        <circle cx={0} cy={7} r={3} fill={INK} />
        {/* Tongue / mouth */}
        {tongueOut ? (
          <path d="M -6 14 Q 0 28 6 14 Q 4 20 -4 20 Z" fill="#E85878" stroke={INK} strokeWidth={2} />
        ) : (
          <path d="M -6 14 Q 0 18 6 14" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        )}
      </g>
    </g>
  );
};

// ---------- CAT ----------
const Cat: React.FC<{ x: number; y: number; scale: number; phase: number; bored?: boolean }> = ({ x, y, scale, phase, bored = false }) => {
  const tail = Math.sin(phase * 1.5) * 10;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Body oval laying */}
      <ellipse cx={0} cy={0} rx={50} ry={22} fill="#8A8A92" stroke={INK} strokeWidth={4} />
      {/* Paws */}
      <ellipse cx={-35} cy={18} rx={6} ry={8} fill="#8A8A92" stroke={INK} strokeWidth={2.5} />
      <ellipse cx={-18} cy={18} rx={6} ry={8} fill="#8A8A92" stroke={INK} strokeWidth={2.5} />
      <ellipse cx={18} cy={18} rx={6} ry={8} fill="#8A8A92" stroke={INK} strokeWidth={2.5} />
      <ellipse cx={35} cy={18} rx={6} ry={8} fill="#8A8A92" stroke={INK} strokeWidth={2.5} />
      {/* Tail */}
      <path d={`M 50 -4 Q ${70 + tail} ${-12 + tail} ${68 + tail} ${-30 + tail}`} stroke="#8A8A92" strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d={`M 50 -4 Q ${70 + tail} ${-12 + tail} ${68 + tail} ${-30 + tail}`} stroke={INK} strokeWidth={3} fill="none" />
      {/* Head */}
      <g transform="translate(-44, -12)">
        <circle cx={0} cy={0} r={20} fill="#8A8A92" stroke={INK} strokeWidth={4} />
        {/* Ears triangle */}
        <path d="M -15 -15 L -10 -28 L -3 -14 Z" fill="#8A8A92" stroke={INK} strokeWidth={3} />
        <path d="M 15 -15 L 10 -28 L 3 -14 Z" fill="#8A8A92" stroke={INK} strokeWidth={3} />
        {/* Eyes bored half-closed */}
        {bored ? (
          <>
            <path d="M -12 -2 L -4 -2" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
            <path d="M 4 -2 L 12 -2" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx={-7} cy={-2} rx={3} ry={5} fill={INK} />
            <ellipse cx={7} cy={-2} rx={3} ry={5} fill={INK} />
          </>
        )}
        {/* Nose */}
        <path d="M -2 8 L 2 8 L 0 12 Z" fill="#E85878" stroke={INK} strokeWidth={1.5} />
        {/* Mouth bored */}
        <path d="M -5 14 Q 0 16 5 14" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
        {/* Whiskers */}
        <line x1={-8} y1={10} x2={-24} y2={7} stroke={INK} strokeWidth={1.5} />
        <line x1={-8} y1={13} x2={-24} y2={14} stroke={INK} strokeWidth={1.5} />
        <line x1={8} y1={10} x2={24} y2={7} stroke={INK} strokeWidth={1.5} />
        <line x1={8} y1={13} x2={24} y2={14} stroke={INK} strokeWidth={1.5} />
      </g>
    </g>
  );
};

// ---------- MOUSE ----------
const Mouse: React.FC<{ x: number; y: number; scale: number }> = ({ x, y, scale }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <ellipse cx={0} cy={0} rx={20} ry={12} fill="#A09890" stroke={INK} strokeWidth={3} />
    <circle cx={-18} cy={-2} r={10} fill="#A09890" stroke={INK} strokeWidth={3} />
    {/* Ears */}
    <circle cx={-22} cy={-10} r={5} fill="#D0B0A0" stroke={INK} strokeWidth={2} />
    <circle cx={-14} cy={-10} r={5} fill="#D0B0A0" stroke={INK} strokeWidth={2} />
    {/* Eye */}
    <circle cx={-20} cy={-2} r={1.8} fill={INK} />
    {/* Nose */}
    <circle cx={-27} cy={-1} r={1.5} fill={INK} />
    {/* Tail curly */}
    <path d="M 20 0 Q 30 -6 32 4 Q 34 12 40 6" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
  </g>
);

// ---------- SOFA ----------
const Sofa: React.FC<{ x: number; y: number; w: number; color?: string }> = ({ x, y, w, color = "#A0605A" }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Back */}
    <rect x={-w/2} y={-60} width={w} height={80} rx={15} fill={color} stroke={INK} strokeWidth={4} />
    {/* Seat */}
    <rect x={-w/2 - 10} y={0} width={w + 20} height={45} rx={12} fill={color} stroke={INK} strokeWidth={4} />
    <ellipse cx={0} cy={5} rx={w/2 - 15} ry={8} fill="#000" opacity={0.15} />
    {/* Cushions */}
    <rect x={-w/2 + 20} y={-50} width={w/2 - 30} height={60} rx={8} fill="#8E4A46" stroke={INK} strokeWidth={3} />
    <rect x={20} y={-50} width={w/2 - 30} height={60} rx={8} fill="#8E4A46" stroke={INK} strokeWidth={3} />
    {/* Legs */}
    <rect x={-w/2 - 5} y={45} width={8} height={20} fill={INK} />
    <rect x={w/2 - 3} y={45} width={8} height={20} fill={INK} />
  </g>
);

// ---------- FRIDGE ----------
const Fridge: React.FC<{ x: number; y: number; open: boolean; moldy?: boolean }> = ({ x, y, open, moldy = false }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Body */}
    <rect x={-100} y={-200} width={200} height={400} rx={14} fill="#EDEDE8" stroke={INK} strokeWidth={5} />
    {/* Divider */}
    <line x1={-100} y1={-30} x2={100} y2={-30} stroke={INK} strokeWidth={3} />
    {/* Handles */}
    <rect x={80} y={-160} width={10} height={60} rx={4} fill={INK} />
    <rect x={80} y={30} width={10} height={60} rx={4} fill={INK} />
    {/* Inside when open */}
    {open && (
      <>
        <rect x={-88} y={-188} width={176} height={150} fill="#F5F3EE" stroke={INK} strokeWidth={2} />
        <rect x={-88} y={-18} width={176} height={206} fill="#F5F3EE" stroke={INK} strokeWidth={2} />
        {/* Shelves */}
        <line x1={-88} y1={-100} x2={88} y2={-100} stroke="#AAA" strokeWidth={2} />
        <line x1={-88} y1={60} x2={88} y2={60} stroke="#AAA" strokeWidth={2} />
        <line x1={-88} y1={130} x2={88} y2={130} stroke="#AAA" strokeWidth={2} />
        {moldy ? (
          <>
            {/* Moldy food */}
            <ellipse cx={-40} cy={-65} rx={20} ry={10} fill="#7EA652" stroke={INK} strokeWidth={2} />
            <ellipse cx={40} cy={-55} rx={18} ry={9} fill="#A8B05C" stroke={INK} strokeWidth={2} />
            <rect x={-50} y={90} width={40} height={28} rx={4} fill="#C8B090" stroke={INK} strokeWidth={2} />
            <rect x={10} y={100} width={50} height={22} rx={4} fill="#B8A080" stroke={INK} strokeWidth={2} />
            {/* Mold spots */}
            <circle cx={-36} cy={-68} r={3} fill="#3A5A20" />
            <circle cx={-28} cy={-62} r={2.5} fill="#3A5A20" />
            <circle cx={42} cy={-58} r={3} fill="#3A5A20" />
            {/* Stink lines */}
            <path d="M -30 -90 Q -26 -100 -28 -110" stroke="#7EA652" strokeWidth={2} fill="none" />
            <path d="M 30 -90 Q 34 -100 32 -110" stroke="#7EA652" strokeWidth={2} fill="none" />
            <text x={0} y={-160} fontSize={40} textAnchor="middle">🤢</text>
          </>
        ) : (
          <>
            <circle cx={-30} cy={-70} r={14} fill="#E85878" stroke={INK} strokeWidth={2} />
            <circle cx={25} cy={-65} r={14} fill="#F5C43A" stroke={INK} strokeWidth={2} />
            <ellipse cx={0} cy={90} rx={28} ry={12} fill="#E8B880" stroke={INK} strokeWidth={2} />
            <text x={0} y={-140} fontSize={32} textAnchor="middle">✨</text>
          </>
        )}
      </>
    )}
  </g>
);

// ---------- HOUSE ----------
const House: React.FC<{ x: number; y: number; scale: number }> = ({ x, y, scale }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Body */}
    <rect x={-100} y={-40} width={200} height={150} fill="#E8C8A0" stroke={INK} strokeWidth={5} />
    {/* Roof */}
    <path d="M -120 -40 L 0 -130 L 120 -40 Z" fill="#A04838" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {/* Door */}
    <rect x={-20} y={30} width={40} height={80} fill="#6A3828" stroke={INK} strokeWidth={4} />
    <circle cx={12} cy={70} r={2.5} fill={INK} />
    {/* Windows */}
    <rect x={-80} y={-10} width={40} height={40} fill="#C8E0F0" stroke={INK} strokeWidth={4} />
    <line x1={-60} y1={-10} x2={-60} y2={30} stroke={INK} strokeWidth={3} />
    <line x1={-80} y1={10} x2={-40} y2={10} stroke={INK} strokeWidth={3} />
    <rect x={40} y={-10} width={40} height={40} fill="#C8E0F0" stroke={INK} strokeWidth={4} />
    <line x1={60} y1={-10} x2={60} y2={30} stroke={INK} strokeWidth={3} />
    <line x1={40} y1={10} x2={80} y2={10} stroke={INK} strokeWidth={3} />
    {/* Chimney with smoke */}
    <rect x={40} y={-110} width={22} height={30} fill="#8E3830" stroke={INK} strokeWidth={3} />
  </g>
);

// ---------- MONEY FLY ----------
const MoneyBill: React.FC<{ x: number; y: number; rot: number }> = ({ x, y, rot }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot}) scale(0.9)`}>
    <rect x={-25} y={-14} width={50} height={28} rx={3} fill="#A8E0A0" stroke={INK} strokeWidth={2.5} />
    <circle cx={0} cy={0} r={8} fill="none" stroke={INK} strokeWidth={2} />
    <text x={0} y={4} fontSize={10} textAnchor="middle" fill={INK} fontWeight="bold">$</text>
  </g>
);

// ---------- RUNNING PERSON (for house scene) ----------
const RunPerson: React.FC<{ x: number; y: number; scale: number; phase: number }> = ({ x, y, scale, phase }) => {
  const step = Math.sin(phase * 4) * 12;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Legs running */}
      <line x1={0} y1={30} x2={-20 + step} y2={70} stroke="#F8E0D0" strokeWidth={14} strokeLinecap="round" />
      <line x1={0} y1={30} x2={20 - step} y2={70} stroke="#F8E0D0" strokeWidth={14} strokeLinecap="round" />
      <line x1={0} y1={30} x2={-20 + step} y2={70} stroke={INK} strokeWidth={2.5} />
      <line x1={0} y1={30} x2={20 - step} y2={70} stroke={INK} strokeWidth={2.5} />
      {/* Body */}
      <rect x={-22} y={-20} width={44} height={55} rx={10} fill="#4A5070" stroke={INK} strokeWidth={3.5} />
      {/* Arms - one pumping */}
      <line x1={-22} y1={-10} x2={-40 - step * 0.5} y2={5 - step} stroke="#F8E0D0" strokeWidth={10} strokeLinecap="round" />
      <line x1={22} y1={-10} x2={40 + step * 0.5} y2={5 + step} stroke="#F8E0D0" strokeWidth={10} strokeLinecap="round" />
      <line x1={-22} y1={-10} x2={-40 - step * 0.5} y2={5 - step} stroke={INK} strokeWidth={2.5} />
      <line x1={22} y1={-10} x2={40 + step * 0.5} y2={5 + step} stroke={INK} strokeWidth={2.5} />
      {/* Head */}
      <circle cx={0} cy={-40} r={18} fill="#F8E0D0" stroke={INK} strokeWidth={3.5} />
      {/* Hair */}
      <path d="M -18 -48 Q -14 -58 -4 -55 Q 4 -60 14 -56 Q 18 -50 18 -45" fill="#1A1A22" />
      {/* Eyes stressed */}
      <path d="M -10 -42 L -3 -42" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M 3 -42 L 10 -42" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      {/* Sweat */}
      <path d="M 16 -52 Q 20 -46 18 -42 Q 14 -46 16 -52 Z" fill="#A8D0E8" stroke={INK} strokeWidth={1.5} />
      {/* Mouth panting */}
      <ellipse cx={0} cy={-30} rx={4} ry={3} fill="#6A2030" stroke={INK} strokeWidth={1.5} />
      {/* Motion lines */}
      <line x1={-60} y1={-20} x2={-80} y2={-18} stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <line x1={-60} y1={0} x2={-85} y2={5} stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <line x1={-60} y1={20} x2={-80} y2={25} stroke={INK} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

// ---------- SPEECH BUBBLE ----------
const Bubble: React.FC<{ x: number; y: number; text: string; from: number; to: number; w?: number; h?: number; fs?: number }> = ({ x, y, text, from, to, w = 260, h = 90, fs = 42 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < from || t > to) return null;
  const sp = spring({ frame: (t - from) * FPS, fps: FPS, config: { damping: 10, stiffness: 180, mass: 0.4 } });
  const out = interpolate(t, [to - 0.2, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = sp * out;
  const scale = 0.6 + sp * 0.4;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={op}>
      <path d={`M -30 ${h/2 - 4} L -50 ${h/2 + 40} L 10 ${h/2 - 4} Z`} fill="#FFF8EC" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <rect x={-w/2} y={-h/2} width={w} height={h} rx={30} fill="#FFF8EC" stroke={INK} strokeWidth={5} />
      <foreignObject x={-w/2 + 12} y={-h/2 + 4} width={w - 24} height={h - 8}>
        <div
          // @ts-expect-error xmlns for HTML
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "100%", height: "100%", textAlign: "center",
            fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800,
            fontSize: `${fs}px`, color: INK, lineHeight: 1.1,
          }}
        >{text}</div>
      </foreignObject>
    </g>
  );
};

// ---------- SCENES ----------

// Scene 1: Setup — 3 panels of traditional expectations
const Scene1: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 5;
  return (
    <g>
      {/* Traditional expectation: dog guards house, cat catches mouse, son supports old dad */}
      {/* Header */}
      <text x={W/2} y={300} fontSize={64} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic">
        Ngày xưa...
      </text>
      <line x1={W/2 - 120} y1={326} x2={W/2 + 120} y2={326} stroke={INK} strokeWidth={2} />

      {/* Panel 1: dog guarding */}
      <g transform="translate(540, 560)">
        <rect x={-200} y={-100} width={400} height={200} fill="#F8EFDC" stroke={INK} strokeWidth={4} rx={8} />
        <House x={-90} y={20} scale={0.45} />
        <Dog x={100} y={50} scale={0.85} phase={phase} />
        <text x={0} y={-60} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
          chó → trông nhà
        </text>
      </g>

      {/* Panel 2: cat + mouse */}
      <g transform="translate(540, 830)">
        <rect x={-200} y={-100} width={400} height={200} fill="#F8EFDC" stroke={INK} strokeWidth={4} rx={8} />
        <Cat x={-60} y={30} scale={0.85} phase={phase} />
        <Mouse x={90} y={50} scale={1.1} />
        <text x={0} y={-60} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
          mèo → bắt chuột
        </text>
      </g>

      {/* Panel 3: son supports old dad (symbols) */}
      <g transform="translate(540, 1100)">
        <rect x={-200} y={-100} width={400} height={200} fill="#F8EFDC" stroke={INK} strokeWidth={4} rx={8} />
        {/* Old dad simple */}
        <g transform="translate(-60, 30)">
          <circle cx={0} cy={-30} r={20} fill="#F8E0D0" stroke={INK} strokeWidth={3} />
          <path d="M -14 -42 Q 0 -50 14 -42" fill="#888888" />
          <line x1={-14} y1={-32} x2={-8} y2={-32} stroke={INK} strokeWidth={2} />
          <line x1={8} y1={-32} x2={14} y2={-32} stroke={INK} strokeWidth={2} />
          <path d="M -6 -24 Q 0 -20 6 -24" stroke={INK} strokeWidth={2} fill="none" />
          <rect x={-16} y={-12} width={32} height={40} fill="#7A6A5A" stroke={INK} strokeWidth={3} />
          <line x1={-10} y1={-8} x2={-10} y2={28} stroke={INK} strokeWidth={2} opacity={0.4} />
          {/* Cane */}
          <line x1={22} y1={-10} x2={32} y2={50} stroke="#6A4828" strokeWidth={4} strokeLinecap="round" />
          <path d="M 20 -14 Q 18 -18 22 -20" stroke="#6A4828" strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
        {/* Son strong support */}
        <g transform="translate(60, 25)">
          <circle cx={0} cy={-30} r={18} fill="#F8E0D0" stroke={INK} strokeWidth={3} />
          <path d="M -16 -42 Q 0 -52 16 -40" fill="#1A1A22" />
          <circle cx={-6} cy={-30} r={2} fill={INK} />
          <circle cx={6} cy={-30} r={2} fill={INK} />
          <path d="M -5 -20 Q 0 -16 5 -20" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
          <path d="M -22 -12 L -28 10 L -10 26 L 10 26 L 28 10 L 22 -12 Q 12 -16 0 -16 Q -12 -16 -22 -12 Z" fill="#5070A8" stroke={INK} strokeWidth={3} />
          {/* Flexed arm */}
          <path d="M -22 -8 Q -38 -14 -32 -28" stroke="#F8E0D0" strokeWidth={10} fill="none" strokeLinecap="round" />
          <circle cx={-32} cy={-28} r={5} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
          <text x={-36} y={-38} fontSize={18} textAnchor="middle">💪</text>
        </g>
        <text x={0} y={-60} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
          con trai → chỗ dựa về già
        </text>
      </g>
    </g>
  );
};

// Scene 2: pivot "Bây giờ nhìn lại mới thấy"
const Scene2: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 4;
  const pulse = 1 + Math.sin(phase * 4) * 0.05;
  return (
    <g>
      <text
        x={W/2}
        y={H/2 - 40}
        fontSize={130}
        fill={INK}
        textAnchor="middle"
        fontFamily="'EB Garamond', serif"
        fontWeight={600}
        transform={`scale(${pulse} ${pulse}) translate(${(W/2) * (1 - 1/pulse)}, ${(H/2 - 40) * (1 - 1/pulse)})`}
      >
        NHƯNG...
      </text>
      <text x={W/2} y={H/2 + 60} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
        đời không như mơ
      </text>
      {/* Question marks */}
      <text x={W/2 - 260} y={H/2 - 140} fontSize={80} textAnchor="middle" opacity={0.5}>?</text>
      <text x={W/2 + 260} y={H/2 - 80} fontSize={100} textAnchor="middle" opacity={0.4}>?</text>
      <text x={W/2 - 200} y={H/2 + 200} fontSize={70} textAnchor="middle" opacity={0.5}>?</text>
    </g>
  );
};

// Scene 3: Dog on sofa
const Scene3: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 3;
  return (
    <g>
      <Sofa x={540} y={1050} w={620} />
      <Dog x={540} y={960} scale={1.8} phase={phase} tongueOut />
      <text x={540} y={620} fontSize={52} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic">
        Thực tế...
      </text>
      <Bubble x={820} y={830} text="SƯỚNG QUÁ 🐕" from={T.dog[0]} to={T.dog[1]} w={320} fs={38} />
      {/* Zzz */}
      <text x={380} y={900} fontSize={50} opacity={0.55}>💤</text>
    </g>
  );
};

// Scene 4: Cat ignoring mouse
const Scene4: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 3;
  const mouseX = interpolate(lf, [0, 50], [380, 800]);
  return (
    <g>
      {/* Floor line */}
      <line x1={100} y1={1200} x2={W - 100} y2={1200} stroke={INK} strokeWidth={4} />
      <Cat x={540} y={1100} scale={2.2} phase={phase} bored />
      <Mouse x={mouseX} y={1180} scale={1.6} />
      <text x={540} y={620} fontSize={52} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic">
        Còn mèo?
      </text>
      <Bubble x={760} y={920} text="MỆT LẮM 😴" from={T.cat[0]} to={T.cat[1]} w={310} fs={38} />
    </g>
  );
};

// Scene 5: Old dad carrying son on back
const Scene5: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 3;
  const bob = Math.sin(phase * 2) * 3;
  return (
    <g transform={`translate(0, ${bob})`}>
      {/* Ground */}
      <line x1={80} y1={1300} x2={W - 80} y2={1300} stroke={INK} strokeWidth={4} />

      {/* Old dad (bigger, tired) */}
      <g transform="translate(540, 1100)">
        {/* Legs tired bent */}
        <path d="M -22 120 Q -28 170 -26 230" stroke="#F8E0D0" strokeWidth={28} strokeLinecap="round" fill="none" />
        <path d="M 22 120 Q 28 170 26 230" stroke="#F8E0D0" strokeWidth={28} strokeLinecap="round" fill="none" />
        <path d="M -22 120 Q -28 170 -26 230" stroke={INK} strokeWidth={3} fill="none" />
        <path d="M 22 120 Q 28 170 26 230" stroke={INK} strokeWidth={3} fill="none" />
        <ellipse cx={-26} cy={236} rx={16} ry={5} fill={INK} />
        <ellipse cx={26} cy={236} rx={16} ry={5} fill={INK} />
        {/* Body — tired bent forward */}
        <path d="M -52 -30 Q -58 -10 -52 14 L -48 100 Q -44 120 -34 132 L 34 132 Q 44 120 48 100 L 52 14 Q 58 -10 52 -30 Q 40 -44 0 -44 Q -40 -44 -52 -30 Z" fill="#7A6A5A" stroke={INK} strokeWidth={4} />
        {/* Arms up holding son */}
        <path d="M -52 -22 Q -66 -50 -56 -86" stroke="#F8E0D0" strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d="M 52 -22 Q 66 -50 56 -86" stroke="#F8E0D0" strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d="M -52 -22 Q -66 -50 -56 -86" stroke={INK} strokeWidth={3} fill="none" />
        <path d="M 52 -22 Q 66 -50 56 -86" stroke={INK} strokeWidth={3} fill="none" />
        {/* Head */}
        <circle cx={0} cy={-72} r={28} fill="#F8E0D0" stroke={INK} strokeWidth={4} />
        {/* Grey hair */}
        <path d="M -24 -88 Q -18 -104 0 -100 Q 18 -104 24 -88 L 24 -78 L -24 -78 Z" fill="#888" />
        {/* Tired eyes */}
        <path d="M -14 -72 Q -9 -68 -4 -72" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M 4 -72 Q 9 -68 14 -72" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
        {/* Bags under eyes */}
        <path d="M -14 -66 Q -9 -60 -4 -66" stroke={INK} strokeWidth={1.5} fill="none" opacity={0.6} />
        <path d="M 4 -66 Q 9 -60 14 -66" stroke={INK} strokeWidth={1.5} fill="none" opacity={0.6} />
        {/* Mouth exhausted */}
        <path d="M -8 -54 L 8 -54" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        {/* Sweat */}
        <path d="M -32 -78 Q -36 -70 -34 -64 Q -28 -68 -32 -78 Z" fill="#A8D0E8" stroke={INK} strokeWidth={2} />
      </g>

      {/* Big fat son on his shoulders */}
      <g transform="translate(540, 870)">
        <ellipse cx={0} cy={40} rx={60} ry={30} fill="#B8D878" stroke={INK} strokeWidth={4} />
        {/* Body fat */}
        <ellipse cx={0} cy={0} rx={50} ry={50} fill="#B8D878" stroke={INK} strokeWidth={4} />
        {/* Head */}
        <circle cx={0} cy={-50} r={30} fill="#F8E0D0" stroke={INK} strokeWidth={4} />
        {/* Hair spike */}
        <path d="M -22 -66 Q -14 -84 -4 -70 Q 4 -86 14 -72 Q 22 -80 24 -64" fill="#1A1A22" />
        {/* Phone */}
        <g transform="translate(32, 10) rotate(-15)">
          <rect x={-14} y={-22} width={28} height={44} rx={4} fill="#1A1A22" stroke={INK} strokeWidth={2.5} />
          <rect x={-11} y={-18} width={22} height={34} fill="#7CB8F0" />
        </g>
        {/* Holding phone arm */}
        <line x1={0} y1={10} x2={30} y2={10} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
        <line x1={0} y1={10} x2={30} y2={10} stroke={INK} strokeWidth={2.5} />
        {/* Eyes looking at phone */}
        <path d="M -12 -48 Q -8 -44 -4 -48" stroke={INK} strokeWidth={2.5} fill="none" />
        <path d="M 4 -48 Q 8 -44 12 -48" stroke={INK} strokeWidth={2.5} fill="none" />
        {/* Smile smug */}
        <path d="M -6 -35 Q 0 -30 6 -35" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      </g>

      <text x={540} y={560} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic">
        Về già...
      </text>
      <Bubble x={850} y={880} text="BỐ ƠI NẠP TIỀN 💸" from={T.son[0] + 1.4} to={T.son[1]} w={420} fs={34} />
    </g>
  );
};

// Scene 6: Life pivot text
const Scene6: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 3;
  const sp = spring({ frame: lf, fps: FPS, config: { damping: 12, stiffness: 100 } });
  return (
    <g>
      <text
        x={W/2}
        y={H/2 - 40}
        fontSize={100}
        fill={INK}
        textAnchor="middle"
        fontFamily="'EB Garamond', serif"
        fontWeight={600}
        opacity={sp}
      >CUỘC ĐỜI</text>
      <text
        x={W/2}
        y={H/2 + 80}
        fontSize={58}
        fill={ACCENT}
        textAnchor="middle"
        fontFamily="'EB Garamond', serif"
        fontWeight={600}
        fontStyle="italic"
        opacity={sp}
      >cũng y chang...</text>
    </g>
  );
};

// Scene 7: Fridge moldy food
const Scene7: React.FC<{ lf: number }> = ({ lf }) => {
  const localFrame = lf;
  // First 2s show fresh, then open moldy
  const showMoldy = localFrame > 60;
  return (
    <g>
      <text x={540} y={560} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic">
        {showMoldy ? "Thực tế..." : "Mua để..."}
      </text>
      <Fridge x={540} y={1100} open moldy={showMoldy} />
      <Bubble
        x={820}
        y={850}
        text={showMoldy ? "ĐỒ THỪA 🤢" : "ĐỒ TƯƠI ✨"}
        from={showMoldy ? T.fridge[0] + 2 : T.fridge[0]}
        to={showMoldy ? T.fridge[1] : T.fridge[0] + 2.1}
        w={320}
        fs={36}
      />
    </g>
  );
};

// Scene 8: Man running with money flying away, house behind
const Scene8: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 2;
  const bill1 = interpolate(lf, [0, 80], [0, -500]);
  const bill2 = interpolate(lf, [0, 80], [0, -400]);
  const bill3 = interpolate(lf, [0, 80], [0, -550]);
  return (
    <g>
      <text x={540} y={560} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic">
        Mua nhà xong...
      </text>
      {/* House in background */}
      <g opacity={0.55}>
        <House x={780} y={1100} scale={0.85} />
      </g>
      {/* Running person */}
      <RunPerson x={380} y={1150} scale={1.6} phase={phase} />
      {/* Flying money */}
      <g transform={`translate(${420 + bill1}, ${1060 + bill1 * 0.3})`}>
        <MoneyBill x={0} y={0} rot={-12} />
      </g>
      <g transform={`translate(${460 + bill2}, ${1020 + bill2 * 0.2})`}>
        <MoneyBill x={0} y={0} rot={14} />
      </g>
      <g transform={`translate(${350 + bill3}, ${1100 + bill3 * 0.25})`}>
        <MoneyBill x={0} y={0} rot={-20} />
      </g>
      <Bubble x={550} y={940} text="TRẢ NỢ 😵" from={T.house[0] + 1.2} to={T.house[1]} w={300} fs={38} />
    </g>
  );
};

// Scene 9: Marriage with stress cloud
const Scene9: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 2.5;
  return (
    <g>
      <text x={540} y={460} fontSize={52} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic">
        Cưới xong...
      </text>
      {/* Ground */}
      <line x1={80} y1={1560} x2={W - 80} y2={1560} stroke={INK} strokeWidth={4} />
      {/* Em on left */}
      <EmMituOt x={380} y={1450} scale={2.0} emotion="angry" phase={phase * 2} />
      {/* Anh on right */}
      <AnhGach x={720} y={1480} scale={1.8} pose="pocket" />

      {/* Stress cloud above */}
      <g transform="translate(540, 900)">
        <path d="M -140 30 Q -180 0 -150 -40 Q -140 -90 -80 -80 Q -40 -130 30 -110 Q 100 -130 130 -80 Q 180 -60 160 0 Q 180 60 120 60 Q 80 100 10 80 Q -50 110 -100 70 Q -170 80 -140 30 Z"
              fill="#8A8A92" stroke={INK} strokeWidth={5} />
        <text x={0} y={-10} fontSize={50} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fill={INK}>
          ÁP LỰC
        </text>
        <text x={0} y={42} fontSize={34} textAnchor="middle">⚡😵⚡</text>
      </g>
      {/* Rain drops from cloud */}
      <path d="M -60 980 L -64 1000 L -56 1000 Z" fill="#6A8AA8" opacity={0.8} transform="translate(540 0)" />
      <path d="M 0 990 L -4 1010 L 4 1010 Z" fill="#6A8AA8" opacity={0.8} transform="translate(540 0)" />
      <path d="M 60 985 L 56 1005 L 64 1005 Z" fill="#6A8AA8" opacity={0.8} transform="translate(540 0)" />
    </g>
  );
};

// ---------- CAPTION karaoke bottom ----------
const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
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
        gap: "0 12px", maxWidth: 980, padding: "18px 40px",
        backgroundColor: "rgba(255,248,236,0.92)",
        borderRadius: 24,
        border: `5px solid ${INK}`,
      }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [8, 0]);
          const isActive = t >= w.start - LEAD && t < w.end;
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 800,
              fontSize: 42,
              color: isActive ? ACCENT : INK,
              opacity: visible ? sp : 0,
              transform: `translateY(${y}px)`,
              lineHeight: 1.2,
            }}>{w.word}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- MAIN ----------
export const ReupTT01: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const globalOp = interpolate(frame, [0, 10, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Determine active scene
  let sceneIndex = 0;
  const scenes: [readonly [number, number], (lf: number) => React.ReactNode][] = [
    [T.setup, (lf) => <Scene1 lf={lf} />],
    [T.pivot1, (lf) => <Scene2 lf={lf} />],
    [T.dog, (lf) => <Scene3 lf={lf} />],
    [T.cat, (lf) => <Scene4 lf={lf} />],
    [T.son, (lf) => <Scene5 lf={lf} />],
    [T.pivot2, (lf) => <Scene6 lf={lf} />],
    [T.fridge, (lf) => <Scene7 lf={lf} />],
    [T.house, (lf) => <Scene8 lf={lf} />],
    [T.marriage, (lf) => <Scene9 lf={lf} />],
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, opacity: globalOp }}>
      <Bg />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {scenes.map(([range, renderFn], i) => {
          if (!inRange(t, range)) return null;
          const localFrame = frame - range[0] * FPS;
          const fadeIn = interpolate(t, [range[0], range[0] + 0.25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const fadeOut = interpolate(t, [range[1] - 0.25, range[1]], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const op = Math.min(fadeIn, fadeOut);
          return <g key={i} opacity={op}>{renderFn(localFrame)}</g>;
        })}
      </svg>
      <Caption />
      <Audio src={staticFile("reup_tt_01/voice.mp3")} volume={0.95} />
      <Audio src={staticFile("reup_tt_01/music.mp3")} volume={0.06} />
    </AbsoluteFill>
  );
};
