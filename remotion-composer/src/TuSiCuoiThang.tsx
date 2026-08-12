import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./tu_si_cuoi_thang_beats.json";
import T from "./tu_si_cuoi_thang_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "6";

// ===== PLUM / GOLD palette (distinct from navy series) =====
const BG_BASE = "#1A1330";
const BG_CARD = "#28204A";
const BG_TERM = "#130D26";
const GRID = "#FFFFFF";
const TEXT_PRI = "#F1ECFF";
const TEXT_SEC = "#C2B6E0";
const TEXT_MUTE = "#766596";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const ACCENT_BLUE = "#79C7FF";
const WARNING_RED = "#FF7B8E";
const JADE = "#5BE8A8";
const VIOLET = "#C79BFF";
const ORANGE = "#FFAE6B";

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

const BlueprintBG: React.FC<{ glow?: string }> = ({ glow = VIOLET }) => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="tscgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.07" />
          </pattern>
          <pattern id="tscgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.11" />
          </pattern>
          <radialGradient id="tscglow" cx="50%" cy="32%" r="62%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.13" />
            <stop offset="100%" stopColor={BG_BASE} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tscscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.07" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_BASE} />
        <rect width={W} height={H} fill="url(#tscgrid)" />
        <rect width={W} height={H} fill="url(#tscgrid2)" />
        <rect width={W} height={H} fill="url(#tscglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#tscscan)" />
        <g stroke={AMBER} strokeWidth={1.5} opacity={0.55}>
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
    <line x1={80} y1={H - 140} x2={W - 80} y2={H - 140} stroke={AMBER} strokeWidth={1} opacity={0.45} />
    <text x={W / 2} y={H - 110} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">{label}</text>
  </g>
);
const BrandMark: React.FC = () => (
  <text x={W / 2} y={H - 60} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · cuối tháng · blueprint</text>
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
const TypeTitle: React.FC<{ num: string; name: string; color: string; entry?: number }> = ({ num, name, color, entry = 8 }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px 250px`, transformBox: "fill-box" }}>
      <text x={80} y={130} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">[ {num} / {TOTAL} ]</text>
      <line x1={80} y1={150} x2={W - 80} y2={150} stroke={AMBER} strokeWidth={1} opacity={0.45} />
      <text x={W / 2} y={228} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="4">LOẠI THỨ {num}</text>
      <rect x={W / 2 - 480} y={258} width={960} height={96} rx={16} fill={BG_CARD} stroke={color} strokeWidth={3.5} />
      <text x={W / 2} y={320} fontSize={42} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{name}</text>
    </g>
  );
};
const Bubble: React.FC<{ y: number; sender: string; msg: string; color: string; entry: number; right?: boolean; big?: boolean; h?: number }> = ({ y, sender, msg, color, entry, right, big, h = 96 }) => {
  const a = useScaleIn(entry, 12);
  const bw = 900;
  const x = right ? W / 2 + 490 - bw : W / 2 - 490;
  const align = right ? "end" : "start";
  const tx = right ? x + bw - 36 : x + 36;
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <rect x={x} y={y} width={bw} height={h} rx={18} fill={right ? BG_TERM : BG_CARD} stroke={color} strokeWidth={right ? 3 : 2} />
      <text x={tx} y={y + 38} fontSize={21} fill={color} textAnchor={align} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{sender}</text>
      <text x={tx} y={y + (big ? 78 : 74)} fontSize={big ? 32 : 28} fill={right ? AMBER_BRIGHT : TEXT_PRI} textAnchor={align} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={right ? 900 : 700} fontStyle={right ? "italic" : "normal"}>{msg}</text>
    </g>
  );
};

// ============ S1 INTRO ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const weak = useScaleIn(T.INTRO.weak, 14);
  const day = useScaleIn(T.INTRO.day, 16);
  return (
    <AbsoluteFill style={{ background: BG_BASE }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <text x={80} y={130} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={useFadeUp(0, 10)}>[ 00 / {TOTAL} ]</text>
          <line x1={80} y1={150} x2={W - 80} y2={150} stroke={AMBER} strokeWidth={1} opacity={0.45} />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(20, 12)}>trong mỗi tông môn · đều có một ngày…</text>
          <g style={weak}>
            <rect x={W / 2 - 480} y={360} width={960} height={170} rx={18} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={418} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💎 linh thạch trong túi</text>
            <text x={W / 2} y={465} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🧘 đạo tâm trong người</text>
            <text x={W / 2} y={510} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cùng lúc SUY YẾU 💀</text>
          </g>
          <g style={{ ...day, transformOrigin: `${W / 2}px 680px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={590} width={840} height={170} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
            <text x={W / 2} y={650} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ngày đó · được gọi là…</text>
            <text x={W / 2} y={720} fontSize={72} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">CUỐI THÁNG</text>
          </g>
          <FigFooter label="6 loại tu sĩ khi ví cạn linh thạch" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 TYPE1 ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const want = useScaleIn(T.TYPE1.want, 14);
  const fall = useScaleIn(T.TYPE1.fall, 14);
  const BILLS = ["🏠 tiền nhà", "💡 tiền điện", "🚰 tiền nước", "🌐 tiền internet", "💳 tiền trả góp"];
  const BENTRY = T.TYPE1.bills;
  return (
    <AbsoluteFill style={{ background: BG_BASE }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="①" name="ẢO GIÁC ĐẮC ĐẠO" color={AMBER} />
          <g style={want}>
            <rect x={W / 2 - 480} y={410} width={960} height={120} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={462} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhìn số dư · tưởng sắp ĐẮC ĐẠO 🤑</text>
          </g>
          <text x={W / 2} y={505} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useScaleIn(T.TYPE1.muonAn, 12)}>muốn ăn thì ăn · muốn mua thì mua · muốn đặt thì đặt</text>
          <g>
            {BILLS.map((t, i) => {
              const row = Math.floor(i / 3), col = i % 3;
              const rowN = row === 0 ? 3 : 2;
              const cx = W / 2 - (rowN * 322 - 22) / 2 + 150 + col * 322;
              return (
                <g key={i} style={useScaleIn(BENTRY[i], 11)}>
                  <rect x={cx - 150} y={560 + row * 86} width={300} height={70} rx={11} fill="#2E1320" stroke={WARNING_RED} strokeWidth={2} />
                  <text x={cx} y={603 + row * 86} fontSize={24} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t} ✗</text>
                </g>
              );
            })}
          </g>
          <g style={{ ...fall, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={730} w={960} h={120} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={785} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>chỉ trong 3 ngày…</text>
            <text x={W / 2} y={828} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">từ HÓA THẦN rơi về Luyện Khí tầng 1 🤣</text>
          </g>
          <FigFooter label="lương về 1 ngày · các hoá đơn về cùng lúc" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 TYPE2 ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const open = useScaleIn(T.TYPE2.open, 14);
  const same = useScaleIn(T.TYPE2.same, 14);
  const hope = useScaleIn(T.TYPE2.hope, 14);
  const TIMES = ["🌅 sáng", "☀️ trưa", "🌇 chiều", "🌙 tối"];
  const TENTRY = T.TYPE2.times;
  return (
    <AbsoluteFill style={{ background: BG_BASE }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="②" name="QUAN TƯỞNG SỐ DƯ" color={ACCENT_BLUE} />
          <g style={open}>
            <rect x={W / 2 - 480} y={410} width={960} height={86} rx={14} fill={BG_TERM} stroke={ACCENT_BLUE} strokeWidth={2.5} />
            <text x={W / 2} y={462} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>📱 mở app ngân hàng 8 lần / ngày</text>
          </g>
          <g>
            {TIMES.map((t, i) => (
              <g key={i} style={useScaleIn(TENTRY[i], 11)}>
                <rect x={W / 2 - 470 + i * 235} y={520} width={215} height={86} rx={12} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={1.5} />
                <text x={W / 2 - 362 + i * 235} y={557} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
                <text x={W / 2 - 362 + i * 235} y={590} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>quan tưởng</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={680} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={{ ...same }}>số dư KHÔNG hề thay đổi · nhưng vẫn mở 💀</text>
          <g style={{ ...hope, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={730} width={960} height={110} rx={16} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={785} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>biết rõ sẽ không xảy ra…</text>
            <text x={W / 2} y={822} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">nhưng vẫn muốn HY VỌNG 🥹</text>
          </g>
          <FigFooter label="refresh số dư · phép màu không bao giờ tới" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 TYPE3 ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const beQuan = useScaleIn(T.TYPE3.beQuan, 14);
  const truth = useScaleIn(T.TYPE3.truth, 14);
  const NO = ["🍜 không nhận lời ăn uống", "☕ không nhận lời cà phê", "🎉 không nhận lời tụ tập"];
  const NENTRY = T.TYPE3.no;
  return (
    <AbsoluteFill style={{ background: BG_BASE }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="③" name="BẾ QUAN CHỜ PHÁT BỔNG" color={JADE} />
          <text x={W / 2} y={420} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(40, 12)}>từ ngày 25 trở đi:</text>
          <g>
            {NO.map((t, i) => (
              <g key={i} style={useScaleIn(NENTRY[i], 11)}>
                <rect x={W / 2 - 460} y={460 + i * 78} width={920} height={64} rx={11} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
                <text x={W / 2} y={502 + i * 78} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <Bubble y={710} sender="🧘 hắn (mỉm cười)" msg="Ta đang bế quan." color={JADE} entry={413} right big />
          <g style={truth}>
            <text x={W / 2} y={880} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">sự thật: tài khoản chỉ còn đủ duy trì SINH CƠ 💀</text>
          </g>
          <FigFooter label="'bận lắm' = 'hết tiền rồi'" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 TYPE4 ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const nice = useScaleIn(T.TYPE4.nice, 14);
  const but = useScaleIn(T.TYPE4.but, 14);
  return (
    <AbsoluteFill style={{ background: BG_BASE }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="④" name="VAY MƯỢN NHÂN DUYÊN" color={VIOLET} />
          <g style={useScaleIn(T.TYPE4.first, 14)}>
            <rect x={W / 2 - 480} y={420} width={960} height={120} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2} y={472} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>3 tuần đầu tháng:</text>
            <text x={W / 2} y={515} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>🐉 thần long thấy đầu không thấy đuôi</text>
          </g>
          <text x={W / 2} y={610} fontSize={28} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={{ ...nice }}>tuần cuối tháng · lại CỰC KỲ thân thiện 😇</text>
          <g style={{ ...but, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={650} width={960} height={210} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={700} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"Huynh đài… dạo này tu luyện thế nào?</text>
            <text x={W / 2} y={745} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đạo tâm còn vững chứ?</text>
            <text x={W / 2} y={812} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">À MÀ…" 💀</text>
          </g>
          <FigFooter label="3 chữ 'à mà' · báo hiệu sắp vay tiền" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 TYPE5 ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const truth = useScaleIn(T.TYPE5.truth, 14);
  const noodle = useScaleIn(T.TYPE5.noodle, 14);
  const OENTRY = T.TYPE5.order;
  return (
    <AbsoluteFill style={{ background: BG_BASE }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="⑤" name="NGỘ ĐẠO SAU LĨNH LƯƠNG" color={ORANGE} />
          <text x={W / 2} y={420} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(40, 12)}>cuối tháng than nghèo · than khổ · than thiên đạo bất công</text>
          <g style={{ ...truth, transformOrigin: `${W / 2}px 510px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={455} width={960} height={110} rx={16} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={505} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đúng ngày lĩnh lương · ngộ chân lý mới:</text>
            <text x={W / 2} y={545} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"TIỀN BẠC chỉ là vật ngoài thân" 🤣</text>
          </g>
          <g>
            {["🛒 1 canh giờ sau → ĐẶT HÀNG", "🛒 2 canh giờ sau → đặt thêm hàng"].map((t, i) => (
              <g key={i} style={useScaleIn(OENTRY[i], 11)}>
                <rect x={W / 2 - 460} y={600 + i * 76} width={920} height={62} rx={11} fill={BG_CARD} stroke={ORANGE} strokeWidth={1.5} />
                <text x={W / 2} y={640 + i * 76} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={820} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={{ ...noodle }}>3 ngày sau · lại hấp thu MÌ TÔM chi khí 🍜</text>
          <FigFooter label="lương về = quên sạch bài học tháng trước" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 TYPE6 ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const awaken = useScaleIn(T.TYPE6.awaken, 14);
  const plan = useScaleIn(T.TYPE6.plan, 14);
  const SKILL = ["🍚 1 bữa ăn → chia thành 2", "🍚 2 bữa ăn → kéo thành 3", "🚌 1 chuyến xe → đi bộ", "🧋 1 ly trà sữa → trì hoãn vài hôm"];
  const SENTRY = T.TYPE6.skills;
  return (
    <AbsoluteFill style={{ background: BG_BASE }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <TypeTitle num="⑥" name="KÉO DÀI THỌ NGUYÊN" color={WARNING_RED} />
          <g style={useScaleIn(T.TYPE6.box, 14)}>
            <rect x={W / 2 - 480} y={400} width={960} height={86} rx={14} fill="#2E1320" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={452} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>📅 ngày 28 · còn 300k · mà 3 ngày nữa mới có lương 💀</text>
          </g>
          <text x={W / 2} y={530} fontSize={26} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={{ ...awaken }}>→ VIỄN CỔ THẦN THÔNG thức tỉnh ✨</text>
          <g>
            {SKILL.map((t, i) => (
              <g key={i} style={useScaleIn(SENTRY[i], 11)}>
                <rect x={W / 2 - 470} y={560 + i * 68} width={940} height={56} rx={10} fill={BG_CARD} stroke={ORANGE} strokeWidth={1.5} />
                <text x={W / 2} y={597 + i * 68} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...plan, transformOrigin: `${W / 2}px 870px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={840} w={960} h={70} color={AMBER} thick={3} />
            <text x={W / 2} y={884} fontSize={29} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">100k → tính ra 81 PHƯƠNG ÁN sinh tồn 🤯</text>
          </g>
          <FigFooter label="nghèo sinh trí · 81 cách sống sót" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 MASTERY ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const skill = useScaleIn(T.MASTERY.skill, 14);
  const senior = useScaleIn(T.MASTERY.senior, 16);
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_BASE }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <text x={80} y={130} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={useFadeUp(0, 10)}>[ ⑥ · VIÊN MÃN ]</text>
          <line x1={80} y1={150} x2={W - 80} y2={150} stroke={AMBER} strokeWidth={1} opacity={0.45} />
          <g style={{ ...skill, transformOrigin: `${W / 2}px 380px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 490} y={280} width={980} height={200} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={345} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>chỉ trong 1 ĐÊM · lĩnh ngộ toàn bộ</text>
            <text x={W / 2} y={400} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">CÔNG PHÁP TIẾT KIỆM thất truyền 🔥</text>
            <text x={W / 2} y={448} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đạo tâm sáng tỏ · không tiêu 1 đồng dư thừa</text>
          </g>
          <g style={{ ...senior, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={560} width={960} height={200} rx={18} fill={BG_CARD} stroke={JADE} strokeWidth={3} />
            <text x={W / 2} y={625} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đến cả trưởng lão</text>
            <text x={W / 2} y={680} fontSize={40} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>KẾ TOÁN ĐẠO 📊</text>
            <text x={W / 2} y={730} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cũng phải gọi 1 tiếng TIỀN BỐI 🤣</text>
          </g>
          <FigFooter label="bậc thầy tiết kiệm · sinh ra từ túng thiếu" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 FINALE ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const not = useFadeUp(T.FINALE.not, 14);
  const truth = useScaleIn(T.FINALE.truth, 16);
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_BASE }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(20, 12)}>nhiều năm sau · các trưởng lão mới ngộ ra…</text>
          <text x={W / 2} y={400} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(T.FINALE.txt, 12)}>thứ biến mất NHANH NHẤT thế gian</text>
          <g style={not}>
            <text x={W / 2} y={490} fontSize={30} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>✗ không phải thanh xuân</text>
            <text x={W / 2} y={540} fontSize={30} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>✗ không phải tuổi trẻ</text>
          </g>
          <g style={{ ...truth, transformOrigin: `${W / 2}px 680px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 490} y={600} width={980} height={170} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={660} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà là…</text>
            <text x={W / 2} y={718} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">BỔNG LỘC vừa phát 3 NGÀY TRƯỚC 💀</text>
          </g>
          <FigFooter label="lương về như chưa từng về" />
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
  const cmt = useScaleIn(68, 14);
  const btn = useScaleIn(110, 14);
  const pulse = 1 + 0.03 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG_BASE }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <g style={ask}>
            <text x={W / 2} y={490} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Ngươi là loại tu sĩ</text>
            <text x={W / 2} y={545} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cuối tháng nào? 🤔</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 650px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={665} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 comment số của ngươi (① → ⑥) 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 820px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 820px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={750} width={600} height={140} rx={70} fill={JADE} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={762} width={570} height={116} rx={58} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
              <text x={W / 2} y={838} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={970} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(150, 12)}>để không bỏ lỡ truyền kỳ tiếp theo 🏯</text>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const TuSiCuoiThang: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_BASE }}>
      <Audio src={staticFile("tu_si_cuoi_thang/voice.mp3")} />
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
