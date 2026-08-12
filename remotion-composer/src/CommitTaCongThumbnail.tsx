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

export const CommitTaCongThumbnail: React.FC = () => {
  const commits = [
    { h: "a3f10c2", m: "final_final_v2_last", c: "#A4B5D0" },
    { h: "9b2c7df", m: "update logic", c: JADE },
    { h: "1a0c5fe", m: "fuckkkkk", c: "#5BB8FF" },
    { h: "00dead0", m: "it works dont touch", c: "#FFA552" },
    { h: "deadbef", m: "fix bug", c: AMBER },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="cttgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="cttgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="cttglow" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.12" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="cttg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#cttgrid)" />
        <rect width={W} height={H} fill="url(#cttgrid2)" />
        <rect width={W} height={H} fill="url(#cttglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        {/* Top label */}
        <g transform={`translate(90, 180)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[CURSED] · GIT ĐẠO · 7 LOẠI</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        {/* Title */}
        <g transform={`translate(${W / 2}, 360)`}>
          <text x={0} y={0} fontSize={50} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>NHỮNG LOẠI COMMIT</text>
          <text x={0} y={110} fontSize={132} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#cttg)">TÀ CÔNG</text>
          <text x={0} y={190} fontSize={56} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3" filter="url(#cttg)">CẤM THUẬT</text>
        </g>

        {/* git log terminal */}
        <g transform={`translate(${W / 2}, 1080)`}>
          <rect x={-470} y={-260} width={940} height={560} rx={14} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
          <rect x={-470} y={-260} width={940} height={64} rx={14} fill={BG_CARD} />
          <rect x={-470} y={-210} width={940} height={14} fill={BG_CARD} />
          <circle cx={-430} cy={-228} r={10} fill={WARNING_RED} />
          <circle cx={-398} cy={-228} r={10} fill={AMBER} />
          <circle cx={-366} cy={-228} r={10} fill={JADE} />
          <text x={0} y={-221} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">git log --oneline</text>
          {commits.map((c, i) => (
            <g key={i} transform={`translate(0, ${-150 + i * 88})`}>
              <text x={-430} y={0} fontSize={30} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{c.h}</text>
              <text x={-260} y={0} fontSize={36} fill={c.c} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{c.m}</text>
            </g>
          ))}
        </g>

        {/* Bottom hook */}
        <g transform={`translate(${W / 2}, 1650)`}>
          <line x1={-300} y1={-44} x2={300} y2={-44} stroke={AMBER} strokeWidth={1} />
          <text x={0} y={6} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">xem commit lúc 2 giờ sáng = thấy đạo tâm</text>
          <line x1={-300} y1={44} x2={300} y2={44} stroke={AMBER} strokeWidth={1} />
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
