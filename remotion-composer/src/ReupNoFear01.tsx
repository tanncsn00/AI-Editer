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
import wordsData from "./reup_tt_nofear_01_words.json";
import { EmMituOt } from "./CoupleChars";
import { SigmaHead, SigmaBody } from "./FigureStyles";

loadEBGaramond("normal", { weights: ["400","500","600","700"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// REUP NoFear-01 — "Chồng cười các vợ còn xài CapCut"
// Spin-off tone gắt — bóc 4 đau workflow cũ → flip Vibe Editing
// Duration ~37.5s @ 30fps = 1125 frames

const FPS = 30;
const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const ACCENT2 = "#E03A2A";
const GOLD = "#E5A53B";
const SIGMA_SKIN = "#D8C4B0";
const SIGMA_HAIR = "#1A1820";
const SIGMA_SHADOW = "#7A5838";

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

// ---------- BEAT TIMINGS (mapped from words.json sentences) ----------
const T = {
  hook:       [0.0,   4.60] as const,  // S1+S2 chồng smirk
  pain1:      [4.60,  9.10] as const,  // S3 render lâu
  pain2:      [9.10,  13.25] as const, // S4 gõ phụ đề
  pain3:      [13.25, 17.80] as const, // S5 watermark CapCut
  pain4:      [17.80, 21.70] as const, // S6 Adobe lậu FBI
  pivot:      [21.70, 24.40] as const, // S7+S8 tội ghê + chồng đây
  flip:       [24.40, 32.10] as const, // S9 Vibe Editing — laptop tự ra
  cta:        [32.10, 37.55] as const, // S10+S11 logo + follow
};
const inRange = (t: number, r: readonly [number, number]) => t >= r[0] && t < r[1];

// ---------- BG (paper + grain + vignette) ----------
const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="paperNF">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.22 0" />
      </filter>
      <radialGradient id="vigNF" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.45" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#paperNF)" />
    <rect width={W} height={H} fill="url(#vigNF)" />
  </svg>
);

// ---------- LAPTOP shell ----------
const Laptop: React.FC<{ x: number; y: number; scale?: number; screenColor?: string; children?: React.ReactNode }> = ({ x, y, scale = 1, screenColor = "#202028", children }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Base */}
    <path d="M -180 80 L 180 80 L 200 110 L -200 110 Z" fill="#A0A0A8" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <ellipse cx={0} cy={108} rx={30} ry={4} fill="#6A6A72" />
    {/* Screen back */}
    <rect x={-170} y={-130} width={340} height={210} rx={10} fill="#1A1A22" stroke={INK} strokeWidth={4} />
    {/* Screen inner */}
    <rect x={-160} y={-122} width={320} height={194} rx={4} fill={screenColor} />
    {children}
  </g>
);

// ---------- BUBBLE ----------
const Bubble: React.FC<{ x: number; y: number; text: string; from: number; to: number; w?: number; h?: number; fs?: number; tail?: "left" | "right" }> = ({ x, y, text, from, to, w = 320, h = 100, fs = 40, tail = "left" }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < from || t > to) return null;
  const sp = spring({ frame: (t - from) * FPS, fps: FPS, config: { damping: 10, stiffness: 180, mass: 0.4 } });
  const out = interpolate(t, [to - 0.2, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = sp * out;
  const scale = 0.6 + sp * 0.4;
  const tailPath = tail === "left"
    ? `M -30 ${h/2 - 4} L -50 ${h/2 + 40} L 10 ${h/2 - 4} Z`
    : `M 30 ${h/2 - 4} L 50 ${h/2 + 40} L -10 ${h/2 - 4} Z`;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={op}>
      <path d={tailPath} fill="#FFF8EC" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <rect x={-w/2} y={-h/2} width={w} height={h} rx={28} fill="#FFF8EC" stroke={INK} strokeWidth={5} />
      <foreignObject x={-w/2 + 12} y={-h/2 + 4} width={w - 24} height={h - 8}>
        <div
          // @ts-expect-error xmlns for HTML
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "100%", height: "100%", textAlign: "center",
            fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800,
            fontSize: `${fs}px`, color: INK, lineHeight: 1.05,
          }}
        >{text}</div>
      </foreignObject>
    </g>
  );
};

