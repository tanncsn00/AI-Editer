import { AbsoluteFill } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadEBGaramond("normal", { weights: ["500","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

const W = 1080;
const H = 1920;
const BG_DEEP = "#050E1E";
const BG_MID = "#0A1838";
const BG_GLOW = "#1E4878";
const CHALK = "#F5F7FA";
const YELLOW = "#FFD93D";
const RED = "#FF5542";

export const GtlTap02Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="tn2Glow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={BG_GLOW} />
            <stop offset="55%" stopColor={BG_MID} />
            <stop offset="100%" stopColor={BG_DEEP} />
          </radialGradient>
          <filter id="tn2ChalkGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="tn2Grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="5" />
            <feColorMatrix values="0 0 0 0 0.95  0 0 0 0 0.97  0 0 0 0 1  0 0 0 0.1 0" />
          </filter>
          <radialGradient id="tn2Vig" cx="50%" cy="50%" r="75%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#tn2Glow)" />

        {/* Top branding */}
        <text x={W/2} y={210} fontSize={40} fill={YELLOW} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="4" stroke={RED} strokeWidth={2} paintOrder="stroke">
          GIẢI THÍCH KIỂU LƯỜI
        </text>
        <line x1={W/2 - 200} y1={238} x2={W/2 + 200} y2={238} stroke={CHALK} strokeWidth={2} opacity={0.6} />
        <text x={W/2} y={280} fontSize={22} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.65}>— tập 02 —</text>

        {/* BIG HOOK */}
        <g filter="url(#tn2ChalkGlow)">
          <text x={W/2} y={450} fontSize={140} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={800} stroke={RED} strokeWidth={4} paintOrder="stroke">
            HOA
          </text>
          <text x={W/2} y={560} fontSize={70} fill={CHALK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic" opacity={0.85}>
            và
          </text>
          <text x={W/2} y={690} fontSize={140} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={800} stroke={RED} strokeWidth={4} paintOrder="stroke">
            ONG
          </text>
        </g>

        {/* Central illustration — big flower + bees circling */}
        <g filter="url(#tn2ChalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
          {/* Big flower center */}
          <g transform="translate(540, 1150)">
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <g key={i} transform={`translate(${Math.cos(rad) * 120}, ${Math.sin(rad) * 120}) rotate(${deg})`}>
                  <ellipse cx={0} cy={0} rx={85} ry={44} fill="none" strokeWidth={4} />
                </g>
              );
            })}
            <circle cx={0} cy={0} r={40} fill="none" strokeWidth={5} />
            <circle cx={0} cy={0} r={24} fill={CHALK} opacity={0.6} />
            {/* Pollen */}
            {[[-8, -6], [10, -4], [-4, 10], [6, -12], [12, 8]].map(([px, py], i) => (
              <circle key={i} cx={px} cy={py} r={3} fill={CHALK} opacity={0.85} />
            ))}
            {/* Stem */}
            <path d="M 0 180 Q -4 280 0 380" strokeWidth={5} fill="none" />
            <path d="M 0 260 Q -30 270 -44 290" strokeWidth={3} fill="none" />
            <path d="M 0 310 Q 30 320 42 336" strokeWidth={3} fill="none" />
          </g>

          {/* Bees circling flower */}
          {[
            { x: 340, y: 950, rot: -20 },
            { x: 760, y: 970, rot: 30 },
            { x: 400, y: 1260, rot: 60 },
            { x: 740, y: 1280, rot: -40 },
            { x: 540, y: 920, rot: 0 },
            { x: 260, y: 1180, rot: -90 },
          ].map((b, i) => (
            <g key={i} transform={`translate(${b.x}, ${b.y}) scale(1.8) rotate(${b.rot})`}>
              <ellipse cx={0} cy={0} rx={14} ry={8} fill="none" strokeWidth={2.5} />
              <line x1={-6} y1={-7} x2={-6} y2={7} strokeWidth={1.8} />
              <line x1={0} y1={-8} x2={0} y2={8} strokeWidth={1.8} />
              <line x1={6} y1={-7} x2={6} y2={7} strokeWidth={1.8} />
              <circle cx={-14} cy={0} r={5} fill="none" strokeWidth={2} />
              <ellipse cx={-2} cy={-10} rx={10} ry={5} fill="none" strokeWidth={1.8} opacity={0.7} />
              <ellipse cx={-2} cy={10} rx={10} ry={5} fill="none" strokeWidth={1.8} opacity={0.7} />
            </g>
          ))}

          {/* Ground */}
          <line x1={120} y1={1620} x2={W - 120} y2={1620} strokeWidth={4} />
        </g>

        {/* Vignette + grain */}
        <rect width={W} height={H} filter="url(#tn2Grain)" opacity={0.4} />
        <rect width={W} height={H} fill="url(#tn2Vig)" />

        {/* Bottom quote */}
        <rect x={80} y={H - 260} width={W - 160} height={180} fill="none" stroke={YELLOW} strokeWidth={4} strokeDasharray="14 8" />
        <text x={W/2} y={H - 188} fontSize={32} fill={CHALK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontStyle="italic" opacity={0.8}>
          ong không yêu hoa.
        </text>
        <text x={W/2} y={H - 120} fontSize={56} fill={YELLOW} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={800} fontStyle="italic" stroke={RED} strokeWidth={2} paintOrder="stroke">
          ong yêu mật.
        </text>
      </svg>
    </AbsoluteFill>
  );
};
