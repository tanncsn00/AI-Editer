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
import wordsData from "./gtl_tap_02_words.json";

loadEBGaramond("normal", { weights: ["500","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// GIẢI THÍCH KIỂU LƯỜI · Tập 2 — "HOA VÀ ONG"
// ductrong 0.9x · 7 scenes with action animation · word-timing mouth sync
// Blueprint chalk style

const FPS = 30;
const W = 1080;
const H = 1920;
const BG_DEEP = "#050E1E";
const BG_MID = "#0A1838";
const BG_GLOW = "#1E4878";
const CHALK = "#F5F7FA";
const DIM = "#7090B0";
const YELLOW = "#FFD93D";
const RED = "#FF5542";

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

// Beat timings from beats.json
const T = {
  hook:       [0.0, 7.0] as const,
  swarm:      [7.0, 16.0] as const,
  wilt:       [16.0, 24.5] as const,
  newFlower:  [24.5, 36.5] as const,
  nature:     [36.5, 44.0] as const,
  manyNames:  [44.0, 55.5] as const,
  punch:      [55.5, 61.5] as const,
  outro:      [61.5, 66.0] as const,
};
const inRange = (t: number, r: readonly [number, number]) => t >= r[0] && t < r[1];

// ---------- word-timing driven mouth sync ----------
const mouthOpenAt = (t: number): number => {
  for (const w of words) {
    if (t >= w.start && t < w.end) {
      const progress = (t - w.start) / Math.max(w.end - w.start, 0.01);
      return Math.sin(progress * Math.PI); // 0 → 1 → 0
    }
  }
  return 0;
};

// ---------- DEFS ----------
const Defs: React.FC = () => (
  <defs>
    <radialGradient id="bpGlow" cx="50%" cy="52%" r="58%">
      <stop offset="0%" stopColor={BG_GLOW} stopOpacity="1" />
      <stop offset="55%" stopColor={BG_MID} stopOpacity="1" />
      <stop offset="100%" stopColor={BG_DEEP} stopOpacity="1" />
    </radialGradient>
    <filter id="chalkGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="chalkGrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
      <feColorMatrix values="0 0 0 0 0.95  0 0 0 0 0.97  0 0 0 0 1  0 0 0 0.08 0" />
    </filter>
    <radialGradient id="vigEdge" cx="50%" cy="50%" r="78%">
      <stop offset="55%" stopColor="#000" stopOpacity="0" />
      <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
    </radialGradient>
  </defs>
);

// ---------- FLOWER component ----------
const Flower: React.FC<{ cx: number; cy: number; scale: number; wilt?: number; phase?: number }> = ({ cx, cy, scale, wilt = 0, phase = 0 }) => {
  const sway = Math.sin(phase / 2) * 2 * (1 - wilt);
  const petalOpacity = 1 - wilt * 0.65;
  const stemDroop = wilt * 40;
  return (
    <g transform={`translate(${cx + sway}, ${cy})`}>
      {/* Stem */}
      <path
        d={`M 0 ${180 + stemDroop} Q ${-4 + wilt * 20} 100 0 0`}
        stroke={CHALK}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
      />
      {/* Leaves on stem */}
      <path d={`M 0 80 Q ${-30 - wilt * 10} ${90 + wilt * 20} -40 ${110 + wilt * 25}`} stroke={CHALK} strokeWidth={3} fill="none" opacity={petalOpacity} />
      <path d={`M 0 120 Q ${28 + wilt * 10} ${130 + wilt * 15} 38 ${148 + wilt * 20}`} stroke={CHALK} strokeWidth={3} fill="none" opacity={petalOpacity} />
      {/* Petals — 6 petals around center */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const petalWilt = wilt * 20;
        const px = Math.cos(rad) * 44;
        const py = Math.sin(rad) * 44 + petalWilt;
        return (
          <g key={i} transform={`translate(${px}, ${py}) rotate(${deg})`} opacity={petalOpacity}>
            <ellipse cx={0} cy={0} rx={30} ry={18} fill="none" stroke={CHALK} strokeWidth={3.5} />
          </g>
        );
      })}
      {/* Center (nhuỵ) */}
      <circle cx={0} cy={wilt * 18} r={16} fill="none" stroke={CHALK} strokeWidth={3.5} />
      <circle cx={0} cy={wilt * 18} r={8} fill={CHALK} opacity={0.6 - wilt * 0.5} />
      {/* Pollen dots */}
      {wilt < 0.3 && (
        <>
          <circle cx={-6} cy={-4} r={2} fill={CHALK} opacity={0.8} />
          <circle cx={5} cy={-2} r={2} fill={CHALK} opacity={0.8} />
          <circle cx={0} cy={4} r={2} fill={CHALK} opacity={0.8} />
        </>
      )}
    </g>
  );
};

// ---------- BEE component ----------
const Bee: React.FC<{ cx: number; cy: number; scale?: number; phase: number; rot?: number }> = ({ cx, cy, scale = 1, phase, rot = 0 }) => {
  const wingFlap = Math.sin(phase * 20) * 0.4 + 0.6;
  return (
    <g transform={`translate(${cx}, ${cy}) scale(${scale}) rotate(${rot})`}>
      {/* Body */}
      <ellipse cx={0} cy={0} rx={14} ry={8} fill="none" stroke={CHALK} strokeWidth={2.5} />
      {/* Stripes */}
      <line x1={-6} y1={-7} x2={-6} y2={7} stroke={CHALK} strokeWidth={1.8} />
      <line x1={0} y1={-8} x2={0} y2={8} stroke={CHALK} strokeWidth={1.8} />
      <line x1={6} y1={-7} x2={6} y2={7} stroke={CHALK} strokeWidth={1.8} />
      {/* Head */}
      <circle cx={-14} cy={0} r={5} fill="none" stroke={CHALK} strokeWidth={2} />
      {/* Antennae */}
      <line x1={-17} y1={-4} x2={-22} y2={-10} stroke={CHALK} strokeWidth={1.5} />
      <line x1={-17} y1={4} x2={-22} y2={10} stroke={CHALK} strokeWidth={1.5} />
      {/* Wings (scaled by flap) */}
      <ellipse cx={-2} cy={-12 * wingFlap} rx={10} ry={6 * wingFlap} fill="none" stroke={CHALK} strokeWidth={1.8} opacity={0.7} />
      <ellipse cx={-2} cy={12 * wingFlap} rx={10} ry={6 * wingFlap} fill="none" stroke={CHALK} strokeWidth={1.8} opacity={0.7} />
      {/* Stinger */}
      <line x1={14} y1={0} x2={20} y2={0} stroke={CHALK} strokeWidth={2} />
    </g>
  );
};

// ---------- STICK FIGURE helper with word-timing mouth sync ----------
const stick = (opts: {
  cx: number; cy: number; scale?: number;
  pose?: "stand" | "sit" | "throw" | "reach" | "hands_open" | "shoulders_drop";
  phase: number;
  mouthOpen: number;
  handX?: number; // custom hand position for throwing
}) => {
  const { cx, cy, scale = 1, pose = "stand", phase, mouthOpen, handX = 0 } = opts;
  const bob = Math.sin(phase / 2.5) * 1.8;
  const blinkCycle = (phase * 2) % 8;
  const blinking = blinkCycle < 0.3;

  return (
    <g transform={`translate(${cx}, ${cy + bob}) scale(${scale})`}>
      {/* Head */}
      <circle cx={0} cy={-85} r={22} fill="none" stroke={CHALK} strokeWidth={4} />
      {/* Eyes */}
      {!blinking ? (
        <>
          <line x1={-10} y1={-86} x2={-5} y2={-86} stroke={CHALK} strokeWidth={3} strokeLinecap="round" />
          <line x1={5} y1={-86} x2={10} y2={-86} stroke={CHALK} strokeWidth={3} strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M -10 -85 Q -7 -82 -4 -85" stroke={CHALK} strokeWidth={2.5} fill="none" />
          <path d="M 4 -85 Q 7 -82 10 -85" stroke={CHALK} strokeWidth={2.5} fill="none" />
        </>
      )}
      {/* Mouth — word-timing driven */}
      {mouthOpen > 0.15 ? (
        <ellipse cx={0} cy={-74} rx={4 + mouthOpen * 2.5} ry={1 + mouthOpen * 3} fill={CHALK} />
      ) : (
        <line x1={-5} y1={-75} x2={5} y2={-75} stroke={CHALK} strokeWidth={3} strokeLinecap="round" />
      )}
      {/* Body */}
      <line x1={0} y1={-60} x2={0} y2={0} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
      {/* Arms — per pose */}
      {pose === "throw" ? (
        <>
          <line x1={0} y1={-40} x2={-22} y2={-10} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <line x1={0} y1={-40} x2={30 + handX} y2={-70 - handX * 0.3} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
        </>
      ) : pose === "hands_open" ? (
        <>
          <line x1={0} y1={-40} x2={-28} y2={-20} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <line x1={-28} y1={-20} x2={-40} y2={-10} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <line x1={0} y1={-40} x2={28} y2={-20} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <line x1={28} y1={-20} x2={40} y2={-10} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
        </>
      ) : pose === "shoulders_drop" ? (
        <>
          <line x1={0} y1={-40} x2={-18} y2={20} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <line x1={0} y1={-40} x2={18} y2={20} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
        </>
      ) : pose === "sit" ? (
        <>
          <line x1={0} y1={-40} x2={-20} y2={-6} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <line x1={0} y1={-40} x2={20} y2={-6} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1={0} y1={-40} x2={-22} y2={10} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <line x1={0} y1={-40} x2={22} y2={10} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
        </>
      )}
      {/* Legs */}
      {pose === "sit" ? (
        <>
          <line x1={0} y1={0} x2={-24} y2={30} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <line x1={-24} y1={30} x2={-22} y2={60} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <line x1={0} y1={0} x2={24} y2={30} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <line x1={24} y1={30} x2={26} y2={60} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1={0} y1={0} x2={-14} y2={70} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
          <line x1={0} y1={0} x2={14} y2={70} stroke={CHALK} strokeWidth={4} strokeLinecap="round" />
        </>
      )}
    </g>
  );
};

// ---------- TITLE BAR ----------
const TitleBar: React.FC = () => (
  <text x={W/2} y={240} fontSize={56} fill={YELLOW} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2" stroke={RED} strokeWidth={2} paintOrder="stroke">
    GIẢI THÍCH KIỂU LƯỜI
  </text>
);

// ---------- SCENES ----------

// 1. HOOK — Flower alone in garden, person standing next to it
const SceneHook: React.FC<{ lf: number; tGlobal: number }> = ({ lf, tGlobal }) => {
  const phase = lf / 2;
  const mOpen = mouthOpenAt(tGlobal);
  return (
    <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
      {/* Ground */}
      <line x1={80} y1={1520} x2={W - 80} y2={1520} strokeWidth={4} />
      {/* Garden grass hints */}
      {[180, 280, 380, 680, 780, 880].map((gx, i) => (
        <g key={i}>
          <line x1={gx} y1={1520} x2={gx - 4} y2={1500} strokeWidth={2} opacity={0.5} />
          <line x1={gx + 6} y1={1520} x2={gx + 4} y2={1502} strokeWidth={2} opacity={0.5} />
        </g>
      ))}
      {/* Fence back */}
      <line x1={80} y1={900} x2={W - 80} y2={900} strokeWidth={2} opacity={0.4} />
      {[160, 260, 360, 460, 620, 720, 820, 920].map((fx, i) => (
        <line key={i} x1={fx} y1={870} x2={fx} y2={960} strokeWidth={2} opacity={0.4} />
      ))}
      {/* Sun/moon */}
      <circle cx={900} cy={780} r={36} fill="none" strokeWidth={3} opacity={0.55} />
      <line x1={900} y1={720} x2={900} y2={740} strokeWidth={2} opacity={0.45} />
      <line x1={850} y1={780} x2={830} y2={780} strokeWidth={2} opacity={0.45} />
      <line x1={970} y1={780} x2={950} y2={780} strokeWidth={2} opacity={0.45} />

      {/* Big flower center */}
      <Flower cx={540} cy={1280} scale={1} wilt={0} phase={phase} />

      {/* Character standing next to flower */}
      {stick({ cx: 300, cy: 1520, scale: 2.0, phase, mouthOpen: mOpen })}
    </g>
  );
};

// 2. SWARM — bees flying in from all directions
const SceneSwarm: React.FC<{ lf: number; tGlobal: number }> = ({ lf, tGlobal }) => {
  const phase = lf / 2;
  const mOpen = mouthOpenAt(tGlobal);
  // Bees come in gradually
  const beeAppearances = [
    { delay: 0, from: [-100, 400], end: [460, 1150] },
    { delay: 15, from: [1200, 500], end: [620, 1120] },
    { delay: 30, from: [-80, 1100], end: [440, 1280] },
    { delay: 45, from: [1180, 1000], end: [640, 1260] },
    { delay: 60, from: [500, 200], end: [540, 1200] },
    { delay: 75, from: [300, 1700], end: [480, 1320] },
    { delay: 90, from: [780, 1700], end: [600, 1300] },
  ];
  return (
    <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
      <line x1={80} y1={1520} x2={W - 80} y2={1520} strokeWidth={4} />
      {[180, 280, 380, 680, 780, 880].map((gx, i) => (
        <g key={i}>
          <line x1={gx} y1={1520} x2={gx - 4} y2={1500} strokeWidth={2} opacity={0.5} />
          <line x1={gx + 6} y1={1520} x2={gx + 4} y2={1502} strokeWidth={2} opacity={0.5} />
        </g>
      ))}
      <line x1={80} y1={900} x2={W - 80} y2={900} strokeWidth={2} opacity={0.4} />

      <Flower cx={540} cy={1280} scale={1} wilt={0} phase={phase} />
      {stick({ cx: 300, cy: 1520, scale: 2.0, phase, mouthOpen: mOpen })}

      {/* Bees flying in with sine wobble on path */}
      {beeAppearances.map((b, i) => {
        const progress = Math.min(1, Math.max(0, (lf - b.delay) / 60));
        if (progress <= 0) return null;
        const bx = b.from[0] + (b.end[0] - b.from[0]) * progress + Math.sin(phase * 2 + i) * 10;
        const by = b.from[1] + (b.end[1] - b.from[1]) * progress + Math.cos(phase * 2.5 + i) * 8;
        const angle = Math.atan2(b.end[1] - b.from[1], b.end[0] - b.from[0]) * 180 / Math.PI;
        return <Bee key={i} cx={bx} cy={by} scale={1.4} phase={phase + i} rot={progress < 1 ? angle : Math.sin(phase + i) * 20} />;
      })}
    </g>
  );
};

// 3. WILT — Flower petals droop, bees leaving
const SceneWilt: React.FC<{ lf: number; tGlobal: number }> = ({ lf, tGlobal }) => {
  const phase = lf / 2;
  const mOpen = mouthOpenAt(tGlobal);
  const wiltProgress = Math.min(1, lf / 90);
  // Bees leaving — move outward
  const bees = [
    { startX: 460, startY: 1150 },
    { startX: 620, startY: 1120 },
    { startX: 440, startY: 1280 },
    { startX: 640, startY: 1260 },
    { startX: 540, startY: 1200 },
    { startX: 480, startY: 1320 },
  ];
  return (
    <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
      <line x1={80} y1={1520} x2={W - 80} y2={1520} strokeWidth={4} />
      {[180, 280, 380, 680, 780, 880].map((gx, i) => (
        <g key={i}>
          <line x1={gx} y1={1520} x2={gx - 4} y2={1500} strokeWidth={2} opacity={0.5} />
        </g>
      ))}
      <line x1={80} y1={900} x2={W - 80} y2={900} strokeWidth={2} opacity={0.4} />

      {/* Wilted flower */}
      <Flower cx={540} cy={1280} scale={1} wilt={wiltProgress} phase={phase} />

      {/* Fallen petals */}
      {wiltProgress > 0.3 && [...Array(5)].map((_, i) => {
        const fx = 500 + i * 25;
        const fy = 1480 + Math.sin(i) * 10;
        return (
          <ellipse key={i} cx={fx} cy={fy} rx={14} ry={6} fill="none" stroke={CHALK} strokeWidth={2.5} opacity={0.6} transform={`rotate(${i * 30 - 60} ${fx} ${fy})`} />
        );
      })}

      {stick({ cx: 300, cy: 1520, scale: 2.0, phase, mouthOpen: mOpen, pose: "shoulders_drop" })}

      {/* Bees flying away to the right-top */}
      {bees.map((b, i) => {
        const t = Math.min(1, Math.max(0, (lf - i * 6) / 90));
        const endX = 1400 + i * 30;
        const endY = 200 + i * 50;
        const bx = b.startX + (endX - b.startX) * t + Math.sin(phase * 2 + i) * 8;
        const by = b.startY + (endY - b.startY) * t + Math.cos(phase * 2 + i) * 6;
        if (t > 0.98) return null;
        return <Bee key={i} cx={bx} cy={by} scale={1.3 * (1 - t * 0.3)} phase={phase + i * 0.5} rot={30 - t * 20} />;
      })}
    </g>
  );
};

// 4. NEW FLOWER — bees move to new fresh flower
const SceneNewFlower: React.FC<{ lf: number; tGlobal: number }> = ({ lf, tGlobal }) => {
  const phase = lf / 2;
  const mOpen = mouthOpenAt(tGlobal);
  return (
    <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
      <line x1={80} y1={1520} x2={W - 80} y2={1520} strokeWidth={4} />
      {[180, 280, 380, 680, 780, 880].map((gx, i) => (
        <line key={i} x1={gx} y1={1520} x2={gx - 4} y2={1500} strokeWidth={2} opacity={0.5} />
      ))}
      <line x1={80} y1={900} x2={W - 80} y2={900} strokeWidth={2} opacity={0.4} />

      {/* Old wilted flower on left */}
      <Flower cx={260} cy={1300} scale={0.75} wilt={0.9} phase={phase} />

      {/* New fresh flower on right, slightly bigger, brighter */}
      <g>
        <Flower cx={820} cy={1260} scale={1.15} wilt={0} phase={phase} />
        {/* Sparkle marks around new flower */}
        <text x={720} y={1100} fontSize={30} fill={YELLOW} opacity={0.7}>✦</text>
        <text x={940} y={1140} fontSize={28} fill={YELLOW} opacity={0.65}>✦</text>
        <text x={880} y={1060} fontSize={26} fill={YELLOW} opacity={0.6}>✦</text>
      </g>

      {/* Bees clustered around new flower */}
      {[[760, 1180], [880, 1170], [820, 1110], [900, 1240], [740, 1260], [860, 1300]].map(([bx, by], i) => {
        const ox = Math.sin(phase * 3 + i * 1.2) * 8;
        const oy = Math.cos(phase * 3 + i * 1.2) * 6;
        return <Bee key={i} cx={bx + ox} cy={by + oy} scale={1.2} phase={phase + i * 0.5} rot={i * 40} />;
      })}

      {/* Character looking at new flower from distance */}
      {stick({ cx: 180, cy: 1520, scale: 1.7, phase, mouthOpen: mOpen, pose: "shoulders_drop" })}

      {/* Arrow from old to new — subtle dashed */}
      <path d="M 340 1260 Q 540 1180 700 1220" stroke={CHALK} strokeWidth={2.5} fill="none" strokeDasharray="10 6" opacity={0.55} />
    </g>
  );
};

// 5. NATURE — close up single bee feeding on flower (pollen)
const SceneNature: React.FC<{ lf: number; tGlobal: number }> = ({ lf, tGlobal }) => {
  const phase = lf / 2;
  return (
    <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
      {/* Close-up big flower */}
      <g transform="translate(540, 1100)">
        {/* Petals */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const px = Math.cos(rad) * 160;
          const py = Math.sin(rad) * 160;
          return (
            <g key={i} transform={`translate(${px}, ${py}) rotate(${deg})`}>
              <ellipse cx={0} cy={0} rx={100} ry={54} fill="none" stroke={CHALK} strokeWidth={4} />
            </g>
          );
        })}
        {/* Center nhuỵ big */}
        <circle cx={0} cy={0} r={50} fill="none" stroke={CHALK} strokeWidth={5} />
        <circle cx={0} cy={0} r={30} fill="none" stroke={CHALK} strokeWidth={3} opacity={0.8} />
        {/* Pollen dots inside */}
        {[[-14, -8], [10, -12], [-4, 12], [16, 4], [-18, 8], [4, -18]].map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={3} fill={CHALK} opacity={0.85} />
        ))}
      </g>

      {/* Single bee focused on pollen — hovering close */}
      <g transform={`translate(${620 + Math.sin(phase * 3) * 6}, ${1100 + Math.cos(phase * 3) * 4})`}>
        <Bee cx={0} cy={0} scale={2.8} phase={phase} rot={-15} />
      </g>

      {/* Bee "eyes on pollen" line — focus arrow */}
      <path d="M 590 1110 Q 570 1100 555 1095" stroke={YELLOW} strokeWidth={2} fill="none" opacity={0.55} strokeDasharray="4 4" />
    </g>
  );
};

