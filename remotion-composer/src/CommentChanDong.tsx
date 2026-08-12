import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./comment_chan_dong_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "08";

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
const CODE_GRAY = "#5E7090";

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

const BlueprintBG: React.FC<{ glow?: string }> = ({ glow = JADE }) => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="ccgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="ccgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="ccglow" cx="50%" cy="36%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.08" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ccscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#ccgrid)" />
        <rect width={W} height={H} fill="url(#ccgrid2)" />
        <rect width={W} height={H} fill="url(#ccglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#ccscan)" />
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

const Badge: React.FC<{ num: string; color: string; entry: number }> = ({ num, color, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px 270px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 180} y={242} width={360} height={56} rx={28} fill={color} />
      <text x={W / 2} y={280} fontSize={28} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">COMMENT {num}</text>
    </g>
  );
};

// code editor block showing a comment line
const CodeBlock: React.FC<{ y: number; file: string; comment: string; color: string; entry: number; codeLines?: { n: string; t: string; c?: string }[]; commentSize?: number }> = ({ y, file, comment, color, entry, codeLines = [], commentSize = 38 }) => {
  const a = useScaleIn(entry, 14);
  const h = 130 + (codeLines.length + 1) * 56;
  const x = W / 2 - 460;
  const w = 920;
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <rect x={x} y={y} width={w} height={h} rx={12} fill={BG_TERM} stroke={color} strokeWidth={2.5} />
      <rect x={x} y={y} width={w} height={48} rx={12} fill={BG_CARD} />
      <circle cx={x + 28} cy={y + 24} r={7} fill={WARNING_RED} />
      <circle cx={x + 52} cy={y + 24} r={7} fill={AMBER} />
      <circle cx={x + 76} cy={y + 24} r={7} fill={JADE} />
      <text x={x + w / 2} y={y + 30} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>{file}</text>
      <line x1={x + 62} y1={y + 60} x2={x + 62} y2={y + h - 16} stroke={CODE_GRAY} strokeWidth={1} opacity={0.4} />
      <text x={x + 28} y={y + 108} fontSize={26} fill={CODE_GRAY} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>1</text>
      <text x={x + 84} y={y + 108} fontSize={commentSize} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{comment}</text>
      {codeLines.map((l, i) => (
        <g key={i}>
          <text x={x + 28} y={y + 164 + i * 56} fontSize={26} fill={CODE_GRAY} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{l.n}</text>
          <text x={x + 84} y={y + 164 + i * 56} fontSize={26} fill={l.c || TEXT_SEC} fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{l.t}</text>
        </g>
      ))}
    </g>
  );
};

