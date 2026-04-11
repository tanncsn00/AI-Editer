import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadEBGaramond("normal", { weights: ["400","500","600","700"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// "GIẢI THÍCH KIỂU LƯỜI" — VN Casually Explained adaptation
// Character: Anh Lười + signature prop: cốc trà đá with straw

const W = 1080;
const H = 1920;
const PAPER = "#FAFAF5";
const INK = "#1A1A20";
const ACCENT = "#4A90C8";  // pale blue for ice tea theme
const SHADOW = "#9A9A90";

// ================================================================
// PROP OPTIONS
// ================================================================

// Cigarette — thin + red tip + smoke curl
const Cigarette: React.FC<{ x: number; y: number; scale: number; rotate?: number }> = ({ x, y, scale, rotate = 0 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
    {/* Smoke curl */}
    <path d="M -2 -34 Q 4 -46 -4 -56 Q -12 -68 -2 -80" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.6} />
    <path d="M 6 -42 Q 14 -52 6 -62" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.4} />
    {/* Body */}
    <rect x={-14} y={-2} width={28} height={6} fill="#F5F0E8" stroke={INK} strokeWidth={2} />
    {/* Filter brown */}
    <rect x={-14} y={-2} width={8} height={6} fill="#B88858" stroke={INK} strokeWidth={2} />
    {/* Lit tip red */}
    <rect x={12} y={-2} width={4} height={6} fill="#E84820" />
    <circle cx={16} cy={1} r={2} fill="#FFB040" />
  </g>
);

// Nón cối (Vietnamese conical hat) — worn on head
const NonCoi: React.FC<{ x: number; y: number; scale: number }> = ({ x, y, scale }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Hat shape — wide triangle/cone */}
    <path d="M -34 8 Q -40 10 -40 4 L 0 -48 L 40 4 Q 40 10 34 8 Z" fill="#F2D89E" stroke={INK} strokeWidth={4} />
    {/* Inner line detail */}
    <path d="M -30 4 Q 0 -36 30 4" stroke={INK} strokeWidth={2} fill="none" opacity={0.55} />
    <path d="M -22 0 Q 0 -28 22 0" stroke={INK} strokeWidth={1.5} fill="none" opacity={0.4} />
    <path d="M -14 -4 Q 0 -20 14 -4" stroke={INK} strokeWidth={1.5} fill="none" opacity={0.3} />
    {/* Chin strap */}
    <line x1={-26} y1={6} x2={-30} y2={18} stroke={INK} strokeWidth={2} />
    <line x1={26} y1={6} x2={30} y2={18} stroke={INK} strokeWidth={2} />
  </g>
);

// Nokia brick phone
const CucGach: React.FC<{ x: number; y: number; scale: number; rotate?: number }> = ({ x, y, scale, rotate = 0 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
    {/* Body */}
    <rect x={-12} y={-22} width={24} height={50} rx={3} fill="#2A3040" stroke={INK} strokeWidth={3} />
    {/* Screen — monochrome green */}
    <rect x={-9} y={-18} width={18} height={14} fill="#8AC878" stroke={INK} strokeWidth={1.5} />
    {/* Tiny text lines */}
    <line x1={-6} y1={-14} x2={4} y2={-14} stroke={INK} strokeWidth={1} />
    <line x1={-6} y1={-10} x2={6} y2={-10} stroke={INK} strokeWidth={1} />
    {/* Keypad grid */}
    {[0, 1, 2].map(row =>
      [0, 1, 2].map(col => (
        <rect key={`${row}-${col}`} x={-8 + col * 6} y={-1 + row * 6} width={4} height={4} fill="#4A5060" stroke={INK} strokeWidth={0.5} />
      ))
    )}
    {/* Antenna */}
    <line x1={8} y1={-22} x2={10} y2={-30} stroke={INK} strokeWidth={2} />
    <circle cx={10} cy={-30} r={1.5} fill={INK} />
  </g>
);

// Bát phở (pho bowl with steam + chopsticks)
const BatPho: React.FC<{ x: number; y: number; scale: number }> = ({ x, y, scale }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Steam lines curling */}
    <path d="M -12 -30 Q -6 -44 -14 -56 Q -20 -68 -10 -78" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.55} />
    <path d="M 0 -32 Q 8 -46 -2 -58 Q -10 -70 2 -82" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.55} />
    <path d="M 12 -30 Q 18 -44 10 -54" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.45} />
    {/* Bowl — wide low */}
    <path d="M -32 -20 Q -32 16 -18 22 L 18 22 Q 32 16 32 -20 Z" fill="#F5F0E8" stroke={INK} strokeWidth={4} />
    {/* Rim */}
    <ellipse cx={0} cy={-20} rx={32} ry={6} fill="#E8E4DC" stroke={INK} strokeWidth={3} />
    {/* Broth interior */}
    <ellipse cx={0} cy={-19} rx={28} ry={4} fill="#C88848" />
    {/* Noodles peeking */}
    <path d="M -14 -22 Q -10 -18 -6 -22" stroke="#F5F0E8" strokeWidth={2} fill="none" />
    <path d="M 4 -22 Q 8 -18 12 -22" stroke="#F5F0E8" strokeWidth={2} fill="none" />
    {/* Green herbs */}
    <circle cx={-8} cy={-22} r={1.5} fill="#5AA840" />
    <circle cx={6} cy={-22} r={1.5} fill="#5AA840" />
    {/* Chopsticks */}
    <line x1={-20} y1={-30} x2={-14} y2={-16} stroke="#A87848" strokeWidth={2.5} strokeLinecap="round" />
    <line x1={-15} y1={-32} x2={-9} y2={-18} stroke="#A87848" strokeWidth={2.5} strokeLinecap="round" />
  </g>
);

