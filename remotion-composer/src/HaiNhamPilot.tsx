import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { SigmaBody, SigmaHead, DerpHead } from "./FigureStyles";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// PILOT: "TẮT ĐIỆN THOẠI" — 2-character comedy sketch (~26s)
// Sigma walks up to Derp (scrolling phone) and drops a sigma wisdom bomb
// Proof-of-concept for animated comedy series

const FPS = 30;
const W = 1080;
const H = 1920;
const SKIN = "#C8C4BE";
const SHADOW = "#3A3A42";
const HAIR = "#0A0A0F";
const DERP_SKIN = "#EBE4D2";
const DERP_HAIR = "#1A1A1A";
const GOLD = "#E5C68A";

const GROUND_Y = 1420;

// ---------- TIMELINE CONSTANTS (seconds) ----------
const T_DERP_ALONE = [0.0, 2.5] as const;
const T_SIGMA_ENTER = [2.5, 5.0] as const;
const T_PAUSE_1 = [5.0, 5.3] as const;
const T_LINE_1 = [5.3, 6.9] as const;      // "Tắt điện thoại đi."
const T_DERP_SHOCK = [6.9, 8.6] as const;
const T_LINE_2 = [8.8, 11.7] as const;     // "Người mở lòng, không cần phản hồi."
const T_DERP_FROZEN = [11.7, 14.0] as const;
const T_SIGMA_LEAVE = [14.0, 16.5] as const;
const T_DERP_THINK = [16.5, 19.0] as const;
const T_ENLIGHTEN = [19.0, 22.0] as const;
const T_OUTRO = [22.0, 26.0] as const;

// ---------- SPEECH BUBBLE ----------
const SpeechBubble: React.FC<{
  x: number;
  y: number;
  text: string;
  enterFrame: number;
  exitFrame: number;
  color?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  tailSide?: "left" | "right" | "down";
}> = ({ x, y, text, enterFrame, exitFrame, color = "#F5F5F0", fontSize = 56, width = 320, height = 130, tailSide = "down" }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame || frame > exitFrame) return null;
  const sp = spring({
    frame: frame - enterFrame,
    fps: FPS,
    config: { damping: 10, stiffness: 160, mass: 0.5 },
  });
  const exitFade = interpolate(frame, [exitFrame - 8, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = sp * exitFade;
  const scale = 0.7 + sp * 0.3;
  let tail = "";
  if (tailSide === "down") tail = `M ${-30} ${height / 2 - 4} L ${-60} ${height / 2 + 50} L ${10} ${height / 2 - 4} Z`;
  if (tailSide === "left") tail = `M ${-width / 2 + 4} ${10} L ${-width / 2 - 50} ${30} L ${-width / 2 + 4} ${-20} Z`;
  if (tailSide === "right") tail = `M ${width / 2 - 4} ${10} L ${width / 2 + 50} ${30} L ${width / 2 - 4} ${-20} Z`;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      <path d={tail} fill={color} stroke="#0A0A0F" strokeWidth={6} strokeLinejoin="round" />
      <rect x={-width / 2} y={-height / 2} width={width} height={height} rx={60} fill={color} stroke="#0A0A0F" strokeWidth={6} />
      <text
        x={0}
        y={fontSize / 3}
        fontSize={fontSize}
        textAnchor="middle"
        fontFamily="'Be Vietnam Pro', sans-serif"
        fontWeight={800}
        fill="#0A0A0F"
        letterSpacing="2"
      >
        {text}
      </text>
    </g>
  );
};

