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
const RED = "#FF6B6B";
const ORANGE = "#FF9F4D";
const GOLD = "#F4B860";
const ACCENT_PINK = "#FF6B9D";
const ACCENT_BLUE = "#5B8CFF";
const ACCENT_VIOLET = "#B86FFF";

export const Top10SkillLostThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="t1" cx="20%" cy="0%" r="70%">
            <stop offset="0%" stopColor={RED} stopOpacity="0.32" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="t2" cx="90%" cy="100%" r="60%">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.26" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="t3" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <pattern id="tgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={RED} strokeWidth="1" opacity="0.08" />
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

        {/* Top tag — warning */}
        <g transform={`translate(${W / 2}, 230)`}>
          <rect x={-360} y={-44} width={720} height={88} rx={44} fill={BG_SURFACE} stroke={RED} strokeWidth={3} />
          <text x={0} y={14} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
            ⚠️ DEV CONFESSION · 1 NĂM
          </text>
        </g>

        {/* MEGA 10 */}
        <g transform={`translate(${W / 2}, 640)`}>
          <text x={0} y={0} fontSize={420} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="-20" filter="url(#glow)">
            10
          </text>
        </g>

        {/* KỸ NĂNG */}
        <g transform={`translate(${W / 2}, 830)`}>
          <text x={0} y={0} fontSize={120} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6">
            KỸ NĂNG
          </text>
        </g>

        {/* MẤT VÌ CLAUDE */}
        <g transform={`translate(${W / 2}, 970)`}>
          <text x={0} y={0} fontSize={74} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
            DEV MẤT vì Claude
          </text>
        </g>

        {/* Subtitle */}
        <g transform={`translate(${W / 2}, 1110)`}>
          <text x={0} y={0} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">
            Hê lô các con vợ iu · chồng nói thẳng
          </text>
        </g>

        {/* Skill chips */}
        <g transform={`translate(${W / 2}, 1340)`}>
          {[
            { lbl: "debug", color: ORANGE },
            { lbl: "regex", color: GOLD },
            { lbl: "LeetCode", color: ACCENT_PINK },
            { lbl: "review", color: ACCENT_VIOLET },
            { lbl: "grit", color: RED },
          ].map((c, i) => (
            <g key={i} transform={`translate(${(i - 2) * 184}, 0)`}>
              <rect x={-86} y={-32} width={172} height={64} rx={14} fill={BG_SURFACE} stroke={c.color} strokeWidth={2} />
              <text x={0} y={9} fontSize={22} fill={c.color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
                {c.lbl}
              </text>
            </g>
          ))}
        </g>

        {/* Bottom hook */}
        <g transform={`translate(${W / 2}, 1620)`}>
          <rect x={-490} y={-58} width={980} height={116} rx={20} fill={BG_SURFACE} stroke={RED} strokeWidth={3} />
          <text x={0} y={-2} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Dev junior cẩn thận
          </text>
          <text x={0} y={38} fontSize={32} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Claude bào skill từ từ 😤
          </text>
        </g>

        {/* Footer brand */}
        <g transform={`translate(${W / 2}, ${H - 90})`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            ⚠️ claude · dev confession · 2026
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
