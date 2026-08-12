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

export const SinhVatThanBiThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="svtgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="svtgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="svtglow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={VIOLET} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="svtg"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#svtgrid)" />
        <rect width={W} height={H} fill="url(#svtgrid2)" />
        <rect width={W} height={H} fill="url(#svtglow)" />
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
          <text x={0} y={0} fontSize={54} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NHỮNG SINH VẬT</text>
          <text x={0} y={96} fontSize={104} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#svtg)">THẦN BÍ</text>
          <text x={0} y={162} fontSize={38} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>trong công ty công nghệ 👻</text>
        </g>

        {/* 6 creature chips */}
        <g transform={`translate(${W / 2}, 640)`}>
          {[
            { t: "⚪ Trưởng lão đã nghỉ 3 năm", c: TEXT_PRI },
            { t: "🟢 Hỏi gì cũng biết", c: JADE },
            { t: "🔵 3h sáng vẫn online", c: ACCENT_BLUE },
            { t: "🟣 'Restart đi' là xong", c: VIOLET },
            { t: "🟠 '5 phút' → mất tích 3 ngày", c: ORANGE },
            { t: "🔴 Tháng nào cũng dọa nghỉ", c: WARNING_RED },
          ].map((p, i) => (
            <g key={i}>
              <rect x={-490} y={-90 + i * 92} width={980} height={78} rx={14} fill={BG_CARD} stroke={p.c} strokeWidth={2.5} />
              <text x={0} y={-38 + i * 92} fontSize={32} fill={p.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{p.t}</text>
            </g>
          ))}
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1330)`}>
          <rect x={-500} y={-110} width={1000} height={260} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={0} y={-50} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Và đáng sợ nhất: trưởng lão đứng sau lưng</text>
          <text x={0} y={20} fontSize={52} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">“Nó bị sao thế em?” 🔥</text>
          <text x={0} y={100} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>“Xong chưa em?” 🤣</text>
        </g>

        <g transform={`translate(${W / 2}, 1580)`}>
          <text x={0} y={0} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Đồng nghiệp kiểu tu tiên 🏯</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
