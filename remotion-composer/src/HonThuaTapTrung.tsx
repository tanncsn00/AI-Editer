import { AbsoluteFill } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadEBGaramond("normal", { weights: ["500","600","700"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// HƠN THUA | TẬP TRUNG — split comparison infographic
// Inspired by reference image, stylized as line-art cartoon

const W = 1080;
const H = 1920;
const INK = "#1A1820";
const RED_BG = "#4A1418";
const RED_ACCENT = "#E03A2A";
const RED_LIGHT = "#F8D0C0";
const BLUE_BG = "#0E2238";
const BLUE_ACCENT = "#4A8AC8";
const BLUE_LIGHT = "#C8E0F0";
const SKIN = "#F0C8A8";
const SKIN_ANGRY = "#E88070";

// ================================================================
// ANGRY MAN — left side
// ================================================================
const AngryMan: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Desk */}
    <rect x={-180} y={180} width={360} height={30} fill="#6A4828" stroke={INK} strokeWidth={5} />
    <rect x={-170} y={210} width={16} height={120} fill="#6A4828" stroke={INK} strokeWidth={4} />
    <rect x={154} y={210} width={16} height={120} fill="#6A4828" stroke={INK} strokeWidth={4} />
    {/* Flying papers */}
    <g transform="translate(-100, 140) rotate(-15)">
      <rect x={-30} y={-20} width={60} height={50} fill="#F5F0E0" stroke={INK} strokeWidth={4} />
      <line x1={-20} y1={-10} x2={20} y2={-10} stroke={INK} strokeWidth={2} />
      <line x1={-20} y1={0} x2={15} y2={0} stroke={INK} strokeWidth={2} />
      <line x1={-20} y1={10} x2={18} y2={10} stroke={INK} strokeWidth={2} />
    </g>
    <g transform="translate(80, 120) rotate(24)">
      <rect x={-30} y={-20} width={60} height={50} fill="#F5F0E0" stroke={INK} strokeWidth={4} />
      <line x1={-20} y1={-10} x2={20} y2={-10} stroke={INK} strokeWidth={2} />
      <line x1={-20} y1={0} x2={15} y2={0} stroke={INK} strokeWidth={2} />
    </g>
    <g transform="translate(40, 180) rotate(-8)">
      <rect x={-25} y={-18} width={50} height={40} fill="#F5F0E0" stroke={INK} strokeWidth={3} />
    </g>

    {/* Body — leaning aggressively forward */}
    <g transform="translate(0, 0)">
      {/* Arms open aggressively */}
      <path d="M -70 20 Q -130 0 -150 -40" stroke={SKIN_ANGRY} strokeWidth={26} strokeLinecap="round" fill="none" />
      <path d="M 70 20 Q 130 0 150 -40" stroke={SKIN_ANGRY} strokeWidth={26} strokeLinecap="round" fill="none" />
      <path d="M -70 20 Q -130 0 -150 -40" stroke={INK} strokeWidth={4} fill="none" />
      <path d="M 70 20 Q 130 0 150 -40" stroke={INK} strokeWidth={4} fill="none" />
      {/* Fists clenched */}
      <circle cx={-150} cy={-40} r={14} fill={SKIN_ANGRY} stroke={INK} strokeWidth={4} />
      <circle cx={150} cy={-40} r={14} fill={SKIN_ANGRY} stroke={INK} strokeWidth={4} />

      {/* Torso — dress shirt */}
      <path d="M -65 -30
               Q -75 0 -68 30
               L -58 150
               Q -30 190 0 190
               Q 30 190 58 150
               L 68 30
               Q 75 0 65 -30
               Q 40 -50 0 -50
               Q -40 -50 -65 -30 Z"
            fill="#E8E4DE" stroke={INK} strokeWidth={5} />
      {/* Tie - red (angry) */}
      <path d="M -8 -46 L 8 -46 L 12 -30 L 8 -14 L 12 0 L 8 14 L 12 28 L 8 42 L 14 56 L -2 100 L -14 56 L -8 42 L -12 28 L -8 14 L -12 0 L -8 -14 L -12 -30 Z"
            fill={RED_ACCENT} stroke={INK} strokeWidth={3} />
      {/* Shirt buttons */}
      <circle cx={-18} cy={0} r={2} fill={INK} />
      <circle cx={-20} cy={30} r={2} fill={INK} />
      {/* Belt */}
      <rect x={-58} y={140} width={116} height={14} fill={INK} />
      <rect x={-6} y={142} width={12} height={10} fill="#C8A050" />
    </g>

    {/* Neck */}
    <path d="M -18 -60 L -22 -85 L 22 -85 L 18 -60 Z" fill={SKIN_ANGRY} stroke={INK} strokeWidth={4} />

    {/* Head — red angry */}
    <g transform="translate(0, -120)">
      <ellipse cx={0} cy={0} rx={42} ry={48} fill={SKIN_ANGRY} stroke={INK} strokeWidth={5} />
      {/* Hair messy */}
      <path d="M -38 -30 Q -44 -60 -20 -58 Q 0 -66 20 -58 Q 44 -60 38 -30 Q 30 -46 12 -42 Q 0 -52 -12 -42 Q -30 -46 -38 -30 Z"
            fill="#2A1A10" />
      {/* Stray angry spikes */}
      <path d="M -30 -48 L -32 -62" stroke="#2A1A10" strokeWidth={4} strokeLinecap="round" />
      <path d="M 0 -58 L 2 -72" stroke="#2A1A10" strokeWidth={4} strokeLinecap="round" />
      <path d="M 28 -50 L 32 -62" stroke="#2A1A10" strokeWidth={4} strokeLinecap="round" />
      {/* Eyebrows super angry */}
      <path d="M -32 -18 L -10 -10 L -10 -4 L -30 -12 Z" fill={INK} />
      <path d="M 32 -18 L 10 -10 L 10 -4 L 30 -12 Z" fill={INK} />
      {/* Eyes wide red */}
      <ellipse cx={-16} cy={2} rx={9} ry={7} fill="#FFF" stroke={INK} strokeWidth={3} />
      <ellipse cx={16} cy={2} rx={9} ry={7} fill="#FFF" stroke={INK} strokeWidth={3} />
      <circle cx={-16} cy={3} r={4} fill={INK} />
      <circle cx={16} cy={3} r={4} fill={INK} />
      {/* Eye veins */}
      <path d="M -24 0 L -20 2" stroke={RED_ACCENT} strokeWidth={1.5} />
      <path d="M 24 0 L 20 2" stroke={RED_ACCENT} strokeWidth={1.5} />
      {/* Nose */}
      <path d="M -4 10 L -6 22 L 0 26 L 6 22 L 4 10" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* Mouth yelling open */}
      <ellipse cx={0} cy={34} rx={18} ry={14} fill="#4A0A10" stroke={INK} strokeWidth={4} />
      <rect x={-12} y={22} width={24} height={5} fill="#FFF" stroke={INK} strokeWidth={1.5} />
      {/* Teeth */}
      <line x1={-8} y1={24} x2={-8} y2={27} stroke={INK} strokeWidth={1} />
      <line x1={0} y1={24} x2={0} y2={27} stroke={INK} strokeWidth={1} />
      <line x1={8} y1={24} x2={8} y2={27} stroke={INK} strokeWidth={1} />
      {/* Anger vein on temple */}
      <path d="M 40 -12 L 46 -20 L 52 -10 L 46 -2 Z" fill={RED_ACCENT} stroke={INK} strokeWidth={2.5} />
      {/* Sweat */}
      <path d="M -38 -20 Q -44 -10 -40 -2 Q -34 -10 -38 -20 Z" fill="#A8D0E8" stroke={INK} strokeWidth={2} />
    </g>

    {/* Rage aura lines around head */}
    <g stroke={RED_ACCENT} strokeWidth={4} strokeLinecap="round" fill="none">
      <line x1={-70} y1={-160} x2={-85} y2={-175} />
      <line x1={-40} y1={-200} x2={-45} y2={-220} />
      <line x1={0} y1={-210} x2={0} y2={-232} />
      <line x1={40} y1={-200} x2={45} y2={-220} />
      <line x1={70} y1={-160} x2={85} y2={-175} />
    </g>

    {/* Speech burst "?!!" */}
    <text x={0} y={-210} fontSize={40} fill={RED_ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>?!!</text>
  </g>
);

// ================================================================
// CALM MAN — right side
// ================================================================
const CalmMan: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* Desk */}
    <rect x={-180} y={180} width={360} height={30} fill="#5A7088" stroke={INK} strokeWidth={5} />
    <rect x={-170} y={210} width={16} height={120} fill="#5A7088" stroke={INK} strokeWidth={4} />
    <rect x={154} y={210} width={16} height={120} fill="#5A7088" stroke={INK} strokeWidth={4} />

    {/* Monitor */}
    <g transform="translate(0, 70)">
      <rect x={-110} y={-20} width={220} height={130} rx={6} fill="#1A2838" stroke={INK} strokeWidth={5} />
      <rect x={-100} y={-10} width={200} height={110} fill="#0A1828" />
      {/* Code lines on screen */}
      <g stroke={BLUE_ACCENT} strokeWidth={2}>
        <line x1={-92} y1={0} x2={-30} y2={0} />
        <line x1={-26} y1={0} x2={10} y2={0} />
        <line x1={-92} y1={14} x2={-50} y2={14} />
        <line x1={-46} y1={14} x2={30} y2={14} />
        <line x1={-92} y1={28} x2={-10} y2={28} />
        <line x1={-6} y1={28} x2={40} y2={28} />
        <line x1={-92} y1={42} x2={-40} y2={42} />
        <line x1={-36} y1={42} x2={50} y2={42} />
        <line x1={-92} y1={56} x2={-60} y2={56} />
        <line x1={-56} y1={56} x2={20} y2={56} />
        <line x1={-92} y1={70} x2={-20} y2={70} />
        <line x1={-16} y1={70} x2={60} y2={70} />
        <line x1={-92} y1={84} x2={-50} y2={84} />
      </g>
      {/* Progress bar */}
      <rect x={-90} y={92} width={180} height={6} fill="#2A4060" />
      <rect x={-90} y={92} width={120} height={6} fill={BLUE_ACCENT} />
      {/* Stand */}
      <rect x={-12} y={110} width={24} height={20} fill="#4A6078" stroke={INK} strokeWidth={3} />
      <rect x={-40} y={130} width={80} height={8} fill="#4A6078" stroke={INK} strokeWidth={3} />
    </g>

    {/* Body — sitting calm */}
    <g>
      {/* Arms on keyboard */}
      <path d="M -60 40 Q -85 80 -70 130" stroke={BLUE_ACCENT} strokeWidth={22} strokeLinecap="round" fill="none" />
      <path d="M 60 40 Q 85 80 70 130" stroke={BLUE_ACCENT} strokeWidth={22} strokeLinecap="round" fill="none" />
      <path d="M -60 40 Q -85 80 -70 130" stroke={INK} strokeWidth={4} fill="none" />
      <path d="M 60 40 Q 85 80 70 130" stroke={INK} strokeWidth={4} fill="none" />
      {/* Hands on keyboard */}
      <rect x={-90} y={128} width={40} height={20} rx={4} fill={SKIN} stroke={INK} strokeWidth={3} />
      <rect x={50} y={128} width={40} height={20} rx={4} fill={SKIN} stroke={INK} strokeWidth={3} />
      {/* Keyboard */}
      <rect x={-70} y={148} width={140} height={30} rx={4} fill="#2A3848" stroke={INK} strokeWidth={4} />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={-62 + i * 13} y={153} width={10} height={8} fill="#4A5868" />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={`r${i}`} x={-62 + i * 13} y={164} width={10} height={8} fill="#4A5868" />
      ))}

      {/* Torso — hoodie/shirt */}
      <path d="M -58 -30 Q -68 0 -62 28 L -52 140 Q -30 180 0 180 Q 30 180 52 140 L 62 28 Q 68 0 58 -30 Q 38 -48 0 -48 Q -38 -48 -58 -30 Z"
            fill={BLUE_ACCENT} stroke={INK} strokeWidth={5} />
      {/* Hood outline */}
      <path d="M -50 -40 Q -60 -30 -58 -10 L -40 -4 Q -30 -20 0 -24 Q 30 -20 40 -4 L 58 -10 Q 60 -30 50 -40 Q 25 -54 0 -54 Q -25 -54 -50 -40 Z"
            fill="#3A7098" stroke={INK} strokeWidth={4} opacity={0.75} />
    </g>

    {/* Neck */}
    <path d="M -14 -58 L -16 -80 L 16 -80 L 14 -58 Z" fill={SKIN} stroke={INK} strokeWidth={4} />

    {/* Head — calm */}
    <g transform="translate(0, -120)">
      <ellipse cx={0} cy={0} rx={40} ry={46} fill={SKIN} stroke={INK} strokeWidth={5} />
      {/* Hair neat */}
      <path d="M -36 -28 Q -42 -56 -16 -60 Q 0 -66 16 -60 Q 42 -56 36 -28 L 32 -20 Q 20 -34 0 -30 Q -20 -34 -32 -20 Z"
            fill="#1A1A22" />
      {/* Headphones - big over-ear */}
      <path d="M -42 -34 Q -50 -66 0 -70 Q 50 -66 42 -34" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
      <ellipse cx={-46} cy={-8} rx={12} ry={18} fill={BLUE_BG} stroke={INK} strokeWidth={4} />
      <ellipse cx={46} cy={-8} rx={12} ry={18} fill={BLUE_BG} stroke={INK} strokeWidth={4} />
      <ellipse cx={-46} cy={-8} rx={7} ry={11} fill="#2A3848" stroke={INK} strokeWidth={2} />
      <ellipse cx={46} cy={-8} rx={7} ry={11} fill="#2A3848" stroke={INK} strokeWidth={2} />
      {/* Eyebrows neutral */}
      <path d="M -24 -18 Q -16 -22 -10 -18" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M 10 -18 Q 16 -22 24 -18" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {/* Eyes focused */}
      <path d="M -22 -4 Q -16 -8 -10 -4 L -12 0 Q -16 -2 -20 0 Z" fill={INK} />
      <path d="M 10 -4 Q 16 -8 22 -4 L 20 0 Q 16 -2 12 0 Z" fill={INK} />
      {/* Nose */}
      <path d="M -3 6 L -5 18 L 0 22 L 5 18 L 3 6" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {/* Mouth calm small */}
      <path d="M -6 30 Q 0 34 6 30" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
    </g>

    {/* Calm aura — soft glow radiating */}
    <g stroke={BLUE_LIGHT} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.55}>
      <circle cx={0} cy={-120} r={90} strokeDasharray="6 10" />
      <circle cx={0} cy={-120} r={120} strokeDasharray="4 14" />
    </g>
  </g>
);

