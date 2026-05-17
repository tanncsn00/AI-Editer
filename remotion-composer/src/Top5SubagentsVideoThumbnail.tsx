import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin"] });

const W = 1080, H = 1920;
const BG_DEEP = "#08080F";
const BG_SURFACE = "#13131C";
const BORDER = "#252535";
const TEXT_PRI = "#F5F5FA";
const TEXT_SEC = "#9090A5";
const ACCENT_BLUE = "#5B8CFF";
const ACCENT_VIOLET = "#B86FFF";
const ACCENT_PINK = "#FF6B9D";
const ACCENT_SOLID = "#7E5BFF";
const GOLD = "#F4B860";
const RED = "#FF5B5B";
const GREEN = "#34D399";

export const Top5SubagentsVideoThumbnail: React.FC = () => (
  <AbsoluteFill>
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="thg1" cx="20%" cy="0%" r="60%">
          <stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity="0.22" />
          <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="thg2" cx="90%" cy="10%" r="50%">
          <stop offset="0%" stopColor={ACCENT_VIOLET} stopOpacity="0.18" />
          <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="thg3" cx="50%" cy="100%" r="50%">
          <stop offset="0%" stopColor={ACCENT_PINK} stopOpacity="0.12" />
          <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
        </radialGradient>
        <pattern id="thgrid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke={ACCENT_BLUE} strokeWidth="1" opacity="0.06" />
        </pattern>
        <radialGradient id="thmaskg" cx="50%" cy="50%" r="70%">
          <stop offset="20%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="thgm"><rect width={W} height={H} fill="url(#thmaskg)" /></mask>
      </defs>
      <rect width={W} height={H} fill={BG_DEEP} />
      <rect width={W} height={H} fill="url(#thgrid)" mask="url(#thgm)" />
      <rect width={W} height={H} fill="url(#thg1)" />
      <rect width={W} height={H} fill="url(#thg2)" />
      <rect width={W} height={H} fill="url(#thg3)" />

      {/* TOP — Tag */}
      <g transform={`translate(${W/2}, 200)`}>
        <rect x={-280} y={-44} width={560} height={88} rx={44} fill={RED} stroke={TEXT_PRI} strokeWidth={4} />
        <circle cx={-230} cy={0} r={12} fill="#FFF" />
        <text x={-200} y={14} fontSize={36} fill="#FFF" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
          ⚡ CLAUDE CODE · TIP
        </text>
      </g>

      {/* Big "5" */}
      <g transform={`translate(${W/2}, 600)`}>
        <text x={0} y={0} fontSize={420} fill={ACCENT_SOLID} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-12"
          style={{ filter: "drop-shadow(0 0 60px rgba(126,91,255,0.5))" }}>
          5
        </text>
      </g>

      {/* Title SUBAGENT MUST-HAVE */}
      <g transform={`translate(${W/2}, 820)`}>
        <text x={0} y={0} fontSize={72} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="0">
          SUBAGENT MUST-HAVE
        </text>
      </g>

      {/* Sub */}
      <g transform={`translate(${W/2}, 920)`}>
        <text x={0} y={0} fontSize={48} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
          cho Claude Code 2026
        </text>
      </g>

      {/* Subagent badges grid */}
      <g transform="translate(0, 1080)">
        {[
          { label: "Explore", star: "Built-in", color: ACCENT_BLUE, x: 80 },
          { label: "GeneralPurpose", star: "Built-in", color: "#3DD9D6", x: 380 },
          { label: "Plan", star: "Built-in", color: ACCENT_VIOLET, x: 680 },
        ].map((b, i) => (
          <g key={i} transform={`translate(${b.x}, 0)`}>
            <rect x={0} y={0} width={300} height={160} rx={16} fill={BG_SURFACE} stroke={b.color} strokeWidth={3} />
            <text x={150} y={68} fontSize={(b.label.length > 10 ? 22 : 30)} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{b.label}</text>
            <text x={150} y={115} fontSize={26} fill={b.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{b.star}</text>
          </g>
        ))}
      </g>

      <g transform="translate(0, 1280)">
        {[
          { label: "CodeReviewer", star: "1,680 ⬇", color: GOLD, x: 100, big: true },
          { label: "Debugger", star: "957 ⬇", color: GREEN, x: 520 },
        ].map((b, i) => (
          <g key={i} transform={`translate(${b.x}, 0)`}>
            <rect x={0} y={0} width={b.big ? 400 : 460} height={160} rx={16} fill={BG_SURFACE} stroke={b.color} strokeWidth={3} />
            <text x={(b.big ? 200 : 230)} y={68} fontSize={(b.label.length > 10 ? 30 : 36)} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{b.label}</text>
            <text x={(b.big ? 200 : 230)} y={120} fontSize={36} fill={b.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{b.star}</text>
          </g>
        ))}
      </g>

      {/* CTA banner bottom */}
      <g transform={`translate(${W/2}, 1620)`}>
        <rect x={-460} y={-70} width={920} height={140} rx={20} fill={ACCENT_SOLID} stroke={TEXT_PRI} strokeWidth={4} />
        <text x={0} y={-10} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
          INSTALL TRONG 1 LỆNH
        </text>
        <text x={0} y={40} fontSize={26} fill="#FFFFCC" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
          data verified · official sources
        </text>
      </g>

      {/* Brand bottom */}
      <g transform={`translate(${W/2}, 1820)`}>
        <text x={0} y={0} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">
          ⚡ tip · claude-code · 2026
        </text>
      </g>
    </svg>
  </AbsoluteFill>
);
