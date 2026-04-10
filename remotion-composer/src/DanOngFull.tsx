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
import wordsData from "./dan_ong_words.json";

loadEBGaramond("normal", {
  weights: ["400", "500", "600"],
  subsets: ["vietnamese", "latin", "latin-ext"],
});
loadBeVietnamPro("normal", {
  weights: ["300", "400", "600", "700", "800"],
  subsets: ["vietnamese", "latin", "latin-ext"],
});

// "ĐÀN ÔNG KHÔNG KHÓC?" · Tập 2
// Duration: 117s @ 30fps = 3510 frames
// Narration: 0-112.32s · Outro ĐÀN ÔNG 113-117s
// Emphasis color: #A5B5BC (cool blue-grey tear, different from Bầy Cừu gold)

const FPS = 30;
const EMPHASIS_COLOR = "#A5B5BC";
const BODY_COLOR = "#F5F5F0";

type Word = { word: string; start: number; end: number };
const words = wordsData as Word[];

// Group into sentences
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

// Emphasis words — key thematic words get color
const EMPHASIS_WORDS = new Set<string>([
  "khóc", "khóc.", "khóc,", "nhớ.", "vậy.",
  "giấu", "giấu.", "cười.", "không", "không.",
  "mệt.", "mệt,", "mệt",
  "im.", "gật.", "có.", "nặng.",
  "rơi.", "bố.", "bố,",
  "thấy.", "thấy,",
  "hèn.", "yếu.", "mình.",
  "đàn", "ông,", "ông.",
  "đá.", "đá,",
]);
const isEmphasis = (w: string): boolean => {
  const clean = w.toLowerCase();
  return EMPHASIS_WORDS.has(clean);
};

// Single final big-word drop
type BigWord = { text: string; subtitle: string; start: number; end: number };
const BIG_WORD: BigWord = {
  text: "ĐÀN ÔNG",
  subtitle: "tập 2 · chỗ khóc không ai thấy",
  start: 113.0,
  end: 117.0,
};

// Background cuts — men-focused footage
type Cut = { src: string; start: number; end: number; scaleFrom?: number; scaleTo?: number };
const CUTS: Cut[] = [
  // HOOK 0-8.22
  { src: "dan_ong/hook_car_wheel.mp4", start: 0.0, end: 3.0, scaleFrom: 1.02, scaleTo: 1.10 },
  { src: "dan_ong/hook_red_light.mp4", start: 3.0, end: 5.8, scaleFrom: 1.04, scaleTo: 1.12 },
  { src: "dan_ong/hook_car_window.mp4", start: 5.8, end: 8.5, scaleFrom: 1.02, scaleTo: 1.10 },
  // CHILDHOOD 8.22-23.34
  { src: "dan_ong/child_bike_fall.mp4", start: 8.5, end: 15.5, scaleFrom: 1.03, scaleTo: 1.12 },
  { src: "dan_ong/father_son_old.mp4", start: 15.5, end: 23.4, scaleFrom: 1.02, scaleTo: 1.10 },
  // BECOMING 23.34-38.26
  { src: "dan_ong/man_mirror.mp4", start: 23.4, end: 30.5, scaleFrom: 1.04, scaleTo: 1.12 },
  { src: "dan_ong/lonely_apartment.mp4", start: 30.5, end: 38.3, scaleFrom: 1.02, scaleTo: 1.12 },
  // WEIGHTS 38.26-58.56
  { src: "dan_ong/angry_customer_phone.mp4", start: 38.3, end: 43.5, scaleFrom: 1.02, scaleTo: 1.10 },
  { src: "dan_ong/businessman_tired_desk.mp4", start: 43.5, end: 48.8, scaleFrom: 1.04, scaleTo: 1.12 },
  { src: "dan_ong/man_fake_smile_family.mp4", start: 48.8, end: 53.8, scaleFrom: 1.02, scaleTo: 1.10 },
  { src: "dan_ong/bank_account_phone.mp4", start: 53.8, end: 58.6, scaleFrom: 1.04, scaleTo: 1.14 },
  // HIDDEN 58.56-82.34
  { src: "dan_ong/car_traffic_jam.mp4", start: 58.6, end: 64.5, scaleFrom: 1.02, scaleTo: 1.10 },
  { src: "dan_ong/office_toilet.mp4", start: 64.5, end: 70.5, scaleFrom: 1.04, scaleTo: 1.12 },
  { src: "dan_ong/rooftop_night_city.mp4", start: 70.5, end: 76.5, scaleFrom: 1.02, scaleTo: 1.10 },
  { src: "dan_ong/cigarette_hand_dark.mp4", start: 76.5, end: 82.4, scaleFrom: 1.06, scaleTo: 1.16 },
  // RECOGNITION 82.34-96.54
  { src: "dan_ong/father_silhouette.mp4", start: 82.4, end: 89.5, scaleFrom: 1.02, scaleTo: 1.10 },
  { src: "dan_ong/father_son_kid.mp4", start: 89.5, end: 96.6, scaleFrom: 1.03, scaleTo: 1.12 },
  // LANDING 96.54-113 (fade toward ĐÀN ÔNG)
  { src: "dan_ong/man_back_window.mp4", start: 96.6, end: 104.5, scaleFrom: 1.02, scaleTo: 1.10 },
  { src: "dan_ong/lone_man_dark_room.mp4", start: 104.5, end: 117.0, scaleFrom: 1.04, scaleTo: 1.18 },
];

