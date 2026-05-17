import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import wordsData from "./cloudflare_words.json";
import beatsData from "./cloudflare_beats.json";

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
const ORANGE = "#F78C40"; // Cloudflare brand orange-ish

type Word = { word: string; start: number; end: number; beat: number };
const words = wordsData as Word[];
type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const B = (i: number) => { const b = beats[i - 1]; return [b.start, b.start + b.duration] as const; };

const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="cfPN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="55" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="cfVig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.45" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#cfPN)" />
    <rect width={W} height={H} fill="url(#cfVig)" />
  </svg>
);

const SourceBadge: React.FC = () => (
  <g transform="translate(880, 90)">
    <rect x={-160} y={-30} width={320} height={60} rx={30} fill="#FAFAF5" stroke={ACCENT} strokeWidth={3.5} />
    <text x={0} y={9} fontSize={20} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TIN AI · 09/05/2026</text>
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
    if (/[.!?]$/.test(w.word)) { flush(); continue; }
    if (/[,—:·]$/.test(w.word) && buf.length >= 4) { flush(); continue; }
    if (buf.length >= 6) flush();
  }
  flush();
  return out;
})();

const EMPH = new Set<string>([
  "1.100", "1100", "MỘT", "NGHÌN", "TRĂM", "KỶ", "LỤC.", "LỤC",
  "20%", "$640M", "34%", "100×", "100x", "600%", "-18%", "$62M",
  "engineering", "marketing", "support", "ops.", "ops", "sales",
  "CEO", "Matthew", "Prince:", "agentic", "AI.", "AI",
  "world-class", "world-class.", "kỷ", "lục", "lục.",
  "Meta", "Microsoft", "Cloudflare.", "Cloudflare",
  "engineer", "engineer.", "HỢP", "ĐỒNG.",
  "Job", "mày", "an", "toàn",
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
    if (t >= s.start - 0.15 && t < boundary) { active = s; break; }
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
  const numSp = spring({ frame: (p - 0.1) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  const recordSp = spring({ frame: (p - 1.4) * FPS, fps: FPS, config: { damping: 12, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>SA THẢI HÀNG LOẠT</text>

      {/* Big 1.100 */}
      <g transform={`translate(${W / 2}, 680) scale(${numSp})`}>
        <text x={0} y={0} fontSize={340} fill={RED} textAnchor="middle" dominantBaseline="middle"
          fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic"
          style={{ filter: "drop-shadow(0 14px 32px rgba(208,48,32,0.5))" }}>1.100</text>
        <text x={0} y={200} fontSize={54} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nhân viên · qua 1 email</text>
      </g>

      {/* Contrast pill */}
      <g transform={`translate(${W / 2}, 1180) scale(${recordSp})`} opacity={recordSp}>
        <rect x={-440} y={-70} width={880} height={140} rx={28} fill={INK} stroke={INK} strokeWidth={4} />
        <text x={0} y={-15} fontSize={28} fill="#9AA0A6" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cùng ngày — báo cáo Q1</text>
        <text x={0} y={42} fontSize={48} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>DOANH THU LẬP KỶ LỤC ✓</text>
      </g>

      {/* Bottom fact */}
      <g transform={`translate(${W / 2}, 1400)`} opacity={recordSp}>
        <text x={0} y={0} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Cloudflare · 08/05/2026</text>
      </g>
    </g>
  );
};

// =============== BEAT 2: NUMBERS — 20% / $640M / +34% ===============
const Beat2: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(2);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const stats = [
    { val: "20%", label: "nhân sự bốc hơi", color: RED, big: 90 },
    { val: "$640M", label: "Q1 revenue", color: GREEN, big: 78 },
    { val: "+34%", label: "tăng YoY", color: GREEN, big: 90 },
  ];
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CON SỐ KÉO TỪ Q1</text>

      {stats.map((s, i) => {
        const sp = spring({ frame: (p - 0.3 - i * 0.4) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
        const y = 530 + i * 280;
        return (
          <g key={i} transform={`translate(${W / 2}, ${y}) scale(${sp})`} opacity={sp}>
            <rect x={-440} y={-110} width={880} height={220} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={3.5}
              filter="drop-shadow(0 10px 20px rgba(0,0,0,0.18))" />
            <rect x={-440} y={-110} width={14} height={220} rx={4} fill={s.color} />
            <text x={-200} y={14} fontSize={s.big} fill={s.color} textAnchor="middle" dominantBaseline="middle"
              fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic">{s.val}</text>
            <text x={180} y={14} fontSize={32} fill={INK} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{s.label}</text>
          </g>
        );
      })}

      <text x={W / 2} y={1500} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>5.500 → 4.400 nhân viên</text>
    </g>
  );
};

// =============== BEAT 3: WHO — Departments ===============
const Beat3: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(3);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const cuts = ["engineering", "marketing", "support", "ops"];
  const survivor = "sales · có quota";
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AI THAY ĐƯỢC AI?</text>

      {cuts.map((dept, i) => {
        const sp = spring({ frame: (p - 0.2 - i * 0.25) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
        const y = 460 + i * 130;
        return (
          <g key={i} transform={`translate(${W / 2}, ${y})`} opacity={sp}>
            <rect x={-440} y={-50} width={880} height={100} rx={20} fill={RED} stroke={INK} strokeWidth={3.5} />
            <text x={-380} y={14} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>×</text>
            <text x={20} y={14} fontSize={38} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{dept}</text>
          </g>
        );
      })}

      {/* Survivor: sales */}
      {(() => {
        const sp = spring({ frame: (p - 1.6) * FPS, fps: FPS, config: { damping: 12, stiffness: 220 } });
        return (
          <g transform={`translate(${W / 2}, 1080) scale(${sp})`} opacity={sp}>
            <rect x={-440} y={-60} width={880} height={120} rx={20} fill={GREEN} stroke={INK} strokeWidth={4} />
            <text x={-380} y={16} fontSize={48} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✓</text>
            <text x={20} y={16} fontSize={38} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{survivor}</text>
          </g>
        );
      })()}

      <text x={W / 2} y={1300} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AI thay được dev — chưa thay được sales.</text>
    </g>
  );
};

// =============== BEAT 4: CEO QUOTE ===============
const Beat4: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(4);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const memoSp = spring({ frame: (p - 0.2) * FPS, fps: FPS, config: { damping: 13, stiffness: 200 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>MEMO TỪ CEO</text>

      {/* CEO portrait pill */}
      <g transform="translate(540, 460)" opacity={memoSp}>
        <circle cx={-140} cy={0} r={50} fill={ORANGE} stroke={INK} strokeWidth={3.5} />
        <text x={-140} y={14} fontSize={50} textAnchor="middle">👤</text>
        <text x={-50} y={-8} fontSize={32} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Matthew Prince</text>
        <text x={-50} y={26} fontSize={22} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>CEO · Cloudflare</text>
      </g>

      {/* Memo card */}
      <g transform={`translate(${W / 2}, 970) scale(${memoSp})`}>
        <rect x={-460} y={-300} width={920} height={600} rx={28} fill="#FAFAF5" stroke={INK} strokeWidth={4}
          filter="drop-shadow(0 14px 28px rgba(0,0,0,0.18))" strokeDasharray="14,8" />
        <text x={-420} y={-220} fontSize={28} fill={ACCENT} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>MEMO TO STAFF</text>
        <text x={-420} y={-150} fontSize={36} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"Đây KHÔNG phải</text>
        <text x={-420} y={-100} fontSize={36} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">cắt giảm chi phí.</text>
        <text x={-420} y={-30} fontSize={36} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">Đây là cách công ty</text>
        <text x={-420} y={20} fontSize={36} fill={ACCENT} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">world-class hoạt động</text>
        <text x={-420} y={70} fontSize={36} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">trong kỷ nguyên</text>
        <text x={-420} y={120} fontSize={42} fill={ACCENT} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">agentic AI."</text>
        <text x={-420} y={220} fontSize={26} fill={INK} fontFamily="'JetBrains Mono', monospace" opacity={0.6}>— Matthew Prince · 08/05/2026</text>
      </g>
    </g>
  );
};

// =============== BEAT 5: AI NUMBERS — 100x productivity ===============
const Beat5: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(5);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const mults = [
    { x: -300, val: "2×", color: BLUE, delay: 0.2, big: false },
    { x: 0, val: "10×", color: ORANGE, delay: 0.5, big: false },
    { x: 300, val: "100×", color: RED, delay: 0.9, big: false },
  ];
  const usageSp = spring({ frame: (p - 2.5) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>LÝ DO THẬT</text>
      <text x={W / 2} y={360} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>productivity của team xài AI:</text>

      {/* 3 multipliers */}
      {mults.map((m, i) => {
        const sp = spring({ frame: (p - m.delay) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
        return (
          <g key={i} transform={`translate(${W / 2 + m.x}, 720) scale(${sp})`}>
            <circle r={130} fill={m.color} stroke={INK} strokeWidth={4}
              filter={`drop-shadow(0 10px 22px ${m.color}99)`} />
            <text x={0} y={18} fontSize={84} fill="#FFF" textAnchor="middle" dominantBaseline="middle"
              fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic">{m.val}</text>
          </g>
        );
      })}

      {/* Usage bar */}
      <g transform={`translate(${W / 2}, 1200) scale(${usageSp})`} opacity={usageSp}>
        <rect x={-440} y={-90} width={880} height={180} rx={24} fill={INK} stroke={INK} strokeWidth={4} />
        <text x={0} y={-32} fontSize={28} fill="#9AA0A6" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>AI usage nội bộ — 3 tháng qua</text>
        <text x={0} y={48} fontSize={84} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">+600% ↑</text>
      </g>

      <text x={W / 2} y={1480} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.75}>tipping point: tháng 11/2025</text>
    </g>
  );
};

// =============== BEAT 6: MARKET — Stock chart ===============
const Beat6: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(6);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const lineSp = spring({ frame: (p - 0.5) * FPS, fps: FPS, config: { damping: 14, stiffness: 200 } });
  const lossSp = spring({ frame: (p - 2.0) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PHỐ WALL TRẢ LỜI</text>

      {/* Stock chart */}
      <g transform="translate(540, 700)">
        <rect x={-440} y={-200} width={880} height={400} rx={28} fill="#FAFAF5" stroke={INK} strokeWidth={3.5}
          filter="drop-shadow(0 10px 20px rgba(0,0,0,0.18))" />
        <text x={-400} y={-150} fontSize={26} fill={INK} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>NET · NYSE</text>
        <text x={-400} y={-110} fontSize={22} fill={INK} fontFamily="'JetBrains Mono', monospace" opacity={0.6}>Cloudflare Inc.</text>

        {/* axis */}
        <line x1={-400} y1={140} x2={400} y2={140} stroke={INK} strokeWidth={2} />
        <line x1={-400} y1={140} x2={-400} y2={-50} stroke={INK} strokeWidth={2} />

        {/* Line going down */}
        <polyline
          points={`-380,-30 -250,-50 -120,-20 0,30 120,90 250,120 380,140`}
          fill="none" stroke={RED} strokeWidth={6}
          strokeDasharray="1000" strokeDashoffset={interpolate(lineSp, [0, 1], [1000, 0])}
        />
        {/* Drop arrow */}
        <text x={300} y={70} fontSize={38} fill={RED} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>↘</text>
      </g>

      {/* -18% big */}
      <g transform="translate(540, 1100)">
        <rect x={-340} y={-70} width={680} height={140} rx={28} fill={RED} stroke={INK} strokeWidth={4}
          filter="drop-shadow(0 10px 22px rgba(208,48,32,0.5))" />
        <text x={0} y={20} fontSize={84} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>−18% Stock</text>
      </g>

      {/* Net loss */}
      <g transform={`translate(${W / 2}, 1340) scale(${lossSp})`} opacity={lossSp}>
        <rect x={-380} y={-50} width={760} height={100} rx={50} fill={INK} stroke={INK} strokeWidth={3.5} />
        <text x={0} y={14} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Net loss Q1: $62M ↑</text>
      </g>
    </g>
  );
};

// =============== BEAT 7: INSIGHT — pattern Meta Microsoft Cloudflare ===============
const Beat7: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(7);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const brands = [
    { name: "Meta", color: "#0866FF", letter: "M", delay: 0.2 },
    { name: "Microsoft", color: "#00A4EF", letter: "MS", delay: 0.5 },
    { name: "Cloudflare", color: ORANGE, letter: "CF", delay: 0.8 },
  ];
  const insightSp = spring({ frame: (p - 1.8) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PATTERN MỚI</text>

      {/* 3 brand cards */}
      <g transform={`translate(${W / 2}, 600)`}>
        {brands.map((b, i) => {
          const sp = spring({ frame: (p - b.delay) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
          return (
            <g key={i} transform={`translate(${-340 + i * 340}, 0) scale(${sp})`}>
              <rect x={-120} y={-110} width={240} height={220} rx={24} fill={b.color} stroke={INK} strokeWidth={4}
                filter="drop-shadow(0 8px 18px rgba(0,0,0,0.22))" />
              <text x={0} y={-10} fontSize={88} fill="#FFF" textAnchor="middle" dominantBaseline="middle"
                fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{b.letter}</text>
              <text x={0} y={68} fontSize={26} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{b.name}</text>
            </g>
          );
        })}
      </g>

      {/* Insight equation */}
      <g transform={`translate(${W / 2}, 980)`} opacity={insightSp}>
        <rect x={-460} y={-60} width={920} height={120} rx={28} fill={INK} stroke={INK} strokeWidth={4} />
        <text x={0} y={-2} fontSize={32} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Doanh thu KỶ LỤC</text>
        <text x={0} y={42} fontSize={32} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>+ Sa thải KỶ LỤC</text>
      </g>

      {/* Punchline */}
      <g transform={`translate(${W / 2}, 1240)`} opacity={insightSp}>
        <text x={0} y={0} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AI thay engineer</text>
        <text x={0} y={56} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>chưa thay người ký HỢP ĐỒNG</text>
      </g>
    </g>
  );
};

// =============== BEAT 8: CTA ===============
const Beat8: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(8);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
  const qSp = spring({ frame: (p - 0.1) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  const followSp = spring({ frame: (p - 1.8) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CÂU HỎI CHO BẠN</text>

      {/* Big question */}
      <g transform={`translate(${W / 2}, 700) scale(${qSp})`}>
        <rect x={-460} y={-220} width={920} height={440} rx={28} fill={INK} stroke={ACCENT} strokeWidth={5}
          filter="drop-shadow(0 14px 28px rgba(232,88,56,0.5))" />
        <text x={0} y={-100} fontSize={140} textAnchor="middle">👀</text>
        <text x={0} y={20} fontSize={56} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Job mày có an toàn?</text>
        <text x={0} y={90} fontSize={36} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nếu mày là engineer?</text>
        <text x={0} y={150} fontSize={26} fill="#9AA0A6" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Comment 👇</text>
      </g>

      {/* Follow CTA */}
      <g transform={`translate(${W / 2}, 1280)`} opacity={followSp}>
        <rect x={-460} y={-100} width={920} height={200} rx={28} fill={GREEN} stroke={INK} strokeWidth={5}
          filter="drop-shadow(0 10px 22px rgba(63,168,90,0.45))" />
        <text x={0} y={-32} fontSize={48} textAnchor="middle">📣</text>
        <text x={0} y={20} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FOLLOW</text>
        <text x={0} y={70} fontSize={26} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tin AI nóng nhất mỗi ngày</text>
      </g>
    </g>
  );
};

export const CloudflareLayoff: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let activeBeat = 1;
  for (let i = beats.length - 1; i >= 0; i--) {
    if (t >= beats[i].start) { activeBeat = beats[i].index; break; }
  }
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Bg />
      <Audio src={staticFile("cloudflare_voice.mp3")} />
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
      </svg>
      <Caption />
    </AbsoluteFill>
  );
};
