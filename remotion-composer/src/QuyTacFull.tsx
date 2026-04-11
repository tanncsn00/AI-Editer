import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import wordsData from "./quy_tac_words.json";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// "QUY TẮC XÃ HỘI" — Tịnh Đạo · harsh truth-teller register
// Voice: ductrong 0.87x (142.19s narration + 5s outro)
// Core env: lone man in night city / empty neon streets
// Emphasis color: #B0BCC8 cool steel (slightly shifted from IM #C0CCD4)

const FPS = 30;
const EMPHASIS = "#B0BCC8";
const BODY = "#EEEEEA";

type Word = { word: string; start: number; end: number };
const words = wordsData as Word[];

type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  for (const w of words) {
    buf.push(w);
    if (/[.!?]$/.test(w.word)) {
      out.push({ words: buf, start: buf[0].start, end: buf[buf.length-1].end });
      buf = [];
    }
  }
  if (buf.length) out.push({ words: buf, start: buf[0].start, end: buf[buf.length-1].end });
  return out;
})();

const EMPH = new Set<string>([
  // hook
  "luật", "ngầm", "dạy", "bạn.", "ai.", "chân.", "ai.",
  // rule 1 — explain
  "nhất.", "giải", "thích", "hỏi.", "sơ", "hở.", "đạn", "khác.",
  // rule 2 — praise
  "hai.", "khen", "phản", "bội", "nhất.", "toán,", "đòn.",
  // rule 3 — kindness
  "ba.", "giới", "hạn,", "nghĩa", "vụ.", "quen.", "phản", "bội.",
  // rule 4 — real
  "bốn.", "thấp", "kém,", "thật.", "tử", "tế.", "đầu", "tư.",
  // rule 5 — silence
  "năm.", "im", "lặng.", "đẳng", "cấp.", "hiểu.", "sai.", "bóp", "méo",
  // rule 6 — need
  "sáu.", "cần", "hơn,", "thua.", "mất", "nào.",
  // rule 7 — plans
  "bảy.", "kế", "hoạch.", "đốt", "năng", "lượng", "im", "lặng.", "cản.",
  // rule 8 — owe
  "cùng.", "nợ", "gì.", "thua.", "Trưởng", "thành", "chờ", "đợi,", "trả", "giá",
  // landing
  "tàn", "nhẫn.", "sống", "sót.", "lạnh.", "run.",
]);
const isEmph = (w: string): boolean => EMPH.has(w.toLowerCase()) || EMPH.has(w);

const BIG_START = 143.0;
const BIG_END = 147.0;

type Cut = { src: string; start: number; end: number; sf?: number; st?: number };
// All clips: night city / lone man / neon street universe
const CUTS: Cut[] = [
  // HOOK 0-11.56
  { src: "quy_tac/01_hook_neon_street.mp4", start: 0.0, end: 4.5, sf: 1.02, st: 1.10 },
  { src: "quy_tac/02_hook_back_walker.mp4", start: 4.5, end: 8.3, sf: 1.03, st: 1.12 },
  { src: "quy_tac/03_hook_rain_neon.mp4", start: 8.3, end: 12.8, sf: 1.04, st: 1.14 },
  // RULE 1 — explain 12.74-27.76
  { src: "quy_tac/04_rule1_alley_night.mp4", start: 12.8, end: 20.5, sf: 1.02, st: 1.10 },
  { src: "quy_tac/06_rule3_street_lamp_night.mp4", start: 20.5, end: 28.0, sf: 1.03, st: 1.12 },
  // RULE 2 — praise 28.78-41.30
  { src: "quy_tac/05_rule2_bar_neon_night.mp4", start: 28.0, end: 35.0, sf: 1.02, st: 1.10 },
  { src: "quy_tac/13_land_cigarette_neon.mp4", start: 35.0, end: 42.0, sf: 1.04, st: 1.14 },
  // RULE 3 — kindness 42.36-55.84
  { src: "quy_tac/07_rule4_subway_night_man.mp4", start: 42.0, end: 49.5, sf: 1.02, st: 1.10 },
  { src: "quy_tac/10_rule7_crosswalk_night.mp4", start: 49.5, end: 56.5, sf: 1.03, st: 1.12 },
  // RULE 4 — real 56.84-69.04
  { src: "quy_tac/08_rule5_silence_back_window.mp4", start: 56.5, end: 63.2, sf: 1.02, st: 1.10 },
  { src: "quy_tac/14_land_taxi_lights_night.mp4", start: 63.2, end: 69.8, sf: 1.04, st: 1.14 },
  // RULE 5 — silence 70.28-85.22
  { src: "quy_tac/11_rule8_rooftop_night.mp4", start: 69.8, end: 77.5, sf: 1.02, st: 1.10 },
  { src: "quy_tac/09_rule6_bridge_night_alone.mp4", start: 77.5, end: 86.0, sf: 1.03, st: 1.12 },
  // RULE 6 — need 86.42-98.02
  { src: "quy_tac/15_land_city_lights_far.mp4", start: 86.0, end: 93.0, sf: 1.02, st: 1.10 },
  { src: "quy_tac/01_hook_neon_street.mp4", start: 93.0, end: 99.0, sf: 1.04, st: 1.12, },
  // RULE 7 — plans 99.18-112.46
  { src: "quy_tac/03_hook_rain_neon.mp4", start: 99.0, end: 106.0, sf: 1.03, st: 1.12 },
  { src: "quy_tac/04_rule1_alley_night.mp4", start: 106.0, end: 113.0, sf: 1.02, st: 1.10 },
  // RULE 8 — owe 113.42-127.22
  { src: "quy_tac/09_rule6_bridge_night_alone.mp4", start: 113.0, end: 120.5, sf: 1.03, st: 1.12 },
  { src: "quy_tac/11_rule8_rooftop_night.mp4", start: 120.5, end: 128.0, sf: 1.04, st: 1.14 },
  // LANDING 128.32-141.46 + outro
  { src: "quy_tac/12_land_walking_away.mp4", start: 128.0, end: 138.0, sf: 1.02, st: 1.12 },
  { src: "quy_tac/14_land_taxi_lights_night.mp4", start: 138.0, end: 147.2, sf: 1.03, st: 1.14 },
];

