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
const FE = "#5BB8FF";
const FE_DK = "#1E3A52";
const DS = "#FF6FB5";
const DS_DK = "#4A1E38";
const GRID = "#FFFFFF";

export const FrontendVsDesignerThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="fvtgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="fvtgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <linearGradient id="fvtsplit" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={FE} stopOpacity="0.16" />
            <stop offset="50%" stopColor={BG_NAVY} stopOpacity="0" />
            <stop offset="100%" stopColor={DS} stopOpacity="0.16" />
          </linearGradient>
          <filter id="fvtg"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#fvtgrid)" />
        <rect width={W} height={H} fill="url(#fvtgrid2)" />
        <rect width={W} height={H} fill="url(#fvtsplit)" />
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
          <text x={0} y={0} fontSize={52} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>ĐẠI CHIẾN</text>
        </g>

        {/* two fighters */}
        <g transform={`translate(${W / 2 - 268}, 660)`}>
          <rect x={-230} y={-180} width={460} height={360} rx={20} fill={FE_DK} stroke={FE} strokeWidth={4} />
          <text x={0} y={-40} fontSize={150} textAnchor="middle">⚔️</text>
          <text x={0} y={70} fontSize={28} fill={FE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">KIẾM TU</text>
          <text x={0} y={130} fontSize={52} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>FRONTEND</text>
        </g>
        <g transform={`translate(${W / 2 + 268}, 660)`}>
          <rect x={-230} y={-180} width={460} height={360} rx={20} fill={DS_DK} stroke={DS} strokeWidth={4} />
          <text x={0} y={-40} fontSize={150} textAnchor="middle">🎨</text>
          <text x={0} y={70} fontSize={28} fill={DS} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">HỌA TU</text>
          <text x={0} y={130} fontSize={52} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>DESIGNER</text>
        </g>
        <g transform={`translate(${W / 2}, 660)`}>
          <circle cx={0} cy={0} r={72} fill={BG_NAVY} stroke={AMBER} strokeWidth={5} />
          <text x={0} y={22} fontSize={62} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#fvtg)">VS</text>
        </g>

        {/* the meme quotes */}
        <g transform={`translate(${W / 2}, 1010)`}>
          <rect x={-470} y={-30} width={940} height={120} rx={12} fill={DS_DK} stroke={DS} strokeWidth={2.5} />
          <text x={-440} y={18} fontSize={26} fill={DS} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>🎨 "Icon lệch 2 pixel..."</text>
          <text x={-440} y={64} fontSize={26} fill={TEXT_SEC} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>"khoảng cách phải là 24, không phải 23.7"</text>
        </g>
        <g transform={`translate(${W / 2}, 1160)`}>
          <rect x={-470} y={-30} width={940} height={120} rx={12} fill={FE_DK} stroke={FE} strokeWidth={2.5} />
          <text x={-440} y={18} fontSize={26} fill={FE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⚔️ "Nó... chạy được mà 😅"</text>
          <text x={-440} y={64} fontSize={26} fill={TEXT_SEC} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>"user không nhận ra đâu..."</text>
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1400)`}>
          <rect x={-480} y={-70} width={960} height={170} rx={14} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
          <text x={0} y={-18} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"chỉ chỉnh nhẹ thôi"</text>
          <text x={0} y={46} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">= 1 Sprint bay màu 💀</text>
        </g>

        <g transform={`translate(${W / 2}, 1620)`}>
          <text x={0} y={0} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Phe ⚔️ hay phe 🎨 ?</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
