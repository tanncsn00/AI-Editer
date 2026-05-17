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
import wordsData from "./dung_mua_words.json";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// Đợi Đúng Mùa — warm orchard / patient world · 113.97s narration + outro big-word
// Voice: ductrong 0.9x

const FPS = 30;
const EMPHASIS = "#F4B860";
const BODY = "#F5F5F0";

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
  "khác.", "giàu.", "đau.",
  "mua.", "may", "mắn.", "mắn,",
  "mùa.", "mùa,", "mùa",
  "trái.", "thẳng.",
  "cây.", "quả", "cây",
  "chỉ.", "chỉ,",
  "định.", "định",
  "mười", "hai", "năm.",
]);
const isEmph = (w: string): boolean => EMPH.has(w.toLowerCase());

const BIG_START = 113.5;
const BIG_END = 117.5;

type Cut = { src: string; start: number; end: number; sf?: number; st?: number };
// All clips: warm patient world — kitchen lamp / older hands / orchard / fruit / waiting figure
const CUTS: Cut[] = [
  // HOOK 0–11.62
  { src: "dung_mua/kitchen_lamp_morning_old.mp4",  start: 0.0,    end: 11.62, sf: 1.02, st: 1.10 },

  // PUSHBACK 11.62–29.50 — father story
  { src: "dung_mua/father_old_hands_count.mp4",    start: 11.62,  end: 17.58, sf: 1.04, st: 1.12 },
  { src: "dung_mua/dim_kitchen_alone.mp4",         start: 17.58,  end: 23.54, sf: 1.02, st: 1.10 },
  { src: "dung_mua/tired_man_desk_lamp.mp4",       start: 23.54,  end: 29.50, sf: 1.04, st: 1.14 },

  // STORY 29.50–74.08 — anh A vs anh B
  { src: "dung_mua/man_typing_late_office.mp4",    start: 29.50,  end: 38.42, sf: 1.03, st: 1.12 },
  { src: "dung_mua/tired_man_desk_lamp.mp4",       start: 38.42,  end: 47.34, sf: 1.04, st: 1.14 },
  { src: "dung_mua/cafe_window_man_thinking.mp4",  start: 47.34,  end: 56.26, sf: 1.02, st: 1.10 },
  { src: "dung_mua/man_reading_book_warm.mp4",     start: 56.26,  end: 65.18, sf: 1.03, st: 1.12 },
  { src: "dung_mua/hand_picking_fruit.mp4",        start: 65.18,  end: 74.08, sf: 1.04, st: 1.14 },

  // MIRROR 74.08–88.90 — orchard / ripe fruit
  { src: "dung_mua/orange_tree_fruit.mp4",         start: 74.08,  end: 79.02, sf: 1.02, st: 1.10 },
  { src: "dung_mua/ripe_fruit_branch.mp4",         start: 79.02,  end: 83.96, sf: 1.04, st: 1.14 },
  { src: "dung_mua/apple_tree_orchard.mp4",        start: 83.96,  end: 88.90, sf: 1.02, st: 1.12 },

  // TURN 88.90–101.40 — roots / watering / patience
  { src: "dung_mua/hand_watering_plant.mp4",       start: 88.90,  end: 93.07, sf: 1.03, st: 1.12 },
  { src: "dung_mua/tree_roots_close_up.mp4",       start: 93.07,  end: 97.24, sf: 1.04, st: 1.14 },
  { src: "dung_mua/orchard_morning_warm_light.mp4",start: 97.24,  end: 101.40, sf: 1.02, st: 1.10 },

  // LANDING 101.40–117.5 — path / standing field / season change
  { src: "dung_mua/path_through_orchard.mp4",      start: 101.40, end: 106.77, sf: 1.03, st: 1.12 },
  { src: "dung_mua/man_standing_field_dawn.mp4",   start: 106.77, end: 112.13, sf: 1.04, st: 1.14 },
  { src: "dung_mua/season_change_field.mp4",       start: 112.13, end: 118.0,  sf: 1.02, st: 1.10 },
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
      <div style={{ width: "100%", height: "100%", transform: `scale(${scale})`, filter: "brightness(0.4) saturate(0.65) contrast(1.08)" }}>
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
              textShadow: emph ? "0 0 26px rgba(244,184,96,0.55), 0 4px 14px rgba(0,0,0,0.95)" : "0 3px 12px rgba(0,0,0,0.95)",
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
          fontSize: 440,
          color: BODY,
          letterSpacing: "22px",
          textShadow: "0 0 60px rgba(244,184,96,0.4), 0 0 180px rgba(244,184,96,0.35), 0 10px 30px rgba(0,0,0,0.95)",
          lineHeight: 1,
        }}>MÙA</div>
        <div style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: 38,
          color: BODY,
          opacity: 0.85,
          letterSpacing: "4px",
          marginTop: 38,
          textShadow: "0 2px 10px rgba(0,0,0,0.95)",
        }}>đời mỗi người, cũng có một mùa</div>
      </div>
    </AbsoluteFill>
  );
};

export const DoiDungMuaFull: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const globalOpacity = interpolate(frame, [0, 14, durationInFrames - 14, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bigActive = t >= BIG_START && t <= BIG_END;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0805", opacity: globalOpacity }}>
      {CUTS.map((c, i) => <CutLayer key={i} cut={c} />)}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 22%, rgba(0,0,0,0.85) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.18) 70%, rgba(0,0,0,0.7) 100%)" }} />
      <Caption hide={bigActive} />
      <BigWord />
      <Audio src={staticFile("dung_mua_voice.mp3")} volume={0.78} />
      <Audio src={staticFile("dung_mua_music.mp3")} volume={0.10} />
    </AbsoluteFill>
  );
};
