import { AbsoluteFill } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadInter("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["latin"] });
loadJetBrains("normal", { weights: ["400", "700"], subsets: ["latin"] });
loadBeVietnamPro("normal", { weights: ["400", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const W = 1080;
const H = 1920;
const TEXT = "#FFFFFF";
const TEXT_DIM = "#9CA3C9";
const ACCENT = "#FF6B35";
const NEON_BLUE = "#6366F1";
const NEON_PURPLE = "#A855F7";
const NEON_PINK = "#EC4899";
const NEON_CYAN = "#06B6D4";
const GOLD = "#FFC93C";
const RED = "#FF3B5C";
const PANEL = "#0F1028";
const CLAUDE_ORANGE = "#D97757";
const OPENAI_GREEN = "#10A37F";
const GEMINI_BLUE = "#4285F4";

const CornerBrackets: React.FC<{ x: number; y: number; w: number; h: number; color: string; len?: number }> = ({
  x, y, w, h, color, len = 24,
}) => (
  <g stroke={color} strokeWidth={3.5} fill="none" strokeLinecap="round">
    <path d={`M ${x} ${y + len} L ${x} ${y} L ${x + len} ${y}`} />
    <path d={`M ${x + w - len} ${y} L ${x + w} ${y} L ${x + w} ${y + len}`} />
    <path d={`M ${x} ${y + h - len} L ${x} ${y + h} L ${x + len} ${y + h}`} />
    <path d={`M ${x + w - len} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - len}`} />
  </g>
);

const ClaudeLogo: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => {
  const s = size / 100;
  return (
    <g transform={`translate(${x + size/2}, ${y + size/2}) scale(${s})`}>
      <path d="M 0 -50 Q 4 -10 0 0 Q -4 -10 0 -50 Z" fill={CLAUDE_ORANGE} />
      <path d="M 0 50 Q 4 10 0 0 Q -4 10 0 50 Z" fill={CLAUDE_ORANGE} />
      <path d="M -50 0 Q -10 -4 0 0 Q -10 4 -50 0 Z" fill={CLAUDE_ORANGE} />
      <path d="M 50 0 Q 10 -4 0 0 Q 10 4 50 0 Z" fill={CLAUDE_ORANGE} />
      <path d="M -35 -35 Q -7 -3 0 0 Q -3 -7 -35 -35 Z" fill={CLAUDE_ORANGE} opacity={0.85} />
      <path d="M 35 35 Q 7 3 0 0 Q 3 7 35 35 Z" fill={CLAUDE_ORANGE} opacity={0.85} />
      <path d="M 35 -35 Q 3 -7 0 0 Q 7 -3 35 -35 Z" fill={CLAUDE_ORANGE} opacity={0.85} />
      <path d="M -35 35 Q -3 7 0 0 Q -7 3 -35 35 Z" fill={CLAUDE_ORANGE} opacity={0.85} />
      <circle r={6} fill="#FFE9D9" />
    </g>
  );
};

const GeminiLogo: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => (
  <g transform={`translate(${x}, ${y}) scale(${size / 24})`}>
    <defs>
      <linearGradient id="geminiGradTh" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={GEMINI_BLUE} />
        <stop offset="50%" stopColor={NEON_PURPLE} />
        <stop offset="100%" stopColor={NEON_PINK} />
      </linearGradient>
    </defs>
    <path d="M12 0 C 11.5 6 6 11.5 0 12 C 6 12.5 11.5 18 12 24 C 12.5 18 18 12.5 24 12 C 18 11.5 12.5 6 12 0 Z" fill="url(#geminiGradTh)"/>
  </g>
);

const OpenAILogo: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => (
  <g transform={`translate(${x}, ${y}) scale(${size / 24})`}>
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.787a4.49 4.49 0 0 1-.676 8.105v-5.677a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" fill={OPENAI_GREEN}/>
  </g>
);

const GrokLogo: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => (
  <g transform={`translate(${x}, ${y}) scale(${size / 24})`}>
    <path d="M3 3 L21 21 M21 3 L3 21" stroke={TEXT} strokeWidth={3.5} strokeLinecap="round" />
  </g>
);

export const AppleIos27SwapThumbnail: React.FC = () => {
  const horizonY = H * 0.55;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <svg width={W} height={H}>
        <defs>
          <linearGradient id="bgVertTh" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#020012" />
            <stop offset="40%" stopColor="#050018" />
            <stop offset="80%" stopColor="#0A0530" />
            <stop offset="100%" stopColor="#1A0840" />
          </linearGradient>
          <radialGradient id="orbCoreTh" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity="1" />
            <stop offset="40%" stopColor="#A855F7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orbHaloTh" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A855F7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="holoTitle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="25%" stopColor="#FFC93C" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="75%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <filter id="bgBlurTh"><feGaussianBlur stdDeviation="40" /></filter>
          <filter id="cardGlowTh"><feGaussianBlur stdDeviation="14" /></filter>
        </defs>
        {/* Deep space gradient */}
        <rect width={W} height={H} fill="url(#bgVertTh)" />

        {/* Tron perspective grid floor */}
        <g opacity={0.45}>
          {Array.from({ length: 16 }).map((_, i) => {
            const yLine = horizonY + (i * i) * 4;
            if (yLine > H + 100) return null;
            const op = Math.max(0, 0.5 - (yLine - horizonY) / 1200);
            return <line key={`h${i}`} x1={0} y1={yLine} x2={W} y2={yLine} stroke="#00F0FF" strokeWidth={1.5} opacity={op} />;
          })}
          {Array.from({ length: 21 }).map((_, i) => {
            const x = (i / 20) * W;
            return <line key={`v${i}`} x1={x} y1={horizonY} x2={W / 2 + (x - W / 2) * 4} y2={H + 100} stroke="#00F0FF" strokeWidth={1.2} opacity={0.4} />;
          })}
          <line x1={0} y1={horizonY} x2={W} y2={horizonY} stroke="#00F0FF" strokeWidth={2} opacity={0.6} />
          <line x1={0} y1={horizonY} x2={W} y2={horizonY} stroke="#00F0FF" strokeWidth={6} opacity={0.25} filter="url(#bgBlurTh)" />
        </g>

        {/* Neural orb behind cards */}
        <g transform={`translate(${W / 2}, ${horizonY - 220})`}>
          <circle r={220} fill="url(#orbHaloTh)" opacity={0.6} />
          <circle r={80} fill="url(#orbCoreTh)" />
          <circle r={30} fill="#FFFFFF" opacity={0.85} filter="url(#cardGlowTh)" />
        </g>

        {/* Top sticker */}
        <g transform="translate(540, 130)">
          <rect x={-260} y={-40} width={520} height={80} rx={14} fill={PANEL} stroke={NEON_CYAN} strokeWidth={2} />
          <CornerBrackets x={-260} y={-40} w={520} h={80} color={NEON_CYAN} len={16} />
          <text x={-180} y={11} fontSize={26} fill={NEON_CYAN} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>● iOS 27</text>
          <text x={70} y={11} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>BLOOMBERG LEAK</text>
        </g>

        {/* APPLE INTELLIGENCE label */}
        <g transform="translate(540, 260)">
          <text x={0} y={0} fontSize={32} fill={ACCENT} textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={800}
            style={{ filter: `drop-shadow(0 0 14px ${ACCENT})` }}>APPLE INTELLIGENCE</text>
        </g>

        {/* Strikethrough ChatGPT ĐỘC QUYỀN */}
        <g transform="translate(540, 420)">
          <text x={0} y={0} fontSize={68} fill={TEXT_DIM} textAnchor="middle" dominantBaseline="middle" fontFamily="'Inter', sans-serif" fontWeight={800} opacity={0.55}>ChatGPT ĐỘC QUYỀN</text>
          <line x1={-440} y1={-26} x2={440} y2={26} stroke={RED} strokeWidth={10}
            style={{ filter: `drop-shadow(0 0 12px ${RED})` }} />
        </g>

        {/* GAME OVER stamp */}
        <g transform="translate(540, 660)">
          <rect x={-380} y={-90} width={760} height={180} rx={14} fill={RED} stroke="#FFF" strokeWidth={5}
            style={{ filter: `drop-shadow(0 14px 36px ${RED}) drop-shadow(0 0 6px #FFF)` }} transform="rotate(-3 0 0)" />
          <CornerBrackets x={-380} y={-90} w={760} h={180} color="#FFF" len={26} />
          <text x={0} y={20} fontSize={108} fill="#FFF" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={900} transform="rotate(-3 0 0)"
            style={{ filter: "drop-shadow(0 0 16px #FFF)" }}>GAME OVER</text>
        </g>

        {/* HOLO TỰ PICK AI */}
        <g transform="translate(540, 920)">
          <text x={0} y={0} fontSize={64} fill="url(#holoTitle)" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={900}
            style={{ filter: "drop-shadow(0 0 24px rgba(255,107,53,0.6))" }}>BẠN TỰ PICK AI</text>
        </g>

        {/* 4 brand cards */}
        <g transform="translate(540, 1200)">
          {[
            { name: "Claude", logo: ClaudeLogo, border: CLAUDE_ORANGE, bg: "#1F1A1A" },
            { name: "Gemini", logo: GeminiLogo, border: GEMINI_BLUE, bg: "#0F1A2E" },
            { name: "ChatGPT", logo: OpenAILogo, border: OPENAI_GREEN, bg: "#0F2018" },
            { name: "Grok", logo: GrokLogo, border: TEXT, bg: "#1A1A1A" },
          ].map((ai, i) => {
            const Logo = ai.logo;
            return (
              <g key={i} transform={`translate(${-360 + i * 240}, 0)`}>
                <rect x={-90} y={-90} width={180} height={180} rx={10} fill={ai.bg} stroke={ai.border} strokeWidth={2}
                  style={{ filter: `drop-shadow(0 8px 24px ${ai.border}cc)` }} />
                <CornerBrackets x={-90} y={-90} w={180} h={180} color={ai.border} len={16} />
                {ai.name === "Claude" && <Logo x={-50} y={-50} size={100} />}
                {ai.name === "Gemini" && <Logo x={-50} y={-50} size={100} />}
                {ai.name === "ChatGPT" && <Logo x={-50} y={-50} size={100} />}
                {ai.name === "Grok" && <Logo x={-50} y={-50} size={100} />}
                <text x={0} y={130} fontSize={22} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{ai.name}</text>
              </g>
            );
          })}
        </g>

        {/* Money winner pill */}
        <g transform="translate(540, 1530)">
          <rect x={-460} y={-90} width={920} height={180} rx={14} fill={PANEL} stroke={GOLD} strokeWidth={3}
            style={{ filter: `drop-shadow(0 12px 36px ${GOLD})` }} />
          <CornerBrackets x={-460} y={-90} w={920} h={180} color={GOLD} />
          <text x={0} y={-22} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>● GOOGLE WIN</text>
          <text x={0} y={42} fontSize={56} fill="url(#holoTitle)" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight={900}>$1 TỶ ĐÔ / NĂM</text>
        </g>

        {/* Bottom WWDC pill */}
        <g transform="translate(540, 1740)">
          <rect x={-340} y={-44} width={680} height={88} rx={12} fill={PANEL} stroke={ACCENT} strokeWidth={2.5} />
          <CornerBrackets x={-340} y={-44} w={680} h={88} color={ACCENT} len={18} />
          <text x={0} y={11} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>WWDC 08/06 · MÙA THU 2026</text>
        </g>

        {/* Bottom CTA */}
        <text x={540} y={1860} fontSize={24} fill={TEXT_DIM} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} opacity={0.7}>
          ↓ Theo dõi · tin AI nóng nhất
        </text>
      </svg>
    </AbsoluteFill>
  );
};
