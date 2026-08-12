import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./tester_quotes_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "09";

const BG_NAVY = "#0F1B2E";
const BG_CARD = "#15243B";
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
const TESTER = "#FF6FB5";

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

const BlueprintBG: React.FC = () => {
  const frame = useCurrentFrame();
  const scanLineY = (frame * 4) % (H + 200) - 100;
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="tqgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="tqgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="tqglow" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor={TESTER} stopOpacity="0.07" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tqscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#tqgrid)" />
        <rect width={W} height={H} fill="url(#tqgrid2)" />
        <rect width={W} height={H} fill="url(#tqglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#tqscan)" />
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
  const a1 = useFadeUp(0, 10), a2 = useFadeUp(4, 10), a3 = useFadeUp(8, 10);
  return (
    <g transform={`translate(80, 130)`}>
      <text x={0} y={0} fontSize={18} fill={AMBER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={a1}>[{num} / {TOTAL}]</text>
      <line x1={0} y1={20} x2={W - 160} y2={20} stroke={AMBER} strokeWidth={1} opacity={0.5} style={a2} />
      <text x={0} y={50} fontSize={16} fill={TEXT_SEC} fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="6" style={a3}>{label}</text>
    </g>
  );
};
const FigFooter: React.FC<{ label: string }> = ({ label }) => (
  <g transform={`translate(${W / 2}, ${H - 110})`}>
    <line x1={-W / 2 + 80} y1={-30} x2={W / 2 - 80} y2={-30} stroke={AMBER} strokeWidth={1} opacity={0.5} />
    <text x={0} y={0} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">{label}</text>
  </g>
);
const BrandMark: React.FC = () => (
  <g transform={`translate(${W / 2}, ${H - 60})`}>
    <text x={0} y={0} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">⚡ truyền kỳ · tester vs dev · 2026</text>
  </g>
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

const CauBadge: React.FC<{ num: string; name: string; color: string; entry: number }> = ({ num, name, color, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px 290px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 110} y={250} width={220} height={70} rx={6} fill={color} />
      <text x={W / 2} y={298} fontSize={34} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">CÂU {num}</text>
      <text x={W / 2} y={388} fontSize={(name || "").length > 22 ? 36 : 44} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{name}</text>
    </g>
  );
};

// tester chat bubble (left side, pink)
const TesterBubble: React.FC<{ y: number; lines: string[]; anim: { opacity: number; transform?: string }; big?: boolean }> = ({ y, lines, anim, big }) => {
  const w = 760;
  const x = W / 2 - 460;
  const h = 58 + lines.length * (big ? 58 : 46);
  return (
    <g style={anim}>
      <circle cx={x + 36} cy={y + 38} r={28} fill={BG_CARD} stroke={TESTER} strokeWidth={2} />
      <text x={x + 36} y={y + 50} fontSize={30} textAnchor="middle">🧪</text>
      <rect x={x + 78} y={y} width={w - 78} height={h} rx={18} fill={BG_CARD} stroke={TESTER} strokeWidth={2.5} />
      <text x={x + 104} y={y + 34} fontSize={18} fill={TESTER} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">Tester ▸</text>
      {lines.map((ln, i) => (
        <text key={i} x={x + 104} y={y + 78 + i * (big ? 58 : 46)} fontSize={big ? 40 : 30} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={big ? 800 : 700}>{ln}</text>
      ))}
    </g>
  );
};

const TypeSlide: React.FC<{
  duration: number; num: string; sec: string; name: string; color: string;
  msg: string[]; children?: React.ReactNode; fig: string;
}> = ({ duration, num, sec, name, color, msg, children, fig }) => {
  const bubble = useScaleIn(70, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num={num} label={sec} />
          <CauBadge num={`${parseInt(num) - 1}`} name={name} color={color} entry={15} />
          <TesterBubble y={490} lines={msg} anim={bubble} big />
          {children}
          <FigFooter label={`câu ${parseInt(num) - 1} · tester → dev tẩu hỏa nhập ma`} />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// translation/panic box used in several slides
const Dich: React.FC<{ y: number; lines: { t: string; c?: string; size?: number; it?: boolean }[]; entry: number; color?: string }> = ({ y, lines, entry, color = AMBER }) => {
  const a = useScaleIn(entry, 14);
  const h = 80 + lines.length * 52;
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <TechBox x={W / 2 - 470} y={y} w={940} h={h} color={color} thick={2.5} />
      <text x={W / 2} y={y + 46} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// dịch nghĩa</text>
      {lines.map((l, i) => (
        <text key={i} x={W / 2} y={y + 96 + i * 52} fontSize={l.size || 34} fill={l.c || TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={l.c === AMBER_BRIGHT ? 900 : 700} fontStyle={l.it ? "italic" : "normal"}>{l.t}</text>
      ))}
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const t = useScaleIn(20, 16);
  const r1 = useFadeUp(120, 10), r2 = useFadeUp(150, 10), r3 = useFadeUp(180, 10), r4 = useScaleIn(220, 14);
  const punch = useFadeUp(320, 14);
  const roles = [
    { y: 0, t: "🗡️ Kiếm tu Backend", c: ACCENT_BLUE, anim: r1 },
    { y: 78, t: "🎨 Phù sư Frontend", c: VIOLET, anim: r2 },
    { y: 156, t: "⚙️ Trận pháp sư DevOps", c: ORANGE, anim: r3 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE MYSTERIOUS BRANCH · TESTER" />
          <g style={{ ...t, transformOrigin: `${W / 2}px 410px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={375} fontSize={36} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Những câu nói của TESTER</text>
            <text x={W / 2} y={448} fontSize={52} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>khiến kiếm tu</text>
            <text x={W / 2} y={520} fontSize={56} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">TẨU HỎA NHẬP MA</text>
          </g>
          {roles.map((r, i) => (
            <g key={i} transform={`translate(${W / 2}, ${650 + r.y})`} opacity={r.anim.opacity}>
              <rect x={-380} y={-30} width={760} height={60} fill={BG_CARD} stroke={r.c} strokeWidth={1.5} />
              <text x={0} y={10} fontSize={28} fill={r.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
            </g>
          ))}
          <g style={{ ...r4, transformOrigin: `${W / 2}px 920px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 380} y={884} width={760} height={72} rx={8} fill={TESTER} />
            <text x={W / 2} y={930} fontSize={32} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>🧪 ... và TESTER</text>
          </g>
          <g style={punch}>
            <TechBox x={W / 2 - 470} y={1030} w={940} h={170} color={AMBER} thick={2.5} />
            <text x={W / 2} y={1090} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Không tạo ra bug.</text>
            <text x={W / 2} y={1150} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">Nhưng luôn TÌM THẤY bug 👁️</text>
          </g>
          <FigFooter label="7 câu tester khiến dev tẩu hỏa nhập ma" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2-S8 ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="02" sec="SYMPTOM 01" name="Anh ơi em thấy hơi lạ" color={SLATE} msg={["Anh ơi em thấy", "hơi lạ... 👀"]} fig="2">
    <Dich y={900} entry={150} color={WARNING_RED} lines={[{ t: "\"hơi lạ\" trong cốt đạo =", c: TEXT_SEC, size: 30, it: true }, { t: "chuẩn bị MẤT CUỐI TUẦN", c: AMBER_BRIGHT, size: 42 }]} />
  </TypeSlide>
);
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const r1 = useFadeUp(110, 9), r2 = useFadeUp(145, 9), r3 = useFadeUp(175, 9), p = useScaleIn(200, 14);
  const ton = [{ y: 0, t: "Bug", anim: r1 }, { y: 64, t: "Screenshot", anim: r2 }, { y: 128, t: "Nỗi đau", anim: r3 }];
  return (
    <TypeSlide duration={duration} num="03" sec="SYMPTOM 02" name="Không biết tái hiện" color={JADE} msg={["Em không biết", "tái hiện thế nào 🤷"]} fig="3">
      {ton.map((r, i) => (
        <g key={i} transform={`translate(${W / 2}, ${900 + r.y})`} opacity={r.anim.opacity}>
          <rect x={-340} y={-26} width={680} height={54} fill={BG_CARD} stroke={JADE} strokeWidth={1.5} />
          <text x={0} y={9} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t} — tồn tại ✓</text>
        </g>
      ))}
      <g style={{ ...p, transformOrigin: `${W / 2}px 1170px`, transformBox: "fill-box" }}>
        <text x={W / 2} y={1185} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">chỉ cách TẠO bug đã thất truyền</text>
      </g>
    </TypeSlide>
  );
};
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="04" sec="SYMPTOM 03 · HEISENBUG" name="Lâu lâu mới bị" color={ACCENT_BLUE} msg={["Lâu lâu mới bị 🌚"]} fig="4">
    <g>
      <Dich y={870} entry={150} color={ACCENT_BLUE} lines={[{ t: "Ngươi TÌM nó → nó không hiện", c: TEXT_PRI, size: 32 }, { t: "Ngươi đi NGỦ → nó hiện ra", c: AMBER_BRIGHT, size: 36, it: true }]} />
    </g>
  </TypeSlide>
);
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="05" sec="SYMPTOM 04" name="Em bấm linh tinh thì lỗi" color={VIOLET} msg={["Em bấm linh tinh", "thì lỗi 🙃"]} fig="5">
    <Dich y={900} entry={140} color={WARNING_RED} lines={[{ t: "từ \"linh tinh\" này", c: TEXT_SEC, size: 30, it: true }, { t: "khiến kiếm tu BẾ QUAN 3 ngày 3 đêm", c: AMBER_BRIGHT, size: 34 }]} />
  </TypeSlide>
);
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const r1 = useFadeUp(110, 9), r2 = useFadeUp(135, 9), r3 = useFadeUp(160, 9), r4 = useScaleIn(180, 14);
  const rows = [
    { y: 0, t: "Máy dev", v: "✓ không bị", c: JADE, anim: r1 },
    { y: 70, t: "Máy tester", v: "✗ bị", c: WARNING_RED, anim: r2 },
    { y: 140, t: "Máy khách hàng", v: "✗ bị", c: WARNING_RED, anim: r3 },
  ];
  return (
    <TypeSlide duration={duration} num="06" sec="SYMPTOM 05" name="Máy em bị" color={ORANGE} msg={["Máy em bị 💻"]} fig="6">
      {rows.map((r, i) => (
        <g key={i} transform={`translate(${W / 2}, ${870 + r.y})`} opacity={r.anim.opacity}>
          <rect x={-400} y={-28} width={800} height={58} fill={BG_CARD} stroke={r.c} strokeWidth={1.5} />
          <text x={-370} y={10} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{r.t}</text>
          <text x={370} y={10} fontSize={28} fill={r.c} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.v}</text>
        </g>
      ))}
      <g style={{ ...r4, transformOrigin: `${W / 2}px 1130px`, transformBox: "fill-box" }}>
        <text x={W / 2} y={1145} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">chỉ máy dev là KHÔNG 🤔</text>
      </g>
    </TypeSlide>
  );
};
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="07" sec="SYMPTOM 06" name="Anh sửa xong chưa?" color={WARNING_RED} msg={["Anh sửa xong chưa? ⏰"]} fig="7">
    <Dich y={880} entry={110} color={WARNING_RED} lines={[{ t: "Kiếm tu vừa MỚI đọc bug report", c: TEXT_PRI, size: 32 }, { t: "Tester đã hỏi LẦN THỨ HAI", c: AMBER_BRIGHT, size: 36 }]} />
  </TypeSlide>
);
const S8: React.FC<{ duration: number }> = ({ duration }) => (
  <TypeSlide duration={duration} num="08" sec="SYMPTOM 07 · FINAL BOSS" name="Anh rảnh không?" color={AMBER} msg={["Anh rảnh không? 🙂"]} fig="8">
    <Dich y={880} entry={100} color={WARNING_RED} lines={[{ t: "Ngắn gọn · Lịch sự", c: TEXT_SEC, size: 30, it: true }, { t: "nhưng THIÊN KIẾP sắp tới ⚡", c: AMBER_BRIGHT, size: 38 }]} />
  </TypeSlide>
);

