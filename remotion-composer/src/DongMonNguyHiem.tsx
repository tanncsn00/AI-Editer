import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./dong_mon_nguy_hiem_beats.json";

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

const BlueprintBG: React.FC<{ glow?: string }> = ({ glow = WARNING_RED }) => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="dmgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="dmgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="dmglow" cx="50%" cy="36%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.08" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dmscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#dmgrid)" />
        <rect width={W} height={H} fill="url(#dmgrid2)" />
        <rect width={W} height={H} fill="url(#dmglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#dmscan)" />
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

// persona badge: LOẠI N + emoji + name
const Badge: React.FC<{ num: string; emoji: string; name: string; color: string; entry: number }> = ({ num, emoji, name, color, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px 330px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 130} y={250} width={260} height={62} rx={31} fill={color} />
      <text x={W / 2} y={291} fontSize={30} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">LOẠI {num}</text>
      <text x={W / 2} y={392} fontSize={70} textAnchor="middle">{emoji}</text>
      <text x={W / 2} y={460} fontSize={(name || "").length > 18 ? 40 : 48} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{name}</text>
    </g>
  );
};

// quote bubble
const Quote: React.FC<{ y: number; text: string; color: string; entry: number; size?: number }> = ({ y, text, color, entry, size = 32 }) => {
  const a = useScaleIn(entry, 12);
  const w = 880;
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 35}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - w / 2} y={y} width={w} height={70} rx={14} fill={BG_CARD} stroke={color} strokeWidth={2} />
      <text x={W / 2 - w / 2 + 26} y={y + 46} fontSize={size} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 "{text}"</text>
    </g>
  );
};

const Conseq: React.FC<{ y: number; color: string; lines: { t: string; c?: string; size?: number }[]; entry: number }> = ({ y, color, lines, entry }) => {
  const a = useScaleIn(entry, 14);
  const h = 64 + lines.length * 52;
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <TechBox x={W / 2 - 470} y={y} w={940} h={h} color={color} thick={2.5} />
      <text x={W / 2} y={y + 42} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// ⚠ hậu quả</text>
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={y + 88 + i * 52} fontSize={l.size || 32} fill={l.c || TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={l.c === AMBER_BRIGHT ? 900 : 700} fontStyle={l.c === AMBER_BRIGHT ? "italic" : "normal"}>{l.t}</text>
      ))}
    </g>
  );
};

