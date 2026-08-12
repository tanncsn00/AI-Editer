import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_CREAM = "#F5F1E8";
const BG_CREAM_DARK = "#ECE4D0";
const INK = "#0D0D0D";
const INK_SOFT = "#2A2A2A";
const INK_MUTE = "#6B6B6B";
const INK_FAINT = "#A8A8A8";
const SEAL = "#C8362B";

export const DonGianDaiDaoThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_CREAM }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="zentbg1" cx="50%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#FFFCF5" stopOpacity="1" />
            <stop offset="100%" stopColor={BG_CREAM} stopOpacity="1" />
          </radialGradient>
          <radialGradient id="zentbg2" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor={BG_CREAM_DARK} stopOpacity="0.5" />
            <stop offset="100%" stopColor={BG_CREAM} stopOpacity="0" />
          </radialGradient>
          <pattern id="zentgrain" width="200" height="200" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="40" r="0.6" fill={INK_FAINT} opacity="0.35" />
            <circle cx="120" cy="80" r="0.5" fill={INK_FAINT} opacity="0.3" />
            <circle cx="170" cy="50" r="0.7" fill={INK_FAINT} opacity="0.35" />
            <circle cx="60" cy="160" r="0.5" fill={INK_FAINT} opacity="0.3" />
            <circle cx="140" cy="180" r="0.6" fill={INK_FAINT} opacity="0.35" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#zentbg1)" />
        <rect width={W} height={H} fill="url(#zentbg2)" />
        <rect width={W} height={H} fill="url(#zentgrain)" />

        {/* Top thin frame */}
        <g transform={`translate(${W / 2}, 220)`}>
          <line x1={-80} y1={-40} x2={80} y2={-40} stroke={INK} strokeWidth={2} />
          <text x={0} y={30} fontSize={72} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="6">
            VIII
          </text>
          <text x={0} y={80} fontSize={18} fill={INK_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6">
            CHƯƠNG · ĐẠI ĐẠO TỐI CAO
          </text>
          <line x1={-80} y1={100} x2={80} y2={100} stroke={INK} strokeWidth={2} />
        </g>

        {/* Massive title */}
        <g transform={`translate(${W / 2}, 600)`}>
          <text x={0} y={0} fontSize={44} fill={INK_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} fontStyle="italic" letterSpacing="3">
            Khi dev hiểu được...
          </text>
          <text x={0} y={160} fontSize={156} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">
            ĐƠN GIẢN
          </text>
          <text x={0} y={250} fontSize={42} fill={INK_SOFT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} letterSpacing="8" fontStyle="italic">
            mới là
          </text>
          <text x={0} y={400} fontSize={144} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="8">
            ĐẠI ĐẠO
          </text>
        </g>

        {/* Dots */}
        <g transform={`translate(${W / 2}, 1240)`}>
          <circle cx={-26} cy={0} r={4} fill={INK_MUTE} />
          <circle cx={0} cy={0} r={4} fill={SEAL} />
          <circle cx={26} cy={0} r={4} fill={INK_MUTE} />
        </g>

        {/* Bottom subtitle */}
        <g transform={`translate(${W / 2}, 1430)`}>
          <text x={0} y={0} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="2">
            Một hàm dễ đọc.
          </text>
          <text x={0} y={50} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="2">
            Một hệ thống ổn định.
          </text>
          <text x={0} y={100} fontSize={32} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2" fontStyle="italic">
            3 năm không ai phải đụng.
          </text>
        </g>

        {/* Red seal stamp */}
        <g transform={`translate(${W - 130}, ${H - 220}) rotate(-4)`}>
          <rect x={-52} y={-52} width={104} height={104} rx={8} fill="none" stroke={SEAL} strokeWidth={5} />
          <text x={0} y={-4} fontSize={32} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
            簡
          </text>
          <text x={0} y={38} fontSize={32} fill={SEAL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">
            道
          </text>
        </g>

        {/* Bottom mark */}
        <g transform={`translate(${W / 2}, ${H - 60})`}>
          <text x={0} y={0} fontSize={18} fill={INK_FAINT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">
            truyền kỳ · 簡 道 · 2026
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
