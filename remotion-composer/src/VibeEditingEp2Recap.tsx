import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { Ep2Slide } from "./VibeEditingEp2Slides";

const FPS = 30;

// Slide cut times (sec) — start of each slide. Last slide goes till end.
const CUTS = [
  { idx: 0,  t: 0.0 },
  { idx: 1,  t: 4.7 },
  { idx: 2,  t: 10.7 },
  { idx: 3,  t: 15.2 },
  { idx: 4,  t: 20.7 },
  { idx: 5,  t: 26.2 },
  { idx: 6,  t: 32.7 },
  { idx: 7,  t: 40.2 },
  { idx: 8,  t: 47.7 },
  { idx: 9,  t: 56.2 },
  { idx: 10, t: 62.7 },
  { idx: 11, t: 70.7 },
  { idx: 12, t: 76.2 },
];
const TOTAL = 84.0;

const SlideAt: React.FC<{ idx: number }> = ({ idx }) => <Ep2Slide idx={idx} />;

const KenBurns: React.FC<{ children: React.ReactNode; from: number; to: number; dir: number }> = ({
  children, from, to, dir,
}) => {
  const f = useCurrentFrame();
  const local = (f - from) / (to - from);
  const scale = interpolate(local, [0, 1], [1.0, 1.04 + dir * 0.01], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tx = interpolate(local, [0, 1], [0, dir * 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${scale}) translateX(${tx}px)` }}>
      {children}
    </div>
  );
};

const Crossfade: React.FC<{ children: React.ReactNode; from: number; dur: number; isLast?: boolean }> = ({
  children, from, dur, isLast = false,
}) => {
  const f = useCurrentFrame();
  const fadeIn = 8;
  const fadeOut = isLast ? 30 : 6;
  const opacity = interpolate(
    f,
    [from, from + fadeIn, from + dur - fadeOut, from + dur],
    [0, 1, 1, isLast ? 1 : 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <div style={{ position: "absolute", inset: 0, opacity }}>{children}</div>;
};

export const VibeEditingEp2Recap: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#F3EAD8" }}>
      {CUTS.map((cut, i) => {
        const startF = Math.round(cut.t * FPS);
        const nextT = i + 1 < CUTS.length ? CUTS[i + 1].t : TOTAL;
        const durF = Math.round((nextT - cut.t) * FPS);
        const dir = i % 2 === 0 ? 1 : -1;
        const isLast = i === CUTS.length - 1;
        return (
          <Sequence key={i} from={startF} durationInFrames={durF + (isLast ? 0 : 12)}>
            <Crossfade from={0} dur={durF} isLast={isLast}>
              <KenBurns from={0} to={durF} dir={dir}>
                <SlideAt idx={cut.idx} />
              </KenBurns>
            </Crossfade>
          </Sequence>
        );
      })}

      <Audio src={staticFile("vibe-ep2/recap_narration.mp3")} volume={1.0} />
    </AbsoluteFill>
  );
};
