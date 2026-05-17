import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import wordsData from "./combostack_words.json";
import beatsData from "./combostack_beats.json";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadEBGaramond("italic", { weights: ["600", "700"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";
const IVORY = "#F5F5F0";
const RED = "#D03020";
const GREEN = "#3FA85A";
const BLUE = "#4A7AC8";
const PURPLE = "#7A4AC8";
const TEAL = "#3FA8A8";

type Word = { word: string; start: number; end: number; beat: number };
const words = wordsData as Word[];
type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const B = (i: number) => {
  const b = beats[i - 1];
  return [b.start, b.start + b.duration] as const;
};

const mouthOpenAt = (t: number): number => {
  for (const w of words) {
    if (t >= w.start && t <= w.end) {
      const progress = (t - w.start) / (w.end - w.start);
      return Math.sin(progress * Math.PI);
    }
  }
  return 0;
};

const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="cfsPN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="91" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="cfsVig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#cfsPN)" />
    <rect width={W} height={H} fill="url(#cfsVig)" />
  </svg>
);

const Teacher: React.FC<{ mouthOpen: number; pointing?: boolean; waving?: boolean; thumbs?: boolean }> = ({
  mouthOpen, pointing = false, waving = false, thumbs = false,
}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 8) * 3;
  const blink = Math.sin(frame / 45) > 0.92;
  const waveAngle = waving ? Math.sin(frame / 4) * 15 : 0;
  return (
    <g transform={`translate(0, ${bob})`}>
      <line x1={-12} y1={30} x2={-18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
      <line x1={12} y1={30} x2={18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
      <ellipse cx={-20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
      <ellipse cx={20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
      <rect x={-22} y={-25} width={44} height={58} rx={10} fill={BLUE} stroke={INK} strokeWidth={3.5} />
      <path d="M -8 -25 L 0 -15 L 8 -25" fill="#E8E0D0" stroke={INK} strokeWidth={2} />
      {pointing ? (
        <>
          <line x1={22} y1={-12} x2={55} y2={-40} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={22} y1={-12} x2={55} y2={-40} stroke={INK} strokeWidth={2.5} />
          <circle cx={58} cy={-44} r={6} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke={INK} strokeWidth={2.5} />
        </>
      ) : waving ? (
        <>
          <g transform={`rotate(${waveAngle}, 22, -12)`}>
            <line x1={22} y1={-12} x2={50} y2={-50} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
            <line x1={22} y1={-12} x2={50} y2={-50} stroke={INK} strokeWidth={2.5} />
            <circle cx={54} cy={-55} r={7} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
          </g>
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke={INK} strokeWidth={2.5} />
        </>
      ) : thumbs ? (
        <>
          <line x1={22} y1={-12} x2={40} y2={-38} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={22} y1={-12} x2={40} y2={-38} stroke={INK} strokeWidth={2.5} />
          <circle cx={44} cy={-44} r={8} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
          <line x1={44} y1={-52} x2={44} y2={-60} stroke="#F8E0D0" strokeWidth={5} strokeLinecap="round" />
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke={INK} strokeWidth={2.5} />
        </>
      ) : (
        <>
          <line x1={-22} y1={-8} x2={-38} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={22} y1={-8} x2={38} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={-22} y1={-8} x2={-38} y2={18} stroke={INK} strokeWidth={2.5} />
          <line x1={22} y1={-8} x2={38} y2={18} stroke={INK} strokeWidth={2.5} />
        </>
      )}
      <circle cx={0} cy={-46} r={22} fill="#F8E0D0" stroke={INK} strokeWidth={3.5} />
      <path d="M -22 -52 Q -18 -68 -6 -66 Q 2 -72 14 -68 Q 22 -60 22 -52" fill="#1A1A22" />
      {blink ? (
        <>
          <line x1={-12} y1={-48} x2={-4} y2={-48} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={4} y1={-48} x2={12} y2={-48} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={-8} cy={-48} r={3} fill={INK} />
          <circle cx={8} cy={-48} r={3} fill={INK} />
        </>
      )}
      {mouthOpen > 0.2 ? (
        <ellipse cx={0} cy={-36} rx={5 * mouthOpen} ry={4 * mouthOpen} fill="#C04030" stroke={INK} strokeWidth={2} />
      ) : (
        <path d="M -6 -38 Q 0 -33 6 -38" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      )}
    </g>
  );
};

// Caption — chunk max 6 từ
type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  const flush = () => {
    if (buf.length) {
      out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
      buf = [];
    }
  };
  for (const w of words) {
    buf.push(w);
    if (/[.!?]$/.test(w.word)) {
      flush();
      continue;
    }
    if (/[,—:]$/.test(w.word) && buf.length >= 4) {
      flush();
      continue;
    }
    if (buf.length >= 6) {
      flush();
    }
  }
  flush();
  return out;
})();

const EMPH = new Set<string>([
  "stack", "stack.", "STACK", "FREE", "free", "free.", "free,", "FREE.",
  "ChatGPT", "ChatGPT.",
  "ElevenLabs", "ElevenLabs.",
  "Kling", "AI.", "AI",
  "CapCut", "CapCut.",
  "ViralClone", "ViralClone.",
  "n8n", "n8n.",
  "6", "tool", "tool.",
  "viral,", "viral", "viral.",
  "1", "video.", "video", "kênh", "kênh.", "kênh\".",
  "Save", "Comment", "comment",
  "không", "có", "đâu.",
]);
const isEmph = (w: string): boolean => EMPH.has(w);

const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let active: Sentence | null = null;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i + 1];
    const boundary = next ? next.start : s.end + 0.6;
    if (t >= s.start - 0.15 && t < boundary) {
      active = s;
      break;
    }
  }
  if (!active) return null;
  const LEAD = 0.1;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 160, pointerEvents: "none" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", maxWidth: 940, padding: "0 60px" }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [12, 0]);
          const blur = interpolate(sp, [0, 1], [4, 0]);
          const emph = isEmph(w.word);
          return (
            <span key={`${active.start}-${i}`} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontWeight: emph ? 800 : 600,
              fontSize: emph ? 60 : 50,
              color: emph ? GOLD : IVORY,
              textShadow: emph
                ? "0 0 26px rgba(229,165,59,0.55), 0 4px 14px rgba(0,0,0,0.95)"
                : "0 3px 12px rgba(0,0,0,0.95)",
              opacity: visible ? sp : 0,
              transform: `translateY(${y}px)`,
              filter: `blur(${blur}px)`,
              letterSpacing: emph ? "0.4px" : "0",
              lineHeight: 1.3,
            }}>{w.word}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Reusable tool card
