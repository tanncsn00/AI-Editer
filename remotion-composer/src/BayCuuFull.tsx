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
import wordsData from "./bay_cuu_words.json";

// "BẦY CỪU KHÔNG AI CHĂN" · Tập 1 — Full composition
// Duration: 107s @ 30fps = 3210 frames
// Narration: 0-102.78s (from EverAI + faster-whisper forced alignment)
// Outro: TỰ DO big word 102.8-107s

const FPS = 30;

type Word = { word: string; start: number; end: number };
const words = wordsData as Word[];

// Group narration into sentences (end with .!?)
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

// Emphasis words — yellow/warm color + slightly larger
const EMPHASIS_WORDS = new Set<string>([
  "lạ.", "chuồng.", "ngày.", "chảy.", "sau.", "nghiệp.",
  "lưng.", "định.", "che.", "mình.", "là.", "dậy.",
  "khoá.", "cùng.", "nghĩa.",
  "tưởng", "thiết", "mất", "tỉnh",
  "tự", "do",
]);
const isEmphasis = (w: string): boolean => {
  const clean = w.toLowerCase();
  return EMPHASIS_WORDS.has(clean);
};

// Big-word drops at beat transitions
type BigWord = { text: string; subtitle?: string; start: number; end: number };
const BIG_WORDS: BigWord[] = [
  { text: "TỰ DO", subtitle: "tập 1 · bầy cừu không ai chăn", start: 102.9, end: 107.0 },
];

// Background cuts — manually mapped from footage library
type Cut = { src: string; start: number; end: number; scaleFrom?: number; scaleTo?: number };
const CUTS: Cut[] = [
  // HOOK 0-7.3 (BẦY drop at end)
  { src: "bay_cuu/winter_footsteps.mp4", start: 0.0, end: 2.4, scaleFrom: 1.02, scaleTo: 1.10 },
  { src: "bay_cuu/snow_path_night.mp4", start: 2.4, end: 4.2, scaleFrom: 1.03, scaleTo: 1.10 },
  { src: "bay_cuu/winter_forest_dark.mp4", start: 4.2, end: 7.3, scaleFrom: 1.04, scaleTo: 1.14 },
  // MORNING 7.3-16.5
  { src: "bay_cuu/morning_alarm.mp4", start: 7.3, end: 10.6, scaleFrom: 1.02, scaleTo: 1.10 },
  { src: "bay_cuu/morning_window.mp4", start: 10.6, end: 13.5, scaleFrom: 1.04, scaleTo: 1.12 },
  { src: "bay_cuu/closing_door.mp4", start: 13.5, end: 16.5, scaleFrom: 1.02, scaleTo: 1.10 },
  // HERD 16.5-30.2
  { src: "bay_cuu/crowd_commute.mp4", start: 16.5, end: 20.8, scaleFrom: 1.02, scaleTo: 1.08 },
  { src: "bay_cuu/street_crowd_walking.mp4", start: 20.8, end: 25.2, scaleFrom: 1.04, scaleTo: 1.12 },
  { src: "bay_cuu/traffic_timelapse.mp4", start: 25.2, end: 30.2, scaleFrom: 1.0, scaleTo: 1.08 },
  // MIRROR 30.2-43.2 (MÊ drop at end)
  { src: "bay_cuu/sheep_eye_closeup.mp4", start: 30.2, end: 34.2, scaleFrom: 1.04, scaleTo: 1.14 },
  { src: "bay_cuu/tired_face_subway.mp4", start: 34.2, end: 38.5, scaleFrom: 1.02, scaleTo: 1.10 },
  { src: "bay_cuu/crowd_behind.mp4", start: 38.5, end: 43.2, scaleFrom: 1.05, scaleTo: 1.14 },
  // TRAP 43.2-61 (BẪY drop at end)
  { src: "bay_cuu/warm_cabin_window.mp4", start: 43.2, end: 48.0, scaleFrom: 1.02, scaleTo: 1.10 },
  { src: "bay_cuu/office_lights_night.mp4", start: 48.0, end: 53.5, scaleFrom: 1.04, scaleTo: 1.12 },
  { src: "bay_cuu/office_desk_typing.mp4", start: 53.5, end: 61.0, scaleFrom: 1.0, scaleTo: 1.12 },
  // WEIGHT 61-78.1 (MẤT drop at end)
  { src: "bay_cuu/clock_ticking.mp4", start: 61.0, end: 66.5, scaleFrom: 1.06, scaleTo: 1.16 },
  { src: "bay_cuu/calendar_pages.mp4", start: 66.5, end: 71.5, scaleFrom: 1.02, scaleTo: 1.10 },
  { src: "bay_cuu/tired_man_desk.mp4", start: 71.5, end: 78.1, scaleFrom: 1.02, scaleTo: 1.10 },
  // TURN 78.1-95 (TỈNH drop at end)
  { src: "bay_cuu/door_opening_light.mp4", start: 78.1, end: 83.8, scaleFrom: 1.04, scaleTo: 1.14 },
  { src: "bay_cuu/forest_path_fork.mp4", start: 83.8, end: 89.0, scaleFrom: 1.02, scaleTo: 1.12 },
  { src: "bay_cuu/winter_forest_dark.mp4", start: 89.0, end: 95.0, scaleFrom: 1.04, scaleTo: 1.14 },
  // LANDING 95-102.9 (TỰ DO outro)
  { src: "bay_cuu/footprints_snow_single.mp4", start: 95.0, end: 100.5, scaleFrom: 1.02, scaleTo: 1.10 },
  { src: "bay_cuu/lone_walker_snow.mp4", start: 100.5, end: 107.0, scaleFrom: 1.04, scaleTo: 1.14 },
];

