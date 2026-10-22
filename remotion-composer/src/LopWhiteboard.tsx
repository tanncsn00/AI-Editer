import React from "react";
import timeline from "./lop_timeline.json";
import doodles from "./lop_doodles.json";
import { Doodles, Sfx, Timeline, WhiteboardVideo, whiteboardFrames } from "./whiteboard/WhiteboardVideo";
import { A, AMBER, BLUE, C, E, GOLD, GREY, INK, JADE, L, P, R, RED, SKY, Scene, Scenes, Sh, T, bubble, burst, cross, followButton, place, polar, sparkle, speed, stairs, summon } from "./whiteboard/shapes";

const TL = timeline as Timeline;

export const LOP_FRAMES = whiteboardFrames(TL);

const tireRing = (): Sh[] => {
  const out: Sh[] = [C(0, 0, 200), C(0, 0, 118)];
  for (let i = 0; i < 12; i++) {
    const [x1, y1] = polar(100, (i * Math.PI) / 6);
    const [x2, y2] = polar(80, (i * Math.PI) / 6);
    out.push(L(x1, y1, x2, y2));
  }
  return out;
};

const tire = (): Sh[] => {
  const out: Sh[] = [...tireRing(), C(0, 0, 36)];
  for (let i = 0; i < 5; i++) {
    const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const [x1, y1] = polar(18, a);
    const [x2, y2] = polar(58, a);
    out.push(L(x1, y1, x2, y2));
  }
  return out;
};

const trunk = (inside: Sh[]): Sh[] => [
  R(-110, -40, 220, 120),
  P("M-110,-40 L-92,-132 L118,-150 L110,-40"),
  ...inside,
];

const noodleCup = (): Sh[] => [
  P("M-60,-60 L60,-60 L45,80 L-45,80 Z"),
  L(-68, -60, 68, -60),
  P("M-40,-74 Q-30,-96 -20,-74 Q-10,-96 0,-74 Q10,-96 20,-74 Q30,-96 40,-74", { col: GOLD }),
  T(0, 16, 40, "MÌ", RED),
];

const michelin = (): Sh[] => [
  E(0, -160, 92, 72),
  C(-16, -166, 8),
  C(16, -166, 8),
  P("M-24,-148 Q0,-126 24,-148"),
  E(0, -96, 130, 50),
  E(0, -50, 152, 50),
  E(0, -4, 140, 50),
  E(-100, -96, 64, 38),
  E(-150, -112, 50, 34),
  E(100, -96, 64, 38),
  E(150, -112, 50, 34),
  E(-36, 50, 62, 40),
  E(36, 50, 62, 40),
  E(-36, 92, 62, 40),
  E(36, 92, 62, 40),
];

const pump = (): Sh[] => [R(-26, -60, 52, 160), L(0, -60, 0, -112), L(-52, -112, 52, -112), R(-52, 100, 104, 16)];

const levelTitle = (n: string): Scene => ({
  0: [...place(tireRing(), 540, 600, 1.7), T(540, 604, 150, n, RED)],
  1: "banner",
});

