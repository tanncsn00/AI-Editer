import React from "react";
import timeline from "./hht_timeline.json";
import doodles from "./hht_doodles.json";
import { Doodles, Sfx, Timeline, WhiteboardVideo, whiteboardFrames } from "./whiteboard/WhiteboardVideo";
import { A, C, E, GOLD, GREY, INK, JADE, L, P, R, RED, Scene, Scenes, Sh, T, bubble, followButton, place, sparkle, stairs } from "./whiteboard/shapes";

const TL = timeline as Timeline;

export const HOHANG_FRAMES = whiteboardFrames(TL);

export const envelope = (label = ""): Sh[] => [
  R(-110, -160, 220, 320, { col: RED }),
  P("M-110,-160 L0,-70 L110,-160", { col: RED }),
  C(0, -70, 70, { col: GOLD }),
  T(0, 60, 150, label, GOLD),
];

const eyePair = (x: number, y: number): Sh[] => [A("Eye 2", x - 34, y, 36, RED), A("Eye 2", x + 34, y, 36, RED)];

const banhChung = (): Sh[] => [
  R(-100, -100, 200, 200, { col: JADE }),
  L(-35, -100, -35, 100),
  L(35, -100, 35, 100),
  L(-100, -35, 100, -35),
  L(-100, 35, 100, 35),
  P("M-35,-35 Q-80,-140 20,-150 Q120,-120 35,-35 M35,35 Q140,60 120,140 Q40,170 -35,35 M-35,35 Q-150,90 -110,150", { col: RED }),
];

const yinYang = (): Sh[] => [C(0, 0, 150), P("M0,-75 Q-40,-37 0,0 Q40,37 0,75"), C(0, -37, 18, { col: GOLD, fill: GOLD }), C(0, 37, 18)];

const arrow = (x1: number, y1: number, x2: number, y2: number, col = GREY): Sh[] => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = (da: number) => `${(x2 - 22 * Math.cos(a + da)).toFixed(1)},${(y2 - 22 * Math.sin(a + da)).toFixed(1)}`;
  return [L(x1, y1, x2, y2, col), P(`M${h(0.5)} L${x2},${y2} L${h(-0.5)}`, { col })];
};

const chieuTitle = (n: string): Scene => ({
  0: place(envelope(n), 540, 620, 1.3),
  1: "banner",
});

