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
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import wordsData from "./agentcf_words.json";
import beatsData from "./agentcf_beats.json";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadEBGaramond("italic", { weights: ["600", "700"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "700"], subsets: ["latin", "latin-ext"] });

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
const B = (i: number) => {
  const b = beats[i - 1];
  return [b.start, b.start + b.duration] as const;
};

const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="acfPN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="33" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="acfVig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#acfPN)" />
    <rect width={W} height={H} fill="url(#acfVig)" />
  </svg>
);

const SourceBadge: React.FC = () => (
  <g transform="translate(880, 90)">
    <rect x={-160} y={-30} width={320} height={60} rx={30} fill="#FAFAF5" stroke={ACCENT} strokeWidth={3.5} />
    <text x={0} y={9} fontSize={20} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>HN · 583 pts</text>
  </g>
);

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

const EMPH = new Set<string>([
  "MANDATORY", "DO", "NOT", "SKIP",
  "trần", "trần.", "rồi.",
  "583", "viral",
  "99%", "SAI.", "SAI", "sai",
  "gợi", "ý.", "Success", "hallucinate.",
  "collapse", "phức", "tạp.",
  "RUNTIME", "runtime.", "state", "machine", "checkpoint.",
  "COMPONENT", "SYSTEM", "SYSTEM.",
  "Babysitter", "Babysitter.", "Auditor", "Auditor.", "Prayer", "Prayer.",
  "vibe", "engineer", "CODE", "PROMPT", "code,", "prompt.",
  "hết", "thời", "thời.", "lên", "ngôi.",
  "verification",
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
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 130, pointerEvents: "none" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 16px", maxWidth: 940, padding: "0 60px" }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [10, 0]);
          const emph = isEmph(w.word);
          return (
            <span key={`${active.start}-${i}`} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: emph ? 800 : 700,
              fontSize: emph ? 56 : 46,
              color: emph ? GOLD : IVORY,
              textShadow: emph
                ? "0 0 22px rgba(229,165,59,0.55), 0 3px 12px rgba(0,0,0,0.95)"
                : "0 3px 12px rgba(0,0,0,0.95)",
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

// =============== BEAT 1: HOOK ===============
const Beat1: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(1);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const sp = spring({ frame: (p - 0.3) * FPS, fps: FPS, config: { damping: 11, stiffness: 200 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NẾU MÀY ĐÃ TỪNG…</text>

      {/* Code-like prompt block */}
      <g transform="translate(540, 600)">
        <rect x={-460} y={-180} width={920} height={360} rx={20} fill={INK} stroke={INK} strokeWidth={4}
          filter="drop-shadow(0 12px 24px rgba(0,0,0,0.25))" />
        {/* mac dots */}
        <circle cx={-430} cy={-150} r={10} fill="#FF5F57" />
        <circle cx={-400} cy={-150} r={10} fill="#FEBC2E" />
        <circle cx={-370} cy={-150} r={10} fill="#28C840" />
        <text x={-330} y={-145} fontSize={20} fill="#888" fontFamily="'JetBrains Mono', monospace">prompt.txt</text>
        {/* code lines */}
        <text x={-400} y={-70} fontSize={42} fill="#FF6B6B" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>"MANDATORY:</text>
        <text x={-400} y={-15} fontSize={42} fill="#FFEB3B" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>  DO NOT SKIP</text>
        <text x={-400} y={40} fontSize={42} fill="#FF6B6B" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>  THIS STEP!"</text>
        <text x={-400} y={130} fontSize={28} fill="#888" fontFamily="'JetBrains Mono', monospace">// đã đụng trần</text>
      </g>

      {/* Bottom verdict */}
      <g transform="translate(540, 1080)" opacity={p > 1.5 ? interpolate(p, [1.5, 1.9], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <text x={0} y={0} fontSize={56} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>= mày đụng TRẦN rồi</text>
      </g>
    </g>
  );
};

// =============== BEAT 2: CONTEXT — viral 583 pts ===============
const Beat2: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(2);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const numSp = spring({ frame: (p - 0.5) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BÀI VIRAL · HACKER NEWS</text>

      {/* HN sticker */}
      <g transform="translate(540, 470)">
        <rect x={-80} y={-50} width={160} height={100} rx={12} fill="#FF6600" stroke={INK} strokeWidth={4} />
        <text x={0} y={14} fontSize={56} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Y</text>
      </g>

      {/* 583 points */}
      <g transform={`translate(${W / 2}, 720) scale(${numSp})`}>
        <text x={0} y={0} fontSize={260} fill={ACCENT} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          style={{ filter: "drop-shadow(0 14px 28px rgba(232,88,56,0.5))" }}>583</text>
        <text x={0} y={150} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>điểm trên Hacker News</text>
      </g>

      {/* "99% SAI" pill */}
      <g transform="translate(540, 1120)" opacity={p > 2.0 ? interpolate(p, [2.0, 2.4], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <rect x={-380} y={-50} width={760} height={100} rx={50} fill={RED} stroke={INK} strokeWidth={3.5} />
        <text x={0} y={14} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>99% MỌI NGƯỜI ĐANG LÀM SAI</text>
      </g>
    </g>
  );
};

// =============== BEAT 3: ANALOGY — programming language as suggestion ===============
const Beat3: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(3);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TƯỞNG TƯỢNG…</text>

      {/* Code block with annotation */}
      <g transform="translate(540, 700)">
        <rect x={-460} y={-280} width={920} height={560} rx={20} fill={INK} stroke={INK} strokeWidth={4}
          filter="drop-shadow(0 12px 24px rgba(0,0,0,0.25))" />
        <circle cx={-430} cy={-250} r={10} fill="#FF5F57" />
        <circle cx={-400} cy={-250} r={10} fill="#FEBC2E" />
        <circle cx={-370} cy={-250} r={10} fill="#28C840" />

        <text x={-400} y={-180} fontSize={32} fill="#FF6B6B" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>function deploy() {"{"}</text>
        <text x={-400} y={-130} fontSize={32} fill="#888" fontFamily="'JetBrains Mono', monospace">  // statement = "gợi ý"</text>
        <text x={-400} y={-70} fontSize={32} fill="#FFEB3B" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>  if (please) check();</text>
        <text x={-400} y={-10} fontSize={32} fill="#888" fontFamily="'JetBrains Mono', monospace">  // function trả Success</text>
        <text x={-400} y={50} fontSize={32} fill="#888" fontFamily="'JetBrains Mono', monospace">  // nhưng đang HALLUCINATE</text>
        <text x={-400} y={120} fontSize={32} fill={GREEN} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>  return "Success" 🤡</text>
        <text x={-400} y={180} fontSize={32} fill="#FF6B6B" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{"}"}</text>
      </g>

      {/* Verdict */}
      <g transform="translate(540, 1180)" opacity={p > 2.5 ? interpolate(p, [2.5, 2.9], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <text x={0} y={0} fontSize={42} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>👆 đây là AI agent của bạn</text>
      </g>
    </g>
  );
};

// =============== BEAT 4: PAIN ===============
const Beat4: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(4);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const items = [
    "Prompt KHÔNG deterministic",
    "KHÔNG verify được",
    "Reliability COLLAPSE khi scale",
  ];
  return (
    <g opacity={op}>
      <text x={W / 2} y={280} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>VẤN ĐỀ THẬT SỰ</text>

      {/* Falling chart visual */}
      <g transform="translate(540, 500)">
        <text x={0} y={0} fontSize={140} textAnchor="middle">📉</text>
      </g>

      {items.map((it, i) => {
        const ip = Math.max(0, p - 0.5 - i * 0.6);
        const sp = spring({ frame: ip * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
        const ix = interpolate(sp, [0, 1], [-120, 0]);
        return (
          <g key={i} transform={`translate(${W / 2 + ix}, ${750 + i * 130})`} opacity={sp}>
            <rect x={-440} y={-50} width={880} height={100} rx={20} fill={RED} stroke={INK} strokeWidth={3.5} />
            <text x={-380} y={14} fontSize={46} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>×</text>
            <text x={20} y={14} fontSize={36} fill="#FFF" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} textAnchor="middle">{it}</text>
          </g>
        );
      })}
    </g>
  );
};

// =============== BEAT 5: SOLUTION ===============
const Beat5: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(5);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={280} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>GIẢI PHÁP</text>

      {/* Move arrow */}
      <g transform="translate(540, 500)">
        <text x={-220} y={0} fontSize={56} fill={INK} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.45}>PROSE</text>
        <text x={0} y={0} fontSize={70} fill={GOLD} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→</text>
        <text x={220} y={0} fontSize={56} fill={ACCENT} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>RUNTIME</text>
      </g>

      {/* Solution items */}
      {["State machine", "Validation checkpoint", "Code thuần — không phải prompt"].map((it, i) => {
        const ip = Math.max(0, p - 0.6 - i * 0.5);
        const sp = spring({ frame: ip * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
        return (
          <g key={i} transform={`translate(${W / 2}, ${720 + i * 130})`} opacity={sp}>
            <rect x={-440} y={-50} width={880} height={100} rx={20} fill={GREEN} stroke={INK} strokeWidth={3.5} />
            <text x={-380} y={14} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✓</text>
            <text x={20} y={14} fontSize={36} fill="#FFF" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} textAnchor="middle">{it}</text>
          </g>
        );
      })}
    </g>
  );
};

// =============== BEAT 6: MINDSET ===============
const Beat6: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(6);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={280} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>MINDSET SHIFT</text>

      {/* WRONG card */}
      <g transform="translate(540, 540)">
        <rect x={-440} y={-110} width={880} height={220} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
        <text x={-360} y={-50} fontSize={32} fill={RED} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>❌ SAI</text>
        <text x={0} y={20} fontSize={50} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>LLM = SYSTEM</text>
        <text x={0} y={70} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.6}>(prompt làm hết mọi thứ)</text>
      </g>

      {/* Big arrow */}
      <g transform="translate(540, 720)" opacity={p > 1.4 ? interpolate(p, [1.4, 1.7], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <text x={0} y={0} fontSize={70} fill={GOLD} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>↓</text>
      </g>

      {/* RIGHT card */}
      <g transform="translate(540, 920)" opacity={p > 1.8 ? interpolate(p, [1.8, 2.2], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <rect x={-440} y={-110} width={880} height={220} rx={24} fill={GREEN} stroke={INK} strokeWidth={4}
          filter="drop-shadow(0 10px 18px rgba(63,168,90,0.4))" />
        <text x={-360} y={-50} fontSize={32} fill="#FFF" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✓ ĐÚNG</text>
        <text x={0} y={20} fontSize={50} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>LLM = COMPONENT</text>
        <text x={0} y={70} fontSize={28} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.85}>(code điều khiển flow)</text>
      </g>
    </g>
  );
};

// =============== BEAT 7: SETUP_OPTIONS ===============
const Beat7: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(7);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
  const sp = spring({ frame: (p - 0.1) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  return (
    <g opacity={op}>
      <g transform={`translate(${W / 2}, 850) scale(${sp})`}>
        <text x={0} y={-80} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Không có verification?</text>
        <text x={0} y={70} fontSize={120} fill={ACCENT} textAnchor="middle"
          fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          style={{ filter: "drop-shadow(0 10px 22px rgba(232,88,56,0.45))" }}>3 LỰA CHỌN</text>
      </g>
    </g>
  );
};

// =============== BEAT 8: THREE OPTIONS ===============
const Beat8: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(8);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const opts = [
    { num: "1", emo: "👶", name: "BABYSITTER", desc: "Ngồi canh từng bước", color: BLUE },
    { num: "2", emo: "🔍", name: "AUDITOR", desc: "Audit cuối cùng", color: GOLD },
    { num: "3", emo: "🙏", name: "PRAYER", desc: "Vibe accept · cầu nguyện", color: RED },
  ];
  return (
    <g opacity={op}>
      <text x={W / 2} y={280} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BA LỰA CHỌN CỦA MÀY</text>

      {opts.map((o, i) => {
        const ip = Math.max(0, p - 0.4 - i * 1.5);
        const sp = spring({ frame: ip * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
        const ix = interpolate(sp, [0, 1], [-150, 0]);
        return (
          <g key={i} transform={`translate(${W / 2 + ix}, ${480 + i * 270})`} opacity={sp}>
            <rect x={-460} y={-110} width={920} height={220} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={4}
              filter="drop-shadow(0 8px 16px rgba(0,0,0,0.18))" />
            <rect x={-460} y={-110} width={20} height={220} rx={6} fill={o.color} />
            {/* Number circle */}
            <circle cx={-360} cy={0} r={56} fill={o.color} stroke={INK} strokeWidth={3.5} />
            <text x={-360} y={20} fontSize={60} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{o.num}</text>
            {/* Emoji */}
            <text x={-200} y={28} fontSize={90} textAnchor="middle">{o.emo}</text>
            {/* Name + desc */}
            <text x={50} y={-15} fontSize={48} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} textAnchor="start">{o.name}</text>
            <text x={50} y={40} fontSize={28} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} textAnchor="start" opacity={0.7}>{o.desc}</text>
          </g>
        );
      })}
    </g>
  );
};

// =============== BEAT 9: INSIGHT ===============
const Beat9: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(9);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const sp = spring({ frame: (p - 0.4) * FPS, fps: FPS, config: { damping: 10, stiffness: 200 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TAKEAWAY</text>

      <g transform={`translate(${W / 2}, 600) scale(${sp})`}>
        <text x={0} y={-110} fontSize={64} fill={INK} textAnchor="middle"
          fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic" opacity={0.55}>
          Vibe-coding hết thời.
        </text>
        <text x={0} y={50} fontSize={120} fill={ACCENT} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          style={{ filter: "drop-shadow(0 10px 22px rgba(232,88,56,0.45))" }}>ENGINEER</text>
        <text x={0} y={170} fontSize={70} fill={INK} textAnchor="middle"
          fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>-coding lên ngôi.</text>
      </g>

      {/* Sub */}
      <g transform="translate(540, 1100)" opacity={p > 1.5 ? interpolate(p, [1.5, 1.9], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <rect x={-440} y={-70} width={880} height={140} rx={20} fill={INK} stroke={INK} strokeWidth={3} />
        <text x={0} y={-5} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Build agent reliable 2026 =</text>
        <text x={0} y={45} fontSize={36} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>viết CODE, không phải PROMPT</text>
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
      <text x={W / 2} y={290} fontSize={50} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>MÀY THÌ SAO?</text>

      {/* Question card with 3 emoji */}
      <g transform="translate(540, 650)">
        <rect x={-460} y={-200} width={920} height={400} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={4}
          filter="drop-shadow(0 10px 20px rgba(0,0,0,0.18))" />
        <text x={0} y={-110} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Mày đang ở đâu?</text>
        {/* 3 emoji row */}
        <g transform="translate(0, 30)">
          <text x={-280} y={0} fontSize={120} textAnchor="middle">👶</text>
          <text x={-280} y={75} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BABYSITTER</text>
          <text x={0} y={0} fontSize={120} textAnchor="middle">🔍</text>
          <text x={0} y={75} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AUDITOR</text>
          <text x={280} y={0} fontSize={120} textAnchor="middle">🙏</text>
          <text x={280} y={75} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PRAYER</text>
        </g>
        <text x={0} y={170} fontSize={32} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Comment con số 1, 2, 3 👇</text>
      </g>

      {/* Follow CTA */}
      <g transform="translate(540, 1180)" opacity={p > 1.6 ? interpolate(p, [1.6, 2.0], [0, 1], { extrapolateRight: "clamp" }) : 0}>
        <rect x={-380} y={-60} width={760} height={120} rx={24} fill={GOLD} stroke={INK} strokeWidth={4} />
        <text x={0} y={-5} fontSize={40} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>SAVE · FOLLOW</text>
        <text x={0} y={40} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>insight build agent đúng mỗi tuần</text>
      </g>
    </g>
  );
};

export const AgentControlFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  let activeBeat = 1;
  for (let i = beats.length - 1; i >= 0; i--) {
    if (t >= beats[i].start) { activeBeat = beats[i].index; break; }
  }

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Bg />
      <Audio src={staticFile("agentcf_voice.mp3")} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <SourceBadge />
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
      </svg>
      <Caption />
    </AbsoluteFill>
  );
};
