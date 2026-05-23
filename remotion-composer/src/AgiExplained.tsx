import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import beatsData from "./agi_explained_beats.json";

loadBeVietnamPro("normal", { weights: ["600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FPS = 30;
const W = 1080;
const H = 1920;

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;

const SlideBg: React.FC<{ src: string; duration: number }> = ({ src, duration }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const fadeIn = interpolate(t, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });
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

export const AgiExplained: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#08080F" }}>
      <Audio src={staticFile("agi_explained/voice.mp3")} />
      {beats.map((b) => (
        <Sequence key={b.index} from={Math.round(b.start * FPS)} durationInFrames={Math.round(b.duration * FPS)}>
          <SlideBg src={`agi_explained/slide_${b.index}.png`} duration={b.duration} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
