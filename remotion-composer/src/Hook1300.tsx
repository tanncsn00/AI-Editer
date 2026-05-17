import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import wordsData from "./hook1300_words.json";
import beatsData from "./hook1300_beats.json";

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

// =============== Bg ===============
const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="hk1300PN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="29" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="hk1300Vig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#hk1300PN)" />
    <rect width={W} height={H} fill="url(#hk1300Vig)" />
  </svg>
);

// =============== Teacher ===============
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
      <rect x={-22} y={-25} width={44} height={58} rx={10} fill="#4A7AC8" stroke={INK} strokeWidth={3.5} />
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

// =============== Caption ===============
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
    if (/,$/.test(w.word) && buf.length >= 8) {
      flush();
    }
  }
  flush();
  return out;
})();

const EMPH = new Set<string>([
  "99%", "1300", "1.5", "5-8", "22", "5", "5.",
  "Pattern", "Interrupt.", "Interrupt,",
  "Curiosity", "Gap.", "Gap,",
  "Outcome.", "Outcome,",
  "Storytelling.", "Storytelling,",
  "Negative", "Words.", "Words,",
  "ĐỪNG,", "STOP,", "KHÔNG,", "TRÁNH",
  "ĐỪNG.", "STOP.", "KHÔNG.",
  "sai.", "sai,",
  "đúng.", "đúng,", "viral", "viral.",
  "Brock", "Johnson", "Goldilocks",
  "save", "Save",
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
              fontSize: emph ? 62 : 52,
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

// =============== BigWord ===============
const BigWord: React.FC<{ text: string; sub?: string; from: number; until: number; color?: string }> = ({ text, sub, from, until, color = ACCENT }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < from || t > until) return null;
  const sp = spring({ frame: frame - from * FPS, fps: FPS, config: { damping: 12, stiffness: 180, mass: 0.5 } });
  const fadeOut = interpolate(t, [until - 0.5, until], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(sp, fadeOut);
  const scale = 0.8 + sp * 0.2;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
      <div style={{ textAlign: "center", opacity: op, transform: `scale(${scale})` }}>
        <div style={{
          fontFamily: "'EB Garamond', serif",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: 144,
          color: color,
          textShadow: `0 0 36px ${color}55, 0 8px 28px rgba(0,0,0,0.4)`,
          letterSpacing: "1px",
          lineHeight: 1.0,
        }}>{text}</div>
        {sub && (
          <div style={{ marginTop: 16, fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, fontSize: 38, color: INK, opacity: 0.75 }}>{sub}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// =============== Pattern Card (reusable for Beat 3-7) ===============
const PatternCard: React.FC<{
  num: string;
  title: string;
  body: string;
  example: string;
  p: number;
  accent?: string;
  children?: React.ReactNode;
}> = ({ num, title, body, example, p, accent = ACCENT, children }) => {
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const tx = interpolate(p, [0, 0.5], [-60, 0], { extrapolateRight: "clamp" });
  return (
    <g transform={`translate(${tx}, 0)`} opacity={op}>
      <rect x={60} y={350} width={960} height={760} rx={28} fill="#FAFAF5" stroke={INK} strokeWidth={4.5} filter="drop-shadow(0 12px 24px rgba(0,0,0,0.18))" />

      {/* Number badge */}
      <circle cx={170} cy={460} r={70} fill={accent} stroke={INK} strokeWidth={4} />
      <text x={170} y={485} fontSize={84} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{num}</text>

      {/* Title */}
      <text x={290} y={440} fontSize={48} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{title}</text>
      <text x={290} y={500} fontSize={26} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.55}>PATTERN VIRAL</text>

      {/* Body */}
      <foreignObject x={100} y={560} width={880} height={200}>
        <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 32, fontWeight: 600, color: INK, lineHeight: 1.4, opacity: 0.85 }}>
          {body}
        </div>
      </foreignObject>

      {/* Example label */}
      <rect x={100} y={830} width={880} height={210} rx={16} fill={accent} stroke={INK} strokeWidth={3} opacity={0.92} />
      <text x={130} y={875} fontSize={24} fill="#FFF" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.8}>VÍ DỤ:</text>
      <foreignObject x={130} y={890} width={820} height={140}>
        <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 30, fontWeight: 700, color: "#FFF", lineHeight: 1.35 }}>
          {example}
        </div>
      </foreignObject>

      {/* Custom child (chart, slider, etc) */}
      {children}
    </g>
  );
};

