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
const TEXT_SEC = "#9090A5";
const TEXT_MUTE = "#5A5A70";
const ACCENT_VIOLET = "#B86FFF";
const ACCENT_PINK = "#FF6B9D";
const ACCENT_BLUE = "#5B8CFF";
const ACCENT_CYAN = "#3DD9D6";
const GREEN = "#34D399";
const GOLD = "#F4B860";

export const Top10ClaudeCodeUseCasesThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="t1" cx="20%" cy="0%" r="70%">
            <stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity="0.28" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="t2" cx="90%" cy="100%" r="60%">
            <stop offset="0%" stopColor={ACCENT_PINK} stopOpacity="0.24" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="t3" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={ACCENT_VIOLET} stopOpacity="0.22" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <pattern id="tgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={ACCENT_BLUE} strokeWidth="1" opacity="0.07" />
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

        {/* Top tag */}
        <g transform={`translate(${W / 2}, 230)`}>
          <rect x={-340} y={-44} width={680} height={88} rx={44} fill={BG_SURFACE} stroke={ACCENT_VIOLET} strokeWidth={3} />
          <text x={0} y={14} fontSize={32} fill={ACCENT_VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
            ⚡ CLAUDE CODE · BEYOND
          </text>
        </g>

        {/* MEGA 10 */}
        <g transform={`translate(${W / 2}, 660)`}>
          <text x={0} y={0} fontSize={440} fill={ACCENT_VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-20" filter="url(#glow)">
            10
          </text>
        </g>

        {/* USE CASE */}
        <g transform={`translate(${W / 2}, 850)`}>
          <text x={0} y={0} fontSize={120} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6">
            USE CASE
          </text>
        </g>

        {/* NGOÀI CODE big */}
        <g transform={`translate(${W / 2}, 1000)`}>
          <text x={0} y={0} fontSize={86} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">
            NGOÀI CODE
          </text>
        </g>

        {/* Subtitle */}
        <g transform={`translate(${W / 2}, 1140)`}>
          <text x={0} y={0} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
            Claude Code không chỉ để code
          </text>
        </g>

        {/* Use case chips strip */}
        <g transform={`translate(${W / 2}, 1370)`}>
          {[
            { lbl: "PDF", color: ACCENT_BLUE },
            { lbl: "Excel", color: GREEN },
            { lbl: "Email", color: ACCENT_PINK },
            { lbl: "CV", color: GOLD },
            { lbl: "Plan", color: ACCENT_VIOLET },
          ].map((c, i) => (
            <g key={i} transform={`translate(${(i - 2) * 184}, 0)`}>
              <rect x={-86} y={-32} width={172} height={64} rx={14} fill={BG_SURFACE} stroke={c.color} strokeWidth={2} />
              <text x={0} y={10} fontSize={26} fill={c.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
                {c.lbl}
              </text>
            </g>
          ))}
        </g>

        {/* Bottom hook */}
        <g transform={`translate(${W / 2}, 1620)`}>
          <rect x={-490} y={-58} width={980} height={116} rx={20} fill={BG_SURFACE} stroke={ACCENT_PINK} strokeWidth={3} />
          <text x={0} y={-2} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Vợ tưởng Claude Code chỉ để code à?
          </text>
          <text x={0} y={38} fontSize={32} fill={ACCENT_PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Sai bét nhè — save trước đã 😤
          </text>
        </g>

        {/* Footer brand */}
        <g transform={`translate(${W / 2}, ${H - 90})`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            ⚡ claude-code · beyond code · 2026
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
