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

export const ComboFreeStackThumbnail: React.FC = () => {
  const tools = [
    { num: "1", emo: "📝", color: GREEN, name: "ChatGPT" },
    { num: "2", emo: "🎙️", color: BLUE, name: "11Labs" },
    { num: "3", emo: "🎬", color: PURPLE, name: "Kling" },
    { num: "4", emo: "✂️", color: ACCENT, name: "CapCut" },
    { num: "5", emo: "🔥", color: RED, name: "Viral" },
    { num: "6", emo: "🔗", color: TEAL, name: "n8n" },
  ];
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <filter id="cfsTPN">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="91" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
          </filter>
          <radialGradient id="cfsTVig" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#cfsTPN)" />
        <rect width={W} height={H} fill="url(#cfsTVig)" />

        {/* Top label */}
        <g transform="translate(540, 200)">
          <rect x={-300} y={-46} width={600} height={92} rx={46} fill={INK} stroke={INK} strokeWidth={3.5} />
          <text x={0} y={14} fontSize={34} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>STACK FARM CONTENT</text>
        </g>

        {/* Big "6 TOOL" + "FREE" */}
        <g transform="translate(540, 460)">
          <text x={-220} y={0} fontSize={300} fill={ACCENT} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}
            style={{ filter: "drop-shadow(0 14px 32px rgba(232,88,56,0.5))" }}>6</text>
          <text x={140} y={-30} fontSize={100} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TOOL</text>
          <text x={140} y={70} fontSize={110} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>FREE</text>
        </g>

        {/* Question line */}
        <g transform="translate(540, 800)">
          <text x={0} y={0} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>dân farm content thật xài 👇</text>
        </g>

        {/* 6 tool grid 3x2 */}
        <g transform="translate(540, 1060)">
          {tools.map((tool, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = (col - 1) * 300;
            const y = row * 240;
            return (
              <g key={i} transform={`translate(${x}, ${y})`}>
                <rect x={-120} y={-100} width={240} height={200} rx={24} fill="#FAFAF5" stroke={INK} strokeWidth={4}
                  filter="drop-shadow(0 8px 16px rgba(0,0,0,0.18))" />
                <circle cx={-86} cy={-66} r={28} fill={tool.color} stroke={INK} strokeWidth={3} />
                <text x={-86} y={-56} fontSize={32} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{tool.num}</text>
                <text x={5} y={20} fontSize={70} textAnchor="middle">{tool.emo}</text>
                <text x={0} y={75} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{tool.name}</text>
              </g>
            );
          })}
        </g>

        {/* CTA bottom */}
        <text x={540} y={1720} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>
          👇 SAVE · COMMENT tool nào dùng rồi
        </text>
      </svg>
    </AbsoluteFill>
  );
};
