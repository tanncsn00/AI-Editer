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
import wordsData from "./nghe_ai_words.json";
import beatsData from "./nghe_ai_beats.json";

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

// =============== Background ===============
const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="naiPN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="17" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="naiVig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#naiPN)" />
    <rect width={W} height={H} fill="url(#naiVig)" />
  </svg>
);

// =============== Teacher (full) ===============
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

// =============== Mini stick figure (for Beat 6 chart) ===============
const MiniStick: React.FC<{ x: number; y: number; opacity: number; glow?: boolean }> = ({ x, y, opacity, glow = false }) => (
  <g transform={`translate(${x}, ${y})`} opacity={opacity}>
    {glow && (
      <circle cx={0} cy={-10} r={75} fill={GOLD} opacity={0.35} />
    )}
    {/* Legs */}
    <line x1={-8} y1={20} x2={-12} y2={50} stroke="#3A3850" strokeWidth={9} strokeLinecap="round" />
    <line x1={8} y1={20} x2={12} y2={50} stroke="#3A3850" strokeWidth={9} strokeLinecap="round" />
    {/* Body */}
    <rect x={-15} y={-18} width={30} height={40} rx={7} fill={glow ? GOLD : "#4A7AC8"} stroke={INK} strokeWidth={2.5} />
    {/* Arms */}
    <line x1={-15} y1={-5} x2={-26} y2={12} stroke="#F8E0D0" strokeWidth={8} strokeLinecap="round" />
    <line x1={15} y1={-5} x2={26} y2={12} stroke="#F8E0D0" strokeWidth={8} strokeLinecap="round" />
    {/* Head */}
    <circle cx={0} cy={-32} r={15} fill="#F8E0D0" stroke={INK} strokeWidth={2.5} />
    <path d="M -15 -36 Q -12 -47 -4 -46 Q 1 -50 10 -47 Q 15 -42 15 -36" fill="#1A1A22" />
    <circle cx={-5} cy={-33} r={2} fill={INK} />
    <circle cx={5} cy={-33} r={2} fill={INK} />
  </g>
);

// =============== Caption (sentence-based, spring reveal — copy verbatim from ImLangFull/Ep1) ===============
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
  "AI", "AI,", "AI.",
  "Customer", "Support,", "Support",
  "Data", "Entry,", "Entry",
  "Content", "Writer", "Writer.", "Writer,",
  "Designer", "Designer,", "Designer.",
  "Junior", "Dev,", "Dev", "Dev.", "Tester", "Tester.", "Tester,",
  "SEO,", "SEO",
  "5", "5.", "1", "1.", "4",
  "tận", "dụng", "dụng.", "dụng,",
  "thay", "thay.", "thay,",
  "kém.", "kém,", "tốt", "tốt.", "tốt,",
  "boilerplate", "boilerplate.",
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

// =============== BigWord (center pop) ===============
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
      <div style={{
        textAlign: "center",
        opacity: op,
        transform: `scale(${scale})`,
      }}>
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
          <div style={{
            marginTop: 16,
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontWeight: 700,
            fontSize: 38,
            color: INK,
            opacity: 0.75,
          }}>{sub}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// =============== Helper: paper card ===============
const PaperCard: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode; rot?: number }> = ({ x, y, w, h, children, rot = 0 }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill="#FAFAF5" stroke={INK} strokeWidth={3.5} filter="drop-shadow(0 8px 16px rgba(0,0,0,0.2))" />
    {children}
  </g>
);

