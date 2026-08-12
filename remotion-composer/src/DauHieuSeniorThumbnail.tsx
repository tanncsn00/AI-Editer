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
const AMBER_BRIGHT = "#FFD980";
const JADE = "#5BE8A8";
const ACCENT_BLUE = "#5BB8FF";
const WARNING_RED = "#FF6B6B";
const ORANGE = "#FFA552";
const GRID = "#FFFFFF";

export const DauHieuSeniorThumbnail: React.FC = () => {
  const signs = [
    { c: ACCENT_BLUE, t: "\"Có thật sự cần tính năng này?\"" },
    { c: ORANGE, t: "Prod sập → bình tĩnh đi pha cà phê ☕" },
    { c: JADE, t: "Thấy phức tạp → \"bỏ bớt đi\"" },
    { c: WARNING_RED, t: "Sợ thứ \"trông có vẻ chạy ổn\"" },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="dstgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="dstgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="dstglow" cx="50%" cy="38%" r="62%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.13" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="dstg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#dstgrid)" />
        <rect width={W} height={H} fill="url(#dstgrid2)" />
        <rect width={W} height={H} fill="url(#dstglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 175)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[SIGNS] · SENIOR DEV · 10</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 320)`}>
          <text x={0} y={0} fontSize={46} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>10 DẤU HIỆU BẠN ĐÃ</text>
          <text x={0} y={112} fontSize={132} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#dstg)">SENIOR</text>
        </g>

        {/* signs */}
        <g transform={`translate(${W / 2}, 640)`}>
          {signs.map((s, i) => (
            <g key={i} transform={`translate(0, ${i * 110})`}>
              <rect x={-470} y={-44} width={940} height={88} rx={8} fill={BG_CARD} stroke={s.c} strokeWidth={2} />
              <circle cx={-422} cy={0} r={14} fill={s.c} />
              <text x={-380} y={9} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{s.t}</text>
            </g>
          ))}
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1230)`}>
          <rect x={-470} y={-90} width={940} height={210} rx={10} fill="none" stroke={AMBER} strokeWidth={3} strokeDasharray="2 0" />
          <text x={0} y={-40} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// cảnh giới cao nhất của lập trình</text>
          <text x={0} y={50} fontSize={92} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#dstg)">"Đơn giản"</text>
        </g>

        <g transform={`translate(${W / 2}, 1520)`}>
          <line x1={-340} y1={-30} x2={340} y2={-30} stroke={AMBER} strokeWidth={1} />
          <text x={0} y={18} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Senior = học cách viết ÍT code hơn</text>
          <line x1={-340} y1={54} x2={340} y2={54} stroke={AMBER} strokeWidth={1} />
        </g>

        <g transform={`translate(${W / 2}, 1640)`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Đạo hữu trúng mấy dấu hiệu rồi?</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
