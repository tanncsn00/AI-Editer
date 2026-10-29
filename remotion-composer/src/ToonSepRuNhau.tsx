import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { BLUE, GOLD, RED } from "./whiteboard/shapes";
import { Character, Look, MouthCue, Viseme, visemeAt } from "./toon/Character";
import { DialogueCaption, SpokenLine } from "./toon/DialogueCaption";
import { Desk, OfficeWall } from "./toon/Office";
import dialogue from "./toon_sep_ru_nhau_dialogue.json";

loadBeVietnamPro("normal", { weights: ["800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FPS = 30;
const SLUG = "toon_sep_ru_nhau";
export const TOON_SEP_RU_NHAU_FRAMES = Math.ceil(dialogue.total * FPS);

type Line = SpokenLine & { speaker: "SEP" | "NV"; mouth: MouthCue[] };
const LINES = dialogue.items.filter((it) => it.kind === "line") as Line[];
const lineOf = (speaker: Line["speaker"], nth: number) => {
  const found = LINES.filter((l) => l.speaker === speaker)[nth];
  if (!found) throw new Error(`no line #${nth} for ${speaker}`);
  return found;
};

const SEP: Look = { face: 13, nose: 2, mouth: 4, eyes: 0, eyebrows: 10, glasses: 1, hair: 17 };
const NV: Look = { face: 0, nose: 0, mouth: 1, eyes: 1, eyebrows: 0, hair: 5 };
const COLLEAGUES: Look[] = [
  { face: 1, nose: 0, mouth: 17, eyes: 3, eyebrows: 0, hair: 19 },
  { face: 2, nose: 4, mouth: 17, eyes: 3, eyebrows: 3, hair: 6, glasses: 7 },
  { face: 8, nose: 3, mouth: 17, eyes: 3, eyebrows: 5, hair: 16, beard: 9 },
];

const CUTS = {
  bossAsks: lineOf("SEP", 0).start - 0.08,
  staffDodges: lineOf("NV", 0).start - 0.12,
  bossBait: lineOf("SEP", 1).start - 0.12,
  staffBites: lineOf("SEP", 1).end + 0.05,
  bossTrap: lineOf("SEP", 2).start - 0.06,
  staffFrozen: lineOf("SEP", 2).end + 0.08,
  ending: dialogue.items[dialogue.items.length - 1].start,
};
const BAO_AT = lineOf("SEP", 1).end - 0.6;

const SFX = [
  { at: BAO_AT, src: "sfx/win/cash-register.mp3", vol: 0.45 },
  { at: CUTS.staffBites, src: "sfx/funny/record-scratch.mp3", vol: 0.4 },
  { at: lineOf("SEP", 2).end - 1.1, src: "sfx/punch/vine-boom.mp3", vol: 0.5 },
  { at: CUTS.staffFrozen + 0.1, src: "sfx/punch/emotional-damage.mp3", vol: 0.5 },
  { at: CUTS.ending + 0.2, src: "sfx/fail/sad-violin.mp3", vol: 0.3 },
];

const ASPECT = 1500 / 1080;

const Actor: React.FC<{ x: number; y: number; w: number; children: React.ReactNode; opacity?: number }> = ({ x, y, w, children, opacity = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: w * ASPECT, opacity }}>{children}</div>
);

const useViseme = (speaker: Line["speaker"]): Viseme => {
  const t = useCurrentFrame() / FPS;
  const line = LINES.find((l) => l.speaker === speaker && t >= l.start - 0.05 && t <= l.end + 0.05);
  return line ? visemeAt(line.mouth, t) : "X";
};

const Banner: React.FC<{ text: string; color: string; top: number; size: number; appearAt: number }> = ({ text, color, top, size, appearAt }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [appearAt * FPS, appearAt * FPS + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, textAlign: "center", fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800, fontSize: size, lineHeight: 1.15, color, textShadow: "0 4px 18px rgba(0,0,0,0.9)", transform: `scale(${p})`, opacity: p }}>
      {text}
    </div>
  );
};

const Shot: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={Math.round(from * FPS)} durationInFrames={Math.round((to - from) * FPS)} layout="none">
    {children}
  </Sequence>
);

const WideOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const walk = interpolate(frame, [0, 1.4 * FPS], [1120, 560], { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) });
  return (
    <AbsoluteFill>
      <OfficeWall />
      <Actor x={walk} y={930} w={420}>
        <Character look={SEP} shirt="#fff" tie={RED} />
      </Actor>
      <Actor x={-120} y={640} w={800}>
        <Character look={{ ...NV, eyes: 12, mouth: 17 }} flip shirt={BLUE} seed={3} />
      </Actor>
      <Desk top={1500} />
      <Banner text="17:59 · THỨ SÁU" color={GOLD} top={150} size={72} appearAt={0.1} />
    </AbsoluteFill>
  );
};

