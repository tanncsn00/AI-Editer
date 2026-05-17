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
import wordsData from "./claudex2_words.json";
import beatsData from "./claudex2_beats.json";

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

type Word = { word: string; start: number; end: number; beat: number };
const words = wordsData as Word[];
type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const totalDuration = (beatsData as { total_duration: number }).total_duration;
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
      <filter id="cx2PN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="73" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="cx2Vig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#cx2PN)" />
    <rect width={W} height={H} fill="url(#cx2Vig)" />
  </svg>
);

const NewsBadge: React.FC = () => (
  <g transform="translate(880, 90)">
    <rect x={-160} y={-30} width={320} height={60} rx={30} fill="#FAFAF5" stroke={ACCENT} strokeWidth={3.5} />
    <circle cx={-130} cy={0} r={9} fill={RED} />
    <text x={-110} y={9} fontSize={22} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NEWS · 06/05/2026</text>
  </g>
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
  "Claude", "Code", "Code.", "Code,",
  "buff", "Pro", "Max", "Max.", "Pro.", "cũ", "cũ.",
  "Anthropic", "Anthropic,", "Anthropic.",
  "x2", "x2,",
  "limit", "limit,", "limit.", "limit?",
  "peak", "throttle.", "throttle,",
  "Opus", "API", "API.",
  "đần", "đần.",
  "điên", "điên!", "điên?",
  "220", "nghìn", "nghìn.",
  "GPU", "GPU.", "NVIDIA", "NVIDIA.",
  "SpaceX", "SpaceX.", "Colossus.", "Colossus",
  "steroid.", "steroid",
  "đáng", "sợ", "sợ?",
  "AI", "war", "war,",
  "model", "thông", "minh",
  "thằng", "nhiều",
  "2026", "vô", "lý", "lý.", "thật",
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

// =============== BEAT 1: HOOK — Pro ≈ Max cũ ===============
const Beat1: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(1);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const buffSp = spring({ frame: (p - 0.3) * FPS, fps: FPS, config: { damping: 11, stiffness: 200 } });
  const eqSp = spring({ frame: (p - 1.6) * FPS, fps: FPS, config: { damping: 11, stiffness: 200 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CLAUDE CODE · TIN MỚI</text>

      {/* Big "BUFF MẠNH" 💪 */}
      <g transform={`translate(${W / 2}, 530) scale(${buffSp})`}>
        <text x={0} y={0} fontSize={140} fill={ACCENT} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          style={{ filter: "drop-shadow(0 10px 24px rgba(232,88,56,0.5))" }}>BUFF MẠNH 💪</text>
      </g>

      {/* Pro ≈ Max comparison */}
      <g transform="translate(540, 880)" opacity={eqSp}>
        <g transform="translate(-260, 0)">
          <rect x={-150} y={-90} width={300} height={180} rx={24} fill={BLUE} stroke={INK} strokeWidth={4}
            filter="drop-shadow(0 8px 16px rgba(0,0,0,0.18))" />
          <text x={0} y={-25} fontSize={68} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Pro</text>
          <text x={0} y={30} fontSize={26} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.85}>(mới)</text>
          <text x={0} y={70} fontSize={18} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>x2 limit · bỏ peak</text>
        </g>
        <text x={0} y={20} fontSize={120} fill={GOLD} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>≈</text>
        <g transform="translate(260, 0)">
          <rect x={-150} y={-90} width={300} height={180} rx={24} fill={ACCENT} stroke={INK} strokeWidth={4}
            filter="drop-shadow(0 8px 16px rgba(0,0,0,0.18))" />
          <text x={0} y={-25} fontSize={68} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Max</text>
          <text x={0} y={30} fontSize={26} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.85}>(cũ)</text>
          <text x={0} y={70} fontSize={18} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>baseline</text>
        </g>
      </g>

      {/* Caption hint */}
      <g transform="translate(540, 1170)" opacity={p > 2.6 ? interpolate(p, [2.6, 3.0], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <text x={0} y={0} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>tới mức gần ngang luôn 🤯</text>
      </g>
    </g>
  );
};

// =============== BEAT 2: ANNOUNCE — 3 bullets ===============
const Beat2: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(2);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const items = [
    { txt: "x2 limit", color: ACCENT, emo: "⚡" },
    { txt: "Gỡ peak throttle", color: GREEN, emo: "✓" },
    { txt: "Opus API tăng mạnh", color: GOLD, emo: "↑" },
  ];
  return (
    <g opacity={op}>
      <text x={W / 2} y={280} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ANTHROPIC VỪA</text>

      {items.map((it, i) => {
        const ip = Math.max(0, p - 0.3 - i * 0.6);
        const sp = spring({ frame: ip * FPS, fps: FPS, config: { damping: 13, stiffness: 200 } });
        const ix = interpolate(sp, [0, 1], [-150, 0]);
        return (
          <g key={i} transform={`translate(${W / 2 + ix}, ${480 + i * 220})`} opacity={sp}>
            <rect x={-440} y={-80} width={880} height={160} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={4}
              filter="drop-shadow(0 6px 14px rgba(0,0,0,0.18))" />
            <rect x={-440} y={-80} width={20} height={160} rx={6} fill={it.color} />
            <text x={-340} y={20} fontSize={70} fill={it.color} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{it.emo}</text>
            <text x={-220} y={18} fontSize={44} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{it.txt}</text>
          </g>
        );
      })}
    </g>
  );
};

// =============== BEAT 3: MEAN — không còn 9h sáng đần ===============
const Beat3: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(3);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const stampSp = spring({ frame: (p - 1.6) * FPS, fps: FPS, config: { damping: 9, stiffness: 200 } });
  const stampOp = interpolate(p, [1.5, 1.9], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={280} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TỪ GIỜ</text>

      {/* Scenario block: clock + claude with sad face — no card, just centered icons */}
      <g transform="translate(540, 540)">
        <text x={-130} y={0} fontSize={140} textAnchor="middle" dominantBaseline="middle">⏰</text>
        <text x={0} y={0} fontSize={64} fill={INK} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>+</text>
        <text x={130} y={0} fontSize={140} textAnchor="middle" dominantBaseline="middle">🤖</text>
        <text x={0} y={140} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>9h sáng mở Claude</text>
        <text x={0} y={210} fontSize={56} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>= thấy nó đần đi 🤡</text>
      </g>

      {/* "KHÔNG CÒN" stamp */}
      <g transform={`translate(540, 1050) rotate(-6) scale(${stampSp})`} opacity={stampOp}>
        <rect x={-380} y={-90} width={760} height={180} rx={20} fill="none" stroke={GREEN} strokeWidth={10} />
        <text x={0} y={-10} fontSize={64} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>KHÔNG CÒN NỮA</text>
        <text x={0} y={50} fontSize={36} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✓ AI giờ luôn khoẻ</text>
      </g>
    </g>
  );
};