// =============== BEAT 1: HOOK ===============
const Beat1: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(1);
  const p = Math.max(0, t - a);
  const cardOp = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(p * 4) * 0.04;
  return (
    <g>
      {/* Title top */}
      <text x={W / 2} y={300} fontSize={44} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={cardOp}>
        NẾU CÔNG VIỆC CỦA BẠN
      </text>
      <text x={W / 2} y={370} fontSize={44} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={cardOp}>
        TRONG DANH SÁCH NÀY...
      </text>

      {/* Red pulsing card */}
      <g transform={`translate(${W / 2}, 760) scale(${pulse})`} opacity={cardOp}>
        <rect x={-380} y={-130} width={760} height={260} rx={24} fill={ACCENT} stroke={INK} strokeWidth={5} />
        <text x={0} y={-30} fontSize={70} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>5 NGHỀ</text>
        <text x={0} y={50} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.95}>NGUY CƠ CAO</text>
        <text x={0} y={100} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.85}>3 năm tới</text>
      </g>

      {/* Teacher pointing */}
      <g transform={`translate(${W / 2 + 280}, 1480) scale(2.0)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 2: CONTEXT — Pipeline 3 ô ===============
const Beat2: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(2);
  const p = Math.max(0, t - a);

  const items = [
    { emo: "🔁", label: "LẶP LẠI", at: 1.3 },
    { emo: "💾", label: "SỐ HOÁ", at: 2.6 },
    { emo: "📊", label: "ĐO ĐƯỢC", at: 4.0 },
  ];

  return (
    <g>
      <text x={W / 2} y={350} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>3 ĐẶC ĐIỂM AI NHẮM</text>

      {items.map((it, i) => {
        const cx = 200 + i * 340;
        const cy = 700;
        const lit = p >= it.at;
        const opa = lit ? interpolate(p, [it.at, it.at + 0.4], [0, 1], { extrapolateRight: "clamp" }) : 0;
        const scale = lit ? interpolate(p, [it.at, it.at + 0.4], [0.8, 1], { extrapolateRight: "clamp" }) : 0.8;
        return (
          <g key={i} transform={`translate(${cx}, ${cy}) scale(${scale})`} opacity={opa}>
            <rect x={-130} y={-130} width={260} height={260} rx={20} fill="#FAFAF5" stroke={lit ? ACCENT : INK} strokeWidth={lit ? 5 : 3.5} />
            <text x={0} y={-10} fontSize={100} textAnchor="middle">{it.emo}</text>
            <text x={0} y={80} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{it.label}</text>
          </g>
        );
      })}

      {/* Arrows between items */}
      {items.slice(0, 2).map((_, i) => {
        const x = 200 + i * 340 + 145;
        const lit = p >= items[i + 1].at - 0.3;
        return lit ? (
          <g key={`arr-${i}`} opacity={interpolate(p, [items[i + 1].at - 0.3, items[i + 1].at], [0, 1], { extrapolateRight: "clamp" })}>
            <line x1={x} y1={700} x2={x + 50} y2={700} stroke={ACCENT} strokeWidth={5} strokeLinecap="round" />
            <polygon points={`${x + 50},700 ${x + 36},693 ${x + 36},707`} fill={ACCENT} />
          </g>
        ) : null;
      })}

      <g transform={`translate(${W / 2 + 280}, 1480) scale(1.8)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};

// =============== BEAT 3: NGHỀ 1-2 ===============
const Beat3: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(3);
  const p = Math.max(0, t - a);

  const cards = [
    { num: "1", emo: "📞", title: "Customer Support", sub: "chat · gọi · ticket 24/7", at: 0.3 },
    { num: "2", emo: "📋", title: "Data Entry", sub: "nhập · tổng hợp · form", at: 5.5 },
  ];

  return (
    <g>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NGHỀ NGUY CƠ CAO</text>

      {cards.map((c, i) => {
        const cy = 480 + i * 380;
        const visible = p >= c.at;
        const op = visible ? interpolate(p, [c.at, c.at + 0.5], [0, 1], { extrapolateRight: "clamp" }) : 0;
        const tx = visible ? interpolate(p, [c.at, c.at + 0.5], [-100, 0], { extrapolateRight: "clamp" }) : -100;
        return (
          <g key={i} transform={`translate(${tx}, 0)`} opacity={op}>
            <rect x={80} y={cy - 130} width={920} height={260} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={3.5} />
            {/* Number badge */}
            <circle cx={170} cy={cy} r={56} fill={ACCENT} stroke={INK} strokeWidth={3.5} />
            <text x={170} y={cy + 18} fontSize={64} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{c.num}</text>
            {/* Emo */}
            <text x={290} y={cy + 28} fontSize={88} textAnchor="middle">{c.emo}</text>
            {/* Title */}
            <text x={400} y={cy - 20} fontSize={48} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{c.title}</text>
            <text x={400} y={cy + 40} fontSize={28} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.65}>{c.sub}</text>
          </g>
        );
      })}
    </g>
  );
};