// ================================================================
// SMALL ANGRY HEAD (3x background heads shouting)
// ================================================================
const YellingHead: React.FC<{ x: number; y: number; scale: number; pointAt: "left" | "right" }> = ({ x, y, scale, pointAt }) => {
  const flip = pointAt === "right" ? 1 : -1;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * flip}, ${scale})`}>
      {/* Head */}
      <circle cx={0} cy={0} r={24} fill="#F0C8A8" stroke={INK} strokeWidth={4} />
      {/* Hair */}
      <path d="M -22 -14 Q -28 -34 -6 -32 Q 4 -38 16 -34 Q 26 -32 22 -14 Q 16 -22 6 -20 Q -4 -26 -14 -20 Z" fill="#2A1A10" />
      {/* Angry brows */}
      <path d="M -18 -8 L -4 -6 L -4 -2 L -18 -4 Z" fill={INK} />
      <path d="M 18 -8 L 4 -6 L 4 -2 L 18 -4 Z" fill={INK} />
      {/* Eyes */}
      <circle cx={-10} cy={3} r={2.5} fill={INK} />
      <circle cx={10} cy={3} r={2.5} fill={INK} />
      {/* Mouth yelling */}
      <ellipse cx={0} cy={12} rx={6} ry={6} fill="#4A0A10" stroke={INK} strokeWidth={2} />
      {/* Pointing finger */}
      <g transform="translate(20, 6)">
        <path d="M 0 0 L 30 -4 L 32 2 L 0 6 Z" fill={SKIN} stroke={INK} strokeWidth={3} />
        <circle cx={0} cy={3} r={7} fill={SKIN} stroke={INK} strokeWidth={3} />
      </g>
      {/* Speech lines */}
      <g stroke={RED_ACCENT} strokeWidth={2.5} strokeLinecap="round" fill="none">
        <line x1={30} y1={-20} x2={40} y2={-26} />
        <line x1={36} y1={-12} x2={48} y2={-14} />
      </g>
    </g>
  );
};

// ================================================================
// MAIN
// ================================================================
export const HonThuaTapTrung: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="grainHTTT">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.25 0" />
          </filter>
          <linearGradient id="bgLeft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7A2028" />
            <stop offset="100%" stopColor={RED_BG} />
          </linearGradient>
          <linearGradient id="bgRight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3A58" />
            <stop offset="100%" stopColor={BLUE_BG} />
          </linearGradient>
          <radialGradient id="spotL" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#E04830" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#E04830" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="spotR" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#6AA8D8" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#6AA8D8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ============ TOP LABEL BAR ============ */}
        <rect x={0} y={0} width={W/2} height={260} fill="url(#bgLeft)" />
        <rect x={W/2} y={0} width={W/2} height={260} fill="url(#bgRight)" />
        <text x={W/4} y={150} fontSize={84} fill="#FFFFFF" textAnchor="middle"
              fontFamily="'EB Garamond', serif" fontWeight={700} letterSpacing="6">HƠN THUA</text>
        <text x={3*W/4} y={150} fontSize={84} fill="#FFFFFF" textAnchor="middle"
              fontFamily="'EB Garamond', serif" fontWeight={700} letterSpacing="6">TẬP TRUNG</text>
        {/* Divider white */}
        <line x1={W/2} y1={0} x2={W/2} y2={H} stroke="#FFFFFF" strokeWidth={6} />

        {/* ============ LEFT PANEL — HƠN THUA ============ */}
        <g>
          <rect x={0} y={260} width={W/2} height={1300} fill="url(#bgLeft)" />
          <rect x={0} y={260} width={W/2} height={1300} fill="url(#spotL)" />

          {/* 3 yelling heads top background */}
          <YellingHead x={80} y={360} scale={1.4} pointAt="right" />
          <YellingHead x={160} y={480} scale={1.2} pointAt="right" />
          <YellingHead x={90} y={600} scale={1.3} pointAt="right" />

          {/* Angry man center */}
          <AngryMan x={W/4 + 60} y={1100} />

          {/* Grain */}
        </g>

        {/* ============ RIGHT PANEL — TẬP TRUNG ============ */}
        <g>
          <rect x={W/2} y={260} width={W/2} height={1300} fill="url(#bgRight)" />
          <rect x={W/2} y={260} width={W/2} height={1300} fill="url(#spotR)" />

          {/* 3 yelling heads top, same angry but aimed at calm man */}
          <YellingHead x={1000} y={360} scale={1.4} pointAt="left" />
          <YellingHead x={920} y={480} scale={1.2} pointAt="left" />
          <YellingHead x={990} y={600} scale={1.3} pointAt="left" />

          {/* Calm man center */}
          <CalmMan x={3*W/4 - 60} y={1100} />
        </g>

        {/* Grain overlay */}
        <rect width={W} height={H} filter="url(#grainHTTT)" opacity={0.35} />

        {/* ============ BOTTOM CAPTION BOXES ============ */}
        <rect x={0} y={1560} width={W/2} height={360} fill="#2A0C10" />
        <rect x={W/2} y={1560} width={W/2} height={360} fill="#080C18" />

        {/* Left caption */}
        <foreignObject x={40} y={1620} width={W/2 - 80} height={260}>
          <div
            // @ts-expect-error xmlns for HTML in SVG
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
              height: "100%",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 700,
              fontSize: 38,
              color: "#F8D8C8",
              lineHeight: 1.35,
              letterSpacing: "0.5px",
            }}
          >
            Bán sạch năng lượng<br/>để mua lấy <span style={{ color: "#FF8878" }}>hư vinh</span>
          </div>
        </foreignObject>

        {/* Right caption */}
        <foreignObject x={W/2 + 40} y={1620} width={W/2 - 80} height={260}>
          <div
            // @ts-expect-error xmlns for HTML in SVG
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
              height: "100%",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 700,
              fontSize: 38,
              color: "#D8ECF8",
              lineHeight: 1.35,
              letterSpacing: "0.5px",
            }}
          >
            Giữ trọn tĩnh lặng,<br/>bảo vệ <span style={{ color: "#7AD0FF" }}>mục tiêu</span>
          </div>
        </foreignObject>

        {/* Signature corner */}
        <text x={W - 30} y={H - 20} fontSize={18} fill="#FFFFFF" textAnchor="end"
              fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} opacity={0.5}>
          tinh dao
        </text>
      </svg>
    </AbsoluteFill>
  );
};
