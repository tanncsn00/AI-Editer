import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./backend_tam_ma_beats.json";

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
const ORANGE = "#FFA552";
const SLATE = "#A4B5D0";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

const useFadeUp = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [e, e + d], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};
const useScaleIn = (e: number, d = 18) => {
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
          <pattern id="bmgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="bmgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="bmglow" cx="50%" cy="36%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.08" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bmscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#bmgrid)" />
        <rect width={W} height={H} fill="url(#bmgrid2)" />
        <rect width={W} height={H} fill="url(#bmglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#bmscan)" />
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

const Badge: React.FC<{ num: string; emoji: string; name: string; color: string; entry: number }> = ({ num, emoji, name, color, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px 290px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 200} y={245} width={400} height={58} rx={29} fill={color} />
      <text x={W / 2} y={284} fontSize={26} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{emoji} KHOẢNH KHẮC {num}</text>
      <text x={W / 2} y={360} fontSize={(name || "").length > 26 ? 32 : 38} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{name}</text>
    </g>
  );
};

const Quote: React.FC<{ y: number; speaker: string; text: string; color: string; entry: number; size?: number }> = ({ y, speaker, text, color, entry, size = 30 }) => {
  const a = useScaleIn(entry, 12);
  const w = 880;
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 44}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - w / 2} y={y} width={w} height={88} rx={14} fill={BG_CARD} stroke={color} strokeWidth={2} />
      <rect x={W / 2 - w / 2} y={y} width={8} height={88} rx={3} fill={color} />
      <text x={W / 2 - w / 2 + 28} y={y + 34} fontSize={17} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">{speaker}</text>
      <text x={W / 2 - w / 2 + 28} y={y + 70} fontSize={size} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{text}</text>
    </g>
  );
};

