import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import wordsData from "./tu_duy_mo_01_words.json";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// Tư Duy Mở · Tập 1 — Affiliate wisdom reel (30s)
// Env: lone figure urban contemplative · Voice: minhtriet 0.95x
// Outro: TƯ DUY MỞ big word (29.8 - 32.0)

const FPS = 30;
const EMPHASIS = "#E5C68A"; // warm gold — open mind
const BODY = "#F2EFE8";

type Word = { word: string; start: number; end: number };
const words = wordsData as Word[];

type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  for (const w of words) {
    buf.push(w);
    if (/[.!?]$/.test(w.word)) {
      out.push({ words: buf, start: buf[0].start, end: buf[buf.length-1].end });
      buf = [];
    }
  }
  if (buf.length) out.push({ words: buf, start: buf[0].start, end: buf[buf.length-1].end });
  return out;
})();

const EMPH = new Set<string>([
  "mở,", "mình.",
  "đám", "đông,", "theo.",
  "chậm,", "khác.",
  "lầm,", "nhận,", "quen.",
  "sai,", "lòng", "đầu.",
]);
const isEmph = (w: string): boolean => EMPH.has(w.toLowerCase());

const BIG_START = 29.8;
const BIG_END = 32.0;

type Cut = { src: string; start: number; end: number; sf?: number; st?: number };
// All clips: lone figure urban contemplative mood — bg continuity
const CUTS: Cut[] = [
  // HOOK 0-5.72
  { src: "tu_duy_mo_01/clip_01_30340084.mp4", start: 0.0,  end: 2.9,  sf: 1.04, st: 1.12 },
  { src: "tu_duy_mo_01/clip_02_20657498.mp4", start: 2.9,  end: 5.72, sf: 1.02, st: 1.10 },
  // OBSERVE_1 5.72-12.12
  { src: "tu_duy_mo_01/clip_03_18075634.mp4", start: 5.72, end: 9.0,  sf: 1.03, st: 1.12 },
  { src: "tu_duy_mo_01/clip_04_36296849.mp4", start: 9.0,  end: 12.12,sf: 1.02, st: 1.10 },
  // OBSERVE_2 12.12-19.18
  { src: "tu_duy_mo_01/clip_05_9902441.mp4",  start: 12.12,end: 15.6, sf: 1.04, st: 1.14 },
  { src: "tu_duy_mo_01/clip_06_28078200.mp4", start: 15.6, end: 19.18,sf: 1.02, st: 1.10 },
  // REFUSE 19.18-24.66
  { src: "tu_duy_mo_01/clip_07_7447993.mp4",  start: 19.18,end: 22.0, sf: 1.03, st: 1.12 },
  { src: "tu_duy_mo_01/clip_08_19157961.mp4", start: 22.0, end: 24.66,sf: 1.04, st: 1.14 },
  // RESOLUTION 24.66-29.78
  { src: "tu_duy_mo_01/clip_09_35797550.mp4", start: 24.66,end: 27.3, sf: 1.02, st: 1.10 },
  { src: "tu_duy_mo_01/clip_10_29539236.mp4", start: 27.3, end: 32.0, sf: 1.02, st: 1.12 },
];

// Deterministic pseudo-random based on seed — so particles are consistent across re-renders
const rnd = (seed: number): number => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

type Particle = {
  x: number;      // 0-1 normalized
  y: number;      // 0-1
  size: number;   // px
  drift: number;  // horizontal drift amplitude
  speed: number;  // vertical speed (px/frame)
  phase: number;  // breathing phase offset
  op: number;     // base opacity
};

const PARTICLES: Particle[] = Array.from({ length: 85 }, (_, i) => ({
  x: rnd(i * 7 + 1),
  y: rnd(i * 13 + 3),
  size: 2 + rnd(i * 17 + 5) * 5,
  drift: 18 + rnd(i * 23 + 7) * 32,
  speed: 0.12 + rnd(i * 29 + 11) * 0.35,
  phase: rnd(i * 31 + 13) * Math.PI * 2,
  op: 0.12 + rnd(i * 37 + 17) * 0.38,
}));

const DustLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const W = 1080;
  const H = 1920;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, filter: "blur(0.6px)" }}>
        {PARTICLES.map((p, i) => {
          const t = frame;
          // Wrap vertically — particles drift up slowly
          const y = ((p.y * H - t * p.speed) % (H + 40) + (H + 40)) % (H + 40) - 20;
          const x = p.x * W + Math.sin((t / 60) + p.phase) * p.drift;
          const breathe = 0.55 + 0.45 * Math.sin((t / 45) + p.phase * 2);
          const opacity = p.op * breathe;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={p.size}
              fill="#E5C68A"
              opacity={opacity}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const CutLayer: React.FC<{ cut: Cut }> = ({ cut }) => {
  const frame = useCurrentFrame();
  const sf = cut.start * FPS;
  const ef = cut.end * FPS;
  const fade = 10;
  const opacity = interpolate(frame, [sf - fade, sf + fade, ef - fade, ef + fade], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (opacity <= 0) return null;
  const scale = interpolate(frame - sf, [0, ef - sf], [cut.sf ?? 1.02, cut.st ?? 1.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, filter: "brightness(0.42) saturate(0.65) contrast(1.12)" }}>
        <OffthreadVideo src={staticFile(cut.src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ hide: boolean }> = ({ hide }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let active: Sentence | null = null;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i+1];
    const boundary = next ? next.start : s.end + 0.7;
    if (t >= s.start - 0.15 && t < boundary) { active = s; break; }
  }
  if (!active || hide) return null;
  const LEAD = 0.12;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 16px", maxWidth: 920, padding: "0 60px" }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [10, 0]);
          const blur = interpolate(sp, [0, 1], [3, 0]);
          const emph = isEmph(w.word);
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontWeight: emph ? 800 : 600,
              fontSize: emph ? 60 : 50,
              color: emph ? EMPHASIS : BODY,
              textShadow: emph ? "0 0 24px rgba(229,198,138,0.55), 0 4px 14px rgba(0,0,0,0.95)" : "0 3px 12px rgba(0,0,0,0.95)",
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

const BigWord: React.FC = () => {
  const frame = useCurrentFrame();
  const sf = BIG_START * FPS;
  const ef = BIG_END * FPS;
  if (frame < sf - 4) return null;
  const sp = spring({ frame: frame - sf, fps: FPS, config: { damping: 12, stiffness: 80, mass: 1.4 } });
  const fadeOut = interpolate(frame, [ef - 18, ef], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = sp * fadeOut;
  const scale = interpolate(sp, [0, 1], [1.7, 1.0]);
  const blur = interpolate(sp, [0, 1], [14, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)`, textAlign: "center" }}>
        <div style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontWeight: 500,
          fontSize: 200,
          color: BODY,
          letterSpacing: "14px",
          textShadow: "0 0 60px rgba(229,198,138,0.5), 0 0 180px rgba(229,198,138,0.3), 0 10px 30px rgba(0,0,0,0.95)",
          lineHeight: 1.05,
        }}>TƯ DUY<br/>MỞ</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: 26,
          color: "#D4B878",
          letterSpacing: "6px",
          marginTop: 42,
          textTransform: "uppercase",
          textShadow: "0 2px 10px rgba(0,0,0,0.95)",
        }}>Nguyễn Anh Dũng</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
          fontWeight: 400,
          fontSize: 22,
          color: "#C8C0B0",
          letterSpacing: "3px",
          marginTop: 18,
          textShadow: "0 2px 10px rgba(0,0,0,0.95)",
        }}>Link sách ở bình luận 👇</div>
      </div>
    </AbsoluteFill>
  );
};

export const TuDuyMoTap01: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const globalOpacity = interpolate(frame, [0, 14, durationInFrames - 14, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bigActive = t >= BIG_START && t <= BIG_END;
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070B", opacity: globalOpacity }}>
      {CUTS.map((c, i) => <CutLayer key={i} cut={c} />)}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 22%, rgba(0,0,0,0.86) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.18) 70%, rgba(0,0,0,0.72) 100%)" }} />
      <DustLayer />
      <Caption hide={bigActive} />
      <BigWord />
      <Audio src={staticFile("tu_duy_mo_01_voice.mp3")} volume={0.82} />
      <Audio src={staticFile("tu_duy_mo_01_music.mp3")} volume={0.08} />
    </AbsoluteFill>
  );
};
