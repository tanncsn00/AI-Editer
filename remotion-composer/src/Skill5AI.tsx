import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import wordsData from "./skill5_words.json";
import beatsData from "./skill5_beats.json";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadEBGaramond("italic", { weights: ["600", "700"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";
const IVORY = "#F5F5F0";
const RED = "#D03020";
const GREEN = "#3FA85A";
const BLUE = "#4A7AC8";

type Word = { word: string; start: number; end: number; beat: number };
const words = wordsData as Word[];
type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const totalDuration = (beatsData as { total_duration: number }).total_duration;
const B = (i: number) => {
  const b = beats[i - 1];
  return [b.start, b.start + b.duration] as const;
};

const mouthOpenAt = (t: number): number => {
  for (const w of words) {
    if (t >= w.start && t <= w.end) {
      const progress = (t - w.start) / (w.end - w.start);
      return Math.sin(progress * Math.PI);
    }
  }
  return 0;
};

const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="s5PN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="51" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="s5Vig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#s5PN)" />
    <rect width={W} height={H} fill="url(#s5Vig)" />
  </svg>
);

const Teacher: React.FC<{ mouthOpen: number; pointing?: boolean; waving?: boolean; thumbs?: boolean }> = ({
  mouthOpen, pointing = false, waving = false, thumbs = false,
}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 8) * 3;
  const blink = Math.sin(frame / 45) > 0.92;
  const waveAngle = waving ? Math.sin(frame / 4) * 15 : 0;
  return (
    <g transform={`translate(0, ${bob})`}>
      <line x1={-12} y1={30} x2={-18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
      <line x1={12} y1={30} x2={18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
      <ellipse cx={-20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
      <ellipse cx={20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
      <rect x={-22} y={-25} width={44} height={58} rx={10} fill={BLUE} stroke={INK} strokeWidth={3.5} />
      <path d="M -8 -25 L 0 -15 L 8 -25" fill="#E8E0D0" stroke={INK} strokeWidth={2} />
      {pointing ? (
        <>
          <line x1={22} y1={-12} x2={55} y2={-40} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={22} y1={-12} x2={55} y2={-40} stroke={INK} strokeWidth={2.5} />
          <circle cx={58} cy={-44} r={6} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke={INK} strokeWidth={2.5} />
        </>
      ) : waving ? (
        <>
          <g transform={`rotate(${waveAngle}, 22, -12)`}>
            <line x1={22} y1={-12} x2={50} y2={-50} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
            <line x1={22} y1={-12} x2={50} y2={-50} stroke={INK} strokeWidth={2.5} />
            <circle cx={54} cy={-55} r={7} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
          </g>
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke={INK} strokeWidth={2.5} />
        </>
      ) : thumbs ? (
        <>
          <line x1={22} y1={-12} x2={40} y2={-38} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={22} y1={-12} x2={40} y2={-38} stroke={INK} strokeWidth={2.5} />
          <circle cx={44} cy={-44} r={8} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
          <line x1={44} y1={-52} x2={44} y2={-60} stroke="#F8E0D0" strokeWidth={5} strokeLinecap="round" />
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke={INK} strokeWidth={2.5} />
        </>
      ) : (
        <>
          <line x1={-22} y1={-8} x2={-38} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={22} y1={-8} x2={38} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={-22} y1={-8} x2={-38} y2={18} stroke={INK} strokeWidth={2.5} />
          <line x1={22} y1={-8} x2={38} y2={18} stroke={INK} strokeWidth={2.5} />
        </>
      )}
      <circle cx={0} cy={-46} r={22} fill="#F8E0D0" stroke={INK} strokeWidth={3.5} />
      <path d="M -22 -52 Q -18 -68 -6 -66 Q 2 -72 14 -68 Q 22 -60 22 -52" fill="#1A1A22" />
      {blink ? (
        <>
          <line x1={-12} y1={-48} x2={-4} y2={-48} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={4} y1={-48} x2={12} y2={-48} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={-8} cy={-48} r={3} fill={INK} />
          <circle cx={8} cy={-48} r={3} fill={INK} />
        </>
      )}
      {mouthOpen > 0.2 ? (
        <ellipse cx={0} cy={-36} rx={5 * mouthOpen} ry={4 * mouthOpen} fill="#C04030" stroke={INK} strokeWidth={2} />
      ) : (
        <path d="M -6 -38 Q 0 -33 6 -38" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      )}
    </g>
  );
};

// Caption — chunk max 6 từ
type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  const flush = () => {
    if (buf.length) {
      out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
      buf = [];
    }
  };
  for (const w of words) {
    buf.push(w);
    if (/[.!?]$/.test(w.word)) {
      flush();
      continue;
    }
    if (/[,—:]$/.test(w.word) && buf.length >= 4) {
      flush();
      continue;
    }
    if (buf.length >= 6) {
      flush();
    }
  }
  flush();
  return out;
})();

const EMPH = new Set<string>([
  "AI", "AI.", "AI,",
  "5", "năm", "5.",
  "kỹ", "năng", "năng,", "năng.", "năng?",
  "giá", "trị", "trị.", "trị,", "trị?",
  "Problem", "Solving.", "Solving,",
  "Communication.", "Communication,",
  "Creativity", "Taste.", "Taste,",
  "Strategic", "Thinking.", "Thinking,",
  "Leverage.", "Leverage,",
  "vấn", "đề", "đề.", "đề,",
  "gu", "vision.", "vision,",
  "thắng.", "thắng,",
  "outperform", "outperform.",
  "rẻ", "rẻ.",
  "muộn?", "muộn.",
  "tốt", "hơn", "hơn.", "hơn,",
]);
const isEmph = (w: string): boolean => EMPH.has(w);

const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let active: Sentence | null = null;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i + 1];
    const boundary = next ? next.start : s.end + 0.6;
    if (t >= s.start - 0.15 && t < boundary) {
      active = s;
      break;
    }
  }
  if (!active) return null;
  const LEAD = 0.1;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 160, pointerEvents: "none" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", maxWidth: 940, padding: "0 60px" }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [12, 0]);
          const blur = interpolate(sp, [0, 1], [4, 0]);
          const emph = isEmph(w.word);
          return (
            <span key={`${active.start}-${i}`} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontWeight: emph ? 800 : 600,
              fontSize: emph ? 62 : 52,
              color: emph ? GOLD : IVORY,
              textShadow: emph
                ? "0 0 26px rgba(229,165,59,0.55), 0 4px 14px rgba(0,0,0,0.95)"
                : "0 3px 12px rgba(0,0,0,0.95)",
              opacity: visible ? sp : 0,
              transform: `translateY(${y}px)`,
              filter: `blur(${blur}px)`,
              letterSpacing: emph ? "0.4px" : "0",
              lineHeight: 1.3,
            }}>{w.word}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Reusable skill card
