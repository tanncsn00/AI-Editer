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
const ACCENT_BLUE = "#5BB8FF";
const WARNING_RED = "#FF6B6B";
const JADE = "#5BE8A8";
const VIOLET = "#B47AFF";
const ORANGE = "#FFA552";
const GRID = "#FFFFFF";

export const CleanArchThumbnail: React.FC = () => {
  const pillars = [
    { c: "S", n: "Đơn Tâm", e: "Single Responsibility", col: AMBER },
    { c: "O", n: "Diễn Sinh", e: "Open–Closed", col: JADE },
    { c: "L", n: "Truyền Thừa", e: "Liskov", col: ACCENT_BLUE },
    { c: "I", n: "Khế Ước", e: "Interface Segregation", col: ORANGE },
    { c: "D", n: "Vô Tướng", e: "Dependency Inversion", col: VIOLET },
  ];
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
          <radialGradient id="catglow" cx="50%" cy="20%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="catg"><feGaussianBlur stdDeviation="8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
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

        <g transform={`translate(90, 150)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ TRUYỀN KỲ GIỚI IT ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        {/* title */}
        <g transform={`translate(${W / 2}, 320)`}>
          <text x={0} y={0} fontSize={78} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#catg)">CLEAN</text>
          <text x={0} y={86} fontSize={78} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#catg)">ARCHITECTURE</text>
          <text x={0} y={150} fontSize={34} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">= ĐẠI TRẬN dựng từ 5 cây cột SOLID</text>
        </g>

        {/* 5 pillars */}
        <g transform={`translate(0, 560)`}>
          {pillars.map((p, i) => (
            <g key={i}>
              <rect x={70} y={i * 104} width={W - 140} height={88} rx={13} fill={BG_CARD} stroke={p.col} strokeWidth={3} />
              <circle cx={140} cy={i * 104 + 44} r={32} fill={BG_TERM} stroke={p.col} strokeWidth={3} />
              <text x={140} y={i * 104 + 56} fontSize={38} fill={p.col} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{p.c}</text>
              <text x={200} y={i * 104 + 40} fontSize={32} fill={TEXT_PRI} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{p.n} Đạo</text>
              <text x={200} y={i * 104 + 74} fontSize={22} fill={TEXT_MUTE} textAnchor="start" fontFamily="'JetBrains Mono', monospace">// {p.e}</text>
            </g>
          ))}
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1240)`}>
          <rect x={-505} y={-90} width={1010} height={210} rx={20} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={4} />
          <text x={0} y={-30} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đổi Database · Framework · UI · cả người giữ</text>
          <text x={0} y={36} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà NGHIỆP VỤ bất động như núi 😳</text>
          <text x={0} y={92} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thiếu 1 cột → gặp thay đổi là SỤP</text>
        </g>

        <g transform={`translate(${W / 2}, 1500)`}>
          <text x={0} y={0} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">cực phẩm Dev: đọc lại code sau 3 năm</text>
          <text x={0} y={48} fontSize={32} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà KHÔNG nguyền rủa tổ tiên 😇</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
