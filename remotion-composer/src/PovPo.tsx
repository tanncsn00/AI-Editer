import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./pov_po_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "13";

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
const BG_TERM = "#0A1322";
const GRID = "#FFFFFF";
const TEXT_PRI = "#E8F0FF";
const TEXT_SEC = "#A4B5D0";
const TEXT_MUTE = "#5E7090";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const ACCENT_BLUE = "#5BB8FF";
const WARNING_RED = "#FF6B6B";
const JADE = "#5BE8A8";
const VIOLET = "#B47AFF";
const ORANGE = "#FFA552";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

const useFadeUp = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [e, e + d], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};
const useScaleIn = (e: number, d = 16) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [e, e + d], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};
const useFade = (e: number, d = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const BlueprintBG: React.FC<{ glow?: string }> = ({ glow = ACCENT_BLUE }) => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="ppogrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="ppogrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="ppoglow" cx="50%" cy="36%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pposcan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#ppogrid)" />
        <rect width={W} height={H} fill="url(#ppogrid2)" />
        <rect width={W} height={H} fill="url(#ppoglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#pposcan)" />
        <g stroke={AMBER} strokeWidth={1.5} opacity={0.5}>
          <path d="M 30 30 L 30 60 M 30 30 L 60 30" fill="none" />
          <path d={`M ${W - 30} 30 L ${W - 30} 60 M ${W - 30} 30 L ${W - 60} 30`} fill="none" />
          <path d={`M 30 ${H - 30} L 30 ${H - 60} M 30 ${H - 30} L 60 ${H - 30}`} fill="none" />
          <path d={`M ${W - 30} ${H - 30} L ${W - 30} ${H - 60} M ${W - 30} ${H - 30} L ${W - 60} ${H - 30}`} fill="none" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const KenBurns: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration * FPS], [1.0, 1.03], { extrapolateRight: "clamp" });
  return <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>{children}</div>;
};

const SectionHeader: React.FC<{ num: string; label: string }> = ({ num, label }) => {
  const a1 = useFadeUp(0, 10), a2 = useFade(4, 10), a3 = useFadeUp(8, 10);
  return (
    <g>
      <text x={80} y={130} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={a1}>[{num} / {TOTAL}]</text>
      <line x1={80} y1={150} x2={W - 80} y2={150} stroke={AMBER} strokeWidth={1} opacity={0.5 * a2} />
      <text x={80} y={180} fontSize={16} fill={TEXT_SEC} fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="5" style={a3}>{label}</text>
    </g>
  );
};
const FigFooter: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <line x1={80} y1={H - 140} x2={W - 80} y2={H - 140} stroke={AMBER} strokeWidth={1} opacity={0.5} />
    <text x={W / 2} y={H - 110} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">{label}</text>
  </g>
);
const BrandMark: React.FC = () => (
  <text x={W / 2} y={H - 60} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · giới IT · blueprint</text>
);
const TechBox: React.FC<{ x: number; y: number; w: number; h: number; color?: string; thick?: number }> = ({ x, y, w, h, color = AMBER, thick = 2 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth={thick} />
    <line x1={x - 6} y1={y} x2={x + 6} y2={y} stroke={color} strokeWidth={thick} />
    <line x1={x + w - 6} y1={y} x2={x + w + 6} y2={y} stroke={color} strokeWidth={thick} />
    <line x1={x - 6} y1={y + h} x2={x + 6} y2={y + h} stroke={color} strokeWidth={thick} />
    <line x1={x + w - 6} y1={y + h} x2={x + w + 6} y2={y + h} stroke={color} strokeWidth={thick} />
  </g>
);
const Reveal: React.FC<{ cx: number; cy: number; label: string; sub?: string; color: string; entry: number; big?: boolean }> = ({ cx, cy, label, sub, color, entry, big }) => {
  const a = useScaleIn(entry, 14);
  const w = big ? 720 : 460;
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={cx - w / 2} y={cy - 58} width={w} height={116} rx={16} fill={BG_CARD} stroke={color} strokeWidth={3.5} />
      <text x={cx} y={cy + (sub ? -6 : 14)} fontSize={big ? 40 : 38} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{label}</text>
      {sub && <text x={cx} y={cy + 32} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};
const Quote: React.FC<{ y: number; who: string; whoColor: string; say: string; sayColor?: string; entry: number }> = ({ y, who, whoColor, say, sayColor = TEXT_PRI, entry }) => {
  const a = useScaleIn(entry, 12);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 50}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 470} y={y} width={940} height={100} rx={14} fill={BG_CARD} stroke={whoColor} strokeWidth={2.5} />
      <text x={W / 2 - 430} y={y + 42} fontSize={23} fill={whoColor} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{who}</text>
      <text x={W / 2 - 430} y={y + 80} fontSize={29} fill={sayColor} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"{say}"</text>
    </g>
  );
};

