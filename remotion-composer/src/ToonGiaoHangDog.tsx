import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BoxCaption } from "./toon/BoxCaption";
import { LottieClip } from "./toon/LottieClip";
import { Stamp } from "./toon/PaperSet";
import { Ambulance, Carton, Crown, Crutch, Doorstep, FlatBike, Grave, HeartMonitor, LegCast, Parcel, Rain, SoupPot, Swirl, Underworld } from "./toon/ShipSet";
import { At, DialogueLine, useAbsoluteTime } from "./toon/Timing";
import dialogue from "./toon_giao_hang_dialogue.json";

const FPS = 30;
const SLUG = "toon_giao_hang";
export const TOON_GIAO_HANG_DOG_FRAMES = Math.ceil(dialogue.total * FPS);

const LINES = dialogue.items.filter((it) => it.kind === "line") as DialogueLine[];
const L = (i: number) => {
  const line = LINES[i];
  if (!line) throw new Error(`dialogue line ${i} missing — dialogue.md changed?`);
  return line;
};
const before = (i: number, lead = 0.1) => L(i).start - lead;
const after = (i: number, tail = 0.08) => L(i).end + tail;

type Mood = "angry" | "frustrated" | "very-dissatisfied" | "excuse-me" | "worried" | "hurt" | "very-sad" | "super-happy" | "slightly-happy";
const MOOD_FILE: Record<Mood, string> = {
  angry: "angry-97495",
  frustrated: "frustrated-97557",
  "very-dissatisfied": "very-dissatisfied-97544",
  "excuse-me": "excuse-me-97501",
  worried: "worried-97548",
  hurt: "hurt-97505",
  "very-sad": "very-sad-97546",
  "super-happy": "super-happy-97542",
  "slightly-happy": "slightly-happy-97538",
};

const KHACH = "none";
const SHIP = "hue-rotate(110deg) saturate(1.4)";
const MANH_BA = "hue-rotate(230deg) saturate(1.5)";
const DIEM_VUONG = "hue-rotate(-28deg) saturate(2.6) brightness(0.92)";

const DOG_RATIO = 426 / 240;

const SFX = [
  { at: L(0).start, src: "sfx/punch/vine-boom.mp3", vol: 0.32 },
  { at: after(1), src: "sfx/funny/record-scratch.mp3", vol: 0.4 },
  { at: after(1) + 0.3, src: "sfx/fail/sad-violin.mp3", vol: 0.28 },
  { at: before(4, 0.12), src: "sfx/ui/whoosh.mp3", vol: 0.4 },
  { at: before(5, 0.12), src: "sfx/ui/whoosh.mp3", vol: 0.4 },
  { at: before(6, 0.12), src: "sfx/ui/whoosh.mp3", vol: 0.4 },
  { at: after(6, 0.12), src: "sfx/fail/roblox-oof.mp3", vol: 0.45 },
  { at: L(7).end + 0.05, src: "sfx/punch/bonk.mp3", vol: 0.5 },
  { at: after(9), src: "sfx/funny/record-scratch.mp3", vol: 0.4 },
  { at: L(11).end + 0.02, src: "sfx/punch/vine-boom.mp3", vol: 0.45 },
  { at: after(11) + 0.05, src: "sfx/ui/whoosh.mp3", vol: 0.45 },
  { at: L(14).end + 0.05, src: "sfx/funny/laugh-track.mp3", vol: 0.35 },
];

const Dog: React.FC<{ mood: Mood; tint: string; x: number; y: number; w: number; speaks?: number[]; rotate?: number }> = ({ mood, tint, x, y, w, speaks = [], rotate = 0 }) => {
  const frame = useCurrentFrame();
  const time = useAbsoluteTime();
  const speaking = speaks.map(L).some((l) => time >= l.start && time <= l.end);
  const squash = speaking ? 1 + Math.sin(frame * 1.3) * 0.035 : 1 + Math.sin(frame / 10) * 0.012;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: w * DOG_RATIO, transform: `rotate(${rotate}deg) scaleY(${squash})`, transformOrigin: rotate ? "50% 50%" : "50% 100%" }}>
      <LottieClip file={`toon_dog/${MOOD_FILE[mood]}.json`} filter={tint === "none" ? undefined : tint} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

