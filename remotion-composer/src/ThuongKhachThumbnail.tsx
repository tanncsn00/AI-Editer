import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;
const BG = "#0A0812";
const CARD = "#12101C";
const CARD2 = "#171426";
const RED = "#FF5470";
const A = "#2BE2FF";
const GOLD = "#FFC24B";
const TEXT = "#ECE6F5";
const SEC = "#B0A8C4";
const MUTE = "#6E6685";

const Bracket: React.FC<{ x: number; y: number; w: number; h: number; c: string; b?: number; sw?: number }> = ({ x, y, w, h, c, b = 22, sw = 3 }) => (
  <g stroke={c} strokeWidth={sw} fill="none" opacity={0.95} strokeLinecap="round">
    <path d={`M ${x} ${y + b} L ${x} ${y} L ${x + b} ${y}`} />
    <path d={`M ${x + w - b} ${y} L ${x + w} ${y} L ${x + w} ${y + b}`} />
    <path d={`M ${x} ${y + h - b} L ${x} ${y + h} L ${x + b} ${y + h}`} />
    <path d={`M ${x + w - b} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - b}`} />
  </g>
);

export const ThuongKhachThumbnail: React.FC = () => {
  const vx = W / 2, vy = 1210;
  const rows = [
    { l: "\"việc này đơn giản\"", r: "yêu cầu = 0 💀", c: GOLD },
    { l: "\"chỉ sửa một chút\"", r: "đổi cả hệ thống 💀", c: RED },
    { l: "\"anh cần gấp\"", r: "4 ngày sau mới xem 🤣", c: A },
    { l: "\"tự sáng tạo đi\"", r: "\"không phải cái này\" 💀", c: RED },
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="tktGrid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M 64 0 L 0 0 0 64" fill="none" stroke={GOLD} strokeWidth="0.6" opacity="0.05" /></pattern>
          <radialGradient id="tktGlow" cx="50%" cy="24%" r="62%"><stop offset="0%" stopColor={GOLD} stopOpacity="0.12" /><stop offset="100%" stopColor={BG} stopOpacity="0" /></radialGradient>
          <radialGradient id="tktVig" cx="50%" cy="42%" r="74%"><stop offset="54%" stopColor={BG} stopOpacity="0" /><stop offset="100%" stopColor="#03020A" stopOpacity="0.82" /></radialGradient>
          <filter id="tktGlowF" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#tktGrid)" />
        <rect width={W} height={H} fill="url(#tktGlow)" />
        <g strokeWidth={1} opacity={0.15}>
          {Array.from({ length: 13 }, (_, i) => i - 6).map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} stroke={GOLD} />
          ))}
          {[0, 80, 190, 340].map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} stroke={MUTE} opacity={0.5 - i * 0.1} />
          ))}
        </g>
        <rect width={W} height={H} fill="url(#tktVig)" />
        <Bracket x={44} y={48} w={W - 88} h={H - 96} c={GOLD} b={44} sw={2.5} />

        <g transform={`translate(90, 168)`}>
          <path d="M 0 -26 L 0 12 L 20 12" stroke={RED} strokeWidth={3} fill="none" strokeLinecap="round" />
          <text x={32} y={6} fontSize={22} fill={GOLD} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">TRUYỀN KỲ · CHỐN CÔNG SỞ</text>
        </g>
        <g transform={`translate(${W - 110}, 168)`}>
          <text x={0} y={6} fontSize={20} fill={RED} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">ĐẠO TÂM</text>
          <circle cx={18} cy={-1} r={7} fill={RED} />
        </g>

        {/* title */}
        <g transform={`translate(${W / 2}, 348)`}>
          <text x={0} y={0} fontSize={34} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">NHỮNG LOẠI · CHẤN ĐỘNG ĐẠO TÂM</text>
          <text x={0} y={140} fontSize={150} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#tktGlowF)">THƯỢNG</text>
          <text x={0} y={280} fontSize={150} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#tktGlowF)">KHÁCH</text>
          <text x={0} y={356} fontSize={40} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>💰 (khách hàng)</text>
        </g>

        {/* rows */}
        <g transform={`translate(0, 812)`}>
          {rows.map((r, i) => (
            <g key={i}>
              <rect x={70} y={i * 112} width={W - 140} height={92} rx={10} fill={CARD} fillOpacity={0.76} stroke={r.c} strokeWidth={1.5} strokeOpacity={0.5} />
              <Bracket x={70} y={i * 112} w={W - 140} h={92} c={r.c} b={16} sw={2.5} />
              <text x={108} y={i * 112 + 58} fontSize={30} fill={TEXT} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.l}</text>
              <text x={W - 108} y={i * 112 + 58} fontSize={26} fill={r.c} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.r}</text>
            </g>
          ))}
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1420)`}>
          <rect x={-505} y={-90} width={1010} height={220} rx={12} fill={CARD2} fillOpacity={0.85} stroke={GOLD} strokeWidth={1.5} strokeOpacity={0.5} />
          <Bracket x={-505} y={-90} w={1010} h={220} c={GOLD} b={26} sw={3} />
          <text x={0} y={-36} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>mỗi khối linh thạch = một lần khảo nghiệm đạo tâm</text>
          <text x={0} y={40} fontSize={44} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#tktGlowF)">nghe "sửa một chút" mà vẫn</text>
          <text x={0} y={104} fontSize={44} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#tktGlowF)">GIỮ ĐƯỢC NỤ CƯỜI 🤣</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 80})`}>
          <text x={0} y={0} fontSize={18} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">// truyền kỳ · chốn công sở</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