const SCENES: Scenes = {
  "MODAU:0": {
    0: [A("Table 2", 540, 830, 340), T(540, 300, 72, "MÙNG 2 TẾT", RED)],
    1: [...eyePair(170, 600), ...eyePair(320, 560), ...eyePair(470, 540), ...eyePair(620, 540), ...eyePair(770, 560), ...eyePair(920, 600)],
    2: [A("Glass of red wine", 935, 880, 150)],
    3: place(bubble(560, 96, "Bao nhiêu tuổi rồi?", 46, RED), 540, 430, 1),
    4: [L(110, 990, 260, 820, GOLD), L(135, 1005, 280, 835, GOLD), R(250, 780, 56, 44, { col: INK }), T(330, 760, 48, "!!", RED)],
  },
  "MODAU:1": {
    0: [A("Grandparents", 540, 420, 290)],
    1: [A("Heart 1", 190, 800, 150, RED), T(190, 800, 64, "?", RED)],
    2: [A("Superman", 540, 790, 270), T(540, 620, 44, "???", GREY)],
    3: [A("Wallet 1", 880, 790, 150), T(880, 910, 48, "0đ", RED)],
    4: [...place(sparkle(), 300, 560, 0.9), ...place(sparkle(), 780, 560, 0.9)],
  },
  "C1:0": chieuTitle("1"),
  "C1:1": {
    0: [A("Broken heart 1", 180, 380, 110, RED), T(180, 290, 36, "kén vừa thôi", GREY)],
    1: [...arrow(270, 380, 420, 380), A("Heart 1", 540, 380, 110, RED), T(540, 480, 36, "cưới?", GOLD)],
    2: [...arrow(640, 390, 760, 410), A("Wedding 3", 880, 420, 200), T(880, 560, 36, "đẻ?", GOLD)],
    3: [...arrow(860, 590, 760, 700), A("Baby 1", 690, 760, 140), T(690, 870, 36, "đứa nữa?", GOLD)],
    4: [...arrow(600, 760, 480, 760), A("Family 5", 320, 770, 170), T(320, 900, 36, "con trai?", RED)],
    5: [P("M150,940 Q40,700 140,470", { col: RED }), P("M118,488 L140,470 L156,498", { col: RED })],
  },
  "C1:2": {
    0: [A("Laughing", 300, 760, 400), ...place(bubble(380, 96, "Dạ. Năm sau ạ.", 44), 330, 380, 1)],
    1: [...place(banhChung(), 790, 720, 1.2), T(790, 480, 40, "kinh mạch", RED)],
  },
  "C2:0": chieuTitle("2"),
  "C2:1": {
    0: [A("Look spyglass 1", 260, 420, 220), T(260, 290, 40, "lương?", RED)],
    1: [A("House 1", 210, 830, 140), T(210, 950, 36, "về quê", GREY)],
    2: [A("Moneybag", 540, 830, 160), T(540, 950, 36, "vay ít", GOLD)],
    3: [A("Question mark 2 (thick)", 860, 830, 150, RED), T(860, 950, 36, "đủ = ?", RED)],
    4: [A("Closed padlock 1", 540, 610, 100, RED), ...arrow(500, 640, 260, 740, RED), ...arrow(540, 670, 540, 730, RED), ...arrow(580, 640, 820, 740, RED)],
    5: [A("Gossip 2", 800, 430, 220), T(800, 290, 38, "cả họ biết", RED)],
  },
  "C3:0": chieuTitle("3"),
  "C3:1": {
    0: [A("Superman", 250, 650, 430), A("Graduation cap", 580, 380, 80), A("Moneybags", 760, 380, 100), A("House 2", 940, 380, 110)],
    1: [A("Empty calendar 4", 640, 760, 150), T(640, 880, 40, "20 năm", GREY)],
    2: [T(900, 740, 64, "0 : 20", RED), A("Crying face 1", 900, 890, 100)],
  },
  "C3:2": {
    0: [A("Waiting 2", 250, 740, 420), A("Thinking 1", 830, 740, 420)],
    1: [A("Eye 2", 430, 620, 40), A("Eye 2", 650, 620, 40), L(480, 620, 600, 620, GREY)],
    2: [...place(bubble(440, 96, "Nhìn anh kia kìa!", 42, RED), 760, 320, 1)],
    3: [A("Crown 2", 250, 495, 80, GOLD), ...place(sparkle(), 140, 470, 0.7), ...place(sparkle(), 360, 470, 0.7)],
  },
  "C4:0": chieuTitle("4"),
  "C4:1": {
    0: [T(270, 300, 52, "MÙNG 1", GOLD), A("Grandmother 2", 270, 520, 260), L(540, 270, 540, 1020, GREY)],
    1: [A("Mountains 1", 270, 740, 130), A("Rice bowl", 270, 880, 150), T(270, 990, 34, "núi Thái Sơn", GOLD)],
    2: [T(810, 300, 52, "MÙNG 4", RED), A("Pregnant 2", 810, 700, 520)],
    3: place(yinYang(), 540, 640, 1),
  },
  "C5:0": chieuTitle("5"),
  "C5:1": {
    0: [T(270, 330, 44, "ngày xưa", GREY), A("Kid 3", 230, 640, 300), ...place(envelope(), 400, 700, 0.55)],
    1: [L(540, 300, 540, 1000, GREY), T(810, 330, 44, "năm nay", GOLD), A("Laptop", 810, 560, 200), A("Wallet 1", 810, 830, 170)],
  },
  "C5:2": {
    0: [A("Kid 1", 140, 520, 120), A("Kid 2", 290, 520, 120), A("Kid 3", 440, 520, 120), A("Kid 4", 600, 520, 120), A("Kid 1", 760, 520, 120), A("Kid 2", 920, 520, 120), T(540, 370, 52, "x30", RED)],
    1: [T(760, 640, 40, "#29 ???", RED), ...arrow(760, 615, 760, 590, RED)],
    2: [A("Wallet 1", 260, 870, 140), ...place(envelope(), 440, 850, 0.25), ...place(envelope(), 560, 810, 0.25), ...place(envelope(), 680, 860, 0.25)],
    3: [P("M820,880 A70,70 0 1,1 960,880", { col: JADE }), P("M944,860 L960,882 L980,862", { col: JADE })],
  },
  "KET:0": {
    0: [...place(stairs(), 540, 760, 1.6), ...[0, 1, 2, 3, 4].map((i) => T(220 + 160 * i, 918 - 64 * i, 40, `${i + 1}`))],
    1: [T(220, 830, 38, "hạ phẩm", GREY), T(380, 766, 38, "trung", GREY), T(540, 702, 38, "thượng", GREY)],
    2: [A("Laughing", 860, 510, 230), T(860, 340, 44, "cực phẩm", GOLD)],
  },
  "KET:1": {
    0: [A("Family 9", 540, 560, 300)],
    1: [A("House 1", 540, 890, 160), A("Heart 2", 690, 830, 70, RED)],
  },
  "CTA:0": {
    0: [C(300, 520, 200, { col: GOLD }), T(300, 524, 110, "?", GOLD), ...place(bubble(380, 100, "Lương bao nhiêu?", 42), 740, 480, 1)],
    1: place(followButton(), 540, 860, 1.15),
    2: [A("Glass of red wine", 930, 880, 130)],
  },
};

const SFX: Sfx[] = [
  { line: "MODAU:0:1", offset: 0.1, src: "sfx/funny/record-scratch.mp3", vol: 0.35 },
  { line: "MODAU:0:4", offset: 2.6, src: "sfx/funny/crickets.mp3", vol: 0.6 },
  { line: "C1:1:4", offset: 2.3, src: "sfx/punch/vine-boom.mp3", vol: 0.5 },
  { line: "C2:1:5", offset: 3.0, src: "sfx/ui/iphone-ding.mp3", vol: 0.5 },
  { line: "C3:2:3", offset: 3.0, src: "sfx/win/level-up.mp3", vol: 0.45 },
  { line: "C4:1:2", offset: 3.4, src: "sfx/punch/bonk.mp3", vol: 0.5 },
  { line: "C5:2:2", offset: 1.0, src: "sfx/win/cash-register.mp3", vol: 0.8 },
];

export const HoHangWhiteboard: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <WhiteboardVideo timeline={TL} scenes={SCENES} doodles={doodles as Doodles} sfx={SFX} slug="hht" footer="ĐỘ KIẾP CÙNG BẦN ĐẠO" bgm={bgm} />
);
