import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#08070D";
const BG_SURFACE = "#13121C";
const TEXT_PRI = "#F5F5FA";
const TEXT_MUTE = "#5A5570";
const RED_CRIT = "#FF4747";
const RED_DEEP = "#C81C1C";
const ORANGE_WARN = "#FF8A3D";
const YELLOW_CAUTION = "#FFD23D";
const GOLD = "#F4B860";

export const SepKhongBietAIThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="sth1" cx="20%" cy="0%" r="70%">
            <stop offset="0%" stopColor={RED_CRIT} stopOpacity="0.34" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sth2" cx="90%" cy="100%" r="60%">
            <stop offset="0%" stopColor={ORANGE_WARN} stopOpacity="0.24" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sth3" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={RED_DEEP} stopOpacity="0.20" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <pattern id="sthgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={RED_CRIT} strokeWidth="1" opacity="0.08" />
          </pattern>
          <radialGradient id="sthmaskg" cx="50%" cy="50%" r="70%">
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="sthgm"><rect width={W} height={H} fill="url(#sthmaskg)" /></mask>
          <filter id="sthglow">
            <feGaussianBlur stdDeviation="16" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#sthgrid)" mask="url(#sthgm)" />
        <rect width={W} height={H} fill="url(#sth1)" />
        <rect width={W} height={H} fill="url(#sth2)" />
        <rect width={W} height={H} fill="url(#sth3)" />

        {/* Top tag — báo cáo mật */}
        <g transform={`translate(${W / 2}, 200)`}>
          <rect x={-340} y={-46} width={680} height={92} rx={46} fill={BG_SURFACE} stroke={RED_CRIT} strokeWidth={3} />
          <text x={0} y={14} fontSize={32} fill={RED_CRIT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
            🔒 McKINSEY NỘI BỘ
          </text>
        </g>

        {/* Mega 95% */}
        <g transform={`translate(${W / 2}, 700)`}>
          <text x={0} y={0} fontSize={620} fill={RED_CRIT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-30" filter="url(#sthglow)">
            95%
          </text>
        </g>

        {/* Sub label */}
        <g transform={`translate(${W / 2}, 980)`}>
          <text x={0} y={0} fontSize={92} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
            AI DOANH NGHIỆP
          </text>
          <text x={0} y={80} fontSize={88} fill={RED_CRIT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">
            THẤT BẠI 💀
          </text>
        </g>

        {/* 3 sub data */}
        <g transform={`translate(${W / 2}, 1280)`}>
          <rect x={-490} y={-78} width={980} height={156} rx={20} fill={BG_SURFACE} stroke={ORANGE_WARN} strokeWidth={2} />
          <text x={0} y={-26} fontSize={28} fill={ORANGE_WARN} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
            75% công ty CHƯA có lộ trình AI
          </text>
          <text x={0} y={14} fontSize={28} fill={YELLOW_CAUTION} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
            82% KHÔNG đo được ROI
          </text>
          <text x={0} y={54} fontSize={28} fill={RED_CRIT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
            95% pilot FAIL hoàn toàn (MIT)
          </text>
        </g>

        {/* Drama hook */}
        <g transform={`translate(${W / 2}, 1520)`}>
          <rect x={-490} y={-68} width={980} height={136} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
          <text x={0} y={-14} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Sếp bạn KHÔNG biết dùng AI
          </text>
          <text x={0} y={28} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            cơ hội KHỔNG LỒ cho bạn 🎯
          </text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 90})`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            ⚡ ai weekly · sự thật ai t5 · 2026
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
