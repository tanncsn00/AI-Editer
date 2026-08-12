import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./pov_ba_beats.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "11";

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
          <pattern id="pbgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="pbgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="pbglow" cx="50%" cy="36%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.09" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pbscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#pbgrid)" />
        <rect width={W} height={H} fill="url(#pbgrid2)" />
        <rect width={W} height={H} fill="url(#pbglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#pbscan)" />
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
  const w = big ? 660 : 460;
  return (
    <g style={{ ...a, transformOrigin: `${cx}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={cx - w / 2} y={cy - 58} width={w} height={116} rx={16} fill={BG_CARD} stroke={color} strokeWidth={3.5} />
      <text x={cx} y={cy + (sub ? -6 : 14)} fontSize={big ? 42 : 40} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{label}</text>
      {sub && <text x={cx} y={cy + 32} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};
const Quote: React.FC<{ y: number; who: string; whoColor: string; say: string; sayColor?: string; entry: number }> = ({ y, who, whoColor, say, sayColor = TEXT_PRI, entry }) => {
  const a = useScaleIn(entry, 12);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 50}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 470} y={y} width={940} height={100} rx={14} fill={BG_CARD} stroke={whoColor} strokeWidth={2.5} />
      <text x={W / 2 - 430} y={y + 42} fontSize={23} fill={whoColor} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>{who}</text>
      <text x={W / 2 - 430} y={y + 80} fontSize={30} fill={sayColor} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"{say}"</text>
    </g>
  );
};

// ============ S1 INTRO ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const chain = useScaleIn(164, 14);
  const naive = useScaleIn(301, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="POV · THE BA" />
          <text x={W / 2} y={350} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} style={useFadeUp(20, 12)}>Năm ấy · ta nhập môn NHU CẦU ĐẠO</text>
          <text x={W / 2} y={418} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(60, 12)}>ta tin công việc rất đơn giản:</text>
          <g style={{ ...chain, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={480} width={940} height={150} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={540} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>khách hàng nói → ta ghi lại → Dev làm</text>
            <text x={W / 2} y={595} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>→ thiên hạ thái bình 🤣</text>
          </g>
          <g style={{ ...naive, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={700} w={940} h={130} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={758} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>sau này mới biết…</text>
            <text x={W / 2} y={808} fontSize={40} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">ta đã quá NGÂY THƠ 💀</text>
          </g>
          <FigFooter label="business analyst · người đứng giữa 2 thế giới" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 STORY1A ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const impacts = ["7️⃣ 7 API", "4️⃣ 4 service", "2️⃣ 2 mobile app", "3️⃣ 3 job đồng bộ", "1️⃣ 1 báo cáo doanh thu", "💳 toàn bộ thanh toán"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="JUST ONE FIELD" />
          <Quote y={235} who="🙍 khách hàng" whoColor={AMBER} say="ta muốn thêm 1 trường trạng thái" entry={122} />
          <Quote y={350} who="💻 Dev hỏi" whoColor={ACCENT_BLUE} say="nó ảnh hưởng tới những gì?" entry={465} />
          <Quote y={465} who="🙋 ta (BA)" whoColor={JADE} say="chỉ thêm 1 cột thôi mà?" entry={544} />
          <text x={W / 2} y={618} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={useFadeUp(700, 12)}>Dev chỉ về phía xa: "nó ảnh hưởng tới…"</text>
          <g>
            {impacts.map((t, i) => {
              const col = i % 2, row = Math.floor(i / 2);
              return (
                <g key={i} opacity={useFade(720 + i * 28, 9)}>
                  <rect x={W / 2 - 460 + col * 470} y={650 + row * 84} width={450} height={70} rx={10} fill="#2A1010" stroke={WARNING_RED} strokeWidth={1.5} />
                  <text x={W / 2 - 235 + col * 470} y={693 + row * 84} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
                </g>
              );
            })}
          </g>
          <FigFooter label="coupling · không gì đứng một mình" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 STORY1B ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const est = useScaleIn(214, 14);
  const reveal = useScaleIn(413, 16);
  const moral = useFadeUp(563, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="EVERYTHING IS CONNECTED" />
          <g style={{ ...est, transformOrigin: `${W / 2}px 350px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={270} width={940} height={170} rx={16} fill={BG_TERM} stroke={ACCENT_BLUE} strokeWidth={3} />
            <text x={W / 2} y={322} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Dev ngẩng đầu nhìn trời · thở dài:</text>
            <text x={W / 2} y={372} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"Đạo Tổ Software sống lại</text>
            <text x={W / 2} y={415} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>cũng phải estimate lại từ đầu" 💀</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={560} label="LIÊN ĐỚI NHÂN QUẢ ĐẠO" sub="// coupling · ripple effect" color={AMBER} entry={0} big />
          </g>
          <g style={moral}>
            <text x={W / 2} y={710} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>trong Software Đạo · không gì đứng một mình</text>
            <text x={W / 2} y={762} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">1 trường mới · kéo 10 hệ thống cùng độ kiếp ⚡</text>
          </g>
          <FigFooter label="ripple effect · 1 thay đổi · vạn hệ luỵ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 STORY2A ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const dev = useScaleIn(392, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="JUST ONE WORD" />
          <text x={W / 2} y={300} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(20, 12)}>1 tháng sau · khách hàng lại tới:</text>
          <Quote y={350} who="🙍 khách hàng" whoColor={AMBER} say="chỉ đổi 1 dòng chữ thôi" entry={134} />
          <g style={{ ...dev, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={510} width={940} height={250} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={565} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Dev mở source code · trầm mặc · rồi nói:</text>
            <text x={W / 2} y={625} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"chữ này hardcode ở 17 NƠI 😵</text>
            <text x={W / 2} y={685} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đổi 1 chữ · nhưng phải</text>
            <text x={W / 2} y={730} fontSize={36} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">BUILD lại cả tam giới" 💀</text>
          </g>
          <FigFooter label="hardcode · quả bom nổ chậm của codebase" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 STORY2B ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const reveal = useScaleIn(153, 16);
  const cmp = useScaleIn(218, 14);
  const dev = useScaleIn(317, 14);
  const moral = useFadeUp(437, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="SURFACE vs TRUTH" />
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 300px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={300} label="BIỂU TƯỢNG & CHÂN TƯỚNG ĐẠO" sub="// abstraction · tảng băng chìm" color={JADE} entry={0} big />
          </g>
          <g style={cmp}>
            <rect x={W / 2 - 470} y={420} width={455} height={300} rx={16} fill="#0E2A1A" stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2 - 242} y={475} fontSize={26} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>👤 NGƯỜI DÙNG thấy</text>
            <text x={W / 2 - 242} y={580} fontSize={40} textAnchor="middle">📝</text>
            <text x={W / 2 - 242} y={650} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>1 dòng chữ</text>
          </g>
          <g style={dev}>
            <rect x={W / 2 + 15} y={420} width={455} height={300} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2 + 242} y={475} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>💻 DEV thấy</text>
            <text x={W / 2 + 242} y={535} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>17 file</text>
            <text x={W / 2 + 242} y={595} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>5 service</text>
            <text x={W / 2 + 242} y={655} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>3 tầng kế thừa</text>
          </g>
          <text x={W / 2} y={800} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={moral}>đơn giản với user · chưa chắc đơn giản với hệ thống</text>
          <FigFooter label="iceberg · phần chìm luôn lớn hơn phần nổi" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 STORY3A ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const all = useScaleIn(269, 14);
  const q1 = useScaleIn(333, 12);
  const q2 = useScaleIn(386, 12);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="'SAME AS THE OLD ONE'" />
          <Quote y={250} who="🙍 khách hàng" whoColor={AMBER} say="ta muốn giống hệ thống cũ" entry={157} />
          <g style={{ ...all, transformOrigin: `${W / 2}px 430px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={370} width={940} height={100} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
            <text x={W / 2 - 430} y={415} fontSize={24} fill={JADE} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>ta: "giống phần nào?"</text>
            <text x={W / 2 + 430} y={435} fontSize={34} fill={AMBER_BRIGHT} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"TẤT CẢ" 💀</text>
          </g>
          <g style={q1}>
            <rect x={W / 2 - 470} y={500} width={940} height={84} rx={12} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={2} />
            <text x={W / 2 - 430} y={550} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"có tài liệu không?"</text>
            <text x={W / 2 + 430} y={550} fontSize={30} fill={WARNING_RED} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>KHÔNG 💀</text>
          </g>
          <g style={q2}>
            <rect x={W / 2 - 470} y={600} width={940} height={84} rx={12} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={2} />
            <text x={W / 2 - 430} y={650} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"có source code không?"</text>
            <text x={W / 2 + 430} y={650} fontSize={30} fill={WARNING_RED} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>KHÔNG 💀</text>
          </g>
          <FigFooter label="'giống cái cũ' · 3 từ đáng sợ nhất nghề BA" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 STORY3B ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const q3 = useScaleIn(10, 12);
  const find = useScaleIn(92, 14);
  const reveal = useScaleIn(397, 16);
  const moral = useFadeUp(549, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="THE ANCIENT RELIC" />
          <g style={q3}>
            <rect x={W / 2 - 470} y={230} width={940} height={84} rx={12} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={2} />
            <text x={W / 2 - 430} y={280} fontSize={26} fill={TEXT_PRI} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"có người hiểu hệ thống đó không?"</text>
            <text x={W / 2 + 430} y={280} fontSize={28} fill={WARNING_RED} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>…trầm mặc 💀</text>
          </g>
          <g style={{ ...find, transformOrigin: `${W / 2}px 410px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={340} width={940} height={150} rx={16} fill={BG_CARD} stroke={VIOLET} strokeWidth={2.5} />
            <text x={W / 2} y={392} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>sau 3 ngày truy tra · ta phát hiện:</text>
            <text x={W / 2} y={445} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>người duy nhất hiểu · đã NGHỈ 5 năm trước 🤣</text>
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 600px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={600} label="THƯỢNG CỔ DI TÍCH ĐẠO" sub="// legacy system · không ai dám tắt" color={VIOLET} entry={0} big />
          </g>
          <text x={W / 2} y={750} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={moral}>không ai biết ai viết · nhưng cả tông môn KHÔNG DÁM TẮT</text>
          <FigFooter label="legacy · di tích sống của mọi công ty" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 STORY4A ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const doc = useScaleIn(166, 14);
  const none = useFadeUp(276, 14);
  const dev = useScaleIn(692, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="47 PAGES OF CHAOS" />
          <g style={{ ...doc, transformOrigin: `${W / 2}px 320px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 460} y={250} width={920} height={140} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={310} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>khách gửi 1 bản yêu cầu 📄</text>
            <text x={W / 2} y={360} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>DÀI 47 TRANG</text>
          </g>
          <g style={none}>
            {["🙋 ta nhìn xong → không hiểu", "📋 PM nhìn xong → không hiểu", "🔍 QA nhìn xong → không hiểu"].map((t, i) => (
              <g key={i} opacity={useFade(290 + i * 60, 10)}>
                <rect x={W / 2 - 440} y={430 + i * 78} width={880} height={64} rx={10} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={1.5} />
                <text x={W / 2} y={472 + i * 78} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...dev, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 470} y={690} w={940} h={150} color={WARNING_RED} thick={3} />
            <text x={W / 2} y={745} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Dev đọc xong · ánh mắt thương cảm:</text>
            <text x={W / 2} y={800} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Yêu cầu này · bố ta cũng chả làm được" 💀</text>
          </g>
          <FigFooter label="requirement · càng dày càng mơ hồ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 STORY4B ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const collapse = useFadeUp(97, 14);
  const reveal = useScaleIn(324, 16);
  const moral = useScaleIn(402, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="REQUIREMENT REVEALS TRUTH" />
          <text x={W / 2} y={310} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={collapse}>đạo tâm Nhu Cầu Đạo của ta · suýt tan thành mây khói 😵</text>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 460px`, transformBox: "fill-box" }}>
            <Reveal cx={W / 2} cy={460} label="NHU CẦU HIỂN THÁNH ĐẠO" sub="// requirement gặp hiện thực" color={ORANGE} entry={0} big />
          </g>
          <g style={{ ...moral, transformOrigin: `${W / 2}px 680px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={580} width={960} height={210} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={640} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>yêu cầu khi còn trong PowerPoint 📊</text>
            <text x={W / 2} y={690} fontSize={32} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>đều trông vô cùng ĐƠN GIẢN</text>
            <text x={W / 2} y={752} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">vào hiện thực → thiên đạo tính NHÂN QUẢ 💀</text>
          </g>
          <FigFooter label="slide thì đẹp · thực thi mới biết đau" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 CLIMAX ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const accept = useFadeUp(99, 14);
  const quote = useScaleIn(212, 14);
  const react = useFadeUp(271, 14);
  const reveal = useScaleIn(529, 16);
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE ACCEPTANCE" />
          <text x={W / 2} y={280} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={accept}>dự án xong · khách nghiệm thu · nhìn thật lâu…</text>
          <g style={{ ...quote, transformOrigin: `${W / 2}px 380px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 470} y={310} width={940} height={140} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={4} opacity={0.8 + 0.2 * glow} />
            <text x={W / 2} y={395} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"Ơ. Tôi tưởng nó phải KHÁC chứ?" 💀</text>
          </g>
          <g style={react}>
            {["📋 PM đạo tâm vỡ vụn", "💻 Dev khí huyết nghịch hành", "🔍 QA xuất hiện tâm ma"].map((t, i) => (
              <g key={i} opacity={useFade(290 + i * 40, 10)}>
                <rect x={W / 2 - 440} y={490 + i * 72} width={880} height={60} rx={10} fill="#2A1010" stroke={WARNING_RED} strokeWidth={1.5} />
                <text x={W / 2} y={530 + i * 72} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...reveal, transformOrigin: `${W / 2}px 790px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={720} w={960} h={150} color={AMBER} thick={3} />
            <text x={W / 2} y={775} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ta mở biên bản họp · phát hiện:</text>
            <text x={W / 2} y={820} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>khách chưa từng nói rõ thứ họ muốn…</text>
            <text x={W / 2} y={855} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">và cũng chưa chắc biết mình muốn gì 💀</text>
          </g>
          <FigFooter label="acceptance · khi nhân quả lộ diện" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S11 ENDING ============
const S11: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const mid = useFadeUp(141, 14);
  const trans = useScaleIn(344, 14);
  const lesson = useFadeUp(572, 14);
  const punch = useScaleIn(783, 16);
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="10" label="THE MIDDLE WORLD" />
          <g style={mid}>
            <text x={W / 2} y={285} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>khách thấy KẾT QUẢ · Dev thấy ĐỘ PHỨC TẠP</text>
            <text x={W / 2} y={335} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>còn BA · đứng giữa 2 thế giới 🌉</text>
          </g>
          <g style={trans}>
            <rect x={W / 2 - 470} y={390} width={940} height={150} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={440} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>biến "việc này chắc đơn giản thôi"</text>
            <text x={W / 2} y={495} fontSize={32} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">thành "ta cần họp thêm 1 buổi" 🤣</text>
          </g>
          <g style={lesson}>
            {["✏️ viết code sai → có thể sửa", "🚀 deploy lỗi → có thể rollback", "🗄️ database hỏng → có thể restore"].map((t, i) => (
              <g key={i} opacity={useFade(585 + i * 45, 10)}>
                <rect x={W / 2 - 450} y={570 + i * 66} width={900} height={54} rx={10} fill={BG_TERM} stroke={JADE} strokeWidth={1.5} />
                <text x={W / 2} y={605 + i * 66} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={{ ...punch, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={780} width={960} height={110} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={4} opacity={0.8 + 0.2 * glow} />
            <text x={W / 2} y={835} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nhưng HIỂU SAI YÊU CẦU →</text>
            <text x={W / 2} y={872} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cả tam giới cùng gánh nhân quả 🤣</text>
          </g>
          <FigFooter label="requirement sai · không có nút undo" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S12 CTA ============
const S12: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(6, 12);
  const cmt = useScaleIn(68, 14);
  const btn = useScaleIn(110, 14);
  const pulse = 1 + 0.03 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <g style={ask}>
            <text x={W / 2} y={500} fontSize={38} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Ngươi muốn nghe POV</text>
            <text x={W / 2} y={555} fontSize={42} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">của nghề nào tiếp theo? 🤔</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 660px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={675} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 comment phía dưới 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 830px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={760} width={600} height={140} rx={70} fill={JADE} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={772} width={570} height={116} rx={58} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
              <text x={W / 2} y={848} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={980} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(150, 12)}>để không bỏ lỡ truyền kỳ giới IT tiếp theo 🏯</text>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12];

export const PovBa: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("pov_ba/voice.mp3")} />
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
