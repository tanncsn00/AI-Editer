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
const TEXT_SEC = "#A4B5D0";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const JADE = "#5BE8A8";
const ACCENT_BLUE = "#5BB8FF";
const VIOLET = "#B47AFF";
const ORANGE = "#FFA552";
const WARNING_RED = "#FF6B6B";
const SLATE = "#A4B5D0";
const GRID = "#FFFFFF";

export const DongMonNguyHiemThumbnail: React.FC = () => {
  const types = [
    { c: SLATE, e: "🙂", t: '"Chỉ thêm một chút"' },
    { c: JADE, e: "💡", t: '"Em vừa có ý tưởng"' },
    { c: ACCENT_BLUE, e: "🔧", t: '"Nhân tiện em refactor"' },
    { c: VIOLET, e: "😅", t: '"Chắc không sao đâu"' },
    { c: ORANGE, e: "😎", t: '"Em test rồi mà"' },
    { c: WARNING_RED, e: "🚀", t: '"Deploy nhanh thôi anh"' },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="dmtgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="dmtgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="dmtglow" cx="50%" cy="26%" r="60%">
            <stop offset="0%" stopColor={WARNING_RED} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="dmtg"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#dmtgrid)" />
        <rect width={W} height={H} fill="url(#dmtgrid2)" />
        <rect width={W} height={H} fill="url(#dmtglow)" />
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

        <g transform={`translate(${W / 2}, 320)`}>
          <text x={0} y={0} fontSize={48} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>7 ĐỒNG MÔN</text>
          <text x={0} y={92} fontSize={96} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#dmtg)">NGUY HIỂM</text>
          <text x={0} y={156} fontSize={40} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nhất SPRINT CUỐI 🏯</text>
        </g>

        {/* 6 type quotes */}
        <g transform={`translate(${W / 2}, 600)`}>
          {types.map((t, i) => {
            const y = i * 116;
            return (
              <g key={i}>
                <rect x={-480} y={y} width={960} height={96} rx={14} fill={BG_CARD} stroke={t.c} strokeWidth={2.5} />
                <text x={-430} y={y + 64} fontSize={48} textAnchor="middle">{t.e}</text>
                <text x={-370} y={y + 62} fontSize={34} fill={t.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{t.t}</text>
              </g>
            );
          })}
        </g>

        {/* the final one */}
        <g transform={`translate(${W / 2}, 1340)`}>
          <rect x={-480} y={0} width={960} height={120} rx={14} fill="#2A2310" stroke={AMBER} strokeWidth={3.5} />
          <text x={-420} y={76} fontSize={52} textAnchor="middle">🪞</text>
          <text x={-355} y={52} fontSize={30} fill={AMBER_BRIGHT} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🏴 LOẠI CUỐI: CHÍNH NGƯƠI</text>
          <text x={-355} y={94} fontSize={26} fill={TEXT_SEC} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>"Xong rồi" → commit thêm 12 lần</text>
        </g>

        <g transform={`translate(${W / 2}, 1610)`}>
          <text x={0} y={0} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Đạo hữu là loại thứ mấy? 👀</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
