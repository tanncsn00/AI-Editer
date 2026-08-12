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
const JADE = "#5BE8A8";
const VIOLET = "#B47AFF";
const ORANGE = "#FFA552";
const ACCENT_BLUE = "#5BB8FF";
const NV_GREEN = "#76B900";
const NV_GREEN_BRIGHT = "#A6E227";
const GRID = "#FFFFFF";

const Chip: React.FC<{ cx: number; cy: number; s: number; color: string; label: string }> = ({ cx, cy, s, color, label }) => {
  const pins = 6;
  const pinGap = s / (pins + 1);
  return (
    <g>
      {Array.from({ length: pins }).map((_, i) => {
        const off = -s / 2 + pinGap * (i + 1);
        return (
          <g key={i} fill={color} opacity={0.85}>
            <rect x={cx + off - 6} y={cy - s / 2 - 20} width={12} height={20} rx={2} />
            <rect x={cx + off - 6} y={cy + s / 2} width={12} height={20} rx={2} />
            <rect x={cx - s / 2 - 20} y={cy + off - 6} width={20} height={12} rx={2} />
            <rect x={cx + s / 2} y={cy + off - 6} width={20} height={12} rx={2} />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={s * 0.72} fill={color} opacity={0.12} />
      <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} rx={18} fill={BG_CARD} stroke={color} strokeWidth={5} />
      <rect x={cx - s / 2 + 20} y={cy - s / 2 + 20} width={s - 40} height={s - 40} rx={10} fill="none" stroke={color} strokeWidth={1.5} opacity={0.4} />
      <text x={cx} y={cy + s * 0.14} fontSize={s * 0.3} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{label}</text>
    </g>
  );
};

export const CudaTruyenKyThumbnail: React.FC = () => {
  const deps = [
    { c: ORANGE, t: "TensorFlow" }, { c: JADE, t: "PyTorch" },
    { c: ACCENT_BLUE, t: "OpenAI" }, { c: VIOLET, t: "Claude" },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="ctgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="ctgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="ctglow" cx="50%" cy="30%" r="62%">
            <stop offset="0%" stopColor={NV_GREEN} stopOpacity="0.2" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="ctg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#ctgrid)" />
        <rect width={W} height={H} fill="url(#ctgrid2)" />
        <rect width={W} height={H} fill="url(#ctglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 170)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ TRUYỀN KỲ · GIỚI IT ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <Chip cx={W / 2} cy={420} s={210} color={NV_GREEN} label="CUDA" />

        <g transform={`translate(${W / 2}, 660)`}>
          <text x={0} y={0} fontSize={116} fill={NV_GREEN_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4" filter="url(#ctg)">CUDA</text>
          <text x={0} y={76} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>công pháp làm nên đế quốc</text>
          <text x={0} y={138} fontSize={56} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>NVIDIA 🏯</text>
        </g>

        {/* dependents */}
        <g transform={`translate(${W / 2}, 920)`}>
          {deps.map((d, i) => {
            const col = i % 2, row = Math.floor(i / 2);
            const x = col === 0 ? -240 : 240, y = row * 110;
            return (
              <g key={i}>
                <rect x={x - 215} y={y} width={430} height={90} rx={12} fill={BG_CARD} stroke={d.c} strokeWidth={2.5} />
                <text x={x - 180} y={y + 58} fontSize={34} fill={d.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{d.t}</text>
                <text x={x + 190} y={y + 56} fontSize={22} fill={NV_GREEN_BRIGHT} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>↳ CUDA</text>
              </g>
            );
          })}
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1380)`}>
          <rect x={-480} y={-90} width={960} height={210} rx={14} fill={BG_TERM} stroke={NV_GREEN} strokeWidth={3} />
          <text x={0} y={-30} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Bạn nghĩ đang sống</text>
          <text x={0} y={20} fontSize={42} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} textDecoration="line-through">thời đại AI</text>
          <text x={0} y={84} fontSize={48} fill={NV_GREEN_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ là thời đại CUDA</text>
        </g>

        <g transform={`translate(${W / 2}, 1640)`}>
          <text x={0} y={0} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Đế quốc thầm lặng phía sau cơn sốt AI</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
