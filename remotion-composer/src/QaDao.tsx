import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./qa_dao_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "12";

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
          <pattern id="qagrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="qagrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="qaglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.1" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="qascan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#qagrid)" />
        <rect width={W} height={H} fill="url(#qagrid2)" />
        <rect width={W} height={H} fill="url(#qaglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#qascan)" />
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
const Hero: React.FC<{ cy: number; label: string; sub?: string; color: string; entry: number }> = ({ cy, label, sub, color, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 490} y={cy - 64} width={980} height={128} rx={18} fill={BG_CARD} stroke={color} strokeWidth={4} />
      <text x={W / 2} y={cy + (sub ? -8 : 12)} fontSize={44} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{label}</text>
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
  const group = useScaleIn(446, 14);
  const nots = useFadeUp(501, 14);
  const ask = useScaleIn(642, 14);
  const qa = useScaleIn(706, 16);
  const CELEB = [{ e: 216, t: "💻 Dev xuất quan" }, { e: 270, t: "📋 PM báo tin mừng" }, { e: 324, t: "🙍 khách chuẩn bị nghiệm thu" }];
  const NOT = ["✗ không chúc mừng", "✗ không mở tiệc", "✗ không ăn mừng chiến thắng"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="WHAT IS QA?" />
          <text x={W / 2} y={250} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(40, 12)}>mỗi khi 1 công pháp hoàn thành · tông môn vui vẻ 🎉</text>
          <g>
            {CELEB.map((c, i) => (
              <g key={i} style={useScaleIn(c.e, 11)}>
                <rect x={W / 2 - 440} y={290 + i * 70} width={880} height={58} rx={11} fill={BG_CARD} stroke={JADE} strokeWidth={1.5} />
                <text x={W / 2} y={328 + i * 70} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{c.t}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={560} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={{ ...group }}>nhưng luôn có 1 nhóm người xuất hiện…</text>
          <g style={nots}>
            {NOT.map((t, i) => (
              <g key={i} opacity={useFade(500 + i * 30, 10)}>
                <rect x={W / 2 - 430} y={600 + i * 64} width={860} height={52} rx={10} fill={BG_TERM} stroke={TEXT_MUTE} strokeWidth={1.5} />
                <text x={W / 2} y={635 + i * 64} fontSize={25} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{t}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={840} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={{ ...ask }}>chỉ lặng lẽ hỏi: "Nếu THẤT BẠI thì sao?" 💀</text>
          <g style={{ ...qa, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 200} y={890} width={400} height={96} rx={16} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
            <text x={W / 2} y={952} fontSize={50} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="3">QA</text>
          </g>
          <FigFooter label="QA · người duy nhất hỏi 'nếu hỏng thì sao'" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 ORIGIN ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const disaster = useFadeUp(489, 14);
  const hunt = useScaleIn(701, 14);
  const DIS = ["💎 linh thạch biến mất", "🗂️ dữ liệu thất lạc", "🏯 toàn bộ đại trận sụp đổ"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE LAWLESS AGE" />
          <text x={W / 2} y={280} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(20, 12)}>thượng cổ · chưa có Chất Lượng Đạo…</text>
          <g style={useScaleIn(233, 14)}>
            <rect x={W / 2 - 480} y={330} width={960} height={120} rx={16} fill={BG_CARD} stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2} y={385} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Dev viết xong → xuất quan →</text>
            <text x={W / 2} y={425} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>ném thẳng vào PRODUCTION GIỚI 🤣</text>
          </g>
          <text x={W / 2} y={520} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(430, 12)}>cho tới 1 ngày · công pháp linh thạch DỊ BIẾN:</text>
          <g style={disaster}>
            {DIS.map((t, i) => (
              <g key={i} opacity={useFade(497 + i * 34, 10)}>
                <rect x={W / 2 - 440} y={560 + i * 78} width={880} height={64} rx={11} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2} />
                <text x={W / 2} y={602 + i * 78} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...hunt, transformOrigin: `${W / 2}px 860px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={810} w={940} h={96} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={870} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ tông chủ nổi giận · truy tìm HUNG THỦ 💀</text>
          </g>
          <FigFooter label="ship thẳng prod · không kiểm tra · đại loạn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 BLAME ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const turn = useScaleIn(335, 14);
  const kinh = useScaleIn(420, 14);
  const none = useScaleIn(657, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="WHO IS GUILTY?" />
          <Quote y={225} who="🤬 có người" whoColor={WARNING_RED} say="là Dev sai" entry={10} />
          <Quote y={315} who="🤬 có người" whoColor={WARNING_RED} say="là PM sai" entry={65} />
          <Quote y={405} who="🤬 có người" whoColor={WARNING_RED} say="là BA sai" entry={120} />
          <text x={W / 2} y={540} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={{ ...turn }}>tranh luận 7 ngày 7 đêm · lão tổ xuất hiện · nhìn NHÂN QUẢ</text>
          <g style={kinh}>
            <rect x={W / 2 - 480} y={580} width={960} height={120} rx={16} fill={BG_TERM} stroke={ACCENT_BLUE} strokeWidth={2.5} />
            <text x={W / 2} y={632} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>mở 🔮 Thiên Cơ Kính · quan sát:</text>
            <text x={W / 2} y={675} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>commit · log · ticket · dòng chảy thiên cơ</text>
          </g>
          <g style={{ ...none, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={750} width={840} height={100} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={3.5} />
            <text x={W / 2} y={812} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"KHÔNG AI SAI CẢ" 💀</text>
          </g>
          <FigFooter label="blame game · 7 ngày không ra kết quả" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 ROOTCAUSE ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const seed = useScaleIn(110, 14);
  const law = useScaleIn(220, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="CAUSE & EFFECT" />
          <g style={{ ...seed, transformOrigin: `${W / 2}px 340px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={270} width={960} height={150} rx={16} fill={BG_TERM} stroke={VIOLET} strokeWidth={3} />
            <text x={W / 2} y={325} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>lão tổ: "lỗi này KHÔNG tạo ra hôm nay…</text>
            <text x={W / 2} y={385} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà GIEO MẦM từ 3 tháng trước" 💀</text>
          </g>
          <g style={{ ...law, transformOrigin: `${W / 2}px 580px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={490} width={460} height={180} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2 - 240} y={555} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🐛 BUG</text>
            <text x={W / 2 - 240} y={615} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>chỉ là QUẢ</text>
            <rect x={W / 2 + 10} y={490} width={460} height={180} rx={16} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2 + 240} y={555} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🌱 NGUYÊN NHÂN</text>
            <text x={W / 2 + 240} y={615} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>mới là NHÂN</text>
          </g>
          <text x={W / 2} y={760} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useFadeUp(323, 12)}>→ QA ĐẠO xuất thế 🏯</text>
          <FigFooter label="root cause · bug là triệu chứng, không phải bệnh" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 BUGHUNTER ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const confident = useScaleIn(620, 14);
  const unease = useScaleIn(748, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="JUST A BUG HUNTER?" />
          <text x={W / 2} y={270} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(20, 12)}>ban đầu · QA chỉ chuyên SĂN BUG:</text>
          <g style={useScaleIn(172, 12)}>
            <rect x={W / 2 - 470} y={310} width={940} height={100} rx={14} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
            <text x={W / 2} y={352} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thấy bug → báo bug · Dev → sửa bug</text>
            <text x={W / 2} y={390} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">thiên hạ tưởng: đó chính là QA Đạo 🤣</text>
          </g>
          <g style={confident}>
            <rect x={W / 2 - 470} y={450} width={940} height={120} rx={16} fill={BG_TERM} stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2} y={505} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>cho tới 1 ngày · Dev xuất quan tự tin:</text>
            <text x={W / 2} y={548} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Ta đã TỰ TEST" 🤣</text>
          </g>
          <g style={{ ...unease, transformOrigin: `${W / 2}px 700px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={620} w={960} h={150} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={678} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>khoảnh khắc ấy…</text>
            <text x={W / 2} y={725} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">toàn bộ QA đồng thời ĐẠO TÂM BẤT ỔN 💀</text>
          </g>
          <FigFooter label="'tôi test rồi' · câu nói rợn người nhất" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 PROPHECY ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const line = useScaleIn(77, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="THE ANCIENT PROPHECY" />
          <text x={W / 2} y={350} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(20, 12)}>từ thượng cổ · đã có 1 câu TIÊN NGÔN 📖</text>
          <g style={{ ...line, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 490} y={440} width={980} height={240} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
            <text x={W / 2} y={520} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"Kẻ VIẾT công pháp…</text>
            <text x={W / 2} y={580} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cũng chính là kẻ TIN</text>
            <text x={W / 2} y={640} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">công pháp đó KHÔNG CÓ LỖI nhất" 💀</text>
          </g>
          <FigFooter label="author bias · ai cũng tin code mình sạch" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 DUKIEP1 ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const rows = [
    { e: 204, who: "📋 PM thấy", a: "TIẾN ĐỘ", qa: "RỦI RO", c: AMBER },
    { e: 285, who: "💻 Dev thấy", a: "TÍNH NĂNG", qa: "EDGE CASE", c: ACCENT_BLUE },
    { e: 369, who: "🙍 Khách thấy", a: "THÀNH QUẢ", qa: "PRODUCTION SẬP", c: WARNING_RED },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="THE PRECOGNITION ART" />
          <Hero cy={320} label="DỰ KIẾP THUẬT" sub="// QA nhìn thấy thiên kiếp trước" color={VIOLET} entry={123} />
          {rows.map((r, i) => (
            <g key={i} style={useScaleIn(r.e, 12)}>
              <rect x={W / 2 - 480} y={450 + i * 130} width={960} height={114} rx={14} fill={BG_CARD} stroke={r.c} strokeWidth={2} />
              <text x={W / 2 - 445} y={495 + i * 130} fontSize={23} fill={r.c} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{r.who}</text>
              <text x={W / 2 - 445} y={538 + i * 130} fontSize={30} fill={TEXT_SEC} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.a}</text>
              <text x={W / 2 + 445} y={520 + i * 130} fontSize={20} fill={TEXT_MUTE} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>QA thấy →</text>
              <text x={W / 2 + 445} y={552 + i * 130} fontSize={30} fill={AMBER_BRIGHT} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">{r.qa}</text>
            </g>
          ))}
          <FigFooter label="precognition · thấy sự cố trước khi nó xảy ra" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 DUKIEP2 ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const ask = useScaleIn(188, 14);
  const signs = useFadeUp(484, 14);
  const SIGN = ["🚫 Monitoring chưa bật", "↩️ Rollback chưa chuẩn bị", "🔔 Alert chưa cấu hình", "🔁 Regression chưa chạy"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="THE OMEN" />
          <text x={W / 2} y={260} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(15, 12)}>release ngày mai · ai cũng vui · chỉ QA mặt sắp ĐỘ KIẾP</text>
          <g style={ask}>
            <rect x={W / 2 - 480} y={300} width={960} height={130} rx={16} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
            <text x={W / 2} y={350} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>PM: "ngươi phát hiện bug sao?" · QA: "Chưa"</text>
            <text x={W / 2} y={400} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">"vậy sao sắc mặt khó coi vậy?" → QA nhìn trời ☁️</text>
          </g>
          <g style={signs}>
            {SIGN.map((t, i) => (
              <g key={i} opacity={useFade(492 + i * 30, 10)}>
                <rect x={W / 2 - 450} y={470 + i * 84} width={900} height={68} rx={11} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2} />
                <text x={W / 2} y={513 + i * 84} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={850} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useFadeUp(620, 12)}>→ PM nghe xong · đạo tâm lập tức BẤT ỔN 🤣</text>
          <FigFooter label="mây đen đang tụ · QA ngửi thấy sự cố" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 TRUYBAN1 ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const deny = useScaleIn(373, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE ROOT-CAUSE ART" />
          <Hero cy={310} label="TRUY BẢN TỐ NGUYÊN" sub="// thần thông đáng sợ nhất" color={JADE} entry={155} />
          <text x={W / 2} y={450} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(280, 12)}>production đại kiếp · cả tông môn truy hung thủ:</text>
          <g style={deny}>
            <Quote y={500} who="📋 PM" whoColor={AMBER} say="không phải ta" entry={0} />
          </g>
          <g style={useScaleIn(435, 12)}>
            <Quote y={595} who="🧩 BA" whoColor={ACCENT_BLUE} say="không phải ta" entry={0} />
          </g>
          <g style={useScaleIn(496, 14)}>
            <rect x={W / 2 - 470} y={690} width={940} height={100} rx={14} fill="#2A1010" stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2 - 432} y={740} fontSize={24} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>💻 Dev</text>
            <text x={W / 2 + 432} y={748} fontSize={34} fill={AMBER_BRIGHT} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"máy ta CHẠY ĐƯỢC" 💀</text>
          </g>
          <FigFooter label="'works on my machine' · kinh điển muôn đời" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 TRUYBAN2 ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const trace = useFadeUp(69, 14);
  const found = useScaleIn(317, 16);
  const silent = useScaleIn(440, 14);
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  const TRACE = ["🧵 từng sợi nhân quả", "📜 từng dòng log", "🔎 từng dấu vết còn sót"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="TRACING THE ORIGIN" />
          <text x={W / 2} y={270} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(15, 12)}>chỉ QA âm thầm ngồi xuống · lần theo:</text>
          <g style={trace}>
            {TRACE.map((t, i) => (
              <g key={i} opacity={useFade(80 + i * 40, 10)}>
                <rect x={W / 2 - 440} y={310 + i * 78} width={880} height={64} rx={11} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={1.5} />
                <text x={W / 2} y={352 + i * 78} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...found, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={560} width={960} height={160} rx={18} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={4} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={615} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nguồn gốc của đại kiếp là…</text>
            <text x={W / 2} y={665} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>MỘT CHECKBOX ☑️</text>
            <text x={W / 2} y={702} fontSize={25} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>bị bỏ sót trong cuộc họp 3 tháng trước</text>
          </g>
          <text x={W / 2} y={810} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={{ ...silent }}>→ toàn bộ đại điện TRẦM MẶC 🤣</text>
          <FigFooter label="1 checkbox bị quên · 1 đại kiếp ra đời" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S11 LEVELS1 ============
const S11: React.FC<{ duration: number }> = ({ duration }) => {
  const ladder = [
    { e: 213, t: "tìm bug", r: "chỉ là NHẬP MÔN", c: TEXT_MUTE },
    { e: 270, t: "sửa bug", r: "chỉ là TIỂU THÀNH", c: ACCENT_BLUE },
    { e: 330, t: "tìm NGUYÊN NHÂN", r: "mới là ĐẠI THÀNH", c: JADE },
    { e: 387, t: "NGĂN bug sinh ra", r: "mới là VIÊN MÃN", c: AMBER },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="QA IS NOT A BUG FINDER" />
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(91, 12)}>nhiều người nghĩ QA = người tìm bug · nhưng…</text>
          {ladder.map((r, i) => (
            <g key={i} style={useScaleIn(r.e, 12)}>
              <rect x={W / 2 - 470} y={350 + i * 110} width={940} height={94} rx={14} fill={BG_CARD} stroke={r.c} strokeWidth={i === 3 ? 3.5 : 2} />
              <text x={W / 2 - 430} y={408 + i * 110} fontSize={30} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.t}</text>
              <text x={W / 2 + 432} y={408 + i * 110} fontSize={30} fill={r.c === TEXT_MUTE ? TEXT_SEC : r.c} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">{r.r}</text>
            </g>
          ))}
          <FigFooter label="từ săn bug → ngăn bug · cả 1 hành trình" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S12 LEVELS2 ============
const S12: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ranks = [
    { e: 69, t: "HẠ PHẨM", r: "nhìn thấy bug", c: TEXT_MUTE },
    { e: 143, t: "TRUNG PHẨM", r: "hiểu bug", c: ACCENT_BLUE },
    { e: 217, t: "THƯỢNG PHẨM", r: "nhìn thấy nhân quả", c: VIOLET },
    { e: 289, t: "CỰC PHẨM", r: "khiến bug không thể xuất hiện", c: AMBER },
  ];
  const legend = useScaleIn(457, 16);
  const lost = useScaleIn(572, 14);
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="11" label="THE FOUR GRADES" />
          {ranks.map((r, i) => (
            <g key={i} style={useScaleIn(r.e, 11)}>
              <rect x={W / 2 - 470} y={230 + i * 92} width={940} height={78} rx={12} fill={i === 3 ? BG_TERM : BG_CARD} stroke={r.c} strokeWidth={i === 3 ? 3 : 2} />
              <text x={W / 2 - 432} y={278 + i * 92} fontSize={27} fill={r.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{r.t}</text>
              <text x={W / 2 + 432} y={278 + i * 92} fontSize={26} fill={i === 3 ? AMBER_BRIGHT : TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.r}</text>
            </g>
          ))}
          <g style={{ ...legend, transformOrigin: `${W / 2}px 700px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 490} y={620} width={980} height={150} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={672} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>còn cảnh giới TRUYỀN THUYẾT:</text>
            <text x={W / 2} y={722} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">khiến Dev TỰ VIẾT UNIT TEST đầy đủ 🤣</text>
          </g>
          <text x={W / 2} y={840} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={{ ...lost }}>…tiếc thay · đã THẤT TRUYỀN từ thượng cổ 💀</text>
          <FigFooter label="cảnh giới cao nhất · mãi là truyền thuyết" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S13 CTA ============
const S13: React.FC<{ duration: number }> = ({ duration }) => {
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
            <text x={W / 2} y={490} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Ngươi đang ở LEVEL nào</text>
            <text x={W / 2} y={545} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">của QA Đạo? 🤔</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 650px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={665} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 comment cảnh giới của ngươi 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 820px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 820px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={750} width={600} height={140} rx={70} fill={JADE} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={762} width={570} height={116} rx={58} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
              <text x={W / 2} y={838} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={970} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(150, 12)}>để không bỏ lỡ truyền kỳ giới IT tiếp theo 🏯</text>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13];

export const QaDao: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("qa_dao/voice.mp3")} />
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
