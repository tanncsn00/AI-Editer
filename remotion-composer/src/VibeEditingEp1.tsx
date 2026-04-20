import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import wordsData from "./vibe_ep1_words.json";
import beatsData from "./vibe_ep1_beats.json";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";
const YELLOW = "#F4B860";
const IVORY = "#F5F5F0";

type Word = { word: string; start: number; end: number; beat: number };
const words = wordsData as Word[];

type BeatInfo = { index: number; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
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
      <filter id="ep1PN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="ep1Vig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#ep1PN)" />
    <rect width={W} height={H} fill="url(#ep1Vig)" />
  </svg>
);

// =============== Teacher (người que) ===============
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

// =============== Caption (Tịnh Đạo style — sentence-based, center, spring reveal) ===============
// Split into sentences on .!? OR on long sentences break at commas for readability
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
    // Soft break: on comma if buffer already >= 8 words
    if (/,$/.test(w.word) && buf.length >= 8) {
      flush();
    }
  }
  flush();
  return out;
})();

// Emphasis set — key tech/punch words get GOLD + bigger
const EMPH = new Set<string>([
  // Persona punch
  "miệng.", "miệng,",
  // Tool/brand names (display form)
  "Claude", "Code", "Codex", "Codex.", "Code.", "Code,",
  "vibe", "editing.", "editing",
  "API", "API,", "API.", "key", "key.", "key,",
  "MP4", "MP4.", "MP4,",
  "Node.js", "Node.js,",
  "FFmpeg", "FFmpeg.", "FFmpeg,",
  "Canva", "Canva.",
  "FAL", "FAL,", "FAL.", "EverAI", "EverAI,", "EverAI.",
  "Pexels", "Pixabay", "Pexels,", "Pixabay.",
  // Video gen teaser names
  "Veo", "Kling", "MiniMax", "Runway", "HeyGen", "FLUX", "Imagen", "Suno",
  "Wav2Lip", "Wav2Lip,",
  // Stickers
  "3", "3,", "1", "một.",
  "ăn", "sẵn.", "sẵn,",
  "free", "free,",
  "xong.", "Xong.", "xong,",
  "câu.", "câu,", "câu",
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
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center",
        gap: "0 18px", maxWidth: 940, padding: "0 60px",
      }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({
            frame: frame - appearAt * FPS, fps: FPS,
            config: { damping: 14, stiffness: 230, mass: 0.4 },
          });
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

// =============== Helper components ===============
const Sticker: React.FC<{ x: number; y: number; text: string; color: string; rot?: number }> = ({ x, y, text, color, rot = -4 }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
    <rect x={-text.length * 8 - 12} y={-22} width={text.length * 16 + 24} height={44} rx={8} fill={color} stroke={INK} strokeWidth={2.5} />
    <text x={0} y={8} fontSize={22} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{text}</text>
  </g>
);

const PaperCard: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode; rot?: number }> = ({ x, y, w, h, children, rot = 0 }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill="#FAFAF5" stroke={INK} strokeWidth={3.5} filter="drop-shadow(0 8px 16px rgba(0,0,0,0.2))" />
    {children}
  </g>
);

// =============== Beat visuals ===============

