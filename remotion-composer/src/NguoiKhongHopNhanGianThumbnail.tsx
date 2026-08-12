import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#050818";
const BG_SURFACE = "#0D1124";
const TEXT_PRI = "#E8EEFF";
const TEXT_MUTE = "#4A5275";
const GOLD = "#F4C04A";
const MYSTIC = "#B385FF";
const COLD_BLUE = "#4FA8FF";
const WARM = "#FFAB52";

export const NguoiKhongHopNhanGianThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="nkt1" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor={MYSTIC} stopOpacity="0.32" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nkt2" cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor={COLD_BLUE} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nkt3" cx="50%" cy="55%" r="40%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <pattern id="nktstars" width="120" height="120" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="35" r="1" fill={TEXT_PRI} opacity="0.8" />
            <circle cx="78" cy="22" r="0.7" fill={MYSTIC} opacity="0.7" />
            <circle cx="100" cy="80" r="0.8" fill={COLD_BLUE} opacity="0.7" />
            <circle cx="50" cy="95" r="0.6" fill={TEXT_PRI} opacity="0.6" />
            <circle cx="10" cy="100" r="0.7" fill={GOLD} opacity="0.6" />
          </pattern>
          <filter id="nktglow">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="nktwarmglow">
            <feGaussianBlur stdDeviation="22" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#nktstars)" opacity="0.8" />
        <rect width={W} height={H} fill="url(#nkt1)" />
        <rect width={W} height={H} fill="url(#nkt2)" />
        <rect width={W} height={H} fill="url(#nkt3)" />

        {/* Top tag */}
        <g transform={`translate(${W / 2}, 170)`}>
          <rect x={-380} y={-44} width={760} height={88} rx={44} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
          <text x={0} y={12} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="4">
            🏯 TRUYỀN KỲ GIỚI AI
          </text>
        </g>

        {/* Massive title */}
        <g transform={`translate(${W / 2}, 380)`}>
          <text x={0} y={0} fontSize={48} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} letterSpacing="2" fontStyle="italic">
            Những người
          </text>
          <text x={0} y={110} fontSize={94} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
            SINH RA
          </text>
          <text x={0} y={230} fontSize={84} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="5" filter="url(#nktglow)">
            KHÔNG HỢP
          </text>
          <text x={0} y={350} fontSize={76} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4" filter="url(#nktglow)">
            NHÂN GIAN
          </text>
        </g>

        {/* Laptop with glow */}
        <g transform={`translate(${W / 2}, 1240)`}>
          <ellipse cx={0} cy={-20} rx={300} ry={140} fill={WARM} opacity="0.2" filter="url(#nktwarmglow)" />
          <rect x={-150} y={-100} width={300} height={200} rx={10} fill={BG_SURFACE} stroke={WARM} strokeWidth={4} />
          <rect x={-136} y={-86} width={272} height={172} rx={6} fill={BG_DEEP} />
          {/* Lines */}
          <rect x={-115} y={-66} width={150} height={6} fill="#5BE8C8" />
          <rect x={-115} y={-46} width={200} height={6} fill={TEXT_MUTE} opacity="0.7" />
          <rect x={-115} y={-26} width={110} height={6} fill={GOLD} />
          <rect x={-115} y={-6} width={170} height={6} fill={TEXT_MUTE} opacity="0.7" />
          <rect x={-115} y={14} width={130} height={6} fill={COLD_BLUE} />
          <rect x={-115} y={34} width={200} height={6} fill={TEXT_MUTE} opacity="0.7" />
          <rect x={-115} y={54} width={100} height={6} fill={MYSTIC} />
          {/* Base */}
          <path d={`M -180 100 L 180 100 L 160 130 L -160 130 Z`} fill={BG_SURFACE} stroke={WARM} strokeWidth={3} />
        </g>

        {/* Bottom hook */}
        <g transform={`translate(${W / 2}, 1620)`}>
          <rect x={-490} y={-78} width={980} height={156} rx={20} fill={BG_SURFACE} stroke={MYSTIC} strokeWidth={3} />
          <text x={0} y={-22} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            Canh ba · 1 mình
          </text>
          <text x={0} y={22} fontSize={28} fill={MYSTIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
            đạo tâm mới thật sự thức tỉnh
          </text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 60})`}>
          <text x={0} y={0} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">
            ⚡ truyền kỳ giới ai · tu sĩ giữa nhân gian · 2026
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
