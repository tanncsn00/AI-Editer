import { AbsoluteFill, Img, staticFile } from "remotion";
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
const GREEN = "#3FA85A";
const BLUE = "#4A7AC8";
const PURPLE = "#7A4AC8";

export const PenpotMcpDesignThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <svg width={W} height={H}>
        <defs>
          <filter id="penPNTh">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="42" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
          </filter>
          <radialGradient id="penVigTh" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#penPNTh)" />
        <rect width={W} height={H} fill="url(#penVigTh)" />

        {/* Top sticker FREE OPEN SOURCE */}
        <g transform="translate(540, 150)">
          <rect x={-280} y={-42} width={560} height={84} rx={20} fill={GOLD} stroke={INK} strokeWidth={3.5} />
          <text x={0} y={12} fontSize={30} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FREE · OPEN SOURCE · MCP</text>
        </g>

        {/* Big "10 phút" stacked */}
        <g transform="translate(540, 380)">
          <text x={0} y={0} fontSize={340} fill={ACCENT} textAnchor="middle" dominantBaseline="middle" fontFamily="'EB Garamond', serif" fontWeight={700} fontStyle="italic"
            style={{ filter: "drop-shadow(0 14px 32px rgba(232,88,56,0.5))" }}>10</text>
          <text x={0} y={180} fontSize={120} fill={INK} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>phút.</text>
        </g>

        {/* Subtitle */}
        <g transform="translate(540, 700)">
          <text x={0} y={0} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>2 PROMPT · 1 TRANG WEB</text>
        </g>

        {/* 3-stage flow row: AI → DESIGN → CODE */}
        <g transform="translate(540, 830)">
          {/* Stage 1: AI prompt */}
          <g transform="translate(-340, 0)">
            <circle cx={0} cy={0} r={70} fill={INK} stroke={INK} strokeWidth={4} />
            <text x={0} y={-5} fontSize={50} textAnchor="middle" dominantBaseline="middle">💬</text>
            <text x={0} y={28} fontSize={18} fill="#FFF" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>AI</text>
            <text x={0} y={110} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PROMPT</text>
          </g>

          {/* Arrow 1 */}
          <text x={-180} y={12} fontSize={70} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→</text>

          {/* Stage 2: DESIGN */}
          <g transform="translate(0, 0)">
            <circle cx={0} cy={0} r={70} fill={ACCENT} stroke={INK} strokeWidth={4} />
            <text x={0} y={20} fontSize={70} textAnchor="middle" dominantBaseline="middle">🎨</text>
            <text x={0} y={110} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>DESIGN</text>
          </g>

          {/* Arrow 2 */}
          <text x={180} y={12} fontSize={70} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→</text>

          {/* Stage 3: CODE */}
          <g transform="translate(340, 0)">
            <circle cx={0} cy={0} r={70} fill={BLUE} stroke={INK} strokeWidth={4} />
            <text x={0} y={20} fontSize={70} textAnchor="middle" dominantBaseline="middle">💻</text>
            <text x={0} y={110} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CODE</text>
          </g>
        </g>

        {/* Penpot label tag */}
        <g transform="translate(285, 1080)">
          <rect x={-90} y={-22} width={180} height={44} rx={22} fill={ACCENT} stroke={INK} strokeWidth={2.5} />
          <text x={0} y={6} fontSize={20} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PENPOT</text>
        </g>

        {/* localhost label tag */}
        <g transform="translate(795, 1080)">
          <rect x={-110} y={-22} width={220} height={44} rx={22} fill={BLUE} stroke={INK} strokeWidth={2.5} />
          <text x={0} y={6} fontSize={18} fill="#FFF" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>localhost:3000</text>
        </g>
      </svg>

      {/* Penpot screenshot mockup */}
      <div style={{ position: "absolute", left: 90, top: 1130, width: 390, height: 360, borderRadius: 18, overflow: "hidden", border: `4px solid ${INK}`, boxShadow: "0 16px 32px rgba(0,0,0,0.25)", transform: "rotate(-3deg)" }}>
        <div style={{ height: 32, background: INK, display: "flex", alignItems: "center", padding: "0 12px", gap: 5 }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
          <div style={{ marginLeft: 14, color: "#9AA0A6", fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>Penpot</div>
        </div>
        <Img src={staticFile("penpot_workspace.png")} style={{ width: "100%", height: 328, objectFit: "cover", objectPosition: "center top" }} />
      </div>

      {/* localhost screenshot */}
      <div style={{ position: "absolute", right: 90, top: 1170, width: 390, height: 320, borderRadius: 18, overflow: "hidden", border: `4px solid ${INK}`, boxShadow: "0 16px 32px rgba(0,0,0,0.25)", transform: "rotate(3deg)" }}>
        <div style={{ height: 32, background: "#fff", display: "flex", alignItems: "center", padding: "0 12px", gap: 5, borderBottom: "1px solid #ddd" }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FEBC2E" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840" }} />
          <div style={{ flex: 1, marginLeft: 12, background: "#f3f3f3", borderRadius: 6, padding: "3px 9px", color: "#444", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>localhost:3000</div>
        </div>
        <Img src={staticFile("penpot_localhost_site.png")} style={{ width: "100%", height: 288, objectFit: "cover", objectPosition: "center top" }} />
      </div>

      <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {/* Bottom verdict */}
        <g transform="translate(540, 1620)">
          <rect x={-460} y={-70} width={920} height={140} rx={28} fill={INK} stroke={INK} strokeWidth={4} />
          <text x={0} y={-10} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PENPOT + AI · MCP</text>
          <text x={0} y={42} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Design → Code · 1 LỆNH</text>
        </g>

        {/* Stamp */}
        <g transform="translate(540, 1810)">
          <rect x={-340} y={-44} width={680} height={88} rx={44} fill={GREEN} stroke={INK} strokeWidth={3.5} />
          <text x={0} y={11} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FREE VĨNH VIỄN · NO FIGMA $</text>
        </g>

        {/* Bottom CTA */}
        <text x={540} y={1888} fontSize={24} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.65}>
          ↓ link mô tả · cài 1 lệnh
        </text>
      </svg>
    </AbsoluteFill>
  );
};