const ToolCard: React.FC<{
  num: number;
  role: string;
  name: string;
  emo: string;
  body: string;
  color: string;
  p: number;
}> = ({ num, role, name, emo, body, color, p }) => {
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const sp = spring({ frame: (p - 0.1) * FPS, fps: FPS, config: { damping: 13, stiffness: 200 } });
  const ix = interpolate(sp, [0, 1], [-100, 0]);
  return (
    <g opacity={op}>
      {/* Role label top */}
      <text x={W / 2} y={290} fontSize={42} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{role}</text>

      {/* Big number background */}
      <text x={W / 2} y={500} fontSize={420} fill={color} textAnchor="middle" dominantBaseline="middle"
        opacity={0.1} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{num}</text>

      {/* Number badge */}
      <g transform={`translate(${W / 2 - 200}, 410)`}>
        <circle cx={0} cy={0} r={56} fill={color} stroke={INK} strokeWidth={4} />
        <text x={0} y={20} fontSize={56} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{num}</text>
      </g>

      {/* FREE badge */}
      <g transform={`translate(${W / 2 + 200}, 410)`}>
        <rect x={-80} y={-32} width={160} height={64} rx={32} fill={GREEN} stroke={INK} strokeWidth={3} />
        <text x={0} y={10} fontSize={24} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FREE</text>
      </g>

      {/* Big emoji */}
      <text x={W / 2} y={650} fontSize={150} textAnchor="middle">{emo}</text>

      {/* Tool name */}
      <g transform={`translate(${W / 2 + ix}, 800)`}>
        <text x={0} y={0} fontSize={88} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{name}</text>
      </g>

      {/* Body card */}
      <g transform={`translate(${W / 2}, 1050)`}>
        <rect x={-440} y={-100} width={880} height={200} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={3.5} />
        <foreignObject x={-410} y={-80} width={820} height={160}>
          <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 36, fontWeight: 700, color: INK, lineHeight: 1.4, textAlign: "center" }}>
            {body}
          </div>
        </foreignObject>
      </g>
    </g>
  );
};