// =================================================================
// SCENE 1 — HOOK: Sigma chồng smirk, point down, "lại đây cười"
// =================================================================
const SceneHook: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 6;
  const blink = Math.max(0, Math.sin(lf / 18) - 0.96) * 30;
  const headBob = Math.sin(phase * 1.2) * 4;
  return (
    <g>
      {/* Header label */}
      <text x={W/2} y={300} fontSize={64} fill={INK} textAnchor="middle"
            fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic">
        — Chồng cười —
      </text>
      <line x1={W/2 - 160} y1={326} x2={W/2 + 160} y2={326} stroke={INK} strokeWidth={2} />

      {/* Sigma chồng — full body big */}
      <g transform={`translate(${0}, ${headBob})`}>
        <SigmaBody x={540} y={1140} scale={1.4} phase={phase} skinColor={SIGMA_SKIN} shadowColor={SIGMA_SHADOW} />
        <SigmaHead x={540} y={1140 - 72 * 1.4} scale={1.4} skinColor={SIGMA_SKIN} hairColor={SIGMA_HAIR} shadowColor={SIGMA_SHADOW} blink={blink} />
      </g>

      {/* Smirk emphasis sparkle */}
      <text x={760} y={1010} fontSize={50}>✨</text>
      <text x={320} y={1040} fontSize={42} opacity={0.7}>😏</text>

      <Bubble x={780} y={680} text="LẠI ĐÂY CHỒNG CƯỜI 😤" from={1.0} to={4.4} w={520} fs={36} tail="left" />
    </g>
  );
};

// =================================================================
// SCENE 2 — PAIN render lâu: Em Mít Ướt cry trước laptop progress 47% + clock
// =================================================================
const ScenePain1: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 4;
  const tearShake = Math.sin(phase * 8) * 2;
  const pct = Math.floor(interpolate(lf, [0, 130], [12, 47]));
  const clockRot = lf * 6;
  return (
    <g>
      <text x={W/2} y={420} fontSize={56} fill={ACCENT} textAnchor="middle"
            fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic">
        Đau số 1
      </text>

      {/* Big clock - 3 hours */}
      <g transform="translate(840, 580)">
        <circle cx={0} cy={0} r={88} fill="#FFF8EC" stroke={INK} strokeWidth={6} />
        {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
          const a = (i * 30) * Math.PI / 180;
          const r1 = 70, r2 = 80;
          return <line key={i} x1={Math.sin(a)*r1} y1={-Math.cos(a)*r1} x2={Math.sin(a)*r2} y2={-Math.cos(a)*r2} stroke={INK} strokeWidth={3} />;
        })}
        {/* Hour hand spinning fast */}
        <line x1={0} y1={0} x2={Math.sin(clockRot * Math.PI / 180) * 35} y2={-Math.cos(clockRot * Math.PI / 180) * 35} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={0} x2={Math.sin(clockRot * 12 * Math.PI / 180) * 60} y2={-Math.cos(clockRot * 12 * Math.PI / 180) * 60} stroke={ACCENT} strokeWidth={4} strokeLinecap="round" />
        <circle cx={0} cy={0} r={6} fill={INK} />
        <text x={0} y={50} fontSize={20} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>3 TIẾNG</text>
      </g>

      {/* Laptop with progress bar */}
      <Laptop x={540} y={1100} scale={1.4}>
        <text x={0} y={-78} fontSize={26} fill="#F0F0F8" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>RENDERING...</text>
        {/* Progress bar */}
        <rect x={-130} y={-40} width={260} height={32} rx={6} fill="#3A3A42" stroke={INK} strokeWidth={2} />
        <rect x={-130} y={-40} width={260 * pct / 100} height={32} rx={6} fill={ACCENT} />
        <text x={0} y={-15} fontSize={22} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{pct}%</text>
        <text x={0} y={28} fontSize={20} fill="#F0E0A0" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ETA: 2:43:12</text>
        {/* Sweat drops on screen */}
        <text x={130} y={50} fontSize={28}>💦</text>
        <text x={-130} y={50} fontSize={26}>🔥</text>
      </Laptop>

      {/* Em Mít Ướt cry to the side */}
      <g transform={`translate(${tearShake}, 0)`}>
        <EmMituOt x={260} y={1330} scale={1.4} emotion="cry" phase={phase * 2} />
      </g>

      {/* Smoke / heat lines from laptop */}
      <text x={420} y={930} fontSize={36} opacity={0.7}>💨</text>
      <text x={680} y={920} fontSize={40} opacity={0.7}>💨</text>
    </g>
  );
};

