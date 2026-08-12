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
const JADE = "#5BE8A8";
const WARNING_RED = "#FF6B6B";
const GRID = "#FFFFFF";

export const Top7FixBugThumbnail: React.FC = () => {
  const fixes = ["restart service", "+ thêm 1 dòng log", "đổi 1 dấu phẩy", "xóa & paste y hệt", "để qua 1 đêm", "đổi import / format", "git rollback"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="fbtgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="fbtgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="fbtglow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.12" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="fbtg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#fbtgrid)" />
        <rect width={W} height={H} fill="url(#fbtgrid2)" />
        <rect width={W} height={H} fill="url(#fbtglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 175)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[SELF-HEAL] · CODE ĐẠO · 7</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 330)`}>
          <text x={0} y={0} fontSize={64} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">7 KIỂU FIX BUG</text>
          <text x={0} y={100} fontSize={104} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#fbtg)">KHÔNG BIẾT</text>
          <text x={0} y={185} fontSize={66} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#fbtg)">VÌ SAO HẾT LỖI</text>
        </g>

        {/* console */}
        <g transform={`translate(${W / 2}, 1080)`}>
          <rect x={-470} y={-340} width={940} height={680} rx={14} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
          <rect x={-470} y={-340} width={940} height={64} rx={14} fill={BG_CARD} />
          <rect x={-470} y={-290} width={940} height={14} fill={BG_CARD} />
          <circle cx={-430} cy={-308} r={10} fill={WARNING_RED} />
          <circle cx={-398} cy={-308} r={10} fill={AMBER} />
          <circle cx={-366} cy={-308} r={10} fill={JADE} />
          <text x={0} y={-301} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">bash — fixing bug</text>
          {fixes.map((f, i) => (
            <g key={i} transform={`translate(0, ${-230 + i * 70})`}>
              <text x={-430} y={0} fontSize={26} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>$</text>
              <text x={-390} y={0} fontSize={28} fill={TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>{f}</text>
              <text x={430} y={0} fontSize={26} fill={JADE} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✓</text>
            </g>
          ))}
          <text x={0} y={300} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}># vì sao? → không ai biết 🤷</text>
        </g>

        <g transform={`translate(${W / 2}, 1660)`}>
          <line x1={-320} y1={-44} x2={320} y2={-44} stroke={AMBER} strokeWidth={1} />
          <text x={0} y={6} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"thiên đạo tự chữa lành"</text>
          <line x1={-320} y1={44} x2={320} y2={44} stroke={AMBER} strokeWidth={1} />
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
