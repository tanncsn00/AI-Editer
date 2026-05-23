import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#06070D";
const BG_SURFACE = "#10121C";
const TEXT_PRI = "#F5F5FA";
const TEXT_MUTE = "#5A6075";
const G_BLUE = "#4285F4";
const G_RED = "#EA4335";
const G_YELLOW = "#FBBC04";
const G_GREEN = "#34A853";

export const GoogleIO2026Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="th1" cx="20%" cy="0%" r="70%">
            <stop offset="0%" stopColor={G_BLUE} stopOpacity="0.34" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="th2" cx="90%" cy="100%" r="60%">
            <stop offset="0%" stopColor={G_RED} stopOpacity="0.26" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="th3" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={G_YELLOW} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="th4" cx="10%" cy="80%" r="50%">
            <stop offset="0%" stopColor={G_GREEN} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <pattern id="thgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={G_BLUE} strokeWidth="1" opacity="0.08" />
          </pattern>
          <radialGradient id="thmaskg" cx="50%" cy="50%" r="70%">
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="thgm"><rect width={W} height={H} fill="url(#thmaskg)" /></mask>
          <filter id="thglow">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#thgrid)" mask="url(#thgm)" />
        <rect width={W} height={H} fill="url(#th1)" />
        <rect width={W} height={H} fill="url(#th2)" />
        <rect width={W} height={H} fill="url(#th3)" />
        <rect width={W} height={H} fill="url(#th4)" />

        {/* Top tag */}
        <g transform={`translate(${W / 2}, 200)`}>
          <rect x={-340} y={-46} width={680} height={92} rx={46} fill={BG_SURFACE} stroke={G_BLUE} strokeWidth={3} />
          <text x={0} y={14} fontSize={30} fill={G_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
            🚨 GOOGLE I/O · 19-05-2026
          </text>
        </g>

        {/* Mega number */}
        <g transform={`translate(${W / 2}, 680)`}>
          <text x={0} y={0} fontSize={680} fill={G_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-30" filter="url(#thglow)">
            4
          </text>
        </g>

        {/* Sub label */}
        <g transform={`translate(${W / 2}, 980)`}>
          <text x={0} y={0} fontSize={110} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">
            ĐÒN AI
          </text>
          <text x={0} y={88} fontSize={62} fill={G_YELLOW} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
            trong 1 ngày
          </text>
        </g>

        {/* 4 product badges */}
        <g transform={`translate(${W / 2}, 1280)`}>
          <rect x={-490} y={-58} width={980} height={116} rx={20} fill={BG_SURFACE} stroke={G_BLUE} strokeWidth={2} />
          <text x={-470} y={-12} fontSize={26} fill={G_YELLOW} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
            ⚡ Flash · 🌟 Spark · 🌌 Omni · 🚀 Antigravity
          </text>
          <text x={-470} y={28} fontSize={22} fill={TEXT_PRI} fontFamily="'Inter', sans-serif" fontWeight={600}>
            Model + Agent + World + IDE coding
          </text>
        </g>

        {/* Drama hook */}
        <g transform={`translate(${W / 2}, 1500)`}>
          <rect x={-490} y={-68} width={980} height={136} rx={20} fill={BG_SURFACE} stroke={G_RED} strokeWidth={3} />
          <text x={0} y={-14} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Google đáp trả Claude + GPT
          </text>
          <text x={0} y={28} fontSize={32} fill={G_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            tỏ tình muộn nhưng đem cả vườn hoa 🌹
          </text>
        </g>

        {/* Bottom 4-color google bar */}
        <g transform={`translate(${W / 2}, 1700)`}>
          <rect x={-200} y={-12} width={100} height={24} fill={G_BLUE} rx={6} />
          <rect x={-90} y={-12} width={100} height={24} fill={G_RED} rx={6} />
          <rect x={20} y={-12} width={100} height={24} fill={G_YELLOW} rx={6} />
          <rect x={130} y={-12} width={100} height={24} fill={G_GREEN} rx={6} />
        </g>

        <g transform={`translate(${W / 2}, ${H - 90})`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            ⚡ ai weekly · google i/o 2026 · cn news
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
