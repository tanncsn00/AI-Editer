import {
  AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import wordsData from "./ggai_lab_vn_words.json";
import beatsData from "./ggai_lab_vn_beats.json";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";
const IVORY = "#F5F5F0";
const RED = "#D03020";
const NAVY = "#1E3A8A";
const GREEN = "#1B7A4D";
const SOFT = "#FAFAF5";

type Word = { word: string; start: number; end: number; beat: number };
const words = wordsData as Word[];
type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const B = (i: number) => { const b = beats[i - 1]; return [b.start, b.start + b.duration] as const; };

const mouthOpenAt = (t: number): number => {
  for (const w of words) {
    if (t >= w.start && t <= w.end) {
      const p = (t - w.start) / (w.end - w.start);
      return Math.sin(p * Math.PI);
    }
  }
  return 0;
};

// =============== Background ===============
const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="ggLabPN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="ggLabVig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#ggLabPN)" />
    <rect width={W} height={H} fill="url(#ggLabVig)" />
  </svg>
);

// =============== Newsroom-style breaking ticker (top) ===============
const NewsTicker: React.FC<{ visible?: boolean }> = ({ visible = true }) => {
  const frame = useCurrentFrame();
  const pulse = visible ? Math.sin(frame / 8) * 0.15 + 0.85 : 0;
  return (
    <g opacity={pulse} transform="translate(40, 60)">
      <rect x={0} y={0} width={260} height={56} rx={8} fill={RED} stroke={INK} strokeWidth={3} />
      <circle cx={28} cy={28} r={8} fill="#FFF" />
      <text x={50} y={37} fontSize={26} fill="#FFF" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        TIN NÓNG · AI
      </text>
    </g>
  );
};

const DateStamp: React.FC = () => (
  <g transform={`translate(${W - 280}, 60)`}>
    <rect x={0} y={0} width={240} height={56} rx={8} fill={INK} stroke={INK} strokeWidth={2} />
    <text x={120} y={37} fontSize={22} fill={IVORY} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">
      13 · 05 · 2026
    </text>
  </g>
);

// =============== Teacher (người que) — accent only on LEAD/OUTLOOK/SIGN_OFF ===============
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

// =============== Caption (sentence-based reveal — copy from ImLangFull.tsx pattern) ===============
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
    if (/,$/.test(w.word) && buf.length >= 8) { flush(); }
  }
  flush();
  return out;
})();