// reusable type slide
const TypeSlide: React.FC<{
  duration: number; num: string; sec: string; emoji: string; name: string; color: string;
  quotes: string[]; quoteSize?: number; conseq: { t: string; c?: string; size?: number }[]; conseqY: number; fig: string;
}> = ({ duration, num, sec, emoji, name, color, quotes, quoteSize, conseq, conseqY, fig }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={color} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num={num} label={sec} />
        <Badge num={`${parseInt(num) - 1}`} emoji={emoji} name={name} color={color} entry={15} />
        {quotes.map((q, i) => (
          <Quote key={i} y={520 + i * 86} text={q} color={color} entry={75 + i * 45} size={quoteSize} />
        ))}
        <Conseq y={conseqY} color={WARNING_RED} lines={conseq} entry={75 + quotes.length * 45 + 50} />
        <FigFooter label={fig} />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const cond = [
    { t: "⏰ deadline sắp giáng lâm", e: 70 },
    { t: "🚀 release chuẩn bị xuất thế", e: 110 },
    { t: "🧘 cả tông môn cố bình an vượt kiếp", e: 150 },
  ];
  const title = useScaleIn(14, 16);
  const warn = useScaleIn(230, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="SPRINT CUỐI · DANGER ZONE" />
          <g style={{ ...title, transformOrigin: `${W / 2}px 320px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={300} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>7 LOẠI ĐỒNG MÔN</text>
            <text x={W / 2} y={372} fontSize={64} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>NGUY HIỂM NHẤT</text>
            <text x={W / 2} y={432} fontSize={36} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>… những ngày cuối SPRINT</text>
          </g>
          <text x={W / 2} y={540} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(50, 12)}>khi deadline tới gần…</text>
          {cond.map((c, i) => (
            <g key={i} opacity={useFade(c.e, 10)}>
              <rect x={W / 2 - 380} y={580 + i * 86} width={760} height={70} rx={10} fill={BG_CARD} stroke={ORANGE} strokeWidth={1.5} />
              <text x={W / 2} y={624 + i * 86} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{c.t}</text>
            </g>
          ))}
          <g style={{ ...warn, transformOrigin: `${W / 2}px 940px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={870} w={940} h={150} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={930} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>sẽ xuất hiện đồng môn nguy hiểm…</text>
            <text x={W / 2} y={985} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">chỉ mở miệng · cả dự án dao động ⚡</text>
          </g>
          <FigFooter label="7 tâm ma · ẩn trong chính tông môn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="02" sec="SCOPE CREEP" emoji="🙂" name="'CHỈ THÊM MỘT CHÚT'" color={SLATE}
    quotes={["Hay thêm cái này luôn đi", "Tiện thêm cái kia luôn đi", "Đằng nào cũng đang làm mà"]} quoteSize={28}
    conseq={[{ t: "feature 1 tuần → gặp loại này →", c: TEXT_PRI }, { t: "luân hồi vô tận, không hồi kết 🔁", c: AMBER_BRIGHT, size: 34 }]} conseqY={800} fig="loại 1 · scope creep · cái hố không đáy" />
);
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="03" sec="LAST-MINUTE IDEA" emoji="💡" name="'EM VỪA CÓ Ý TƯỞNG'" color={JADE}
    quotes={["Sprint còn 2 ngày…", "Em vừa có một ý tưởng 💡"]}
    conseq={[{ t: "PM xuất hiện tâm ma · Tech Lead tụng chú", c: TEXT_PRI, size: 28 }, { t: "sprint hiện tại → chuyển sang KIẾP SAU 💀", c: AMBER_BRIGHT, size: 32 }]} conseqY={780} fig="loại 2 · ý tưởng phút 89" />
);
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="04" sec="'WHILE I'M AT IT'" emoji="🔧" name="'NHÂN TIỆN'" color={ACCENT_BLUE}
    quotes={["Nhân tiện em refactor luôn", "Nhân tiện em tối ưu luôn", "Nhân tiện em sửa architecture luôn"]} quoteSize={28}
    conseq={[{ t: "rất nhiều thiên kiếp production", c: TEXT_PRI }, { t: "đều bắt đầu từ 1 chữ: 'Tiện' 🌀", c: AMBER_BRIGHT, size: 34 }]} conseqY={800} fig="loại 3 · 'tiện tay' phá cả hệ thống" />
);
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="05" sec="THE FORBIDDEN SPELL" emoji="😅" name="'CHẮC KHÔNG SAO ĐÂU'" color={VIOLET}
    quotes={["Chắc không sao đâu 😅"]}
    conseq={[{ t: "Monitoring rung động · Grafana dị tượng", c: TEXT_PRI, size: 28 }, { t: "Cloud Provider âm thầm mỉm cười 💸", c: AMBER_BRIGHT, size: 32 }]} conseqY={720} fig="loại 4 · cấm chú nổi tiếng nhất software đạo" />
);
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="06" sec="'I TESTED IT'" emoji="😎" name="'EM TEST RỒI'" color={ORANGE}
    quotes={["Em test kỹ rồi", "Không thể có bug"]}
    conseq={[{ t: "3 phút sau · QA tìm ra lỗi", c: TEXT_PRI }, { t: "10 phút sau · khách tìm lỗi thứ 2 · prod phi thăng 🔥", c: AMBER_BRIGHT, size: 28 }]} conseqY={780} fig="loại 5 · 'works on my machine'" />
);
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="07" sec="'QUICK DEPLOY'" emoji="🚀" name="'DEPLOY NHANH THÔI'" color={WARNING_RED}
    quotes={["Deploy nhanh thôi anh 🚀"]}
    conseq={[{ t: "câu cuối trước khi thức tới 2h sáng", c: TEXT_PRI, size: 28 }, { t: "'deploy nhanh' = 'độ kiếp nhanh' ⚡", c: AMBER_BRIGHT, size: 32 }]} conseqY={720} fig="loại 6 · deploy nhanh · hối hận lâu" />
);

