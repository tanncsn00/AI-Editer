import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#08080F";
const BG_SURFACE = "#13131C";
const TEXT_PRI = "#F5F5FA";
const TEXT_MUTE = "#5A5A70";
const ACCENT_VIOLET = "#B86FFF";
const ACCENT_PINK = "#FF6B9D";
const ACCENT_BLUE = "#5B8CFF";
const ACCENT_CYAN = "#3DD9D6";
const GREEN = "#34D399";
const GOLD = "#F4B860";

export const Top5McpAutomationThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="t1" cx="20%" cy="0%" r="70%">
            <stop offset="0%" stopColor={ACCENT_VIOLET} stopOpacity="0.32" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="t2" cx="90%" cy="100%" r="60%">
            <stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0.26" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="t3" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.20" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <pattern id="tgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={ACCENT_VIOLET} strokeWidth="1" opacity="0.08" />
          </pattern>
          <radialGradient id="tmaskg" cx="50%" cy="50%" r="70%">
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="tgm"><rect width={W} height={H} fill="url(#tmaskg)" /></mask>
          <filter id="glow">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#tgrid)" mask="url(#tgm)" />
        <rect width={W} height={H} fill="url(#t1)" />
        <rect width={W} height={H} fill="url(#t2)" />
        <rect width={W} height={H} fill="url(#t3)" />

        <g transform={`translate(${W / 2}, 230)`}>
          <rect x={-320} y={-44} width={640} height={88} rx={44} fill={BG_SURFACE} stroke={ACCENT_VIOLET} strokeWidth={3} />
          <text x={0} y={14} fontSize={32} fill={ACCENT_VIOLET} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">
            ⚡ MCP · AUTOMATION
          </text>
        </g>

        {/* MEGA 5 */}
        <g transform={`translate(${W / 2}, 660)`}>
          <text x={0} y={0} fontSize={520} fill={ACCENT_VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-20" filter="url(#glow)">
            5
          </text>
        </g>

        {/* MCP */}
        <g transform={`translate(${W / 2}, 870)`}>
          <text x={0} y={0} fontSize={148} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="8">
            MCP
          </text>
        </g>

        {/* AUTOMATION */}
        <g transform={`translate(${W / 2}, 1000)`}>
          <text x={0} y={0} fontSize={74} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">
            AUTOMATION
          </text>
        </g>

        {/* Subtitle */}
        <g transform={`translate(${W / 2}, 1130)`}>
          <text x={0} y={0} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
            Claude điều khiển máy như robot
          </text>
        </g>

        {/* MCP chips */}
        <g transform={`translate(${W / 2}, 1360)`}>
          {[
            { lbl: "playwright", color: ACCENT_BLUE },
            { lbl: "browser", color: GOLD },
            { lbl: "windows", color: ACCENT_CYAN },
            { lbl: "control", color: GREEN },
            { lbl: "stagehand", color: ACCENT_PINK },
          ].map((c, i) => (
            <g key={i} transform={`translate(${(i - 2) * 184}, 0)`}>
              <rect x={-86} y={-32} width={172} height={64} rx={14} fill={BG_SURFACE} stroke={c.color} strokeWidth={2} />
              <text x={0} y={9} fontSize={20} fill={c.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
                {c.lbl}
              </text>
            </g>
          ))}
        </g>

        {/* Bottom hook */}
        <g transform={`translate(${W / 2}, 1620)`}>
          <rect x={-490} y={-58} width={980} height={116} rx={20} fill={BG_SURFACE} stroke={ACCENT_PINK} strokeWidth={3} />
          <text x={0} y={-2} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Số 2 đặc biệt · vợ chưa biết
          </text>
          <text x={0} y={38} fontSize={32} fill={ACCENT_PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            là phí cả Claude Code 🤖
          </text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 90})`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            ⚡ mcp · automation · + 2 bonus · 2026
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
