import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./code_dao_nhap_mon_beats.json";

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
          <pattern id="cdgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="cdgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="cdglow" cx="50%" cy="38%" r="62%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.1" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cdscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#cdgrid)" />
        <rect width={W} height={H} fill="url(#cdgrid2)" />
        <rect width={W} height={H} fill="url(#cdglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#cdscan)" />
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
  const scale = interpolate(frame, [0, duration * FPS], [1.0, 1.035], { extrapolateRight: "clamp" });
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

// ============ S1 INTRO ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const sub = useFadeUp(60, 14);
  const sword = useScaleIn(130, 14);
  const hw = useScaleIn(210, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="THE PATH OF CODE" />
          <text x={W / 2} y={360} fontSize={34} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Năm ấy · ta nhập môn Code Đạo</text>
          <text x={W / 2} y={430} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={sub}>trở thành một kiếm tu ⚔️</text>
          <g style={{ ...sword, transformOrigin: `${W / 2}px 590px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={520} width={880} height={140} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={575} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thanh kiếm trong tay…</text>
            <text x={W / 2} y={625} fontSize={42} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>chính là IDE 💻</text>
          </g>
          <g style={{ ...hw, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 460} y={720} w={920} h={150} color={AMBER} thick={3} />
            <text x={W / 2} y={775} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>kiếm quyết đầu tiên học được:</text>
            <text x={W / 2} y={830} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={900}>“Hello World” 🤣</text>
          </g>
          <FigFooter label="hành trình của một kiếm tu code" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 NAIVE ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const beliefs = [
    { a: "code HAY", b: "→ hệ thống sẽ tốt", e: 40 },
    { a: "code ĐẸP", b: "→ thiên hạ thái bình", e: 90 },
    { a: "code CHUẨN", b: "→ sẽ không có bug", e: 140 },
  ];
  const firm = useScaleIn(210, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE IDEALIST" />
          <text x={W / 2} y={320} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>khi đó · ta luôn tin rằng:</text>
          {beliefs.map((bl, i) => {
            const y = 390 + i * 130;
            return (
              <g key={i} style={{ ...useScaleIn(bl.e, 12), transformOrigin: `${W / 2}px ${y + 50}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 460} y={y} width={920} height={104} rx={14} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
                <text x={W / 2} y={y + 48} fontSize={36} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{bl.a}</text>
                <text x={W / 2} y={y + 86} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{bl.b}</text>
              </g>
            );
          })}
          <g style={{ ...firm, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={865} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đạo tâm vô cùng kiên định 😤</text>
          </g>
          <FigFooter label="naive · khi code là tất cả" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 JUDGING ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const look = useFadeUp(30, 14);
  const truth = useScaleIn(280, 14);
  const qs = ["“sao lại viết như vậy?”", "“sao không làm đẹp hơn?”", "“sao không refactor?”"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="THE ARROGANCE" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>ta nhìn code tiền bối · âm thầm lắc đầu 🙄</text>
          <g style={look}>
            {qs.map((q, i) => (
              <g key={i} opacity={useFade(60 + i * 45, 10)}>
                <rect x={W / 2 - 440} y={360 + i * 90} width={880} height={72} rx={12} fill={BG_CARD} stroke={ORANGE} strokeWidth={1.5} />
                <text x={W / 2} y={405 + i * 90} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{q}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={710} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(190, 12)}>ta tưởng mình nhìn thấy chân lý…</text>
          <g style={{ ...truth, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={760} w={940} h={150} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={818} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thật ra · ta chỉ thấy MỘT GÓC</text>
            <text x={W / 2} y={868} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">còn NHÂN QUẢ — ta chưa từng thấy</text>
          </g>
          <FigFooter label="phán xét trước · hiểu sau" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 LEGACY ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const stats = useFadeUp(40, 14);
  const see = useFadeUp(200, 14);
  const finds = [
    { t: "code XẤU · vẫn cứu hệ thống mỗi ngày", e: 300 },
    { t: "giải pháp TẠM · thành hộ tông đại trận", e: 360 },
    { t: "vô số TODO · đã tu thành chính quả 🤣", e: 420 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="THE LEGACY SYSTEM" />
          <text x={W / 2} y={285} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>rồi ta kế thừa 1 hệ thống thượng cổ:</text>
          <g style={stats}>
            {["🏛️ 10 năm", "👥 triệu user", "⚙️ vô số svc"].map((t, i) => (
              <g key={i} opacity={useFade(60 + i * 30, 10)}>
                <rect x={W / 2 - 470 + i * 320} y={320} width={300} height={100} rx={14} fill={BG_CARD} stroke={AMBER} strokeWidth={2} />
                <text x={W / 2 - 320 + i * 320} y={382} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{t}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={500} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={see}>lần đầu · ta thấy THIÊN ĐẠO thật sự 👁️</text>
          {finds.map((fd, i) => {
            const y = 560 + i * 104;
            return (
              <g key={i} style={{ ...useScaleIn(fd.e, 12), transformOrigin: `${W / 2}px ${y + 40}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 470} y={y} width={940} height={86} rx={12} fill={BG_TERM} stroke={JADE} strokeWidth={2} />
                <text x={W / 2} y={y + 53} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{fd.t}</text>
              </g>
            );
          })}
          <FigFooter label="legacy · nơi nhân quả hiện hình" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 REALIZATION ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const a = useScaleIn(20, 14);
  const b = useScaleIn(100, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="THE FIRST LESSON" />
          <g style={{ ...a, transformOrigin: `${W / 2}px 460px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={430} fontSize={36} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">không phải thứ gì tồn tại tới hôm nay…</text>
            <text x={W / 2} y={490} fontSize={40} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>cũng vì nó ĐÚNG</text>
          </g>
          <g style={{ ...b, transformOrigin: `${W / 2}px 680px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={590} w={940} h={190} color={AMBER} thick={3} />
            <text x={W / 2} y={655} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng thứ tồn tại tới hôm nay…</text>
            <text x={W / 2} y={725} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">thường CÓ LÝ DO của nó 💡</text>
          </g>
          <FigFooter label="survivorship · thứ sống sót đều có lý" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 HOTFIX ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const hate = useFadeUp(40, 14);
  const night = useScaleIn(180, 14);
  const chaos = useFadeUp(330, 14);
  const learn = useScaleIn(480, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="THE NIGHT IT BURNED" />
          <g style={hate}>
            <rect x={W / 2 - 460} y={290} width={920} height={120} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={340} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ta từng GHÉT hotfix 🚫</text>
            <text x={W / 2} y={385} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">tin mọi vấn đề phải giải quyết tận gốc</text>
          </g>
          <g style={{ ...night, transformOrigin: `${W / 2}px 480px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={495} fontSize={36} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>cho đến 1 đêm · PRODUCTION thiên kiếp 🔥</text>
          </g>
          <g style={chaos}>
            {["😱 người dùng gào thét", "📋 PM đạo tâm bất ổn", "👔 CEO khí huyết nghịch hành"].map((t, i) => (
              <g key={i} opacity={useFade(350 + i * 35, 10)}>
                <rect x={W / 2 - 440} y={550 + i * 80} width={880} height={64} rx={10} fill="#2A1010" stroke={WARNING_RED} strokeWidth={1.5} />
                <text x={W / 2} y={592 + i * 80} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...learn, transformOrigin: `${W / 2}px 870px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={810} w={940} h={130} color={AMBER} thick={3} />
            <text x={W / 2} y={865} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>không cần thành ANH HÙNG…</text>
            <text x={W / 2} y={912} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">chỉ cần DẬP LỬA trước 🧯</text>
          </g>
          <FigFooter label="hotfix · khi lý tưởng gặp thực tại" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 THE_HOTFIX ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const fix = useScaleIn(40, 14);
  const later = useFadeUp(200, 14);
  const mirror = useScaleIn(320, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="3 LINES OF PRIDE" />
          <g style={{ ...fix, transformOrigin: `${W / 2}px 420px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={330} width={920} height={180} rx={16} fill={BG_TERM} stroke={JADE} strokeWidth={3} />
            <text x={W / 2} y={390} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đêm đó · ta viết 1 hotfix:</text>
            <text x={W / 2} y={445} fontSize={42} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={900}>3 dòng code 🛠️</text>
            <text x={W / 2} y={490} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>cứu sống cả hệ thống · ta rất tự hào 🤣</text>
          </g>
          <text x={W / 2} y={610} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={later}>3 năm sau · thiên kiếp đã biến mất…</text>
          <g style={{ ...mirror, transformOrigin: `${W / 2}px 770px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={680} w={940} h={210} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={745} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng hotfix của ta VẪN CÒN</text>
            <text x={W / 2} y={805} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>và 1 đệ tử mới đang nhìn nó…</text>
            <text x={W / 2} y={858} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">với ánh mắt giống hệt ta năm xưa 🪞</text>
          </g>
          <FigFooter label="temporary · thứ vĩnh viễn nhất" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 KARMA ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const win = useFadeUp(40, 14);
  const not = useScaleIn(220, 14);
  const price = useFadeUp(420, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="THE UNBEATABLE" />
          <g style={win}>
            {["✅ ngươi thắng được BUG", "✅ ngươi thắng được DEADLINE", "✅ ngươi thắng được PRODUCTION"].map((t, i) => (
              <g key={i} opacity={useFade(60 + i * 35, 10)}>
                <rect x={W / 2 - 450} y={290 + i * 78} width={900} height={64} rx={10} fill={BG_CARD} stroke={JADE} strokeWidth={1.5} />
                <text x={W / 2} y={332 + i * 78} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...not, transformOrigin: `${W / 2}px 590px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={565} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhưng có 1 thứ · KHÔNG ai thắng được:</text>
            <text x={W / 2} y={630} fontSize={56} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">NHÂN QUẢ ⚖️</text>
          </g>
          <g style={price}>
            <rect x={W / 2 - 470} y={690} width={940} height={210} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={740} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mỗi shortcut ngươi đi · đều có GIÁ</text>
            <text x={W / 2} y={788} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mỗi dòng bỏ qua · đang CHỜ ở tương lai</text>
            <text x={W / 2} y={840} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>mỗi TODO · là phong thư gửi chính mình</text>
            <text x={W / 2} y={878} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>// của bạn ở tương lai 💀</text>
          </g>
          <FigFooter label="karma · không ai trốn được nhân quả" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 NO_MOCK ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const no = useScaleIn(40, 14);
  const cycle = useFadeUp(180, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="HUMILITY" />
          <g style={{ ...no, transformOrigin: `${W / 2}px 380px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={310} w={940} h={140} color={AMBER} thick={3} />
            <text x={W / 2} y={398} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">ta không còn cười nhạo tiền bối</text>
          </g>
          <g style={cycle}>
            <rect x={W / 2 - 460} y={520} width={920} height={150} rx={14} fill="#0E1F35" stroke={ACCENT_BLUE} strokeWidth={2.5} />
            <text x={W / 2} y={575} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>vấn đề hôm nay ta gặp…</text>
            <text x={W / 2} y={625} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>tiền bối đã gặp từ RẤT LÂU rồi ⬅️</text>
          </g>
          <g style={{ ...cycle, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={700} width={920} height={150} rx={14} fill="#1A1030" stroke={VIOLET} strokeWidth={2.5} />
            <text x={W / 2} y={755} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>vấn đề hôm nay ta để lại…</text>
            <text x={W / 2} y={805} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>hậu bối sẽ gặp lại trong tương lai ➡️</text>
          </g>
          <FigFooter label="vòng luân hồi của mọi codebase 🔄" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 ENDING ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const path = useFadeUp(30, 14);
  const grow = useScaleIn(200, 18);
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE REAL PATH" />
          <g style={path}>
            <text x={W / 2} y={330} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">lập trình không phải con đường viết code…</text>
            <text x={W / 2} y={395} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>mà là học cách SỐNG CHUNG với nhân quả</text>
          </g>
          <g style={{ ...grow, transformOrigin: `${W / 2}px 690px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={490} width={960} height={400} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.75 + 0.25 * glow} />
            <text x={W / 2} y={555} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">trưởng thành · là khi thấy 1 đoạn code bẩn…</text>
            <text x={W / 2} y={630} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thay vì hỏi:</text>
            <text x={W / 2} y={680} fontSize={36} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">“Ai viết cái này?”</text>
            <line x1={W / 2 - 360} y1={715} x2={W / 2 + 360} y2={715} stroke={TEXT_MUTE} strokeWidth={1} opacity={0.4} />
            <text x={W / 2} y={765} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ngươi bắt đầu hỏi:</text>
            <text x={W / 2} y={830} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">“Nó đang CỨU thứ gì?” 🏯</text>
          </g>
          <FigFooter label="trưởng thành · là biết hỏi đúng câu hỏi" />
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
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <g style={ask}>
            <text x={W / 2} y={500} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Ngươi muốn nghe truyền kỳ</text>
            <text x={W / 2} y={555} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">của NGHỀ nào tiếp theo? 🤔</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={675} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 comment phía dưới 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={760} width={600} height={140} rx={70} fill={JADE} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={772} width={570} height={116} rx={58} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
              <text x={W / 2} y={848} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
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

export const CodeDaoNhapMon: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("code_dao_nhap_mon/voice.mp3")} />
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
