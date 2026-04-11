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
import { loadFont } from "@remotion/google-fonts/BeVietnamPro";
import wordsData from "./reup_demo_words.json";

loadFont("normal", { subsets: ["vietnamese","latin","latin-ext"], weights: ["600","800"] });

// REUP DEMO — Chinese action clip + VN commentator dub + karaoke caption
// Pipeline proof for comedy-reup-dub skill

const FPS = 30;
const LEAD = 0.1;

type Word = { word: string; start: number; end: number };
const words = wordsData as Word[];

type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
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
})();

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
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 260 }}>
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center",
        gap: "0 14px", maxWidth: 900, padding: "0 40px",
      }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [14, 0]);
          const blur = interpolate(sp, [0, 1], [4, 0]);
          const isActive = t >= w.start - LEAD && t < w.end;
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 52,
              color: isActive ? "#F4B860" : "#F5F5F0",
              textShadow: isActive
                ? "0 0 24px rgba(244,184,96,0.6), 0 4px 14px rgba(0,0,0,0.98)"
                : "0 3px 12px rgba(0,0,0,0.98)",
              WebkitTextStroke: "3px #0A0A0F",
              opacity: visible ? sp : 0,
              transform: `translateY(${y}px)`,
              filter: `blur(${blur}px)`,
              lineHeight: 1.25,
            }}>{w.word}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const ReupDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const globalOp = interpolate(
    frame,
    [0, 8, durationInFrames - 8, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: globalOp }}>
      {/* Video: cropped to portrait via scale + translate since source is 960x540 landscape */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
          <OffthreadVideo
            src={staticFile("reup_demo/video.mp4")}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </AbsoluteFill>
      {/* Dim overlay to pop caption */}
      <AbsoluteFill style={{
        background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 45%)",
      }} />
      <Caption />
      <Audio src={staticFile("reup_demo/voice.mp3")} volume={1.0} />
    </AbsoluteFill>
  );
};
