import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import wordsData from "./penpot_words.json";
import beatsData from "./penpot_beats.json";

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
      <filter id="penPN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="42" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="penVig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#penPN)" />
    <rect width={W} height={H} fill="url(#penVig)" />
  </svg>
);

const SourceBadge: React.FC = () => (
  <g transform="translate(880, 90)">
    <rect x={-160} y={-30} width={320} height={60} rx={30} fill="#FAFAF5" stroke={ACCENT} strokeWidth={3.5} />
    <text x={0} y={9} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PENPOT · MCP</text>
  </g>
);

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
    if (/[,—:·]$/.test(w.word) && buf.length >= 4) {
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
  "30", "phút.", "phút", "2", "PROMPT", "1", "trang", "web", "code", "thật.",
  "Penpot.", "Penpot", "FREE.", "FREE", "MCP.", "MCP", "open", "source.",
  "SVG", "Figma", "—", "code.", "thẳng.", "thẳng", "screenshot.", "API.",
  "5", "phút", "Header", "Hero", "Footer",
  "Next.js\".", "Next.js", "localhost:3000.", "localhost:3000",
  "pixel.", "code.", "0", "1",
  "design", "docs", "component", "4", "chiều.", "1",
  "9.5/10", "$5/tháng", "∞", "2026", "VPS", "user", "dev", "seat",
  "Penpot", "1", "lệnh.", "FREE", "vĩnh", "viễn.", "TỐI", "NAY.",
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

// =============== BEAT 1: HOOK · 30 PHÚT ===============
const Beat1: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(1);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const numSp = spring({ frame: (p - 0.1) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  const subSp = spring({ frame: (p - 1.2) * FPS, fps: FPS, config: { damping: 14, stiffness: 220 } });
  const arrowSp = spring({ frame: (p - 2.4) * FPS, fps: FPS, config: { damping: 14, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TỪ 0 ĐẾN WEB CHẠY THẬT</text>

      {/* BIG 10 phút stacked */}
      <g transform={`translate(${W / 2}, 700) scale(${numSp})`}>
        <text x={0} y={0} fontSize={440} fill={ACCENT} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic"
          style={{ filter: "drop-shadow(0 16px 36px rgba(232,88,56,0.5))" }}>10</text>
        <text x={0} y={220} fontSize={130} fill={INK} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>phút.</text>
      </g>

      {/* Subtitle pill */}
      <g transform={`translate(${W / 2}, 1080) scale(${subSp})`} opacity={subSp}>
        <rect x={-380} y={-50} width={760} height={100} rx={50} fill={INK} stroke={INK} strokeWidth={3.5} />
        <text x={0} y={14} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>2 PROMPT · 1 TRANG WEB</text>
      </g>

      {/* Arrow row design → code → web */}
      <g transform={`translate(${W / 2}, 1280)`} opacity={arrowSp}>
        <text x={-300} y={0} fontSize={90} textAnchor="middle">🎨</text>
        <text x={-300} y={70} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>DESIGN</text>
        <text x={-150} y={-10} fontSize={70} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→</text>
        <text x={0} y={0} fontSize={90} textAnchor="middle">💻</text>
        <text x={0} y={70} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CODE</text>
        <text x={150} y={-10} fontSize={70} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→</text>
        <text x={300} y={0} fontSize={90} textAnchor="middle">🌐</text>
        <text x={300} y={70} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>WEB CHẠY</text>
      </g>
    </g>
  );
};

// =============== BEAT 2: ANNOUNCE · PENPOT logo + 4 AI ===============
const Beat2: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(2);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const logoSp = spring({ frame: (p - 0.2) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  const stampSp = spring({ frame: (p - 1.6) * FPS, fps: FPS, config: { damping: 14, stiffness: 220 } });
  const aisSp = spring({ frame: (p - 2.8) * FPS, fps: FPS, config: { damping: 14, stiffness: 220 } });

  const ais = [
    { letter: "✦", name: "Claude", color: "#D97757" },
    { letter: "▶", name: "Cursor", color: "#1A1820" },
    { letter: "▲", name: "Antigravity", color: "#5865F2" },
    { letter: "</>", name: "Cline", color: "#0E7C66" },
  ];
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TOOL NÀY TÊN LÀ…</text>

      {/* Penpot wordmark */}
      <g transform={`translate(${W / 2}, 580) scale(${logoSp})`}>
        <rect x={-440} y={-130} width={880} height={260} rx={30} fill={INK} stroke={INK} strokeWidth={4}
          filter="drop-shadow(0 14px 28px rgba(0,0,0,0.25))" />
        <text x={0} y={32} fontSize={170} fill="#FFF" textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Penpot</text>
      </g>
      {/* URL outside box, below */}
      <g transform={`translate(${W / 2}, 750) scale(${logoSp})`}>
        <text x={0} y={0} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" opacity={0.65}>penpot.app</text>
      </g>

      {/* OPEN SOURCE FREE stamp */}
      <g transform={`translate(${W / 2}, 850)`} opacity={stampSp}>
        <rect x={-340} y={-50} width={680} height={100} rx={50} fill={GOLD} stroke={INK} strokeWidth={3.5} />
        <text x={0} y={14} fontSize={40} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>OPEN SOURCE · FREE · MCP</text>
      </g>

      {/* 4 AI logos */}
      <g transform={`translate(${W / 2}, 1180)`} opacity={aisSp}>
        <text x={0} y={-150} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Cắm được vào MỌI AI agent có MCP</text>
        {ais.map((ai, i) => (
          <g key={i} transform={`translate(${-360 + i * 240}, 0)`}>
            <rect x={-90} y={-90} width={180} height={180} rx={28} fill={ai.color} stroke={INK} strokeWidth={3.5}
              filter="drop-shadow(0 8px 16px rgba(0,0,0,0.18))" />
            <text x={0} y={20} fontSize={ai.letter.length > 1 ? 70 : 100} fill="#FFF" textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{ai.letter}</text>
            <text x={0} y={130} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{ai.name}</text>
          </g>
        ))}
      </g>
    </g>
  );
};

// =============== BEAT 3: KILLER FACT · Figma vs Penpot ===============
const Beat3: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(3);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const lSp = spring({ frame: (p - 0.2) * FPS, fps: FPS, config: { damping: 14, stiffness: 220 } });
  const rSp = spring({ frame: (p - 1.0) * FPS, fps: FPS, config: { damping: 14, stiffness: 220 } });
  const verdSp = spring({ frame: (p - 5.5) * FPS, fps: FPS, config: { damping: 14, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={280} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FILE LƯU NHƯ THẾ NÀO?</text>

      {/* Left card: Figma .fig */}
      <g transform={`translate(290, 800) scale(${lSp})`}>
        <rect x={-220} y={-300} width={440} height={600} rx={24} fill="#1A1820" stroke={RED} strokeWidth={4}
          filter="drop-shadow(0 10px 20px rgba(0,0,0,0.3))" />
        <text x={0} y={-220} fontSize={56} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Figma</text>
        <text x={0} y={-160} fontSize={26} fill="#888" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">.fig binary</text>
        <text x={0} y={-30} fontSize={100} textAnchor="middle" dominantBaseline="middle">🔒</text>
        <text x={0} y={130} fontSize={28} fill="#FF6B6B" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>01010110...</text>
        <text x={0} y={170} fontSize={28} fill="#FF6B6B" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>11001010...</text>
        <text x={0} y={220} fontSize={26} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AI không đọc được</text>
        <text x={0} y={260} fontSize={26} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>cần API + screenshot</text>
      </g>

      {/* Right card: Penpot SVG */}
      <g transform={`translate(790, 800) scale(${rSp})`}>
        <rect x={-220} y={-300} width={440} height={600} rx={24} fill="#FAFAF5" stroke={GREEN} strokeWidth={4}
          filter="drop-shadow(0 10px 20px rgba(0,0,0,0.18))" />
        <text x={0} y={-220} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Penpot</text>
        <text x={0} y={-160} fontSize={26} fill={GREEN} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>.svg + json</text>
        <g transform="translate(-180, -100)">
          <text x={0} y={20} fontSize={22} fill="#0066CC" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{`<svg>`}</text>
          <text x={0} y={50} fontSize={22} fill={INK} fontFamily="'JetBrains Mono', monospace">  {`<rect`}</text>
          <text x={0} y={80} fontSize={22} fill={ACCENT} fontFamily="'JetBrains Mono', monospace">    fill="#E85838"</text>
          <text x={0} y={110} fontSize={22} fill={INK} fontFamily="'JetBrains Mono', monospace">  {`/>`}</text>
          <text x={0} y={140} fontSize={22} fill={INK} fontFamily="'JetBrains Mono', monospace">  {`<text>HERO</text>`}</text>
          <text x={0} y={170} fontSize={22} fill="#0066CC" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{`</svg>`}</text>
        </g>
        <text x={0} y={220} fontSize={26} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AI đọc THẲNG ✓</text>
        <text x={0} y={260} fontSize={26} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AI VẼ THẲNG ✓</text>
      </g>

      {/* Verdict */}
      <g transform={`translate(${W / 2}, 1280)`} opacity={verdSp}>
        <rect x={-440} y={-50} width={880} height={100} rx={50} fill={ACCENT} stroke={INK} strokeWidth={3.5} />
        <text x={0} y={14} fontSize={36} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FILE = CODE → AI NATIVE</text>
      </g>
    </g>
  );
};

// =============== BEAT 4: DEMO PROMPT 1 — Penpot screenshot ===============
const Beat4Image: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(4);
  const p = Math.max(0, t - a);
  const imgSp = spring({ frame: (p - 1.3) * FPS, fps: FPS, config: { damping: 13, stiffness: 200 } });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: (W - 920) / 2, top: 510, width: 920, height: 1100, borderRadius: 20, overflow: "hidden", border: `4px solid ${INK}`, boxShadow: "0 20px 40px rgba(0,0,0,0.3)", opacity: imgSp, transform: `scale(${0.9 + 0.1 * imgSp})` }}>
        <div style={{ height: 44, background: INK, display: "flex", alignItems: "center", padding: "0 18px", gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#FEBC2E" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#28C840" }} />
          <div style={{ marginLeft: 22, color: "#9AA0A6", fontFamily: "'JetBrains Mono', monospace", fontSize: 18 }}>vibe designing — Penpot</div>
        </div>
        <Img src={staticFile("penpot_workspace.png")} style={{ width: "100%", height: 1056, objectFit: "cover", objectPosition: "center top" }} />
      </div>
    </AbsoluteFill>
  );
};

const Beat4Decor: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(4);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const promptSp = spring({ frame: (p - 0.1) * FPS, fps: FPS, config: { damping: 14, stiffness: 220 } });
  const imgSp = spring({ frame: (p - 1.3) * FPS, fps: FPS, config: { damping: 13, stiffness: 200 } });
  const checkSp = spring({ frame: (p - 5.5) * FPS, fps: FPS, config: { damping: 14, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={250} fontSize={36} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PROMPT 1 / 2</text>

      {/* User prompt bubble */}
      <g transform={`translate(${W / 2}, 380)`} opacity={promptSp}>
        <rect x={-460} y={-60} width={920} height={120} rx={24} fill={INK} stroke={INK} strokeWidth={3.5} />
        <text x={-420} y={-15} fontSize={26} fill="#9AA0A6" fontFamily="'JetBrains Mono', monospace">$ claude</text>
        <text x={-420} y={26} fontSize={32} fill="#FFEB3B" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"vẽ landing page cho công ty phần mềm"</text>
      </g>

      {/* REAL badge — placed in gap between prompt bubble (ends 440) and screenshot (starts 510) */}
      <g transform="translate(880, 475)" opacity={imgSp}>
        <rect x={-110} y={-22} width={220} height={44} rx={22} fill={RED} stroke={INK} strokeWidth={3} />
        <circle cx={-82} cy={0} r={6} fill="#FFF">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <text x={8} y={6} fontSize={18} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>REAL · PENPOT</text>
      </g>

      {/* Bottom checks — gap from screenshot bottom (510+1100=1610) */}
      <g transform={`translate(${W / 2}, 1700)`} opacity={checkSp}>
        <rect x={-460} y={-40} width={920} height={80} rx={40} fill="#FAFAF5" stroke={INK} strokeWidth={3} />
        <text x={0} y={12} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✓ Header · Hero · Code block · Logos · Footer</text>
      </g>
    </g>
  );
};

// =============== BEAT 5: DEMO PROMPT 2 — localhost:3000 ===============
const Beat5Image: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(5);
  const p = Math.max(0, t - a);
  const imgSp = spring({ frame: (p - 1.0) * FPS, fps: FPS, config: { damping: 13, stiffness: 200 } });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: (W - 920) / 2, top: 510, width: 920, height: 1000, borderRadius: 20, overflow: "hidden", border: `4px solid ${INK}`, boxShadow: "0 20px 40px rgba(0,0,0,0.3)", opacity: imgSp, transform: `scale(${0.9 + 0.1 * imgSp})` }}>
        <div style={{ height: 44, background: "#fff", display: "flex", alignItems: "center", padding: "0 18px", gap: 8, borderBottom: "1px solid #ddd" }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#FEBC2E" }} />
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#28C840" }} />
          <div style={{ flex: 1, marginLeft: 22, background: "#f3f3f3", borderRadius: 8, padding: "6px 14px", color: "#444", fontFamily: "'JetBrains Mono', monospace", fontSize: 18 }}>localhost:3000</div>
        </div>
        <Img src={staticFile("penpot_localhost_site.png")} style={{ width: "100%", height: 956, objectFit: "cover", objectPosition: "center top" }} />
      </div>
    </AbsoluteFill>
  );
};

const Beat5Decor: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(5);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const promptSp = spring({ frame: (p - 0.1) * FPS, fps: FPS, config: { damping: 14, stiffness: 220 } });
  const imgSp = spring({ frame: (p - 1.0) * FPS, fps: FPS, config: { damping: 13, stiffness: 200 } });
  const stampSp = spring({ frame: (p - 5.0) * FPS, fps: FPS, config: { damping: 9, stiffness: 200 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={250} fontSize={36} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PROMPT 2 / 2</text>

      {/* prompt bubble */}
      <g transform={`translate(${W / 2}, 380)`} opacity={promptSp}>
        <rect x={-460} y={-60} width={920} height={120} rx={24} fill={INK} stroke={INK} strokeWidth={3.5} />
        <text x={-420} y={-15} fontSize={26} fill="#9AA0A6" fontFamily="'JetBrains Mono', monospace">$ claude</text>
        <text x={-420} y={26} fontSize={32} fill="#FFEB3B" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"clone trang này thành Next.js"</text>
      </g>

      {/* REAL badge — placed in gap between prompt bubble (ends 440) and screenshot (starts 510) */}
      <g transform="translate(880, 475)" opacity={imgSp}>
        <rect x={-130} y={-22} width={260} height={44} rx={22} fill={GREEN} stroke={INK} strokeWidth={3} />
        <circle cx={-104} cy={0} r={6} fill="#FFF">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <text x={16} y={6} fontSize={18} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>REAL · NEXT.JS</text>
      </g>

      {/* 0 PIXEL · 0 LINE OF CODE */}
      <g transform={`translate(${W / 2}, 1620) scale(${stampSp})`} opacity={stampSp}>
        <rect x={-440} y={-60} width={880} height={120} rx={20} fill={RED} stroke={INK} strokeWidth={4} transform="rotate(-3 0 0)" />
        <text x={0} y={5} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} transform="rotate(-3 0 0)">0 PIXEL · 0 DÒNG CODE</text>
        <text x={0} y={48} fontSize={22} fill="#FFD2B8" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} transform="rotate(-3 0 0)">tay không động vào</text>
      </g>
    </g>
  );
};

