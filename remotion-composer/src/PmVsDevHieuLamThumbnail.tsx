import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
const BG_TERM = "#0A1322";
const TEXT_PRI = "#E8F0FF";
const TEXT_MUTE = "#5E7090";
const TEXT_SEC = "#A4B5D0";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const JADE = "#5BE8A8";
const ACCENT_BLUE = "#5BB8FF";
const WARNING_RED = "#FF6B6B";
const GRID = "#FFFFFF";

export const PmVsDevHieuLamThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="pdtgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="pdtgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="pdtglow" cx="50%" cy="30%" r="62%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.14" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="pdtg"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#pdtgrid)" />
        <rect width={W} height={H} fill="url(#pdtgrid2)" />
        <rect width={W} height={H} fill="url(#pdtglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 165)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ TRUYỀN KỲ · GIỚI IT ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 300)`}>
          <text x={0} y={0} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NHỮNG HIỂU LẦM LỚN NHẤT</text>
          <text x={0} y={62} fontSize={34} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>giữa</text>
        </g>

        {/* PM vs DEV faces */}
        <g transform={`translate(${W / 2}, 560)`}>
          <rect x={-490} y={-90} width={400} height={260} rx={20} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={4} />
          <text x={-290} y={20} fontSize={96} textAnchor="middle">📋</text>
          <text x={-290} y={110} fontSize={70} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#pdtg)">PM</text>

          <text x={0} y={55} fontSize={88} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⇄</text>

          <rect x={90} y={-90} width={400} height={260} rx={20} fill={BG_CARD} stroke={JADE} strokeWidth={4} />
          <text x={290} y={20} fontSize={96} textAnchor="middle">💻</text>
          <text x={290} y={110} fontSize={70} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#pdtg)">DEV</text>
        </g>

        {/* 7 mini badges */}
        <g transform={`translate(${W / 2}, 880)`}>
          <text x={0} y={0} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>“Cái này đơn giản”  ·  “Khoảng 1 tuần”  ·  “Xong rồi”…</text>
          <text x={0} y={52} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// 7 hiểu lầm kinh điển</text>
        </g>

        {/* punchline · thiên kiếp reveal */}
        <g transform={`translate(${W / 2}, 1250)`}>
          <rect x={-500} y={-170} width={1000} height={360} rx={20} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={4} />
          <text x={0} y={-110} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>PM tưởng Dev là thiên kiếp.</text>
          <text x={0} y={-62} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Dev tưởng PM là thiên kiếp.</text>
          <text x={0} y={-2} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>cho tới ngày production sụp đổ…</text>
          <text x={0} y={78} fontSize={70} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#pdtg)">THIÊN KIẾP THẬT</text>
          <text x={0} y={140} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">chưa bao giờ là ĐỐI PHƯƠNG 🏯</text>
        </g>

        <g transform={`translate(${W / 2}, 1580)`}>
          <text x={0} y={0} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">PM &amp; Dev · ai đúng ai sai? 🤔</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
