import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadPangolin } from "@remotion/google-fonts/Pangolin";
import { MouthCue } from "./toon/Character";
import { DialogueCaption, SpokenLine } from "./toon/DialogueCaption";
import { Mood, PeepActor, PeepLook } from "./toon/PeepActor";
import { LeaveHistory, PaperDesk, PaperWall, PhoneStory, Stamp, Suitcase, Ticket } from "./toon/PaperSet";
import dialogue from "./toon_xin_nghi_phep_dialogue.json";

loadPangolin("normal", { weights: ["400"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FPS = 30;
const SLUG = "toon_xin_nghi_phep";
export const TOON_XIN_NGHI_PHEP_FRAMES = Math.ceil(dialogue.total * FPS);

type Line = SpokenLine & { speaker: "TUAN" | "SEP" | "HANH"; mouth: MouthCue[] };
const LINES = dialogue.items.filter((it) => it.kind === "line") as Line[];
const L = (i: number) => {
  const line = LINES[i];
  if (!line) throw new Error(`dialogue line ${i} missing — dialogue.md changed?`);
  return line;
};

const TUAN: PeepLook = { id: "tuan", hair: "ShortMessy", shirt: "#F2C14E" };
const SEP: PeepLook = { id: "sep", hair: "BaldTop", accessory: "GlassRoundThick", facialHair: "MoustacheThin", shirt: "#3F5BA9" };
const HANH: PeepLook = { id: "hanh", hair: "Bun", shirt: "#E4574C" };

const before = (i: number, lead = 0.12) => L(i).start - lead;
const after = (i: number, tail = 0.1) => L(i).end + tail;

const SFX = [
  { at: L(6).start, src: "sfx/ui/iphone-ding.mp3", vol: 0.45 },
  { at: L(7).start, src: "sfx/ui/iphone-ding.mp3", vol: 0.45 },
  { at: L(8).start + 0.9, src: "sfx/punch/metal-pipe.mp3", vol: 0.32 },
  { at: after(8, 0.1), src: "sfx/funny/record-scratch.mp3", vol: 0.4 },
  { at: after(10, 0.02), src: "sfx/punch/vine-boom.mp3", vol: 0.5 },
  { at: after(14, 0.1), src: "sfx/punch/emotional-damage.mp3", vol: 0.5 },
  { at: after(17, 0.02), src: "sfx/punch/airhorn.mp3", vol: 0.28 },
  { at: after(20, 0.08), src: "sfx/funny/crickets.mp3", vol: 0.35 },
  { at: after(21, 0.05), src: "sfx/funny/laugh-track.mp3", vol: 0.35 },
];

const Shot: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={Math.round(from * FPS)} durationInFrames={Math.max(1, Math.round((to - from) * FPS))} layout="none">
    {children}
  </Sequence>
);

const SequenceOffset = React.createContext<number>(0);
const useSequenceOffset = () => React.useContext(SequenceOffset);

const BUST_W = 1000;
const BUST_H = BUST_W * (1200 / 850);

const Single: React.FC<{
  look: PeepLook;
  body: React.ComponentProps<typeof PeepActor>["body"];
  mood?: Mood;
  face?: React.ComponentProps<typeof PeepActor>["face"];
  lines?: number[];
  flip?: boolean;
  noGlasses?: boolean;
  zoom?: [number, number];
  y?: number;
  wallX?: number;
  children?: React.ReactNode;
}> = ({ look, body, mood, face, lines = [], flip, noGlasses, zoom = [1, 1], y = 200, wallX = 0, children }) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 10], zoom, { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <PaperWall zoom={1.6} x={wallX} y={160} />
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "540px 700px" }}>
        <div style={{ position: "absolute", left: 40, top: y, width: BUST_W, height: BUST_H }}>
          <SpeakingActor look={look} body={body} mood={mood} face={face} lines={lines} flip={flip} noGlasses={noGlasses} />
        </div>
        {children}
      </AbsoluteFill>
      <PaperDesk top={1480} />
    </AbsoluteFill>
  );
};

const SpeakingActor: React.FC<Omit<React.ComponentProps<typeof PeepActor>, "line"> & { lines: number[] }> = ({ lines, ...props }) => {
  const time = useCurrentFrame() / FPS + useSequenceOffset();
  const line = lines.map(L).find((l) => time >= l.start - 0.05 && time <= l.end + 0.05);
  return <PeepActor {...props} line={line} time={time} />;
};

const At: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Shot from={from} to={to}>
    <SequenceOffset.Provider value={Math.round(from * FPS) / FPS}>{children}</SequenceOffset.Provider>
  </Shot>
);

