import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./pov_tester_beats.json";

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
          <pattern id="pvgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="pvgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="pvglow" cx="50%" cy="36%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pvscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#pvgrid)" />
        <rect width={W} height={H} fill="url(#pvgrid2)" />
        <rect width={W} height={H} fill="url(#pvglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#pvscan)" />
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
  const w = big ? 620 : 460;
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={cx - w / 2} y={cy - 60} width={w} height={120} rx={16} fill={BG_CARD} stroke={color} strokeWidth={3.5} />
      <text x={cx} y={cy + (sub ? -4 : 16)} fontSize={big ? 46 : 42} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{label}</text>
      {sub && <text x={cx} y={cy + 36} fontSize={21} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};
const Quote: React.FC<{ y: number; who: string; whoColor: string; say: string; emoji: string; sayColor?: string; style?: React.CSSProperties }> = ({ y, who, whoColor, say, emoji, sayColor = TEXT_PRI, style }) => (
  <g style={style}>
    <rect x={W / 2 - 470} y={y} width={940} height={108} rx={14} fill={BG_CARD} stroke={whoColor} strokeWidth={2.5} />
    <text x={W / 2 - 430} y={y + 44} fontSize={24} fill={whoColor} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{who} {emoji}</text>
    <text x={W / 2 - 430} y={y + 86} fontSize={31} fill={sayColor} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"{say}"</text>
  </g>
);