// 6. MANY NAMES — 4 icons: coin, crown, lipstick, trending arrow
const SceneManyNames: React.FC<{ lf: number; tGlobal: number }> = ({ lf, tGlobal }) => {
  const phase = lf / 2;
  const mOpen = mouthOpenAt(tGlobal);
  const icons = [
    { delay: 0, x: 270, y: 900, label: "tiền" },
    { delay: 20, x: 540, y: 900, label: "sắc đẹp" },
    { delay: 40, x: 810, y: 900, label: "chức" },
    { delay: 60, x: 540, y: 1160, label: "thời" },
  ];
  return (
    <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
      <line x1={80} y1={1520} x2={W - 80} y2={1520} strokeWidth={4} />

      {/* Central flower small */}
      <Flower cx={540} cy={1420} scale={0.5} wilt={0} phase={phase} />

      {/* 4 icons representing "mật" — appearing sequentially */}
      {icons.map((icon, i) => {
        const appear = spring({ frame: lf - icon.delay, fps: FPS, config: { damping: 12, stiffness: 150 } });
        if (appear <= 0.01) return null;
        return (
          <g key={i} transform={`translate(${icon.x}, ${icon.y}) scale(${appear})`}>
            <rect x={-90} y={-70} width={180} height={140} fill="none" strokeWidth={4} />
            {/* Draw different icon per type */}
            {i === 0 && (
              // Coin stack
              <g>
                <ellipse cx={0} cy={-10} rx={40} ry={10} fill="none" strokeWidth={3} />
                <path d="M -40 -10 L -40 10 Q -40 20 0 20 Q 40 20 40 10 L 40 -10" fill="none" strokeWidth={3} />
                <text x={0} y={8} fontSize={30} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={800}>$</text>
                <ellipse cx={0} cy={-26} rx={40} ry={10} fill="none" strokeWidth={3} opacity={0.6} />
              </g>
            )}
            {i === 1 && (
              // Makeup mirror / compact
              <g>
                <circle cx={0} cy={0} r={40} fill="none" strokeWidth={3} />
                <circle cx={0} cy={0} r={30} fill="none" strokeWidth={2} opacity={0.5} />
                <line x1={-18} y1={-18} x2={-8} y2={-8} strokeWidth={2} opacity={0.6} />
              </g>
            )}
            {i === 2 && (
              // Crown / authority
              <g>
                <path d="M -40 20 L -40 -10 L -20 10 L 0 -20 L 20 10 L 40 -10 L 40 20 Z" fill="none" strokeWidth={3} />
                <circle cx={-20} cy={-14} r={3} fill={CHALK} />
                <circle cx={0} cy={-24} r={3} fill={CHALK} />
                <circle cx={20} cy={-14} r={3} fill={CHALK} />
              </g>
            )}
            {i === 3 && (
              // Rising arrow / trending
              <g>
                <path d="M -40 30 L -10 0 L 10 20 L 40 -20" stroke={CHALK} strokeWidth={4} fill="none" />
                <path d="M 40 -20 L 28 -20 M 40 -20 L 40 -8" strokeWidth={4} fill="none" />
              </g>
            )}
            <text x={0} y={58} fontSize={24} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic">
              {icon.label}
            </text>
          </g>
        );
      })}

      {/* Character on right looking at icons */}
      {stick({ cx: 960, cy: 1520, scale: 1.5, phase, mouthOpen: mOpen, pose: "stand" })}
    </g>
  );
};

