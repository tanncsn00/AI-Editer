import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./tt_beats.json";
import T from "./tt_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// ===== HUD · các loại Intern · ta/intern=cyan · đại năng/tiền bối=gold · kiếp/đạo tâm nứt=đỏ · công pháp=violet · ngộ/ẩn thế=green =====
const BG = "#0A0812";
const CARD = "#12101C";
const CARD2 = "#171426";
const RED = "#FF5470";
const A = "#2BE2FF";
const GOLD = "#FFC24B";
const GREEN = "#2EE6A8";
const VIOLET = "#A78BFF";
const TEXT = "#ECE6F5";
const SEC = "#B0A8C4";
const MUTE = "#6E6685";
const HUDC = "#5B4E78";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

const useFadeUp = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [e, e + d], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};
const usePop = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [e, e + d * 0.7, e + d], [0.8, 1.04, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};
const useFade = (e: number, d = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const HudBG: React.FC<{ tint?: string }> = ({ tint = A }) => {
  const frame = useCurrentFrame();
  const sweep = ((frame * 5) % (H + 360)) - 180;
  const vx = W / 2, vy = 760;
  const floorCols = Array.from({ length: 13 }, (_, i) => -6 + i);
  const floorRows = [0, 70, 160, 280, 440, 660, 980];
  const pulse = 0.5 + 0.5 * Math.sin(frame / 16);
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="ttGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={HUDC} strokeWidth="0.6" opacity="0.06" />
          </pattern>
          <radialGradient id="ttGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.13" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ttScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={HUDC} stopOpacity="0" />
            <stop offset="50%" stopColor={HUDC} stopOpacity="0.07" />
            <stop offset="100%" stopColor={HUDC} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="ttVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#03020A" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#ttGrid)" />
        <rect width={W} height={H} fill="url(#ttGlow)" />
        <g strokeWidth={1} opacity={0.13}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} stroke={HUDC} />
          ))}
          {floorRows.map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} stroke={HUDC} opacity={0.6 - i * 0.05} />
          ))}
        </g>
        <rect x={0} y={sweep} width={W} height={150} fill="url(#ttScan)" />
        <rect width={W} height={H} fill="url(#ttVig)" />
        <g strokeWidth={2.5} fill="none" opacity={0.7} strokeLinecap="round">
          <path d="M 44 92 L 44 48 L 88 48" stroke={A} />
          <path d={`M ${W - 44} 92 L ${W - 44} 48 L ${W - 88} 48`} stroke={GOLD} />
          <path d={`M 44 ${H - 92} L 44 ${H - 48} L 88 ${H - 48}`} stroke={A} />
          <path d={`M ${W - 44} ${H - 92} L ${W - 44} ${H - 48} L ${W - 88} ${H - 48}`} stroke={GOLD} />
        </g>
        <circle cx={W - 70} cy={H - 70} r={6} fill={RED} opacity={0.4 + 0.5 * pulse} />
      </svg>
    </AbsoluteFill>
  );
};

const GlowDefs: React.FC = () => (
  <defs>
    <filter id="ttTextGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

const KenBurns: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration * FPS], [1.0, 1.04], { extrapolateRight: "clamp" });
  return <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>{children}</div>;
};