const SkillCard: React.FC<{
  num: string;
  title: string;
  titleEn: string;
  body: string;
  emo: string;
  color: string;
  p: number;
}> = ({ num, title, titleEn, body, emo, color, p }) => {
  const op = interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const tx = interpolate(p, [0, 0.4], [-80, 0], { extrapolateRight: "clamp" });
  return (
    <g opacity={op} transform={`translate(${tx}, 0)`}>
      {/* Big number background */}
      <text x={W / 2} y={500} fontSize={420} fill={color} textAnchor="middle" dominantBaseline="middle"
        opacity={0.12} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{num}</text>

      {/* Number badge */}
      <g transform={`translate(${W / 2}, 380)`}>
        <circle cx={0} cy={0} r={70} fill={color} stroke={INK} strokeWidth={4} />
        <text x={0} y={20} fontSize={64} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{num}</text>
      </g>

      {/* Emo */}
      <text x={W / 2} y={620} fontSize={140} textAnchor="middle">{emo}</text>

      {/* Title VN big */}
      <text x={W / 2} y={780} fontSize={68} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{title}</text>

      {/* Title EN small */}
      <text x={W / 2} y={840} fontSize={32} fill={color} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.85}>{titleEn}</text>

      {/* Body card */}
      <g transform={`translate(${W / 2}, 1050)`}>
        <rect x={-440} y={-120} width={880} height={240} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={3.5} />
        <foreignObject x={-410} y={-100} width={820} height={200}>
          <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 30, fontWeight: 700, color: INK, lineHeight: 1.4, textAlign: "center" }}>
            {body}
          </div>
        </foreignObject>
      </g>
    </g>
  );
};