// ============ S9 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const a1 = useFadeUp(20, 14);
  const a2 = useScaleIn(120, 16);
  const cta = useFadeUp(320, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="VERDICT · THE FIRST THIÊN KIẾP" />
          <text x={W / 2} y={420} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={a1}>
            Production có thể độ kiếp bất cứ lúc nào...
          </text>
          <g style={{ ...a2, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={560} w={940} h={400} color={TESTER} thick={3} />
            <text x={W / 2} y={625} fontSize={26} fill={TESTER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">⚠ NHƯNG...</text>
            <text x={W / 2} y={695} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thiên kiếp ĐẦU TIÊN</text>
            <text x={W / 2} y={745} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>của mọi kiếm tu</text>
            <text x={W / 2} y={815} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">luôn bắt đầu từ</text>
            <g transform={`translate(${W / 2}, 890)`}>
              <rect x={-300} y={-38} width={600} height={76} rx={16} fill={BG_CARD} stroke={TESTER} strokeWidth={2.5} />
              <text x={0} y={12} fontSize={34} fill={TESTER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>1 tin nhắn của Tester 🧪</text>
            </g>
          </g>
          <g transform={`translate(${W / 2}, 1130)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={32} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu là dev hay tester? 👇</text>
            <line x1={-240} y1={52} x2={240} y2={52} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={104} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới IT</text>
          </g>
          <FigFooter label="tester vs dev · thiên kiếp đầu tiên" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

export const Top7TesterQuotes: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("tester_quotes/voice.mp3")} />
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
