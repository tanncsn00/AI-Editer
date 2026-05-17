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
import wordsData from "./khvl_words.json";
import beatsData from "./khvl_beats.json";

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

const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="khvlPN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="43" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="khvlVig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#khvlPN)" />
    <rect width={W} height={H} fill="url(#khvlVig)" />
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

// Mini stick (for chart 5 figure)
const MiniStick: React.FC<{ x: number; y: number; opacity: number; glow?: boolean }> = ({ x, y, opacity, glow = false }) => (
  <g transform={`translate(${x}, ${y})`} opacity={opacity}>
    {glow && <circle cx={0} cy={-10} r={75} fill={GOLD} opacity={0.35} />}
    <line x1={-8} y1={20} x2={-12} y2={50} stroke="#3A3850" strokeWidth={9} strokeLinecap="round" />
    <line x1={8} y1={20} x2={12} y2={50} stroke="#3A3850" strokeWidth={9} strokeLinecap="round" />
    <rect x={-15} y={-18} width={30} height={40} rx={7} fill={glow ? GOLD : "#4A7AC8"} stroke={INK} strokeWidth={2.5} />
    <line x1={-15} y1={-5} x2={-26} y2={12} stroke="#F8E0D0" strokeWidth={8} strokeLinecap="round" />
    <line x1={15} y1={-5} x2={26} y2={12} stroke="#F8E0D0" strokeWidth={8} strokeLinecap="round" />
    <circle cx={0} cy={-32} r={15} fill="#F8E0D0" stroke={INK} strokeWidth={2.5} />
    <path d="M -15 -36 Q -12 -47 -4 -46 Q 1 -50 10 -47 Q 15 -42 15 -36" fill="#1A1A22" />
    <circle cx={-5} cy={-33} r={2} fill={INK} />
    <circle cx={5} cy={-33} r={2} fill={INK} />
  </g>
);

// Caption sentence-based — chia nhỏ hơn, max 6 từ/chunk để không overlap
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
    // Hard break on sentence-ending punctuation
    if (/[.!?]$/.test(w.word)) {
      flush();
      continue;
    }
    // Soft break on comma/em-dash when buf >= 4 words
    if (/[,—:]$/.test(w.word) && buf.length >= 4) {
      flush();
      continue;
    }
    // Force break when buf >= 6 words (avoid wall-of-text)
    if (buf.length >= 6) {
      flush();
    }
  }
  flush();
  return out;
})();

