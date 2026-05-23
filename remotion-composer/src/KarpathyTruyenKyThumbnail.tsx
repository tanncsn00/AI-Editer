import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#0A0612";
const BG_SURFACE = "#15101F";
const TEXT_PRI = "#F5EDD8";
const TEXT_MUTE = "#5A4F70";
const GOLD = "#F4C04A";
const VIOLET = "#9D5BFF";
const DRAGON_RED = "#FF4747";
const OPENAI = "#10A37F";
const ANTHROPIC = "#D97757";

export const KarpathyTruyenKyThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="kpt1" cx="20%" cy="0%" r="70%">
            <stop offset="0%" stopColor={VIOLET} stopOpacity="0.32" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="kpt2" cx="90%" cy="100%" r="60%">
            <stop offset="0%" stopColor={DRAGON_RED} stopOpacity="0.26" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="kpt3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <pattern id="kptgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.08" />
          </pattern>
          <radialGradient id="kptmaskg" cx="50%" cy="50%" r="70%">
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="kptgm"><rect width={W} height={H} fill="url(#kptmaskg)" /></mask>
          <filter id="kptglow">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#kptgrid)" mask="url(#kptgm)" />
        <rect width={W} height={H} fill="url(#kpt1)" />
        <rect width={W} height={H} fill="url(#kpt2)" />
        <rect width={W} height={H} fill="url(#kpt3)" />

        {/* Top tag */}
        <g transform={`translate(${W / 2}, 180)`}>
          <rect x={-380} y={-50} width={760} height={100} rx={50} fill={BG_SURFACE} stroke={GOLD} strokeWidth={4} />
          <text x={0} y={16} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
            🏯 TRUYỀN KỲ GIỚI AI
          </text>
        </g>

        {/* Karpathy avatar */}
        <g transform={`translate(${W / 2}, 460)`}>
          <circle cx={0} cy={0} r={140} fill={BG_SURFACE} stroke={GOLD} strokeWidth={5} filter="url(#kptglow)" />
          <text x={0} y={50} fontSize={180} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
            K
          </text>
        </g>

        {/* Name */}
        <g transform={`translate(${W / 2}, 680)`}>
          <text x={0} y={0} fontSize={56} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
            ANDREJ KARPATHY
          </text>
        </g>

        {/* Mega question */}
        <g transform={`translate(${W / 2}, 880)`}>
          <text x={0} y={0} fontSize={104} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3" filter="url(#kptglow)">
            KẺ PHẢN MÔN?
          </text>
        </g>

        {/* Brand transition */}
        <g transform={`translate(${W / 2}, 1140)`}>
          <g transform={`translate(-260, 0)`}>
            <rect x={-150} y={-60} width={300} height={120} rx={20} fill={BG_SURFACE} stroke={OPENAI} strokeWidth={3} />
            <text x={0} y={-10} fontSize={28} fill={OPENAI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>OpenAI</text>
            <text x={0} y={28} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>11 sáng lập viên</text>
          </g>
          <text x={-30} y={14} fontSize={64} fill={GOLD} textAnchor="middle">→</text>
          <g transform={`translate(260, 0)`}>
            <rect x={-150} y={-60} width={300} height={120} rx={20} fill={BG_SURFACE} stroke={ANTHROPIC} strokeWidth={3} />
            <text x={0} y={-10} fontSize={28} fill={ANTHROPIC} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}>Anthropic</text>
            <text x={0} y={28} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>quy thuận 5/2026</text>
          </g>
        </g>

        {/* Drama hook */}
        <g transform={`translate(${W / 2}, 1470)`}>
          <rect x={-490} y={-78} width={980} height={156} rx={20} fill={BG_SURFACE} stroke={VIOLET} strokeWidth={3} />
          <text x={0} y={-22} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            11 năm phá quan
          </text>
          <text x={0} y={20} fontSize={28} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            5 lần chuyển môn phái
          </text>
          <text x={0} y={56} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500} fontStyle="italic">
            OpenAI → Tesla → ẩn cư → OpenAI → Eureka → Anthropic
          </text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 90})`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            ⚡ truyền kỳ giới ai · karpathy · 2026
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
