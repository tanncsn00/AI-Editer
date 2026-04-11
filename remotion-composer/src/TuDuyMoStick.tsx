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

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// Tư Duy Mở · Pure-code stick figure version — no footage
// Scenes match 5 script beats from tu_duy_mo_01_words.json

const FPS = 30;
const W = 1080;
const H = 1920;
const BG = "#0A0B12";
const LINE = "#F2EFE8";
const GOLD = "#E5C68A";
const DIM = "#4A4D57";

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

// ---------- STICK FIGURE ----------
type Pose = "walk" | "idle" | "argue" | "cheer" | "sit" | "arms_up" | "think";

const StickFigure: React.FC<{
  x: number;
  y: number;
  scale: number;
  phase: number;
  pose: Pose;
  color?: string;
  flip?: boolean;
}> = ({ x, y, scale, phase, pose, color = LINE, flip = false }) => {
  const s = Math.sin(phase);
  const c = Math.cos(phase);
  let la = [0, 0], ra = [0, 0], ll = [0, 0], rl = [0, 0];
  let bob = 0;
  let tilt = 0;

  switch (pose) {
    case "walk":
      la = [s * 16, 42];
      ra = [-s * 16, 42];
      ll = [s * 14, 52];
      rl = [-s * 14, 52];
      bob = Math.abs(c) * 2.5;
      break;
    case "idle":
      la = [3, 48];
      ra = [-3, 48];
      ll = [-8, 54];
      rl = [8, 54];
      break;
    case "argue":
      la = [-22, 6 + s * 3];
      ra = [8, 44];
      ll = [-10, 52];
      rl = [10, 52];
      tilt = s * 3;
      break;
    case "cheer":
      la = [-20 + s * 2, -28 + c * 2];
      ra = [20 - s * 2, -28 + c * 2];
      ll = [-9, 54];
      rl = [9, 54];
      bob = Math.abs(Math.sin(phase / 2)) * 3;
      break;
    case "sit":
      ll = [-22, 28];
      rl = [22, 28];
      la = [-8, 26];
      ra = [8, 26];
      tilt = -2;
      break;
    case "arms_up":
      la = [-26, -34];
      ra = [26, -34];
      ll = [-9, 54];
      rl = [9, 54];
      break;
    case "think":
      la = [0, 46];
      ra = [-12, 6];
      ll = [-8, 54];
      rl = [8, 54];
      tilt = -4;
      break;
  }

  const sx = flip ? -1 : 1;
  const sw = 5 / scale;
  return (
    <g transform={`translate(${x}, ${y + bob}) scale(${scale * sx}, ${scale})`}>
      <circle cx={0} cy={-62 + tilt} r={13} fill="none" stroke={color} strokeWidth={sw} />
      <line x1={0} y1={-48} x2={0} y2={10} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={0} y1={-32} x2={la[0]} y2={-32 + la[1]} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={0} y1={-32} x2={ra[0]} y2={-32 + ra[1]} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={0} y1={10} x2={ll[0]} y2={10 + ll[1]} stroke={color} strokeWidth={sw} strokeLinecap="round" />
      <line x1={0} y1={10} x2={rl[0]} y2={10 + rl[1]} stroke={color} strokeWidth={sw} strokeLinecap="round" />
    </g>
  );
};

// ---------- SCENES ----------
// Scene 1: Crowd cheering, hero walks past them
const Scene1: React.FC<{ lf: number; dur: number }> = ({ lf, dur }) => {
  const phase = lf / 6;
  const heroX = interpolate(lf, [0, dur], [1050, 200]);
  const groundY = 1500;
  return (
    <g>
      <line x1={0} y1={groundY} x2={W} y2={groundY} stroke={DIM} strokeWidth={3} />
      <StickFigure x={720} y={groundY} scale={0.95} phase={phase + 0.3} pose="cheer" color={DIM} />
      <StickFigure x={820} y={groundY} scale={0.9} phase={phase + 0.9} pose="cheer" color={DIM} />
      <StickFigure x={910} y={groundY} scale={0.92} phase={phase + 1.5} pose="cheer" color={DIM} />
      {/* sparkle above crowd */}
      <text x={770} y={groundY - 200} fontSize={40} fill={DIM} textAnchor="middle">✨</text>
      <text x={880} y={groundY - 220} fontSize={32} fill={DIM} textAnchor="middle">✨</text>
      <StickFigure x={heroX} y={groundY} scale={1.5} phase={phase * 1.6} pose="walk" color={LINE} flip />
    </g>
  );
};