// =============== BEAT 4: SETUP_TWIST — "ĐIÊN NHẤT" ===============
const Beat4: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(4);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.15], [0, 1], { extrapolateRight: "clamp" });
  const sp = spring({ frame: (p - 0.05) * FPS, fps: FPS, config: { damping: 9, stiffness: 240 } });
  return (
    <g opacity={op}>
      <g transform={`translate(${W / 2}, 800) scale(${sp})`}>
        <text x={0} y={-100} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.75}>Đây mới là phần</text>
        <text x={0} y={50} fontSize={180} fill={ACCENT} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          style={{ filter: "drop-shadow(0 14px 30px rgba(232,88,56,0.55))" }}>ĐIÊN NHẤT</text>
        <text x={0} y={210} fontSize={84} textAnchor="middle">🤯</text>
      </g>
    </g>
  );
};

// =============== BEAT 5: TWIST — Anthropic kéo SpaceX 220k GPU ===============
const Beat5: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(5);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      {/* CÙNG NGÀY banner */}
      <g transform="translate(540, 280)">
        <rect x={-280} y={-44} width={560} height={88} rx={44} fill={GOLD} stroke={INK} strokeWidth={3.5} />
        <text x={0} y={14} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>⚡ CÙNG NGÀY ⚡</text>
      </g>

      {/* Anthropic × SpaceX */}
      <g transform="translate(540, 530)">
        <rect x={-460} y={-90} width={920} height={180} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
        <text x={-300} y={20} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Anthropic</text>
        <text x={0} y={20} fontSize={56} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>kéo</text>
        <text x={280} y={20} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>SpaceX 🚀</text>
      </g>

      {/* Big number 220.000 */}
      <g transform={`translate(${W / 2}, 880)`} opacity={p > 1.4 ? interpolate(p, [1.4, 1.8], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <text x={0} y={0} fontSize={170} fill={ACCENT} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          style={{ filter: "drop-shadow(0 12px 24px rgba(232,88,56,0.45))" }}>220.000</text>
        <text x={0} y={110} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>GPU NVIDIA</text>
      </g>

      {/* Footer */}
      <g transform="translate(540, 1230)" opacity={p > 2.8 ? interpolate(p, [2.8, 3.2], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <rect x={-380} y={-50} width={760} height={100} rx={20} fill={INK} />
        <text x={0} y={14} fontSize={36} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>từ datacenter Colossus</text>
      </g>
    </g>
  );
};

// =============== BEAT 6: BIG_220K — số to chiếm màn ===============
const Beat6: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(6);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.15], [0, 1], { extrapolateRight: "clamp" });
  const sp = spring({ frame: p * FPS, fps: FPS, config: { damping: 8, stiffness: 240 } });
  return (
    <g opacity={op}>
      <g transform={`translate(${W / 2}, 900) scale(${sp})`}>
        <text x={0} y={-110} fontSize={50} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>Hai trăm hai mươi nghìn</text>
        <text x={0} y={90} fontSize={300} fill={ACCENT} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          style={{ filter: "drop-shadow(0 16px 32px rgba(232,88,56,0.55))" }}>220k</text>
        <text x={0} y={260} fontSize={64} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>GPU 💀</text>
      </g>
    </g>
  );
};