const Punch: React.FC<{ children: React.ReactNode; from?: number; shakeAt?: number }> = ({ children, from = 1.15, shakeAt }) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 6], [from, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const since = shakeAt === undefined ? -1 : frame - shakeAt * FPS;
  const shake = since >= 0 && since < 12 ? Math.sin(since * 2.6) * (12 - since) * 1.8 : 0;
  return <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.5}px) scale(${z})`, transformOrigin: "540px 760px" }}>{children}</AbsoluteFill>;
};

const Reveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, [0, 14, 28], [-500, -500, 420], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const z = interpolate(frame, [30, 46], [1.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const ty = interpolate(frame, [30, 46], [-420, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `scale(${frame < 30 ? 1.8 : z}) translateY(${frame < 30 ? -pan : ty}px)`, transformOrigin: "540px 960px" }}>{children}</AbsoluteFill>;
};

const Injured: React.FC<{ tint: string; mood: Mood; x: number; y: number; w: number; parcel?: boolean; speaks?: number[] }> = ({ tint, mood, x, y, w, parcel = true, speaks }) => (
  <>
    <Crutch style={{ position: "absolute", left: x + w * 0.88, top: y + w * 0.62, width: w * 0.12, height: w * 1.12 }} />
    <Dog mood={mood} tint={tint} x={x} y={y} w={w} speaks={speaks} />
    <LegCast style={{ position: "absolute", left: x + w * 0.56, top: y + w * 1.3, width: w * 0.3, height: w * 0.48 }} />
    {parcel && <Parcel style={{ position: "absolute", left: x + w * 0.22, top: y + w * 0.86, width: w * 0.56, height: w * 0.45 }} />}
  </>
);

const Lying: React.FC<{ speaks: number[]; children: React.ReactNode }> = ({ speaks, children }) => (
  <AbsoluteFill>
    {children}
    <Dog mood="very-sad" tint={KHACH} x={280} y={520} w={540} speaks={speaks} rotate={-80} />
  </AbsoluteFill>
);

export const ToonGiaoHangDog: React.FC = () => (
  <AbsoluteFill style={{ background: "#8FD3F4" }}>
    <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
    {SFX.map((s, i) => (
      <Sequence key={i} from={Math.round(s.at * FPS)} layout="none">
        <Audio src={staticFile(s.src)} volume={s.vol} />
      </Sequence>
    ))}

    <At from={0} to={before(1)}>
      <Punch from={1.25} shakeAt={1.6}>
        <Doorstep zoom={1.5} x={260} y={150} />
        <Dog mood="angry" tint={KHACH} x={110} y={230} w={860} speaks={[0]} />
      </Punch>
    </At>
    <At from={before(1)} to={after(1)}>
      <Doorstep zoom={1.5} x={-260} y={150} />
      <Dog mood="excuse-me" tint={SHIP} x={110} y={260} w={860} speaks={[1]} />
      <Rain />
    </At>
    <At from={after(1)} to={before(3)}>
      <Reveal>
        <Doorstep zoom={1} />
        <FlatBike style={{ position: "absolute", left: 560, top: 1320, transform: "scale(1.05)" }} />
        <Injured tint={SHIP} mood="worried" x={120} y={560} w={480} speaks={[2]} />
      </Reveal>
      <Rain density={90} />
    </At>
    <At from={before(3)} to={before(4, 0.12)}>
      <Punch from={1.3} shakeAt={0.2}>
        <Doorstep zoom={1.8} x={260} y={200} />
        <Dog mood="hurt" tint={KHACH} x={90} y={200} w={900} speaks={[3]} />
      </Punch>
    </At>
    <At from={before(4, 0.12)} to={before(5, 0.12)}>
      <AbsoluteFill style={{ background: "#F7D9A6" }}>
        <Dog mood="very-sad" tint={KHACH} x={250} y={330} w={580} speaks={[4]} />
        <Carton />
      </AbsoluteFill>
    </At>
    <At from={before(5, 0.12)} to={before(6, 0.12)}><Lying speaks={[5]}><Ambulance /></Lying></At>
    <At from={before(6, 0.12)} to={after(6, 0.1)}><Lying speaks={[6]}><HeartMonitor /></Lying></At>
    <At from={after(6, 0.1)} to={before(7)}><Grave text={"TÔI THẬT\nĐÁNG CHẾT MÀ"} /></At>
    <At from={before(7)} to={before(8)}>
      <Punch from={1.15}>
        <Underworld zoom={1.3} />
        <Dog mood="angry" tint={DIEM_VUONG} x={110} y={330} w={860} speaks={[7]} />
        <Crown style={{ position: "absolute", left: 390, top: 260, transform: "rotate(-6deg)" }} />
      </Punch>
    </At>
    <At from={before(8)} to={before(9)}>
      <Punch from={1.2} shakeAt={1.4}>
        <Underworld zoom={1.6} x={300} plaque={false} />
        <Dog mood="frustrated" tint={KHACH} x={60} y={260} w={860} speaks={[8]} />
        <SoupPot style={{ position: "absolute", left: 620, top: 1160 }} />
      </Punch>
    </At>
    <At from={before(9)} to={after(9)}>
      <Underworld zoom={1.6} x={-300} plaque={false} />
      <Dog mood="excuse-me" tint={MANH_BA} x={110} y={260} w={860} speaks={[9]} />
    </At>
    <At from={after(9)} to={before(10)}>
      <Reveal>
        <Underworld zoom={1} plaque={false} />
        <Injured tint={MANH_BA} mood="worried" x={300} y={500} w={480} parcel={false} />
      </Reveal>
    </At>
    <At from={before(10)} to={before(11)}>
      <Punch from={1.3} shakeAt={0.1}>
        <Underworld zoom={1.6} x={300} plaque={false} />
        <Dog mood="hurt" tint={KHACH} x={90} y={220} w={900} speaks={[10]} />
      </Punch>
    </At>
    <At from={before(11)} to={after(11)}>
      <Underworld zoom={1.5} />
      <Dog mood="frustrated" tint={DIEM_VUONG} x={40} y={120} w={1000} speaks={[11]} />
      <Crown style={{ position: "absolute", left: 380, top: 40, transform: "rotate(-6deg) scale(1.2)" }} />
    </At>
    <At from={after(11)} to={after(11) + 0.6}><Swirl /></At>
    <At from={after(11) + 0.6} to={before(12)}>
      <Doorstep zoom={1} />
      <FlatBike style={{ position: "absolute", left: 560, top: 1320, transform: "scale(1.05)" }} />
      <Injured tint={KHACH} mood="worried" x={120} y={560} w={480} />
      <Rain density={90} />
      <Stamp text="ĐẦU THAI" top={170} appearAt={0.05} color="#F2C14E" size={110} dark />
    </At>
    <At from={before(12)} to={before(13)}>
      <Doorstep zoom={1.5} x={-260} y={150} />
      <Dog mood="excuse-me" tint={KHACH} x={110} y={260} w={860} speaks={[12]} />
      <Rain />
    </At>
    <At from={before(13)} to={before(14)}>
      <Doorstep zoom={1.5} x={260} y={150} />
      <Dog mood="super-happy" tint={SHIP} x={110} y={240} w={860} speaks={[13]} />
    </At>
    <At from={before(14)} to={before(15)}>
      <Punch from={1.25}>
        <Doorstep zoom={1.8} x={-260} y={200} />
        <Dog mood="very-sad" tint={KHACH} x={90} y={200} w={900} speaks={[14]} />
      </Punch>
      <Rain />
    </At>
    <At from={before(15)} to={dialogue.total}>
      <Doorstep zoom={1} />
      <Injured tint={KHACH} mood="very-sad" x={40} y={620} w={460} parcel={false} />
      <Dog mood="super-happy" tint={SHIP} x={560} y={640} w={440} speaks={[15]} />
      <Rain />
      <Stamp text="FOLLOW ĐỂ XEM THÊM" top={200} appearAt={0.3} color="#E4574C" size={70} />
    </At>

    <BoxCaption lines={LINES} top={1430} />
  </AbsoluteFill>
);
