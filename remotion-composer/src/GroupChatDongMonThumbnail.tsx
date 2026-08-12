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
const TEXT_SEC = "#A4B5D0";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const JADE = "#5BE8A8";
const ACCENT_BLUE = "#5BB8FF";
const VIOLET = "#B47AFF";
const ORANGE = "#FFA552";
const WARNING_RED = "#FF6B6B";
const GRID = "#FFFFFF";

export const GroupChatDongMonThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="gctgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.8" opacity="0.1" />
          </pattern>
          <pattern id="gctgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1.2" opacity="0.15" />
          </pattern>
          <radialGradient id="gctglow" cx="50%" cy="26%" r="62%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.16" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <filter id="gctg"><feGaussianBlur stdDeviation="9" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#gctgrid)" />
        <rect width={W} height={H} fill="url(#gctgrid2)" />
        <rect width={W} height={H} fill="url(#gctglow)" />
        <g stroke={AMBER} strokeWidth={2} opacity={0.7}>
          <path d="M 40 40 L 40 80 M 40 40 L 80 40" fill="none" />
          <path d={`M ${W - 40} 40 L ${W - 40} 80 M ${W - 40} 40 L ${W - 80} 40`} fill="none" />
          <path d={`M 40 ${H - 40} L 40 ${H - 80} M 40 ${H - 40} L 80 ${H - 40}`} fill="none" />
          <path d={`M ${W - 40} ${H - 40} L ${W - 40} ${H - 80} M ${W - 40} ${H - 40} L ${W - 80} ${H - 40}`} fill="none" />
        </g>

        <g transform={`translate(90, 165)`}>
          <text x={0} y={0} fontSize={22} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ TRUYỀN KỲ · GIỚI IT ]</text>
          <line x1={0} y1={20} x2={W - 180} y2={20} stroke={AMBER} strokeWidth={1.2} opacity={0.6} />
        </g>

        <g transform={`translate(${W / 2}, 290)`}>
          <text x={0} y={0} fontSize={40} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>9 LOẠI ĐỒNG MÔN TRONG</text>
          <text x={0} y={108} fontSize={108} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1" filter="url(#gctg)">GROUP CHAT</text>
          <text x={0} y={186} fontSize={56} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>CÔNG TY 💬</text>
        </g>

        {/* the 9 type chips, 2 cols */}
        <g transform={`translate(${W / 2}, 600)`}>
          {[
            { t: "🥷 Ẩn Thế Đại Năng", c: ACCENT_BLUE },
            { t: "👍 Phản Hồi Tông Sư", c: JADE },
            { t: "📣 Triệu Hồi Sư", c: WARNING_RED },
            { t: "📜 Khổ Tu Sĩ", c: VIOLET },
            { t: "⌨️ Đồng Môn Đang Gõ…", c: AMBER },
            { t: "🏃 Chuyên Gia Mất Tích", c: ORANGE },
            { t: "🔮 Thiên Cơ Trưởng Lão", c: VIOLET },
            { t: "👻 Đạo Tổ Seen Tin Nhắn", c: WARNING_RED },
          ].map((p, i) => {
            const col = i % 2, row = Math.floor(i / 2);
            return (
              <g key={i}>
                <rect x={-505 + col * 510} y={-40 + row * 132} width={490} height={108} rx={14} fill={BG_CARD} stroke={p.c} strokeWidth={2.5} />
                <text x={-260 + col * 510} y={22 + row * 132} fontSize={28} fill={p.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{p.t}</text>
              </g>
            );
          })}
          {/* 9th centered */}
          <g>
            <rect x={-505} y={488} width={1010} height={108} rx={14} fill={BG_TERM} stroke={JADE} strokeWidth={3} />
            <text x={0} y={550} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>🧘 Người Kết Thúc Cuộc Trò Chuyện</text>
          </g>
        </g>

        {/* punchline */}
        <g transform={`translate(${W / 2}, 1430)`}>
          <rect x={-505} y={-90} width={1010} height={220} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={0} y={-30} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>group chat không phải công cụ giao tiếp</text>
          <text x={0} y={36} fontSize={46} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà là nơi QUAN SÁT NHÂN TÍNH</text>
          <text x={0} y={98} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// ngươi là loại nào? 🤣</text>
        </g>

        <g transform={`translate(${W / 2}, 1660)`}>
          <text x={0} y={0} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">văn hoá group chat công ty 🏯</text>
        </g>

        <g transform={`translate(${W / 2}, ${H - 70})`}>
          <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">⚡ truyền kỳ · giới IT · blueprint</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
