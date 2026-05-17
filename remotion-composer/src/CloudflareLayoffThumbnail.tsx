import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadEBGaramond("italic", { weights: ["600", "700"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";
const RED = "#D03020";
const GREEN = "#3FA85A";
const ORANGE = "#F78C40";

export const CloudflareLayoffThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <svg width={W} height={H}>
        <defs>
          <filter id="cfThPN">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="55" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
          </filter>
          <radialGradient id="cfThVig" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#cfThPN)" />
        <rect width={W} height={H} fill="url(#cfThVig)" />

        {/* Top sticker — date + drama */}
        <g transform="translate(540, 150)">
          <rect x={-300} y={-46} width={600} height={92} rx={20} fill={INK} stroke={INK} strokeWidth={3.5} />
          <text x={0} y={14} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>SA THẢI HÀNG LOẠT · 09/05</text>
        </g>

        {/* Big "1.100" with drop shadow */}
        <g transform="translate(540, 460)">
          <text x={0} y={0} fontSize={400} fill={RED} textAnchor="middle" dominantBaseline="middle" fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic"
            style={{ filter: "drop-shadow(0 16px 36px rgba(208,48,32,0.55))" }}>1.100</text>
          <text x={0} y={210} fontSize={64} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nhân viên</text>
        </g>

        {/* Subtitle pill */}
        <g transform="translate(540, 850)">
          <rect x={-460} y={-50} width={920} height={100} rx={50} fill={INK} stroke={INK} strokeWidth={4} />
          <text x={0} y={14} fontSize={36} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BỐC HƠI QUA 1 EMAIL</text>
        </g>

        {/* Brand pill — Cloudflare */}
        <g transform="translate(540, 1010)">
          <rect x={-240} y={-44} width={480} height={88} rx={44} fill={ORANGE} stroke={INK} strokeWidth={4}
            filter="drop-shadow(0 8px 18px rgba(247,140,64,0.5))" />
          <text x={0} y={14} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Cloudflare</text>
        </g>

        {/* Contradiction box: revenue record */}
        <g transform="translate(540, 1230)">
          <rect x={-460} y={-100} width={920} height={200} rx={28} fill={GREEN} stroke={INK} strokeWidth={5}
            filter="drop-shadow(0 12px 26px rgba(63,168,90,0.45))" />
          <text x={0} y={-25} fontSize={32} fill="#E8F5EA" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cùng ngày · báo cáo Q1</text>
          <text x={0} y={45} fontSize={56} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>DOANH THU KỶ LỤC ✓</text>
        </g>

        {/* Verdict */}
        <g transform="translate(540, 1500)">
          <rect x={-460} y={-90} width={920} height={180} rx={28} fill={INK} stroke={ACCENT} strokeWidth={5}
            filter="drop-shadow(0 10px 22px rgba(232,88,56,0.4))" />
          <text x={0} y={-22} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AI THAY ENGINEER</text>
          <text x={0} y={32} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>chưa thay người ký HỢP ĐỒNG</text>
        </g>

        {/* Question CTA */}
        <g transform="translate(540, 1740)">
          <text x={0} y={0} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Job bạn có an toàn? 👀</text>
        </g>

        {/* Bottom CTA */}
        <text x={540} y={1860} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.65}>
          ↓ Theo dõi · tin AI nóng nhất
        </text>
      </svg>
    </AbsoluteFill>
  );
};
