import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./sinh_vat_than_bi_beats.json";

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
          <pattern id="svgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="svgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="svglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="svscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#svgrid)" />
        <rect width={W} height={H} fill="url(#svgrid2)" />
        <rect width={W} height={H} fill="url(#svglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#svscan)" />
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

// punchline box (the 🤣 payoff)
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

// ============ S1 INTRO ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const roles = useFadeUp(60, 14);
  const reveal = useScaleIn(180, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="CRYPTIDS OF TECH" />
          <text x={W / 2} y={340} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>trong mỗi tông môn công nghệ…</text>
          <g style={roles}>
            <text x={W / 2} y={420} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>ngoài Dev · QA · PM · DevOps</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={520} w={960} h={300} color={VIOLET} thick={3} />
            <text x={W / 2} y={595} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>còn tồn tại những…</text>
            <text x={W / 2} y={665} fontSize={52} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">SINH VẬT THẦN BÍ 👻</text>
            <text x={W / 2} y={730} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không ai biết họ tu công pháp gì…</text>
            <text x={W / 2} y={775} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng ai cũng nghe qua truyền thuyết 📖</text>
          </g>
          <FigFooter label="7 sinh vật · ai cũng từng gặp 1 vài" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 THÁI THƯỢNG TRƯỞNG LÃO ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const gone = useFadeUp(40, 14);
  const summon = useScaleIn(260, 14);
  const punch = useScaleIn(520, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE RETIRED ELDER" />
          <Badge dot="⚪" text="THÁI THƯỢNG TRƯỞNG LÃO" color={TEXT_PRI} />
          <g style={gone}>
            <text x={W / 2} y={345} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">đã rời tông môn từ 3 năm trước:</text>
            {["✗ không còn trong danh sách đệ tử", "✗ không còn trong Slack", "✗ không còn trong Jira"].map((t, i) => (
              <g key={i} opacity={useFade(80 + i * 30, 10)}>
                <rect x={W / 2 - 430} y={380 + i * 76} width={860} height={62} rx={10} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
                <text x={W / 2} y={420 + i * 76} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...summon, transformOrigin: `${W / 2}px 680px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={620} width={920} height={120} rx={14} fill={BG_TERM} stroke={AMBER} strokeWidth={2.5} />
            <text x={W / 2} y={668} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>nhưng mỗi khi production thiên kiếp:</text>
            <text x={W / 2} y={712} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">“hay thỉnh ngài ấy xuất quan…” 🙏</text>
          </g>
          <Punch y={780} color={WARNING_RED} style={{ ...punch, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}
            lines={["ngài vẫn nhớ HẾT nhân quả hệ thống", "còn ngươi — bảo trì mỗi ngày —", "đã quên tuần trước mình sửa gì 🤣"]} />
          <FigFooter label="người nghỉ rồi · vẫn là single point of knowledge" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 BÁCH HIỂU CHÂN NHÂN ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const know = useFadeUp(40, 14);
  const live = useScaleIn(240, 14);
  const punch = useScaleIn(440, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="KNOWS EVERYTHING" />
          <Badge dot="🟢" text="BÁCH HIỂU CHÂN NHÂN" color={JADE} />
          <g style={know}>
            {["🖥️ Frontend hỏi → ngài biết", "⚙️ Backend hỏi → ngài biết", "🔧 DevOps hỏi → ngài cũng biết"].map((t, i) => (
              <g key={i} opacity={useFade(60 + i * 40, 10)}>
                <rect x={W / 2 - 440} y={345 + i * 86} width={880} height={70} rx={12} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
                <text x={W / 2} y={390 + i * 86} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...live, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={655} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">không ai biết ngài thuộc phòng nào…</text>
            <text x={W / 2} y={700} fontSize={32} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nhưng cả tông SỐNG nhờ tri thức của ngài</text>
          </g>
          <Punch y={760} color={WARNING_RED} style={{ ...punch, transformOrigin: `${W / 2}px 860px`, transformBox: "fill-box" }}
            lines={["ngày ngài nghỉ → cả tông MẠT PHÁP", "trưởng lão họp khẩn truy 1 chân tướng:", "“vì sao hệ thống này còn sống tới giờ?” 🤣"]} />
          <FigFooter label="bus factor = 1 · cả team dựa vào 1 người" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 THIÊN NHÃN ĐẠO NHÂN ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const times = useFadeUp(40, 14);
  const slack = useScaleIn(220, 14);
  const punch = useScaleIn(360, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="ALWAYS ONLINE" />
          <Badge dot="🔵" text="THIÊN NHÃN ĐẠO NHÂN" color={ACCENT_BLUE} />
          <g style={times}>
            {["🕒 3 giờ sáng", "🕓 4 giờ sáng", "📅 Chủ nhật"].map((t, i) => (
              <g key={i} opacity={useFade(60 + i * 40, 10)}>
                <rect x={W / 2 - 440} y={345 + i * 86} width={880} height={70} rx={12} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
                <text x={W / 2 - 200} y={390 + i * 86} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
                <text x={W / 2 + 250} y={390 + i * 86} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🟢 online</text>
              </g>
            ))}
          </g>
          <g style={{ ...slack, transformOrigin: `${W / 2}px 680px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={665} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">không ai biết ngài ngủ lúc nào…</text>
            <text x={W / 2} y={712} fontSize={32} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Slack vĩnh viễn sáng như nhật nguyệt 🟢</text>
          </g>
          <Punch y={770} color={AMBER} style={{ ...punch, transformOrigin: `${W / 2}px 835px`, transformBox: "fill-box" }}
            lines={["có lời đồn rằng:", "ngài đã DUNG HỢP nguyên thần với công ty 🤣"]} />
          <FigFooter label="green dot · không bao giờ tắt" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 THỦ MỘ NHÂN ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const tomb = useFadeUp(40, 14);
  const act = useScaleIn(300, 14);
  const restart = useScaleIn(470, 14);
  const punch = useScaleIn(640, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="THE TOMB KEEPER" />
          <Badge dot="🟣" text="THỦ MỘ NHÂN" color={VIOLET} />
          <g style={tomb}>
            <text x={W / 2} y={340} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">mỗi tông có 1 bí cảnh thượng cổ:</text>
            <rect x={W / 2 - 460} y={370} width={920} height={110} rx={14} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2} />
            <text x={W / 2} y={415} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✗ no document · ✗ no test · ✗ no ai hiểu</text>
            <text x={W / 2} y={458} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>…nhưng luôn có ĐÚNG 1 người hiểu</text>
          </g>
          <g style={act}>
            <rect x={W / 2 - 460} y={510} width={920} height={120} rx={14} fill={BG_TERM} stroke={VIOLET} strokeWidth={2.5} />
            <text x={W / 2} y={558} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>hệ thống dị tượng → ngài bước ra</text>
            <text x={W / 2} y={602} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhìn log 5 giây · quan sát 3 hơi thở…</text>
          </g>
          <g style={{ ...restart, transformOrigin: `${W / 2}px 700px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={715} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ “Restart đi.” 🔄</text>
          </g>
          <Punch y={770} color={AMBER} style={{ ...punch, transformOrigin: `${W / 2}px 835px`, transformBox: "fill-box" }}
            lines={["thiên kiếp tiêu tán · nhân quả lắng xuống", "đồng môn nhìn ngài như ĐẠO TỔ chuyển thế 🤣"]} />
          <FigFooter label="'have you tried turning it off and on again?'" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 LƯU QUANG CHÂN NHÂN ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const fast = useFadeUp(40, 14);
  const vanish = useScaleIn(260, 14);
  const punch = useScaleIn(440, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="'5 MINUTES'" />
          <Badge dot="🟠" text="LƯU QUANG CHÂN NHÂN" color={ORANGE} />
          <text x={W / 2} y={345} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>sinh vật NHANH NHẤT Software Đạo ⚡</text>
          <g style={fast}>
            <rect x={W / 2 - 460} y={390} width={920} height={150} rx={16} fill={BG_TERM} stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2} y={445} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>“Để ta xem một chút.”</text>
            <text x={W / 2} y={500} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>“5 phút là đủ.” ⏱️</text>
          </g>
          <g style={{ ...vanish, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={610} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">sau đó… thân ảnh dần mờ đi 👻</text>
            <text x={W / 2} y={655} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>hoàn toàn biến mất khỏi tam giới 💨</text>
          </g>
          <Punch y={730} color={AMBER} style={{ ...punch, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}
            lines={["3 NGÀY sau · đột nhiên xuất hiện", "mang theo kết quả", "như thể chưa từng rời đi 🤣"]} />
          <FigFooter label="'5 phút' = đơn vị thời gian bí ẩn nhất" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 ĐỘ KIẾP CHÂN NHÂN ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const declare = useScaleIn(40, 14);
  const chaos = useFadeUp(200, 14);
  const punch = useScaleIn(420, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="ALWAYS QUITTING" />
          <Badge dot="🔴" text="ĐỘ KIẾP CHÂN NHÂN" color={WARNING_RED} />
          <g style={{ ...declare, transformOrigin: `${W / 2}px 400px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={330} width={920} height={140} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={380} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>cứ mỗi tháng 1 lần · ngài tuyên bố:</text>
            <text x={W / 2} y={435} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">“Ta sắp rời khỏi tông môn.” 🎒</text>
          </g>
          <g style={chaos}>
            {["💔 đồng môn đạo tâm chấn động", "🩸 Tech Lead khí huyết nghịch hành", "📄 CV xuất thế · LinkedIn rung chuyển"].map((t, i) => (
              <g key={i} opacity={useFade(220 + i * 35, 10)}>
                <rect x={W / 2 - 440} y={500 + i * 76} width={880} height={62} rx={10} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={1.5} />
                <text x={W / 2} y={540 + i * 76} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <Punch y={760} color={AMBER} style={{ ...punch, transformOrigin: `${W / 2}px 860px`, transformBox: "fill-box" }}
            lines={["3 NĂM trôi qua · ngài vẫn ngồi đúng chỗ cũ", "lời nghỉ việc đã thành", "ĐỊNH KỲ HẰNG THÁNG của thiên đạo 🤣"]} />
          <FigFooter label="dọa nghỉ hằng tháng · không bao giờ nghỉ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 LOẠI CUỐI ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const intro = useFadeUp(40, 14);
  const behind = useScaleIn(260, 14);
  const quote = useScaleIn(480, 16);
  const punch = useScaleIn(680, 14);
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="THE FINAL ONE" />
          <Badge dot="🏴" text="LOẠI CUỐI · THẦN BÍ NHẤT" color={AMBER} />
          <g style={intro}>
            <rect x={W / 2 - 460} y={330} width={920} height={110} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={398} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✗ không code · ✗ không deploy · ✗ không sửa bug</text>
          </g>
          <g style={behind}>
            <rect x={W / 2 - 460} y={470} width={920} height={150} rx={14} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={520} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>mỗi khi production độ kiếp → ngài xuất hiện</text>
            <text x={W / 2} y={568} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>lặng lẽ đứng SAU LƯNG ngươi 🧍</text>
            <text x={W / 2} y={605} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhìn màn hình · quan sát mọi thứ đang cháy 🔥</text>
          </g>
          <g style={{ ...quote, transformOrigin: `${W / 2}px 710px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={650} width={940} height={120} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={4} opacity={0.8 + 0.2 * glow} />
            <text x={W / 2} y={725} fontSize={46} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">rồi hỏi: “Nó bị sao thế em?”</text>
          </g>
          <Punch y={800} color={WARNING_RED} style={{ ...punch, transformOrigin: `${W / 2}px 870px`, transformBox: "fill-box" }}
            lines={["đạo tâm nứt · tâm ma nhập thể", "tu vi nhiều năm tan thành mây khói 🤣"]} />
          <FigFooter label="người không làm gì · nhưng phá huỷ tất cả" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 CLOSING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const nofear = useFadeUp(30, 14);
  const real = useScaleIn(200, 14);
  const punch = useScaleIn(380, 18);
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="THE REAL HORROR" />
          <g style={nofear}>
            <text x={W / 2} y={320} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Production sập? · không đáng sợ 😌</text>
            <text x={W / 2} y={372} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Thiên kiếp giáng lâm? · cũng không 😌</text>
          </g>
          <g style={real}>
            <rect x={W / 2 - 470} y={420} width={940} height={170} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={470} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>điều ĐÁNG SỢ thật sự là…</text>
            <text x={W / 2} y={518} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>production đang cháy 🔥 · log đang nổ 💥</text>
            <text x={W / 2} y={560} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cả tông đang truy tìm nhân quả…</text>
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={650} width={960} height={230} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.75 + 0.25 * glow} />
            <text x={W / 2} y={710} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">…và sau lưng ngươi · 1 vị trưởng lão</text>
            <text x={W / 2} y={755} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cứ 3 hơi thở lại hỏi 1 lần:</text>
            <text x={W / 2} y={835} fontSize={58} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">“Xong chưa em?” 🤣</text>
          </g>
          <FigFooter label="micromanage · nỗi sợ lớn nhất khi đang fix" />
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
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <text x={W / 2} y={620} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={head}>Giới công nghệ còn vô số…</text>
          <text x={W / 2} y={685} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={head}>sinh vật thần bí chưa được kể 👻</text>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={810} width={600} height={140} rx={70} fill={AMBER} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={822} width={570} height={116} rx={58} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
              <text x={W / 2} y={898} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1030} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(60, 12)}>để gặp thêm sinh vật thần bí giới IT 👇</text>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const SinhVatThanBi: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("sinh_vat_than_bi/voice.mp3")} />
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