// =================================================================
// SCENE 3 — PAIN gõ phụ đề tay: Em hand typing tiny, sweat
// =================================================================
const ScenePain2: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 3;
  const fingerTap = Math.sin(phase * 12) * 3;
  return (
    <g>
      <text x={W/2} y={420} fontSize={56} fill={ACCENT} textAnchor="middle"
            fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic">
        Đau số 2
      </text>

      {/* Em angry/tired in front of laptop */}
      <g transform="translate(0, 0)">
        <EmMituOt x={300} y={1100} scale={1.5} emotion="angry" phase={phase} />
      </g>

      {/* Laptop with subtitle text typing */}
      <g transform="translate(720, 1050)">
        <Laptop x={0} y={0} scale={1.3}>
          <text x={0} y={-90} fontSize={24} fill="#F0F0F8" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>SUBTITLE.SRT</text>
          {/* Lines of text */}
          {[0,1,2,3,4].map((i) => {
            const w = 80 + (i * 30) % 120;
            return <rect key={i} x={-130} y={-60 + i * 22} width={w} height={10} rx={2} fill="#888" />;
          })}
          {/* Active line being typed */}
          <rect x={-130} y={50} width={140 + fingerTap * 8} height={12} rx={2} fill={ACCENT} />
          <rect x={-130 + 140 + fingerTap * 8 + 4} y={48} width={4} height={16} fill="#FFF" />
        </Laptop>

        {/* Hand reaching out typing */}
        <g transform={`translate(${-50 + fingerTap}, 130)`}>
          {/* Forearm */}
          <path d="M -120 30 Q -60 20 -10 22" stroke="#F8E0D0" strokeWidth={26} strokeLinecap="round" fill="none" />
          <path d="M -120 30 Q -60 20 -10 22" stroke={INK} strokeWidth={2.5} fill="none" />
          {/* Hand */}
          <ellipse cx={5} cy={20} rx={18} ry={14} fill="#F8E0D0" stroke={INK} strokeWidth={2.5} />
          {/* Fingers */}
          {[-12, -4, 4, 12].map((fx, i) => (
            <rect key={i} x={fx - 3} y={6 + (i % 2) * 2} width={6} height={14} rx={3} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
          ))}
          {/* Sweat drop on hand */}
          <text x={-30} y={-8} fontSize={30}>💦</text>
        </g>
      </g>

      {/* Floating subtitle words */}
      <g opacity={0.7}>
        <text x={150} y={730} fontSize={28} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} transform="rotate(-8 150 730)">"em yêu anh"</text>
        <text x={920} y={780} fontSize={24} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} transform="rotate(6 920 780)">"00:01:23"</text>
        <text x={180} y={1500} fontSize={26} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} transform="rotate(4 180 1500)">"hết tập"</text>
      </g>

      <Bubble x={300} y={870} text="MỎI CỔ TAY 🥲" from={T.pain2[0] + 0.6} to={T.pain2[1]} w={360} fs={36} />
    </g>
  );
};