const EMPH = new Set<string>([
  "GOOGLE", "LAB", "AI", "VIỆT", "NAM", "VN", "SG", "TQ",
  "TIN", "NÓNG", "LẦN", "ĐẦU", "TIÊN",
  "CỐT", "LÕI", "CORE", "ÁP", "DỤNG",
  "5-10", "50", "1000+",
  "COST", "ENGLISH", "GEOPOLITICAL",
  "ĐÁNG", "VUI", "CƠ", "HỘI", "LỚN",
  "KHOẢNG", "CÁCH", "NHIỀU", "VIỆC", "PHẢI", "LÀM",
  "GEMINI", "DEEPMIND", "BRAIN", "RESEARCH",
  "VNG", "ĐHQG-HCM", "TP.HCM",
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
              textShadow: emph ? "0 0 26px rgba(229,165,59,0.55), 0 4px 14px rgba(0,0,0,0.95)" : "0 3px 12px rgba(0,0,0,0.95)",
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

// =============== Brand card helper ===============
const BrandCard: React.FC<{ x: number; y: number; w: number; h: number; bg: string; text: string; sub: string; color?: string }> =
  ({ x, y, w, h, bg, text, sub, color = "#FFF" }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x={0} y={0} width={w} height={h} rx={16} fill={bg} stroke={INK} strokeWidth={3.5} />
    <text x={w/2} y={h/2 - 8} fontSize={36} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{text}</text>
    <text x={w/2} y={h/2 + 30} fontSize={20} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.85}>{sub}</text>
  </g>
);

const Sticker: React.FC<{ x: number; y: number; text: string; color: string; rot?: number; w?: number; fs?: number }> = ({ x, y, text, color, rot = 0, w = 360, fs = 22 }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
    <rect x={-w/2} y={-32} width={w} height={64} rx={32} fill={color} stroke={INK} strokeWidth={3} />
    <text x={0} y={9} fontSize={fs} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">{text}</text>
  </g>
);

// =============== BEAT 1 — LEAD ===============
const Beat1: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(1);
  const p = Math.max(0, t - a);
  const sp = spring({ frame: (p) * FPS, fps: FPS, config: { damping: 14, stiffness: 130 } });
  return (
    <g>
      <NewsTicker />
      <DateStamp />
      <g transform={`translate(${W/2}, 480)`} opacity={interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" })}>
        <text x={0} y={-90} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
          BẢN TIN CÔNG NGHỆ
        </text>
        <text x={0} y={20} fontSize={88} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
          GOOGLE
        </text>
        <text x={0} y={110} fontSize={64} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
          đặt
        </text>
        <text x={0} y={210} fontSize={92} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-1">
          AI LAB
        </text>
        <text x={0} y={300} fontSize={62} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
          tại <tspan fill={ACCENT} fontWeight={800}>VIỆT NAM</tspan>
        </text>
      </g>
      {p > 2.5 && (
        <g opacity={interpolate(p, [2.5, 3], [0, 1], { extrapolateRight: "clamp" })} transform={`translate(${W/2}, 950)`}>
          <rect x={-380} y={-50} width={760} height={100} rx={20} fill={SOFT} stroke={INK} strokeWidth={3.5} />
          <text x={0} y={12} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Bước đi LỚN trong chiến lược châu Á
          </text>
        </g>
      )}
      {p > 5 && <Sticker x={W/2} y={1180} text="ĐỘC QUYỀN · CÔNG BỐ 05/2026" color={RED} rot={-2} w={620} fs={24} />}
      <g transform={`translate(900, 1540) scale(1.5)`}>
        <Teacher mouthOpen={mo} waving />
      </g>
    </g>
  );
};

// =============== BEAT 2 — CONTEXT ===============
const Beat2: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(2);
  const p = Math.max(0, t - a);
  return (
    <g>
      <NewsTicker />
      <DateStamp />
      <text x={W/2} y={210} fontSize={48} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        ÁP DỤNG AI LAB · TP.HCM
      </text>
      {/* 3 brand cards horizontal */}
      <g transform="translate(0, 360)">
        {[
          { text: "GOOGLE", sub: "Labs", bg: NAVY, at: 0.5 },
          { text: "VNG", sub: "Việt Nam", bg: "#0066B3", at: 1.5 },
          { text: "ĐHQG-HCM", sub: "VNUHCM", bg: ACCENT, at: 2.5 },
        ].map((b, i) => {
          const show = p > b.at;
          return show ? (
            <g key={i} opacity={interpolate(p, [b.at, b.at + 0.4], [0, 1], { extrapolateRight: "clamp" })}
               transform={`translate(${60 + i * 330}, 0)`}>
              <BrandCard x={0} y={0} w={300} h={200} bg={b.bg} text={b.text} sub={b.sub} />
              {i < 2 && (
                <text x={310} y={120} fontSize={64} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.6}>×</text>
              )}
            </g>
          ) : null;
        })}
      </g>
      {p > 4 && (
        <g opacity={interpolate(p, [4, 4.5], [0, 1], { extrapolateRight: "clamp" })} transform={`translate(${W/2}, 760)`}>
          <rect x={-440} y={-50} width={880} height={130} rx={20} fill={SOFT} stroke={INK} strokeWidth={3.5} />
          <text x={0} y={-5} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Ký kết thành lập
          </text>
          <text x={0} y={45} fontSize={42} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            APPLIED AI LAB
          </text>
        </g>
      )}
      {p > 7 && <Sticker x={W/2} y={1020} text="LẦN ĐẦU GOOGLE R&D AI SÂU TẠI VN" color={GREEN} rot={-2} w={720} fs={26} />}
      {p > 10 && (
        <g opacity={interpolate(p, [10, 10.5], [0, 1], { extrapolateRight: "clamp" })} transform={`translate(${W/2}, 1180)`}>
          <text x={0} y={0} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={0.7}>
            🗓 05/2026 · TP.HCM
          </text>
        </g>
      )}
      <g transform={`translate(900, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 3 — ROLE ===============
const Beat3: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(3);
  const p = Math.max(0, t - a);
  const roles = [
    { icon: "⚙️", title: "Tối ưu GEMINI", sub: "cho thị trường VN + SEA", at: 0.5 },
    { icon: "🇻🇳", title: "Xử lý TIẾNG VIỆT", sub: "+ ngôn ngữ khu vực", at: 3 },
    { icon: "💼", title: "Giảm CHI PHÍ", sub: "triển khai cho DN địa phương", at: 5.5 },
  ];
  return (
    <g>
      <NewsTicker />
      <DateStamp />
      <text x={W/2} y={210} fontSize={50} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        LAB SẼ LÀM GÌ?
      </text>
      <g transform="translate(0, 340)">
        {roles.map((r, i) => {
          const show = p > r.at;
          return show ? (
            <g key={i} opacity={interpolate(p, [r.at, r.at + 0.5], [0, 1], { extrapolateRight: "clamp" })}
               transform={`translate(${W/2 - 440}, ${i * 230})`}>
              <rect x={0} y={0} width={880} height={200} rx={20} fill={SOFT} stroke={INK} strokeWidth={3.5} />
              <rect x={0} y={0} width={140} height={200} rx={20} fill={[NAVY, RED, GREEN][i]} stroke={INK} strokeWidth={3.5} />
              <text x={70} y={130} fontSize={70} textAnchor="middle">{r.icon}</text>
              <text x={170} y={90} fontSize={40} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.title}</text>
              <text x={170} y={140} fontSize={26} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.75}>{r.sub}</text>
            </g>
          ) : null;
        })}
      </g>
      <g transform={`translate(900, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 4 — DATA (bar chart) ===============
const Beat4: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(4);
  const p = Math.max(0, t - a);
  const data = [
    { flag: "🇻🇳", name: "VIỆT NAM", value: 8, label: "~5-10", color: RED, at: 1, max: 80 },
    { flag: "🇸🇬", name: "SINGAPORE", value: 50, label: "~50", color: "#E03030", at: 3, max: 250 },
    { flag: "🇨🇳", name: "TRUNG QUỐC", value: 1000, label: "1000+", color: "#D60000", at: 5, max: 800 },
  ];
  const maxBar = 800; // largest visual width
  return (
    <g>
      <NewsTicker />
      <DateStamp />
      <text x={W/2} y={210} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
        RESEARCHER AI TIER-1
      </text>
      <text x={W/2} y={260} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.7}>
        (xuất bản tại hội nghị quốc tế hàng đầu)
      </text>
      <g transform="translate(80, 360)">
        {data.map((d, i) => {
          const show = p > d.at;
          const growProgress = show ? Math.min(1, (p - d.at) / 0.8) : 0;
          const barW = d.max * growProgress;
          return (
            <g key={i} transform={`translate(0, ${i * 240})`}>
              {/* Label row */}
              <text x={0} y={42} fontSize={50}>{d.flag}</text>
              <text x={80} y={42} fontSize={32} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{d.name}</text>
              {show && (
                <text x={920} y={42} fontSize={36} fill={d.color} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={800}
                  opacity={interpolate(p, [d.at, d.at + 0.4], [0, 1], { extrapolateRight: "clamp" })}>
                  {d.label}
                </text>
              )}
              {/* Bar */}
              <rect x={0} y={70} width={920} height={70} rx={8} fill={SOFT} stroke={INK} strokeWidth={3} />
              <rect x={0} y={70} width={barW} height={70} rx={8} fill={d.color} stroke={INK} strokeWidth={3} />
              {/* Stripes */}
              <defs>
                <pattern id={`stripe-${i}`} width={20} height={20} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1={0} y1={0} x2={0} y2={20} stroke="rgba(255,255,255,0.18)" strokeWidth={10} />
                </pattern>
              </defs>
              <rect x={0} y={70} width={barW} height={70} rx={8} fill={`url(#stripe-${i})`} />
            </g>
          );
        })}
      </g>
      {p > 9 && (
        <g opacity={interpolate(p, [9, 9.5], [0, 1], { extrapolateRight: "clamp" })}>
          <Sticker x={W/2} y={1180} text="⚠ KHOẢNG CÁCH RẤT LỚN" color={RED} rot={-2} w={520} fs={26} />
        </g>
      )}
      <g transform={`translate(900, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 5 — ANALYSIS (3 reasons) ===============
const Beat5: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(5);
  const p = Math.max(0, t - a);
  const reasons = [
    { icon: "💰", title: "COST", sub: "Kỹ sư = 1/3 SG", color: GOLD, at: 2 },
    { icon: "🌐", title: "ENGLISH", sub: "Proficiency tốt", color: NAVY, at: 5 },
    { icon: "⚖️", title: "GEOPOLITICAL", sub: "Trung lập US-CN", color: GREEN, at: 8 },
  ];
  return (
    <g>
      <NewsTicker />
      <DateStamp />
      <text x={W/2} y={210} fontSize={48} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        VÌ SAO CHỌN VN?
      </text>
      <text x={W/2} y={260} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.7}>
        Theo phân tích chuyên gia · 3 yếu tố chính
      </text>
      <g transform="translate(0, 370)">
        {reasons.map((r, i) => {
          const show = p > r.at;
          return show ? (
            <g key={i} opacity={interpolate(p, [r.at, r.at + 0.5], [0, 1], { extrapolateRight: "clamp" })}
               transform={`translate(${W/2 - 440}, ${i * 230})`}>
              <rect x={0} y={0} width={880} height={200} rx={20} fill={SOFT} stroke={INK} strokeWidth={3.5} />
              <circle cx={110} cy={100} r={75} fill={r.color} stroke={INK} strokeWidth={3.5} />
              <text x={110} y={120} fontSize={70} textAnchor="middle">{r.icon}</text>
              <text x={220} y={90} fontSize={48} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">{r.title}</text>
              <text x={220} y={150} fontSize={28} fill={r.color} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.sub}</text>
              {/* Big number on right */}
              <text x={830} y={130} fontSize={80} fill={r.color} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.25}>
                {String(i + 1).padStart(2, "0")}
              </text>
            </g>
          ) : null;
        })}
      </g>
      <g transform={`translate(900, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 6 — COMPARE SG vs VN ===============
const Beat6: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(6);
  const p = Math.max(0, t - a);
  const cards = [
    { flag: "🇸🇬", title: "Google Research SG", sub: "Trung tâm CORE research khu vực", tag: "HEAVY RESEARCH", color: "#E03030", at: 0.5 },
    { flag: "🇻🇳", title: "VN Applied Lab", sub: "Cầu nối research ↔ ứng dụng", tag: "BRIDGE", color: GREEN, at: 3.5 },
  ];
  return (
    <g>
      <NewsTicker />
      <DateStamp />
      <text x={W/2} y={210} fontSize={48} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        SO SÁNH KHU VỰC
      </text>
      <g transform="translate(0, 320)">
        {cards.map((c, i) => {
          const show = p > c.at;
          return show ? (
            <g key={i} opacity={interpolate(p, [c.at, c.at + 0.5], [0, 1], { extrapolateRight: "clamp" })}
               transform={`translate(${W/2 - 440}, ${i * 380})`}>
              <rect x={0} y={0} width={880} height={340} rx={20} fill={SOFT} stroke={INK} strokeWidth={3.5} />
              <rect x={0} y={0} width={880} height={70} rx={20} fill={c.color} />
              <rect x={0} y={50} width={880} height={20} fill={c.color} />
              <text x={40} y={48} fontSize={36}>{c.flag}</text>
              <text x={100} y={48} fontSize={24} fill="#FFF" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">{c.tag}</text>
              <text x={440} y={150} fontSize={40} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{c.title}</text>
              <text x={440} y={210} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.8}>{c.sub}</text>
              <text x={440} y={290} fontSize={50} textAnchor="middle">{i === 0 ? "🔬" : "🌉"}</text>
            </g>
          ) : null;
        })}
      </g>
      {p > 7 && (
        <g opacity={interpolate(p, [7, 7.5], [0, 1], { extrapolateRight: "clamp" })} transform={`translate(${W/2}, 1180)`}>
          <text x={0} y={0} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>
            Định hướng KHÁC NHAU rõ rệt
          </text>
        </g>
      )}
      <g transform={`translate(900, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};

// =============== BEAT 7 — OUTLOOK ===============
const Beat7: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(7);
  const p = Math.max(0, t - a);
  return (
    <g>
      <NewsTicker />
      <DateStamp />
      <text x={W/2} y={210} fontSize={48} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        NHẬN ĐỊNH
      </text>
      {/* Positive section */}
      <g transform={`translate(${W/2}, 380)`}>
        {p > 0.5 && (
          <g opacity={interpolate(p, [0.5, 1], [0, 1], { extrapolateRight: "clamp" })}>
            <rect x={-440} y={-40} width={880} height={100} rx={20} fill={GREEN} stroke={INK} strokeWidth={3.5} />
            <text x={0} y={22} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
              ✓ ĐÁNG VUI? CÓ.
            </text>
          </g>
        )}
        {p > 3 && (
          <g opacity={interpolate(p, [3, 3.5], [0, 1], { extrapolateRight: "clamp" })} transform="translate(0, 130)">
            <rect x={-440} y={-40} width={880} height={100} rx={20} fill={GREEN} stroke={INK} strokeWidth={3.5} />
            <text x={0} y={22} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
              ✓ CƠ HỘI? LỚN.
            </text>
          </g>
        )}
      </g>
      {/* Caveat */}
      {p > 6.5 && (
        <g transform={`translate(${W/2}, 820)`} opacity={interpolate(p, [6.5, 7], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.8}>
            NHƯNG —
          </text>
        </g>
      )}
      {p > 8 && (
        <g transform={`translate(${W/2}, 920)`} opacity={interpolate(p, [8, 8.5], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={-460} y={-50} width={920} height={120} rx={20} fill={RED} stroke={INK} strokeWidth={3.5} />
          <text x={0} y={-5} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Còn KHOẢNG CÁCH LỚN với
          </text>
          <text x={0} y={42} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            🇺🇸 MỸ · 🇨🇳 TRUNG QUỐC trong AI core
          </text>
        </g>
      )}
      {p > 11 && (
        <g transform={`translate(${W/2}, 1180)`} opacity={interpolate(p, [11, 11.5], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={44} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
            CÒN NHIỀU VIỆC PHẢI LÀM
          </text>
        </g>
      )}
      <g transform={`translate(900, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} thumbs />
      </g>
    </g>
  );
};

// =============== BEAT 8 — SIGN-OFF ===============
const Beat8: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(8);
  const p = Math.max(0, t - a);
  const pulse = Math.sin(p * 4) * 0.05 + 1;
  return (
    <g>
      <NewsTicker />
      <DateStamp />
      <text x={W/2} y={240} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
        CẬP NHẬT TIN AI
      </text>
      <text x={W/2} y={300} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.7}>
        hằng ngày — không bỏ lỡ
      </text>
      <g transform={`translate(${W/2}, 700) scale(${pulse})`} opacity={interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" })}>
        <rect x={-400} y={-150} width={800} height={300} rx={30} fill={RED} stroke={INK} strokeWidth={5} />
        <text x={0} y={-30} fontSize={90} textAnchor="middle">📡</text>
        <text x={0} y={60} fontSize={70} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="4">
          FOLLOW
        </text>
        <text x={0} y={115} fontSize={24} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.9}>
          Tin AI THẲNG · không tô vẽ
        </text>
      </g>
      {p > 3 && (
        <g opacity={interpolate(p, [3, 3.5], [0, 1], { extrapolateRight: "clamp" })} transform={`translate(${W/2}, 1180)`}>
          <text x={0} y={0} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={0.7}>
            🎙 MC Tin Tức · Voice Studio
          </text>
        </g>
      )}
      <g transform={`translate(900, 1540) scale(1.5)`}>
        <Teacher mouthOpen={mo} waving />
      </g>
    </g>
  );
};

// =============== Main composition ===============
export const GoogleAiLabVnNews: React.FC = () => {
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
      <Audio src={staticFile("ggai_lab_vn/voice.mp3")} />
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
