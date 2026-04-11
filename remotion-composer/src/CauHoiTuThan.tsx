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
import { EmMituOt, AnhGach, EmEmotion } from "./CoupleChars";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// CÂU HỎI TỬ THẦN — Tập 1
// Duo: Em Mít Ướt × Anh Gạch
// Duration: 30s (900 frames @30fps)

const FPS = 30;
const W = 1080;
const H = 1920;
const INK = "#1A1820";
const PAPER = "#F3EAD8";

// ---------- BEAT TIMINGS ----------
const T = {
  coldOpen: [0.0, 3.0] as const,
  anhEnter: [3.0, 5.4] as const,
  L1_anh: [3.0, 5.4] as const,
  emTurn: [5.4, 5.8] as const,
  L2_em: [5.8, 8.4] as const,
  hold: [8.4, 10.5] as const,
  silence1: [10.5, 12.2] as const,
  silence2: [12.2, 13.8] as const,
  silence3: [13.8, 15.5] as const,
  build: [15.5, 17.5] as const,
  L3_anh: [17.5, 18.6] as const,
  deadSilence: [18.6, 19.5] as const,
  L4_em: [19.5, 21.7] as const,
  explosionDecay: [21.7, 24.5] as const,
  aftermath: [24.5, 28.0] as const,
  outro: [28.0, 30.0] as const,
};

const inRange = (t: number, r: readonly [number, number]) => t >= r[0] && t < r[1];

// ---------- BACKGROUND: living room stage ----------
const Bg: React.FC<{ redFlash: number; shakeX: number; shakeY: number }> = ({ redFlash, shakeX, shakeY }) => (
  <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="bgRoom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8D8BC" />
          <stop offset="60%" stopColor="#D4C2A2" />
          <stop offset="100%" stopColor="#A89070" />
        </linearGradient>
        <filter id="grainCHTT">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="8" />
          <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0 0.14  0 0 0 0.18 0" />
        </filter>
      </defs>
      <rect width={W} height={H} fill="url(#bgRoom)" />

      {/* Wall paneling hint */}
      <line x1={0} y1={1100} x2={W} y2={1100} stroke="#8A7250" strokeWidth={3} opacity={0.55} />

      {/* Sofa — simple silhouette */}
      <g transform="translate(0, 1200)">
        {/* sofa back */}
        <rect x={100} y={-20} width={880} height={220} rx={30} fill="#5E4030" stroke={INK} strokeWidth={4} />
        {/* cushions */}
        <rect x={140} y={50} width={260} height={140} rx={20} fill="#7A5238" stroke={INK} strokeWidth={3} />
        <rect x={410} y={50} width={260} height={140} rx={20} fill="#7A5238" stroke={INK} strokeWidth={3} />
        <rect x={680} y={50} width={260} height={140} rx={20} fill="#7A5238" stroke={INK} strokeWidth={3} />
        {/* seat */}
        <rect x={80} y={200} width={920} height={130} rx={20} fill="#4A3020" stroke={INK} strokeWidth={4} />
        {/* legs */}
        <rect x={120} y={330} width={16} height={30} fill={INK} />
        <rect x={944} y={330} width={16} height={30} fill={INK} />
      </g>

      {/* Floor */}
      <rect x={0} y={1560} width={W} height={360} fill="#A88862" />
      <line x1={0} y1={1560} x2={W} y2={1560} stroke={INK} strokeWidth={3} opacity={0.6} />

      {/* Wall painting (for decor) */}
      <g transform="translate(780, 700)">
        <rect x={-60} y={-70} width={120} height={140} fill="#F3EAD8" stroke={INK} strokeWidth={4} />
        <circle cx={0} cy={-20} r={25} fill="#D8A060" opacity={0.8} />
        <path d="M -40 40 Q 0 0 40 40" stroke="#5E4030" strokeWidth={3} fill="none" />
      </g>

      {/* Grain */}
      <rect width={W} height={H} filter="url(#grainCHTT)" opacity={0.45} />

      {/* Red flash overlay for explosion */}
      {redFlash > 0 && (
        <rect width={W} height={H} fill="#D02020" opacity={redFlash * 0.35} />
      )}
    </svg>
  </AbsoluteFill>
);