const EMPH = new Set<string>([
  "AI", "AI.", "AI,", "AI'.",
  "khủng", "hoảng", "hoảng,", "hoảng.",
  "không", "không.", "không,",
  "kinh", "tế.", "tế,",
  "việc", "làm", "làm.", "làm,", "làm?",
  "trí", "óc.", "óc,", "óc",
  "an", "toàn", "toàn,", "toàn.",
  "tự", "động", "hoá", "hoá.",
  "5", "4", "1", "năm", "bốn", "một",
  "automation", "automation.",
  "content", "Coding.", "Coding",
  "biến", "mất", "mất?", "mất.", "hàng", "loạt", "loạt?",
  "giá", "trị", "trị?", "trị,",
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

// =============== BEAT 1: HOOK ===============
const Beat1: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(1);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      {/* Title top */}
      <text x={W / 2} y={300} fontSize={44} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>KHỦNG HOẢNG TIẾP THEO</text>

      {/* Big "KHÔNG PHẢI KINH TẾ" with strikethrough */}
      <g transform={`translate(${W / 2}, 600)`}>
        <text x={0} y={0} fontSize={88} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.4}>kinh tế</text>
        {p > 1.5 && (
          <line x1={-220} y1={0} x2={220} y2={0} stroke={RED} strokeWidth={10} strokeLinecap="round"
            opacity={interpolate(p, [1.5, 1.8], [0, 1], { extrapolateRight: "clamp" })} />
        )}
      </g>

      {/* "MÀ LÀ" arrow */}
      {p > 2.5 && (
        <text x={W / 2} y={780} fontSize={44} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}
          opacity={interpolate(p, [2.5, 2.8], [0, 1], { extrapolateRight: "clamp" })}>↓ MÀ LÀ ↓</text>
      )}

      {/* Big "VIỆC LÀM" reveal */}
      {p > 3.5 && (
        <g transform={`translate(${W / 2}, 950)`} opacity={interpolate(p, [3.5, 4.0], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={150} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} dominantBaseline="middle"
            style={{ filter: "drop-shadow(0 12px 28px rgba(232,88,56,0.45))" }}>VIỆC LÀM</text>
        </g>
      )}

      {/* "Hàng triệu người không còn cần thiết" */}
      {p > 5.5 && (
        <g transform={`translate(${W / 2}, 1180)`} opacity={interpolate(p, [5.5, 6.0], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.75}>hàng triệu người</text>
          <text x={0} y={70} fontSize={48} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>KHÔNG CÒN CẦN THIẾT</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.2)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 2: SETUP — Past revolutions ===============
const Beat2: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(2);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>QUÁ KHỨ</text>

      {/* Timeline 3 milestones */}
      <g transform={`translate(0, 700)`}>
        {/* Line */}
        <line x1={120} y1={50} x2={960} y2={50} stroke={INK} strokeWidth={4} />
        {[
          { x: 200, year: "1850", icon: "⚙️", label: "Máy hơi nước" },
          { x: 540, year: "1990", icon: "💻", label: "Internet" },
          { x: 880, year: "2026", icon: "🤖", label: "AI" },
        ].map((m, i) => {
          const at = 0.5 + i * 0.8;
          const visible = p >= at;
          const opi = visible ? interpolate(p, [at, at + 0.3], [0, 1], { extrapolateRight: "clamp" }) : 0;
          return (
            <g key={i} opacity={opi}>
              <circle cx={m.x} cy={50} r={20} fill={i === 2 ? ACCENT : INK} stroke={INK} strokeWidth={3} />
              <text x={m.x} y={-10} fontSize={70} textAnchor="middle">{m.icon}</text>
              <text x={m.x} y={120} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{m.year}</text>
              <text x={m.x} y={160} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.7}>{m.label}</text>
            </g>
          );
        })}
      </g>

      {/* Equation: thay việc cũ + tạo việc mới */}
      {p > 3 && (
        <g transform={`translate(${W / 2}, 1100)`} opacity={interpolate(p, [3, 3.5], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Thay việc cũ ⇄ Tạo việc mới</text>
          <text x={0} y={70} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.65}>Hợp lý. Lịch sử lặp lại.</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 280}, 1620) scale(1.3)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};

// =============== BEAT 3: TWIST — White collar ===============
const Beat3: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(3);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>LẦN NÀY KHÁC</text>

      {/* Tay chân X */}
      <g transform={`translate(${W / 2 - 220}, 700)`}>
        <text x={0} y={0} fontSize={150} textAnchor="middle">💪</text>
        <text x={0} y={80} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.5}>tay chân</text>
        {p > 1 && (
          <g opacity={interpolate(p, [1, 1.3], [0, 1], { extrapolateRight: "clamp" })}>
            <line x1={-90} y1={-90} x2={90} y2={90} stroke={RED} strokeWidth={10} strokeLinecap="round" />
            <line x1={90} y1={-90} x2={-90} y2={90} stroke={RED} strokeWidth={10} strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Arrow → */}
      {p > 1.5 && (
        <text x={W / 2} y={730} fontSize={80} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          opacity={interpolate(p, [1.5, 1.8], [0, 1], { extrapolateRight: "clamp" })}>→</text>
      )}

      {/* Trí óc target */}
      {p > 2 && (
        <g transform={`translate(${W / 2 + 220}, 700)`} opacity={interpolate(p, [2, 2.4], [0, 1], { extrapolateRight: "clamp" })}>
          <circle cx={0} cy={0} r={130} fill="none" stroke={ACCENT} strokeWidth={4} opacity={0.4} />
          <circle cx={0} cy={0} r={90} fill="none" stroke={ACCENT} strokeWidth={4} opacity={0.6} />
          <circle cx={0} cy={0} r={50} fill="none" stroke={ACCENT} strokeWidth={4} opacity={0.85} />
          <text x={0} y={0} fontSize={140} textAnchor="middle" dominantBaseline="middle">🧠</text>
          <text x={0} y={170} fontSize={32} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TRÍ ÓC</text>
        </g>
      )}

      {/* Bottom big text */}
      {p > 3.5 && (
        <g transform={`translate(${W / 2}, 1100)`} opacity={interpolate(p, [3.5, 4], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cái mà bạn nghĩ là</text>
          <text x={0} y={70} fontSize={62} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"AN TOÀN"</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 320}, 1620) scale(1.3)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};

// =============== BEAT 4: ESCALATION — 5 nghề ===============
const Beat4: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(4);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  const jobs = [
    { emo: "✍️", label: "Content", at: 0.3 },
    { emo: "🎨", label: "Thiết kế", at: 1.0 },
    { emo: "💻", label: "Coding", at: 1.7 },
    { emo: "📞", label: "CSKH", at: 2.5 },
    { emo: "📊", label: "Phân tích", at: 3.3 },
  ];

  return (
    <g opacity={op}>
      <text x={W / 2} y={280} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NGHỀ "AN TOÀN"</text>

      {/* 5 jobs flash */}
      <g transform={`translate(0, 480)`}>
        {jobs.map((j, i) => {
          const visible = p >= j.at;
          const opi = visible ? interpolate(p, [j.at, j.at + 0.3], [0, 1], { extrapolateRight: "clamp" }) : 0;
          const sc = visible ? interpolate(p, [j.at, j.at + 0.3], [0.6, 1], { extrapolateRight: "clamp" }) : 0.6;
          const showX = p >= j.at + 1.5;
          const cy = i * 130;
          return (
            <g key={i} transform={`translate(${W / 2}, ${cy}) scale(${sc})`} opacity={opi}>
              <rect x={-380} y={-50} width={760} height={100} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={3.5} />
              <text x={-300} y={20} fontSize={56} textAnchor="middle">{j.emo}</text>
              <text x={-200} y={15} fontSize={36} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{j.label}</text>
              {showX && (
                <g opacity={interpolate(p, [j.at + 1.5, j.at + 1.8], [0, 1], { extrapolateRight: "clamp" })}>
                  <circle cx={300} cy={0} r={36} fill={RED} stroke={INK} strokeWidth={3} />
                  <text x={300} y={14} fontSize={48} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✕</text>
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* Bottom: automation chạm */}
      {p > 6 && (
        <g transform={`translate(${W / 2}, 1300)`} opacity={interpolate(p, [6, 6.5], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={36} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>tự động hoá chạm tới · từng ngày</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 320}, 1620) scale(1.2)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 5: MACRO FEAR — 5 figure chart ===============
const Beat5: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(5);
  const p = Math.max(0, t - a);
  const figureXs = [180, 360, 540, 720, 900];
  const glowAt = 4.0;
  const fadeAt = 5.5;

  return (
    <g>
      <text x={W / 2} y={300} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.7}>VẤN ĐỀ THẬT SỰ</text>
      <text x={W / 2} y={380} fontSize={50} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>1 NGƯỜI = 5 NGƯỜI</text>

      {/* 5 figures in row */}
      {figureXs.map((fx, i) => {
        const isFirst = i === 0;
        let opacity = 1;
        let glow = false;
        if (isFirst) {
          glow = p >= glowAt;
        } else if (p >= fadeAt) {
          const fadeStart = fadeAt + (i - 1) * 0.3;
          opacity = interpolate(p, [fadeStart, fadeStart + 0.5], [1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        }
        return (
          <g key={i}>
            <MiniStick x={fx} y={900} opacity={opacity} glow={glow} />
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

      {/* "× 5" badge */}
      {p >= glowAt && (
        <g transform={`translate(${figureXs[0] + 130}, 870)`}
           opacity={interpolate(p, [glowAt, glowAt + 0.4], [0, 1], { extrapolateRight: "clamp" })}>
          <circle cx={0} cy={0} r={50} fill={ACCENT} stroke={INK} strokeWidth={4} />
          <text x={0} y={18} fontSize={50} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>×5</text>
        </g>
      )}
      {p >= glowAt && (
        <text x={figureXs[0]} y={820}
              fontSize={56}
              textAnchor="middle"
              opacity={interpolate(p, [glowAt, glowAt + 0.4], [0, 1], { extrapolateRight: "clamp" })}>
          ⚡
        </text>
      )}

      {/* Question mark */}
      {p > fadeAt + 1.8 && (
        <g transform={`translate(${W / 2}, 1230)`} opacity={interpolate(p, [fadeAt + 1.8, fadeAt + 2.2], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>4 NGƯỜI CÒN LẠI</text>
          <text x={0} y={80} fontSize={84} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ĐI ĐÂU?</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.2)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};

// =============== BEAT 6: PEAK ===============
const Beat6: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(6);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>KHỦNG HOẢNG LỚN NHẤT</text>

      {/* "không phải tech" cross out */}
      <g transform={`translate(${W / 2}, 600)`}>
        <text x={0} y={0} fontSize={60} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.4}>thiếu công nghệ</text>
        {p > 1.5 && (
          <line x1={-280} y1={0} x2={280} y2={0} stroke={RED} strokeWidth={8} strokeLinecap="round"
            opacity={interpolate(p, [1.5, 1.8], [0, 1], { extrapolateRight: "clamp" })} />
        )}
      </g>

      {/* "Mà là" arrow */}
      {p > 2.5 && (
        <text x={W / 2} y={760} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}
          opacity={interpolate(p, [2.5, 2.8], [0, 1], { extrapolateRight: "clamp" })}>↓ MÀ LÀ ↓</text>
      )}

      {/* Big "ĐỦ VIỆC LÀM cho con người?" */}
      {p > 3.5 && (
        <g transform={`translate(${W / 2}, 950)`} opacity={interpolate(p, [3.5, 4.0], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={50} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Xã hội có tạo</text>
          <text x={0} y={90} fontSize={84} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
            style={{ filter: "drop-shadow(0 8px 20px rgba(232,88,56,0.4))" }}>ĐỦ VIỆC LÀM?</text>
          <text x={0} y={170} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.75}>cho con người</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.2)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 7: CLOSING TWIST ===============
const Beat7: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(7);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.65}>câu hỏi lớn nhất thập kỷ</text>

      {/* "AI mạnh đến đâu?" cross out */}
      <g transform={`translate(${W / 2}, 530)`}>
        <text x={0} y={0} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.4}>"AI mạnh đến đâu?"</text>
        {p > 2 && (
          <line x1={-280} y1={0} x2={280} y2={0} stroke={RED} strokeWidth={8} strokeLinecap="round"
            opacity={interpolate(p, [2, 2.3], [0, 1], { extrapolateRight: "clamp" })} />
        )}
      </g>

      {/* Mà là */}
      {p > 3.5 && (
        <text x={W / 2} y={680} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}
          opacity={interpolate(p, [3.5, 3.8], [0, 1], { extrapolateRight: "clamp" })}>MÀ LÀ:</text>
      )}

      {/* BigWord italic */}
      {p > 4.5 && (
        <g transform={`translate(${W / 2}, 1000)`} opacity={interpolate(p, [4.5, 5.0], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={130} fill={ACCENT} textAnchor="middle" fontFamily="'EB Garamond', serif" fontStyle="italic" fontWeight={700}
            style={{ filter: "drop-shadow(0 8px 20px rgba(232,88,56,0.4))" }}>GIÁ TRỊ</text>
          <text x={0} y={110} fontSize={130} fill={ACCENT} textAnchor="middle" fontFamily="'EB Garamond', serif" fontStyle="italic" fontWeight={700}
            style={{ filter: "drop-shadow(0 8px 20px rgba(232,88,56,0.4))" }}>CỦA BẠN?</text>
          <text x={0} y={210} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>khi AI làm gần như mọi thứ tốt hơn</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.2)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 8: CTA — 2 col vote ===============
const Beat8: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(8);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BẠN NGHĨ SAO?</text>

      {/* 2 columns vote */}
      <g transform={`translate(0, 600)`}>
        {/* LEFT — TẠO VIỆC MỚI */}
        <g transform={`translate(${W / 4 - 20}, 0)`}>
          <rect x={-220} y={-40} width={440} height={500} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
          <circle cx={0} cy={50} r={56} fill="#3FA85A" stroke={INK} strokeWidth={3} />
          <text x={0} y={70} fontSize={64} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✓</text>
          <text x={0} y={200} fontSize={40} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TẠO</text>
          <text x={0} y={250} fontSize={40} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>VIỆC MỚI</text>
          <text x={0} y={330} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.7}>như cách mạng cũ</text>
          <text x={0} y={420} fontSize={24} fill="#3FA85A" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Comment "A"</text>
        </g>

        {/* RIGHT — MẤT HÀNG LOẠT */}
        <g transform={`translate(${(W * 3) / 4 + 20}, 0)`}>
          <rect x={-220} y={-40} width={440} height={500} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
          <circle cx={0} cy={50} r={56} fill={RED} stroke={INK} strokeWidth={3} />
          <text x={0} y={70} fontSize={64} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✕</text>
          <text x={0} y={200} fontSize={40} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>MẤT</text>
          <text x={0} y={250} fontSize={40} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>HÀNG LOẠT</text>
          <text x={0} y={330} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.7}>lần đầu công nghệ</text>
          <text x={0} y={420} fontSize={24} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Comment "B"</text>
        </g>
      </g>

      {/* Bottom CTA */}
      {p > 3 && (
        <g transform={`translate(${W / 2}, 1300)`} opacity={interpolate(p, [3, 3.5], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>💬 vote A hoặc B 👇</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 320}, 1620) scale(1.2)`}>
        <Teacher mouthOpen={mo} waving />
      </g>
    </g>
  );
};

// =============== Main ===============
export const KhungHoangViecLam: React.FC = () => {
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
      <Audio src={staticFile("khvl_voice.mp3")} />
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

export const khvlDuration = totalDuration;
