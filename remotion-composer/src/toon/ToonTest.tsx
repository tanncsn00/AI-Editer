import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BG } from "../whiteboard/shapes";
import { Character, Look, MouthCue, visemeAt } from "./Character";
import cues from "./toon_test_mouth.json";

export const TOON_TEST_FRAMES = Math.ceil(cues.metadata.duration * 30) + 15;

const BOSS: Look = { face: 13, nose: 2, mouth: 4, eyes: 0, eyebrows: 10, glasses: 1, hair: 17 };
const STAFF: Look = { face: 0, nose: 0, mouth: 1, eyes: 1, eyebrows: 0, hair: 5 };

export const ToonTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const viseme = visemeAt(cues.mouthCues as MouthCue[], frame / fps);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("toon_test/line.wav")} />
      <div style={{ position: "absolute", left: -60, top: 260, width: 760, height: 1055 }}>
        <Character look={BOSS} viseme={viseme} shirt="#fff" tie="#FF4D5E" />
      </div>
      <div style={{ position: "absolute", left: 420, top: 900, width: 720, height: 1000 }}>
        <Character look={STAFF} flip brows={9} seed={3} shirt="#7FB2FF" />
      </div>
    </AbsoluteFill>
  );
};