// Trà đá (original)
const TraDaCup: React.FC<{ x: number; y: number; scale: number; rotate?: number }> = ({ x, y, scale, rotate = 0 }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
    {/* Cup body — slightly tapered rectangle */}
    <path d="M -22 -28 L -26 28 L 26 28 L 22 -28 Z" fill="#E8F4F8" stroke={INK} strokeWidth={4} />
    {/* Rim */}
    <ellipse cx={0} cy={-28} rx={22} ry={4} fill="#C8E0E8" stroke={INK} strokeWidth={3} />
    {/* Tea liquid (dark amber) */}
    <ellipse cx={0} cy={-26} rx={19} ry={3} fill="#4A2818" />
    {/* Ice cubes floating */}
    <rect x={-15} y={-25} width={9} height={9} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} opacity={0.92} />
    <rect x={-2} y={-28} width={8} height={8} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} opacity={0.92} />
    <rect x={8} y={-24} width={8} height={8} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} opacity={0.92} />
    {/* Straw */}
    <line x1={6} y1={-52} x2={14} y2={-20} stroke="#D04848" strokeWidth={4} strokeLinecap="round" />
    <line x1={6} y1={-52} x2={14} y2={-20} stroke="#FFFFFF" strokeWidth={1.5} strokeDasharray="3 3" />
  </g>
);

// ================================================================
// ANH LƯỜI (main character) — minimalist stick figure
// ================================================================
type Expression = "deadpan" | "thinking" | "pointing" | "shrug" | "speaking" | "judging";
type PropKind = "trada" | "cigarette" | "noncoi" | "cucgach" | "batpho" | "none";

