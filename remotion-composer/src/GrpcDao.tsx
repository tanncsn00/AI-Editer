import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./grpc_dao_beats.json";
import T from "./grpc_dao_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "14";

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
          <pattern id="grpcgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="grpcgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="grpcglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.1" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="grpcscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#grpcgrid)" />
        <rect width={W} height={H} fill="url(#grpcgrid2)" />
        <rect width={W} height={H} fill="url(#grpcglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#grpcscan)" />
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
      <rect x={W / 2 - 490} y={cy - 76} width={980} height={152} rx={18} fill={BG_CARD} stroke={color} strokeWidth={4} />
      <text x={W / 2} y={cy - 22} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>《{cn}》</text>
      <text x={W / 2} y={cy + 34} fontSize={42} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{en}</text>
      {sub && <text x={W / 2} y={cy + 62} fontSize={19} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};
const Card: React.FC<{ y: number; h: number; color: string; entry: number; children: React.ReactNode; fill?: string }> = ({ y, h, color, entry, children, fill = BG_CARD }) => {
  const a = useScaleIn(entry, 12);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + h / 2}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 480} y={y} width={960} height={h} rx={14} fill={fill} stroke={color} strokeWidth={2.5} />
      {children}
    </g>
  );
};

// ============ S1 INTRO ============
const S1: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={AMBER} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="00" label="MICROSERVICE ERA" />
        <text x={W / 2} y={330} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(20, 12)}>bước vào Microservice Kỷ Nguyên · đại năng phát hiện:</text>
        <g style={useScaleIn(120, 14)}>
          <rect x={W / 2 - 480} y={400} width={960} height={96} rx={14} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
          <text x={W / 2} y={458} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>viết code · KHÔNG còn là việc khó nhất 🤔</text>
        </g>
        <g style={useScaleIn(T.INTRO.hard, 16)}>
          <rect x={W / 2 - 490} y={560} width={980} height={150} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
          <text x={W / 2} y={620} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>khó nhất là…</text>
          <text x={W / 2} y={680} fontSize={38} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">làm sao các TÔNG MÔN nói chuyện với nhau 💀</text>
        </g>
        <FigFooter label="gRPC · cách microservice giao tiếp tốc độ cực hạn" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S2 MONOLITH ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={JADE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="01" label="MONOLITH → SPLIT" />
        <g style={useScaleIn(T.MONOLITH.mono, 14)}>
          <rect x={W / 2 - 480} y={240} width={960} height={150} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
          <text x={W / 2} y={292} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thời MONOLITH · chung 1 đại điện:</text>
          <text x={W / 2} y={340} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>👤 User · 📦 Order · 💳 Payment · 🏪 Inventory</text>
          <text x={W / 2} y={378} fontSize={23} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>muốn hỏi ai · chỉ cần quay đầu</text>
        </g>
        <text x={W / 2} y={460} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={useScaleIn(T.MONOLITH.call, 12)}>gọi 1 hàm → lập tức có KẾT QUẢ 🤣</text>
        <g style={useScaleIn(T.MONOLITH.split, 14)}>
          <rect x={W / 2 - 480} y={520} width={960} height={150} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
          <text x={W / 2} y={572} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>💥 ĐẠI PHÂN LIỆT THỜI ĐẠI</text>
          <text x={W / 2} y={625} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>tách thành các MICROSERVICE riêng</text>
          <text x={W / 2} y={660} fontSize={22} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>User · Order · Payment · Notification · Inventory</text>
        </g>
        <text x={W / 2} y={770} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.MONOLITH.strong, 12)}>thoạt nhìn · thiên hạ càng HÙNG MẠNH 🤣</text>
        <FigFooter label="monolith: gọi nội bộ · microservice: gọi qua mạng" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S3 PROBLEM ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const Q = ["👤 người này là AI?", "🏪 hàng còn hay không?", "💳 tiền đã trừ chưa?", "🔔 thông báo gửi chưa?"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="THE CHATTER PROBLEM" />
          <text x={W / 2} y={270} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(20, 12)}>1 đệ tử bấm MUA HÀNG → Order Tông phải hỏi:</text>
          <g>
            {Q.map((t, i) => (
              <g key={i} style={useScaleIn((T.PROBLEM.q as number[])[i], 11)}>
                <rect x={W / 2 - 460} y={310 + i * 78} width={920} height={64} rx={11} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={1.5} />
                <text x={W / 2} y={352 + i * 78} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <g style={useScaleIn(T.PROBLEM.chuc, 14)}>
            <rect x={W / 2 - 480} y={645} width={960} height={96} rx={14} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={702} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">1 hàm đơn giản → HÀNG CHỤC lần truyền âm 💀</text>
          </g>
          <text x={W / 2} y={810} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={useScaleIn(T.PROBLEM.cross, 12)}>gọi hàm bên tông khác (xuyên thiên sơn vạn thủy) KIỂU GÌ? 🤯</text>
          <FigFooter label="1 click → hàng chục network call giữa service" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 RPC ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={VIOLET} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="03" label="THE RPC IDEA" />
        <text x={W / 2} y={258} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(20, 12)}>cổ nhân đã hỏi từ thượng cổ (chưa có HTTP/Web)…</text>
        <Hero cy={400} cn="Remote Procedure Call · Viễn Trình Triệu Hoán Thuật" en="RPC ĐẠO" sub="// gọi hàm từ xa như gọi tại chỗ" color={VIOLET} entry={T.RPC.hero} />
        <g style={useScaleIn(T.RPC.idea, 14)}>
          <rect x={W / 2 - 480} y={530} width={960} height={150} rx={16} fill={BG_TERM} stroke={ACCENT_BLUE} strokeWidth={2.5} />
          <text x={W / 2} y={582} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>RPC KHÔNG phải công pháp/HTTP · mà là 1 Ý NIỆM:</text>
          <text x={W / 2} y={632} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>gọi hàm · không cần biết nó ở ĐÂU</text>
          <text x={W / 2} y={668} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>máy nào · qua bao giới vực</text>
        </g>
        <g style={useScaleIn(T.RPC.pay, 14)}>
          <TechBox x={W / 2 - 300} y={730} w={600} h={110} color={AMBER} thick={3} />
          <text x={W / 2} y={780} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>chỉ cần viết:</text>
          <text x={W / 2} y={825} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>pay()</text>
        </g>
        <FigFooter label="RPC = abstraction: gọi xa như gọi local" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 RPC_LAW ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={ORANGE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="04" label="RPC IS JUST A LAW" />
        <g style={useScaleIn(T.RPC_LAW.law, 14)}>
          <rect x={W / 2 - 480} y={300} width={960} height={120} rx={16} fill={BG_CARD} stroke={VIOLET} strokeWidth={2.5} />
          <text x={W / 2} y={352} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>RPC chỉ ra cái LUẬT ⚖️</text>
          <text x={W / 2} y={395} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không ép phải đi đường nào</text>
        </g>
        <g style={useScaleIn(T.RPC_LAW.chaos, 14)}>
          <rect x={W / 2 - 480} y={450} width={960} height={130} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
          <text x={W / 2} y={502} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đời cổ: kẻ truyền thẳng trên TCP · kẻ tự dựng giao thức</text>
          <text x={W / 2} y={550} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mỗi tông 1 kiểu → LOẠN cả tam giới 💀</text>
        </g>
        <g style={useScaleIn(T.RPC_LAW.borrow, 14)}>
          <TechBox x={W / 2 - 480} y={630} w={960} h={130} color={AMBER} thick={3} />
          <text x={W / 2} y={682} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thời Web hưng thịnh: "đã có HTTP đại lộ thông thiên hạ…"</text>
          <text x={W / 2} y={730} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ RPC khoác lên áo HTTP 📜</text>
        </g>
        <FigFooter label="RPC = ý niệm · transport thì tuỳ chọn" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 HTTP_SLOW ============
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={WARNING_RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="05" label="LETTERS ARE SLOW" />
        <g style={useScaleIn(T.HTTP_SLOW.good, 14)}>
          <rect x={W / 2 - 480} y={250} width={960} height={120} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
          <text x={W / 2} y={302} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>📨 mỗi lần truyền âm = VIẾT 1 phong thư</text>
          <text x={W / 2} y={345} fontSize={26} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người đọc/sửa/Debug được — rất tốt 🤣</text>
        </g>
        <g style={useScaleIn(T.HTTP_SLOW.million, 14)}>
          <rect x={W / 2 - 480} y={400} width={960} height={120} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
          <text x={W / 2} y={452} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>nhưng 1 TRIỆU lần/ngày →</text>
          <text x={W / 2} y={498} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>dùng thư PHÀM NHÂN xử lý nhân quả TIÊN NHÂN</text>
        </g>
        <g style={useScaleIn(T.HTTP_SLOW.hundred, 14)}>
          <rect x={W / 2 - 480} y={550} width={960} height={110} rx={16} fill={BG_TERM} stroke={ORANGE} strokeWidth={2.5} />
          <text x={W / 2} y={600} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>1 thư dài cả TRĂM CHỮ · chỉ để nói:</text>
          <text x={W / 2} y={642} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>"tồn kho còn 3" 💀</text>
        </g>
        <text x={W / 2} y={760} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.HTTP_SLOW.cpu, 12)}>máy mở thư · đọc từng chữ → CPU xuất hiện TÂM MA 🤯</text>
        <FigFooter label="JSON text · người đọc được ≠ máy đọc nhanh" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S7 PROTOBUF ============
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={AMBER} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="06" label="MECHANISM ① · PROTOBUF" />
        <Hero cy={300} cn="Protocol Buffer Chân Kinh" en="PROTOCOL BUFFER" sub="// nén data thành binary" color={AMBER} entry={T.PROTOBUF.hero} />
        <text x={W / 2} y={460} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={useScaleIn(T.PROTOBUF.why, 12)}>hai bên đều là MÁY · sao phải dùng văn tự của NGƯỜI? 🤔</text>
        <g style={useScaleIn(T.PROTOBUF.compress, 14)}>
          <rect x={W / 2 - 480} y={500} width={960} height={150} rx={16} fill={BG_TERM} stroke={JADE} strokeWidth={3} />
          <text x={W / 2} y={552} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>data luyện hóa thành PHÙ VĂN · nén thành ĐẠO ẤN</text>
          <text x={W / 2} y={602} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>người nhìn KHÔNG hiểu</text>
          <text x={W / 2} y={638} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">máy nhìn 1 cái · đã lĩnh ngộ ✨</text>
        </g>
        <text x={W / 2} y={740} fontSize={32} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.PROTOBUF.speed, 12)}>→ tốc độ TĂNG · thư NHỎ lại · CPU bớt độ kiếp 🤣</text>
        <FigFooter label="binary serialization · nhỏ & nhanh hơn JSON nhiều" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S8 HTTP12 ============
