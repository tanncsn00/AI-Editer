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
const ACCENT_BLUE = "#5BB8FF";
const JADE = "#5BE8A8";
const VIOLET = "#B47AFF";
const WARNING_RED = "#FF6B6B";
const GRID = "#FFFFFF";

export const ClaudeOpus48BlueprintThumbnail: React.FC = () => {
  const chips = [
    { c: JADE, t: "HONESTY" },
    { c: ACCENT_BLUE, t: "DYNAMIC WORKFLOW" },
    { c: WARNING_RED, t: "CLAUDE MYTHOS" },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="tbgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="tbgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="tbglow" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.12" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="tbg2">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#tbgrid)" />
        <rect width={W} height={H} fill="url(#tbgrid2)" />
        <rect width={W} height={H} fill="url(#tbglow)" />

        {/* Corner markers */}
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        {/* Top label */}
        <g transform={`translate(90, 175)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">
            [BREAKING] · TIÊN GIỚI AI · 2026
          </text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
          <text x={0} y={48} fontSize={16} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6">
            ANTHROPIC · RELEASE · 28.05.2026
          </text>
        </g>

        {/* Claude node */}
        <g transform={`translate(${W / 2}, 540)`}>
          <circle cx={0} cy={0} r={150} fill={BG_CARD} stroke={AMBER} strokeWidth={5} filter="url(#tbg2)" />
          <text x={0} y={56} fontSize={185} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>C</text>
        </g>

        <g transform={`translate(${W / 2}, 820)`}>
          <text x={0} y={0} fontSize={56} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
            CLAUDE OPUS 4.8
          </text>
        </g>

        {/* Mega title */}
        <g transform={`translate(${W / 2}, 1050)`}>
          <text x={0} y={0} fontSize={185} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="8" filter="url(#tbg2)">
            XUẤT THẾ
          </text>
        </g>

        <g transform={`translate(${W / 2}, 1250)`}>
          <text x={0} y={0} fontSize={62} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3" filter="url(#tbg2)">
            CHẤN ĐỘNG TAM GIỚI AI
          </text>
        </g>

        {/* chips */}
        <g transform={`translate(${W / 2}, 1450)`}>
          {chips.map((b, i) => {
            const xs = [-330, 0, 330];
            return (
              <g key={i} transform={`translate(${xs[i]}, 0)`}>
                <rect x={-150} y={-36} width={300} height={72} rx={6} fill={BG_CARD} stroke={b.c} strokeWidth={2} />
                <text x={0} y={9} fontSize={i === 1 ? 21 : 26} fill={b.c} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{b.t}</text>
              </g>
            );
          })}
        </g>

        {/* Bottom hook */}
        <g transform={`translate(${W / 2}, 1640)`}>
          <line x1={-280} y1={-42} x2={280} y2={-42} stroke={AMBER} strokeWidth={1} />
          <text x={0} y={4} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
            đại chiến thiên đạo AGI bắt đầu
          </text>
          <line x1={-280} y1={42} x2={280} y2={42} stroke={AMBER} strokeWidth={1} />
        </g>

        {/* Footer */}
        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">
            ⚡ truyền kỳ · software engineering · blueprint
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
