import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./cloudflare_ddos_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "09";

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
const ORANGE = "#FF9533";

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
          <pattern id="cfgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="cfgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="cfglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cfscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#cfgrid)" />
        <rect width={W} height={H} fill="url(#cfgrid2)" />
        <rect width={W} height={H} fill="url(#cfglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#cfscan)" />
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
      <rect x={cx - w / 2} y={cy - 58} width={w} height={116} rx={16} fill={BG_CARD} stroke={color} strokeWidth={3.5} />
      <text x={cx} y={cy + (sub ? -6 : 14)} fontSize={big ? 46 : 40} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{label}</text>
      {sub && <text x={cx} y={cy + 32} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const q = useScaleIn(145, 16);
  const reveal = useScaleIn(278, 16);
  const tm = useScaleIn(493, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="LEGENDS OF INFRASTRUCTURE" />
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>truyền thuyết của giới Hạ Tầng:</text>
          <g style={{ ...q, transformOrigin: `${W / 2}px 400px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 490} y={320} w={980} h={160} color={AMBER} thick={3} />
            <text x={W / 2} y={385} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>làm sao 1 tông môn ngăn nổi</text>
            <text x={W / 2} y={438} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>HÀNG CHỤC TRIỆU tu sĩ công kích? ⚔️</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 600px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={600} label="DDoS" sub="// Distributed Denial of Service" color={WARNING_RED} entry={0} big />
          </g>
          <g style={{ ...tm, transformOrigin: `${W / 2}px 780px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={760} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">trong cổ tịch Hạ Tầng Đạo · nó còn 1 tên khác:</text>
            <text x={W / 2} y={825} fontSize={50} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">THIÊN MA TRIỀU 💀</text>
          </g>
          <FigFooter label="ddos · cơn thuỷ triều của hàng triệu request" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 ATTACK ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const setup = useFadeUp(5, 14);
  const night = useScaleIn(198, 14);
  const purpose = useScaleIn(605, 14);
  const nums = ["10.000", "100.000", "1 TRIỆU"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE NIGHT IT CAME" />
          <g style={setup}>
            <rect x={W / 2 - 460} y={250} width={920} height={110} rx={14} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
            <text x={W / 2} y={300} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tiểu tông môn mới · website vài nghìn khách/ngày</text>
            <text x={W / 2} y={340} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">mọi thứ đều bình yên… 😌</text>
          </g>
          <text x={W / 2} y={440} fontSize={34} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={night}>cho đến 1 đêm · THIÊN MA giáng thế 💀</text>
          <g>
            {nums.map((n, i) => (
              <g key={i} opacity={useFade(256 + i * 65, 10)}>
                <rect x={W / 2 - 470 + i * 320} y={490} width={300} height={110} rx={14} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
                <text x={W / 2 - 320 + i * 320} y={540} fontSize={i === 2 ? 36 : 40} fill={i === 2 ? AMBER_BRIGHT : TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{n}</text>
                <text x={W / 2 - 320 + i * 320} y={580} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>yêu binh</text>
              </g>
            ))}
          </g>
          <g style={{ ...purpose, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={680} w={960} h={170} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={735} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không xem nội dung · không mua hàng · không đăng ký</text>
            <text x={W / 2} y={790} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>chỉ có 1 mục đích:</text>
            <text x={W / 2} y={832} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">làm ngươi NGỪNG THỞ 💀</text>
          </g>
          <FigFooter label="flood · không phải khách · là đại quân" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 OVERWHELM ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const res = useFadeUp(20, 14);
  const kk = useScaleIn(134, 14);
  const scale = useFadeUp(260, 14);
  const diet = useScaleIn(582, 14);
  const punch = useFadeUp(765, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="A MILLION BLADES" />
          <g style={res}>
            <text x={W / 2} y={270} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>🔥 Server nóng · CPU độ kiếp · Database run rẩy</text>
          </g>
          <g style={kk}>
            <rect x={W / 2 - 460} y={320} width={920} height={110} rx={14} fill={BG_CARD} stroke={ORANGE} strokeWidth={2} />
            <text x={W / 2} y={388} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mỗi REQUEST = 1 đạo kiếm khí ⚔️</text>
          </g>
          <g style={scale}>
            {["10 đạo · không đáng sợ", "100 đạo · không đáng sợ", "triệu đạo phủ KÍN bầu trời 😱"].map((t, i) => (
              <g key={i} opacity={useFade(280 + i * 90, 10)}>
                <rect x={W / 2 - 440} y={460 + i * 76} width={880} height={62} rx={10} fill={i === 2 ? "#2A1010" : BG_CARD} stroke={i === 2 ? WARNING_RED : TEXT_MUTE} strokeWidth={i === 2 ? 2.5 : 1.5} />
                <text x={W / 2} y={500 + i * 76} fontSize={27} fill={i === 2 ? AMBER_BRIGHT : TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={i === 2 ? 900 : 700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...diet, transformOrigin: `${W / 2}px 770px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={710} w={960} h={130} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={765} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>vô số tông môn diệt vong · không phải code/DB kém</text>
            <text x={W / 2} y={815} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" opacity={useFade(765, 12)}>mà vì kẻ địch QUÁ ĐÔNG 💀</text>
          </g>
          <FigFooter label="volumetric · sập vì số lượng, không vì lỗi" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 CLOUDFLARE ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(59, 16);
  const cdn = useFadeUp(167, 14);
  const disc = useScaleIn(387, 14);
  const pop = useScaleIn(711, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="A STRANGE NEW SECT" />
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 290px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={290} label="CLOUDFLARE ĐẠO" sub="// tưởng chỉ là 1 CDN bình thường" color={ORANGE} entry={0} big />
          </g>
          <text x={W / 2} y={420} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={cdn}>ai cũng tưởng nó chỉ là 1 tông môn CDN…</text>
          <g style={{ ...disc, transformOrigin: `${W / 2}px 540px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={460} width={940} height={170} rx={16} fill={BG_TERM} stroke={ORANGE} strokeWidth={3} />
            <text x={W / 2} y={515} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nó KHÔNG xây 1 hộ sơn đại trận…</text>
            <text x={W / 2} y={568} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>mà xây HÀNG NGÀN 🏯🏯🏯</text>
            <text x={W / 2} y={612} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>trải khắp Đông · Tây · Nam · Bắc Vực</text>
          </g>
          <g style={{ ...pop, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={690} w={960} h={150} color={AMBER} thick={3} />
            <text x={W / 2} y={745} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PoP · Point of Presence 🗼</text>
            <text x={W / 2} y={800} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">trong Hạ Tầng Đạo = TRẤN GIỚI THÁP</text>
          </g>
          <FigFooter label="pop · hàng trăm điểm hiện diện toàn cầu" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 DISTRIBUTE ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const each = useScaleIn(6, 14);
  const dist = useScaleIn(299, 14);
  const divide = ["1 triệu yêu binh → chia ra", "10 triệu → chia tiếp", "100 triệu → VẪN chia tiếp"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="DIVIDE THE ARMY" />
          <g style={{ ...each, transformOrigin: `${W / 2}px 340px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={260} width={940} height={160} rx={16} fill={BG_CARD} stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2} y={315} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mỗi Trấn Giới Tháp đều có thể:</text>
            <text x={W / 2} y={362} fontSize={28} fill={ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>tiếp nhận công kích · hấp thụ sát khí</text>
            <text x={W / 2} y={400} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>· xử lý nhân quả</text>
          </g>
          <text x={W / 2} y={490} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={dist}>Thiên Ma không còn đánh 1 nơi → bị PHÂN TÁN khắp thế giới 🌍</text>
          <g>
            {divide.map((t, i) => (
              <g key={i} opacity={useFade(409 + i * 67, 10)}>
                <rect x={W / 2 - 450} y={550 + i * 88} width={900} height={72} rx={12} fill={BG_TERM} stroke={i === 2 ? JADE : TEXT_MUTE} strokeWidth={i === 2 ? 2.5 : 1.5} />
                <text x={W / 2} y={595 + i * 88} fontSize={30} fill={i === 2 ? AMBER_BRIGHT : TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={i === 2 ? 900 : 700}>{t}</text>
              </g>
            ))}
          </g>
          <FigFooter label="distributed defense · chia để trị" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 ANYCAST ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(119, 16);
  const oneip = useScaleIn(211, 14);
  const phan = useFadeUp(308, 14);
  const punch = useScaleIn(663, 14);
  const regions = [{ t: "🇪🇺 từ Châu Âu", e: 377 }, { t: "🇺🇸 từ Mỹ", e: 489 }, { t: "🌏 từ Châu Á", e: 588 }];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="ONE IP, A THOUSAND BODIES" />
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 280px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={280} label="ANYCAST ĐẠI PHÁP" sub="// 1 địa chỉ · vô số phân thân" color={JADE} entry={0} big />
          </g>
          <g style={oneip}>
            <rect x={W / 2 - 470} y={390} width={940} height={90} rx={12} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
            <text x={W / 2} y={445} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>người ngoài chỉ thấy 1 địa chỉ <tspan fill={ACCENT_BLUE} fontWeight={900}>IP</tspan> 🪧</text>
          </g>
          <text x={W / 2} y={530} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={phan}>nhưng phía sau là VÔ SỐ phân thân trải khắp thiên hạ 👥</text>
          <g>
            {regions.map((r, i) => (
              <g key={i} opacity={useFade(r.e, 10)}>
                <rect x={W / 2 - 450} y={570 + i * 70} width={900} height={58} rx={10} fill={BG_CARD} stroke={JADE} strokeWidth={1.5} />
                <text x={W / 2 - 410} y={607 + i * 70} fontSize={27} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>yêu binh {r.t}</text>
                <text x={W / 2 + 410} y={607 + i * 70} fontSize={26} fill={JADE} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→ phân thân GẦN NHẤT</text>
              </g>
            ))}
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={820} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Thiên Ma tưởng đánh 1 người…</text>
            <text x={W / 2} y={862} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">thực ra đối đầu cả 1 ĐẠO THỐNG 🤯</text>
          </g>
          <FigFooter label="anycast · gần ngươi nhất · luôn có 1 phân thân" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 WAF ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const weak = useFadeUp(5, 14);
  const skills = ["🛡️ WAF Kết Giới", "⏱️ Rate Limit Phong Ấn", "👁️ Bot Detection Thiên Nhãn", "🧩 Challenge Đại Trận"];
  const verdicts = [{ t: "người thật", r: "→ cho qua ✅", c: JADE, e: 555 }, { t: "bot", r: "→ trấn áp ⛔", c: WARNING_RED, e: 613 }, { t: "crawler thường", r: "→ cho đi 🟢", c: TEXT_SEC, e: 658 }, { t: "Thiên Ma Triều", r: "→ TIÊU DIỆT 💀", c: WARNING_RED, e: 728 }];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="THE ALL-SEEING EYE" />
          <text x={W / 2} y={250} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={weak}>đông chưa chắc mạnh · 100tr request mà xử lý hết → vẫn chết</text>
          <g>
            {skills.map((t, i) => {
              const col = i % 2, row = Math.floor(i / 2);
              return (
                <g key={i} opacity={useFade(247 + i * 38, 10)}>
                  <rect x={W / 2 - 470 + col * 480} y={300 + row * 84} width={460} height={70} rx={12} fill={BG_CARD} stroke={VIOLET} strokeWidth={2} />
                  <text x={W / 2 - 240 + col * 480} y={343 + row * 84} fontSize={25} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
                </g>
              );
            })}
          </g>
          <text x={W / 2} y={515} fontSize={28} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={useFadeUp(439, 12)}>Thiên Nhãn mở ra · soi rõ nguyên hình:</text>
          <g>
            {verdicts.map((v, i) => (
              <g key={i} opacity={useFade(v.e, 10)}>
                <rect x={W / 2 - 450} y={555 + i * 72} width={900} height={60} rx={10} fill={BG_TERM} stroke={v.c} strokeWidth={1.5} />
                <text x={W / 2 - 410} y={593 + i * 72} fontSize={27} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{v.t}</text>
                <text x={W / 2 + 410} y={593 + i * 72} fontSize={27} fill={v.c} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{v.r}</text>
              </g>
            ))}
          </g>
          <FigFooter label="waf + bot detection · lọc sạch ngay tại cổng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 EDGE ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const scene = useFadeUp(119, 14);
  const block = useScaleIn(226, 14);
  const scary = useFadeUp(327, 14);
  const punch = useScaleIn(491, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="BLOCKED AT THE EDGE" />
          <text x={W / 2} y={320} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={scene}>hàng trăm triệu request che kín bầu trời ☁️</text>
          <g style={{ ...block, transformOrigin: `${W / 2}px 470px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={390} width={940} height={170} rx={16} fill={BG_TERM} stroke={ORANGE} strokeWidth={3} />
            <text x={W / 2} y={448} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng phần lớn CHƯA CHẠM tới server…</text>
            <text x={W / 2} y={505} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đã bị chặn NGOÀI SƠN MÔN 🚫</text>
          </g>
          <text x={W / 2} y={650} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={scary}>đây mới là điều đáng sợ nhất:</text>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 780px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={700} w={960} h={170} color={AMBER} thick={3} />
            <text x={W / 2} y={758} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>không đợi địch tiến vào rồi mới phản công…</text>
            <text x={W / 2} y={815} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">tiêu diệt ngay từ BIÊN GIỚI của thế giới ⚡</text>
          </g>
          <FigFooter label="edge defense · diệt địch trước khi tới cổng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const q = useFadeUp(27, 14);
  const secret = useFadeUp(205, 14);
  const fragile = useScaleIn(427, 14);
  const reveal = useScaleIn(577, 18);
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE HIGHEST REALM" />
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={q}>"làm sao Cloudflare chặn DDoS toàn cầu?" · trưởng lão chỉ cười</text>
          <g style={secret}>
            <text x={W / 2} y={370} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>bí mật chưa bao giờ nằm ở việc CHỐNG ĐỠ</text>
            <text x={W / 2} y={420} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà ở chỗ: đừng ĐỨNG MỘT MÌNH 🤝</text>
          </g>
          <g style={fragile}>
            <rect x={W / 2 - 470} y={470} width={455} height={90} rx={12} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2} />
            <text x={W / 2 - 242} y={525} fontSize={27} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>1 server → sập</text>
            <rect x={W / 2 + 15} y={470} width={455} height={90} rx={12} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2} />
            <text x={W / 2 + 242} y={525} fontSize={27} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>1 datacenter → sập</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={610} width={960} height={250} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.75 + 0.25 * glow} />
            <text x={W / 2} y={670} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng khi CẢ THẾ GIỚI</text>
            <text x={W / 2} y={715} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>trở thành hộ sơn đại trận của ngươi 🌍</text>
            <text x={W / 2} y={775} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">Thiên Ma Triều chỉ là 1 đợt sóng nhỏ</text>
            <text x={W / 2} y={818} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">trong biển cả 🌊 — cảnh giới tối cao Hạ Tầng Đạo 🏯</text>
          </g>
          <FigFooter label="scale beats strength · cả thế giới là khiên" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 CTA ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(5, 12);
  const cmt = useScaleIn(85, 14);
  const btn = useScaleIn(121, 14);
  const pulse = 1 + 0.03 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <g style={ask}>
            <text x={W / 2} y={500} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Ngươi muốn nghe truyền kỳ</text>
            <text x={W / 2} y={555} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">của công pháp nào tiếp theo? 🤔</text>
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

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const CloudflareDdos: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("cloudflare_ddos/voice.mp3")} />
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
