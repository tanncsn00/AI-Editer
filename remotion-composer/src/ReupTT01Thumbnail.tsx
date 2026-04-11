import { AbsoluteFill } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadEBGaramond("normal", { weights: ["400","500","600","700"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// Designed thumbnail for ReupTT01 "Tưởng Là Vậy"
// Split screen before/after + hook text

const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E03A2A";
const GOLD = "#E5A53B";

export const ReupTT01Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="tnGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="5" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.24 0" />
          </filter>
          <radialGradient id="tnVig" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#5A3828" stopOpacity="0.55" />
          </radialGradient>
        </defs>

        {/* BG paper */}
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#tnGrain)" />
        <rect width={W} height={H} fill="url(#tnVig)" />

        {/* Corner marks editorial frame */}
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
        <text x={W/2} y={260} fontSize={52} fill={INK} textAnchor="middle"
              fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} letterSpacing="14">
          — TƯỞNG LÀ —
        </text>
        <line x1={W/2 - 140} y1={285} x2={W/2 + 140} y2={285} stroke={INK} strokeWidth={3} />

        {/* Son helps old dad (expected) */}
        <g transform="translate(540, 520)">
          {/* Old dad */}
          <g transform="translate(-90, 0)">
            <circle cx={0} cy={-70} r={36} fill="#F8E0D0" stroke={INK} strokeWidth={5} />
            <path d="M -30 -92 Q 0 -108 30 -92 L 30 -78 L -30 -78 Z" fill="#888" />
            <path d="M -18 -72 L -10 -72" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
            <path d="M 10 -72 L 18 -72" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
            <path d="M -8 -58 Q 0 -52 8 -58" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
            {/* Body */}
            <rect x={-28} y={-36} width={56} height={80} fill="#7A6A5A" stroke={INK} strokeWidth={5} />
            {/* Cane */}
            <line x1={40} y1={-20} x2={54} y2={100} stroke="#6A4828" strokeWidth={7} strokeLinecap="round" />
            <path d="M 36 -26 Q 32 -32 40 -36" stroke="#6A4828" strokeWidth={7} fill="none" strokeLinecap="round" />
          </g>
          {/* Son strong helping */}
          <g transform="translate(90, 0)">
            <circle cx={0} cy={-72} r={32} fill="#F8E0D0" stroke={INK} strokeWidth={5} />
            <path d="M -28 -100 Q 0 -118 28 -98" fill="#1A1A22" />
            <circle cx={-10} cy={-72} r={3} fill={INK} />
            <circle cx={10} cy={-72} r={3} fill={INK} />
            <path d="M -8 -58 Q 0 -52 8 -58" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
            {/* Strong body V shape */}
            <path d="M -40 -40 L -46 20 L -24 52 L 24 52 L 46 20 L 40 -40 Q 24 -50 0 -50 Q -24 -50 -40 -40 Z"
                  fill="#5070A8" stroke={INK} strokeWidth={5} />
            {/* Flexed arm reaching to dad */}
            <path d="M -40 -30 Q -72 -40 -86 -20" stroke="#F8E0D0" strokeWidth={16} fill="none" strokeLinecap="round" />
            <path d="M -40 -30 Q -72 -40 -86 -20" stroke={INK} strokeWidth={3} fill="none" />
            <circle cx={-86} cy={-20} r={8} fill="#F8E0D0" stroke={INK} strokeWidth={3} />
          </g>
          {/* Heart between */}
          <path d="M -5 -90 Q -18 -110 -24 -96 Q -24 -80 0 -66 Q 24 -80 24 -96 Q 18 -110 5 -90 Z"
                fill="#E03A2A" stroke={INK} strokeWidth={3} transform="translate(0 30)" />
        </g>

        {/* ============ SLASH DIVIDER ============ */}
        {/* Diagonal torn strip */}
        <path d={`M 0 800 L ${W} 840 L ${W} 920 L 0 880 Z`} fill={INK} />
        <text x={W/2} y={895} fontSize={78} fill={PAPER} textAnchor="middle"
              fontFamily="'EB Garamond', serif" fontWeight={700} letterSpacing="12" fontStyle="italic">
          HÓA RA...
        </text>

        {/* ============ BOTTOM PUNCHLINE ============ */}
        {/* Scene: fat son on old dad's head */}
        <g transform="translate(540, 1250)">
          {/* Old dad — tired, bent */}
          <g transform="translate(0, 80)">
            {/* Legs */}
            <path d="M -26 180 Q -30 240 -28 300" stroke="#F8E0D0" strokeWidth={32} strokeLinecap="round" fill="none" />
            <path d="M 26 180 Q 30 240 28 300" stroke="#F8E0D0" strokeWidth={32} strokeLinecap="round" fill="none" />
            <path d="M -26 180 Q -30 240 -28 300" stroke={INK} strokeWidth={4} fill="none" />
            <path d="M 26 180 Q 30 240 28 300" stroke={INK} strokeWidth={4} fill="none" />
            <ellipse cx={-28} cy={306} rx={18} ry={6} fill={INK} />
            <ellipse cx={28} cy={306} rx={18} ry={6} fill={INK} />
            {/* Body tired trapezoid */}
            <path d="M -62 -30 Q -70 -10 -64 12 L -52 100 Q -48 150 -38 180 L 38 180 Q 48 150 52 100 L 64 12 Q 70 -10 62 -30 Q 48 -48 0 -48 Q -48 -48 -62 -30 Z"
                  fill="#7A6A5A" stroke={INK} strokeWidth={5} />
            {/* Arms up holding son on head */}
            <path d="M -62 -20 Q -80 -56 -68 -100" stroke="#F8E0D0" strokeWidth={24} fill="none" strokeLinecap="round" />
            <path d="M 62 -20 Q 80 -56 68 -100" stroke="#F8E0D0" strokeWidth={24} fill="none" strokeLinecap="round" />
            <path d="M -62 -20 Q -80 -56 -68 -100" stroke={INK} strokeWidth={4} fill="none" />
            <path d="M 62 -20 Q 80 -56 68 -100" stroke={INK} strokeWidth={4} fill="none" />
            {/* Head */}
            <circle cx={0} cy={-80} r={36} fill="#F8E0D0" stroke={INK} strokeWidth={5} />
            {/* Grey hair */}
            <path d="M -30 -100 Q -24 -122 0 -116 Q 24 -122 30 -100 L 30 -88 L -30 -88 Z" fill="#888" />
            {/* Eye bags */}
            <path d="M -18 -82 Q -10 -76 -2 -82" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d="M 2 -82 Q 10 -76 18 -82" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d="M -16 -74 Q -10 -68 -4 -74" stroke={INK} strokeWidth={2} fill="none" opacity={0.55} />
            <path d="M 4 -74 Q 10 -68 16 -74" stroke={INK} strokeWidth={2} fill="none" opacity={0.55} />
            {/* Tired mouth */}
            <path d="M -8 -60 L 8 -60" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
            {/* Sweat */}
            <path d="M -38 -92 Q -44 -80 -40 -72 Q -32 -80 -38 -92 Z" fill="#A8D0E8" stroke={INK} strokeWidth={2.5} />
            <path d="M 38 -94 Q 44 -82 40 -74 Q 32 -82 38 -94 Z" fill="#A8D0E8" stroke={INK} strokeWidth={2.5} />
          </g>

          {/* Big fat son on head */}
          <g transform="translate(0, -130)">
            <ellipse cx={0} cy={50} rx={80} ry={38} fill="#B8D878" stroke={INK} strokeWidth={5} />
            <ellipse cx={0} cy={0} rx={65} ry={62} fill="#B8D878" stroke={INK} strokeWidth={5} />
            <circle cx={0} cy={-60} r={40} fill="#F8E0D0" stroke={INK} strokeWidth={5} />
            {/* Hair */}
            <path d="M -28 -84 Q -18 -108 -6 -90 Q 6 -112 18 -94 Q 30 -104 32 -80" fill="#1A1A22" />
            {/* Phone */}
            <g transform="translate(48, 20) rotate(-12)">
              <rect x={-18} y={-30} width={36} height={58} rx={5} fill="#1A1A22" stroke={INK} strokeWidth={3} />
              <rect x={-14} y={-24} width={28} height={44} fill="#7CB8F0" />
              <circle cx={-4} cy={-12} r={2} fill="#FFF" />
              <circle cx={6} cy={-4} r={2} fill="#FFF" />
              <circle cx={-2} cy={6} r={2} fill="#FFF" />
            </g>
            {/* Arm holding phone */}
            <line x1={0} y1={10} x2={40} y2={16} stroke="#F8E0D0" strokeWidth={14} strokeLinecap="round" />
            <line x1={0} y1={10} x2={40} y2={16} stroke={INK} strokeWidth={3} />
            {/* Eyes looking at phone (down-right) */}
            <path d="M -14 -60 Q -9 -54 -4 -60" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
            <path d="M 4 -60 Q 9 -54 14 -60" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
            {/* Smile smug */}
            <path d="M -8 -42 Q 0 -36 8 -42" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
          </g>

          {/* Speech bubble */}
          <g transform="translate(190, -230)">
            <path d="M -40 48 L -70 92 L 10 48 Z" fill="#FFF8EC" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
            <rect x={-210} y={-52} width={420} height={108} rx={50} fill="#FFF8EC" stroke={INK} strokeWidth={5} />
            <foreignObject x={-200} y={-46} width={400} height={96}>
              <div
                // @ts-expect-error xmlns for HTML in SVG
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontWeight: 800,
                  fontSize: 46,
                  color: INK,
                  lineHeight: 1.1,
                  letterSpacing: "1px",
                }}
              >
                BỐ ƠI NẠP TIỀN 💸
              </div>
            </foreignObject>
          </g>
        </g>

        {/* ============ BOTTOM HOOK TEXT ============ */}
        <rect x={80} y={H - 320} width={W - 160} height={220} rx={14} fill={ACCENT} stroke={INK} strokeWidth={6} />
        <rect x={86} y={H - 326} width={W - 160} height={220} rx={14} fill="#FFE4D8" stroke={INK} strokeWidth={6} />
        <text x={W/2} y={H - 210} fontSize={92} fill={INK} textAnchor="middle"
              fontFamily="'EB Garamond', serif" fontWeight={700} letterSpacing="2">
          VỀ GIÀ
        </text>
        <text x={W/2} y={H - 140} fontSize={46} fill={ACCENT} textAnchor="middle"
              fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">
          ...NUÔI NGƯỢC THẰNG CON
        </text>
      </svg>
    </AbsoluteFill>
  );
};
