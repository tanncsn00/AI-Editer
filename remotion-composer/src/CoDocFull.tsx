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
import wordsData from "./co_doc_words.json";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// "CÔ ĐỘC" · Tịnh Đạo Tập 5
// Duration: 146s · Voice: ductrong 0.9x (140.4s narration + 5s outro)
// Emphasis: #B8A890 warm beige muted — ấm hơn IM nhưng vẫn chiêm nghiệm
// Env: lone urban night + quiet interiors (bg continuity rule)

const FPS = 30;
const EMPHASIS = "#D4C0A4";
const BODY = "#F1ECE2";

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
  "trưởng", "thành,", "ít?", "đổi.",
  "tiệc", "tàn.", "đông.", "bạn.", "hạnh", "phúc.",
  "biến", "mất", "ngừng", "gọi.", "tưởng.",
  "cái", "lọc", "đang", "sáng,", "đêm", "tối", "nhất", "việc",
  "sống", "thật", "không", "còn", "đúng", "trống", "rỗng.",
  "nhà", "sớm", "tắt", "điện", "thoại", "chính", "mình.",
  "mỏng", "thưa", "tĩnh", "lặng", "cô", "độc", "hình", "phạt.", "phần", "thưởng.",
  "nhỏ,", "đủ.", "thật", "xã", "giao.", "đỉnh.",
  "rời", "xa", "thương", "yêu", "buông", "lòng", "rộng", "nhìn", "rõ",
  "thất", "bại", "dấu", "hiệu", "tâm", "hồn", "lớn.",
]);
const isEmph = (w: string): boolean => EMPH.has(w.toLowerCase());

const BIG_START = 141.5;
const BIG_END = 146.0;

type Cut = { src: string; start: number; end: number; sf?: number; st?: number };
// All clips: lone urban night + quiet interior — bg continuity
const CUTS: Cut[] = [
  // HOOK 0-9.52
  { src: "co_doc/clip_01_7252264.mp4", start: 0.0,   end: 5.0,   sf: 1.02, st: 1.10 },
  { src: "co_doc/clip_02_19157961.mp4", start: 5.0,  end: 10.7,  sf: 1.03, st: 1.12 },
  // CROWD ILLUSION 10.68-26.08
  { src: "co_doc/clip_09_5847848.mp4",  start: 10.7, end: 17.5,  sf: 1.02, st: 1.10 },
  { src: "co_doc/clip_06_7255747.mp4",  start: 17.5, end: 26.1,  sf: 1.04, st: 1.14 },
  // SILENT VANISH 26.08-40.64
  { src: "co_doc/clip_10_6611940.mp4",  start: 26.1, end: 33.0,  sf: 1.02, st: 1.10 },
  { src: "co_doc/clip_04_15019286.mp4", start: 33.0, end: 41.9,  sf: 1.03, st: 1.12 },
  // FILTER 41.92-56.70
  { src: "co_doc/clip_12_36417696.mp4", start: 41.9, end: 49.0,  sf: 1.02, st: 1.10 },
  { src: "co_doc/clip_08_17556266.mp4", start: 49.0, end: 57.9,  sf: 1.04, st: 1.14 },
  // INNER VOICE 57.86-71.90
  { src: "co_doc/clip_05_8860241.mp4",  start: 57.9, end: 65.0,  sf: 1.02, st: 1.10 },
  { src: "co_doc/clip_11_8087768.mp4",  start: 65.0, end: 73.2,  sf: 1.03, st: 1.12 },
  // RETURN HOME 73.16-86.92
  { src: "co_doc/clip_07_32903664.mp4", start: 73.2, end: 80.0,  sf: 1.02, st: 1.10 },
  { src: "co_doc/clip_14_30734889.mp4", start: 80.0, end: 88.1,  sf: 1.04, st: 1.14 },
  // QUIET 88.10-103.34
  { src: "co_doc/clip_15_7856541.mp4",  start: 88.1, end: 96.0,  sf: 1.02, st: 1.10 },
  { src: "co_doc/clip_11_8087768.mp4",  start: 96.0, end: 104.6, sf: 1.03, st: 1.12 },
  // REFRAME 104.64-120.26
  { src: "co_doc/clip_13_30499131.mp4", start: 104.6, end: 112.0, sf: 1.02, st: 1.10 },
  { src: "co_doc/clip_02_19157961.mp4", start: 112.0, end: 120.4, sf: 1.04, st: 1.14 },
  // LANDING 120.44-133.04
  { src: "co_doc/clip_14_30734889.mp4", start: 120.4, end: 127.5, sf: 1.02, st: 1.10 },
  { src: "co_doc/clip_05_8860241.mp4",  start: 127.5, end: 134.0, sf: 1.03, st: 1.12 },
  // FINAL 133.98-139.68 + outro
  { src: "co_doc/clip_15_7856541.mp4",  start: 134.0, end: 146.0, sf: 1.02, st: 1.14 },
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
      <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, filter: "brightness(0.42) saturate(0.68) contrast(1.12)" }}>
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
  const LEAD = 0.12;
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
              fontSize: emph ? 62 : 52,
              color: emph ? EMPHASIS : BODY,
              textShadow: emph ? "0 0 26px rgba(212,192,164,0.6), 0 4px 14px rgba(0,0,0,0.95)" : "0 3px 12px rgba(0,0,0,0.95)",
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
  const fadeOut = interpolate(frame, [ef - 22, ef], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = sp * fadeOut;
  const scale = interpolate(sp, [0, 1], [1.8, 1.0]);
  const blur = interpolate(sp, [0, 1], [16, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)`, textAlign: "center" }}>
        <div style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontWeight: 500,
          fontSize: 380,
          color: BODY,
          letterSpacing: "18px",
          textShadow: "0 0 60px rgba(212,192,164,0.4), 0 0 180px rgba(212,192,164,0.3), 0 10px 30px rgba(0,0,0,0.95)",
          lineHeight: 1,
        }}>CÔ ĐỘC</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
          fontWeight: 300,
          fontSize: 28,
          color: "#C8B89A",
          letterSpacing: "5px",
          textAlign: "center",
          marginTop: 42,
          textTransform: "uppercase",
          textShadow: "0 2px 10px rgba(0,0,0,0.95)",
        }}>không phải thất bại · là trưởng thành</div>
      </div>
    </AbsoluteFill>
  );
};

export const CoDocFull: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const globalOpacity = interpolate(frame, [0, 14, durationInFrames - 14, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bigActive = t >= BIG_START && t <= BIG_END;
  return (
    <AbsoluteFill style={{ backgroundColor: "#06080C", opacity: globalOpacity }}>
      {CUTS.map((c, i) => <CutLayer key={i} cut={c} />)}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 22%, rgba(0,0,0,0.88) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.75) 100%)" }} />
      <Caption hide={bigActive} />
      <BigWord />
      <Audio src={staticFile("co_doc_voice.mp3")} volume={0.8} />
      <Audio src={staticFile("bay_cuu_music.mp3")} volume={0.08} />
    </AbsoluteFill>
  );
};
