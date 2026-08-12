import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./gioi_han_kiem_tu_beats.json";

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

const BlueprintBG: React.FC<{ glow?: string }> = ({ glow = AMBER }) => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="ghgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="ghgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="ghglow" cx="50%" cy="36%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.08" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ghscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#ghgrid)" />
        <rect width={W} height={H} fill="url(#ghgrid2)" />
        <rect width={W} height={H} fill="url(#ghglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#ghscan)" />
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

// tolerable exchange row (calm)
const OkRow: React.FC<{ y: number; diss: string; react: string; entry: number }> = ({ y, diss, react, entry }) => {
  const a = useScaleIn(entry, 12);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 45}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 460} y={y} width={920} height={90} rx={12} fill={BG_CARD} stroke={JADE} strokeWidth={1.5} />
      <text x={W / 2 - 430} y={y + 38} fontSize={26} fill={TEXT_SEC} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>“{diss}”</text>
      <text x={W / 2 - 430} y={y + 72} fontSize={26} fill={JADE} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✓ {react}</text>
    </g>
  );
};

// trigger row (rage)
const RageRow: React.FC<{ y: number; diss: string; react: string; entry: number }> = ({ y, diss, react, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 90}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 470} y={y} width={940} height={180} rx={14} fill="#2A1010" stroke={WARNING_RED} strokeWidth={3.5} />
      <text x={W / 2 - 440} y={y + 36} fontSize={20} fill={WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">⚔️ NHƯNG DÁM NÓI:</text>
      <text x={W / 2 - 440} y={y + 80} fontSize={diss.length > 40 ? 25 : 28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>“{diss}”</text>
      <text x={W / 2 - 440} y={y + 138} fontSize={react.length > 44 ? 24 : react.length > 36 ? 27 : 30} fill={AMBER_BRIGHT} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">🗡️ {react}</text>
    </g>
  );
};