// ============ S8 LOẠI CUỐI · CHÍNH NGƯƠI ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const badge = useScaleIn(15, 14);
  const mirror = useScaleIn(80, 14);
  const commits = useScaleIn(160, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE FINAL BOSS" />
          <g style={{ ...badge, transformOrigin: `${W / 2}px 300px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 180} y={250} width={360} height={62} rx={31} fill="#2A2A2A" stroke={AMBER} strokeWidth={2} />
            <text x={W / 2} y={291} fontSize={28} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🏴 LOẠI CUỐI</text>
            <text x={W / 2} y={380} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">đáng sợ nhất · không phải ai kể trên…</text>
          </g>
          <g style={{ ...mirror, transformOrigin: `${W / 2}px 520px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 300} y={430} width={600} height={180} rx={16} fill={BG_CARD} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={510} fontSize={70} textAnchor="middle">🪞</text>
            <text x={W / 2} y={575} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>… mà là CHÍNH NGƯƠI</text>
          </g>
          <g style={{ ...commits, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={670} width={880} height={290} rx={12} fill={BG_TERM} stroke={AMBER} strokeWidth={2} />
            <rect x={W / 2 - 440} y={670} width={880} height={46} rx={12} fill={BG_CARD} />
            <text x={W / 2} y={700} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>bash — git log</text>
            <text x={W / 2 - 410} y={762} fontSize={30} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>kẻ đã nói: "Xong rồi." ✓</text>
            {["a1f · fix", "b2e · fix again", "c3d · really fix", "...×12 commits sau đó 😶"].map((c, i) => (
              <text key={i} x={W / 2 - 410} y={812 + i * 38} fontSize={24} fill={i === 3 ? AMBER_BRIGHT : TEXT_MUTE} fontFamily="'JetBrains Mono', monospace" fontWeight={i === 3 ? 800 : 500} opacity={frame > 200 + i * 12 ? 1 : 0}>{c}</text>
            ))}
          </g>
          <FigFooter label="loại cuối · kẻ thù lớn nhất là bản thân" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(20, 14);
  const not = useFadeUp(90, 12);
  const truth = useScaleIn(180, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE VERDICT" />
          <text x={W / 2} y={360} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>Sprint cuối…</text>
          <g style={not}>
            <text x={W / 2} y={440} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} textDecoration="line-through">không phải thời gian</text>
            <text x={W / 2} y={490} fontSize={34} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} textDecoration="line-through">hoàn thành công việc</text>
          </g>
          <g style={{ ...truth, transformOrigin: `${W / 2}px 700px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={580} w={940} h={250} color={AMBER} thick={3} />
            <text x={W / 2} y={645} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// mà là thời gian để thiên hạ thấy:</text>
            <text x={W / 2} y={720} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AI mới thật sự là</text>
            <text x={W / 2} y={788} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">TÂM MA của dự án 👹</text>
          </g>
          <FigFooter label="sprint cuối · phơi bày bản chất mỗi người" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 CTA ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const ask = useScaleIn(20, 16);
  const confess = useFadeUp(120, 14);
  const cta = useScaleIn(230, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="JOIN THE LEGEND" />
          <g style={{ ...ask, transformOrigin: `${W / 2}px 380px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={340} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Còn ngươi…</text>
            <text x={W / 2} y={410} fontSize={42} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>là loại đồng môn thứ mấy? 👀</text>
          </g>
          <g style={confess}>
            <rect x={W / 2 - 440} y={500} width={880} height={120} rx={14} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={560} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Thành thật khai báo ở phần bình luận 👇</text>
            <text x={W / 2} y={600} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">(loại 7 thì auto report nhé 😏)</text>
          </g>
          <g style={{ ...cta, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 380} y={700} width={760} height={110} rx={55} fill={AMBER} />
            <text x={W / 2} y={768} fontSize={38} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>❤️ THEO DÕI bần đạo</text>
          </g>
          <text x={W / 2} y={880} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} style={useFadeUp(300, 12)}>để nghe tiếp những truyền kỳ giới IT 🏯</text>
          <text x={W / 2} y={960} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2" style={useFadeUp(330, 12)}>comment · save · share · truyền kỳ giới IT</text>
          <FigFooter label="mỗi tuần · một truyền kỳ giới IT" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const DongMonNguyHiem: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("dong_mon_nguy_hiem/voice.mp3")} />
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