// =============== BEAT 4: NGHỀ 3-4 ===============
const Beat4: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(4);
  const p = Math.max(0, t - a);

  const cards = [
    { num: "3", emo: "✍️", title: "Content Writer", sub: "SEO · caption · mô tả", at: 0.3 },
    { num: "4", emo: "🎨", title: "Designer hàng loạt", sub: "banner · thumbnail · social", at: 6.5 },
  ];

  return (
    <g>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NGHỀ NGUY CƠ CAO</text>

      {cards.map((c, i) => {
        const cy = 480 + i * 380;
        const visible = p >= c.at;
        const op = visible ? interpolate(p, [c.at, c.at + 0.5], [0, 1], { extrapolateRight: "clamp" }) : 0;
        const tx = visible ? interpolate(p, [c.at, c.at + 0.5], [-100, 0], { extrapolateRight: "clamp" }) : -100;
        return (
          <g key={i} transform={`translate(${tx}, 0)`} opacity={op}>
            <rect x={80} y={cy - 130} width={920} height={260} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={3.5} />
            <circle cx={170} cy={cy} r={56} fill={ACCENT} stroke={INK} strokeWidth={3.5} />
            <text x={170} y={cy + 18} fontSize={64} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{c.num}</text>
            <text x={290} y={cy + 28} fontSize={88} textAnchor="middle">{c.emo}</text>
            <text x={400} y={cy - 20} fontSize={42} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{c.title}</text>
            <text x={400} y={cy + 40} fontSize={26} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.65}>{c.sub}</text>
          </g>
        );
      })}
    </g>
  );
};