// Beat 1: HOOK — Cũ vs Mới
const Beat1: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(1);
  const progress = Math.max(0, (t - a));
  const showRight = progress > 4;
  return (
    <g>
      {/* Column labels above each card */}
      <text x={290} y={200} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.55}>CÁCH CŨ</text>
      {progress > 4 && (
        <text x={790} y={200} fontSize={32} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
          opacity={interpolate(progress, [4, 4.6], [0, 1], { extrapolateRight: "clamp" })}>VIBE EDITING</text>
      )}
      {/* Left — CŨ */}
      <g>
        <rect x={60} y={240} width={460} height={600} rx={18} fill="#FAFAF5" stroke={INK} strokeWidth={3.5} />
        <text x={290} y={320} fontSize={100} textAnchor="middle">🎞️</text>
        <text x={290} y={400} fontSize={38} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>EDIT TAY</text>
        <text x={290} y={460} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.7}>Premiere · AE · Canva</text>
        <text x={290} y={600} fontSize={70} textAnchor="middle">⏰</text>
        <text x={290} y={690} fontSize={60} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>3 TIẾNG</text>
        {/* Red X */}
        {progress > 2 && (
          <g opacity={interpolate(progress, [2, 2.5], [0, 1], { extrapolateRight: "clamp" })}>
            <line x1={80} y1={260} x2={500} y2={820} stroke="#D03020" strokeWidth={14} strokeLinecap="round" />
            <line x1={500} y1={260} x2={80} y2={820} stroke="#D03020" strokeWidth={14} strokeLinecap="round" />
          </g>
        )}
      </g>
      {/* Right — MỚI */}
      {showRight && (
        <g opacity={interpolate(progress, [4, 4.6], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={560} y={240} width={460} height={600} rx={18} fill="#FAFAF5" stroke={INK} strokeWidth={3.5} />
          <text x={790} y={320} fontSize={100} textAnchor="middle">💻</text>
          <text x={790} y={400} fontSize={38} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>RA LỆNH</text>
          <text x={790} y={460} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.7}>Claude · Codex</text>
          <text x={790} y={600} fontSize={70} textAnchor="middle">⚡</text>
          <text x={790} y={690} fontSize={60} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>1 CÂU</text>
        </g>
      )}
      <g transform={`translate(${W / 2}, 1080) scale(2.4)`}>
        <Teacher mouthOpen={mo} pointing={progress > 3} />
      </g>
    </g>
  );
};

