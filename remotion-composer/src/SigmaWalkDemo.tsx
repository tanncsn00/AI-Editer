import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { SigmaBody, SigmaHead } from "./FigureStyles";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// Sigma walk demo — proof of concept for animated character series
// 6s total: walk in → stop + speech → walk out

const FPS = 30;
const W = 1080;
const H = 1920;
const SKIN = "#C8C4BE";
const SHADOW = "#3A3A42";
const HAIR = "#0A0A0F";

const GROUND_Y = 1400;
const CHAR_SCALE = 1.6;

// ---------- SPEECH BUBBLE ----------
const SpeechBubble: React.FC<{
  x: number;
  y: number;
  text: string;
  visible: boolean;
  enterFrame: number;
}> = ({ x, y, text, visible, enterFrame }) => {
  const frame = useCurrentFrame();
  if (!visible) return null;
  const sp = spring({
    frame: frame - enterFrame,
    fps: FPS,
    config: { damping: 10, stiffness: 140, mass: 0.6 },
  });
  if (sp <= 0.01) return null;
  const scale = sp;
  const W_BUBBLE = 320;
  const H_BUBBLE = 130;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* bubble body */}
      <rect
        x={-W_BUBBLE / 2}
        y={-H_BUBBLE / 2}
        width={W_BUBBLE}
        height={H_BUBBLE}
        rx={60}
        fill="#F5F5F0"
        stroke="#0A0A0F"
        strokeWidth={6}
      />
      {/* tail pointing down-left to character */}
      <path
        d={`M ${-40} ${H_BUBBLE / 2 - 4} L ${-80} ${H_BUBBLE / 2 + 60} L ${0} ${H_BUBBLE / 2 - 4} Z`}
        fill="#F5F5F0"
        stroke="#0A0A0F"
        strokeWidth={6}
      />
      {/* white patch to hide the top edge of tail overlap */}
      <rect x={-80} y={H_BUBBLE / 2 - 8} width={80} height={6} fill="#F5F5F0" />
      <text
        x={0}
        y={12}
        fontSize={62}
        textAnchor="middle"
        fontFamily="'EB Garamond', Georgia, serif"
        fontWeight={700}
        fill="#0A0A0F"
        letterSpacing="4"
      >
        {text}
      </text>
    </g>
  );
};

// ---------- BACKGROUND ----------
const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="bgSigmaWalk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3A3F48" />
        <stop offset="70%" stopColor="#1A1D24" />
        <stop offset="100%" stopColor="#0A0A0F" />
      </linearGradient>
      <filter id="grainSW">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
        <feColorMatrix values="0 0 0 0 0.8  0 0 0 0 0.8  0 0 0 0 0.85  0 0 0 0.15 0" />
      </filter>
    </defs>
    <rect width={W} height={H} fill="url(#bgSigmaWalk)" />
    {/* Ground line with perspective hint */}
    <line x1={0} y1={GROUND_Y + 10} x2={W} y2={GROUND_Y + 10} stroke="#5A6070" strokeWidth={3} opacity={0.7} />
    <line x1={0} y1={GROUND_Y + 60} x2={W} y2={GROUND_Y + 60} stroke="#3A4050" strokeWidth={1.5} opacity={0.5} />
    <line x1={0} y1={GROUND_Y + 110} x2={W} y2={GROUND_Y + 110} stroke="#2A3040" strokeWidth={1} opacity={0.35} />
    {/* Big SIGMA text behind (faint) */}
    <text
      x={W / 2}
      y={800}
      fontSize={280}
      fill="#4A5060"
      textAnchor="middle"
      fontFamily="'EB Garamond', Georgia, serif"
      fontWeight={700}
      letterSpacing="14"
      opacity={0.22}
    >
      SIGMA
    </text>
    <rect width={W} height={H} filter="url(#grainSW)" opacity={0.5} />
  </svg>
);

export const SigmaWalkDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;

  // Timeline:
  // 0.0 - 2.0s  : walk in from left (x: -150 → 540)
  // 2.0 - 4.0s  : stop center, speech bubble, slight idle sway
  // 4.0 - 6.0s  : walk out right (x: 540 → 1250)

  let charX = 0;
  let walkPhase = 0;

  if (t < 2.0) {
    charX = interpolate(t, [0, 2.0], [-150, 540]);
    walkPhase = t * 8; // 8 rad/s ≈ 1.27Hz walk cycle
  } else if (t < 4.0) {
    charX = 540;
    walkPhase = 0; // idle
  } else {
    charX = interpolate(t, [4.0, 6.0], [540, 1250]);
    walkPhase = (t - 4.0) * 8;
  }

  // Speech bubble active from t=2.2 to t=3.8
  const bubbleVisible = t >= 2.2 && t < 3.9;
  const bubbleEnterFrame = Math.floor(2.2 * FPS);

  const globalOp = interpolate(
    frame,
    [0, 10, durationInFrames - 10, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0F", opacity: globalOp }}>
      <Bg />

      {/* Character */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${charX}, ${GROUND_Y - 160}) scale(${CHAR_SCALE})`}>
          <SigmaBody
            x={0}
            y={0}
            scale={1}
            phase={t / 2}
            skinColor={SKIN}
            shadowColor={SHADOW}
            walkPhase={walkPhase}
          />
          <SigmaHead
            x={0}
            y={-72}
            scale={1}
            skinColor={SKIN}
            hairColor={HAIR}
            shadowColor={SHADOW}
          />
        </g>

        {/* Speech bubble positioned above character when stopped */}
        <g transform={`translate(${charX + 180}, ${GROUND_Y - 460})`}>
          <SpeechBubble x={0} y={0} text="SIGMA RULE." visible={bubbleVisible} enterFrame={bubbleEnterFrame} />
        </g>
      </svg>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 60%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.78) 100%)",
        }}
      />

      {/* Title at top */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: 32,
          color: "#A8B0C0",
          letterSpacing: "8px",
          opacity: 0.75,
        }}
      >
        — WALK CYCLE DEMO —
      </div>
    </AbsoluteFill>
  );
};
