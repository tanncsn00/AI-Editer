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
import wordsData from "./bantin_words.json";
import beatsData from "./bantin_beats.json";

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

const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="btPN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="55" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="btVig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#btPN)" />
    <rect width={W} height={H} fill="url(#btVig)" />
  </svg>
);

// Top news ribbon — always visible
const NewsRibbon: React.FC<{ tinNum?: number }> = ({ tinNum }) => {
  const frame = useCurrentFrame();
  const blink = Math.sin(frame / 6) > 0;
  return (
    <g>
      {/* LIVE pill */}
      <g transform="translate(80, 110)">
        <rect x={0} y={-32} width={180} height={64} rx={32} fill={RED} stroke={INK} strokeWidth={3.5} />
        <circle cx={26} cy={0} r={9} fill="#FFF" opacity={blink ? 1 : 0.4} />
        <text x={108} y={9} fontSize={26} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>LIVE</text>
      </g>
      {/* Date */}
      <g transform="translate(540, 110)">
        <text x={0} y={9} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BẢN TIN AI · 08/05</text>
      </g>
      {/* Counter */}
      {tinNum !== undefined && (
        <g transform="translate(960, 110)">
          <rect x={-80} y={-32} width={160} height={64} rx={20} fill={INK} stroke={INK} strokeWidth={3.5} />
          <text x={0} y={11} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{tinNum}/7</text>
        </g>
      )}
    </g>
  );
};

// Bottom ticker scroll
const Ticker: React.FC = () => {
  const frame = useCurrentFrame();
  const tickerItems = [
    "🚨 Long Lake mua Amex GBT $6.3B",
    "⚖️ Mira Murati: Altman lied",
    "🎙️ OpenAI Voice API ra mắt",
    "💻 Perplexity PC mở cho Mac",
    "✂️ OpenReel — CapCut open source",
    "💰 Ramp đàm phán $40B",
    "🏛️ Anthropic ra finance agents",
  ];
  const text = tickerItems.join("    •    ") + "    •    ";
  const fullText = text + text;
  const speed = 80;
  const x = -((frame * speed / FPS) % 2000);
  return (
    <g>
      <rect x={0} y={H - 80} width={W} height={80} fill={INK} />
      <rect x={0} y={H - 84} width={W} height={4} fill={GOLD} />
      <text x={x} y={H - 28} fontSize={28} fill="#FFF" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        {fullText}
      </text>
    </g>
  );
};

// Caption
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
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 130, pointerEvents: "none" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 16px", maxWidth: 940, padding: "0 60px" }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [10, 0]);
          return (
            <span key={`${active.start}-${i}`} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 700,
              fontSize: 42,
              color: IVORY,
              textShadow: "0 3px 12px rgba(0,0,0,0.95)",
              opacity: visible ? sp : 0,
              transform: `translateY(${y}px)`,
              lineHeight: 1.3,
            }}>{w.word}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// =============== INTRO ===============
const Intro: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(1);
  const p = Math.max(0, t - a);
  const sp = spring({ frame: (p - 0.1) * FPS, fps: FPS, config: { damping: 11, stiffness: 200 } });
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <g transform={`translate(${W / 2}, 650) scale(${sp})`}>
        <text x={0} y={-260} fontSize={64} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BẢN TIN</text>
        <text x={0} y={30} fontSize={260} fill={ACCENT} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          style={{ filter: "drop-shadow(0 14px 32px rgba(232,88,56,0.5))" }}>AI</text>
        <text x={0} y={250} fontSize={64} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>08 / 05 / 2026</text>
      </g>
      {/* "7 tin nóng nhất" pill */}
      <g transform="translate(540, 1050)" opacity={p > 1.2 ? interpolate(p, [1.2, 1.6], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <rect x={-360} y={-50} width={720} height={100} rx={50} fill={GOLD} stroke={INK} strokeWidth={3.5} />
        <text x={0} y={14} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🔥 7 TIN NÓNG NHẤT</text>
      </g>
    </g>
  );
};

