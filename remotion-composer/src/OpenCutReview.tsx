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
import wordsData from "./opencut_words.json";
import beatsData from "./opencut_beats.json";

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
      <filter id="ocPN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="37" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="ocVig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#ocPN)" />
    <rect width={W} height={H} fill="url(#ocVig)" />
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

// Caption sentence-based
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
  "OpenCut", "OpenCut-AI", "OpenCut.", "OpenCut-AI.",
  "CapCut", "CapCut.",
  "MIT.", "MIT", "MIT,",
  "100%", "100%.",
  "AI", "AI.", "AI,",
  "Hormozi", "Hormozi.",
  "Docker", "Docker.",
  "free", "free.", "miễn", "miễn,",
  "shock", "shock.",
  "ma.", "ma,",
  "local", "local.",
  "9:16",
  "TikTok", "TikTok.",
  "save", "Save", "Save.",
  "fork", "fork.",
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

// =============== BEAT 1: HOOK — Podcast → 5 viral clips ===============
const Beat1: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(1);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  // Podcast input
  const podcastIn = p < 1.5;
  // Scanning phase 1.5s -> 3s
  const scanP = Math.max(0, Math.min(1, (p - 1.2) / 1.6));
  const scanX = 80 + 920 * scanP;
  // Clips emerge 3s+
  const clipsAppearAt = 2.8;

  return (
    <g opacity={op}>
      {/* Podcast file at top */}
      <g transform={`translate(${W / 2}, 480)`}>
        <rect x={-380} y={-90} width={760} height={180} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
        <text x={-280} y={20} fontSize={88} textAnchor="middle">🎙️</text>
        <text x={50} y={-15} fontSize={44} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Podcast</text>
        <text x={50} y={45} fontSize={56} fill={ACCENT} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>1 TIẾNG</text>
      </g>

      {/* Timeline scan */}
      <g transform={`translate(0, 720)`}>
        <rect x={80} y={0} width={920} height={80} rx={10} fill="#FAFAF5" stroke={INK} strokeWidth={3} />
        {/* Tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={80 + 920 * f} y1={80} x2={80 + 920 * f} y2={95} stroke={INK} strokeWidth={2} opacity={0.5} />
        ))}
        {/* Scan line */}
        {p > 1.2 && (
          <>
            <line x1={scanX} y1={-10} x2={scanX} y2={90} stroke={ACCENT} strokeWidth={5} />
            <circle cx={scanX} cy={40} r={12} fill={ACCENT} stroke={INK} strokeWidth={3} />
          </>
        )}
      </g>

      {/* Arrow ↓ */}
      {p > 2.5 && (
        <text x={W / 2} y={870} fontSize={70} fill={ACCENT} textAnchor="middle"
          opacity={interpolate(p, [2.5, 2.8], [0, 1], { extrapolateRight: "clamp" })}>↓</text>
      )}

      {/* 5 viral clips */}
      {p > clipsAppearAt && (
        <g transform={`translate(0, 950)`}>
          {[0, 1, 2, 3, 4].map(i => {
            const at = clipsAppearAt + 0.2 + i * 0.18;
            const visible = p >= at;
            const opi = visible ? interpolate(p, [at, at + 0.3], [0, 1], { extrapolateRight: "clamp" }) : 0;
            const sc = visible ? interpolate(p, [at, at + 0.3], [0.6, 1], { extrapolateRight: "clamp" }) : 0.6;
            const x = 80 + i * 188;
            const score = ["9.2", "8.8", "8.5", "8.1", "7.9"][i];
            return (
              <g key={i} transform={`translate(${x + 84}, 80) scale(${sc})`} opacity={opi}>
                <rect x={-78} y={-78} width={156} height={156} rx={14} fill={GOLD} stroke={INK} strokeWidth={3.5}
                  filter="drop-shadow(0 8px 14px rgba(229,165,59,0.4))" />
                <text x={0} y={-15} fontSize={48} textAnchor="middle">🎬</text>
                <text x={0} y={35} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{score}</text>
                <text x={0} y={62} fontSize={16} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>viral</text>
              </g>
            );
          })}
        </g>
      )}

      {/* "3 PHÚT · FREE" big text */}
      {p > 4.0 && (
        <g opacity={interpolate(p, [4.0, 4.4], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={140} y={1320} width={800} height={180} rx={24} fill={ACCENT} stroke={INK} strokeWidth={5} />
          <text x={W / 2} y={1395} fontSize={62} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>3 PHÚT · FREE</text>
          <text x={W / 2} y={1455} fontSize={28} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.95}>không cloud · không API · không subscription</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.2)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};

// =============== BEAT 2: DISCOVERY ===============
const Beat2: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(2);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PHÁT HIỆN</text>

      {/* GitHub repo card */}
      <g transform={`translate(${W / 2}, 700)`}>
        <rect x={-440} y={-180} width={880} height={360} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={4} filter="drop-shadow(0 12px 24px rgba(0,0,0,0.18))" />
        {/* GitHub icon */}
        <text x={-360} y={-70} fontSize={70} textAnchor="middle">🐙</text>
        <text x={-260} y={-60} fontSize={32} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.6}>github.com</text>
        {/* Repo name */}
        <text x={-360} y={20} fontSize={56} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>OpenCut-AI</text>
        <text x={-360} y={70} fontSize={26} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.65}>fork by Ekaanth (Ấn Độ)</text>

        {/* Badges */}
        <g transform="translate(-360, 110)">
          <rect x={-10} y={0} width={120} height={50} rx={25} fill={GREEN} stroke={INK} strokeWidth={2.5} />
          <text x={50} y={32} fontSize={22} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>MIT</text>

          <rect x={130} y={0} width={140} height={50} rx={25} fill={ACCENT} stroke={INK} strokeWidth={2.5} />
          <text x={200} y={32} fontSize={22} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FREE</text>

          <rect x={290} y={0} width={170} height={50} rx={25} fill={BLUE} stroke={INK} strokeWidth={2.5} />
          <text x={375} y={32} fontSize={22} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>100% LOCAL</text>
        </g>
      </g>

      {/* "fork tree" small */}
      {p > 6 && (
        <g transform={`translate(${W / 2}, 1180)`} opacity={interpolate(p, [6, 6.5], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>OpenCut-app/OpenCut → fork → Ekaanth/OpenCut-AI</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 280}, 1500) scale(1.6)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 3: WOW Edit by Text ===============
const Beat3: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(3);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>EDIT BẰNG TEXT</text>

      {/* Document with strikethrough */}
      <g transform={`translate(${W / 2}, 720)`}>
        <rect x={-440} y={-220} width={880} height={440} rx={20} fill="#FFF" stroke={INK} strokeWidth={4} filter="drop-shadow(0 8px 20px rgba(0,0,0,0.2))" />
        {/* Top bar */}
        <circle cx={-410} cy={-190} r={8} fill="#FF5F57" />
        <circle cx={-385} cy={-190} r={8} fill="#FEBC2E" />
        <circle cx={-360} cy={-190} r={8} fill="#28C840" />
        {/* Lines */}
        <text x={-400} y={-130} fontSize={28} fill={INK} fontFamily="'JetBrains Mono', monospace" opacity={0.85}>Câu mở đầu của video.</text>
        {p > 2 && (
          <g opacity={interpolate(p, [2, 2.5], [0, 1], { extrapolateRight: "clamp" })}>
            <text x={-400} y={-70} fontSize={28} fill={RED} fontFamily="'JetBrains Mono', monospace" opacity={0.6}
              style={{ textDecoration: "line-through" }}>Đoạn dài lan man cần xoá.</text>
          </g>
        )}
        <text x={-400} y={-10} fontSize={28} fill={INK} fontFamily="'JetBrains Mono', monospace" opacity={0.85}>Phần kết hay nhất.</text>
        {/* Cursor blinking */}
        {p > 1.5 && p < 2.5 && (
          <line x1={50} y1={-90} x2={50} y2={-50} stroke={ACCENT} strokeWidth={3} opacity={Math.sin(p * 8) * 0.5 + 0.5} />
        )}
        {/* Arrow → video clip */}
        {p > 3 && (
          <g opacity={interpolate(p, [3, 3.5], [0, 1], { extrapolateRight: "clamp" })}>
            <text x={-100} y={130} fontSize={56} fill={ACCENT} textAnchor="middle">↓</text>
            <text x={100} y={140} fontSize={32} fill={ACCENT} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Video tự cắt</text>
          </g>
        )}
      </g>

      {/* "Như có ma" tag */}
      {p > 5 && (
        <g transform={`translate(${W / 2}, 1180)`} opacity={interpolate(p, [5, 5.5], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={-200} y={-50} width={400} height={100} rx={50} fill={GOLD} stroke={INK} strokeWidth={4} />
          <text x={0} y={20} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NHƯ CÓ MA</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 280}, 1480) scale(1.5)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};

// =============== BEAT 4: VOICE CLONE + LANG ===============
const Beat4: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(4);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CLONE GIỌNG · 30 NGÔN NGỮ</text>

      {/* Mic icon + waveform */}
      <g transform={`translate(${W / 2}, 580)`}>
        <text x={-200} y={20} fontSize={120} textAnchor="middle">🎙️</text>
        {/* Waveform 6s */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
          const h = 30 + Math.abs(Math.sin((p + i) * 4)) * 60;
          return <rect key={i} x={-50 + i * 22} y={-h / 2} width={12} height={h} rx={6} fill={ACCENT} />;
        })}
        <text x={150} y={130} fontSize={32} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>6 GIÂY</text>
      </g>

      {/* Arrow down */}
      {p > 3 && (
        <text x={W / 2} y={830} fontSize={70} fill={ACCENT} textAnchor="middle" opacity={interpolate(p, [3, 3.3], [0, 1], { extrapolateRight: "clamp" })}>↓</text>
      )}

      {/* Language grid */}
      {p > 4 && (
        <g opacity={interpolate(p, [4, 4.8], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={W / 2} y={920} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>30 NGÔN NGỮ</text>
          {[
            { label: "Hindi", color: "#FF9933" },
            { label: "Trung", color: "#DE2910" },
            { label: "Việt", color: "#DA251D" },
            { label: "Tây BN", color: "#AA151B" },
            { label: "Pháp", color: "#0055A4" },
            { label: "Nhật", color: "#BC002D" },
          ].map((it, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            return (
              <g key={i} transform={`translate(${250 + col * 290}, ${1030 + row * 130})`}>
                <rect x={-120} y={-50} width={240} height={100} rx={16} fill="#FAFAF5" stroke={INK} strokeWidth={3} />
                <rect x={-120} y={-50} width={14} height={100} fill={it.color} />
                <text x={5} y={15} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{it.label}</text>
              </g>
            );
          })}
          <text x={W / 2} y={1320} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.65}>+ Anh, Đức, Ý, Nga, Hàn, Thái, Ả Rập...</text>
        </g>
      )}

      {/* "LOCAL ONLY" sticker */}
      {p > 7 && (
        <g transform={`translate(${W / 2}, 1430)`} opacity={interpolate(p, [7, 7.5], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={-260} y={-40} width={520} height={80} rx={40} fill={GREEN} stroke={INK} strokeWidth={3.5} />
          <text x={0} y={18} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>LOCAL · KHÔNG UPLOAD</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 280}, 1620) scale(1.3)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};

// =============== BEAT 5: VIRAL CLIP FINDER ===============
const Beat5: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(5);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  // Scan position
  const scanX = interpolate(p, [1, 6], [80, 1000], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AI TÌM CLIP VIRAL</text>

      {/* Timeline 60min */}
      <g transform={`translate(0, 500)`}>
        <text x={W / 2} y={-30} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>Podcast 1 tiếng</text>
        <rect x={80} y={0} width={920} height={120} rx={12} fill="#FAFAF5" stroke={INK} strokeWidth={3} />
        {/* Tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={80 + 920 * f} y1={120} x2={80 + 920 * f} y2={140} stroke={INK} strokeWidth={2} opacity={0.5} />
        ))}
        {/* Scan line */}
        <line x1={scanX} y1={-10} x2={scanX} y2={130} stroke={ACCENT} strokeWidth={5} />
        <circle cx={scanX} cy={60} r={14} fill={ACCENT} stroke={INK} strokeWidth={3} />
      </g>

      {/* 5 viral clips popping */}
      {p > 6 && (
        <g transform={`translate(0, 750)`} opacity={interpolate(p, [6, 6.5], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={W / 2} y={-20} fontSize={36} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>↓ 5 CLIP HOT NHẤT</text>
          {[0, 1, 2, 3, 4].map(i => {
            const at = 6.5 + i * 0.3;
            const visible = p >= at;
            const opi = visible ? interpolate(p, [at, at + 0.4], [0, 1], { extrapolateRight: "clamp" }) : 0;
            const sc = visible ? interpolate(p, [at, at + 0.4], [0.7, 1], { extrapolateRight: "clamp" }) : 0.7;
            const x = 80 + i * 188;
            const score = [9.2, 8.8, 8.5, 8.1, 7.9][i];
            return (
              <g key={i} transform={`translate(${x + 84}, 100) scale(${sc})`} opacity={opi}>
                <rect x={-80} y={-80} width={160} height={160} rx={14} fill={GOLD} stroke={INK} strokeWidth={3.5} />
                <text x={0} y={-10} fontSize={50} textAnchor="middle">🎬</text>
                <text x={0} y={40} fontSize={30} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{score}</text>
                <text x={0} y={65} fontSize={16} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>viral</text>
              </g>
            );
          })}
        </g>
      )}

      {/* Bottom big text */}
      {p > 9 && (
        <g transform={`translate(${W / 2}, 1150)`} opacity={interpolate(p, [9, 9.5], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={56} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>60 phút → 5 clip</text>
          <text x={0} y={70} fontSize={38} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>TỰ ĐỘNG · không cần nghe lại</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 280}, 1620) scale(1.3)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};

// =============== BEAT 6: TIKTOK EXPORT ===============
const Beat6: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(6);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={280} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>EXPORT THẲNG TIKTOK</text>

      {/* Word-pop subtitle demo */}
      <g transform={`translate(${W / 2}, 580)`}>
        <text x={0} y={-50} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>Word-Pop Subs (Hormozi)</text>
        {/* Sentence */}
        {["TÔI", "VỪA", "TIẾT", "KIỆM"].map((w, i) => {
          const at = 0.5 + i * 0.3;
          const sp = spring({ frame: useCurrentFrame() - (a + at) * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const sc = 0.7 + sp * 0.3;
          const visible = p >= at;
          const isEmphWord = w === "TIẾT" || w === "KIỆM";
          return (
            <text key={i}
              x={-300 + i * 200}
              y={50}
              fontSize={isEmphWord ? 76 : 60}
              fill={isEmphWord ? GOLD : "#FFF"}
              textAnchor="middle"
              fontFamily="'Be Vietnam Pro', sans-serif"
              fontWeight={800}
              opacity={visible ? 1 : 0}
              transform={`scale(${visible ? sc : 0.7})`}
              style={{
                textShadow: isEmphWord
                  ? "0 0 24px rgba(229,165,59,0.7), 0 4px 14px rgba(0,0,0,0.95)"
                  : "0 4px 14px rgba(0,0,0,0.95), -4px 0 0 #1A1820, 4px 0 0 #1A1820, 0 -4px 0 #1A1820, 0 4px 0 #1A1820",
              }}>
              {w}
            </text>
          );
        })}
      </g>

      {/* 16:9 → 9:16 demo */}
      {p > 3.5 && (
        <g transform={`translate(${W / 2}, 950)`} opacity={interpolate(p, [3.5, 4], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={-300} y={-110} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>16:9</text>
          <rect x={-450} y={-90} width={300} height={170} rx={12} fill="#FAFAF5" stroke={INK} strokeWidth={3.5} />
          <text x={-300} y={10} fontSize={50} textAnchor="middle">👤</text>
          <text x={0} y={0} fontSize={70} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→</text>
          <rect x={150} y={-150} width={170} height={300} rx={12} fill="#FAFAF5" stroke={ACCENT} strokeWidth={4} />
          <text x={235} y={20} fontSize={70} textAnchor="middle">👤</text>
          <text x={235} y={-180} fontSize={28} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>9:16</text>
          <text x={0} y={210} fontSize={28} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TỰ CROP · BÁM MẶT</text>
        </g>
      )}

      {/* Time saved */}
      {p > 9 && (
        <g transform={`translate(${W / 2}, 1300)`} opacity={interpolate(p, [9, 9.5], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>3 tiếng → 3 phút</text>
          <text x={0} y={60} fontSize={32} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>WORKFLOW 60× NHANH HƠN</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 280}, 1620) scale(1.3)`}>
        <Teacher mouthOpen={mo} thumbs />
      </g>
    </g>
  );
};

// =============== BEAT 7: INSIGHT ===============
const Beat7: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(7);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BIGGER PICTURE</text>

      {/* 3 NO bullets */}
      <g transform={`translate(${W / 2}, 600)`}>
        {[
          { label: "không trả tiền", at: 1 },
          { label: "không nuốt footage", at: 2 },
          { label: "không lock subscription", at: 3 },
        ].map((it, i) => {
          const visible = p >= it.at;
          const opi = visible ? interpolate(p, [it.at, it.at + 0.4], [0, 1], { extrapolateRight: "clamp" }) : 0;
          const tx = visible ? interpolate(p, [it.at, it.at + 0.4], [-100, 0], { extrapolateRight: "clamp" }) : -100;
          return (
            <g key={i} transform={`translate(${tx}, ${i * 130})`} opacity={opi}>
              <rect x={-380} y={-50} width={760} height={100} rx={50} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
              <circle cx={-310} cy={0} r={36} fill={RED} stroke={INK} strokeWidth={3} />
              <text x={-310} y={14} fontSize={48} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✕</text>
              <text x={-220} y={15} fontSize={36} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{it.label}</text>
            </g>
          );
        })}
      </g>

      {/* MIT badge big */}
      {p > 5 && (
        <g transform={`translate(${W / 2}, 1180)`} opacity={interpolate(p, [5, 5.5], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={-220} y={-70} width={440} height={140} rx={20} fill={GREEN} stroke={INK} strokeWidth={4} />
          <text x={0} y={-5} fontSize={56} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>MIT</text>
          <text x={0} y={45} fontSize={26} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Open Source · Fork tự do</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 280}, 1620) scale(1.3)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 8: INSTALL ===============
const Beat8: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(8);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });

  const cmds = [
    "git clone https://github.com/Ekaanth/OpenCut-AI.git",
    "cd OpenCut-AI",
    "docker compose up -d",
    "open http://localhost:3100",
  ];

  return (
    <g opacity={op}>
      <text x={W / 2} y={280} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CÀI 4 LỆNH</text>

      {/* Terminal */}
      <g transform={`translate(${W / 2}, 800)`}>
        <rect x={-440} y={-280} width={880} height={560} rx={20} fill="#1A1820" stroke={INK} strokeWidth={4} />
        {/* Top bar */}
        <circle cx={-410} cy={-250} r={8} fill="#FF5F57" />
        <circle cx={-385} cy={-250} r={8} fill="#FEBC2E" />
        <circle cx={-360} cy={-250} r={8} fill="#28C840" />
        <text x={0} y={-243} fontSize={22} fill="#FFF" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" opacity={0.6}>bash — terminal</text>

        {/* Commands typewriter */}
        {cmds.map((cmd, i) => {
          const at = 0.8 + i * 1.4;
          const visible = p >= at;
          const opi = visible ? interpolate(p, [at, at + 0.5], [0, 1], { extrapolateRight: "clamp" }) : 0;
          return (
            <g key={i} opacity={opi}>
              <text x={-410} y={-160 + i * 80} fontSize={22} fill="#4FFF80" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>$</text>
              <text x={-380} y={-160 + i * 80} fontSize={22} fill="#FFF" fontFamily="'JetBrains Mono', monospace">{cmd.length > 50 ? cmd.slice(0, 50) + "..." : cmd}</text>
            </g>
          );
        })}

        {/* Success */}
        {p > 7 && (
          <g opacity={interpolate(p, [7, 7.5], [0, 1], { extrapolateRight: "clamp" })}>
            <text x={-410} y={200} fontSize={26} fill={GOLD} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✓ Editor running</text>
          </g>
        )}
      </g>

      <g transform={`translate(${W / 2 + 280}, 1620) scale(1.3)`}>
        <Teacher mouthOpen={mo} thumbs />
      </g>
    </g>
  );
};

// =============== BEAT 9: CTA ===============
const Beat9: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(9);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(p * 4) * 0.04;

  return (
    <g opacity={op}>
      <g transform={`translate(${W / 2}, 800) scale(${pulse})`}>
        <rect x={-440} y={-200} width={880} height={400} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={4} filter="drop-shadow(0 12px 24px rgba(0,0,0,0.18))" />
        <text x={0} y={-100} fontSize={50} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Comment</text>
        <g transform="translate(0, -30)">
          <rect x={-180} y={-50} width={360} height={100} rx={50} fill={ACCENT} stroke={INK} strokeWidth={3.5} />
          <text x={0} y={20} fontSize={48} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"OpenCut"</text>
        </g>
        <text x={0} y={80} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Tôi gửi link riêng cho bạn</text>
        <text x={0} y={150} fontSize={56} textAnchor="middle">💬 👇</text>
      </g>

      <g transform={`translate(${W / 2 + 280}, 1620) scale(1.4)`}>
        <Teacher mouthOpen={mo} waving />
      </g>
    </g>
  );
};

// =============== Main ===============
export const OpenCutReview: React.FC = () => {
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
  const [, e8] = B(8);
  const b9 = B(9);

  return (
    <AbsoluteFill>
      <Audio src={staticFile("opencut_voice.mp3")} />
      <Bg />

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {t < e1 && <Beat1 t={t} mo={mo} />}
        {t >= B(2)[0] && t < e2 && <Beat2 t={t} mo={mo} />}
        {t >= B(3)[0] && t < e3 && <Beat3 t={t} mo={mo} />}
        {t >= B(4)[0] && t < e4 && <Beat4 t={t} mo={mo} />}
        {t >= B(5)[0] && t < e5 && <Beat5 t={t} mo={mo} />}
        {t >= B(6)[0] && t < e6 && <Beat6 t={t} mo={mo} />}
        {t >= B(7)[0] && t < e7 && <Beat7 t={t} mo={mo} />}
        {t >= B(8)[0] && t < e8 && <Beat8 t={t} mo={mo} />}
        {t >= B(9)[0] && t < b9[1] && <Beat9 t={t} mo={mo} />}
      </svg>

      <Caption />
    </AbsoluteFill>
  );
};

export const opencutReviewDuration = totalDuration;
