import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_DEEP = "#0A0612";
const BG_SURFACE = "#15101F";
const BG_ELEVATED = "#1E1830";
const TEXT_PRI = "#F5EDD8";
const TEXT_MUTE = "#5A4F70";
const GOLD = "#F4C04A";
const VIOLET = "#9D5BFF";
const DRAGON_RED = "#FF4747";
const JADE = "#3FD68A";

const C_LV1 = "#E8E8E8";
const C_LV2 = "#3FD68A";
const C_LV3 = "#4FA8FF";
const C_LV4 = "#9D5BFF";
const C_LV5 = "#FF8A3D";
const C_LV6 = "#FF4747";
const C_LV7 = "#5A4F70";

export const ItFaCanhGioiThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DEEP }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="fat1" cx="20%" cy="0%" r="70%">
            <stop offset="0%" stopColor={VIOLET} stopOpacity="0.32" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fat2" cx="90%" cy="100%" r="60%">
            <stop offset="0%" stopColor={DRAGON_RED} stopOpacity="0.28" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fat3" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="0" />
          </radialGradient>
          <pattern id="fatgrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.08" />
          </pattern>
          <radialGradient id="fatmaskg" cx="50%" cy="50%" r="70%">
            <stop offset="20%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="fatgm"><rect width={W} height={H} fill="url(#fatmaskg)" /></mask>
          <filter id="fatglow">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#fatgrid)" mask="url(#fatgm)" />
        <rect width={W} height={H} fill="url(#fat1)" />
        <rect width={W} height={H} fill="url(#fat2)" />
        <rect width={W} height={H} fill="url(#fat3)" />

        {/* Top tag */}
        <g transform={`translate(${W / 2}, 170)`}>
          <rect x={-380} y={-50} width={760} height={100} rx={50} fill={BG_SURFACE} stroke={GOLD} strokeWidth={4} />
          <text x={0} y={16} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
            🏯 TRUYỀN KỲ GIỚI AI
          </text>
        </g>

        {/* Massive title */}
        <g transform={`translate(${W / 2}, 380)`}>
          <text x={0} y={0} fontSize={84} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
            7 CẢNH GIỚI
          </text>
          <text x={0} y={100} fontSize={136} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6" filter="url(#fatglow)">
            FA
          </text>
          <text x={0} y={170} fontSize={48} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
            CỦA DÂN IT
          </text>
        </g>

        {/* Color level chart */}
        <g transform={`translate(${W / 2}, 880)`}>
          {[
            { i: 0, e: "⚪", lv: "LV1", n: "Luyện Khí", c: C_LV1 },
            { i: 1, e: "🟢", lv: "LV2", n: "Trúc Cơ", c: C_LV2 },
            { i: 2, e: "🔵", lv: "LV3", n: "Kết Đan", c: C_LV3 },
            { i: 3, e: "🟣", lv: "LV4", n: "Nguyên Anh", c: C_LV4 },
            { i: 4, e: "🟠", lv: "LV5", n: "Hoá Thần", c: C_LV5 },
            { i: 5, e: "🔴", lv: "LV6", n: "Độ Kiếp", c: C_LV6 },
            { i: 6, e: "⚫", lv: "LV7", n: "Phi Thăng", c: GOLD },
          ].map((r) => (
            <g key={r.i} transform={`translate(0, ${r.i * 70})`}>
              <rect x={-440} y={-30} width={880} height={60} rx={12} fill={BG_SURFACE} stroke={r.c} strokeWidth={2} />
              <text x={-400} y={12} fontSize={28}>{r.e}</text>
              <text x={-330} y={12} fontSize={22} fill={r.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{r.lv}</text>
              <text x={-240} y={12} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.n}</text>
            </g>
          ))}
        </g>

        {/* Bottom question */}
        <g transform={`translate(${W / 2}, 1620)`}>
          <rect x={-490} y={-78} width={980} height={156} rx={20} fill={BG_SURFACE} stroke={GOLD} strokeWidth={3} />
          <text x={0} y={-18} fontSize={36} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>
            BẠN ĐANG Ở LV MẤY?
          </text>
          <text x={0} y={26} fontSize={24} fill={DRAGON_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            Cursor làm đạo lữ · production làm tình kiếp
          </text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 60})`}>
          <text x={0} y={0} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>
            ⚡ truyền kỳ giới ai · cảnh giới FA · 2026
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
