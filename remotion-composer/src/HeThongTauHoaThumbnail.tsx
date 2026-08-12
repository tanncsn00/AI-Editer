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
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const JADE = "#5BE8A8";
const VIOLET = "#B47AFF";
const WARNING_RED = "#FF6B6B";
const ACCENT_BLUE = "#5BB8FF";
const ORANGE = "#FFA552";
const GRID = "#FFFFFF";

export const HeThongTauHoaThumbnail: React.FC = () => {
  const signs = [
    { c: "#A4B5D0", t: "Không ai dám động vào code" },
    { c: ACCENT_BLUE, t: "Deploy = cả team cầu nguyện 🙏" },
    { c: ORANGE, t: "Người duy nhất hiểu... đã nghỉ việc" },
    { c: WARNING_RED, t: "Git blame toàn tên người mất tích 👻" },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="httgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="httgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="httglow" cx="50%" cy="36%" r="62%">
            <stop offset="0%" stopColor={WARNING_RED} stopOpacity="0.14" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="httg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#httgrid)" />
        <rect width={W} height={H} fill="url(#httgrid2)" />
        <rect width={W} height={H} fill="url(#httglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 175)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[WARNING] · LEGACY SYSTEM · 7</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 320)`}>
          <text x={0} y={0} fontSize={46} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>7 DẤU HIỆU HỆ THỐNG</text>
          <text x={0} y={104} fontSize={92} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1" filter="url(#httg)">SẮP TẨU HỎA</text>
          <text x={0} y={188} fontSize={92} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1" filter="url(#httg)">NHẬP MA</text>
        </g>

        {/* terminal artifact */}
        <g transform={`translate(${W / 2}, 760)`}>
          <rect x={-470} y={-110} width={940} height={250} rx={12} fill={BG_TERM} stroke={VIOLET} strokeWidth={2.5} />
          <rect x={-470} y={-110} width={940} height={48} rx={12} fill={BG_CARD} />
          <circle cx={-435} cy={-86} r={8} fill={WARNING_RED} />
          <circle cx={-409} cy={-86} r={8} fill={AMBER} />
          <circle cx={-383} cy={-86} r={8} fill={JADE} />
          <text x={0} y={-80} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>$ ls legacy/</text>
          <text x={-440} y={-20} fontSize={26} fill={VIOLET} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>📜 temp_final_v2_final</text>
          <text x={-440} y={28} fontSize={26} fill={VIOLET} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>📜 temp_final_v2_final_new</text>
          <text x={-440} y={76} fontSize={26} fill={VIOLET} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>📜 temp_final_v2_final_new_fix</text>
          <text x={-440} y={120} fontSize={22} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={500}># không ai dám xóa 😨</text>
        </g>

        {/* signs */}
        <g transform={`translate(${W / 2}, 1080)`}>
          {signs.map((s, i) => (
            <g key={i} transform={`translate(0, ${i * 92})`}>
              <rect x={-470} y={-36} width={940} height={72} rx={8} fill={BG_CARD} stroke={s.c} strokeWidth={2} />
              <circle cx={-425} cy={0} r={13} fill={s.c} />
              <text x={-385} y={9} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{s.t}</text>
            </g>
          ))}
        </g>

        <g transform={`translate(${W / 2}, 1560)`}>
          <line x1={-340} y1={-30} x2={340} y2={-30} stroke={AMBER} strokeWidth={1} />
          <text x={0} y={18} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">chết vì hàng nghìn lần "để sau sửa"</text>
          <line x1={-340} y1={54} x2={340} y2={54} stroke={AMBER} strokeWidth={1} />
        </g>

        <g transform={`translate(${W / 2}, 1670)`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Đạo hữu trúng mấy dấu hiệu rồi?</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
