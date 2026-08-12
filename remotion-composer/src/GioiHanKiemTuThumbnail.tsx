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
const WARNING_RED = "#FF6B6B";
const GRID = "#FFFFFF";

export const GioiHanKiemTuThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="ghtgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="ghtgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="ghtglow" cx="50%" cy="30%" r="62%">
            <stop offset="0%" stopColor={WARNING_RED} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="ghtg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#ghtgrid)" />
        <rect width={W} height={H} fill="url(#ghtgrid2)" />
        <rect width={W} height={H} fill="url(#ghtglow)" />
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
          <text x={0} y={0} fontSize={50} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>GIỚI HẠN CHỊU ĐỰNG</text>
          <text x={0} y={96} fontSize={84} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#ghtg)">KIẾM TU IT</text>
          <text x={0} y={170} fontSize={64} textAnchor="middle">⚔️🗡️</text>
        </g>

        {/* the pattern */}
        <g transform={`translate(${W / 2}, 700)`}>
          <rect x={-490} y={-30} width={980} height={100} rx={14} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
          <text x={-450} y={6} fontSize={26} fill={TEXT_SEC} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>“Chê hắn nghèo, đụt, mặc xấu…”</text>
          <text x={-450} y={48} fontSize={28} fill={JADE} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✓ "Bản tọa nghe quen rồi" 😌</text>
        </g>
        <g transform={`translate(${W / 2}, 870)`}>
          <rect x={-490} y={-50} width={980} height={200} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={4} />
          <text x={-450} y={-8} fontSize={24} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⚔️ NHƯNG DÁM ĐỘNG TỚI CRUSH:</text>
          <text x={-450} y={42} fontSize={30} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>“Crush xem hắn như huynh đệ”</text>
          <text x={-450} y={102} fontSize={34} fill={AMBER_BRIGHT} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">🗡️ "phân sinh tử với ngươi!"</text>
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1280)`}>
          <rect x={-490} y={-90} width={980} height={200} rx={16} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
          <text x={0} y={-30} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>7 nghịch lân của dev…</text>
          <text x={0} y={36} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đều là chuyện</text>
          <text x={0} y={96} fontSize={48} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>TÌNH DUYÊN 💔</text>
        </g>

        <g transform={`translate(${W / 2}, 1560)`}>
          <text x={0} y={0} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Biết vảy ngược ở đâu? Chuẩn bị hậu sự 🪦</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
