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
const ACCENT_BLUE = "#5BB8FF";
const JADE = "#5BE8A8";
const VIOLET = "#B47AFF";
const ORANGE = "#FFA552";
const WARNING_RED = "#FF6B6B";
const SLATE = "#A4B5D0";
const GRID = "#FFFFFF";

export const ThanChuDanTechThumbnail: React.FC = () => {
  const spells = [
    { c: SLATE, t: "Chắc không sao đâu" },
    { c: JADE, t: "Fix nhanh thôi" },
    { c: ACCENT_BLUE, t: "Ở local em chạy mà" },
    { c: VIOLET, t: "Chỉ sửa một dòng thôi" },
    { c: ORANGE, t: "Deploy thứ Sáu đi" },
    { c: WARNING_RED, t: "AI viết rồi, chắc đúng" },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="tctgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="tctgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="tctglow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.12" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="tctg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#tctgrid)" />
        <rect width={W} height={H} fill="url(#tctgrid2)" />
        <rect width={W} height={H} fill="url(#tctglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 175)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[CURSED] · DEV INCANTATIONS · 7</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 360)`}>
          <text x={0} y={0} fontSize={50} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">TOP 7 CÂU</text>
          <text x={0} y={118} fontSize={116} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#tctg)">THẦN CHÚ</text>
          <text x={0} y={188} fontSize={46} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3" filter="url(#tctg)">CỦA DÂN TECH</text>
        </g>

        {/* spell list */}
        <g transform={`translate(${W / 2}, 850)`}>
          {spells.map((s, i) => (
            <g key={i} transform={`translate(0, ${i * 108})`}>
              <rect x={-450} y={-44} width={900} height={88} rx={6} fill={BG_CARD} stroke={s.c} strokeWidth={2} />
              <text x={-415} y={2} fontSize={30} fill={s.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>「</text>
              <text x={-375} y={9} fontSize={34} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">{s.t}</text>
            </g>
          ))}
        </g>

        <g transform={`translate(${W / 2}, 1640)`}>
          <line x1={-320} y1={-44} x2={320} y2={-44} stroke={AMBER} strokeWidth={1} />
          <text x={0} y={6} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">nghe câu này trước khi deploy = rùng mình</text>
          <line x1={-320} y1={44} x2={320} y2={44} stroke={AMBER} strokeWidth={1} />
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
