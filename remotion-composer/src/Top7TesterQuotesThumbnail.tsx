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
const AMBER = "#FFC857";
const WARNING_RED = "#FF6B6B";
const TESTER = "#FF6FB5";
const GRID = "#FFFFFF";

export const Top7TesterQuotesThumbnail: React.FC = () => {
  const msgs = ["Anh ơi em thấy hơi lạ 👀", "Lâu lâu mới bị 🌚", "Máy em bị 💻", "Anh rảnh không? 🙂"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="tqtgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="tqtgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="tqtglow" cx="50%" cy="40%" r="62%">
            <stop offset="0%" stopColor={TESTER} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="tqtg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#tqtgrid)" />
        <rect width={W} height={H} fill="url(#tqtgrid2)" />
        <rect width={W} height={H} fill="url(#tqtglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 175)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[INCOMING] · TESTER · 7</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 320)`}>
          <text x={0} y={0} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>7 CÂU NÓI CỦA TESTER</text>
          <text x={0} y={96} fontSize={56} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>KHIẾN DEV</text>
          <text x={0} y={178} fontSize={84} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#tqtg)">TẨU HỎA NHẬP MA</text>
        </g>

        {/* tester chat messages */}
        <g transform={`translate(0, 700)`}>
          {msgs.map((m, i) => (
            <g key={i} transform={`translate(0, ${i * 150})`}>
              <circle cx={120} cy={50} r={34} fill={BG_CARD} stroke={TESTER} strokeWidth={2} />
              <text x={120} y={64} fontSize={38} textAnchor="middle">🧪</text>
              <rect x={175} y={4} width={760} height={92} rx={20} fill={BG_CARD} stroke={TESTER} strokeWidth={2.5} />
              <text x={205} y={38} fontSize={16} fill={TESTER} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>Tester ▸</text>
              <text x={205} y={78} fontSize={34} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{m}</text>
            </g>
          ))}
        </g>

        <g transform={`translate(${W / 2}, 1500)`}>
          <line x1={-320} y1={-44} x2={320} y2={-44} stroke={AMBER} strokeWidth={1} />
          <text x={0} y={2} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">không tạo bug — nhưng luôn TÌM THẤY bug</text>
          <text x={0} y={54} fontSize={28} fill={TESTER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>thiên kiếp luôn bắt đầu từ đây 😨</text>
          <line x1={-320} y1={86} x2={320} y2={86} stroke={AMBER} strokeWidth={1} />
        </g>

        <g transform={`translate(${W / 2}, 1660)`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Đạo hữu là dev hay tester?</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
