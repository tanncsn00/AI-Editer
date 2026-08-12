import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./todo_thuong_co_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "07";

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
          <pattern id="tdgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="tdgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="tdglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tdscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#tdgrid)" />
        <rect width={W} height={H} fill="url(#tdgrid2)" />
        <rect width={W} height={H} fill="url(#tdglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#tdscan)" />
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

const Badge: React.FC<{ dot: string; text: string; color: string }> = ({ dot, text, color }) => {
  const a = useScaleIn(0, 12);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px 250px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 470} y={212} width={940} height={78} rx={39} fill={BG_TERM} stroke={color} strokeWidth={2.5} />
      <text x={W / 2} y={262} fontSize={27} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{dot}  {text}</text>
    </g>
  );
};

const Punch: React.FC<{ y: number; lines: string[]; color?: string; style?: React.CSSProperties }> = ({ y, lines, color = AMBER, style }) => (
  <g style={style}>
    <TechBox x={W / 2 - 480} y={y} w={960} h={lines.length > 1 ? 200 : 130} color={color} thick={3} />
    {lines.map((l, i) => (
      <text key={i} x={W / 2} y={y + (lines.length > 1 ? 70 : 80) + i * 56} fontSize={i === lines.length - 1 ? 34 : 30}
        fill={i === lines.length - 1 ? AMBER_BRIGHT : TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif"
        fontWeight={i === lines.length - 1 ? 900 : 700} fontStyle={i === lines.length - 1 ? "italic" : "normal"}>{l}</text>
    ))}
  </g>
);

// code comment box
const CodeLine: React.FC<{ y: number; text: string; color: string; style?: React.CSSProperties }> = ({ y, text, color, style }) => (
  <g style={style}>
    <rect x={W / 2 - 460} y={y} width={920} height={88} rx={12} fill={BG_TERM} stroke={color} strokeWidth={2} />
    <text x={W / 2 - 425} y={y + 54} fontSize={28} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{text}</text>
  </g>
);

// ============ S1 INTRO ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const seal = useFadeUp(40, 14);
  const reveal = useScaleIn(180, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="ANCIENT TODOs" />
          <text x={W / 2} y={350} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>trong Software Đạo có 1 loại phong ấn đặc biệt:</text>
          <g style={seal}>
            {["🔇 không chạy", "✅ không lỗi", "🛡️ không ảnh hưởng production"].map((t, i) => (
              <g key={i} opacity={useFade(60 + i * 35, 10)}>
                <rect x={W / 2 - 400} y={400 + i * 80} width={800} height={64} rx={12} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
                <text x={W / 2} y={442 + i * 80} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={680} w={960} h={170} color={AMBER} thick={3} />
            <text x={W / 2} y={740} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>→ cho nên KHÔNG AI động tới</text>
            <text x={W / 2} y={808} fontSize={60} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={900} letterSpacing="3">// TODO</text>
          </g>
          <FigFooter label="7 loại TODO · ai cũng từng để lại 1 dòng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 SỬA SAU ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const cmt = useFadeUp(40, 14);
  const think = useScaleIn(150, 14);
  const punch = useScaleIn(320, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="'FIX IT LATER'" />
          <Badge dot="⚪" text="TODO 'SỬA SAU'" color={TEXT_PRI} />
          <CodeLine y={340} text="// TODO: sửa lại cho chuẩn" color={JADE} style={cmt} />
          <g style={{ ...think, transformOrigin: `${W / 2}px 500px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={490} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">người viết nghĩ:</text>
            <text x={W / 2} y={540} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>“chiều nay sẽ sửa” ☕</text>
          </g>
          <Punch y={650} color={WARNING_RED} style={{ ...punch, transformOrigin: `${W / 2}px 750px`, transformBox: "fill-box" }}
            lines={["3 NĂM sau · dòng TODO vẫn còn đó", "người viết đã phi thăng · review đã chuyển thế", "nhưng TODO vẫn đang… đợi 🤣"]} />
          <FigFooter label="'later' = đơn vị thời gian không tồn tại" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 REFACTOR ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const old = useFadeUp(40, 14);
  const nod = useScaleIn(180, 14);
  const punch = useScaleIn(320, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="THE OLDEST ONE" />
          <Badge dot="🟢" text="TODO 'REFACTOR'" color={JADE} />
          <g style={old}>
            <rect x={W / 2 - 460} y={340} width={920} height={120} rx={14} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={410} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>tuổi thọ CAO NHẤT tam giới 🐢</text>
          </g>
          <g style={{ ...nod, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={530} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">mỗi đời trưởng lão đọc thấy nó → gật đầu:</text>
            <text x={W / 2} y={585} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>“đúng là nên refactor.” 🤝</text>
          </g>
          <Punch y={700} color={WARNING_RED} style={{ ...punch, transformOrigin: `${W / 2}px 765px`, transformBox: "fill-box" }}
            lines={["sau đó…", "lại để cho ĐỜI SAU 🤣"]} />
          <FigFooter label="refactor = lời hứa truyền từ đời này sang đời khác" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 TỐI ƯU ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const why = useFadeUp(40, 14);
  const cultivate = useScaleIn(220, 14);
  const punch = useScaleIn(340, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="'IF IT AIN'T BROKE'" />
          <Badge dot="🔵" text="TODO 'TỐI ƯU'" color={ACCENT_BLUE} />
          <g style={why}>
            {["✅ code chạy được", "😊 khách hàng vui vẻ", "📈 doanh thu tăng trưởng"].map((t, i) => (
              <g key={i} opacity={useFade(60 + i * 35, 10)}>
                <rect x={W / 2 - 420} y={340 + i * 80} width={840} height={64} rx={12} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
                <text x={W / 2} y={382 + i * 80} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={645} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={cultivate}>→ không ai muốn tối ưu · TODO hấp thụ linh khí 🌀</text>
          <Punch y={710} color={AMBER} style={{ ...punch, transformOrigin: `${W / 2}px 775px`, transformBox: "fill-box" }}
            lines={["tu luyện qua nhiều kỷ nguyên…", "cuối cùng thành 1 PHẦN của kiến trúc 🤣"]} />
          <FigFooter label="optimize = việc của ngày mai (mãi mãi)" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 KHÔNG AI DÁM XÓA ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const newbie = useFadeUp(40, 14);
  const summon = useScaleIn(280, 14);
  const punch = useScaleIn(450, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="DON'T DELETE IT" />
          <Badge dot="🟣" text="TODO KHÔNG AI DÁM XÓA" color={VIOLET} />
          <g style={newbie}>
            <rect x={W / 2 - 460} y={335} width={920} height={170} rx={14} fill={BG_CARD} stroke={VIOLET} strokeWidth={2.5} />
            <text x={W / 2} y={385} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>tân binh thấy TODO 8 năm · cười nhạt:</text>
            <text x={W / 2} y={432} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>“Sao chưa ai làm?” 😏</text>
            <text x={W / 2} y={478} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→ rồi thuận tay XÓA đi 🗑️</text>
          </g>
          <g style={{ ...summon, transformOrigin: `${W / 2}px 600px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={560} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// 1 canh giờ sau…</text>
            <text x={W / 2} y={612} fontSize={30} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>3 Tech Lead · 2 PM · 1 Kiến Trúc Sư 🧙🧙🧙</text>
            <text x={W / 2} y={655} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">đồng thời xuất hiện…</text>
          </g>
          <Punch y={720} color={WARNING_RED} style={{ ...punch, transformOrigin: `${W / 2}px 785px`, transformBox: "fill-box" }}
            lines={["“NGƯƠI VỪA XÓA CÁI GÌ?” 🤣"]} />
          <FigFooter label="chesterton's fence · đừng xoá thứ chưa hiểu" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 KHÔNG AI HIỂU ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const old = useScaleIn(40, 14);
  const fear = useFadeUp(180, 14);
  const punch = useScaleIn(300, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="NOBODY KNOWS WHY" />
          <Badge dot="🟠" text="TODO KHÔNG CÒN AI HIỂU" color={ORANGE} />
          <g style={{ ...old, transformOrigin: `${W / 2}px 410px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={340} width={920} height={140} rx={16} fill={BG_TERM} stroke={ORANGE} strokeWidth={3} />
            <text x={W / 2} y={395} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>một số TODO cổ xưa tới mức…</text>
            <text x={W / 2} y={445} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>không ai còn nhớ nó để LÀM GÌ 🤷</text>
          </g>
          <g style={fear}>
            <rect x={W / 2 - 460} y={520} width={920} height={130} rx={14} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2} />
            <text x={W / 2} y={572} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✗ không ai dám sửa</text>
            <text x={W / 2} y={618} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✗ cũng không ai dám xóa</text>
          </g>
          <Punch y={710} color={AMBER} style={{ ...punch, transformOrigin: `${W / 2}px 775px`, transformBox: "fill-box" }}
            lines={["bởi không ai muốn trở thành", "người gánh NHÂN QUẢ 🤣"]} />
          <FigFooter label="ai đụng · người đó chịu trách nhiệm" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 THƯỢNG CỔ ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const dates = useScaleIn(40, 14);
  const intact = useFadeUp(220, 14);
  const punch = useScaleIn(320, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="9 YEARS OLD" />
          <Badge dot="🔴" text="TODO THƯỢNG CỔ" color={WARNING_RED} />
          <g style={{ ...dates, transformOrigin: `${W / 2}px 460px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={340} width={455} height={240} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2 - 242} y={400} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>ngày tạo</text>
            <text x={W / 2 - 242} y={475} fontSize={70} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>2017</text>
            <rect x={W / 2 + 15} y={340} width={455} height={240} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2 + 242} y={400} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>ngày hiện tại</text>
            <text x={W / 2 + 242} y={475} fontSize={70} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>2026</text>
            <text x={W / 2} y={555} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>= 9 NĂM · vẫn nguyên vẹn 🗿</text>
          </g>
          <Punch y={680} color={AMBER} style={{ ...punch, transformOrigin: `${W / 2}px 745px`, transformBox: "fill-box" }}
            lines={["thậm chí nó còn GIÀ HƠN", "một nửa đồng môn trong dự án 🤣"]} />
          <FigFooter label="todo này có thâm niên hơn cả bạn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 LOẠI CUỐI ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const cmt = useFadeUp(40, 14);
  const blame = useScaleIn(220, 14);
  const reveal = useScaleIn(420, 16);
  const punch = useScaleIn(640, 14);
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="THE FINAL ONE" />
          <Badge dot="🏴" text="LOẠI CUỐI · ĐÁNG SỢ NHẤT" color={AMBER} />
          <g style={cmt}>
            <rect x={W / 2 - 460} y={335} width={920} height={130} rx={12} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={2} />
            <text x={W / 2 - 420} y={385} fontSize={26} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>// TODO: tạm thời làm vậy đã</text>
            <text x={W / 2 - 420} y={428} fontSize={26} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>//       sẽ sửa sau</text>
          </g>
          <g style={{ ...blame, transformOrigin: `${W / 2}px 540px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={555} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>rồi ngươi mở <tspan fill={ACCENT_BLUE} fontWeight={900}>Git Blame</tspan>… 🔍</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={600} width={940} height={140} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={4} opacity={0.8 + 0.2 * glow} />
            <text x={W / 2} y={655} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người viết dòng đó chính là…</text>
            <text x={W / 2} y={712} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">NGƯƠI · của 7 NĂM trước 💥</text>
          </g>
          <Punch y={780} color={WARNING_RED} style={{ ...punch, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}
            lines={["giờ ngươi đã hiểu vì sao tiền bối không sửa:", "họ cũng từng nghĩ 'ngày mai mình quay lại' 🤣"]} />
          <FigFooter label="git blame · và kẻ thù chính là bạn (quá khứ)" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 CLOSING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const not = useFadeUp(30, 14);
  const reveal = useScaleIn(150, 18);
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="ENLIGHTENMENT" />
          <text x={W / 2} y={400} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={not}>không phải mọi TODO đều trở thành hiện thực…</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={500} width={960} height={320} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.75 + 0.25 * glow} />
            <text x={W / 2} y={580} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng mọi TODO</text>
            <text x={W / 2} y={628} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>còn tồn tại tới ngày nay…</text>
            <text x={W / 2} y={715} fontSize={52} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đều đã TU THÀNH</text>
            <text x={W / 2} y={775} fontSize={52} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">CHÍNH QUẢ 🏯</text>
          </g>
          <FigFooter label="todo bất tử · huyền thoại sống của mọi codebase" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 CTA ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const head = useFadeUp(6, 12);
  const btn = useScaleIn(36, 14);
  const pulse = 1 + 0.03 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <text x={W / 2} y={620} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={head}>Giới công nghệ còn vô số…</text>
          <text x={W / 2} y={685} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={head}>truyền thuyết có thật đang chờ kể 🏯</text>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={810} width={600} height={140} rx={70} fill={AMBER} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={822} width={570} height={116} rx={58} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
              <text x={W / 2} y={898} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1030} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(60, 12)}>để gặp thêm truyền thuyết giới IT 👇</text>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const TodoThuongCo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("todo_thuong_co/voice.mp3")} />
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
