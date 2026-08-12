import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./group_chat_dong_mon_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "9";

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
          <pattern id="gcgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="gcgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="gcglow" cx="50%" cy="32%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.1" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gcscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#gcgrid)" />
        <rect width={W} height={H} fill="url(#gcgrid2)" />
        <rect width={W} height={H} fill="url(#gcglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#gcscan)" />
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

// type title card: "LOẠI THỨ N" + NAME
const TypeTitle: React.FC<{ num: string; name: string; color: string; entry?: number }> = ({ num, name, color, entry = 8 }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px 250px`, transformBox: "fill-box" }}>
      <text x={80} y={130} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ {num} / {TOTAL} ]</text>
      <line x1={80} y1={150} x2={W - 80} y2={150} stroke={AMBER} strokeWidth={1} opacity={0.5} />
      <text x={W / 2} y={228} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="4">LOẠI THỨ {num}</text>
      <rect x={W / 2 - 470} y={258} width={940} height={96} rx={16} fill={BG_CARD} stroke={color} strokeWidth={3.5} />
      <text x={W / 2} y={320} fontSize={46} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{name}</text>
    </g>
  );
};

// chat bubble (left = others, right = the one)
const Bubble: React.FC<{ y: number; sender: string; msg: string; color: string; entry: number; right?: boolean; big?: boolean; h?: number }> = ({ y, sender, msg, color, entry, right, big, h = 96 }) => {
  const a = useScaleIn(entry, 12);
  const bw = 880;
  const x = right ? W / 2 + 480 - bw : W / 2 - 480;
  const align = right ? "end" : "start";
  const tx = right ? x + bw - 36 : x + 36;
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <rect x={x} y={y} width={bw} height={h} rx={18} fill={right ? BG_TERM : BG_CARD} stroke={color} strokeWidth={right ? 3 : 2} />
      <text x={tx} y={y + 38} fontSize={21} fill={color} textAnchor={align} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{sender}</text>
      <text x={tx} y={y + (big ? 78 : 74)} fontSize={big ? 34 : 29} fill={right ? AMBER_BRIGHT : TEXT_PRI} textAnchor={align} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={right ? 900 : 700} fontStyle={right ? "italic" : "normal"}>{msg}</text>
    </g>
  );
};

// ============ S1 INTRO ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const name = useScaleIn(160, 14);
  const nots = useFadeUp(211, 14);
  const punch = useScaleIn(412, 14);
  const NOT = ["✗ không sản sinh linh thạch", "✗ không sinh ra công pháp", "✗ không giúp tăng tu vi"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <text x={80} y={130} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={useFadeUp(0, 10)}>[ 00 / {TOTAL} ]</text>
          <line x1={80} y1={150} x2={W - 80} y2={150} stroke={AMBER} strokeWidth={1} opacity={0.5} />
          <text x={W / 2} y={250} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(20, 12)}>mỗi tông môn Software Đạo · đều có 1 bí cảnh đặc biệt</text>
          <g style={{ ...name, transformOrigin: `${W / 2}px 360px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={300} width={960} height={120} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
            <text x={W / 2} y={350} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>tên của nó là…</text>
            <text x={W / 2} y={398} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>GROUP CHAT CÔNG TY 💬</text>
          </g>
          <g style={nots}>
            {NOT.map((t, i) => (
              <g key={i} opacity={useFade(220 + i * 36, 10)}>
                <rect x={W / 2 - 450} y={470 + i * 88} width={900} height={72} rx={12} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
                <text x={W / 2} y={515 + i * 88} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={740} w={960} h={140} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={795} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhưng lại là nơi khiến vô số đồng môn…</text>
            <text x={W / 2} y={845} fontSize={40} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">ĐẠO TÂM BẤT ỔN mỗi ngày 🤣</text>
          </g>
          <FigFooter label="group chat · bí cảnh quan sát nhân tính" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 TYPE1 Ẩn Thế Đại Năng ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const silent = useScaleIn(101, 14);
  const boom = useScaleIn(239, 14);
  const gone = useScaleIn(409, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="①" name="ẨN THẾ ĐẠI NĂNG" color={ACCENT_BLUE} />
          <g style={silent}>
            <rect x={W / 2 - 470} y={420} width={460} height={130} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2 - 240} y={470} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>3 tháng</text>
            <text x={W / 2 - 240} y={515} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>không nói 1 câu</text>
            <rect x={W / 2 + 10} y={420} width={460} height={130} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2 + 240} y={470} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>6 tháng</text>
            <text x={W / 2 + 240} y={515} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>không thả 1 icon</text>
          </g>
          <g style={boom}>
            <rect x={W / 2 - 480} y={590} width={960} height={90} rx={14} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={648} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>💥 production NỔ TUNG → hắn đột nhiên hiện ra</text>
          </g>
          <Bubble y={710} sender="🥷 Ẩn Thế Đại Năng" msg="Rollback đi." color={ACCENT_BLUE} entry={353} right big />
          <g style={gone}>
            <text x={W / 2} y={870} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">…rồi biến mất thêm nửa năm 🤣</text>
          </g>
          <FigFooter label="the ghost · chỉ hiện hình khi prod cháy" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 TYPE2 Phản Hồi Tông Sư ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const moral = useScaleIn(154, 14);
  const REPLIES = ["OK", "Đã nhận", "👍", "👌"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="②" name="PHẢN HỒI TÔNG SƯ" color={JADE} />
          <text x={W / 2} y={440} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(40, 12)}>mặc kệ ngươi viết gì · hắn luôn trả lời:</text>
          <g>
            {REPLIES.map((t, i) => (
              <g key={i} style={useScaleIn(61 + i * 22, 12)}>
                <rect x={W / 2 + 480 - 360} y={490 + i * 84} width={360} height={68} rx={18} fill={BG_TERM} stroke={JADE} strokeWidth={2.5} />
                <text x={W / 2 + 480 - 180} y={534 + i * 84} fontSize={32} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...moral, transformOrigin: `${W / 2}px 870px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={810} w={960} h={120} color={AMBER} thick={3} />
            <text x={W / 2} y={862} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>tu vi cả đời…</text>
            <text x={W / 2} y={905} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đều luyện trên EMOJI ĐẠO 🤣</text>
          </g>
          <FigFooter label="ack master · tu luyện thượng thừa môn emoji" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 TYPE3 Triệu Hồi Sư ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const drag = useScaleIn(297, 14);
  const TAGS = ["@Backend", "@Frontend", "@DevOps", "@QA", "@PM"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="③" name="TRIỆU HỒI SƯ" color={WARNING_RED} />
          <text x={W / 2} y={440} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(40, 12)}>không bao giờ tự giải quyết · gặp gì cũng triệu hồi:</text>
          <g>
            {TAGS.map((t, i) => (
              <g key={i} style={useScaleIn(160 + i * 26, 11)}>
                <rect x={W / 2 - 430} y={490 + i * 70} width={860} height={58} rx={12} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2} />
                <text x={W / 2} y={530 + i * 70} fontSize={30} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...drag, transformOrigin: `${W / 2}px 905px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={850} width={960} height={110} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={3.5} />
            <text x={W / 2} y={900} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>3 phút sau…</text>
            <text x={W / 2} y={940} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">nửa tông môn bị kéo vào nhân quả 💀</text>
          </g>
          <FigFooter label="the summoner · @everyone là vũ khí" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 TYPE4 Khổ Tu Sĩ ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const scroll = useScaleIn(203, 14);
  const more = useScaleIn(301, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="④" name="KHỔ TU SĨ" color={VIOLET} />
          <text x={W / 2} y={445} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(84, 12)}>mỗi tin nhắn · dài hơn cả tài liệu đặc tả 📜</text>
          <g style={{ ...scroll, transformOrigin: `${W / 2}px 590px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={500} width={960} height={180} rx={16} fill={BG_TERM} stroke={VIOLET} strokeWidth={3} />
            <text x={W / 2} y={555} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>1 câu hỏi đơn giản →</text>
            <text x={W / 2} y={615} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>hắn trả lời bằng</text>
            <text x={W / 2} y={660} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">1 CUỐN KINH THƯ 📖</text>
          </g>
          <g style={{ ...more, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={730} w={960} h={140} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={788} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người hỏi đọc xong…</text>
            <text x={W / 2} y={835} fontSize={36} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">phát sinh thêm 3 câu hỏi MỚI 🤣</text>
          </g>
          <FigFooter label="the novelist · TL;DR là điều xa xỉ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 TYPE5 Đồng Môn Đang Gõ ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const typing = useScaleIn(84, 14);
  const waits = useFadeUp(170, 14);
  const ok = useScaleIn(236, 14);
  const dots = Math.floor((frame / 10) % 4);
  const WAIT = ["⏱️ 10 giây…", "⏱️ 30 giây…", "⏱️ 1 phút…"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="⑤" name="ĐỒNG MÔN ĐANG GÕ…" color={AMBER} />
          <g style={{ ...typing, transformOrigin: `${W / 2}px 460px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 320} y={420} width={640} height={84} rx={42} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={472} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đang nhập{".".repeat(dots)}</text>
          </g>
          <text x={W / 2} y={560} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(120, 12)}>toàn tông môn nín thở chờ đợi…</text>
          <g style={waits}>
            {WAIT.map((t, i) => (
              <g key={i} opacity={useFade(180 + i * 30, 10)}>
                <rect x={W / 2 - 300} y={600 + i * 76} width={600} height={62} rx={12} fill={BG_TERM} stroke={AMBER} strokeWidth={1.5} />
                <text x={W / 2} y={640 + i * 76} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <Bubble y={850} sender="⌨️ Đồng Môn Đang Gõ" msg="Ok." color={WARNING_RED} entry={236} right big />
          <FigFooter label="the typist · 1 phút gõ = 3 ký tự" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 TYPE6 Chuyên Gia Mất Tích ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const offwork = useScaleIn(302, 14);
  const NO = ["📵 tag → không trả lời", "✉️ nhắn riêng → không trả lời", "📞 gọi điện → không bắt máy"];
  const ENTRY = [160, 185, 233];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="⑥" name="CHUYÊN GIA MẤT TÍCH" color={ORANGE} />
          <text x={W / 2} y={440} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(40, 12)}>lúc cần · không ai tìm thấy:</text>
          <g>
            {NO.map((t, i) => (
              <g key={i} style={useScaleIn(ENTRY[i], 12)}>
                <rect x={W / 2 - 460} y={490 + i * 86} width={920} height={70} rx={12} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
                <text x={W / 2} y={534 + i * 86} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...offwork, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={770} width={960} height={150} rx={16} fill="#2A1010" stroke={ORANGE} strokeWidth={3.5} />
            <text x={W / 2} y={822} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhưng vừa tới GIỜ TAN LÀM 🏃 hắn xuất hiện:</text>
            <text x={W / 2} y={875} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Xin lỗi mọi người, nãy họp" 🤣</text>
          </g>
          <FigFooter label="the missing · online lúc 17h59" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 TYPE7 Thiên Cơ Trưởng Lão ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const ahead = useScaleIn(376, 14);
  const KNOW = ["🚪 ai sắp nghỉ việc → biết", "💰 ai sắp tăng lương → biết", "🔥 ai vừa bị sếp gọi lên → biết"];
  const ENTRY = [139, 181, 248];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="⑦" name="THIÊN CƠ TRƯỞNG LÃO" color={VIOLET} />
          <text x={W / 2} y={440} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(40, 12)}>tin tức gì trong tông môn · cũng biết 🔮</text>
          <g>
            {KNOW.map((t, i) => (
              <g key={i} style={useScaleIn(ENTRY[i], 12)}>
                <rect x={W / 2 - 470} y={500 + i * 88} width={940} height={72} rx={12} fill={BG_CARD} stroke={VIOLET} strokeWidth={2} />
                <text x={W / 2} y={545 + i * 88} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...ahead, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={790} w={960} h={120} color={AMBER} thick={3} />
            <text x={W / 2} y={845} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>có những lúc…</text>
            <text x={W / 2} y={888} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">biết TRƯỚC cả người trong cuộc 💀</text>
          </g>
          <FigFooter label="the oracle · radar 5G của công ty" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 TYPE8 Đạo Tổ Seen Tin Nhắn ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const online = useScaleIn(208, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="⑧" name="ĐẠO TỔ SEEN TIN NHẮN" color={WARNING_RED} />
          <Bubble y={430} sender="🙋 ngươi" msg="nhắn lúc 9:00" color={ACCENT_BLUE} entry={40} h={92} />
          <g style={useScaleIn(162, 12)}>
            <text x={W / 2} y={580} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>✓✓ hắn xem lúc <tspan fill={WARNING_RED} fontWeight={900}>9:01</tspan> · rồi… im lặng</text>
          </g>
          <g style={{ ...online, transformOrigin: `${W / 2}px 700px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={630} width={960} height={130} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={685} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🟢 online CẢ NGÀY</text>
            <text x={W / 2} y={730} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">nhưng tuyệt đối KHÔNG trả lời</text>
          </g>
          <Bubble y={800} sender="👻 Đạo Tổ Seen · (hôm sau)" msg="À giờ mới thấy." color={WARNING_RED} entry={348} right big />
          <FigFooter label="the seen-zoner · đã xem · hết" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 TYPE9 Người Kết Thúc Cuộc Trò Chuyện ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const chaos = useScaleIn(285, 14);
  const silence = useScaleIn(468, 16);
  const ARG = [
    { who: "💾 Backend", c: ACCENT_BLUE },
    { who: "🎨 Frontend", c: JADE },
    { who: "🔍 QA", c: VIOLET },
    { who: "📋 PM", c: AMBER },
  ];
  const ENTRY = [153, 180, 207, 234];
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="⑨" name="NGƯỜI KẾT THÚC CUỘC TRÒ CHUYỆN" color={JADE} entry={10} />
          <text x={W / 2} y={430} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(54, 12)}>mọi người đang tranh luận · mỗi người 1 ý:</text>
          <g>
            {ARG.map((r, i) => (
              <g key={i} style={useScaleIn(ENTRY[i], 11)}>
                <rect x={W / 2 - 460} y={470 + i * 66} width={920} height={54} rx={10} fill={BG_CARD} stroke={r.c} strokeWidth={1.5} />
                <text x={W / 2 - 420} y={505 + i * 66} fontSize={24} fill={r.c} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{r.who}</text>
                <text x={W / 2 + 420} y={505 + i * 66} fontSize={26} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>…một ý</text>
              </g>
            ))}
          </g>
          <g style={chaos}>
            <text x={W / 2} y={790} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">⚔️ khắp nơi kiếm khí tung hoành · đạo tâm chấn động</text>
          </g>
          <Bubble y={830} sender="🧘 Người Kết Thúc" msg="Mai họp nhé." color={JADE} entry={432} right big />
          <g style={{ ...silence }}>
            <text x={W / 2} y={1000} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" opacity={0.85 + 0.15 * glow}>→ toàn bộ tam giới LẬP TỨC yên tĩnh 🤣</text>
          </g>
          <FigFooter label="the closer · 1 câu · dập tắt mọi war" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S11 OUTRO ============
const S11: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const not = useScaleIn(132, 14);
  const truth = useScaleIn(208, 16);
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <text x={W / 2} y={360} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(20, 12)}>các đại năng Software Đạo đều hiểu…</text>
          <g style={{ ...not, transformOrigin: `${W / 2}px 470px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={420} width={960} height={100} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={483} fontSize={34} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>group chat ✗ KHÔNG phải công cụ giao tiếp</text>
          </g>
          <g style={{ ...truth, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={580} width={960} height={160} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={645} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà là nơi…</text>
            <text x={W / 2} y={705} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">QUAN SÁT NHÂN TÍNH 🤣</text>
          </g>
          <FigFooter label="group chat · tấm gương soi nhân gian" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S12 CTA ============
const S12: React.FC<{ duration: number }> = ({ duration }) => {
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
            <text x={W / 2} y={490} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Tông môn của ngươi</text>
            <text x={W / 2} y={545} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">có loại đồng môn nào? 🤔</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 650px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={665} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 tag hắn vào comment 👇</text>
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

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];

export const GroupChatDongMon: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("group_chat_dong_mon/voice.mp3")} />
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