// ─── Sub-components ────────────────────────────────────────

const CutLayer: React.FC<{ cut: Cut }> = ({ cut }) => {
  const frame = useCurrentFrame();
  const startFrame = cut.start * FPS;
  const endFrame = cut.end * FPS;
  const fadeFrames = 8;

  const opacity = interpolate(
    frame,
    [startFrame - fadeFrames, startFrame + fadeFrames, endFrame - fadeFrames, endFrame + fadeFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  if (opacity <= 0) return null;

  const total = endFrame - startFrame;
  const local = frame - startFrame;
  const scale = interpolate(local, [0, total], [cut.scaleFrom ?? 1.02, cut.scaleTo ?? 1.1], {
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
          filter: "brightness(0.4) saturate(0.65) contrast(1.08)",
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

  // Find active sentence: current or most recent within 0.5s hold after end
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

  if (!active || hide) return null;

  const LEAD = 0.1; // lead text slightly ahead of voice to match spring rise

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
                color: emph ? "#F4B860" : "#F5F5F0",
                textShadow: emph
                  ? "0 0 26px rgba(244,184,96,0.55), 0 4px 14px rgba(0,0,0,0.95)"
                  : "0 3px 12px rgba(0,0,0,0.95)",
                opacity: visible ? appearSpring : 0,
                transform: `translateY(${y}px)`,
                filter: `blur(${blur}px)`,
                letterSpacing: emph ? "0.4px" : "0",
                lineHeight: 1.25,
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

const BigWordLayer: React.FC<{ bw: BigWord }> = ({ bw }) => {
  const frame = useCurrentFrame();
  const startFrame = bw.start * FPS;
  const endFrame = bw.end * FPS;

  if (frame < startFrame - 4 || frame > endFrame + 4) return null;

  const inSpring = spring({
    frame: frame - startFrame,
    fps: FPS,
    config: { damping: 12, stiffness: 90, mass: 1.3 },
  });
  const fadeOut = interpolate(frame, [endFrame - 14, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = inSpring * fadeOut;
  const scale = interpolate(inSpring, [0, 1], [1.7, 1.0]);
  const blur = interpolate(inSpring, [0, 1], [14, 0]);

  const isLongWord = bw.text.length > 3;

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", opacity }}
    >
      <div style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)` }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
            fontWeight: 500,
            fontSize: isLongWord ? 260 : 340,
            color: "#F5F5F0",
            letterSpacing: isLongWord ? "12px" : "18px",
            textShadow:
              "0 0 45px rgba(255,255,255,0.25), 0 0 140px rgba(244,184,96,0.25), 0 8px 30px rgba(0,0,0,0.95)",
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          {bw.text}
        </div>
        {bw.subtitle && (
          <div
            style={{
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: 28,
              color: "#C9C9C0",
              letterSpacing: "5px",
              textAlign: "center",
              marginTop: 30,
              textTransform: "uppercase",
              textShadow: "0 2px 10px rgba(0,0,0,0.95)",
            }}
          >
            {bw.subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─── Main composition ──────────────────────────────────────

export const BayCuuFull: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;

  const globalOpacity = interpolate(
    frame,
    [0, 14, durationInFrames - 14, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Hide caption when big word is active (avoid clash)
  const bigActive = BIG_WORDS.some((bw) => t >= bw.start && t <= bw.end);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: globalOpacity }}>
      {CUTS.map((c, i) => (
        <CutLayer key={i} cut={c} />
      ))}

      {/* Vignettes */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 22%, rgba(0,0,0,0.82) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0) 55%)",
        }}
      />

      <Caption hide={bigActive} />

      {BIG_WORDS.map((bw, i) => (
        <BigWordLayer key={i} bw={bw} />
      ))}

      {/* Audio layers */}
      <Audio src={staticFile("bay_cuu_full_voice.mp3")} volume={0.8} />
      <Audio src={staticFile("bay_cuu_music.mp3")} volume={0.09} />
    </AbsoluteFill>
  );
};