const BossSingle: React.FC<{ look: Look; brows?: number; w: number; x: number; y: number }> = ({ look, brows, w, x, y }) => (
  <AbsoluteFill>
    <OfficeWall zoom={1.7} x={-260} y={120} blur={5} />
    <Actor x={x} y={y} w={w}>
      <Character look={look} brows={brows} viseme={useViseme("SEP")} shirt="#fff" tie={RED} />
    </Actor>
    <Desk top={1480} />
  </AbsoluteFill>
);

const StaffSingle: React.FC<{ look: Look; brows?: number; w: number; x: number; y: number; push?: boolean; noBlink?: boolean }> = ({ look, brows, w, x, y, push, noBlink }) => {
  const frame = useCurrentFrame();
  const zoom = push ? interpolate(frame, [0, 12], [1, 1.28], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 1;
  return (
    <AbsoluteFill>
      <OfficeWall zoom={1.7} x={300} y={140} blur={5} />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "540px 760px" }}>
        <Actor x={x} y={y} w={w}>
          <Character look={look} brows={brows} viseme={useViseme("NV")} flip shirt={BLUE} seed={3} noBlink={noBlink} />
        </Actor>
      </AbsoluteFill>
      <Desk top={1480} />
    </AbsoluteFill>
  );
};

const Frozen: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = frame < 14 ? Math.sin(frame * 2.7) * (14 - frame) * 1.6 : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
      <StaffSingle look={{ ...NV, eyes: 4, mouth: 5 }} brows={13} w={1240} x={-80} y={60} noBlink />
    </AbsoluteFill>
  );
};

const WideEnd: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <OfficeWall />
      {COLLEAGUES.map((look, i) => {
        const x = interpolate(frame, [i * 8, i * 8 + 2.2 * FPS], [-260 - i * 40, 760], { extrapolateRight: "clamp" });
        const fade = interpolate(x, [640, 760], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <Actor key={i} x={x} y={960 + (i % 2) * 24} w={250} opacity={fade}>
            <Character look={look} shirt={["#F2C14E", "#4FD1A5", "#FF9F45"][i]} seed={i + 5} />
          </Actor>
        );
      })}
      <Actor x={130} y={760} w={820}>
        <Character look={{ ...NV, eyes: 12, mouth: 13 }} brows={9} flip shirt={BLUE} seed={3} />
      </Actor>
      <Desk top={1480} papers={9} />
      <Banner text="TAG ĐỨA HAY BỊ LỪA NHƯ NÀY" color={GOLD} top={200} size={78} appearAt={0.5} />
    </AbsoluteFill>
  );
};

export const ToonSepRuNhau: React.FC = () => {
  const t = useCurrentFrame() / useVideoConfig().fps;
  const baitSmile = t >= BAO_AT;
  const staffGrin = t >= lineOf("NV", 1).end;
  return (
    <AbsoluteFill style={{ background: "#0B0A12" }}>
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * FPS)} layout="none">
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
      <Shot from={0} to={CUTS.bossAsks}><WideOpen /></Shot>
      <Shot from={CUTS.bossAsks} to={CUTS.staffDodges}><BossSingle look={SEP} w={1080} x={0} y={110} /></Shot>
      <Shot from={CUTS.staffDodges} to={CUTS.bossBait}><StaffSingle look={{ ...NV, eyes: 7 }} brows={9} w={1000} x={40} y={170} /></Shot>
      <Shot from={CUTS.bossBait} to={CUTS.staffBites}><BossSingle look={{ ...SEP, mouth: baitSmile ? 1 : 4 }} brows={baitSmile ? 10 : 9} w={1000} x={40} y={160} /></Shot>
      <Shot from={CUTS.staffBites} to={CUTS.bossTrap}><StaffSingle look={{ ...NV, eyes: 2, mouth: staffGrin ? 17 : 1 }} brows={13} w={1060} x={10} y={150} push /></Shot>
      <Shot from={CUTS.bossTrap} to={CUTS.staffFrozen}><BossSingle look={{ ...SEP, eyes: 6 }} w={1200} x={-60} y={40} /></Shot>
      <Shot from={CUTS.staffFrozen} to={CUTS.ending}><Frozen /></Shot>
      <Shot from={CUTS.ending} to={dialogue.total}><WideEnd /></Shot>
      <DialogueCaption lines={LINES} top={1600} />
    </AbsoluteFill>
  );
};
