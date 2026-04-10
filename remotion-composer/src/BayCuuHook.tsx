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

// HOOK — "Bầy Cừu Không Ai Chăn" · Tập 1
// Duration: 8s @ 30fps = 240 frames
// Voice ends ~4.8s, then BẦY big-word drop 5.3–8s

const FPS = 30;
const LEAD_OFFSET = 0.12; // seconds — shift text slightly earlier to offset spring rise-time

type Segment = { start: number; end: number; text: string; emphasis?: boolean };

// From faster-whisper forced alignment on minhtriet_hook.mp3
const SEGMENTS: Segment[] = [
  { start: 0.00, end: 0.28, text: "Có" },
  { start: 0.28, end: 0.44, text: "một" },
  { start: 0.44, end: 0.70, text: "loài" },
  { start: 0.70, end: 0.96, text: "cừu" },
  { start: 0.96, end: 1.14, text: "kỳ", emphasis: true },
  { start: 1.14, end: 1.40, text: "lạ.", emphasis: true },
  { start: 1.84, end: 1.98, text: "Không" },
  { start: 1.98, end: 2.26, text: "ai" },
  { start: 2.26, end: 2.68, text: "lùa." },
  { start: 3.06, end: 3.26, text: "Nó" },
  { start: 3.26, end: 3.50, text: "tự" },
  { start: 3.50, end: 3.70, text: "đi" },
  { start: 3.70, end: 3.84, text: "vào" },
  { start: 3.84, end: 4.26, text: "chuồng.", emphasis: true },
  { start: 4.26, end: 4.62, text: "Mỗi" },
  { start: 4.62, end: 4.80, text: "ngày.", emphasis: true },
].map((s) => ({ ...s, start: Math.max(0, s.start - LEAD_OFFSET) }));

// Multi-clip cut plan (seconds)
type Cut = { src: string; start: number; end: number; scaleFrom: number; scaleTo: number };
const CUTS: Cut[] = [
  // 0.0–2.0s — opening: winter footsteps (Có một loài cừu kỳ lạ)
  { src: "bay_cuu_bg.mp4", start: 0.0, end: 2.0, scaleFrom: 1.02, scaleTo: 1.10 },
  // 2.0–3.0s — snow path (pause · Không ai lùa)
  { src: "bay_cuu_bg2.mp4", start: 2.0, end: 3.0, scaleFrom: 1.04, scaleTo: 1.10 },
  // 3.0–5.0s — dark forest (Nó tự đi vào chuồng. Mỗi ngày.)
  { src: "bay_cuu_bg3.mp4", start: 3.0, end: 5.0, scaleFrom: 1.00, scaleTo: 1.12 },
  // 5.0–8.0s — return to footsteps for BẦY reveal (continuity)
  { src: "bay_cuu_bg.mp4", start: 5.0, end: 8.0, scaleFrom: 1.14, scaleTo: 1.22 },
];

const BIG_WORD = "BẦY";
const BIG_WORD_START = 5.3; // seconds

// ------------ Sub-component: one background cut with crossfade ------------
const CutLayer: React.FC<{ cut: Cut }> = ({ cut }) => {
  const frame = useCurrentFrame();
  const startFrame = cut.start * FPS;
  const endFrame = cut.end * FPS;
  const local = frame - startFrame;
  const fadeFrames = 6;

  const opacity = interpolate(
    frame,
    [startFrame - fadeFrames, startFrame + fadeFrames, endFrame - fadeFrames, endFrame + fadeFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const totalFrames = endFrame - startFrame;
  const scale = interpolate(local, [0, totalFrames], [cut.scaleFrom, cut.scaleTo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (opacity <= 0) return null;

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
          filter: "brightness(0.42) saturate(0.7) contrast(1.06)",
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

export const BayCuuHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade in/out of whole composition
  const globalOpacity = interpolate(
    frame,
    [0, 10, durationInFrames - 10, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // BẦY big drop
  const bigStartFrame = BIG_WORD_START * FPS;
  const bigSpring = spring({
    frame: frame - bigStartFrame,
    fps: FPS,
    config: { damping: 12, stiffness: 90, mass: 1.4 },
  });
  const bigOpacity = frame >= bigStartFrame ? bigSpring : 0;
  const bigScale = interpolate(bigSpring, [0, 1], [1.7, 1.0]);
  const bigBlur = interpolate(bigSpring, [0, 1], [14, 0]);

  // Narration fades out as big word rises
  const narrationOpacity = interpolate(
    frame,
    [bigStartFrame - 10, bigStartFrame + 2],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", opacity: globalOpacity }}>
      {/* Background cuts — stacked, each fades in/out at its window */}
      {CUTS.map((cut, i) => (
        <CutLayer key={i} cut={cut} />
      ))}

      {/* Radial vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 25%, rgba(0,0,0,0.8) 100%)",
        }}
      />
      {/* Bottom gradient for caption */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0) 55%)",
        }}
      />

      {/* Narration typewriter — word-by-word */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 300,
          opacity: narrationOpacity,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0 18px",
            maxWidth: 900,
            padding: "0 60px",
          }}
        >
          {SEGMENTS.map((seg, i) => {
            const segStartFrame = seg.start * FPS;
            const local = frame - segStartFrame;
            const appearSpring = spring({
              frame: local,
              fps: FPS,
              config: { damping: 14, stiffness: 240, mass: 0.4 },
            });
            const visible = frame >= segStartFrame;
            const y = interpolate(appearSpring, [0, 1], [14, 0]);
            const blur = interpolate(appearSpring, [0, 1], [4, 0]);

            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
                  fontWeight: seg.emphasis ? 800 : 600,
                  fontSize: seg.emphasis ? 70 : 58,
                  color: seg.emphasis ? "#F4B860" : "#F5F5F0",
                  textShadow: seg.emphasis
                    ? "0 0 26px rgba(244,184,96,0.6), 0 4px 14px rgba(0,0,0,0.95)"
                    : "0 3px 12px rgba(0,0,0,0.95)",
                  opacity: visible ? appearSpring : 0,
                  transform: `translateY(${y}px)`,
                  filter: `blur(${blur}px)`,
                  letterSpacing: seg.emphasis ? "0.5px" : "0",
                  lineHeight: 1.25,
                }}
              >
                {seg.text}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* BẦY — big drop word center */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: bigOpacity,
        }}
      >
        <div
          style={{
            transform: `scale(${bigScale})`,
            filter: `blur(${bigBlur}px)`,
          }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
              fontWeight: 500,
              fontSize: 320,
              color: "#F5F5F0",
              letterSpacing: "18px",
              textShadow:
                "0 0 40px rgba(255,255,255,0.25), 0 0 120px rgba(244,184,96,0.2), 0 8px 30px rgba(0,0,0,0.95)",
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            {BIG_WORD}
          </div>
          <div
            style={{
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontWeight: 300,
              fontSize: 30,
              color: "#C9C9C0",
              letterSpacing: "6px",
              textAlign: "center",
              marginTop: 28,
              textTransform: "uppercase",
              textShadow: "0 2px 10px rgba(0,0,0,0.95)",
            }}
          >
            tập 1 · bầy cừu không ai chăn
          </div>
        </div>
      </AbsoluteFill>

      {/* Audio */}
      <Audio src={staticFile("bay_cuu_voice.mp3")} volume={0.75} />
      <Audio src={staticFile("bay_cuu_music.mp3")} volume={0.09} />
    </AbsoluteFill>
  );
};
