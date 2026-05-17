import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";
const RED = "#D03020";

export const Hook1300Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <filter id="thumbHK">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="29" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
          </filter>
          <radialGradient id="thumbHKVig" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#thumbHK)" />
        <rect width={W} height={H} fill="url(#thumbHKVig)" />

        {/* Top sticker */}
        <g transform="translate(540, 200)">
          <rect x={-280} y={-46} width={560} height={92} rx={46} fill={INK} />
          <text x={0} y={14} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>📊 1300 HOOK NGHIÊN CỨU</text>
        </g>

        {/* Big "99%" */}
        <g transform="translate(540, 590)">
          <text x={0} y={0} fontSize={460} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} dominantBaseline="middle"
            style={{ filter: "drop-shadow(0 12px 28px rgba(232,88,56,0.45))" }}>99%</text>
        </g>

        {/* "creator viết hook SAI" */}
        <text x={540} y={920} fontSize={62} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>creator viết hook</text>
        <g transform="translate(540, 1010)">
          <rect x={-180} y={-40} width={360} height={90} rx={12} fill={RED} stroke={INK} strokeWidth={4} />
          <text x={0} y={20} fontSize={64} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>SAI</text>
        </g>

        {/* "5 cách đúng" highlight */}
        <g transform="translate(540, 1280)">
          <rect x={-380} y={-90} width={760} height={180} rx={20} fill={GOLD} stroke={INK} strokeWidth={5} />
          <text x={0} y={-15} fontSize={56} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ĐÂY LÀ</text>
          <text x={0} y={55} fontSize={70} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>5 CÁCH ĐÚNG</text>
        </g>

        {/* 5 numbered dots */}
        <g transform="translate(540, 1500)">
          {[1, 2, 3, 4, 5].map((n, i) => {
            const x = -200 + i * 100;
            return (
              <g key={n} transform={`translate(${x}, 0)`}>
                <circle cx={0} cy={0} r={32} fill={ACCENT} stroke={INK} strokeWidth={3} />
                <text x={0} y={11} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{n}</text>
              </g>
            );
          })}
        </g>

        {/* Bottom CTA */}
        <text x={540} y={1700} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>
          👇 SAVE · PIN POST
        </text>
        <text x={540} y={1755} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={0.5}>
          Brock Johnson study · 1300 viral reels
        </text>
      </svg>
    </AbsoluteFill>
  );
};