// =================================================================
// SCENE 4 — PAIN watermark CapCut: video xong dính logo to ở góc
// =================================================================
const ScenePain3: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 4;
  const wmPulse = 1 + Math.sin(phase * 4) * 0.08;
  return (
    <g>
      <text x={W/2} y={420} fontSize={56} fill={ACCENT} textAnchor="middle"
            fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic">
        Đau số 3
      </text>

      {/* Big phone mockup showing video with watermark */}
      <g transform="translate(540, 1180)">
        <rect x={-220} y={-380} width={440} height={760} rx={50} fill={INK} stroke={INK} strokeWidth={6} />
        <rect x={-200} y={-360} width={400} height={720} rx={32} fill="#F8E8C8" stroke={INK} strokeWidth={3} />

        {/* Video content (sketch of a face) */}
        <g transform="translate(0, -40)">
          <circle cx={0} cy={-30} r={70} fill="#F8E0D0" stroke={INK} strokeWidth={4} />
          <path d="M -30 -88 Q -10 -100 14 -90 Q 36 -80 40 -50 L 32 -42 Q 0 -52 -34 -42 L -38 -52 Z" fill="#3A1D10" />
          <circle cx={-22} cy={-30} r={5} fill={INK} />
          <circle cx={22} cy={-30} r={5} fill={INK} />
          <path d="M -16 -10 Q 0 0 16 -10" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
          {/* Body */}
          <path d="M -60 60 Q 0 40 60 60 L 70 200 L -70 200 Z" fill={ACCENT} stroke={INK} strokeWidth={4} />
        </g>

        {/* Subtitle bar at bottom */}
        <rect x={-180} y={250} width={360} height={50} rx={8} fill="#FFF" stroke={INK} strokeWidth={3} opacity={0.85} />
        <text x={0} y={282} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>vợ ơi anh về rồi nè</text>

        {/* HUGE CapCut watermark in corner */}
        <g transform={`translate(${130}, ${-260}) scale(${wmPulse})`}>
          <rect x={-90} y={-30} width={180} height={60} rx={10} fill="#000" stroke={ACCENT} strokeWidth={4} opacity={0.92} />
          <text x={0} y={10} fontSize={36} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CapCut ▶</text>
        </g>
        {/* Arrow pointing to it */}
        <path d="M 0 -300 L 50 -270" stroke={ACCENT2} strokeWidth={6} fill="none" strokeLinecap="round" markerEnd="url(#arrA)" />
        <defs>
          <marker id="arrA" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M 0 0 L 12 6 L 0 12 Z" fill={ACCENT2} />
          </marker>
        </defs>
        <text x={-90} y={-300} fontSize={32} fill={ACCENT2} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>QUÊ DỄ SỢ</text>
      </g>

      <Bubble x={260} y={780} text="VỢ NGHÈO 😩" from={T.pain3[0] + 1.2} to={T.pain3[1]} w={340} fs={36} tail="left" />
    </g>
  );
};

// =================================================================
// SCENE 5 — PAIN Adobe lậu: Em sợ FBI gõ cửa, laptop có pirate skull
// =================================================================
const ScenePain4: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 3;
  const knockShake = Math.sin(phase * 14) * 6;
  const flash = Math.floor(lf / 6) % 2 ? "#FF1A1A" : "#1A4AFF";
  return (
    <g>
      <text x={W/2} y={420} fontSize={56} fill={ACCENT} textAnchor="middle"
            fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic">
        Đau số 4
      </text>

      {/* Em scared in dark room, laptop with skull on screen */}
      <g transform={`translate(${knockShake}, 0)`}>
        <EmMituOt x={380} y={1280} scale={1.5} emotion="shocked" phase={phase * 2} />

        {/* Laptop with pirate Adobe */}
        <Laptop x={780} y={1180} scale={1.2} screenColor="#0A0A14">
          <text x={0} y={-80} fontSize={24} fill="#FF3030" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ADOBE CRACKED</text>
          {/* Skull */}
          <g transform="translate(0, -10)">
            <ellipse cx={0} cy={0} rx={32} ry={36} fill="#F0F0F0" stroke="#000" strokeWidth={3} />
            <ellipse cx={-12} cy={-2} rx={8} ry={10} fill="#000" />
            <ellipse cx={12} cy={-2} rx={8} ry={10} fill="#000" />
            <path d="M -3 14 L 3 14 L 5 24 L -5 24 Z" fill="#000" />
            <path d="M -10 30 L -6 36 L 0 32 L 6 36 L 10 30" stroke="#000" strokeWidth={2.5} fill="none" />
          </g>
          <text x={0} y={62} fontSize={18} fill="#FF3030" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>by [REDACTED] keygen.exe</text>
        </Laptop>
      </g>

      {/* Door with FBI pounding (top right corner) */}
      <g transform={`translate(${850 + knockShake * 1.5}, 700)`}>
        <rect x={-60} y={-180} width={120} height={260} rx={6} fill="#6A4828" stroke={INK} strokeWidth={5} />
        <circle cx={42} cy={-50} r={6} fill={GOLD} stroke={INK} strokeWidth={2} />
        {/* Knock impact lines */}
        <text x={-110} y={-60} fontSize={42} fill={ACCENT2} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BANG!</text>
        <text x={-130} y={20} fontSize={38} fill={ACCENT2} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BANG!</text>
        {/* Speech from outside */}
        <g transform="translate(-30, -230)">
          <rect x={-110} y={-30} width={220} height={56} rx={12} fill="#FFF8EC" stroke={INK} strokeWidth={4} />
          <text x={0} y={9} fontSize={30} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FBI! MỞ CỬA!</text>
        </g>
      </g>

      {/* Police flash light effect */}
      <rect x={0} y={0} width={W} height={H} fill={flash} opacity={0.06} />
    </g>
  );
};

