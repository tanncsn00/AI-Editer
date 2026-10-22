import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["700"], subsets: ["latin", "latin-ext", "vietnamese"] });

const W = 1080;
const H = 1920;
const BG_NAVY = "#0F1B2E";
const TEXT_PRI = "#E8F0FF";
const TEXT_SEC = "#A4B5D0";
const AMBER = "#FFC857";
const WARNING_RED = "#FF6B6B";
const JADE = "#5BE8A8";
const mono = { fontFamily: "'JetBrains Mono', monospace" };
const viet = { fontFamily: "'Be Vietnam Pro'" };

const PLOTS = [
  { x: 120, y: 1390, w: 260, h: 200, label: "LÔ A · ĐÃ CỌC" },
  { x: 410, y: 1390, w: 260, h: 200, label: "LÔ B · NHẢY GIÁ" },
  { x: 700, y: 1390, w: 260, h: 200, label: "LÔ C · CẮT LÁI" },
];

export const PovBdsThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <pattern id="tg" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.08" />
        </pattern>
        <pattern id="tg2" width="240" height="240" patternUnits="userSpaceOnUse">
          <path d="M 240 0 L 0 0 0 240" fill="none" stroke="#fff" strokeWidth="1" opacity="0.12" />
        </pattern>
        <radialGradient id="tglow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={AMBER} stopOpacity="0.16" />
          <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#tg)" />
      <rect width={W} height={H} fill="url(#tg2)" />
      <rect width={W} height={H} fill="url(#tglow)" />
      {PLOTS.map((p, i) => (
        <g key={i}>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={i === 2 ? WARNING_RED + "22" : "none"} stroke={i === 2 ? WARNING_RED : AMBER} strokeWidth={2} strokeDasharray={i === 1 ? "10 8" : undefined} />
          <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 8} fontSize={22} fill={i === 2 ? WARNING_RED : TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>
            {p.label}
          </text>
        </g>
      ))}
      <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
        <path d="M 30 30 L 30 70 M 30 30 L 70 30" fill="none" />
        <path d={`M ${W - 30} 30 L ${W - 30} 70 M ${W - 30} 30 L ${W - 70} 30`} fill="none" />
        <path d={`M 30 ${H - 30} L 30 ${H - 70} M 30 ${H - 30} L 70 ${H - 30}`} fill="none" />
        <path d={`M ${W - 30} ${H - 30} L ${W - 30} ${H - 70} M ${W - 30} ${H - 30} L ${W - 70} ${H - 30}`} fill="none" />
      </g>
    </svg>
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 230, gap: 34, textAlign: "center" }}>
      <div style={{ ...mono, fontSize: 30, fontWeight: 700, color: AMBER, letterSpacing: 8 }}>[ TRUYỀN KỲ · ĐỊA ỐC TÔNG ]</div>
      <div style={{ fontSize: 150 }}>🏯</div>
      <div style={{ ...viet, fontSize: 150, fontWeight: 900, color: AMBER, lineHeight: 0.95, letterSpacing: -5, textShadow: `0 0 70px ${AMBER}55` }}>POV:</div>
      <div style={{ ...viet, fontSize: 96, fontWeight: 900, color: TEXT_PRI, lineHeight: 1.05, letterSpacing: -2.5, padding: "0 70px" }}>
        TA LÀ MÔI GIỚI{"\n"}BẤT ĐỘNG SẢN
      </div>
      <div style={{ position: "relative", border: `3px solid ${WARNING_RED}`, background: WARNING_RED + "18", padding: "22px 44px", marginTop: 20 }}>
        <div style={{ ...viet, fontSize: 58, fontWeight: 900, color: WARNING_RED }}>LƯƠNG CỨNG: 0 ĐỒNG</div>
      </div>
      <div style={{ ...viet, fontSize: 52, fontWeight: 800, color: JADE, marginTop: 16 }}>“Sắp chốt rồi mẹ.”</div>
    </AbsoluteFill>
  </AbsoluteFill>
);
