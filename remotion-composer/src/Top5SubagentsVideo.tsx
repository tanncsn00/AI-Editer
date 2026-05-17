import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import beatsData from "./subagents_video_beats.json";
import wordsData from "./subagents_video_words.json";

loadBeVietnamPro("normal", { weights: ["600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FPS = 30;
const W = 1080;
const H = 1920;

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

type Word = { word: string; start: number; end: number; beat: number };
const words = wordsData as Word[];

// Caption sentence-based reveal (key visual addition over plain slides)
type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  const flush = () => {
    if (buf.length) {
      out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
      buf = [];
    }
  };
  for (const w of words) {
    buf.push(w);
    if (/[.!?]$/.test(w.word)) { flush(); continue; }
    if (/,$/.test(w.word) && buf.length >= 8) { flush(); }
  }
  flush();
  return out;
})();

const EMPH = new Set<string>([
  "MCP", "GitHub", "Context7", "Playwright", "MarkItDown", "Filesystem", "Supabase",
  "Claude", "Code", "Anthropic", "Microsoft", "Upstash",
  "29.8k", "55.2k", "32.4k", "120k", "85.6k",
  "Official", "KHỦNG", "NHẤT", "BONUS", "MUST-HAVE",
  "50%", "save", "Save", "Comment", "Follow",
]);

const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let active: Sentence | null = null;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i + 1];
    const boundary = next ? next.start : s.end + 0.6;
    if (t >= s.start - 0.15 && t < boundary) { active = s; break; }
  }
  if (!active) return null;
  const LEAD = 0.1;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 240, pointerEvents: "none" }}>
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center",
        gap: "0 14px", maxWidth: 960, padding: "0 60px",
      }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [10, 0]);
          const blur = interpolate(sp, [0, 1], [3, 0]);
          const cleanWord = w.word.replace(/[.,!?]$/, "");
          const emph = EMPH.has(cleanWord);
          return (
            <span key={`${active.start}-${i}`} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: emph ? 800 : 700,
              fontSize: emph ? 44 : 40,
              color: emph ? "#F4B860" : "#F5F5FA",
              textShadow: emph
                ? "0 0 22px rgba(244,184,96,0.6), 0 3px 12px rgba(0,0,0,0.95), 0 0 0 4px rgba(0,0,0,0.9)"
                : "0 3px 12px rgba(0,0,0,0.95), 0 0 0 4px rgba(0,0,0,0.85)",
              opacity: visible ? sp : 0,
              transform: `translateY(${y}px)`,
              filter: `blur(${blur}px)`,
              letterSpacing: emph ? "0.4px" : "0",
              lineHeight: 1.3,
              WebkitTextStroke: "1.5px rgba(0,0,0,0.95)",
            }}>{w.word}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Slide background — Ken Burns subtle zoom + pan, fade in 200ms
const SlideBg: React.FC<{ src: string; duration: number }> = ({ src, duration }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const fadeIn = interpolate(t, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
  // Subtle zoom 1.00 → 1.05 over full duration
  const scale = interpolate(t, [0, duration], [1.02, 1.06], { extrapolateRight: "clamp" });
  const yShift = interpolate(t, [0, duration], [0, -10], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#08080F" }}>
      <div style={{ width: W, height: H, opacity: fadeIn, transform: `scale(${scale}) translateY(${yShift}px)`, transformOrigin: "center" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </AbsoluteFill>
  );
};

export const Top5SubagentsVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#08080F" }}>
      <Audio src={staticFile("subagents_video/voice.mp3")} />
      {beats.map((b) => (
        <Sequence key={b.index} from={Math.round(b.start * FPS)} durationInFrames={Math.round(b.duration * FPS)}>
          <SlideBg src={`subagents_video/slide_${b.index}.png`} duration={b.duration} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
