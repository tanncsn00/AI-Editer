import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./cache_than_khi_beats.json";

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
const SLATE = "#A4B5D0";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

const useFadeUp = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [e, e + d], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};
const useScaleIn = (e: number, d = 18) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [e, e + d], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};
const useFade = (e: number, d = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const BlueprintBG: React.FC<{ glow?: string }> = ({ glow = AMBER }) => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="cagrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="cagrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="caglow" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.08" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cascan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#cagrid)" />
        <rect width={W} height={H} fill="url(#cagrid2)" />
        <rect width={W} height={H} fill="url(#caglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#cascan)" />
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

// diagram node
const Node: React.FC<{ cx: number; cy: number; w?: number; h?: number; emoji: string; label: string; sub?: string; color: string; entry: number }> = ({ cx, cy, w = 360, h = 130, emoji, label, sub, color, entry }) => {
  const a = useScaleIn(entry, 12);
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={14} fill={BG_CARD} stroke={color} strokeWidth={2.5} />
      <text x={cx - w / 2 + 44} y={cy + 16} fontSize={52} textAnchor="middle">{emoji}</text>
      <text x={cx + 20} y={sub ? cy - 6 : cy + 12} fontSize={32} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{label}</text>
      {sub && <text x={cx + 20} y={cy + 34} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(20, 12);
  const near = useScaleIn(110, 14);
  const far = useScaleIn(180, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="AN ANCIENT TRUTH" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>Câu nói lưu truyền từ thượng cổ:</text>
          <g style={{ ...far, transformOrigin: `${W / 2}px 480px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={400} width={880} height={150} rx={14} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={460} fontSize={36} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🏔️ lấy đồ từ XA</text>
            <text x={W / 2} y={518} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>luôn CHẬM (vượt ngàn dặm)</text>
          </g>
          <g style={{ ...near, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={580} width={880} height={150} rx={14} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={640} fontSize={36} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🏠 lấy đồ từ GẦN</text>
            <text x={W / 2} y={698} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>luôn NHANH (ngay bên cạnh)</text>
          </g>
          <g style={useFadeUp(240, 14)}>
            <text x={W / 2} y={830} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">nghe đơn giản · nhưng vô số đại năng hệ thống</text>
            <text x={W / 2} y={882} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>đều NGỘ ĐẠO từ câu này 🧘</text>
          </g>
          <FigFooter label="chân lý đơn giản · sức mạnh vô biên" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 REQUEST JOURNEY ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="THE REQUEST'S JOURNEY" />
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Mỗi lần mở app · 1 'đạo thần niệm' được gửi đi:</text>
          <Node cx={W / 2} cy={400} emoji="🧑" label="NGƯỜI DÙNG" sub="gửi request" color={SLATE} entry={40} />
          <line x1={W / 2} y1={468} x2={W / 2} y2={530} stroke={ACCENT_BLUE} strokeWidth={3} strokeDasharray="8 6" opacity={frame > 90 ? 0.7 : 0} />
          <text x={W / 2 + 30} y={508} fontSize={22} fill={ACCENT_BLUE} fontFamily="'JetBrains Mono', monospace" fontWeight={600} opacity={frame > 90 ? 1 : 0}>↓ vượt giới vực</text>
          <Node cx={W / 2} cy={600} emoji="🛡️" label="BACKEND MÔN" sub="xử lý logic" color={ACCENT_BLUE} entry={100} />
          <line x1={W / 2} y1={668} x2={W / 2} y2={730} stroke={VIOLET} strokeWidth={3} strokeDasharray="8 6" opacity={frame > 170 ? 0.7 : 0} />
          <Node cx={W / 2} cy={830} w={460} h={170} emoji="📜" label="CHÂN KINH CÁC" sub="= DATABASE" color={VIOLET} entry={180} />
          <g style={useFadeUp(260, 12)}>
            <text x={W / 2} y={990} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nơi cất giữ TOÀN BỘ chân tướng 📚</text>
          </g>
          <FigFooter label="hành trình mỗi request · tới kho chân lý" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 BOTTLENECK ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const users = useFade(40, 14);
  const jam = useScaleIn(110, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="THE BOTTLENECK" />
          <text x={W / 2} y={310} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(8, 12)}>Nhưng nếu HÀNG TRIỆU tu sĩ cùng lúc…</text>
          <g opacity={users}>
            {Array.from({ length: 18 }).map((_, i) => {
              const col = i % 6, row = Math.floor(i / 6);
              const x = W / 2 - 280 + col * 112, y = 400 + row * 70;
              return <text key={i} x={x} y={y} fontSize={40} textAnchor="middle" opacity={frame > 50 + i * 3 ? 1 : 0}>🧑</text>;
            })}
          </g>
          <g opacity={useFade(90, 10)}>
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={W / 2 - 240 + i * 120} y1={620} x2={W / 2} y2={720} stroke={WARNING_RED} strokeWidth={2} opacity={0.5} />
            ))}
          </g>
          <g style={{ ...jam, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 260} y={730} width={520} height={140} rx={14} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={790} fontSize={44} textAnchor="middle">📜🔥</text>
            <text x={W / 2} y={845} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>DATABASE quá tải</text>
          </g>
          <text x={W / 2} y={970} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useFadeUp(180, 12)}>→ dù linh khố lớn cỡ nào · cũng TẮC NGHẼN ⚠️</text>
          <FigFooter label="kho lớn tới đâu · cửa vẫn có hạn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 CACHE RA ĐỜI ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const born = useScaleIn(20, 14);
  const cache = useScaleIn(120, 14);
  const analogy = useFadeUp(280, 12);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="CACHE IS BORN" />
          <text x={W / 2} y={290} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} style={born}>✨ Đó là lúc CACHE ĐẠO ra đời</text>
          <text x={W / 2} y={350} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(60, 12)}>không đổi chân tướng · chỉ sao chép thứ hay dùng:</text>
          {/* diagram: user -> cache (hit) -> db */}
          <Node cx={W / 2} cy={470} w={300} h={110} emoji="🧑" label="user" color={SLATE} entry={100} />
          <line x1={W / 2} y1={525} x2={W / 2} y2={575} stroke={AMBER} strokeWidth={3} opacity={frame > 140 ? 0.7 : 0} />
          <g style={{ ...cache, transformOrigin: `${W / 2}px 650px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 250} y={585} width={500} height={130} rx={16} fill="#3A2E0A" stroke={AMBER} strokeWidth={3.5} />
            <text x={W / 2 - 170} y={665} fontSize={56} textAnchor="middle">⚡</text>
            <text x={W / 2 + 40} y={642} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>CACHE</text>
            <text x={W / 2 + 40} y={682} fontSize={20} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>copy · để ngay bên cạnh</text>
          </g>
          <line x1={W / 2} y1={725} x2={W / 2} y2={775} stroke={VIOLET} strokeWidth={2} strokeDasharray="6 5" opacity={frame > 200 ? 0.4 : 0} />
          <Node cx={W / 2} cy={835} w={300} h={100} emoji="📜" label="database" color={VIOLET} entry={200} />
          <g style={analogy}>
            <TechBox x={W / 2 - 470} y={920} w={940} h={130} color={AMBER} thick={2.5} />
            <text x={W / 2} y={978} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>như tu sĩ không vác cả bảo khố…</text>
            <text x={W / 2} y={1022} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>chỉ mang vài pháp bảo quan trọng nhất 🎒</text>
          </g>
          <FigFooter label="không đổi sự thật · chỉ để bản sao gần hơn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 THE SPEED ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const bars = [
    { t: "10×", w: 280, e: 60, c: JADE },
    { t: "100×", w: 480, e: 110, c: ORANGE },
    { t: "1000×", w: 720, e: 160, c: AMBER },
  ];
  const god = useScaleIn(240, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="BLAZING FAST" />
          <text x={W / 2} y={310} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(8, 12)}>Vượt ngàn dặm → đưa tay là lấy 🤲</text>
          <text x={W / 2} y={380} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(40, 12)}>thời gian phản hồi giảm:</text>
          {bars.map((b, i) => {
            const grow = interpolate(frame, [b.e, b.e + 30], [0, b.w], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const y = 440 + i * 110;
            return (
              <g key={i} opacity={useFade(b.e - 10, 10)}>
                <rect x={W / 2 - 380} y={y} width={760} height={80} rx={10} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1} opacity={0.5} />
                <rect x={W / 2 - 380} y={y} width={grow} height={80} rx={10} fill={b.c} />
                <text x={W / 2 - 360} y={y + 52} fontSize={42} fill={BG_NAVY} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} opacity={frame > b.e + 25 ? 1 : 0}>{b.t} nhanh</text>
              </g>
            );
          })}
          <g style={{ ...god, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={790} w={940} h={120} color={AMBER} thick={3} />
            <text x={W / 2} y={865} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">Cache được tôn là THẦN KHÍ ⚡🏆</text>
          </g>
          <FigFooter label="nhanh tới mức · cả tiên giới chấn động" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 THE CURSE ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const two = useScaleIn(60, 14);
  const mismatch = useScaleIn(200, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="THE PRICE OF POWER" />
          <text x={W / 2} y={290} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(8, 12)}>thần khí càng mạnh · nhân quả càng lớn 💀</text>
          <g style={two}>
            <rect x={W / 2 - 470} y={360} width={448} height={200} rx={16} fill={BG_CARD} stroke={VIOLET} strokeWidth={3} />
            <text x={W / 2 - 246} y={420} fontSize={40} textAnchor="middle">📜</text>
            <text x={W / 2 - 246} y={478} fontSize={34} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>DATABASE</text>
            <text x={W / 2 - 246} y={524} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>= CHÂN TƯỚNG</text>
            <rect x={W / 2 + 22} y={360} width={448} height={200} rx={16} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2 + 246} y={420} fontSize={40} textAnchor="middle">⚡</text>
            <text x={W / 2 + 246} y={478} fontSize={34} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CACHE</text>
            <text x={W / 2 + 246} y={524} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>= KÝ ỨC</text>
          </g>
          <text x={W / 2} y={640} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(140, 12)}>chân tướng đổi · mà ký ức chưa cập nhật →</text>
          <g style={{ ...mismatch, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={700} w={940} h={180} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={765} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ngươi sẽ nhìn thấy QUÁ KHỨ 👻</text>
            <text x={W / 2} y={830} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">= Tẩu Hỏa Nhập Ma Dữ Liệu</text>
          </g>
          <FigFooter label="cache = sự thật của quá khứ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 ESCALATION ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const steps = [
    { t: "1 con số sai", c: ORANGE, e: 30 },
    { t: "1 giao dịch sai", c: WARNING_RED, e: 90 },
    { t: "cả tông môn ngồi truy nhân quả", c: "#FF3B3B", e: 150 },
  ];
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="THE CASCADE" />
          <text x={W / 2} y={320} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>cache sai · không dừng ở một chỗ:</text>
          {steps.map((s, i) => {
            const a = useScaleIn(s.e, 12);
            const y = 420 + i * 180;
            return (
              <g key={i}>
                {i > 0 && <text x={W / 2} y={y - 50} fontSize={36} fill={TEXT_MUTE} textAnchor="middle" opacity={frame > s.e ? 1 : 0}>↓</text>}
                <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 50}px`, transformBox: "fill-box" }}>
                  <rect x={W / 2 - 420} y={y} width={840} height={100} rx={14} fill={BG_CARD} stroke={s.c} strokeWidth={2.5} />
                  <text x={W / 2} y={y + 62} fontSize={34} fill={s.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{i === 2 ? "💀 " : "⚠️ "}{s.t}</text>
                </g>
              </g>
            );
          })}
          <FigFooter label="từ 1 byte lệch · tới cả ngày debug" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 THE HARD PART ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const easy = useScaleIn(30, 14);
  const hard = useScaleIn(110, 14);
  const companies = ["Facebook", "Google", "Netflix"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE HARD PART" />
          <text x={W / 2} y={290} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Tu luyện Cache Đạo:</text>
          <g style={easy}>
            <rect x={W / 2 - 460} y={340} width={920} height={110} rx={14} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
            <text x={W / 2} y={392} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✓ tạo ra cache → DỄ</text>
            <text x={W / 2} y={428} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">ai cũng làm được</text>
          </g>
          <g style={{ ...hard, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={480} width={920} height={160} rx={14} fill="#3A2E0A" stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={540} fontSize={28} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✗ giữ KÝ ỨC = CHÂN TƯỚNG → KHÓ</text>
            <text x={W / 2} y={595} fontSize={26} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">(cache invalidation · 1 trong 2 bài toán khó nhất CS)</text>
          </g>
          <text x={W / 2} y={730} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(220, 12)}>vì sao các đại tông môn xây nhiều tầng cache:</text>
          <g>
            {companies.map((c, i) => {
              const a = useScaleIn(280 + i * 35, 12);
              const cx = W / 2 - 300 + i * 300;
              return (
                <g key={i} style={{ ...a, transformOrigin: `${cx}px 830px`, transformBox: "fill-box" }}>
                  <rect x={cx - 130} y={780} width={260} height={100} rx={12} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
                  <text x={cx} y={842} fontSize={28} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{c}</text>
                </g>
              );
            })}
          </g>
          <FigFooter label="bài toán khó nhất · không phải tạo · mà là đồng bộ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const scale = useScaleIn(20, 14);
  const save = useFadeUp(120, 14);
  const truth = useScaleIn(250, 16);
  const punch = useScaleIn(420, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE FINAL LESSON" />
          <text x={W / 2} y={290} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={scale}>Khi sinh linh đạt hàng triệu · hàng tỷ 🌐</text>
          <g style={save}>
            <text x={W / 2} y={380} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thứ ngăn hệ thống khỏi thiên kiếp…</text>
            <text x={W / 2} y={430} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">nhiều khi không phải database — mà là CACHE ⚡</text>
          </g>
          <g style={{ ...truth, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={490} width={448} height={130} rx={14} fill={BG_CARD} stroke={VIOLET} strokeWidth={2.5} />
            <text x={W / 2 - 246} y={545} fontSize={30} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Database</text>
            <text x={W / 2 - 246} y={590} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>= chân tướng</text>
            <rect x={W / 2 + 22} y={490} width={448} height={130} rx={14} fill={BG_CARD} stroke={AMBER} strokeWidth={2.5} />
            <text x={W / 2 + 246} y={545} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Cache</text>
            <text x={W / 2 + 246} y={590} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>= ký ức</text>
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 780px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={680} w={940} h={200} color={AMBER} thick={3} />
            <text x={W / 2} y={745} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thứ nhanh hơn việc TÌM LẠI chân tướng…</text>
            <text x={W / 2} y={815} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">chính là NHỚ SẴN đáp án 🧠</text>
          </g>
          <FigFooter label="trí nhớ tốt · thắng cả thư viện lớn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 CTA ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useScaleIn(20, 16);
  const cta = useScaleIn(150, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="JOIN THE LEGEND" />
          <g style={{ ...intro, transformOrigin: `${W / 2}px 360px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={330} fontSize={48} textAnchor="middle">⚡📜</text>
            <text x={W / 2} y={410} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Thấy bài giảng này hữu ích?</text>
          </g>
          <g style={{ ...cta, transformOrigin: `${W / 2}px 540px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 380} y={480} width={760} height={120} rx={60} fill={AMBER} />
            <text x={W / 2} y={552} fontSize={38} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>❤️ THẢ TIM · THEO DÕI</text>
          </g>
          <text x={W / 2} y={700} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} style={useFadeUp(230, 12)}>để nghe tiếp những truyền kỳ giới IT 🏯</text>
          <text x={W / 2} y={820} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2" style={useFadeUp(300, 12)}>comment · save · share · truyền kỳ giới IT</text>
          <FigFooter label="mỗi tuần · một công pháp giới IT" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const CacheThanKhi: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("cache_than_khi/voice.mp3")} />
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