// ============ S1 INTRO ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const chain = useScaleIn(171, 14);
  const naive = useScaleIn(296, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="POV · THE TESTER" />
          <text x={W / 2} y={350} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(20, 12)}>Năm ấy · ta nhập môn KIỂM CHỨNG ĐẠO</text>
          <text x={W / 2} y={420} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(60, 12)}>ta tin công việc rất đơn giản:</text>
          <g style={{ ...chain, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={480} width={940} height={150} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={540} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tìm bug → báo bug → Dev sửa</text>
            <text x={W / 2} y={595} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>→ thiên hạ thái bình 🤣</text>
          </g>
          <g style={{ ...naive, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={700} w={940} h={130} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={758} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>sau này mới biết…</text>
            <text x={W / 2} y={808} fontSize={40} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">ta đã quá NGÂY THƠ 💀</text>
          </g>
          <FigFooter label="tester · người gánh nghiệp của cả tông môn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 DAY_ONE ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const q1 = useFadeUp(140, 14);
  const q2 = useScaleIn(199, 14);
  const q3 = useScaleIn(250, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="DAY ONE" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>ngày đầu · trưởng lão đưa hệ thống:</text>
          <Quote y={360} who="🧙 trưởng lão" whoColor={AMBER} say="đi tìm bug đi" emoji="" style={q1} />
          <Quote y={500} who="🙋 ta" whoColor={JADE} say="bug ở đâu?" emoji="" style={q2} />
          <g style={{ ...q3, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={650} width={940} height={140} rx={14} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={705} fontSize={24} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>🧙 trưởng lão:</text>
            <text x={W / 2} y={755} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"nếu biết ở đâu thì đã sửa rồi" 💀</text>
          </g>
          <text x={W / 2} y={870} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(310, 12)}>ngày đầu tiên · ta cảm nhận được thiên đạo 🤣</text>
          <FigFooter label="welcome · không ai biết bug ở đâu cả" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 NOT_REPRO ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const joy = useFadeUp(80, 14);
  const eyes = useScaleIn(236, 14);
  const report = useFadeUp(375, 14);
  const repro = useScaleIn(605, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="CANNOT REPRODUCE" />
          <g style={joy}>
            <rect x={W / 2 - 460} y={250} width={920} height={110} rx={14} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
            <text x={W / 2} y={315} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tìm được bug · vui như đào BÍ BẢO 💎</text>
          </g>
          <text x={W / 2} y={420} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={eyes}>nhưng phía xa · 1 Dev nhìn ta ánh mắt hình viên đạn 🔫</text>
          <g style={report}>
            <rect x={W / 2 - 470} y={470} width={940} height={170} rx={14} fill={BG_TERM} stroke={ACCENT_BLUE} strokeWidth={2} />
            <text x={W / 2} y={518} fontSize={26} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ta viết báo cáo cực kỹ 📝</text>
            <text x={W / 2} y={565} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>mô tả · từng bước tái hiện</text>
            <text x={W / 2} y={605} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>kết quả mong đợi · kết quả thực tế</text>
          </g>
          <g style={{ ...repro, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={690} w={940} h={140} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={745} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>1 canh giờ sau · Dev hồi âm:</text>
            <text x={W / 2} y={795} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"không reproduce được" 💀</text>
          </g>
          <FigFooter label="works on my machine · phần 1" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 MAY_EM ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(79, 16);
  const each = useFadeUp(150, 14);
  const watch = useFadeUp(294, 14);
  const say = useScaleIn(505, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="WORKS ON MY MACHINE" />
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 300px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={300} label="VIDEO CHỨNG ĐẠO" sub="// bằng chứng không thể chối cãi" color={JADE} entry={0} big />
          </g>
          <g style={each}>
            {["🎥 mỗi bug có video", "📸 mỗi bug có ảnh", "👣 mỗi bug có từng bước tái hiện"].map((t, i) => (
              <g key={i} opacity={useFade(160 + i * 52, 10)}>
                <rect x={W / 2 - 450} y={400 + i * 80} width={900} height={64} rx={10} fill={BG_CARD} stroke={JADE} strokeWidth={1.5} />
                <text x={W / 2} y={442 + i * 80} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={710} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={watch}>ta tưởng đã đắc đạo · Dev xem hết · trầm mặc hồi lâu…</text>
          <g style={{ ...say, transformOrigin: `${W / 2}px 820px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={760} w={940} h={130} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={820} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Máy em không bị" 💀</text>
            <text x={W / 2} y={865} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>→ đạo tâm ta xuất hiện vết nứt đầu tiên</text>
          </g>
          <FigFooter label="works on my machine · phần 2" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 DETECTIVE ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const tools = ["📜 Log Đạo", "🗄️ Database Truy Hồn", "⏱️ Timestamp Định Vị", "🎬 Screen Record"];
  const concl = useScaleIn(281, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="THE DETECTIVE" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>ta tiếp tục tu luyện vô số công pháp:</text>
          {tools.map((t, i) => {
            const col = i % 2, row = Math.floor(i / 2);
            return (
              <g key={i} style={{ ...useScaleIn(100 + i * 45, 12), transformOrigin: `${W / 2}px ${410 + row * 130}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 470 + col * 480} y={360 + row * 130} width={460} height={108} rx={14} fill={BG_CARD} stroke={VIOLET} strokeWidth={2.5} />
                <text x={W / 2 - 240 + col * 480} y={422 + row * 130} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            );
          })}
          <g style={{ ...concl, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={650} w={960} h={150} color={AMBER} thick={3} />
            <text x={W / 2} y={710} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ta ngày càng giống một ĐIỀU TRA VIÊN 🕵️</text>
            <text x={W / 2} y={760} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">hơn là một Tester</text>
          </g>
          <FigFooter label="qa = forensics · điều tra hiện trường số" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 CREATURE ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const rows = [
    { who: "👁️ Tester nhìn", res: "→ XUẤT HIỆN", c: JADE, e: 150 },
    { who: "💻 Dev nhìn", res: "→ biến mất", c: TEXT_MUTE, e: 220 },
    { who: "📋 PM demo", res: "→ biến mất", c: TEXT_MUTE, e: 290 },
    { who: "👔 CEO kiểm tra", res: "→ biến mất", c: TEXT_MUTE, e: 350 },
  ];
  const prod = useScaleIn(424, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="THE MYSTERIOUS BUG" />
          <text x={W / 2} y={300} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(70, 12)}>BUG = sinh vật cực kỳ THẦN BÍ 👾</text>
          {rows.map((r, i) => {
            const y = 360 + i * 88;
            return (
              <g key={i} opacity={useFade(r.e, 10)}>
                <rect x={W / 2 - 460} y={y} width={920} height={72} rx={12} fill={BG_CARD} stroke={r.c} strokeWidth={2} />
                <text x={W / 2 - 420} y={y + 46} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.who}</text>
                <text x={W / 2 + 420} y={y + 46} fontSize={28} fill={r.c === TEXT_MUTE ? TEXT_MUTE : r.c} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.res}</text>
              </g>
            );
          })}
          <g style={{ ...prod, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={730} w={960} h={140} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={788} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng khi release PRODUCTION…</text>
            <text x={W / 2} y={838} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">nó lập tức HIỆN NGUYÊN HÌNH 💥</text>
          </g>
          <FigFooter label="heisenbug · quan sát là nó trốn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 PROD_CATCH ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const thien = useScaleIn(50, 14);
  const dev = useScaleIn(307, 14);
  const collapse = useFadeUp(475, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="PRODUCTION CATCHES IT" />
          <g style={{ ...thien, transformOrigin: `${W / 2}px 300px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={310} fontSize={34} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>production nghênh đón THIÊN KIẾP 🔥</text>
          </g>
          <g>
            {["🙍 khách hàng phát hiện bug", "📋 PM phát hiện bug", "👔 CEO phát hiện bug", "🌍 toàn bộ tam giới phát hiện bug"].map((t, i) => (
              <g key={i} opacity={useFade(110 + i * 50, 10)}>
                <rect x={W / 2 - 460} y={360 + i * 76} width={920} height={62} rx={10} fill="#2A1010" stroke={WARNING_RED} strokeWidth={1.5} />
                <text x={W / 2} y={400 + i * 76} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...dev, transformOrigin: `${W / 2}px 730px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={680} width={940} height={110} rx={14} fill={BG_TERM} stroke={ACCENT_BLUE} strokeWidth={2.5} />
            <text x={W / 2} y={725} fontSize={26} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Dev mới chậm rãi xuất hiện · nhìn màn hình:</text>
            <text x={W / 2} y={768} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"À… bug này THẬT" 💀</text>
          </g>
          <text x={W / 2} y={865} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={collapse}>10 năm tu vi của ta · suýt trực tiếp sụp đổ 🤣</text>
          <FigFooter label="khoảnh khắc tester được minh oan" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 BUG_SINH_BUG ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const not = useFadeUp(40, 14);
  const fix = useScaleIn(115, 14);
  const reveal = useScaleIn(398, 16);
  const multiply = useFadeUp(450, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="BUG BREEDS BUG" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={not}>thứ đáng sợ nhất · không phải bug…</text>
          <g style={{ ...fix, transformOrigin: `${W / 2}px 430px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={350} width={940} height={150} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={410} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà là khoảnh khắc bug đã được FIX…</text>
            <text x={W / 2} y={465} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>ta test lại → 2 bug MỚI xuất hiện 💀</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 600px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={600} label="BUG SINH BUG ĐẠI PHÁP" sub="// regression · sinh sôi bất diệt" color={WARNING_RED} entry={0} big />
          </g>
          <g style={multiply}>
            <text x={W / 2} y={730} fontSize={44} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={900}>1 → 2 → 4 → 8 🐛🐛🐛</text>
            <text x={W / 2} y={790} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">sinh sôi vô tận · nhân quả bất diệt ♾️</text>
          </g>
          <FigFooter label="regression · sửa 1 chỗ · hỏng 3 chỗ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 NO_ONE ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const dev = useScaleIn(224, 14);
  const user = useScaleIn(321, 14);
  const beyond = useFadeUp(368, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="NO ONE CLICKS LIKE THAT" />
          <text x={W / 2} y={310} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(160, 12)}>mỗi lần ta báo bug · Dev thường nói:</text>
          <g style={{ ...dev, transformOrigin: `${W / 2}px 430px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={360} width={940} height={140} rx={16} fill={BG_TERM} stroke={ACCENT_BLUE} strokeWidth={3} />
            <text x={W / 2} y={445} fontSize={38} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"không ai bấm như vậy đâu" 🤷</text>
          </g>
          <g style={{ ...user, transformOrigin: `${W / 2}px 620px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={550} width={940} height={140} rx={16} fill="#0E2A1A" stroke={JADE} strokeWidth={3} />
            <text x={W / 2} y={605} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhưng không hiểu vì sao…</text>
            <text x={W / 2} y={655} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">user LUÔN bấm như vậy 🤡</text>
          </g>
          <text x={W / 2} y={790} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={beyond}>…thậm chí theo cách thiên đạo cũng không suy diễn nổi 😵</text>
          <FigFooter label="edge case · user là vô hạn sáng tạo" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 ENDING ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const enemy = useScaleIn(124, 14);
  const vs = useScaleIn(238, 14);
  const reveal = useScaleIn(407, 18);
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="NATURAL ENEMIES" />
          <g style={{ ...enemy, transformOrigin: `${W / 2}px 300px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={290} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Tester &amp; Dev · không phải kẻ thù…</text>
            <text x={W / 2} y={345} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà là THIÊN ĐỊCH ⚔️</text>
          </g>
          <g style={vs}>
            <rect x={W / 2 - 470} y={400} width={455} height={160} rx={16} fill="#0E2A1A" stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2 - 242} y={455} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>TESTER</text>
            <text x={W / 2 - 242} y={500} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>cả ngày chứng minh:</text>
            <text x={W / 2 - 242} y={535} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"nó HỎNG"</text>
            <rect x={W / 2 + 15} y={400} width={455} height={160} rx={16} fill="#0E1F35" stroke={ACCENT_BLUE} strokeWidth={2.5} />
            <text x={W / 2 + 242} y={455} fontSize={28} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>DEV</text>
            <text x={W / 2 + 242} y={500} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>cả ngày chứng minh:</text>
            <text x={W / 2 + 242} y={535} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"nó KHÔNG hỏng"</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={650} width={960} height={230} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.75 + 0.25 * glow} />
            <text x={W / 2} y={710} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cho tới khi PRODUCTION xuất hiện…</text>
            <text x={W / 2} y={755} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">thiên đạo tự đưa ra phán quyết</text>
            <text x={W / 2} y={820} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">production thường đứng</text>
            <text x={W / 2} y={862} fontSize={36} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">về phía TESTER 🤣</text>
          </g>
          <FigFooter label="production · trọng tài cuối cùng của tam giới" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S11 CTA ============
const S11: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(6, 12);
  const cmt = useScaleIn(60, 14);
  const btn = useScaleIn(120, 14);
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

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11];

export const PovTester: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("pov_tester/voice.mp3")} />
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
