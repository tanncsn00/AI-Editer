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
const WARNING_RED = "#FF6B6B";
const GRID = "#FFFFFF";

export const CodingTangThapNhatThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="thbpgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="thbpgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="thbpglow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.1" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="thbglow">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#thbpgrid)" />
        <rect width={W} height={H} fill="url(#thbpgrid2)" />
        <rect width={W} height={H} fill="url(#thbpglow)" />

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
            [08 / 08] · DEEP LAYER
          </text>
          <line x1={0} y1={20} x2={W - 200} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
          <text x={0} y={48} fontSize={16} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6">
            SOFTWARE · ENGINEERING · DEPTH
          </text>
        </g>

        {/* Massive title */}
        <g transform={`translate(${W / 2}, 420)`}>
          <text x={0} y={0} fontSize={44} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" letterSpacing="3">
            Vì sao
          </text>
          <text x={0} y={130} fontSize={132} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">
            CODING
          </text>
          <text x={0} y={210} fontSize={40} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" letterSpacing="3">
            chỉ là
          </text>
          <text x={0} y={340} fontSize={120} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6" filter="url(#thbglow)">
            TẦNG THẤP
          </text>
          <text x={0} y={460} fontSize={120} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6" filter="url(#thbglow)">
            NHẤT?
          </text>
        </g>

        {/* Architecture diagram preview */}
        <g transform={`translate(${W / 2}, 1180)`}>
          {/* Center node */}
          <circle cx={0} cy={0} r={70} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={3} />
          <text x={0} y={-6} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>tech</text>
          <text x={0} y={22} fontSize={26} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>20%</text>

          {/* Surrounding */}
          {[
            { angle: 0, label: "humans" },
            { angle: 72, label: "ops" },
            { angle: 144, label: "time" },
            { angle: 216, label: "money" },
            { angle: 288, label: "trade-off" },
          ].map((c, i) => {
            const a = (c.angle - 90) * Math.PI / 180;
            const r = 220;
            const x = r * Math.cos(a);
            const y = r * Math.sin(a);
            return (
              <g key={i}>
                <line x1={70 * Math.cos(a)} y1={70 * Math.sin(a)} x2={x - 50 * Math.cos(a)} y2={y - 50 * Math.sin(a)} stroke={AMBER} strokeWidth={1.5} strokeDasharray="6 4" opacity={0.6} />
                <circle cx={x} cy={y} r={46} fill={BG_CARD} stroke={AMBER} strokeWidth={2} />
                <text x={x} y={y + 6} fontSize={16} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{c.label}</text>
              </g>
            );
          })}
        </g>

        {/* Bottom hook */}
        <g transform={`translate(${W / 2}, 1620)`}>
          <rect x={-490} y={-78} width={980} height={156} rx={4} fill={BG_CARD} stroke={AMBER} strokeWidth={2} />
          <text x={0} y={-22} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            Junior: "code chạy là được"
          </text>
          <text x={0} y={26} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
            Senior: "năm sau còn ai dám sửa?"
          </text>
        </g>

        {/* Footer */}
        <g transform={`translate(${W / 2}, ${H - 110})`}>
          <line x1={-W / 2 + 100} y1={-30} x2={W / 2 - 100} y2={-30} stroke={AMBER} strokeWidth={1} opacity={0.5} />
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">
            fig.0 · truyền kỳ software engineering · 2026
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
