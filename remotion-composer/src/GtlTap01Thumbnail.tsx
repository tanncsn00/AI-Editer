import { AbsoluteFill } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadEBGaramond("normal", { weights: ["500","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// Blueprint chalk thumbnail for Giải Thích Kiểu Lười Tập 1

const W = 1080;
const H = 1920;
const BG_DEEP = "#050E1E";
const BG_MID = "#0A1838";
const BG_GLOW = "#1E4878";
const CHALK = "#F5F7FA";
const YELLOW = "#FFD93D";
const RED = "#FF5542";

export const GtlTap01Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="tnGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={BG_GLOW} stopOpacity="1" />
            <stop offset="55%" stopColor={BG_MID} stopOpacity="1" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="1" />
          </radialGradient>
          <filter id="tnChalkGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="tnGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="5" />
            <feColorMatrix values="0 0 0 0 0.95  0 0 0 0 0.97  0 0 0 0 1  0 0 0 0.1 0" />
          </filter>
          <radialGradient id="tnVig" cx="50%" cy="50%" r="75%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
          </radialGradient>
        </defs>

        {/* BG */}
        <rect width={W} height={H} fill={BG_DEEP} />
        <rect width={W} height={H} fill="url(#tnGlow)" />

        {/* Top branding */}
        <text
          x={W/2}
          y={230}
          fontSize={44}
          fill={YELLOW}
          textAnchor="middle"
          fontFamily="'Be Vietnam Pro', sans-serif"
          fontWeight={800}
          letterSpacing="4"
          stroke={RED}
          strokeWidth={2}
          paintOrder="stroke"
        >
          GIẢI THÍCH KIỂU LƯỜI
        </text>
        <line x1={W/2 - 200} y1={258} x2={W/2 + 200} y2={258} stroke={CHALK} strokeWidth={2} opacity={0.6} />

        {/* BIG HOOK — "5 BẪY TIỀN" */}
        <g filter="url(#tnChalkGlow)">
          <text
            x={W/2}
            y={500}
            fontSize={220}
            fill={YELLOW}
            textAnchor="middle"
            fontFamily="'EB Garamond', serif"
            fontWeight={800}
            stroke={RED}
            strokeWidth={5}
            paintOrder="stroke"
          >
            5
          </text>
          <text
            x={W/2}
            y={650}
            fontSize={108}
            fill={CHALK}
            textAnchor="middle"
            fontFamily="'EB Garamond', serif"
            fontWeight={700}
            letterSpacing="4"
          >
            BẪY TIỀN
          </text>
        </g>

        {/* Sub banner */}
        <rect x={W/2 - 300} y={720} width={600} height={80} fill={RED} stroke={CHALK} strokeWidth={4} />
        <text
          x={W/2}
          y={775}
          fontSize={46}
          fill={CHALK}
          textAnchor="middle"
          fontFamily="'Be Vietnam Pro', sans-serif"
          fontWeight={800}
          letterSpacing="4"
        >
          AI CŨNG MẮC
        </text>

        {/* Central illustration — ATM / Wallet scene */}
        <g filter="url(#tnChalkGlow)" stroke={CHALK} strokeLinecap="round" strokeLinejoin="round">
          {/* Floor */}
          <line x1={120} y1={1520} x2={W - 120} y2={1520} strokeWidth={4} />

          {/* ATM on left */}
          <g transform="translate(260, 1200)">
            <rect x={-90} y={-180} width={180} height={340} fill="none" strokeWidth={4} />
            <rect x={-70} y={-160} width={140} height={90} fill="none" strokeWidth={3} />
            <text x={0} y={-110} fontSize={20} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>SỐ DƯ</text>
            <text x={0} y={-76} fontSize={36} fill={RED} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={800}>0 đ</text>
            {/* Keypad */}
            {[0, 1, 2].map(r =>
              [0, 1, 2].map(c => (
                <rect key={`${r}-${c}`} x={-50 + c * 34} y={-40 + r * 34} width={24} height={22} fill="none" strokeWidth={2} />
              ))
            )}
            <rect x={-70} y={70} width={140} height={10} fill="none" strokeWidth={2.5} />
          </g>

          {/* Character in middle — Cục Gạch */}
          <g transform="translate(560, 1440)">
            {/* Head */}
            <circle cx={0} cy={-140} r={32} fill="none" strokeWidth={5} />
            {/* Glasses */}
            <rect x={-22} y={-148} width={16} height={14} fill="none" strokeWidth={3} />
            <rect x={6} y={-148} width={16} height={14} fill="none" strokeWidth={3} />
            <line x1={-6} y1={-141} x2={6} y2={-141} strokeWidth={2} />
            {/* Hair */}
            <line x1={-14} y1={-172} x2={-14} y2={-180} strokeWidth={3} />
            <line x1={0} y1={-174} x2={0} y2={-182} strokeWidth={3} />
            <line x1={14} y1={-172} x2={14} y2={-180} strokeWidth={3} />
            {/* Mouth surprised */}
            <ellipse cx={0} cy={-118} rx={5} ry={7} fill={CHALK} />
            {/* Body */}
            <line x1={0} y1={-100} x2={0} y2={0} strokeWidth={5} />
            {/* Arms — hands up panic */}
            <line x1={0} y1={-70} x2={-44} y2={-100} strokeWidth={5} />
            <line x1={0} y1={-70} x2={44} y2={-100} strokeWidth={5} />
            {/* Legs */}
            <line x1={0} y1={0} x2={-22} y2={80} strokeWidth={5} />
            <line x1={0} y1={0} x2={22} y2={80} strokeWidth={5} />
            {/* Question marks around head */}
            <text x={-60} y={-160} fontSize={40} fill={YELLOW} fontFamily="'EB Garamond', serif" fontWeight={800}>?</text>
            <text x={54} y={-170} fontSize={50} fill={YELLOW} fontFamily="'EB Garamond', serif" fontWeight={800}>?</text>
          </g>

          {/* Money flying away top right */}
          {[[780, 1100, -20], [880, 1050, 15], [940, 1180, -10], [840, 1250, 20]].map(([mx, my, r], i) => (
            <g key={i} transform={`translate(${mx}, ${my}) rotate(${r})`}>
              <rect x={-28} y={-16} width={56} height={32} fill="none" strokeWidth={3} />
              <text x={0} y={7} fontSize={22} fill={YELLOW} textAnchor="middle" fontWeight="bold">$</text>
              {/* Fly arrows */}
              <line x1={0} y1={-24} x2={-8} y2={-44} strokeWidth={2} opacity={0.7} />
              <line x1={-8} y1={-44} x2={-14} y2={-38} strokeWidth={2} opacity={0.7} />
            </g>
          ))}
        </g>

        {/* Chalk grain */}
        <rect width={W} height={H} filter="url(#tnGrain)" opacity={0.4} />
        {/* Vignette */}
        <rect width={W} height={H} fill="url(#tnVig)" />

        {/* Bottom quote */}
        <rect x={80} y={H - 260} width={W - 160} height={160} fill="none" stroke={YELLOW} strokeWidth={4} strokeDasharray="14 8" />
        <text
          x={W/2}
          y={H - 190}
          fontSize={30}
          fill={CHALK}
          textAnchor="middle"
          fontFamily="'EB Garamond', serif"
          fontStyle="italic"
          opacity={0.85}
        >
          bạn nghĩ là...
        </text>
        <text
          x={W/2}
          y={H - 130}
          fontSize={62}
          fill={YELLOW}
          textAnchor="middle"
          fontFamily="'EB Garamond', serif"
          fontWeight={800}
          fontStyle="italic"
          stroke={RED}
          strokeWidth={2}
          paintOrder="stroke"
        >
          "chỉ một ít"
        </text>
      </svg>
    </AbsoluteFill>
  );
};
