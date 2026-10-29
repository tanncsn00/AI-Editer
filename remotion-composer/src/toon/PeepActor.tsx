import React from "react";
import { useCurrentFrame } from "remotion";
import Peep from "react-peeps";
import { MouthCue, visemeAt } from "./Character";

type PeepProps = React.ComponentProps<typeof Peep>;
type FaceName = NonNullable<PeepProps["face"]>;

export type Mood = "neutral" | "smile" | "worried" | "scared" | "angry";

const TALK_FACES: Record<Mood, { closed: FaceName; open: FaceName }> = {
  neutral: { closed: "Blank", open: "Explaining" },
  smile: { closed: "Smile", open: "SmileTeeth" },
  worried: { closed: "Solemn", open: "Concerned" },
  scared: { closed: "Fear", open: "Hectic" },
  angry: { closed: "Angry", open: "Rage" },
};
const CLOSED_VISEMES = new Set(["X", "A"]);
const SKIN = "#fffdf8";
const INK = "#1b1717";

export type PeepLook = Pick<PeepProps, "hair" | "accessory" | "facialHair"> & { shirt: string; id: string };

export type SpokenBy = { start: number; end: number; mouth: MouthCue[] };

export const PeepActor: React.FC<{
  look: PeepLook;
  body: PeepProps["body"];
  mood?: Mood;
  face?: FaceName;
  line?: SpokenBy;
  flip?: boolean;
  noGlasses?: boolean;
  viewBox?: PeepProps["viewBox"];
  seed?: number;
  time?: number;
}> = ({ look, body, mood = "neutral", face, line, flip = false, noGlasses = false, viewBox, seed = 0, time }) => {
  const frame = useCurrentFrame();
  const t = time ?? frame / 30;
  const speaking = !!line && t >= line.start - 0.03 && t <= line.end + 0.03;
  const open = speaking && !CLOSED_VISEMES.has(visemeAt(line!.mouth, t));
  const shown: FaceName = speaking ? (open ? TALK_FACES[mood].open : TALK_FACES[mood].closed) : (face ?? TALK_FACES[mood].closed);
  const bob = Math.sin((frame + seed * 13) / 8) * (speaking ? 10 : 4);
  const tilt = speaking ? Math.sin((frame + seed * 7) / 7) * 1.5 : 0;
  const cls = `peep-${look.id}`;
  return (
    <div className={cls} style={{ width: "100%", height: "100%", transform: `translateY(${bob}px) rotate(${tilt}deg) scaleX(${flip ? -1 : 1})`, transformOrigin: "50% 90%" }}>
      <style>{`.${cls} svg > g > g:first-child [fill="${SKIN}"] { fill: ${look.shirt}; }`}</style>
      <Peep
        style={{ width: "100%", height: "100%" }}
        strokeColor={INK}
        backgroundColor={SKIN}
        hair={look.hair}
        facialHair={look.facialHair}
        accessory={noGlasses ? "None" : look.accessory}
        face={shown}
        body={body}
        viewBox={viewBox}
      />
    </div>
  );
};
