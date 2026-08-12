import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
const TEXT_PRI = "#E8F0FF";
const TEXT_MUTE = "#5E7090";
const TEXT_SEC = "#A4B5D0";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const VIOLET = "#B47AFF";
const WARNING_RED = "#FF6B6B";
const SLATE = "#A4B5D0";
const GRID = "#FFFFFF";

export const CacheThanKhiThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="catgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="catgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="catglow" cx="50%" cy="30%" r="62%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.2" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="catg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#catgrid)" />
        <rect width={W} height={H} fill="url(#catgrid2)" />
        <rect width={W} height={H} fill="url(#catglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 175)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ TRUYỀN KỲ · GIỚI IT ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 360)`}>
          <text x={0} y={0} fontSize={46} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>VÌ SAO</text>
          <text x={0} y={130} fontSize={150} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#catg)">CACHE</text>
          <text x={0} y={210} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>được tôn là THẦN KHÍ? ⚡</text>
        </g>

        {/* database vs cache */}
        <g transform={`translate(${W / 2}, 920)`}>
          <rect x={-480} y={-90} width={460} height={210} rx={18} fill={BG_CARD} stroke={VIOLET} strokeWidth={4} />
          <text x={-250} y={-10} fontSize={70} textAnchor="middle">📜</text>
          <text x={-250} y={56} fontSize={36} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>DATABASE</text>
          <text x={-250} y={100} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>= chân tướng</text>
          <rect x={20} y={-90} width={460} height={210} rx={18} fill="#3A2E0A" stroke={AMBER} strokeWidth={4} />
          <text x={250} y={-10} fontSize={70} textAnchor="middle">⚡</text>
          <text x={250} y={56} fontSize={36} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>CACHE</text>
          <text x={250} y={100} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>= ký ức</text>
          <text x={-110} y={20} fontSize={56} fill={AMBER} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>vs</text>
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1300)`}>
          <rect x={-490} y={-90} width={980} height={210} rx={16} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
          <text x={0} y={-30} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thứ nhanh hơn tìm lại chân tướng…</text>
          <text x={0} y={36} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">chính là NHỚ SẴN</text>
          <text x={0} y={96} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đáp án 🧠</text>
        </g>

        <g transform={`translate(${W / 2}, 1580)`}>
          <text x={0} y={0} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Giải thích Caching kiểu tu tiên 🏯</text>
          <text x={0} y={54} fontSize={24} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⚠ ký ức cũ = nhìn thấy quá khứ</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
