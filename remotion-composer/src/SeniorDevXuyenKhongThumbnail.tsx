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
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const ACCENT_BLUE = "#5BB8FF";
const JADE = "#5BE8A8";
const WARNING_RED = "#FF6B6B";
const VIOLET = "#B47AFF";
const GRID = "#FFFFFF";

export const SeniorDevXuyenKhongThumbnail: React.FC = () => {
  const tools = ["ChatGPT", "Claude", "Cursor", "Stack Overflow"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="xktgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="xktgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="xktglow" cx="50%" cy="40%" r="62%">
            <stop offset="0%" stopColor={VIOLET} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="xktg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#xktgrid)" />
        <rect width={W} height={H} fill="url(#xktgrid2)" />
        <rect width={W} height={H} fill="url(#xktglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 175)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ISEKAI] · SENIOR DEV · 2000</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 320)`}>
          <text x={0} y={0} fontSize={46} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>SENIOR DEV XUYÊN KHÔNG</text>
          <text x={0} y={104} fontSize={150} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#xktg)">VỀ 2000</text>
        </g>

        {/* panic terminal */}
        <g transform={`translate(${W / 2}, 880)`}>
          <rect x={-460} y={-260} width={920} height={520} rx={14} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
          <rect x={-460} y={-260} width={920} height={60} rx={14} fill={BG_CARD} />
          <rect x={-460} y={-212} width={920} height={14} fill={BG_CARD} />
          <circle cx={-420} cy={-230} r={10} fill={WARNING_RED} />
          <circle cx={-388} cy={-230} r={10} fill={AMBER} />
          <circle cx={-356} cy={-230} r={10} fill={JADE} />
          <text x={0} y={-223} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">terminal — year 2000</text>
          {tools.map((t, i) => (
            <g key={i} transform={`translate(0, ${-130 + i * 90})`}>
              <text x={-420} y={0} fontSize={32} fill={ACCENT_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>$ {t}</text>
              <text x={420} y={0} fontSize={30} fill={WARNING_RED} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>not found ✗</text>
            </g>
          ))}
        </g>

        {/* answer */}
        <g transform={`translate(${W / 2}, 1430)`}>
          <text x={0} y={0} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>cảnh giới cao nhất của lập trình?</text>
          <text x={0} y={80} fontSize={66} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#xktg)">"Đọc error message"</text>
        </g>

        <g transform={`translate(${W / 2}, 1640)`}>
          <line x1={-300} y1={-30} x2={300} y2={-30} stroke={AMBER} strokeWidth={1} />
          <text x={0} y={16} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">→ toàn tông môn tôn làm Đạo Tổ 🙇</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
