import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
const BG_TERM = "#0A1322";
const TEXT_PRI = "#E8F0FF";
const TEXT_MUTE = "#5E7090";
const TEXT_SEC = "#A4B5D0";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const JADE = "#5BE8A8";
const ACCENT_BLUE = "#5BB8FF";
const VIOLET = "#B47AFF";
const ORANGE = "#FFA552";
const WARNING_RED = "#FF6B6B";
const SLATE = "#A4B5D0";
const CODE_GRAY = "#5E7090";
const GRID = "#FFFFFF";

export const CommentChanDongThumbnail: React.FC = () => {
  const comments = [
    { c: SLATE, t: "// DO NOT REMOVE" },
    { c: JADE, t: "// TEMP FIX  (since 2018)" },
    { c: ACCENT_BLUE, t: "// TODO" },
    { c: VIOLET, t: "// Quick fix" },
    { c: WARNING_RED, t: "// I have no idea why this works" },
    { c: SLATE, t: "// HACK" },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="cctgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="cctgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="cctglow" cx="50%" cy="26%" r="60%">
            <stop offset="0%" stopColor={JADE} stopOpacity="0.14" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="cctg"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#cctgrid)" />
        <rect width={W} height={H} fill="url(#cctgrid2)" />
        <rect width={W} height={H} fill="url(#cctglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 170)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ TRUYỀN KỲ · GIỚI IT ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 330)`}>
          <text x={0} y={0} fontSize={50} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>7 ĐOẠN</text>
          <text x={0} y={104} fontSize={104} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#cctg)">COMMENT</text>
          <text x={0} y={170} fontSize={42} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>chấn động TAM GIỚI 🏯</text>
        </g>

        {/* code editor with comments */}
        <g transform={`translate(${W / 2}, 920)`}>
          <rect x={-490} y={-310} width={980} height={680} rx={16} fill={BG_TERM} stroke={JADE} strokeWidth={3} />
          <rect x={-490} y={-310} width={980} height={56} rx={16} fill={BG_CARD} />
          <circle cx={-455} cy={-282} r={9} fill={WARNING_RED} />
          <circle cx={-427} cy={-282} r={9} fill={AMBER} />
          <circle cx={-399} cy={-282} r={9} fill={JADE} />
          <text x={0} y={-274} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>legacy_code.cpp</text>
          {comments.map((c, i) => {
            const y = -200 + i * 92;
            return (
              <g key={i}>
                <text x={-440} y={y} fontSize={26} fill={CODE_GRAY} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{i + 1}</text>
                <text x={-390} y={y} fontSize={i === 5 ? 26 : 30} fill={c.c} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{c.t}</text>
              </g>
            );
          })}
        </g>

        {/* the final one */}
        <g transform={`translate(${W / 2}, 1410)`}>
          <rect x={-490} y={-80} width={980} height={170} rx={14} fill="#2A2310" stroke={AMBER} strokeWidth={3.5} />
          <text x={-450} y={-26} fontSize={30} fill={AMBER_BRIGHT} fontFamily="'JetBrains Mono', monospace" fontWeight={800}>// If this breaks, I'm sorry</text>
          <text x={-450} y={26} fontSize={26} fill={TEXT_SEC} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>🏴 lời xin lỗi không dành cho khách</text>
          <text x={-450} y={66} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→ mà dành cho CHÍNH NGƯƠI 🫵</text>
        </g>

        <g transform={`translate(${W / 2}, 1620)`}>
          <text x={0} y={0} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Bạn đã gặp comment nào rồi? 👀</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
