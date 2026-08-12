import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./design_pattern_truyen_thua_beats.json";

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
          <pattern id="dpgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="dpgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="dpglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dpscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#dpgrid)" />
        <rect width={W} height={H} fill="url(#dpgrid2)" />
        <rect width={W} height={H} fill="url(#dpglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#dpscan)" />
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

const Reveal: React.FC<{ cx: number; cy: number; label: string; sub?: string; color: string; entry: number; big?: boolean }> = ({ cx, cy, label, sub, color, entry, big }) => {
  const a = useScaleIn(entry, 14);
  const w = big ? 600 : 440;
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={cx - w / 2} y={cy - 60} width={w} height={120} rx={16} fill={BG_CARD} stroke={color} strokeWidth={3.5} />
      <text x={cx} y={cy + (sub ? -4 : 16)} fontSize={big ? 54 : 46} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{label}</text>
      {sub && <text x={cx} y={cy + 38} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const out = useFadeUp(60, 14);
  const real = useScaleIn(330, 16);
  const outcomes = [
    { t: "✓ có người thành công", c: JADE, e: 90 },
    { t: "💀 có người tẩu hỏa nhập ma", c: WARNING_RED, e: 150 },
    { t: "🗑️ có người để lại cổ cấm địa", c: ORANGE, e: 210 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE ANCIENT ERA" />
          <text x={W / 2} y={300} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Thời thượng cổ · mỗi vấn đề mới…</text>
          <text x={W / 2} y={362} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(20, 12)}>tu sĩ phải TỰ sáng tạo công pháp ⚔️</text>
          <g style={out}>
            {outcomes.map((o, i) => (
              <g key={i} opacity={useFade(o.e, 12)}>
                <rect x={W / 2 - 430} y={430 + i * 95} width={860} height={78} rx={12} fill={BG_CARD} stroke={o.c} strokeWidth={2} />
                <text x={W / 2} y={478 + i * 95} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{o.t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...real, transformOrigin: `${W / 2}px 850px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={760} w={940} h={190} color={AMBER} thick={3} />
            <text x={W / 2} y={825} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>qua vô số năm · đại năng nhận ra:</text>
            <text x={W / 2} y={882} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>vấn đề thay đổi · nhưng cách giải…</text>
            <text x={W / 2} y={930} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">lại GIỐNG NHAU 🔁</text>
          </g>
          <FigFooter label="cùng 1 vấn đề · lặp lại khắp thiên hạ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 CATALOG ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const pats = [
    { n: "SINGLETON", p: "chỉ 1 vị tông chủ duy nhất", c: AMBER, e: 60 },
    { n: "FACTORY", p: "luyện chế đủ loại pháp bảo", c: JADE, e: 220 },
    { n: "OBSERVER", p: "trưởng lão đột phá → cả tông nhận tin", c: ACCENT_BLUE, e: 380 },
    { n: "DECORATOR", p: "gia trì thêm năng lực pháp bảo", c: VIOLET, e: 520 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="ONE PROBLEM · ONE PATTERN" />
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>mỗi vấn đề lặp lại · sinh ra một công pháp:</text>
          {pats.map((p, i) => {
            const y = 350 + i * 155;
            return (
              <g key={i} style={{ ...useScaleIn(p.e, 14), transformOrigin: `${W / 2}px ${y + 65}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 470} y={y} width={940} height={130} rx={16} fill={BG_CARD} stroke={p.c} strokeWidth={2.5} />
                <text x={W / 2 - 430} y={y + 60} fontSize={26} fill={TEXT_MUTE} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">{p.p}</text>
                <text x={W / 2 - 430} y={y + 102} fontSize={40} fill={p.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{p.n}</text>
                <text x={W / 2 + 430} y={y + 80} fontSize={30} fill={TEXT_MUTE} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>Đạo</text>
              </g>
            );
          })}
          <FigFooter label="singleton · factory · observer · decorator" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 CHAOS ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const spread = useFadeUp(30, 14);
  const each = useFadeUp(100, 14);
  const chaos = useScaleIn(170, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="BEFORE THE BOOK" />
          <text x={W / 2} y={330} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={spread}>ban đầu · công pháp nằm RẢI RÁC khắp thiên hạ 🗺️</text>
          <g style={each}>
            <rect x={W / 2 - 440} y={420} width={420} height={110} rx={14} fill={BG_CARD} stroke={ORANGE} strokeWidth={2} />
            <text x={W / 2 - 230} y={468} fontSize={28} fill={ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>mỗi tông</text>
            <text x={W / 2 - 230} y={508} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>dùng 1 kiểu</text>
            <rect x={W / 2 + 20} y={420} width={420} height={110} rx={14} fill={BG_CARD} stroke={ORANGE} strokeWidth={2} />
            <text x={W / 2 + 230} y={468} fontSize={28} fill={ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>mỗi trưởng lão</text>
            <text x={W / 2 + 230} y={508} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>gọi 1 tên</text>
          </g>
          <g style={{ ...chaos, transformOrigin: `${W / 2}px 680px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 440} y={600} w={880} h={150} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={695} fontSize={48} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">TAM GIỚI HỖN LOẠN 🌀</text>
          </g>
          <FigFooter label="cùng 1 ý tưởng · trăm cái tên khác nhau" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 GOF ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const year = useScaleIn(20, 14);
  const names = useFadeUp(120, 14);
  const book = useScaleIn(280, 16);
  const nameList = ["Erich Gamma", "Richard Helm", "Ralph Johnson", "John Vlissides"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="THE GANG OF FOUR" />
          <g style={{ ...year, transformOrigin: `${W / 2}px 290px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={310} fontSize={72} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">NĂM 1994</text>
          </g>
          <g style={names}>
            {nameList.map((n, i) => {
              const col = i % 2, row = Math.floor(i / 2);
              return (
                <g key={i} opacity={useFade(140 + i * 30, 10)}>
                  <rect x={W / 2 - 460 + col * 470} y={380 + row * 110} width={440} height={90} rx={12} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
                  <text x={W / 2 - 240 + col * 470} y={435 + row * 110} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{n}</text>
                </g>
              );
            })}
          </g>
          <g style={{ ...book, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 440} y={630} width={880} height={180} rx={16} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={695} fontSize={40} textAnchor="middle">📖</text>
            <text x={W / 2} y={750} fontSize={42} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>“Design Patterns”</text>
            <text x={W / 2} y={790} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// bộ bí tịch biên soạn chung</text>
          </g>
          <Reveal cx={W / 2} cy={910} label="GANG OF FOUR" sub="// hậu thế gọi 4 người ấy" color={AMBER_BRIGHT} entry={380} big />
          <FigFooter label="GoF · 4 người · 1 bộ bí tịch huyền thoại" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 SPREAD ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const num = useScaleIn(30, 16);
  const spread = useScaleIn(160, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="23 PATTERNS" />
          <g style={{ ...num, transformOrigin: `${W / 2}px 450px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 380} y={330} width={760} height={250} rx={20} fill={BG_TERM} stroke={JADE} strokeWidth={3} />
            <text x={W / 2} y={460} fontSize={130} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>23</text>
            <text x={W / 2} y={530} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>công pháp nổi tiếng nhất được ghi chép</text>
          </g>
          <g style={{ ...spread, transformOrigin: `${W / 2}px 730px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={650} w={940} h={170} color={AMBER} thick={3} />
            <text x={W / 2} y={710} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>truyền thừa vốn chỉ trong vài tông môn…</text>
            <text x={W / 2} y={770} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">lan truyền KHẮP giới phần mềm 🌍</text>
          </g>
          <FigFooter label="23 patterns · kinh điển tới tận hôm nay" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 MISCONCEPTION ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const myth = useScaleIn(30, 14);
  const truth = useFadeUp(180, 14);
  const paid = useScaleIn(320, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="NOT WHAT YOU THINK" />
          <g style={myth}>
            <rect x={W / 2 - 460} y={300} width={920} height={140} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={352} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>tu sĩ mới nhập môn hiểu lầm:</text>
            <text x={W / 2} y={405} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>“Design Pattern cực kỳ CAO SIÊU” ✗</text>
          </g>
          <text x={W / 2} y={520} fontSize={34} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={truth}>thực ra · KHÔNG phải công pháp mới</text>
          <g style={{ ...paid, transformOrigin: `${W / 2}px 720px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={580} width={940} height={290} rx={18} fill={BG_TERM} stroke={JADE} strokeWidth={3} />
            <text x={W / 2} y={650} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mà là KINH NGHIỆM được đúc kết</text>
            <text x={W / 2} y={700} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>từ vô số lần độ kiếp 🌩️</text>
            <line x1={W / 2 - 380} y1={735} x2={W / 2 + 380} y2={735} stroke={TEXT_MUTE} strokeWidth={1} opacity={0.4} />
            <text x={W / 2} y={790} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>là những sai lầm mà tiền bối</text>
            <text x={W / 2} y={838} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đã TRẢ GIÁ THAY cho ngươi 💫</text>
          </g>
          <FigFooter label="pattern · vết sẹo của những người đi trước" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 INHERIT ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const no = useScaleIn(20, 12);
  const yes = useScaleIn(80, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="INHERIT WISDOM" />
          <text x={W / 2} y={340} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>khi dùng Design Pattern · ngươi…</text>
          <g style={{ ...no, transformOrigin: `${W / 2}px 480px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={410} width={920} height={130} rx={16} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={490} fontSize={36} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>✗ KHÔNG phải sao chép code</text>
          </g>
          <text x={W / 2} y={610} fontSize={44} fill={JADE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={useFade(70, 10)}>↓</text>
          <g style={{ ...yes, transformOrigin: `${W / 2}px 740px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={660} w={940} h={160} color={JADE} thick={3} />
            <text x={W / 2} y={725} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>✓ mà đang KẾ THỪA</text>
            <text x={W / 2} y={780} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">trí tuệ của các tiền bối 🧠</text>
          </g>
          <FigFooter label="đứng trên vai người khổng lồ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 TAM MA ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(30, 14);
  const every = useFadeUp(160, 14);
  const overkill = useScaleIn(300, 14);
  const pats = ["Singleton", "Factory", "Abstract Factory"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE INNER DEMON" />
          <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>nhưng từ đó · một tâm ma mới xuất hiện…</text>
          <Reveal cx={W / 2} cy={420} label="PATTERN TÂM MA" sub="// pattern overuse" color={WARNING_RED} entry={30} big />
          <g style={every}>
            {pats.map((p, i) => (
              <g key={i} opacity={useFade(180 + i * 35, 10)}>
                <rect x={W / 2 - 440} y={540 + i * 78} width={880} height={64} rx={10} fill={BG_CARD} stroke={ORANGE} strokeWidth={1.5} />
                <text x={W / 2} y={582 + i * 78} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhìn đâu cũng muốn {p} 👀</text>
              </g>
            ))}
          </g>
          <g style={{ ...overkill, transformOrigin: `${W / 2}px 860px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={790} w={940} h={150} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={848} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>một class đơn giản…</text>
            <text x={W / 2} y={900} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cũng nhét vào 3 TẦNG trận pháp 🌀</text>
          </g>
          <FigFooter label="over-engineering · bệnh nghề nghiệp" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 RESULT ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const a = useScaleIn(15, 14);
  const b = useScaleIn(70, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE OUTCOME" />
          <g style={{ ...a, transformOrigin: `${W / 2}px 480px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={400} width={940} height={160} rx={16} fill={BG_CARD} stroke={ORANGE} strokeWidth={2.5} />
            <text x={W / 2} y={470} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cuối cùng · vấn đề</text>
            <text x={W / 2} y={520} fontSize={40} fill={ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>CHƯA được giải quyết 🤷</text>
          </g>
          <g style={{ ...b, transformOrigin: `${W / 2}px 700px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={620} w={940} h={160} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={690} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>nhưng đồng môn đã</text>
            <text x={W / 2} y={740} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">không ai hiểu CODE nữa 💀</text>
          </g>
          <FigFooter label="phức tạp hóa · không giải quyết được gì" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 ENDING ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const tool = useScaleIn(30, 14);
  const vs = useScaleIn(200, 14);
  const reveal = useScaleIn(400, 18);
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="THE REAL INHERITANCE" />
          <g style={tool}>
            <text x={W / 2} y={290} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Design Pattern không phải MỤC ĐÍCH</text>
            <text x={W / 2} y={340} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">nó chỉ là CÔNG CỤ 🔧</text>
          </g>
          <g style={vs}>
            <rect x={W / 2 - 470} y={390} width={455} height={180} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2 - 242} y={445} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>KẺ YẾU</text>
            <text x={W / 2 - 242} y={495} fontSize={25} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>học Pattern để</text>
            <text x={W / 2 - 242} y={535} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>KHOE công pháp</text>
            <rect x={W / 2 + 15} y={390} width={455} height={180} rx={16} fill="#0E2A1A" stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2 + 242} y={445} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>KẺ MẠNH</text>
            <text x={W / 2 + 242} y={495} fontSize={25} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>biết khi nào</text>
            <text x={W / 2 + 242} y={535} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>KHÔNG cần dùng</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 810px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={650} width={960} height={300} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.75 + 0.25 * glow} />
            <text x={W / 2} y={710} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">truyền thừa chân chính…</text>
            <text x={W / 2} y={765} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>không nằm ở việc NHỚ 23 công pháp</text>
            <text x={W / 2} y={825} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà ở việc HIỂU:</text>
            <text x={W / 2} y={885} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tiền bối năm xưa gặp VẤN ĐỀ GÌ</text>
            <text x={W / 2} y={925} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>để phải tạo ra chúng 🏯</text>
          </g>
          <FigFooter label="hiểu 'vì sao' · mới là truyền thừa thật" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const DesignPatternTruyenThua: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("design_pattern_truyen_thua/voice.mp3")} />
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
