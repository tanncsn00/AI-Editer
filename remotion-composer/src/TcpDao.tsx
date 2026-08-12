import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./tcp_dao_beats.json";

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
          <pattern id="tcpgrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke={GRID} strokeWidth="0.6" opacity="0.08" />
          </pattern>
          <pattern id="tcpgrid2" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M 240 0 L 0 0 0 240" fill="none" stroke={GRID} strokeWidth="1" opacity="0.12" />
          </pattern>
          <radialGradient id="tcpglow" cx="50%" cy="34%" r="60%">
            <stop offset="0%" stopColor={glow} stopOpacity="0.1" />
            <stop offset="100%" stopColor={BG_NAVY} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tcpscan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0" />
            <stop offset="50%" stopColor={AMBER} stopOpacity="0.06" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_NAVY} />
        <rect width={W} height={H} fill="url(#tcpgrid)" />
        <rect width={W} height={H} fill="url(#tcpgrid2)" />
        <rect width={W} height={H} fill="url(#tcpglow)" />
        <rect x={0} y={scanLineY} width={W} height={120} fill="url(#tcpscan)" />
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
      <rect x={W / 2 - 490} y={cy - 78} width={980} height={156} rx={18} fill={BG_CARD} stroke={color} strokeWidth={4} />
      <text x={W / 2} y={cy - 26} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>《{cn}》</text>
      <text x={W / 2} y={cy + 32} fontSize={44} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">{en}</text>
      {sub && <text x={W / 2} y={cy + 62} fontSize={19} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};