// =================================================================
// SCENE 6 — PIVOT: Sigma cười khinh tsk tsk
// =================================================================
const ScenePivot: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 4;
  const sp = spring({ frame: lf, fps: FPS, config: { damping: 12, stiffness: 110 } });
  const headBob = Math.sin(phase * 1.5) * 5;
  const blink = Math.max(0, Math.sin(lf / 14) - 0.95) * 25;
  return (
    <g>
      <text x={W/2} y={350} fontSize={88} fill={INK} textAnchor="middle"
            fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic"
            opacity={sp}>
        Tội ghê...
      </text>

      {/* Sigma chồng cười khinh */}
      <g transform={`translate(0, ${headBob})`}>
        <SigmaBody x={540} y={1180} scale={1.4} phase={phase} skinColor={SIGMA_SKIN} shadowColor={SIGMA_SHADOW} />
        <SigmaHead x={540} y={1180 - 72 * 1.4} scale={1.4} skinColor={SIGMA_SKIN} hairColor={SIGMA_HAIR} shadowColor={SIGMA_SHADOW} mouthOpen={0.15} blink={blink} />
      </g>

      {/* Tsk tsk text floating */}
      <text x={250} y={1100} fontSize={50} fill={ACCENT} fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic" opacity={sp}>tsk tsk</text>
      <text x={780} y={1070} fontSize={48} fill={ACCENT} fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic" opacity={sp}>tsk tsk</text>
      <text x={W/2} y={1700} fontSize={44} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic" opacity={sp}>trong khi chồng đây này...</text>
    </g>
  );
};

