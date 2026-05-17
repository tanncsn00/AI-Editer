import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";
const GREEN = "#3FA85A";
const BLUE = "#4A7AC8";
const RED = "#D03020";
const PURPLE = "#7A4AC8";
const TEAL = "#3FA8A8";

export const BanTinAIThumbnail: React.FC = () => {
  const tags = [
    { txt: "⚖️ MURATI vs ALTMAN", color: PURPLE },
    { txt: "🚨 LONG LAKE $6.3B", color: RED },
    { txt: "🎙️ OPENAI VOICE API", color: GREEN },
    { txt: "💻 PERPLEXITY MAC", color: BLUE },
    { txt: "✂️ OPENREEL", color: ACCENT },
    { txt: "💰 RAMP $40B", color: GOLD },
    { txt: "🏛️ ANTHROPIC AGENTS", color: TEAL },
  ];

  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <filter id="btTPN">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="55" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
          </filter>
          <radialGradient id="btTVig" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#btTPN)" />
        <rect width={W} height={H} fill="url(#btTVig)" />

        {/* LIVE pill top */}
        <g transform="translate(540, 180)">
          <rect x={-300} y={-46} width={600} height={92} rx={46} fill={RED} stroke={INK} strokeWidth={3.5} />
          <circle cx={-240} cy={0} r={11} fill="#FFF" />
          <text x={0} y={14} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>LIVE · 08/05/2026</text>
        </g>

        {/* Big "BẢN TIN AI" */}
        <g transform="translate(540, 460)">
          <text x={0} y={-110} fontSize={90} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BẢN TIN</text>
          <text x={0} y={70} fontSize={300} fill={ACCENT} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
            style={{ filter: "drop-shadow(0 14px 32px rgba(232,88,56,0.5))" }}>AI</text>
        </g>

        {/* Big "7 TIN NÓNG" */}
        <g transform="translate(540, 800)">
          <rect x={-380} y={-50} width={760} height={100} rx={50} fill={GOLD} stroke={INK} strokeWidth={4} />
          <text x={0} y={14} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🔥 7 TIN NÓNG NHẤT</text>
        </g>

        {/* Tags grid */}
        <g transform="translate(540, 990)">
          {tags.map((tag, i) => {
            const y = i * 95;
            return (
              <g key={i} transform={`translate(0, ${y})`}>
                <rect x={-450} y={-32} width={900} height={70} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={3.5}
                  filter="drop-shadow(0 4px 8px rgba(0,0,0,0.15))" />
                <rect x={-450} y={-32} width={14} height={70} rx={4} fill={tag.color} />
                <text x={-410} y={14} fontSize={32} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{tag.txt}</text>
              </g>
            );
          })}
        </g>

        {/* Bottom CTA */}
        <text x={540} y={1810} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>
          👇 FOLLOW · tin AI mỗi sáng 8h
        </text>
      </svg>
    </AbsoluteFill>
  );
};