// =============== BEAT 1: HOOK ===============
const Beat1: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(1);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AI LÀM RẺ KỸ NĂNG</text>

      {/* Old skills "rẻ" */}
      <g transform={`translate(${W / 2}, 600)`}>
        {p > 0.5 && (
          <g opacity={interpolate(p, [0.5, 0.8], [0, 1], { extrapolateRight: "clamp" })}>
            <text x={0} y={0} fontSize={88} fill={INK} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.4}>nhiều kỹ năng</text>
            <text x={0} y={80} fontSize={64} fill={RED} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.55}>↓ rẻ hơn mỗi ngày ↓</text>
          </g>
        )}
      </g>

      {/* Reveal "5 KỸ NĂNG QUÝ HƠN" */}
      {p > 3 && (
        <g transform={`translate(${W / 2}, 1000)`} opacity={interpolate(p, [3, 3.5], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={-440} y={-130} width={880} height={260} rx={24} fill={ACCENT} stroke={INK} strokeWidth={5} />
          <text x={0} y={-25} fontSize={120} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>5 KỸ NĂNG</text>
          <text x={0} y={60} fontSize={48} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>QUÝ HƠN BAO GIỜ</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.2)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 2: SETUP ===============
const Beat2: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(2);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>QUY LUẬT MỚI</text>

      {/* AI handles repetitive */}
      <g transform={`translate(${W / 2}, 600)`}>
        <rect x={-440} y={-110} width={880} height={220} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={3.5} />
        <text x={-320} y={30} fontSize={100} textAnchor="middle">🤖</text>
        <text x={60} y={-30} fontSize={42} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>AI xử lý</text>
        <text x={60} y={20} fontSize={28} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>task lặp lại</text>
        <text x={60} y={60} fontSize={28} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>sản xuất hàng loạt</text>
      </g>

      {/* Arrow ↓ */}
      {p > 2.5 && (
        <text x={W / 2} y={870} fontSize={70} fill={ACCENT} textAnchor="middle"
          opacity={interpolate(p, [2.5, 2.8], [0, 1], { extrapolateRight: "clamp" })}>↓</text>
      )}

      {/* Value shifts */}
      {p > 3.2 && (
        <g transform={`translate(${W / 2}, 1100)`} opacity={interpolate(p, [3.2, 3.7], [0, 1], { extrapolateRight: "clamp" })}>
          <rect x={-440} y={-110} width={880} height={220} rx={20} fill={GOLD} stroke={INK} strokeWidth={4} />
          <text x={-320} y={30} fontSize={100} textAnchor="middle">💎</text>
          <text x={60} y={-20} fontSize={36} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>Giá trị shift sang</text>
          <text x={60} y={40} fontSize={30} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>thứ máy KHÓ thay</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.2)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};

// =============== BEAT 3-7: 5 SKILLS ===============
const Beat3: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(3);
  return (
    <g>
      <SkillCard num="1" title="GIẢI QUYẾT VẤN ĐỀ" titleEn="Problem Solving" emo="🎯" color={ACCENT}
        body="Người biết XÁC ĐỊNH ĐÚNG vấn đề luôn giá trị hơn người chỉ biết làm task."
        p={t - a} />
      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.1)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};
const Beat4: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(4);
  return (
    <g>
      <SkillCard num="2" title="GIAO TIẾP" titleEn="Communication" emo="💬" color={BLUE}
        body="Thuyết phục · trình bày · đàm phán · truyền đạt ý tưởng — vẫn là LỢI THẾ LỚN."
        p={t - a} />
      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.1)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};
const Beat5: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(5);
  return (
    <g>
      <SkillCard num="3" title="SÁNG TẠO & GU" titleEn="Creativity / Taste" emo="🎨" color={GOLD}
        body="AI tạo nhiều output. Người có GU, có VISION, biết CHỌN cái đúng — sẽ thắng."
        p={t - a} />
      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.1)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};
