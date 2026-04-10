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
import wordsData from "./gia_toc_words.json";

loadEBGaramond("normal", {
  weights: ["400", "500", "600"],
  subsets: ["vietnamese", "latin", "latin-ext"],
});
loadBeVietnamPro("normal", {
  weights: ["300", "400", "600", "700", "800"],
  subsets: ["vietnamese", "latin", "latin-ext"],
});

// "NGƯỜI ĐƯỢC CHỌN" · Tập 3 — Gia tộc
// Duration: 114s · Voice: ductrong 0.9x (109s narration + 5s outro)
// Emphasis color: #D4A574 warm gold (destiny/dawn)

const FPS = 30;
const EMPHASIS_COLOR = "#D4A574";
const BODY_COLOR = "#F5F0E4";

type Word = { word: string; start: number; end: number };
const words = wordsData as Word[];

type Sentence = { words: Word[]; start: number; end: number };
const buildSentences = (): Sentence[] => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  for (const w of words) {
    buf.push(w);
    if (/[.!?]$/.test(w.word)) {
      out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
      buf = [];
    }
  }
  if (buf.length) out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
  return out;
};
const SENTENCES = buildSentences();

const EMPHASIS_WORDS = new Set<string>([
  "chọn.", "chọn,", "khác.", "khác,",
  "than.", "kể.", "người.", "người,",
  "khe", "hở.", "hở,", "hở", "duy", "nhất,", "nhất.",
  "bạn.", "bạn,",
  "gánh.", "gánh,", "bứt", "phá,", "gục", "ngã,",
  "phụ", "lòng", "trách.", "chờ.",
  "mạnh", "mẽ.", "mẽ,",
  "đến", "lượt", "đứng", "lên.", "lên,",
  "dòng", "máu",
]);
const isEmphasis = (w: string): boolean => {
  const clean = w.toLowerCase();
  return EMPHASIS_WORDS.has(clean);
};

const BIG_WORD_START = 110.0;
const BIG_WORD_END = 114.0;

// Background cuts — gia tộc / destiny imagery
type Cut = { src: string; start: number; end: number; sf?: number; st?: number };
const CUTS: Cut[] = [
  // HOOK 0-9.8s — temple / chosen one reveal
  { src: "gia_toc/hook_mountain_dawn.mp4", start: 0.0, end: 3.5, sf: 1.04, st: 1.12 },
  { src: "gia_toc/hook_temple_incense.mp4", start: 3.5, end: 6.8, sf: 1.02, st: 1.10 },
  { src: "gia_toc/hook_old_portrait_wall.mp4", start: 6.8, end: 10.0, sf: 1.04, st: 1.14 },
  // HISTORY 9.8-22.1s — parents hardship
  { src: "gia_toc/father_farming.mp4", start: 10.0, end: 15.5, sf: 1.02, st: 1.10 },
  { src: "gia_toc/mother_sewing.mp4", start: 15.5, end: 22.2, sf: 1.03, st: 1.12 },
  // ACCUMULATION 22.1-37.4s — saving, generations
  { src: "gia_toc/elderly_hands.mp4", start: 22.2, end: 27.5, sf: 1.04, st: 1.14 },
  { src: "gia_toc/hands_generation.mp4", start: 27.5, end: 32.5, sf: 1.02, st: 1.10 },
  { src: "gia_toc/parent_old_photo.mp4", start: 32.5, end: 37.4, sf: 1.03, st: 1.12 },
  // DIFFERENT 37.4-53.6s — young with vision
  { src: "gia_toc/young_window_dawn.mp4", start: 37.4, end: 43.0, sf: 1.02, st: 1.10 },
  { src: "gia_toc/open_book_light.mp4", start: 43.0, end: 48.0, sf: 1.03, st: 1.12 },
  { src: "gia_toc/young_thinking_city.mp4", start: 48.0, end: 53.7, sf: 1.04, st: 1.14 },
  // BURDEN 53.6-73.1s — weight, climbing
  { src: "gia_toc/back_carrying_weight.mp4", start: 53.7, end: 60.0, sf: 1.02, st: 1.10 },
  { src: "gia_toc/stairs_climbing_alone.mp4", start: 60.0, end: 66.5, sf: 1.04, st: 1.14 },
  { src: "gia_toc/grandmother_counting_money.mp4", start: 66.5, end: 73.1, sf: 1.03, st: 1.10 },
  // ALONE 73.1-89.4s — lonely path, no guide
  { src: "gia_toc/foggy_path_forest.mp4", start: 73.1, end: 79.0, sf: 1.03, st: 1.12 },
  { src: "gia_toc/map_drawing_hand.mp4", start: 79.0, end: 84.0, sf: 1.02, st: 1.10 },
  { src: "gia_toc/lonely_road_night.mp4", start: 84.0, end: 89.4, sf: 1.04, st: 1.14 },
  // LANDING 89.4-114s — rising, dawn, standing up
  { src: "gia_toc/sunrise_horizon_figure.mp4", start: 89.4, end: 100.0, sf: 1.02, st: 1.12 },
  { src: "gia_toc/rising_hand_light.mp4", start: 100.0, end: 114.0, sf: 1.04, st: 1.18 },
];

