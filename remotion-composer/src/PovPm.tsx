import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./pov_pm_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "14";

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
          <pattern id="ppmgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="ppmgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="ppmglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.1" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ppmscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#ppmgrid)" />
        <rect width={W} height={H} fill="url(#ppmgrid2)" />
        <rect width={W} height={H} fill="url(#ppmglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#ppmscan)" />
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
const Hero: React.FC<{ cy: number; num: string; label: string; sub?: string; color: string; entry: number }> = ({ cy, num, label, sub, color, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 490} y={cy - 64} width={980} height={128} rx={18} fill={BG_CARD} stroke={color} strokeWidth={4} />
      <text x={W / 2} y={cy + (sub ? -8 : 12)} fontSize={42} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{num} {label}</text>
      {sub && <text x={W / 2} y={cy + 34} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};
const Quote: React.FC<{ y: number; who: string; whoColor: string; say: string; sayColor?: string; entry: number }> = ({ y, who, whoColor, say, sayColor = TEXT_PRI, entry }) => {
  const a = useScaleIn(entry, 11);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 40}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 470} y={y} width={940} height={80} rx={12} fill={BG_CARD} stroke={whoColor} strokeWidth={2} />
      <text x={W / 2 - 432} y={y + 50} fontSize={24} fill={whoColor} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{who}</text>
      <text x={W / 2 + 432} y={y + 50} fontSize={28} fill={sayColor} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"{say}"</text>
    </g>
  );
};

