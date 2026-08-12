import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
const TEXT_PRI = "#E8F0FF";
const TEXT_MUTE = "#5E7090";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const JADE = "#5BE8A8";
const VIOLET = "#B47AFF";
const WARNING_RED = "#FF6B6B";
const CRIMSON = "#FF4D6D";
const SLATE = "#A4B5D0";
const GRID = "#FFFFFF";

export const DauHieuAiXamNhapThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="dhtgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="dhtgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="dhtglow" cx="50%" cy="38%" r="62%">
            <stop offset="0%" stopColor={VIOLET} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="dhtg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#dhtgrid)" />
        <rect width={W} height={H} fill="url(#dhtgrid2)" />
        <rect width={W} height={H} fill="url(#dhtglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 175)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[NEURAL SCAN] · ĐẠO TÂM · 8</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        {/* title */}
        <g transform={`translate(${W / 2}, 330)`}>
          <text x={0} y={0} fontSize={48} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>DẤU HIỆU</text>
          <text x={0} y={92} fontSize={104} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1" filter="url(#dhtg)">AI XÂM NHẬP</text>
          <text x={0} y={170} fontSize={62} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#dhtg)">ĐẠO TÂM NGƯƠI</text>
        </g>

        {/* brain */}
        <g transform={`translate(${W / 2}, 720)`}>
          <circle cx={0} cy={0} r={120} fill={BG_CARD} stroke={VIOLET} strokeWidth={5} filter="url(#dhtg)" />
          <text x={0} y={42} fontSize={130} textAnchor="middle">🧠</text>
        </g>

        {/* killer chat */}
        <g transform={`translate(0, 980)`}>
          <rect x={W / 2 - 470} y={0} width={620} height={120} rx={20} fill={BG_CARD} stroke={CRIMSON} strokeWidth={2.5} />
          <text x={W / 2 - 440} y={40} fontSize={18} fill={CRIMSON} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>🤔 Ngươi</text>
          <text x={W / 2 - 440} y={88} fontSize={30} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Ta có lệ thuộc AI không?</text>

          <rect x={W / 2 - 150} y={150} width={620} height={110} rx={20} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
          <text x={W / 2 + 440} y={190} fontSize={18} fill={JADE} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>🤖 AI</text>
          <text x={W / 2 + 440} y={236} fontSize={38} fill={AMBER_BRIGHT} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Không hề." 😊</text>
        </g>

        {/* bottom hook */}
        <g transform={`translate(${W / 2}, 1500)`}>
          <line x1={-340} y1={-44} x2={340} y2={-44} stroke={AMBER} strokeWidth={1} />
          <text x={0} y={2} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">…và ngươi TIN ngay lập tức</text>
          <text x={0} y={52} fontSize={26} fill={CRIMSON} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→ đạo tâm đã bị xâm nhập 😨</text>
          <line x1={-340} y1={84} x2={340} y2={84} stroke={AMBER} strokeWidth={1} />
        </g>

        <g transform={`translate(${W / 2}, 1660)`}>
          <text x={0} y={0} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Đạo hữu trúng mấy dấu hiệu rồi?</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới AI · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
