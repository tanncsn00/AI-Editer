import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BoxCaption } from "./toon/BoxCaption";
import { PeepActor, PeepLook } from "./toon/PeepActor";
import { Stamp } from "./toon/PaperSet";
import { Ambulance, Carton, Crown, Crutch, Doorstep, FlatBike, Grave, HeartMonitor, LegCast, Parcel, Rain, SoupPot, Swirl, Underworld } from "./toon/ShipSet";
import { At, DialogueLine, Speaker } from "./toon/Timing";
import dialogue from "./toon_giao_hang_dialogue.json";

const FPS = 30;
const SLUG = "toon_giao_hang";
export const TOON_GIAO_HANG_FRAMES = Math.ceil(dialogue.total * FPS);

const LINES = dialogue.items.filter((it) => it.kind === "line") as DialogueLine[];
const L = (i: number) => {
  const line = LINES[i];
  if (!line) throw new Error(`dialogue line ${i} missing — dialogue.md changed?`);
  return line;
};
const only = (...idx: number[]) => idx.map(L);
const before = (i: number, lead = 0.1) => L(i).start - lead;
const after = (i: number, tail = 0.08) => L(i).end + tail;

const KHACH: PeepLook = { id: "khach", hair: "BaldSides", facialHair: "MoustacheThin", shirt: "#E4574C" };
const SHIP: PeepLook = { id: "ship", hair: "ShortMessy", shirt: "#2DBE60" };
const MANH_BA: PeepLook = { id: "manhba", hair: "ShortMessy", shirt: "#8E5BD6" };
const DIEM_VUONG: PeepLook = { id: "dv", hair: "Pomp", facialHair: "FullMajestic", shirt: "#9E1B1B" };
const KHACH_SHIP: PeepLook = { id: "khachship", hair: "BaldSides", facialHair: "MoustacheThin", shirt: "#2DBE60" };
const SHIP_KHACH: PeepLook = { id: "shipkhach", hair: "ShortMessy", shirt: "#E4574C" };

const BUST_W = 1000;
const BUST_H = BUST_W * (1200 / 850);
const STAND_VIEWBOX = { x: "-200", y: "-100", width: "1800", height: "2250" };
const CAPTION_TOP = 1430;

const SFX = [
  { at: L(0).start, src: "sfx/punch/vine-boom.mp3", vol: 0.45 },
  { at: after(1), src: "sfx/funny/record-scratch.mp3", vol: 0.4 },
  { at: after(1) + 0.3, src: "sfx/fail/sad-violin.mp3", vol: 0.28 },
  { at: before(4, 0.12), src: "sfx/ui/whoosh.mp3", vol: 0.4 },
  { at: before(5, 0.12), src: "sfx/ui/whoosh.mp3", vol: 0.4 },
  { at: before(6, 0.12), src: "sfx/ui/whoosh.mp3", vol: 0.4 },
  { at: after(6, 0.12), src: "sfx/fail/roblox-oof.mp3", vol: 0.45 },
  { at: L(7).end + 0.05, src: "sfx/punch/bonk.mp3", vol: 0.5 },
  { at: after(9), src: "sfx/funny/record-scratch.mp3", vol: 0.4 },
  { at: L(11).end + 0.02, src: "sfx/punch/vine-boom.mp3", vol: 0.5 },
  { at: after(11) + 0.05, src: "sfx/ui/whoosh.mp3", vol: 0.45 },
  { at: L(14).end + 0.05, src: "sfx/funny/laugh-track.mp3", vol: 0.35 },
];

const Box: React.FC<{ x: number; y: number; w: number; h?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ x, y, w, h, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h ?? w * (1200 / 850), ...style }}>{children}</div>
);

