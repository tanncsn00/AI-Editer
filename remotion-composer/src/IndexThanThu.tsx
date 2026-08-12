import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./index_than_thu_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "10";

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
          <pattern id="ixgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="ixgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="ixglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ixscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#ixgrid)" />
        <rect width={W} height={H} fill="url(#ixgrid2)" />
        <rect width={W} height={H} fill="url(#ixglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#ixscan)" />
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
  const w = big ? 560 : 440;
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={cx - w / 2} y={cy - 60} width={w} height={120} rx={16} fill={BG_CARD} stroke={color} strokeWidth={3.5} />
      <text x={cx} y={cy + (sub ? -4 : 16)} fontSize={big ? 56 : 46} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{label}</text>
      {sub && <text x={cx} y={cy + 38} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};

// ============ S1 HOOK · Database ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const arch = useScaleIn(40, 14);
  const reveal = useScaleIn(300, 16);
  const items = ["tên đệ tử", "linh thạch", "giao dịch", "công pháp", "pháp bảo"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE GREAT ARCHIVE" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Một nơi cất giữ vô số bí tịch của cả tông môn…</text>
          <g style={arch}>
            <rect x={W / 2 - 420} y={360} width={840} height={300} rx={18} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={445} fontSize={56} textAnchor="middle">🏯📚</text>
            <text x={W / 2} y={500} fontSize={32} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CHÂN KINH CÁC</text>
            <g>
              {items.map((it, i) => {
                const col = i % 3, row = Math.floor(i / 3);
                const x = W / 2 - 280 + col * 280;
                return (
                  <g key={i} opacity={useFade(70 + i * 16, 10)}>
                    <rect x={x - 110} y={545 + row * 60} width={220} height={46} rx={8} fill={BG_TERM} stroke={TEXT_MUTE} strokeWidth={1} />
                    <text x={x} y={575 + row * 60} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>{it}</text>
                  </g>
                );
              })}
            </g>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={800} label="DATABASE" sub="// kho chứa toàn bộ thông tin" color={AMBER} entry={0} big />
          </g>
          <text x={W / 2} y={940} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(360, 12)}>Database = Chân Kinh Các của tông môn 🏯</text>
          <FigFooter label="database · nơi cất giữ mọi dữ liệu" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 QUESTION ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const belief = useFadeUp(30, 14);
  const q = useScaleIn(120, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="ONE FATEFUL QUESTION" />
          <g style={belief}>
            <rect x={W / 2 - 460} y={340} width={920} height={170} rx={16} fill={BG_CARD} stroke={AMBER} strokeWidth={2.5} />
            <text x={W / 2} y={400} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>các trưởng lão tin rằng:</text>
            <text x={W / 2} y={458} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>“chỉ cần cất giữ THẬT NHIỀU là đủ” 📚</text>
          </g>
          <text x={W / 2} y={620} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(90, 12)}>cho tới một ngày · một đệ tử chạy tới hỏi…</text>
          <g style={{ ...q, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={700} w={940} h={200} color={ACCENT_BLUE} thick={3} />
            <text x={W / 2} y={800} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>“Hồ sơ của Trương Tam</text>
            <text x={W / 2} y={862} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>… đâu?” 🤔</text>
          </g>
          <FigFooter label="cất thì dễ · TÌM mới là vấn đề" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 SCAN ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const scrolls = [
    { t: "quyển 1", e: 60 }, { t: "quyển 2", e: 95 }, { t: "quyển 3", e: 130 },
  ];
  const esc = ["10", "100", "1.000", "10.000"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="FULL SCAN" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>trưởng lão bước vào · lật từng quyển một…</text>
          {scrolls.map((s, i) => (
            <g key={i} style={{ ...useScaleIn(s.e, 10), transformOrigin: `${W / 2}px ${390 + i * 90}px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 380} y={355 + i * 90} width={760} height={72} rx={12} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2} />
              <text x={W / 2 - 330} y={400 + i * 90} fontSize={30} textAnchor="middle">📜</text>
              <text x={W / 2 - 60} y={400 + i * 90} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{s.t}</text>
              <text x={W / 2 + 280} y={400 + i * 90} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✗ không phải</text>
            </g>
          ))}
          <text x={W / 2} y={680} fontSize={30} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} style={useFadeUp(170, 12)}>cứ như vậy…</text>
          <g>
            {esc.map((n, i) => (
              <g key={i} opacity={useFade(210 + i * 30, 10)}>
                <rect x={W / 2 - 470 + i * 240} y={720} width={210} height={90} rx={12} fill={BG_TERM} stroke={ORANGE} strokeWidth={2} />
                <text x={W / 2 - 365 + i * 240} y={765} fontSize={34} fill={ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{n}</text>
                <text x={W / 2 - 365 + i * 240} y={795} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>quyển</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={895} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useFadeUp(350, 12)}>…vạn quyển mới tìm thấy 😩</text>
          <FigFooter label="full scan · duyệt từ đầu tới cuối" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 PROBLEM ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const scale = useScaleIn(30, 14);
  const each = useFadeUp(140, 14);
  const ma = useScaleIn(240, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="IT DOESN'T SCALE" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>ban đầu · không ai thấy có vấn đề…</text>
          <g style={{ ...scale, transformOrigin: `${W / 2}px 440px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={360} width={880} height={150} rx={16} fill={BG_CARD} stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2} y={425} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng khi chứa</text>
            <text x={W / 2} y={482} fontSize={44} fill={ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>HÀNG TRIỆU bí tịch 📚📚📚</text>
          </g>
          <g style={each}>
            <rect x={W / 2 - 440} y={560} width={880} height={130} rx={14} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={2} />
            <text x={W / 2} y={612} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>mỗi lần tìm kiếm</text>
            <text x={W / 2} y={660} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>đều phải lật TỪ ĐẦU TỚI CUỐI 🔁</text>
          </g>
          <g style={{ ...ma, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={760} w={940} h={140} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={820} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>toàn bộ tông môn bắt đầu</text>
            <text x={W / 2} y={870} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">xuất hiện TÂM MA 😵</text>
          </g>
          <FigFooter label="dữ liệu càng lớn · tìm càng chậm" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 INDEX BORN ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(40, 16);
  const what = useFadeUp(170, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="A NEW WAY IS BORN" />
          <text x={W / 2} y={320} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>đó là lúc…</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 460px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={460} label="INDEX ĐẠO" sub="// thần thư dẫn lộ ra đời" color={JADE} entry={0} big />
          </g>
          <g style={what}>
            <rect x={W / 2 - 460} y={600} width={920} height={120} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={650} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✗ KHÔNG thay đổi bí tịch</text>
            <text x={W / 2} y={695} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✓ chỉ tạo thêm 1 cuốn thần thư đặc biệt</text>
          </g>
          <g style={{ ...useScaleIn(240, 14), transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={780} w={940} h={130} color={JADE} thick={3} />
            <text x={W / 2} y={838} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>trong đó ghi rõ:</text>
            <text x={W / 2} y={882} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">MỖI bí tịch nằm ở ĐÂU 📖</text>
          </g>
          <FigFooter label="index · không đổi data · chỉ thêm bản đồ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 EXAMPLE ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const want = useFadeUp(30, 14);
  const open = useScaleIn(130, 14);
  const lookup = useScaleIn(240, 14);
  const reveal = useScaleIn(380, 16);
  const rows = [
    { k: "Dòng", v: "382918" },
    { k: "Kệ", v: "71" },
    { k: "Tầng", v: "3" },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="ONE LOOKUP" />
          <text x={W / 2} y={290} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={want}>muốn tìm <tspan fill={AMBER_BRIGHT} fontWeight={900}>Trương Tam</tspan>?</text>
          <text x={W / 2} y={350} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(70, 12)}>✗ không cần lật 1 triệu quyển bí tịch</text>
          <g style={open}>
            <text x={W / 2} y={420} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✓ chỉ cần mở Thần Thư Dẫn Lộ → tìm mục:</text>
          </g>
          <g style={{ ...lookup, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={470} width={840} height={340} rx={18} fill={BG_TERM} stroke={JADE} strokeWidth={3} />
            <rect x={W / 2 - 380} y={500} width={760} height={70} rx={10} fill="#15243B" stroke={AMBER} strokeWidth={2} />
            <text x={W / 2} y={546} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>「 Trương Tam 」</text>
            {rows.map((r, i) => (
              <g key={i}>
                <text x={W / 2 - 340} y={628 + i * 64} fontSize={28} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>{r.k}</text>
                <text x={W / 2 - 200} y={628 + i * 64} fontSize={28} fill={TEXT_MUTE} fontFamily="'JetBrains Mono', monospace">→</text>
                <text x={W / 2 + 340} y={628 + i * 64} fontSize={34} fill={JADE} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{r.v}</text>
              </g>
            ))}
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 910px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={910} label="INDEX" sub="// cuốn thần thư dẫn lộ" color={JADE} entry={0} big />
          </g>
          <FigFooter label="index lookup · biết ngay vị trí · O(1)" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 SHOCK ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const before = useScaleIn(20, 12);
  const after = useScaleIn(70, 12);
  const shock = useScaleIn(130, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="THE WORLD SHAKES" />
          <g style={{ ...before, transformOrigin: `${W / 2}px 440px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={360} width={920} height={150} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={415} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>TRƯỚC · full scan</text>
            <text x={W / 2} y={472} fontSize={40} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>hàng VẠN lần lật sách 😩</text>
          </g>
          <text x={W / 2} y={570} fontSize={44} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={useFade(55, 10)}>↓</text>
          <g style={{ ...after, transformOrigin: `${W / 2}px 670px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={600} width={920} height={150} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={655} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>NAY · với Index</text>
            <text x={W / 2} y={712} fontSize={40} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>chỉ VÀI lần tra cứu ⚡</text>
          </g>
          <g style={{ ...shock, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={865} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">toàn bộ tiên giới CHẤN ĐỘNG 🌩️</text>
          </g>
          <FigFooter label="O(n) → O(log n) · thay đổi cuộc chơi" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 COST ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const law = useScaleIn(30, 14);
  const sync = useFadeUp(180, 14);
  const wrong = useScaleIn(320, 14);
  const trade = useScaleIn(460, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE PRICE OF POWER" />
          <g style={{ ...law, transformOrigin: `${W / 2}px 300px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={310} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>thần thư càng mạnh · nhân quả càng lớn ⚖️</text>
          </g>
          <g style={sync}>
            <rect x={W / 2 - 460} y={370} width={920} height={170} rx={14} fill={BG_CARD} stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2} y={425} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>bí tịch MỚI → thần thư phải cập nhật</text>
            <text x={W / 2} y={470} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>bí tịch ĐỔI → thần thư phải đổi</text>
            <text x={W / 2} y={515} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// data thay đổi · index phải theo</text>
          </g>
          <g style={{ ...wrong, transformOrigin: `${W / 2}px 615px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={630} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nếu không → nó sẽ CHỈ ĐƯỜNG SAI ⚠️</text>
          </g>
          <g style={{ ...trade, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={680} width={455} height={210} rx={16} fill="#0E2A1A" stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2 - 242} y={745} fontSize={44} textAnchor="middle">⚡</text>
            <text x={W / 2 - 242} y={800} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TÌM nhanh hơn</text>
            <text x={W / 2 - 242} y={845} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// read nhanh</text>
            <rect x={W / 2 + 15} y={680} width={455} height={210} rx={16} fill="#2A1810" stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2 + 242} y={745} fontSize={44} textAnchor="middle">🐢</text>
            <text x={W / 2 + 242} y={800} fontSize={30} fill={ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>GHI phức tạp hơn</text>
            <text x={W / 2 + 242} y={845} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// write chậm</text>
          </g>
          <text x={W / 2} y={950} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={useFadeUp(560, 12)}>đó là cái giá của sức mạnh 💫</text>
          <FigFooter label="read↑ ↔ write↓ · không có bữa trưa miễn phí" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 MORE ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const q = useScaleIn(30, 14);
  const smile = useFadeUp(150, 14);
  const costs = useFadeUp(240, 14);
  const bal = useScaleIn(360, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="MORE = BETTER?" />
          <g style={{ ...q, transformOrigin: `${W / 2}px 320px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={250} width={940} height={150} rx={16} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
            <text x={W / 2} y={305} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>tu sĩ mới nhập môn hỏi:</text>
            <text x={W / 2} y={360} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>“tạo THẬT NHIỀU Index = càng mạnh?” 🤔</text>
          </g>
          <text x={W / 2} y={470} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={smile}>các trưởng lão chỉ… cười 😏</text>
          <g style={costs}>
            <rect x={W / 2 - 460} y={520} width={920} height={150} rx={14} fill={BG_TERM} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={568} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>vì mỗi cuốn thần thư đều phải:</text>
            <text x={W / 2} y={625} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>duy trì · cập nhật · tiêu hao tài nguyên</text>
          </g>
          <g style={{ ...bal, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={710} width={455} height={170} rx={16} fill="#2A1810" stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2 - 242} y={770} fontSize={32} fill={ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>QUÁ ÍT</text>
            <text x={W / 2 - 242} y={825} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tìm kiếm chậm 🐌</text>
            <rect x={W / 2 + 15} y={710} width={455} height={170} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2 + 242} y={770} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>QUÁ NHIỀU</text>
            <text x={W / 2 + 242} y={825} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ghi chép chậm 🐢</text>
          </g>
          <FigFooter label="index không free · mỗi cái là 1 cái giá" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 ENDING ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const hard = useScaleIn(40, 14);
  const where = useFadeUp(200, 14);
  const map = useScaleIn(360, 14);
  const reveal = useScaleIn(560, 18);
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="THE REAL MASTERY" />
          <g style={hard}>
            <text x={W / 2} y={295} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">điều khó nhất của Index Đạo…</text>
            <text x={W / 2} y={350} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>chưa bao giờ là TẠO RA Index</text>
          </g>
          <g style={where}>
            <rect x={W / 2 - 470} y={390} width={940} height={120} rx={16} fill={BG_TERM} stroke={JADE} strokeWidth={3} />
            <text x={W / 2} y={440} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà là biết: nên lập thần thư ở</text>
            <text x={W / 2} y={486} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>ĐÂU · và KHÔNG nên ở đâu 🎯</text>
          </g>
          <g style={map}>
            <rect x={W / 2 - 470} y={550} width={455} height={120} rx={14} fill={BG_CARD} stroke={AMBER} strokeWidth={2} />
            <text x={W / 2 - 242} y={595} fontSize={30} textAnchor="middle">🏯</text>
            <text x={W / 2 - 242} y={635} fontSize={24} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Database</text>
            <text x={W / 2 - 242} y={662} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace">= Chân Kinh Các</text>
            <rect x={W / 2 + 15} y={550} width={455} height={120} rx={14} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
            <text x={W / 2 + 242} y={595} fontSize={30} textAnchor="middle">📖</text>
            <text x={W / 2 + 242} y={635} fontSize={24} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Index</text>
            <text x={W / 2 + 242} y={662} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace">= Mục Lục Thần Thư</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={720} width={960} height={220} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.75 + 0.25 * glow} />
            <text x={W / 2} y={770} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">khi bí tịch chất đầy thiên địa…</text>
            <text x={W / 2} y={825} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thứ quyết định tốc độ không phải kho sách</text>
            <text x={W / 2} y={888} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà là NGƯƠI CÓ BIẾT TÌM Ở ĐÂU 🧭</text>
          </g>
          <FigFooter label="index · nghệ thuật biết tìm ở đâu" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const IndexThanThu: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("index_than_thu/voice.mp3")} />
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
