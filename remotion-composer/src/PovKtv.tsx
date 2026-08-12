import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./pov_ktv_beats.json";
import T from "./pov_ktv_timings.json";

loadBeVietnamPro("normal", { weights: ["300", "400", "500", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const TOTAL = "10";

// ===== neon karaoke palette =====
const BG_DARK = "#0B0613";
const BG_CARD = "#1A0F2B";
const BG_TERM = "#120A1F";
const BG_RED = "#2A0D1B";
const PINK = "#FF2D95";
const PINK_SOFT = "#FF7AC2";
const PURPLE = "#B24BF3";
const CYAN = "#2DE2FF";
const GOLD = "#FFD24A";
const RED = "#FF4D6D";
const TEXT_PRI = "#F5EAFF";
const TEXT_SEC = "#C9B6E6";
const TEXT_MUTE = "#7E6C9E";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

const useFadeUp = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [e, e + d], [22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${ty}px)` };
};
const useScaleIn = (e: number, d = 14) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(f, [e, e + d], [0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `scale(${scale})` };
};
const useFade = (e: number, d = 12) => {
  const f = useCurrentFrame();
  return interpolate(f, [e, e + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

const NeonBG: React.FC<{ tint?: string }> = ({ tint = PINK }) => {
  const frame = useCurrentFrame();
  // equalizer bars at the bottom
  const bars = Array.from({ length: 26 }, (_, i) => {
    const h = 30 + Math.abs(Math.sin(frame / 9 + i * 0.7)) * 90 + Math.abs(Math.sin(frame / 5 + i)) * 30;
    return h;
  });
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="ktTop" cx="50%" cy="14%" r="55%">
            <stop offset="0%" stopColor={tint} stopOpacity="0.28" />
            <stop offset="100%" stopColor={BG_DARK} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ktBL" cx="12%" cy="86%" r="46%">
            <stop offset="0%" stopColor={PURPLE} stopOpacity="0.26" />
            <stop offset="100%" stopColor={BG_DARK} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ktBR" cx="90%" cy="80%" r="44%">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.18" />
            <stop offset="100%" stopColor={BG_DARK} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ktVig" cx="50%" cy="46%" r="75%">
            <stop offset="60%" stopColor={BG_DARK} stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
          </radialGradient>
          <filter id="ktBlur"><feGaussianBlur stdDeviation="26" /></filter>
          <linearGradient id="ktBar" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={PURPLE} stopOpacity="0.5" />
            <stop offset="100%" stopColor={PINK} stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill={BG_DARK} />
        <rect width={W} height={H} fill="url(#ktTop)" />
        <rect width={W} height={H} fill="url(#ktBL)" />
        <rect width={W} height={H} fill="url(#ktBR)" />
        {/* bokeh club lights */}
        <g filter="url(#ktBlur)" opacity={0.5}>
          <circle cx={170 + Math.sin(frame / 40) * 20} cy={300} r={60} fill={PINK} opacity={0.4} />
          <circle cx={900} cy={420 + Math.cos(frame / 35) * 18} r={70} fill={CYAN} opacity={0.3} />
          <circle cx={760} cy={250} r={46} fill={PURPLE} opacity={0.4} />
          <circle cx={260} cy={560} r={50} fill={GOLD} opacity={0.22} />
        </g>
        {/* equalizer */}
        <g opacity={0.55}>
          {bars.map((h, i) => (
            <rect key={i} x={18 + i * 40} y={H - h} width={26} height={h} rx={6} fill="url(#ktBar)" />
          ))}
        </g>
        <rect width={W} height={H} fill="url(#ktVig)" />
        {/* neon corner frame */}
        <g stroke={PINK} strokeWidth={2.5} opacity={0.55}>
          <path d="M 34 34 L 34 74 M 34 34 L 74 34" fill="none" />
          <path d={`M ${W - 34} 34 L ${W - 34} 74 M ${W - 34} 34 L ${W - 74} 34`} fill="none" />
          <path d={`M 34 ${H - 34} L 34 ${H - 74} M 34 ${H - 34} L 74 ${H - 34}`} fill="none" />
          <path d={`M ${W - 34} ${H - 34} L ${W - 34} ${H - 74} M ${W - 34} ${H - 34} L ${W - 74} ${H - 34}`} fill="none" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const KenBurns: React.FC<{ duration: number; children: React.ReactNode }> = ({ duration, children }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration * FPS], [1.0, 1.035], { extrapolateRight: "clamp" });
  return <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, transformOrigin: "center" }}>{children}</div>;
};

const SectionHeader: React.FC<{ num: string; label: string }> = ({ num, label }) => {
  const a1 = useFadeUp(0, 10), a2 = useFade(4, 10), a3 = useFadeUp(8, 10);
  return (
    <g>
      <text x={80} y={130} fontSize={18} fill={PINK} fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="3" style={a1}>[{num} / {TOTAL}]</text>
      <line x1={80} y1={150} x2={W - 80} y2={150} stroke={PINK} strokeWidth={1} opacity={0.45 * a2} />
      <text x={80} y={180} fontSize={16} fill={TEXT_SEC} fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="5" style={a3}>{label}</text>
    </g>
  );
};
const FigFooter: React.FC<{ label: string }> = ({ label }) => (
  <g>
    <line x1={80} y1={H - 140} x2={W - 80} y2={H - 140} stroke={PINK} strokeWidth={1} opacity={0.4} />
    <text x={W / 2} y={H - 110} fontSize={18} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="3">{label}</text>
  </g>
);
const BrandMark: React.FC = () => (
  <text x={W / 2} y={H - 60} fontSize={16} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500} letterSpacing="4">🍷 truyền kỳ · chốn phù hoa · neon</text>
);

// neon card with glow stroke
const NeonCard: React.FC<{ x: number; y: number; w: number; h: number; color?: string; fill?: string; thick?: number; rx?: number }> = ({ x, y, w, h, color = PINK, fill = BG_CARD, thick = 2.5, rx = 16 }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={rx} fill={color} opacity={0.12} />
    <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={color} strokeWidth={thick} />
  </g>
);

// Hero: cn = tên công pháp (Hán-Việt) · en = tên lớn · sub
const Hero: React.FC<{ cy: number; cn: string; en: string; sub?: string; color: string; entry: number }> = ({ cy, cn, en, sub, color, entry }) => {
  const a = useScaleIn(entry, 14);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${cy}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 490} y={cy - 84} width={980} height={168} rx={18} fill={color} opacity={0.12} />
      <rect x={W / 2 - 490} y={cy - 84} width={980} height={168} rx={18} fill={BG_TERM} stroke={color} strokeWidth={4} />
      <text x={W / 2} y={cy - 28} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>《{cn}》</text>
      <text x={W / 2} y={cy + 32} fontSize={46} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1">{en}</text>
      {sub && <text x={W / 2} y={cy + 68} fontSize={20} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>{sub}</text>}
    </g>
  );
};
// KiepTag: nhãn thiên kiếp (loại khách) màu đỏ neon
const KiepTag: React.FC<{ y: number; n: string; name: string; entry: number }> = ({ y, n, name, entry }) => {
  const a = useScaleIn(entry, 12);
  return (
    <g style={{ ...a, transformOrigin: `${W / 2}px ${y + 50}px`, transformBox: "fill-box" }}>
      <rect x={W / 2 - 440} y={y} width={880} height={104} rx={14} fill={RED} opacity={0.13} />
      <rect x={W / 2 - 440} y={y} width={880} height={104} rx={14} fill={BG_RED} stroke={RED} strokeWidth={3} />
      <text x={W / 2} y={y + 42} fontSize={22} fill={RED} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700} letterSpacing="4">{n}</text>
      <text x={W / 2} y={y + 82} fontSize={42} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{name}</text>
    </g>
  );
};

// ============ S1 HOOK ============
const S1: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{ background: BG_DARK }}>
      <NeonBG tint={PINK} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="00" label="POV · CHỐN PHÙ HOA" />
          <g style={useFadeUp(8, 12)}>
            <text x={W / 2} y={560} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={600} letterSpacing="2">🏯 POV: TA LÀ</text>
            <text x={W / 2} y={648} fontSize={76} fill={PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="1" opacity={0.85 + 0.15 * glow}>BÁN TIẾU CHÂN NHÂN</text>
            <text x={W / 2} y={700} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={500}>// kẻ bán nụ cười · tiếp viên KTV</text>
          </g>
          <g style={useScaleIn(T.HOOK.who, 14)}>
            <NeonCard x={W / 2 - 480} y={770} w={960} h={120} color={PURPLE} />
            <text x={W / 2} y={820} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>tu sĩ chỉ độ kiếp khi mặt trời đã lặn 🌙</text>
            <text x={W / 2} y={862} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>thiên hạ đi ngủ · em mới vào động</text>
          </g>
          <g style={useScaleIn(T.HOOK.count, 14)}>
            <NeonCard x={W / 2 - 490} y={930} w={980} h={130} color={RED} fill={BG_RED} thick={3.5} />
            <text x={W / 2} y={1010} fontSize={35} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mỗi đêm độ vô số kiếp nạn… mang hình hài ĐÀN ÔNG 💀</text>
          </g>
          <FigFooter label="người đời gọi là tiếp viên · giới này gọi Bán Tiếu Chân Nhân" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S2 CONGPHAP ============
const S2: React.FC<{ duration: number }> = ({ duration }) => {
  const phaps = [
    { i: "🎭", n: "Bất Diệt Tiếu Diện", d: "nụ cười không tắt · dù trong lòng tắt ngấm", c: PINK },
    { i: "🍶", n: "Thiên Bôi Bất Đảo", d: "ngàn ly xuống cổ · mặt vẫn phải tỉnh", c: CYAN },
    { i: "🪞", n: "Tứ Lạng Bạt Thiên Cân", d: "một câu \"dạ anh\" · hóa giải mọi đòn", c: GOLD },
  ];
  return (
    <AbsoluteFill style={{ background: BG_DARK }}>
      <NeonBG tint={PURPLE} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="01" label="NHẬP MÔN · TAM ĐẠI CÔNG PHÁP" />
          <text x={W / 2} y={520} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(T.CONGPHAP.intro, 12)}>ngỡ dễ — mặc đẹp, cười, rót bia · sau mới biết phải luyện 3 môn:</text>
          {phaps.map((p, i) => (
            <g key={i} style={useScaleIn((T.CONGPHAP.phaps as number[])[i], 11)}>
              <NeonCard x={W / 2 - 470} y={580 + i * 150} w={940} h={130} color={p.c} />
              <text x={W / 2 - 420} y={648 + i * 150} fontSize={50} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif">{p.i}</text>
              <text x={W / 2 - 350} y={638 + i * 150} fontSize={34} fill={p.c} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{p.n}</text>
              <text x={W / 2 - 350} y={680 + i * 150} fontSize={24} fill={TEXT_SEC} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>{p.d}</text>
            </g>
          ))}
          <FigFooter label="đủ ba môn · mới dám đẩy cửa bước vào" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S3 TUYKHOC ============
const S3: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_DARK }}>
    <NeonBG tint={CYAN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="02" label="KHÁCH ① · ANH SAY KHÓC" />
        <KiepTag y={470} n="THIÊN KIẾP" name="Túy Khốc Kiếp" entry={T.TUYKHOC.kiep} />
        <g style={useScaleIn(T.TUYKHOC.cry, 14)}>
          <NeonCard x={W / 2 - 480} y={620} w={960} h={150} color={CYAN} />
          <text x={W / 2} y={672} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>3 chai → gọi em bằng tên người yêu cũ</text>
          <text x={W / 2} y={724} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">5 chai → gục xuống khóc: vợ bỏ, công ty sập</text>
        </g>
        <g style={useScaleIn(T.TUYKHOC.sing, 14)}>
          <NeonCard x={W / 2 - 480} y={800} w={960} h={120} color={GOLD} />
          <text x={W / 2} y={870} fontSize={33} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">🎤 hát "Phai Dấu Cuộc Tình" × 4 lần liên tiếp</text>
        </g>
        <g style={useScaleIn(T.TUYKHOC.role, 14)}>
          <NeonCard x={W / 2 - 490} y={950} w={980} h={150} color={RED} fill={BG_RED} thick={3.5} />
          <text x={W / 2} y={1002} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>em hóa thân: thùng rác cảm xúc + nhà tâm lý không bằng cấp</text>
          <text x={W / 2} y={1058} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">họ trả tiền để em nghe · anh trả tiền để được khóc 🤡</text>
        </g>
        <FigFooter label="Túy Khốc Kiếp · khách say biến em thành nhà tâm lý" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S4 HUVINH ============
const S4: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_DARK }}>
    <NeonBG tint={GOLD} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="03" label="KHÁCH ② · ĐẠI GIA RỞM" />
        <KiepTag y={460} n="THIÊN KIẾP" name="Hư Vinh Kiếp" entry={T.HUVINH.kiep} />
        <g style={useScaleIn(T.HUVINH.boast, 14)}>
          <NeonCard x={W / 2 - 480} y={610} w={960} h={130} color={GOLD} />
          <text x={W / 2} y={660} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>đồng hồ lấp lánh · xe ngoài cửa · giọng vang như sấm:</text>
          <text x={W / 2} y={712} fontSize={34} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"anh bao em cả tháng!" 💅</text>
        </g>
        <g style={useScaleIn(T.HUVINH.card, 14)}>
          <NeonCard x={W / 2 - 480} y={770} w={960} h={120} color={RED} fill={BG_RED} thick={3.5} />
          <text x={W / 2} y={842} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>quẹt thẻ → 1 lần · 2 lần · 3 lần · MÁY ĐỎ ĐÈN 🔴</text>
        </g>
        <g style={useScaleIn(T.HUVINH.reveal, 14)}>
          <NeonCard x={W / 2 - 490} y={920} w={980} h={150} color={PINK} fill={BG_TERM} thick={3.5} />
          <text x={W / 2} y={972} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>đồng hồ fake · xe trả góp · lời hứa miễn phí</text>
          <text x={W / 2} y={1028} fontSize={33} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">đại gia gì — hóa ra đại… NỢ 🤣</text>
        </g>
        <FigFooter label="Hư Vinh Kiếp · hào quang vay mượn, quẹt thẻ là lộ" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S5 SIMONG ============
const S5: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_DARK }}>
    <NeonBG tint={PURPLE} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="04" label="KHÁCH ③ · ANH TƯỞNG BỞ" />
        <KiepTag y={500} n="THIÊN KIẾP NGUY HIỂM NHẤT" name="Si Mộng Kiếp" entry={T.SIMONG.kiep} />
        <g style={useScaleIn(T.SIMONG.text, 14)}>
          <NeonCard x={W / 2 - 480} y={650} w={960} h={200} color={PURPLE} />
          <text x={W / 2} y={702} fontSize={26} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500}>3 giờ sáng · tin nhắn tới 📱</text>
          <text x={W / 2} y={752} fontSize={31} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">"ngủ chưa người đẹp…"</text>
          <text x={W / 2} y={808} fontSize={30} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">"giữa anh với em có gì đó, đúng không?"</text>
        </g>
        <g style={useScaleIn(T.SIMONG.vip, 14)}>
          <NeonCard x={W / 2 - 490} y={890} w={980} h={170} color={RED} fill={BG_RED} thick={3.5} />
          <text x={W / 2} y={952} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>dạ đúng. Em coi anh là khách VIP.</text>
          <text x={W / 2} y={1012} fontSize={33} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mà VIP nghĩa là… một cái VÍ biết đi 💸</text>
        </g>
        <FigFooter label="Si Mộng Kiếp · khách tự nhập mộng, em chỉ thu phí" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S6 HATIEN ============
const S6: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_DARK }}>
    <NeonBG tint={CYAN} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="05" label="KHÁCH ④ · ANH KẸO KÉO" />
        <KiepTag y={470} n="THIÊN KIẾP" name="Hà Tiện Kiếp" entry={T.HATIEN.kiep} />
        <text x={W / 2} y={636} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" opacity={useFade(T.HATIEN.kiep + 6, 12)}>tưởng kiếp giàu mới mệt? kiếp nghèo còn độc hơn 😮‍💨</text>
        <g style={useScaleIn(T.HATIEN.cheap, 14)}>
          <NeonCard x={W / 2 - 480} y={670} w={960} h={170} color={CYAN} />
          <text x={W / 2} y={722} fontSize={31} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>1 chai bia · ngồi 4 TIẾNG 🍺</text>
          <text x={W / 2} y={772} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>bóc sạch đĩa trái cây → "cho anh xin free đĩa nữa"</text>
          <text x={W / 2} y={818} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic">"em uống làm gì cho hại sức khỏe"</text>
        </g>
        <g style={useScaleIn(T.HATIEN.tip, 14)}>
          <NeonCard x={W / 2 - 490} y={890} w={980} h={170} color={GOLD} fill={BG_TERM} thick={3.5} />
          <text x={W / 2} y={950} fontSize={32} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>bo cho em… 20 NGHÌN + 1 cái nháy mắt 😉</text>
          <text x={W / 2} y={1010} fontSize={33} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">người đời gọi: đi hát bằng NIỀM TIN 🤣</text>
        </g>
        <FigFooter label="Hà Tiện Kiếp · trả bằng niềm tin và lời khuyên sức khỏe" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S7 MAAM ============
const S7: React.FC<{ duration: number }> = ({ duration }) => (
  <AbsoluteFill style={{ background: BG_DARK }}>
    <NeonBG tint={PINK} />
    <KenBurns duration={duration}>
      <svg width={W} height={H}>
        <SectionHeader num="06" label="KHÁCH ⑤ · ANH PHÁ MIC" />
        <KiepTag y={470} n="THIÊN KIẾP" name="Ma Âm Kiếp" entry={T.MAAM.kiep} />
        <g style={useScaleIn(T.MAAM.grab, 14)}>
          <NeonCard x={W / 2 - 480} y={620} w={960} h={190} color={PINK} />
          <text x={W / 2} y={672} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>không tới để uống · tới để hành hạ cái mic 🎤</text>
          <text x={W / 2} y={724} fontSize={29} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>giành mic phút đầu · sai tông từ nốt đầu</text>
          <text x={W / 2} y={774} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic">đẩy nhạc 100% · rống 3 tiếng không nghỉ</text>
        </g>
        <g style={useScaleIn(T.MAAM.ask, 14)}>
          <NeonCard x={W / 2 - 490} y={860} w={980} h={170} color={RED} fill={BG_RED} thick={3.5} />
          <text x={W / 2} y={918} fontSize={30} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>"anh hát có hay không em?"</text>
          <text x={W / 2} y={978} fontSize={32} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">dạ hay… hay tới mức phòng bên cạnh vừa TRẢ PHÒNG 🤣</text>
        </g>
        <FigFooter label="Ma Âm Kiếp · sát thủ thanh quản của cả tầng" />
        <BrandMark />
      </svg>
    </KenBurns>
  </AbsoluteFill>
);

// ============ S8 TANGHAI ============
const S8: React.FC<{ duration: number }> = ({ duration }) => {
  const dodge = ["\"dạ thôi anh, mai em có ca sớm\"", "\"dạ em còn kẹt chút việc nhà\"", "\"dạ để hôm khác nha anh\""];
  return (
    <AbsoluteFill style={{ background: BG_DARK }}>
      <NeonBG tint={GOLD} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="07" label="ĐẠI KHẢO NGHIỆM · TỨ LẠNG BẠT THIÊN CÂN" />
          <g style={useScaleIn(T.TANGHAI.gaze, 13)}>
            <NeonCard x={W / 2 - 480} y={480} w={960} h={130} color={RED} fill={BG_RED} thick={3.5} />
            <text x={W / 2} y={530} fontSize={27} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>nửa khuya · có anh ghé sát tai:</text>
            <text x={W / 2} y={582} fontSize={33} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontStyle="italic">"xong đây… mình đi tăng hai nha em?" 😏</text>
          </g>
          <text x={W / 2} y={668} fontSize={26} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} fontStyle="italic" opacity={useFade(T.TANGHAI.gaze + 10, 10)}>🪞 Tứ Lạng Bạt Thiên Cân — lên tới đỉnh cao:</text>
          {dodge.map((t, i) => (
            <g key={i} style={useScaleIn((T.TANGHAI.dodge as number[])[i], 10)}>
              <NeonCard x={W / 2 - 470} y={700 + i * 88} w={940} h={72} color={GOLD} />
              <text x={W / 2} y={746 + i * 88} fontSize={28} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t}</text>
            </g>
          ))}
          <g style={useScaleIn(T.TANGHAI.punch, 14)}>
            <NeonCard x={W / 2 - 490} y={985} w={980} h={120} color={PINK} fill={BG_TERM} thick={3.5} />
            <text x={W / 2} y={1057} fontSize={33} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">né ngàn đòn · mặt vẫn cười · mà "hôm khác" không bao giờ tới 🤣</text>
          </g>
          <FigFooter label="né khéo mà khách vẫn vui · đó mới là chân công phu" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S9 THANCHU ============
const S9: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 7);
  return (
    <AbsoluteFill style={{ background: BG_DARK }}>
      <NeonBG tint={PINK} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="08" label="CÂU THẦN CHÚ GIỮ CHÂN" />
          <text x={W / 2} y={560} fontSize={28} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} fontStyle="italic" style={useFadeUp(10, 12)}>đêm nào trong Túy Mộng Các cũng vang một câu thần chú:</text>
          <g style={useScaleIn(T.THANCHU.spell, 16)}>
            <NeonCard x={W / 2 - 490} y={600} w={980} h={150} color={PINK} fill={BG_TERM} thick={4.5} rx={20} />
            <text x={W / 2} y={692} fontSize={44} fill={PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" opacity={0.85 + 0.15 * glow}>"thêm một tăng nữa đi cưng" 🍷</text>
        </g>
          <text x={W / 2} y={820} fontSize={29} fill={TEXT_SEC} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600} opacity={useFade(T.THANCHU.spell + 14, 10)}>khách càng vui · tiền bo càng dày → em cười, cụng ly, "dạ anh"</text>
          <g style={useScaleIn(T.THANCHU.clock, 14)}>
            <NeonCard x={W / 2 - 460} y={860} w={920} h={110} color={CYAN} />
            <text x={W / 2} y={930} fontSize={44} fill={CYAN} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontWeight={700}>02:00 · 03:00 · 04:00 ⏰</text>
          </g>
          <g style={useScaleIn(T.THANCHU.sunrise, 14)}>
            <NeonCard x={W / 2 - 490} y={1000} w={980} h={120} color={RED} fill={BG_RED} thick={3.5} />
            <text x={W / 2} y={1072} fontSize={31} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic">mặt trời sắp mọc · mà đám kiếp nạn chưa ai chịu PHI THĂNG 💀</text>
          </g>
          <FigFooter label="thần chú giữ chân · 4h sáng khách vẫn chưa về" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

// ============ S10 TIER + CTA ============
const S10: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const tiers = [
    { p: "🥉 Hạ phẩm", s: "rót bia không tràn ly", c: TEXT_SEC },
    { p: "🥈 Trung phẩm", s: "nghe khách khóc · mắt vẫn ráo", c: CYAN },
    { p: "🥇 Thượng phẩm", s: "khách quẹt thẻ đỏ đèn · vẫn cười tươi", c: PURPLE },
    { p: "🔥 Cực phẩm", s: "bo cả tháng lương · chưa cụng ly 2", c: GOLD },
  ];
  const pulse = 1 + 0.03 * Math.sin(frame / 6);
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ background: BG_DARK }}>
      <NeonBG tint={GOLD} />
      <KenBurns duration={duration}>
        <svg width={W} height={H}>
          <SectionHeader num="09" label="TIER · CẢNH GIỚI BÁN TIẾU" />
          <g>
            {tiers.map((t, i) => (
              <g key={i} style={useScaleIn((T.TIER.tiers as number[])[i], 10)}>
                <NeonCard x={W / 2 - 470} y={400 + i * 92} w={940} h={76} color={t.c} fill={i === 3 ? BG_TERM : BG_CARD} thick={i === 3 ? 3.5 : 2.5} />
                <text x={W / 2 - 440} y={447 + i * 92} fontSize={28} fill={t.c} textAnchor="start" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900}>{t.p}</text>
                <text x={W / 2 + 440} y={447 + i * 92} fontSize={25} fill={TEXT_PRI} textAnchor="end" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>{t.s}</text>
              </g>
            ))}
          </g>
          <text x={W / 2} y={812} fontSize={30} fill={GOLD} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} fontStyle="italic" style={useScaleIn(T.TIER.lost, 12)}>tiếc thay · cảnh giới Cực phẩm đã THẤT TRUYỀN 🤣</text>
          {/* CTA */}
          <g style={useScaleIn(T.TIER.cta, 14)}>
            <text x={W / 2} y={900} fontSize={31} fill={TEXT_PRI} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Ngươi từng gặp loại khách nào? Hay còn loại độc hơn?</text>
            <g style={{ transform: `scale(${pulse})`, transformOrigin: `${W / 2}px 1010px`, transformBox: "fill-box" }}>
              <rect x={W / 2 - 300} y={940} width={600} height={140} rx={70} fill={PINK} opacity={0.16 + 0.12 * glow} />
              <rect x={W / 2 - 285} y={952} width={570} height={116} rx={58} fill={BG_TERM} stroke={PINK} strokeWidth={4} />
              <text x={W / 2} y={1028} fontSize={44} fill={PINK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={900} letterSpacing="2">🔔 THEO DÕI</text>
            </g>
            <text x={W / 2} y={1140} fontSize={27} fill={TEXT_MUTE} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={500} fontStyle="italic">khai ra ở bình luận 👇 · truyền kỳ chốn nhân gian 🏯</text>
          </g>
          <FigFooter label="cực phẩm Bán Tiếu Chân Nhân · đã thất truyền" />
          <BrandMark />
        </svg>
      </KenBurns>
    </AbsoluteFill>
  );
};

const SLIDES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

export const PovKtv: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: BG_DARK }}>
      <Audio src={staticFile("pov_ktv/voice.mp3")} />
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