export const AnhLuoi: React.FC<{
  x: number;
  y: number;
  scale: number;
  expression?: Expression;
  hasCup?: boolean;
  prop?: PropKind;
  phase?: number;
}> = ({ x, y, scale, expression = "deadpan", hasCup = true, prop = "trada", phase = 0 }) => {
  const bob = Math.sin(phase / 3) * 0.6;
  // Helper to render the active prop in left hand
  const renderProp = (px: number, py: number) => {
    if (prop === "none" || !hasCup) return null;
    if (prop === "trada") return <TraDaCup x={px} y={py + 2} scale={0.55} rotate={-8} />;
    if (prop === "cigarette") return <Cigarette x={px + 6} y={py - 4} scale={0.9} rotate={0} />;
    if (prop === "cucgach") return <CucGach x={px + 2} y={py + 2} scale={0.7} rotate={-6} />;
    if (prop === "batpho") return <BatPho x={px - 4} y={py + 6} scale={0.65} />;
    return null;
  };

  return (
    <g transform={`translate(${x}, ${y + bob}) scale(${scale})`}>
      {/* ---------- LEGS (simple stance) ---------- */}
      <line x1={0} y1={60} x2={-14} y2={138} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <line x1={0} y1={60} x2={14} y2={138} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      {/* Shoes */}
      <ellipse cx={-14} cy={140} rx={10} ry={3} fill={INK} />
      <ellipse cx={14} cy={140} rx={10} ry={3} fill={INK} />

      {/* ---------- BODY ---------- */}
      <line x1={0} y1={-8} x2={0} y2={60} stroke={INK} strokeWidth={5} strokeLinecap="round" />

      {/* ---------- ARMS (depends on expression) ---------- */}
      {expression === "pointing" ? (
        <>
          {/* Right arm pointing toward diagram */}
          <line x1={0} y1={10} x2={42} y2={-10} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <line x1={42} y1={-10} x2={58} y2={-14} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          {/* Left arm holds cup */}
          {hasCup && prop !== "none" ? (
            <>
              <line x1={0} y1={10} x2={-30} y2={18} stroke={INK} strokeWidth={5} strokeLinecap="round" />
              {renderProp(-40, 20)}
            </>
          ) : (
            <line x1={0} y1={10} x2={-30} y2={40} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          )}
        </>
      ) : expression === "shrug" ? (
        <>
          {/* Both arms up shrug */}
          <line x1={0} y1={10} x2={-34} y2={-6} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <line x1={0} y1={10} x2={34} y2={-6} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <line x1={-34} y1={-6} x2={-40} y2={-22} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <line x1={34} y1={-6} x2={40} y2={-22} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        </>
      ) : expression === "thinking" ? (
        <>
          {/* Right arm hand to chin */}
          <line x1={0} y1={10} x2={14} y2={-12} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <line x1={14} y1={-12} x2={12} y2={-32} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          {/* Left arm holds cup */}
          {hasCup && prop !== "none" && (
            <>
              <line x1={0} y1={10} x2={-28} y2={30} stroke={INK} strokeWidth={5} strokeLinecap="round" />
              {renderProp(-38, 32)}
            </>
          )}
        </>
      ) : (
        <>
          {/* Default: one hand cup, other side hanging */}
          {hasCup && prop !== "none" ? (
            <>
              <line x1={0} y1={10} x2={-32} y2={20} stroke={INK} strokeWidth={5} strokeLinecap="round" />
              {renderProp(-42, 22)}
            </>
          ) : (
            <line x1={0} y1={10} x2={-22} y2={42} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          )}
          <line x1={0} y1={10} x2={22} y2={42} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        </>
      )}

      {/* ---------- HEAD (round simple) ---------- */}
      <circle cx={0} cy={-26} r={18} fill="none" stroke={INK} strokeWidth={5} />
      {/* Nón cối sits on head */}
      {prop === "noncoi" && <NonCoi x={0} y={-36} scale={1.1} />}
      {/* Hair tuft — minimal signature */}
      <path d="M -10 -42 L -6 -48 L -2 -44 L 2 -50 L 6 -44 L 10 -48" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />

      {/* ---------- EYES (depends on expression) ---------- */}
      {expression === "deadpan" ? (
        <>
          {/* Half-closed bored eyes */}
          <line x1={-8} y1={-28} x2={-4} y2={-28} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          <line x1={4} y1={-28} x2={8} y2={-28} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        </>
      ) : expression === "thinking" ? (
        <>
          {/* One eye squinting thinking */}
          <line x1={-8} y1={-28} x2={-4} y2={-28} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          <circle cx={6} cy={-28} r={2} fill={INK} />
        </>
      ) : expression === "judging" ? (
        <>
          {/* Side-eye judging look */}
          <line x1={-9} y1={-27} x2={-3} y2={-27} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          <line x1={3} y1={-27} x2={9} y2={-27} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          {/* Pupils shifted right (side-eye) */}
          <circle cx={-4} cy={-27} r={1.5} fill={INK} />
          <circle cx={8} cy={-27} r={1.5} fill={INK} />
          {/* Raised eyebrow right */}
          <path d="M 2 -36 L 10 -38" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Dot eyes default */}
          <circle cx={-6} cy={-28} r={2} fill={INK} />
          <circle cx={6} cy={-28} r={2} fill={INK} />
        </>
      )}

      {/* ---------- MOUTH ---------- */}
      {expression === "speaking" ? (
        <ellipse cx={0} cy={-18} rx={3} ry={2} fill={INK} />
      ) : expression === "shrug" ? (
        <path d="M -5 -18 Q 0 -16 5 -18" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      ) : (
        <line x1={-5} y1={-18} x2={5} y2={-18} stroke={INK} strokeWidth={3} strokeLinecap="round" />
      )}
    </g>
  );
};

