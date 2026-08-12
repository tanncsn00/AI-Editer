import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./http_sjwt_beats.json";
import T from "./http_sjwt_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "11";

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

// SESSION = trưởng lão cẩn trọng (xanh) · JWT = kiếm tu tiêu dao (amber)
const SESS = ACCENT_BLUE;
const JWTC = AMBER;

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
          <pattern id="sjgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="sjgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="sjglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.1" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sjscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#sjgrid)" />
        <rect width={W} height={H} fill="url(#sjgrid2)" />
        <rect width={W} height={H} fill="url(#sjglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#sjscan)" />
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
      <text x={W / 2} y={cy - 28} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>《{cn}》</text>
      <text x={W / 2} y={cy + 30} fontSize={48} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">{en}</text>
      {sub && <text x={W / 2} y={cy + 66} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};
const KiepTag: React.FC<{ y: number; n: string; name: string; entry: number }> = ({ y, n, name, entry }) => {
  const a = useScaleIn(entry, 12);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 50}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 430} y={y} width={860} height={100} rx={14} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3} />
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
        <SectionHeader num="00" label="HTTP ĐẠO · THIÊN KIẾP" />
        <g transform="translate(0, 300)">
        <g style={useFadeUp(8, 12)}>
          <text x={W / 2} y={270} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">🏯 HTTP ĐẠO</text>
          <text x={W / 2} y={350} fontSize={62} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">SESSION hay JWT?</text>
        </g>
        <g style={useScaleIn(T.HOOK.fish, 14)}>
          <rect x={W / 2 - 480} y={420} width={960} height={130} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
          <text x={W / 2} y={470} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>HTTP · một sinh vật kỳ lạ:</text>
          <text x={W / 2} y={518} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">trí nhớ ngắn hơn cả cá vàng 🐟</text>
        </g>
        <g style={useScaleIn(T.HOOK.stranger, 14)}>
          <rect x={W / 2 - 490} y={580} width={980} height={160} rx={18} fill={BG_TERM} stroke={TEXT_MUTE} strokeWidth={3} />
          <text x={W / 2} y={632} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>ngươi vừa đăng nhập · request sau quay lại:</text>
          <text x={W / 2} y={690} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Ngươi là ai? Ta từng gặp ngươi sao?" 💀</text>
        </g>
        <text x={W / 2} y={810} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={useScaleIn(T.HOOK.twice, 12)}>ta đi qua hai đại đạo · đạo tâm sụp đổ hai lần</text>
        </g>
        <FigFooter label="để server NHỚ được ngươi · giang hồ chia hai phái" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S2 SESSION_IN ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const steps = ["📖 server ghi tên ngươi vào SỔ VÀNG", "🎟️ phát cho ngươi một mảnh lệnh bài", "🔁 lần sau chìa bài → lật sổ \"à, ta nhớ\""];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={SESS} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="ĐẠO ① · SESSION" />
          <g transform="translate(0, 330)">
          <Hero cy={250} cn="Server Giữ Sổ Đạo" en="SESSION" sub="// phái cổ xưa · chính thống · uy tín" color={SESS} entry={T.SESSION_IN.hero} />
          <g>
            {steps.map((t, i) => (
              <g key={i} style={useScaleIn((T.SESSION_IN.steps as number[])[i], 10)}>
                <rect x={W / 2 - 460} y={400 + i * 92} width={920} height={78} rx={12} fill={BG_CARD} stroke={SESS} strokeWidth={2} />
                <text x={W / 2} y={448 + i * 92} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.SESSION_IN.peace, 14)}>
            <rect x={W / 2 - 470} y={720} width={940} height={110} rx={16} fill={BG_TERM} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={788} fontSize={32} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">ba năm thái bình · ta tưởng đã đắc đạo 🍵</text>
          </g>
          </g>
          <FigFooter label="Session · server nhớ ngươi, client chỉ cầm thẻ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 SESSION_KIEP ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const curses = ["\"vừa đăng nhập · sao bắt đăng nhập lại?\"", "\"giỏ hàng của ta đâu?\"", "\"ta vừa thanh toán cơ mà?\""];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="THIÊN KIẾP ① · MỞ RỘNG" />
          <g transform="translate(0, 330)">
          <KiepTag y={195} n="THIÊN KIẾP CỦA SESSION" name="Phân Thân Thất Sổ Kiếp" entry={T.SESSION_KIEP.kiep} />
          <text x={W / 2} y={355} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useScaleIn(T.SESSION_KIEP.overload, 12)}>điện quá tải → mở thêm 9 đại điện → ta đắc ý 😎</text>
          <g>
            {curses.map((t, i) => (
              <g key={i} style={useScaleIn((T.SESSION_KIEP.curses as number[])[i], 9)}>
                <rect x={W / 2 - 470} y={385 + i * 76} width={940} height={64} rx={11} fill={BG_RED} stroke={WARNING_RED} strokeWidth={2} />
                <text x={W / 2} y={427 + i * 76} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.SESSION_KIEP.lost, 14)}>
            <rect x={W / 2 - 490} y={625} width={980} height={130} rx={16} fill={BG_CARD} stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2} y={673} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đăng nhập điện 3 · sáng lạc sang điện 7 · sổ trống trơn:</text>
            <text x={W / 2} y={723} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Ngươi là ai?" 💀</text>
          </g>
          <text x={W / 2} y={815} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.SESSION_KIEP.tensbooks, 12)}>mười đại điện = mười cuốn sổ · không ai biết đệ tử của ai</text>
          </g>
          <FigFooter label="scale nhiều server · sổ không chia được" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 REDIS ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={JADE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="03" label="VÁ TẠM · REDIS" />
        <g transform="translate(0, 330)">
        <Hero cy={300} cn="Vạn Điện Đồng Sổ Các" en="REDIS" sub="// một sổ chung cho mọi điện" color={JADE} entry={T.REDIS.hero} />
        <g style={useScaleIn(T.REDIS.cost, 14)}>
          <rect x={W / 2 - 480} y={450} width={960} height={140} rx={16} fill={BG_CARD} stroke={ORANGE} strokeWidth={2.5} />
          <text x={W / 2} y={500} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>tạm qua kiếp · nhưng cái giá:</text>
          <text x={W / 2} y={552} fontSize={31} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">điện nào cũng phải chạy tới hỏi Các · mỗi lần 🏃</text>
        </g>
        <g style={useScaleIn(T.REDIS.rumor, 14)}>
          <rect x={W / 2 - 490} y={640} width={980} height={160} rx={18} fill={BG_TERM} stroke={JWTC} strokeWidth={4} />
          <text x={W / 2} y={692} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ngay lúc ấy · giang hồ đồn đại một tà đạo mới nổi:</text>
          <text x={W / 2} y={755} fontSize={46} fill={JWTC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">JWT ĐẠO 👀</text>
        </g>
        </g>
        <FigFooter label="Redis store · cứu scale, nhưng cả tông môn lệ thuộc 1 nơi" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 JWT_IN ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={JWTC} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="04" label="ĐẠO ② · JWT" />
        <g transform="translate(0, 330)">
        <g style={useScaleIn(T.JWT_IN.claim, 13)}>
          <rect x={W / 2 - 480} y={200} width={960} height={96} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
          <text x={W / 2} y={258} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"Server không cần nhớ ai cả" 😱</text>
        </g>
        <Hero cy={400} cn="Tín Bài Tự Chứng Đạo" en="JWT" sub="// đốt sổ · khắc thân phận lên tín bài" color={JWTC} entry={T.JWT_IN.hero} />
        <g style={useScaleIn(T.JWT_IN.contrast, 14)}>
          <rect x={W / 2 - 470} y={540} width={460} height={96} rx={12} fill={BG_TERM} stroke={SESS} strokeWidth={2.5} />
          <text x={W / 2 - 240} y={588} fontSize={26} fill={SESS} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>SESSION</text>
          <text x={W / 2 - 240} y={620} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>giữ sổ 📖</text>
          <rect x={W / 2 + 10} y={540} width={460} height={96} rx={12} fill={BG_TERM} stroke={JWTC} strokeWidth={2.5} />
          <text x={W / 2 + 240} y={588} fontSize={26} fill={JWTC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>JWT</text>
          <text x={W / 2 + 240} y={620} fontSize={24} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đốt sổ 🔥</text>
        </g>
        <g style={useScaleIn(T.JWT_IN.freedom, 14)}>
          <rect x={W / 2 - 490} y={670} width={980} height={150} rx={18} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
          <text x={W / 2} y={722} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>điện 3 · điện 7 · điện 100 → chỉ nhìn dấu ấn</text>
          <text x={W / 2} y={780} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">khỏi tra sổ · khỏi hỏi ai · khỏi nhớ gì 🤩</text>
        </g>
        </g>
        <FigFooter label="JWT · token tự chứng, server stateless không cần nhớ" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 JWT_KIEP ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const mirror = ["Ta nhìn hắn.", "Hắn nhìn ta.", "Ta biết hắn là phản đồ.", "Hắn cũng biết ta biết."];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="THIÊN KIẾP ② · THU HỒI" />
          <g transform="translate(0, 330)">
          <KiepTag y={185} n="THIÊN KIẾP CỦA JWT" name="Phản Đồ Bất Tử Kiếp" entry={T.JWT_KIEP.kiep} />
          <g style={useScaleIn(T.JWT_KIEP.order, 13)}>
            <rect x={W / 2 - 480} y={310} width={960} height={120} rx={16} fill={BG_CARD} stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2} y={358} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"Lập tức trục xuất!" →</text>
            <text x={W / 2} y={404} fontSize={31} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"Bẩm... tín bài vẫn còn hiệu lực" 💀</text>
          </g>
          <g>
            {mirror.map((t, i) => (
              <g key={i} opacity={useFade((T.JWT_KIEP.mirror as number[])[i], 8)}>
                <text x={W / 2} y={480 + i * 52} fontSize={30} fill={i < 2 ? TEXT_SEC : TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={i < 2 ? 600 : 800} fontStyle="italic">{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.JWT_KIEP.truth, 14)}>
            <rect x={W / 2 - 490} y={710} width={980} height={130} rx={18} fill={BG_TERM} stroke={JWTC} strokeWidth={4} />
            <text x={W / 2} y={758} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>JWT mạnh nhất lúc PHÁT RA</text>
            <text x={W / 2} y={805} fontSize={33} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">yếu nhất lúc muốn THU VỀ 🫠</text>
          </g>
          </g>
          <FigFooter label="token phát ra rồi · không revoke được tới khi hết hạn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 BLACKLIST ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const loop = ["muốn chặn tín bài → server phải NHỚ", "muốn nhớ → phải GHI SỔ", "muốn ghi sổ → quay về SESSION"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="VÁ JWT · NGHỊCH LÝ" />
          <g transform="translate(0, 330)">
          <g style={useScaleIn(T.BLACKLIST.name, 14)}>
            <rect x={W / 2 - 470} y={250} width={940} height={130} rx={16} fill={BG_RED} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={300} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta lập 《 Hắc Danh Đơn 》 phong sát tín bài phản đồ:</text>
            <text x={W / 2} y={350} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>blacklist</text>
          </g>
          <g>
            {loop.map((t, i) => (
              <g key={i} style={useScaleIn((T.BLACKLIST.loop as number[])[i], 10)}>
                <rect x={W / 2 - 470} y={430 + i * 90} width={940} height={76} rx={12} fill={BG_CARD} stroke={i === 2 ? SESS : ORANGE} strokeWidth={2.5} />
                <text x={W / 2} y={477 + i * 90} fontSize={28} fill={i === 2 ? SESS : TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.BLACKLIST.selfdestroy, 14)}>
            <rect x={W / 2 - 490} y={730} width={980} height={110} rx={18} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={4} />
            <text x={W / 2} y={798} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">ta tự tay phá mất đạo của chính mình 🤡</text>
          </g>
          </g>
          <FigFooter label="muốn revoke JWT → buộc phải stateful → mất chính JWT" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 HOPNHAT ============
const S8: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={JADE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="07" label="ĐẠI ĐẠO HỢP NHẤT" />
        <g transform="translate(0, 330)">
        <text x={W / 2} y={235} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useScaleIn(T.HOPNHAT.elder, 12)}>tiền bối cười: "ngươi quá chấp niệm · sao cứ phải chọn một?"</text>
        <g style={useScaleIn(T.HOPNHAT.access, 14)}>
          <rect x={W / 2 - 490} y={290} width={980} height={150} rx={16} fill={BG_TERM} stroke={JWTC} strokeWidth={3.5} />
          <text x={W / 2} y={342} fontSize={34} fill={JWTC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">ACCESS TOKEN</text>
          <text x={W / 2} y={388} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>sống ngắn · đi nhanh</text>
          <text x={W / 2} y={422} fontSize={23} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>mang phong thái JWT · lộ ra cũng chẳng kịp hại</text>
        </g>
        <g style={useScaleIn(T.HOPNHAT.refresh, 14)}>
          <rect x={W / 2 - 490} y={460} width={980} height={150} rx={16} fill={BG_TERM} stroke={SESS} strokeWidth={3.5} />
          <text x={W / 2} y={512} fontSize={34} fill={SESS} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">REFRESH TOKEN</text>
          <text x={W / 2} y={558} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>sống dài · nằm trong tay server</text>
          <text x={W / 2} y={592} fontSize={23} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>mang chân ý Session · cần phế ai → xóa một dòng</text>
        </g>
        <g style={useScaleIn(T.HOPNHAT.merge, 14)}>
          <rect x={W / 2 - 490} y={640} width={980} height={150} rx={18} fill={BG_CARD} stroke={JADE} strokeWidth={4} />
          <text x={W / 2} y={695} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tốc độ của JWT</text>
          <text x={W / 2} y={750} fontSize={33} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">ghép quyền sinh sát của Session 🔥</text>
        </g>
        </g>
        <FigFooter label="thực chiến: Access (JWT ngắn hạn) + Refresh (server giữ)" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S9 NGODAO ============
const S9: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={VIOLET} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="08" label="NGỘ ĐẠO · HAI TÍNH CÁCH" />
        <g transform="translate(0, 330)">
        <g style={useScaleIn(T.NGODAO.sess, 14)}>
          <rect x={W / 2 - 490} y={240} width={980} height={170} rx={16} fill={BG_TERM} stroke={SESS} strokeWidth={3.5} />
          <text x={W / 2} y={292} fontSize={30} fill={SESS} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>SESSION · vị trưởng lão cẩn trọng 🧓</text>
          <text x={W / 2} y={342} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhớ mọi đệ tử</text>
          <text x={W / 2} y={384} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">nhưng càng đông người · càng nặng nề</text>
        </g>
        <g style={useScaleIn(T.NGODAO.jwt, 14)}>
          <rect x={W / 2 - 490} y={440} width={980} height={170} rx={16} fill={BG_TERM} stroke={JWTC} strokeWidth={3.5} />
          <text x={W / 2} y={492} fontSize={30} fill={JWTC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>JWT · vị kiếm tu tiêu dao 🗡️</text>
          <text x={W / 2} y={542} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đi khắp thiên hạ · không một ràng buộc</text>
          <text x={W / 2} y={584} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">nhưng bắt hắn quay đầu · khó như lên trời</text>
        </g>
        <g style={useScaleIn(T.NGODAO.tradeoff, 14)}>
          <rect x={W / 2 - 490} y={650} width={980} height={160} rx={18} fill={BG_CARD} stroke={AMBER} strokeWidth={4} />
          <text x={W / 2} y={702} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>mọi công pháp trên đời · đều là TRAO ĐỔI</text>
          <text x={W / 2} y={762} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">lấy được thứ gì · phải trả bằng thứ khác ⚖️</text>
        </g>
        </g>
        <FigFooter label="không có đạo hoàn mỹ · chỉ có đạo hợp cảnh" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S10 DAOLY ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="ĐẠO LÝ · CHÂN TƯỚNG" />
          <g transform="translate(0, 330)">
          <g style={useScaleIn(T.DAOLY.question, 13)}>
            <rect x={W / 2 - 480} y={250} width={960} height={130} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2.5} />
            <text x={W / 2} y={300} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"Session hay JWT mạnh hơn?"</text>
            <text x={W / 2} y={350} fontSize={34} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ ĐÓ LÀ CÂU HỎI SAI 💥</text>
          </g>
          <g style={useScaleIn(T.DAOLY.neither, 14)}>
            <rect x={W / 2 - 480} y={420} width={960} height={130} rx={16} fill={BG_TERM} stroke={SESS} strokeWidth={2.5} />
            <text x={W / 2} y={470} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không phái nào muốn thắng phái nào</text>
            <text x={W / 2} y={518} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">chúng sinh ra · giải những nhân quả khác nhau</text>
          </g>
          <g style={useScaleIn(T.DAOLY.aphorism, 16)}>
            <rect x={W / 2 - 500} y={600} width={1000} height={210} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={5} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={668} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>⚡ các đại năng Web Đạo thường nói:</text>
            <text x={W / 2} y={728} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Kẻ yếu chọn CÔNG PHÁP</text>
            <text x={W / 2} y={782} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Kẻ mạnh chọn BÀI TOÁN</text>
          </g>
          </g>
          <FigFooter label="chọn theo trận thế · không theo lời đồn" />
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
            <text x={W / 2} y={450} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Ngươi đang tu phái nào?</text>
            <text x={W / 2} y={512} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"đăng xuất rồi mà token vẫn sống"? 🫠</text>
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
          <text x={W / 2} y={950} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(132, 12)}>nghe tiếp truyền kỳ chốn công sở 🏯</text>
          </g>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11];

export const HttpSessionJwt: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("http_sjwt/voice.mp3")} />
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
