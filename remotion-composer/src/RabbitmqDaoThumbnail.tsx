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
const ORANGE = "#FFA552";
const WARNING_RED = "#FF6B6B";
const GRID = "#FFFFFF";

export const RabbitmqDaoThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="rqtgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="rqtgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="rqtglow" cx="50%" cy="29%" r="62%">
            <stop offset="0%" stopColor={JADE} stopOpacity="0.14" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="rqtg"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#rqtgrid)" />
        <rect width={W} height={H} fill="url(#rqtgrid2)" />
        <rect width={W} height={H} fill="url(#rqtglow)" />
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

        <g transform={`translate(${W / 2}, 320)`}>
          <text x={0} y={0} fontSize={108} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1" filter="url(#rqtg)">RABBITMQ</text>
          <text x={0} y={78} fontSize={48} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ĐẠO LÀ GÌ? 🐰</text>
        </g>

        {/* producer → queue → consumer */}
        <g transform={`translate(${W / 2}, 700)`}>
          <rect x={-500} y={-90} width={290} height={180} rx={18} fill={BG_CARD} stroke={JADE} strokeWidth={3.5} />
          <text x={-355} y={-15} fontSize={56} textAnchor="middle">📤</text>
          <text x={-355} y={50} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NGƯỜI GỬI</text>

          <text x={-150} y={20} fontSize={46} fill={AMBER} textAnchor="middle" fontWeight={700}>→</text>

          <rect x={-90} y={-90} width={290} height={180} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={3.5} />
          <text x={55} y={-15} fontSize={50} textAnchor="middle">📬📜</text>
          <text x={55} y={50} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>QUEUE</text>

          <text x={250} y={20} fontSize={46} fill={AMBER} textAnchor="middle" fontWeight={700}>→</text>

          <rect x={310} y={-90} width={250} height={180} rx={18} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={3.5} />
          <text x={435} y={-15} fontSize={56} textAnchor="middle">📥</text>
          <text x={435} y={50} fontSize={26} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NGƯỜI NHẬN</text>
        </g>

        <g transform={`translate(${W / 2}, 900)`}>
          <text x={0} y={0} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// không ai phải đứng chờ ai</text>
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1230)`}>
          <rect x={-500} y={-150} width={1000} height={340} rx={20} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
          <text x={0} y={-90} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Đồng bộ: 1 service ngã → cả chuỗi chết 💀</text>
          <text x={0} y={-30} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Queue: nhân quả TÁCH RỜI</text>
          <text x={0} y={40} fontSize={30} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// xếp hàng theo thứ tự</text>
          <text x={0} y={120} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">Hộ Pháp Trưởng Lão tam giới 🏯</text>
        </g>

        <g transform={`translate(${W / 2}, 1570)`}>
          <text x={0} y={0} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Message Queue kiểu tu tiên 🏯</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
