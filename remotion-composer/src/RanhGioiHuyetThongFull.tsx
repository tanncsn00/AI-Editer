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
import wordsData from "./ranh_gioi_words.json";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// Ranh Giới Huyết Thống — warm family palette · core env: dim family home / two silhouettes
// Voice: ductrong 0.9x · 193.25s narration + outro big-word

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
  "hàng.", "thật,", "cười.", "nơi.",
  "nhà.", "bậc.", "cỗ.", "đứt.",
  "trả.", "nữa.", "viên.", "lật.", "vệ.",
  "bỏ.", "mình,", "ra.", "bền.", "nó.",
  "lên.", "thở.", "tĩnh,",
  "ranh", "giới,", "ranh", "giới.", "ranh", "giới",
  "tiền", "tiền,", "tiền.",
  "liên", "minh.", "liên", "minh,",
  "họ", "hàng.",
]);
const isEmph = (w: string): boolean => EMPH.has(w.toLowerCase());

const BIG_START = 192.5;
const BIG_END = 196.5;

type Cut = { src: string; start: number; end: number; sf?: number; st?: number };
// All clips from dim family-home / silhouette / threshold environment
const CUTS: Cut[] = [
  // HOOK 0–15.30 — dim home
  { src: "ranh_gioi/empty_apartment_evening.mp4", start: 0.0, end: 7.6, sf: 1.02, st: 1.10 },
  { src: "ranh_gioi/dim_living_room_night.mp4",   start: 7.6, end: 15.3, sf: 1.04, st: 1.12 },

  // SETUP 15.30–41.14 — childhood / family memory
  { src: "ranh_gioi/old_family_photo.mp4",      start: 15.3, end: 23.9, sf: 1.02, st: 1.10 },
  { src: "ranh_gioi/vintage_kitchen_bowl.mp4",  start: 23.9, end: 32.5, sf: 1.04, st: 1.14 },
  { src: "ranh_gioi/hand_holding_photo.mp4",    start: 32.5, end: 41.14, sf: 1.02, st: 1.12 },

  // MIRROR 41.14–69.62 — wedding leaving / quiet home
  { src: "ranh_gioi/wedding_dress_back.mp4",    start: 41.14, end: 50.6, sf: 1.03, st: 1.12 },
  { src: "ranh_gioi/door_closing_house.mp4",    start: 50.6, end: 60.0, sf: 1.04, st: 1.14 },
  { src: "ranh_gioi/man_at_window_evening.mp4", start: 60.0, end: 69.62, sf: 1.02, st: 1.10 },

  // TRAP 69.62–102.96 — money / paper / table
  { src: "ranh_gioi/hands_counting_paper.mp4",      start: 69.62, end: 80.7, sf: 1.03, st: 1.12 },
  { src: "ranh_gioi/documents_table_lamp.mp4",      start: 80.7, end: 91.8, sf: 1.04, st: 1.14 },
  { src: "ranh_gioi/dinner_table_empty_chair.mp4",  start: 91.8, end: 102.96, sf: 1.02, st: 1.12 },

  // WEIGHT 102.96–141.26 — silhouettes / windows / alone
  { src: "ranh_gioi/two_silhouettes_window.mp4",        start: 102.96, end: 115.7, sf: 1.03, st: 1.12 },
  { src: "ranh_gioi/lit_windows_apartment_night.mp4",   start: 115.7, end: 128.5, sf: 1.04, st: 1.14 },
  { src: "ranh_gioi/man_alone_dim_kitchen.mp4",         start: 128.5, end: 141.26, sf: 1.02, st: 1.10 },

  // TURN 141.26–162.66 — threshold / line of light
  { src: "ranh_gioi/light_under_door_dim.mp4",     start: 141.26, end: 151.96, sf: 1.03, st: 1.14 },
  { src: "ranh_gioi/threshold_doorway_warm.mp4",   start: 151.96, end: 162.66, sf: 1.04, st: 1.12 },

  // INSIGHT 162.66–175.16 — back at window
  { src: "ranh_gioi/man_back_window_dawn.mp4",     start: 162.66, end: 175.16, sf: 1.02, st: 1.12 },

  // LANDING 175.16–197 — open sky / lone walk
  { src: "ranh_gioi/calm_sky_dawn.mp4",            start: 175.16, end: 186.0, sf: 1.04, st: 1.14 },
  { src: "ranh_gioi/man_walking_alone_evening.mp4",start: 186.0, end: 197.0, sf: 1.02, st: 1.10 },
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
          fontSize: 270,
          color: BODY,
          letterSpacing: "20px",
          textShadow: "0 0 60px rgba(244,184,96,0.4), 0 0 180px rgba(244,184,96,0.35), 0 10px 30px rgba(0,0,0,0.95)",
          lineHeight: 1,
        }}>RANH GIỚI</div>
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
        }}>khoảng trời cho tình thương có chỗ thở</div>
      </div>
    </AbsoluteFill>
  );
};

export const RanhGioiHuyetThongFull: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const globalOpacity = interpolate(frame, [0, 14, durationInFrames - 14, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bigActive = t >= BIG_START && t <= BIG_END;
  return (
    <AbsoluteFill style={{ backgroundColor: "#08060A", opacity: globalOpacity }}>
      {CUTS.map((c, i) => <CutLayer key={i} cut={c} />)}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 22%, rgba(0,0,0,0.85) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.18) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.18) 70%, rgba(0,0,0,0.7) 100%)" }} />
      <Caption hide={bigActive} />
      <BigWord />
      <Audio src={staticFile("ranh_gioi_voice.mp3")} volume={0.78} />
      <Audio src={staticFile("ranh_gioi_music.mp3")} volume={0.10} />
    </AbsoluteFill>
  );
};