const Punch: React.FC<{ children: React.ReactNode; from?: number; to?: number; shakeAt?: number }> = ({ children, from = 1.12, to = 1, shakeAt }) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, 6], [from, to], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const since = shakeAt === undefined ? -1 : frame - shakeAt * FPS;
  const shake = since >= 0 && since < 12 ? Math.sin(since * 2.6) * (12 - since) * 1.8 : 0;
  return <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.5}px) scale(${z})`, transformOrigin: "540px 760px" }}>{children}</AbsoluteFill>;
};

const FullBody: React.FC<{ look: PeepLook; x: number; y: number; w: number; face: React.ComponentProps<typeof PeepActor>["face"]; flip?: boolean; parcel?: boolean }> = ({ look, x, y, w, face, flip, parcel = true }) => (
  <Box x={x} y={y} w={w} h={w * 1.25}>
    <PeepActor look={look} body="ShirtPantsWB" face={face} flip={flip} viewBox={STAND_VIEWBOX} />
    <LegCast style={{ position: "absolute", left: w * (flip ? 0.47 : 0.36), top: w * 0.78, width: w * 0.16, height: w * 0.38 }} />
    <Crutch style={{ position: "absolute", left: w * (flip ? 0.66 : 0.22), top: w * 0.3, width: w * 0.08, height: w * 0.62 }} />
    {parcel && <Parcel style={{ position: "absolute", left: w * 0.36, top: w * 0.36, width: w * 0.26, height: w * 0.21 }} />}
  </Box>
);

const Reveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, [0, 16, 30, 44], [-520, -520, 380, 380], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  const z = interpolate(frame, [30, 46], [1.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const ty = interpolate(frame, [30, 46], [pan, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `scale(${frame < 30 ? 1.9 : z}) translateY(${frame < 30 ? -pan : -ty}px)`, transformOrigin: "540px 960px" }}>{children}</AbsoluteFill>;
};

const Lying: React.FC<{ lines: number[]; children?: React.ReactNode }> = ({ lines, children }) => (
  <AbsoluteFill>
    {children}
    <Box x={140} y={560} w={800} style={{ transform: "rotate(-78deg)", transformOrigin: "50% 60%" }}>
      <Speaker look={KHACH} body="Shirt" mood="scared" face="Hectic" lines={only(...lines)} />
    </Box>
  </AbsoluteFill>
);

const Tears: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {[0, 1].map((side) =>
        Array.from({ length: 5 }, (_, i) => {
          const y = 600 + (((frame * 22) + i * 90) % 450);
          return <path key={`${side}-${i}`} d={`M${430 + side * 190} ${y} q-14 30 0 44 q14 -14 0 -44`} fill="#7FB2FF" stroke="#111" strokeWidth={4} />;
        }),
      )}
    </svg>
  );
};

export const ToonGiaoHang: React.FC = () => (
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
        <Box x={40} y={240} w={BUST_W}><Speaker look={KHACH} body="ButtonShirt" mood="angry" face="VeryAngry" lines={only(0)} /></Box>
      </Punch>
    </At>
    <At from={before(1)} to={after(1)}>
      <Doorstep zoom={1.5} x={-260} y={150} />
      <Box x={40} y={300} w={BUST_W} style={{ transform: "rotate(7deg)", transformOrigin: "50% 90%" }}>
        <Speaker look={SHIP} body="Hoodie" mood="worried" lines={only(1)} flip />
      </Box>
      <Rain />
    </At>
    <At from={after(1)} to={before(3)}>
      <Reveal>
        <Doorstep zoom={1} />
        <FlatBike style={{ position: "absolute", left: 520, top: 1300, transform: "scale(1.1)" }} />
        <FullBody look={SHIP} face="Solemn" x={60} y={520} w={700} flip />
      </Reveal>
      <Rain density={90} />
    </At>
    <At from={before(3)} to={before(4, 0.12)}>
      <Punch from={1.3} shakeAt={0.2}>
        <Doorstep zoom={1.8} x={260} y={200} />
        <Box x={20} y={220} w={1040}><Speaker look={KHACH} body="ButtonShirt" mood="scared" face="Hectic" lines={only(3)} /></Box>
      </Punch>
    </At>
    <At from={before(4, 0.12)} to={before(5, 0.12)}>
      <AbsoluteFill style={{ background: "#F7D9A6" }}>
        <Box x={190} y={300} w={700}><Speaker look={KHACH} body="Shirt" mood="scared" face="Fear" lines={only(4)} /></Box>
        <Carton />
      </AbsoluteFill>
    </At>
    <At from={before(5, 0.12)} to={before(6, 0.12)}><Lying lines={[5]}><Ambulance /></Lying></At>
    <At from={before(6, 0.12)} to={after(6, 0.1)}><Lying lines={[6]}><HeartMonitor /></Lying></At>
    <At from={after(6, 0.1)} to={before(7)}><Grave text={"TÔI THẬT\nĐÁNG CHẾT MÀ"} /></At>
    <At from={before(7)} to={before(8)}>
      <Punch from={1.15}>
        <Underworld zoom={1.3} />
        <Box x={40} y={300} w={BUST_W}><Speaker look={DIEM_VUONG} body="ArmsCrossed" mood="neutral" face="Serious" lines={only(7)} flip /></Box>
        <Crown style={{ position: "absolute", left: 360, top: 200, transform: "rotate(-6deg)" }} />
      </Punch>
    </At>
    <At from={before(8)} to={before(9)}>
      <Punch from={1.2} shakeAt={1.4}>
        <Underworld zoom={1.6} x={300} plaque={false} />
        <Box x={40} y={280} w={BUST_W}><Speaker look={KHACH} body="ButtonShirt" mood="angry" face="VeryAngry" lines={only(8)} /></Box>
        <SoupPot style={{ position: "absolute", left: 640, top: 1180 }} />
      </Punch>
    </At>
    <At from={before(9)} to={after(9)}>
      <Underworld zoom={1.6} x={-300} plaque={false} />
      <Box x={40} y={300} w={BUST_W} style={{ transform: "rotate(7deg)", transformOrigin: "50% 90%" }}>
        <Speaker look={MANH_BA} body="Coffee" mood="worried" lines={only(9)} flip />
      </Box>
    </At>
    <At from={after(9)} to={before(10)}>
      <Reveal>
        <Underworld zoom={1} plaque={false} />
        <FullBody look={MANH_BA} face="Solemn" x={190} y={360} w={700} flip parcel={false} />
      </Reveal>
    </At>
    <At from={before(10)} to={before(11)}>
      <Punch from={1.3} shakeAt={0.1}>
        <Underworld zoom={1.6} x={300} plaque={false} />
        <Box x={20} y={240} w={1040}><Speaker look={KHACH} body="ButtonShirt" mood="scared" face="Hectic" lines={only(10)} /></Box>
      </Punch>
    </At>
    <At from={before(11)} to={after(11)}>
      <Underworld zoom={1.5} />
      <Box x={-60} y={100} w={1200}><Speaker look={DIEM_VUONG} body="ArmsCrossed" mood="neutral" face="Serious" lines={only(11)} flip /></Box>
      <Crown style={{ position: "absolute", left: 330, top: 40, transform: "rotate(-6deg) scale(1.2)" }} />
    </At>
    <At from={after(11)} to={after(11) + 0.6}><Swirl /></At>
    <At from={after(11) + 0.6} to={before(12)}>
      <Doorstep zoom={1} />
      <FlatBike style={{ position: "absolute", left: 520, top: 1300, transform: "scale(1.1)" }} />
      <FullBody look={KHACH_SHIP} face="Solemn" x={60} y={520} w={700} flip />
      <Rain density={90} />
      <Stamp text="ĐẦU THAI" top={170} appearAt={0.05} color="#F2C14E" size={110} dark />
    </At>
    <At from={before(12)} to={before(13)}>
      <Doorstep zoom={1.5} x={-260} y={150} />
      <Box x={40} y={300} w={BUST_W} style={{ transform: "rotate(7deg)", transformOrigin: "50% 90%" }}>
        <Speaker look={KHACH_SHIP} body="Hoodie" mood="worried" lines={only(12)} flip />
      </Box>
      <Rain />
    </At>
    <At from={before(13)} to={before(14)}>
      <Doorstep zoom={1.5} x={260} y={150} />
      <Box x={40} y={260} w={BUST_W}><Speaker look={SHIP_KHACH} body="ButtonShirt" mood="smile" face="Smile" lines={only(13)} /></Box>
    </At>
    <At from={before(14)} to={before(15)}>
      <Punch from={1.25}>
        <Doorstep zoom={1.8} x={-260} y={200} />
        <Box x={20} y={240} w={1040}><Speaker look={KHACH_SHIP} body="Hoodie" mood="worried" face="Concerned" lines={only(14)} flip /></Box>
        <Tears />
      </Punch>
      <Rain />
    </At>
    <At from={before(15)} to={dialogue.total}>
      <Doorstep zoom={1} />
      <FullBody look={KHACH_SHIP} face="Concerned" x={-60} y={560} w={660} flip />
      <Box x={460} y={600} w={660} h={825}>
        <PeepActor look={SHIP_KHACH} body="ShirtPantsWB" face="SmileBig" viewBox={STAND_VIEWBOX} />
      </Box>
      <Rain />
      <Stamp text="FOLLOW ĐỂ XEM THÊM" top={200} appearAt={0.3} color="#E4574C" size={70} />
    </At>

    <BoxCaption lines={LINES} top={CAPTION_TOP} />
  </AbsoluteFill>
);