// 7. PUNCHLINE — Character sitting alone, one other figure walks in and sits beside
const ScenePunch: React.FC<{ lf: number; tGlobal: number }> = ({ lf, tGlobal }) => {
  const phase = lf / 2;
  const mOpen = mouthOpenAt(tGlobal);
  // Second figure walks in from left after delay
  const walkProgress = Math.min(1, Math.max(0, (lf - 20) / 70));
  const secondX = -100 + (380 - (-100)) * walkProgress;
  return (
    <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
      <line x1={80} y1={1520} x2={W - 80} y2={1520} strokeWidth={4} />

      {/* Wilted flower remains */}
      <Flower cx={720} cy={1430} scale={0.6} wilt={1} phase={phase} />

      {/* Main character sitting */}
      {stick({ cx: 540, cy: 1460, scale: 2.0, phase, mouthOpen: mOpen, pose: "sit" })}

      {/* Second figure walking in then sitting */}
      {walkProgress < 0.9 ? (
        stick({ cx: secondX, cy: 1460, scale: 1.8, phase: phase * 1.4, mouthOpen: 0 })
      ) : (
        stick({ cx: 380, cy: 1460, scale: 1.8, phase, mouthOpen: 0, pose: "sit" })
      )}

      {/* Moon */}
      <circle cx={900} cy={780} r={40} fill="none" strokeWidth={3} opacity={0.6} />
      <circle cx={888} cy={770} r={6} fill="none" strokeWidth={2} opacity={0.4} />
      <circle cx={906} cy={785} r={4} fill="none" strokeWidth={2} opacity={0.4} />

      {/* Stars */}
      {[[200, 500], [400, 400], [700, 450], [900, 550], [300, 650]].map(([sx, sy], i) => (
        <text key={i} x={sx} y={sy} fontSize={16} fill={CHALK} opacity={0.55}>✦</text>
      ))}
    </g>
  );
};