const Conseq: React.FC<{ y: number; color: string; lines: { t: string; c?: string; size?: number }[]; entry: number }> = ({ y, color, lines, entry }) => {
  const a = useScaleIn(entry, 14);
  const h = 60 + lines.length * 50;
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <TechBox x={W / 2 - 470} y={y} w={940} h={h} color={color} thick={2.5} />
      <text x={W / 2} y={y + 40} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// ⚠ hậu quả</text>
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={y + 84 + i * 50} fontSize={l.size || 32} fill={l.c || TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={l.c === AMBER_BRIGHT ? 900 : 700} fontStyle={l.c === AMBER_BRIGHT ? "italic" : "normal"}>{l.t}</text>
      ))}
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const title = useScaleIn(14, 16);
  const traits = ["🤐 rất ít nói", "👻 rất ít xuất hiện", "🧘 trầm mặc tu luyện"];
  const punch = useScaleIn(220, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE SILENT SECT" />
          <g style={{ ...title, transformOrigin: `${W / 2}px 330px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={300} fontSize={44} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>⚙️ BACKEND ĐẠO</text>
            <text x={W / 2} y={360} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">tông môn trầm mặc nhất tiên giới công nghệ</text>
          </g>
          {traits.map((t, i) => (
            <g key={i} opacity={useFade(80 + i * 40, 10)}>
              <rect x={W / 2 - 360} y={440 + i * 92} width={720} height={74} rx={12} fill={BG_CARD} stroke={SLATE} strokeWidth={1.5} />
              <text x={W / 2} y={486 + i * 92} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
            </g>
          ))}
          <g style={{ ...punch, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={770} w={940} h={170} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={835} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng có những khoảnh khắc · 1 câu nói</text>
            <text x={W / 2} y={890} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đủ khiến đạo tâm Backend RUNG CHUYỂN ⚡</text>
          </g>
          <FigFooter label="8 khoảnh khắc · sinh tâm ma" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 M1 API ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={SLATE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="02" label="RTFM" />
        <Badge num="1" emoji="⚪" name="'API NÀY TRẢ VỀ GÌ?'" color={SLATE} entry={15} />
        <Quote y={440} speaker="🎨 FRONTEND" text="'API này trả về gì anh?'" color={ACCENT_BLUE} entry={70} />
        <Quote y={550} speaker="⚙️ BACKEND" text="'Swagger có mà.'" color={JADE} entry={130} />
        <Quote y={660} speaker="🎨 FRONTEND" text="'Em lười đọc.' 😌" color={ACCENT_BLUE} entry={190} />
        <Conseq y={800} color={WARNING_RED} lines={[{ t: "đạo tâm Backend trực tiếp", c: TEXT_PRI }, { t: "xuất hiện VẾT NỨT 💔", c: AMBER_BRIGHT, size: 34 }]} entry={260} />
        <FigFooter label="kk 1 · docs có sẵn · vẫn hỏi" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S3 M2 REFACTOR ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const stable = ["✓ không bug", "✓ không incident", "✓ không thiên kiếp"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="IF IT AIN'T BROKE..." />
          <Badge num="2" emoji="🟢" name="'HAY MÌNH REFACTOR NHỈ?'" color={JADE} entry={15} />
          <text x={W / 2} y={440} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(50, 12)}>Hệ thống ổn định suốt 6 THÁNG:</text>
          {stable.map((s, i) => (
            <g key={i} opacity={useFade(60 + i * 40, 10)}>
              <rect x={W / 2 - 320} y={480 + i * 78} width={640} height={62} rx={10} fill={BG_CARD} stroke={JADE} strokeWidth={1.5} />
              <text x={W / 2} y={520 + i * 78} fontSize={28} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{s}</text>
            </g>
          ))}
          <Quote y={740} speaker="😇 ĐỒNG MÔN" text="'Hay mình refactor lại nhỉ?'" color={ORANGE} entry={220} />
          <Conseq y={880} color={WARNING_RED} lines={[{ t: "Technical Debt trực tiếp THỨC TỈNH", c: TEXT_PRI, size: 30 }, { t: "thiên kiếp production bắt đầu ngưng tụ 🌀", c: AMBER_BRIGHT, size: 30 }]} entry={320} />
          <FigFooter label="kk 2 · đang yên · tự dưng đụng vào" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 M3 CONFIG ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const checks = [
    { t: "Log", e: 90 },
    { t: "Database", e: 130 },
    { t: "Code", e: 170 },
  ];
  const reveal = useScaleIn(250, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="IT WAS THE CONFIG" />
          <Badge num="3" emoji="🔵" name="ĐIỀU TRA 3 CANH GIỜ" color={ACCENT_BLUE} entry={15} />
          <text x={W / 2} y={440} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(50, 12)}>🔥 Production báo lỗi · cả team điều tra…</text>
          {checks.map((c, i) => (
            <g key={i} opacity={useFade(c.e, 10)}>
              <rect x={W / 2 - 320} y={490 + i * 76} width={640} height={62} rx={10} fill={BG_CARD} stroke={JADE} strokeWidth={1.5} />
              <text x={W / 2 - 290} y={530 + i * 76} fontSize={28} fill={TEXT_PRI} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{c.t}</text>
              <text x={W / 2 + 250} y={530 + i * 76} fontSize={26} fill={JADE} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>✓ ok</text>
            </g>
          ))}
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 770px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 320} y={730} width={640} height={80} rx={10} fill="#3A1010" stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2 - 290} y={780} fontSize={30} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={800}>Config</text>
            <text x={W / 2 + 250} y={780} fontSize={30} fill={WARNING_RED} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>✗ SAI 💀</text>
          </g>
          <Conseq y={860} color={WARNING_RED} lines={[{ t: "công đức 3 NGÀY debug", c: TEXT_PRI }, { t: "trực tiếp hóa thành HƯ VÔ 🌫️", c: AMBER_BRIGHT, size: 34 }]} entry={340} />
          <FigFooter label="kk 3 · thủ phạm luôn là config" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 M4 PM NHANH ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const topics = ["database", "kiến trúc", "hiệu năng", "đồng bộ dữ liệu"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="'SO IT'S QUICK, RIGHT?'" />
          <Badge num="4" emoji="🟣" name="'CÁI NÀY KHÓ LẮM KHÔNG?'" color={VIOLET} entry={15} />
          <Quote y={420} speaker="👔 PM" text="'Cái này khó lắm không em?'" color={VIOLET} entry={40} />
          <text x={W / 2} y={560} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(90, 12)}>Backend giảng đạo 15 phút về:</text>
          <g>
            {topics.map((t, i) => {
              const col = i % 2, row = Math.floor(i / 2);
              const cx = col === 0 ? W / 2 - 230 : W / 2 + 230;
              const y = 600 + row * 90;
              return (
                <g key={i} opacity={useFade(100 + i * 35, 10)}>
                  <rect x={cx - 200} y={y} width={400} height={72} rx={10} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
                  <text x={cx} y={y + 47} fontSize={28} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
                </g>
              );
            })}
          </g>
          <Quote y={800} speaker="👔 PM (gật đầu)" text="'Thế chắc làm nhanh đúng không?' 🙂" color={VIOLET} entry={300} size={28} />
          <Conseq y={930} color={WARNING_RED} lines={[{ t: "Kim Đan Backend chuẩn bị VỠ VỤN 💥", c: AMBER_BRIGHT, size: 34 }]} entry={380} />
          <FigFooter label="kk 4 · giảng 15p · hiểu 0 chữ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 M5 USER NHAN RA ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const before = useScaleIn(60, 14);
  const after = useScaleIn(130, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="'WILL USERS NOTICE?'" />
          <Badge num="5" emoji="🟠" name="TỐI ƯU 3 NGÀY BẾ QUAN" color={ORANGE} entry={15} />
          <g style={{ ...before, transformOrigin: `${W / 2}px 460px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={420} width={840} height={80} rx={12} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={470} fontSize={34} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>⏱️ 2 GIÂY 🐌</text>
          </g>
          <text x={W / 2} y={555} fontSize={34} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={useFade(110, 12)}>↓ tối ưu ↓</text>
          <g style={{ ...after, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={600} width={840} height={80} rx={12} fill={BG_CARD} stroke={JADE} strokeWidth={3} />
            <text x={W / 2} y={650} fontSize={34} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>⚡ 50 mili-giây 🚀 (nhanh 40×)</text>
          </g>
          <Quote y={740} speaker="👔 PM" text="'Người dùng có nhận ra không em?' 😶" color={VIOLET} entry={200} size={28} />
          <Conseq y={880} color={WARNING_RED} lines={[{ t: "mọi công đức vừa tích lũy", c: TEXT_PRI }, { t: "tan biến giữa thiên địa 🌫️", c: AMBER_BRIGHT, size: 34 }]} entry={300} />
          <FigFooter label="kk 5 · tối ưu mà không ai biết ơn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 M6 TEST LOCAL ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const timeline = [
    { t: "1 giờ sau", d: "Production bắt đầu độ kiếp", c: ORANGE, e: 110 },
    { t: "2 giờ sau", d: "Rollback Đại Trận kích hoạt", c: WARNING_RED, e: 170 },
    { t: "3 giờ sau", d: "công đức cả Sprint hóa hư vô", c: "#FF3B3B", e: 230 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="'WORKS ON MY MACHINE'" />
          <Badge num="6" emoji="🔴" name="'EM TEST LOCAL RỒI'" color={WARNING_RED} entry={15} />
          <Quote y={430} speaker="😎 ĐỒNG MÔN" text="'Em test local rồi mà.'" color={ORANGE} entry={45} />
          {timeline.map((t, i) => {
            const a = useScaleIn(t.e, 12);
            const y = 560 + i * 130;
            return (
              <g key={i} style={{ ...a, transformOrigin: `${W / 2}px ${y + 50}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 440} y={y} width={880} height={100} rx={12} fill={BG_CARD} stroke={t.c} strokeWidth={2.5} />
                <text x={W / 2 - 410} y={y + 60} fontSize={30} fill={t.c} fontFamily="'JetBrains Mono', monospace" fontWeight={800}>{t.t}</text>
                <text x={W / 2 - 220} y={y + 60} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t.d}</text>
              </g>
            );
          })}
          <FigFooter label="kk 6 · local chạy ≠ prod chạy" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 M7 SELECT STAR ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const term = useScaleIn(110, 14);
  const punch = useScaleIn(330, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE QUERY OF DOOM" />
          <Badge num="7" emoji="⚫" name="DATABASE CPU 100%" color={WARNING_RED} entry={15} />
          <text x={W / 2} y={440} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(50, 12)}>cả team hoảng loạn · Backend mở query lên…</text>
          <g style={{ ...term, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={500} width={880} height={300} rx={12} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={2.5} />
            <rect x={W / 2 - 440} y={500} width={880} height={46} rx={12} fill={BG_CARD} />
            <text x={W / 2} y={530} fontSize={17} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>⚠ slow query log</text>
            <text x={W / 2 - 410} y={600} fontSize={40} fill="#FF5252" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>SELECT *</text>
            {["✗ không WHERE", "✗ không LIMIT", "✗ không INDEX"].map((l, i) => (
              <text key={i} x={W / 2 - 410} y={660 + i * 46} fontSize={30} fill={AMBER_BRIGHT} fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={frame > 170 + i * 25 ? 1 : 0}>{l}</text>
            ))}
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 900px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={840} w={940} h={120} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={912} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">1 câu query · prod vào ĐỘ KIẾP CẢNH ⚡</text>
          </g>
          <FigFooter label="kk 7 · select sao · quét cả bảng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 M8 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const not = useFadeUp(40, 12);
  const sleep = useScaleIn(120, 14);
  const msg = useScaleIn(230, 14);
  const doom = useScaleIn(450, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE FINAL TRIBULATION" />
          <g style={not}>
            <text x={W / 2} y={280} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">Đáng sợ nhất · không phải bug / prod / database…</text>
          </g>
          <text x={W / 2} y={360} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={sleep}>… mà là khi ngươi chuẩn bị đi ngủ 😴</text>
          <g style={{ ...msg, transformOrigin: `${W / 2}px 600px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={430} width={880} height={340} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={2.5} />
            <rect x={W / 2 - 440} y={430} width={880} height={52} rx={16} fill={BG_CARD} />
            <text x={W / 2 - 405} y={462} fontSize={32} textAnchor="middle">📱</text>
            <text x={W / 2 - 370} y={464} fontSize={20} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>điện thoại rung lúc 11:47 PM…</text>
            <rect x={W / 2 - 405} y={520} width={420} height={62} rx={14} fill="#2A1818" />
            <text x={W / 2 - 380} y={560} fontSize={30} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"Anh ơi 🥺"</text>
            <rect x={W / 2 - 405} y={596} width={810} height={130} rx={14} fill="#2A1818" />
            <text x={W / 2 - 380} y={640} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"Khách hàng bảo dữ liệu</text>
            <text x={W / 2 - 380} y={682} fontSize={28} fill={AMBER_BRIGHT} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>hơi lạ..." 👁️</text>
          </g>
          <g style={{ ...doom, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={800} w={940} h={170} color={AMBER} thick={3} />
            <text x={W / 2} y={858} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đêm nay · lại có người lấy tuổi thọ trả nghiệp</text>
            <text x={W / 2} y={920} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">và thiên kiếp… vừa mới bắt đầu 🌩️</text>
          </g>
          <FigFooter label="kk cuối · tin nhắn lúc nửa đêm" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

export const BackendTamMa: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("backend_tam_ma/voice.mp3")} />
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