// ─── Sub-components ──────────────────────────────────────

const CutLayer: React.FC<{ cut: Cut }> = ({ cut }) => {
  const frame = useCurrentFrame();
  const sf = cut.start * FPS;
  const ef = cut.end * FPS;
  const fade = 9;
  const opacity = interpolate(
    frame,
    [sf - fade, sf + fade, ef - fade, ef + fade],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  if (opacity <= 0) return null;
  const local = frame - sf;
  const scale = interpolate(local, [0, ef - sf], [cut.sf ?? 1.02, cut.st ?? 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
          filter: "brightness(0.44) saturate(0.75) contrast(1.08) sepia(0.15)",
        }}
      >
        <OffthreadVideo
          src={staticFile(cut.src)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
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
    const next = SENTENCES[i + 1];
    const boundary = next ? next.start : s.end + 0.7;
    if (t >= s.start - 0.15 && t < boundary) {
      active = s;
      break;
    }
  }
  if (!active || hide) return null;
  const LEAD = 0.1;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 18px",
          maxWidth: 920,
          padding: "0 60px",
        }}
      >
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const appearSpring = spring({
            frame: frame - appearAt * FPS,
            fps: FPS,
            config: { damping: 14, stiffness: 230, mass: 0.4 },
          });
          const visible = t >= appearAt;
          const y = interpolate(appearSpring, [0, 1], [12, 0]);
          const blur = interpolate(appearSpring, [0, 1], [4, 0]);
          const emph = isEmphasis(w.word);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
                fontWeight: emph ? 800 : 600,
                fontSize: emph ? 64 : 54,
                color: emph ? EMPHASIS_COLOR : BODY_COLOR,
                textShadow: emph
                  ? "0 0 26px rgba(212,165,116,0.6), 0 4px 14px rgba(0,0,0,0.95)"
                  : "0 3px 12px rgba(0,0,0,0.95)",
                opacity: visible ? appearSpring : 0,
                transform: `translateY(${y}px)`,
                filter: `blur(${blur}px)`,
                letterSpacing: emph ? "0.4px" : "0",
                lineHeight: 1.3,
              }}
            >
              {w.word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const BigWordLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const sf = BIG_WORD_START * FPS;
  const ef = BIG_WORD_END * FPS;
  if (frame < sf - 4) return null;

  const sp = spring({
    frame: frame - sf,
    fps: FPS,
    config: { damping: 12, stiffness: 85, mass: 1.4 },
  });
  const fadeOut = interpolate(frame, [ef - 18, ef], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = sp * fadeOut;
  const scale = interpolate(sp, [0, 1], [1.6, 1.0]);
  const blur = interpolate(sp, [0, 1], [14, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)` }}>
        <div
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontWeight: 500,
            fontSize: 170,
            color: BODY_COLOR,
            letterSpacing: "10px",
            textShadow:
              "0 0 50px rgba(255,245,220,0.3), 0 0 140px rgba(212,165,116,0.35), 0 8px 30px rgba(0,0,0,0.95)",
            lineHeight: 1,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          ĐẾN LƯỢT
        </div>
        <div
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontWeight: 600,
            fontSize: 280,
            color: EMPHASIS_COLOR,
            letterSpacing: "14px",
            lineHeight: 1,
            textAlign: "center",
            marginTop: 18,
            textShadow:
              "0 0 60px rgba(212,165,116,0.55), 0 0 180px rgba(212,165,116,0.3), 0 10px 30px rgba(0,0,0,0.95)",
          }}
        >
          BẠN.
        </div>
        <div
          style={{
            fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: 28,
            color: "#D4C5A8",
            letterSpacing: "5px",
            textAlign: "center",
            marginTop: 38,
            textTransform: "uppercase",
            textShadow: "0 2px 10px rgba(0,0,0,0.95)",
          }}
        >
          tập 3 · người được chọn của gia tộc
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const GiaTocFull: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const globalOpacity = interpolate(
    frame,
    [0, 14, durationInFrames - 14, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const bigActive = t >= BIG_WORD_START && t <= BIG_WORD_END;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0804", opacity: globalOpacity }}>
      {CUTS.map((c, i) => (
        <CutLayer key={i} cut={c} />
      ))}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 22%, rgba(10,5,0,0.85) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.72) 100%)",
        }}
      />
      <Caption hide={bigActive} />
      <BigWordLayer />
      <Audio src={staticFile("gia_toc_voice.mp3")} volume={0.8} />
      <Audio src={staticFile("bay_cuu_music.mp3")} volume={0.09} />
    </AbsoluteFill>
  );
};
