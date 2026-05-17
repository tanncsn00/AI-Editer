import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import wordsData from "./gaihacker_words.json";
import beatsData from "./gaihacker_beats.json";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadInter("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["latin"] });
loadJetBrains("normal", { weights: ["400", "700"], subsets: ["latin", "latin-ext"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// Futuristic dark tech palette
const BG_DEEP = "#050514";
const BG_MID = "#0A0A24";
const BG_NAVY = "#11122E";
const PANEL = "#0F1028";
const PANEL_LIGHT = "#1A1B3A";
const STROKE = "#2A2D55";
const STROKE_BRIGHT = "#4A4F8C";
const TEXT = "#FFFFFF";
const TEXT_DIM = "#9CA3C9";
const ACCENT = "#FF6B35";
const NEON_BLUE = "#6366F1";
const NEON_PURPLE = "#A855F7";
const NEON_PINK = "#EC4899";
const NEON_CYAN = "#06B6D4";
const GOLD = "#FFC93C";
const RED = "#FF3B5C";
const GREEN = "#10F2A6";

// Brand colors
const APPLE = "#A2AAAD";
const CLAUDE_ORANGE = "#D97757";
const OPENAI_GREEN = "#10A37F";
const GEMINI_BLUE = "#4285F4";
const XAI_BLACK = "#000000";
const GOOGLE_BLUE = "#4285F4";
const GOOGLE_RED = "#EA4335";
const GOOGLE_YELLOW = "#FBBC04";
const GOOGLE_GREEN = "#34A853";

type Word = { word: string; start: number; end: number; beat: number };
const words = wordsData as Word[];
type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const B = (i: number) => { const b = beats[i - 1]; return [b.start, b.start + b.duration] as const; };

// FUTURISTIC ANIMATED BG: perspective grid floor + neural orb + floating particles + scan beam
const Bg: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame * 0.018;
  const orbPulse = 1 + Math.sin(frame * 0.05) * 0.08;
  const scanY = ((frame * 8) % (H + 400)) - 200;
  const horizonY = H * 0.55;

  // 14 particles floating upward
  const particles = [];
  for (let i = 0; i < 14; i++) {
    const baseX = (i * 137) % W;
    const speed = 0.5 + (i % 5) * 0.15;
    const yPos = (H + 200) - ((frame * speed * 4 + i * 80) % (H + 400));
    const drift = Math.sin(frame * 0.02 + i) * 30;
    const op = Math.max(0, Math.min(0.7, (yPos / H) * 0.8));
    particles.push({ x: baseX + drift, y: yPos, op, r: 2 + (i % 3) });
  }

  // Neural orb connections — 6 nodes around center
  const cx = W / 2, cy = horizonY - 220;
  const nodes = [];
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2 + t * 0.3;
    const radius = 180 + Math.sin(t * 1.5 + i) * 20;
    nodes.push({ x: cx + Math.cos(ang) * radius, y: cy + Math.sin(ang) * radius * 0.6 });
  }

  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="bgVert2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#020012" />
          <stop offset="40%" stopColor="#050018" />
          <stop offset="80%" stopColor="#0A0530" />
          <stop offset="100%" stopColor="#1A0840" />
        </linearGradient>
        <radialGradient id="orbCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="1" />
          <stop offset="40%" stopColor="#A855F7" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orbHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="scanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00F0FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#00F0FF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
        </linearGradient>
        <filter id="bgBlur">
          <feGaussianBlur stdDeviation="40" />
        </filter>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {/* Deep space gradient base */}
      <rect width={W} height={H} fill="url(#bgVert2)" />

      {/* === Perspective grid floor (Tron-style) === */}
      <g opacity={0.55}>
        {/* Horizontal lines (depth) */}
        {Array.from({ length: 18 }).map((_, i) => {
          const offset = (frame * 1.2 + i * 50) % 900;
          const yLine = horizonY + (offset * offset) / 350;
          if (yLine > H + 100) return null;
          const op = Math.max(0, 0.5 - (yLine - horizonY) / 1200);
          return <line key={`h${i}`} x1={0} y1={yLine} x2={W} y2={yLine} stroke="#00F0FF" strokeWidth={1.5} opacity={op} />;
        })}
        {/* Vertical lines (perspective vanishing point) */}
        {Array.from({ length: 21 }).map((_, i) => {
          const x = (i / 20) * W;
          return <line key={`v${i}`} x1={x} y1={horizonY} x2={W / 2 + (x - W / 2) * 4} y2={H + 100} stroke="#00F0FF" strokeWidth={1.2} opacity={0.4} />;
        })}
        {/* Horizon glow line */}
        <line x1={0} y1={horizonY} x2={W} y2={horizonY} stroke="#00F0FF" strokeWidth={2} opacity={0.6} />
        <line x1={0} y1={horizonY} x2={W} y2={horizonY} stroke="#00F0FF" strokeWidth={6} opacity={0.25} filter="url(#bgBlur)" />
      </g>

      {/* === Neural orb (AI brain) === */}
      <g transform={`translate(${cx}, ${cy})`}>
        {/* Outer halo */}
        <circle r={220 * orbPulse} fill="url(#orbHalo)" opacity={0.6} />
        {/* Connections between nodes */}
        {nodes.map((n, i) =>
          nodes.slice(i + 1).map((m, j) => {
            const dist = Math.hypot(m.x - n.x, m.y - n.y);
            if (dist > 350) return null;
            const op = (1 - dist / 350) * 0.4;
            return <line key={`c${i}-${j}`} x1={n.x - cx} y1={n.y - cy} x2={m.x - cx} y2={m.y - cy}
              stroke="#A855F7" strokeWidth={1} opacity={op} />;
          })
        )}
        {/* Center orb */}
        <circle r={80 * orbPulse} fill="url(#orbCore)" />
        <circle r={30} fill="#FFFFFF" opacity={0.85} filter="url(#nodeGlow)" />
        {/* Nodes */}
        {nodes.map((n, i) => (
          <g key={`n${i}`} transform={`translate(${n.x - cx}, ${n.y - cy})`}>
            <circle r={5} fill="#00F0FF" filter="url(#nodeGlow)" />
            <circle r={3} fill="#FFFFFF" />
          </g>
        ))}
      </g>

      {/* === Floating particles === */}
      {particles.map((p, i) => (
        <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r} fill="#00F0FF" opacity={p.op} filter="url(#nodeGlow)" />
      ))}

      {/* === Scan beam (sweeping) === */}
      <rect x={0} y={scanY} width={W} height={120} fill="url(#scanGrad)" opacity={0.5} />

      {/* === Subtle vignette === */}
      <radialGradient id="vig2" cx="50%" cy="50%" r="80%">
        <stop offset="50%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
      </radialGradient>
      <rect width={W} height={H} fill="url(#vig2)" />
    </svg>
  );
};