// ---------- PHONE PROP ----------
const Phone: React.FC<{ x: number; y: number; scale: number; glow?: boolean }> = ({ x, y, scale, glow = false }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(-15)`}>
    {/* body */}
    <rect x={-14} y={-24} width={28} height={48} rx={4} fill="#1A1A22" stroke="#0A0A0F" strokeWidth={2.5} />
    {/* screen */}
    <rect x={-11} y={-20} width={22} height={38} fill={glow ? "#7CB8F0" : "#2A3040"} />
    {/* glow dots */}
    {glow && (
      <>
        <circle cx={-5} cy={-10} r={1.5} fill="#FFF" />
        <circle cx={3} cy={-5} r={1.5} fill="#FFF" />
        <circle cx={-2} cy={3} r={1.5} fill="#FFF" />
        <circle cx={5} cy={8} r={1.5} fill="#FFF" />
      </>
    )}
  </g>
);

// ---------- SIGMA MOUTH STATE ----------
const sigmaMouthAt = (t: number): number => {
  // Open during both line windows with jaw wobble
  const inLine1 = t >= T_LINE_1[0] && t <= T_LINE_1[1];
  const inLine2 = t >= T_LINE_2[0] && t <= T_LINE_2[1];
  if (!inLine1 && !inLine2) return 0;
  const base = 0.5 + 0.4 * Math.abs(Math.sin(t * 22));
  // fade at edges
  const window = inLine1 ? T_LINE_1 : T_LINE_2;
  const into = Math.min(1, (t - window[0]) / 0.1);
  const outof = Math.min(1, (window[1] - t) / 0.1);
  return base * Math.max(0, Math.min(into, outof));
};

const blinkAt = (t: number): number => {
  const period = 3.2;
  const dur = 0.15;
  const phase = t % period;
  if (phase < dur) return Math.sin((phase / dur) * Math.PI);
  return 0;
};

// ---------- BACKGROUND ----------
const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="bgHaiNham" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3A3F48" />
        <stop offset="70%" stopColor="#18191F" />
        <stop offset="100%" stopColor="#08090D" />
      </linearGradient>
      <filter id="grainHaiNham">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="6" />
        <feColorMatrix values="0 0 0 0 0.8  0 0 0 0 0.8  0 0 0 0 0.85  0 0 0 0.12 0" />
      </filter>
      <radialGradient id="bgSpot" cx="50%" cy="48%" r="55%">
        <stop offset="0%" stopColor="#5A6272" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#5A6272" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#bgHaiNham)" />
    <rect width={W} height={H} fill="url(#bgSpot)" />
    {/* Ground receding lines */}
    <line x1={0} y1={GROUND_Y + 8} x2={W} y2={GROUND_Y + 8} stroke="#5A6070" strokeWidth={3} opacity={0.7} />
    <line x1={0} y1={GROUND_Y + 70} x2={W} y2={GROUND_Y + 70} stroke="#3A4050" strokeWidth={1.5} opacity={0.5} />
    <line x1={0} y1={GROUND_Y + 140} x2={W} y2={GROUND_Y + 140} stroke="#2A3040" strokeWidth={1} opacity={0.35} />
    <rect width={W} height={H} filter="url(#grainHaiNham)" opacity={0.55} />
  </svg>
);

// ---------- BIG WORD OUTRO ----------
const BigWord: React.FC = () => {
  const frame = useCurrentFrame();
  const sf = T_OUTRO[0] * FPS;
  const ef = T_OUTRO[1] * FPS;
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
          textShadow: "0 0 60px rgba(229,198,138,0.5)",
          lineHeight: 1.05,
        }}>TƯ DUY<br/>MỞ</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontWeight: 300,
          fontSize: 26,
          color: GOLD,
          letterSpacing: "6px",
          marginTop: 42,
          textTransform: "uppercase",
        }}>Nguyễn Anh Dũng</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif",
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

// ---------- CHARACTERS ----------
const Sigma: React.FC<{ x: number; y: number; scale: number; flip: boolean; t: number; walkPhase: number }> = ({ x, y, scale, flip, t, walkPhase }) => {
  const mouth = sigmaMouthAt(t);
  const blink = blinkAt(t);
  const sx = flip ? -1 : 1;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * sx}, ${scale})`}>
      <SigmaBody x={0} y={0} scale={1} phase={t / 2} skinColor={SKIN} shadowColor={SHADOW} walkPhase={walkPhase} />
      {/* Head doesn't flip with body, draw normally (face features stay readable) */}
      <g transform={`scale(${sx}, 1)`}>
        <SigmaHead x={0} y={-72} scale={1} skinColor={SKIN} hairColor={HAIR} shadowColor={SHADOW} mouthOpen={mouth} blink={blink} />
      </g>
    </g>
  );
};

