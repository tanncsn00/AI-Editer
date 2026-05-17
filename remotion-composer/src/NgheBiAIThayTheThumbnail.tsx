import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";

const MiniStick: React.FC<{ x: number; y: number; opacity: number; glow?: boolean; size?: number }> = ({
  x, y, opacity, glow = false, size = 1,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${size})`} opacity={opacity}>
    {glow && <circle cx={0} cy={-10} r={75} fill={GOLD} opacity={0.45} />}
    <line x1={-8} y1={20} x2={-12} y2={50} stroke="#3A3850" strokeWidth={9} strokeLinecap="round" />
    <line x1={8} y1={20} x2={12} y2={50} stroke="#3A3850" strokeWidth={9} strokeLinecap="round" />
    <rect x={-15} y={-18} width={30} height={40} rx={7} fill={glow ? GOLD : "#4A7AC8"} stroke={INK} strokeWidth={2.5} />
    <line x1={-15} y1={-5} x2={-26} y2={12} stroke="#F8E0D0" strokeWidth={8} strokeLinecap="round" />
    <line x1={15} y1={-5} x2={26} y2={12} stroke="#F8E0D0" strokeWidth={8} strokeLinecap="round" />
    <circle cx={0} cy={-32} r={15} fill="#F8E0D0" stroke={INK} strokeWidth={2.5} />
    <path d="M -15 -36 Q -12 -47 -4 -46 Q 1 -50 10 -47 Q 15 -42 15 -36" fill="#1A1A22" />
    <circle cx={-5} cy={-33} r={2} fill={INK} />
    <circle cx={5} cy={-33} r={2} fill={INK} />
  </g>
);

export const NgheBiAIThayTheThumbnail: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <filter id="thumbPN">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
          </filter>
          <radialGradient id="thumbVig" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#thumbPN)" />
        <rect width={W} height={H} fill="url(#thumbVig)" />

        {/* Top sticker */}
        <g transform="translate(540, 220)">
          <rect x={-260} y={-46} width={520} height={92} rx={46} fill={INK} />
          <text x={0} y={14} fontSize={36} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>3 NĂM TỚI</text>
        </g>

        {/* Big number "5" */}
        <g transform="translate(540, 540)">
          <text x={0} y={0} fontSize={420} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} dominantBaseline="middle"
            style={{ filter: "drop-shadow(0 12px 28px rgba(232,88,56,0.4))" }}>5</text>
        </g>

        {/* "NGHỀ" */}
        <text x={540} y={780} fontSize={130} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>NGHỀ</text>

        {/* "AI SẮP LẤY MẤT" */}
        <text x={540} y={910} fontSize={70} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>AI SẮP LẤY MẤT</text>

        {/* 5 stick figure row */}
        <g transform="translate(0, 1180)">
          <MiniStick x={180} y={0} opacity={1} glow size={1.3} />
          <MiniStick x={400} y={0} opacity={0.2} size={1.3} />
          <MiniStick x={620} y={0} opacity={0.2} size={1.3} />
          <MiniStick x={840} y={0} opacity={0.2} size={1.3} />
          <MiniStick x={1020} y={0} opacity={0.2} size={1.3} />
          {/* Strikethrough on 4 */}
          {[400, 620, 840, 1020].map((x) => (
            <line key={x} x1={x - 50} y1={5} x2={x + 50} y2={-30} stroke="#D03020" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
          ))}
        </g>

        {/* Bottom card hook */}
        <g transform="translate(540, 1500)">
          <rect x={-440} y={-80} width={880} height={180} rx={20} fill={ACCENT} stroke={INK} strokeWidth={5} />
          <text x={0} y={-15} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BẠN CÓ TRONG</text>
          <text x={0} y={45} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>DANH SÁCH KHÔNG?</text>
        </g>

        {/* Bottom CTA */}
        <text x={540} y={1740} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>
          👇 SAVE · COMMENT · FOLLOW
        </text>
      </svg>
    </AbsoluteFill>
  );
};