const SCENES: Scenes = {
  "MODAU:0": {
    0: [A("Waiting 2", 300, 700, 520), A("Smartphone 6", 830, 690, 480), A("Heart 2", 545, 470, 110, RED)],
    1: [A("smartphone 1", 110, 370, 150), T(110, 480, 38, "1000"), A("Takeaway coffee", 450, 985, 100), A("Takeaway coffee", 520, 985, 100), A("Takeaway coffee", 590, 985, 100), T(560, 1060, 40, "x400", GOLD)],
    2: [A("Question mark 2 (thick)", 300, 355, 120, RED)],
    3: [C(300, 700, 600, { col: RED }), C(300, 700, 550, { col: RED })],
  },
  "MODAU:1": {
    0: [A("Racing car", 520, 440, 220), T(850, 330, 60, "x4", GOLD)],
    1: place(trunk(place(tire(), 0, 22, 0.42)), 250, 880, 1.0),
    2: [A("Go upstairs 1", 830, 820, 330), T(830, 620, 40, "5 cảnh giới", GOLD)],
    3: [A("Sherlock Holmes 2", 545, 830, 330, AMBER)],
  },
  "L1:0": levelTitle("1"),
  "L1:1": {
    0: [A("Moon 1", 190, 400, 160), A("Alarm clock 2", 190, 770, 190), A("smartphone 1", 600, 680, 400), ...place(bubble(330, 92, "Anh ngủ chưa?", 42), 640, 330, 1)],
    1: place(summon(), 600, 680, 1.22),
  },
  "L1:2": {
    0: [A("House 1", 220, 520, 250), A("Run 2", 590, 640, 320), T(700, 390, 48, "4 phút", GOLD)],
    1: [A("Flip flops", 890, 620, 105), T(830, 720, 46, "T", RED), T(950, 720, 46, "T", RED)],
    2: [A("Crying face 2", 230, 890, 190), T(430, 900, 44, "3 tiếng", GREY)],
  },
  "L1:3": {
    0: [A("smartphone 2", 320, 600, 400), A("Heart 2", 320, 600, 90, RED), T(320, 850, 34, "Cảm ơn vũ trụ"), A("Sun 2", 770, 400, 190, GOLD)],
    1: [...place(trunk([]), 770, 880, 1.1), A("Sad face 1", 770, 880, 100), P("M650,700 Q700,640 760,700", { col: RED }), P("M745,690 L762,704 L768,682", { col: RED })],
    3: "box",
  },
  "L2:0": levelTitle("2"),
  "L2:1": {
    0: [...place(tire(), 540, 470, 0.95), A("Crown 2", 540, 335, 100, GOLD)],
    1: [A("Sad face 2", 210, 770, 150), T(210, 900, 44, "#1", RED)],
    2: [A("Bowl of cereals 1", 540, 780, 150), T(540, 900, 44, "#1", RED)],
    3: [A("Car crash", 860, 780, 170), T(860, 900, 44, "#1", RED)],
    4: [A("Superman", 880, 450, 260), ...place(sparkle(), 975, 360, 0.8), ...place(sparkle(), 780, 360, 0.6)],
  },
  "L2:2": {
    0: [A("Waiting 2", 290, 740, 440), ...place(bubble(220, 100, "Đẹp.", 54), 430, 370, 1)],
    1: [...place(tire(), 760, 560, 1.3), L(700, 400, 760, 470, INK), L(682, 412, 718, 388, INK), P("M640,420 Q610,400 600,370 M660,400 Q650,370 625,350 M612,452 Q585,445 565,425", { col: RED })],
    4: [...place(tire(), 290, 960, 0.4), ...place(tire(), 410, 960, 0.4), ...place(tire(), 530, 960, 0.4), ...place(tire(), 650, 960, 0.4), L(290, 920, 290, 840), P("M290,840 L350,856 L290,872", { col: RED }), A("Closed door", 880, 930, 200), T(880, 800, 32, "LÊN LỚP"), ...place(cross(), 880, 930, 0.8)],
    3: "box",
  },
  "L3:0": levelTitle("3"),
  "L3:1": {
    0: [A("Thinking 1", 210, 780, 420)],
    1: [A("Coach bag 1", 590, 640, 170), A("Gift 2", 780, 640, 170), A("Moneybags", 960, 655, 120), T(780, 500, 52, "$$$", JADE)],
    2: [...place(noodleCup(), 600, 950, 0.8), A("Empty calendar 4", 840, 945, 160), T(840, 840, 40, "28 ngày", RED)],
  },
  "L3:2": {
    0: [A("Unwrap a gift 3", 260, 730, 340), ...place(bubble(300, 96, "anh trai", 52, RED), 560, 360, 1)],
    1: [A("Tired 1", 560, 690, 230), T(560, 540, 46, "−3 tầng", RED)],
    4: [...place(michelin(), 870, 800, 1.0)],
    3: "box",
  },
  "L4:0": levelTitle("4"),
  "L4:1": {
    0: [A("Waiting 7", 540, 790, 380), ...place(bubble(260, 96, "Bạn: Lốp!", 44), 230, 400, 1), ...place(bubble(260, 96, "Mẹ: Lốp!", 44), 850, 400, 1)],
    1: [A("Cat 2", 200, 900, 210), A("Thinking bubble 1", 370, 650, 170), ...place(tire(), 370, 645, 0.45)],
  },
  "L4:2": {
    0: [...place(pump(), 240, 820, 1.1), P("M268,900 Q380,960 470,880"), ...place(tire(), 520, 880, 0.5), A("Heart 2", 520, 650, 90, RED)],
    1: [...place(tire(), 700, 860, 0.75), A("Alarm clock", 700, 600, 120), T(700, 470, 40, "6 tiếng", GOLD)],
    2: [...place(tire(), 905, 820, 1.1), A("Cat 1", 905, 500, 150)],
  },
  "L4:3": {
    0: [A("Ring 4", 270, 520, 240, SKY), T(270, 700, 44, "đính hôn", RED)],
    1: [...place(burst("BỤP!"), 700, 650, 1.55), A("Cloud 1", 560, 910, 90, GREY), A("Cloud 1", 870, 930, 80, GREY)],
    4: [A("Closed padlock 2", 380, 960, 140), A("Key", 570, 960, 110, GOLD)],
    3: "box",
  },
  "L5:0": levelTitle("5"),
  "L5:1": {
    0: [A("Moon 1", 190, 400, 150), A("smartphone 1", 470, 660, 380), ...place(bubble(330, 92, "Anh ngủ chưa?", 42), 520, 350, 1)],
    1: [R(700, 480, 180, 70), T(790, 514, 40, "..."), ...place(cross(), 790, 514, 0.6)],
    2: [A("Sleeping 5", 800, 880, 250), A("Clock", 960, 650, 110), T(960, 740, 34, "10 giờ", BLUE)],
  },
  "L5:2": {
    0: [A("Run 1", 180, 450, 240), A("Books", 430, 480, 140), A("Coffee shop 1", 780, 460, 260)],
    1: [A("Smartphone 4", 230, 840, 260), ...place(bubble(470, 104, "Dạo này anh khác quá.", 40), 560, 710, 1)],
    2: [A("Racing car", 820, 910, 150), ...place(sparkle(), 960, 850, 0.9), ...place(sparkle(), 680, 850, 0.6)],
    4: "box",
  },
  "KET:0": {
    0: [...place(stairs(), 540, 760, 1.6), ...[0, 1, 2, 3, 4].map((i) => T(220 + 160 * i, 918 - 64 * i, 40, `${i + 1}`))],
    1: [T(220, 830, 38, "hạ phẩm", GREY), T(380, 766, 38, "trung", GREY), T(540, 702, 38, "thượng", GREY)],
    2: [...place(tire(), 960, 580, 0.5), ...place(speed(), 905, 580, 0.6), T(880, 470, 44, "cực phẩm", RED)],
  },
  "KET:1": {
    0: [A("Book 1", 320, 620, 230), T(320, 440, 64, "LỐP", RED), T(320, 790, 36, "(danh từ)")],
    1: [A("Heart 1", 780, 600, 280, RED)],
  },
  "CTA:0": {
    0: [C(300, 520, 200, { col: BLUE }), T(300, 524, 120, "@", BLUE), ...place(bubble(320, 100, "cảnh giới 4!", 44), 720, 480, 1)],
    1: place(followButton(), 540, 860, 1.15),
  },
};

const SFX: Sfx[] = [
  { line: "L1:1:0", offset: 1.2, src: "sfx/ui/iphone-ding.mp3", vol: 0.5 },
  { line: "L1:2:1", offset: 2.6, src: "sfx/funny/record-scratch.mp3", vol: 0.35 },
  { line: "L3:2:0", offset: 3.0, src: "sfx/punch/emotional-damage.mp3", vol: 0.45 },
  { line: "L4:3:1", offset: 2.0, src: "sfx/punch/vine-boom.mp3", vol: 0.5 },
  { line: "L5:1:0", offset: 2.6, src: "sfx/ui/iphone-ding.mp3", vol: 0.5 },
];

export const LopWhiteboard: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <WhiteboardVideo timeline={TL} scenes={SCENES} doodles={doodles as Doodles} sfx={SFX} slug="lop" footer="ĐỘ KIẾP CÙNG BẦN ĐẠO" bgm={bgm} />
);
