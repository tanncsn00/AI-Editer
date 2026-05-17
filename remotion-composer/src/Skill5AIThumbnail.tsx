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
const GREEN = "#3FA85A";
const BLUE = "#4A7AC8";

export const Skill5AIThumbnail: React.FC = () => {
  const skills = [
    { num: "1", emo: "🎯", color: ACCENT },
    { num: "2", emo: "💬", color: BLUE },
    { num: "3", emo: "🎨", color: GOLD },
    { num: "4", emo: "🧭", color: GREEN },
    { num: "5", emo: "⚡", color: ACCENT },
  ];

  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <filter id="s5tPN">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="51" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
          </filter>
          <radialGradient id="s5tVig" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#s5tPN)" />
        <rect width={W} height={H} fill="url(#s5tVig)" />

        {/* Top warning sticker */}
        <g transform="translate(540, 200)">
          <rect x={-300} y={-46} width={600} height={92} rx={46} fill={RED} stroke={INK} strokeWidth={3.5} />
          <text x={0} y={14} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>⚠️ AI ĐÀO THẢI HÀNG LOẠT</text>
        </g>

        {/* Big "5 KỸ NĂNG" */}
        <g transform="translate(540, 480)">
          <text x={0} y={0} fontSize={300} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} dominantBaseline="middle"
            style={{ filter: "drop-shadow(0 12px 28px rgba(232,88,56,0.45))" }}>5</text>
        </g>

        {/* "KỸ NĂNG" */}
        <g transform="translate(540, 720)">
          <text x={0} y={0} fontSize={130} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>KỸ NĂNG</text>
        </g>

        {/* "AI không thay được" */}
        <g transform="translate(540, 840)">
          <rect x={-380} y={-50} width={760} height={100} rx={20} fill={INK} stroke={INK} strokeWidth={3} />
          <text x={0} y={20} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AI KHÔNG THỂ THAY ĐƯỢC</text>
        </g>

        {/* 5 skill icons grid */}
        <g transform="translate(0, 1100)">
          {skills.map((s, i) => {
            const x = 80 + i * 188;
            return (
              <g key={i} transform={`translate(${x + 84}, 80)`}>
                <rect x={-78} y={-78} width={156} height={156} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4}
                  filter="drop-shadow(0 8px 14px rgba(0,0,0,0.18))" />
                <circle cx={-50} cy={-50} r={28} fill={s.color} stroke={INK} strokeWidth={3} />
                <text x={-50} y={-40} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{s.num}</text>
                <text x={5} y={30} fontSize={70} textAnchor="middle">{s.emo}</text>
              </g>
            );
          })}
        </g>

        {/* CTA card */}
        <g transform="translate(540, 1500)">
          <rect x={-440} y={-90} width={880} height={180} rx={24} fill={GOLD} stroke={INK} strokeWidth={5} />
          <text x={0} y={-20} fontSize={48} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>HỌC NGAY</text>
          <text x={0} y={45} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>trước khi quá muộn</text>
        </g>

        {/* Bottom CTA */}
        <text x={540} y={1700} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>
          👇 SAVE · COMMENT số bạn mạnh nhất
        </text>
      </svg>
    </AbsoluteFill>
  );
};
