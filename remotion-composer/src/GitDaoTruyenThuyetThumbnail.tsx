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
const JADE = "#5BE8A8";
const WARNING_RED = "#FF6B6B";
const GIT_ORANGE = "#F1502F";
const GRID = "#FFFFFF";

export const GitDaoTruyenThuyetThumbnail: React.FC = () => {
  const commits = [0, 1, 2, 3, 4];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="gttgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="gttgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="gttglow" cx="50%" cy="32%" r="62%">
            <stop offset="0%" stopColor={GIT_ORANGE} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="gttg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#gttgrid)" />
        <rect width={W} height={H} fill="url(#gttgrid2)" />
        <rect width={W} height={H} fill="url(#gttglow)" />
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

        {/* commit graph */}
        <g transform={`translate(0, 360)`}>
          <line x1={W / 2 - 360} y1={0} x2={W / 2 + 360} y2={0} stroke={GIT_ORANGE} strokeWidth={4} opacity={0.7} />
          {commits.map((c, i) => (
            <g key={i}>
              <circle cx={W / 2 - 360 + i * 180} cy={0} r={28} fill={BG_CARD} stroke={GIT_ORANGE} strokeWidth={5} />
              <circle cx={W / 2 - 360 + i * 180} cy={0} r={11} fill={GIT_ORANGE} />
            </g>
          ))}
        </g>

        <g transform={`translate(${W / 2}, 560)`}>
          <text x={0} y={0} fontSize={50} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TRUYỀN THUYẾT</text>
          <text x={0} y={130} fontSize={150} fill={GIT_ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4" filter="url(#gttg)">GIT ĐẠO</text>
        </g>

        {/* spell card */}
        <g transform={`translate(${W / 2}, 920)`}>
          <rect x={-440} y={-30} width={880} height={210} rx={18} fill={BG_CARD} stroke={AMBER} strokeWidth={4} />
          <text x={0} y={40} fontSize={34} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>「 thần chú nổi tiếng nhất 」</text>
          <text x={0} y={130} fontSize={68} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>"Anh ơi cứu em" 🙏</text>
        </g>

        {/* danger terminal */}
        <g transform={`translate(${W / 2}, 1330)`}>
          <rect x={-470} y={-80} width={940} height={180} rx={12} fill={BG_TERM} stroke="#FF2D2D" strokeWidth={3.5} />
          <text x={-430} y={-28} fontSize={28} fill="#FF5252" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>$ git push --force</text>
          <text x={-430} y={26} fontSize={28} fill={AMBER_BRIGHT} fontFamily="'JetBrains Mono', monospace" fontWeight={800}>  → branch: PRODUCTION 💀</text>
          <text x={-430} y={78} fontSize={26} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>  🚨 đạo tâm vỡ vụn...</text>
        </g>

        <g transform={`translate(${W / 2}, 1600)`}>
          <text x={0} y={0} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">Không ai thật sự hiểu Git 🤯</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