const Derp: React.FC<{ x: number; y: number; scale: number; t: number; phoneVisible: boolean; phoneGlow: boolean; headShake?: number }> = ({ x, y, scale, t, phoneVisible, phoneGlow, headShake = 0 }) => {
  const phase = t * 1.2;
  return (
    <g transform={`translate(${x}, ${y + headShake}) scale(${scale})`}>
      {/* Derp body (reuse from DerpHero concept) */}
      {/* Legs */}
      <path d={`M -22 150 Q -26 220 -24 290`} stroke={DERP_SKIN} strokeWidth={32} strokeLinecap="round" fill="none" />
      <path d={`M 22 150 Q 26 220 24 290`} stroke={DERP_SKIN} strokeWidth={32} strokeLinecap="round" fill="none" />
      <ellipse cx={-24} cy={296} rx={18} ry={6} fill="#1A1A1A" />
      <ellipse cx={24} cy={296} rx={18} ry={6} fill="#1A1A1A" />
      {/* Torso 6-pack */}
      <path d="M -62 -35 Q -70 -20 -64 0 L -52 80 Q -48 100 -38 115 Q -20 130 0 130 Q 20 130 38 115 Q 48 100 52 80 L 64 0 Q 70 -20 62 -35 Q 48 -48 28 -46 L 0 -44 L -28 -46 Q -48 -48 -62 -35 Z" fill={DERP_SKIN} stroke="#1A1A1A" strokeWidth={3} />
      <path d="M -50 -18 Q -28 -2 -3 -10" stroke="#1A1A1A" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M 50 -18 Q 28 -2 3 -10" stroke="#1A1A1A" strokeWidth={3} fill="none" strokeLinecap="round" />
      <line x1={0} y1={-8} x2={0} y2={108} stroke="#1A1A1A" strokeWidth={2.5} />
      <rect x={-20} y={12} width={18} height={22} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      <rect x={2} y={12} width={18} height={22} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      <rect x={-20} y={38} width={18} height={22} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      <rect x={2} y={38} width={18} height={22} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      <rect x={-18} y={64} width={16} height={20} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      <rect x={2} y={64} width={16} height={20} rx={3} fill="none" stroke="#1A1A1A" strokeWidth={2.2} />
      {/* Arms - holding phone position (right hand forward) */}
      <path d={`M -62 -25 Q -70 10 -52 30`} stroke={DERP_SKIN} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d={`M 62 -25 Q 70 10 52 30`} stroke={DERP_SKIN} strokeWidth={22} fill="none" strokeLinecap="round" />
      <circle cx={-52} cy={32} r={11} fill={DERP_SKIN} stroke="#1A1A1A" strokeWidth={3} />
      <circle cx={52} cy={32} r={11} fill={DERP_SKIN} stroke="#1A1A1A" strokeWidth={3} />
      {/* Phone in right hand */}
      {phoneVisible && <Phone x={52} y={36} scale={1.4} glow={phoneGlow} />}
      {/* Neck */}
      <path d="M -14 -48 L -16 -68 L 16 -68 L 14 -48 Z" fill={DERP_SKIN} stroke="#1A1A1A" strokeWidth={3} />
      {/* DERP HEAD */}
      <DerpHead x={0} y={0} scale={1} phase={phase} skinColor={DERP_SKIN} hairColor={DERP_HAIR} />
    </g>
  );
};