// Beat 2: VIBE EDITING là gì
const Beat2: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(2);
  const p = Math.max(0, t - a);
  const logos = ["Remotion", "Claude", "Codex", "EverAI", "FAL", "Piper", "FFmpeg"];
  return (
    <g>
      <text x={W / 2} y={160} fontSize={48} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>VIBE EDITING LÀ GÌ?</text>
      {/* 3-step pipeline */}
      <g transform="translate(0, 300)">
        {["VỢ NÓI", "AI VIẾT CODE", "MP4"].map((label, i) => {
          const xc = 180 + i * 360;
          const show = p > i * 1.5;
          return show ? (
            <g key={i} opacity={interpolate(p, [i * 1.5, i * 1.5 + 0.5], [0, 1], { extrapolateRight: "clamp" })}>
              <rect x={xc - 140} y={0} width={280} height={180} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
              <text x={xc} y={90} fontSize={60} textAnchor="middle">{i === 0 ? "🗣️" : i === 1 ? "🤖" : "🎬"}</text>
              <text x={xc} y={150} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{label}</text>
              {i < 2 && <text x={xc + 180} y={100} fontSize={42} fill={ACCENT} textAnchor="middle" fontWeight={800}>→</text>}
            </g>
          ) : null;
        })}
      </g>
      {/* Built on row */}
      <g transform="translate(0, 720)">
        <text x={W / 2} y={40} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.8}>Built on open source:</text>
        <g transform="translate(0, 80)">
          {logos.map((l, i) => {
            const show = p > 8 + i * 0.35;
            return show ? (
              <g key={l} opacity={interpolate(p, [8 + i * 0.35, 8 + i * 0.35 + 0.4], [0, 1], { extrapolateRight: "clamp" })}>
                <rect x={40 + (i % 4) * 245} y={(Math.floor(i / 4)) * 90} width={230} height={70} rx={14} fill={GOLD} stroke={INK} strokeWidth={2.5} />
                <text x={155 + (i % 4) * 245} y={(Math.floor(i / 4)) * 90 + 45} fontSize={24} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{l}</text>
              </g>
            ) : null;
          })}
        </g>
      </g>
      <g transform={`translate(920, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// Beat 3: Chọn AI — 6 agents grid
const Beat3: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(3);
  const p = Math.max(0, t - a);
  const agents = [
    { name: "Claude Code", rec: true },
    { name: "Codex", rec: true },
    { name: "Cursor", rec: false },
    { name: "Aider", rec: false },
    { name: "Continue", rec: false },
    { name: "Gemini CLI", rec: false },
  ];
  return (
    <g>
      <text x={W / 2} y={180} fontSize={48} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CHỌN AI NÀO?</text>
      <g transform="translate(0, 260)">
        {agents.map((ag, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const show = p > i * 0.3;
          const bg = ag.rec ? GOLD : "#FAFAF5";
          const tc = ag.rec ? "#FFF" : INK;
          return show ? (
            <g key={ag.name} opacity={interpolate(p, [i * 0.3, i * 0.3 + 0.4], [0, 1], { extrapolateRight: "clamp" })}
              transform={`translate(${90 + col * 480}, ${row * 230})`}>
              <rect x={0} y={0} width={440} height={190} rx={20} fill={bg} stroke={INK} strokeWidth={3.5} opacity={ag.rec ? 1 : 0.55} />
              {ag.rec && <text x={40} y={60} fontSize={64} textAnchor="middle">⭐</text>}
              <text x={220} y={110} fontSize={36} fill={tc} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{ag.name}</text>
              {ag.rec && <text x={220} y={155} fontSize={22} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>CHỒNG CHỌN</text>}
            </g>
          ) : null;
        })}
      </g>
      <g transform={`translate(920, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// Beat 4: Clone + install
const Beat4: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(4);
  const p = Math.max(0, t - a);
  const cmds = [
    { cmd: "git clone https://github.com/tanncsn00/AI-Editer.git", at: 8 },
    { cmd: "cd AI-Editer && pip install -r requirements.txt", at: 16 },
    { cmd: "cd remotion-composer && npm install", at: 23 },
  ];
  return (
    <g>
      <text x={W / 2} y={160} fontSize={44} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BƯỚC 1 — CLONE + INSTALL</text>
      {/* Prereq icons */}
      <g transform="translate(0, 220)">
        {[
          { icon: "🧰", name: "Git" },
          { icon: "🟢", name: "Node.js" },
          { icon: "🎬", name: "FFmpeg" },
        ].map((p2, i) => (
          <g key={p2.name} transform={`translate(${120 + i * 300}, 0)`}>
            <rect x={0} y={0} width={240} height={100} rx={14} fill="#FAFAF5" stroke={INK} strokeWidth={3} />
            <text x={50} y={65} fontSize={40} textAnchor="middle">{p2.icon}</text>
            <text x={155} y={62} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{p2.name}</text>
          </g>
        ))}
        <text x={W / 2} y={150} fontSize={24} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>CẦN CÓ SẴN TRÊN MÁY</text>
      </g>
      {/* Paper terminal */}
      <g transform="translate(50, 450)">
        <rect x={0} y={0} width={980} height={720} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
        <rect x={0} y={0} width={980} height={60} rx={20} fill={INK} />
        <rect x={0} y={40} width={980} height={20} fill={INK} />
        <circle cx={30} cy={30} r={9} fill="#E85838" />
        <circle cx={60} cy={30} r={9} fill="#E5A53B" />
        <circle cx={90} cy={30} r={9} fill="#3AB070" />
        <text x={490} y={38} fontSize={22} fill="#FFF" textAnchor="middle" fontFamily="'JetBrains Mono', monospace">terminal</text>
        {cmds.map((c, i) => {
          const shown = p > c.at;
          if (!shown) return null;
          const charProgress = Math.min(c.cmd.length, Math.floor((p - c.at) * 30));
          const typed = c.cmd.slice(0, charProgress);
          return (
            <g key={i}>
              <text x={28} y={110 + i * 170} fontSize={24} fill={ACCENT} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>$</text>
              <text x={60} y={110 + i * 170} fontSize={22} fill={INK} fontFamily="'JetBrains Mono', monospace">{typed}</text>
              {charProgress >= c.cmd.length && (
                <>
                  <rect x={28} y={130 + i * 170} width={920} height={20} rx={10} fill="#E0D8C8" />
                  <rect x={28} y={130 + i * 170} width={920 * Math.min(1, (p - c.at - c.cmd.length / 30) / 2)} height={20} rx={10} fill={GOLD} />
                  <text x={28} y={165 + i * 170} fontSize={18} fill={INK} fontFamily="'JetBrains Mono', monospace" opacity={0.7}>✓ done</text>
                </>
              )}
            </g>
          );
        })}
      </g>
      {/* Sticker "đã gói sẵn" */}
      {p > 20 && <Sticker x={W / 2} y={1260} text="ĐÃ GÓI SẴN: yt-dlp · whisper · opencv · ..." color={GOLD} rot={-3} />}
      {/* Repo link card — show BOTH his fork + original credit */}
      <g transform="translate(540, 1320)">
        <rect x={-460} y={-60} width={920} height={180} rx={18} fill="#FAFAF5" stroke={INK} strokeWidth={3.5} />
        <text x={-440} y={-26} fontSize={20} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.6}>Repo của chồng:</text>
        <text x={-440} y={6} fontSize={26} fill={ACCENT} fontFamily="'JetBrains Mono', monospace" fontWeight={800}>github.com/tanncsn00/AI-Editer</text>
        <line x1={-440} y1={28} x2={440} y2={28} stroke={INK} strokeWidth={1} opacity={0.3} />
        <text x={-440} y={56} fontSize={20} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.6}>Dựa trên bản gốc:</text>
        <text x={-440} y={88} fontSize={24} fill={INK} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>github.com/calesthio/OpenMontage ♥</text>
      </g>
      <g transform={`translate(920, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// Beat 5: .env API keys
const Beat5: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(5);
  const p = Math.max(0, t - a);
  const required = [
    { key: "FAL_KEY", hint: "ảnh + video AI" },
    { key: "EVERAI_API_KEY", hint: "giọng tiếng Việt" },
    { key: "PEXELS_API_KEY", hint: "footage free" },
  ];
  const optional = ["GOOGLE_API_KEY", "HEYGEN_API_KEY", "ELEVENLABS_API_KEY", "RUNWAY_API_KEY", "SUNO_API_KEY", "HF_TOKEN"];
  return (
    <g>
      <text x={W / 2} y={160} fontSize={44} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BƯỚC 2 — .ENV API KEY</text>
      {/* Required section */}
      <g transform="translate(60, 250)">
        <rect x={0} y={0} width={960} height={440} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
        <rect x={0} y={0} width={960} height={60} rx={20} fill="#D03020" />
        <rect x={0} y={40} width={960} height={20} fill="#D03020" />
        <text x={480} y={42} fontSize={28} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CHỒNG CẦN 3 KI NÀY</text>
        {required.map((r, i) => {
          const show = p > 3 + i * 1.5;
          if (!show) return null;
          return (
            <g key={r.key} opacity={interpolate(p, [3 + i * 1.5, 3 + i * 1.5 + 0.4], [0, 1], { extrapolateRight: "clamp" })}>
              <text x={30} y={120 + i * 110} fontSize={26} fill={INK} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{r.key}=</text>
              <text x={420} y={120 + i * 110} fontSize={26} fill={GOLD} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>••••••••••••</text>
              <text x={30} y={155 + i * 110} fontSize={20} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" opacity={0.7}>→ {r.hint}</text>
            </g>
          );
        })}
      </g>
      {/* Optional section */}
      <g transform="translate(60, 760)">
        <rect x={0} y={0} width={960} height={460} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4} opacity={0.85} />
        <rect x={0} y={0} width={960} height={60} rx={20} fill="#3AB070" />
        <rect x={0} y={40} width={960} height={20} fill="#3AB070" />
        <text x={480} y={42} fontSize={28} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CÓ CŨNG ĐƯỢC</text>
        {optional.map((o, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const show = p > 9 + i * 0.3;
          return show ? (
            <g key={o} opacity={interpolate(p, [9 + i * 0.3, 9 + i * 0.3 + 0.3], [0, 0.7], { extrapolateRight: "clamp" })}>
              <text x={40 + col * 460} y={120 + row * 110} fontSize={22} fill={INK} fontFamily="'JetBrains Mono', monospace">{o}=</text>
              <text x={260 + col * 460} y={120 + row * 110} fontSize={22} fill="#888" fontFamily="'JetBrains Mono', monospace">( )</text>
            </g>
          ) : null;
        })}
      </g>
      <g transform={`translate(920, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};

// Beat 6 & 7: real clips
const RealClip: React.FC<{ src: string; label: string }> = ({ src, label }) => (
  <>
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(src)} muted />
    </AbsoluteFill>
    <div style={{
      position: "absolute", top: 40, right: 40,
      background: INK, color: "#FFF", padding: "14px 28px", borderRadius: 12,
      fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800, fontSize: 22,
      border: `3px solid ${GOLD}`,
    }}>
      🔴 REAL · {label}
    </div>
  </>
);

// Beat 8: Tool teaser grid + outro
const Beat8: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(8);
  const p = Math.max(0, t - a);
  const tools = [
    { emo: "🎥", name: "Veo 3", sub: "Google" },
    { emo: "🎬", name: "Kling", sub: "AI video" },
    { emo: "⚡", name: "MiniMax", sub: "Hailuo" },
    { emo: "🎞️", name: "Runway", sub: "Gen 4" },
    { emo: "🗣️", name: "HeyGen", sub: "lip sync" },
    { emo: "🖼️", name: "FLUX", sub: "ảnh AI" },
    { emo: "🎨", name: "Imagen", sub: "Google" },
    { emo: "🎵", name: "Suno", sub: "nhạc có lời" },
    { emo: "✂️", name: "Auto-cut", sub: "silence" },
  ];
  return (
    <g>
      <text x={W / 2} y={130} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ĐỒ CHƠI CHƯA KHOE</text>
      <text x={W / 2} y={180} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.7}>Chờ tập sau chồng mở từng cái</text>
      {/* 3x3 grid */}
      <g transform="translate(60, 240)">
        {tools.map((tool, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const show = p > 3 + i * 0.4;
          const pulse = show ? Math.sin((p - (3 + i * 0.4)) * 3) * 0.03 + 1 : 1;
          return show ? (
            <g key={tool.name} opacity={interpolate(p, [3 + i * 0.4, 3 + i * 0.4 + 0.3], [0, 1], { extrapolateRight: "clamp" })}
              transform={`translate(${col * 320 + 160}, ${row * 220 + 110}) scale(${pulse})`}>
              <rect x={-140} y={-95} width={280} height={190} rx={18} fill="#FAFAF5" stroke={INK} strokeWidth={3.5} />
              <text x={0} y={-20} fontSize={50} textAnchor="middle">{tool.emo}</text>
              <text x={0} y={35} fontSize={24} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{tool.name}</text>
              <text x={0} y={65} fontSize={18} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{tool.sub}</text>
            </g>
          ) : null;
        })}
      </g>
      {/* Ep2 teaser + follow CTA */}
      {p > 24 && (
        <g opacity={interpolate(p, [24, 24.6], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={120} y={1280} width={840} height={200} rx={24} fill={ACCENT} stroke={INK} strokeWidth={4} />
          <text x={W / 2} y={1350} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>EP2 · TUẦN SAU</text>
          <text x={W / 2} y={1410} fontSize={28} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Ra lệnh cho chuẩn</text>
          <text x={W / 2} y={1445} fontSize={22} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.85}>để không bị đi lạc</text>
        </g>
      )}
      {/* Credit small */}
      <g transform="translate(540, 1560)">
        <text x={0} y={0} fontSize={18} fill={INK} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" opacity={0.55}>
          github.com/tanncsn00/AI-Editer · based on calesthio/OpenMontage ♥
        </text>
      </g>
      <g transform={`translate(920, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} waving />
      </g>
    </g>
  );
};

// =============== Main composition ===============
export const VibeEditingEp1: React.FC = () => {
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
  const b6 = B(6);
  const b7 = B(7);
  const b8 = B(8);

  const inBeat6 = t >= b6[0] && t < b6[1];
  const inBeat7 = t >= b7[0] && t < b7[1];

  return (
    <AbsoluteFill>
      <Audio src={staticFile("vibe_ep1/voice.mp3")} />
      {!inBeat6 && !inBeat7 && <Bg />}
      <Sequence from={Math.round(b6[0] * FPS)} durationInFrames={Math.round((b6[1] - b6[0]) * FPS)}>
        <RealClip src="vibe_ep1/clip6_placeholder.mp4" label="CLAUDE CHẠY" />
      </Sequence>
      <Sequence from={Math.round(b7[0] * FPS)} durationInFrames={Math.round((b7[1] - b7[0]) * FPS)}>
        <RealClip src="vibe_ep1/clip7_placeholder.mp4" label="OUTPUT MP4" />
      </Sequence>

      {!inBeat6 && !inBeat7 && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {t < e1 && <Beat1 t={t} mo={mo} />}
          {t >= B(2)[0] && t < e2 && <Beat2 t={t} mo={mo} />}
          {t >= B(3)[0] && t < e3 && <Beat3 t={t} mo={mo} />}
          {t >= B(4)[0] && t < e4 && <Beat4 t={t} mo={mo} />}
          {t >= B(5)[0] && t < e5 && <Beat5 t={t} mo={mo} />}
          {t >= B(8)[0] && t < b8[1] && <Beat8 t={t} mo={mo} />}
        </svg>
      )}

      <Caption />
    </AbsoluteFill>
  );
};