// ============ S1 INTRO ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const q = useScaleIn(150, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="THE ANCIENT TRANSMISSION REALM" />
          <text x={W / 2} y={320} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(20, 12)}>Thượng Cổ Truyền Âm Giới · 1 vấn đề khiến vô số</text>
          <text x={W / 2} y={368} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(48, 12)}>Trận Pháp Sư sinh ra tâm ma 💀</text>
          <g style={{ ...q, transformOrigin: `${W / 2}px 580px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 490} y={460} width={980} height={250} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} />
            <text x={W / 2} y={540} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Làm sao gửi 1 bộ BÍ TỊCH</text>
            <text x={W / 2} y={600} fontSize={40} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>qua VẠN DẶM hư không 🗡️</text>
            <text x={W / 2} y={665} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà KHÔNG bị thất lạc?</text>
          </g>
          <FigFooter label="TCP · giao thức truyền tin tin cậy" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 NAIVE ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const split = useScaleIn(378, 14);
  const happy = useScaleIn(659, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="THE NAIVE WAY" />
          <g style={useScaleIn(78, 14)}>
            <rect x={W / 2 - 480} y={250} width={960} height={120} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={305} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ban đầu tưởng đơn giản:</text>
            <text x={W / 2} y={348} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>viết thư · buộc lên PHI KIẾM 🗡️ · phóng đi</text>
          </g>
          <g style={{ ...split, transformOrigin: `${W / 2}px 560px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={420} width={960} height={280} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={3} />
            <text x={W / 2} y={478} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>bí tịch 1000 trang · quá dày → chia nhỏ</text>
            <text x={W / 2} y={560} fontSize={56} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>1000 TRANG 📄</text>
            <text x={W / 2} y={618} fontSize={34} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>=</text>
            <text x={W / 2} y={678} fontSize={56} fill={ACCENT_BLUE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>1000 PHI KIẾM 🗡️</text>
          </g>
          <text x={W / 2} y={800} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic" style={{ ...happy }}>các đại năng vô cùng hài lòng 🤣</text>
          <FigFooter label="chia gói · mỗi packet 1 phần dữ liệu" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 DISASTER ============
const S3: React.FC<{ duration: number }> = ({ duration }) => {
  const pages = [
    { e: 40, n: "1", s: "✓ tới nơi", c: JADE },
    { e: 76, n: "2", s: "✗ mất tích", c: WARNING_RED },
    { e: 120, n: "3", s: "tới trước", c: AMBER },
    { e: 160, n: "4", s: "tới sau", c: AMBER },
    { e: 202, n: "5", s: "🐉 yêu thú ăn", c: WARNING_RED },
    { e: 245, n: "6", s: "❓ lạc đâu đó", c: WARNING_RED },
  ];
  const jump = useScaleIn(401, 14);
  const ma = useScaleIn(664, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="02" label="CHAOS IN THE VOID" />
          <g>
            {pages.map((p, i) => {
              const col = i % 3, row = Math.floor(i / 3);
              return (
                <g key={i} style={useScaleIn(p.e, 11)}>
                  <rect x={W / 2 - 480 + col * 320} y={230 + row * 130} width={300} height={112} rx={12} fill={BG_CARD} stroke={p.c} strokeWidth={2} />
                  <text x={W / 2 - 330 + col * 320} y={285 + row * 130} fontSize={30} fill={p.c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>📄 trang {p.n}</text>
                  <text x={W / 2 - 330 + col * 320} y={320 + row * 130} fontSize={22} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{p.s}</text>
                </g>
              );
            })}
          </g>
          <g style={{ ...jump, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={550} width={960} height={180} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={602} fontSize={26} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>bí tịch nhảy lung tung:</text>
            <text x={W / 2} y={648} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"hấp thu linh khí…"</text>
            <text x={W / 2} y={700} fontSize={32} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"…nếu không sẽ TẨU HỎA NHẬP MA" 💀</text>
          </g>
          <text x={W / 2} y={820} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={{ ...ma }}>ở giữa mất sạch → vô số tu sĩ NHẬP MA 🤣</text>
          <FigFooter label="packet loss + out-of-order = thảm hoạ" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S4 TCPBIRTH ============
const S4: React.FC<{ duration: number }> = ({ duration }) => {
  const hero = useScaleIn(230, 16);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="03" label="TCP IS BORN" />
          <g style={useScaleIn(65, 14)}>
            <rect x={W / 2 - 480} y={300} width={960} height={130} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={355} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>biết GỬI thư…</text>
            <text x={W / 2} y={400} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">không có nghĩa thư sẽ TỚI NƠI 💀</text>
          </g>
          <Hero cy={580} cn="Thiên Cơ Truy Hồi Chân Kinh" en="TCP" sub="// transmission control protocol" color={AMBER} entry={210} />
          <text x={W / 2} y={760} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(410, 12)}>đảm bảo mọi bí tịch · tới nơi · đầy đủ · đúng thứ tự 🏯</text>
          <FigFooter label="reliable delivery · cốt lõi của TCP" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S5 ACK ============
const S5: React.FC<{ duration: number }> = ({ duration }) => {
  const resend = useScaleIn(406, 14);
  const arrive = useScaleIn(680, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ACCENT_BLUE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="04" label="MECHANISM ① · ACK" />
          <g style={useScaleIn(137, 14)}>
            <rect x={W / 2 - 480} y={250} width={960} height={130} rx={16} fill={BG_CARD} stroke={ACCENT_BLUE} strokeWidth={2.5} />
            <text x={W / 2} y={302} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nhận 1 phi kiếm → bên nhận truyền âm:</text>
            <text x={W / 2} y={352} fontSize={34} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>"ĐÃ NHẬN ĐƯỢC" = ACK 📡</text>
          </g>
          <g style={{ ...resend, transformOrigin: `${W / 2}px 520px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={420} width={960} height={200} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={475} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>quá lâu không thấy ACK?</text>
            <text x={W / 2} y={525} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→ gửi lại · mất nữa → gửi tiếp</text>
            <text x={W / 2} y={585} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">tới khi nhận được ACK mới thôi 🔁</text>
          </g>
          <g style={{ ...arrive, transformOrigin: `${W / 2}px 760px`, transformBox: "fill-box" }}>
            <TechBox x={W / 2 - 480} y={690} w={960} h={150} color={JADE} thick={3} />
            <text x={W / 2} y={745} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>dù thiên lôi · yêu thú · rơi vực…</text>
            <text x={W / 2} y={795} fontSize={36} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">bí tịch cuối cùng VẪN tới nơi 🔥</text>
          </g>
          <FigFooter label="acknowledgement + retransmit · không mất gói" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S6 SEQ ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const hero = useScaleIn(500, 16);
  const sort = useScaleIn(700, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={VIOLET} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="05" label="MECHANISM ② · SEQUENCE" />
          <g style={useScaleIn(90, 14)}>
            <rect x={W / 2 - 480} y={250} width={960} height={120} rx={16} fill={BG_TERM} stroke={WARNING_RED} strokeWidth={2.5} />
            <text x={W / 2} y={302} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>trang 5 tới trước trang 2 · trang 8 trước trang 6</text>
            <text x={W / 2} y={345} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">→ đệ tử lại NHẬP MA 🤣</text>
          </g>
          <Hero cy={530} cn="Thứ Tự Nhân Quả Lục" en="SEQUENCE NUMBER" sub="// đánh số mỗi gói tin" color={VIOLET} entry={504} />
          <g style={{ ...sort, transformOrigin: `${W / 2}px 740px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 480} y={680} width={960} height={120} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2} y={732} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>mỗi phi kiếm đều được ĐÁNH SỐ #1 #2 #3…</text>
            <text x={W / 2} y={775} fontSize={30} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">tới lộn xộn vẫn SẮP XẾP lại đúng thứ tự ✅</text>
          </g>
          <FigFooter label="sequence number · reassembly đúng order" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S7 FLOW ============
const S7: React.FC<{ duration: number }> = ({ duration }) => {
  const crash = useScaleIn(325, 14);
  const hero = useScaleIn(573, 16);
  const slow = useFadeUp(697, 14);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={ORANGE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="06" label="MECHANISM ③ · FLOW CONTROL" />
          <text x={W / 2} y={260} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(201, 12)}>hàng TRIỆU phi kiếm cùng lao tới 1 lúc 🗡️🗡️🗡️</text>
          <g style={crash}>
            <rect x={W / 2 - 480} y={300} width={960} height={130} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2} y={350} fontSize={30} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>💥 Truyền Tống Trận nổ tung</text>
            <text x={W / 2} y={400} fontSize={26} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Network kinh mạch nghịch hành · Router vỡ vụn</text>
          </g>
          <Hero cy={560} cn="Lưu Lượng Khống Chế Kinh" en="FLOW CONTROL" sub="// điều tiết theo bên nhận" color={ORANGE} entry={582} />
          <g style={slow}>
            {["gửi nhanh quá? → CHẬM LẠI", "bên nhận chịu không nổi? → CHẬM LẠI", "thiên địa quá tải? → tiếp tục CHẬM LẠI"].map((t, i) => (
              <g key={i} opacity={useFade(705 + i * 26, 10)}>
                <rect x={W / 2 - 470} y={690 + i * 64} width={940} height={52} rx={10} fill={BG_TERM} stroke={ORANGE} strokeWidth={1.5} />
                <text x={W / 2} y={725 + i * 64} fontSize={25} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <FigFooter label="flow control · không làm ngộp bên nhận" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S8 CONGESTION ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const wisdom = useScaleIn(458, 14);
  const hero = useScaleIn(527, 16);
  const care = useScaleIn(640, 14);
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={WARNING_RED} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="MECHANISM ④ · CONGESTION" />
          <text x={W / 2} y={258} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(133, 12)}>"gửi càng nhanh càng tốt, chẳng tốt hơn sao?" 🤔</text>
          <g style={{ ...wisdom, transformOrigin: `${W / 2}px 380px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 490} y={300} width={980} height={160} rx={18} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={355} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>trưởng lão cười: "nếu AI CŨNG muốn nhanh nhất…</text>
            <text x={W / 2} y={415} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">cuối cùng KHÔNG còn ai nhanh được nữa" 💀</text>
          </g>
          <Hero cy={620} cn="Tắc Nghẽn Thiên Cơ Kinh" en="CONGESTION CONTROL" sub="// nhường đường khi mạng quá tải" color={WARNING_RED} entry={541} />
          <text x={W / 2} y={800} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" style={{ ...care }}>TCP còn lo cả THIÊN ĐỊA có đang quá tải không 🌐</text>
          <FigFooter label="congestion control · vì lợi ích chung của mạng" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 DAOTAM1 ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const laws = useFadeUp(269, 14);
  const LAW = ["🗡️ mỗi phi kiếm phải được XÁC NHẬN", "📜 mỗi bí tịch phải GHÉP hoàn chỉnh", "🔁 mỗi lần thất lạc phải BÙ ĐẮP", "🚦 mỗi lần quá tải phải biết NHƯỜNG ĐƯỜNG"];
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={JADE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="A LAW OF CAUSE & EFFECT" />
          <g style={useScaleIn(102, 14)}>
            <text x={W / 2} y={290} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người thường: TCP chỉ là 1 GIAO THỨC</text>
            <text x={W / 2} y={338} fontSize={34} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đại năng: đó là 1 bộ LUẬT NHÂN QUẢ ⚖️</text>
          </g>
          <g style={laws}>
            {LAW.map((t, i) => (
              <g key={i} opacity={useFade(280 + i * 36, 10)}>
                <rect x={W / 2 - 480} y={400 + i * 110} width={960} height={92} rx={14} fill={BG_CARD} stroke={JADE} strokeWidth={2} />
                <text x={W / 2} y={456 + i * 110} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
              </g>
            ))}
          </g>
          <FigFooter label="reliable · ordered · recovered · fair" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 DAOTAM2 ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const slow = useScaleIn(47, 14);
  const lose = useScaleIn(119, 14);
  const dao = useScaleIn(229, 16);
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <BlueprintBG glow={AMBER} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="THE HEART OF TCP" />
          <g style={slow}>
            <rect x={W / 2 - 470} y={300} width={460} height={170} rx={16} fill={BG_CARD} stroke={JADE} strokeWidth={2.5} />
            <text x={W / 2 - 240} y={365} fontSize={32} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>CHẬM 1 chút</text>
            <text x={W / 2 - 240} y={425} fontSize={36} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>không sao ✓</text>
          </g>
          <g style={lose}>
            <rect x={W / 2 + 10} y={300} width={460} height={170} rx={16} fill="#2A1010" stroke={WARNING_RED} strokeWidth={3} />
            <text x={W / 2 + 240} y={365} fontSize={32} fill={WARNING_RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>MẤT bí tịch</text>
            <text x={W / 2 + 240} y={415} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>TUYỆT ĐỐI</text>
            <text x={W / 2 + 240} y={450} fontSize={28} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>không chấp nhận ✗</text>
          </g>
          <g style={{ ...dao, transformOrigin: `${W / 2}px 640px`, transformBox: "fill-box" }}>
            <rect x={W / 2 - 490} y={550} width={980} height={170} rx={20} fill={BG_TERM} stroke={AMBER} strokeWidth={4} opacity={0.85 + 0.15 * glow} />
            <text x={W / 2} y={625} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đó chính là</text>
            <text x={W / 2} y={680} fontSize={44} fill={AMBER_BRIGHT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">ĐẠO TÂM của TCP Đạo 🏯</text>
          </g>
          <FigFooter label="thà chậm · không bao giờ để mất dữ liệu" />
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
            <text x={W / 2} y={665} fontSize={30} fill={JADE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 comment phía dưới 👇 (UDP? HTTP? DNS?)</text>
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

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11];

export const TcpDao: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_NAVY }}>
      <Audio src={staticFile("tcp_dao/voice.mp3")} />
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
