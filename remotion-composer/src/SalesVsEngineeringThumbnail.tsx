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
const WARNING_RED = "#FF6B6B";
const SL = "#FF9F1C";
const SL_DK = "#4A2F08";
const EN = "#5BB8FF";
const EN_DK = "#1E3A52";
const GRID = "#FFFFFF";

export const SalesVsEngineeringThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="settgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="settgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <linearGradient id="settsplit" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={EN} stopOpacity="0.16" />
            <stop offset="50%" stopColor={BG_NAVY} stopOpacity="0" />
            <stop offset="100%" stopColor={SL} stopOpacity="0.16" />
          </linearGradient>
          <filter id="settg"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#settgrid)" />
        <rect width={W} height={H} fill="url(#settgrid2)" />
        <rect width={W} height={H} fill="url(#settsplit)" />
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

        <g transform={`translate(${W / 2}, 330)`}>
          <text x={0} y={0} fontSize={54} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>ĐẠI CHIẾN</text>
        </g>

        {/* two fighters */}
        <g transform={`translate(${W / 2 - 268}, 660)`}>
          <rect x={-230} y={-180} width={460} height={360} rx={20} fill={EN_DK} stroke={EN} strokeWidth={4} />
          <text x={0} y={-30} fontSize={140} textAnchor="middle">⚙️</text>
          <text x={0} y={78} fontSize={28} fill={EN} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">ENGINEERING</text>
          <text x={0} y={134} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>ĐẠO</text>
        </g>
        <g transform={`translate(${W / 2 + 268}, 660)`}>
          <rect x={-230} y={-180} width={460} height={360} rx={20} fill={SL_DK} stroke={SL} strokeWidth={4} />
          <text x={0} y={-30} fontSize={140} textAnchor="middle">💼</text>
          <text x={0} y={78} fontSize={28} fill={SL} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">SALES</text>
          <text x={0} y={134} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>ĐẠO</text>
        </g>
        <g transform={`translate(${W / 2}, 660)`}>
          <circle cx={0} cy={0} r={72} fill={BG_NAVY} stroke={AMBER} strokeWidth={5} />
          <text x={0} y={22} fontSize={62} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#settg)">VS</text>
        </g>

        {/* meme quote */}
        <g transform={`translate(${W / 2}, 1030)`}>
          <rect x={-480} y={-90} width={960} height={210} rx={16} fill={SL_DK} stroke={SL} strokeWidth={3} />
          <text x={0} y={-34} fontSize={30} fill={SL} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>💼 Sales niệm chú:</text>
          <text x={0} y={34} fontSize={50} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>"Em lỡ hứa</text>
          <text x={0} y={94} fontSize={50} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>với khách rồi" 😬</text>
        </g>

        {/* consequence */}
        <g transform={`translate(${W / 2}, 1340)`}>
          <rect x={-480} y={-70} width={960} height={170} rx={14} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={3} />
          <text x={0} y={-14} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>→ Engineering Tông</text>
          <text x={0} y={56} fontSize={46} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">vào trạng thái ĐỘ KIẾP ⚡</text>
        </g>

        <g transform={`translate(${W / 2}, 1600)`}>
          <text x={0} y={0} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Phe ⚙️ Engineering hay 💼 Sales?</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
