import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadEBGaramond("italic", { weights: ["600", "700"], subsets: ["vietnamese", "latin", "latin-ext"] });

const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";
const GREEN = "#3FA85A";
const BLUE = "#4A7AC8";
const RED = "#D03020";

export const ClaudeX2LimitThumbnail: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <filter id="cx2tPN">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="73" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
          </filter>
          <radialGradient id="cx2tVig" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#cx2tPN)" />
        <rect width={W} height={H} fill="url(#cx2tVig)" />

        {/* Top NEWS sticker */}
        <g transform="translate(540, 170)">
          <rect x={-280} y={-46} width={560} height={92} rx={46} fill={RED} stroke={INK} strokeWidth={3.5} />
          <circle cx={-220} cy={0} r={11} fill="#FFF" />
          <text x={0} y={14} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TIN MỚI · 06/05/2026</text>
        </g>

        {/* "Claude Code" pill + "BUFF MẠNH 💪" */}
        <g transform="translate(540, 320)">
          <rect x={-300} y={-50} width={600} height={100} rx={20} fill={INK} stroke={INK} strokeWidth={3} />
          <text x={0} y={18} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CLAUDE CODE BUFF 💪</text>
        </g>

        {/* "tới mức..." line */}
        <g transform="translate(540, 460)">
          <text x={0} y={0} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.75}>tới mức gói…</text>
        </g>

        {/* MAIN: Pro ≈ Max compare */}
        <g transform="translate(540, 720)">
          <g transform="translate(-280, 0)">
            <rect x={-180} y={-130} width={360} height={260} rx={28} fill={BLUE} stroke={INK} strokeWidth={4}
              filter="drop-shadow(0 10px 22px rgba(0,0,0,0.18))" />
            <text x={0} y={-40} fontSize={120} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Pro</text>
            <text x={0} y={30} fontSize={28} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.85}>(MỚI)</text>
            <text x={0} y={80} fontSize={22} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>x2 limit · bỏ peak</text>
          </g>
          <text x={0} y={20} fontSize={140} fill={GOLD} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
            style={{ filter: "drop-shadow(0 8px 18px rgba(229,165,59,0.5))" }}>≈</text>
          <g transform="translate(280, 0)">
            <rect x={-180} y={-130} width={360} height={260} rx={28} fill={ACCENT} stroke={INK} strokeWidth={4}
              filter="drop-shadow(0 10px 22px rgba(0,0,0,0.18))" />
            <text x={0} y={-40} fontSize={120} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Max</text>
            <text x={0} y={30} fontSize={28} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.85}>(CŨ)</text>
            <text x={0} y={80} fontSize={22} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>baseline</text>
          </g>
        </g>

        {/* "GẦN BẰNG NHAU LUÔN" */}
        <g transform="translate(540, 1080)">
          <rect x={-380} y={-50} width={760} height={100} rx={50} fill={GOLD} stroke={INK} strokeWidth={3.5} />
          <text x={0} y={14} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>GẦN NGANG NHAU LUÔN 🤯</text>
        </g>

        {/* 3 fix bullets */}
        <g transform="translate(540, 1230)">
          {[
            { txt: "x2 LIMIT", color: ACCENT },
            { txt: "GỠ PEAK", color: GREEN },
            { txt: "OPUS API ↑", color: BLUE },
          ].map((it, i) => (
            <g key={i} transform={`translate(${-280 + i * 280}, 0)`}>
              <rect x={-130} y={-32} width={260} height={64} rx={32} fill={it.color} stroke={INK} strokeWidth={3} />
              <text x={0} y={10} fontSize={22} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{it.txt}</text>
            </g>
          ))}
        </g>

        {/* SpaceX twist */}
        <g transform="translate(540, 1450)">
          <rect x={-440} y={-80} width={880} height={160} rx={24} fill={INK} stroke={INK} strokeWidth={3} />
          <text x={0} y={-20} fontSize={36} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>+ 220.000 GPU NVIDIA 🚀</text>
          <text x={0} y={30} fontSize={26} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Anthropic × SpaceX Colossus</text>
        </g>

        {/* Bottom CTA */}
        <text x={540} y={1720} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>
          👇 SAVE · COMMENT bạn xài Pro hay Max
        </text>
      </svg>
    </AbsoluteFill>
  );
};