// ============ S1 INTRO ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const believe = useScaleIn(70, 14);
  const turn = useScaleIn(270, 14);
  const BELIEF = ["🧭 lãnh đạo dự án · dẫn dắt đồng môn", "⚙️ điều phối tài nguyên", "🏆 đưa tông môn tới thành công"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="POV · THE PROJECT MANAGER" />
          <text x={W / 2} y={330} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(20, 12)}>Năm ấy · ta nhập môn QUẢN TRỊ ĐẠO</text>
          <text x={W / 2} y={398} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(50, 12)}>ta tin PM là người LÃNH ĐẠO:</text>
          <g style={believe}>
            {BELIEF.map((t, i) => (
              <g key={i} opacity={useFade(80 + i * 40, 10)}>
                <rect x={W / 2 - 460} y={460 + i * 92} width={920} height={76} rx={12} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
                <text x={W / 2} y={507 + i * 92} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...turn, transformOrigin: `${W / 2}px 810px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={760} w={940} h={110} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={830} fontSize={36} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">…sau này mới biết 💀</text>
          </g>
          <FigFooter label="project manager · người độ kiếp mỗi ngày" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 BATTLEFIELD ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const cx = W / 2, cy = 600;
  const pm = useScaleIn(295, 14);
  const dirs = [
    { e: 70, x: cx, y: cy - 230, w: 360, who: "👑 CEO", sub: "phía Đông", c: VIOLET },
    { e: 110, x: cx - 270, y: cy, w: 320, who: "🙍 Khách hàng", sub: "phía Tây", c: AMBER },
    { e: 155, x: cx, y: cy + 230, w: 360, who: "💻 Dev", sub: "phía Nam", c: ACCENT_BLUE },
    { e: 206, x: cx + 270, y: cy, w: 320, who: "🔍 QA", sub: "phía Bắc", c: JADE },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="MAN IN THE MIDDLE" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(10, 12)}>PM = người đứng GIỮA CHIẾN TRƯỜNG ⚔️</text>
          {dirs.map((d, i) => (
            <g key={i} style={{ ...useScaleIn(d.e, 12), transformOrigin: `${d.x}px ${d.y}px`, transformBox: "fill-box" }}>
              <line x1={cx} y1={cy} x2={d.x} y2={d.y} stroke={d.c} strokeWidth={2} opacity={0.4} strokeDasharray="6 6" />
              <rect x={d.x - d.w / 2} y={d.y - 48} width={d.w} height={96} rx={14} fill={BG_CARD} stroke={d.c} strokeWidth={2.5} />
              <text x={d.x} y={d.y - 6} fontSize={28} fill={d.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{d.who}</text>
              <text x={d.x} y={d.y + 28} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{d.sub}</text>
            </g>
          ))}
          <g style={{ ...pm, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
            <circle cx={cx} cy={cy} r={92} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={4} />
            <text x={cx} y={cy - 6} fontSize={40} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>PM</text>
            <text x={cx} y={cy + 30} fontSize={19} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>chính giữa</text>
          </g>
          <text x={W / 2} y={970} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useFadeUp(295, 12)}>lĩnh trọn sát thương từ 4 hướng 💀</text>
          <FigFooter label="man-in-the-middle · đỡ đạn mọi phía" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 CEO ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="DAY ONE · THE CEO" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>ngày đầu · CEO triệu kiến ta:</text>
          <Quote y={360} who="👑 CEO" whoColor={VIOLET} say="dự án này rất quan trọng" entry={99} />
          <Quote y={456} who="👑 CEO" whoColor={VIOLET} say="tháng sau phải xong" entry={174} />
          <g style={useScaleIn(258, 12)}>
            <rect x={W / 2 - 470} y={570} width={940} height={76} rx={12} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={617} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✗ KHÔNG được tăng nhân sự</text>
          </g>
          <g style={useScaleIn(293, 12)}>
            <rect x={W / 2 - 470} y={660} width={940} height={76} rx={12} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={707} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✗ KHÔNG được tăng chi phí</text>
          </g>
          <g style={useScaleIn(342, 12)}>
            <rect x={W / 2 - 470} y={750} width={940} height={76} rx={12} fill="#2A1010" stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={797} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>✗ KHÔNG được giảm scope 💀</text>
          </g>
          <FigFooter label="iron triangle · 3 ràng buộc cùng lúc" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 LESSON1 ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const tri = useScaleIn(152, 14);
  const pick = useScaleIn(238, 14);
  const punch = useScaleIn(376, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="LESSON ① · THE TRIPLE KALPA" />
          <Hero cy={310} num="①" label="TAM TRỌNG THIÊN KIẾP" sub="// fast · cheap · good — pick 2" color={AMBER} entry={61} />
          <g style={tri}>
            {["⚡ NHANH hơn", "💰 RẺ hơn", "✨ TỐT hơn"].map((t, i) => (
              <g key={i}>
                <rect x={W / 2 - 470 + i * 320} y={420} width={300} height={100} rx={14} fill={BG_TERM} stroke={AMBER} strokeWidth={2.5} />
                <text x={W / 2 - 320 + i * 320} y={482} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{t}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={600} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={{ ...pick }}>→ ngươi chỉ được CHỌN 2</text>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={690} w={960} h={140} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={748} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>kẻ muốn CẢ BA…</text>
            <text x={W / 2} y={798} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cuối cùng mất luôn cả ba 💀</text>
          </g>
          <FigFooter label="fast · cheap · good — choose two" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 MEETING ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const look = useScaleIn(483, 14);
  const carry = useScaleIn(721, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="THE MEETING" />
          <Quote y={230} who="🙍 Khách hàng" whoColor={AMBER} say="cái này cần thêm" entry={79} />
          <Quote y={320} who="🧩 BA" whoColor={ACCENT_BLUE} say="cái kia cần làm rõ" entry={147} />
          <Quote y={410} who="📦 PO" whoColor={VIOLET} say="cái nọ mới tạo ra giá trị" entry={214} />
          <Quote y={500} who="💻 Dev" whoColor={JADE} say="không kịp" entry={297} />
          <Quote y={590} who="🔍 QA" whoColor={WARNING_RED} say="chưa test" entry={349} />
          <text x={W / 2} y={720} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={{ ...look }}>đại điện lặng ngắt · mọi ánh mắt nhìn về phía ta 💀</text>
          <g style={{ ...carry, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={760} width={960} height={150} rx={16} fill={BG_TERM} stroke={AMBER} strokeWidth={3.5} />
            <text x={W / 2} y={815} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ai cũng MANG VÀO 1 vấn đề…</text>
            <text x={W / 2} y={865} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">PM mang ra TẤT CẢ vấn đề 💀</text>
          </g>
          <FigFooter label="ai cũng có 1 vấn đề · PM gánh hết" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 LESSON2 ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const happy = useScaleIn(199, 14);
  const angry = useScaleIn(358, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="LESSON ② · BEARING THE KARMA" />
          <Hero cy={330} num="②" label="GÁNH NGHIỆP ĐẠI PHÁP" sub="// you carry everyone's burden" color={JADE} entry={106} />
          <g style={happy}>
            <rect x={W / 2 - 480} y={470} width={960} height={150} rx={16} fill="#0E2A1A" stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={525} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>mọi người HÀI LÒNG 😊</text>
            <text x={W / 2} y={582} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>→ chứng tỏ PM làm rất tốt</text>
          </g>
          <g style={angry}>
            <rect x={W / 2 - 480} y={650} width={960} height={170} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={708} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>mọi người KHÓ CHỊU 😤</text>
            <text x={W / 2} y={765} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>→ cũng có thể PM</text>
            <text x={W / 2} y={802} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đang làm rất tốt 🤣</text>
          </g>
          <FigFooter label="ở giữa nghĩa là không ai vui hoàn toàn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 SPRINT ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const report = useScaleIn(364, 14);
  const relic1 = useScaleIn(499, 14);
  const relic2 = useScaleIn(584, 14);
  const ascend = useScaleIn(777, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="THE ESTIMATE" />
          <Quote y={230} who="💻 Dev (ước tính)" whoColor={ACCENT_BLUE} say="Hai tuần" entry={224} />
          <g style={report}>
            <rect x={W / 2 - 480} y={335} width={960} height={80} rx={12} fill="#0E2A1A" stroke={JADE} strokeWidth={2} />
            <text x={W / 2} y={385} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ta vui → báo cáo: "tiến độ đã khống chế" 🤣</text>
          </g>
          <g style={relic1}>
            <rect x={W / 2 - 480} y={440} width={960} height={120} rx={14} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={490} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>3 ngày sau · Dev:</text>
            <text x={W / 2} y={530} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"phát hiện hệ thống thượng cổ → +2 tuần"</text>
          </g>
          <g style={relic2}>
            <rect x={W / 2 - 480} y={580} width={960} height={120} rx={14} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={630} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>1 tuần sau · Dev:</text>
            <text x={W / 2} y={670} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"thêm 1 hệ thống thượng cổ khác nữa…"</text>
          </g>
          <g style={{ ...ascend, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={730} w={960} h={120} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={788} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>"ngay cả người viết nó…</text>
            <text x={W / 2} y={830} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đã PHI THĂNG nhiều năm trước" 💀</text>
          </g>
          <FigFooter label="estimate · lời tiên tri luôn sai" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 LESSON3 ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const assume = useScaleIn(148, 14);
  const law = useScaleIn(357, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="LESSON ③ · THE ANCIENT RELIC" />
          <Hero cy={320} num="③" label="THƯỢNG CỔ DI TÍCH" sub="// legacy systems strike back" color={VIOLET} entry={76} />
          <g style={assume}>
            <rect x={W / 2 - 480} y={460} width={960} height={150} rx={16} fill={BG_TERM} stroke={ACCENT_BLUE} strokeWidth={2.5} />
            <text x={W / 2} y={515} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mọi estimate · xây trên GIẢ ĐỊNH</text>
            <text x={W / 2} y={572} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">và giả định bị PRODUCTION đánh nát 💀</text>
          </g>
          <g style={law}>
            {["📜 code càng CŨ", "🔐 bí mật càng NHIỀU", "📭 tài liệu càng ÍT"].map((t, i) => (
              <g key={i}>
                <rect x={W / 2 - 480 + i * 322} y={650} width={300} height={150} rx={14} fill={BG_CARD} stroke={VIOLET} strokeWidth={2} />
                <text x={W / 2 - 330 + i * 322} y={735} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
                  <tspan x={W / 2 - 330 + i * 322} dy={0}>{t.split(" càng ")[0]}</tspan>
                  <tspan x={W / 2 - 330 + i * 322} dy={36} fill={AMBER_BRIGHT} fontWeight={900}>càng {t.split(" càng ")[1]}</tspan>
                </text>
              </g>
            ))}
          </g>
          <FigFooter label="legacy · càng cũ càng nhiều bí ẩn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 EIGHTY ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const rows = [
    { e: 230, label: "Dev: 'đã 80%'", note: "→ ta vui 🤣", c: JADE },
    { e: 451, label: "1 tuần sau: '~80%'", note: "🤔", c: AMBER },
    { e: 451 + 80, label: "2 tuần sau: '~80%'", note: "😐", c: ORANGE },
    { e: 612, label: "3 tuần sau: 'vẫn 80%'", note: "💀", c: WARNING_RED },
  ];
  const real = useScaleIn(762, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE 80% PLATEAU" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>"bao giờ xong?" — ta đi hỏi Dev…</text>
          {rows.map((r, i) => (
            <g key={i} style={useScaleIn(r.e, 12)}>
              <rect x={W / 2 - 470} y={350 + i * 92} width={940} height={78} rx={12} fill={BG_CARD} stroke={r.c} strokeWidth={2} />
              <text x={W / 2 - 430} y={398 + i * 92} fontSize={29} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.label}</text>
              <text x={W / 2 + 430} y={398 + i * 92} fontSize={30} fill={r.c} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.note}</text>
            </g>
          ))}
          <g style={{ ...real, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={740} w={960} h={130} color={AMBER} thick={3} />
            <text x={W / 2} y={795} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>kinh hãi nhận ra: 80% không phải tiến độ…</text>
            <text x={W / 2} y={840} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà là một CẢNH GIỚI 🤣</text>
          </g>
          <FigFooter label="the 80% trap · đứng yên mãi mãi" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 LESSON4 ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const cmp = useScaleIn(250, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="LESSON ④ · THE LAST 20%" />
          <Hero cy={340} num="④" label="BÁT THÀNH BẤT DIỆT" sub="// the 80/20 of pain" color={AMBER} entry={124} />
          <g style={{ ...cmp, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={500} width={460} height={260} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2 - 240} y={560} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>80% ĐẦU</text>
            <text x={W / 2 - 240} y={640} fontSize={64} textAnchor="middle">🏃</text>
            <text x={W / 2 - 240} y={710} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhanh gọn</text>
            <rect x={W / 2 + 10} y={500} width={460} height={260} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2 + 240} y={560} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>20% CUỐI</text>
            <text x={W / 2 + 240} y={640} fontSize={64} textAnchor="middle">🐌</text>
            <text x={W / 2 + 240} y={710} fontSize={26} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>tốn hơn cả 80% đầu</text>
          </g>
          <text x={W / 2} y={830} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={useFadeUp(300, 12)}>20% cuối · nuốt trọn thời gian 💀</text>
          <FigFooter label="ninety-ninety rule · 90% còn lại tốn 90%" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S11 BUG ============
const S11: React.FC<{ duration: number }> = ({ duration }) => {
  const calm = useScaleIn(330, 14);
  const reveal = useScaleIn(436, 14);
  const law = useScaleIn(681, 14);
  const checks = [
    { e: 193, q: "Critical không?", a: "KHÔNG" },
    { e: 240, q: "Blocker không?", a: "KHÔNG" },
    { e: 288, q: "Production nổ không?", a: "KHÔNG" },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="THE BUG TRIAGE" />
          <g style={useScaleIn(105, 12)}>
            <rect x={W / 2 - 470} y={222} width={940} height={80} rx={12} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={272} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🔍 QA: "còn 23 bug" 💀</text>
          </g>
          {checks.map((c, i) => (
            <g key={i} style={useScaleIn(c.e, 11)}>
              <rect x={W / 2 - 470} y={325 + i * 78} width={940} height={66} rx={11} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
              <text x={W / 2 - 432} y={367 + i * 78} fontSize={27} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{c.q}</text>
              <text x={W / 2 + 432} y={367 + i * 78} fontSize={28} fill={JADE} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{c.a} ✓</text>
            </g>
          ))}
          <text x={W / 2} y={620} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={{ ...calm }}>→ ta thở phào 😌</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 700px`, transformBox: "fill-box" }}>
            <Hero cy={700} num="" label="HIỆP THƯƠNG ĐẠO" sub="// PM = chọn bug nào được sống" color={JADE} entry={0} />
          </g>
          <text x={W / 2} y={835} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={{ ...law }}>sửa MỌI bug → release không bao giờ diễn ra 🤣</text>
          <FigFooter label="triage · không phải diệt bug · mà chọn bug" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S12 RELEASE ============
const S12: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const success = useScaleIn(307, 14);
  const cheer = useScaleIn(413, 14);
  const small = useScaleIn(537, 14);
  const kalpa = useScaleIn(744, 16);
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="11" label="RELEASE DAY" />
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(151, 12)}>ngày release · cả tông môn hồi hộp…</text>
          <g style={success}>
            <rect x={W / 2 - 480} y={330} width={960} height={150} rx={16} fill="#0E2A1A" stroke={JADE} strokeWidth={3} />
            <text x={W / 2} y={388} fontSize={34} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>✅ DEPLOY THÀNH CÔNG</text>
            <text x={W / 2} y={440} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>không lỗi · không bug · không sự cố</text>
          </g>
          <text x={W / 2} y={555} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} style={{ ...cheer }}>🎉 toàn bộ đồng môn HOAN HÔ</text>
          <g style={small}>
            <rect x={W / 2 - 480} y={610} width={960} height={90} rx={14} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={665} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ngay lúc đó · khách nhắn: "có thêm 1 yêu cầu NHỎ"</text>
          </g>
          <g style={{ ...kalpa, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={730} width={960} height={140} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={4} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={785} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>PM lâu năm nghe 3 chữ "yêu cầu nhỏ thôi"…</text>
            <text x={W / 2} y={835} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">là biết sắp ĐẠI KIẾP 💀</text>
          </g>
          <FigFooter label="'yêu cầu nhỏ thôi' · ba chữ tử thần" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S13 LESSON5 ============
const S13: React.FC<{ duration: number }> = ({ duration }) => {
  const noend = useScaleIn(204, 14);
  const debt = useScaleIn(369, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="12" label="LESSON ⑤ · THE CYCLE" />
          <Hero cy={330} num="⑤" label="LUÂN HỒI ĐẠO" sub="// no project ever truly ends" color={VIOLET} entry={133} />
          <g style={noend}>
            <rect x={W / 2 - 480} y={470} width={960} height={150} rx={16} fill={BG_TERM} stroke={ACCENT_BLUE} strokeWidth={2.5} />
            <text x={W / 2} y={525} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>không dự án nào thực sự KẾT THÚC</text>
            <text x={W / 2} y={582} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">chỉ có PHIÊN BẢN TIẾP THEO ♻️</text>
          </g>
          <g style={{ ...debt, transformOrigin: `${W / 2}px 740px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={670} w={960} h={140} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={728} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>feature hôm nay…</text>
            <text x={W / 2} y={778} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">là technical debt của ngày mai 💀</text>
          </g>
          <FigFooter label="ship hôm nay · nợ kỹ thuật ngày mai" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S14 TRUTH ============
const S14: React.FC<{ duration: number }> = ({ duration }) => {
  const wants = [
    { e: 152, who: "👑 CEO", w: "NHANH", c: VIOLET },
    { e: 186, who: "🙍 Khách", w: "NHIỀU", c: AMBER },
    { e: 226, who: "💻 Dev", w: "THỜI GIAN", c: ACCENT_BLUE },
    { e: 262, who: "🔍 QA", w: "CHẤT LƯỢNG", c: JADE },
    { e: 298, who: "📦 PO", w: "GIÁ TRỊ", c: ORANGE },
    { e: 334, who: "🧩 BA", w: "RÕ RÀNG", c: "#FF9BD2" },
  ];
  const pm = useScaleIn(431, 14);
  const impossible = useScaleIn(572, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="13" label="THE ONE WISH" />
          {wants.map((r, i) => {
            const col = i % 2, row = Math.floor(i / 2);
            return (
              <g key={i} style={useScaleIn(r.e, 11)}>
                <rect x={W / 2 - 470 + col * 480} y={230 + row * 96} width={460} height={80} rx={12} fill={BG_CARD} stroke={r.c} strokeWidth={2} />
                <text x={W / 2 - 440 + col * 480} y={278 + row * 96} fontSize={24} fill={r.c} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{r.who}</text>
                <text x={W / 2 - 40 + col * 480} y={278 + row * 96} fontSize={28} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.w}</text>
              </g>
            );
          })}
          <g style={{ ...pm, transformOrigin: `${W / 2}px 620px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={540} width={960} height={160} rx={16} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
            <text x={W / 2} y={595} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>còn PM · chỉ có 1 nguyện vọng:</text>
            <text x={W / 2} y={655} fontSize={33} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"đừng đổi yêu cầu sau khi đã CHỐT"</text>
          </g>
          <text x={W / 2} y={790} fontSize={34} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={{ ...impossible }}>…nhưng đó là chuyện KHÔNG THỂ xảy ra 🤣</text>
          <FigFooter label="6 mong muốn · 1 điều ước bất khả thi" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S15 CLOSING ============
const S15: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const pm = useScaleIn(230, 14);
  const turn100 = useScaleIn(442, 14);
  const punch = useScaleIn(565, 16);
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  const TRAIN = ["✏️ viết code · là tu luyện", "🔍 test bug · là tu luyện", "🎨 thiết kế sản phẩm · là tu luyện"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="14" label="EVERY DAY IS A KALPA" />
          <g>
            {TRAIN.map((t, i) => (
              <g key={i} opacity={useFade(40 + i * 50, 10)}>
                <rect x={W / 2 - 460} y={250 + i * 86} width={920} height={70} rx={12} fill={BG_CARD} stroke={JADE} strokeWidth={1.5} />
                <text x={W / 2} y={294 + i * 86} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={pm}>
            <rect x={W / 2 - 480} y={530} width={960} height={96} rx={14} fill="#2A1010" stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={590} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">còn làm PM · là ĐỘ KIẾP MỖI NGÀY 🤣</text>
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 490} y={660} width={980} height={200} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={715} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người thường · mỗi ngày 1 vấn đề</text>
            <text x={W / 2} y={765} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>còn PM · biến 100 VẤN ĐỀ →</text>
            <text x={W / 2} y={822} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">1 status update DÀI 2 DÒNG 🤣</text>
          </g>
          <FigFooter label="100 vấn đề → 2 dòng cập nhật" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S16 CTA ============
const S16: React.FC<{ duration: number }> = ({ duration }) => {
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

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16];

export const PovPm: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("pov_pm/voice.mp3")} />
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
