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
const BG_RED = "#2A1010";
const TEXT_PRI = "#E8F0FF";
const TEXT_MUTE = "#5E7090";
const TEXT_SEC = "#A4B5D0";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const ACCENT_BLUE = "#5BB8FF";
const WARNING_RED = "#FF6B6B";
const JADE = "#5BE8A8";
const GRID = "#FFFFFF";

export const ThienCoSuThumbnail: React.FC = () => {
  const kieps = [
    { k: "🌀 Mơ Hồ Kiếp", v: "\"cho ta… cái số đó\"" },
    { k: "🧹 Hỗn Nguyên Kiếp", v: "80% thời gian là dọn rác" },
    { k: "🔀 Điên Đảo Kiếp", v: "tương quan ≠ nhân quả" },
    { k: "🦛 HiPPO Đại Kiếp", v: "\"anh vẫn thích cách cũ\"" },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="tctgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="tctgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="tctglow" cx="50%" cy="22%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="tctg"><feGaussianBlur stdDeviation="8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#tctgrid)" />
        <rect width={W} height={H} fill="url(#tctgrid2)" />
        <rect width={W} height={H} fill="url(#tctglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 150)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ POV · TRUYỀN KỲ GIỚI IT ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        {/* title */}
        <g transform={`translate(${W / 2}, 340)`}>
          <text x={0} y={0} fontSize={40} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>POV: TA LÀ MỘT</text>
          <text x={0} y={96} fontSize={104} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#tctg)">THIÊN CƠ SƯ</text>
          <text x={0} y={156} fontSize={34} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>// Data Analyst</text>
        </g>

        {/* kiep rows */}
        <g transform={`translate(0, 620)`}>
          {kieps.map((r, i) => (
            <g key={i}>
              <rect x={70} y={i * 122} width={W - 140} height={104} rx={14} fill={BG_CARD} stroke={[ACCENT_BLUE, JADE, WARNING_RED, AMBER][i]} strokeWidth={3} />
              <text x={110} y={i * 122 + 64} fontSize={36} fill={[ACCENT_BLUE, JADE, WARNING_RED, AMBER][i]} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{r.k}</text>
              <text x={W - 110} y={i * 122 + 64} fontSize={28} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.v}</text>
            </g>
          ))}
        </g>

        {/* aphorism */}
        <g transform={`translate(${W / 2}, 1300)`}>
          <rect x={-505} y={-95} width={1010} height={250} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={0} y={-32} fontSize={42} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Con số KHÔNG nói dối</text>
          <text x={0} y={36} fontSize={34} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhưng con người rất giỏi chọn số</text>
          <text x={0} y={104} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">để kể chuyện mình muốn</text>
        </g>

        <g transform={`translate(${W / 2}, 1570)`}>
          <text x={0} y={0} fontSize={31} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">đại kiếp cuối: 🦛 HiPPO — "anh vẫn thích phương án cũ"</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