const Header: React.FC<{ tag: string; color?: string }> = ({ tag, color = A }) => {
  const frame = useCurrentFrame();
  const a1 = useFadeUp(0, 10), a2 = useFade(5, 10);
  const blink = Math.sin(frame / 9) > -0.3 ? 1 : 0.25;
  return (
    <g>
      <g style={a1}>
        <path d="M 80 114 L 80 150 L 100 150" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
        <text x={112} y={143} fontSize={20} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">{tag}</text>
        <line x1={80} y1={166} x2={W - 80} y2={166} stroke={color} strokeWidth={1} opacity={0.22} />
      </g>
      <g opacity={a2}>
        <text x={W - 112} y={143} fontSize={18} fill={RED} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">ĐẠO TÂM</text>
        <circle cx={W - 96} cy={136} r={6} fill={RED} opacity={blink} />
      </g>
    </g>
  );
};
const Footer: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <line x1={80} y1={H - 138} x2={W - 80} y2={H - 138} stroke={HUDC} strokeWidth={1} opacity={0.2} />
    <text x={W / 2} y={H - 100} fontSize={19} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">{label}</text>
    <text x={W / 2} y={H - 58} fontSize={16} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3" opacity={0.7}>// truyền kỳ · giới IT</text>
  </g>
);
const Card: React.FC<{ x: number; y: number; w: number; h: number; c?: string; fill?: string; thick?: number; rx?: number; children?: React.ReactNode }> = ({ x, y, w, h, c = A, fill = CARD, thick = 2, rx = 10, children }) => {
  const b = 18;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} fillOpacity={0.74} stroke={c} strokeWidth={thick} strokeOpacity={0.5} />
      <g stroke={c} strokeWidth={2.5} fill="none" opacity={0.9} strokeLinecap="round">
        <path d={`M ${x} ${y + b} L ${x} ${y} L ${x + b} ${y}`} />
        <path d={`M ${x + w - b} ${y} L ${x + w} ${y} L ${x + w} ${y + b}`} />
        <path d={`M ${x} ${y + h - b} L ${x} ${y + h} L ${x + b} ${y + h}`} />
        <path d={`M ${x + w - b} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - b}`} />
      </g>
      {children}
    </g>
  );
};
const RevealTech: React.FC<{ y: number; top: string; big: string; tech: string; entry: number; c?: string; bigSize?: number; h?: number }> = ({ y, top, big, tech, entry, c = VIOLET, bigSize = 33, h = 164 }) => (
  <g style={usePop(entry, 15)}>
    <Card x={W / 2 - 470} y={y} w={940} h={h} c={c} fill={CARD2} thick={2.5} />
    <text x={W / 2} y={y + 44} fontSize={23} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{top}</text>
    <text x={W / 2} y={y + 92} fontSize={bigSize} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#ttTextGlow)">{big}</text>
    <text x={W / 2} y={y + h - 26} fontSize={25} fill={A} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">// {tech}</text>
  </g>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={A} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="TRUYỀN KỲ · GIỚI IT" />
          <g transform="translate(0, 150)">
            <text x={W / 2} y={274} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1" style={useFadeUp(8, 12)}>NHỮNG LOẠI TÂN TU SĨ</text>
            <text x={W / 2} y={318} fontSize={26} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2" style={useFadeUp(14, 12)}>TRONG CÔNG NGHỆ TÔNG</text>
            <g style={usePop(T.HOOK.traits, 14)}>
              <Card x={W / 2 - 470} y={366} w={940} h={150} c={GOLD} fill={CARD2} thick={2} />
              <text x={W / 2} y={414} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tu vi chưa cao · linh thạch chưa nhiều 💀</text>
              <text x={W / 2} y={462} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhưng <tspan fill={GOLD} fontWeight={900}>NGHIỆP LỰC</tspan> — vượt xa cảnh giới 🤣</text>
            </g>
            <g style={usePop(T.HOOK.name, 15)}>
              <Card x={W / 2 - 400} y={560} w={800} h={150} c={VIOLET} fill={CARD2} thick={3} />
              <text x={W / 2} y={610} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người đời gọi họ là:</text>
              <text x={W / 2} y={682} fontSize={78} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#ttTextGlow)" opacity={0.9 + 0.1 * glow}>INTERN</text>
            </g>
          </g>
          <Footer label="tu vi thấp · nghiệp lực cao · nhưng ai rồi cũng từng là Intern" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 CẨN THẬN ĐẠO ① ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={A} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="🔮 LOẠI ① · CẨN THẬN ĐẠO" />
        <g transform="translate(0, 120)">
          <g style={usePop(T.CANTHAN.ask, 14)}>
            <Card x={W / 2 - 470} y={258} w={940} h={120} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={304} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ngày đầu nhập môn → <tspan fill={A} fontWeight={900}>không dám động</tspan> vào thứ gì</text>
            <text x={W / 2} y={348} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>💬 sửa file cũng hỏi · commit cũng hỏi · push cũng hỏi 🤣</text>
          </g>
          <g style={usePop(T.CANTHAN.punch, 13)}>
            <Card x={W / 2 - 470} y={398} w={940} h={110} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={440} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đến lần thứ 37 → tiền bối trầm mặc rất lâu:</text>
            <text x={W / 2} y={482} fontSize={34} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"đệ… cứ làm đi." 💀</text>
          </g>
          <RevealTech y={534} top="không phải chuyện gì cũng cần trưởng lão duyệt" big="🤣 VẠN VẤN TÂM KINH" tech="Ask-Before-Everything" entry={T.CANTHAN.reveal} c={VIOLET} h={160} />
        </g>
        <Footer label="hỏi 37 lần trong 1 ngày · tiền bối cũng ngộ ra đạo mới" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S3 TỰ TIN KIẾM TU ② ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="☯️ LOẠI ② · TỰ TIN KIẾM TU" color={RED} />
        <g transform="translate(0, 120)">
          <g style={usePop(T.TUTIN.claim, 14)}>
            <Card x={W / 2 - 470} y={258} w={940} h={120} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={304} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mới vào 3 ngày → "cái này em <tspan fill={A} fontWeight={900}>LÀM LẠI được</tspan>" 💀</text>
            <text x={W / 2} y={348} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>💬 "hiểu hệ thống chưa?" → "sơ sơ" · "kiến trúc?" → "hơi rối" 🤣</text>
          </g>
          <g style={usePop(T.TUTIN.cascade, 13)}>
            <Card x={W / 2 - 470} y={398} w={940} h={110} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={440} fontSize={29} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">1 file → 3 → 12 → 1 abstraction</text>
            <text x={W / 2} y={482} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💀 2 ngày sau: không ai biết code chạy bằng gì</text>
          </g>
          <RevealTech y={534} top="tu vi càng thấp · càng thích sửa kiến trúc tiền nhân" big="🔥 CỬU CHUYỂN REFACTOR ĐẠI PHÁP" tech="Over-engineering" entry={T.TUTIN.reveal} c={VIOLET} bigSize={31} h={160} />
        </g>
        <Footer label="chưa hiểu hệ thống · đã muốn viết lại cả hệ thống" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 TÀNG KINH CÁC ③ ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="📜 LOẠI ③ · TÀNG KINH CÁC TU SĨ" color={GOLD} />
        <g transform="translate(0, 120)">
          <g style={usePop(T.TANGKINH.read, 14)}>
            <Card x={W / 2 - 470} y={258} w={940} h={120} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={304} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ngày 1 <tspan fill={GOLD} fontWeight={900}>README</tspan> · ngày 2 docs · ngày 3 architecture · ngày 4 cả repo</text>
            <text x={W / 2} y={348} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>💬 "task xong chưa?" → "gần xong rồi huynh" 🤣</text>
          </g>
          <g style={usePop(T.TANGKINH.tabs, 13)}>
            <Card x={W / 2 - 470} y={398} w={940} h={110} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={440} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💀 mở máy: <tspan fill={RED} fontWeight={900}>0 dòng code</tspan> —</text>
            <text x={W / 2} y={482} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>chỉ Notion · GitHub · Stack Overflow · 47 tab</text>
          </g>
          <RevealTech y={534} top="biết rất nhiều — mà ticket vẫn nằm ở IN PROGRESS" big="🔥 VẠN QUYỂN TÀNG KINH THUẬT" tech="Analysis Paralysis" entry={T.TANGKINH.reveal} c={VIOLET} bigSize={31} h={160} />
        </g>
        <Footer label="đọc hết cả kho tàng · nhưng task vẫn nằm im" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 BUSINESS MÙ ĐẠO ④ ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="📋 LOẠI ④ · BUSINESS MÙ ĐẠO" color={GOLD} />
        <g transform="translate(0, 120)">
          <g style={usePop(T.BUSINESS.task, 14)}>
            <Card x={W / 2 - 470} y={258} w={940} h={120} c={GREEN} fill={CARD2} thick={2} />
            <text x={W / 2} y={304} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 PM: "em sửa <tspan fill={A} fontWeight={900}>logic</tspan> này giúp anh"</text>
            <text x={W / 2} y={348} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>→ code · test · review · merge → <tspan fill={GREEN} fontWeight={900}>hoàn mỹ</tspan> ✨</text>
          </g>
          <g style={usePop(T.BUSINESS.twist, 13)}>
            <Card x={W / 2 - 470} y={398} w={940} h={120} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={442} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>💀 sáng sau, PM: "ủa sao em làm thế này?"</text>
            <text x={W / 2} y={486} fontSize={25} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"requirement ghi vậy mà anh?" → "ừ, nhưng ý anh KHÔNG phải thế"</text>
          </g>
          <RevealTech y={544} top="requirement là kinh thư — nhưng PM mới biết Thiên Ý" big="🔥 TÂM Ý ĐỌC TÂM ĐẠI PHÁP" tech="Requirement ≠ Intent" entry={T.BUSINESS.reveal} c={VIOLET} h={158} />
        </g>
        <Footer label="code đúng từng chữ requirement · vẫn sai ý PM" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 MÔI TRƯỜNG TẨU HỎA ⑤ ============
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="🌀 LOẠI ⑤ · MÔI TRƯỜNG TẨU HỎA NHẬP MA" color={RED} />
        <g transform="translate(0, 120)">
          <g style={usePop(T.MOITRUONG.pass, 14)}>
            <Card x={W / 2 - 470} y={258} w={940} h={120} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={304} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>chạy <tspan fill={GREEN} fontWeight={900}>Local → Pass</tspan> → "xong rồi anh!" ✨</text>
            <text x={W / 2} y={348} fontSize={26} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>💀 "CI?" → Fail · "Staging?" → Fail · "Test?" → Fail</text>
          </g>
          <g style={usePop(T.MOITRUONG.versions, 13)}>
            <Card x={W / 2 - 470} y={398} w={940} h={120} c={GOLD} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={442} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Local · CI · Database · Environment — <tspan fill={GOLD} fontWeight={900}>mỗi nơi 1 version</tspan></text>
            <text x={W / 2} y={486} fontSize={26} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">🔥 thứ DUY NHẤT không đổi: "máy em chạy được mà anh" 🤣</text>
          </g>
          <RevealTech y={544} top="cả tông lĩnh ngộ:" big="🔥 VẠN CẢNH QUY NHẤT ĐẠO" tech="It works on my machine" entry={T.MOITRUONG.reveal} c={VIOLET} h={158} />
        </g>
        <Footer label="mọi thứ đều khác · trừ câu 'máy em chạy được'" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S7 AI LUYỆN ĐAN SƯ ⑥ ============
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={VIOLET} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="🧪 LOẠI ⑥ · AI LUYỆN ĐAN SƯ" color={VIOLET} />
        <g transform="translate(0, 120)">
          <g style={usePop(T.AI.spell, 14)}>
            <Card x={W / 2 - 470} y={258} w={940} h={120} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={300} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>gặp task → không code · không hỏi → mở AI</text>
            <text x={W / 2} y={344} fontSize={24} fill={GOLD} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>"Act as a senior engineer…" → code → Pass ✨</text>
          </g>
          <g style={usePop(T.AI.quiz, 13)}>
            <Card x={W / 2 - 470} y={398} w={940} h={120} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={442} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💀 Senior: "đoạn này tại sao dùng?" · "xử lý edge case nào?"</text>
            <text x={W / 2} y={486} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>"dạ…" · Intern nhìn AI · AI nhìn lại Intern 🤣</text>
          </g>
          <RevealTech y={544} top="pháp bảo — không hiểu thì có ngày quay lại độ kiếp mình" big="🔥 VẠN TƯỢNG AI LUYỆN ĐAN THUẬT" tech="AI-assisted coding" entry={T.AI.reveal} c={VIOLET} bigSize={29} h={158} />
        </g>
        <Footer label="AI là pháp bảo · không phải công pháp thay thế tu luyện" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S8 ẨN THẾ ĐẠI NĂNG ⑦ ============
const S8: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GREEN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="✨ LOẠI ⑦ · ẨN THẾ ĐẠI NĂNG" color={GREEN} />
        <g transform="translate(0, 112)">
          <g style={usePop(T.ANTHE.intro, 13)}>
            <Card x={W / 2 - 470} y={224} w={940} h={92} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={262} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>loại khiến trưởng lão SỢ NHẤT — ngày đầu không ai chú ý</text>
            <text x={W / 2} y={296} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>giao thì làm · khó thì hỏi · không biết thì học</text>
          </g>
          <g style={usePop(T.ANTHE.crisis, 14)}>
            <Card x={W / 2 - 470} y={332} w={940} h={116} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={376} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💀 1 tháng sau: <tspan fill={RED} fontWeight={900}>Production đại kiếp</tspan> — module cổ không ai dám động</text>
            <text x={W / 2} y={418} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Senior không hiểu · Tech Lead không hiểu · DevOps niệm Phật 🙏</text>
          </g>
          <g style={usePop(T.ANTHE.fix, 13)}>
            <Card x={W / 2 - 470} y={464} w={940} h={72} c={GREEN} fill={CARD2} thick={2} />
            <text x={W / 2} y={508} fontSize={25} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"để em xem" → 20 phút sau BUG biến mất → "dạ… em đọc code thôi ạ"</text>
          </g>
          <RevealTech y={556} top="hắn không phải cảnh giới thấp —" big="🔥 hắn chỉ đang… ẨN TU" tech="The Silent 10x" entry={T.ANTHE.reveal} c={GREEN} h={150} />
        </g>
        <Footer label="im lặng nhất phòng · thường là người mạnh nhất phòng" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S9 KẾT · RECAP ============
const S9: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={A} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="ĐẠO LÝ · KHÔNG AI GIỐNG AI" />
        <g transform="translate(0, 130)">
          <text x={W / 2} y={280} fontSize={31} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} style={usePop(T.KET.intro, 12)}>Không phải INTERN nào cũng giống nhau 🏯</text>
          <g style={usePop(T.KET.list, 14)}>
            <Card x={W / 2 - 470} y={324} w={940} h={140} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={372} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>① sợ làm sai · ② mới vào đã đòi refactor cả tông môn</text>
            <text x={W / 2} y={414} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>③ đọc hết Tàng Kinh mà quên làm task · ④ dùng AI như pháp bảo</text>
          </g>
          <g style={usePop(T.KET.silent, 15)}>
            <Card x={W / 2 - 470} y={488} w={940} h={186} c={VIOLET} fill={CARD2} thick={3} />
            <text x={W / 2} y={540} fontSize={32} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#ttTextGlow)">🔥 và có người… IM LẶNG TU LUYỆN</text>
            <text x={W / 2} y={592} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không ai biết một Intern hôm nay,</text>
            <text x={W / 2} y={628} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>vài năm sau sẽ thành vị tiền bối nào</text>
          </g>
        </g>
        <Footer label="ai rồi cũng từng vụng về · quan trọng là còn tu tiếp hay không" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S10 SMALL CHANGE ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="💀 CẢNH GIÁC" color={RED} />
          <g transform="translate(0, 150)">
            <g style={usePop(T.SMALLCHANGE.setup, 13)}>
              <Card x={W / 2 - 470} y={300} w={940} h={92} c={A} fill={CARD2} thick={2} />
              <text x={W / 2} y={344} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nếu thấy 1 Intern mới vào mở Pull Request,</text>
              <text x={W / 2} y={380} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>tên là:</text>
            </g>
            <g style={usePop(T.SMALLCHANGE.name, 15)}>
              <Card x={W / 2 - 380} y={412} w={760} h={140} c={RED} fill={CARD2} thick={3} />
              <text x={W / 2} y={472} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>PR title:</text>
              <text x={W / 2} y={526} fontSize={62} fill={RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} filter="url(#ttTextGlow)" opacity={0.9 + 0.1 * glow}>"small change"</text>
            </g>
            <g style={usePop(T.SMALLCHANGE.punch, 14)}>
              <Card x={W / 2 - 470} y={584} w={940} h={168} c={VIOLET} fill={CARD2} thick={3} />
              <text x={W / 2} y={632} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>→ hãy LẬP TỨC đề phòng. Không gì đáng sợ hơn một câu:</text>
              <text x={W / 2} y={702} fontSize={40} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#ttTextGlow)">🤣 "em chỉ sửa một chút thôi"</text>
            </g>
          </g>
          <Footer label="'chỉ sửa một chút thôi' · câu mở đầu của mọi đại kiếp" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S11 CTA ============