// =================================================================
// SCENE 7 — FLIP Vibe Editing: Sigma há miệng prompt → laptop ra mp4 + sub + nhạc icons
// =================================================================
const SceneFlip: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 3;
  const mouthCycle = Math.abs(Math.sin(phase * 6)) * 0.7;
  const blink = Math.max(0, Math.sin(lf / 16) - 0.95) * 25;

  // Icons emerging from laptop one by one
  const iconStart = (i: number) => 30 + i * 22;
  const iconScale = (i: number) => {
    const localF = lf - iconStart(i);
    if (localF < 0) return 0;
    return spring({ frame: localF, fps: FPS, config: { damping: 12, stiffness: 180 } });
  };
  const iconY = (i: number) => {
    const localF = lf - iconStart(i);
    if (localF < 0) return 0;
    return interpolate(localF, [0, 30], [0, -120 - i * 6], { extrapolateRight: "clamp" });
  };

  const icons = [
    { emoji: "🎬", label: "video" },
    { emoji: "📝", label: "sub" },
    { emoji: "🎵", label: "nhạc" },
    { emoji: "💻", label: "code" },
    { emoji: "💸", label: "free" },
  ];

  return (
    <g>
      <text x={W/2} y={290} fontSize={48} fill={INK} textAnchor="middle"
            fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic">
        — Trong khi —
      </text>

      {/* Sigma talking */}
      <g transform="translate(-180, 0)">
        <SigmaBody x={540} y={1180} scale={1.0} phase={phase} skinColor={SIGMA_SKIN} shadowColor={SIGMA_SHADOW} />
        <SigmaHead x={540} y={1180 - 72} scale={1.0} skinColor={SIGMA_SKIN} hairColor={SIGMA_HAIR} shadowColor={SIGMA_SHADOW} mouthOpen={mouthCycle} blink={blink} />
      </g>

      {/* Sound wave from mouth → laptop */}
      <g opacity={0.7}>
        {[0, 1, 2, 3].map((i) => {
          const op = (Math.sin(phase * 6 + i * 0.7) + 1) / 2;
          return <circle key={i} cx={420 + i * 30} cy={1110} r={6 + i * 2} fill="none" stroke={ACCENT} strokeWidth={3} opacity={op} />;
        })}
      </g>

      {/* Laptop on right with output */}
      <g transform="translate(740, 1100)">
        <Laptop x={0} y={0} scale={1.2} screenColor="#1A2A1A">
          <text x={0} y={-70} fontSize={20} fill="#80FF80" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>$ vibe-editing</text>
          <text x={-140} y={-40} fontSize={16} fill="#80FF80" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400}>{">>"} TTS done ✓</text>
          <text x={-140} y={-18} fontSize={16} fill="#80FF80" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400}>{">>"} render done ✓</text>
          <text x={-140} y={4} fontSize={16} fill="#80FF80" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400}>{">>"} subtitle done ✓</text>
          <text x={-140} y={26} fontSize={16} fill="#80FF80" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400}>{">>"} music done ✓</text>
          <text x={-140} y={48} fontSize={16} fill="#FFFF80" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>video.mp4 → ✨</text>
        </Laptop>

        {/* Icons emerging */}
        {icons.map((ic, i) => (
          <g key={i} transform={`translate(${(i - 2) * 70}, ${iconY(i) - 130}) scale(${iconScale(i)})`}>
            <circle cx={0} cy={0} r={36} fill="#FFF8EC" stroke={INK} strokeWidth={4} />
            <text x={0} y={14} fontSize={42} textAnchor="middle">{ic.emoji}</text>
            <text x={0} y={62} fontSize={20} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{ic.label}</text>
          </g>
        ))}
      </g>

      {/* "FREE" stamp top-left, away from chars */}
      <g transform="translate(180, 580) rotate(-15)" opacity={Math.min(1, lf / 60)}>
        <rect x={-110} y={-44} width={220} height={88} rx={8} fill="none" stroke={ACCENT2} strokeWidth={8} />
        <text x={0} y={22} fontSize={64} fill={ACCENT2} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic">FREE</text>
      </g>

      {/* "0 ĐỒNG" badge bottom-left */}
      <g transform="translate(220, 1500) rotate(8)" opacity={Math.min(1, (lf - 80) / 30)}>
        <rect x={-110} y={-30} width={220} height={60} rx={10} fill={GOLD} stroke={INK} strokeWidth={5} />
        <text x={0} y={14} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>0 ĐỒNG · OPEN SOURCE</text>
      </g>
    </g>
  );
};

