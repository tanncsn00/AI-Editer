import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;
const BG_NAVY = "#0F1B2E";
const BG_BLUE = "#10243F";
const BG_AMBER = "#2A2110";
const BG_TERM = "#0A1322";
const TEXT_PRI = "#E8F0FF";
const TEXT_MUTE = "#5E7090";
const TEXT_SEC = "#A4B5D0";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const ACCENT_BLUE = "#5BB8FF";
const WARNING_RED = "#FF6B6B";
const GRID = "#FFFFFF";

export const SeniorJuniorThumbnail: React.FC = () => {
  const rows = [
    { j: "deploy luôn 🤪", s: "tái mặt, lùi lại 😨" },
    { j: "\"2 tiếng thôi\"", s: "\"2 tuần, có thể trễ\"" },
    { j: "\"đập đi viết lại!\"", s: "\"đừng đụng, nó sống\"" },
    { j: "giả vờ hiểu 😅", s: "\"tôi chưa rõ\" 😌" },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="sjtgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="sjtgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="sjtglow" cx="50%" cy="24%" r="62%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.15" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="sjtg"><feGaussianBlur stdDeviation="8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#sjtgrid)" />
        <rect width={W} height={H} fill="url(#sjtgrid2)" />
        <rect width={W} height={H} fill="url(#sjtglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 150)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ TRUYỀN KỲ · CHỐN CÔNG SỞ ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(0, 320)`}>
          <text x={W / 2 - 250} y={0} fontSize={104} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#sjtg)">JUNIOR</text>
          <text x={W / 2 + 40} y={0} fontSize={52} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>vs</text>
          <text x={W / 2 + 270} y={0} fontSize={104} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#sjtg)">SENIOR</text>
        </g>

        {/* contrast rows */}
        <g transform={`translate(0, 470)`}>
          {rows.map((r, i) => (
            <g key={i}>
              <rect x={60} y={i * 118} width={W / 2 - 90} height={98} rx={13} fill={BG_BLUE} stroke={ACCENT_BLUE} strokeWidth={2.5} />
              <text x={W / 4 - 15} y={i * 118 + 60} fontSize={31} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.j}</text>
              <rect x={W / 2 + 30} y={i * 118} width={W / 2 - 90} height={98} rx={13} fill={BG_AMBER} stroke={AMBER} strokeWidth={2.5} />
              <text x={(W * 3) / 4 + 15} y={i * 118 + 60} fontSize={31} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.s}</text>
            </g>
          ))}
          <text x={W / 2} y={-30} fontSize={40} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={0.0}>vs</text>
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1310)`}>
          <rect x={-505} y={-95} width={1010} height={250} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={0} y={-35} fontSize={34} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Senior KHÔNG biết nhiều hơn —</text>
          <text x={0} y={42} fontSize={62} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>chỉ SAI nhiều hơn</text>
          <text x={0} y={112} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">khác biệt = số lần độ kiếp ⚡</text>
        </g>

        <g transform={`translate(${W / 2}, 1560)`}>
          <text x={0} y={0} fontSize={33} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">cảnh giới cao nhất: biết thứ gì KHÔNG nên code 🧘</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · chốn công sở · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
