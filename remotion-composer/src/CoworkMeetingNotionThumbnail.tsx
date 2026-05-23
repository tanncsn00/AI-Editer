import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#0A0B14";
const BG_SURFACE = "#13141F";
const TEXT_PRI = "#F5F5FA";
const TEXT_MUTE = "#5A6075";
const COWORK_ORANGE = "#D97757";
const SLACK_PURPLE = "#611F69";
const LINEAR_PURPLE = "#5E6AD2";
const ACCENT_AMBER = "#F4B860";
const ACCENT_GREEN = "#3FD68A";
const ACCENT_RED = "#FF6B6B";

export const CoworkMeetingNotionThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="cwth1" cx="20%" cy="0%" r="70%">
            <stop offset="0%" stopColor={COWORK_ORANGE} stopOpacity="0.34" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cwth2" cx="90%" cy="100%" r="60%">
            <stop offset="0%" stopColor={SLACK_PURPLE} stopOpacity="0.28" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cwth3" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={LINEAR_PURPLE} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <pattern id="cwthgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={COWORK_ORANGE} strokeWidth="1" opacity="0.08" />
          </pattern>
          <radialGradient id="cwthmaskg" cx="50%" cy="50%" r="70%">
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="cwthgm"><rect width={W} height={H} fill="url(#cwthmaskg)" /></mask>
          <filter id="cwthglow">
            <feGaussianBlur stdDeviation="16" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#cwthgrid)" mask="url(#cwthgm)" />
        <rect width={W} height={H} fill="url(#cwth1)" />
        <rect width={W} height={H} fill="url(#cwth2)" />
        <rect width={W} height={H} fill="url(#cwth3)" />

        {/* Top tag */}
        <g transform={`translate(${W / 2}, 200)`}>
          <rect x={-340} y={-46} width={680} height={92} rx={46} fill={BG_SURFACE} stroke={COWORK_ORANGE} strokeWidth={3} />
          <text x={0} y={14} fontSize={32} fill={COWORK_ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
            🎯 COWORK · TUTORIAL
          </text>
        </g>

        {/* Mega 2h → 3' */}
        <g transform={`translate(${W / 2}, 580)`}>
          <text x={-220} y={0} fontSize={300} fill={ACCENT_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-10" filter="url(#cwthglow)">
            2h
          </text>
          <text x={70} y={20} fontSize={160} fill={ACCENT_AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
            →
          </text>
          <text x={280} y={0} fontSize={300} fill={ACCENT_GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-10" filter="url(#cwthglow)">
            3'
          </text>
        </g>

        {/* Sub label */}
        <g transform={`translate(${W / 2}, 850)`}>
          <text x={0} y={0} fontSize={88} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
            SLACK → NOTION
          </text>
          <text x={0} y={80} fontSize={56} fill={ACCENT_AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            + 12 ticket Linear · auto
          </text>
        </g>

        {/* Tools used */}
        <g transform={`translate(${W / 2}, 1180)`}>
          <rect x={-490} y={-78} width={980} height={156} rx={20} fill={BG_SURFACE} stroke={LINEAR_PURPLE} strokeWidth={2} />
          <text x={0} y={-26} fontSize={32} fill={COWORK_ORANGE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>
            💬 Slack → 🤝 Cowork → 📝 Notion → 🎫 Linear
          </text>
          <text x={0} y={20} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
            6 step · 312 messages · 12 ticket auto
          </text>
          <text x={0} y={54} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
            PM/Lead workflow · save signal
          </text>
        </g>

        {/* Drama hook */}
        <g transform={`translate(${W / 2}, 1450)`}>
          <rect x={-490} y={-68} width={980} height={136} rx={20} fill={BG_SURFACE} stroke={ACCENT_GREEN} strokeWidth={3} />
          <text x={0} y={-14} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Bạn ngủ — Cowork làm
          </text>
          <text x={0} y={28} fontSize={32} fill={ACCENT_GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Step-by-step tutorial ☕
          </text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 90})`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            ⚡ ai weekly · cowork tutorial · pm workflow
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
