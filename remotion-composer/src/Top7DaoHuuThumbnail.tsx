import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#0A0612";
const BG_SURFACE = "#15101F";
const TEXT_PRI = "#F5EDD8";
const TEXT_MUTE = "#5A4F70";
const GOLD = "#F4C04A";
const VIOLET = "#9D5BFF";
const DRAGON_RED = "#FF4747";

const C_L1 = "#E8E8E8";
const C_L2 = "#3FD68A";
const C_L3 = "#4FA8FF";
const C_L4 = "#9D5BFF";
const C_L5 = "#FF8A3D";
const C_L6 = "#FF4747";
const C_L7 = "#FF7AB6";

export const Top7DaoHuuThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="dht1" cx="20%" cy="0%" r="70%">
            <stop offset="0%" stopColor={VIOLET} stopOpacity="0.32" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dht2" cx="90%" cy="100%" r="60%">
            <stop offset="0%" stopColor={DRAGON_RED} stopOpacity="0.28" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dht3" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <pattern id="dhtgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.08" />
          </pattern>
          <radialGradient id="dhtmaskg" cx="50%" cy="50%" r="70%">
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="dhtgm"><rect width={W} height={H} fill="url(#dhtmaskg)" /></mask>
          <filter id="dhtglow">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#dhtgrid)" mask="url(#dhtgm)" />
        <rect width={W} height={H} fill="url(#dht1)" />
        <rect width={W} height={H} fill="url(#dht2)" />
        <rect width={W} height={H} fill="url(#dht3)" />

        {/* Top tag */}
        <g transform={`translate(${W / 2}, 170)`}>
          <rect x={-380} y={-50} width={760} height={100} rx={50} fill={BG_SURFACE} stroke={GOLD} strokeWidth={4} />
          <text x={0} y={16} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
            🏯 TRUYỀN KỲ GIỚI AI
          </text>
        </g>

        {/* Massive title */}
        <g transform={`translate(${W / 2}, 340)`}>
          <text x={0} y={0} fontSize={68} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">
            TOP 7 LOẠI
          </text>
          <text x={0} y={140} fontSize={110} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3" filter="url(#dhtglow)">
            ĐẠO HỮU
          </text>
          <text x={0} y={250} fontSize={54} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
            NGUY HIỂM NHẤT
          </text>
        </g>

        {/* Color level chart */}
        <g transform={`translate(${W / 2}, 920)`}>
          {[
            { i: 0, lv: "LOẠI 1", n: "Đạo hữu Refactor", c: C_L1 },
            { i: 1, lv: "LOẠI 2", n: "AI Bro", c: C_L2 },
            { i: 2, lv: "LOẠI 3", n: "Deploy thứ Sáu", c: C_L3 },
            { i: 3, lv: "LOẠI 4", n: "Overengineering", c: C_L4 },
            { i: 4, lv: "LOẠI 5", n: "Họp đạo", c: C_L5 },
            { i: 5, lv: "LOẠI 6", n: "Silent Bug", c: C_L6 },
            { i: 6, lv: "LOẠI 7", n: "Xinh đẹp biết code", c: C_L7 },
          ].map((r) => (
            <g key={r.i} transform={`translate(0, ${r.i * 72})`}>
              <rect x={-440} y={-32} width={880} height={64} rx={12} fill={BG_SURFACE} stroke={r.c} strokeWidth={2} />
              <circle cx={-400} cy={0} r={14} fill={r.c} />
              <text x={-360} y={10} fontSize={22} fill={r.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{r.lv}</text>
              <text x={-230} y={12} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.n}</text>
            </g>
          ))}
        </g>

        {/* Bottom question */}
        <g transform={`translate(${W / 2}, 1640)`}>
          <rect x={-490} y={-78} width={980} height={156} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
          <text x={0} y={-18} fontSize={36} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
            CTY BẠN CÓ LOẠI NÀO?
          </text>
          <text x={0} y={26} fontSize={22} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Refactor · AI Bro · Friday Deploy · Họp đạo
          </text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 60})`}>
          <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            ⚡ truyền kỳ giới ai · 7 đạo hữu nguy hiểm · 2026
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
