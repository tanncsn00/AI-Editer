import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./microservice_dai_tran_beats.json";

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
const NETFLIX_RED = "#E50914";

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

const BlueprintBG: React.FC<{ glow?: string }> = ({ glow = ACCENT_BLUE }) => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="msgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="msgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="msglow" cx="50%" cy="36%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.08" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="msscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#msgrid)" />
        <rect width={W} height={H} fill="url(#msgrid2)" />
        <rect width={W} height={H} fill="url(#msglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#msscan)" />
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

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const title = useScaleIn(14, 16);
  const bars = useFade(120, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE AGE OF GROWTH" />
          <g style={{ ...title, transformOrigin: `${W / 2}px 340px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={300} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">Hơn 10 năm trước · một thời đại đặc biệt:</text>
          </g>
          <text x={W / 2} y={440} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(60, 12)}>📈 Người dùng tăng như THỦY TRIỀU</text>
          {/* growth bars */}
          <g opacity={bars}>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const bh = interpolate(frame, [130 + i * 12, 160 + i * 12], [0, 60 + i * 56], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return <rect key={i} x={W / 2 - 330 + i * 110} y={780 - bh} width={84} height={bh} rx={6} fill={ACCENT_BLUE} opacity={0.5 + i * 0.08} />;
            })}
            <line x1={W / 2 - 360} y1={782} x2={W / 2 + 360} y2={782} stroke={TEXT_MUTE} strokeWidth={2} />
          </g>
          <g style={useFadeUp(230, 12)}>
            <TechBox x={W / 2 - 470} y={850} w={940} h={120} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={925} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Hệ thống ngày càng KHỔNG LỒ 🏔️</text>
          </g>
          <FigFooter label="khi quy mô vượt khỏi tầm kiểm soát" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 MONOLITH ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const block = useScaleIn(40, 14);
  const traits = ["⚡ khai tông nhanh", "🏗️ lập phái dễ", "🧘 tu luyện đơn giản"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="THE MONOLITH WAY" />
          <text x={W / 2} y={290} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Vô số tông môn cùng tu một công pháp:</text>
          <g style={{ ...block, transformOrigin: `${W / 2}px 500px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 220} y={350} width={440} height={300} rx={16} fill={BG_CARD} stroke={VIOLET} strokeWidth={4} />
            <text x={W / 2} y={460} fontSize={70} textAnchor="middle">🏛️</text>
            <text x={W / 2} y={540} fontSize={44} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>MONOLITH</text>
            <text x={W / 2} y={595} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// 1 khối · tất cả trong 1</text>
          </g>
          <text x={W / 2} y={730} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(120, 12)}>cực kỳ MẠNH lúc ban đầu:</text>
          {traits.map((t, i) => (
            <g key={i} opacity={useFade(150 + i * 35, 10)}>
              <rect x={W / 2 - 340} y={770 + i * 78} width={680} height={62} rx={10} fill={BG_CARD} stroke={JADE} strokeWidth={1.5} />
              <text x={W / 2} y={810 + i * 78} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
            </g>
          ))}
          <FigFooter label="monolith · khởi đầu hoàn hảo" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 PHẢN PHỆ ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const crack = useScaleIn(40, 14);
  const sym = useFadeUp(150, 14);
  const punch = useScaleIn(280, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="IT STARTS TO BREAK" />
          <text x={W / 2} y={300} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(8, 12)}>Tới HÀNG TRIỆU sinh linh · Monolith phản phệ ⚠️</text>
          <g style={{ ...crack, transformOrigin: `${W / 2}px 480px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 200} y={360} width={400} height={240} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={4} />
            <text x={W / 2} y={470} fontSize={66} textAnchor="middle">🏛️💥</text>
            <text x={W / 2} y={550} fontSize={36} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>QUÁ TẢI</text>
            <line x1={W / 2 - 60} y1={360} x2={W / 2 + 40} y2={600} stroke={WARNING_RED} strokeWidth={3} opacity={frame > 90 ? 0.8 : 0} />
          </g>
          <g style={sym}>
            <text x={W / 2} y={690} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>😰 mỗi lần deploy · cả tông môn RUN RẨY</text>
            <text x={W / 2} y={745} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🔥 1 lỗi nhỏ · TOÀN BỘ đại điện trả nghiệp</text>
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 870px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={810} w={940} h={110} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={878} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">trưởng lão khắp tam giới đều đau đầu 🤯</text>
          </g>
          <FigFooter label="1 khối quá lớn · động đâu cũng vỡ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 VENICE 2011 ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const year = useScaleIn(30, 14);
  const people = useScaleIn(150, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="2011 · NEAR VENICE" />
          <g style={{ ...year, transformOrigin: `${W / 2}px 330px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 230} y={280} width={460} height={110} rx={12} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={352} fontSize={52} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800} letterSpacing="2">2011 🇮🇹</text>
          </g>
          <text x={W / 2} y={470} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(90, 12)}>hội nghị bí mật gần thành Venice · luận đạo:</text>
          <g style={people}>
            <rect x={W / 2 - 440} y={530} width={420} height={200} rx={16} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
            <text x={W / 2 - 230} y={610} fontSize={56} textAnchor="middle">🧙</text>
            <text x={W / 2 - 230} y={665} fontSize={30} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Martin Fowler</text>
            <text x={W / 2 - 230} y={702} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>kiến trúc sư</text>
            <rect x={W / 2 + 20} y={530} width={420} height={200} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2 + 230} y={610} fontSize={56} textAnchor="middle">🧙‍♂️</text>
            <text x={W / 2 + 230} y={665} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>James Lewis</text>
            <text x={W / 2 + 230} y={702} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>kiến trúc sư</text>
          </g>
          <text x={W / 2} y={830} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={useFadeUp(230, 12)}>2 đại năng · cùng tham ngộ một thiên cơ 📜</text>
          <FigFooter label="khoảnh khắc đặt tên cho một kỷ nguyên" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 MICROSERVICE BORN ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const sys = useScaleIn(40, 14);
  const reveal = useScaleIn(370, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="THE BIRTH" />
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>1 hệ thống · chia thành vô số PHÂN ĐIỆN:</text>
          <g style={sys}>
            {Array.from({ length: 9 }).map((_, i) => {
              const col = i % 3, row = Math.floor(i / 3);
              const x = W / 2 - 270 + col * 200, y = 360 + row * 150;
              const cs = [ACCENT_BLUE, JADE, VIOLET, ORANGE, AMBER, ACCENT_BLUE, JADE, VIOLET, ORANGE][i];
              return (
                <g key={i} opacity={frame > 70 + i * 12 ? 1 : 0}>
                  <rect x={x - 80} y={y - 50} width={160} height={100} rx={12} fill={BG_CARD} stroke={cs} strokeWidth={2.5} />
                  <text x={x} y={y - 8} fontSize={30} textAnchor="middle">⚙️</text>
                  <text x={x} y={y + 28} fontSize={18} fill={cs} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>svc-{i + 1}</text>
                </g>
              );
            })}
          </g>
          <text x={W / 2} y={830} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(280, 12)}>mỗi cái: tự triển khai · tự vận hành · tự độ kiếp</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={880} w={940} h={150} color={ACCENT_BLUE} thick={3} />
            <text x={W / 2} y={940} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>họ gọi công pháp ấy là:</text>
            <text x={W / 2} y={1000} fontSize={52} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">MICROSERVICE ✨</text>
          </g>
          <FigFooter label="chia để trị · mỗi phần một sứ mệnh" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 NETFLIX ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const logo = useScaleIn(60, 14);
  const stats = [
    { n: "Hàng trăm", t: "service", e: 150 },
    { n: "Hàng nghìn", t: "máy chủ", e: 195 },
    { n: "Hàng triệu", t: "tín đồ", e: 240 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={NETFLIX_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="NETFLIX SCALE" />
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Một đại tông môn Tây Phương · tu tới cực cảnh:</text>
          <g style={{ ...logo, transformOrigin: `${W / 2}px 430px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 280} y={350} width={560} height={160} rx={16} fill="#1A0608" stroke={NETFLIX_RED} strokeWidth={4} />
            <text x={W / 2} y={460} fontSize={68} fill={NETFLIX_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">NETFLIX</text>
          </g>
          {stats.map((s, i) => {
            const a = useScaleIn(s.e, 12);
            const y = 580 + i * 130;
            return (
              <g key={i} style={{ ...a, transformOrigin: `${W / 2}px ${y + 50}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 420} y={y} width={840} height={100} rx={14} fill={BG_CARD} stroke={NETFLIX_RED} strokeWidth={2} />
                <text x={W / 2 - 390} y={y + 64} fontSize={40} fill={NETFLIX_RED} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{s.n}</text>
                <text x={W / 2 + 390} y={y + 62} fontSize={34} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{s.t}</text>
              </g>
            );
          })}
          <text x={W / 2} y={1030} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={useFadeUp(310, 12)}>→ danh tiếng Microservice vang khắp tam giới 🌏</text>
          <FigFooter label="netflix · biểu tượng của microservice" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 100 MONSTERS ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const law = useFadeUp(20, 12);
  const one = useScaleIn(100, 14);
  const many = useScaleIn(200, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="ONE BECOMES A HUNDRED" />
          <g style={law}>
            <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">thiên đạo công bằng · công pháp càng nghịch thiên…</text>
            <text x={W / 2} y={336} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nhân quả càng đáng sợ ⚖️</text>
          </g>
          <g style={{ ...one, transformOrigin: `${W / 2 - 230}px 500px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 430} y={400} width={400} height={200} rx={16} fill={BG_CARD} stroke={VIOLET} strokeWidth={2.5} />
            <text x={W / 2 - 230} y={490} fontSize={70} textAnchor="middle">👹</text>
            <text x={W / 2 - 230} y={560} fontSize={28} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>1 con quái vật</text>
          </g>
          <text x={W / 2} y={510} fontSize={44} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} style={useScaleIn(170, 12)}>→</text>
          <g style={{ ...many, transformOrigin: `${W / 2 + 230}px 500px`, transformBox: "fill-box" }}>
            <rect x={W / 2 + 30} y={400} width={400} height={200} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={3} />
            <g>
              {Array.from({ length: 12 }).map((_, i) => {
                const col = i % 4, row = Math.floor(i / 4);
                return <text key={i} x={W / 2 + 90 + col * 80} y={460 + row * 44} fontSize={28} textAnchor="middle" opacity={frame > 230 + i * 4 ? 1 : 0}>👹</text>;
              })}
            </g>
            <text x={W / 2 + 230} y={580} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>100 con quái vật</text>
          </g>
          <g style={useFadeUp(300, 14)}>
            <TechBox x={W / 2 - 470} y={700} w={940} h={150} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={760} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>chia 1 đại điện → 100 phân điện…</text>
            <text x={W / 2} y={818} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">không bớt quái vật · chỉ nhân lên 💀</text>
          </g>
          <FigFooter label="phức tạp không biến mất · nó chia nhỏ ra" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 TIMEOUT RETRY ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const daos = [
    { t: "Timeout Đạo", e: 50, c: ORANGE },
    { t: "Retry Đạo", e: 95, c: WARNING_RED },
    { t: "Distributed System Đạo", e: 140, c: VIOLET },
  ];
  const punch = useScaleIn(210, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="DISTRIBUTED CHAOS" />
          <text x={W / 2} y={320} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>từ đó · vô số đại đạo mới xuất thế:</text>
          {daos.map((d, i) => {
            const a = useScaleIn(d.e, 14);
            const y = 400 + i * 130;
            return (
              <g key={i} style={{ ...a, transformOrigin: `${W / 2}px ${y + 50}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 440} y={y} width={880} height={100} rx={14} fill={BG_CARD} stroke={d.c} strokeWidth={2.5} />
                <text x={W / 2 - 400} y={y + 62} fontSize={40} textAnchor="middle">⚡</text>
                <text x={W / 2 - 330} y={y + 62} fontSize={36} fill={d.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{d.t}</text>
              </g>
            );
          })}
          <g style={{ ...punch, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={820} w={940} h={120} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={895} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">vô số thiên tài kiến trúc sư · NHẬP MA 🌀</text>
          </g>
          <FigFooter label="mạng = nơi mọi thứ có thể sai" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 WRONG QUESTION ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const vs = useScaleIn(40, 14);
  const wrong = useScaleIn(170, 14);
  const truth = useScaleIn(310, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE WRONG QUESTION" />
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>tới nay vẫn tranh luận:</text>
          <g style={vs}>
            <rect x={W / 2 - 440} y={340} width={400} height={110} rx={14} fill={BG_CARD} stroke={VIOLET} strokeWidth={2.5} />
            <text x={W / 2 - 240} y={408} fontSize={34} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>MONOLITH</text>
            <text x={W / 2} y={408} fontSize={34} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>vs</text>
            <rect x={W / 2 + 40} y={340} width={400} height={110} rx={14} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
            <text x={W / 2 + 240} y={408} fontSize={30} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>MICROSERVICE</text>
          </g>
          <g style={{ ...wrong, transformOrigin: `${W / 2}px 540px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={550} fontSize={38} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>❌ đó là CÂU HỎI SAI</text>
          </g>
          <g style={{ ...truth, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={640} w={940} h={250} color={AMBER} thick={3} />
            <text x={W / 2} y={705} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Microservice KHÔNG sinh ra để đánh bại Monolith</text>
            <text x={W / 2} y={775} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">nó sinh ra để CỨU những tông môn</text>
            <text x={W / 2} y={825} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đã QUÁ KHỔNG LỒ 🏔️</text>
          </g>
          <FigFooter label="đúng công cụ · cho đúng quy mô" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 ENDING ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const when = ["user tăng hàng triệu", "trăm tu sĩ cùng sửa 1 hệ thống", "1 deploy đủ khiến cả tông môn run rẩy"];
  const era = useScaleIn(280, 16);
  const dual = useFadeUp(440, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="THE NEW ERA" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>Khi nào cần Đại Trận Microservice?</text>
          {when.map((w, i) => (
            <g key={i} opacity={useFade(60 + i * 45, 10)}>
              <rect x={W / 2 - 430} y={360 + i * 90} width={860} height={72} rx={10} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
              <text x={W / 2} y={405 + i * 90} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✓ {w}</text>
            </g>
          ))}
          <g style={{ ...era, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={660} width={940} height={120} rx={14} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={710} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// bước vào kỷ nguyên</text>
            <text x={W / 2} y={755} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>DISTRIBUTED SYSTEM 🌐</text>
          </g>
          <g style={dual}>
            <rect x={W / 2 - 440} y={830} width={420} height={130} rx={14} fill="#0E2A1A" stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2 - 230} y={895} fontSize={40} textAnchor="middle">⚔️</text>
            <text x={W / 2 - 230} y={935} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>vô số đại năng</text>
            <rect x={W / 2 + 20} y={830} width={420} height={130} rx={14} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2 + 230} y={895} fontSize={40} textAnchor="middle">👹</text>
            <text x={W / 2 + 230} y={935} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>vô số tâm ma</text>
          </g>
          <text x={W / 2} y={1030} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(520, 12)}>… một kỷ nguyên sinh ra cả hai 🏯</text>
          <FigFooter label="microservice · vinh quang và nghiệp chướng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const MicroserviceDaiTran: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("microservice_dai_tran/voice.mp3")} />
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
