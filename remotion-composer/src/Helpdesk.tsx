import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./hp_beats.json";
import T from "./hp_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// ===== HUD · POV IT Helpdesk · ta=cyan · user/đạo hữu/CEO=gold · kiếp=đỏ · danh hiệu=violet · ngộ=green =====
const BG = "#0A0812";
const CARD = "#12101C";
const CARD2 = "#171426";
const RED = "#FF5470";
const A = "#2BE2FF";
const GOLD = "#FFC24B";
const GREEN = "#2EE6A8";
const VIOLET = "#A78BFF";
const TEXT = "#ECE6F5";
const SEC = "#B0A8C4";
const MUTE = "#6E6685";
const HUDC = "#5B4E78";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

const useFadeUp = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [e, e + d], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};
const usePop = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [e, e + d * 0.7, e + d], [0.8, 1.04, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};
const useFade = (e: number, d = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const HudBG: React.FC<{ tint?: string }> = ({ tint = A }) => {
  const frame = useCurrentFrame();
  const sweep = ((frame * 5) % (H + 360)) - 180;
  const vx = W / 2, vy = 760;
  const floorCols = Array.from({ length: 13 }, (_, i) => -6 + i);
  const floorRows = [0, 70, 160, 280, 440, 660, 980];
  const pulse = 0.5 + 0.5 * Math.sin(frame / 16);
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="hpGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={HUDC} strokeWidth="0.6" opacity="0.06" />
          </pattern>
          <radialGradient id="hpGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.13" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hpScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={HUDC} stopOpacity="0" />
            <stop offset="50%" stopColor={HUDC} stopOpacity="0.07" />
            <stop offset="100%" stopColor={HUDC} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hpVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#03020A" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#hpGrid)" />
        <rect width={W} height={H} fill="url(#hpGlow)" />
        <g strokeWidth={1} opacity={0.13}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} stroke={HUDC} />
          ))}
          {floorRows.map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} stroke={HUDC} opacity={0.6 - i * 0.05} />
          ))}
        </g>
        <rect x={0} y={sweep} width={W} height={150} fill="url(#hpScan)" />
        <rect width={W} height={H} fill="url(#hpVig)" />
        <g strokeWidth={2.5} fill="none" opacity={0.7} strokeLinecap="round">
          <path d="M 44 92 L 44 48 L 88 48" stroke={A} />
          <path d={`M ${W - 44} 92 L ${W - 44} 48 L ${W - 88} 48`} stroke={GOLD} />
          <path d={`M 44 ${H - 92} L 44 ${H - 48} L 88 ${H - 48}`} stroke={A} />
          <path d={`M ${W - 44} ${H - 92} L ${W - 44} ${H - 48} L ${W - 88} ${H - 48}`} stroke={GOLD} />
        </g>
        <circle cx={W - 70} cy={H - 70} r={6} fill={RED} opacity={0.4 + 0.5 * pulse} />
      </svg>
    </AbsoluteFill>
  );
};

const GlowDefs: React.FC = () => (
  <defs>
    <filter id="hpTextGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

const KenBurns: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration * FPS], [1.0, 1.04], { extrapolateRight: "clamp" });
  return <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>{children}</div>;
};

