import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./senior_junior_beats.json";
import T from "./senior_junior_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "11";

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
const BG_TERM = "#0A1322";
const BG_BLUE = "#10243F";
const BG_AMBER = "#2A2110";
const GRID = "#FFFFFF";
const TEXT_PRI = "#E8F0FF";
const TEXT_SEC = "#A4B5D0";
const TEXT_MUTE = "#5E7090";
const AMBER = "#FFC857";
const AMBER_BRIGHT = "#FFD980";
const ACCENT_BLUE = "#5BB8FF";
const WARNING_RED = "#FF6B6B";
const JADE = "#5BE8A8";

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
  <text x={W / 2} y={H - 60} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · chốn công sở · blueprint</text>
);

// Cột nhân vật (Junior trái / Senior phải)
const VsCol: React.FC<{ side: "L" | "R"; tag: string; color: string; bg: string; lines: string[]; entry: number }> = ({ side, tag, color, bg, lines, entry }) => {
  const a = useScaleIn(entry, 12);
  const cx = side === "L" ? W / 4 - 18 : (W * 3) / 4 + 18;
  const x0 = side === "L" ? 64 : W / 2 + 28;
  const cardW = W / 2 - 92;
  return (
    <g style={{ ...a, transformOrigin: `${cx}px 520px`, transformBox: "fill-box" }}>
      <rect x={x0} y={350} width={cardW} height={360} rx={16} fill={bg} stroke={color} strokeWidth={3} />
      <rect x={x0} y={350} width={cardW} height={62} rx={16} fill={color} opacity={0.16} />
      <text x={cx} y={392} fontSize={28} fill={color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">{tag}</text>
      {lines.map((ln, i) => (
        <text key={i} x={cx} y={470 + i * 56} fontSize={ln.length > 18 ? 25 : 29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{ln}</text>
      ))}
    </g>
  );
};

type ScProps = { duration: number; num: string; label: string; sit: string; sit2?: string; jr: string[]; sr: string[]; ngo: string[]; foot: string; t: { sit: number; jr: number; sr: number; ngo: number } };
const Scenario: React.FC<ScProps> = ({ duration, num, label, sit, sit2, jr, sr, ngo, foot, t }) => {
  const frame = useCurrentFrame();
  const vsP = 0.9 + 0.1 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num={num} label={label} />
          <g transform="translate(0, 360)">
            <g style={useScaleIn(t.sit, 12)}>
              <rect x={W / 2 - 490} y={228} width={980} height={sit2 ? 96 : 70} rx={14} fill={BG_TERM} stroke={TEXT_MUTE} strokeWidth={2} />
              <text x={W / 2} y={sit2 ? 270 : 272} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{sit}</text>
              {sit2 && <text x={W / 2} y={304} fontSize={25} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{sit2}</text>}
            </g>
            <VsCol side="L" tag="JUNIOR" color={ACCENT_BLUE} bg={BG_BLUE} lines={jr} entry={t.jr} />
            <VsCol side="R" tag="SENIOR" color={AMBER} bg={BG_AMBER} lines={sr} entry={t.sr} />
            <g style={{ transform: `scale(${vsP})`, transformOrigin: `${W / 2}px 530px`, transformBox: "fill-box" }}>
              <circle cx={W / 2} cy={530} r={40} fill={BG_NAVY} stroke={WARNING_RED} strokeWidth={3} />
              <text x={W / 2} y={540} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>VS</text>
            </g>
            <g style={useScaleIn(t.ngo, 14)}>
              <rect x={W / 2 - 490} y={748} width={980} height={ngo.length > 1 ? 150 : 110} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
              {ngo.map((ln, i) => (
                <text key={i} x={W / 2} y={(ngo.length > 1 ? 800 : 812) + i * 50} fontSize={ln.length > 40 ? 26 : 30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">{ln}</text>
              ))}
            </g>
          </g>
          <FigFooter label={foot} />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S1 INTRO ============
const S1: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={AMBER} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="00" label="TWO TYPES OF CULTIVATORS" />
        <g transform="translate(0, 300)">
        <g style={useFadeUp(8, 12)}>
          <text x={W / 2} y={330} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">🏯 truyền kỳ chốn công sở</text>
          <text x={W / 2 - 230} y={430} fontSize={72} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>JUNIOR</text>
          <text x={W / 2 + 30} y={430} fontSize={40} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>vs</text>
          <text x={W / 2 + 250} y={430} fontSize={72} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>SENIOR</text>
        </g>
        <g style={useScaleIn(T.INTRO.types, 14)}>
          <rect x={64} y={510} width={W / 2 - 92} height={150} rx={16} fill={BG_BLUE} stroke={ACCENT_BLUE} strokeWidth={2.5} />
          <text x={W / 4 - 18} y={565} fontSize={26} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>tu vi còn non</text>
          <text x={W / 4 - 18} y={612} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>khí thế ngút trời 🔥</text>
          <rect x={W / 2 + 28} y={510} width={W / 2 - 92} height={150} rx={16} fill={BG_AMBER} stroke={AMBER} strokeWidth={2.5} />
          <text x={(W * 3) / 4 + 18} y={565} fontSize={26} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>tu vi thâm hậu</text>
          <text x={(W * 3) / 4 + 18} y={612} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhìn đâu cũng thấy nguy 😨</text>
        </g>
        <g style={useScaleIn(T.INTRO.kiep, 14)}>
          <rect x={W / 2 - 490} y={700} width={980} height={140} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={W / 2} y={752} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>khác biệt KHÔNG ở số dòng code đã viết…</text>
          <text x={W / 2} y={805} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà ở SỐ LẦN đã độ kiếp ⚡</text>
        </g>
        </g>
        <FigFooter label="Junior vs Senior · không phải tuổi nghề, mà là vết sẹo" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S2 SETUP ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={JADE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="01" label="LOOK THE SAME… UNTIL" />
        <g transform="translate(0, 380)">
        <g style={useScaleIn(T.SETUP.same, 14)}>
          <rect x={W / 2 - 480} y={330} width={960} height={170} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
          <text x={W / 2} y={385} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người ngoài tưởng hai kẻ giống hệt nhau:</text>
          <text x={W / 2} y={435} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cùng 1 màn hình · cùng gõ những dòng lệnh</text>
          <text x={W / 2} y={475} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{`{ ... }`}</text>
        </g>
        <g style={useScaleIn(T.SETUP.reveal, 14)}>
          <rect x={W / 2 - 490} y={560} width={980} height={160} rx={18} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={4} />
          <text x={W / 2} y={618} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhưng chỉ cần một THIÊN KIẾP giáng xuống…</text>
          <text x={W / 2} y={678} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">bản chất lập tức lộ ra 💀</text>
        </g>
        </g>
        <FigFooter label="cùng một sự cố · hai phản ứng hoàn toàn khác" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S3-S8 SCENARIOS ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <Scenario duration={duration} num="02" label="CASE ① · CODE CHẠY KHÔNG HIỂU"
    sit="code bỗng chạy được · mà chẳng ai hiểu vì sao 🤔"
    jr={["mừng rỡ 🤪", "→ deploy luôn!"]}
    sr={["tái mặt 😨", "lùi lại một bước"]}
    ngo={["con bug ngươi THẤY không đáng sợ", "con bug đang NGỦ YÊN mới đáng sợ"]}
    foot="code chạy mà không hiểu vì sao · đáng sợ hơn code lỗi"
    t={T.S1} />
);
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <Scenario duration={duration} num="03" label="CASE ② · ESTIMATE"
    sit="việc này bao lâu xong? ⏱️"
    jr={["vỗ ngực 😎", "\"Hai tiếng", "thôi ạ\""]}
    sr={["trầm ngâm 🧘", "\"Hai tuần.", "Có thể trễ\""]}
    ngo={["2 tiếng đó → kéo dài 3 ngày", "Senior không chậm · chỉ từng bị thời gian phản bội"]}
    foot="estimate · vết sẹo dạy người ta khiêm tốn với thời gian"
    t={T.S2} />
);
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <Scenario duration={duration} num="04" label="CASE ③ · LEGACY CODE"
    sit="đoạn code cũ · xấu · không ai dám nhận của mình 🗿"
    jr={["máu sôi 🔨", "\"viết như hạch", "đập đi viết lại!\""]}
    sr={["kinh hãi 😱", "\"đừng đụng!", "nó đang sống\""]}
    ngo={["code xấu mà chạy được", "cũng là một loại CÔNG ĐỨC 🙏"]}
    foot="legacy · đừng đập thứ đang chạy chỉ vì nó xấu"
    t={T.S3} />
);
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <Scenario duration={duration} num="05" label="CASE ④ · PRODUCTION SẬP"
    sit="nửa đêm · Production đột nhiên sập 🔥"
    jr={["hoảng loạn 😰", "sửa lung tung", "càng sửa càng nát"]}
    sr={["pha ấm trà 🍵", "gõ đúng 1 dòng:", "rollback"]}
    ngo={["lúc cháy nhà · kẻ chạy nhanh nhất", "chưa chắc là kẻ CỨU được nhà"]}
    foot="khủng hoảng · bình tĩnh là một loại tu vi"
    t={T.S4} />
);
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <Scenario duration={duration} num="06" label="CASE ⑤ · CÔNG NGHỆ MỚI"
    sit="pháp môn mới xuất thế · giang hồ phát cuồng ✨"
    jr={["🚀 đòi rewrite", "cả hệ thống", "ngay trong đêm!"]}
    sr={["🤨 liếc 1 cái", "\"2 năm nữa", "còn sống không?\""]}
    ngo={["2 năm sau nó thất truyền · cái cũ vẫn chạy", "không phải cái gì MỚI · cũng là đại đạo"]}
    foot="hype · không phải cái mới nào cũng đáng cược cả hệ thống"
    t={T.S5} />
);
const S8: React.FC<{ duration: number }> = ({ duration }) => (
  <Scenario duration={duration} num="07" label="CASE ⑥ · KHI KHÔNG BIẾT"
    sit="bị hỏi một câu KHÔNG biết 🤔"
    jr={["sợ mất mặt 😅", "giả vờ hiểu", "gật gù cho qua"]}
    sr={["điềm nhiên 😌", "\"cái này tôi chưa rõ", "để tra rồi trả lời\""]}
    ngo={["Junior sợ bị thấy là KHÔNG biết", "Senior đã HẾT SỢ điều đó từ lâu"]}
    foot="chân tướng lớn nhất · dám nói 'tôi chưa biết'"
    t={T.S6} />
);

