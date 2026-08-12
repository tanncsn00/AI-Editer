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
const JADE = "#5BE8A8";
const WARNING_RED = "#FF6B6B";
const VIOLET = "#B47AFF";
const ORANGE = "#FFA552";
const ACCENT_BLUE = "#5BB8FF";
const SLATE = "#A4B5D0";
const GRID = "#FFFFFF";

export const DieuKhongAiThuaNhanThumbnail: React.FC = () => {
  const items = [
    { c: SLATE, t: "Gặp bug → cầu AI cứu" },
    { c: JADE, t: "Tối thấy mình đỉnh, sáng muốn truy nã" },
    { c: ACCENT_BLUE, t: "Đi ngủ → lỗi tự hết" },
    { c: VIOLET, t: "Copy code chạy được, không ai hiểu" },
    { c: ORANGE, t: "Đọc code 6 tháng trước như cổ vật" },
    { c: WARNING_RED, t: "Share màn → bug biến mất" },
    { c: AMBER, t: "Sửa được mà không biết sao → ship" },
  ];
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
          <radialGradient id="kttglow" cx="50%" cy="36%" r="62%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.12" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="kttg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
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

        <g transform={`translate(90, 165)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[CLASSIFIED] · CODE ĐẠO · 7</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 320)`}>
          <text x={0} y={0} fontSize={44} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>7 ĐIỀU DEV NÀO CŨNG LÀM</text>
          <text x={0} y={96} fontSize={62} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>NHƯNG KHÔNG AI</text>
          <text x={0} y={176} fontSize={86} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#kttg)">THỪA NHẬN 🤫</text>
        </g>

        {/* list */}
        <g transform={`translate(${W / 2}, 660)`}>
          {items.map((it, i) => (
            <g key={i} transform={`translate(0, ${i * 116})`}>
              <rect x={-460} y={-46} width={920} height={92} rx={8} fill={BG_CARD} stroke={it.c} strokeWidth={2} />
              <circle cx={-415} cy={0} r={16} fill={it.c} />
              <text x={-415} y={6} fontSize={18} fill={BG_NAVY} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={900}>{i + 1}</text>
              <text x={-375} y={9} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{it.t}</text>
            </g>
          ))}
        </g>

        {/* redacted stamp */}
        <g transform={`translate(880, 360) rotate(-10)`}>
          <rect x={-130} y={-44} width={260} height={88} rx={6} fill="none" stroke={WARNING_RED} strokeWidth={4} strokeDasharray="8 5" />
          <text x={0} y={-4} fontSize={24} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={900}>🤫 GUILTY</text>
          <text x={0} y={28} fontSize={20} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>tất cả 7/7</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 130})`}>
          <text x={0} y={0} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Đạo hữu trúng mấy chuyện rồi?</text>
        </g>
        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