const S8: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={ACCENT_BLUE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="07" label="MECHANISM ② · HTTP/2" />
        <g style={useScaleIn(T.HTTP12.http1, 14)}>
          <rect x={W / 2 - 480} y={240} width={960} height={120} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
          <text x={W / 2} y={292} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>HTTP/1 cổ trận · 1 thông đạo 1 lúc chỉ chở 1 nhân quả</text>
          <text x={W / 2} y={335} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>cái thứ 2 phải ĐỨNG XẾP HÀNG chờ</text>
        </g>
        <text x={W / 2} y={420} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.HTTP12.freeze, 12)}>1 kẻ đi chậm → cả hàng phía sau HÓA ĐÁ 🥶</text>
        <Hero cy={560} cn="HTTP/2 Đa Lộ Truyền Âm Trận" en="HTTP/2 · MULTIPLEXING" sub="// nhiều nhân quả 1 thông đạo" color={ACCENT_BLUE} entry={T.HTTP12.hero} />
        <text x={W / 2} y={750} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={useScaleIn(T.HTTP12.multi, 12)}>nghìn phi kiếm cùng bay 1 lúc · không va · không ai đợi ai 🤣</text>
        <FigFooter label="HTTP/1 head-of-line blocking → HTTP/2 multiplex" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S9 GRPC_FORM ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="gRPC IS BORN" />
          <g style={useScaleIn(T.GRPC_FORM.form, 16)}>
            <rect x={W / 2 - 490} y={320} width={980} height={130} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={375} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>gRPC KHÔNG phải 1 thư viện…</text>
            <text x={W / 2} y={425} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>mà là RPC ĐẠO 🔥</text>
          </g>
          <g style={useScaleIn(T.GRPC_FORM.three, 14)}>
            {["⚙️ RPC · Ý Niệm Triệu Hoán", "📜 Protocol Buffer Chân Kinh", "🛣️ HTTP/2 Đa Lộ Truyền Âm Trận"].map((t, i) => (
              <g key={i}>
                <rect x={W / 2 - 470} y={500 + i * 92} width={940} height={76} rx={12} fill={BG_CARD} stroke={[VIOLET, JADE, ACCENT_BLUE][i]} strokeWidth={2.5} />
                <text x={W / 2} y={547 + i * 92} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
            <text x={W / 2} y={830} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">BA đại thần thông hợp nhất → gRPC</text>
          </g>
          <FigFooter label="gRPC = RPC + Protobuf + HTTP/2" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 PROTOFILE ============
const S10: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={JADE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="09" label="MECHANISM ③ · CONTRACT" />
        <g style={useScaleIn(T.PROTOFILE.clash, 14)}>
          <rect x={W / 2 - 480} y={240} width={960} height={130} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
          <text x={W / 2} y={292} fontSize={27} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Payment gửi trường 1 = TÊN · Order tưởng trường 1 = TUỔI</text>
          <text x={W / 2} y={340} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ PRODUCTION nổ tung 🤪</text>
        </g>
        <Hero cy={490} cn="Thiên Đạo Khế Ước" en="PROTO FILE" sub="// hợp đồng schema 2 bên ký trước" color={JADE} entry={T.PROTOFILE.hero} />
        <g style={useScaleIn(T.PROTOFILE.contract, 14)}>
          <rect x={W / 2 - 480} y={620} width={960} height={96} rx={14} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
          <text x={W / 2} y={668} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ký KHẾ ƯỚC trước: gửi gì · nhận gì · trường nào số mấy · kiểu gì</text>
        </g>
        <text x={W / 2} y={800} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.PROTOFILE.build, 12)}>ai phá khế ước → BUILD LỖI tại chỗ · thiên lôi đánh chết trước 🤣</text>
        <FigFooter label=".proto = contract · sai schema → fail lúc build" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S11 STREAMING ============
const S11: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={VIOLET} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="10" label="MECHANISM ④ · STREAMING" />
        <g style={useScaleIn(T.STREAMING.need, 14)}>
          <rect x={W / 2 - 480} y={250} width={960} height={120} rx={16} fill={BG_CARD} stroke={TEXT_MUTE} strokeWidth={2} />
          <text x={W / 2} y={300} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Chat · Livestream · Realtime · nếu mỗi giây cứ hỏi:</text>
          <text x={W / 2} y={345} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"có dữ liệu mới không?" × "có?" × "có?"</text>
        </g>
        <text x={W / 2} y={425} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.STREAMING.harass, 12)}>→ đó không phải truyền âm · đó là QUẤY RỐI 🤣</text>
        <Hero cy={575} cn="Streaming Đạo" en="STREAMING" sub="// kết nối mở · data tự đẩy về" color={VIOLET} entry={T.STREAMING.hero} />
        <text x={W / 2} y={760} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={useScaleIn(T.STREAMING.mind, 12)}>như THẦN NIỆM 2 đại năng: ý vừa sinh, đối phương đã cảm nhận ✨</text>
        <FigFooter label="streaming · server push, không cần polling" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S12 DEADLINE ============
