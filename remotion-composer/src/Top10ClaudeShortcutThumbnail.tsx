import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700", "800"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#06070D";
const BG_SURFACE = "#10121C";
const TEXT_PRI = "#F5F5FA";
const TEXT_MUTE = "#5A6075";
const ACCENT_CYAN = "#3DD9D6";
const ACCENT_VIOLET = "#B86FFF";
const ACCENT_AMBER = "#F4B860";
const ACCENT_GREEN = "#3FD68A";

export const Top10ClaudeShortcutThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="ksh1" cx="20%" cy="0%" r="70%">
            <stop offset="0%" stopColor={ACCENT_CYAN} stopOpacity="0.34" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ksh2" cx="90%" cy="100%" r="60%">
            <stop offset="0%" stopColor={ACCENT_VIOLET} stopOpacity="0.26" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ksh3" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={ACCENT_AMBER} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <pattern id="kshgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={ACCENT_CYAN} strokeWidth="1" opacity="0.08" />
          </pattern>
          <radialGradient id="kshmaskg" cx="50%" cy="50%" r="70%">
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="kshgm"><rect width={W} height={H} fill="url(#kshmaskg)" /></mask>
          <filter id="kshglow">
            <feGaussianBlur stdDeviation="16" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#kshgrid)" mask="url(#kshgm)" />
        <rect width={W} height={H} fill="url(#ksh1)" />
        <rect width={W} height={H} fill="url(#ksh2)" />
        <rect width={W} height={H} fill="url(#ksh3)" />

        {/* Top tag */}
        <g transform={`translate(${W / 2}, 200)`}>
          <rect x={-340} y={-46} width={680} height={92} rx={46} fill={BG_SURFACE} stroke={ACCENT_CYAN} strokeWidth={3} />
          <text x={0} y={14} fontSize={32} fill={ACCENT_CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
            ⌨️ CLAUDE CODE · TOP 10
          </text>
        </g>

        {/* Mega 10 */}
        <g transform={`translate(${W / 2}, 700)`}>
          <text x={0} y={0} fontSize={620} fill={ACCENT_CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-30" filter="url(#kshglow)">
            10
          </text>
        </g>

        {/* Sub label */}
        <g transform={`translate(${W / 2}, 980)`}>
          <text x={0} y={0} fontSize={92} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
            SHORTCUT KING
          </text>
          <text x={0} y={80} fontSize={58} fill={ACCENT_AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
            chồng dạy vợ tăng tốc 2x
          </text>
        </g>

        {/* Shortcut visual row */}
        <g transform={`translate(${W / 2}, 1280)`}>
          <rect x={-490} y={-78} width={980} height={156} rx={20} fill={BG_SURFACE} stroke={ACCENT_VIOLET} strokeWidth={2} />
          <text x={0} y={-26} fontSize={36} fill={ACCENT_VIOLET} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>
            ⬆⬇ · ⇧⏎ · ⌃R · / · @ · ! · #
          </text>
          <text x={0} y={20} fontSize={36} fill={ACCENT_GREEN} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>
            ⎋ · ⎋⎋ · 👑 ⇧⇥
          </text>
          <text x={0} y={56} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={500}>
            10 superpower trong 2 phút
          </text>
        </g>

        {/* Drama hook */}
        <g transform={`translate(${W / 2}, 1520)`}>
          <rect x={-490} y={-68} width={980} height={136} rx={20} fill={BG_SURFACE} stroke={ACCENT_AMBER} strokeWidth={3} />
          <text x={0} y={-14} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            #1 sẽ làm vợ SHOCK
          </text>
          <text x={0} y={28} fontSize={30} fill={ACCENT_AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            90% dev VN chưa biết 👑
          </text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 90})`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            ⚡ chồng dạy vợ · claude code
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
