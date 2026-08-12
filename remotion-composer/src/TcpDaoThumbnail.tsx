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
const GRID = "#FFFFFF";

export const TcpDaoThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="tcptgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="tcptgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="tcptglow" cx="50%" cy="27%" r="62%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="tcptg"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#tcptgrid)" />
        <rect width={W} height={H} fill="url(#tcptgrid2)" />
        <rect width={W} height={H} fill="url(#tcptglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 165)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ TRUYỀN KỲ · GIỚI IT ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 300)`}>
          <text x={0} y={0} fontSize={50} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">TRUYỀN KỲ</text>
          <text x={0} y={150} fontSize={180} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6" filter="url(#tcptg)">TCP</text>
          <text x={0} y={230} fontSize={56} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>ĐẠO 🗡️</text>
          <text x={0} y={290} fontSize={27} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="1">// 《Thiên Cơ Truy Hồi Chân Kinh》</text>
        </g>

        {/* 4 mechanisms */}
        <g transform={`translate(${W / 2}, 720)`}>
          {[
            { t: "📡 ACK · 'đã nhận được' → gửi lại tới khi tới", c: ACCENT_BLUE },
            { t: "🔢 SEQUENCE NUMBER · đánh số, sắp xếp lại", c: VIOLET },
            { t: "🌊 FLOW CONTROL · bên nhận ngộp → chậm lại", c: ORANGE },
            { t: "🚦 CONGESTION CONTROL · mạng tải → nhường đường", c: WARNING_RED },
          ].map((p, i) => (
            <g key={i}>
              <rect x={-505} y={-50 + i * 116} width={1010} height={100} rx={14} fill={BG_CARD} stroke={p.c} strokeWidth={2.5} />
              <text x={0} y={12 + i * 116} fontSize={28} fill={p.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{p.t}</text>
            </g>
          ))}
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1430)`}>
          <rect x={-505} y={-100} width={1010} height={232} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={0} y={-40} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>1000 trang = 1000 phi kiếm 🗡️</text>
          <text x={0} y={26} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">CHẬM 1 chút · không sao</text>
          <text x={0} y={90} fontSize={40} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">MẤT bí tịch · tuyệt đối không 💀</text>
        </g>

        <g transform={`translate(${W / 2}, 1660)`}>
          <text x={0} y={0} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">TCP kiểu tu tiên 🏯</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