// ================================================================
// DIAGRAM ARROW (Casually Explained signature — arrow pointing to a label)
// ================================================================
const DiagramArrow: React.FC<{ x: number; y: number; label: string; arrowTo: [number, number] }> = ({ x, y, label, arrowTo }) => (
  <g transform={`translate(${x}, ${y})`}>
    <line x1={0} y1={0} x2={arrowTo[0]} y2={arrowTo[1]} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    {/* Arrowhead */}
    <path
      d={`M ${arrowTo[0]} ${arrowTo[1]} L ${arrowTo[0] - 8} ${arrowTo[1] - 4} L ${arrowTo[0] - 6} ${arrowTo[1] + 4} Z`}
      fill={INK}
      transform={`rotate(${Math.atan2(arrowTo[1], arrowTo[0]) * 180 / Math.PI}, ${arrowTo[0]}, ${arrowTo[1]})`}
    />
    <text x={-4} y={4} fontSize={18} fill={INK} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>
      {label}
    </text>
  </g>
);

// ================================================================
// CHARACTER SHEET COMPOSITION
// ================================================================
export const GiaiThichLuoiCharSheet: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="gtlGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0 0.14  0 0 0 0.12 0" />
          </filter>
        </defs>

        {/* Paper BG */}
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#gtlGrain)" opacity={0.7} />

        {/* Corner marks */}
        {[[60, 60, 1, 1],[W - 60, 60, -1, 1],[60, H - 60, 1, -1],[W - 60, H - 60, -1, -1]].map(([cx, cy, sx, sy], i) => (
          <g key={i} stroke={INK} strokeWidth={3}>
            <line x1={cx} y1={cy} x2={(cx as number) + 60 * (sx as number)} y2={cy} />
            <line x1={cx} y1={cy} x2={cx} y2={(cy as number) + 60 * (sy as number)} />
          </g>
        ))}

        {/* ============ TITLE ============ */}
        <text x={W/2} y={150} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} letterSpacing="6">
          — CHARACTER SHEET —
        </text>
        <text x={W/2} y={230} fontSize={66} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} letterSpacing="2">
          GIẢI THÍCH KIỂU LƯỜI
        </text>
        <line x1={W/2 - 200} y1={258} x2={W/2 + 200} y2={258} stroke={INK} strokeWidth={1.5} />
        <text x={W/2} y={295} fontSize={24} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.7}>
          casually explained, vietnamese deadpan
        </text>

        {/* ============ HERO POSE (center big) ============ */}
        <AnhLuoi x={W/2} y={620} scale={3.6} expression="deadpan" hasCup />

        {/* Diagram arrows pointing to character features */}
        <g transform="translate(850, 460)">
          <line x1={0} y1={0} x2={-40} y2={30} stroke={INK} strokeWidth={2} />
          <text x={4} y={4} fontSize={18} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>mắt lười</text>
        </g>
        <g transform="translate(910, 680)">
          <line x1={0} y1={0} x2={-80} y2={10} stroke={INK} strokeWidth={2} />
          <text x={4} y={4} fontSize={18} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>cốc trà đá</text>
          <text x={4} y={24} fontSize={14} fill={INK} fontStyle="italic" opacity={0.6}>signature prop</text>
        </g>
        <g transform="translate(250, 540)">
          <line x1={0} y1={0} x2={90} y2={-20} stroke={INK} strokeWidth={2} />
          <text x={-4} y={4} fontSize={18} fill={INK} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>tóc tua tủa</text>
        </g>
        <g transform="translate(200, 780)">
          <line x1={0} y1={0} x2={120} y2={-20} stroke={INK} strokeWidth={2} />
          <text x={-4} y={4} fontSize={18} fill={INK} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>tư thế mỏi lưng</text>
        </g>

        {/* Name plate */}
        <text x={W/2} y={1090} fontSize={52} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} letterSpacing="4">
          ANH LƯỜI
        </text>
        <text x={W/2} y={1124} fontSize={20} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.7}>
          một người đàn ông chỉ muốn yên
        </text>

        <line x1={120} y1={1170} x2={W - 120} y2={1170} stroke={INK} strokeWidth={1.5} opacity={0.4} />

        {/* ============ EXPRESSION LIBRARY ============ */}
        <text x={W/2} y={1220} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" letterSpacing="5" opacity={0.7}>
          EXPRESSION LIBRARY
        </text>

        {/* 6 expressions grid */}
        {([
          [180, "deadpan"],
          [370, "thinking"],
          [560, "judging"],
          [750, "pointing"],
          [930, "shrug"],
        ] as const).map(([cx, exp], i) => (
          <g key={i}>
            <AnhLuoi x={cx as number} y={1380} scale={1.0} expression={exp} hasCup={exp !== "pointing" ? true : false} />
          </g>
        ))}

        {/* Labels */}
        {([
          [180, "deadpan"],
          [370, "thinking"],
          [560, "judging"],
          [750, "pointing"],
          [930, "shrug"],
        ] as const).map(([cx, label], i) => (
          <text key={i} x={cx as number} y={1560} fontSize={17} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" opacity={0.65}>
            {label}
          </text>
        ))}

        <line x1={120} y1={1610} x2={W - 120} y2={1610} stroke={INK} strokeWidth={1.5} opacity={0.4} />

        {/* ============ PALETTE + NOTES ============ */}
        <text x={80} y={1670} fontSize={18} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" letterSpacing="3" opacity={0.7}>
          PALETTE
        </text>
        <g transform="translate(80, 1690)">
          {[
            [INK, "ink"],
            [PAPER, "paper"],
            ["#D04848", "straw red"],
            ["#E8F4F8", "ice pale"],
            ["#4A2818", "tea amber"],
          ].map(([col, name], i) => (
            <g key={i} transform={`translate(${i * 170}, 0)`}>
              <rect x={0} y={0} width={150} height={40} fill={col} stroke={INK} strokeWidth={2} />
              <text x={75} y={64} fontSize={14} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" opacity={0.75}>{name}</text>
            </g>
          ))}
        </g>

        {/* Tagline */}
        <rect x={80} y={H - 180} width={W - 160} height={90} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="10 6" />
        <text x={W/2} y={H - 135} fontSize={28} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={500} fontStyle="italic">
          "Đời đơn giản thôi. Hít một hơi, uống một ngụm, rồi giải thích."
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ================================================================
// ENSEMBLE CAST — 4 characters with distinct body + personality
// ================================================================
type CastMember = "thuocla" | "noncoi" | "cucgach" | "batpho";