const S11: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(6, 12);
  const cmt = usePop(48, 14);
  const btn = usePop(84, 14);
  const pulse = 1 + 0.035 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={A} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <g style={ask}>
            <text x={W / 2} y={636} fontSize={38} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Ngươi là loại tân tu sĩ nào? 🤣</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={802} fontSize={30} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 kể ta nghe ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 310} y={890} width={620} height={146} rx={20} fill={A} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 292} y={902} width={584} height={122} rx={14} fill={CARD2} stroke={A} strokeWidth={3} />
              <text x={W / 2} y={982} fontSize={48} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#ttTextGlow)">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1110} fontSize={28} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(120, 12)}>nghe tiếp truyền kỳ giới IT ✦</text>
          <Footer label="theo dõi · trước khi mở Pull Request 'small change' tiếp theo" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11];

const SlideFade: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const f = useCurrentFrame();
  const total = Math.round(duration * FPS);
  const o = Math.min(
    interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [total - 9, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const TanTuSi: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("tan_tu_si/voice.mp3")} />
      {beats.map((b, i) => {
        const Slide = SLIDES[i];
        return (
          <Sequence key={b.index} from={Math.round(b.start * FPS)} durationInFrames={Math.round(b.duration * FPS)}>
            <SlideFade duration={b.duration}>
              <Slide duration={b.duration} />
            </SlideFade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
