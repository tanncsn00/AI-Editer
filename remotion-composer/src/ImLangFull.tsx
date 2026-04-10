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
import wordsData from "./im_lang_words.json";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// "IM" · Tập 4 — Harsh register · Core env: lone man at night city
// Duration: 147s · Voice: ductrong 0.9x (142s narration + 5s outro)
// Emphasis color: #C0CCD4 steel blue-white (cold, clinical)

const FPS = 30;
const EMPHASIS = "#C0CCD4";
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
  "nhiều.", "nhiều,", "mảnh", "đó.",
  "máu.", "không", "chia", "sẻ.", "nói.",
  "quay", "đi.", "chết", "thù", "hận.", "hơn", "mình.", "nhất.",
  "chặn", "chê", "bai", "xấu.", "so", "sánh.",
  "kiên", "nhẫn", "tàn", "nhẫn.", "im.", "toan", "tính,", "phản", "bội.",
  "giả", "tạo.", "sinh", "tồn.", "áo", "giáp,", "trưởng", "thành,",
  "cánh", "cửa.", "lấy", "đi", "biết.", "trả", "lời.",
]);
const isEmph = (w: string): boolean => EMPH.has(w.toLowerCase());

const BIG_START = 143.0;
const BIG_END = 147.0;

type Cut = { src: string; start: number; end: number; sf?: number; st?: number };
// ALL clips from lone-man-night-city environment — continuous bg
const CUTS: Cut[] = [
  // HOOK 0-17.78
  { src: "im_lang/lone_man_window_night.mp4", start: 0.0, end: 6.2, sf: 1.02, st: 1.10 },
  { src: "im_lang/man_reflection_window_night.mp4", start: 6.2, end: 12.0, sf: 1.04, st: 1.12 },
  { src: "im_lang/staring_out_window_night.mp4", start: 12.0, end: 17.8, sf: 1.02, st: 1.10 },
  // FIRST RULE 17.78-37.16
  { src: "im_lang/man_back_dark_room.mp4", start: 17.8, end: 24.5, sf: 1.03, st: 1.12 },
  { src: "im_lang/dark_apartment_man.mp4", start: 24.5, end: 31.0, sf: 1.02, st: 1.10 },
  { src: "im_lang/lamppost_night_fog.mp4", start: 31.0, end: 37.2, sf: 1.04, st: 1.14 },
  // UGLINESS 37.16-56.98
  { src: "im_lang/empty_street_night_neon.mp4", start: 37.2, end: 43.8, sf: 1.02, st: 1.10 },
  { src: "im_lang/lone_walker_night_street.mp4", start: 43.8, end: 50.5, sf: 1.03, st: 1.12 },
  { src: "im_lang/back_silhouette_neon.mp4", start: 50.5, end: 57.0, sf: 1.04, st: 1.14 },
  // NAMES 56.98-75.88
  { src: "im_lang/city_lights_night_alone.mp4", start: 57.0, end: 63.5, sf: 1.02, st: 1.10 },
  { src: "im_lang/night_city_rooftop_solo.mp4", start: 63.5, end: 69.8, sf: 1.04, st: 1.14 },
  { src: "im_lang/alone_bench_night_city.mp4", start: 69.8, end: 75.9, sf: 1.02, st: 1.10 },
  // DISCIPLINE 75.88-97.52
  { src: "im_lang/walking_alone_rainy_night.mp4", start: 75.9, end: 83.0, sf: 1.02, st: 1.10 },
  { src: "im_lang/rain_street_night_lonely.mp4", start: 83.0, end: 90.5, sf: 1.03, st: 1.12 },
  { src: "im_lang/dark_corridor_man.mp4", start: 90.5, end: 97.5, sf: 1.04, st: 1.14 },
  // TWO FACES 97.52-117.24
  { src: "im_lang/dark_stairs_man_night.mp4", start: 97.5, end: 107.5, sf: 1.02, st: 1.12 },
  { src: "im_lang/rain_window_night.mp4", start: 107.5, end: 117.3, sf: 1.03, st: 1.14 },
  // LANDING 117.24-147
  { src: "im_lang/cigarette_night_alone.mp4", start: 117.3, end: 132.0, sf: 1.04, st: 1.16 },
  { src: "im_lang/walking_away_night.mp4", start: 132.0, end: 147.0, sf: 1.02, st: 1.14 },
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
              textShadow: emph ? "0 0 26px rgba(192,204,212,0.6), 0 4px 14px rgba(0,0,0,0.95)" : "0 3px 12px rgba(0,0,0,0.95)",
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
      <div style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)` }}>
        <div style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontWeight: 500,
          fontSize: 440,
          color: BODY,
          letterSpacing: "22px",
          textShadow: "0 0 60px rgba(255,255,255,0.3), 0 0 180px rgba(192,204,212,0.4), 0 10px 30px rgba(0,0,0,0.95)",
          lineHeight: 1,
          textAlign: "center",
        }}>IM.</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: 28,
          color: "#B8C0C8",
          letterSpacing: "5px",
          textAlign: "center",
          marginTop: 38,
          textTransform: "uppercase",
          textShadow: "0 2px 10px rgba(0,0,0,0.95)",
        }}>kiên nhẫn công cộng · tàn nhẫn riêng tư</div>
      </div>
    </AbsoluteFill>
  );
};

export const ImLangFull: React.FC = () => {
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
      <Audio src={staticFile("im_lang_voice.mp3")} volume={0.8} />
      <Audio src={staticFile("bay_cuu_music.mp3")} volume={0.08} />
    </AbsoluteFill>
  );
};