// Scene 2: Arguing cluster fg, hero walks across bg
const Scene2: React.FC<{ lf: number; dur: number }> = ({ lf, dur }) => {
  const phase = lf / 6;
  const heroX = interpolate(lf, [0, dur], [-80, W + 80]);
  return (
    <g>
      <line x1={0} y1={1180} x2={W} y2={1180} stroke={DIM} strokeWidth={2} opacity={0.45} />
      <StickFigure x={heroX} y={1180} scale={0.75} phase={phase * 1.2} pose="walk" color={LINE} />
      <line x1={0} y1={1500} x2={W} y2={1500} stroke={DIM} strokeWidth={3} />
      <StickFigure x={330} y={1500} scale={1.3} phase={phase * 1.5} pose="argue" color={DIM} />
      <StickFigure x={540} y={1500} scale={1.3} phase={phase * 1.5 + 2} pose="argue" color={DIM} flip />
      <StickFigure x={750} y={1500} scale={1.3} phase={phase * 1.5 + 1} pose="argue" color={DIM} />
      <text x={330} y={1280} fontSize={48} fill={DIM} textAnchor="middle" fontWeight="bold">!?</text>
      <text x={540} y={1270} fontSize={48} fill={DIM} textAnchor="middle" fontWeight="bold">?!</text>
      <text x={750} y={1280} fontSize={48} fill={DIM} textAnchor="middle" fontWeight="bold">!!</text>
    </g>
  );
};

// Scene 3: Diverging paths — crowd right, hero left (gold)
const Scene3: React.FC<{ lf: number; dur: number }> = ({ lf, dur }) => {
  const phase = lf / 6;
  const crowdX = interpolate(lf, [0, dur], [540, 860]);
  const crowdY = interpolate(lf, [0, dur], [1400, 1680]);
  const heroX = interpolate(lf, [0, dur], [540, 220]);
  const heroY = interpolate(lf, [0, dur], [1400, 1680]);
  return (
    <g>
      <path d={`M 540 1080 L 540 1400 L 900 1760`} stroke={DIM} strokeWidth={3} fill="none" />
      <path d={`M 540 1400 L 180 1760`} stroke={GOLD} strokeWidth={3} fill="none" strokeDasharray="12 8" />
      {/* fork label */}
      <circle cx={540} cy={1400} r={8} fill={GOLD} />
      <StickFigure x={crowdX} y={crowdY} scale={0.9} phase={phase * 1.5} pose="walk" color={DIM} />
      <StickFigure x={crowdX - 45} y={crowdY - 12} scale={0.85} phase={phase * 1.5 + 1.5} pose="walk" color={DIM} />
      <StickFigure x={crowdX - 90} y={crowdY - 22} scale={0.88} phase={phase * 1.5 + 0.8} pose="walk" color={DIM} />
      <StickFigure x={heroX} y={heroY} scale={1.15} phase={phase * 1.3} pose="walk" color={GOLD} flip />
    </g>
  );
};

// Scene 4: Walking out of a box (comfort zone), box dissolves
const Scene4: React.FC<{ lf: number; dur: number }> = ({ lf, dur }) => {
  const phase = lf / 6;
  const boxOp = interpolate(lf, [0, dur * 0.8], [0.85, 0.12], { extrapolateRight: "clamp" });
  const heroX = interpolate(lf, [0, dur], [540, 920]);
  return (
    <g>
      <line x1={0} y1={1500} x2={W} y2={1500} stroke={DIM} strokeWidth={3} />
      <rect
        x={240}
        y={1180}
        width={380}
        height={320}
        fill="none"
        stroke={DIM}
        strokeWidth={5}
        strokeDasharray="16 10"
        opacity={boxOp}
      />
      {/* chains drop visual (tiny marks) */}
      <line x1={260} y1={1500} x2={260} y2={1540} stroke={DIM} strokeWidth={3} opacity={boxOp} />
      <line x1={600} y1={1500} x2={600} y2={1540} stroke={DIM} strokeWidth={3} opacity={boxOp} />
      <StickFigure x={heroX} y={1500} scale={1.35} phase={phase * 1.4} pose="walk" color={LINE} />
    </g>
  );
};

