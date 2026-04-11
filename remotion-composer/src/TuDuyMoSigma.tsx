import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import wordsData from "./tu_duy_mo_01_words.json";
import { SigmaHead, SigmaBody } from "./FigureStyles";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// Tư Duy Mở — SIGMA edition · meme mascot talking + deep voice contrast
// 30s narration + 2s big word outro = 32s (960 frames @30fps)

const FPS = 30;
const W = 1080;
const H = 1920;
const SKIN = "#C8C4BE";
const SHADOW = "#3A3A42";
const HAIR = "#0A0A0F";
const GOLD = "#E5C68A";

type Word = { word: string; start: number; end: number };
const words = wordsData as Word[];

type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  for (const w of words) {
    buf.push(w);
    if (/[.!?]$/.test(w.word)) {
      out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
      buf = [];
    }
  }
  if (buf.length) out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
  return out;
})();

// ---------- LIP SYNC: mouth open amount at time t ----------
const mouthOpenAt = (t: number): number => {
  let active: Word | null = null;
  for (const w of words) {
    if (t >= w.start - 0.04 && t < w.end + 0.04) {
      active = w;
      break;
    }
  }
  if (!active) return 0;
  // Fast jaw wobble (~4Hz) + medium shape modulation
  const wobble = 0.5 + 0.4 * Math.abs(Math.sin(t * 22));
  const shape = 0.5 + 0.5 * Math.sin(t * 11 + active.start * 3);
  const base = wobble * 0.7 + shape * 0.3;
  // Fade edges so mouth doesn't snap shut
  const into = Math.min(1, (t - active.start + 0.04) / 0.08);
  const outof = Math.min(1, (active.end + 0.04 - t) / 0.08);
  const edge = Math.max(0, Math.min(into, outof));
  return base * edge;
};

// ---------- BLINK: periodic eye close ----------
const blinkAt = (t: number): number => {
  const period = 3.7;
  const blinkDur = 0.16;
  const phase = t % period;
  if (phase < blinkDur) {
    const p = phase / blinkDur;
    return Math.sin(p * Math.PI); // 0 → 1 → 0
  }
  return 0;
};

// ---------- BACKGROUND: sigma poster ----------
const BgSigmaPoster: React.FC<{ pulse: number }> = ({ pulse }) => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="sigmaBg2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3A3F48" />
        <stop offset="100%" stopColor="#15181F" />
      </linearGradient>
      <filter id="posterGrain2">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
        <feColorMatrix values="0 0 0 0 0.8  0 0 0 0 0.8  0 0 0 0 0.85  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="sigmaSpot2" cx="50%" cy="42%" r={`${55 + pulse * 8}%`}>
        <stop offset="0%" stopColor="#6A7080" stopOpacity={0.4 + pulse * 0.1} />
        <stop offset="100%" stopColor="#6A7080" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#sigmaBg2)" />
    <rect width={W} height={H} fill="url(#sigmaSpot2)" />
    {/* Huge SIGMA text behind — subtle */}
    <text
      x={W/2}
      y={580}
      fontSize={320}
      fill="#4A5060"
      textAnchor="middle"
      fontFamily="'EB Garamond', Georgia, serif"
      fontWeight={700}
      letterSpacing="16"
      opacity={0.35}
    >
      SIGMA
    </text>
    <rect width={W} height={H} filter="url(#posterGrain2)" opacity={0.55} />
  </svg>
);

// ---------- CAPTION ----------
const Caption: React.FC<{ hide: boolean }> = ({ hide }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let active: Sentence | null = null;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i + 1];
    const boundary = next ? next.start : s.end + 0.7;
    if (t >= s.start - 0.15 && t < boundary) {
      active = s;
      break;
    }
  }
  if (!active || hide) return null;
  const LEAD = 0.12;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 220 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px", maxWidth: 900, padding: "0 60px" }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [10, 0]);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
                fontWeight: 600,
                fontSize: 42,
                color: "#E8EAEF",
                textShadow: "0 2px 12px rgba(0,0,0,0.98), 0 0 24px rgba(15,18,24,0.95)",
                opacity: visible ? sp : 0,
                transform: `translateY(${y}px)`,
                lineHeight: 1.35,
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const BIG_START = 29.8;
const BIG_END = 32.0;

const BigWord: React.FC = () => {
  const frame = useCurrentFrame();
  const sf = BIG_START * FPS;
  const ef = BIG_END * FPS;
  if (frame < sf - 4) return null;
  const sp = spring({ frame: frame - sf, fps: FPS, config: { damping: 12, stiffness: 80, mass: 1.4 } });
  const fadeOut = interpolate(frame, [ef - 18, ef], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = sp * fadeOut;
  const scale = interpolate(sp, [0, 1], [1.7, 1.0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity, backgroundColor: "rgba(5,7,12,0.88)" }}>
      <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
        <div style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontWeight: 500,
          fontSize: 200,
          color: "#EBE4D2",
          letterSpacing: "14px",
          textShadow: "0 0 60px rgba(229,198,138,0.5), 0 10px 30px rgba(0,0,0,0.95)",
          lineHeight: 1.05,
        }}>TƯ DUY<br/>MỞ</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: 26,
          color: GOLD,
          letterSpacing: "6px",
          marginTop: 42,
          textTransform: "uppercase",
        }}>Nguyễn Anh Dũng</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
          fontWeight: 400,
          fontSize: 22,
          color: "#C8C0B0",
          letterSpacing: "3px",
          marginTop: 18,
        }}>Link sách ở bình luận 👇</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- MAIN COMPOSITION ----------
export const TuDuyMoSigma: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const globalOp = interpolate(
    frame,
    [0, 14, durationInFrames - 14, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Subtle camera push-in: 1.0 → 1.06 over 30s
  const camScale = interpolate(t, [0, 30], [1.0, 1.06], { extrapolateRight: "clamp" });

  // Pulse background with voice activity (rough envelope)
  const mouth = mouthOpenAt(t);
  const pulse = interpolate(mouth, [0, 1], [0, 1]);

  // Subtle head bob per beat — use sine of slow time
  const headBob = Math.sin(t * 0.6) * 6;
  const headTilt = Math.sin(t * 0.4) * 0.8;

  // Blink
  const blink = blinkAt(t);

  const bigActive = t >= BIG_START && t <= BIG_END;

  return (
    <AbsoluteFill style={{ backgroundColor: "#10131A", opacity: globalOp }}>
      <BgSigmaPoster pulse={pulse} />

      {/* Sigma hero — centered, with camera push + subtle bob */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${W/2}, ${1050 + headBob}) scale(${1.6 * camScale}) rotate(${headTilt})`}>
          <SigmaBody x={0} y={0} scale={1} phase={t / 2} skinColor={SKIN} shadowColor={SHADOW} />
          <SigmaHead
            x={0}
            y={-72}
            scale={1}
            skinColor={SKIN}
            hairColor={HAIR}
            shadowColor={SHADOW}
            mouthOpen={mouth}
            blink={blink}
          />
        </g>
      </svg>

      {/* Vignette tightens with pulse */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) ${28 - pulse * 4}%, rgba(0,0,0,${0.82 + pulse * 0.05}) 100%)`,
        }}
      />

      <Caption hide={bigActive} />
      <BigWord />

      <Audio src={staticFile("tu_duy_mo_01_voice.mp3")} volume={0.85} />
      <Audio src={staticFile("tu_duy_mo_01_music.mp3")} volume={0.07} />
    </AbsoluteFill>
  );
};
