import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./sales_vs_engineering_beats.json";

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
const WARNING_RED = "#FF6B6B";
const JADE = "#5BE8A8";
const SLATE = "#A4B5D0";
const SL = "#FF9F1C"; // sales gold
const SL_DK = "#4A2F08";
const EN = "#5BB8FF"; // engineering blue
const EN_DK = "#1E3A52";

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
          <pattern id="segrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="segrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <linearGradient id="sesplit" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={SL} stopOpacity="0.07" />
            <stop offset="50%" stopColor={BG_NAVY} stopOpacity="0" />
            <stop offset="100%" stopColor={EN} stopOpacity="0.07" />
          </linearGradient>
          <linearGradient id="sescan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#segrid)" />
        <rect width={W} height={H} fill="url(#segrid2)" />
        <rect width={W} height={H} fill="url(#sesplit)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#sescan)" />
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

const VsBadge: React.FC<{ cx: number; cy: number; entry: number }> = ({ cx, cy, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <circle cx={cx} cy={cy} r={56} fill={BG_NAVY} stroke={AMBER} strokeWidth={4} />
      <text x={cx} y={cy + 16} fontSize={46} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>VS</text>
    </g>
  );
};

const Fighter: React.FC<{ cx: number; cy: number; emoji: string; role: string; name: string; color: string; bg: string; entry: number }> = ({ cx, cy, emoji, role, name, color, bg, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={cx - 230} y={cy - 170} width={460} height={340} rx={18} fill={bg} stroke={color} strokeWidth={3} />
      <text x={cx} y={cy - 36} fontSize={110} textAnchor="middle">{emoji}</text>
      <text x={cx} y={cy + 72} fontSize={26} fill={color} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">{role}</text>
      <text x={cx} y={cy + 128} fontSize={42} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{name}</text>
    </g>
  );
};

