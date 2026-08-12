import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;
const BG = "#060D0A";
const CARD = "#0C1A14";
const CARD2 = "#0E2018";
const RED = "#FF5470";
const GREEN = "#26E0A0";
const GOLD = "#FFC24B";
const CYAN = "#2BE2FF";
const TEXT = "#E4F0EA";
const SEC = "#9FC0B0";
const MUTE = "#5A7565";

const Bracket: React.FC<{ x: number; y: number; w: number; h: number; c: string; b?: number; sw?: number }> = ({ x, y, w, h, c, b = 22, sw = 3 }) => (
  <g stroke={c} strokeWidth={sw} fill="none" opacity={0.95} strokeLinecap="round">
    <path d={`M ${x} ${y + b} L ${x} ${y} L ${x + b} ${y}`} />
    <path d={`M ${x + w - b} ${y} L ${x + w} ${y} L ${x + w} ${y + b}`} />
    <path d={`M ${x} ${y + h - b} L ${x} ${y + h} L ${x + b} ${y + h}`} />
    <path d={`M ${x + w - b} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - b}`} />
  </g>
);

export const MoiGioiDaoThumbnail: React.FC = () => {
  const vx = W / 2, vy = 1210;
  const candles = [58, 40, 66, 48, 30, 52, 72, 44, 60, 36, 68, 50];
  const rows = [
    { l: "\"mã nào sắp tăng?\"", r: "khách mua MÃ KHÁC 💀", c: GREEN },
    { l: "\"chắc không?\"", r: "→ chuyển cty khác 🤣", c: CYAN },
    { l: "lãi 3% → \"chốt!\"", r: "3 ngày sau +50% 💀", c: RED },
    { l: "Call Margin ⚡", r: "khách: \"để anh tính\" 🫠", c: GOLD },
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="gtGrid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M 64 0 L 0 0 0 64" fill="none" stroke={GREEN} strokeWidth="0.6" opacity="0.05" /></pattern>
          <radialGradient id="gtGlow" cx="50%" cy="24%" r="62%"><stop offset="0%" stopColor={GREEN} stopOpacity="0.14" /><stop offset="100%" stopColor={BG} stopOpacity="0" /></radialGradient>
          <radialGradient id="gtVig" cx="50%" cy="42%" r="74%"><stop offset="54%" stopColor={BG} stopOpacity="0" /><stop offset="100%" stopColor="#010604" stopOpacity="0.82" /></radialGradient>
          <filter id="gtGlowF" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#gtGrid)" />
        <rect width={W} height={H} fill="url(#gtGlow)" />
        <g opacity={0.12}>
          {candles.map((h, i) => {
            const x = 90 + i * 82; const up = i % 2 === 0; const c = up ? GREEN : RED; const cy = 1660 - h;
            return (
              <g key={i} stroke={c} fill={c}>
                <line x1={x} y1={cy - 24} x2={x} y2={cy + h + 24} strokeWidth={2} />
                <rect x={x - 17} y={cy} width={34} height={h} rx={2} />
              </g>
            );
          })}
        </g>
        <g stroke={GREEN} strokeWidth={1} opacity={0.13}>
          {Array.from({ length: 13 }, (_, i) => i - 6).map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} />
          ))}
        </g>
        <rect width={W} height={H} fill="url(#gtVig)" />
        <Bracket x={44} y={48} w={W - 88} h={H - 96} c={GREEN} b={44} sw={2.5} />

        <g transform={`translate(90, 168)`}>
          <path d="M 0 -26 L 0 12 L 20 12" stroke={RED} strokeWidth={3} fill="none" strokeLinecap="round" />
          <text x={32} y={6} fontSize={22} fill={GREEN} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">TRUYỀN KỲ · CHỐN CÔNG SỞ</text>
        </g>
        <g transform={`translate(${W - 110}, 168)`}>
          <text x={0} y={6} fontSize={20} fill={SEC} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">LIVE</text>
          <circle cx={18} cy={-1} r={7} fill={RED} />
        </g>

        {/* title */}
        <g transform={`translate(${W / 2}, 336)`}>
          <text x={0} y={0} fontSize={40} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">POV: TA LÀ MỘT</text>
          <text x={0} y={120} fontSize={104} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#gtGlowF)">MÔI GIỚI</text>
          <text x={0} y={224} fontSize={100} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#gtGlowF)">CHỨNG KHOÁN</text>
        </g>

        {/* kiep rows */}
        <g transform={`translate(0, 700)`}>
          {rows.map((r, i) => (
            <g key={i}>
              <rect x={70} y={i * 116} width={W - 140} height={96} rx={10} fill={CARD} fillOpacity={0.78} stroke={r.c} strokeWidth={1.5} strokeOpacity={0.5} />
              <Bracket x={70} y={i * 116} w={W - 140} h={96} c={r.c} b={16} sw={2.5} />
              <text x={108} y={i * 116 + 60} fontSize={30} fill={TEXT} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.l}</text>
              <text x={W - 108} y={i * 116 + 60} fontSize={26} fill={r.c} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.r}</text>
            </g>
          ))}
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1360)`}>
          <rect x={-505} y={-96} width={1010} height={244} rx={12} fill={CARD2} fillOpacity={0.85} stroke={RED} strokeWidth={1.5} strokeOpacity={0.5} />
          <Bracket x={-505} y={-96} w={1010} h={244} c={RED} b={26} sw={3} />
          <text x={0} y={-38} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thiên kiếp không đánh vào tài khoản…</text>
          <text x={0} y={36} fontSize={52} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#gtGlowF)">mà đánh vào ĐẠO TÂM 💀</text>
          <text x={0} y={106} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đừng hỏi mã nào tăng — hỏi đã qua bao thiên kiếp 🙏</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 80})`}>
          <text x={0} y={0} fontSize={18} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">// truyền kỳ · chốn công sở</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