// ---------- MAIN ----------
export const HaiNhamPilot: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;

  const globalOp = interpolate(
    frame,
    [0, 10, durationInFrames - 10, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ------ Sigma position + walk phase ------
  let sigmaX = 1250;
  let sigmaWalkPhase = 0;
  if (t < T_SIGMA_ENTER[0]) {
    sigmaX = 1250;
  } else if (t < T_SIGMA_ENTER[1]) {
    sigmaX = interpolate(t, [T_SIGMA_ENTER[0], T_SIGMA_ENTER[1]], [1250, 740]);
    sigmaWalkPhase = (t - T_SIGMA_ENTER[0]) * 9;
  } else if (t < T_SIGMA_LEAVE[0]) {
    sigmaX = 740;
  } else if (t < T_SIGMA_LEAVE[1]) {
    sigmaX = interpolate(t, [T_SIGMA_LEAVE[0], T_SIGMA_LEAVE[1]], [740, 1350]);
    sigmaWalkPhase = (t - T_SIGMA_LEAVE[0]) * 9;
  } else {
    sigmaX = 1350;
  }
  const sigmaVisible = t < T_SIGMA_LEAVE[1] + 0.5;

  // ------ Derp state ------
  const derpX = 340;
  const derpY = GROUND_Y - 170;
  const phoneVisible = t < T_ENLIGHTEN[0] + 0.2;
  const phoneGlow = t < T_LINE_1[0];
  // small shake when shocked
  const headShake = t >= T_DERP_SHOCK[0] && t < T_DERP_SHOCK[1]
    ? Math.sin((t - T_DERP_SHOCK[0]) * 30) * 4
    : 0;

  // ------ Speech bubbles ------
  // Derp laughing bubble
  const bubbles: React.ReactNode[] = [];

  // Bubble 1: Derp haha
  bubbles.push(
    <SpeechBubble
      key="b1"
      x={derpX + 260}
      y={derpY - 280}
      text="HAHA 😂"
      enterFrame={Math.floor(0.2 * FPS)}
      exitFrame={Math.floor(T_DERP_ALONE[1] * FPS)}
      width={260}
      fontSize={54}
    />
  );

  // Bubble 2: Derp "...HẢ?"
  bubbles.push(
    <SpeechBubble
      key="b2"
      x={derpX - 220}
      y={derpY - 280}
      text="...HẢ ?"
      enterFrame={Math.floor(T_DERP_SHOCK[0] * FPS)}
      exitFrame={Math.floor(T_DERP_SHOCK[1] * FPS)}
      width={260}
      fontSize={58}
    />
  );

  // Bubble 3: Derp "..."
  bubbles.push(
    <SpeechBubble
      key="b3"
      x={derpX + 160}
      y={derpY - 260}
      text="..."
      enterFrame={Math.floor(T_DERP_THINK[0] * FPS)}
      exitFrame={Math.floor(T_DERP_THINK[1] * FPS)}
      width={180}
      height={100}
      fontSize={70}
    />
  );

  // Bubble 4: enlightenment lightbulb
  bubbles.push(
    <SpeechBubble
      key="b4"
      x={derpX + 160}
      y={derpY - 280}
      text="💡!"
      enterFrame={Math.floor(T_ENLIGHTEN[0] * FPS)}
      exitFrame={Math.floor(T_ENLIGHTEN[1] * FPS)}
      width={200}
      height={120}
      fontSize={70}
      color="#FFF5D0"
    />
  );

  // Sigma speech bubbles (for subtitles too, since voice is deep)
  bubbles.push(
    <SpeechBubble
      key="s1"
      x={sigmaX - 260}
      y={derpY - 300}
      text="Tắt điện thoại đi."
      enterFrame={Math.floor(T_LINE_1[0] * FPS)}
      exitFrame={Math.floor(T_LINE_1[1] * FPS)}
      width={460}
      height={120}
      fontSize={46}
    />
  );

  bubbles.push(
    <SpeechBubble
      key="s2"
      x={sigmaX - 280}
      y={derpY - 300}
      text="Người mở lòng, không cần phản hồi."
      enterFrame={Math.floor(T_LINE_2[0] * FPS)}
      exitFrame={Math.floor(T_LINE_2[1] * FPS)}
      width={620}
      height={130}
      fontSize={42}
    />
  );

  const bigActive = t >= T_OUTRO[0];

  return (
    <AbsoluteFill style={{ backgroundColor: "#08090D", opacity: globalOp }}>
      <Bg />

      {/* Title top */}
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, textAlign: "center", opacity: bigActive ? 0 : 0.7 }}>
        <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 28, color: "#A8B0C0", letterSpacing: 8 }}>
          — TIỂU PHẨM —
        </div>
        <div style={{ fontFamily: "'EB Garamond', Georgia, serif", fontSize: 44, color: "#EBE4D2", marginTop: 8, letterSpacing: 4, fontStyle: "italic" }}>
          "Tắt Điện Thoại"
        </div>
      </div>

      {/* Characters */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* Derp */}
        <g transform={`translate(0, 0)`}>
          <Derp x={derpX} y={derpY} scale={1.5} t={t} phoneVisible={phoneVisible} phoneGlow={phoneGlow} headShake={headShake} />
        </g>
        {/* Sigma */}
        {sigmaVisible && (
          <Sigma x={sigmaX} y={derpY - 20} scale={1.55} flip={true} t={t} walkPhase={sigmaWalkPhase} />
        )}
        {/* Speech bubbles on top */}
        {bubbles}
      </svg>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 58%, rgba(0,0,0,0) 34%, rgba(0,0,0,0.78) 100%)",
        }}
      />

      <BigWord />

      {/* Audio: 2 lines at their timings + music */}
      <Sequence from={Math.floor(T_LINE_1[0] * FPS)} durationInFrames={Math.ceil(1.6 * FPS)}>
        <Audio src={staticFile("comedy_pilot/line1.mp3")} volume={0.9} />
      </Sequence>
      <Sequence from={Math.floor(T_LINE_2[0] * FPS)} durationInFrames={Math.ceil(3.0 * FPS)}>
        <Audio src={staticFile("comedy_pilot/line2.mp3")} volume={0.9} />
      </Sequence>
      <Audio src={staticFile("comedy_pilot/music.mp3")} volume={0.08} />
    </AbsoluteFill>
  );
};