// =================================================================
// SCENE 8 — CTA: Big VIBE EDITING text + arrow → bio + sign-off
// =================================================================
const SceneCTA: React.FC<{ lf: number }> = ({ lf }) => {
  const phase = lf / 4;
  const sp1 = spring({ frame: lf - 0,  fps: FPS, config: { damping: 11, stiffness: 130 } });
  const sp2 = spring({ frame: lf - 18, fps: FPS, config: { damping: 11, stiffness: 130 } });
  const arrowBob = Math.sin(phase * 4) * 18;
  const headBob = Math.sin(phase * 1.4) * 4;
  const blink = Math.max(0, Math.sin(lf / 14) - 0.95) * 25;
  return (
    <g>
      {/* Big stacked logo */}
      <g transform={`translate(${W/2}, 540) scale(${sp1})`}>
        <rect x={-440} y={-150} width={880} height={300} rx={22} fill="#FFF8EC" stroke={INK} strokeWidth={8} />
        <text x={0} y={-30} fontSize={120} fill={INK} textAnchor="middle"
              fontFamily="'EB Garamond', serif" fontWeight={700}>
          VIBE EDITING
        </text>
        <text x={0} y={50} fontSize={42} fill={ACCENT} textAnchor="middle"
              fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic">
          repo miễn phí · open source
        </text>
        <text x={0} y={110} fontSize={36} fill={INK} textAnchor="middle"
              fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
          → link mô tả ↓
        </text>
      </g>

      {/* Bouncing arrow down to bio */}
      <g transform={`translate(${W/2}, ${800 + arrowBob}) scale(${sp2})`}>
        <path d="M -40 0 L 0 80 L 40 0" stroke={ACCENT2} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <line x1={0} y1={-50} x2={0} y2={80} stroke={ACCENT2} strokeWidth={14} strokeLinecap="round" />
      </g>

      {/* Sigma chồng wink at bottom */}
      <g transform={`translate(0, ${headBob})`}>
        <SigmaBody x={540} y={1480} scale={1.0} phase={phase} skinColor={SIGMA_SKIN} shadowColor={SIGMA_SHADOW} />
        <SigmaHead x={540} y={1480 - 72} scale={1.0} skinColor={SIGMA_SKIN} hairColor={SIGMA_HAIR} shadowColor={SIGMA_SHADOW} blink={Math.max(blink, lf > 90 ? 0.6 : 0)} />
      </g>

      {/* Heart + sign-off */}
      <text x={760} y={1380} fontSize={50} opacity={Math.min(1, lf / 30)}>❤️</text>
      <Bubble x={780} y={1280} text="CHỒNG YÊU CÁC VỢ ❤️" from={T.cta[0] + 3.5} to={T.cta[1]} w={500} fs={32} tail="left" />
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
              fontSize: 40,
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
export const ReupNoFear01: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const globalOp = interpolate(frame, [0, 8, durationInFrames - 12, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const scenes: [readonly [number, number], (lf: number) => React.ReactNode][] = [
    [T.hook,   (lf) => <SceneHook   lf={lf} />],
    [T.pain1,  (lf) => <ScenePain1  lf={lf} />],
    [T.pain2,  (lf) => <ScenePain2  lf={lf} />],
    [T.pain3,  (lf) => <ScenePain3  lf={lf} />],
    [T.pain4,  (lf) => <ScenePain4  lf={lf} />],
    [T.pivot,  (lf) => <ScenePivot  lf={lf} />],
    [T.flip,   (lf) => <SceneFlip   lf={lf} />],
    [T.cta,    (lf) => <SceneCTA    lf={lf} />],
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, opacity: globalOp }}>
      <Bg />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {scenes.map(([range, renderFn], i) => {
          if (!inRange(t, range)) return null;
          const localFrame = frame - range[0] * FPS;
          const fadeIn  = interpolate(t, [range[0], range[0] + 0.22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const fadeOut = interpolate(t, [range[1] - 0.22, range[1]], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const op = Math.min(fadeIn, fadeOut);
          return <g key={i} opacity={op}>{renderFn(localFrame)}</g>;
        })}

        {/* Corner editorial marks */}
        <g stroke={INK} strokeWidth={5} fill="none">
          <path d="M 40 40 L 40 100 M 40 40 L 100 40" />
          <path d="M 1040 40 L 1040 100 M 1040 40 L 980 40" />
          <path d="M 40 1880 L 40 1820 M 40 1880 L 100 1880" />
          <path d="M 1040 1880 L 1040 1820 M 1040 1880 L 980 1880" />
        </g>
      </svg>
      <Caption />
      <Audio src={staticFile("reup-tt-nofear-01/voice.mp3")} volume={0.95} />
      <Audio src={staticFile("reup-tt-nofear-01/music.mp3")} volume={0.06} />
    </AbsoluteFill>
  );
};
