import { AbsoluteFill } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { SigmaHead } from "./FigureStyles";
import { EmMituOt } from "./CoupleChars";

loadEBGaramond("normal", { weights: ["400","500","600","700"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// Designed thumbnail for ReupNoFear01 — split before/after
// TOP: vợ khổ với CapCut/Adobe lậu
// BOTTOM: chồng smirk + Vibe Editing free stamp
// HOOK: "CHỒNG CƯỜI / CÁC VỢ"

const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E03A2A";
const ACCENT2 = "#E85838";
const GOLD = "#E5A53B";
const SIGMA_SKIN = "#D8C4B0";
const SIGMA_SHADOW = "#7A5838";

export const ReupNoFear01Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="tnGrainNF">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.24 0" />
          </filter>
          <radialGradient id="tnVigNF" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#5A3828" stopOpacity="0.55" />
          </radialGradient>
        </defs>

        {/* BG paper */}
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#tnGrainNF)" />
        <rect width={W} height={H} fill="url(#tnVigNF)" />

        {/* Corner editorial marks */}
        <g stroke={INK} strokeWidth={5}>
          <line x1={60} y1={60} x2={170} y2={60} />
          <line x1={60} y1={60} x2={60} y2={170} />
          <line x1={W-60} y1={60} x2={W-170} y2={60} />
          <line x1={W-60} y1={60} x2={W-60} y2={170} />
          <line x1={60} y1={H-60} x2={170} y2={H-60} />
          <line x1={60} y1={H-60} x2={60} y2={H-170} />
          <line x1={W-60} y1={H-60} x2={W-170} y2={H-60} />
          <line x1={W-60} y1={H-60} x2={W-60} y2={H-170} />
        </g>

        {/* ============ TOP HOOK ============ */}
        <text x={W/2} y={240} fontSize={48} fill={INK} textAnchor="middle"
              fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="14">
          — NẾU VỢ CÒN —
        </text>
        <line x1={W/2 - 140} y1={262} x2={W/2 + 140} y2={262} stroke={INK} strokeWidth={3} />

        {/* ===== TOP PANEL: vợ khổ ===== */}
        <g transform="translate(540, 580)">
          {/* Em cry */}
          <EmMituOt x={-180} y={120} scale={1.3} emotion="cry" phase={0} />

          {/* Laptop with Adobe pirate skull */}
          <g transform="translate(150, 80)">
            <path d="M -150 60 L 150 60 L 165 90 L -165 90 Z" fill="#A0A0A8" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            <rect x={-140} y={-110} width={280} height={180} rx={10} fill="#1A1A22" stroke={INK} strokeWidth={4} />
            <rect x={-130} y={-100} width={260} height={160} rx={4} fill="#0A0A14" />
            <text x={0} y={-72} fontSize={20} fill="#FF3030" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ADOBE CRACKED</text>
            {/* Skull */}
            <g transform="translate(0, -16)">
              <ellipse cx={0} cy={0} rx={28} ry={32} fill="#F0F0F0" stroke="#000" strokeWidth={3} />
              <ellipse cx={-10} cy={-2} rx={6} ry={9} fill="#000" />
              <ellipse cx={10} cy={-2} rx={6} ry={9} fill="#000" />
              <path d="M -3 12 L 3 12 L 5 22 L -5 22 Z" fill="#000" />
              <path d="M -10 28 L -6 34 L 0 30 L 6 34 L 10 28" stroke="#000" strokeWidth={2.5} fill="none" />
            </g>
            <text x={0} y={48} fontSize={16} fill="#FF3030" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>keygen.exe</text>
          </g>

          {/* CapCut watermark to one side */}
          <g transform="translate(280, -120) rotate(-12)">
            <rect x={-80} y={-26} width={160} height={52} rx={8} fill="#000" stroke={ACCENT} strokeWidth={4} />
            <text x={0} y={9} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CapCut ▶</text>
          </g>

          {/* FBI knock - top left, inside frame */}
          <g transform="translate(-160, -200) rotate(-4)">
            <rect x={-130} y={-30} width={260} height={60} rx={12} fill="#FFF8EC" stroke={INK} strokeWidth={4} />
            <text x={0} y={11} fontSize={32} fill={ACCENT2} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FBI! MỞ CỬA!</text>
          </g>

          {/* "RENDER 3 TIẾNG" badge - bottom of top panel, centered horizontally */}
          <g transform="translate(-100, 240)">
            <rect x={-150} y={-26} width={300} height={52} rx={8} fill={ACCENT2} stroke={INK} strokeWidth={4} />
            <text x={0} y={12} fontSize={28} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>RENDER 3 TIẾNG ⏰</text>
          </g>
        </g>

        {/* ============ DIVIDER black diagonal banner ============ */}
        <g>
          <path d={`M 0 ${H/2 + 30} L ${W} ${H/2 - 30} L ${W} ${H/2 + 130} L 0 ${H/2 + 190} Z`} fill={INK} />
          {/* Torn edge top */}
          <path d={`M 0 ${H/2 + 30} L 60 ${H/2 + 24} L 120 ${H/2 + 36} L 200 ${H/2 + 18} L 280 ${H/2 + 30} L 360 ${H/2 + 14} L 440 ${H/2 + 26} L 520 ${H/2 + 8} L 600 ${H/2 + 20} L 680 ${H/2 + 2} L 760 ${H/2 + 14} L 840 ${H/2 - 4} L 920 ${H/2 + 8} L 1000 ${H/2 - 12} L ${W} ${H/2 - 30}`}
                stroke={PAPER} strokeWidth={3} fill="none" />
          <text x={W/2} y={H/2 + 100} fontSize={92} fill={PAPER} textAnchor="middle"
                fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic" letterSpacing="6">
            CÒN CHỒNG?
          </text>
        </g>

        {/* ===== BOTTOM PANEL: Sigma chồng smirk + Vibe Editing ===== */}
        <g transform="translate(540, 1280)">
          {/* Sigma head bigger */}
          <SigmaHead x={-200} y={120} scale={1.3} skinColor={SIGMA_SKIN} hairColor={INK} shadowColor={SIGMA_SHADOW} />

          {/* Smirk emoji */}
          <text x={-80} y={140} fontSize={70}>😏</text>

          {/* Mini laptop showing FREE result */}
          <g transform="translate(180, 100)">
            <path d="M -130 50 L 130 50 L 145 78 L -145 78 Z" fill="#A0A0A8" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            <rect x={-120} y={-100} width={240} height={154} rx={10} fill="#1A1A22" stroke={INK} strokeWidth={4} />
            <rect x={-110} y={-90} width={220} height={134} rx={4} fill="#1A2A1A" />
            <text x={0} y={-60} fontSize={18} fill="#80FF80" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>$ vibe-editing</text>
            <text x={-95} y={-32} fontSize={14} fill="#80FF80" fontFamily="'Be Vietnam Pro', sans-serif">{">>"} TTS done ✓</text>
            <text x={-95} y={-12} fontSize={14} fill="#80FF80" fontFamily="'Be Vietnam Pro', sans-serif">{">>"} render done ✓</text>
            <text x={-95} y={8} fontSize={14} fill="#80FF80" fontFamily="'Be Vietnam Pro', sans-serif">{">>"} subtitle done ✓</text>
            <text x={-95} y={32} fontSize={16} fill="#FFFF80" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>video.mp4 ✨</text>
          </g>

          {/* "FREE" stamp big */}
          <g transform="translate(80, -80) rotate(-15)">
            <rect x={-110} y={-44} width={220} height={88} rx={10} fill="none" stroke={ACCENT} strokeWidth={8} />
            <text x={0} y={20} fontSize={64} fill={ACCENT} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic">FREE</text>
          </g>

          {/* "OPEN SOURCE" badge - centered under both halves */}
          <g transform="translate(-50, 280)">
            <rect x={-160} y={-26} width={320} height={52} rx={10} fill={GOLD} stroke={INK} strokeWidth={4} />
            <text x={0} y={11} fontSize={30} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>OPEN SOURCE · 0 ĐỒNG</text>
          </g>
        </g>

        {/* ============ BIG HOOK BOTTOM ============ */}
        <g transform={`translate(${W/2}, 1760)`}>
          <text x={0} y={0} fontSize={120} fill={INK} textAnchor="middle"
                fontFamily="'EB Garamond', serif" fontWeight={700}>
            VIBE EDITING
          </text>
          <text x={0} y={56} fontSize={36} fill={ACCENT} textAnchor="middle"
                fontFamily="'EB Garamond', serif" fontWeight={600} fontStyle="italic">
            ...repo miễn phí. Chồng yêu các vợ ❤️
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
