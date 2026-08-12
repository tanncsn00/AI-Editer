import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./tien_te_dao_beats.json";

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
          <pattern id="ttdgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="ttdgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="ttdglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ttdscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#ttdgrid)" />
        <rect width={W} height={H} fill="url(#ttdgrid2)" />
        <rect width={W} height={H} fill="url(#ttdglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#ttdscan)" />
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
  const w = big ? 640 : 460;
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={cx - w / 2} y={cy - 62} width={w} height={124} rx={16} fill={BG_CARD} stroke={color} strokeWidth={3.5} />
      <text x={cx} y={cy + (sub ? -6 : 16)} fontSize={big ? 48 : 42} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{label}</text>
      {sub && <text x={cx} y={cy + 34} fontSize={21} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const q = useScaleIn(150, 16);
  const laugh = useFadeUp(310, 14);
  const kill = useScaleIn(460, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="THE FINANCE REALM" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>câu hỏi khiến vô số Backend sinh tâm ma:</text>
          <g style={{ ...q, transformOrigin: `${W / 2}px 430px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 490} y={350} w={980} h={170} color={AMBER} thick={3} />
            <text x={W / 2} y={420} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>"Làm sao ngân hàng</text>
            <text x={W / 2} y={478} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>không bị trừ tiền 2 lần?" 🏦</text>
          </g>
          <g style={laugh}>
            <rect x={W / 2 - 460} y={580} width={920} height={130} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={630} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>người ngoài nghe xong bật cười:</text>
            <text x={W / 2} y={678} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"thì kiểm tra rồi trừ tiền thôi" 😄</text>
          </g>
          <g style={{ ...kill, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={815} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">nhưng câu hỏi này…</text>
            <text x={W / 2} y={870} fontSize={38} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>đã GIẾT CHẾT vô số hệ thống 💀</text>
          </g>
          <FigFooter label="tiền tệ đạo · nơi sai 1 ly đi vạn dặm" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 BOWL_RACE ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const bowl = useFadeUp(30, 14);
  const vs = useScaleIn(300, 14);
  const first = useScaleIn(630, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE RACE CONDITION" />
          <g style={bowl}>
            <rect x={W / 2 - 460} y={250} width={920} height={130} rx={14} fill={BG_CARD} stroke={AMBER} strokeWidth={2.5} />
            <text x={W / 2} y={300} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🍜 mua bát mì · bấm thanh toán · mạng LAG</text>
            <text x={W / 2} y={345} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→ bấm lại lần 2 · 3 · 4 😤</text>
          </g>
          <g style={vs}>
            <text x={W / 2} y={440} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">phía hắn: 1 nút bấm 📱 · phía hệ thống: thiên kiếp 💀</text>
          </g>
          {/* 4 requests each see 1 triệu */}
          <g>
            {[0, 1, 2, 3].map((i) => {
              const x = W / 2 - 185 + (i % 2) * 370;
              const y = 500 + Math.floor(i / 2) * 130;
              return (
                <g key={i} opacity={useFade(360 + i * 45, 10)}>
                  <rect x={x - 170} y={y} width={340} height={108} rx={12} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2} />
                  <text x={x} y={y + 44} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>yêu cầu #{i + 1}</text>
                  <text x={x} y={y + 84} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thấy 1 triệu 💎</text>
                </g>
              );
            })}
          </g>
          <g style={{ ...first, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={770} w={960} h={130} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={830} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>4 phân thân · cùng nhìn 1 số dư</text>
            <text x={W / 2} y={878} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cùng tưởng mình là người ĐẦU TIÊN 😱</text>
          </g>
          <FigFooter label="race condition · cùng đọc 1 số dư cũ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 RESULT ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const money = useScaleIn(30, 16);
  const ma = useFadeUp(170, 14);
  const reveal = useScaleIn(320, 14);
  const what = useFadeUp(410, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="THE DISASTER" />
          <g style={{ ...money, transformOrigin: `${W / 2}px 350px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={280} width={455} height={150} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2 - 242} y={335} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>bát mì giá</text>
            <text x={W / 2 - 242} y={395} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>50k</text>
            <text x={W / 2} y={362} fontSize={44} fill={AMBER} textAnchor="middle" fontWeight={700}>→</text>
            <rect x={W / 2 + 15} y={280} width={455} height={150} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2 + 242} y={335} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>bị trừ</text>
            <text x={W / 2 + 242} y={395} fontSize={48} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>200k 💸</text>
          </g>
          <text x={W / 2} y={500} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={ma}>khách nhập ma · ngân hàng nhập ma · vận hành thức trắng 3 đêm 😵</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 620px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={620} label="KIẾP NẠN TRÙNG NHÂN QUẢ" sub="// double-spend · race condition" color={WARNING_RED} entry={0} big />
          </g>
          <g style={what}>
            <text x={W / 2} y={760} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>1 nhân quả · bị thực hiện NHIỀU LẦN</text>
            <text x={W / 2} y={812} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>1 khoản tiền · bị trừ NHIỀU LẦN</text>
            <text x={W / 2} y={862} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">→ thứ TỐI KỴ trong Tiền Tệ Đạo</text>
          </g>
          <FigFooter label="double charge · cơn ác mộng của fintech" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 IDEMPOTENCY ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(30, 16);
  const seal = useFadeUp(230, 14);
  const first = useScaleIn(380, 14);
  const again = useScaleIn(490, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="PHÁP BẢO 1 · THE SEAL" />
          <text x={W / 2} y={290} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>pháp bảo đầu tiên · Ấn Ký Nhân Quả:</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 410px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={410} label="IDEMPOTENCY KEY" sub="// ấn ký nhân quả · mỗi giao dịch 1 đạo ấn" color={JADE} entry={0} big />
          </g>
          <text x={W / 2} y={545} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={seal}>mỗi giao dịch mang 1 đạo ấn DUY NHẤT 🔑</text>
          <g style={first}>
            <rect x={W / 2 - 460} y={600} width={920} height={90} rx={12} fill="#0E2A1A" stroke={JADE} strokeWidth={2} />
            <text x={W / 2} y={655} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thấy ấn LẦN ĐẦU → xử lý ✅</text>
          </g>
          <g style={{ ...again, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={720} width={940} height={170} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={775} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thấy lần 2 · 3 · hay 1 vạn lần →</text>
            <text x={W / 2} y={835} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"nhân quả này đã được ghi nhận" 🚫</text>
          </g>
          <FigFooter label="idempotency · làm lại bao lần · kết quả chỉ 1" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 NETWORK_CUT ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const cut = useScaleIn(30, 14);
  const panic = useFadeUp(270, 14);
  const dialog = [
    { who: "🏦 ngân hàng", say: "ta đã trừ rồi", c: ACCENT_BLUE, e: 420 },
    { who: "🙍 khách hàng", say: "ta chưa nhận thông báo", c: AMBER, e: 490 },
    { who: "⚙️ hệ thống", say: "ta cũng không biết gì", c: WARNING_RED, e: 560 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="THE NETWORK CUT" />
          <g style={{ ...cut, transformOrigin: `${W / 2}px 340px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={270} width={940} height={150} rx={16} fill={BG_TERM} stroke={ORANGE} strokeWidth={3} />
            <text x={W / 2} y={325} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ngân hàng trừ tiền THÀNH CÔNG ✅</text>
            <text x={W / 2} y={385} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nhưng lúc phản hồi · mạng ĐỨT 🔌</text>
          </g>
          <text x={W / 2} y={490} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={panic}>khách thấy "thất bại" → hoảng → bấm LẠI 😰</text>
          {dialog.map((d, i) => {
            const y = 550 + i * 110;
            return (
              <g key={i} style={{ ...useScaleIn(d.e, 12), transformOrigin: `${W / 2}px ${y + 40}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 470} y={y} width={940} height={92} rx={12} fill={BG_CARD} stroke={d.c} strokeWidth={2} />
                <text x={W / 2 - 430} y={y + 56} fontSize={26} fill={d.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{d.who}:</text>
                <text x={W / 2 + 430} y={y + 56} fontSize={28} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">"{d.say}"</text>
              </g>
            );
          })}
          <FigFooter label="ai cũng đúng · nhưng không ai biết sự thật" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 TRANSACTION ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(30, 16);
  const all = useScaleIn(170, 14);
  const no = useFadeUp(320, 14);
  const law = useScaleIn(480, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="PHÁP BẢO 2 · ALL OR NOTHING" />
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 320px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={320} label="TRANSACTION" sub="// transaction chân kinh · atomicity" color={ACCENT_BLUE} entry={0} big />
          </g>
          <g style={all}>
            <rect x={W / 2 - 470} y={420} width={455} height={110} rx={14} fill="#0E2A1A" stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2 - 242} y={470} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>thành TOÀN BỘ</text>
            <text x={W / 2 - 242} y={508} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>muốn thành · cùng thành</text>
            <rect x={W / 2 + 15} y={420} width={455} height={110} rx={14} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2 + 242} y={470} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>bại TOÀN BỘ</text>
            <text x={W / 2 + 242} y={508} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>muốn bại · cùng bại</text>
          </g>
          <g style={no}>
            <rect x={W / 2 - 470} y={570} width={940} height={170} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={618} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✗ không nửa sống nửa chết</text>
            <text x={W / 2} y={660} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>✗ không trừ tiền xong nhưng quên ghi lịch sử</text>
            <text x={W / 2} y={702} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>✗ không ghi lịch sử xong nhưng chưa trừ tiền</text>
          </g>
          <g style={{ ...law, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={845} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">tất cả · hoặc không gì cả ⚡</text>
          </g>
          <FigFooter label="atomicity · 1 khối không thể chia cắt" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 CROSS ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const only = useFadeUp(30, 14);
  const chaos = useScaleIn(200, 14);
  const mismatch = useScaleIn(350, 14);
  const angry = useFadeUp(530, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="ACROSS SERVICES" />
          <g style={only}>
            <rect x={W / 2 - 460} y={270} width={920} height={100} rx={14} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
            <text x={W / 2} y={330} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Transaction chỉ bảo vệ 1 TÔNG MÔN 🏛️</text>
          </g>
          <text x={W / 2} y={430} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={chaos}>nhân quả xuyên NHIỀU tông môn → hỗn loạn 🕸️</text>
          <g style={{ ...mismatch, transformOrigin: `${W / 2}px 590px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={490} width={455} height={200} rx={16} fill="#0E2A1A" stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2 - 242} y={545} fontSize={42} textAnchor="middle">🏦</text>
            <text x={W / 2 - 242} y={595} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>đã TRỪ tiền ✅</text>
            <text x={W / 2 - 242} y={640} fontSize={23} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Ngân Hàng Đạo</text>
            <rect x={W / 2 + 15} y={490} width={455} height={200} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2 + 242} y={545} fontSize={42} textAnchor="middle">📦</text>
            <text x={W / 2 + 242} y={595} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"CHƯA thanh toán" ❌</text>
            <text x={W / 2 + 242} y={640} fontSize={23} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Đơn Hàng Đạo</text>
          </g>
          <text x={W / 2} y={780} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={angry}>khách nổi giận · đội CSKH xuất hiện tâm ma 😡</text>
          <FigFooter label="distributed transaction · cơn đau đầu kinh điển" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 OUTBOX ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(30, 16);
  const noimm = useFadeUp(170, 14);
  const ledger = useScaleIn(320, 14);
  const safe = useFadeUp(490, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="PHÁP BẢO 3 · WRITE FIRST" />
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 320px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={320} label="OUTBOX ĐẠI PHÁP" sub="// outbox pattern · ghi trước, gửi sau" color={VIOLET} entry={0} big />
          </g>
          <text x={W / 2} y={450} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={noimm}>✗ KHÔNG truyền tin ngay lập tức</text>
          <g style={{ ...ledger, transformOrigin: `${W / 2}px 580px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={500} width={940} height={160} rx={16} fill={BG_TERM} stroke={VIOLET} strokeWidth={2.5} />
            <text x={W / 2} y={555} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✓ ghi vào THIÊN CƠ LỤC trước 📖</text>
            <text x={W / 2} y={610} fontSize={28} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→ rồi mới cử người mang tin đi 📨</text>
          </g>
          <g style={{ ...safe, transformOrigin: `${W / 2}px 780px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={710} w={960} h={130} color={JADE} thick={3} />
            <text x={W / 2} y={768} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thiên kiếp giữa đường? tin vẫn còn trong sổ</text>
            <text x={W / 2} y={815} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ KHÔNG thể thất lạc · không thể biến mất ✨</text>
          </g>
          <FigFooter label="outbox · sự kiện được ghi như 1 phần giao dịch" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 SAGA ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const fail = useScaleIn(320, 14);
  const reveal = useScaleIn(430, 16);
  const rollback = useScaleIn(640, 14);
  const sects = ["🏦 Ngân Hàng", "📦 Đơn Hàng", "🚚 Kho Vận", "🎁 Điểm Thưởng", "🔔 Thông Báo"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="PHÁP BẢO 4 · ROLLBACK" />
          <text x={W / 2} y={275} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>1 giao dịch đi qua 5 tông môn:</text>
          <g>
            {sects.map((s, i) => {
              const last = i === 4;
              return (
                <g key={i} opacity={useFade(30 + i * 48, 10)}>
                  <rect x={W / 2 - 470} y={310 + i * 70} width={940} height={58} rx={10} fill={BG_CARD} stroke={last ? WARNING_RED : JADE} strokeWidth={2} />
                  <text x={W / 2 - 430} y={348 + i * 70} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{s}</text>
                  <text x={W / 2 + 430} y={348 + i * 70} fontSize={26} fill={last ? WARNING_RED : JADE} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{last ? "✗ THẤT BẠI" : "✓"}</text>
                </g>
              );
            })}
          </g>
          <text x={W / 2} y={730} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={fail}>4 thành công · 1 thất bại → thiên địa hỗn loạn ⚠️</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 810px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={810} label="SAGA LUÂN HỒI KINH" sub="// không thể cùng thành → QUAY NGƯỢC nhân quả" color={ORANGE} entry={0} big />
          </g>
          <g style={{ ...rollback, transformOrigin: `${W / 2}px 930px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={930} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">trừ rồi→TRẢ LẠI · cộng rồi→THU HỒI · tạo rồi→HỦY 🔄</text>
          </g>
          <FigFooter label="saga · bù trừ từng bước về như chưa xảy ra" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 ENDING ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const sec = useFadeUp(30, 14);
  const behind = useFadeUp(170, 14);
  const hard = useFadeUp(570, 14);
  const reveal = useScaleIn(760, 18);
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE HIGHEST REALM" />
          <text x={W / 2} y={290} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={sec}>1 lần thanh toán · với ngươi chỉ 1 GIÂY ⏱️</text>
          <g style={behind}>
            <rect x={W / 2 - 470} y={340} width={940} height={150} rx={16} fill={BG_CARD} stroke={AMBER} strokeWidth={2.5} />
            <text x={W / 2} y={395} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng phía sau là hàng TRĂM công pháp</text>
            <text x={W / 2} y={445} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>hàng NGÀN nhân quả đang được kiểm soát 🌀</text>
          </g>
          <text x={W / 2} y={580} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={hard}>thứ khó nhất chưa bao giờ là TRỪ TIỀN…</text>
          <text x={W / 2} y={630} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={hard}>mà giữa vô số retry · vô số lần mạng đứt…</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={690} width={960} height={230} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.75 + 0.25 * glow} />
            <text x={W / 2} y={750} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>hệ thống vẫn phải NHỚ rằng nhân quả này…</text>
            <text x={W / 2} y={815} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">chỉ được xảy ra ĐÚNG MỘT LẦN</text>
            <text x={W / 2} y={870} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">— cảnh giới tối cao của Tiền Tệ Đạo 🏯</text>
          </g>
          <FigFooter label="exactly-once · chén thánh của distributed systems" />
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
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <g style={ask}>
            <text x={W / 2} y={500} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Ngươi muốn nghe truyền kỳ</text>
            <text x={W / 2} y={555} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">của công pháp nào tiếp theo? 🤔</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={675} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 comment phía dưới 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={760} width={600} height={140} rx={70} fill={AMBER} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={772} width={570} height={116} rx={58} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
              <text x={W / 2} y={848} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
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

export const TienTeDao: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("tien_te_dao/voice.mp3")} />
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