// =============== BEAT 1: HOOK ===============
const Beat1: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(1);
  const p = Math.max(0, t - a);
  const cardOp = interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(p * 5) * 0.04;

  return (
    <g>
      {/* Big 99% */}
      <g transform={`translate(${W / 2}, 600) scale(${pulse})`} opacity={cardOp}>
        <text x={0} y={0} fontSize={420} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} dominantBaseline="middle"
          style={{ filter: "drop-shadow(0 12px 28px rgba(232,88,56,0.45))" }}>99%</text>
      </g>
      {/* Subtitle */}
      <text x={W / 2} y={830} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={cardOp}>
        creator viết hook SAI
      </text>
      {/* Red strikethrough text */}
      <g opacity={cardOp}>
        <line x1={290} y1={830} x2={790} y2={810} stroke={RED} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
      </g>

      {/* Reveal "5 cách đúng" */}
      {p > 2.5 && (
        <g opacity={interpolate(p, [2.5, 3.0], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={120} y={1000} width={840} height={170} rx={20} fill={GOLD} stroke={INK} strokeWidth={4} />
          <text x={W / 2} y={1075} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>5 CÁCH ĐÚNG</text>
          <text x={W / 2} y={1130} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.85}>(có data thật)</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 280}, 1500) scale(1.7)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 2: CONTEXT ===============
const Beat2: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(2);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NGUỒN DATA</text>

      {/* Big number rolling */}
      <g transform={`translate(${W / 2}, 700)`}>
        <text x={0} y={0} fontSize={300} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} dominantBaseline="middle">
          {Math.min(1300, Math.floor(p * 600))}
        </text>
      </g>
      <text x={W / 2} y={870} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>REEL VIRAL</text>
      <text x={W / 2} y={925} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.7}>được phân tích từng từ, từng frame</text>

      {/* Source badge */}
      {p > 4 && (
        <g transform="translate(540, 1100)" opacity={interpolate(p, [4, 4.5], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={-300} y={-50} width={600} height={100} rx={50} fill={INK} />
          <text x={0} y={10} fontSize={28} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>📊 Brock Johnson Study</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 280}, 1480) scale(1.6)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};

// =============== BEAT 3: PATTERN INTERRUPT ===============
const Beat3: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(3);
  const p = Math.max(0, t - a);
  return (
    <g>
      <text x={W / 2} y={280} fontSize={38} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PATTERN 1 / 5</text>
      <PatternCard
        num="1"
        title="Pattern Interrupt"
        body="Phá nhịp scroll. Visual shock, audio bất ngờ, hoặc câu STOP SCROLLING. Não viewer ngẩng lên."
        example="📷 Camera zoom đột ngột · 🔊 Sound effect lạ · ✋ STOP SCROLLING"
        p={p}
      />
    </g>
  );
};

