import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";
const RED = "#D03020";
const BLUE = "#4A7AC8";
const GREEN = "#3FA85A";

export const AgentControlFlowThumbnail: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <filter id="acftPN">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="33" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
          </filter>
          <radialGradient id="acftVig" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#acftPN)" />
        <rect width={W} height={H} fill="url(#acftVig)" />

        {/* HN sticker top */}
        <g transform="translate(540, 180)">
          <rect x={-260} y={-46} width={520} height={92} rx={20} fill="#FF6600" stroke={INK} strokeWidth={3.5} />
          <text x={0} y={14} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>HN VIRAL · 583 PTS</text>
        </g>

        {/* Big "99% SAI" */}
        <g transform="translate(540, 460)">
          <text x={-180} y={0} fontSize={300} fill={ACCENT} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
            style={{ filter: "drop-shadow(0 14px 32px rgba(232,88,56,0.5))" }}>99%</text>
          <text x={150} y={0} fontSize={150} fill={INK} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>SAI</text>
        </g>

        {/* "đang làm AI agent" */}
        <g transform="translate(540, 700)">
          <text x={0} y={0} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đang làm AI agent kiểu này 👇</text>
        </g>

        {/* Code block */}
        <g transform="translate(540, 950)">
          <rect x={-440} y={-150} width={880} height={300} rx={20} fill={INK} stroke={INK} strokeWidth={4}
            filter="drop-shadow(0 10px 22px rgba(0,0,0,0.22))" />
          <circle cx={-410} cy={-118} r={9} fill="#FF5F57" />
          <circle cx={-385} cy={-118} r={9} fill="#FEBC2E" />
          <circle cx={-360} cy={-118} r={9} fill="#28C840" />
          <text x={-380} y={-50} fontSize={42} fill="#FF6B6B" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>"MANDATORY:</text>
          <text x={-380} y={10} fontSize={42} fill="#FFEB3B" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>  DO NOT SKIP!"</text>
          <text x={-380} y={90} fontSize={28} fill="#888" fontFamily="'JetBrains Mono', monospace">{"// đụng trần rồi 🤡"}</text>
        </g>

        {/* Verdict pill */}
        <g transform="translate(540, 1300)">
          <rect x={-440} y={-50} width={880} height={100} rx={50} fill={GOLD} stroke={INK} strokeWidth={4} />
          <text x={0} y={14} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Agent cần CONTROL FLOW · không phải PROMPT</text>
        </g>

        {/* 3 options row */}
        <g transform="translate(540, 1530)">
          {[
            { emo: "👶", txt: "BABYSITTER", color: BLUE },
            { emo: "🔍", txt: "AUDITOR", color: GOLD },
            { emo: "🙏", txt: "PRAYER", color: RED },
          ].map((it, i) => (
            <g key={i} transform={`translate(${-280 + i * 280}, 0)`}>
              <rect x={-130} y={-60} width={260} height={140} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={3.5}
                filter="drop-shadow(0 6px 12px rgba(0,0,0,0.18))" />
              <rect x={-130} y={-60} width={14} height={140} rx={4} fill={it.color} />
              <text x={0} y={5} fontSize={70} textAnchor="middle">{it.emo}</text>
              <text x={0} y={55} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{it.txt}</text>
            </g>
          ))}
        </g>

        {/* Bottom CTA */}
        <text x={540} y={1820} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>
          👇 Mày đang là số mấy?
        </text>
      </svg>
    </AbsoluteFill>
  );
};
