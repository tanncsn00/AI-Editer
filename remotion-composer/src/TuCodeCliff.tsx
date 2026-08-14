import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import wordsData from "./tc_words.json";

loadEBGaramond("normal", { weights: ["400", "500", "600"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FPS = 30;
const INK = "#04070A";
const PAPER = "#F2F6F3";

type Word = { w: string; t: number };
type LineBlock = { beat: number; start: number; end: number; six: number; words: Word[] };
const lines = (wordsData as { lines: LineBlock[] }).lines;

const QUACK_AT = 21.6;
const TOTAL = 27;

const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 900px 1250px at 50% 44%, transparent 40%, rgba(0,0,0,0.45) 100%)" }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(4,7,10,0.55) 0%, transparent 22%, transparent 52%, rgba(4,7,10,0.80) 84%, ${INK} 100%)` }} />
  </AbsoluteFill>
);

const WordSpan: React.FC<{ word: Word; lineStart: number }> = ({ word, lineStart }) => {
  const f = useCurrentFrame();
  const e = (word.t - lineStart) * FPS;
  const opacity = interpolate(f, [e - 2, e + 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = interpolate(f, [e - 2, e + 9], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const blur = interpolate(f, [e - 2, e + 8], [7, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${ty}px)`,
        filter: `blur(${blur}px)`,
        marginRight: "0.28em",
      }}
    >
      {word.w}
    </span>
  );
};

const Couplet: React.FC<{ block: LineBlock }> = ({ block }) => {
  const f = useCurrentFrame();
  const dur = Math.round((block.end - block.start) * FPS);
  const out = interpolate(f, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const six = block.words.slice(0, block.six);
  const eight = block.words.slice(block.six);
  const shadow = "0 2px 22px rgba(0,0,0,0.95), 0 0 60px rgba(0,0,0,0.8)";
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 296, paddingLeft: 52, paddingRight: 52, opacity: out }}>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontFamily: "EB Garamond",
            fontSize: 62,
            fontWeight: 600,
            color: PAPER,
            lineHeight: 1.28,
            whiteSpace: "nowrap",
            textShadow: shadow,
          }}
        >
          {six.map((w, i) => (
            <WordSpan key={i} word={w} lineStart={block.start} />
          ))}
        </div>
        <div
          style={{
            fontFamily: "EB Garamond",
            fontSize: 51,
            fontWeight: 500,
            color: PAPER,
            lineHeight: 1.3,
            whiteSpace: "nowrap",
            textShadow: shadow,
          }}
        >
          {eight.map((w, i) => (
            <WordSpan key={i} word={w} lineStart={block.start} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const TuCodeCliff: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => {
  const f = useCurrentFrame();
  const fadeOut = interpolate(f, [(TOTAL - 1.6) * FPS, TOTAL * FPS], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill style={{ opacity: fadeOut }}>
        <OffthreadVideo src={staticFile("tucode/fg/cliff_bg.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <Vignette />
        {lines.map((b) => (
          <Sequence key={b.beat} from={Math.round(b.start * FPS)} durationInFrames={Math.round((b.end - b.start) * FPS)}>
            <Couplet block={b} />
          </Sequence>
        ))}
      </AbsoluteFill>

      <Sequence from={Math.round(lines[0].start * FPS)}>
        <Audio src={staticFile("tucode/voice.mp3")} />
      </Sequence>
      {bgm ? <Audio src={staticFile("tucode/bgm.mp3")} volume={0.2} /> : null}
      <Sequence from={Math.round(QUACK_AT * FPS)}>
        <Audio src={staticFile("tucode/quack.mp3")} volume={0.8} />
      </Sequence>
    </AbsoluteFill>
  );
};