// ============ S9 TWIST ============
const S9: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={WARNING_RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="08" label="THE REAL DIFFERENCE" />
        <g transform="translate(0, 360)">
        <g style={useScaleIn(T.TWIST.main, 14)}>
          <rect x={W / 2 - 490} y={290} width={980} height={200} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={W / 2} y={345} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người đời tưởng Senior hơn Junior vì biết nhiều hơn.</text>
          <text x={W / 2} y={398} fontSize={40} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>SAI.</text>
          <text x={W / 2} y={456} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">Senior hơn · ở chỗ đã SAI nhiều hơn</text>
        </g>
        <text x={W / 2} y={560} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={useScaleIn(T.TWIST.main + 20, 12)}>mỗi sự bình tĩnh · đổi bằng một ĐÊM TRẮNG trong quá khứ 🌙</text>
        <g style={useScaleIn(T.TWIST.conf, 14)}>
          <rect x={64} y={620} width={W / 2 - 92} height={160} rx={16} fill={BG_BLUE} stroke={ACCENT_BLUE} strokeWidth={2.5} />
          <text x={W / 4 - 18} y={672} fontSize={26} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>JUNIOR</text>
          <text x={W / 4 - 18} y={718} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tự tin đến từ</text>
          <text x={W / 4 - 18} y={754} fontSize={25} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>"chưa từng thấy"</text>
          <rect x={W / 2 + 28} y={620} width={W / 2 - 92} height={160} rx={16} fill={BG_AMBER} stroke={AMBER} strokeWidth={2.5} />
          <text x={(W * 3) / 4 + 18} y={672} fontSize={26} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>SENIOR</text>
          <text x={(W * 3) / 4 + 18} y={718} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thận trọng đến từ</text>
          <text x={(W * 3) / 4 + 18} y={754} fontSize={25} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>"đã thấy"</text>
        </g>
        </g>
        <FigFooter label="kinh nghiệm = những vết sẹo có tổ chức" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S10 ENDING ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const tiers = [
    { p: "Junior hỏi", s: "làm sao để code CHẠY", c: ACCENT_BLUE },
    { p: "Mid hỏi", s: "làm sao để code chạy NHANH", c: JADE },
    { p: "Senior hỏi", s: "khi nó sập · mình vẫn NGỦ NGON", c: AMBER_BRIGHT },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="ĐẠI ĐẠO · CẢNH GIỚI" />
          <g transform="translate(0, 340)">
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>trong giới tu chân người ta nói:</text>
          <g>
            {tiers.map((t, i) => (
              <g key={i} style={useScaleIn((T.ENDING.tiers as number[])[i], 12)}>
                <rect x={W / 2 - 470} y={340 + i * 116} width={940} height={98} rx={14} fill={BG_CARD} stroke={t.c} strokeWidth={2.5} />
                <text x={W / 2 - 440} y={392 + i * 116} fontSize={28} fill={t.c} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{t.p}:</text>
                <text x={W / 2 - 440} y={420 + i * 116} fontSize={25} fill={TEXT_PRI} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{t.s}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.ENDING.peak, 14)}>
            <rect x={W / 2 - 490} y={730} width={980} height={130} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
            <text x={W / 2} y={782} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>còn cảnh giới CAO NHẤT?</text>
            <text x={W / 2} y={832} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">biết thứ gì KHÔNG nên code 🧘</text>
          </g>
          </g>
          <FigFooter label="cảnh giới cao nhất: biết thứ gì không nên code" />
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
  const btn = useScaleIn(100, 14);
  const pulse = 1 + 0.03 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <g transform="translate(0, 150)">
          <g style={ask}>
            <text x={W / 2} y={470} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Ngươi đang ở</text>
            <text x={W / 2} y={525} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cảnh giới nào? 🤔</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={655} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 comment cho thiên hạ biết 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 810px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 810px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={740} width={600} height={140} rx={70} fill={JADE} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={752} width={570} height={116} rx={58} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
              <text x={W / 2} y={828} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={960} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(140, 12)}>để nghe tiếp truyền kỳ chốn công sở 🏯</text>
          </g>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11];

export const SeniorJunior: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("senior_junior/voice.mp3")} />
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