// =============== BEAT 5: NGHỀ 5 — Junior Dev ===============
const Beat5: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(5);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const tx = interpolate(p, [0, 0.5], [-100, 0], { extrapolateRight: "clamp" });

  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NGHỀ THAY ĐỔI NHANH NHẤT</text>

      <g transform={`translate(${tx}, 0)`}>
        {/* Big card */}
        <rect x={80} y={500} width={920} height={520} rx={24} fill="#1A1820" stroke={INK} strokeWidth={4} />

        {/* Code rain BG (simple stripes) */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const cx = 130 + i * 110;
          const offset = (p * 60 + i * 23) % 200;
          return (
            <g key={i} opacity={0.18}>
              <text x={cx} y={530 + offset} fontSize={20} fill="#4FFF80" fontFamily="'JetBrains Mono', monospace">function()</text>
              <text x={cx} y={580 + offset} fontSize={20} fill="#4FFF80" fontFamily="'JetBrains Mono', monospace">{`{...}`}</text>
              <text x={cx} y={630 + offset} fontSize={20} fill="#4FFF80" fontFamily="'JetBrains Mono', monospace">return</text>
              <text x={cx} y={680 + offset} fontSize={20} fill="#4FFF80" fontFamily="'JetBrains Mono', monospace">if(x)</text>
            </g>
          );
        })}
        {/* Mask center for content */}
        <rect x={80} y={500} width={920} height={520} rx={24} fill="#1A1820" opacity={0.55} />

        {/* Number badge */}
        <circle cx={200} cy={620} r={68} fill={ACCENT} stroke="#FFF" strokeWidth={4} />
        <text x={200} y={645} fontSize={84} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>5</text>

        {/* Emo + title */}
        <text x={W / 2} y={820} fontSize={120} textAnchor="middle">💻</text>
        <text x={W / 2} y={920} fontSize={56} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Junior Dev / Tester</text>
        <text x={W / 2} y={970} fontSize={28} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.85}>code lặp · fix bug · boilerplate</text>

        {/* Badge "NHANH NHẤT" */}
        {p > 5 && (
          <g transform={`translate(890, 540)`} opacity={interpolate(p, [5, 5.5], [0, 1], { extrapolateRight: "clamp" })}>
            <rect x={-90} y={-26} width={180} height={52} rx={26} fill={GOLD} stroke={INK} strokeWidth={3} />
            <text x={0} y={8} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NHANH NHẤT</text>
          </g>
        )}
      </g>

      <g transform={`translate(${W / 2 + 280}, 1500) scale(1.6)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 6: TWIST + HARD TRUTH — 5 stick figure chart ⭐ ===============
const Beat6: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(6);
  const p = Math.max(0, t - a);

  // 5 figure positions across screen
  const figureXs = [180, 360, 540, 720, 900];
  const glowAt = 4.5; // when fig 1 lights up
  const fadeAt = 6.5; // when figs 2-5 fade

  return (
    <g>
      <text x={W / 2} y={300} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.7}>HARD TRUTH</text>
      <text x={W / 2} y={380} fontSize={50} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>1 NGƯỜI = 5 NGƯỜI</text>

      {/* 5 figures in row */}
      {figureXs.map((fx, i) => {
        const isFirst = i === 0;
        let opacity = 1;
        let glow = false;

        if (isFirst) {
          glow = p >= glowAt;
        } else if (p >= fadeAt) {
          // Stagger fade by 0.3s per figure
          const fadeStart = fadeAt + (i - 1) * 0.3;
          opacity = interpolate(p, [fadeStart, fadeStart + 0.5], [1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        }

        return (
          <g key={i}>
            <MiniStick x={fx} y={900} opacity={opacity} glow={glow} />
            {/* Strikethrough for faded ones */}
            {!isFirst && p >= fadeAt + (i - 1) * 0.3 + 0.4 && (
              <line
                x1={fx - 40} y1={900}
                x2={fx + 40} y2={870}
                stroke={RED}
                strokeWidth={5}
                strokeLinecap="round"
                opacity={interpolate(p, [fadeAt + (i - 1) * 0.3 + 0.4, fadeAt + (i - 1) * 0.3 + 0.7], [0, 0.85], { extrapolateRight: "clamp" })}
              />
            )}
          </g>
        );
      })}

      {/* "× 5" badge near figure 1 when glow */}
      {p >= glowAt && (
        <g transform={`translate(${figureXs[0] + 130}, 870)`}
           opacity={interpolate(p, [glowAt, glowAt + 0.4], [0, 1], { extrapolateRight: "clamp" })}>
          <circle cx={0} cy={0} r={50} fill={ACCENT} stroke={INK} strokeWidth={4} />
          <text x={0} y={18} fontSize={50} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>×5</text>
        </g>
      )}

      {/* ⚡ icon over figure 1 head when glow */}
      {p >= glowAt && (
        <text x={figureXs[0]} y={820}
              fontSize={56}
              textAnchor="middle"
              opacity={interpolate(p, [glowAt, glowAt + 0.4], [0, 1], { extrapolateRight: "clamp" })}>
          ⚡
        </text>
      )}

      {/* Bottom big text reveal */}
      {p >= fadeAt + 1.5 && (
        <g opacity={interpolate(p, [fadeAt + 1.5, fadeAt + 2.0], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={W / 2} y={1240} fontSize={52} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>4 NGƯỜI CÒN LẠI</text>
          <text x={W / 2} y={1300} fontSize={56} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>KHÔNG CẦN NỮA</text>
        </g>
      )}
    </g>
  );
};

// =============== BEAT 7: TAKEAWAY — BigWord drop ===============
const Beat7: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(7);
  const p = Math.max(0, t - a);

  return (
    <g>
      <text x={W / 2} y={400} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.65}>3 NĂM TỚI</text>
      <text x={W / 2} y={460} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.55}>người bị thay không phải kẻ làm kém</text>
      <text x={W / 2} y={510} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.55}>mà là người không biết...</text>

      {/* Teacher thumbs */}
      <g transform={`translate(${W / 2 + 280}, 1500) scale(1.7)`}>
        <Teacher mouthOpen={mo} thumbs />
      </g>
    </g>
  );
};

// =============== BEAT 8: CTA ===============
const Beat8: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(8);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(p * 3) * 0.03;

  return (
    <g opacity={op}>
      <g transform={`translate(${W / 2}, 700) scale(${pulse})`}>
        <rect x={-440} y={-180} width={880} height={360} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={4} filter="drop-shadow(0 12px 24px rgba(0,0,0,0.2))" />
        <text x={0} y={-80} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Role của bạn có</text>
        <text x={0} y={-30} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>trong list không?</text>
        <text x={0} y={60} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.7}>Đang làm gì để không bị</text>
        <text x={0} y={105} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.7}>thành người tiếp theo?</text>
        <text x={0} y={170} fontSize={56} textAnchor="middle">💬 👇</text>
      </g>

      {/* CTA bottom */}
      {p > 3 && (
        <g opacity={interpolate(p, [3, 3.5], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={140} y={1320} width={800} height={130} rx={20} fill={ACCENT} stroke={INK} strokeWidth={4} />
          <text x={W / 2} y={1370} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FOLLOW</text>
          <text x={W / 2} y={1415} fontSize={24} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>để xem cách tận dụng AI</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 280}, 1620) scale(1.5)`}>
        <Teacher mouthOpen={mo} waving />
      </g>
    </g>
  );
};

// =============== Main composition ===============
export const NgheBiAIThayThe: React.FC = () => {
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

  // Beat 1 BigWord
  const b1 = B(1);
  const b7 = B(7);

  return (
    <AbsoluteFill>
      <Audio src={staticFile("nghe_ai_voice.mp3")} />
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

      {/* BigWord overlays */}
      <BigWord text="AI ĐANG ĐẾN" from={b1[0] + 0.2} until={b1[0] + 2.5} color={ACCENT} />
      <BigWord text="KHÔNG TẬN DỤNG AI" sub="= bị thay thế" from={b7[0] + 3.5} until={b7[1] - 0.2} color={ACCENT} />

      <Caption />
    </AbsoluteFill>
  );
};

export const ngheBiAIDuration = totalDuration;