const Ducking: React.FC = () => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [0, 12], [0, 1100], { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  return (
    <AbsoluteFill>
      <PaperWall zoom={1.6} x={260} y={160} />
      <div style={{ position: "absolute", left: 40, top: 200 + drop, width: BUST_W, height: BUST_H }}>
        <PeepActor look={SEP} body="BlazerBlackTee" face="Serious" flip noGlasses />
      </div>
      <PaperDesk top={1480} />
    </AbsoluteFill>
  );
};

const SuitcaseReveal: React.FC<{ lines: number[]; rise?: boolean }> = ({ lines, rise }) => {
  const frame = useCurrentFrame();
  const up = rise ? interpolate(frame, [0, 8], [900, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.6)) }) : 0;
  return (
    <AbsoluteFill>
      <PaperWall zoom={1.6} x={260} y={160} />
      <div style={{ position: "absolute", left: 40, top: 200 + up, width: BUST_W, height: BUST_H }}>
        <SpeakingActor look={SEP} body="BlazerBlackTee" mood="smile" lines={lines} flip noGlasses />
      </div>
      <Suitcase color="#7FB2FF" style={{ position: "absolute", left: 600, top: 1030 + up * 1.2, transform: "rotate(8deg) scale(1.25)" }} />
      <PaperDesk top={1480} />
    </AbsoluteFill>
  );
};

const TwoShotStare: React.FC = () => (
  <AbsoluteFill>
    <PaperWall zoom={1.2} />
    <div style={{ position: "absolute", left: 380, top: 420, width: 700, height: 700 * (1200 / 850) }}>
      <PeepActor look={SEP} body="BlazerBlackTee" face="Suspicious" flip noGlasses />
    </div>
    <div style={{ position: "absolute", left: -60, top: 640, width: 860, height: 860 * (1200 / 850) }}>
      <PeepActor look={TUAN} body="Hoodie" face="Suspicious" seed={2} />
    </div>
    <PaperDesk top={1520} />
  </AbsoluteFill>
);

const Walker: React.FC<{ look: PeepLook; x0: number; y: number; w: number; delay: number; suitcase: string }> = ({ look, x0, y, w, delay, suitcase }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [delay, delay + 2.6 * FPS], [x0, x0 + 1250], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const hop = Math.abs(Math.sin((frame + delay) / 4)) * -18;
  return (
    <div style={{ position: "absolute", left: x, top: y + hop, width: w, height: w * 1.25 }}>
      <PeepActor look={look} body="WalkingBW" face="SmileBig" viewBox={{ x: "-200", y: "-100", width: "1800", height: "2250" }} />
      <Suitcase color={suitcase} style={{ position: "absolute", left: w * 0.62, top: w * 0.72, width: w * 0.32, height: w * 0.4 }} />
    </div>
  );
};

const Exodus: React.FC = () => {
  const frame = useCurrentFrame();
  const dim = interpolate(frame, [1.6 * FPS, 2.4 * FPS], [0, 0.82], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <PaperWall zoom={1} dim={dim} />
      <Walker look={SEP} x0={-640} y={560} w={660} delay={0} suitcase="#7FB2FF" />
      <Walker look={HANH} x0={-920} y={620} w={660} delay={6} suitcase="#FFE9A8" />
      <Walker look={TUAN} x0={-1200} y={680} w={680} delay={12} suitcase="#4FD1A5" />
      <PaperDesk top={1480} />
      <Stamp text={"BÀ NGOẠI ỐM: 3\nĐI LÀM: 0"} top={150} appearAt={0.9} color="#E4574C" size={96} />
    </AbsoluteFill>
  );
};