const Conseq: React.FC<{ y: number; color: string; lines: { t: string; c?: string; size?: number }[]; entry: number }> = ({ y, color, lines, entry }) => {
  const a = useScaleIn(entry, 14);
  const h = 56 + lines.length * 50;
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <TechBox x={W / 2 - 470} y={y} w={940} h={h} color={color} thick={2.5} />
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={y + 56 + i * 50} fontSize={l.size || 32} fill={l.c || TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={l.c === AMBER_BRIGHT ? 900 : 700} fontStyle={l.c === AMBER_BRIGHT ? "italic" : "normal"}>{l.t}</text>
      ))}
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const liars = [
    { t: "Code có thể NÓI DỐI", e: 60 },
    { t: "Documentation có thể THẤT TRUYỀN", e: 100 },
    { t: "Requirement có thể THAY ĐỔI", e: 140 },
  ];
  const reveal = useScaleIn(210, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="WHISPERS OF THE ANCIENTS" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>Trong tiên giới công nghệ:</text>
          {liars.map((l, i) => (
            <g key={i} opacity={useFade(l.e, 10)}>
              <rect x={W / 2 - 400} y={360 + i * 96} width={800} height={78} rx={12} fill={BG_CARD} stroke={SLATE} strokeWidth={1.5} />
              <text x={W / 2} y={408 + i * 96} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>❌ {l.t}</text>
            </g>
          ))}
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={700} w={940} h={210} color={JADE} thick={3} />
            <text x={W / 2} y={765} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng COMMENT tiền bối để lại 💬</text>
            <text x={W / 2} y={830} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">chứa bí mật cực kỳ đáng sợ 😱</text>
            <text x={W / 2} y={882} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// 7 comment huyền thoại sau đây</text>
          </g>
          <FigFooter label="comment · di ngôn của tiền nhân" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 #1 DO NOT REMOVE ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={SLATE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="02" label="FOUR WORDS · NO REASON" />
        <Badge num="1" color={SLATE} entry={15} />
        <CodeBlock y={350} file="core.cpp" comment="// DO NOT REMOVE" color={SLATE} entry={60} codeLines={[{ n: "2", t: "// (không lý do, không docs)", c: CODE_GRAY }]} />
        <Conseq y={680} color={WARNING_RED} lines={[{ t: "1 đồng môn không tin → xóa → commit prod", c: TEXT_PRI, size: 28 }, { t: "10 phút sau: TOÀN BỘ production sụp đổ 💥", c: TEXT_PRI, size: 30 }, { t: "→ Rollback Đại Trận khởi động 🚨", c: AMBER_BRIGHT, size: 32 }]} entry={170} />
        <FigFooter label="comment 1 · đừng hỏi · đừng xóa" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S3 #2 TEMP FIX ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={JADE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="03" label="THE IMMORTALITY SUTRA" />
        <Badge num="2" color={JADE} entry={15} />
        <CodeBlock y={350} file="legacy.cpp" comment="// TEMP FIX" color={JADE} entry={60} />
        <g style={useScaleIn(150, 14)}>
          <rect x={W / 2 - 400} y={600} width={380} height={120} rx={12} fill={BG_CARD} stroke={SLATE} strokeWidth={2} />
          <text x={W / 2 - 210} y={648} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>ngày viết</text>
          <text x={W / 2 - 210} y={700} fontSize={48} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>2018</text>
          <text x={W / 2} y={668} fontSize={40} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>→</text>
          <rect x={W / 2 + 20} y={600} width={380} height={120} rx={12} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
          <text x={W / 2 + 210} y={648} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>hiện tại</text>
          <text x={W / 2 + 210} y={700} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>2026</text>
        </g>
        <Conseq y={780} color={WARNING_RED} lines={[{ t: "'tạm thời' đã kéo dài 8 NĂM", c: TEXT_PRI }, { t: "Git Đạo gọi: TRƯỜNG SINH QUYẾT 🧬", c: AMBER_BRIGHT, size: 34 }]} entry={240} />
        <FigFooter label="comment 2 · không gì vĩnh cửu bằng 'tạm thời'" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 #3 TODO ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const steps = [
    { t: "lời hứa 🤝", e: 130 },
    { t: "kế hoạch 📋", e: 170 },
    { t: "truyền thuyết 📜", e: 210 },
  ];
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="THE ETERNAL PROMISE" />
          <Badge num="3" color={ACCENT_BLUE} entry={15} />
          <CodeBlock y={350} file="feature.cpp" comment="// TODO" color={ACCENT_BLUE} entry={60} />
          <text x={W / 2} y={620} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(90, 12)}>tiến hóa qua 3 giai đoạn:</text>
          {steps.map((s, i) => (
            <g key={i} opacity={useFade(s.e, 10)}>
              {i > 0 && <text x={W / 2} y={648 + i * 90 - 18} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" opacity={frame > s.e ? 1 : 0}>↓</text>}
              <rect x={W / 2 - 280} y={660 + i * 90} width={560} height={70} rx={10} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
              <text x={W / 2} y={705 + i * 90} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{s.t}</text>
            </g>
          ))}
          <text x={W / 2} y={970} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={useScaleIn(280, 12)}>có TODO tồn tại lâu hơn cả dự án 🪦</text>
          <FigFooter label="comment 3 · to do = to never do" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 #4 QUICK FIX ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={VIOLET} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="05" label="ONE HOUR, THREE YEARS" />
        <Badge num="4" color={VIOLET} entry={15} />
        <CodeBlock y={350} file="patch.cpp" comment="// Quick fix" color={VIOLET} entry={60} />
        <Conseq y={640} color={WARNING_RED} lines={[{ t: "rất nhiều thiên kiếp production", c: TEXT_PRI }, { t: "đều bắt đầu từ 2 chữ: 'Quick Fix' 🌀", c: TEXT_PRI, size: 30 }]} entry={150} />
        <g style={useScaleIn(240, 14)}>
          <rect x={W / 2 - 440} y={840} width={880} height={110} rx={14} fill="#3A2E0A" stroke={AMBER} strokeWidth={3} />
          <text x={W / 2} y={910} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>1 GIỜ sửa bug = 3 NĂM trả nghiệp ⚖️</text>
        </g>
        <FigFooter label="comment 4 · nhanh 1 giờ · khổ 3 năm" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 #5 NEVER HAPPEN ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const it = useScaleIn(150, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="FAMOUS LAST WORDS" />
          <Badge num="5" color={ORANGE} entry={15} />
          <CodeBlock y={350} file="handler.cpp" comment="// This should" color={ORANGE} entry={60} codeLines={[{ n: "2", t: "// never happen", c: ORANGE }]} commentSize={34} />
          <text x={W / 2} y={680} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(90, 12)}>câu chú nổi tiếng nhất giới công nghệ · vì ngay sau đó:</text>
          <g style={{ ...it, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 340} y={730} width={680} height={120} rx={16} fill="#3A1010" stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={805} fontSize={46} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>… NÓ XẢY RA 💀</text>
          </g>
          <text x={W / 2} y={930} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(240, 12)}>mỗi lần xuất hiện · Monitoring đều rung động 📊</text>
          <FigFooter label="comment 5 · điều không thể · luôn xảy ra" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 #6 NO IDEA ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const who = [
    { t: "Người VIẾT không hiểu", e: 130 },
    { t: "Người REVIEW không hiểu", e: 175 },
    { t: "Người MAINTAIN không hiểu", e: 220 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="IT JUST WORKS" />
          <Badge num="5" color={WARNING_RED} entry={15} />
          <CodeBlock y={340} file="magic.cpp" comment="// I have no idea" color={WARNING_RED} entry={60} codeLines={[{ n: "2", t: "// why this works", c: WARNING_RED }]} commentSize={34} />
          {who.map((w, i) => (
            <g key={i} opacity={useFade(w.e, 10)}>
              <rect x={W / 2 - 380} y={650 + i * 76} width={760} height={62} rx={10} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={1.5} />
              <text x={W / 2} y={690 + i * 76} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>❓ {w.t}</text>
            </g>
          ))}
          <Conseq y={900} color={AMBER} lines={[{ t: "nhưng nó CHẠY · không ai dám động", c: TEXT_PRI, size: 28 }, { t: "động vào = thiên kiếp DIỆT TÔNG ☠️", c: AMBER_BRIGHT, size: 32 }]} entry={290} />
          <FigFooter label="comment 5 · đừng đụng · kẻo diệt tông" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 #7 HACK ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const grow = [
    { t: "giải pháp tạm thời", e: 120 },
    { t: "code khác phụ thuộc vào nó", e: 165 },
    { t: "rồi nhiều code khác nữa", e: 210 },
    { t: "→ một phần của THIÊN ĐẠO", e: 270 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={SLATE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="THE LOAD-BEARING HACK" />
          <Badge num="6" color={SLATE} entry={15} />
          <CodeBlock y={350} file="util.cpp" comment="// HACK" color={SLATE} entry={60} />
          {grow.map((g, i) => (
            <g key={i} opacity={useFade(g.e, 10)}>
              <rect x={W / 2 - 400} y={630 + i * 82} width={800} height={66} rx={10} fill={i === 3 ? "#3A2E0A" : BG_CARD} stroke={i === 3 ? AMBER : SLATE} strokeWidth={i === 3 ? 2.5 : 1.5} />
              <text x={W / 2} y={672 + i * 82} fontSize={28} fill={i === 3 ? AMBER_BRIGHT : TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={i === 3 ? 900 : 700}>{g.t}</text>
            </g>
          ))}
          <FigFooter label="comment 6 · hack tạm · gánh cả hệ thống" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 #8 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const knew = [
    { t: "biết bug sẽ xuất hiện", e: 130 },
    { t: "biết production sẽ độ kiếp", e: 175 },
    { t: "biết người bảo trì sẽ chịu nghiệp", e: 220 },
  ];
  const twist = useScaleIn(330, 16);
  const truth = useScaleIn(560, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE APOLOGY" />
          <Badge num="CUỐI" color={AMBER} entry={15} />
          <CodeBlock y={340} file="?.cpp" comment="// If this breaks," color={AMBER} entry={60} codeLines={[{ n: "2", t: "// I'm sorry", c: AMBER }]} commentSize={34} />
          <text x={W / 2} y={650} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(90, 12)}>tác giả đã nhìn thấy tương lai · hắn:</text>
          {knew.map((k, i) => (
            <text key={i} x={W / 2} y={710 + i * 50} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={useFade(k.e, 10)}>✓ {k.t}</text>
          ))}
          <g style={{ ...twist, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={880} width={920} height={120} rx={14} fill={BG_CARD} stroke={AMBER} strokeWidth={2.5} />
            <text x={W / 2} y={930} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>lời xin lỗi ấy · không dành cho khách hàng</text>
            <text x={W / 2} y={978} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà dành cho CHÍNH NGƯƠI 🫵</text>
          </g>
          <g style={{ ...truth, transformOrigin: `${W / 2}px 1130px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={1040} w={940} h={180} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={1098} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">comment đáng sợ nhất không phải comment sai…</text>
            <text x={W / 2} y={1150} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà là comment khiến ngươi nhận ra:</text>
            <text x={W / 2} y={1198} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">người viết năm xưa · cũng tuyệt vọng y hệt ngươi 🥀</text>
          </g>
          <FigFooter label="comment cuối · lời xin lỗi xuyên thời gian" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S7, S8, S9];

export const CommentChanDong: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("comment_chan_dong/voice.mp3")} />
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