// reusable trigger slide
const TriggerSlide: React.FC<{
  duration: number; num: string; sec: string; topic: string; ok: [string, string][]; rage: [string, string]; fig: string; glow?: string;
}> = ({ duration, num, sec, topic, ok, rage, fig, glow = WARNING_RED }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={glow} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num={num} label={sec} />
        <g style={useScaleIn(15, 14)}>
          <rect x={W / 2 - 230} y={245} width={460} height={58} rx={29} fill={WARNING_RED} />
          <text x={W / 2} y={284} fontSize={28} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">⚔️ NGHỊCH LÂN {parseInt(num) - 1}</text>
        </g>
        <text x={W / 2} y={360} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} fontStyle="italic">// {topic}</text>
        <OkRow y={420} diss={ok[0][0]} react={ok[0][1]} entry={28} />
        <OkRow y={530} diss={ok[1][0]} react={ok[1][1]} entry={90} />
        <RageRow y={680} diss={rage[0]} react={rage[1]} entry={160} />
        <FigFooter label={fig} />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const lv = [
    { t: "có lời · hắn cười cho qua 😌", c: JADE, e: 55 },
    { t: "có lời · khiến đạo tâm dao động 😐", c: ORANGE, e: 130 },
    { t: "có lời · hắn muốn cùng ngươi PHÂN SINH TỬ ⚔️", c: WARNING_RED, e: 210 },
  ];
  const title = useScaleIn(14, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE DRAGON'S REVERSE SCALE" />
          <g style={{ ...title, transformOrigin: `${W / 2}px 340px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={310} fontSize={44} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>GIỚI HẠN CHỊU ĐỰNG</text>
            <text x={W / 2} y={378} fontSize={56} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>của KIẾM TU IT ⚔️</text>
          </g>
          <text x={W / 2} y={490} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(40, 12)}>Trong Tu Chân Giới IT:</text>
          {lv.map((l, i) => (
            <g key={i} opacity={useFade(l.e, 10)}>
              <rect x={W / 2 - 460} y={550 + i * 110} width={920} height={90} rx={12} fill={BG_CARD} stroke={l.c} strokeWidth={2} />
              <text x={W / 2} y={605 + i * 110} fontSize={30} fill={l.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{l.t}</text>
            </g>
          ))}
          <g style={useFadeUp(290, 12)}>
            <TechBox x={W / 2 - 470} y={910} w={940} h={110} color={WARNING_RED} thick={2.5} />
            <text x={W / 2} y={978} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">7 nghịch lân · đụng vào là rút kiếm 🗡️</text>
          </g>
          <FigFooter label="cười được · nhưng đừng chạm vảy ngược" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <TriggerSlide duration={duration} num="02" sec="LOOKS & SKILL" topic="chê ngoại hình · năng lực" glow={SLATE}
    ok={[["Chê hắn đụt", "Bản tọa nghe quen rồi"], ["Cười hắn ngố", "Cũng chẳng ảnh hưởng gì"]]}
    rage={["Cả đời không có đạo lữ cũng là có nguyên nhân", "Hôm nay ngươi đừng hòng nguyên vẹn rời bí cảnh"]}
    fig="nghịch lân 1 · đừng nhắc chuyện ế" />
);
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <TriggerSlide duration={duration} num="03" sec="SINGLE STATUS" topic="trêu FA · độc thân" glow={ACCENT_BLUE}
    ok={[["Trêu hắn FA", "Chuyện nhỏ"], ["Nhắc hắn chưa có đạo lữ", "Vẫn chịu được"]]}
    rage={["Crush xem hắn như huynh đệ tốt", "Ta với ngươi chỉ 1 người được xuống núi"]}
    fig="nghịch lân 2 · 'huynh đệ' là chí mạng" />
);
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <TriggerSlide duration={duration} num="04" sec="INTROVERT" topic="chê ít nói · hướng nội" glow={VIOLET}
    ok={[["Chê hắn ít nói", "Không oan"], ["Bảo hắn hướng nội", "Bản tọa thừa nhận"]]}
    rage={["Hắn và crush chưa từng thực sự bắt đầu", "Tâm ma bản tọa đã bị ngươi đánh thức"]}
    fig="nghịch lân 3 · vết thương chưa lành" />
);
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <TriggerSlide duration={duration} num="05" sec="FASHION" topic="cười ăn mặc · phối đồ" glow={ORANGE}
    ok={[["Cười hắn mặc xấu", "Không đáng nhắc tới"], ["Chê không biết phối đồ", "Miễn cưỡng chấp nhận"]]}
    rage={["Mặc thế này thì không ai yêu nổi", "Đưa tên tông môn đây · ta tới tận nơi luận đạo"]}
    fig="nghịch lân 4 · 'không ai yêu' = khai chiến" />
);
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <TriggerSlide duration={duration} num="06" sec="MONEY" topic="chê nghèo · tiết kiệm" glow={JADE}
    ok={[["Chê hắn nghèo", "Chưa tổn hại đạo tâm"], ["Bảo hắn quá tiết kiệm", "Coi như đang khổ tu"]]}
    rage={["Làm IT mà không đủ tiền cưới đạo lữ", "Thiên địa nhân quả hôm nay phải có kết quả"]}
    fig="nghịch lân 5 · tiền cưới = lằn ranh đỏ" />
);
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <TriggerSlide duration={duration} num="07" sec="TECH ADDICT" topic="trêu nghiện máy · công nghệ" glow={ACCENT_BLUE}
    ok={[["Trêu hắn nghiện máy tính", "Ai cũng có sở thích"], ["Cười hắn nghiện công nghệ", "Điều đó không sai"]]}
    rage={["ChatGPT hiểu hắn hơn crush", "Ngươi đang ép bản tọa nhập ma"]}
    fig="nghịch lân 6 · AI hiểu hơn = đau nhất" />
);
const S8: React.FC<{ duration: number }> = ({ duration }) => (
  <TriggerSlide duration={duration} num="08" sec="THE JOB" topic="nói nghề · bị lợi dụng" glow={ORANGE}
    ok={[["Nói hắn làm lốp", "Cũng ổn"], ["Bảo hắn đang bị lợi dụng", "Tạm chấp nhận được"]]}
    rage={["Dám nói xấu crush của hắn", "Cho ngươi nếm công pháp Chiếc Lốp mạnh nhất Trung Châu"]}
    fig="nghịch lân 7 · động crush = tận thế" />
);

// ============ S9 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const calm = useFadeUp(20, 14);
  const but = useScaleIn(115, 14);
  const warn = useScaleIn(235, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE FINAL WARNING" />
          <text x={W / 2} y={310} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={calm}>Các đại năng Software Đạo đều hiểu:</text>
          <g style={calm}>
            <text x={W / 2} y={400} fontSize={32} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🧘 Kiếm Tu KHÔNG dễ nổi giận</text>
            <text x={W / 2} y={452} fontSize={32} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>🧘 cũng không dễ động sát tâm</text>
          </g>
          <text x={W / 2} y={560} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={but}>Nhưng nếu ngươi biết rõ NGHỊCH LÂN của hắn…</text>
          <g style={{ ...warn, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={640} w={940} h={250} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={720} fontSize={48} textAnchor="middle">⚰️</text>
            <text x={W / 2} y={790} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>thì tốt nhất nên…</text>
            <text x={W / 2} y={850} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">CHUẨN BỊ SẴN HẬU SỰ 🪦</text>
          </g>
          <text x={W / 2} y={970} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(295, 12)}>(nghịch lân của dev: luôn là chuyện tình duyên 💔)</text>
          <FigFooter label="vảy ngược của kiếm tu IT · đụng là toang" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

export const GioiHanKiemTu: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("gioi_han_kiem_tu/voice.mp3")} />
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
