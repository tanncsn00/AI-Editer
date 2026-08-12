import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./webhook_dao_beats.json";

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
          <pattern id="whgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="whgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="whglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="whscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#whgrid)" />
        <rect width={W} height={H} fill="url(#whgrid2)" />
        <rect width={W} height={H} fill="url(#whglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#whscan)" />
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
  const w = big ? 600 : 440;
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={cx - w / 2} y={cy - 60} width={w} height={120} rx={16} fill={BG_CARD} stroke={color} strokeWidth={3.5} />
      <text x={cx} y={cy + (sub ? -4 : 16)} fontSize={big ? 54 : 46} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{label}</text>
      {sub && <text x={cx} y={cy + 38} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const title = useScaleIn(20, 16);
  const setup = useFadeUp(150, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="THE ASKING WAY" />
          <g style={{ ...title, transformOrigin: `${W / 2}px 430px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={400} fontSize={44} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>WEBHOOK ĐẠO</text>
            <text x={W / 2} y={480} fontSize={64} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">…LÀ GÌ? 📡</text>
          </g>
          <g style={{ ...setup, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={600} w={960} h={250} color={AMBER} thick={3} />
            <text x={W / 2} y={665} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">thời thượng cổ · các tông môn dùng:</text>
            <text x={W / 2} y={725} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>“THỈNH GIÁO ĐẠO”</text>
            <text x={W / 2} y={790} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>muốn biết gì → liên tục gửi thần niệm đi hỏi 📨</text>
          </g>
          <FigFooter label="webhook · truyền âm thuật của tam giới" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 POLLING ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(200, 16);
  const qs = ["📦 Đơn hàng tới đâu rồi?", "💰 Thanh toán thành công chưa?", "✍️ Khách đã đăng ký chưa?"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="ASK · ASK · ASK" />
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>mỗi khi muốn biết · đệ tử lại gửi thần niệm:</text>
          {qs.map((q, i) => (
            <g key={i} style={{ ...useScaleIn(30 + i * 45, 12), transformOrigin: `${W / 2}px ${380 + i * 100}px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 440} y={345 + i * 100} width={880} height={80} rx={14} fill={BG_CARD} stroke={ORANGE} strokeWidth={2} />
              <text x={W / 2} y={395 + i * 100} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{q}</text>
            </g>
          ))}
          <text x={W / 2} y={730} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={useFadeUp(160, 12)}>hỏi · rồi lại hỏi · hỏi mãi không thôi 🔁</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={850} label="POLLING ĐẠO" sub="// hỏi liên tục cho tới khi có" color={ORANGE} entry={0} big />
          </g>
          <FigFooter label="polling · chủ động đi hỏi · lặp vô tận" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 PROBLEM ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const scale = useFadeUp(40, 14);
  const waste = useFadeUp(150, 14);
  const reply = useScaleIn(280, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="IT DOESN'T SCALE" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>ban đầu nó hoạt động khá ổn…</text>
          <g style={scale}>
            <rect x={W / 2 - 460} y={360} width={920} height={130} rx={16} fill={BG_CARD} stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2} y={415} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng khi đệ tử tăng lên HÀNG TRIỆU…</text>
            <text x={W / 2} y={462} fontSize={34} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>cả tông môn bắt đầu ĐAU ĐẦU 🤯</text>
          </g>
          <text x={W / 2} y={580} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={waste}>vô số thần niệm gửi đi · chỉ để nhận lại 1 câu:</text>
          <g style={{ ...reply, transformOrigin: `${W / 2}px 740px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 440} y={650} w={880} h={180} color={TEXT_MUTE} thick={3} />
            <text x={W / 2} y={760} fontSize={50} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">“Chưa có gì mới.” 😑</text>
          </g>
          <FigFooter label="99% câu hỏi = lãng phí tài nguyên" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 WEBHOOK ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(40, 16);
  const how = useFadeUp(170, 14);
  const say = useScaleIn(300, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="A NEW WAY" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>từ đó · một công pháp mới ra đời…</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 440px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={440} label="WEBHOOK ĐẠO" sub="// không hỏi · chỉ chờ được gọi" color={JADE} entry={0} big />
          </g>
          <g style={how}>
            <rect x={W / 2 - 460} y={570} width={920} height={140} rx={14} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={620} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✗ KHÔNG hỏi liên tục</text>
            <text x={W / 2} y={668} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✓ để lại TRUYỀN ÂM PHÙ + địa chỉ động phủ 🪧</text>
          </g>
          <g style={{ ...say, transformOrigin: `${W / 2}px 840px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={760} w={940} h={150} color={AMBER} thick={3} />
            <text x={W / 2} y={820} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>rồi nói một câu:</text>
            <text x={W / 2} y={872} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">“khi nào có biến · báo cho ta” 🔔</text>
          </g>
          <FigFooter label="webhook · đăng ký 1 lần · chờ tin tự tới" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 EXAMPLE ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const sell = useFadeUp(40, 14);
  const bad = useScaleIn(150, 14);
  const good = useScaleIn(330, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="REAL EXAMPLE · SEPAY" />
          <g style={sell}>
            <text x={W / 2} y={295} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ngươi bán 1 kiện pháp bảo 🛒</text>
            <text x={W / 2} y={345} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">khách thanh toán qua <tspan fill={ACCENT_BLUE} fontWeight={900}>SePay</tspan> 💳</text>
          </g>
          <g style={bad}>
            <rect x={W / 2 - 460} y={400} width={920} height={170} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={448} fontSize={24} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>POLLING · mỗi giây đều hỏi:</text>
            <text x={W / 2} y={498} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>“khách trả tiền chưa?” × × ×</text>
            <text x={W / 2} y={545} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>😩 mệt mỏi · tốn tài nguyên</text>
          </g>
          <text x={W / 2} y={630} fontSize={40} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={useFade(310, 10)}>↓</text>
          <g style={{ ...good, transformOrigin: `${W / 2}px 770px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={660} width={940} height={230} rx={18} fill="#0E2A1A" stroke={JADE} strokeWidth={3} />
            <text x={W / 2} y={710} fontSize={24} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>WEBHOOK · để lại truyền âm phù:</text>
            <text x={W / 2} y={765} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>giao dịch xong → SePay LẬP TỨC</text>
            <text x={W / 2} y={808} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>truyền tin tới động phủ của ngươi 📨</text>
            <text x={W / 2} y={862} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ đó chính là WEBHOOK ✨</text>
          </g>
          <FigFooter label="sepay webhook · ví dụ thật ai cũng gặp" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 BENEFIT ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const no = useScaleIn(20, 14);
  const only = useScaleIn(120, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="PUSH · NOT POLL" />
          <g style={no}>
            <rect x={W / 2 - 470} y={360} width={940} height={170} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={418} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✗ không liên tục dò xét thiên cơ</text>
            <text x={W / 2} y={478} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✗ không gửi vô số thần niệm vô ích</text>
          </g>
          <g style={{ ...only, transformOrigin: `${W / 2}px 670px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={580} w={940} h={190} color={JADE} thick={3} />
            <text x={W / 2} y={650} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✓ chỉ khi SỰ KIỆN thật sự xảy ra…</text>
            <text x={W / 2} y={715} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">tin tức mới được truyền tới ⚡</text>
          </g>
          <FigFooter label="event-driven · chỉ chạy khi cần" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 CAVEATS ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const law = useScaleIn(30, 14);
  const risks = useFadeUp(160, 14);
  const fix = useScaleIn(340, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="THE PRICE OF POWER" />
          <g style={{ ...law, transformOrigin: `${W / 2}px 290px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={300} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>thần thông càng mạnh · nhân quả càng lớn ⚖️</text>
          </g>
          <g style={risks}>
            <rect x={W / 2 - 470} y={360} width={455} height={170} rx={14} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2 - 242} y={415} fontSize={40} textAnchor="middle">📭</text>
            <text x={W / 2 - 242} y={465} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>động phủ ĐÓNG</text>
            <text x={W / 2 - 242} y={503} fontSize={25} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>→ tin thất lạc</text>
            <rect x={W / 2 + 15} y={360} width={455} height={170} rx={14} fill="#1A1030" stroke={VIOLET} strokeWidth={2.5} />
            <text x={W / 2 + 242} y={415} fontSize={40} textAnchor="middle">👹</text>
            <text x={W / 2 + 242} y={465} fontSize={26} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>phù GIẢ MẠO</text>
            <text x={W / 2 + 242} y={503} fontSize={25} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>→ tâm ma gửi tin giả</text>
          </g>
          <g style={{ ...fix, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={590} width={940} height={250} rx={18} fill={BG_TERM} stroke={JADE} strokeWidth={3} />
            <text x={W / 2} y={645} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>cho nên đại năng phải thiết lập:</text>
            <text x={W / 2} y={702} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🔑 chữ ký bí mật</text>
            <text x={W / 2} y={748} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🛡️ xác thực thân phận</text>
            <text x={W / 2} y={794} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🔄 cơ chế truyền lại khi thất bại</text>
          </g>
          <FigFooter label="signature · auth · retry · 3 lá chắn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 ENDING ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const poll = useScaleIn(40, 14);
  const hook = useScaleIn(180, 14);
  const reveal = useScaleIn(340, 18);
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="POLLING vs WEBHOOK" />
          <g style={poll}>
            <rect x={W / 2 - 470} y={290} width={940} height={170} rx={16} fill="#2A1810" stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2} y={340} fontSize={28} fill={ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>POLLING ĐẠO</text>
            <text x={W / 2} y={392} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>“có chuyện gì chưa? · chưa? · chưa?”</text>
            <text x={W / 2} y={432} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// hỏi tới vô tận 🔁</text>
          </g>
          <g style={hook}>
            <rect x={W / 2 - 470} y={490} width={940} height={150} rx={16} fill="#0E2A1A" stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={540} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>WEBHOOK ĐẠO</text>
            <text x={W / 2} y={595} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>“có chuyện thì GỌI TA.” 🔔</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={690} width={960} height={200} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.75 + 0.25 * glow} />
            <text x={W / 2} y={750} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">vì vậy trong vô số đại trận hiện đại…</text>
            <text x={W / 2} y={810} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Webhook được tôn là</text>
            <text x={W / 2} y={862} fontSize={38} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">TRUYỀN ÂM THUẬT của tam giới 🏯</text>
          </g>
          <FigFooter label="đừng đi hỏi · hãy để nó gọi ngươi" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 CTA ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const head = useFadeUp(6, 12);
  const btn = useScaleIn(36, 14);
  const pulse = 1 + 0.03 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <text x={W / 2} y={620} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={head}>Còn vô số công pháp giới IT…</text>
          <text x={W / 2} y={685} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={head}>đang chờ được giảng giải kiểu tu tiên 🏯</text>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={810} width={600} height={140} rx={70} fill={JADE} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={822} width={570} height={116} rx={58} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
              <text x={W / 2} y={898} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1030} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(60, 12)}>để không bỏ lỡ công pháp tiếp theo 👇</text>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

export const WebhookDao: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("webhook_dao/voice.mp3")} />
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
