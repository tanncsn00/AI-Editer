import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;
const BG = "#0A0814";
const CARD = "#140F26";
const CARD2 = "#1A1236";
const RED = "#FF5470";
const VIO = "#A78BFF";
const CYAN = "#2BE2FF";
const AMBER = "#FFC24B";
const TEXT = "#E7E4F7";
const SEC = "#A9A4D4";
const MUTE = "#5E578A";

const Bracket: React.FC<{ x: number; y: number; w: number; h: number; c: string; b?: number; sw?: number }> = ({ x, y, w, h, c, b = 22, sw = 3 }) => (
  <g stroke={c} strokeWidth={sw} fill="none" opacity={0.95} strokeLinecap="round">
    <path d={`M ${x} ${y + b} L ${x} ${y} L ${x + b} ${y}`} />
    <path d={`M ${x + w - b} ${y} L ${x + w} ${y} L ${x + w} ${y + b}`} />
    <path d={`M ${x} ${y + h - b} L ${x} ${y + h} L ${x + b} ${y + h}`} />
    <path d={`M ${x + w - b} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - b}`} />
  </g>
);

export const MeetingDaoThumbnail: React.FC = () => {
  const vx = W / 2, vy = 1210;
  const rows = [
    { l: "\"họp nhanh 5 phút\"", r: "15p sau mới bắt đầu 💀", c: VIO },
    { l: "\"à… em có 1 ý nhỏ\"", r: "cả điện ngồi xuống 🪑", c: RED },
    { l: "\"chỉ sửa một chút\"", r: "đổi cả API · Database 💀", c: CYAN },
    { l: "chốt phương án A", r: "CEO: \"sao ko làm B?\" 🫠", c: AMBER },
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="mtGrid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M 64 0 L 0 0 0 64" fill="none" stroke={VIO} strokeWidth="0.6" opacity="0.05" /></pattern>
          <radialGradient id="mtGlow" cx="50%" cy="24%" r="62%"><stop offset="0%" stopColor={VIO} stopOpacity="0.14" /><stop offset="100%" stopColor={BG} stopOpacity="0" /></radialGradient>
          <radialGradient id="mtVig" cx="50%" cy="42%" r="74%"><stop offset="54%" stopColor={BG} stopOpacity="0" /><stop offset="100%" stopColor="#03020A" stopOpacity="0.82" /></radialGradient>
          <filter id="mtGlowF" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#mtGrid)" />
        <rect width={W} height={H} fill="url(#mtGlow)" />
        <g stroke={VIO} strokeWidth={1} opacity={0.15}>
          {Array.from({ length: 13 }, (_, i) => i - 6).map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} />
          ))}
          {[0, 80, 190, 340].map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} opacity={0.6 - i * 0.1} />
          ))}
        </g>
        <rect width={W} height={H} fill="url(#mtVig)" />
        <Bracket x={44} y={48} w={W - 88} h={H - 96} c={VIO} b={44} sw={2.5} />

        <g transform={`translate(90, 168)`}>
          <path d="M 0 -26 L 0 12 L 20 12" stroke={RED} strokeWidth={3} fill="none" strokeLinecap="round" />
          <text x={32} y={6} fontSize={22} fill={VIO} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">TRUYỀN KỲ · CHỐN CÔNG SỞ</text>
        </g>
        <g transform={`translate(${W - 110}, 168)`}>
          <text x={0} y={6} fontSize={20} fill={SEC} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">MEET</text>
          <circle cx={18} cy={-1} r={7} fill={RED} />
        </g>

        {/* title */}
        <g transform={`translate(${W / 2}, 330)`}>
          <text x={0} y={0} fontSize={38} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">NHỮNG CUỘC HỌP KHIẾN</text>
          <text x={0} y={116} fontSize={108} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#mtGlowF)">ĐẠO TÂM</text>
          <text x={0} y={210} fontSize={108} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#mtGlowF)">TAN VỠ 💀</text>
        </g>

        {/* kiep rows */}
        <g transform={`translate(0, 680)`}>
          {rows.map((r, i) => (
            <g key={i}>
              <rect x={70} y={i * 116} width={W - 140} height={96} rx={10} fill={CARD} fillOpacity={0.74} stroke={r.c} strokeWidth={1.5} strokeOpacity={0.5} />
              <Bracket x={70} y={i * 116} w={W - 140} h={96} c={r.c} b={16} sw={2.5} />
              <text x={108} y={i * 116 + 60} fontSize={30} fill={TEXT} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.l}</text>
              <text x={W - 108} y={i * 116 + 60} fontSize={26} fill={r.c} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.r}</text>
            </g>
          ))}
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1350)`}>
          <rect x={-505} y={-96} width={1010} height={250} rx={12} fill={CARD2} fillOpacity={0.85} stroke={RED} strokeWidth={1.5} strokeOpacity={0.5} />
          <Bracket x={-505} y={-96} w={1010} h={250} c={RED} b={26} sw={3} />
          <text x={0} y={-40} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thiên kiếp không ở Production · Bug · Deadline</text>
          <text x={0} y={34} fontSize={46} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#mtGlowF)">mà ở câu: "à… tiện đây…"</text>
          <text x={0} y={104} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>→ hôm nay lại không tan làm đúng giờ 🤣</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 80})`}>
          <text x={0} y={0} fontSize={18} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">// truyền kỳ · chốn công sở</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
