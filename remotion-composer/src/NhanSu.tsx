import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./ns_beats.json";
import T from "./ns_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// ===== HUD · POV Nhân Sự (HR) · ta=cyan · quyền lực=gold · kiếp=đỏ · công pháp=violet · ngộ=green =====
const BG = "#0A0812";
const CARD = "#12101C";
const CARD2 = "#171426";
const RED = "#FF5470";     // kiếp · vết nứt · từ chối
const A = "#2BE2FF";       // TA (HR)
const GOLD = "#FFC24B";    // trưởng lão · Dev · PM · CEO · ứng viên
const GREEN = "#2EE6A8";   // ngộ · đạo lý
const VIOLET = "#A78BFF";  // công pháp · tâm kinh
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
          <pattern id="nsGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M 64 0 L 0 0 0 64" fill="none" stroke={HUDC} strokeWidth="0.6" opacity="0.06" />
          </pattern>
          <radialGradient id="nsGlow" cx="50%" cy="28%" r="62%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.13" />
            <stop offset="100%" stopColor={BG} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="nsScan" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={HUDC} stopOpacity="0" />
            <stop offset="50%" stopColor={HUDC} stopOpacity="0.07" />
            <stop offset="100%" stopColor={HUDC} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="nsVig" cx="50%" cy="42%" r="74%">
            <stop offset="56%" stopColor={BG} stopOpacity="0" />
            <stop offset="100%" stopColor="#03020A" stopOpacity="0.82" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={BG} />
        <rect width={W} height={H} fill="url(#nsGrid)" />
        <rect width={W} height={H} fill="url(#nsGlow)" />
        <g strokeWidth={1} opacity={0.13}>
          {floorCols.map((c, i) => (
            <line key={i} x1={vx + c * 150} y1={H} x2={vx + c * 22} y2={vy} stroke={HUDC} />
          ))}
          {floorRows.map((d, i) => (
            <line key={`h${i}`} x1={0} y1={vy + d} x2={W} y2={vy + d} stroke={HUDC} opacity={0.6 - i * 0.05} />
          ))}
        </g>
        <rect x={0} y={sweep} width={W} height={150} fill="url(#nsScan)" />
        <rect width={W} height={H} fill="url(#nsVig)" />
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
    <filter id="nsTextGlow" x="-30%" y="-30%" width="160%" height="160%">
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
        <text x={112} y={143} fontSize={20} fill={color} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">{tag}</text>
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
    <text x={W / 2} y={H - 58} fontSize={16} fill={MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3" opacity={0.7}>// truyền kỳ · chốn công sở</text>
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
    <text x={W / 2} y={y + h - 34} fontSize={35} fill={c} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#nsTextGlow)">{big}</text>
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
          <Header tag="TRUYỀN KỲ · CHỐN CÔNG SỞ" />
          <g transform="translate(0, 148)">
            <text x={W / 2} y={288} fontSize={30} fill={SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={useFadeUp(8, 12)}>POV: TA LÀ MỘT NHÂN SỰ · HR</text>
            <g style={usePop(T.HOOK.power, 13)}>
              <Card x={W / 2 - 470} y={326} w={940} h={116} c={GOLD} fill={CARD2} thick={2} />
              <text x={W / 2} y={372} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>mỗi tông môn đều có <tspan fill={GOLD} fontWeight={900}>1 thế lực</tspan></text>
              <text x={W / 2} y={412} fontSize={28} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">đệ tử — VỪA KÍNH VỪA SỢ 💀</text>
            </g>
            <g style={usePop(T.HOOK.hunt, 14)}>
              <Card x={W / 2 - 470} y={460} w={940} h={116} c={A} fill={CARD2} thick={2} />
              <text x={W / 2} y={504} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không tu Kiếm Đạo · Trận Đạo · không tranh cơ duyên</text>
              <text x={W / 2} y={548} fontSize={30} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>thứ bọn họ săn tìm → CON NGƯỜI</text>
            </g>
            <g style={usePop(T.HOOK.name, 15)}>
              <Card x={W / 2 - 400} y={598} w={800} h={140} c={VIOLET} fill={CARD2} thick={3} />
              <text x={W / 2} y={648} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>người đời gọi bọn họ là:</text>
              <text x={W / 2} y={712} fontSize={64} fill={VIOLET} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#nsTextGlow)" opacity={0.9 + 0.1 * glow}>HR TÔNG ✨</text>
            </g>
          </g>
          <Footer label="thế lực không tu kiếm · chỉ săn tìm con người" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 NHAPMON ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <HudBG tint={A} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <GlowDefs />
          <Header tag="NHẬP MÔN · HR TÔNG" />
          <g transform="translate(0, 150)">
            <g style={usePop(T.NHAPMON.join, 13)}>
              <Card x={W / 2 - 470} y={330} w={940} h={92} c={A} fill={CARD2} thick={2} />
              <text x={W / 2} y={386} fontSize={30} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>năm ấy ta gia nhập <tspan fill={A} fontWeight={900}>HR TÔNG</tspan></text>
            </g>
            <g style={usePop(T.NHAPMON.believe, 14)}>
              <Card x={W / 2 - 470} y={442} w={940} h={110} c={GOLD} fill={CARD2} thick={2} />
              <text x={W / 2} y={486} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta luôn tin:</text>
              <text x={W / 2} y={526} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>"đăng tin tuyển người → ứng viên TỰ TÌM ĐẾN" 🤣</text>
            </g>
            <g style={usePop(T.NHAPMON.naive, 15)}>
              <Card x={W / 2 - 400} y={590} w={800} h={130} c={RED} fill={CARD2} thick={3} />
              <text x={W / 2} y={644} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>💀 sau này mới biết…</text>
              <text x={W / 2} y={698} fontSize={52} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#nsTextGlow)" opacity={0.9 + 0.1 * glow}>TA ĐÃ QUÁ NGÂY THƠ</text>
            </g>
          </g>
          <Footer label="tưởng đăng tin là xong · đó là ảo tưởng đầu đời" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 NGOCGIAN ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="NGỌC GIẢN · TUYỂN GẤP" color={GOLD} />
        <g transform="translate(0, 120)">
          <g style={usePop(T.NGOCGIAN.order, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={92} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2 - 448} y={280} fontSize={18} fill={GOLD} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">📜 NGỌC GIẢN TRƯỞNG LÃO — CHỈ 1 CÂU</text>
            <text x={W / 2} y={322} fontSize={34} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"TUYỂN GẤP."</text>
          </g>
          <Say y={358} who="💬 ta: &quot;tuyển ai?&quot; → trưởng lão" whoC={GOLD} text="&quot;Senior.&quot;" entry={T.NGOCGIAN.senior} />
          <Say y={462} who="💬 ta: &quot;lương bao nhiêu?&quot; → trưởng lão" whoC={RED} text="&quot;Junior.&quot; 💀💀💀" entry={T.NGOCGIAN.junior} />
          <Reveal y={566} top="khoảnh khắc ấy — đạo tâm của ta:" big="🔥 xuất hiện VẾT NỨT ĐẦU TIÊN" entry={T.NGOCGIAN.crack} c={RED} h={150} />
        </g>
        <Footer label="tuyển Senior · trả lương Junior · kinh điển ngành" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 NGANSACH ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP ①· NGÂN SÁCH" color={GOLD} />
        <g transform="translate(0, 108)">
          <g style={usePop(T.NGANSACH.first, 12)}>
            <Card x={W / 2 - 470} y={230} w={940} h={96} c={RED} fill={CARD2} thick={2} />
            <text x={W / 2} y={270} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>① kinh nghiệm 10 năm · đòi 200 linh thạch</text>
            <text x={W / 2} y={306} fontSize={28} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ tông môn: "VƯỢT NGÂN SÁCH" 💀</text>
          </g>
          <g style={usePop(T.NGANSACH.second, 13)}>
            <Card x={W / 2 - 470} y={342} w={940} h={96} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={382} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>② đòi đúng ngân sách</text>
            <text x={W / 2} y={418} fontSize={28} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">→ tông môn: "có ai RẺ HƠN không?" 🤣</text>
          </g>
          <Reveal y={456} top="ngày đó ta lĩnh ngộ:" big="🔥 NGÂN SÁCH VÔ THƯỢNG TÂM KINH" entry={T.NGANSACH.name} c={VIOLET} h={118} />
          <g style={usePop(T.NGANSACH.budget, 14)}>
            <Card x={W / 2 - 470} y={590} w={940} h={116} c={A} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={636} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>thứ hiếm nhất — không phải ứng viên</text>
            <text x={W / 2} y={678} fontSize={38} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#nsTextGlow)">mà là… BUDGET 🤣</text>
          </g>
        </g>
        <Footer label="ứng viên thì nhiều · budget mới là tiên phẩm" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 PHONGVAN ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={A} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP ②· KỲ TÀI" />
        <g transform="translate(0, 130)">
          <g style={usePop(T.PHONGVAN.found, 13)}>
            <Card x={W / 2 - 470} y={260} w={940} h={130} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={306} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>7 ngày sau — ta tìm được <tspan fill={A} fontWeight={900}>1 KỲ TÀI</tspan></text>
            <text x={W / 2} y={352} fontSize={26} fill={GREEN} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>lương phù hợp · kỹ năng phù hợp · thái độ phù hợp ✨</text>
          </g>
          <Say y={410} who="💬 ta dâng lên trưởng lão → ngài chỉ hỏi" whoC={GOLD} text="&quot;CÓ NGƯỜI KHÁC KHÔNG?&quot; 💀🤣" entry={T.PHONGVAN.other} h={100} />
          <Reveal y={526} top="đó là lần đầu tiên ta lĩnh ngộ:" big="🔥 VÔ HẠN PHỎNG VẤN ĐẠI PHÁP" entry={T.PHONGVAN.name} c={VIOLET} h={160} />
        </g>
        <Footer label="tìm được người hoàn hảo · vẫn phải xem thêm 'người khác'" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 OFFER ============
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP ③· KÝ KHẾ ƯỚC" color={RED} />
        <g transform="translate(0, 120)">
          <g style={usePop(T.OFFER.rounds, 13)}>
            <Card x={W / 2 - 470} y={250} w={940} h={150} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2 - 448} y={280} fontSize={18} fill={GOLD} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">🗡 ỨNG VIÊN VƯỢT TRẬN</text>
            <text x={W / 2} y={322} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>vòng 1 · vòng 2 · vòng 3 · Technical</text>
            <text x={W / 2} y={366} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>CEO · Culture Fit · thương lượng</text>
          </g>
          <g style={usePop(T.OFFER.reject, 14)}>
            <Card x={W / 2 - 470} y={416} w={940} h={130} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={460} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>📩 sắp ký khế ước → ứng viên truyền âm:</text>
            <text x={W / 2} y={506} fontSize={30} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">"em xin lỗi. em nhận OFFER KHÁC rồi." 💀💀💀</text>
          </g>
          <Reveal y={562} top="khoảnh khắc ấy — 3 tháng tu vi Tuyển Sinh Đạo:" big="🤣 trực tiếp HÓA THÀNH HƯ VÔ" entry={T.OFFER.void} c={VIOLET} h={150} />
        </g>
        <Footer label="qua hết mọi vòng · rồi 'nhận offer khác rồi'" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S7 THIENKIEP ============
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={RED} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="THIÊN KIẾP CHƯA KẾT THÚC" color={RED} />
        <g transform="translate(0, 108)">
          <g style={usePop(T.THIENKIEP.dev, 13)}>
            <Card x={W / 2 - 470} y={230} w={940} h={150} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={274} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 Developer: "HR ơi, sao chưa có người?"</text>
            <text x={W / 2} y={316} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 PM: "khi nào onboard?"</text>
            <text x={W / 2} y={358} fontSize={27} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 CEO: "đăng tuyển chưa?"</text>
          </g>
          <g style={usePop(T.THIENKIEP.board, 14)}>
            <Card x={W / 2 - 470} y={396} w={940} h={116} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={440} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>ta nhìn bảng tuyển dụng:</text>
            <text x={W / 2} y={482} fontSize={34} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">18 VỊ TRÍ · KHÔNG MỘT ứng viên 💀</text>
          </g>
          <Reveal y={528} top="ta ngẩng đầu nhìn trời — lần đầu hiểu cảm giác:" big="🤣 MỘT MÌNH THỦ TÔNG" entry={T.THIENKIEP.alone} c={A} h={150} />
        </g>
        <Footer label="ai cũng hỏi 'có người chưa' · bảng vẫn trống trơn" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S8 ANTHAN ============
const S8: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={A} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="ỨNG VIÊN TRONG MỘNG" />
        <g transform="translate(0, 106)">
          <g style={usePop(T.ANTHAN.cv, 13)}>
            <Card x={W / 2 - 470} y={224} w={940} h={150} c={A} fill={CARD2} thick={2} />
            <text x={W / 2 - 448} y={254} fontSize={18} fill={A} textAnchor="start" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="2">✨ CUỐI CÙNG — 1 ỨNG VIÊN XUẤT HIỆN</text>
            <text x={W / 2} y={296} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>CV đẹp như tiên kinh · GitHub sáng như nhật nguyệt</text>
            <text x={W / 2} y={340} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>LinkedIn lóa mắt quần hùng</text>
          </g>
          <g style={usePop(T.ANTHAN.noshow, 14)}>
            <Card x={W / 2 - 470} y={390} w={940} h={150} c={RED} fill={CARD2} thick={2.5} />
            <text x={W / 2} y={432} fontSize={26} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>💬 ta mừng rỡ mời phỏng vấn → đến ngày…</text>
            <text x={W / 2} y={476} fontSize={32} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">ỨNG VIÊN KHÔNG TỚI 💀</text>
            <text x={W / 2} y={518} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không 1 lời · không 1 tin nhắn · như chưa từng tồn tại</text>
          </g>
          <Reveal y={556} top="ngày đó ta mới hiểu — đây chính là:" big="🔥 ẨN THÂN ĐẠI PHÁP · trong truyền thuyết 🤣" entry={T.ANTHAN.name} c={VIOLET} h={150} />
        </g>
        <Footer label="CV hoàn hảo · đến ngày hẹn thì bốc hơi" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S9 NGO ============
const S9: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={GREEN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="NGỘ RA" color={GREEN} />
        <g transform="translate(0, 150)">
          <g style={usePop(T.NGO.notrecruit, 13)}>
            <Card x={W / 2 - 470} y={300} w={940} h={92} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={356} fontSize={29} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>HR — <tspan fill={A} fontWeight={900}>không phải người tuyển dụng</tspan></text>
          </g>
          <Reveal y={430} top="mà là người ngày nào cũng đi khắp thiên hạ, tìm kiếm:" big="🔥 những người ĐANG KHÔNG MUỐN BỊ TÌM THẤY 🤣" entry={T.NGO.find} c={GREEN} h={180} />
        </g>
        <Footer label="đi tìm người · đang cố tình để không bị tìm ra" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S10 DAOLY ============
const S10: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG }}>
    <HudBG tint={A} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <GlowDefs />
        <Header tag="ĐẠO LÝ" />
        <g transform="translate(0, 100)">
          <g style={usePop(T.DAOLY.msg, 12)}>
            <Card x={W / 2 - 470} y={214} w={940} h={110} c={GOLD} fill={CARD2} thick={2} />
            <text x={W / 2} y={256} fontSize={24} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nếu một ngày ngươi nhận được 1 tin nhắn:</text>
            <text x={W / 2} y={298} fontSize={27} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"Chào anh. Em thấy hồ sơ của anh rất phù hợp…" 🤣</text>
          </g>
          <g style={usePop(T.DAOLY.block, 13)}>
            <Card x={W / 2 - 400} y={340} w={800} h={84} c={RED} fill={CARD2} thick={3} />
            <text x={W / 2} y={394} fontSize={40} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#nsTextGlow)">ĐỪNG VỘI BLOCK</text>
          </g>
          <g style={usePop(T.DAOLY.trials, 14)}>
            <Card x={W / 2 - 470} y={440} w={940} h={150} c={A} fill={CARD2} thick={2} />
            <text x={W / 2} y={484} fontSize={25} fill={SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>bên kia màn hình — 1 đồng môn HR vừa vượt:</text>
            <text x={W / 2} y={526} fontSize={28} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>18 trận thiên kiếp 💀</text>
            <text x={W / 2} y={566} fontSize={26} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>27 lần bị ghost · 36 lần bị từ chối</text>
          </g>
          <Reveal y={606} top="chỉ để gửi tin nhắn đó —" big="✨ CHO RIÊNG NGƯƠI" entry={T.DAOLY.foryou} c={GOLD} h={140} />
        </g>
        <Footer label="1 tin nhắn tuyển dụng · là 100 lần bị từ chối trước đó" />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S11 CTA ============
const S11: React.FC<{ duration: number }> = ({ duration }) => {
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
            <text x={W / 2} y={620} fontSize={36} fill={TEXT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>Ngươi là HR —</text>
            <text x={W / 2} y={682} fontSize={36} fill={RED} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" filter="url(#nsTextGlow)">hay ứng viên từng LẶN MẤT TĂM? 🤣</text>
          </g>
          <g style={{ ...cmt, transformOrigin: `${W / 2}px 800px`, transformBox: "fill-box" }}>
            <text x={W / 2} y={812} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>💬 kể ta nghe ở phần bình luận 👇</text>
          </g>
          <g style={{ ...btn, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 950px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 310} y={890} width={620} height={146} rx={20} fill={A} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 292} y={902} width={584} height={122} rx={14} fill={CARD2} stroke={A} strokeWidth={3} />
              <text x={W / 2} y={982} fontSize={48} fill={A} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2" filter="url(#nsTextGlow)">🔔 THEO DÕI</text>
            </g>
          </g>
          <text x={W / 2} y={1110} fontSize={28} fill={MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic" opacity={useFade(120, 12)}>nghe tiếp truyền kỳ chốn công sở ✦</text>
          <Footer label="theo dõi · trước khi ứng viên tiếp theo lặn mất tăm" />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11];

const SlideFade: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const f = useCurrentFrame();
  const total = Math.round(duration * FPS);
  const o = Math.min(
    interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [total - 9, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const NhanSu: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("nhan_su/voice.mp3")} />
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