// =============== BEAT 4: CURIOSITY GAP — Goldilocks slider ===============
const Beat4: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(4);
  const p = Math.max(0, t - a);

  // Slider position cycles through too-narrow → just-right → too-wide
  const sliderX = p < 5 ? interpolate(p, [0, 5], [200, 880], { extrapolateRight: "clamp" }) : interpolate(p, [5, 7], [880, 540], { extrapolateRight: "clamp" });

  return (
    <g>
      <text x={W / 2} y={280} fontSize={38} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PATTERN 2 / 5</text>
      <PatternCard
        num="2"
        title="Curiosity Gap"
        body="Tò mò vừa đủ. Đừng vague quá. Đừng spoil hết. Goldilocks zone."
        example="✅ 'Tôi mất 6 tháng coi 1300 hook' · ❌ 'Cái này thay đổi mọi thứ'"
        p={p}
      >
        {/* Goldilocks slider */}
        {p > 2 && (
          <g opacity={interpolate(p, [2, 2.5], [0, 1], { extrapolateRight: "clamp" })}>
            <rect x={150} y={1180} width={780} height={12} rx={6} fill={INK} opacity={0.15} />
            {/* Goldilocks zone */}
            <rect x={460} y={1175} width={160} height={22} rx={11} fill={GOLD} opacity={0.85} />
            <text x={540} y={1230} fontSize={20} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ĐÚNG</text>
            <text x={200} y={1230} fontSize={18} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>SPOIL</text>
            <text x={880} y={1230} fontSize={18} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>VAGUE</text>
            {/* Slider knob */}
            <circle cx={sliderX} cy={1186} r={20} fill={ACCENT} stroke={INK} strokeWidth={3} />
          </g>
        )}
      </PatternCard>
    </g>
  );
};

// =============== BEAT 5: OUTCOME ===============
const Beat5: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(5);
  const p = Math.max(0, t - a);
  return (
    <g>
      <text x={W / 2} y={280} fontSize={38} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PATTERN 3 / 5</text>
      <PatternCard
        num="3"
        title="Outcome / Data"
        body="Dẫn bằng kết quả cụ thể, có số. Càng specific càng tin."
        example='✅ "Reel 2.1 triệu view — đây là lý do" · ❌ "Tôi học được nhiều thứ"'
        p={p}
      />
    </g>
  );
};

// =============== BEAT 6: STORYTELLING ===============
const Beat6: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(6);
  const p = Math.max(0, t - a);
  return (
    <g>
      <text x={W / 2} y={280} fontSize={38} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PATTERN 4 / 5</text>
      <PatternCard
        num="4"
        title="Storytelling"
        body='Bắt đầu bằng "Tôi từng...". Story dễ nhớ gấp 22 lần data khô.'
        example='✅ "Tôi từng đốt 8 triệu cho khoá MMO" · ❌ "Có 5 lý do bạn nên..."'
        p={p}
        accent={GREEN}
      >
        {/* Big "22×" badge */}
        {p > 3 && (
          <g transform="translate(890, 720)" opacity={interpolate(p, [3, 3.5], [0, 1], { extrapolateRight: "clamp" })}>
            <circle cx={0} cy={0} r={70} fill={GREEN} stroke={INK} strokeWidth={4} />
            <text x={0} y={20} fontSize={50} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>22×</text>
            <text x={0} y={100} fontSize={20} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>dễ nhớ hơn</text>
          </g>
        )}
      </PatternCard>
    </g>
  );
};

// =============== BEAT 7: NEGATIVE WORDS ===============
const Beat7: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(7);
  const p = Math.max(0, t - a);

  const negativeBarH = interpolate(p, [2, 4], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const positiveBarH = interpolate(p, [2, 4], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g>
      <text x={W / 2} y={280} fontSize={38} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PATTERN 5 / 5</text>
      <PatternCard
        num="5"
        title="Negative Words"
        body='ĐỪNG / STOP / KHÔNG / TRÁNH hút view gấp đôi từ tích cực. Não con người sợ mất hơn thèm được.'
        example='✅ "ĐỪNG đăng reel nữa" · ❌ "Hãy thử cách này"'
        p={p}
        accent={RED}
      >
        {/* Bar chart */}
        {p > 2 && (
          <g transform="translate(0, 0)" opacity={interpolate(p, [2, 2.5], [0, 1], { extrapolateRight: "clamp" })}>
            {/* Negative bar */}
            <rect x={730} y={1230 - negativeBarH} width={70} height={negativeBarH} fill={RED} stroke={INK} strokeWidth={3} />
            <text x={765} y={1260} fontSize={18} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ĐỪNG</text>
            {/* Positive bar */}
            <rect x={840} y={1230 - positiveBarH} width={70} height={positiveBarH} fill={INK} opacity={0.4} stroke={INK} strokeWidth={3} />
            <text x={875} y={1260} fontSize={18} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>BUY</text>
            {/* 2x label */}
            {p > 3.5 && (
              <text x={780} y={1010} fontSize={42} fill={RED} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
                opacity={interpolate(p, [3.5, 4], [0, 1], { extrapolateRight: "clamp" })}>2×</text>
            )}
          </g>
        )}
      </PatternCard>
    </g>
  );
};

