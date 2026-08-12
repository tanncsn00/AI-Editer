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
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const JADE = "#5BE8A8";
const VIOLET = "#B47AFF";
const ACCENT_BLUE = "#5BB8FF";
const GRID = "#FFFFFF";

export const DaoToXuyenKhongThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="dtgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="dtgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="dtglow" cx="50%" cy="34%" r="62%">
            <stop offset="0%" stopColor={VIOLET} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="dtg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#dtgrid)" />
        <rect width={W} height={H} fill="url(#dtgrid2)" />
        <rect width={W} height={H} fill="url(#dtglow)" />
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

        {/* master glyph */}
        <g transform={`translate(${W / 2}, 410)`}>
          <circle cx={0} cy={0} r={130} fill="none" stroke={AMBER} strokeWidth={2} opacity={0.4} />
          <circle cx={0} cy={0} r={110} fill={BG_CARD} stroke={AMBER} strokeWidth={4} />
          <text x={0} y={42} fontSize={120} textAnchor="middle">🧙</text>
        </g>

        <g transform={`translate(${W / 2}, 620)`}>
          <text x={0} y={0} fontSize={46} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ĐẠO TỔ CÔNG NGHỆ</text>
          <text x={0} y={104} fontSize={100} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1" filter="url(#dtg)">XUYÊN KHÔNG</text>
          <text x={0} y={176} fontSize={52} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>100 NĂM SAU ⏳</text>
        </g>

        {/* terminal */}
        <g transform={`translate(${W / 2}, 1080)`}>
          <rect x={-470} y={-110} width={940} height={300} rx={12} fill={BG_TERM} stroke={VIOLET} strokeWidth={3} />
          <rect x={-470} y={-110} width={940} height={50} rx={12} fill={BG_CARD} />
          <circle cx={-435} cy={-85} r={9} fill="#FF6B6B" />
          <circle cx={-407} cy={-85} r={9} fill={AMBER} />
          <circle cx={-379} cy={-85} r={9} fill={JADE} />
          <text x={0} y={-78} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>year 2126 — ai writes everything</text>
          <text x={-440} y={-10} fontSize={30} fill={ACCENT_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>$ humans coding...</text>
          <text x={-440} y={44} fontSize={30} fill="#FF6B6B" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>  → 0 found 😳</text>
          <text x={-440} y={104} fontSize={30} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>$ AI writes · AI debugs · AI reviews</text>
          <text x={-440} y={158} fontSize={30} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>  ✓ con người chỉ đứng nhìn</text>
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1420)`}>
          <rect x={-470} y={-70} width={940} height={170} rx={10} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
          <text x={0} y={-18} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"Thời đại của mình…</text>
          <text x={0} y={42} fontSize={46} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đã kết thúc rồi sao?" 🥀</text>
        </g>

        <g transform={`translate(${W / 2}, 1620)`}>
          <text x={0} y={0} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Khi AI viết code giỏi hơn cả Đạo Tổ</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
