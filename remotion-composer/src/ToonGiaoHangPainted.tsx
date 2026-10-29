import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BoxCaption } from "./toon/BoxCaption";
import { DialogueLine } from "./toon/Timing";
import dialogue from "./toon_giao_hang_dialogue.json";

const FPS = 30;
const SLUG = "toon_giao_hang";
export const TOON_GIAO_HANG_PAINTED_FRAMES = Math.ceil(dialogue.total * FPS);

const LINES = dialogue.items.filter((it) => it.kind === "line") as DialogueLine[];
const L = (i: number) => {
  const line = LINES[i];
  if (!line) throw new Error(`dialogue line ${i} missing — dialogue.md changed?`);
  return line;
};
const before = (i: number, lead = 0.1) => L(i).start - lead;
const after = (i: number, tail = 0.08) => L(i).end + tail;

const REBORN = L(12).end + 0.25;
const REBORN_CARD = 0.9;

const SFX = [
  { at: L(0).start, src: "sfx/punch/vine-boom.mp3", vol: 0.32 },
  { at: after(1), src: "sfx/funny/record-scratch.mp3", vol: 0.4 },
  { at: after(1) + 0.3, src: "sfx/fail/sad-violin.mp3", vol: 0.28 },
  { at: before(4, 0.12), src: "sfx/ui/whoosh.mp3", vol: 0.4 },
  { at: before(5, 0.12), src: "sfx/ui/whoosh.mp3", vol: 0.4 },
  { at: before(6, 0.12), src: "sfx/ui/whoosh.mp3", vol: 0.4 },
  { at: after(6, 0.12), src: "sfx/fail/roblox-oof.mp3", vol: 0.45 },
  { at: L(7).end, src: "sfx/punch/bonk.mp3", vol: 0.5 },
  { at: after(9), src: "sfx/funny/record-scratch.mp3", vol: 0.4 },
  { at: L(11).end + 0.02, src: "sfx/punch/vine-boom.mp3", vol: 0.45 },
  { at: L(12).end, src: "sfx/punch/bonk.mp3", vol: 0.5 },
  { at: REBORN, src: "sfx/ui/whoosh.mp3", vol: 0.45 },
  { at: L(15).end + 0.05, src: "sfx/funny/laugh-track.mp3", vol: 0.35 },
];

const NextLifeCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 9, stiffness: 220, mass: 0.5 } });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          padding: "18px 48px",
          background: "#FFD24A",
          border: "8px solid #111",
          borderRadius: 26,
          boxShadow: "0 10px 0 #111",
          fontFamily: "'Be Vietnam Pro', sans-serif",
          fontWeight: 800,
          fontSize: 120,
          color: "#111",
          transform: `scale(${p}) rotate(-4deg)`,
        }}
      >
        KIẾP SAU…
      </div>
    </AbsoluteFill>
  );
};

export const ToonGiaoHangPainted: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <OffthreadVideo src={staticFile(`${SLUG}/anim.mp4`)} muted />
    <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
    {SFX.map((s, i) => (
      <Sequence key={i} from={Math.round(s.at * FPS)} layout="none">
        <Audio src={staticFile(s.src)} volume={s.vol} />
      </Sequence>
    ))}
    <Sequence from={Math.round(REBORN * FPS)} durationInFrames={Math.round(REBORN_CARD * FPS)} layout="none">
      <NextLifeCard />
    </Sequence>
    <BoxCaption lines={LINES} top={1500} />
  </AbsoluteFill>
);