// speech line (SL = sales / EN = engineering)
const Speech: React.FC<{ y: number; side: "SL" | "EN"; label?: string; text: string; entry: number; size?: number; h?: number }> = ({ y, side, label, text, entry, size = 32, h = 96 }) => {
  const a = useScaleIn(entry, 12);
  const color = side === "SL" ? SL : EN;
  const bg = side === "SL" ? SL_DK : EN_DK;
  const lbl = label || (side === "SL" ? "💼 SALES ĐẠO" : "⚙️ ENGINEERING ĐẠO");
  const bw = 820;
  const x = side === "SL" ? W / 2 - bw / 2 - 16 : W / 2 - bw / 2 + 16;
  return (
    <g style={{ ...a, transformOrigin: `${x + bw / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <rect x={x} y={y} width={bw} height={h} rx={14} fill={bg} stroke={color} strokeWidth={2} />
      <rect x={side === "SL" ? x : x + bw - 8} y={y + 22} width={8} height={h - 44} fill={color} />
      <text x={side === "SL" ? x + 28 : x + bw - 28} y={y + 34} fontSize={17} fill={color} textAnchor={side === "SL" ? "start" : "end"} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="1">{lbl}</text>
      <text x={side === "SL" ? x + 28 : x + bw - 28} y={y + 74} fontSize={size} fill={TEXT_PRI} textAnchor={side === "SL" ? "start" : "end"} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{text}</text>
    </g>
  );
};

const Card: React.FC<{ cx: number; y: number; w?: number; name: string; sub?: string; color: string; entry: number; nameSize?: number }> = ({ cx, y, w = 900, name, sub, color, entry, nameSize = 32 }) => {
  const a = useScaleIn(entry, 12);
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${y + 44}px`, transformBox: "fill-box" }}>
      <rect x={cx - w / 2} y={y} width={w} height={88} rx={10} fill={BG_CARD} stroke={color} strokeWidth={2} />
      <rect x={cx - w / 2} y={y} width={8} height={88} rx={3} fill={color} />
      <text x={cx - w / 2 + 34} y={sub ? y + 40 : y + 56} fontSize={nameSize} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{name}</text>
      {sub && <text x={cx - w / 2 + 34} y={y + 72} fontSize={22} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>{sub}</text>}
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(20, 12);
  const reveal = useScaleIn(180, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={SL} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE FORBIDDEN ART" />
          <text x={W / 2} y={290} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>Một công pháp khiến đại năng kỹ sư</text>
          <text x={W / 2} y={338} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={intro}>nghe thấy cũng phải BIẾN SẮC 😱</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 600px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={440} width={920} height={320} rx={20} fill={BG_CARD} stroke={SL} strokeWidth={4} />
            <text x={W / 2} y={520} fontSize={34} fill={SL} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>「 công pháp tối thượng 」</text>
            <text x={W / 2} y={620} fontSize={76} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">TIÊN HỨA</text>
            <text x={W / 2} y={710} fontSize={76} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">ĐẠI PHÁP ✨</text>
          </g>
          <text x={W / 2} y={870} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={useFadeUp(260, 12)}>chỉ truyền trong 💼 SALES ĐẠO</text>
          <text x={W / 2} y={950} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} style={useFadeUp(280, 12)}>⚙️ Engineering Đạo · vs · 💼 Sales Đạo</text>
          <FigFooter label="đại chiến ngàn năm · sales vs engineering" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 TIÊN HỨA ĐẠI PHÁP ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useFadeUp(20, 12);
  const rows = [
    { from: "thứ chưa tồn tại", to: "thứ SẮP tồn tại", e: 60 },
    { from: "roadmap năm sau", to: "roadmap THÁNG sau", e: 150 },
    { from: "ý tưởng lúc ăn trưa", to: "feature chuẩn bị BÀN GIAO", e: 240 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={SL} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="THE POWER" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={intro}>Luyện tới đại thành · có thể biến hóa:</text>
          {rows.map((r, i) => {
            const a = useScaleIn(r.e, 12);
            const y = 380 + i * 200;
            return (
              <g key={i} style={{ ...a, transformOrigin: `${W / 2}px ${y + 80}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 440} y={y} width={880} height={70} rx={10} fill={EN_DK} stroke={EN} strokeWidth={2} />
                <text x={W / 2} y={y + 46} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{r.from}</text>
                <text x={W / 2} y={y + 110} fontSize={34} fill={SL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>↓</text>
                <rect x={W / 2 - 440} y={y + 86} width={880} height={70} rx={10} fill={SL_DK} stroke={SL} strokeWidth={2.5} />
                <text x={W / 2} y={y + 132} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.to}</text>
              </g>
            );
          })}
          <FigFooter label="biến lời nói · thành deadline của ngươi" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 LÀM ĐƯỢC ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const yes = useScaleIn(220, 14);
  const elder = useScaleIn(330, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label='"YES WE CAN"' />
          <Speech y={280} side="SL" label="🧑 KHÁCH HÀNG" text="'Cái này làm được không?'" entry={40} size={30} />
          <text x={W / 2} y={460} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(120, 12)}>Sales không xem code · hệ thống · database…</text>
          <g style={{ ...yes, transformOrigin: `${W / 2}px 580px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 300} y={500} width={600} height={160} rx={16} fill={SL_DK} stroke={SL} strokeWidth={3} />
            <text x={W / 2} y={560} fontSize={26} fill={SL} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>💼 mỉm cười · gật đầu</text>
            <text x={W / 2} y={628} fontSize={52} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>"Làm được." 😎</text>
          </g>
          <g style={{ ...elder, transformOrigin: `${W / 2}px 820px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={730} w={940} h={180} color={EN} thick={2.5} />
            <text x={W / 2} y={788} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">khoảnh khắc đó · ở Engineering Tông…</text>
            <text x={W / 2} y={848} fontSize={36} fill={EN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>⚙️ một trưởng lão bỗng MỞ MẮT 👁️</text>
            <text x={W / 2} y={892} fontSize={24} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">(linh cảm chẳng lành)</text>
          </g>
          <FigFooter label="không xem code · vẫn dám hứa" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 MỘT TUẦN ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const calc = useScaleIn(120, 14);
  const eng = useScaleIn(220, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label='"ONE WEEK"' />
          <Speech y={280} side="SL" label="🧑 KHÁCH HÀNG" text="'Bao lâu xong?'" entry={40} size={32} />
          <g style={{ ...calc, transformOrigin: `${W / 2}px 540px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 320} y={450} width={640} height={180} rx={16} fill={SL_DK} stroke={SL} strokeWidth={3} />
            <text x={W / 2} y={510} fontSize={26} fill={SL} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>🧮 bấm máy tính 3 giây…</text>
            <text x={W / 2} y={596} fontSize={56} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>"Một tuần." ⏱️</text>
          </g>
          <g style={{ ...eng, transformOrigin: `${W / 2}px 820px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={720} w={940} h={200} color={EN} thick={2.5} />
            <text x={W / 2} y={780} fontSize={48} textAnchor="middle">🍚</text>
            <text x={W / 2} y={835} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>xa xa · một engineer đang ăn cơm</text>
            <text x={W / 2} y={890} fontSize={34} fill={EN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">bỗng đạo tâm CHẤN ĐỘNG 😰</text>
          </g>
          <FigFooter label="3 giây ước lượng · 3 tháng trả nợ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 KHÔNG GIỚI HẠN ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const law = useFadeUp(20, 12);
  const r1 = useScaleIn(80, 14);
  const r2 = useScaleIn(170, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={SL} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="NO SKILL CEILING" />
          <text x={W / 2} y={310} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={law}>Tiên Hứa Đại Pháp · KHÔNG có giới hạn 📈</text>
          <g style={{ ...r1, transformOrigin: `${W / 2}px 510px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={420} width={920} height={170} rx={14} fill={BG_CARD} stroke={SL} strokeWidth={2.5} />
            <text x={W / 2} y={485} fontSize={34} fill={EN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Feature càng KHÓ 🔧</text>
            <text x={W / 2} y={550} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>→ Sales càng TỰ TIN 😎</text>
          </g>
          <g style={{ ...r2, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={630} width={920} height={170} rx={14} fill={BG_CARD} stroke={SL} strokeWidth={2.5} />
            <text x={W / 2} y={695} fontSize={34} fill={EN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Yêu cầu càng VÔ LÝ 🤡</text>
            <text x={W / 2} y={760} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>→ giọng nói càng CHẮC CHẮN 🎙️</text>
          </g>
          <text x={W / 2} y={900} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} fontStyle="italic" style={useFadeUp(230, 12)}>// tỉ lệ nghịch hoàn hảo</text>
          <FigFooter label="độ khó tăng · độ tự tin cũng tăng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 3 DẤU HIỆU ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const signs = [
    { n: "1", t: "Engineer bị kéo vào cuộc họp", c: JADE, e: 90 },
    { n: "2", t: "Tiêu đề ghi: 'Quick sync 15 phút'", c: AMBER, e: 200 },
    { n: "3", t: "Trong phòng: 'Anh em xem giúp nhé'", c: WARNING_RED, e: 310 },
  ];
  const punch = useScaleIn(430, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={EN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="3 SIGNS OF A PROMISE" />
          <text x={W / 2} y={290} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>3 dấu hiệu Sales vừa hứa gì đó với khách:</text>
          {signs.map((s, i) => {
            const a = useScaleIn(s.e, 14);
            const y = 360 + i * 170;
            return (
              <g key={i} style={{ ...a, transformOrigin: `${W / 2}px ${y + 65}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 460} y={y} width={920} height={130} rx={14} fill={BG_CARD} stroke={s.c} strokeWidth={2.5} />
                <circle cx={W / 2 - 390} cy={y + 65} r={42} fill={s.c} />
                <text x={W / 2 - 390} y={y + 82} fontSize={46} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{s.n}</text>
                <text x={W / 2 - 320} y={y + 80} fontSize={29} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{s.t}</text>
              </g>
            );
          })}
          <g style={{ ...punch, transformOrigin: `${W / 2}px 930px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={880} w={940} h={110} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={948} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ Engineering Tông chuẩn bị ĐỘ KIẾP ⚡</text>
          </g>
          <FigFooter label="ba điềm báo · trước cơn thiên kiếp" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 EM LỠ HỨA ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(60, 16);
  const cons = [
    { t: "CPU engineer · tăng nhiệt 🔥", e: 160 },
    { t: "technical debt · +300 năm 📉", e: 230 },
    { t: "sprint yên ổn · hiện thiên kiếp ⚡", e: 300 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="6 WORDS OF DOOM" />
          <text x={W / 2} y={280} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Truyền thuyết đáng sợ nhất · khi Sales nói:</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 420px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={340} width={920} height={150} rx={16} fill={SL_DK} stroke={WARNING_RED} strokeWidth={3.5} />
            <text x={W / 2} y={432} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>"Em lỡ hứa với khách rồi" 😬</text>
          </g>
          <text x={W / 2} y={580} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={useFadeUp(120, 12)}>chỉ 6 chữ · có thể khiến:</text>
          {cons.map((c, i) => (
            <Card key={i} cx={W / 2} y={630 + i * 110} name={`💥 ${c.t}`} color={WARNING_RED} entry={c.e} nameSize={32} />
          ))}
          <FigFooter label="sáu chữ · phá nát cả sprint" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 KHÁCH CẦN GẤP ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const tough = useFadeUp(20, 12);
  const trials = ["⚙️ vô số bug", "⚙️ vô số production incident", "⚙️ tu luyện 10 năm"];
  const crack = useScaleIn(260, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={EN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE FINAL WEAKNESS" />
          <text x={W / 2} y={300} fontSize={30} fill={EN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={tough}>Engineer tu 10 năm · đạo tâm VỮNG như núi 🗻</text>
          <text x={W / 2} y={360} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(50, 12)}>đã vượt qua:</text>
          {trials.map((t, i) => {
            const op = useFade(80 + i * 40, 10);
            return (
              <g key={i} opacity={op}>
                <rect x={W / 2 - 380} y={400 + i * 86} width={760} height={70} rx={10} fill={EN_DK} stroke={EN} strokeWidth={2} />
                <text x={W / 2} y={444 + i * 86} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t} <tspan fill={JADE}>✓ vẫn vững</tspan></text>
              </g>
            );
          })}
          <text x={W / 2} y={760} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(230, 12)}>nhưng khi nghe 4 chữ này…</text>
          <g style={{ ...crack, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={810} width={880} height={140} rx={16} fill={SL_DK} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={868} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>"Khách đang cần gấp"</text>
            <text x={W / 2} y={920} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">→ đạo tâm lập tức VẾT NỨT 💔</text>
          </g>
          <FigFooter label="đỡ được bug · không đỡ được deadline" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const peace = useFadeUp(20, 14);
  const msg = useScaleIn(180, 14);
  const doom = useScaleIn(420, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={EN} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE TRIBULATION ARRIVES" />
          <g style={peace}>
            <text x={W / 2} y={290} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">Một chiều yên bình · ngươi đang viết code ☕</text>
            <text x={W / 2} y={340} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">cảm ngộ thiên đạo · chuẩn bị commit…</text>
          </g>
          <g style={{ ...msg, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={410} width={880} height={300} rx={16} fill={BG_TERM} stroke={SL} strokeWidth={2.5} />
            <rect x={W / 2 - 440} y={410} width={880} height={50} rx={16} fill={BG_CARD} />
            <circle cx={W / 2 - 405} cy={435} r={9} fill={SL} />
            <text x={W / 2 - 375} y={442} fontSize={20} fill={TEXT_SEC} fontFamily="'JetBrains Mono', monospace" fontWeight={600}>💬 tin nhắn mới · từ Sales</text>
            <rect x={W / 2 - 405} y={500} width={500} height={64} rx={14} fill={SL_DK} />
            <text x={W / 2 - 380} y={540} fontSize={30} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"Anh ơi 🥺"</text>
            <rect x={W / 2 - 405} y={580} width={810} height={110} rx={14} fill={SL_DK} />
            <text x={W / 2 - 380} y={622} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"Sales vừa hứa với khách</text>
            <text x={W / 2 - 380} y={662} fontSize={28} fill={AMBER_BRIGHT} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>một tính năng mới" 💀</text>
          </g>
          <g style={{ ...doom, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={770} w={940} h={170} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={835} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>khoảnh khắc đó · ngươi biết…</text>
            <text x={W / 2} y={900} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">THIÊN KIẾP đã tới ⚡🌩️</text>
          </g>
          <FigFooter label="bug không sợ · sợ tin nhắn từ sales" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 CTA ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const intro = useScaleIn(20, 16);
  const side = useFadeUp(140, 14);
  const cta = useScaleIn(250, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="JOIN THE LEGEND" />
          <g style={{ ...intro, transformOrigin: `${W / 2}px 360px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={320} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu cũng từng độ kiếp này?</text>
            <text x={W / 2} y={390} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">Thả ❤️ và THEO DÕI bần đạo</text>
          </g>
          <text x={W / 2} y={500} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} style={side}>để nghe tiếp những truyền kỳ giới IT 🏯</text>
          <g style={side}>
            <text x={W / 2} y={600} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Đạo hữu đứng về phe nào? 👇</text>
            <rect x={W / 2 - 420} y={640} width={400} height={130} rx={14} fill={EN_DK} stroke={EN} strokeWidth={2.5} />
            <text x={W / 2 - 220} y={700} fontSize={48} textAnchor="middle">⚙️</text>
            <text x={W / 2 - 220} y={748} fontSize={28} fill={EN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>ENGINEERING</text>
            <rect x={W / 2 + 20} y={640} width={400} height={130} rx={14} fill={SL_DK} stroke={SL} strokeWidth={2.5} />
            <text x={W / 2 + 220} y={700} fontSize={48} textAnchor="middle">💼</text>
            <text x={W / 2 + 220} y={748} fontSize={28} fill={SL} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>SALES</text>
          </g>
          <g style={{ ...cta, transformOrigin: `${W / 2}px 900px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 360} y={850} width={720} height={100} rx={50} fill={AMBER} />
            <text x={W / 2} y={912} fontSize={36} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>❤️ FOLLOW · để không bỏ lỡ</text>
          </g>
          <text x={W / 2} y={1030} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2" style={useFadeUp(330, 12)}>comment · save · share · truyền kỳ giới IT</text>
          <FigFooter label="mỗi tuần · một truyền kỳ giới IT" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const SalesVsEngineering: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("sales_vs_engineering/voice.mp3")} />
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
