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
const GREEN = "#2EE6A8";
const VIOLET = "#A78BFF";
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

export const CodeReviewThumbnail: React.FC = () => {
  const vx = W / 2, vy = 1250;
  const rows = [
    { n: "①", t: "Thiên Cơ Trưởng Lão", r: "\"nếu 100 triệu user?\" 🔮", c: GOLD },
    { n: "②", t: "Nhân Quả Kiếm Tiên", r: "\"nếu prod nổ 3h sáng?\" ☯️", c: GOLD },
    { n: "③", t: "Tâm Ma Cổ Tu", r: "kể 30 năm lịch sử 👴", c: RED },
    { n: "④", t: "Tích Tự Ma Quân", r: "review 3.000 chữ 📜", c: GOLD },
    { n: "⑤", t: "Bế Quan Lão Tổ", r: "\"sao merge rồi?\" 🪨", c: A },
    { n: "⑥", t: "Nhất Kiếm Phong Hầu", r: "\"Rename. Why?\" ⚔️", c: RED },
    { n: "⑦", t: "Truyền Đạo Chân Nhân", r: "cảnh giới cao nhất ✨", c: GREEN },
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="crtGrid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M 64 0 L 0 0 0 64" fill="none" stroke={A} strokeWidth="0.6" opacity="0.05" /></pattern>
          <radialGradient id="crtGlow" cx="50%" cy="20%" r="60%"><stop offset="0%" stopColor={A} stopOpacity="0.12" /><stop offset="100%" stopColor={BG} stopOpacity="0" /></radialGradient>
          <radialGradient id="crtVig" cx="50%" cy="42%" r="74%"><stop offset="54%" stopColor={BG} stopOpacity="0" /><stop offset="100%" stopColor="#03020A" stopOpacity="0.82" /></radialGradient>
          <filter id="crtGlowF" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#crtGrid)" />
        <rect width={W} height={H} fill="url(#crtGlow)" />
        <g strokeWidth={1} opacity={0.13}>
          {Array.from({ length: 13 }, (_, i) => i - 6).map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} stroke={A} />
          ))}
          {[0, 90, 210].map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} stroke={MUTE} opacity={0.45 - i * 0.12} />
          ))}
        </g>
        <rect width={W} height={H} fill="url(#crtVig)" />
        <Bracket x={44} y={48} w={W - 88} h={H - 96} c={A} b={44} sw={2.5} />

        <g transform={`translate(90, 158)`}>
          <path d="M 0 -26 L 0 12 L 20 12" stroke={RED} strokeWidth={3} fill="none" strokeLinecap="round" />
          <text x={32} y={6} fontSize={22} fill={A} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">TRUYỀN KỲ · GIỚI IT</text>
        </g>
        <g transform={`translate(${W - 110}, 158)`}>
          <text x={0} y={6} fontSize={20} fill={RED} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">ĐẠO TÂM</text>
          <circle cx={18} cy={-1} r={7} fill={RED} />
        </g>

        {/* title */}
        <g transform={`translate(${W / 2}, 306)`}>
          <text x={0} y={0} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">7 LOẠI ĐẠO HỮU TRONG</text>
          <text x={0} y={126} fontSize={158} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#crtGlowF)">CODE</text>
          <text x={0} y={272} fontSize={158} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#crtGlowF)">REVIEW</text>
          <text x={0} y={344} fontSize={34} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">💀 nơi đạo tâm vỡ vụn</text>
        </g>

        {/* 7 rows */}
        <g transform={`translate(0, 736)`}>
          {rows.map((r, i) => (
            <g key={i}>
              <rect x={64} y={i * 96} width={W - 128} height={80} rx={9} fill={CARD} fillOpacity={0.78} stroke={r.c} strokeWidth={1.5} strokeOpacity={0.5} />
              <Bracket x={64} y={i * 96} w={W - 128} h={80} c={r.c} b={14} sw={2.2} />
              <text x={96} y={i * 96 + 52} fontSize={34} fill={r.c} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{r.n}</text>
              <text x={150} y={i * 96 + 51} fontSize={30} fill={TEXT} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.t}</text>
              <text x={W - 96} y={i * 96 + 51} fontSize={25} fill={r.c} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.r}</text>
            </g>
          ))}
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1560)`}>
          <rect x={-505} y={-72} width={1010} height={190} rx={12} fill={CARD2} fillOpacity={0.88} stroke={A} strokeWidth={1.5} strokeOpacity={0.5} />
          <Bracket x={-505} y={-72} w={1010} h={190} c={A} b={24} sw={3} />
          <text x={0} y={-20} fontSize={28} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>mỗi comment = 1 trận thiên kiếp</text>
          <text x={0} y={44} fontSize={46} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#crtGlowF)">bị chặn ngay tại SƠN MÔN</text>
          <text x={0} y={98} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>trước khi production nhìn thấy 🤣</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 74})`}>
          <text x={0} y={0} fontSize={18} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">// truyền kỳ · giới IT</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
