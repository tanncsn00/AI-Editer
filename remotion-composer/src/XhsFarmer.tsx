import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/BeVietnamPro";
import wordsData from "./xhs_farmer_words.json";

loadFont("normal", { subsets: ["vietnamese", "latin", "latin-ext"], weights: ["600", "800"] });

const FPS = 30;
const LEAD = 0.1;

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
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 260,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 14px",
          maxWidth: 620,
          padding: "0 40px",
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
          const y = interpolate(appearSpring, [0, 1], [14, 0]);
          const blur = interpolate(appearSpring, [0, 1], [4, 0]);
          const isActive = t >= w.start - LEAD && t < w.end;

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: "'Be Vietnam Pro', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 44,
                color: isActive ? "#F4B860" : "#F5F5F0",
                textShadow: isActive
                  ? "0 0 24px rgba(244,184,96,0.55), 0 4px 14px rgba(0,0,0,0.95)"
                  : "0 3px 12px rgba(0,0,0,0.95)",
                opacity: visible ? appearSpring : 0,
                transform: `translateY(${y}px)`,
                filter: `blur(${blur}px)`,
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

export const XhsFarmer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <OffthreadVideo src={staticFile("xhs_farmer/bg.mp4")} />
      <Caption />
    </AbsoluteFill>
  );
};