// =============== BEAT 8: TAKEAWAY + CTA ===============
const Beat8: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(8);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  const rules = [
    { num: "5-8", label: "TỪ", at: 0.5 },
    { num: "L5", label: "LỚP 5 ĐỌC", at: 1.5 },
    { num: "ĐỪNG", label: "NEGATIVE", at: 2.5 },
  ];

  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={44} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>3 QUY TẮC VÀNG</text>

      {rules.map((r, i) => {
        const visible = p >= r.at;
        const opi = visible ? interpolate(p, [r.at, r.at + 0.4], [0, 1], { extrapolateRight: "clamp" }) : 0;
        const sc = visible ? interpolate(p, [r.at, r.at + 0.4], [0.7, 1], { extrapolateRight: "clamp" }) : 0.7;
        return (
          <g key={i} transform={`translate(${W / 2}, ${500 + i * 220}) scale(${sc})`} opacity={opi}>
            <rect x={-440} y={-90} width={880} height={180} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
            <circle cx={-340} cy={0} r={60} fill={GOLD} stroke={INK} strokeWidth={3.5} />
            <text x={-340} y={20} fontSize={r.num.length > 2 ? 32 : 48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.num}</text>
            <text x={-220} y={15} fontSize={36} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.label}</text>
          </g>
        );
      })}

      {/* CTA */}
      {p > 4 && (
        <g opacity={interpolate(p, [4, 4.5], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={140} y={1340} width={800} height={140} rx={20} fill={ACCENT} stroke={INK} strokeWidth={4} />
          <text x={W / 2} y={1390} fontSize={34} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>SAVE + COMMENT</text>
          <text x={W / 2} y={1440} fontSize={24} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>hook viral nhất bạn từng làm 👇</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 280}, 1620) scale(1.4)`}>
        <Teacher mouthOpen={mo} thumbs />
      </g>
    </g>
  );
};

// =============== Main ===============
export const Hook1300: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const mo = mouthOpenAt(t);

  const [, e1] = B(1);
  const [, e2] = B(2);
  const [, e3] = B(3);
  const [, e4] = B(4);
  const [, e5] = B(5);
  const [, e6] = B(6);
  const [, e7] = B(7);
  const b8 = B(8);

  return (
    <AbsoluteFill>
      <Audio src={staticFile("hook1300_voice.mp3")} />
      <Bg />

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {t < e1 && <Beat1 t={t} mo={mo} />}
        {t >= B(2)[0] && t < e2 && <Beat2 t={t} mo={mo} />}
        {t >= B(3)[0] && t < e3 && <Beat3 t={t} mo={mo} />}
        {t >= B(4)[0] && t < e4 && <Beat4 t={t} mo={mo} />}
        {t >= B(5)[0] && t < e5 && <Beat5 t={t} mo={mo} />}
        {t >= B(6)[0] && t < e6 && <Beat6 t={t} mo={mo} />}
        {t >= B(7)[0] && t < e7 && <Beat7 t={t} mo={mo} />}
        {t >= B(8)[0] && t < b8[1] && <Beat8 t={t} mo={mo} />}
      </svg>

      <Caption />
    </AbsoluteFill>
  );
};

export const hook1300Duration = totalDuration;
