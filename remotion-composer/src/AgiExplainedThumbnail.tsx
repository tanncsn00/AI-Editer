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
const GOLD = "#F4B860";

export const AgiExplainedThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="t1" cx="20%" cy="0%" r="70%">
            <stop offset="0%" stopColor={ACCENT_VIOLET} stopOpacity="0.34" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="t2" cx="90%" cy="100%" r="60%">
            <stop offset="0%" stopColor={ACCENT_PINK} stopOpacity="0.28" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="t3" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.22" />
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
            <feGaussianBlur stdDeviation="16" result="b" />
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
          <rect x={-300} y={-44} width={600} height={88} rx={44} fill={BG_SURFACE} stroke={ACCENT_VIOLET} strokeWidth={3} />
          <text x={0} y={14} fontSize={34} fill={ACCENT_VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
            ⚡ AI CLARITY · 2 PHÚT
          </text>
        </g>

        <g transform={`translate(${W / 2}, 700)`}>
          <text x={0} y={0} fontSize={580} fill={ACCENT_VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-30" filter="url(#glow)">
            AGI
          </text>
        </g>

        <g transform={`translate(${W / 2}, 940)`}>
          <text x={0} y={0} fontSize={130} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">
            là gì?
          </text>
        </g>

        <g transform={`translate(${W / 2}, 1080)`}>
          <text x={0} y={0} fontSize={48} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            Bóc tách deep · data 2026 chuẩn
          </text>
        </g>

        <g transform={`translate(${W / 2}, 1280)`}>
          <rect x={-460} y={-80} width={920} height={170} rx={20} fill={BG_SURFACE} stroke={ACCENT_BLUE} strokeWidth={2} />
          <text x={0} y={-30} fontSize={28} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
            ARC-AGI-2: GPT-5.5 85% ✓ vượt human
          </text>
          <text x={0} y={10} fontSize={28} fill={ACCENT_PINK} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
            ARC-AGI-3: best 0.4% · human 100%
          </text>
          <text x={0} y={50} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={600}>
            khác biệt 250 lần
          </text>
        </g>

        <g transform={`translate(${W / 2}, 1620)`}>
          <rect x={-490} y={-58} width={980} height={116} rx={20} fill={BG_SURFACE} stroke={ACCENT_PINK} strokeWidth={3} />
          <text x={0} y={-2} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Elon Musk + CEO Anthropic:
          </text>
          <text x={0} y={38} fontSize={32} fill={ACCENT_PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            AGI tới 2026? · sự thật 💔
          </text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 90})`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            ⚡ ai clarity · agi explained · 2026
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
