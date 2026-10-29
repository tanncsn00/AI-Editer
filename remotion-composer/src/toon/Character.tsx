import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import notion from "./notion_parts.json";

type PartType = "face" | "nose" | "mouth" | "eyes" | "eyebrows" | "glasses" | "hair" | "accessories" | "details" | "beard";
export type Look = Partial<Record<PartType, number>> & { face: number; mouth: number; eyes: number };
export type Viseme = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "X";
export type MouthCue = { start: number; end: number; value: Viseme };

const LAYERS: PartType[] = ["face", "nose", "mouth", "eyes", "eyebrows", "glasses", "hair", "accessories", "details", "beard"];
const PARTS = notion.parts as Record<PartType, Record<string, string>>;
const VISEME_MOUTH: Record<Exclude<Viseme, "X">, number> = { A: 2, B: 14, C: 12, D: 11, E: 5, F: 5, G: 14, H: 12 };
const CLOSED_EYES = 11;
const OUTLINE_CLASS = "toon-outline";
const OUTLINE_CSS = `.${OUTLINE_CLASS} * { stroke: #fff !important; stroke-width: 56px !important; fill: #fff !important; stroke-linejoin: round !important; }`;
const BLINK_FRAMES = 4;
const BLINK_EVERY_S = 3.2;

export const visemeAt = (cues: MouthCue[], t: number): Viseme =>
  cues.find((c) => t >= c.start && t < c.end)?.value ?? "X";

const part = (type: PartType, index: number) => {
  const svg = PARTS[type][String(index)];
  if (svg === undefined) throw new Error(`notion part ${type}/${index} does not exist`);
  return svg;
};

const Body: React.FC<{ shirt: string; tie?: string }> = ({ shirt, tie }) => (
  <g stroke="black" strokeWidth={16} strokeLinejoin="round" strokeLinecap="round">
    <path d="M492 860 L492 945 C360 968 285 1030 262 1170 L246 1560 L834 1560 L818 1170 C795 1030 720 968 588 945 L588 860 Z" fill={shirt} />
    <path d="M492 945 L540 1030 L588 945" fill="#fff" />
    {tie && <path d="M540 1030 L520 1070 L540 1260 L560 1070 Z" fill={tie} />}
  </g>
);

export const Character: React.FC<{
  look: Look;
  viseme?: Viseme;
  brows?: number;
  flip?: boolean;
  shirt?: string;
  tie?: string;
  seed?: number;
  noBlink?: boolean;
}> = ({ look, viseme = "X", brows, flip = false, shirt = "#fff", tie, seed = 0, noBlink = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blinkCycle = Math.round(BLINK_EVERY_S * fps);
  const blinking = !noBlink && (frame + seed * 37) % blinkCycle < BLINK_FRAMES;
  const talking = viseme !== "X";
  const bob = Math.sin((frame + seed * 11) / 9) * (talking ? 7 : 3);
  const tilt = talking ? Math.sin((frame + seed * 5) / 6) * 1.6 : 0;

  const resolved: Look = {
    ...look,
    mouth: talking ? VISEME_MOUTH[viseme] : look.mouth,
    eyes: blinking ? CLOSED_EYES : look.eyes,
    ...(brows !== undefined ? { eyebrows: brows } : {}),
  };
  const head = LAYERS.filter((t) => resolved[t] !== undefined)
    .map((t) => `<g${t === "face" ? ' fill="#ffffff"' : ""}>${part(t, resolved[t]!)}</g>`)
    .join("");

  const bodyMove = `translate(0 ${bob * 0.4})`;
  const headMove = `translate(0 ${bob}) rotate(${tilt} 540 760)`;
  return (
    <svg viewBox="0 0 1080 1500" width="100%" height="100%" style={{ overflow: "visible" }}>
      <style>{OUTLINE_CSS}</style>
      <g transform={flip ? "scale(-1,1) translate(-1080,0)" : undefined}>
        <g className={OUTLINE_CLASS}>
          <g transform={bodyMove}>
            <Body shirt={shirt} tie={tie} />
          </g>
          <g transform={headMove} dangerouslySetInnerHTML={{ __html: head }} />
        </g>
        <g transform={bodyMove}>
          <Body shirt={shirt} tie={tie} />
        </g>
        <g transform={headMove} dangerouslySetInnerHTML={{ __html: head }} />
      </g>
    </svg>
  );
};
