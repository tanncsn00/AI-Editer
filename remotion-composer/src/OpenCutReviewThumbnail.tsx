import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";

export const OpenCutReviewThumbnail: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <filter id="ocThumbPN">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="37" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
          </filter>
          <radialGradient id="ocThumbVig" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#ocThumbPN)" />
        <rect width={W} height={H} fill="url(#ocThumbVig)" />

        {/* Top sticker */}
        <g transform="translate(540, 200)">
          <rect x={-280} y={-46} width={560} height={92} rx={46} fill={INK} />
          <text x={0} y={14} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🎙️ PODCAST → CLIP VIRAL</text>
        </g>

        {/* Big "1h → 3p" */}
        <g transform="translate(540, 510)">
          <text x={-200} y={0} fontSize={220} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} dominantBaseline="middle">1h</text>
          <text x={0} y={0} fontSize={140} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} dominantBaseline="middle">→</text>
          <text x={210} y={0} fontSize={220} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} dominantBaseline="middle"
            style={{ filter: "drop-shadow(0 12px 28px rgba(232,88,56,0.45))" }}>3p</text>
        </g>

        {/* "5 CLIP VIRAL" */}
        <g transform="translate(540, 770)">
          <text x={0} y={0} fontSize={88} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>5 CLIP VIRAL</text>
        </g>

        {/* 5 mini clip cards */}
        <g transform="translate(0, 920)">
          {[0, 1, 2, 3, 4].map(i => {
            const x = 80 + i * 188;
            const score = ["9.2", "8.8", "8.5", "8.1", "7.9"][i];
            return (
              <g key={i} transform={`translate(${x + 84}, 80)`}>
                <rect x={-78} y={-78} width={156} height={156} rx={14} fill={GOLD} stroke={INK} strokeWidth={3.5}
                  filter="drop-shadow(0 8px 14px rgba(229,165,59,0.4))" />
                <text x={0} y={-15} fontSize={50} textAnchor="middle">🎬</text>
                <text x={0} y={35} fontSize={30} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{score}</text>
                <text x={0} y={62} fontSize={16} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>viral</text>
              </g>
            );
          })}
        </g>

        {/* "FREE 100%" big card */}
        <g transform="translate(540, 1320)">
          <rect x={-380} y={-90} width={760} height={180} rx={20} fill={ACCENT} stroke={INK} strokeWidth={5} />
          <text x={0} y={-15} fontSize={70} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FREE 100%</text>
          <text x={0} y={45} fontSize={28} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.95}>không cloud · không API · MIT open source</text>
        </g>

        {/* GitHub badge */}
        <g transform="translate(540, 1530)">
          <rect x={-260} y={-40} width={520} height={80} rx={40} fill={INK} stroke={INK} strokeWidth={3} />
          <text x={0} y={18} fontSize={28} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>github.com/Ekaanth/OpenCut-AI</text>
        </g>

        {/* Bottom CTA */}
        <text x={540} y={1690} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>
          👇 SAVE · COMMENT "OpenCut"
        </text>
        <text x={540} y={1750} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.5}>
          Tôi gửi link riêng cho bạn
        </text>
      </svg>
    </AbsoluteFill>
  );
};