// Scene 5: Hero sits, then stands with arms up. Light rays appear on stand.
const Scene5: React.FC<{ lf: number; dur: number }> = ({ lf, dur }) => {
  const phase = lf / 8;
  const progress = lf / dur;
  const standing = progress > 0.5;
  const heroY = standing ? 1500 : 1560;
  const pose: Pose = standing ? "arms_up" : "sit";
  const color = standing ? GOLD : LINE;
  const rayOp = standing
    ? interpolate(progress, [0.5, 0.85], [0, 0.55], { extrapolateRight: "clamp" })
    : 0;
  return (
    <g>
      <line x1={0} y1={1500} x2={W} y2={1500} stroke={DIM} strokeWidth={3} />
      {rayOp > 0 && (
        <g opacity={rayOp}>
          {[-180, -120, -60, 0, 60, 120, 180].map((ox, i) => (
            <line
              key={i}
              x1={540 + ox * 1.5}
              y1={100}
              x2={540 + ox * 0.4}
              y2={1400}
              stroke={GOLD}
              strokeWidth={2}
              opacity={0.5}
            />
          ))}
        </g>
      )}
      <StickFigure x={540} y={heroY} scale={1.55} phase={phase} pose={pose} color={color} />
    </g>
  );
};

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
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 260 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 14px", maxWidth: 900, padding: "0 60px" }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [8, 0]);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
                fontWeight: 600,
                fontSize: 44,
                color: LINE,
                textShadow: "0 2px 10px rgba(0,0,0,0.95), 0 0 20px rgba(10,11,18,0.95)",
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
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity, backgroundColor: "rgba(5,7,12,0.85)" }}>
      <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
        <div style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontWeight: 500,
          fontSize: 200,
          color: LINE,
          letterSpacing: "14px",
          textShadow: "0 0 60px rgba(229,198,138,0.5), 0 10px 30px rgba(0,0,0,0.95)",
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

type SceneDef = { start: number; end: number; render: (lf: number, dur: number) => React.ReactNode };
const SCENES: SceneDef[] = [
  { start: 0,   end: 172, render: (lf, dur) => <Scene1 lf={lf} dur={dur} /> },
  { start: 172, end: 364, render: (lf, dur) => <Scene2 lf={lf} dur={dur} /> },
  { start: 364, end: 575, render: (lf, dur) => <Scene3 lf={lf} dur={dur} /> },
  { start: 575, end: 740, render: (lf, dur) => <Scene4 lf={lf} dur={dur} /> },
  { start: 740, end: 894, render: (lf, dur) => <Scene5 lf={lf} dur={dur} /> },
];

export const TuDuyMoStick: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const globalOp = interpolate(frame, [0, 14, durationInFrames - 14, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bigActive = t >= BIG_START && t <= BIG_END;

  return (
    <AbsoluteFill style={{ backgroundColor: BG, opacity: globalOp }}>
      {/* faint grid */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 100} x2={W} y2={i * 100} stroke="#141621" strokeWidth={1} />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`v${i}`} x1={i * 108} y1={0} x2={i * 108} y2={H} stroke="#141621" strokeWidth={1} />
        ))}
      </svg>
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.8) 100%)" }} />
      {/* scene layer */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {SCENES.map((s, i) => {
          if (frame < s.start - 10 || frame > s.end + 10) return null;
          const fadeIn = interpolate(frame, [s.start - 8, s.start + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const fadeOut = interpolate(frame, [s.end - 8, s.end + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const op = Math.min(fadeIn, fadeOut);
          return <g key={i} opacity={op}>{s.render(frame - s.start, s.end - s.start)}</g>;
        })}
      </svg>
      <Caption hide={bigActive} />
      <BigWord />
      <Audio src={staticFile("tu_duy_mo_01_voice.mp3")} volume={0.82} />
      <Audio src={staticFile("tu_duy_mo_01_music.mp3")} volume={0.07} />
    </AbsoluteFill>
  );
};