// =============== BEAT 7: STEROID — Claude buff ===============
const Beat7: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(7);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
  const sp = spring({ frame: (p - 0.2) * FPS, fps: FPS, config: { damping: 10, stiffness: 200 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BẢO SAO</text>

      {/* Claude muscle visual */}
      <g transform={`translate(${W / 2}, 750) scale(${sp})`}>
        <text x={0} y={-50} fontSize={200} textAnchor="middle">💪</text>
        <text x={0} y={140} fontSize={64} fill={ACCENT} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          style={{ filter: "drop-shadow(0 6px 16px rgba(232,88,56,0.4))" }}>Claude khoẻ ngang</text>
        <text x={0} y={230} fontSize={84} fill={INK} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          fontStyle="italic">uống STEROID 💊</text>
      </g>
    </g>
  );
};

// =============== BEAT 8: SCARY_Q — đáng sợ nhất ===============
const Beat8: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(8);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
  const sp = spring({ frame: (p - 0.1) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  return (
    <g opacity={op}>
      <g transform={`translate(${W / 2}, 800) scale(${sp})`}>
        <text x={0} y={-130} fontSize={50} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>Và điều</text>
        <text x={0} y={50} fontSize={180} fill={RED} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          style={{ filter: "drop-shadow(0 12px 28px rgba(208,48,32,0.55))" }}>ĐÁNG SỢ</text>
        <text x={0} y={180} fontSize={84} fill={INK} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nhất là gì?</text>
      </g>
    </g>
  );
};

// =============== BEAT 9: AI_WAR — model vs GPU compare ===============
const Beat9: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(9);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const xOp = interpolate(p, [1.6, 2.2], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={280} fontSize={50} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AI WAR · 2026</text>

      {/* OLD: model thông minh */}
      <g transform="translate(540, 580)">
        <rect x={-440} y={-110} width={880} height={220} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
        <text x={-380} y={-50} fontSize={36} fill="#888" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>KHÔNG CÒN LÀ</text>
        <text x={0} y={50} fontSize={54} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"model nào thông minh hơn"</text>
        {/* Slash */}
        <line x1={-440} y1={110} x2={440} y2={-110} stroke={RED} strokeWidth={14} strokeLinecap="round" opacity={xOp} />
      </g>

      {/* Arrow */}
      <g transform="translate(540, 760)" opacity={p > 2.0 ? 1 : 0}>
        <text x={0} y={0} fontSize={70} fill={GOLD} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>↓</text>
      </g>

      {/* NEW: GPU nhiều */}
      <g transform="translate(540, 920)" opacity={p > 2.4 ? interpolate(p, [2.4, 2.8], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <rect x={-440} y={-110} width={880} height={220} rx={24} fill={ACCENT} stroke={INK} strokeWidth={4}
          filter="drop-shadow(0 10px 20px rgba(232,88,56,0.4))" />
        <text x={-380} y={-50} fontSize={36} fill="#FFF" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>MÀ LÀ</text>
        <text x={0} y={50} fontSize={54} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"thằng nào nhiều GPU hơn"</text>
      </g>
    </g>
  );
};

// =============== BEAT 10: CLOSING — 2026 vô lý ===============
const Beat10: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(10);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const sp = spring({ frame: (p - 0.2) * FPS, fps: FPS, config: { damping: 10, stiffness: 200 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CHỐT</text>

      {/* Big 2026 */}
      <g transform={`translate(${W / 2}, 600) scale(${sp})`}>
        <text x={0} y={0} fontSize={220} fill={INK} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>2026</text>
      </g>

      {/* Statement */}
      <g transform="translate(540, 880)" opacity={p > 1.0 ? interpolate(p, [1.0, 1.4], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <text x={0} y={0} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>là năm AI bắt đầu</text>
        <text x={0} y={130} fontSize={140} fill={ACCENT} textAnchor="middle"
          fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic"
          style={{ filter: "drop-shadow(0 8px 22px rgba(232,88,56,0.45))" }}>vô lý</text>
        <text x={0} y={220} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>thật rồi 🫠</text>
      </g>

      {/* Follow CTA */}
      <g transform="translate(540, 1300)" opacity={p > 2.5 ? interpolate(p, [2.5, 2.9], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <rect x={-380} y={-60} width={760} height={120} rx={24} fill={GOLD} stroke={INK} strokeWidth={4} />
        <text x={0} y={-5} fontSize={40} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FOLLOW</text>
        <text x={0} y={40} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tin AI mỗi ngày · không bullshit</text>
      </g>
    </g>
  );
};

export const ClaudeX2Limit: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const mo = mouthOpenAt(t);

  let activeBeat = 1;
  for (let i = beats.length - 1; i >= 0; i--) {
    if (t >= beats[i].start) { activeBeat = beats[i].index; break; }
  }
  const teacherProps = (() => {
    if (activeBeat === 1) return { waving: true } as const;
    if (activeBeat === 4) return { pointing: true } as const;
    if (activeBeat === 6) return { thumbs: true } as const;
    if (activeBeat === 7) return { thumbs: true } as const;
    if (activeBeat === 10) return { waving: true } as const;
    return { pointing: true } as const;
  })();

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Bg />
      <Audio src={staticFile("claudex2_voice.mp3")} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <NewsBadge />
        {activeBeat === 1 && <Beat1 t={t} />}
        {activeBeat === 2 && <Beat2 t={t} />}
        {activeBeat === 3 && <Beat3 t={t} />}
        {activeBeat === 4 && <Beat4 t={t} />}
        {activeBeat === 5 && <Beat5 t={t} />}
        {activeBeat === 6 && <Beat6 t={t} />}
        {activeBeat === 7 && <Beat7 t={t} />}
        {activeBeat === 8 && <Beat8 t={t} />}
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