export const CastCharacter: React.FC<{
  x: number;
  y: number;
  scale: number;
  member: CastMember;
  expression?: Expression;
  phase?: number;
  speaking?: boolean;
  gestureLevel?: number; // 0-1, how much arm gesture
}> = ({ x, y, scale, member, expression = "deadpan", phase = 0, speaking = false, gestureLevel = 0 }) => {
  // Body bob — bigger amplitude when speaking (breathing/emphasis)
  const bobAmp = speaking ? 3.0 : 1.5;
  const bob = Math.sin(phase / 2.5) * bobAmp;
  // Head tilt subtle
  const headTilt = Math.sin(phase / 4) * 1.2;
  // Mouth sync — opens/closes at ~4Hz when speaking
  const mouthOpen = speaking ? (Math.sin(phase * 6) > 0 ? 1 : 0) : 0;
  const mouthOpenAmt = speaking ? (0.4 + Math.abs(Math.sin(phase * 6)) * 0.6) : 0;
  // Eye blink — periodic every ~3s (phase * FPS based)
  const blinkCycle = (phase * 2) % 8;
  const blinking = blinkCycle < 0.3;
  // Arm gesture — subtle sway when speaking
  const armSway = speaking ? Math.sin(phase * 3) * 2 * gestureLevel : 0;

  // Body shape differentiation per member
  const bodyVariant = {
    thuocla: { slouch: 8, width: 0, legSpread: 12, bellyOffset: 0 }, // skinny slumped
    noncoi:  { slouch: 0, width: 4, legSpread: 22, bellyOffset: 0 }, // short sturdy, wider
    cucgach: { slouch: 3, width: 0, legSpread: 14, bellyOffset: 0 }, // neutral
    batpho:  { slouch: 0, width: 6, legSpread: 26, bellyOffset: 12 }, // belly wider, sturdier
  }[member];

  return (
    <g transform={`translate(${x}, ${y + bob}) scale(${scale})`}>
      {/* LEGS */}
      <line x1={0} y1={60} x2={-bodyVariant.legSpread} y2={138} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <line x1={0} y1={60} x2={bodyVariant.legSpread} y2={138} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <ellipse cx={-bodyVariant.legSpread} cy={140} rx={10} ry={3} fill={INK} />
      <ellipse cx={bodyVariant.legSpread} cy={140} rx={10} ry={3} fill={INK} />

      {/* BODY — vertical with slouch + optional belly */}
      {member === "batpho" ? (
        // Pot-belly variant — smooth rounded curve
        <path d="M 0 -8 Q 18 4 20 24 Q 20 44 4 58 Q -2 60 0 60" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      ) : member === "thuocla" ? (
        // Slouched slightly
        <path d="M 2 -8 Q -2 20 -2 60" stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      ) : (
        <line x1={0} y1={-8} x2={0} y2={60} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      )}

      {/* ARMS — left holds prop, right neutral */}
      <line x1={0} y1={10} x2={22} y2={42} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      {/* Prop-holding arm */}
      {member === "thuocla" && (
        <>
          <line x1={0} y1={10} x2={-24} y2={-4} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <line x1={-24} y1={-4} x2={-14} y2={-20} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <Cigarette x={-14} y={-24} scale={0.85} rotate={-30} />
        </>
      )}
      {member === "noncoi" && (
        <>
          <line x1={0} y1={10} x2={-24} y2={42} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        </>
      )}
      {member === "cucgach" && (
        <>
          <line x1={0} y1={10} x2={-30} y2={20} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <CucGach x={-38} y={22} scale={0.7} rotate={-6} />
        </>
      )}
      {member === "batpho" && (
        <>
          <line x1={0} y1={10} x2={-22} y2={26} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <line x1={0} y1={10} x2={22} y2={26} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <BatPho x={0} y={32} scale={0.72} />
        </>
      )}

      {/* HEAD */}
      <circle cx={0} cy={-26} r={18} fill="none" stroke={INK} strokeWidth={5} />

      {/* Nón cối hat on head — raised up to keep face visible */}
      {member === "noncoi" && <NonCoi x={0} y={-46} scale={1.2} />}

      {/* Hair tuft / hairstyle variant */}
      {member === "thuocla" && (
        // Long shaggy hair on top — keep face visible
        <>
          <path d="M -16 -44 L -14 -54 L -10 -46 L -6 -56 L -2 -46 L 2 -56 L 6 -46 L 10 -56 L 14 -46 L 16 -44" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
          {/* Single asymmetric fringe strand on forehead (not covering eyes) */}
          <path d="M 8 -42 Q 14 -38 10 -32" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      )}
      {member === "cucgach" && (
        // Short buzz cut — 3 strand
        <path d="M -10 -42 L -10 -46 M 0 -44 L 0 -48 M 10 -42 L 10 -46" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      )}
      {member === "batpho" && (
        // Bald top with side tuft
        <>
          <path d="M -18 -36 Q -14 -44 -8 -42" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M 8 -42 Q 14 -44 18 -36" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
          {/* Shiny top hint */}
          <path d="M -3 -44 Q 0 -46 3 -44" stroke={INK} strokeWidth={1.5} fill="none" opacity={0.5} />
        </>
      )}

      {/* EYES — deadpan default, with blink support */}
      {member === "cucgach" ? (
        <>
          {/* Square glasses */}
          <rect x={-12} y={-32} width={8} height={8} fill="none" stroke={INK} strokeWidth={2.5} />
          <rect x={4} y={-32} width={8} height={8} fill="none" stroke={INK} strokeWidth={2.5} />
          <line x1={-4} y1={-28} x2={4} y2={-28} stroke={INK} strokeWidth={2} />
          {blinking ? (
            <>
              <line x1={-11} y1={-28} x2={-5} y2={-28} stroke={INK} strokeWidth={2} />
              <line x1={5} y1={-28} x2={11} y2={-28} stroke={INK} strokeWidth={2} />
            </>
          ) : (
            <>
              <circle cx={-8} cy={-28} r={1.5} fill={INK} />
              <circle cx={8} cy={-28} r={1.5} fill={INK} />
            </>
          )}
        </>
      ) : blinking ? (
        <>
          {/* Closed blink */}
          <line x1={-9} y1={-28} x2={-3} y2={-28} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          <line x1={3} y1={-28} x2={9} y2={-28} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Half-closed bored eyes */}
          <line x1={-8} y1={-28} x2={-4} y2={-28} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          <line x1={4} y1={-28} x2={8} y2={-28} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        </>
      )}

      {/* MOUTH — animated open/close when speaking */}
      {member === "noncoi" ? (
        <>
          {/* Mustache — bigger, bushier */}
          <path d="M -13 -18 Q -10 -12 -4 -16 Q 0 -14 4 -16 Q 10 -12 13 -18" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
          <path d="M -11 -20 Q -6 -24 -2 -20" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M 2 -20 Q 6 -24 11 -20" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
          {/* Mouth below mustache — animated */}
          {speaking && mouthOpen ? (
            <ellipse cx={0} cy={-11} rx={4} ry={2 + mouthOpenAmt * 2} fill={INK} />
          ) : (
            <line x1={-4} y1={-12} x2={4} y2={-12} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          )}
        </>
      ) : speaking && mouthOpen ? (
        <ellipse cx={0} cy={-17} rx={5} ry={2 + mouthOpenAmt * 2.5} fill={INK} />
      ) : (
        <line x1={-5} y1={-18} x2={5} y2={-18} stroke={INK} strokeWidth={3} strokeLinecap="round" />
      )}
    </g>
  );
};