const Header: React.FC<{ tag: string; color?: string }> = ({ tag, color = A }) => {
  const frame = useCurrentFrame();
  const a1 = useFadeUp(0, 10), a2 = useFade(5, 10);
  const blink = Math.sin(frame / 9) > -0.3 ? 1 : 0.25;
  return (
    <g>
      <g style={a1}>
        <path d="M 80 114 L 80 150 L 100 150" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
        <text x={112} y={143} fontSize={20} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3">{tag}</text>
        <line x1={80} y1={166} x2={W - 80} y2={166} stroke={color} strokeWidth={1} opacity={0.22} />
      </g>
      <g opacity={a2}>
        <text x={W - 112} y={143} fontSize={18} fill={RED} textAnchor="end" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">ĐẠO TÂM</text>
        <circle cx={W - 96} cy={136} r={6} fill={RED} opacity={blink} />
      </g>
    </g>
  );
};
const Footer: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <line x1={80} y1={H - 138} x2={W - 80} y2={H - 138} stroke={HUDC} strokeWidth={1} opacity={0.2} />
    <text x={W / 2} y={H - 100} fontSize={19} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="2">{label}</text>
    <text x={W / 2} y={H - 58} fontSize={16} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3" opacity={0.7}>// truyền kỳ · giới IT</text>
  </g>
);
const Card: React.FC<{ x: number; y: number; w: number; h: number; c?: string; fill?: string; thick?: number; rx?: number; children?: React.ReactNode }> = ({ x, y, w, h, c = A, fill = CARD, thick = 2, rx = 10, children }) => {
  const b = 18;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} fillOpacity={0.74} stroke={c} strokeWidth={thick} strokeOpacity={0.5} />
      <g stroke={c} strokeWidth={2.5} fill="none" opacity={0.9} strokeLinecap="round">
        <path d={`M ${x} ${y + b} L ${x} ${y} L ${x + b} ${y}`} />
        <path d={`M ${x + w - b} ${y} L ${x + w} ${y} L ${x + w} ${y + b}`} />
        <path d={`M ${x} ${y + h - b} L ${x} ${y + h} L ${x + b} ${y + h}`} />
        <path d={`M ${x + w - b} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - b}`} />
      </g>
      {children}
    </g>
  );
};
const Say: React.FC<{ y: number; who: string; whoC: string; text: string; entry: number; h?: number }> = ({ y, who, whoC, text, entry, h = 92 }) => (
  <g style={usePop(entry, 11)}>
    <Card x={W / 2 - 470} y={y} w={940} h={h} c={whoC} rx={10} thick={2} />
    <text x={W / 2 - 448} y={y + 30} fontSize={18} fill={whoC} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">{who}</text>
    <text x={W / 2} y={y + h - 26} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">{text}</text>
  </g>
);
const Reveal: React.FC<{ y: number; top: string; big: string; entry: number; c?: string; h?: number }> = ({ y, top, big, entry, c = VIOLET, h = 130 }) => (
  <g style={usePop(entry, 15)}>
    <Card x={W / 2 - 470} y={y} w={940} h={h} c={c} fill={CARD2} thick={2.5} />
    <text x={W / 2} y={y + 50} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>{top}</text>
    <text x={W / 2} y={y + h - 34} fontSize={35} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#hpTextGlow)">{big}</text>
  </g>
);

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={A} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="TRUYỀN KỲ · GIỚI IT" />
          <g transform="translate(0, 146)">
            <text x={W / 2} y={286} fontSize={28} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2" style={useFadeUp(8, 12)}>POV: TA LÀ MỘT IT HELPDESK</text>
            <g style={usePop(T.HOOK.join, 13)}>
              <Card x={W / 2 - 470} y={326} w={940} h={92} c={A} fill={CARD2} thick={2} />
              <text x={W / 2} y={382} fontSize={29} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ta gia nhập <tspan fill={A} fontWeight={900}>HẬU CẦN TÔNG</tspan> (IT Helpdesk)</text>
            </g>
            <g style={usePop(T.HOOK.confident, 14)}>
              <Card x={W / 2 - 470} y={438} w={940} h={116} c={GOLD} fill={CARD2} thick={2} />
              <text x={W / 2} y={484} fontSize={27} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>💪 "máy? sửa được · mạng? thông được · phần mềm? xử được"</text>
              <text x={W / 2} y={524} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta tưởng Helpdesk chỉ là cảnh giới NHẬP MÔN 🤣</text>
            </g>
            <g style={usePop(T.HOOK.wrong, 15)}>
              <Card x={W / 2 - 360} y={572} w={720} h={116} c={RED} fill={CARD2} thick={3} />
              <text x={W / 2} y={644} fontSize={58} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#hpTextGlow)" opacity={0.9 + 0.1 * glow}>💀 NHƯNG TA ĐÃ SAI</text>
            </g>
          </g>
          <Footer label="tu vi cao mấy · cũng thua độ kiếp của user" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 DAYMANG ============
