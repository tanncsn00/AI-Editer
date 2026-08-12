import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_BASE = "#1A1330";
const BG_CARD = "#28204A";
const BG_TERM = "#130D26";
const TEXT_PRI = "#F1ECFF";
const TEXT_MUTE = "#766596";
const TEXT_SEC = "#C2B6E0";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const JADE = "#5BE8A8";
const ACCENT_BLUE = "#79C7FF";
const VIOLET = "#C79BFF";
const ORANGE = "#FFAE6B";
const WARNING_RED = "#FF7B8E";
const GRID = "#FFFFFF";

export const TuSiCuoiThangThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_BASE }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="tsctgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.09" />
          </pattern>
          <pattern id="tsctgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.14" />
          </pattern>
          <radialGradient id="tsctglow" cx="50%" cy="26%" r="62%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BG_BASE} stopOpacity="0" />
          </radialGradient>
          <filter id="tsctg"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_BASE} />
        <rect width={W} height={H} fill="url(#tsctgrid)" />
        <rect width={W} height={H} fill="url(#tsctgrid2)" />
        <rect width={W} height={H} fill="url(#tsctglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 165)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ TRUYỀN KỲ · CUỐI THÁNG ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 300)`}>
          <text x={0} y={0} fontSize={50} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>6 LOẠI TU SĨ</text>
          <text x={0} y={130} fontSize={150} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#tsctg)">CUỐI</text>
          <text x={0} y={280} fontSize={150} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#tsctg)">THÁNG</text>
          <text x={0} y={350} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>khi ví cạn linh thạch 💸</text>
        </g>

        {/* 6 type chips */}
        <g transform={`translate(${W / 2}, 770)`}>
          {[
            { t: "①  Ảo Giác Đắc Đạo", c: AMBER },
            { t: "②  Quan Tưởng Số Dư", c: ACCENT_BLUE },
            { t: "③  Bế Quan Chờ Phát Bổng", c: JADE },
            { t: "④  Vay Mượn Nhân Duyên", c: VIOLET },
            { t: "⑤  Ngộ Đạo Sau Lĩnh Lương", c: ORANGE },
            { t: "⑥  Kéo Dài Thọ Nguyên", c: WARNING_RED },
          ].map((p, i) => {
            const col = i % 2, row = Math.floor(i / 2);
            return (
              <g key={i}>
                <rect x={-505 + col * 510} y={-60 + row * 132} width={490} height={108} rx={14} fill={BG_CARD} stroke={p.c} strokeWidth={2.5} />
                <text x={-260 + col * 510} y={2 + row * 132} fontSize={28} fill={p.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{p.t}</text>
              </g>
            );
          })}
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1410)`}>
          <rect x={-505} y={-105} width={1010} height={242} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={0} y={-45} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thứ biến mất nhanh nhất thế gian</text>
          <text x={0} y={20} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>không phải thanh xuân…</text>
          <text x={0} y={92} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà là LƯƠNG vừa phát 3 ngày trước 💀</text>
        </g>

        <g transform={`translate(${W / 2}, 1650)`}>
          <text x={0} y={0} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">ngươi là loại mấy? 🤣</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · cuối tháng · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