// =============== BEAT 6: MULTI-DIRECTION · 4-way arrows ===============
const Beat6: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(6);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const centerSp = spring({ frame: (p - 0.2) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  const items = [
    { dx: 0, dy: -360, color: BLUE, label: "CODE", emoji: "💻" },
    { dx: 360, dy: 0, color: ACCENT, label: "DESIGN", emoji: "🎨" },
    { dx: 0, dy: 360, color: GREEN, label: "DOCS", emoji: "📄" },
    { dx: -360, dy: 0, color: PURPLE, label: "COMPONENT", emoji: "🧩" },
  ];

  return (
    <g opacity={op}>
      <text x={W / 2} y={250} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>4 CHIỀU · 1 SERVER</text>

      {/* arrows from center */}
      {items.map((it, i) => {
        const sp = spring({ frame: (p - 0.6 - i * 0.2) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
        const x = W / 2 + it.dx * sp;
        const y = 1000 + it.dy * sp;
        return (
          <g key={i}>
            {/* line from center to node */}
            <line x1={W / 2} y1={1000} x2={x} y2={y} stroke={it.color} strokeWidth={6} strokeDasharray="14,10" opacity={sp} />
            {/* arrows both ways */}
            {sp > 0.5 && (
              <>
                <text x={W / 2 + it.dx * 0.5} y={1000 + it.dy * 0.5 + 12} fontSize={42} fill={it.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>↔</text>
              </>
            )}
            {/* node circle */}
            <g transform={`translate(${x}, ${y}) scale(${sp})`}>
              <circle r={120} fill={it.color} stroke={INK} strokeWidth={4} filter="drop-shadow(0 8px 16px rgba(0,0,0,0.25))" />
              <text x={0} y={-10} fontSize={70} textAnchor="middle">{it.emoji}</text>
              <text x={0} y={60} fontSize={28} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{it.label}</text>
            </g>
          </g>
        );
      })}

      {/* center MCP node */}
      <g transform={`translate(${W / 2}, 1000) scale(${centerSp})`}>
        <circle r={140} fill={INK} stroke={GOLD} strokeWidth={5} filter="drop-shadow(0 10px 22px rgba(229,165,59,0.5))" />
        <text x={0} y={-10} fontSize={56} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>MCP</text>
        <text x={0} y={40} fontSize={24} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>1 server</text>
      </g>

      <text x={W / 2} y={1620} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đi mọi hướng. Qua 1 lệnh.</text>
    </g>
  );
};

// =============== BEAT 7: VERDICT · score 9.5/10 ===============
const Beat7: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(7);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const scoreSp = spring({ frame: (p - 0.2) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  const cardsSp = spring({ frame: (p - 1.5) * FPS, fps: FPS, config: { damping: 14, stiffness: 220 } });
  const verdSp = spring({ frame: (p - 4.5) * FPS, fps: FPS, config: { damping: 14, stiffness: 220 } });

  const cards = [
    { emo: "💵", title: "$5", sub: "/tháng VPS", color: GREEN },
    { emo: "👥", title: "∞", sub: "user · dev seat", color: BLUE },
    { emo: "⚡", title: "MỌI", sub: "AI agent", color: ACCENT },
  ];
  return (
    <g opacity={op}>
      <text x={W / 2} y={260} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ĐIỂM CHỐT HẠ</text>

      {/* Big score 9.5/10 */}
      <g transform={`translate(${W / 2}, 600) scale(${scoreSp})`}>
        <text x={-130} y={0} fontSize={320} fill={GOLD} textAnchor="middle" dominantBaseline="middle" fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic"
          style={{ filter: "drop-shadow(0 12px 28px rgba(229,165,59,0.5))" }}>9.5</text>
        <text x={210} y={28} fontSize={120} fill={INK} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>/10</text>
      </g>

      {/* 3 cards */}
      <g transform={`translate(${W / 2}, 1080)`} opacity={cardsSp}>
        {cards.map((c, i) => (
          <g key={i} transform={`translate(${-340 + i * 340}, 0)`}>
            <rect x={-150} y={-130} width={300} height={260} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={3.5}
              filter="drop-shadow(0 8px 16px rgba(0,0,0,0.18))" />
            <rect x={-150} y={-130} width={300} height={14} rx={4} fill={c.color} />
            <text x={0} y={-30} fontSize={80} textAnchor="middle">{c.emo}</text>
            <text x={0} y={48} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{c.title}</text>
            <text x={0} y={92} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{c.sub}</text>
          </g>
        ))}
      </g>

      {/* Verdict line */}
      <g transform={`translate(${W / 2}, 1500)`} opacity={verdSp}>
        <rect x={-460} y={-50} width={920} height={100} rx={50} fill={INK} stroke={INK} strokeWidth={4} />
        <text x={0} y={14} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>DESIGN + CODE 2026 NÊN HOẠT ĐỘNG NHƯ NÀY</text>
      </g>
    </g>
  );
};

// =============== BEAT 8: CTA ===============
const Beat8: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(8);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
  const urlSp = spring({ frame: (p - 0.1) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  const cmdSp = spring({ frame: (p - 1.0) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
  const freeSp = spring({ frame: (p - 2.0) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  const followSp = spring({ frame: (p - 3.5) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BẮT ĐẦU NGAY</text>

      {/* URL big */}
      <g transform={`translate(${W / 2}, 600) scale(${urlSp})`}>
        <rect x={-440} y={-100} width={880} height={200} rx={24} fill={INK} stroke={GOLD} strokeWidth={4} />
        <text x={0} y={-15} fontSize={28} fill="#9AA0A6" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">📦 download</text>
        <text x={0} y={50} fontSize={84} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>penpot.app</text>
      </g>

      {/* Terminal command */}
      <g transform={`translate(${W / 2}, 950)`} opacity={cmdSp}>
        <rect x={-460} y={-90} width={920} height={180} rx={20} fill="#0B0B12" stroke={INK} strokeWidth={3.5} />
        <circle cx={-430} cy={-58} r={9} fill="#FF5F57" />
        <circle cx={-405} cy={-58} r={9} fill="#FEBC2E" />
        <circle cx={-380} cy={-58} r={9} fill="#28C840" />
        <text x={-340} y={-55} fontSize={20} fill="#888" fontFamily="'JetBrains Mono', monospace">terminal</text>
        <text x={-420} y={20} fontSize={26} fill={GREEN} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>$ claude mcp add penpot \</text>
        <text x={-420} y={56} fontSize={26} fill={GOLD} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>    -t http localhost:4401/mcp</text>
      </g>

      {/* Free vĩnh viễn — bigger, more dominant since this is the closer */}
      <g transform={`translate(${W / 2}, 1230) scale(${freeSp})`} opacity={freeSp}>
        <rect x={-440} y={-90} width={880} height={180} rx={28} fill={GREEN} stroke={INK} strokeWidth={5}
          filter="drop-shadow(0 12px 26px rgba(63,168,90,0.45))" />
        <text x={0} y={-22} fontSize={32} fill="#E8F5EA" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>$0</text>
        <text x={0} y={42} fontSize={56} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FREE VĨNH VIỄN</text>
      </g>

      {/* Follow CTA */}
      <g transform={`translate(${W / 2}, 1500)`} opacity={followSp}>
        <rect x={-460} y={-100} width={920} height={200} rx={28} fill={INK} stroke={ACCENT} strokeWidth={5}
          filter="drop-shadow(0 10px 22px rgba(232,88,56,0.4))" />
        <text x={0} y={-32} fontSize={48} textAnchor="middle">👤</text>
        <text x={0} y={20} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FOLLOW</text>
        <text x={0} y={70} fontSize={26} fill="#E8E8E8" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mỗi tuần 1 tool open source ngon</text>
      </g>
    </g>
  );
};

export const PenpotMcpDesign: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  let activeBeat = 1;
  for (let i = beats.length - 1; i >= 0; i--) {
    if (t >= beats[i].start) { activeBeat = beats[i].index; break; }
  }

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Bg />
      <Audio src={staticFile("penpot_voice.mp3")} />

      {/* Image layer (HTML) for screenshot beats — rendered behind SVG decor */}
      {activeBeat === 4 && <Beat4Image t={t} />}
      {activeBeat === 5 && <Beat5Image t={t} />}

      {/* SVG decoration layer */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <SourceBadge />
        {activeBeat === 1 && <Beat1 t={t} />}
        {activeBeat === 2 && <Beat2 t={t} />}
        {activeBeat === 3 && <Beat3 t={t} />}
        {activeBeat === 4 && <Beat4Decor t={t} />}
        {activeBeat === 5 && <Beat5Decor t={t} />}
        {activeBeat === 6 && <Beat6 t={t} />}
        {activeBeat === 7 && <Beat7 t={t} />}
        {activeBeat === 8 && <Beat8 t={t} />}
      </svg>
      <Caption />
    </AbsoluteFill>
  );
};