const SourceBadge: React.FC = () => (
  <g transform="translate(880, 90)">
    <rect x={-160} y={-30} width={320} height={60} rx={30} fill={PANEL} stroke={STROKE} strokeWidth={2} />
    <circle cx={-130} cy={0} r={6} fill={NEON_CYAN}>
      <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
    </circle>
    <text x={10} y={8} fontSize={20} fill={TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>GTIG · 11/05/2026</text>
  </g>
);

// =============== Animated MC presenter — mouth sync + pose per beat + blink + bob ===============
type Pose = 'wave' | 'point-up-right' | 'point-left' | 'thumbs-up' | 'thumbs-down' | 'open-arms';
type Expression = 'smile' | 'surprised' | 'serious';

// Compute mouth open from word_timings (parabolic per active word)
const useMouthOpen = (t: number): number => {
  // Find active word
  for (const w of words) {
    if (t >= w.start && t < w.end) {
      const dur = w.end - w.start;
      const local = (t - w.start) / dur;
      // Parabolic 0→1→0
      const parab = 4 * local * (1 - local);
      // Skip pure punctuation/single-char articles
      if (w.word.length <= 1) return parab * 0.3;
      return parab;
    }
  }
  return 0;
};

const Teacher: React.FC<{ x: number; y: number; scale?: number; pose?: Pose; expression?: Expression; t: number }> = ({
  x, y, scale = 1, pose = 'wave', expression = 'smile', t,
}) => {
  const INK = "#0A0A1F";
  const SKIN = "#F8E0D0";
  const SHIRT = "#4A7AC8";
  const frame = useCurrentFrame();
  const mouth = useMouthOpen(t);
  // Body bob (vertical) + sway (rotation) — alive even when not talking
  const bob = Math.sin(frame * 0.06) * 3;
  const swayDeg = Math.sin(frame * 0.045) * 2.5;
  // Eye blink — 4s cycle, 0.15s closed
  const blinkPhase = (frame % 120) / 120;
  const blinking = blinkPhase > 0.97;
  // Talking boost — when speaking, arms gesture, head nod
  const talking = mouth > 0.15;
  const talkBoost = talking ? Math.sin(frame * 0.22) * 6 : 0;
  // Head subtle nod
  const headNod = Math.sin(frame * 0.08) * 1.5 + (talking ? Math.sin(frame * 0.3) * 1.5 : 0);
  // Continuous hand sway for ALL poses (alive feeling)
  const handSway = Math.sin(frame * 0.18) * 6;
  const handSway2 = Math.sin(frame * 0.18 + Math.PI) * 6;
  // Pose offsets — now with continuous sway
  const armRight = (() => {
    if (pose === 'wave') {
      const wbob = Math.sin(frame * 0.25) * 12 + talkBoost;
      return { x2: 55 + wbob, y2: -55 + Math.cos(frame * 0.25) * 6, hand: { x: 58 + wbob, y: -60 + Math.cos(frame * 0.25) * 6 } };
    }
    if (pose === 'point-up-right') return { x2: 55 + handSway * 0.6, y2: -50 + talkBoost * 0.4, hand: { x: 58 + handSway * 0.6, y: -56 + talkBoost * 0.4 } };
    if (pose === 'thumbs-up') return { x2: 50 + handSway * 0.4, y2: -55 + talkBoost * 0.3, hand: { x: 52 + handSway * 0.4, y: -60 + talkBoost * 0.3, thumb: true } };
    if (pose === 'thumbs-down') return { x2: 50, y2: 25 + Math.sin(frame * 0.15) * 3, hand: { x: 52, y: 30, thumb: true, down: true } };
    if (pose === 'open-arms') return { x2: 50 + handSway * 0.4, y2: -10 + talkBoost * 0.3, hand: { x: 54 + handSway * 0.4, y: -14 } };
    return { x2: 38 + handSway * 0.5, y2: 18 + talkBoost * 0.3, hand: null };
  })();
  const armLeft = (() => {
    if (pose === 'point-left') return { x2: -55 + handSway2 * 0.6, y2: -50 + talkBoost * 0.4, hand: { x: -58 + handSway2 * 0.6, y: -56 + talkBoost * 0.4 } };
    if (pose === 'open-arms') return { x2: -50 + handSway2 * 0.4, y2: -10 + talkBoost * 0.3, hand: { x: -54 + handSway2 * 0.4, y: -14 } };
    if (pose === 'wave' || pose === 'point-up-right' || pose === 'thumbs-up' || pose === 'thumbs-down') return { x2: -35 + handSway2 * 0.4, y2: 18 + talkBoost * 0.3, hand: null };
    return { x2: -38 + handSway2 * 0.5, y2: 18 + talkBoost * 0.3, hand: null };
  })();

  return (
    <g transform={`translate(${x}, ${y + bob}) rotate(${swayDeg}) scale(${scale})`}>
      {/* Glow halo */}
      <circle cx={0} cy={-20} r={80} fill={NEON_BLUE} opacity={0.18} filter="url(#charGlow)" />
      {/* Legs */}
      <line x1={-12} y1={30} x2={-18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
      <line x1={12} y1={30} x2={18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
      <ellipse cx={-20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
      <ellipse cx={20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
      {/* Body */}
      <rect x={-22} y={-25} width={44} height={58} rx={10} fill={SHIRT} stroke={INK} strokeWidth={3.5} />
      <path d="M -8 -25 L 0 -15 L 8 -25" fill="#E8E0D0" stroke={INK} strokeWidth={2} />

      {/* Right arm */}
      <line x1={22} y1={-8} x2={armRight.x2} y2={armRight.y2} stroke={SKIN} strokeWidth={12} strokeLinecap="round" />
      <line x1={22} y1={-8} x2={armRight.x2} y2={armRight.y2} stroke={INK} strokeWidth={2.5} />
      {armRight.hand && (
        <>
          <circle cx={armRight.hand.x} cy={armRight.hand.y} r={6} fill={SKIN} stroke={INK} strokeWidth={2} />
          {(armRight.hand as any).thumb && (
            <line x1={armRight.hand.x} y1={armRight.hand.y} x2={armRight.hand.x + 4} y2={armRight.hand.y + ((armRight.hand as any).down ? 10 : -12)} stroke={SKIN} strokeWidth={5} strokeLinecap="round" />
          )}
        </>
      )}
      {/* Left arm */}
      <line x1={-22} y1={-8} x2={armLeft.x2} y2={armLeft.y2} stroke={SKIN} strokeWidth={12} strokeLinecap="round" />
      <line x1={-22} y1={-8} x2={armLeft.x2} y2={armLeft.y2} stroke={INK} strokeWidth={2.5} />
      {armLeft.hand && (
        <circle cx={armLeft.hand.x} cy={armLeft.hand.y} r={6} fill={SKIN} stroke={INK} strokeWidth={2} />
      )}

      {/* Head — with subtle nod */}
      <g transform={`translate(0, ${headNod}) rotate(${headNod * 0.5})`}>
        <circle cx={0} cy={-46} r={22} fill={SKIN} stroke={INK} strokeWidth={3.5} />
        {/* Hair */}
        <path d="M -22 -52 Q -18 -68 -6 -66 Q 2 -72 14 -68 Q 22 -60 22 -52" fill="#1A1A22" />
      {/* Eyes */}
      {blinking ? (
        <>
          <line x1={-11} y1={-48} x2={-5} y2={-48} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={5} y1={-48} x2={11} y2={-48} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={-8} cy={-48} r={expression === 'surprised' ? 4 : 3} fill={INK} />
          <circle cx={8} cy={-48} r={expression === 'surprised' ? 4 : 3} fill={INK} />
          <circle cx={-7} cy={-49} r={1} fill="#FFF" />
          <circle cx={9} cy={-49} r={1} fill="#FFF" />
          {/* Eyebrows for serious/surprised */}
          {expression === 'serious' && (
            <>
              <line x1={-13} y1={-56} x2={-3} y2={-58} stroke={INK} strokeWidth={2} strokeLinecap="round" />
              <line x1={3} y1={-58} x2={13} y2={-56} stroke={INK} strokeWidth={2} strokeLinecap="round" />
            </>
          )}
        </>
      )}
      {/* Mouth — animated based on speech */}
      {(() => {
        const mh = 2 + mouth * 8;
        const mw = 8 + mouth * 4;
        if (expression === 'surprised') {
          return <ellipse cx={0} cy={-37} rx={mw * 0.6} ry={mh * 0.9} fill={INK} stroke={INK} strokeWidth={1.5} />;
        }
        if (mouth < 0.1) {
          return <path d="M -6 -38 Q 0 -33 6 -38" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />;
        }
        return <ellipse cx={0} cy={-36} rx={mw * 0.55} ry={mh * 0.6} fill="#7C2A1A" stroke={INK} strokeWidth={2} />;
      })()}
      </g>
    </g>
  );
};

// Tech corner brackets for futuristic cards
const CornerBrackets: React.FC<{ x: number; y: number; w: number; h: number; color: string; len?: number }> = ({
  x, y, w, h, color, len = 20,
}) => (
  <g stroke={color} strokeWidth={3} fill="none" strokeLinecap="round">
    <path d={`M ${x} ${y + len} L ${x} ${y} L ${x + len} ${y}`} />
    <path d={`M ${x + w - len} ${y} L ${x + w} ${y} L ${x + w} ${y + len}`} />
    <path d={`M ${x} ${y + h - len} L ${x} ${y + h} L ${x + len} ${y + h}`} />
    <path d={`M ${x + w - len} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - len}`} />
  </g>
);

// Holographic gradient text — rainbow sweep
const HoloText: React.FC<{ x: number; y: number; size: number; weight?: number; family?: string; children: string; phase?: number }> = ({
  x, y, size, weight = 900, family = "'Inter', sans-serif", children, phase = 0,
}) => {
  const frame = useCurrentFrame();
  const offset = ((frame * 1.2 + phase) % 200) - 100;
  const id = `holo-${y}-${size}-${children.slice(0, 4)}`;
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="objectBoundingBox">
          <stop offset={`${offset}%`} stopColor="#FF6B35" />
          <stop offset={`${offset + 25}%`} stopColor="#FFC93C" />
          <stop offset={`${offset + 50}%`} stopColor="#06B6D4" />
          <stop offset={`${offset + 75}%`} stopColor="#A855F7" />
          <stop offset={`${offset + 100}%`} stopColor="#EC4899" />
        </linearGradient>
      </defs>
      <text x={x} y={y} fontSize={size} fill={`url(#${id})`} textAnchor="middle" dominantBaseline="middle"
        fontFamily={family} fontWeight={weight}
        style={{ filter: `drop-shadow(0 0 24px rgba(255,107,53,0.5)) drop-shadow(0 0 48px rgba(168,85,247,0.4))` }}>
        {children}
      </text>
    </>
  );
};

// Glow pulse halo behind icon/logo
const GlowPulse: React.FC<{ cx: number; cy: number; r: number; color: string; speed?: number }> = ({ cx, cy, r, color, speed = 0.04 }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * speed) * 0.15;
  return (
    <>
      <circle cx={cx} cy={cy} r={r * pulse} fill={color} opacity={0.3} filter="url(#cardGlow)" />
      <circle cx={cx} cy={cy} r={r * 0.7 * pulse} fill={color} opacity={0.5} filter="url(#cardGlow)" />
    </>
  );
};

// Card scan lines overlay (subtle horizontal stripes)
const ScanLines: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <rect x={x} y={y} width={w} height={h} fill="url(#scanLinesPat)" opacity={0.35} pointerEvents="none" />
);

// Animated rotating gradient ring behind logo
const RotatingRing: React.FC<{ cx: number; cy: number; r: number; color1: string; color2: string }> = ({ cx, cy, r, color1, color2 }) => {
  const frame = useCurrentFrame();
  const rot = frame * 1.5;
  const id = `ring-${cx}-${cy}`;
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="50%" stopColor={color2} />
          <stop offset="100%" stopColor={color1} />
        </linearGradient>
      </defs>
      <g transform={`rotate(${rot} ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={3} strokeDasharray="20 8" opacity={0.6} />
        <circle cx={cx} cy={cy} r={r - 12} fill="none" stroke={color2} strokeWidth={1.5} strokeDasharray="4 6" opacity={0.4} />
      </g>
    </>
  );
};

// Burst particles around an element (radial dots flying out)
const ParticleBurst: React.FC<{ cx: number; cy: number; phase: number; color: string }> = ({ cx, cy, phase, color }) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - phase * FPS);
  if (elapsed > 60) return null;
  const t = elapsed / 60;
  const dots = [];
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const dist = 20 + t * 180;
    const op = Math.max(0, 1 - t);
    dots.push(<circle key={i} cx={cx + Math.cos(ang) * dist} cy={cy + Math.sin(ang) * dist} r={4 - t * 2} fill={color} opacity={op} filter="url(#cardGlow)" />);
  }
  return <>{dots}</>;
};

// Helper filter defs (used by GlowPulse, scan lines pattern)
const CardEffects: React.FC = () => (
  <defs>
    <filter id="cardGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="14" />
    </filter>
    <pattern id="scanLinesPat" width="100%" height="4" patternUnits="userSpaceOnUse">
      <rect width="100%" height="1" fill="#00F0FF" opacity={0.06} />
      <rect y="3" width="100%" height="1" fill="#00F0FF" opacity={0.03} />
    </pattern>
  </defs>
);

// Pose mapping per beat
const POSE_BY_BEAT: Record<number, { pose: Pose; expression: Expression }> = {
  1: { pose: 'wave', expression: 'smile' },
  2: { pose: 'point-up-right', expression: 'smile' },
  3: { pose: 'point-left', expression: 'smile' },
  4: { pose: 'thumbs-down', expression: 'surprised' },
  5: { pose: 'point-up-right', expression: 'smile' },
  6: { pose: 'open-arms', expression: 'smile' },
  7: { pose: 'point-up-right', expression: 'smile' },
  8: { pose: 'thumbs-up', expression: 'smile' },
};

// Glow filter for character halo (defined once, used by Teacher)
const CharFilters: React.FC = () => (
  <defs>
    <filter id="charGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="20" />
    </filter>
  </defs>
);

// =============== Real brand logos as SVG ===============
const AppleLogo: React.FC<{ x: number; y: number; size: number; fill?: string }> = ({ x, y, size, fill = APPLE }) => (
  <g transform={`translate(${x}, ${y}) scale(${size / 24})`}>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill={fill}/>
  </g>
);

// Anthropic Claude — official-style 8-pointed sparkle (curved arms)
const ClaudeLogo: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => {
  const s = size / 100;
  return (
    <g transform={`translate(${x + size/2}, ${y + size/2}) scale(${s})`}>
      {/* Main 6-pointed soft sparkle, classic Anthropic style */}
      <path d="M 0 -50 Q 4 -10 0 0 Q -4 -10 0 -50 Z" fill={CLAUDE_ORANGE} />
      <path d="M 0 50 Q 4 10 0 0 Q -4 10 0 50 Z" fill={CLAUDE_ORANGE} />
      <path d="M -50 0 Q -10 -4 0 0 Q -10 4 -50 0 Z" fill={CLAUDE_ORANGE} />
      <path d="M 50 0 Q 10 -4 0 0 Q 10 4 50 0 Z" fill={CLAUDE_ORANGE} />
      {/* Diagonal arms */}
      <path d="M -35 -35 Q -7 -3 0 0 Q -3 -7 -35 -35 Z" fill={CLAUDE_ORANGE} opacity={0.85} />
      <path d="M 35 35 Q 7 3 0 0 Q 3 7 35 35 Z" fill={CLAUDE_ORANGE} opacity={0.85} />
      <path d="M 35 -35 Q 3 -7 0 0 Q 7 -3 35 -35 Z" fill={CLAUDE_ORANGE} opacity={0.85} />
      <path d="M -35 35 Q -3 7 0 0 Q -7 3 -35 35 Z" fill={CLAUDE_ORANGE} opacity={0.85} />
      {/* Center glow */}
      <circle r={6} fill="#FFE9D9" />
    </g>
  );
};

const OpenAILogo: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => (
  <g transform={`translate(${x}, ${y}) scale(${size / 24})`}>
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.787a4.49 4.49 0 0 1-.676 8.105v-5.677a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill={OPENAI_GREEN}/>
  </g>
);

const GeminiLogo: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => (
  <g transform={`translate(${x}, ${y}) scale(${size / 24})`}>
    <defs>
      <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={GOOGLE_BLUE} />
        <stop offset="50%" stopColor={NEON_PURPLE} />
        <stop offset="100%" stopColor={NEON_PINK} />
      </linearGradient>
    </defs>
    <path d="M12 0 C 11.5 6 6 11.5 0 12 C 6 12.5 11.5 18 12 24 C 12.5 18 18 12.5 24 12 C 18 11.5 12.5 6 12 0 Z" fill="url(#geminiGrad)"/>
  </g>
);

const GrokLogo: React.FC<{ x: number; y: number; size: number; fill?: string }> = ({ x, y, size, fill = TEXT }) => (
  <g transform={`translate(${x}, ${y}) scale(${size / 24})`}>
    <path d="M3 3 L21 21 M21 3 L3 21" stroke={fill} strokeWidth={3.5} strokeLinecap="round" />
  </g>
);

const GoogleG: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => (
  <g transform={`translate(${x}, ${y}) scale(${size / 24})`}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill={GOOGLE_BLUE}/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill={GOOGLE_GREEN}/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill={GOOGLE_YELLOW}/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill={GOOGLE_RED}/>
  </g>
);

// Caption
type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  const flush = () => {
    if (buf.length) { out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end }); buf = []; }
  };
  for (const w of words) {
    buf.push(w);
    if (/[.!?]$/.test(w.word)) { flush(); continue; }
    if (/[,—:·]$/.test(w.word) && buf.length >= 4) { flush(); continue; }
    if (buf.length >= 6) flush();
  }
  flush();
  return out;
})();

const EMPH = new Set<string>([
  "AI", "AI.", "ai", "zero", "day.", "day",
  "OpenClaw", "OpenClaw.",
  "Google", "Google.", "GTIG", "GTIG.",
  "Threat", "Intelligence",
  "Python", "hai-FA", "2FA",
  "mass", "exploitation.", "exploitation",
  "MASS", "EXPLOIT.",
  "Trung", "Quốc.", "Quốc",
  "Triều", "Tiên.", "Tiên",
  "AI vs AI", "vs",
  "CHẶN.", "CHẶN", "trước", "khi", "nổ.",
  "lần", "đầu", "tiên.",
  "criminal.", "exploit", "exploit.",
  "QUY", "TẮC", "MỚI.", "MỚI",
  "CHẬM", "VỠ", "TRẬN.",
  "hàng", "loạt.", "loạt",
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
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 130, pointerEvents: "none" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 16px", maxWidth: 940, padding: "0 60px" }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [10, 0]);
          const emph = isEmph(w.word);
          return (
            <span key={`${active.start}-${i}`} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: emph ? 800 : 700,
              fontSize: emph ? 56 : 46,
              color: emph ? GOLD : TEXT,
              textShadow: emph
                ? "0 0 22px rgba(255,204,77,0.6), 0 3px 12px rgba(0,0,0,0.95)"
                : "0 3px 12px rgba(0,0,0,0.95)",
              opacity: visible ? sp : 0,
              transform: `translateY(${y}px)`,
              lineHeight: 1.3,
            }}>{w.word}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// =============== BEAT 1: HOOK — ZERO-DAY breaking ===============
const Beat1: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(1);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const titleSp = spring({ frame: (p - 0.1) * FPS, fps: FPS, config: { damping: 12, stiffness: 220 } });
  const zeroSp = spring({ frame: (p - 0.5) * FPS, fps: FPS, config: { damping: 9, stiffness: 200 } });
  const subSp = spring({ frame: (p - 2.0) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
  const stampSp = spring({ frame: (p - 3.0) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  return (
    <g opacity={op}>
      {/* Breaking pill */}
      <g transform={`translate(${W / 2}, 250) scale(${titleSp})`}>
        <rect x={-260} y={-38} width={520} height={76} rx={38} fill="#2A0808" stroke={RED} strokeWidth={2.5}
          style={{ filter: `drop-shadow(0 0 18px ${RED}88)` }} />
        <text x={0} y={11} fontSize={28} fill={RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>🚨 BREAKING · CYBER ATTACK</text>
      </g>

      {/* Big "ZERO-DAY" holographic */}
      <g transform={`translate(0, 0) scale(${zeroSp})`} opacity={zeroSp}>
        <GlowPulse cx={W/2} cy={620} r={220} color={RED} speed={0.06} />
        <HoloText x={W / 2} y={620} size={200} weight={900}>ZERO-DAY</HoloText>
      </g>

      {/* "AI lần đầu tự tìm" */}
      <g transform={`translate(${W / 2}, 880)`} opacity={subSp}>
        <rect x={-420} y={-50} width={840} height={100} rx={50} fill={PANEL} stroke={NEON_PINK} strokeWidth={2}
          style={{ filter: `drop-shadow(0 0 14px ${NEON_PINK}88)` }} />
        <CornerBrackets x={-420} y={-50} w={840} h={100} color={NEON_PINK} len={18} />
        <text x={0} y={12} fontSize={34} fill={TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>AI lần đầu TỰ TÌM</text>
      </g>

      {/* Hacker stamp */}
      <g transform={`translate(${W / 2}, 1180) scale(${stampSp})`} opacity={stampSp}>
        <rect x={-440} y={-100} width={880} height={200} rx={14} fill={RED} stroke="#FFF" strokeWidth={5}
          style={{ filter: `drop-shadow(0 14px 36px ${RED}) drop-shadow(0 0 4px #FFF)` }} transform="rotate(-2 0 0)" />
        <CornerBrackets x={-440} y={-100} w={880} h={200} color="#FFF" len={26} />
        <text x={0} y={-12} fontSize={36} fill="#FFD" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800} transform="rotate(-2 0 0)">Hacker xài để</text>
        <text x={0} y={48} fontSize={64} fill="#FFF" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={900} transform="rotate(-2 0 0)"
          style={{ filter: "drop-shadow(0 0 16px #FFF)" }}>TẤN CÔNG HÀNG LOẠT</text>
        <ParticleBurst cx={0} cy={0} phase={3.0} color={RED} />
        <ParticleBurst cx={0} cy={0} phase={3.1} color="#FFF" />
      </g>

      <text x={W / 2} y={1500} fontSize={26} fill={TEXT_DIM} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>// AI security · 11/05/2026</text>
    </g>
  );
};

// =============== BEAT 2: CONTEXT — Google GTIG official disclosure ===============
const Beat2: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(2);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const googleSp = spring({ frame: (p - 0.2) * FPS, fps: FPS, config: { damping: 12, stiffness: 220 } });
  const gtigSp = spring({ frame: (p - 1.4) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  const verdictSp = spring({ frame: (p - 3.5) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={36} fill={ACCENT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}
        style={{ filter: `drop-shadow(0 0 14px ${ACCENT}66)` }}>BÁO CÁO CHÍNH THỨC</text>

      {/* Google logo card */}
      <g transform={`translate(${W / 2}, 540) scale(${googleSp})`}>
        <rect x={-340} y={-110} width={680} height={220} rx={14} fill={PANEL} stroke={GOLD} strokeWidth={2.5}
          style={{ filter: `drop-shadow(0 12px 36px ${GOLD}66)` }} />
        <CornerBrackets x={-340} y={-110} w={680} h={220} color={GOLD} />
        <GoogleG x={-260} y={-60} size={120} />
        <text x={50} y={-12} fontSize={68} fill={TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={900}>Google</text>
        <text x={50} y={42} fontSize={22} fill={GOLD} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>Threat Intel Group</text>
      </g>

      {/* HoloText GTIG */}
      <g transform={`translate(${W / 2}, 920)`} opacity={gtigSp}>
        <GlowPulse cx={0} cy={0} r={150} color={GOLD} speed={0.05} />
        <HoloText x={0} y={0} size={180}>GTIG</HoloText>
      </g>

      {/* Verdict — BLOCKED 11/05 */}
      <g transform={`translate(${W / 2}, 1280) scale(${verdictSp})`} opacity={verdictSp}>
        <rect x={-460} y={-100} width={920} height={200} rx={14} fill="#0F1F12" stroke={GREEN} strokeWidth={2.5}
          style={{ filter: `drop-shadow(0 12px 32px ${GREEN}88)` }} />
        <CornerBrackets x={-460} y={-100} w={920} h={200} color={GREEN} />
        <text x={0} y={-32} fontSize={26} fill={GREEN} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>● BLOCKED · 11/05/2026</text>
        <text x={0} y={42} fontSize={48} fill={TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={900}>chiến dịch QUY MÔ LỚN</text>
      </g>
    </g>
  );
};

// =============== BEAT 3: WHAT — OpenClaw AI tool ===============
const Beat3: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(3);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const titleSp = spring({ frame: (p - 0.1) * FPS, fps: FPS, config: { damping: 12, stiffness: 220 } });
  const nameSp = spring({ frame: (p - 0.5) * FPS, fps: FPS, config: { damping: 9, stiffness: 200 } });
  const tagsSp = spring({ frame: (p - 2.0) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
  const stampSp = spring({ frame: (p - 3.5) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  const tags = [
    { label: "auto-discovery", color: NEON_BLUE },
    { label: "auto-exploit", color: NEON_PURPLE },
    { label: "zero-day", color: RED },
  ];
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={36} fill={ACCENT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}
        style={{ filter: `drop-shadow(0 0 14px ${ACCENT}66)` }}>TOOL HACKER XÀI</text>

      {/* AI brain icon */}
      <g transform={`translate(${W / 2}, 540) scale(${titleSp})`}>
        <GlowPulse cx={0} cy={0} r={140} color={NEON_PURPLE} speed={0.05} />
        <text x={0} y={28} fontSize={140} textAnchor="middle">🧠</text>
      </g>

      {/* HoloText OpenClaw */}
      <g transform={`translate(${W / 2}, 820)`} opacity={nameSp}>
        <GlowPulse cx={0} cy={0} r={200} color={NEON_PURPLE} speed={0.06} />
        <HoloText x={0} y={0} size={170}>OpenClaw</HoloText>
      </g>

      {/* 3 tag pills */}
      <g transform={`translate(${W / 2}, 1100)`} opacity={tagsSp}>
        {tags.map((tag, i) => (
          <g key={i} transform={`translate(${-280 + i * 280}, 0)`}>
            <rect x={-120} y={-40} width={240} height={80} rx={40} fill={PANEL} stroke={tag.color} strokeWidth={2}
              style={{ filter: `drop-shadow(0 6px 18px ${tag.color}88)` }} />
            <CornerBrackets x={-120} y={-40} w={240} h={80} color={tag.color} len={14} />
            <text x={0} y={9} fontSize={22} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{tag.label}</text>
          </g>
        ))}
      </g>

      {/* "LẦN ĐẦU TIÊN" stamp */}
      <g transform={`translate(${W / 2}, 1350) scale(${stampSp})`} opacity={stampSp}>
        <rect x={-440} y={-80} width={880} height={160} rx={14} fill={ACCENT} stroke="#FFF" strokeWidth={4}
          style={{ filter: `drop-shadow(0 10px 28px ${ACCENT})` }} transform="rotate(-2 0 0)" />
        <CornerBrackets x={-440} y={-80} w={880} h={160} color="#FFF" len={22} />
        <text x={0} y={-8} fontSize={28} fill="#FFE" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} transform="rotate(-2 0 0)">LẦN ĐẦU TIÊN trong lịch sử</text>
        <text x={0} y={36} fontSize={36} fill="#FFF" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={900} transform="rotate(-2 0 0)">AI tự tìm zero-day cho criminal</text>
      </g>
    </g>
  );
};

// =============== BEAT 4: EXPLOIT — Python 2FA bypass ===============
const Beat4: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(4);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const codeSp = spring({ frame: (p - 0.3) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
  const stampSp = spring({ frame: (p - 2.5) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  const pillsSp = spring({ frame: (p - 4.5) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={36} fill={ACCENT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}
        style={{ filter: `drop-shadow(0 0 14px ${ACCENT}66)` }}>LỖI Ở ĐÂU</text>

      {/* Terminal mock with Python code */}
      <g transform={`translate(${W / 2}, 700) scale(${codeSp})`}>
        <rect x={-460} y={-220} width={920} height={440} rx={14} fill="#0A0A1F" stroke={NEON_CYAN} strokeWidth={2.5}
          style={{ filter: `drop-shadow(0 14px 36px ${NEON_CYAN}55)` }} />
        <CornerBrackets x={-460} y={-220} w={920} h={440} color={NEON_CYAN} />
        {/* terminal header */}
        <circle cx={-430} cy={-190} r={8} fill="#FF5F57" />
        <circle cx={-405} cy={-190} r={8} fill="#FEBC2E" />
        <circle cx={-380} cy={-190} r={8} fill="#28C840" />
        <text x={-340} y={-184} fontSize={20} fill="#888" fontFamily="'JetBrains Mono', monospace">exploit.py · zero-day</text>
        {/* code lines */}
        <text x={-420} y={-110} fontSize={26} fill="#FF8" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>import requests</text>
        <text x={-420} y={-68} fontSize={26} fill="#9AA3C9" fontFamily="'JetBrains Mono', monospace"># bypass 2FA on admin tool</text>
        <text x={-420} y={-12} fontSize={26} fill={NEON_PINK} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>def bypass_2fa(target):</text>
        <text x={-420} y={30} fontSize={26} fill={TEXT} fontFamily="'JetBrains Mono', monospace">  payload = forge_token()</text>
        <text x={-420} y={72} fontSize={26} fill={TEXT} fontFamily="'JetBrains Mono', monospace">  return owned(target)</text>
        <text x={-420} y={130} fontSize={24} fill={GREEN} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>→ AI-discovered exploit</text>
      </g>

      {/* AUTH BYPASSED red stamp */}
      <g transform={`translate(${W / 2}, 1180) scale(${stampSp})`} opacity={stampSp}>
        <rect x={-380} y={-90} width={760} height={180} rx={14} fill={RED} stroke="#FFF" strokeWidth={5}
          style={{ filter: `drop-shadow(0 12px 36px ${RED}) drop-shadow(0 0 4px #FFF)` }} transform="rotate(-3 0 0)" />
        <CornerBrackets x={-380} y={-90} w={760} h={180} color="#FFF" len={24} />
        <text x={0} y={20} fontSize={88} fill="#FFF" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={900} transform="rotate(-3 0 0)"
          style={{ filter: "drop-shadow(0 0 12px #FFF)" }}>AUTH BYPASSED</text>
      </g>

      {/* Pills below */}
      <g transform={`translate(${W / 2}, 1430)`} opacity={pillsSp}>
        {["open-source admin tool", "Python script", "2FA bypass"].map((label, i) => (
          <g key={i} transform={`translate(${-300 + i * 300}, 0)`}>
            <rect x={-130} y={-32} width={260} height={64} rx={32} fill={PANEL} stroke={NEON_BLUE} strokeWidth={2} />
            <CornerBrackets x={-130} y={-32} w={260} h={64} color={NEON_BLUE} len={12} />
            <text x={0} y={9} fontSize={18} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{label}</text>
          </g>
        ))}
      </g>
    </g>
  );
};

// =============== BEAT 5: SCALE — Mass exploitation ===============
const Beat5: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(5);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const globeSp = spring({ frame: (p - 0.2) * FPS, fps: FPS, config: { damping: 12, stiffness: 220 } });
  const massSp = spring({ frame: (p - 0.8) * FPS, fps: FPS, config: { damping: 9, stiffness: 200 } });
  const blockSp = spring({ frame: (p - 3.0) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={36} fill={ACCENT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}
        style={{ filter: `drop-shadow(0 0 14px ${ACCENT}66)` }}>QUY MÔ TẤN CÔNG</text>

      {/* Globe with target rings */}
      <g transform={`translate(${W / 2}, 580) scale(${globeSp})`}>
        <GlowPulse cx={0} cy={0} r={170} color={RED} speed={0.05} />
        <text x={0} y={50} fontSize={200} textAnchor="middle">🌐</text>
        {/* Target dots scanning */}
        {[-160, -80, 0, 80, 160].map((dx, i) => (
          <circle key={i} cx={dx} cy={-30} r={6} fill={RED} opacity={0.6 + (i % 2) * 0.4}>
            <animate attributeName="opacity" values="1;0.3;1" dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>

      {/* MASS EXPLOITATION holo */}
      <g transform={`translate(${W / 2}, 940)`} opacity={massSp}>
        <GlowPulse cx={0} cy={0} r={200} color={RED} speed={0.06} />
        <HoloText x={0} y={0} size={130}>MASS EXPLOIT</HoloText>
      </g>

      {/* Subtitle */}
      <g transform={`translate(${W / 2}, 1130)`} opacity={massSp}>
        <text x={0} y={0} fontSize={26} fill={TEXT_DIM} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{`> quét toàn internet · tấn công đồng loạt`}</text>
      </g>

      {/* Google CHẶN green stamp */}
      <g transform={`translate(${W / 2}, 1370) scale(${blockSp})`} opacity={blockSp}>
        <rect x={-440} y={-100} width={880} height={200} rx={14} fill={GREEN} stroke="#FFF" strokeWidth={5}
          style={{ filter: `drop-shadow(0 14px 36px ${GREEN})` }} transform="rotate(-2 0 0)" />
        <CornerBrackets x={-440} y={-100} w={880} h={200} color="#FFF" len={26} />
        <text x={0} y={-12} fontSize={36} fill="#E8F5EA" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800} transform="rotate(-2 0 0)">GOOGLE CHẶN</text>
        <text x={0} y={48} fontSize={56} fill="#FFF" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={900} transform="rotate(-2 0 0)"
          style={{ filter: "drop-shadow(0 0 14px #FFF)" }}>TRƯỚC KHI NỔ</text>
      </g>
    </g>
  );
};

// =============== BEAT 6: WHO — China + N.Korea AI hackers ===============
const Beat6: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(6);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const titleSp = spring({ frame: (p - 0.1) * FPS, fps: FPS, config: { damping: 12, stiffness: 220 } });
  const cardSp = (i: number) => spring({ frame: (p - 0.5 - i * 0.3) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
  const versusSp = spring({ frame: (p - 2.5) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  const flags = [
    { flag: "🇨🇳", name: "Trung Quốc", subtitle: "AI vulnerability discovery" },
    { flag: "🇰🇵", name: "Triều Tiên", subtitle: "Săn zero-day bằng AI" },
  ];
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={36} fill={ACCENT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}
        style={{ filter: `drop-shadow(0 0 14px ${ACCENT}66)` }}>AI vs AI</text>

      <text x={W / 2} y={360} fontSize={26} fill={TEXT_DIM} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{`// đầu tư AI cho hacking`}</text>

      {/* 2 flag cards */}
      {flags.map((c, i) => (
        <g key={i} transform={`translate(${W / 2}, ${560 + i * 320}) scale(${cardSp(i)})`}>
          <rect x={-440} y={-130} width={880} height={260} rx={14} fill={PANEL} stroke={RED} strokeWidth={2.5}
            style={{ filter: `drop-shadow(0 12px 32px ${RED}77)` }} />
          <CornerBrackets x={-440} y={-130} w={880} h={260} color={RED} />
          <text x={-340} y={28} fontSize={140} textAnchor="middle">{c.flag}</text>
          <text x={120} y={-32} fontSize={56} fill={TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={900}>{c.name}</text>
          <text x={120} y={38} fontSize={24} fill={RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>● {c.subtitle}</text>
        </g>
      ))}

      {/* HoloText AI vs AI */}
      <g transform={`translate(${W / 2}, 1380)`} opacity={versusSp}>
        <GlowPulse cx={0} cy={0} r={180} color={NEON_PURPLE} speed={0.05} />
        <HoloText x={0} y={0} size={150}>AI vs AI</HoloText>
      </g>

      <text x={W / 2} y={1500} fontSize={28} fill={TEXT_DIM} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{`> Chiến trường mạng = chiến trường AI`}</text>
    </g>
  );
};

// =============== BEAT 7: INSIGHT — paradigm shift ===============
const Beat7: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(7);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  const titleSp = spring({ frame: (p - 0.1) * FPS, fps: FPS, config: { damping: 12, stiffness: 220 } });
  const oldSp = spring({ frame: (p - 0.5) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
  const newSp = spring({ frame: (p - 2.0) * FPS, fps: FPS, config: { damping: 13, stiffness: 220 } });
  const verdictSp = spring({ frame: (p - 4.0) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={36} fill={ACCENT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}
        style={{ filter: `drop-shadow(0 0 14px ${ACCENT}66)` }}>QUY TẮC MỚI</text>

      {/* OLD rule — strike */}
      <g transform={`translate(${W / 2}, 540) scale(${oldSp})`} opacity={oldSp}>
        <rect x={-460} y={-110} width={920} height={220} rx={14} fill={PANEL} stroke={RED} strokeWidth={2}
          style={{ filter: `drop-shadow(0 10px 28px ${RED}77)` }} />
        <CornerBrackets x={-460} y={-110} w={920} h={220} color={RED} />
        <text x={0} y={-32} fontSize={24} fill={RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>❌ QUY TẮC CŨ</text>
        <text x={0} y={42} fontSize={42} fill={TEXT_DIM} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800} opacity={0.6}>security team giỏi = an toàn</text>
        <line x1={-380} y1={32} x2={380} y2={52} stroke={RED} strokeWidth={6}
          style={{ filter: `drop-shadow(0 0 8px ${RED})` }} />
      </g>

      {/* NEW rule */}
      <g transform={`translate(${W / 2}, 870) scale(${newSp})`} opacity={newSp}>
        <rect x={-460} y={-110} width={920} height={220} rx={14} fill={PANEL} stroke={GREEN} strokeWidth={2.5}
          style={{ filter: `drop-shadow(0 10px 28px ${GREEN}88)` }} />
        <CornerBrackets x={-460} y={-110} w={920} h={220} color={GREEN} />
        <text x={0} y={-32} fontSize={24} fill={GREEN} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✓ QUY TẮC MỚI</text>
        <text x={0} y={42} fontSize={48} fill={TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={900}>AI tấn công · AI phòng thủ</text>
      </g>

      {/* Verdict HoloText */}
      <g transform={`translate(${W / 2}, 1280) scale(${verdictSp})`} opacity={verdictSp}>
        <GlowPulse cx={0} cy={0} r={220} color={RED} speed={0.06} />
        <HoloText x={0} y={0} size={130}>CHẬM = VỠ TRẬN</HoloText>
      </g>
    </g>
  );
};

// =============== BEAT 8: CTA — Follow card ===============
const Beat8: React.FC<{ t: number }> = ({ t }) => {
  const [a] = B(8);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.2], [0, 1], { extrapolateRight: "clamp" });
  const followSp = spring({ frame: (p - 0.2) * FPS, fps: FPS, config: { damping: 9, stiffness: 220 } });
  return (
    <g opacity={op}>
      <text x={W / 2} y={290} fontSize={36} fill={ACCENT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}
        style={{ filter: `drop-shadow(0 0 14px ${ACCENT}66)` }}>AI SECURITY · DAILY</text>

      {/* Big FOLLOW card */}
      <g transform={`translate(${W / 2}, 800) scale(${followSp})`}>
        <rect x={-460} y={-260} width={920} height={520} rx={20} fill={PANEL} stroke={ACCENT} strokeWidth={4}
          style={{ filter: `drop-shadow(0 16px 48px ${ACCENT}88)` }} />
        <CornerBrackets x={-460} y={-260} w={920} h={520} color={ACCENT} len={32} />
        <text x={0} y={-160} fontSize={120} textAnchor="middle">📣</text>
        <HoloText x={0} y={-20} size={120}>FOLLOW</HoloText>
        <text x={0} y={90} fontSize={32} fill={TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>tin AI security nóng nhất</text>
        <text x={0} y={138} fontSize={32} fill={TEXT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={700}>mỗi ngày</text>
        <text x={0} y={200} fontSize={22} fill={TEXT_DIM} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>{`> attack pattern · defense playbook · drama`}</text>
      </g>
    </g>
  );
};

export const GoogleAiHackerOpenclaw: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let activeBeat = 1;
  for (let i = beats.length - 1; i >= 0; i--) {
    if (t >= beats[i].start) { activeBeat = beats[i].index; break; }
  }
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <Bg />
      <Audio src={staticFile("gaihacker_voice.mp3")} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <CharFilters />
        <CardEffects />
        <SourceBadge />
        {activeBeat === 1 && <Beat1 t={t} />}
        {activeBeat === 2 && <Beat2 t={t} />}
        {activeBeat === 3 && <Beat3 t={t} />}
        {activeBeat === 4 && <Beat4 t={t} />}
        {activeBeat === 5 && <Beat5 t={t} />}
        {activeBeat === 6 && <Beat6 t={t} />}
        {activeBeat === 7 && <Beat7 t={t} />}
        {activeBeat === 8 && <Beat8 t={t} />}
        {/* Teacher anchor — bottom-right, animated per beat */}
        {(() => {
          const config = POSE_BY_BEAT[activeBeat] || POSE_BY_BEAT[1];
          return <Teacher x={920} y={1640} scale={1.6} pose={config.pose} expression={config.expression} t={t} />;
        })()}
      </svg>
      <Caption />
    </AbsoluteFill>
  );
};