const S2: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP ① · KHÔNG VÀO ĐƯỢC MẠNG" color={GOLD} />
        <g transform="translate(0, 108)">
          <Say y={224} who="😱 đạo hữu (mặt trắng bệch)" whoC={GOLD} text="&quot;máy ta KHÔNG VÀO ĐƯỢC MẠNG&quot;" entry={T.DAYMANG.problem} h={96} />
          <g style={usePop(T.DAYMANG.investigate, 13)}>
            <Card x={W / 2 - 470} y={332} w={940} h={78} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={380} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ta mở terminal → Ping · Traceroute · kiểm tra DNS → <tspan fill={RED} fontWeight={900}>1 canh giờ 💀</tspan></text>
          </g>
          <g style={usePop(T.DAYMANG.cable, 14)}>
            <Card x={W / 2 - 470} y={424} w={940} h={116} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={468} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta hỏi: "dây mạng đâu?" → hắn chỉ tay…</text>
            <text x={W / 2} y={510} fontSize={29} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">dây nằm trên bàn — CHƯA CẮM VÀO MÁY 🤣</text>
          </g>
          <Reveal y={558} top="1 canh giờ điều tra < 1 cái cúi đầu → ta lĩnh ngộ:" big="🔥 PHÀM NHÃN CHÂN KINH" entry={T.DAYMANG.name} c={VIOLET} h={150} />
        </g>
        <Footer label="ping trời ping đất · quên nhìn sợi dây trước mặt" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S3 THUNGRAC ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP ② · BÍ TỊCH BIẾN MẤT" color={GOLD} />
        <g transform="translate(0, 104)">
          <Say y={220} who="💬 trưởng lão (hớt hải)" whoC={GOLD} text="&quot;toàn bộ BÍ TỊCH của ta BIẾN MẤT!&quot;" entry={T.THUNGRAC.lost} h={96} />
          <g style={usePop(T.THUNGRAC.search, 13)}>
            <Card x={W / 2 - 470} y={328} w={940} h={78} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={376} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ta soi: ổ cứng · Backup · Cloud · Log — <tspan fill={RED} fontWeight={900}>3 canh giờ 💀</tspan></text>
          </g>
          <g style={usePop(T.THUNGRAC.trash, 14)}>
            <Card x={W / 2 - 470} y={420} w={940} h={130} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={462} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>"ngài xóa lúc nào?" → "ta KHÔNG xóa" → 🗑️ ta mở thùng rác:</text>
            <text x={W / 2} y={506} fontSize={26} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"File mới nhất_final_final2_OK.xlsx" 🤣</text>
          </g>
          <Reveal y={568} top="chân lý: đáng sợ nhất KHÔNG phải lỗi hệ thống —" big="🔥 mà là SỰ TỰ TIN CỦA USER" entry={T.THUNGRAC.truth} c={VIOLET} h={150} />
        </g>
        <Footer label="soi cloud soi log · file nằm ngay trong thùng rác" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 CHROME ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP LỚN NHẤT · CEO" color={RED} />
        <g transform="translate(0, 104)">
          <Say y={220} who="👑 CEO triệu hồi (cuối tháng)" whoC={GOLD} text="&quot;máy ta RẤT CHẬM&quot;" entry={T.CHROME.ceo} h={92} />
          <g style={usePop(T.CHROME.tools, 13)}>
            <Card x={W / 2 - 470} y={324} w={940} h={78} c={A} rx={10} thick={1.5} />
            <text x={W / 2} y={372} fontSize={25} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>ta mang: Task Manager · System Monitor · Disk Analyzer</text>
          </g>
          <g style={usePop(T.CHROME.tabs, 14)}>
            <Card x={W / 2 - 470} y={418} w={940} h={130} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={462} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">😱 97 TAB CHROME đang mở</text>
            <text x={W / 2} y={504} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>Youtube · Facebook · 20 file Excel · 1 video phát từ NĂM NGOÁI 🤣</text>
          </g>
          <Reveal y={566} top="ta không sửa máy — chỉ ĐÓNG TRÌNH DUYỆT → giác ngộ:" big="🔥 có kiếp chỉ hóa giải bằng SỰ BÌNH TĨNH" entry={T.CHROME.calm} c={VIOLET} h={150} />
        </g>
        <Footer label="không phải máy chậm · là 97 tab đang gánh nghiệp" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 DAOLY ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GREEN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="ĐẠO LÝ" color={GREEN} />
        <g transform="translate(0, 116)">
          <g style={usePop(T.DAOLY.notfixer, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={78} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={298} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>IT Helpdesk — <tspan fill={A} fontWeight={900}>không phải người sửa máy</tspan></text>
          </g>
          <g style={usePop(T.DAOLY.karma, 14)}>
            <Card x={W / 2 - 470} y={344} w={940} h={110} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={388} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>mà là người đi tìm NHÂN QUẢ đằng sau câu nói:</text>
            <text x={W / 2} y={428} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"em không làm gì cả" 🤣</text>
          </g>
          <Reveal y={470} top="câu lưu truyền trong Hậu Cần Tông:" big="🔥 USER thấy 1 LỖI · HELPDESK thấy 1 CHUỖI NHÂN QUẢ" entry={T.DAOLY.seesth} c={GREEN} h={170} />
        </g>
        <Footer label="user thấy 1 lỗi · helpdesk thấy cả một chuỗi nhân quả" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 CTA ============
const S6: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const ask = useFadeUp(6, 12);
  const cmt = usePop(48, 14);
  const btn = usePop(84, 14);
  const pulse = 1 + 0.035 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={A} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <g style={ask}>
            <text x={W / 2} y={640} fontSize={36} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Ngươi từng gặp</text>
            <text x={W / 2} y={702} fontSize={36} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#hpTextGlow)">USER nghịch thiên nào chưa? 🤣</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={812} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 kể ta nghe ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 310} y={890} width={620} height={146} rx={20} fill={A} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 292} y={902} width={584} height={122} rx={14} fill={CARD2} stroke={A} strokeWidth={3} />
              <text x={W / 2} y={982} fontSize={48} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#hpTextGlow)">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1110} fontSize={28} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(120, 12)}>nghe tiếp truyền kỳ giới IT ✦</text>
          <Footer label="theo dõi · trước khi user tiếp theo nói 'em không làm gì'" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6];

const SlideFade: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const f = useCurrentFrame();
  const total = Math.round(duration * FPS);
  const o = Math.min(
    interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [total - 9, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Helpdesk: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("helpdesk/voice.mp3")} />
      {beats.map((b, i) => {
        const Slide = SLIDES[i];
        return (
          <Sequence key={b.index} from={Math.round(b.start * FPS)} durationInFrames={Math.round(b.duration * FPS)}>
            <SlideFade duration={b.duration}>
              <Slide duration={b.duration} />
            </SlideFade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