// ─── Sub-components ──────────────────────────────────────

const CutLayer: React.FC<{ cut: Cut }> = ({ cut }) => {
  const frame = useCurrentFrame();
  const startFrame = cut.start * FPS;
  const endFrame = cut.end * FPS;
  const fadeFrames = 9;

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
          filter: "brightness(0.38) saturate(0.6) contrast(1.08)",
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
                  ? `0 0 26px rgba(165,181,188,0.55), 0 4px 14px rgba(0,0,0,0.95)`
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
  const startFrame = BIG_WORD.start * FPS;
  const endFrame = BIG_WORD.end * FPS;

  if (frame < startFrame - 4) return null;

  const inSpring = spring({
    frame: frame - startFrame,
    fps: FPS,
    config: { damping: 12, stiffness: 85, mass: 1.4 },
  });
  const fadeOut = interpolate(frame, [endFrame - 18, endFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = inSpring * fadeOut;
  const scale = interpolate(inSpring, [0, 1], [1.6, 1.0]);
  const blur = interpolate(inSpring, [0, 1], [14, 0]);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)` }}>
        <div
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontWeight: 500,
            fontSize: 240,
            color: BODY_COLOR,
            letterSpacing: "12px",
            textShadow:
              "0 0 50px rgba(255,255,255,0.25), 0 0 140px rgba(165,181,188,0.32), 0 8px 30px rgba(0,0,0,0.95)",
            lineHeight: 1,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {BIG_WORD.text}
        </div>
        <div
          style={{
            fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: 28,
            color: "#B8C5CB",
            letterSpacing: "5px",
            textAlign: "center",
            marginTop: 32,
            textTransform: "uppercase",
            textShadow: "0 2px 10px rgba(0,0,0,0.95)",
          }}
        >
          {BIG_WORD.subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main ──────────────────────────────────────

export const DanOngFull: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;

  const globalOpacity = interpolate(
    frame,
    [0, 14, durationInFrames - 14, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const bigActive = t >= BIG_WORD.start && t <= BIG_WORD.end;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: globalOpacity }}>
      {CUTS.map((c, i) => (
        <CutLayer key={i} cut={c} />
      ))}

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 22%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <Caption hide={bigActive} />
      <BigWordLayer />

      <Audio src={staticFile("dan_ong_voice.mp3")} volume={0.78} />
      <Audio src={staticFile("bay_cuu_music.mp3")} volume={0.09} />
    </AbsoluteFill>
  );
};