export const ToonXinNghiPhep: React.FC = () => (
  <AbsoluteFill style={{ background: "#F4EFE6" }}>
    <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
    {SFX.map((s, i) => (
      <Sequence key={i} from={Math.round(s.at * FPS)} layout="none">
        <Audio src={staticFile(s.src)} volume={s.vol} />
      </Sequence>
    ))}

    <At from={0} to={before(2, 0.3)}>
      <Single look={TUAN} body="Geek" mood="neutral" face="Driven" lines={[0, 1]} wallX={-200}>
        <Stamp text="THỨ NĂM · 16:58" top={90} appearAt={0.15} color="#1b1717" size={64} />
      </Single>
    </At>
    <At from={before(2, 0.3)} to={before(3)}><Single look={TUAN} body="Hoodie" mood="smile" lines={[2]} wallX={-200} /></At>
    <At from={before(3)} to={before(4)}><Single look={SEP} body="Geek" mood="neutral" face="Serious" lines={[3]} flip wallX={260} /></At>
    <At from={before(4)} to={before(5)}><Single look={TUAN} body="Hoodie" mood="worried" lines={[4]} wallX={-200} /></At>
    <At from={before(5)} to={before(6, 0.4)}><Single look={SEP} body="BlazerBlackTee" mood="neutral" face="Cheeky" lines={[5]} flip wallX={260} /></At>
    <At from={before(6, 0.4)} to={after(8, 0.1)}>
      <AbsoluteFill>
        <PaperWall zoom={2.2} x={-300} />
        <LeaveHistory
          title="LỊCH SỬ XIN NGHỈ · TUẤN"
          rows={[
            { label: "Tháng 3 · Bà ngoại ốm", at: L(6).start - before(6, 0.4) },
            { label: "Tháng 6 · Bà ngoại nhập viện", at: L(7).start - before(6, 0.4) },
            { label: "Tháng 8 · Đám tang bà ngoại", at: L(8).start - before(6, 0.4) },
          ]}
        />
        <PaperDesk top={1480} />
      </AbsoluteFill>
    </At>
    <At from={after(8, 0.1)} to={before(10)}><Single look={TUAN} body="Hoodie" mood="scared" face="Hectic" lines={[9]} zoom={[1, 1.22]} wallX={-200} /></At>
    <At from={before(10)} to={before(11)}><Single look={SEP} body="BlazerBlackTee" mood="neutral" face="Serious" lines={[10]} flip zoom={[1.15, 1.15]} wallX={260} /></At>
    <At from={before(11)} to={before(12)}><Single look={TUAN} body="Hoodie" mood="smile" face="SmileTeeth" lines={[11]} wallX={-200} /></At>
    <At from={before(12)} to={before(13)}><Single look={SEP} body="BlazerBlackTee" mood="neutral" face="Suspicious" lines={[12]} flip wallX={260} /></At>
    <At from={before(13)} to={before(14, 0.5)}><Single look={TUAN} body="Hoodie" mood="smile" face="SmileTeeth" lines={[13]} wallX={-200} /></At>
    <At from={before(14, 0.5)} to={L(14).start + 1.55}><Single look={HANH} body="Device" mood="neutral" face="Cheeky" lines={[14]} flip wallX={120} /></At>
    <At from={L(14).start + 1.55} to={after(14, 0.08)}>
      <AbsoluteFill>
        <PaperWall zoom={2.2} x={300} />
        <PhoneStory appearAt={0} />
        <PaperDesk top={1480} />
      </AbsoluteFill>
    </At>
    <At from={after(14, 0.08)} to={before(15)}><Single look={TUAN} body="Hoodie" face="ConcernedFear" zoom={[1, 1.25]} wallX={-200} /></At>
    <At from={before(15)} to={before(16)}><Single look={SEP} body="BlazerBlackTee" mood="neutral" face="Serious" lines={[15]} flip noGlasses wallX={260} /></At>
    <At from={before(16)} to={after(16, 0.15)}><Single look={TUAN} body="Hoodie" mood="worried" lines={[16]} wallX={-200} /></At>
    <At from={after(16, 0.15)} to={before(17, 0.08)}><Ducking /></At>
    <At from={before(17, 0.08)} to={before(18, 0.08)}><SuitcaseReveal lines={[17]} rise /></At>
    <At from={before(18, 0.08)} to={before(19)}><Single look={TUAN} body="Hoodie" mood="scared" face="Awe" lines={[18]} zoom={[1.1, 1.35]} wallX={-200} /></At>
    <At from={before(19)} to={before(20)}><SuitcaseReveal lines={[19]} /></At>
    <At from={before(20)} to={after(20, 0.08)}><Single look={HANH} body="Device" mood="worried" lines={[20]} flip wallX={120} /></At>
    <At from={after(20, 0.08)} to={before(21, 0.05)}><TwoShotStare /></At>
    <At from={before(21, 0.05)} to={after(21, 0.15)}>
      <Single look={HANH} body="Device" mood="smile" face="Cheeky" lines={[21]} flip wallX={120} zoom={[1.1, 1.1]}>
        <Ticket name="NGUYEN THI HANH" style={{ position: "absolute", left: 280, top: 980, transform: "rotate(-8deg) scale(1.05)" }} />
      </Single>
    </At>
    <At from={after(21, 0.15)} to={dialogue.total}><Exodus /></At>

    <DialogueCaption lines={LINES} top={1600} />
  </AbsoluteFill>
);
