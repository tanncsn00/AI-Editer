import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
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
const GRID = "#FFFFFF";

export const MicroserviceDaiTranThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="mstgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="mstgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="mstglow" cx="50%" cy="28%" r="60%">
            <stop offset="0%" stopColor={ACCENT_BLUE} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="mstg"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#mstgrid)" />
        <rect width={W} height={H} fill="url(#mstgrid2)" />
        <rect width={W} height={H} fill="url(#mstglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 175)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ TRUYỀN KỲ · GIỚI IT ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 330)`}>
          <text x={0} y={0} fontSize={46} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TRUYỀN KỲ ĐẠI TRẬN</text>
          <text x={0} y={104} fontSize={92} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1" filter="url(#mstg)">MICROSERVICE</text>
        </g>

        {/* monolith vs microservice diagram */}
        <g transform={`translate(${W / 2}, 760)`}>
          {/* monolith */}
          <rect x={-470} y={-130} width={400} height={300} rx={16} fill={BG_CARD} stroke={VIOLET} strokeWidth={4} />
          <text x={-270} y={-30} fontSize={76} textAnchor="middle">🏛️</text>
          <text x={-270} y={50} fontSize={36} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>MONOLITH</text>
          <text x={-270} y={100} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>1 khối khổng lồ</text>
          {/* arrow */}
          <text x={0} y={30} fontSize={70} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>→</text>
          {/* microservice grid */}
          <rect x={70} y={-130} width={400} height={300} rx={16} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={4} />
          {[ACCENT_BLUE, JADE, VIOLET, ORANGE, AMBER, WARNING_RED].map((c, i) => {
            const col = i % 3, row = Math.floor(i / 3);
            return <g key={i}><rect x={110 + col * 110} y={-90 + row * 90} width={90} height={70} rx={8} fill="#0E1A2E" stroke={c} strokeWidth={2} /><text x={155 + col * 110} y={-48 + row * 90} fontSize={28} textAnchor="middle">⚙️</text></g>;
          })}
          <text x={270} y={130} fontSize={34} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>MICROSERVICE</text>
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1280)`}>
          <rect x={-490} y={-90} width={980} height={210} rx={16} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
          <text x={0} y={-34} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>chia 1 đại điện → 100 phân điện =</text>
          <text x={0} y={34} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">không bớt quái vật</text>
          <text x={0} y={94} fontSize={44} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>→ NHÂN LÊN 100 con 👹</text>
        </g>

        <g transform={`translate(${W / 2}, 1560)`}>
          <text x={0} y={0} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Lịch sử ra đời Microservice 🏯</text>
          <text x={0} y={50} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>2011 · Venice · Martin Fowler · Netflix</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
