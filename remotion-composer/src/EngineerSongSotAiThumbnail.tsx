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
const TEXT_SEC = "#A4B5D0";
const TEXT_MUTE = "#5E7090";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const ACCENT_BLUE = "#5BB8FF";
const SURVIVOR_GREEN = "#5BE8A8";
const PURPLE = "#B47AFF";
const ORANGE = "#FFA552";
const WARNING_RED = "#FF6B6B";
const GRID = "#FFFFFF";

export const EngineerSongSotAiThumbnail: React.FC = () => {
  const types = [
    { c: ACCENT_BLUE, n: "01", t: "Hiểu gốc rễ" },
    { c: SURVIVOR_GREEN, n: "02", t: "Trận pháp sư" },
    { c: ACCENT_BLUE, n: "03", t: "Trade-off" },
    { c: PURPLE, n: "04", t: "Con người" },
    { c: ORANGE, n: "05", t: "Luyện hoá AI" },
  ];

  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="esthgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="esthgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="esthglow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.1" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="esthglow2">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#esthgrid)" />
        <rect width={W} height={H} fill="url(#esthgrid2)" />
        <rect width={W} height={H} fill="url(#esthglow)" />

        {/* Corner markers */}
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        {/* Top label */}
        <g transform={`translate(100, 170)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">
            [REPORT] · ENGINEER · SURVIVAL
          </text>
          <line x1={0} y1={20} x2={W - 200} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
          <text x={0} y={48} fontSize={16} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6">
            POST · AGI · CLASSIFICATION
          </text>
        </g>

        {/* Massive title */}
        <g transform={`translate(${W / 2}, 380)`}>
          <text x={0} y={0} fontSize={44} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" letterSpacing="3">
            5 loại engineer
          </text>
          <text x={0} y={130} fontSize={132} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">
            SỐNG SÓT
          </text>
          <text x={0} y={250} fontSize={70} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="5" filter="url(#esthglow2)">
            QUA ĐẠI KIẾP
          </text>
          <text x={0} y={340} fontSize={92} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6" filter="url(#esthglow2)">
            AGI
          </text>
        </g>

        {/* 5 type chips */}
        <g transform={`translate(${W / 2}, 1100)`}>
          {types.map((t, i) => (
            <g key={i} transform={`translate(0, ${i * 80})`}>
              <rect x={-440} y={-30} width={880} height={60} rx={4} fill={BG_CARD} stroke={t.c} strokeWidth={2} />
              <circle cx={-400} cy={0} r={20} fill={t.c} />
              <text x={-400} y={7} fontSize={18} fill={BG_NAVY} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={900}>{t.n}</text>
              <text x={-360} y={9} fontSize={26} fill={t.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{t.t}</text>
            </g>
          ))}
        </g>

        {/* Bottom hook */}
        <g transform={`translate(${W / 2}, 1700)`}>
          <line x1={-200} y1={-40} x2={200} y2={-40} stroke={AMBER} strokeWidth={1} />
          <text x={0} y={0} fontSize={22} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="2">
            Bạn ở loại nào?
          </text>
          <line x1={-200} y1={30} x2={200} y2={30} stroke={AMBER} strokeWidth={1} />
        </g>

        {/* Footer */}
        <g transform={`translate(${W / 2}, ${H - 60})`}>
          <text x={0} y={0} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">
            ⚡ truyền kỳ · engineer survival · AGI 2026
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
