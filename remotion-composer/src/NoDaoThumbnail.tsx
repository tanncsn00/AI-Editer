import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;
const BG = "#0A0705";
const CARD2 = "#1E150D";
const GOLD = "#F0B429";
const CRIMSON = "#E5484D";
const PAPER = "#F2E8D5";
const SEC = "#C4A97E";

export const NoDaoThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <svg width={W} height={H}>
      <defs>
        <radialGradient id="tGlow" cx="50%" cy="34%" r="64%">
          <stop offset="0%" stopColor={GOLD} stopOpacity="0.20" />
          <stop offset="100%" stopColor={BG} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="tVig" cx="50%" cy="46%" r="74%">
          <stop offset="52%" stopColor={BG} stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
        </radialGradient>
        <filter id="tGlowF" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect width={W} height={H} fill={BG} />
      <g stroke={GOLD} strokeWidth={1} opacity={0.09}>
        {Array.from({ length: 22 }, (_, i) => (
          <line key={i} x1={0} y1={i * 92} x2={W} y2={i * 92} />
        ))}
      </g>
      <line x1={150} y1={0} x2={150} y2={H} stroke={CRIMSON} strokeWidth={3} opacity={0.45} />
      <line x1={W - 150} y1={0} x2={W - 150} y2={H} stroke={CRIMSON} strokeWidth={3} opacity={0.45} />
      <rect width={W} height={H} fill="url(#tGlow)" />
      <rect width={W} height={H} fill="url(#tVig)" />

      <text x={W / 2} y={430} fontSize={34} fill={CRIMSON} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="10">TU TIÊN GIỚI</text>

      <text x={W / 2} y={700} fontSize={215} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6" filter="url(#tGlowF)">NỢ ĐẠO</text>

      <rect x={W / 2 - 340} y={790} width={680} height={116} rx={14} fill={CARD2} stroke={GOLD} strokeWidth={4} />
      <text x={W / 2} y={870} fontSize={72} fill={PAPER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">7 CẢNH GIỚI</text>

      <text x={W / 2} y={1060} fontSize={54} fill={PAPER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>món nợ không ai đòi</text>
      <text x={W / 2} y={1146} fontSize={54} fill={PAPER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>không ngân hàng gọi</text>

      <text x={W / 2} y={1300} fontSize={64} fill={CRIMSON} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#tGlowF)">NHƯNG THIÊN ĐẠO</text>
      <text x={W / 2} y={1382} fontSize={64} fill={CRIMSON} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#tGlowF)">VẪN NHỚ</text>

      <g transform={`translate(${W / 2}, 1580) rotate(-9)`}>
        <rect x={-190} y={-62} width={380} height={124} rx={10} fill="none" stroke={CRIMSON} strokeWidth={7} opacity={0.92} />
        <text x={0} y={20} fontSize={62} fill={CRIMSON} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">CHƯA TRẢ</text>
      </g>

      <text x={W / 2} y={1790} fontSize={36} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">99% đạo hữu từng mắc</text>
    </svg>
  </AbsoluteFill>
);
