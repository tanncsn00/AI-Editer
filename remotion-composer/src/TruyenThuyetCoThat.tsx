import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./truyen_thuyet_co_that_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "11";

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
          <pattern id="ttcgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="ttcgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="ttcglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ttcscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#ttcgrid)" />
        <rect width={W} height={H} fill="url(#ttcgrid2)" />
        <rect width={W} height={H} fill="url(#ttcglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#ttcscan)" />
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
    <g style={{ ...a, transformOrigin: `${W / 2}px 245px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 460} y={208} width={920} height={76} rx={38} fill={BG_TERM} stroke={color} strokeWidth={2.5} />
      <text x={W / 2} y={256} fontSize={26} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="1">{dot}  {text}</text>
    </g>
  );
};

const Chips: React.FC<{ items: string[]; color: string; baseEntry: number; y: number }> = ({ items, color, baseEntry, y }) => (
  <g>
    {items.map((it, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      return (
        <g key={i} opacity={useFade(baseEntry + i * 22, 10)}>
          <rect x={W / 2 - 460 + col * 470} y={y + row * 86} width={440} height={70} rx={12} fill={BG_CARD} stroke={color} strokeWidth={2} />
          <text x={W / 2 - 240 + col * 470} y={y + 45 + row * 86} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{it}</text>
        </g>
      );
    })}
  </g>
);

// ============ S1 INTRO ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const myth = useFadeUp(40, 14);
  const real = useScaleIn(120, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="REAL TECH LEGENDS" />
          <text x={W / 2} y={360} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(8, 12)}>Giới công nghệ có nhiều câu chuyện…</text>
          <text x={W / 2} y={440} fontSize={40} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={myth}>nghe y như THẦN THOẠI 🐉</text>
          <g style={{ ...real, transformOrigin: `${W / 2}px 680px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={560} w={960} h={240} color={AMBER} thick={3} />
            <text x={W / 2} y={650} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng điều đáng sợ là…</text>
            <text x={W / 2} y={730} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đều TỪNG THẬT SỰ</text>
            <text x={W / 2} y={785} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">XẢY RA 😨</text>
          </g>
          <FigFooter label="6 truyền thuyết · 1 truyền thừa · đều CÓ THẬT" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 TT1 GIT ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const ctx = useFadeUp(40, 14);
  const hero = useScaleIn(150, 14);
  const punch = useScaleIn(360, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE ORIGIN OF GIT" />
          <Badge dot="⚪" text="ĐẠO TỔ KHAI TÔNG GIT" color={TEXT_PRI} />
          <g style={ctx}>
            <rect x={W / 2 - 460} y={330} width={920} height={140} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={382} fontSize={28} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>NĂM 2005</text>
            <text x={W / 2} y={432} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Linux Tông cần cách quản lý mã nguồn mới</text>
          </g>
          <g style={{ ...hero, transformOrigin: `${W / 2}px 600px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={510} width={920} height={180} rx={16} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={575} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đại năng <tspan fill={AMBER_BRIGHT} fontWeight={900}>Linus Torvalds</tspan> xuất quan</text>
            <text x={W / 2} y={645} fontSize={44} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>→ khai sáng GIT ⚔️</text>
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 820px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={740} w={940} h={160} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={800} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>20 năm sau · hàng triệu tu sĩ</text>
            <text x={W / 2} y={855} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">vẫn độ kiếp vì MERGE CONFLICT 😩</text>
          </g>
          <FigFooter label="git · 2005 · vẫn ám ảnh tới hôm nay" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 TT2 BUG ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const ctx = useFadeUp(40, 14);
  const moth = useScaleIn(180, 14);
  const reveal = useScaleIn(360, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="THE FIRST BUG" />
          <Badge dot="🟢" text="YÊU THÚ ĐẦU TIÊN CỦA GIỚI IT" color={JADE} />
          <g style={ctx}>
            <rect x={W / 2 - 460} y={330} width={920} height={140} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={382} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>NĂM 1947</text>
            <text x={W / 2} y={432} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>một đại trận tính toán xuất hiện dị tượng</text>
          </g>
          <g style={{ ...moth, transformOrigin: `${W / 2}px 600px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={510} width={920} height={180} rx={16} fill={BG_TERM} stroke={JADE} strokeWidth={3} />
            <text x={W / 2} y={585} fontSize={60} textAnchor="middle">🦋</text>
            <text x={W / 2} y={650} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>một con BƯỚM ĐÊM thật · mắc kẹt trong trận</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 820px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={750} w={940} h={140} color={AMBER} thick={3} />
            <text x={W / 2} y={808} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>từ đó · danh xưng</text>
            <text x={W / 2} y={862} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">“BUG” 🐛 lưu truyền khắp tam giới</text>
          </g>
          <FigFooter label="bug · con bọ có thật · 1947" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 TT3 JS ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const ctx = useScaleIn(40, 14);
  const grew = useFadeUp(330, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="10 DAYS THAT RULED" />
          <Badge dot="🔵" text="TIỂU CÔNG PHÁP THỐNG TRỊ THIÊN HẠ" color={ACCENT_BLUE} />
          <g style={{ ...ctx, transformOrigin: `${W / 2}px 430px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={330} width={920} height={200} rx={16} fill={BG_TERM} stroke={ACCENT_BLUE} strokeWidth={3} />
            <text x={W / 2} y={385} fontSize={26} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>NĂM 1995 · Brendan Eich</text>
            <text x={W / 2} y={445} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tạo ra <tspan fill={AMBER_BRIGHT} fontWeight={900}>JavaScript</tspan></text>
            <text x={W / 2} y={500} fontSize={36} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>chỉ trong ~10 NGÀY ⚡</text>
          </g>
          <text x={W / 2} y={610} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={grew}>20 năm sau · nó ở KHẮP MỌI NƠI:</text>
          <Chips items={["Frontend 🖥️", "Backend ⚙️", "Mobile 📱", "Desktop 💻"]} color={ACCENT_BLUE} baseEntry={380} y={650} />
          <text x={W / 2} y={910} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(500, 12)}>…thậm chí nhiều pháp khí cũng muốn dùng 🤯</text>
          <FigFooter label="javascript · 10 ngày · thống trị web" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 TT4 OUTAGE ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const apps = useScaleIn(40, 14);
  const gone = useScaleIn(200, 14);
  const eng = useFadeUp(340, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="THE 2021 BLACKOUT" />
          <Badge dot="🟣" text="ĐẠI TÔNG MÔN BIẾN MẤT KHỎI TAM GIỚI" color={VIOLET} />
          <text x={W / 2} y={335} fontSize={28} fill={VIOLET} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} style={useFadeUp(8, 12)}>NĂM 2021</text>
          <g style={apps}>
            {["📘 Facebook", "📸 Instagram", "💬 WhatsApp"].map((a, i) => (
              <g key={i} opacity={useFade(60 + i * 35, 10)}>
                <rect x={W / 2 - 380} y={370 + i * 92} width={760} height={76} rx={12} fill={BG_CARD} stroke={VIOLET} strokeWidth={2} />
                <text x={W / 2} y={418 + i * 92} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{a}</text>
              </g>
            ))}
          </g>
          <g style={{ ...gone, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={735} fontSize={40} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>đồng loạt BIẾN MẤT khỏi Internet 🌑</text>
          </g>
          <g style={eng}>
            <text x={W / 2} y={820} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>hàng tỷ sinh linh ngơ ngác nhìn thiên địa…</text>
            <text x={W / 2} y={872} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">vô số kỹ sư nghênh đón thiên kiếp ⚡</text>
          </g>
          <FigFooter label="outage · cả 1 đế chế tắt đèn cùng lúc" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 TT5 PYTHON ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const ctx = useScaleIn(40, 14);
  const born = useScaleIn(220, 14);
  const grew = useFadeUp(420, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="A HOLIDAY PROJECT" />
          <Badge dot="🟠" text="CÔNG PHÁP PYTHON ĐẠO" color={ORANGE} />
          <g style={ctx}>
            <rect x={W / 2 - 460} y={330} width={920} height={150} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={382} fontSize={26} fill={ORANGE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>cuối những năm 1980 · Guido van Rossum</text>
            <text x={W / 2} y={440} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tìm 1 dự án cá nhân làm trong kỳ nghỉ 🏖️</text>
          </g>
          <g style={{ ...born, transformOrigin: `${W / 2}px 570px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 380} y={510} width={760} height={120} rx={16} fill={BG_TERM} stroke={ORANGE} strokeWidth={3} />
            <text x={W / 2} y={588} fontSize={50} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>→ PYTHON 🐍</text>
          </g>
          <text x={W / 2} y={700} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={grew}>không ai ngờ · nay nó ở khắp mọi nơi:</text>
          <Chips items={["Web 🌐", "Data 📊", "AI 🤖", "Automation ⚙️"]} color={ORANGE} baseEntry={470} y={740} />
          <FigFooter label="python · từ side-project tới thống trị" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 TT6 NOFIX ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const sys = useFadeUp(40, 14);
  const why = useScaleIn(180, 14);
  const bless = useScaleIn(360, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="DON'T TOUCH IT" />
          <Badge dot="🔴" text="VỊ ĐẠO TỔ KHÔNG BAO GIỜ SỬA BUG" color={WARNING_RED} />
          <g style={sys}>
            <rect x={W / 2 - 460} y={330} width={920} height={130} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={380} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>có những hệ thống chạy SUỐT NHIỀU NĂM</text>
            <text x={W / 2} y={425} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không một thay đổi nào…</text>
          </g>
          <g style={{ ...why, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={490} width={920} height={150} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={545} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không phải vì không có bug…</text>
            <text x={W / 2} y={605} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà vì KHÔNG AI DÁM động vào 😶</text>
          </g>
          <g style={{ ...bless, transformOrigin: `${W / 2}px 780px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={700} w={940} h={160} color={AMBER} thick={3} />
            <text x={W / 2} y={760} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thứ đang vận hành ổn định…</text>
            <text x={W / 2} y={815} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">rất có thể đang được THIÊN ĐẠO BẢO HỘ 🙏</text>
          </g>
          <FigFooter label="if it works · don't touch it" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 FINAL1 ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const not = useFadeUp(40, 14);
  const task = useScaleIn(220, 14);
  const excited = useFadeUp(440, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="THE INHERITANCE" />
          <Badge dot="🏴" text="TRUYỀN THỪA CỦA TIỀN BỐI" color={AMBER} />
          <g style={not}>
            <text x={W / 2} y={345} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">điều đáng sợ nhất Software Đạo · KHÔNG phải:</text>
            <text x={W / 2} y={398} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>bug · production độ kiếp · merge conflict</text>
          </g>
          <g style={{ ...task, transformOrigin: `${W / 2}px 580px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={450} width={940} height={260} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={510} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>mà là một ngày · đại trưởng lão gọi ngươi tới:</text>
            <text x={W / 2} y={580} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>“Đây là hệ thống tiền bối để lại.</text>
            <text x={W / 2} y={635} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Từ nay NGƯƠI phụ trách.” 📜</text>
          </g>
          <g style={excited}>
            <text x={W / 2} y={800} fontSize={32} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ban đầu · ngươi vô cùng KÍCH ĐỘNG</text>
            <text x={W / 2} y={850} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">bởi đây chính là… truyền thừa ✨</text>
          </g>
          <FigFooter label="legacy code · món quà hay lời nguyền?" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 FINAL2 ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const open = useScaleIn(30, 14);
  const horror = useFadeUp(200, 14);
  const curse = useScaleIn(340, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="OPEN THE FILE" />
          <text x={W / 2} y={290} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>cho tới khi mở 1 file code ra…</text>
          <g style={{ ...open, transformOrigin: `${W / 2}px 440px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={340} width={940} height={210} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={415} fontSize={56} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>20.000 DÒNG</text>
            <text x={W / 2} y={475} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// không comment · không document</text>
            <text x={W / 2} y={522} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>biến tên: a · aa · aaa</text>
          </g>
          <text x={W / 2} y={630} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={horror}>đọc 1 hàm = giải mã thiên thư thượng cổ 📖</text>
          <g style={{ ...curse, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={690} width={940} height={180} rx={16} fill={BG_CARD} stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2} y={750} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>sửa 1 bug → 3 bug mới lập tức xuất thế 🐛🐛🐛</text>
            <text x={W / 2} y={810} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>refactor → production lập tức rung động ⚠️</text>
          </g>
          <FigFooter label="20k dòng · 0 comment · vô số nước mắt" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 FINAL3 ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const who = useScaleIn(40, 14);
  const ask = useScaleIn(280, 14);
  const broke = useFadeUp(480, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="WHY NOT REWRITE?" />
          <g style={{ ...who, transformOrigin: `${W / 2}px 340px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={260} width={940} height={170} rx={16} fill={BG_CARD} stroke={VIOLET} strokeWidth={2.5} />
            <text x={W / 2} y={315} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người viết hệ thống này…</text>
            <text x={W / 2} y={370} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>tuyệt thế KỲ TÀI 🧙</text>
            <text x={W / 2} y={412} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>hay tuyệt thế TÂM MA? 👹</text>
          </g>
          <text x={W / 2} y={510} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(200, 12)}>rồi 1 đệ tử mới nhập môn nhìn source code · hỏi:</text>
          <g style={{ ...ask, transformOrigin: `${W / 2}px 630px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={550} w={940} h={160} color={ACCENT_BLUE} thick={3} />
            <text x={W / 2} y={650} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">“Sao anh không viết lại</text>
            <text x={W / 2} y={695} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">từ đầu?” 😇</text>
          </g>
          <g style={broke}>
            <text x={W / 2} y={800} fontSize={34} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>→ đạo tâm trực tiếp VỠ VỤN 💥</text>
            <text x={W / 2} y={852} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">khí huyết nghịch hành · tâm ma năm xưa sống dậy</text>
          </g>
          <FigFooter label="câu hỏi mọi junior từng hỏi · 1 lần" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S11 ENDING ============
const S11: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const get = useFadeUp(40, 14);
  const law = useScaleIn(200, 14);
  const reveal = useScaleIn(380, 18);
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="KARMA REMAINS" />
          <g style={get}>
            <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">lúc ấy · ngươi cuối cùng cũng hiểu…</text>
            <text x={W / 2} y={355} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>vì sao tiền bối KHÔNG viết lại từ đầu</text>
          </g>
          <g style={{ ...law, transformOrigin: `${W / 2}px 470px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={405} width={920} height={120} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={455} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tiền bối có thể đã rời tông môn…</text>
            <text x={W / 2} y={500} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">nhưng NHÂN QUẢ thì không ⛓️</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 740px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={580} width={960} height={320} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.75 + 0.25 * glow} />
            <text x={W / 2} y={645} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">thứ được truyền lại nhiều nhất giới IT…</text>
            <text x={W / 2} y={705} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>không phải tri thức</text>
            <text x={W / 2} y={770} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà là SOURCE CODE 💾</text>
            <line x1={W / 2 - 380} y1={805} x2={W / 2 + 380} y2={805} stroke={TEXT_MUTE} strokeWidth={1} opacity={0.4} />
            <text x={W / 2} y={858} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>và người kế thừa nó · sẽ thành</text>
            <text x={W / 2} y={892} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">tiền bối tiếp theo 🏯</text>
          </g>
          <FigFooter label="vòng luân hồi của legacy code" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S12 CTA ============
const S12: React.FC<{ duration: number }> = ({ duration }) => {
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
          <text x={W / 2} y={620} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={head}>Còn vô số truyền thuyết có thật…</text>
          <text x={W / 2} y={685} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={head}>của giới công nghệ đang chờ kể 🏯</text>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={810} width={600} height={140} rx={70} fill={AMBER} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={822} width={570} height={116} rx={58} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
              <text x={W / 2} y={898} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1030} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(60, 12)}>để không bỏ lỡ truyền thuyết tiếp theo 👇</text>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];

export const TruyenThuyetCoThat: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("truyen_thuyet_co_that/voice.mp3")} />
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