// ============ S1 INTRO ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const believe = useScaleIn(120, 14);
  const naive = useScaleIn(300, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="POV · THE PRODUCT OWNER" />
          <text x={W / 2} y={350} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(20, 12)}>Năm ấy · ta nhập môn SẢN PHẨM ĐẠO</text>
          <text x={W / 2} y={418} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(70, 12)}>ta tin việc của mình là QUYẾT ĐỊNH:</text>
          <g style={{ ...believe, transformOrigin: `${W / 2}px 575px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={475} width={940} height={200} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={530} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🧩 xây dựng tính năng nào</text>
            <text x={W / 2} y={585} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🚀 phát triển sản phẩm ra sao</text>
            <text x={W / 2} y={645} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>🧭 dẫn dắt tông môn về tương lai</text>
          </g>
          <g style={{ ...naive, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={740} w={940} h={130} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={798} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>sau này mới biết…</text>
            <text x={W / 2} y={848} fontSize={40} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">ta đã HIỂU SAI từ đầu 💀</text>
          </g>
          <FigFooter label="product owner · người gánh nghiệp của cả tông môn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 BACKLOG ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const items = [
    { t: "100 tính năng", c: TEXT_PRI },
    { t: "50 yêu cầu khách hàng", c: TEXT_PRI },
    { t: "30 ý tưởng từ CEO", c: TEXT_PRI },
    { t: "20 đề xuất từ Sales", c: TEXT_PRI },
  ];
  const ENTRY = [126, 160, 210, 261];
  const p1 = useScaleIn(370, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE BACKLOG" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(20, 12)}>ngày đầu · trưởng lão đưa ta BACKLOG 📋</text>
          <g>
            {items.map((it, i) => (
              <g key={i} style={useScaleIn(ENTRY[i], 12)}>
                <rect x={W / 2 - 440} y={360 + i * 96} width={880} height={80} rx={12} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2} />
                <text x={W / 2} y={410 + i * 96} fontSize={32} fill={it.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{it.t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...p1, transformOrigin: `${W / 2}px 825px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={765} width={940} height={120} rx={16} fill={BG_TERM} stroke={AMBER} strokeWidth={3.5} />
            <text x={W / 2} y={820} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>mỗi một mục · đều đánh dấu</text>
            <text x={W / 2} y={862} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"P1 · KHẨN CẤP" 🔥</text>
          </g>
          <FigFooter label="backlog · 200 việc · tất cả đều 'gấp'" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 UUTIEN (①) ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(71, 16);
  const moral = useFadeUp(97, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="LESSON ① · PRIORITIZATION" />
          <text x={W / 2} y={360} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>ngày đó · ta lĩnh ngộ công pháp đầu tiên</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 470px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={470} label="① ƯU TIÊN ĐẠO" sub="// prioritization" color={AMBER} entry={0} big />
          </g>
          <g style={moral}>
            <rect x={W / 2 - 480} y={620} width={960} height={230} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={690} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>bởi nếu TẤT CẢ đều khẩn cấp…</text>
            <text x={W / 2} y={770} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">thì KHÔNG có gì</text>
            <text x={W / 2} y={822} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">thực sự khẩn cấp 💀</text>
          </g>
          <FigFooter label="if everything is P1 · nothing is P1" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 REQUESTS ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const end = useScaleIn(559, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="EVERYTHING IS IMPORTANT" />
          <Quote y={230} who="🙍 khách hàng" whoColor={AMBER} say="tính năng này rất quan trọng" entry={73} />
          <Quote y={360} who="💼 Sales" whoColor={ACCENT_BLUE} say="tính năng kia rất quan trọng" entry={258} />
          <Quote y={490} who="👑 CEO" whoColor={VIOLET} say="tính năng nọ quan trọng NHẤT" entry={443} />
          <g style={{ ...end, transformOrigin: `${W / 2}px 690px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={630} w={960} h={130} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={685} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đến cuối ngày · ta nhìn backlog…</text>
            <text x={W / 2} y={735} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">MỌI THỨ đều quan trọng 💀</text>
          </g>
          <FigFooter label="ai cũng kêu 'quan trọng' · không ai chịu rớt" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 TUCHOI (②) ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(64, 16);
  const no = useScaleIn(162, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="LESSON ② · THE POWER OF NO" />
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 360px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={360} label="② TỪ CHỐI ĐẠO" sub="// the art of saying no" color={JADE} entry={0} big />
          </g>
          <text x={W / 2} y={530} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(118, 12)}>PO chân chính…</text>
          <g style={{ ...no, transformOrigin: `${W / 2}px 700px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={580} width={460} height={240} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2 - 240} y={645} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>KHÔNG phải</text>
            <text x={W / 2 - 240} y={695} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>người giỏi nói</text>
            <text x={W / 2 - 240} y={765} fontSize={56} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>"CÓ" ✅</text>
            <rect x={W / 2 + 10} y={580} width={460} height={240} rx={16} fill={BG_TERM} stroke={JADE} strokeWidth={3} />
            <text x={W / 2 + 240} y={645} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>mà là người</text>
            <text x={W / 2 + 240} y={695} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>DÁM nói</text>
            <text x={W / 2 + 240} y={765} fontSize={56} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>"KHÔNG" 🚫</text>
          </g>
          <FigFooter label="say no · để bảo vệ thứ thực sự quan trọng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 SPRINT ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const q = [
    { who: "💻 Dev", say: "chúng ta làm gì trước?", c: ACCENT_BLUE },
    { who: "🔍 QA", say: "scope lần này là gì?", c: JADE },
    { who: "📋 PM", say: "bao giờ xong?", c: AMBER },
    { who: "👑 CEO", say: "khi nào ra mắt?", c: VIOLET },
  ];
  const ENTRY = [110, 167, 236, 291];
  const look = useScaleIn(331, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="SPRINT PLANNING" />
          <text x={W / 2} y={278} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>Sprint Planning bắt đầu 🗓️</text>
          <g>
            {q.map((it, i) => (
              <g key={i} style={useScaleIn(ENTRY[i], 12)}>
                <rect x={W / 2 - 460} y={330 + i * 90} width={920} height={74} rx={12} fill={BG_CARD} stroke={it.c} strokeWidth={2} />
                <text x={W / 2 - 420} y={377 + i * 90} fontSize={24} fill={it.c} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{it.who}</text>
                <text x={W / 2 + 420} y={377 + i * 90} fontSize={28} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"{it.say}"</text>
              </g>
            ))}
          </g>
          <g style={{ ...look, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={730} w={960} h={120} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={785} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>toàn bộ ánh mắt…</text>
            <text x={W / 2} y={828} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đều nhìn về phía TA 😨</text>
          </g>
          <FigFooter label="mọi câu hỏi · cuối cùng đều dồn về PO" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 GANHNGHIEP (③) ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(94, 16);
  const right = useScaleIn(199, 14);
  const wrong = useScaleIn(328, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="LESSON ③ · BEARING THE KARMA" />
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 350px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={350} label="③ GÁNH NGHIỆP ĐẠO" sub="// you own the outcome" color={ORANGE} entry={0} big />
          </g>
          <g style={right}>
            <rect x={W / 2 - 480} y={500} width={960} height={150} rx={16} fill="#0E2A1A" stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={555} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>quyết định ĐÚNG ✅</text>
            <text x={W / 2} y={612} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">"đó là công lao của cả đội"</text>
          </g>
          <g style={wrong}>
            <rect x={W / 2 - 480} y={680} width={960} height={150} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={735} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>quyết định SAI ❌</text>
            <text x={W / 2} y={792} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"PO chọn mà" 💀</text>
          </g>
          <FigFooter label="công thì của đội · tội thì của PO" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 DATA ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const rows = [
    { who: "👑 CEO", claim: "ý tưởng này rất hay", ans: "ta cảm thấy thế", c: VIOLET },
    { who: "🙍 khách hàng", claim: "chắc chắn sẽ được dùng", ans: "ta nghĩ vậy", c: AMBER },
    { who: "📣 Marketing", claim: "xu hướng hiện nay là thế", ans: "Facebook người ta đang bàn", c: ACCENT_BLUE },
  ];
  const ENTRY = [161, 375, 559];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="'WHERE IS THE DATA?'" />
          <text x={W / 2} y={258} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={useFadeUp(10, 12)}>nhưng thiên kiếp thật sự · vẫn chưa xuất hiện…</text>
          <g>
            {rows.map((r, i) => (
              <g key={i} style={useScaleIn(ENTRY[i], 12)}>
                <rect x={W / 2 - 480} y={300 + i * 198} width={960} height={178} rx={16} fill={BG_CARD} stroke={r.c} strokeWidth={2.5} />
                <text x={W / 2 - 445} y={348 + i * 198} fontSize={24} fill={r.c} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{r.who}</text>
                <text x={W / 2 - 445} y={392 + i * 198} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"{r.claim}"</text>
                <text x={W / 2 - 445} y={432 + i * 198} fontSize={25} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>ta: "dữ liệu đâu?"</text>
                <text x={W / 2 + 445} y={432 + i * 198} fontSize={27} fill={WARNING_RED} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"{r.ans}" 💀</text>
              </g>
            ))}
          </g>
          <FigFooter label="ai cũng có ý kiến · không ai có số liệu" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 CHUNGDAO (④) ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(115, 16);
  const moral = useFadeUp(204, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="LESSON ④ · PROVE IT WITH DATA" />
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 380px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={380} label="④ CHỨNG ĐẠO BẰNG SỐ LIỆU" sub="// data over opinions" color={ACCENT_BLUE} entry={0} big />
          </g>
          <g style={moral}>
            <rect x={W / 2 - 480} y={540} width={960} height={250} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={605} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>trong Product Đạo…</text>
            <text x={W / 2} y={665} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ý kiến nào cũng nghe có vẻ ĐÚNG</text>
            <text x={W / 2} y={735} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cho đến khi DỮ LIỆU xuất hiện 📊</text>
          </g>
          <FigFooter label="opinion vs data · data luôn thắng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 RELEASE ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const proud = useScaleIn(150, 14);
  const wait = useFadeUp(330, 14);
  const none = useScaleIn(470, 16);
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE RELEASE" />
          <text x={W / 2} y={272} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>sau 6 THÁNG · hoàn thành 1 tính năng LỚN 🎉</text>
          <g style={proud}>
            <rect x={W / 2 - 480} y={310} width={960} height={100} rx={14} fill="#0E2A1A" stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={372} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Dev · QA · PM · ta — đều RẤT TỰ HÀO 😤</text>
          </g>
          <g style={wait}>
            {["📦 release · cả tông môn chờ đợi", "🕐 một ngày…  🕑 hai ngày…  📅 một tuần…"].map((t, i) => (
              <g key={i} opacity={useFade(340 + i * 78, 10)}>
                <rect x={W / 2 - 480} y={440 + i * 96} width={960} height={80} rx={12} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
                <text x={W / 2} y={490 + i * 96} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...none, transformOrigin: `${W / 2}px 730px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={650} width={960} height={170} rx={18} fill="#2A1010" stroke={WARNING_RED} strokeWidth={4} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={715} fontSize={48} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>KHÔNG AI DÙNG</text>
            <text x={W / 2} y={780} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">không một ai 💀</text>
          </g>
          <FigFooter label="6 tháng công sức · 0 người dùng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S11 GIATRI (⑤) ============
const S11: React.FC<{ duration: number }> = ({ duration }) => {
  const broke = useFadeUp(10, 14);
  const reveal = useScaleIn(197, 16);
  const moral = useScaleIn(242, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="LESSON ⑤ · IT'S ABOUT VALUE" />
          <text x={W / 2} y={300} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={broke}>toàn bộ đạo tâm của ta · trực tiếp vụn vỡ 💔</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 440px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={440} label="⑤ GIÁ TRỊ ĐẠO" sub="// shipping ≠ value" color={AMBER} entry={0} big />
          </g>
          <g style={{ ...moral, transformOrigin: `${W / 2}px 680px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={590} width={460} height={210} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2 - 240} y={650} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>làm RA tính năng</text>
            <text x={W / 2 - 240} y={730} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>KHÔNG khó</text>
            <rect x={W / 2 + 10} y={590} width={460} height={210} rx={16} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2 + 240} y={650} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>để người dùng SỬ DỤNG</text>
            <text x={W / 2 + 240} y={730} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>mới KHÓ 🎯</text>
          </g>
          <FigFooter label="output ≠ outcome · giá trị mới là đạo" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S12 CHANLY ============
const S12: React.FC<{ duration: number }> = ({ duration }) => {
  const rows = [
    { who: "🧩 BA", say: "khách hàng muốn gì?", c: ACCENT_BLUE },
    { who: "💻 Dev", say: "làm như thế nào?", c: JADE },
    { who: "🔍 QA", say: "nó có lỗi không?", c: VIOLET },
    { who: "📋 PM", say: "bao giờ xong?", c: AMBER },
  ];
  const ENTRY = [163, 256, 321, 382];
  const po = useScaleIn(482, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="11" label="THE ONE QUESTION" />
          <text x={W / 2} y={258} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>sau nhiều năm · ta ngộ ra chân lý 🏯</text>
          <g>
            {rows.map((r, i) => (
              <g key={i} style={useScaleIn(ENTRY[i], 12)}>
                <rect x={W / 2 - 460} y={300 + i * 86} width={920} height={70} rx={12} fill={BG_CARD} stroke={r.c} strokeWidth={2} />
                <text x={W / 2 - 420} y={344 + i * 86} fontSize={24} fill={r.c} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{r.who}</text>
                <text x={W / 2 + 420} y={344 + i * 86} fontSize={28} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"{r.say}"</text>
              </g>
            ))}
          </g>
          <g style={{ ...po, transformOrigin: `${W / 2}px 740px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={660} width={960} height={170} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
            <text x={W / 2} y={720} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>còn PO · chỉ hỏi MỘT câu:</text>
            <text x={W / 2} y={788} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"CÓ ĐÁNG LÀM KHÔNG?" 🎯</text>
          </g>
          <FigFooter label="ai cũng hỏi 'how' · chỉ PO hỏi 'why'" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S13 VOHAN (punchline) ============
const S13: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const limit = useFadeUp(10, 14);
  const infinite = useScaleIn(233, 14);
  const newbie = useFadeUp(327, 14);
  const punch = useScaleIn(447, 16);
  const kgg = useScaleIn(551, 14);
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="12" label="THE TRUE NATURE OF PO" />
          <g style={limit}>
            <text x={W / 2} y={265} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thời gian · nhân lực · ngân sách</text>
            <text x={W / 2} y={313} fontSize={36} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>đều HỮU HẠN ⏳</text>
          </g>
          <g style={infinite}>
            <text x={W / 2} y={395} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng ý tưởng của nhân loại</text>
            <text x={W / 2} y={443} fontSize={36} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>lại VÔ HẠN ♾️</text>
          </g>
          <g style={newbie}>
            <rect x={W / 2 - 480} y={500} width={960} height={120} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={550} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người mới vào nghề nghĩ:</text>
            <text x={W / 2} y={595} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PO quyết định sẽ LÀM GÌ</text>
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 490} y={660} width={980} height={210} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={720} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhưng người đã đắc đạo đều hiểu:</text>
            <text x={W / 2} y={780} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PO thật sự là người quyết định</text>
          </g>
          <g style={{ ...kgg, transformOrigin: `${W / 2}px 840px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={840} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">KHÔNG LÀM GÌ 🤯</text>
          </g>
          <FigFooter label="the real job · deciding what NOT to build" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S14 CTA ============
const S14: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(6, 12);
  const cmt = useScaleIn(68, 14);
  const btn = useScaleIn(110, 14);
  const pulse = 1 + 0.03 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <g style={ask}>
            <text x={W / 2} y={500} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Ngươi muốn nghe POV</text>
            <text x={W / 2} y={555} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">của nghề nào tiếp theo? 🤔</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={675} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 comment phía dưới 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={760} width={600} height={140} rx={70} fill={JADE} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={772} width={570} height={116} rx={58} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
              <text x={W / 2} y={848} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={980} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(150, 12)}>để không bỏ lỡ truyền kỳ giới IT tiếp theo 🏯</text>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14];

export const PovPo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("pov_po/voice.mp3")} />
      {beats.map((b, i) => {
        const Slide = SLIDES[i];
        return (
          <Sequence key={b.index} from={Math.round(b.start * FPS)} durationInFrames={Math.round(b.duration * FPS)}>
            <Slide duration={b.duration} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
