import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "700"], subsets: ["latin"] });

const W = 1080;
const H = 1920;

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
const BG_TERM = "#0A1322";
const TEXT_PRI = "#E8F0FF";
const TEXT_MUTE = "#5E7090";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const JADE = "#5BE8A8";
const VIOLET = "#B47AFF";
const ORANGE = "#FFA552";
const WARNING_RED = "#FF6B6B";
const K8S_BLUE = "#5BB8FF";
const GRID = "#FFFFFF";

const Wheel: React.FC<{ cx: number; cy: number; r: number; color: string }> = ({ cx, cy, r, color }) => {
  const pts = Array.from({ length: 7 }, (_, i) => {
    const a = ((-90 + i * 360 / 7) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const inner = Array.from({ length: 7 }, (_, i) => {
    const a = ((-90 + i * 360 / 7) * Math.PI) / 180;
    return [cx + r * 0.42 * Math.cos(a), cy + r * 0.42 * Math.sin(a)];
  });
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 12} fill="none" stroke={color} strokeWidth={2.5} opacity={0.35} />
      <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={BG_CARD} stroke={color} strokeWidth={5} strokeLinejoin="round" />
      {pts.map((p, i) => (
        <line key={i} x1={inner[i][0]} y1={inner[i][1]} x2={p[0]} y2={p[1]} stroke={color} strokeWidth={5} strokeLinecap="round" />
      ))}
      <polygon points={inner.map((p) => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth={3.5} strokeLinejoin="round" />
      <circle cx={cx} cy={cy} r={r * 0.16} fill={color} />
    </g>
  );
};

export const KubernetesTamGioiThumbnail: React.FC = () => {
  const res = [
    { c: K8S_BLUE, t: "Pod" }, { c: ORANGE, t: "Service" }, { c: VIOLET, t: "Ingress" },
    { c: JADE, t: "ConfigMap" }, { c: WARNING_RED, t: "Secret" }, { c: AMBER, t: "Volume" },
    { c: K8S_BLUE, t: "Helm" }, { c: ORANGE, t: "Operator" }, { c: VIOLET, t: "CRD" },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="ktgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="ktgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="ktglow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor={K8S_BLUE} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="ktg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#ktgrid)" />
        <rect width={W} height={H} fill="url(#ktgrid2)" />
        <rect width={W} height={H} fill="url(#ktglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 170)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ TRUYỀN KỲ · GIỚI IT ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <Wheel cx={W / 2} cy={400} r={130} color={K8S_BLUE} />

        <g transform={`translate(${W / 2}, 640)`}>
          <text x={0} y={0} fontSize={96} fill={K8S_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1" filter="url(#ktg)">KUBERNETES</text>
          <text x={0} y={72} fontSize={44} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nổi danh TAM GIỚI 🏯</text>
        </g>

        {/* resource grid */}
        <g transform={`translate(${W / 2}, 920)`}>
          {res.map((r, i) => {
            const col = i % 3, row = Math.floor(i / 3);
            const x = -310 + col * 310, y = row * 110;
            return (
              <g key={i}>
                <rect x={x - 145} y={y} width={290} height={88} rx={12} fill={BG_CARD} stroke={r.c} strokeWidth={2.5} />
                <text x={x} y={y + 58} fontSize={36} fill={r.c} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{r.t}</text>
              </g>
            );
          })}
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1430)`}>
          <rect x={-470} y={-80} width={940} height={180} rx={12} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
          <text x={-430} y={-28} fontSize={28} fill={K8S_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>$ kubectl get pods</text>
          <text x={-430} y={20} fontSize={28} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>  No resources found 😱</text>
          <text x={0} y={74} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Container của ta đâu rồi?"</text>
        </g>

        <g transform={`translate(${W / 2}, 1640)`}>
          <text x={0} y={0} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Học mãi không hết · bỏ thì không đành</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
