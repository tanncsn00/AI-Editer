import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";
import beatsData from "./tc_beats.json";

loadEBGaramond("normal", { weights: ["400", "500", "600"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500"], subsets: ["latin"] });

const FPS = 30;
const INK = "#04070A";
const JADE = "#4ADE80";
const PAPER = "#DCE8E0";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const at = (name: string) => {
  const b = beats.find((x) => x.name === name)!;
  return { from: Math.round(b.start * FPS), dur: Math.round(b.duration * FPS) };
};

const XFADE = 16;

const Shot: React.FC<{ src: string; dur: number }> = ({ src, dur }) => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, XFADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(f, [dur - XFADE, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoom = interpolate(f, [0, dur], [1.06, 1.13], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo src={staticFile(`tucode/fg/${src}`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 1180px at 50% 50%, transparent 32%, rgba(0,0,0,0.62) 100%)" }} />
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${INK} 0%, transparent 18%, transparent 76%, ${INK} 100%)` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(6,14,10,0.30) 0%, rgba(4,7,10,0.42) 100%)" }} />
  </AbsoluteFill>
);

const RubberDuck: React.FC<{ e: number }> = ({ e }) => {
  const f = useCurrentFrame();
  const pop = interpolate(f, [e, e + 6, e + 11], [0, 1.18, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bob = Math.sin((f - e) / 5) * 7;
  const rot = Math.sin((f - e) / 7) * 4;
  return (
    <div style={{ transform: `scale(${pop}) translateY(${bob}px) rotate(${rot}deg)`, filter: "drop-shadow(0 0 46px #FFD54A66)" }}>
      <svg width={300} height={268} viewBox="0 0 280 250">
        <ellipse cx="140" cy="182" rx="96" ry="54" fill="#FFC93C" />
        <ellipse cx="196" cy="176" rx="52" ry="40" fill="#FFD75E" />
        <circle cx="188" cy="104" r="62" fill="#FFD54A" />
        <path d="M240 104 L286 118 L240 132 Z" fill="#FF8A3D" />
        <circle cx="206" cy="92" r="9" fill="#1A1206" />
        <circle cx="209" cy="89" r="3" fill="#FFF" />
        <path d="M78 172 Q52 150 62 128" stroke="#F0B429" strokeWidth="8" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
};

const Quack: React.FC = () => {
  const f = useCurrentFrame();
  const dim = interpolate(f, [0, 16], [0, 0.82], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const label = interpolate(f, [22, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: INK, opacity: dim }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 38 }}>
        <RubberDuck e={12} />
        <div style={{ opacity: label, fontFamily: "JetBrains Mono", fontSize: 34, color: JADE, letterSpacing: 5 }}>RUBBER DUCK DEBUGGING</div>
        <div style={{ opacity: label, fontFamily: "EB Garamond", fontSize: 48, color: PAPER, fontStyle: "italic" }}>chân đạo, hoá ra ở đây.</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TuCodeFootage: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => {
  const SHOTS: [string, string][] = [
    ["INTRO", "cut_intro.mp4"],
    ["CAU1", "cut_v1.mp4"],
    ["CAU2", "cut_v2.mp4"],
    ["CAU3", "cut_v3.mp4"],
    ["CAU4", "cut_v4.mp4"],
  ];
  const quackAt = at("QUACK");
  const voiceFrom = at("CAU1").from;
  return (
    <AbsoluteFill style={{ background: INK }}>
      {SHOTS.map(([name, file]) => {
        const { from, dur } = at(name);
        const extend = name === "CAU4" ? quackAt.dur : 0;
        return (
          <Sequence key={name} from={from} durationInFrames={dur + extend}>
            <Shot src={file} dur={dur + extend} />
          </Sequence>
        );
      })}
      <Vignette />
      <Sequence from={voiceFrom}>
        <Audio src={staticFile("tucode/voice.mp3")} />
      </Sequence>
      {bgm ? <Audio src={staticFile("tucode/bgm.mp3")} volume={0.2} /> : null}
      <Sequence from={quackAt.from + 12}>
        <Audio src={staticFile("tucode/quack.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={quackAt.from} durationInFrames={quackAt.dur}>
        <Quack />
      </Sequence>
    </AbsoluteFill>
  );
};