const CutLayer: React.FC<{ cut: Cut }> = ({ cut }) => {
  const frame = useCurrentFrame();
  const sf = cut.start * FPS;
  const ef = cut.end * FPS;
  const fade = 10;
  const opacity = interpolate(frame, [sf - fade, sf + fade, ef - fade, ef + fade], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (opacity <= 0) return null;
  const scale = interpolate(frame - sf, [0, ef - sf], [cut.sf ?? 1.02, cut.st ?? 1.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, filter: "brightness(0.36) saturate(0.5) contrast(1.14)" }}>
        <OffthreadVideo src={staticFile(cut.src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ hide: boolean }> = ({ hide }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let active: Sentence | null = null;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i+1];
    const boundary = next ? next.start : s.end + 0.7;
    if (t >= s.start - 0.15 && t < boundary) { active = s; break; }
  }
  if (!active || hide) return null;
  const LEAD = 0.1;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", maxWidth: 920, padding: "0 60px" }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [12, 0]);
          const blur = interpolate(sp, [0, 1], [4, 0]);
          const emph = isEmph(w.word);
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontWeight: emph ? 800 : 600,
              fontSize: emph ? 64 : 54,
              color: emph ? EMPHASIS : BODY,
              textShadow: emph ? "0 0 26px rgba(176,188,200,0.6), 0 4px 14px rgba(0,0,0,0.95)" : "0 3px 12px rgba(0,0,0,0.95)",
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

const BigWord: React.FC = () => {
  const frame = useCurrentFrame();
  const sf = BIG_START * FPS;
  const ef = BIG_END * FPS;
  if (frame < sf - 4) return null;
  const sp = spring({ frame: frame - sf, fps: FPS, config: { damping: 12, stiffness: 80, mass: 1.5 } });
  const fadeOut = interpolate(frame, [ef - 20, ef], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = sp * fadeOut;
  const scale = interpolate(sp, [0, 1], [1.8, 1.0]);
  const blur = interpolate(sp, [0, 1], [16, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)`, textAlign: "center" }}>
        <div style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontWeight: 500,
          fontSize: 260,
          color: BODY,
          letterSpacing: "14px",
          textShadow: "0 0 60px rgba(255,255,255,0.3), 0 0 180px rgba(176,188,200,0.4), 0 10px 30px rgba(0,0,0,0.95)",
          lineHeight: 0.95,
          textAlign: "center",
        }}>LUẬT</div>
        <div style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontWeight: 500,
          fontSize: 260,
          color: BODY,
          letterSpacing: "14px",
          textShadow: "0 0 60px rgba(255,255,255,0.3), 0 0 180px rgba(176,188,200,0.4), 0 10px 30px rgba(0,0,0,0.95)",
          lineHeight: 0.95,
          textAlign: "center",
          marginTop: 18,
        }}>NGẦM</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: 26,
          color: "#B8C0C8",
          letterSpacing: "5px",
          textAlign: "center",
          marginTop: 42,
          textTransform: "uppercase",
          textShadow: "0 2px 10px rgba(0,0,0,0.95)",
        }}>biết, để bước đi không run</div>
      </div>
    </AbsoluteFill>
  );
};

export const QuyTacFull: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const globalOpacity = interpolate(frame, [0, 14, durationInFrames - 14, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bigActive = t >= BIG_START && t <= BIG_END;
  return (
    <AbsoluteFill style={{ backgroundColor: "#03060A", opacity: globalOpacity }}>
      {CUTS.map((c, i) => <CutLayer key={i} cut={c} />)}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 22%, rgba(0,0,0,0.88) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.75) 100%)" }} />
      <Caption hide={bigActive} />
      <BigWord />
      <Audio src={staticFile("quy_tac_voice.mp3")} volume={0.8} />
      <Audio src={staticFile("quy_tac_music.mp3")} volume={0.08} />
    </AbsoluteFill>
  );
};
