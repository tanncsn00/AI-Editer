import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./thien_co_su_beats.json";
import T from "./thien_co_su_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "10";

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
const BG_TERM = "#0A1322";
const BG_RED = "#2A1010";
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
const useScaleIn = (e: number, d = 14) => {
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
          <pattern id="tcgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="tcgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="tcglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.1" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tcscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#tcgrid)" />
        <rect width={W} height={H} fill="url(#tcgrid2)" />
        <rect width={W} height={H} fill="url(#tcglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#tcscan)" />
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
const Hero: React.FC<{ cy: number; cn: string; en: string; sub?: string; color: string; entry: number }> = ({ cy, cn, en, sub, color, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 490} y={cy - 84} width={980} height={168} rx={18} fill={BG_TERM} stroke={color} strokeWidth={4} />
      <text x={W / 2} y={cy - 26} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>《{cn}》</text>
      {en && <text x={W / 2} y={cy + 34} fontSize={40} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{en}</text>}
      {sub && <text x={W / 2} y={cy + (en ? 70 : 24)} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{sub}</text>}
    </g>
  );
};
const KiepTag: React.FC<{ y: number; n: string; name: string; entry: number }> = ({ y, n, name, entry }) => {
  const a = useScaleIn(entry, 12);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 50}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 440} y={y} width={880} height={100} rx={14} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3} />
      <text x={W / 2} y={y + 42} fontSize={22} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">{n}</text>
      <text x={W / 2} y={y + 80} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{name}</text>
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={AMBER} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="00" label="POV · THIÊN CƠ SƯ" />
        <g transform="translate(0, 300)">
        <g style={useFadeUp(8, 12)}>
          <text x={W / 2} y={280} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="3">🏯 POV: TA LÀ MỘT</text>
          <text x={W / 2} y={362} fontSize={72} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">THIÊN CƠ SƯ</text>
        </g>
        <g style={useScaleIn(T.HOOK.nosword, 14)}>
          <rect x={W / 2 - 480} y={430} width={960} height={130} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
          <text x={W / 2} y={482} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không xuất kiếm · không bày trận</text>
          <text x={W / 2} y={528} fontSize={31} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cũng không luyện đan 🤔</text>
        </g>
        <g style={useScaleIn(T.HOOK.divine, 14)}>
          <rect x={W / 2 - 490} y={590} width={980} height={170} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={W / 2} y={645} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>chỉ ngồi nhìn vô số thiên tượng 🔮</text>
          <text x={W / 2} y={700} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>từ con số vô tri → suy diễn cát hung</text>
          <text x={W / 2} y={740} fontSize={31} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">quyết định vận mệnh cả tông môn 💀</text>
        </g>
        </g>
        <FigFooter label="tu sĩ đọc thiên cơ từ những con số" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S2 NAMING ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={ACCENT_BLUE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="01" label="ĐỊNH DANH" />
        <g transform="translate(0, 300)">
        <g style={useScaleIn(T.NAMING.tuong, 13)}>
          <rect x={W / 2 - 480} y={240} width={960} height={120} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
          <text x={W / 2} y={290} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thiên hạ tưởng nghề này chỉ biết:</text>
          <text x={W / 2} y={335} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>kéo bảng · vẽ biểu đồ · nhìn Dashboard 🤣</text>
        </g>
        <g style={useScaleIn(T.NAMING.truth, 14)}>
          <rect x={W / 2 - 490} y={390} width={980} height={150} rx={18} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3} />
          <text x={W / 2} y={442} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>sai một con số → một quyết sách sai</text>
          <text x={W / 2} y={498} fontSize={31} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">sai một kết luận → cả tông môn lạc hướng 💀</text>
        </g>
        <g style={useScaleIn(T.NAMING.name, 14)}>
          <rect x={W / 2 - 490} y={580} width={980} height={170} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={W / 2} y={632} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người đời gọi:</text>
          <text x={W / 2} y={678} fontSize={40} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">DATA ANALYST</text>
          <text x={W / 2} y={724} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>giới tu chân gọi: <tspan fill={AMBER_BRIGHT} fontWeight={900}>THIÊN CƠ SƯ</tspan></text>
        </g>
        </g>
        <FigFooter label="Data Analyst · trong giới tu chân: Thiên Cơ Sư" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S3 SETUP ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={VIOLET} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="02" label="LỜI SƯ PHỤ" />
        <g transform="translate(0, 320)">
        <text x={W / 2} y={250} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" opacity={useFade(10, 12)}>ngày nhập môn, sư phụ chỉ truyền đúng một câu:</text>
        <g style={useScaleIn(T.SETUP.master, 14)}>
          <rect x={W / 2 - 490} y={290} width={980} height={210} rx={18} fill={BG_TERM} stroke={VIOLET} strokeWidth={4} />
          <text x={W / 2} y={358} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"Thiên cơ chưa từng biết nói.</text>
          <text x={W / 2} y={410} fontSize={31} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Chỉ là người đời luôn muốn bắt nó</text>
          <text x={W / 2} y={458} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">nói điều mình thích nghe."</text>
        </g>
        <g style={useScaleIn(T.SETUP.warn, 14)}>
          <rect x={W / 2 - 480} y={550} width={960} height={150} rx={16} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3} />
          <text x={W / 2} y={602} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>sau vô số lần đạo tâm tan vỡ, suýt tẩu hỏa nhập ma…</text>
          <text x={W / 2} y={658} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">ta mới hiểu: đó là LỜI CẢNH BÁO 💀</text>
        </g>
        </g>
        <FigFooter label="không phải lời dạy · mà là lời cảnh báo" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 MOHO ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={WARNING_RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="03" label="THIÊN KIẾP ① · MƠ HỒ" />
        <g transform="translate(0, 300)">
        <KiepTag y={220} n="THIÊN KIẾP ĐẦU TIÊN" name="Thiên Cơ Mơ Hồ Kiếp" entry={T.MOHO.kiep} />
        <g style={useScaleIn(T.MOHO.ask, 13)}>
          <rect x={W / 2 - 480} y={350} width={960} height={130} rx={16} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
          <text x={W / 2} y={398} fontSize={31} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">tông chủ: "cho ta một con số"</text>
          <text x={W / 2} y={446} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">— "số gì ạ?" — "thì… cái số đó" 🤣</text>
        </g>
        <g style={useScaleIn(T.MOHO.grind, 13)}>
          <rect x={W / 2 - 480} y={510} width={960} height={120} rx={16} fill={BG_TERM} stroke={ORANGE} strokeWidth={2.5} />
          <text x={W / 2} y={560} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>2 tuần · 7 kho dữ liệu · 5 trưởng lão · 10 bản truy vấn</text>
          <text x={W / 2} y={604} fontSize={31} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">→ "ý ta đâu phải cái này" 💀</text>
        </g>
        <Hero cy={730} cn="Truy Căn Vấn Đạo" en="" sub="muốn có đáp án · phải hỏi ĐÚNG câu hỏi trước" color={AMBER} entry={T.MOHO.phap} />
        </g>
        <FigFooter label="định nghĩa đúng bài toán · hiểu sai đề càng cày càng lạc" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 HONNGUYEN ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const dirty = ["Hà Nội", "HN", "Ha Noi", "Hà Lội"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="THIÊN KIẾP ② · HỖN NGUYÊN" />
          <g transform="translate(0, 300)">
          <KiepTag y={210} n="THIÊN KIẾP THỨ HAI" name="Vạn Tượng Hỗn Nguyên Kiếp" entry={T.HONNGUYEN.kiep} />
          <text x={W / 2} y={372} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" opacity={useFade(T.HONNGUYEN.kiep + 8, 10)}>cùng MỘT thành trì · bốn cách ghi:</text>
          <g>
            {dirty.map((t, i) => (
              <g key={i} style={useScaleIn((T.HONNGUYEN.dirty as number[])[i], 8)}>
                <rect x={W / 2 - 470 + (i % 2) * 480} y={400 + Math.floor(i / 2) * 88} width={450} height={72} rx={11} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2} />
                <text x={W / 2 - 245 + (i % 2) * 480} y={445 + Math.floor(i / 2) * 88} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>"{t}"</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.HONNGUYEN.mess, 13)}>
            <rect x={W / 2 - 480} y={585} width={960} height={100} rx={14} fill={BG_RED} stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2} y={648} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>doanh thu âm · ô trống · tính bằng tiền hay LINH THẠCH? 🤯</text>
          </g>
          <Hero cy={780} cn="Tẩy Tủy Dữ Liệu Đại Pháp" en="" sub="8 phần thời gian Thiên Cơ Đạo = DỌN RÁC 🧹" color={JADE} entry={T.HONNGUYEN.phap} />
          </g>
          <FigFooter label="data cleaning · 80% công lực chỉ để lau số" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 DIENDAO ============
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={ORANGE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="05" label="THIÊN KIẾP ③ · ĐIÊN ĐẢO" />
        <g transform="translate(0, 300)">
        <KiepTag y={200} n="THIÊN KIẾP THỨ BA" name="Nhân Quả Điên Đảo Kiếp" entry={T.DIENDAO.kiep} />
        <g style={useScaleIn(T.DIENDAO.boss, 13)}>
          <rect x={W / 2 - 480} y={335} width={960} height={110} rx={16} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
          <text x={W / 2} y={400} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">sếp: "từ ngày ta ban công pháp → doanh thu tăng!"</text>
        </g>
        <g style={useScaleIn(T.DIENDAO.rebut, 13)}>
          <rect x={W / 2 - 480} y={460} width={960} height={120} rx={16} fill={BG_TERM} stroke={JADE} strokeWidth={2.5} />
          <text x={W / 2} y={508} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta: "dạ… cùng lúc đó:</text>
          <text x={W / 2} y={552} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đối thủ phá sản · dịp lễ · giảm giá · chạy quảng cáo ạ"</text>
        </g>
        <g style={useScaleIn(T.DIENDAO.punch, 14)}>
          <rect x={W / 2 - 490} y={600} width={980} height={110} rx={16} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3} />
          <text x={W / 2} y={668} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">sếp: "ừ. Nhưng cứ ghi là nhờ công pháp của ta" 😐</text>
        </g>
        <g style={useScaleIn(T.DIENDAO.ngo, 13)}>
          <text x={W / 2} y={770} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">🏯 Thiên Cơ chỉ nói điều ĐÃ xảy ra · nhân quả là thứ con người TỰ VIẾT</text>
        </g>
        </g>
        <FigFooter label="tương quan ≠ nhân quả · nhưng sếp chỉ thấy điều sếp thích" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S7 HIPPO ============
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={WARNING_RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="06" label="ĐẠI KIẾP CUỐI · HiPPO" />
        <g transform="translate(0, 300)">
        <KiepTag y={200} n="THIÊN KIẾP CUỐI CÙNG" name="HiPPO Đại Kiếp" entry={T.HIPPO.kiep} />
        <g style={useScaleIn(T.HIPPO.bet, 13)}>
          <rect x={W / 2 - 480} y={335} width={960} height={110} rx={16} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
          <text x={W / 2} y={400} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cả tuần đào long mạch → kết luận TRÁI ý sếp</text>
        </g>
        <g style={useScaleIn(T.HIPPO.reply, 14)}>
          <rect x={W / 2 - 490} y={460} width={980} height={120} rx={16} fill={BG_TERM} stroke={ORANGE} strokeWidth={2.5} />
          <text x={W / 2} y={510} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>sếp xem rất lâu, gật đầu:</text>
          <text x={W / 2} y={555} fontSize={31} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"số liệu rất tốt. Nhưng ta vẫn thích phương án cũ"</text>
        </g>
        <g style={useScaleIn(T.HIPPO.daotam, 14)}>
          <rect x={W / 2 - 490} y={600} width={980} height={100} rx={16} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3.5} />
          <text x={W / 2} y={662} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">🔥 mười năm đạo hạnh suýt tan thành mây khói</text>
        </g>
        <g style={useScaleIn(T.HIPPO.ngo, 13)}>
          <text x={W / 2} y={762} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">🏯 Thiên Cơ không để tìm chân tướng — mà để HỢP THỨC HÓA quyết định có sẵn 🤡</text>
        </g>
        </g>
        <FigFooter label="HiPPO · ý kiến của kẻ lương cao nhất phòng" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S8 DAOLY ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="ĐẠO LÝ · CHÂN TƯỚNG" />
          <g transform="translate(0, 330)">
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" opacity={useFade(10, 12)}>sau trăm năm hành tẩu Thiên Cơ Đạo, ta mới ngộ:</text>
          <g style={useScaleIn(T.DAOLY.lie, 14)}>
            <rect x={W / 2 - 490} y={350} width={980} height={120} rx={18} fill={BG_TERM} stroke={JADE} strokeWidth={3.5} />
            <text x={W / 2} y={425} fontSize={42} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">Con số KHÔNG biết nói dối 💯</text>
          </g>
          <g style={useScaleIn(T.DAOLY.choose, 16)}>
            <rect x={W / 2 - 500} y={500} width={1000} height={200} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={5} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={560} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhưng con người lại rất giỏi…</text>
            <text x={W / 2} y={616} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>chọn đúng con số</text>
            <text x={W / 2} y={668} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">để kể câu chuyện MÌNH MUỐN</text>
          </g>
          </g>
          <FigFooter label="số không nói dối · người chọn góc cho nó đứng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 TIER ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const tiers = [
    { p: "🥉 Hạ phẩm", s: "kéo được Excel", c: TEXT_SEC },
    { p: "🥈 Trung phẩm", s: "viết được SQL", c: ACCENT_BLUE },
    { p: "🥇 Thượng phẩm", s: "kể chuyện bằng dữ liệu", c: JADE },
    { p: "🔥 Cực phẩm", s: "khiến người tin SỰ THẬT", c: AMBER_BRIGHT },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="CẢNH GIỚI THIÊN CƠ SƯ" />
          <g transform="translate(0, 320)">
          <g>
            {tiers.map((t, i) => (
              <g key={i} style={useScaleIn((T.TIER.tiers as number[])[i], 10)}>
                <rect x={W / 2 - 470} y={250 + i * 92} width={940} height={76} rx={12} fill={i === 3 ? BG_TERM : BG_CARD} stroke={t.c} strokeWidth={i === 3 ? 3.5 : 2.5} />
                <text x={W / 2 - 440} y={297 + i * 92} fontSize={28} fill={t.c} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{t.p}</text>
                <text x={W / 2 + 440} y={297 + i * 92} fontSize={26} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t.s}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.TIER.tiers[3] as number, 14)}>
            <text x={W / 2} y={655} fontSize={25} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">…thay vì đi tìm một con số để chứng minh điều họ đã tin từ trước</text>
          </g>
          <text x={W / 2} y={730} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.TIER.lost, 12)}>tiếc thay · cảnh giới ấy đã THẤT TRUYỀN 💀</text>
          </g>
          <FigFooter label="cực phẩm Thiên Cơ Sư · đã thất truyền từ thượng cổ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 CTA ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(6, 12);
  const cmt = useScaleIn(54, 14);
  const btn = useScaleIn(96, 14);
  const pulse = 1 + 0.03 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <g transform="translate(0, 150)">
          <g style={ask}>
            <text x={W / 2} y={450} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Ngươi ở cảnh giới nào của Thiên Cơ Đạo?</text>
            <text x={W / 2} y={512} fontSize={29} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">nghề ngươi có câu thần chú nào ám hơn "cho ta một con số"? 😵</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 630px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={645} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 khai ra ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={730} width={600} height={140} rx={70} fill={JADE} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={742} width={570} height={116} rx={58} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
              <text x={W / 2} y={818} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={950} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(132, 12)}>nghe tiếp truyền kỳ chốn công sở 🏯</text>
          </g>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const ThienCoSu: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("thien_co_su/voice.mp3")} />
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
