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
const WARNING_RED = "#FF6B6B";
const ORANGE = "#FFA552";
const GRID = "#FFFFFF";

export const PovKetoanThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="kttgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="kttgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="kttglow" cx="50%" cy="26%" r="62%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="kttg"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#kttgrid)" />
        <rect width={W} height={H} fill="url(#kttgrid2)" />
        <rect width={W} height={H} fill="url(#kttglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 155)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ TRUYỀN KỲ · CHỐN CÔNG SỞ ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 290)`}>
          <text x={0} y={0} fontSize={40} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">🏯 POV: TA LÀ MỘT</text>
          <text x={0} y={120} fontSize={100} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1" filter="url(#kttg)">THIÊN LAO</text>
          <text x={0} y={216} fontSize={78} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">DỰ BỊ CHÂN NHÂN</text>
          <text x={0} y={272} fontSize={30} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="1">// Người đời gọi là Kế Toán ⛓️</text>
        </g>

        {/* 4 thiên kiếp */}
        <g transform={`translate(${W / 2}, 700)`}>
          {[
            { k: "① NHẤT ĐỒNG KIẾP", s: "lệch 1 đồng · soi tới 3h", c: WARNING_RED },
            { k: "② TRUYỀN ÂM MẬT CHỈ", s: "'lo liệu cho khéo'", c: ORANGE },
            { k: "③ QUYẾT TOÁN ĐẠI KIẾP", s: "Tết của kế toán", c: ACCENT_BLUE },
            { k: "④ ĐOÀN THANH TRA", s: "sổ 3 năm trước", c: JADE },
          ].map((p, i) => (
            <g key={i}>
              <rect x={-505} y={-50 + i * 110} width={1010} height={92} rx={14} fill={BG_CARD} stroke={p.c} strokeWidth={2.5} />
              <text x={-475} y={-12 + i * 110} fontSize={34} fill={p.c} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{p.k}</text>
              <text x={475} y={22 + i * 110} fontSize={26} fill={TEXT_MUTE} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">{p.s}</text>
            </g>
          ))}
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1410)`}>
          <rect x={-505} y={-100} width={1010} height={250} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={0} y={-40} fontSize={34} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Sếp ăn · ta KÝ</text>
          <text x={0} y={36} fontSize={62} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Sếp hưởng · ta GÁNH</text>
          <text x={0} y={108} fontSize={34} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">…nghe ra tiếng còng số tám ⛓️</text>
        </g>

        <g transform={`translate(${W / 2}, 1650)`}>
          <text x={0} y={0} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">kế toán kiểu tu tiên 🏯</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · chốn công sở · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