// ================================================================
// ENSEMBLE CAST SHEET
// ================================================================
export const GiaiThichLuoiEnsemble: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="ensGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
            <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0 0.14  0 0 0 0.12 0" />
          </filter>
        </defs>

        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#ensGrain)" opacity={0.7} />

        {/* Corner marks */}
        {[[60, 60, 1, 1],[W - 60, 60, -1, 1],[60, H - 60, 1, -1],[W - 60, H - 60, -1, -1]].map(([cx, cy, sx, sy], i) => (
          <g key={i} stroke={INK} strokeWidth={3}>
            <line x1={cx} y1={cy} x2={(cx as number) + 60 * (sx as number)} y2={cy} />
            <line x1={cx} y1={cy} x2={cx} y2={(cy as number) + 60 * (sy as number)} />
          </g>
        ))}

        {/* Title */}
        <text x={W/2} y={140} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} letterSpacing="6">
          — CHARACTER CAST —
        </text>
        <text x={W/2} y={220} fontSize={62} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} letterSpacing="2">
          GIẢI THÍCH KIỂU LƯỜI
        </text>
        <line x1={W/2 - 180} y1={248} x2={W/2 + 180} y2={248} stroke={INK} strokeWidth={1.5} />
        <text x={W/2} y={284} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.7}>
          4 quan điểm, 4 lý do để lười
        </text>

        {/* 2x2 cast grid */}
        {/* TL: Anh Thuốc Lá */}
        <g>
          <rect x={70} y={340} width={460} height={700} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <CastCharacter x={300} y={720} scale={2.3} member="thuocla" />
          <line x1={100} y1={940} x2={500} y2={940} stroke={INK} strokeWidth={2} opacity={0.3} />
          <text x={300} y={980} fontSize={34} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600}>
            ANH THUỐC LÁ
          </text>
          <text x={300} y={1006} fontSize={16} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.65}>
            philosophical · suy ngẫm đời
          </text>
        </g>

        {/* TR: Chú Nón Cối */}
        <g>
          <rect x={550} y={340} width={460} height={700} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <CastCharacter x={780} y={740} scale={2.3} member="noncoi" />
          <line x1={580} y1={940} x2={980} y2={940} stroke={INK} strokeWidth={2} opacity={0.3} />
          <text x={780} y={980} fontSize={34} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600}>
            CHÚ NÓN CỐI
          </text>
          <text x={780} y={1006} fontSize={16} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.65}>
            truyền thống · ông già làng OG
          </text>
        </g>

        {/* BL: Bác Cục Gạch */}
        <g>
          <rect x={70} y={1060} width={460} height={700} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <CastCharacter x={300} y={1440} scale={2.3} member="cucgach" />
          <line x1={100} y1={1660} x2={500} y2={1660} stroke={INK} strokeWidth={2} opacity={0.3} />
          <text x={300} y={1700} fontSize={34} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600}>
            BÁC CỤC GẠCH
          </text>
          <text x={300} y={1726} fontSize={16} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.65}>
            anti-modern · boomer tech skeptic
          </text>
        </g>

        {/* BR: Chú Bát Phở */}
        <g>
          <rect x={550} y={1060} width={460} height={700} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <CastCharacter x={780} y={1440} scale={2.3} member="batpho" />
          <line x1={580} y1={1660} x2={980} y2={1660} stroke={INK} strokeWidth={2} opacity={0.3} />
          <text x={780} y={1700} fontSize={34} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600}>
            CHÚ BÁT PHỞ
          </text>
          <text x={780} y={1726} fontSize={16} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.65}>
            practical foodie · daily life
          </text>
        </g>

        {/* Bottom tagline */}
        <text x={W/2} y={H - 80} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontStyle="italic" opacity={0.7}>
          "Mỗi ông 1 kiểu lười. Mỗi tập 1 chủ đề."
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ================================================================
// PROP COMPARISON SHEET — 4 versions side-by-side
// ================================================================
export const GiaiThichLuoiPropCompare: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="propCmpGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="5" />
            <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0 0.14  0 0 0 0.12 0" />
          </filter>
        </defs>

        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#propCmpGrain)" opacity={0.7} />

        {/* Corner marks */}
        {[[60, 60, 1, 1],[W - 60, 60, -1, 1],[60, H - 60, 1, -1],[W - 60, H - 60, -1, -1]].map(([cx, cy, sx, sy], i) => (
          <g key={i} stroke={INK} strokeWidth={3}>
            <line x1={cx} y1={cy} x2={(cx as number) + 60 * (sx as number)} y2={cy} />
            <line x1={cx} y1={cy} x2={cx} y2={(cy as number) + 60 * (sy as number)} />
          </g>
        ))}

        {/* Title */}
        <text x={W/2} y={150} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} letterSpacing="6">
          — ANH LƯỜI —
        </text>
        <text x={W/2} y={220} fontSize={58} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} letterSpacing="2">
          PROP COMPARISON
        </text>
        <line x1={W/2 - 160} y1={246} x2={W/2 + 160} y2={246} stroke={INK} strokeWidth={1.5} />
        <text x={W/2} y={282} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.7}>
          pick your signature
        </text>

        {/* 2x2 grid of 4 prop variants */}
        {/* Each cell: 490x560 roughly */}
        {/* TL: Thuốc lá */}
        <g>
          <rect x={70} y={340} width={460} height={640} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <AnhLuoi x={300} y={730} scale={2.4} expression="deadpan" prop="cigarette" hasCup />
          <text x={300} y={930} fontSize={38} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600}>
            THUỐC LÁ
          </text>
          <text x={300} y={958} fontSize={18} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.65}>
            classic bro suy ngẫm
          </text>
        </g>

        {/* TR: Nón cối */}
        <g>
          <rect x={550} y={340} width={460} height={640} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <AnhLuoi x={780} y={750} scale={2.4} expression="deadpan" prop="noncoi" hasCup={false} />
          <text x={780} y={930} fontSize={38} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600}>
            NÓN CỐI
          </text>
          <text x={780} y={958} fontSize={18} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.65}>
            cultural VN iconic
          </text>
        </g>

        {/* BL: Cục gạch */}
        <g>
          <rect x={70} y={1000} width={460} height={640} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <AnhLuoi x={300} y={1390} scale={2.4} expression="deadpan" prop="cucgach" hasCup />
          <text x={300} y={1590} fontSize={38} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600}>
            CỤC GẠCH
          </text>
          <text x={300} y={1618} fontSize={18} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.65}>
            boomer Nokia vibe
          </text>
        </g>

        {/* BR: Bát phở */}
        <g>
          <rect x={550} y={1000} width={460} height={640} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <AnhLuoi x={780} y={1390} scale={2.4} expression="deadpan" prop="batpho" hasCup />
          <text x={780} y={1590} fontSize={38} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600}>
            BÁT PHỞ
          </text>
          <text x={780} y={1618} fontSize={18} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.65}>
            food icon VN
          </text>
        </g>

        {/* Bottom tagline box */}
        <rect x={80} y={H - 200} width={W - 160} height={140} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="10 6" />
        <text x={W/2} y={H - 150} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={500} fontStyle="italic">
          "One prop defines a brand."
        </text>
        <text x={W/2} y={H - 110} fontSize={20} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" opacity={0.6}>
          pick 1 — it sticks forever
        </text>
      </svg>
    </AbsoluteFill>
  );
};