// =============== BEAT 1: HOOK ===============
const Beat1: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(1);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
  const slashOp = interpolate(p, [1.0, 1.4], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>SỰ THẬT TRẦN TRỤI</text>

      {/* Big card claim */}
      <g transform="translate(540, 700)">
        <rect x={-460} y={-200} width={920} height={400} rx={28} fill="#FAFAF5" stroke={INK} strokeWidth={5} />
        <text x={0} y={-110} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đừng đi tìm</text>
        <text x={-440} y={-30} fontSize={140} fill={ACCENT} textAnchor="start" dominantBaseline="middle" fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic">"</text>
        <text x={0} y={-10} fontSize={56} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>1 tool</text>
        <text x={0} y={70} fontSize={56} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>clone cả kênh</text>
        <text x={400} y={120} fontSize={140} fill={ACCENT} textAnchor="end" dominantBaseline="middle" fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic">"</text>
        <text x={0} y={170} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Không có đâu.</text>
        {/* Slash */}
        <line x1={-440} y1={180} x2={440} y2={-180} stroke={RED} strokeWidth={18} strokeLinecap="round" opacity={slashOp} />
      </g>
    </g>
  );
};

// =============== BEAT 2: TRUTH — stack 6 tool ===============
const Beat2: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(2);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const sp = spring({ frame: (p - 0.6) * FPS, fps: FPS, config: { damping: 11, stiffness: 200 } });
  const sixSp = spring({ frame: (p - 1.4) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FARM CONTENT THẬT</text>

      {/* Họ build STACK */}
      <g transform={`translate(${W / 2}, 520) scale(${sp})`}>
        <text x={0} y={0} fontSize={64} fill={INK} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Họ build</text>
      </g>

      <g transform={`translate(${W / 2}, 720) scale(${sixSp})`}>
        <text x={0} y={0} fontSize={220} fill={ACCENT} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          style={{ filter: "drop-shadow(0 14px 30px rgba(232,88,56,0.5))" }}>STACK</text>
      </g>

      {/* 6 TOOL · FREE */}
      <g transform="translate(540, 1000)" opacity={p > 2.0 ? interpolate(p, [2.0, 2.4], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <rect x={-380} y={-60} width={760} height={120} rx={60} fill={GOLD} stroke={INK} strokeWidth={4} />
        <text x={-160} y={14} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>6 TOOL ·</text>
        <text x={140} y={14} fontSize={56} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FREE</text>
      </g>

      {/* Sub */}
      <g transform="translate(540, 1180)" opacity={p > 3.0 ? interpolate(p, [3.0, 3.4], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <text x={0} y={0} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.75}>không phải all-in-one</text>
      </g>
    </g>
  );
};

// =============== BEATS 3-8: Tool cards ===============
const tools = [
  { idx: 3, num: 1, role: "SCRIPT · #1", name: "ChatGPT", emo: "📝", body: "Viết hook · caption · kịch bản trong 30 giây", color: GREEN },
  { idx: 4, num: 2, role: "VOICE · #2", name: "ElevenLabs", emo: "🎙️", body: "Giọng AI tự nhiên — bằng giọng người thật", color: BLUE },
  { idx: 5, num: 3, role: "VIDEO AI · #3", name: "Kling AI", emo: "🎬", body: "Gen clip từ prompt — không cần quay", color: PURPLE },
  { idx: 6, num: 4, role: "EDIT · #4", name: "CapCut", emo: "✂️", body: "Cắt ghép · caption auto · chuyển cảnh", color: ACCENT },
  { idx: 7, num: 5, role: "CLONE · #5", name: "ViralClone", emo: "🔥", body: "Bắt video viral · copy công thức của họ", color: RED },
  { idx: 8, num: 6, role: "AUTO · #6", name: "n8n", emo: "🔗", body: "Nối 6 tool · 1 prompt → 1 video", color: TEAL },
];

const ToolBeat: React.FC<{ t: number; idx: number }> = ({ t, idx }) => {
  const tool = tools.find(x => x.idx === idx)!;
  const [a] = B(idx);
  const p = Math.max(0, t - a);
  return <ToolCard {...tool} p={p} />;
};

// =============== BEAT 9: STACK — pipeline showcase ===============
const Beat9: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(9);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={280} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>STACK THẬT NGOÀI ĐỜI</text>

      {/* Pipeline 6 dots in 3x2 grid */}
      <g transform="translate(540, 600)">
        {tools.map((tool, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const x = (col - 1) * 280;
          const y = row * 220 - 90;
          const tp = Math.max(0, p - 0.3 - i * 0.18);
          const sp = spring({ frame: tp * FPS, fps: FPS, config: { damping: 13, stiffness: 200 } });
          return (
            <g key={i} transform={`translate(${x}, ${y}) scale(${sp})`}>
              <circle cx={0} cy={0} r={90} fill={tool.color} stroke={INK} strokeWidth={4}
                filter="drop-shadow(0 6px 12px rgba(0,0,0,0.18))" />
              <text x={0} y={-10} fontSize={64} textAnchor="middle">{tool.emo}</text>
              <text x={0} y={50} fontSize={20} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{tool.num}</text>
            </g>
          );
        })}
      </g>

      {/* Faceless label */}
      <g transform="translate(540, 1180)" opacity={p > 2.4 ? interpolate(p, [2.4, 2.8], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <rect x={-440} y={-60} width={880} height={120} rx={20} fill={INK} stroke={INK} strokeWidth={3} />
        <text x={0} y={-5} fontSize={36} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>kênh faceless build kiểu này</text>
        <text x={0} y={40} fontSize={26} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>không phải "1 nút clone"</text>
      </g>
    </g>
  );
};

// =============== BEAT 10: CTA ===============
const Beat10: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(10);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={50} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BUILD STACK CHO MÌNH</text>

      {/* Question card */}
      <g transform="translate(540, 600)">
        <rect x={-440} y={-150} width={880} height={300} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={4}
          filter="drop-shadow(0 10px 20px rgba(0,0,0,0.18))" />
        <text x={0} y={-50} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Save lại 🔖</text>
        <text x={0} y={30} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Comment tool nào bạn dùng rồi</text>
        <text x={0} y={100} fontSize={48} textAnchor="middle">📝 🎙️ 🎬 ✂️ 🔥 🔗</text>
      </g>

      {/* Follow CTA */}
      <g transform="translate(540, 1050)" opacity={p > 1.4 ? interpolate(p, [1.4, 1.8], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <rect x={-380} y={-60} width={760} height={120} rx={24} fill={GOLD} stroke={INK} strokeWidth={4} />
        <text x={0} y={-5} fontSize={40} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FOLLOW</text>
        <text x={0} y={40} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>stack mới mỗi tuần · không bullshit</text>
      </g>
    </g>
  );
};

export const ComboFreeStack: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const mo = mouthOpenAt(t);

  let activeBeat = 1;
  for (let i = beats.length - 1; i >= 0; i--) {
    if (t >= beats[i].start) { activeBeat = beats[i].index; break; }
  }
  const teacherProps = (() => {
    if (activeBeat === 1) return { pointing: true } as const;
    if (activeBeat === 2) return { thumbs: true } as const;
    if (activeBeat === 9) return { thumbs: true } as const;
    if (activeBeat === 10) return { waving: true } as const;
    return { pointing: true } as const;
  })();

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Bg />
      <Audio src={staticFile("combostack_voice.mp3")} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {activeBeat === 1 && <Beat1 t={t} />}
        {activeBeat === 2 && <Beat2 t={t} />}
        {activeBeat >= 3 && activeBeat <= 8 && <ToolBeat t={t} idx={activeBeat} />}
        {activeBeat === 9 && <Beat9 t={t} />}
        {activeBeat === 10 && <Beat10 t={t} />}
        <g transform={`translate(890, 1620) scale(1.6)`}>
          <Teacher mouthOpen={mo} {...teacherProps} />
        </g>
      </svg>
      <Caption />
    </AbsoluteFill>
  );
};