// ---------- CAPTION ----------
const Caption: React.FC<{ hide: boolean }> = ({ hide }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (hide) return null;
  let active: Sentence | null = null;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i + 1];
    const boundary = next ? next.start : s.end + 0.5;
    if (t >= s.start - 0.1 && t < boundary) { active = s; break; }
  }
  if (!active) return null;
  const LEAD = 0.1;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 180 }}>
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center",
        gap: "0 10px", maxWidth: 980, padding: "12px 32px",
      }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [6, 0]);
          const isActive = t >= w.start - LEAD && t < w.end;
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 800,
              fontSize: 42,
              color: isActive ? RED : YELLOW,
              opacity: visible ? sp : 0,
              transform: `translateY(${y}px)`,
              lineHeight: 1.2,
              WebkitTextStroke: "3px #000000",
              textShadow: "0 0 12px rgba(0,0,0,0.95)",
            }}>{w.word}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- OUTRO ----------
const SceneOutro: React.FC<{ lf: number }> = ({ lf }) => {
  const sp = spring({ frame: lf, fps: FPS, config: { damping: 12, stiffness: 80, mass: 1.2 } });
  return (
    <g opacity={sp}>
      <rect x={0} y={0} width={W} height={H} fill="#040812" />
      <text x={W/2} y={H/2 - 80} fontSize={28} fill={DIM} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} letterSpacing="8">
        — HOA VÀ ONG —
      </text>
      <text x={W/2} y={H/2 + 40} fontSize={94} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={700} letterSpacing="2" stroke={RED} strokeWidth={3} paintOrder="stroke">
        GIẢI THÍCH
      </text>
      <text x={W/2} y={H/2 + 140} fontSize={94} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={700} letterSpacing="2" stroke={RED} strokeWidth={3} paintOrder="stroke">
        KIỂU LƯỜI
      </text>
      <line x1={W/2 - 180} y1={H/2 + 180} x2={W/2 + 180} y2={H/2 + 180} stroke={CHALK} strokeWidth={2} opacity={0.6} />
      <text x={W/2} y={H/2 + 230} fontSize={30} fill={CHALK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontStyle="italic" opacity={0.85}>
        follow để xem tập sau
      </text>
    </g>
  );
};

