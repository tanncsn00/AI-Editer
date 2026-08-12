import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./git_dao_truyen_thuyet_beats.json";

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
const GIT_ORANGE = "#F1502F";

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
          <pattern id="gdgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="gdgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="gdglow" cx="50%" cy="38%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.08" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="gdscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#gdgrid)" />
        <rect width={W} height={H} fill="url(#gdgrid2)" />
        <rect width={W} height={H} fill="url(#gdglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#gdscan)" />
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

// git terminal showing a command
const GitTerm: React.FC<{ y: number; cmd: string; out?: string; outColor?: string; color: string; entry: number; w?: number }> = ({ y, cmd, out, outColor, color, entry, w = 880 }) => {
  const a = useScaleIn(entry, 14);
  const frame = useCurrentFrame();
  const x = W / 2 - w / 2;
  const h = out ? 165 : 118;
  return (
    <g style={{ ...a, transformOrigin: `${x + w / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={BG_TERM} stroke={color} strokeWidth={2} />
      <rect x={x} y={y} width={w} height={46} rx={10} fill={BG_CARD} />
      <rect x={x} y={y + 36} width={w} height={10} fill={BG_CARD} />
      <circle cx={x + 26} cy={y + 23} r={7} fill={WARNING_RED} />
      <circle cx={x + 50} cy={y + 23} r={7} fill={AMBER} />
      <circle cx={x + 74} cy={y + 23} r={7} fill={JADE} />
      <text x={x + w / 2} y={y + 29} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="1">bash</text>
      <text x={x + 28} y={y + 94} fontSize={30} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{cmd}</text>
      {out && <text x={x + 28} y={y + 138} fontSize={26} fill={outColor || WARNING_RED} fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={frame > entry + 20 ? 1 : 0}>{out}</text>}
    </g>
  );
};

const Card: React.FC<{ cx: number; y: number; w?: number; name: string; sub?: string; color: string; entry: number; nameSize?: number }> = ({ cx, y, w = 880, name, sub, color, entry, nameSize = 32 }) => {
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
  const frame = useCurrentFrame();
  const commits = [0, 1, 2, 3, 4];
  const title = useScaleIn(120, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={GIT_ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE LEGEND OF GIT" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>Một công pháp mọi kiếm tu đều phải tu:</text>
          {/* commit graph */}
          <g>
            <line x1={W / 2 - 360} y1={460} x2={W / 2 + 360} y2={460} stroke={GIT_ORANGE} strokeWidth={3} opacity={0.6} />
            {commits.map((c, i) => (
              <g key={i} opacity={frame > 30 + i * 12 ? 1 : 0}>
                <circle cx={W / 2 - 360 + i * 180} cy={460} r={24} fill={BG_CARD} stroke={GIT_ORANGE} strokeWidth={4} />
                <circle cx={W / 2 - 360 + i * 180} cy={460} r={9} fill={GIT_ORANGE} />
              </g>
            ))}
          </g>
          <g style={{ ...title, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={640} fontSize={48} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TRUYỀN THUYẾT</text>
            <text x={W / 2} y={740} fontSize={120} fill={GIT_ORANGE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="4">GIT ĐẠO</text>
          </g>
          <text x={W / 2} y={900} fontSize={28} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={useFadeUp(200, 12)}>nổi tiếng nhất · ám ảnh nhất giới IT 🏯</text>
          <FigFooter label="công pháp ai cũng tu · không ai thông" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 EASY START ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const cmds = [
    { t: "$ git add .", e: 50, c: JADE },
    { t: "$ git commit -m '...'", e: 95, c: ACCENT_BLUE },
    { t: "$ git push", e: 140, c: VIOLET },
  ];
  const frame = useCurrentFrame();
  const punch = useFadeUp(185, 12);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="LOOKS EASY..." />
          <text x={W / 2} y={320} fontSize={32} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>Mới nhập môn · ai cũng nghĩ Git rất đơn giản:</text>
          <g>
            <rect x={W / 2 - 420} y={420} width={840} height={340} rx={12} fill={BG_TERM} stroke={JADE} strokeWidth={2} />
            <rect x={W / 2 - 420} y={420} width={840} height={46} rx={12} fill={BG_CARD} />
            <text x={W / 2} y={450} fontSize={17} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600}>bash — 3 chiêu thức nhập môn</text>
            {cmds.map((c, i) => (
              <text key={i} x={W / 2 - 388} y={530 + i * 76} fontSize={34} fill={c.c} fontFamily="'JetBrains Mono', monospace" fontWeight={700} opacity={frame > c.e ? 1 : 0}>{c.t}</text>
            ))}
          </g>
          <g style={punch}>
            <TechBox x={W / 2 - 460} y={840} w={920} h={120} color={JADE} thick={2.5} />
            <text x={W / 2} y={915} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"dễ ấy mà" 😎 — ngươi nghĩ vậy</text>
          </g>
          <FigFooter label="ba chiêu thức · tưởng đã thành thạo" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 THE CRACKS ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const rows = [
    { cmd: "$ git rebase", out: "→ đạo tâm xuất hiện VẾT NỨT 💢", c: ORANGE, e: 40 },
    { cmd: "$ git cherry-pick", out: "→ tâm ma bắt đầu sinh sôi 👹", c: WARNING_RED, e: 160 },
    { cmd: "$ git reset --hard", out: "→ trưởng lão chuẩn bị hộ tâm đan 🧪", c: "#FF3B3B", e: 280 },
  ];
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="THEN THE CRACKS APPEAR" />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Cho tới một ngày · ngươi nhìn thấy:</text>
          {rows.map((r, i) => {
            const a = useScaleIn(r.e, 12);
            const y = 380 + i * 210;
            return (
              <g key={i} style={{ ...a, transformOrigin: `${W / 2}px ${y + 75}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 440} y={y} width={880} height={150} rx={12} fill={BG_TERM} stroke={r.c} strokeWidth={2.5} />
                <text x={W / 2 - 408} y={y + 58} fontSize={32} fill={r.c} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{r.cmd}</text>
                <text x={W / 2 - 408} y={y + 112} fontSize={28} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={frame > r.e + 24 ? 1 : 0}>{r.out}</text>
              </g>
            );
          })}
          <FigFooter label="ba ma chiêu · phá nát đạo tâm tân thủ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 ĐỘ KIẾP ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const items = [
    { t: "force push nhầm", c: WARNING_RED, e: 50 },
    { t: "merge nhầm nhánh", c: ORANGE, e: 110 },
    { t: "xóa luôn 1 ngày tu luyện", c: VIOLET, e: 170 },
    { t: "chưa biết mình vừa làm gì", c: SLATE, e: 230 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="EVERY DEV'S TRIBULATION" />
          <text x={W / 2} y={320} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(10, 12)}>Mỗi Git tu sĩ · đều phải độ kiếp một lần ⚡</text>
          {items.map((it, i) => (
            <Card key={i} cx={W / 2} y={420 + i * 120} name={`💥 ${it.t}`} color={it.c} entry={it.e} />
          ))}
          <text x={W / 2} y={1010} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(290, 12)}>… ai rồi cũng tới lượt 🥲</text>
          <FigFooter label="thiên kiếp git · không ai thoát được" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 THẦN CHÚ ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const setup = useFadeUp(20, 12);
  const card = useScaleIn(90, 16);
  const tag = useFadeUp(190, 12);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="THE LEGENDARY SPELL" />
          <text x={W / 2} y={320} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={setup}>Sau khi gây họa · tất cả lập tức niệm:</text>
          <g style={{ ...card, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 420} y={470} width={840} height={340} rx={20} fill={BG_CARD} stroke={AMBER} strokeWidth={4} />
            <rect x={W / 2 - 402} y={488} width={804} height={304} rx={14} fill="none" stroke={AMBER} strokeWidth={1} opacity={0.35} />
            <text x={W / 2} y={555} fontSize={40} fill={AMBER} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>「 thần chú 」</text>
            <text x={W / 2} y={665} fontSize={66} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>"Anh ơi</text>
            <text x={W / 2} y={745} fontSize={66} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>cứu em" 🙏</text>
          </g>
          <text x={W / 2} y={920} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} style={tag}>câu thần chú nổi tiếng nhất Git Đạo</text>
          <FigFooter label="6 chữ vạn năng · cứu vô số tu sĩ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 KHÔNG AI HIỂU ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const levels = [
    { t: "Người mới nhập môn", s: "không hiểu ❌", c: SLATE, e: 50 },
    { t: "Junior", s: "không hiểu ❌", c: ACCENT_BLUE, e: 110 },
    { t: "Senior", s: "cũng không hiểu ❌", c: VIOLET, e: 170 },
  ];
  const punch = useScaleIn(250, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="NOBODY REALLY GETS GIT" />
          <text x={W / 2} y={310} fontSize={34} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(10, 12)}>Không ai thật sự HIỂU Git 🤯</text>
          {levels.map((l, i) => (
            <Card key={i} cx={W / 2} y={390 + i * 120} name={l.t} sub={l.s} color={l.c} entry={l.e} nameSize={34} />
          ))}
          <g style={{ ...punch, transformOrigin: `${W / 2}px 880px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={790} w={940} h={170} color={AMBER} thick={3} />
            <text x={W / 2} y={855} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">khác biệt duy nhất:</text>
            <text x={W / 2} y={912} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>senior copy Stack Overflow NHANH hơn 📋</text>
          </g>
          <FigFooter label="bí mật ngành · ai cũng giả vờ hiểu" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 3 CẢNH GIỚI ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const realms = [
    { n: "1", t: "Sợ conflict", s: "né bằng mọi giá 😨", c: JADE, e: 60 },
    { n: "2", t: "Không còn sợ conflict", s: "bình thản đối mặt 😐", c: ORANGE, e: 170 },
    { n: "3", t: "Tự tạo conflict rồi giải quyết", s: "← phi thăng DevOps Giới 🧘", c: WARNING_RED, e: 280 },
  ];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="THREE REALMS OF GIT" />
          <text x={W / 2} y={290} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(8, 12)}>Git Đạo có 3 đại cảnh giới:</text>
          {realms.map((r, i) => {
            const a = useScaleIn(r.e, 14);
            const y = 360 + i * 220;
            return (
              <g key={i} style={{ ...a, transformOrigin: `${W / 2}px ${y + 90}px`, transformBox: "fill-box" }}>
                <rect x={W / 2 - 460} y={y} width={920} height={180} rx={14} fill={BG_CARD} stroke={r.c} strokeWidth={2.5} />
                <circle cx={W / 2 - 380} cy={y + 90} r={48} fill={r.c} />
                <text x={W / 2 - 380} y={y + 108} fontSize={54} fill={BG_NAVY} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{r.n}</text>
                <text x={W / 2 - 300} y={y + 78} fontSize={34} fill={r.c} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{r.t}</text>
                <text x={W / 2 - 300} y={y + 126} fontSize={26} fill={TEXT_SEC} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">{r.s}</text>
              </g>
            );
          })}
          <FigFooter label="đỉnh cao git · vượt cảnh giới phàm nhân" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 FORCE PUSH PROD ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const nots = [
    { t: "không phải conflict", e: 30 },
    { t: "không phải rebase", e: 70 },
    { t: "không phải force push", e: 110 },
  ];
  const reveal = useScaleIn(180, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="THE TRUE NIGHTMARE" />
          <text x={W / 2} y={300} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(8, 12)}>Điều đáng sợ nhất KHÔNG phải:</text>
          {nots.map((n, i) => {
            const op = useFade(n.e, 10);
            return (
              <g key={i} opacity={op}>
                <text x={W / 2} y={390 + i * 60} fontSize={32} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} textDecoration="line-through">✗ {n.t}</text>
              </g>
            );
          })}
          <text x={W / 2} y={610} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(150, 12)}>… mà là khi đồng môn gõ:</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 780px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={670} width={920} height={210} rx={12} fill={BG_TERM} stroke="#FF2D2D" strokeWidth={3.5} />
            <rect x={W / 2 - 460} y={670} width={920} height={46} rx={12} fill={BG_CARD} />
            <text x={W / 2} y={700} fontSize={17} fill={WARNING_RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>bash — ⚠ DANGER ZONE</text>
            <text x={W / 2 - 430} y={770} fontSize={34} fill="#FF5252" fontFamily="'JetBrains Mono', monospace" fontWeight={800}>$ git push --force</text>
            <text x={W / 2 - 430} y={830} fontSize={34} fill={AMBER_BRIGHT} fontFamily="'JetBrains Mono', monospace" fontWeight={800}>  → branch: PRODUCTION 💀</text>
          </g>
          <text x={W / 2} y={960} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={useFadeUp(260, 12)}>… máu lạnh toàn thân 🧊</text>
          <FigFooter label="6 từ · gây ác mộng cho cả tông môn" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 ALARM + ENDING ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const alarmOn = Math.floor(frame / 8) % 2 === 0;
  const alarms = [
    { t: "🟢 toàn bộ trưởng lão ONLINE", e: 40 },
    { t: "🔔 chuông cảnh báo vang tam giới", e: 90 },
    { t: "🛡️ hộ pháp chuẩn bị đại trận KHÔI PHỤC", e: 140 },
  ];
  const end = useScaleIn(250, 16);
  const cta = useFadeUp(320, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE ALARM · GAME OVER" />
          <g style={{ ...useScaleIn(10, 12), transformOrigin: `${W / 2}px 290px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={310} fontSize={80} textAnchor="middle" opacity={alarmOn ? 1 : 0.25}>🚨</text>
          </g>
          {alarms.map((a, i) => {
            const an = useFadeUp(a.e, 12);
            return (
              <g key={i} style={an}>
                <rect x={W / 2 - 440} y={370 + i * 100} width={880} height={80} rx={10} fill={BG_CARD} stroke={WARNING_RED} strokeWidth={2} />
                <text x={W / 2} y={420 + i * 100} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{a.t}</text>
              </g>
            );
          })}
          <g style={{ ...end, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={710} w={940} h={180} color="#FF2D2D" thick={3} />
            <text x={W / 2} y={775} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Còn ngươi… chỉ biết đứng nhìn</text>
            <text x={W / 2} y={845} fontSize={46} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đạo tâm VỠ VỤN 💔</text>
          </g>
          <g transform={`translate(${W / 2}, 990)`} opacity={cta.opacity}>
            <text x={0} y={0} fontSize={30} fill={AMBER} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Đạo hữu ở cảnh giới mấy? 👇</text>
            <line x1={-240} y1={44} x2={240} y2={44} stroke={AMBER} strokeWidth={1} />
            <text x={0} y={92} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">comment · save · follow · truyền kỳ giới IT</text>
          </g>
          <FigFooter label="git đạo · nơi đạo tâm thường xuyên vỡ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9];

export const GitDaoTruyenThuyet: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("git_dao_truyen_thuyet/voice.mp3")} />
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