const S12: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={WARNING_RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="11" label="MECHANISM ⑤ · DEADLINE" />
        <g style={useScaleIn(T.DEADLINE.chain, 14)}>
          <rect x={W / 2 - 480} y={250} width={960} height={110} rx={16} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2} />
          <text x={W / 2} y={300} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>A → B → C → D → E</text>
          <text x={W / 2} y={340} fontSize={26} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>rồi E trực tiếp MẤT TÍCH 💀</text>
        </g>
        <text x={W / 2} y={420} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.DEADLINE.freeze, 12)}>D/C/B/A đều đứng đợi → cả hệ thống HÓA ĐÁ 🥶</text>
        <Hero cy={570} cn="Thọ Nguyên Phù" en="DEADLINE" sub="// mỗi call có tuổi thọ" color={WARNING_RED} entry={T.DEADLINE.hero} />
        <text x={W / 2} y={760} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={useScaleIn(T.DEADLINE.give, 12)}>quá thời gian → LẬP TỨC từ bỏ · không chờ thiên hoang địa lão 🤣</text>
        <FigFooter label="deadline/timeout · chống treo cả chuỗi call" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S13 LOADBAL ============
const S13: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_NAVY }}>
    <BlueprintBG glow={JADE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="12" label="MECHANISM ⑥ · LOAD BALANCING" />
        <g style={useScaleIn(T.LOADBAL.load, 14)}>
          <rect x={W / 2 - 480} y={300} width={960} height={120} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={2.5} />
          <text x={W / 2} y={352} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Payment đón TRĂM TRIỆU người dùng</text>
          <text x={W / 2} y={395} fontSize={28} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>1 phân thân · 10 phân thân · đều KHÔNG nổi 💀</text>
        </g>
        <Hero cy={560} cn="Phân Thân Điều Phối Trận" en="LOAD BALANCING" sub="// chia tải qua nhiều instance" color={JADE} entry={T.LOADBAL.hero} />
        <text x={W / 2} y={740} fontSize={29} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={useScaleIn(T.LOADBAL.dist, 12)}>tự động điều phối · không ai QUÁ TẢI · không ai NHÀN RỖI 🤣</text>
        <FigFooter label="load balancing · spread request qua nhiều bản sao" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S14 FINALE ============
const S14: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="13" label="THE GRAND ARRAY" />
          <g style={useScaleIn(T.FINALE.daitran, 14)}>
            <rect x={W / 2 - 490} y={235} width={980} height={120} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={285} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người ngoài tưởng gRPC chỉ là 1 thư viện · nhưng:</text>
            <text x={W / 2} y={330} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">gRPC = 1 ĐẠI TRẬN VIỄN TRÌNH TRUYỀN ÂM</text>
          </g>
          <g style={useFadeUp(T.FINALE.daitran + 30, 14)}>
            {["RPC", "Protocol Buffer", "HTTP/2", "Khế Ước (Proto)", "Streaming", "Deadline", "Load Balancing"].map((t, i) => {
              const col = i % 2, row = Math.floor(i / 2);
              const w = i === 6 ? 940 : 458;
              const cx = i === 6 ? W / 2 : W / 2 - 470 + col * 482 + 229;
              return (
                <g key={i} opacity={useFade(T.FINALE.daitran + 30 + i * 14, 10)}>
                  <rect x={cx - w / 2} y={380 + row * 80} width={w} height={66} rx={11} fill={BG_CARD} stroke={[VIOLET, JADE, ACCENT_BLUE, AMBER, VIOLET, WARNING_RED, JADE][i]} strokeWidth={2} />
                  <text x={cx} y={422 + row * 80} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>⚡ {t}</text>
                </g>
              );
            })}
          </g>
          <g style={useScaleIn(T.FINALE.pay, 14)}>
            <rect x={W / 2 - 480} y={730} width={960} height={130} rx={16} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={778} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>viết <tspan fill={AMBER_BRIGHT} fontFamily="'JetBrains Mono', monospace" fontWeight={700}>pay()</tspan> thoạt nhìn chỉ 1 dòng code…</text>
            <text x={W / 2} y={825} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">phía sau là CẢ ĐẠI TRẬN đang vận chuyển → gRPC ĐẠO 🔥</text>
          </g>
          <FigFooter label="1 dòng pay() · cả 1 hệ sinh thái phía sau" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S15 CTA ============
const S15: React.FC<{ duration: number }> = ({ duration }) => {
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
            <text x={W / 2} y={490} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Muốn nghe truyền kỳ</text>
            <text x={W / 2} y={545} fontSize={40} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">giao thức nào tiếp theo? 🤔</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 650px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={665} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 comment phía dưới 👇 (GraphQL? WebSocket? Kafka?)</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 820px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 820px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={750} width={600} height={140} rx={70} fill={JADE} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={762} width={570} height={116} rx={58} fill={BG_TERM} stroke={JADE} strokeWidth={4} />
              <text x={W / 2} y={838} fontSize={48} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={970} fontSize={28} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" style={useFadeUp(150, 12)}>để không bỏ lỡ truyền kỳ giới IT tiếp theo 🏯</text>
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15];

export const GrpcDao: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("grpc_dao/voice.mp3")} />
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
