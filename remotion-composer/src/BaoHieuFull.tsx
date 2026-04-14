import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import wordsData from "./bao_hieu_words.json";

loadEBGaramond("normal", { weights: ["500","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["500","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const IVORY = "#F5F5F0";
const EMPHASIS = "#F4B860";
const LEAD_OFFSET = 0.12;

type Word = { word: string; start: number; end: number };
const words = (wordsData as Word[]).map(w => ({ ...w, start: Math.max(0, w.start - LEAD_OFFSET), end: Math.max(0, w.end - LEAD_OFFSET) }));

// Emphasis words for yellow accent
const EMPHASIZE = new Set([
  "đứa", "trẻ", "cần", "quên", "chậm", "hỏi", "giày", "đũa", "than",
  "gọi", "ngồi", "ngày", "giọng", "nói", "hiếu", "BÁO", "HIẾU",
]);

const BEATS = [
  { start: 0.00, end: 9.22,  clip: "bh_old_parent_alone.mp4",       zoom: 1.02 },
  { start: 9.22, end: 19.28, clip: "bh_walking_slow_elderly.mp4",   zoom: 1.04 },
  { start: 19.28, end: 26.88, clip: "bh_old_hands_tea.mp4",         zoom: 1.03 },
  { start: 26.88, end: 30.24, clip: "bh_elderly_hands.mp4",         zoom: 1.06 },
  { start: 30.24, end: 39.36, clip: "bh_father_son_kid.mp4",        zoom: 1.03 },
  { start: 39.36, end: 43.66, clip: "bh_mother_sewing.mp4",         zoom: 1.04 },
  { start: 43.66, end: 52.52, clip: "bh_family_dinner_together.mp4", zoom: 1.03 },
  { start: 52.52, end: 57.06, clip: "bh_son_hugging_mom.mp4",       zoom: 1.05 },
  { start: 57.06, end: 62.0,  clip: "bh_parent_old_photo.mp4",      zoom: 1.04 },
];

// Group words into sentences for caption display
type Sentence = { start: number; end: number; words: Word[] };
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

const CutLayer: React.FC<{ beatIdx: number }> = ({ beatIdx }) => {
  const localF = useCurrentFrame();
  const b = BEATS[beatIdx];
  const dur = Math.round((b.end - b.start) * FPS);

  const scale = interpolate(localF, [0, dur], [1.02, b.zoom], { extrapolateRight: "clamp" });
  const fadeIn = interpolate(localF, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(localF, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <OffthreadVideo
        src={staticFile(b.clip)}
        volume={0}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          transformOrigin: "center",
          filter: "brightness(0.4) saturate(0.65) contrast(1.08)",
        }}
      />
    </AbsoluteFill>
  );
};

const Overlay: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
    <defs>
      <radialGradient id="bhVig" cx="50%" cy="50%" r="75%">
        <stop offset="22%" stopColor="#000" stopOpacity="0" />
        <stop offset="82%" stopColor="#000" stopOpacity="0.75" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#bhVig)" />
  </svg>
);

const Caption: React.FC<{ hide: boolean }> = ({ hide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  let active: Sentence | null = null;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i + 1];
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
          const sp = spring({ frame: frame - appearAt * fps, fps, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [12, 0]);
          const blur = interpolate(sp, [0, 1], [4, 0]);
          const cleanW = w.word.replace(/[.,!?]/g, "").toLowerCase();
          const emph = Array.from(EMPHASIZE).some(e => cleanW === e.toLowerCase());
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontWeight: emph ? 800 : 600,
              fontSize: emph ? 64 : 54,
              color: emph ? EMPHASIS : IVORY,
              textShadow: emph
                ? "0 0 26px rgba(244,184,96,0.55), 0 4px 14px rgba(0,0,0,0.95)"
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

const BIG_START = 57.06;
const BIG_END = 62.0;

const BigWord: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sf = BIG_START * fps;
  const ef = BIG_END * fps;
  if (frame < sf - 4) return null;
  const sp = spring({ frame: frame - sf, fps, config: { damping: 12, stiffness: 80, mass: 1.5 } });
  const fadeOut = interpolate(frame, [ef - 20, ef], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = sp * fadeOut;
  const scale = interpolate(sp, [0, 1], [1.8, 1.0]);
  const blur = interpolate(sp, [0, 1], [16, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity, background: "rgba(10,8,6,0.72)" }}>
      <div style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)`, textAlign: "center" }}>
        <div style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontWeight: 500,
          fontSize: 260,
          color: EMPHASIS,
          letterSpacing: "18px",
          textShadow: "0 0 60px rgba(244,184,96,0.45), 0 0 180px rgba(244,184,96,0.3), 0 10px 30px rgba(0,0,0,0.95)",
          lineHeight: 1,
        }}>BÁO HIẾU</div>
        <div style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 44,
          color: IVORY,
          letterSpacing: "3px",
          marginTop: 40,
          opacity: 0.9,
        }}>— khi còn có thể</div>
      </div>
    </AbsoluteFill>
  );
};

export const BaoHieuFull: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const bigActive = t >= 57.06;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("bh_voice.mp3")} volume={0.78} />
      <Audio src={staticFile("bh_music.mp3")} volume={0.09} />

      {BEATS.map((_, i) => {
        const b = BEATS[i];
        const startF = Math.round(b.start * FPS);
        const durF = Math.round((b.end - b.start) * FPS);
        return (
          <Sequence key={i} from={startF} durationInFrames={durF}>
            <CutLayer beatIdx={i} />
          </Sequence>
        );
      })}

      <Overlay />
      <Caption hide={bigActive} />
      <BigWord />
    </AbsoluteFill>
  );
};