// ---------- ANGER VEIN (external, over-head) ----------
const AngerVein: React.FC<{ x: number; y: number; scale: number; pulse: number }> = ({ x, y, scale, pulse }) => {
  const s = scale * (0.85 + Math.sin(pulse * 8) * 0.1);
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`}>
      <path d="M 0 -14 L 6 -4 L 14 0 L 6 4 L 0 14 L -6 4 L -14 0 L -6 -4 Z" fill="#D0443C" stroke={INK} strokeWidth={2} />
      <path d="M -4 -4 L 4 4 M 4 -4 L -4 4" stroke={INK} strokeWidth={1.5} />
    </g>
  );
};

// ---------- SCREEN SHAKE VALUE ----------
const shakeAt = (t: number): { x: number; y: number } => {
  if (!inRange(t, T.L4_em) && !inRange(t, T.explosionDecay)) return { x: 0, y: 0 };
  const phase = inRange(t, T.L4_em)
    ? 1
    : interpolate(t, [T.explosionDecay[0], T.explosionDecay[1]], [1, 0], { extrapolateRight: "clamp" });
  const x = Math.sin(t * 110) * 22 * phase;
  const y = Math.cos(t * 130) * 18 * phase;
  return { x, y };
};

// ---------- CAPTION BUBBLE (sits above speaker) ----------
// Uses foreignObject + HTML flex so long text auto-wraps within bubble rect
const Caption: React.FC<{
  text: string;
  from: number;
  to: number;
  x: number;
  y: number;
  width: number;
  height?: number;
  fontSize?: number;
  tailSide?: "down" | "left" | "right";
  color?: string;
}> = ({ text, from, to, x, y, width, height = 120, fontSize = 48, tailSide = "down", color = "#F5F5F0" }) => {
  const frame = useCurrentFrame();
  if (frame < from * FPS || frame > to * FPS) return null;
  const sp = spring({ frame: frame - from * FPS, fps: FPS, config: { damping: 10, stiffness: 160, mass: 0.5 } });
  const exitFade = interpolate(frame, [(to - 0.25) * FPS, to * FPS], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = sp * exitFade;
  const scale = 0.7 + sp * 0.3;
  let tail = "";
  if (tailSide === "down") tail = `M ${-30} ${height / 2 - 4} L ${-60} ${height / 2 + 50} L ${10} ${height / 2 - 4} Z`;
  if (tailSide === "left") tail = `M ${-width / 2 + 4} ${10} L ${-width / 2 - 50} ${30} L ${-width / 2 + 4} ${-20} Z`;
  if (tailSide === "right") tail = `M ${width / 2 - 4} ${10} L ${width / 2 + 50} ${30} L ${width / 2 - 4} ${-20} Z`;
  const pad = 30;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      <path d={tail} fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <rect x={-width / 2} y={-height / 2} width={width} height={height} rx={50} fill={color} stroke={INK} strokeWidth={5} />
      <foreignObject x={-width / 2 + pad} y={-height / 2 + 8} width={width - pad * 2} height={height - 16}>
        <div
          // @ts-expect-error xmlns is needed for foreignObject HTML
          xmlns="http://www.w3.org/1999/xhtml"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            textAlign: "center",
            fontFamily: "'Be Vietnam Pro', 'Inter', sans-serif",
            fontSize: `${fontSize}px`,
            fontWeight: 700,
            color: INK,
            lineHeight: 1.15,
            letterSpacing: "0.5px",
            wordBreak: "keep-all",
            overflowWrap: "break-word",
          }}
        >
          {text}
        </div>
      </foreignObject>
    </g>
  );
};

// ---------- MAIN ----------
export const CauHoiTuThan: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;

  const globalOp = interpolate(
    frame,
    [0, 10, durationInFrames - 10, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ------ Anh position + walk phase ------
  let anhX = 1400;
  let anhWalkPhase = 0;
  if (t < T.anhEnter[0]) {
    anhX = 1400;
  } else if (t < T.anhEnter[1]) {
    anhX = interpolate(t, [T.anhEnter[0], T.anhEnter[1]], [1400, 780]);
    anhWalkPhase = (t - T.anhEnter[0]) * 10;
  } else if (t < T.aftermath[1] - 2) {
    anhX = 780;
    anhWalkPhase = 0;
  } else {
    // Anh walks out left rapidly
    anhX = interpolate(t, [T.aftermath[1] - 2, T.aftermath[1]], [780, -200]);
    anhWalkPhase = (t - (T.aftermath[1] - 2)) * 16;
  }

  // ------ Em position (mostly static on sofa) ------
  const emX = 340;
  const emY = 1340; // sitting on sofa

  // ------ Em emotion state ------
  let emEmotion: EmEmotion = "angry";
  if (inRange(t, T.L2_em) || inRange(t, T.hold)) emEmotion = "angry";
  if (inRange(t, T.silence1) || inRange(t, T.silence2) || inRange(t, T.silence3)) emEmotion = "angry";
  if (inRange(t, T.build)) emEmotion = "angry";
  if (inRange(t, T.L3_anh)) emEmotion = "shocked";
  if (inRange(t, T.deadSilence)) emEmotion = "shocked";
  if (inRange(t, T.L4_em) || inRange(t, T.explosionDecay)) emEmotion = "angry";
  if (inRange(t, T.aftermath) || inRange(t, T.outro)) emEmotion = "angry";

  // Em tilt toward camera at question time
  const emTurnAmount = inRange(t, T.emTurn) ? interpolate(t, [T.emTurn[0], T.emTurn[1]], [0, 1]) : (t >= T.L2_em[0] ? 1 : 0);

  // ------ Vein scale ------
  let veinScale = 1;
  if (t < T.coldOpen[1]) veinScale = 1;
  else if (inRange(t, T.L2_em)) veinScale = 1.3;
  else if (inRange(t, T.hold)) veinScale = 1.4;
  else if (inRange(t, T.silence1)) veinScale = 1.5;
  else if (inRange(t, T.silence2)) veinScale = 1.7;
  else if (inRange(t, T.silence3)) veinScale = 2.0;
  else if (inRange(t, T.build)) veinScale = 2.4;
  else if (inRange(t, T.L4_em)) veinScale = 3.0;
  else if (inRange(t, T.explosionDecay)) veinScale = interpolate(t, [T.explosionDecay[0], T.explosionDecay[1]], [3.0, 1.5]);
  else if (inRange(t, T.aftermath)) veinScale = 1.2;

  // ------ Screen shake + red flash ------
  const { x: shkX, y: shkY } = shakeAt(t);
  const redFlash = inRange(t, T.L4_em) ? 1 : (inRange(t, T.explosionDecay) ? interpolate(t, [T.explosionDecay[0], T.explosionDecay[1]], [1, 0], { extrapolateRight: "clamp" }) : 0);

  // ------ Camera zoom on Em face (beats 3, 4, 5) ------
  let camScale = 1;
  let camX = 0;
  let camY = 0;
  if (inRange(t, T.L2_em) || inRange(t, T.hold)) {
    camScale = 1.15;
    camX = -40;
    camY = -80;
  } else if (inRange(t, T.silence1)) {
    // close-up Anh
    camScale = 1.25;
    camX = 180;
    camY = -120;
  } else if (inRange(t, T.silence2)) {
    // close-up Em vein
    camScale = 1.35;
    camX = -120;
    camY = -180;
  } else if (inRange(t, T.silence3)) {
    // close-up Anh again
    camScale = 1.25;
    camX = 180;
    camY = -120;
  } else if (inRange(t, T.build) || inRange(t, T.L3_anh)) {
    // zoom anh mouth
    camScale = 1.4;
    camX = 200;
    camY = -100;
  } else if (inRange(t, T.deadSilence)) {
    // wide shot dead silence
    camScale = 1.0;
    camX = 0;
    camY = 0;
  }

  const bigActive = t >= T.outro[0];

  return (
    <AbsoluteFill style={{ backgroundColor: "#2A1A10", opacity: globalOp }}>
      <Bg redFlash={redFlash} shakeX={shkX} shakeY={shkY} />

      {/* Characters with camera zoom */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, transform: `translate(${shkX}px, ${shkY}px)` }}>
        <g transform={`translate(${W / 2 + camX}, ${H / 2 + camY}) scale(${camScale}) translate(${-W / 2}, ${-H / 2})`}>
          {/* Em on sofa */}
          <EmMituOt x={emX} y={emY} scale={2.1} emotion={emEmotion} phase={t * 2} />
          {/* Anger vein above em head */}
          <AngerVein x={emX + 80} y={emY - 210} scale={veinScale} pulse={t} />

          {/* Anh */}
          {anhX > -150 && anhX < W + 150 && (
            <AnhGach x={anhX} y={emY + 40} scale={2.0} pose={anhWalkPhase !== 0 ? "walk" : "pocket"} walkPhase={anhWalkPhase} />
          )}

          {/* Captions */}
          <Caption
            text="Ê em. Em sao thế?"
            from={T.L1_anh[0] + 0.1}
            to={T.L1_anh[1] + 0.3}
            x={anhX - 280}
            y={emY - 260}
            width={440}
            fontSize={44}
            tailSide="down"
          />
          <Caption
            text="Anh có biết tại sao em đang giận không ?"
            from={T.L2_em[0]}
            to={T.L2_em[1] + 0.3}
            x={emX + 320}
            y={emY - 280}
            width={680}
            height={140}
            fontSize={38}
            color="#FFE8E8"
          />
          <Caption
            text="...Ờ."
            from={T.L3_anh[0]}
            to={T.L3_anh[1] + 0.4}
            x={anhX - 180}
            y={emY - 280}
            width={240}
            height={120}
            fontSize={64}
          />
          <Caption
            text="ANH NÓI 'Ờ' HẢ ANH ?!"
            from={T.L4_em[0]}
            to={T.L4_em[0] + 1.0}
            x={emX + 350}
            y={emY - 300}
            width={680}
            height={150}
            fontSize={44}
            color="#FFD0D0"
          />
          <Caption
            text="EM GIẬN THẬT ĐẤY !!!"
            from={T.L4_em[0] + 1.0}
            to={T.L4_em[1] + 0.4}
            x={emX + 350}
            y={emY - 300}
            width={700}
            height={150}
            fontSize={46}
            color="#FFD0D0"
          />
        </g>
      </svg>

      {/* Clock tick indicator (tiny) */}
      {(inRange(t, T.coldOpen) || inRange(t, T.silence1) || inRange(t, T.silence2) || inRange(t, T.silence3)) && (
        <div style={{ position: "absolute", top: 100, right: 80, color: "#8A7250", fontSize: 28, fontFamily: "'Be Vietnam Pro', sans-serif", opacity: 0.5 }}>
          ⏱ ...
        </div>
      )}

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) ${35 - redFlash * 10}%, rgba(0,0,0,0.78) 100%)`,
        }}
      />

      {/* OUTRO TITLE CARD */}
      {bigActive && (() => {
        const f = frame - T.outro[0] * FPS;
        const sp = spring({ frame: f, fps: FPS, config: { damping: 12, stiffness: 80, mass: 1.3 } });
        const fadeOut = interpolate(t, [T.outro[1] - 0.6, T.outro[1]], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const opacity = sp * fadeOut;
        const scale = interpolate(sp, [0, 1], [1.4, 1.0]);
        return (
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity, backgroundColor: "rgba(8,10,15,0.88)" }}>
            <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 28, color: "#A8B0C0", letterSpacing: 8, marginBottom: 24, opacity: 0.75 }}>
                — tiểu phẩm —
              </div>
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 130, color: "#EBE4D2", fontWeight: 600, letterSpacing: 4, lineHeight: 1.05 }}>
                CÂU HỎI<br/>TỬ THẦN
              </div>
              <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 24, color: "#D0B090", letterSpacing: 5, marginTop: 32, fontStyle: "italic" }}>
                em × anh
              </div>
            </div>
          </AbsoluteFill>
        );
      })()}

      {/* Audio: 4 dialogue lines at their timings */}
      <Sequence from={Math.floor(T.L1_anh[0] * FPS)} durationInFrames={Math.ceil(2.5 * FPS)}>
        <Audio src={staticFile("comedy_chtt/L1_anh.mp3")} volume={0.95} />
      </Sequence>
      <Sequence from={Math.floor(T.L2_em[0] * FPS)} durationInFrames={Math.ceil(2.7 * FPS)}>
        <Audio src={staticFile("comedy_chtt/L2_em.mp3")} volume={0.95} />
      </Sequence>
      <Sequence from={Math.floor(T.L3_anh[0] * FPS)} durationInFrames={Math.ceil(1.2 * FPS)}>
        <Audio src={staticFile("comedy_chtt/L3_anh.mp3")} volume={1.0} />
      </Sequence>
      <Sequence from={Math.floor(T.L4_em[0] * FPS)} durationInFrames={Math.ceil(2.3 * FPS)}>
        <Audio src={staticFile("comedy_chtt/L4_em.mp3")} volume={1.05} />
      </Sequence>
      <Audio src={staticFile("comedy_chtt/music.mp3")} volume={0.06} />
    </AbsoluteFill>
  );
};
