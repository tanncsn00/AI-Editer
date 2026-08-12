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
const WARNING_RED = "#FF6B6B";
const ACCENT_BLUE = "#5BB8FF";
const GRID = "#FFFFFF";

export const ToiLoiGitDaoThumbnail: React.FC = () => {
  const cmds = [
    { c: WARNING_RED, t: "$ git push origin production" },
    { c: AMBER, t: '$ git commit -m "fix bug"' },
    { c: JADE, t: "$ git push --force" },
    { c: ACCENT_BLUE, t: "$ git blame  → YOU 😱" },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="tltgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="tltgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="tltglow" cx="50%" cy="36%" r="62%">
            <stop offset="0%" stopColor={WARNING_RED} stopOpacity="0.13" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="tltg"><feGaussianBlur stdDeviation="10" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#tltgrid)" />
        <rect width={W} height={H} fill="url(#tltgrid2)" />
        <rect width={W} height={H} fill="url(#tltglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 175)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[GUILTY] · GIT ĐẠO · 8 TỘI</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 320)`}>
          <text x={0} y={0} fontSize={44} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>8 TỘI LỖI AI CŨNG PHẠM</text>
          <text x={0} y={108} fontSize={104} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#tltg)">GIT ĐẠO</text>
        </g>

        {/* terminal */}
        <g transform={`translate(${W / 2}, 780)`}>
          <rect x={-470} y={-160} width={940} height={360} rx={12} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
          <rect x={-470} y={-160} width={940} height={50} rx={12} fill={BG_CARD} />
          <circle cx={-435} cy={-135} r={9} fill={WARNING_RED} />
          <circle cx={-407} cy={-135} r={9} fill={AMBER} />
          <circle cx={-379} cy={-135} r={9} fill={JADE} />
          <text x={0} y={-128} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>bash — git crimes</text>
          {cmds.map((c, i) => (
            <text key={i} x={-440} y={-50 + i * 64} fontSize={28} fill={c.c} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{c.t}</text>
          ))}
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1280)`}>
          <rect x={-470} y={-95} width={940} height={200} rx={10} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
          <text x={0} y={-35} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// mở git history và phát hiện</text>
          <text x={0} y={30} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>toàn bộ nhân quả</text>
          <text x={0} y={82} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">do CHÍNH MÌNH tạo ra 😱</text>
        </g>

        <g transform={`translate(${W / 2}, 1620)`}>
          <text x={0} y={0} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Đạo hữu phạm mấy tội rồi?</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
