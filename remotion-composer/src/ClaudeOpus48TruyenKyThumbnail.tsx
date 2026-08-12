import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#0A0612";
const BG_SURFACE = "#15101F";
const TEXT_PRI = "#F5EDD8";
const TEXT_MUTE = "#5A4F70";
const GOLD = "#F4C04A";
const DRAGON_RED = "#FF4747";
const VIOLET = "#9D5BFF";
const CLAUDE = "#D97757";
const CLAUDE_BRIGHT = "#F0936E";

export const ClaudeOpus48TruyenKyThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="thbg1" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor={CLAUDE} stopOpacity="0.28" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="thbg2" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor={DRAGON_RED} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <pattern id="thgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.05" />
          </pattern>
          <filter id="thglow">
            <feGaussianBlur stdDeviation="12" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#thgrid)" />
        <rect width={W} height={H} fill="url(#thbg1)" />
        <rect width={W} height={H} fill="url(#thbg2)" />

        {/* Top tag */}
        <g transform={`translate(${W / 2}, 230)`}>
          <rect x={-380} y={-48} width={760} height={96} rx={48} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
          <text x={0} y={15} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
            🏯 TRUYỀN KỲ GIỚI AI
          </text>
        </g>

        {/* Claude orb */}
        <g transform={`translate(${W / 2}, 560)`}>
          <circle cx={0} cy={0} r={170} fill={BG_SURFACE} stroke={CLAUDE} strokeWidth={6} filter="url(#thglow)" />
          <text x={0} y={58} fontSize={200} fill={CLAUDE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
            C
          </text>
        </g>

        {/* Product */}
        <g transform={`translate(${W / 2}, 850)`}>
          <text x={0} y={0} fontSize={58} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
            CLAUDE OPUS 4.8
          </text>
        </g>

        {/* Mega title */}
        <g transform={`translate(${W / 2}, 1080)`}>
          <text x={0} y={0} fontSize={170} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="8" filter="url(#thglow)">
            XUẤT THẾ
          </text>
        </g>

        <g transform={`translate(${W / 2}, 1280)`}>
          <text x={0} y={0} fontSize={68} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4" filter="url(#thglow)">
            CHẤN ĐỘNG TAM GIỚI AI
          </text>
        </g>

        {/* hook chips */}
        <g transform={`translate(${W / 2}, 1480)`}>
          {[
            { x: -300, t: "HONESTY", c: "#3FD68A" },
            { x: 0, t: "DYNAMIC WORKFLOW", c: VIOLET },
            { x: 300, t: "MYTHOS", c: DRAGON_RED },
          ].map((b, i) => (
            <g key={i} transform={`translate(${b.x}, 0)`}>
              <rect x={-145} y={-34} width={290} height={68} rx={34} fill={BG_SURFACE} stroke={b.c} strokeWidth={2} />
              <text x={0} y={9} fontSize={i === 1 ? 22 : 26} fill={b.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{b.t}</text>
            </g>
          ))}
        </g>

        {/* Bottom hook */}
        <g transform={`translate(${W / 2}, 1660)`}>
          <line x1={-260} y1={-40} x2={260} y2={-40} stroke={GOLD} strokeWidth={1} />
          <text x={0} y={6} fontSize={34} fill={CLAUDE_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
            Đại chiến thiên đạo AGI bắt đầu
          </text>
          <line x1={-260} y1={40} x2={260} y2={40} stroke={GOLD} strokeWidth={1} />
        </g>

        {/* Footer */}
        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">
            ⚡ anthropic · 28.05.2026
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
