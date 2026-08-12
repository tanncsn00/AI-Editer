import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;
const BG_NAVY = "#0F1B2E";
const BG_BLUE = "#10243F";
const BG_AMBER = "#2A2110";
const BG_TERM = "#0A1322";
const BG_RED = "#2A1010";
const TEXT_PRI = "#E8F0FF";
const TEXT_MUTE = "#5E7090";
const TEXT_SEC = "#A4B5D0";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const ACCENT_BLUE = "#5BB8FF";
const WARNING_RED = "#FF6B6B";
const GRID = "#FFFFFF";

export const HttpSessionJwtThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="hjtgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="hjtgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="hjtglow" cx="50%" cy="22%" r="62%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="hjtg"><feGaussianBlur stdDeviation="8" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#hjtgrid)" />
        <rect width={W} height={H} fill="url(#hjtgrid2)" />
        <rect width={W} height={H} fill="url(#hjtglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 150)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ HTTP ĐẠO · TRUYỀN KỲ GIỚI IT ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        {/* title */}
        <g transform={`translate(0, 330)`}>
          <text x={W / 2 - 220} y={0} fontSize={120} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#hjtg)">SESSION</text>
          <text x={W / 2} y={110} fontSize={56} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>vs</text>
          <text x={W / 2 + 230} y={205} fontSize={150} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#hjtg)">JWT</text>
        </g>

        {/* two personas */}
        <g transform={`translate(0, 640)`}>
          <rect x={60} y={0} width={W / 2 - 90} height={250} rx={16} fill={BG_BLUE} stroke={ACCENT_BLUE} strokeWidth={3} />
          <text x={W / 4 - 15} y={62} fontSize={40} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>SESSION 🧓</text>
          <text x={W / 4 - 15} y={118} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>server giữ sổ 📖</text>
          <text x={W / 4 - 15} y={166} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhớ hết · revoke</text>
          <text x={W / 4 - 15} y={206} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>tức thì · nhưng nặng</text>

          <rect x={W / 2 + 30} y={0} width={W / 2 - 90} height={250} rx={16} fill={BG_AMBER} stroke={AMBER} strokeWidth={3} />
          <text x={(W * 3) / 4 + 15} y={62} fontSize={40} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>JWT 🗡️</text>
          <text x={(W * 3) / 4 + 15} y={118} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đốt sổ 🔥</text>
          <text x={(W * 3) / 4 + 15} y={166} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>bay xa · nhẹ ·</text>
          <text x={(W * 3) / 4 + 15} y={206} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thu về khó như lên trời</text>
        </g>

        {/* hook punchline */}
        <g transform={`translate(${W / 2}, 1090)`}>
          <rect x={-505} y={-80} width={1010} height={200} rx={20} fill={BG_RED} stroke={WARNING_RED} strokeWidth={4} />
          <text x={0} y={-20} fontSize={34} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nỗi nhục lớn nhất giới Web:</text>
          <text x={0} y={48} fontSize={50} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"đăng xuất rồi mà</text>
          <text x={0} y={102} fontSize={50} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">token vẫn sống" 🫠</text>
        </g>

        {/* aphorism */}
        <g transform={`translate(${W / 2}, 1400)`}>
          <rect x={-505} y={-85} width={1010} height={240} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={0} y={-30} fontSize={34} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>"Session hay JWT mạnh hơn?" → câu hỏi SAI</text>
          <text x={0} y={42} fontSize={46} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Kẻ yếu chọn CÔNG PHÁP</text>
          <text x={0} y={108} fontSize={52} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Kẻ mạnh chọn BÀI TOÁN ⚡</text>
        </g>

        <g transform={`translate(${W / 2}, 1640)`}>
          <text x={0} y={0} fontSize={31} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">đại đạo hợp nhất: Access + Refresh Token 🔗</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
