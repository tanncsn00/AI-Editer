import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;
const BG = "#060B14";
const CARD = "#0A1626";
const CARD2 = "#0C1C30";
const PINK = "#FF5470";
const PURPLE = "#3E8FE0";
const CYAN = "#2BE2FF";
const AMBER = "#FFB347";
const GREEN = "#2EE6C2";
const TEXT = "#DCEBF7";
const SEC = "#8FB2D0";
const MUTE = "#4F6E90";

const Bracket: React.FC<{ x: number; y: number; w: number; h: number; c: string; b?: number; sw?: number }> = ({ x, y, w, h, c, b = 22, sw = 3 }) => (
  <g stroke={c} strokeWidth={sw} fill="none" opacity={0.95} strokeLinecap="round">
    <path d={`M ${x} ${y + b} L ${x} ${y} L ${x + b} ${y}`} />
    <path d={`M ${x + w - b} ${y} L ${x + w} ${y} L ${x + w} ${y + b}`} />
    <path d={`M ${x} ${y + h - b} L ${x} ${y + h} L ${x + b} ${y + h}`} />
    <path d={`M ${x + w - b} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - b}`} />
  </g>
);

export const PovCreatorThumbnail: React.FC = () => {
  const vx = W / 2, vy = 1180;
  const kieps = [
    { k: "Linh Cảm Khô Kiệt", v: "\"tối qua thằng nào viết?\"", c: PURPLE },
    { k: "Thuật Toán Vô Thường", v: "3 ngày = 327 view", c: CYAN },
    { k: "Bình Luận Tâm Ma", v: "1000 khen · nhớ 1 chê", c: PINK },
    { k: "Nghĩ Hộ Ta", v: "\"AI làm hết rồi mà\"", c: AMBER },
  ];
  return (
    <AbsoluteFill style={{ background: BG }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="ctGrid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M 64 0 L 0 0 0 64" fill="none" stroke={CYAN} strokeWidth="0.6" opacity="0.05" /></pattern>
          <radialGradient id="ctGlow" cx="50%" cy="26%" r="62%"><stop offset="0%" stopColor={CYAN} stopOpacity="0.12" /><stop offset="100%" stopColor={BG} stopOpacity="0" /></radialGradient>
          <radialGradient id="ctVig" cx="50%" cy="42%" r="74%"><stop offset="54%" stopColor={BG} stopOpacity="0" /><stop offset="100%" stopColor="#01030A" stopOpacity="0.82" /></radialGradient>
          <filter id="ctGlowF" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#ctGrid)" />
        <rect width={W} height={H} fill="url(#ctGlow)" />
        {/* perspective floor */}
        <g stroke={CYAN} strokeWidth={1} opacity={0.15}>
          {Array.from({ length: 13 }, (_, i) => i - 6).map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} />
          ))}
          {[0, 80, 190, 340, 540].map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} opacity={0.6 - i * 0.08} />
          ))}
        </g>
        <rect width={W} height={H} fill="url(#ctVig)" />
        {/* HUD corner brackets full-frame */}
        <Bracket x={44} y={48} w={W - 88} h={H - 96} c={CYAN} b={44} sw={2.5} />

        {/* top tag */}
        <g transform={`translate(90, 168)`}>
          <path d="M 0 -26 L 0 12 L 20 12" stroke={PINK} strokeWidth={3} fill="none" strokeLinecap="round" />
          <text x={32} y={6} fontSize={22} fill={CYAN} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">POV · SÁNG TÁC ĐẠO</text>
        </g>
        <g transform={`translate(${W - 110}, 168)`}>
          <text x={0} y={6} fontSize={20} fill={SEC} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">REC</text>
          <circle cx={18} cy={-1} r={7} fill={PINK} />
        </g>

        {/* title */}
        <g transform={`translate(${W / 2}, 350)`}>
          <text x={0} y={0} fontSize={34} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">POV: TA LÀ MỘT</text>
          <text x={0} y={108} fontSize={106} fill={CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} filter="url(#ctGlowF)">CONTENT</text>
          <text x={0} y={212} fontSize={106} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>CREATOR</text>
        </g>

        {/* kiep panels */}
        <g transform={`translate(0, 680)`}>
          {kieps.map((r, i) => (
            <g key={i}>
              <rect x={70} y={i * 116} width={W - 140} height={96} rx={10} fill={CARD} fillOpacity={0.74} stroke={r.c} strokeWidth={1.5} strokeOpacity={0.5} />
              <Bracket x={70} y={i * 116} w={W - 140} h={96} c={r.c} b={16} sw={2.5} />
              <text x={112} y={i * 116 + 42} fontSize={20} fill={r.c} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">KIẾP {["①", "②", "③", "④"][i]}</text>
              <text x={112} y={i * 116 + 76} fontSize={30} fill={TEXT} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{r.k}</text>
              <text x={W - 108} y={i * 116 + 60} fontSize={24} fill={SEC} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.v}</text>
            </g>
          ))}
        </g>

        {/* punchline panel */}
        <g transform={`translate(${W / 2}, 1330)`}>
          <rect x={-505} y={-92} width={1010} height={236} rx={12} fill={CARD2} fillOpacity={0.82} stroke={AMBER} strokeWidth={1.5} strokeOpacity={0.5} />
          <Bracket x={-505} y={-92} w={1010} h={236} c={AMBER} b={26} sw={3} />
          <text x={0} y={-36} fontSize={32} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>làm content không phải bán video</text>
          <text x={0} y={38} fontSize={58} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#ctGlowF)">mà là BÁN SỰ CHÚ Ý</text>
          <text x={0} y={108} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>hôm nay không xuất hiện → mai bị quên</text>
        </g>

        <g transform={`translate(${W / 2}, 1590)`}>
          <text x={0} y={0} fontSize={31} fill={CYAN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">thiên kiếp lớn nhất: ngồi 8 canh giờ · ý tưởng = 0</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 80})`}>
          <text x={0} y={0} fontSize={18} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">// truyền kỳ · chốn nhân gian</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
