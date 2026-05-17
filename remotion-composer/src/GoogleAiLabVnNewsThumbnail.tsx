import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "700"], subsets: ["latin"] });

const W = 1080, H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";
const RED = "#D03020";
const NAVY = "#1E3A8A";
const GREEN = "#1B7A4D";
const SOFT = "#FAFAF5";
const IVORY = "#F5F5F0";

export const GoogleAiLabVnNewsThumbnail: React.FC = () => (
  <AbsoluteFill>
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="thumbPN">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
          <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
        </filter>
      </defs>
      {/* BG paper cream + noise */}
      <rect width={W} height={H} fill={PAPER} />
      <rect width={W} height={H} filter="url(#thumbPN)" />

      {/* TIN NÓNG ticker top */}
      <g transform="translate(60, 80)">
        <rect x={0} y={0} width={420} height={84} rx={10} fill={RED} stroke={INK} strokeWidth={4} />
        <circle cx={42} cy={42} r={12} fill="#FFF" />
        <text x={72} y={56} fontSize={42} fill="#FFF" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
          TIN NÓNG · AI
        </text>
      </g>
      {/* Date stamp top-right */}
      <g transform={`translate(${W - 320}, 80)`}>
        <rect x={0} y={0} width={260} height={84} rx={10} fill={INK} stroke={INK} strokeWidth={4} />
        <text x={130} y={56} fontSize={30} fill={IVORY} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">
          13·05·2026
        </text>
      </g>

      {/* MAIN HOOK — stacked headlines */}
      <g transform={`translate(${W/2}, 350)`}>
        <text x={0} y={0} fontSize={56} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="3">
          BẢN TIN
        </text>
      </g>

      {/* GOOGLE logo card-like + AI LAB highlight */}
      <g transform={`translate(${W/2}, 540)`}>
        <text x={0} y={0} fontSize={130} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="-2">
          GOOGLE
        </text>
      </g>
      <g transform={`translate(${W/2}, 680)`}>
        <text x={0} y={0} fontSize={72} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
          đặt
        </text>
      </g>

      {/* AI LAB big red box */}
      <g transform={`translate(${W/2}, 780)`}>
        <rect x={-380} y={0} width={760} height={170} rx={24} fill={RED} stroke={INK} strokeWidth={6} transform="rotate(-2)" />
        <text x={0} y={130} fontSize={140} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2" transform="rotate(-2)">
          AI LAB
        </text>
      </g>

      <g transform={`translate(${W/2}, 1030)`}>
        <text x={0} y={0} fontSize={68} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
          tại <tspan fill={ACCENT} fontWeight={800}>VIỆT NAM</tspan>
        </text>
      </g>

      {/* 3 brand chips horizontal */}
      <g transform="translate(0, 1180)">
        {[
          { text: "GOOGLE", sub: "Labs", bg: NAVY, x: 60 },
          { text: "VNG", sub: "VN", bg: "#0066B3", x: 400 },
          { text: "ĐHQG", sub: "HCM", bg: ACCENT, x: 740 },
        ].map((b, i) => (
          <g key={i} transform={`translate(${b.x}, 0)`}>
            <rect x={0} y={0} width={280} height={120} rx={16} fill={b.bg} stroke={INK} strokeWidth={4} />
            <text x={140} y={55} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{b.text}</text>
            <text x={140} y={90} fontSize={20} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.85}>{b.sub}</text>
          </g>
        ))}
        {/* × between */}
        <text x={365} y={75} fontSize={40} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.5}>×</text>
        <text x={705} y={75} fontSize={40} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.5}>×</text>
      </g>

      {/* Subhook */}
      <g transform={`translate(${W/2}, 1430)`}>
        <rect x={-460} y={-50} width={920} height={120} rx={20} fill={SOFT} stroke={INK} strokeWidth={4} />
        <text x={0} y={0} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
          Tại sao Google chọn
        </text>
        <text x={0} y={50} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">
          VN, không phải SG?
        </text>
      </g>

      {/* "ĐỘC QUYỀN" stamp */}
      <g transform={`translate(${W - 280}, 1620) rotate(-8)`}>
        <rect x={-180} y={-50} width={360} height={100} rx={14} fill={GREEN} stroke={INK} strokeWidth={4} />
        <text x={0} y={5} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="2">
          ĐỘC QUYỀN
        </text>
        <text x={0} y={35} fontSize={16} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.9}>
          BẢN TIN AI
        </text>
      </g>

      {/* Bottom: source + ticker */}
      <g transform={`translate(60, 1820)`}>
        <text x={0} y={0} fontSize={24} fill={INK} fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={0.7}>
          📡 SOURCE · TNGlobal · Google Cloud
        </text>
      </g>
    </svg>
  </AbsoluteFill>
);