const Beat6: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(6);
  return (
    <g>
      <SkillCard num="4" title="TƯ DUY CHIẾN LƯỢC" titleEn="Strategic Thinking" emo="🧭" color={GREEN}
        body="AI giúp execution nhanh. Nhưng QUYẾT ĐỊNH NÊN LÀM GÌ — vẫn là game của người."
        p={t - a} />
      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.1)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};
const Beat7: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(7);
  return (
    <g>
      <SkillCard num="5" title="TẬN DỤNG AI" titleEn="AI Leverage" emo="⚡" color={ACCENT}
        body="Người biết DÙNG AI để tăng năng suất sẽ OUTPERFORM phần còn lại."
        p={t - a} />
      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.1)`}>
        <Teacher mouthOpen={mo} thumbs />
      </g>
    </g>
  );
};

// =============== BEAT 8: TWIST ===============
const Beat8: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(8);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TƯƠNG LAI GẦN</text>

      {/* "Làm nhiều" cross */}
      <g transform={`translate(${W / 2}, 530)`}>
        <text x={0} y={0} fontSize={60} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} opacity={0.4}>làm nhiều hơn</text>
        {p > 1.5 && (
          <line x1={-260} y1={0} x2={260} y2={0} stroke={RED} strokeWidth={8} strokeLinecap="round"
            opacity={interpolate(p, [1.5, 1.8], [0, 1], { extrapolateRight: "clamp" })} />
        )}
      </g>

      {/* MÀ LÀ */}
      {p > 2.5 && (
        <text x={W / 2} y={680} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}
          opacity={interpolate(p, [2.5, 2.8], [0, 1], { extrapolateRight: "clamp" })}>↓ MÀ LÀ ↓</text>
      )}

      {/* 3 NEW values */}
      <g transform={`translate(${W / 2}, 870)`}>
        {[
          { label: "NGHĨ TỐT HƠN", at: 3.5, color: ACCENT },
          { label: "QUYẾT ĐỊNH TỐT HƠN", at: 4.7, color: GOLD },
          { label: "LEVERAGE TỐT HƠN", at: 5.9, color: GREEN },
        ].map((it, i) => {
          const visible = p >= it.at;
          const opi = visible ? interpolate(p, [it.at, it.at + 0.4], [0, 1], { extrapolateRight: "clamp" }) : 0;
          const tx = visible ? interpolate(p, [it.at, it.at + 0.4], [-100, 0], { extrapolateRight: "clamp" }) : -100;
          return (
            <g key={i} transform={`translate(${tx}, ${i * 130})`} opacity={opi}>
              <rect x={-380} y={-50} width={760} height={100} rx={50} fill={it.color} stroke={INK} strokeWidth={3.5} />
              <text x={0} y={20} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{it.label}</text>
            </g>
          );
        })}
      </g>

      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.2)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 9: CLOSING ===============
const Beat9: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(9);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  return (
    <g opacity={op}>
      <text x={W / 2} y={400} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700} opacity={0.7}>AI không chỉ thay đổi công việc</text>

      {p > 1.5 && (
        <g transform={`translate(${W / 2}, 800)`} opacity={interpolate(p, [1.5, 2.0], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={42} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Nó đang thay đổi định nghĩa</text>
          <text x={0} y={130} fontSize={130} fill={ACCENT} textAnchor="middle" fontFamily="'EB Garamond', serif" fontStyle="italic" fontWeight={700}
            style={{ filter: "drop-shadow(0 8px 20px rgba(232,88,56,0.4))" }}>"GIÁ TRỊ CAO"</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.2)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// =============== BEAT 10: CTA — vote 5 skills ===============
const Beat10: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(10);
  const p = Math.max(0, t - a);
  const op = interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const skills = [
    { num: "1", label: "Problem Solving", color: ACCENT },
    { num: "2", label: "Communication", color: BLUE },
    { num: "3", label: "Creativity", color: GOLD },
    { num: "4", label: "Strategic", color: GREEN },
    { num: "5", label: "AI Leverage", color: ACCENT },
  ];
  return (
    <g opacity={op}>
      <text x={W / 2} y={300} fontSize={42} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BẠN MẠNH NHẤT Ở SỐ MẤY?</text>

      {/* 5 skill bubbles */}
      <g transform={`translate(0, 600)`}>
        {skills.map((s, i) => {
          const at = 0.3 + i * 0.25;
          const visible = p >= at;
          const opi = visible ? interpolate(p, [at, at + 0.3], [0, 1], { extrapolateRight: "clamp" }) : 0;
          const sc = visible ? interpolate(p, [at, at + 0.3], [0.7, 1], { extrapolateRight: "clamp" }) : 0.7;
          return (
            <g key={i} transform={`translate(${W / 2}, ${i * 140}) scale(${sc})`} opacity={opi}>
              <rect x={-380} y={-55} width={760} height={110} rx={55} fill="#FAFAF5" stroke={INK} strokeWidth={3.5} />
              <circle cx={-310} cy={0} r={42} fill={s.color} stroke={INK} strokeWidth={3} />
              <text x={-310} y={16} fontSize={42} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{s.num}</text>
              <text x={-220} y={15} fontSize={34} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>{s.label}</text>
            </g>
          );
        })}
      </g>

      {/* Comment bait */}
      {p > 2 && (
        <g transform={`translate(${W / 2}, 1380)`} opacity={interpolate(p, [2, 2.5], [0, 1], { extrapolateRight: "clamp" })}>
          <text x={0} y={0} fontSize={36} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>💬 Comment số bạn mạnh nhất</text>
          <text x={0} y={60} fontSize={28} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>+ số bạn cần học gấp</text>
        </g>
      )}

      <g transform={`translate(${W / 2 + 320}, 1700) scale(1.2)`}>
        <Teacher mouthOpen={mo} waving />
      </g>
    </g>
  );
};

// =============== Main ===============
export const Skill5AI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const mo = mouthOpenAt(t);

  const [, e1] = B(1);
  const [, e2] = B(2);
  const [, e3] = B(3);
  const [, e4] = B(4);
  const [, e5] = B(5);
  const [, e6] = B(6);
  const [, e7] = B(7);
  const [, e8] = B(8);
  const [, e9] = B(9);
  const b10 = B(10);

  return (
    <AbsoluteFill>
      <Audio src={staticFile("skill5_voice.mp3")} />
      <Bg />

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {t < e1 && <Beat1 t={t} mo={mo} />}
        {t >= B(2)[0] && t < e2 && <Beat2 t={t} mo={mo} />}
        {t >= B(3)[0] && t < e3 && <Beat3 t={t} mo={mo} />}
        {t >= B(4)[0] && t < e4 && <Beat4 t={t} mo={mo} />}
        {t >= B(5)[0] && t < e5 && <Beat5 t={t} mo={mo} />}
        {t >= B(6)[0] && t < e6 && <Beat6 t={t} mo={mo} />}
        {t >= B(7)[0] && t < e7 && <Beat7 t={t} mo={mo} />}
        {t >= B(8)[0] && t < e8 && <Beat8 t={t} mo={mo} />}
        {t >= B(9)[0] && t < e9 && <Beat9 t={t} mo={mo} />}
        {t >= B(10)[0] && t < b10[1] && <Beat10 t={t} mo={mo} />}
      </svg>

      <Caption />
    </AbsoluteFill>
  );
};

export const skill5Duration = totalDuration;
