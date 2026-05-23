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
const ORANGE = "#FF9F4D";

export const Top10SkillAiEraThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="t1" cx="20%" cy="0%" r="70%">
            <stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity="0.30" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="t2" cx="90%" cy="100%" r="60%">
            <stop offset="0%" stopColor={ACCENT_PINK} stopOpacity="0.26" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="t3" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={ACCENT_VIOLET} stopOpacity="0.22" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <pattern id="tgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={ACCENT_BLUE} strokeWidth="1" opacity="0.08" />
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
          <rect x={-280} y={-44} width={560} height={88} rx={44} fill={BG_SURFACE} stroke={ACCENT_VIOLET} strokeWidth={3} />
          <text x={0} y={14} fontSize={34} fill={ACCENT_VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
            ⚡ AI ERA · 2026
          </text>
        </g>

        <g transform={`translate(${W / 2}, 640)`}>
          <text x={0} y={0} fontSize={420} fill={ACCENT_VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-20" filter="url(#glow)">
            10
          </text>
        </g>

        <g transform={`translate(${W / 2}, 830)`}>
          <text x={0} y={0} fontSize={134} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6">
            KỸ NĂNG
          </text>
        </g>

        <g transform={`translate(${W / 2}, 970)`}>
          <text x={0} y={0} fontSize={70} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
            MỚI · cần học gấp
          </text>
        </g>

        <g transform={`translate(${W / 2}, 1110)`}>
          <text x={0} y={0} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
            Cũ chết · mới sống · 2026
          </text>
        </g>

        <g transform={`translate(${W / 2}, 1340)`}>
          {[
            { lbl: "prompt", color: ACCENT_BLUE },
            { lbl: "context", color: ACCENT_VIOLET },
            { lbl: "critical", color: ACCENT_PINK },
            { lbl: "vibe code", color: GOLD },
            { lbl: "cost", color: GREEN },
          ].map((c, i) => (
            <g key={i} transform={`translate(${(i - 2) * 184}, 0)`}>
              <rect x={-86} y={-32} width={172} height={64} rx={14} fill={BG_SURFACE} stroke={c.color} strokeWidth={2} />
              <text x={0} y={9} fontSize={22} fill={c.color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
                {c.lbl}
              </text>
            </g>
          ))}
        </g>

        <g transform={`translate(${W / 2}, 1620)`}>
          <rect x={-490} y={-58} width={980} height={116} rx={20} fill={BG_SURFACE} stroke={ACCENT_PINK} strokeWidth={3} />
          <text x={0} y={-2} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Không học = tụt hậu
          </text>
          <text x={0} y={38} fontSize={32} fill={ACCENT_PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            2 năm so với mình 🚀
          </text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 90})`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            ⚡ ai era · skill 2026 · career
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
