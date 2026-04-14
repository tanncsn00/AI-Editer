import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadBeVietnamPro("normal", { weights: ["400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";

const Teacher: React.FC<{ x: number; y: number; scale?: number; pointing?: boolean }> = ({
  x, y, scale = 1, pointing = false,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Legs */}
    <line x1={-12} y1={30} x2={-18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
    <line x1={12} y1={30} x2={18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
    <line x1={-12} y1={30} x2={-18} y2={75} stroke={INK} strokeWidth={2.5} />
    <line x1={12} y1={30} x2={18} y2={75} stroke={INK} strokeWidth={2.5} />
    {/* Shoes */}
    <ellipse cx={-20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
    <ellipse cx={20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
    {/* Body — shirt */}
    <rect x={-22} y={-25} width={44} height={58} rx={10} fill="#4A7AC8" stroke={INK} strokeWidth={3.5} />
    {/* Collar */}
    <path d="M -8 -25 L 0 -15 L 8 -25" fill="#E8E0D0" stroke={INK} strokeWidth={2} />
    {/* Arms */}
    {pointing ? (
      <>
        {/* Right arm pointing up-right at screen */}
        <line x1={22} y1={-12} x2={55} y2={-40} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
        <line x1={22} y1={-12} x2={55} y2={-40} stroke={INK} strokeWidth={2.5} />
        {/* Hand pointing */}
        <circle cx={58} cy={-44} r={6} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
        {/* Left arm down */}
        <line x1={-22} y1={-8} x2={-35} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
        <line x1={-22} y1={-8} x2={-35} y2={18} stroke={INK} strokeWidth={2.5} />
      </>
    ) : (
      <>
        <line x1={-22} y1={-8} x2={-38} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
        <line x1={22} y1={-8} x2={38} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
        <line x1={-22} y1={-8} x2={-38} y2={18} stroke={INK} strokeWidth={2.5} />
        <line x1={22} y1={-8} x2={38} y2={18} stroke={INK} strokeWidth={2.5} />
      </>
    )}
    {/* Head */}
    <circle cx={0} cy={-46} r={22} fill="#F8E0D0" stroke={INK} strokeWidth={3.5} />
    {/* Hair — side part */}
    <path d="M -22 -52 Q -18 -68 -6 -66 Q 2 -72 14 -68 Q 22 -60 22 -52" fill="#1A1A22" />
    {/* Eyes */}
    <circle cx={-8} cy={-48} r={3} fill={INK} />
    <circle cx={8} cy={-48} r={3} fill={INK} />
    <circle cx={-7} cy={-49} r={1} fill="#FFF" />
    <circle cx={9} cy={-49} r={1} fill="#FFF" />
    {/* Smile */}
    <path d="M -6 -38 Q 0 -33 6 -38" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
  </g>
);

const PresentationBoard: React.FC<{ x: number; y: number; w: number; h: number; label: string }> = ({
  x, y, w, h, label,
}) => (
  <g>
    {/* Whiteboard frame */}
    <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={6} fill="#8A7A68" stroke={INK} strokeWidth={3} />
    <rect x={x} y={y} width={w} height={h} rx={4} fill="#FAFAF5" stroke={INK} strokeWidth={2} />
    {/* Inner content area with dashed border */}
    <rect x={x + 15} y={y + 15} width={w - 30} height={h - 30} rx={4} fill="none" stroke="#C0B8A8" strokeWidth={2} strokeDasharray="8 5" />
    {/* Label */}
    <text x={x + w / 2} y={y + h / 2} fontSize={26} fill="#8A7A68" textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
      {label}
    </text>
    {/* Stand legs */}
    <line x1={x + w / 2 - 80} y1={y + h} x2={x + w / 2 - 120} y2={y + h + 60} stroke="#6A5A48" strokeWidth={6} strokeLinecap="round" />
    <line x1={x + w / 2 + 80} y1={y + h} x2={x + w / 2 + 120} y2={y + h + 60} stroke="#6A5A48" strokeWidth={6} strokeLinecap="round" />
  </g>
);

export const VibeEditingLayout: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="velPaper">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.22 0" />
          </filter>
          <radialGradient id="velVig" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.45" />
          </radialGradient>
        </defs>

        {/* BG paper cream */}
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#velPaper)" />

        {/* Title banner */}
        <rect x={60} y={60} width={W - 120} height={130} rx={12} fill={ACCENT} stroke={INK} strokeWidth={4} />
        <text x={W / 2} y={120} fontSize={56} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
          VIBE EDITING
        </text>
        <text x={W / 2} y={162} fontSize={22} fill="#FFE0D0" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400}>
          prompt ra video — không cần biết edit
        </text>

        {/* Main presentation board — upper area */}
        <PresentationBoard x={120} y={260} w={640} h={420} label="🎬 VIDEO SHOWCASE" />

        {/* 3 small thumbnails — right column */}
        <g>
          <text x={900} y={290} fontSize={18} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            ĐÃ LÀM
          </text>
          {[
            { label: "Hoa và Ong", color: GOLD },
            { label: "Reup Cartoon", color: ACCENT },
            { label: "Im Lặng", color: "#4A7AC8" },
          ].map((item, i) => (
            <g key={i}>
              <rect x={810} y={305 + i * 130} width={170} height={110} rx={8} fill="#FAFAF5" stroke={item.color} strokeWidth={3} />
              <text x={895} y={370 + i * 130} fontSize={15} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
                {item.label}
              </text>
            </g>
          ))}
        </g>

        {/* Teacher — bottom left, smaller scale, pointing at board */}
        <Teacher x={220} y={920} scale={1.6} pointing />

        {/* Speech bubble */}
        <g>
          <rect x={350} y={780} width={580} height={80} rx={18} fill="#FFF" stroke={INK} strokeWidth={3} />
          {/* Tail */}
          <polygon points="370,860 340,890 400,860" fill="#FFF" stroke={INK} strokeWidth={3} />
          <line x1={371} y1={858} x2={399} y2={858} stroke="#FFF" strokeWidth={4} />
          <text x={640} y={830} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
            "Cái này anh làm bằng code đấy các vợ ơi"
          </text>
        </g>

        {/* Meta note — "video này cũng vibe editing" */}
        <g>
          <rect x={100} y={1020} width={880} height={70} rx={10} fill={GOLD} stroke={INK} strokeWidth={3} opacity={0.9} />
          <text x={W / 2} y={1065} fontSize={24} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
            ⚡ Video này cũng chồng làm bằng vibe editing hoàn toàn đấy vợ ạ
          </text>
        </g>

        {/* Stack — 3 things you need */}
        <g transform="translate(540, 1230)">
          <text x={0} y={-50} fontSize={26} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
            CHỈ CẦN 3 THỨ
          </text>
          {/* AI */}
          <g transform="translate(-220, 0)">
            <circle cx={0} cy={0} r={40} fill="#FFF" stroke={ACCENT} strokeWidth={3} />
            <text x={0} y={8} fontSize={32} textAnchor="middle">🧠</text>
            <text x={0} y={58} fontSize={17} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>AI</text>
          </g>
          {/* Code */}
          <g transform="translate(0, 0)">
            <circle cx={0} cy={0} r={40} fill="#FFF" stroke={ACCENT} strokeWidth={3} />
            <text x={0} y={8} fontSize={24} fill={INK} textAnchor="middle" fontFamily="monospace" fontWeight={700}>&lt;/&gt;</text>
            <text x={0} y={58} fontSize={17} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Framework</text>
          </g>
          {/* Voice */}
          <g transform="translate(220, 0)">
            <circle cx={0} cy={0} r={40} fill="#FFF" stroke={ACCENT} strokeWidth={3} />
            <text x={0} y={8} fontSize={32} textAnchor="middle">🎙️</text>
            <text x={0} y={58} fontSize={17} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Voice VN</text>
          </g>
        </g>

        {/* Series tease */}
        <g transform="translate(540, 1450)">
          <text x={0} y={0} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
            📅 Tháng 4 — Series hướng dẫn từ zero
          </text>
          {/* Week boxes */}
          {["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"].map((label, i) => (
            <g key={i} transform={`translate(${-270 + i * 180}, 30)`}>
              <rect x={-70} y={0} width={140} height={50} rx={8} fill={i === 0 ? ACCENT : "#FFF"} stroke={INK} strokeWidth={2.5} />
              <text x={0} y={32} fontSize={18} fill={i === 0 ? "#FFF" : INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
                {label} {i === 0 ? "✓" : ""}
              </text>
            </g>
          ))}
        </g>

        {/* CTA */}
        <rect x={180} y={1590} width={720} height={110} rx={16} fill={ACCENT} stroke={INK} strokeWidth={4} />
        <text x={W / 2} y={1645} fontSize={44} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
          FOLLOW ĐỂ XEM SERIES
        </text>
        <text x={W / 2} y={1682} fontSize={20} fill="#FFE0D0" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif">
          Tập 1 ra tuần này
        </text>

        {/* Floor line */}
        <line x1={60} y1={1550} x2={W - 60} y2={1550} stroke="#C0B8A8" strokeWidth={2} />

        {/* Vignette */}
        <rect width={W} height={H} fill="url(#velVig)" />
      </svg>
    </AbsoluteFill>
  );
};