// Reusable news card
const NewsCard: React.FC<{
  num: number;
  emo: string;
  color: string;
  category: string;
  headline: string;
  detail: string;
  p: number;
}> = ({ num, emo, color, category, headline, detail, p }) => {
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const sp = spring({ frame: (p - 0.05) * FPS, fps: FPS, config: { damping: 12, stiffness: 220 } });
  const ix = interpolate(sp, [0, 1], [-150, 0]);
  return (
    <g opacity={op}>
      {/* Category badge */}
      <g transform="translate(540, 270)">
        <rect x={-200} y={-32} width={400} height={64} rx={32} fill={color} stroke={INK} strokeWidth={3} />
        <text x={0} y={10} fontSize={26} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{category}</text>
      </g>

      {/* Big number background */}
      <text x={W / 2} y={500} fontSize={420} fill={color} textAnchor="middle" dominantBaseline="middle"
        opacity={0.1} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{num}</text>

      {/* Big emoji */}
      <text x={W / 2} y={530} fontSize={180} textAnchor="middle">{emo}</text>

      {/* Headline card */}
      <g transform={`translate(${W / 2 + ix}, 850)`}>
        <rect x={-460} y={-100} width={920} height={200} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={4}
          filter="drop-shadow(0 8px 16px rgba(0,0,0,0.18))" />
        <foreignObject x={-440} y={-90} width={880} height={180}>
          <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 44, fontWeight: 800, color: INK, lineHeight: 1.2, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            {headline}
          </div>
        </foreignObject>
      </g>

      {/* Detail card */}
      <g transform={`translate(${W / 2}, 1140)`} opacity={p > 0.8 ? interpolate(p, [0.8, 1.1], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <rect x={-440} y={-80} width={880} height={160} rx={20} fill={INK} stroke={INK} strokeWidth={3} />
        <foreignObject x={-410} y={-65} width={820} height={130}>
          <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 32, fontWeight: 700, color: GOLD, lineHeight: 1.3, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
            {detail}
          </div>
        </foreignObject>
      </g>
    </g>
  );
};

const newsItems = [
  {
    idx: 2, num: 1, emo: "⚖️", color: PURPLE,
    category: "DRAMA · MUSK v ALTMAN",
    headline: "\"Sam Altman nói dối tôi\"",
    detail: "Mira Murati (cựu CTO OpenAI) ra tòa · Tuần 2 bùng nổ",
  },
  {
    idx: 3, num: 2, emo: "🚨", color: RED,
    category: "DEAL · BIG MONEY",
    headline: "Long Lake mua American Express GBT",
    detail: "$6.3 TỶ · premium 65% · AI roll-up era",
  },
  {
    idx: 4, num: 3, emo: "🎙️", color: GREEN,
    category: "LAUNCH · OPENAI",
    headline: "Voice Intelligence API",
    detail: "Build app voice AI dễ thở hơn nhiều",
  },
  {
    idx: 5, num: 4, emo: "💻", color: BLUE,
    category: "LAUNCH · PERPLEXITY",
    headline: "Personal Computer mở cho Mac",
    detail: "AI agent điều khiển máy tính của bạn",
  },
  {
    idx: 6, num: 5, emo: "✂️", color: ACCENT,
    category: "TOOL · OPEN SOURCE",
    headline: "OpenReel = CapCut open source",
    detail: "Browser-based · không cài · FREE",
  },
  {
    idx: 7, num: 6, emo: "💰", color: GOLD,
    category: "STARTUP · VC",
    headline: "Ramp đàm phán $40B+",
    detail: "6 tháng trước mới $32B · tăng nhanh",
  },
  {
    idx: 8, num: 7, emo: "🏛️", color: TEAL,
    category: "LAUNCH · ANTHROPIC",
    headline: "Finance-Services Agents ra mắt",
    detail: "Repo trending GitHub trong ngày",
  },
];

const NewsBeat: React.FC<{ t: number; idx: number }> = ({ t, idx }) => {
  const item = newsItems.find(x => x.idx === idx)!;
  const [a] = B(idx);
  const p = Math.max(0, t - a);
  return <NewsCard {...item} p={p} />;
};

// =============== OUTRO ===============
const Outro: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(9);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>HẾT BẢN TIN HÔM NAY</text>

      {/* Big "FOLLOW" */}
      <g transform={`translate(${W / 2}, 700)`}>
        <text x={0} y={0} fontSize={200} fill={ACCENT} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          style={{ filter: "drop-shadow(0 12px 28px rgba(232,88,56,0.5))" }}>FOLLOW</text>
        <text x={0} y={130} fontSize={50} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>tin AI mỗi sáng 8h</text>
      </g>

      {/* CTA card */}
      <g transform="translate(540, 1100)" opacity={p > 1.2 ? interpolate(p, [1.2, 1.6], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <rect x={-440} y={-80} width={880} height={160} rx={24} fill={GOLD} stroke={INK} strokeWidth={4} />
        <text x={0} y={-15} fontSize={40} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Hẹn ngày mai 👋</text>
        <text x={0} y={35} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Save · Comment tin nào hot nhất</text>
      </g>
    </g>
  );
};

export const BanTinAI: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  let activeBeat = 1;
  for (let i = beats.length - 1; i >= 0; i--) {
    if (t >= beats[i].start) { activeBeat = beats[i].index; break; }
  }
  const tinNum = activeBeat >= 2 && activeBeat <= 8 ? activeBeat - 1 : undefined;

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Bg />
      <Audio src={staticFile("bantin_voice.mp3")} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <NewsRibbon tinNum={tinNum} />
        {activeBeat === 1 && <Intro t={t} />}
        {activeBeat >= 2 && activeBeat <= 8 && <NewsBeat t={t} idx={activeBeat} />}
        {activeBeat === 9 && <Outro t={t} />}
        <Ticker />
      </svg>
      <Caption />
    </AbsoluteFill>
  );
};