// ---------- MAIN ----------
export const GtlTap02: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const globalOp = interpolate(frame, [0, 10, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const scenes: Array<[readonly [number, number], (lf: number, tGlobal: number) => React.ReactNode]> = [
    [T.hook,      (lf, tg) => <SceneHook lf={lf} tGlobal={tg} />],
    [T.swarm,     (lf, tg) => <SceneSwarm lf={lf} tGlobal={tg} />],
    [T.wilt,      (lf, tg) => <SceneWilt lf={lf} tGlobal={tg} />],
    [T.newFlower, (lf, tg) => <SceneNewFlower lf={lf} tGlobal={tg} />],
    [T.nature,    (lf, tg) => <SceneNature lf={lf} tGlobal={tg} />],
    [T.manyNames, (lf, tg) => <SceneManyNames lf={lf} tGlobal={tg} />],
    [T.punch,     (lf, tg) => <ScenePunch lf={lf} tGlobal={tg} />],
  ];

  const outroActive = t >= T.outro[0];

  return (
    <AbsoluteFill style={{ backgroundColor: BG_DEEP, opacity: globalOp }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Defs />
        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#bpGlow)" />

        {!outroActive && <TitleBar />}

        {scenes.map(([range, renderFn], i) => {
          if (!inRange(t, range)) return null;
          const lf = frame - range[0] * FPS;
          const fadeIn = interpolate(t, [range[0], range[0] + 0.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const fadeOut = interpolate(t, [range[1] - 0.3, range[1]], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const op = Math.min(fadeIn, fadeOut);
          return (
            <g key={i} opacity={op}>
              {renderFn(lf, t)}
            </g>
          );
        })}

        <rect width={W} height={H} fill="url(#vigEdge)" />
        <rect width={W} height={H} filter="url(#chalkGrain)" opacity={0.4} />

        {outroActive && <SceneOutro lf={frame - T.outro[0] * FPS} />}
      </svg>
      <Caption hide={outroActive} />
      <Audio src={staticFile("gtl_tap_02/voice.mp3")} volume={0.85} />
      <Audio src={staticFile("gtl_tap_02/music.mp3")} volume={0.07} />
    </AbsoluteFill>
  );
};
