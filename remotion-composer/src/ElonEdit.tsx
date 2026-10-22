import React from "react";
import { AbsoluteFill, Audio, Easing, Freeze, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/BeVietnamPro";
import shotList from "./elon_shots.json";

const { fontFamily } = loadFont("normal", { weights: ["300", "500"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const SRC_W = 1920;
const SRC_H = 1080;
const GAP = 6;
const PANEL_H = (H - 2 * GAP) / 3;
const LEAD = 4;
const CHAR_STAGGER = 0.6;
const CHAR_FADE = 8;
const SUB_DELAY = 6;
const EXIT_FADE = 6;
const TEXT_Y = 1240;
const INTRO_FRAMES = 18;
const FADE_OUT_START = 38;
const VOICE_AT = 10.2;
const VOICE_START = 10.0;
const VOICE_END = 16.5;
const BOOMS = [2.8, 29.77];
const BOOM_VOLUME = 0.9;
const BOOM_VOLUME_UNDER_BGM = 0.55;
const BGM_VOLUME = 0.55;
const BGM_DUCKED = 0.25;
const DURATION = 40;
const TEXT_END = 27.5;

const RAMP_FAST = 3;
const RAMP_SLOW = 1;
const RAMP_FRAMES = 10;
const CLIP_SPEED = 0.5;
const CLIP_TAIL_FRAMES = 6;
const MOTION_BLUR_FROM = 1.2;
const MOTION_BLUR_PER_RATE = 7;

const PUSH_AT = 11.8;
const PUSH_OUT_FRAMES = 9;
const PUSH_IN_FRAMES = 9;
const PUSH_OUT_SCALE = 0.35;
const PUSH_IN_SCALE = 0.25;
const PUSH_OUT_BLUR = 18;
const PUSH_IN_BLUR = 14;

const WHIPS = [22.76, 28.79];
const WHIP_FRAMES = 5;
const WHIP_OFFSET = 0.12;
const WHIP_SCALE = 0.3;
const WHIP_BLUR = 70;
const WHIP_RGB = 18;

const STRONG_HITS = [16.53, 29.77];
const SOFT_HITS = [1.8, 2.8, 4.4, 7.4, 10.0];
const SOFT_HIT = 0.25;
const CUT_HIT = 0.35;
const STRONG_HIT = 1;
const HIT_DECAY = 2.2;
const HIT_FRAMES = 8;
const PUNCH_ZOOM = 0.1;
const SHAKE_X = 22;
const SHAKE_Y = 16;
const SHAKE_ROTATE = 0.8;
const RGB_SPLIT = 14;
const FLASH = [0.55, 0.2];

const MOSAIC_AT = 24.31;
const MOSAIC_FRAMES = 3;
const MOSAIC_GRID = 3;

const SWEEP_AT = 26.66;
const SWEEP_FRAMES = 30;
const SWEEP_DARKNESS = 0.6;

const GRAIN_OPACITY = 0.07;
const GRAIN_FREQUENCY = 0.85;

export const ELON_FRAMES = DURATION * FPS;

type Slot = "full" | "top" | "mid" | "bot";
type Shot = { id: string; at: number; dur: number; slot: string; x: number; zoom: number; ramp?: boolean; len?: number };
type Line = { at: number; main: string; sub: string };

const SHOTS = shotList as Shot[];

const LINES: Line[] = [
  { at: 0.3, main: "NĂM 2008, BẦU TRỜI TỪ CHỐI ÔNG BA LẦN.", sub: "~ ba lần phóng · ba lần nổ ~" },
  { at: 3.6, main: "TESLA VÀ SPACEX ĐỨNG TRÊN BỜ VỰC PHÁ SẢN.", sub: "~ tiền chỉ còn đủ cho một lần thử cuối ~" },
  { at: 7.4, main: "CẢ THẾ GIỚI BẢO ÔNG: DỪNG LẠI ĐI.", sub: "" },
  { at: 10.55, main: "TÔI KHÔNG BAO GIỜ BỎ CUỘC.", sub: "~ I don't ever give up ~" },
  { at: 12.6, main: "TRỪ KHI TÔI CHẾT, HOẶC KHÔNG CÒN CỬ ĐỘNG ĐƯỢC.", sub: "~ I'd have to be dead or completely incapacitated ~" },
  { at: 17.7, main: "LẦN PHÓNG THỨ TƯ. CŨNG LÀ CƠ HỘI CUỐI CÙNG.", sub: "~ 28.09.2008 · Falcon 1 lên tới quỹ đạo ~" },
  { at: 22.8, main: "TỪ ĐÓ, BẦU TRỜI KHÔNG CÒN TỪ CHỐI ÔNG NỮA.", sub: "~ 2024 · tên lửa trở về trong vòng tay ~" },
];

const toFrame = (seconds: number) => Math.round(seconds * FPS);

export const lineEntry = (line: Line) => toFrame(line.at) - LEAD;

const CUT_HITS = SHOTS.filter((shot) => shot.ramp && !STRONG_HITS.includes(shot.at) && !WHIPS.includes(shot.at)).map((shot) => shot.at);

const HITS = [
  ...SOFT_HITS.map((at) => ({ at, strength: SOFT_HIT, violent: false })),
  ...CUT_HITS.map((at) => ({ at, strength: CUT_HIT, violent: false })),
  ...STRONG_HITS.map((at) => ({ at, strength: STRONG_HIT, violent: true })),
];

const slotBox = (slot: Slot) => {
  if (slot === "full") return { top: 0, height: H };
  const index = { top: 0, mid: 1, bot: 2 }[slot];
  return { top: index * (PANEL_H + GAP), height: PANEL_H };
};

const rampRate = (frame: number) => (frame < RAMP_FRAMES ? RAMP_SLOW + (RAMP_FAST - RAMP_SLOW) * (1 - frame / RAMP_FRAMES) ** 2 : RAMP_SLOW);

const rampPosition = (frame: number) => {
  let position = 0;
  for (let f = 0; f < frame; f++) position += rampRate(f);
  return position;
};

const HorizontalBlur: React.FC<{ id: string; amount: number }> = ({ id, amount }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id={id} x="-10%" y="0" width="120%" height="100%">
      <feGaussianBlur stdDeviation={`${amount} 0`} />
    </filter>
  </svg>
);

const ShotView: React.FC<{ shot: Shot; intro: boolean }> = ({ shot, intro }) => {
  const frame = useCurrentFrame();
  const slot = shot.slot as Slot;
  const box = slotBox(slot);
  const cover = Math.max(W / SRC_W, box.height / SRC_H);
  const push = interpolate(frame, [0, shot.dur * FPS], [1, 1.06]);
  const introScale = intro ? interpolate(frame, [0, INTRO_FRAMES], [1.9, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 1;
  const blur = intro ? interpolate(frame, [0, INTRO_FRAMES], [26, 0], { extrapolateRight: "clamp" }) : 0;
  const scale = cover * shot.zoom * push * introScale;
  const vw = SRC_W * scale;
  const vh = SRC_H * scale;
  const left = Math.min(0, Math.max(W - vw, W / 2 - shot.x * vw));
  const top = (box.height - vh) / 2;
  const video = (
    <OffthreadVideo
      src={staticFile(`elon/shots/${shot.id}.mp4`)}
      muted
      style={{ position: "absolute", left, top, width: vw, height: vh, filter: `contrast(1.1) saturate(0.8) brightness(0.9) blur(${blur}px)` }}
    />
  );
  if (!shot.ramp || shot.len === undefined) {
    return <div style={{ position: "absolute", left: 0, top: box.top, width: W, height: box.height, overflow: "hidden" }}>{video}</div>;
  }
  const lastFrame = Math.floor((shot.len / CLIP_SPEED) * FPS) - CLIP_TAIL_FRAMES;
  const motionBlur = Math.max(0, rampRate(frame) - MOTION_BLUR_FROM) * MOTION_BLUR_PER_RATE;
  const filterId = `ramp-blur-${shot.id}`;
  return (
    <div style={{ position: "absolute", left: 0, top: box.top, width: W, height: box.height, overflow: "hidden", filter: motionBlur > 0.5 ? `url(#${filterId})` : undefined }}>
      <HorizontalBlur id={filterId} amount={motionBlur} />
      <Freeze frame={Math.min(lastFrame, Math.floor(rampPosition(frame)))}>{video}</Freeze>
    </div>
  );
};

const Caption: React.FC<{ line: Line; until: number }> = ({ line, until }) => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [until - EXIT_FADE, until], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const chars = (text: string, delay: number, size: number, weight: number, spacing: string, color: string) => {
    let index = 0;
    return (
      <div style={{ fontFamily, fontSize: size, fontWeight: weight, letterSpacing: spacing, color, lineHeight: 1.35, textAlign: "center", textWrap: "balance" }}>
        {text.split(" ").map((word, w) => (
          <React.Fragment key={w}>
            {w > 0 ? " " : null}
            <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              {Array.from(word).map((ch) => {
                const start = delay + index++ * CHAR_STAGGER;
                const t = interpolate(frame, [start, start + CHAR_FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                return (
                  <span key={index} style={{ opacity: t, filter: `blur(${(1 - t) * 6}px)`, display: "inline-block" }}>
                    {ch}
                  </span>
                );
              })}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: TEXT_Y, opacity: exit, textShadow: "0 2px 14px rgba(0,0,0,0.85), 0 0 3px rgba(0,0,0,0.9)" }}>
      {chars(line.main, 0, 46, 500, "0.12em", "#FFFFFF")}
      <div style={{ height: 14 }} />
      {line.sub ? chars(line.sub, SUB_DELAY, 30, 300, "0.06em", "#E9E1D2") : null}
    </div>
  );
};

const hitAt = (frame: number) => {
  let impulse = 0;
  let violence = 0;
  let flash = 0;
  for (const hit of HITS) {
    const d = frame - toFrame(hit.at);
    if (d < 0 || d >= HIT_FRAMES) continue;
    const value = hit.strength * Math.exp(-d / HIT_DECAY);
    impulse = Math.max(impulse, value);
    if (!hit.violent) continue;
    violence = Math.max(violence, value);
    if (d < FLASH.length) flash = Math.max(flash, FLASH[d]);
  }
  return { impulse, violence, flash };
};

const pushAt = (frame: number) => {
  const d = frame - toFrame(PUSH_AT);
  if (d >= -PUSH_OUT_FRAMES && d < 0) {
    const t = ((d + PUSH_OUT_FRAMES) / PUSH_OUT_FRAMES) ** 2;
    return { scale: 1 + PUSH_OUT_SCALE * t, blur: PUSH_OUT_BLUR * t };
  }
  if (d >= 0 && d < PUSH_IN_FRAMES) {
    const t = (1 - d / PUSH_IN_FRAMES) ** 2;
    return { scale: 1 + PUSH_IN_SCALE * t, blur: PUSH_IN_BLUR * t };
  }
  return { scale: 1, blur: 0 };
};

const whipAt = (frame: number) => {
  for (const at of WHIPS) {
    const d = frame - toFrame(at);
    if (d >= -WHIP_FRAMES && d < 0) {
      const t = ((d + WHIP_FRAMES) / WHIP_FRAMES) ** 2;
      return { offset: -W * WHIP_OFFSET * t, scale: 1 + WHIP_SCALE * t, blur: WHIP_BLUR * t, rgb: 0 };
    }
    if (d >= 0 && d < WHIP_FRAMES) {
      const t = (1 - d / WHIP_FRAMES) ** 2;
      return { offset: W * WHIP_OFFSET * t, scale: 1 + WHIP_SCALE * t, blur: WHIP_BLUR * t, rgb: d === 0 ? WHIP_RGB : 0 };
    }
  }
  return { offset: 0, scale: 1, blur: 0, rgb: 0 };
};

const RgbSplitFilter: React.FC<{ dx: number }> = ({ dx }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <filter id="rgb-split" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
      <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
      <feOffset in="red" dx={dx} result="redShift" />
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
      <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
      <feOffset in="blue" dx={-dx} result="blueShift" />
      <feBlend in="redShift" in2="green" mode="screen" result="redGreen" />
      <feBlend in="redGreen" in2="blueShift" mode="screen" />
    </filter>
  </svg>
);

const Mosaic: React.FC<{ shot: Shot; hitFrame: number }> = ({ shot, hitFrame }) => {
  const tileW = W / MOSAIC_GRID;
  const tileH = H / MOSAIC_GRID;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {Array.from({ length: MOSAIC_GRID * MOSAIC_GRID }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: (i % MOSAIC_GRID) * tileW, top: Math.floor(i / MOSAIC_GRID) * tileH, width: tileW, height: tileH, overflow: "hidden" }}>
          <div style={{ width: W, height: H, transform: `scale(${1 / MOSAIC_GRID})`, transformOrigin: "top left" }}>
            <Sequence from={toFrame(shot.at) - hitFrame}>
              <ShotView shot={shot} intro={false} />
            </Sequence>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

const ShadowSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, SWEEP_FRAMES], [-1.6 * W, 1.6 * W], { easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: -H * 0.25,
          left: x - W / 2,
          width: W * 2,
          height: H * 1.5,
          transform: "rotate(-20deg)",
          background: `linear-gradient(90deg, transparent 0%, rgba(0,0,0,${SWEEP_DARKNESS}) 40%, rgba(0,0,0,${SWEEP_DARKNESS}) 60%, transparent 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", opacity: GRAIN_OPACITY }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency={GRAIN_FREQUENCY} numOctaves={1} seed={frame % 997} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#grain)" />
    </svg>
  );
};

const bgmVolume = (frame: number) =>
  interpolate(frame, [VOICE_START * FPS - 8, VOICE_START * FPS, VOICE_END * FPS, VOICE_END * FPS + 12], [BGM_VOLUME, BGM_DUCKED, BGM_DUCKED, BGM_VOLUME], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const MOSAIC_SHOT = SHOTS.find((shot) => shot.at === MOSAIC_AT && shot.slot === "full");

export const ElonEdit: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => {
  const frame = useCurrentFrame();
  const fadeOut = interpolate(frame, [FADE_OUT_START * FPS, ELON_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const { impulse, violence, flash } = hitAt(frame);
  const push = pushAt(frame);
  const whip = whipAt(frame);
  const shakeX = Math.sin(frame * 12.9) * SHAKE_X * violence;
  const shakeY = Math.cos(frame * 7.3) * SHAKE_Y * violence;
  const rotate = Math.sin(frame * 5.1) * SHAKE_ROTATE * violence;
  const split = Math.max(RGB_SPLIT * violence, whip.rgb);
  const filters = [whip.blur > 0.5 ? "url(#whip-blur)" : "", split > 0.5 ? "url(#rgb-split)" : "", push.blur > 0.5 ? `blur(${push.blur}px)` : ""].filter(Boolean).join(" ");
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <RgbSplitFilter dx={split} />
      <HorizontalBlur id="whip-blur" amount={whip.blur} />
      <AbsoluteFill
        style={{
          transform: `translate(${shakeX + whip.offset}px, ${shakeY}px) rotate(${rotate}deg) scale(${(1 + PUNCH_ZOOM * impulse) * push.scale * whip.scale})`,
          filter: filters || undefined,
        }}
      >
        {SHOTS.map((shot, i) => (
          <Sequence key={shot.id} from={toFrame(shot.at)} durationInFrames={toFrame(shot.at + shot.dur) - toFrame(shot.at)}>
            <ShotView shot={shot} intro={i === 0} />
          </Sequence>
        ))}
      </AbsoluteFill>
      {MOSAIC_SHOT ? (
        <Sequence from={toFrame(MOSAIC_AT)} durationInFrames={MOSAIC_FRAMES}>
          <Mosaic shot={MOSAIC_SHOT} hitFrame={toFrame(MOSAIC_AT)} />
        </Sequence>
      ) : null}
      <Sequence from={toFrame(SWEEP_AT)} durationInFrames={SWEEP_FRAMES}>
        <ShadowSweep />
      </Sequence>
      <Grain />
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 60% at 50% 45%, transparent 50%, rgba(0,0,0,0.65) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 58%, rgba(0,0,0,0.38) 64%, rgba(0,0,0,0.38) 76%, transparent 82%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: fadeOut }} />
      {LINES.map((line, i) => {
        const from = lineEntry(line);
        const until = i + 1 < LINES.length ? lineEntry(LINES[i + 1]) : toFrame(TEXT_END);
        return (
          <Sequence key={i} from={from} durationInFrames={until - from}>
            <Caption line={line} until={until - from} />
          </Sequence>
        );
      })}
      {bgm ? <Audio src={staticFile("elon/bgm.mp3")} volume={bgmVolume} /> : null}
      <Sequence from={toFrame(VOICE_AT)}>
        <Audio src={staticFile("elon/voice.wav")} volume={1.4} />
      </Sequence>
      {BOOMS.map((at) => (
        <Sequence key={at} from={toFrame(at)}>
          <Audio src={staticFile("elon/boom.wav")} volume={bgm ? BOOM_VOLUME_UNDER_BGM : BOOM_VOLUME} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
