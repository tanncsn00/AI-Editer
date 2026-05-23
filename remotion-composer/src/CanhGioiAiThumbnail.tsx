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
const COSMIC = "#6B8DFF";

export const CanhGioiAiThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="cgth1" cx="20%" cy="0%" r="70%">
            <stop offset="0%" stopColor={VIOLET} stopOpacity="0.34" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cgth2" cx="90%" cy="100%" r="60%">
            <stop offset="0%" stopColor={DRAGON_RED} stopOpacity="0.28" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cgth3" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.20" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <pattern id="cgthgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.08" />
          </pattern>
          <radialGradient id="cgthmaskg" cx="50%" cy="50%" r="70%">
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="cgthgm"><rect width={W} height={H} fill="url(#cgthmaskg)" /></mask>
          <filter id="cgthglow">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#cgthgrid)" mask="url(#cgthgm)" />
        <rect width={W} height={H} fill="url(#cgth1)" />
        <rect width={W} height={H} fill="url(#cgth2)" />
        <rect width={W} height={H} fill="url(#cgth3)" />

        {/* Top tag */}
        <g transform={`translate(${W / 2}, 190)`}>
          <rect x={-380} y={-50} width={760} height={100} rx={50} fill={BG_SURFACE} stroke={GOLD} strokeWidth={4} />
          <text x={0} y={16} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
            🐉 7 CẢNH GIỚI · TU TIÊN
          </text>
        </g>

        {/* Mega 7 number */}
        <g transform={`translate(${W / 2}, 600)`}>
          <text x={0} y={0} fontSize={520} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#cgthglow)">
            7
          </text>
        </g>

        {/* Realm subtitle */}
        <g transform={`translate(${W / 2}, 830)`}>
          <text x={0} y={0} fontSize={52} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6">
            CẢNH GIỚI
          </text>
        </g>

        {/* Title */}
        <g transform={`translate(${W / 2}, 1000)`}>
          <text x={0} y={0} fontSize={56} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
            DÙNG AI CODE
          </text>
        </g>

        {/* Drama hook */}
        <g transform={`translate(${W / 2}, 1180)`}>
          <rect x={-490} y={-78} width={980} height={156} rx={20} fill={BG_SURFACE} stroke={DRAGON_RED} strokeWidth={3} />
          <text x={0} y={-26} fontSize={36} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            💀 ĐÁY XÃ HỘI AI
          </text>
          <text x={0} y={20} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            → 🐉 ĐẠI ĐẾ
          </text>
          <text x={0} y={56} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
            Luyện Khí · Trúc Cơ · Kết Đan · Nguyên Anh · Hoá Thần
          </text>
        </g>

        {/* Bottom CTA */}
        <g transform={`translate(${W / 2}, 1450)`}>
          <rect x={-490} y={-68} width={980} height={136} rx={20} fill={BG_SURFACE} stroke={COSMIC} strokeWidth={3} />
          <text x={0} y={-14} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            Đạo hữu cảnh giới mấy?
          </text>
          <text x={0} y={32} fontSize={26} fill={COSMIC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            90% dev đoán SAI 👀
          </text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 90})`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            ⚡ ai weekly · 7 cảnh giới · tu tiên dev
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
