import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;
const BG_DARK = "#0B0613";
const BG_CARD = "#1A0F2B";
const BG_TERM = "#120A1F";
const BG_RED = "#2A0D1B";
const PINK = "#FF2D95";
const PURPLE = "#B24BF3";
const CYAN = "#2DE2FF";
const GOLD = "#FFD24A";
const RED = "#FF4D6D";
const TEXT_PRI = "#F5EAFF";
const TEXT_SEC = "#C9B6E6";
const TEXT_MUTE = "#7E6C9E";

export const PovKtvThumbnail: React.FC = () => {
  const rows = [
    { k: "😭 Anh say khóc", v: "hát Phai Dấu × 4 lần" },
    { k: "💅 Đại gia rởm", v: "quẹt thẻ 3 lần đỏ đèn" },
    { k: "🤡 Anh tưởng bở", v: "\"mình có gì đó đúng không?\"" },
    { k: "🎤 Anh phá mic", v: "phòng bên cạnh trả phòng" },
  ];
  return (
    <AbsoluteFill style={{ background: BG_DARK }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="ktTop" cx="50%" cy="16%" r="58%">
            <stop offset="0%" stopColor={PINK} stopOpacity="0.32" />
            <stop offset="100%" stopColor={BG_DARK} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ktBL" cx="10%" cy="88%" r="48%">
            <stop offset="0%" stopColor={PURPLE} stopOpacity="0.3" />
            <stop offset="100%" stopColor={BG_DARK} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ktBR" cx="92%" cy="84%" r="46%">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.22" />
            <stop offset="100%" stopColor={BG_DARK} stopOpacity="0" />
          </radialGradient>
          <filter id="ktg"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_DARK} />
        <rect width={W} height={H} fill="url(#ktTop)" />
        <rect width={W} height={H} fill="url(#ktBL)" />
        <rect width={W} height={H} fill="url(#ktBR)" />
        {/* equalizer bottom */}
        <g opacity={0.5}>
          {Array.from({ length: 26 }, (_, i) => {
            const h = 40 + Math.abs(Math.sin(i * 1.3)) * 120;
            return <rect key={i} x={18 + i * 40} y={H - h} width={26} height={h} rx={6} fill={i % 2 ? PINK : PURPLE} opacity={0.7} />;
          })}
        </g>
        <g stroke={PINK} strokeWidth={3} opacity={0.7}>
          <path d="M 40 40 L 40 84 M 40 40 L 84 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 84 M ${W - 40} 40 L ${W - 84} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 84} M 40 ${H - 40} L 84 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 84} M ${W - 40} ${H - 40} L ${W - 84} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 150)`}>
          <text x={0} y={0} fontSize={22} fill={PINK} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ POV · CHỐN PHÙ HOA ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={PINK} strokeWidth={1.2} opacity={0.6} />
        </g>

        {/* title */}
        <g transform={`translate(${W / 2}, 350)`}>
          <text x={0} y={0} fontSize={40} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>POV: một đêm làm</text>
          <text x={0} y={96} fontSize={92} fill={PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#ktg)">TIẾP VIÊN KTV</text>
          <text x={0} y={158} fontSize={34} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">độ 5 loại "thiên kiếp" mỗi đêm</text>
        </g>

        {/* customer rows */}
        <g transform={`translate(0, 620)`}>
          {rows.map((r, i) => (
            <g key={i}>
              <rect x={70} y={i * 130} width={W - 140} height={112} rx={16} fill={BG_CARD} stroke={[RED, GOLD, PURPLE, CYAN][i]} strokeWidth={3} />
              <text x={110} y={i * 130 + 68} fontSize={38} fill={[RED, GOLD, PURPLE, CYAN][i]} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{r.k}</text>
              <text x={W - 110} y={i * 130 + 68} fontSize={30} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.v}</text>
            </g>
          ))}
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1320)`}>
          <rect x={-505} y={-90} width={1010} height={250} rx={20} fill={BG_TERM} stroke={GOLD} strokeWidth={4} />
          <text x={0} y={-30} fontSize={34} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>tu sĩ chỉ độ kiếp khi mặt trời đã lặn 🌙</text>
          <text x={0} y={42} fontSize={56} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>BÁN TIẾU CHÂN NHÂN</text>
          <text x={0} y={114} fontSize={32} fill={PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"kẻ bán nụ cười" 🍷</text>
        </g>

        <g transform={`translate(${W / 2}, 1580)`}>
          <text x={0} y={0} fontSize={31} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">"đi tăng 2 nha em?" → 🪞 Tứ Lạng Bạt Thiên Cân né khéo</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">🍷 truyền kỳ · chốn phù hoa · neon</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
