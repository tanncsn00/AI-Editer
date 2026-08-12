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
const WARNING_RED = "#FF6B6B";
const GRID = "#FFFFFF";

export const IndexThanThuThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="ixtgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="ixtgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="ixtglow" cx="50%" cy="30%" r="62%">
            <stop offset="0%" stopColor={JADE} stopOpacity="0.13" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="ixtg"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#ixtgrid)" />
        <rect width={W} height={H} fill="url(#ixtgrid2)" />
        <rect width={W} height={H} fill="url(#ixtglow)" />
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

        <g transform={`translate(${W / 2}, 310)`}>
          <text x={0} y={0} fontSize={48} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>VÌ SAO</text>
          <text x={0} y={104} fontSize={120} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4" filter="url(#ixtg)">INDEX</text>
          <text x={0} y={172} fontSize={40} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>được tôn là THẦN THƯ DẪN LỘ? 📖</text>
        </g>

        {/* before vs after */}
        <g transform={`translate(${W / 2}, 700)`}>
          <rect x={-490} y={-80} width={460} height={240} rx={20} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={4} />
          <text x={-260} y={-10} fontSize={70} textAnchor="middle">📚🔁</text>
          <text x={-260} y={60} fontSize={34} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>VẠN lần lật</text>
          <text x={-260} y={108} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>full scan</text>

          <text x={0} y={50} fontSize={70} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>→</text>

          <rect x={30} y={-80} width={460} height={240} rx={20} fill={BG_CARD} stroke={JADE} strokeWidth={4} />
          <text x={260} y={-10} fontSize={70} textAnchor="middle">📖⚡</text>
          <text x={260} y={60} fontSize={34} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>VÀI lần tra</text>
          <text x={260} y={108} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>with index</text>
        </g>

        {/* lookup teaser */}
        <g transform={`translate(${W / 2}, 1010)`}>
          <rect x={-470} y={-50} width={940} height={120} rx={14} fill={BG_TERM} stroke={AMBER} strokeWidth={2.5} />
          <text x={0} y={-2} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>「 Trương Tam 」 → Dòng 382918 · Kệ 71</text>
          <text x={0} y={44} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// biết NGAY nằm ở đâu</text>
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1290)`}>
          <rect x={-500} y={-130} width={1000} height={300} rx={20} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
          <text x={0} y={-70} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Database = Chân Kinh Các 🏯</text>
          <text x={0} y={-18} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Index = Mục Lục Thần Thư 📖</text>
          <text x={0} y={60} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">Tốc độ không nằm ở kho sách —</text>
          <text x={0} y={120} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà ở việc BIẾT TÌM Ở ĐÂU 🧭</text>
        </g>

        <g transform={`translate(${W / 2}, 1580)`}>
          <text x={0} y={0} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Index giải thích kiểu tu tiên 🏯</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
