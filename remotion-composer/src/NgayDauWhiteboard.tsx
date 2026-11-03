import React from "react";
import timeline from "./ngay-dau-nhap-mon_timeline.json";
import doodles from "./ngay-dau-nhap-mon_doodles.json";
import { Doodles, Sfx, Timeline, WhiteboardVideo, whiteboardFrames } from "./whiteboard/WhiteboardVideo";
import { A, AMBER, BLUE, C, E, GOLD, GREY, JADE, L, P, R, RED, Scenes, Sh, T, bubble, burst, cross, followButton, place, sparkle } from "./whiteboard/shapes";

const TL = timeline as Timeline;

export const NGAYDAU_FRAMES = whiteboardFrames(TL);

const printer = (): Sh[] => [
  R(-130, -40, 260, 120),
  R(-90, -110, 180, 70),
  R(-80, 80, 160, 30),
  C(95, 0, 18, { col: JADE }),
  L(-70, 20, 40, 20, GREY),
];

const paperOut = (): Sh[] => [R(-70, 110, 140, 150), L(-45, 150, 45, 150, GREY), L(-45, 185, 45, 185, GREY), L(-45, 220, 20, 220, GREY)];

const milkTea = (): Sh[] => [
  P("M-45,-70 L45,-70 L34,80 L-34,80 Z"),
  E(0, -70, 100, 26),
  L(14, -150, 4, -70, AMBER),
  C(-14, 55, 14, { col: AMBER }),
  C(8, 60, 14, { col: AMBER }),
  C(-2, 38, 14, { col: AMBER }),
];

const chair = (): Sh[] => [R(-50, -20, 100, 22), L(-44, 2, -44, 70), L(44, 2, 44, 70), L(-44, -20, -50, -110), L(-50, -110, 40, -110), L(40, -110, 44, -20)];

const building = (): Sh[] => {
  const out: Sh[] = [R(-130, -220, 260, 440)];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) out.push(R(-100 + c * 76, -180 + r * 90, 48, 56));
  return [...out, R(-30, 150, 60, 70)];
};

const docStack = (): Sh[] => [R(-110, -80, 200, 150), R(-95, -95, 200, 150), R(-80, -110, 200, 150), L(-55, -70, 90, -70, GREY), L(-55, -40, 90, -40, GREY), L(-55, -10, 60, -10, GREY)];

const zzz = (x: number, y: number): Sh[] => [T(x, y, 34, "z", GREY), T(x + 26, y - 30, 44, "z", GREY), T(x + 58, y - 66, 54, "z", GREY)];

const phone = (title: string, sub: string): Sh[] => [
  R(-210, -350, 420, 700),
  L(-210, -250, 210, -250),
  T(0, -315, 34, title, BLUE),
  T(0, -275, 26, sub, GREY),
  R(-180, 260, 290, 60),
  P("M135,275 L175,290 L135,305 Z", { col: BLUE }),
];

const bun = (): Sh[] => [P("M-70,30 Q-80,-50 0,-60 Q80,-50 70,30 Z"), P("M-30,-40 Q0,-10 30,-40 M-15,-52 Q0,-25 15,-52", { col: GOLD })];

const loopArrows = (): Sh[] => [
  C(0, 0, 240, { col: JADE }),
  P("M100,-40 L120,-4 L150,-36", { col: JADE }),
  P("M-100,40 L-120,4 L-150,36", { col: JADE }),
];

const SCENES: Scenes = {
  "HOOK:0": {
    0: [A("Alarm clock 2", 230, 430, 230), T(230, 600, 66, "7:45", GOLD)],
    1: place(building(), 820, 560, 0.95),
    2: [A("Standing 1", 520, 830, 360), ...place(sparkle(), 640, 700, 0.8), ...place(sparkle(), 400, 760, 0.6)],
  },
  "HOOK:1": {
    0: [...[160, 330, 750, 920].flatMap((x) => place(chair(), x, 900, 0.85)), A("Sitting", 540, 820, 330), T(540, 560, 44, "0 người", GREY)],
    1: [A("Light bulb off", 860, 400, 220), T(860, 540, 40, "OFF", RED)],
  },
  "CHOMAY:0": {
    0: [A("Clock", 170, 400, 160), T(170, 520, 52, "9:30", GOLD), A("Waiting 3", 520, 790, 380), A("Waiting 1", 840, 790, 380)],
    1: [...place(milkTea(), 640, 760, 0.6), ...place(milkTea(), 960, 760, 0.6), ...zzz(540, 560), ...zzz(860, 560)],
  },
  "CHOMAY:1": {
    0: [A("Boss face", 220, 420, 200), ...place(bubble(470, 96, "Em ngồi tạm đây nhé", 40), 680, 400, 1)],
    1: [...place(printer(), 760, 840, 1), ...place(chair(), 470, 880, 1.1), T(470, 720, 48, "TẠM", RED)],
    2: [A("Computer 2", 180, 860, 170), ...place(cross(), 180, 860, 0.8), T(180, 990, 34, "chiều…", GREY)],
  },
  "CHOMAY:2": {
    0: [A("Waiting 6", 320, 760, 440), T(320, 440, 42, "0 máy · 0 việc · 0 ai", GREY)],
    1: [...place(printer(), 800, 700, 1), ...place(paperOut(), 800, 700, 1), A("Heart 2", 940, 470, 80, RED)],
  },
  "GIAVOBAN:0": {
    0: [A("Boss face", 220, 420, 180), ...place(docStack(), 640, 430, 1.2)],
    1: [A("Reading 1", 380, 830, 360), T(660, 720, 70, "???", RED)],
    2: [T(860, 860, 70, "x2", GOLD), T(860, 960, 60, "???", RED)],
  },
  "GIAVOBAN:1": {
    0: [A("Reading 2", 320, 770, 420), A("Waiting 3", 820, 780, 380), L(620, 700, 690, 700, GREY), L(610, 740, 700, 740, GREY)],
    1: [T(320, 420, 110, "x7", RED)],
    2: [A("Broken heart 1", 820, 420, 170, RED)],
  },
  "BUATRUA:0": {
    0: [A("Alarm clock", 230, 430, 220), T(230, 600, 60, "11:59", GOLD)],
    1: [A("Standing 1", 560, 830, 320), A("Standing 2", 760, 830, 320), A("Standing 1", 960, 830, 320), ...place(sparkle(), 760, 600, 0.8)],
  },
  "BUATRUA:1": {
    0: [A("Hello 9", 310, 740, 400), ...place(bubble(400, 96, "Đi ăn cùng không?", 40), 700, 420, 1)],
    1: [A("Crying face 1", 800, 820, 220)],
  },
  "BUATRUA:2": {
    0: [A("Gossip 3", 280, 500, 300), ...place(bubble(380, 96, "anh Tuấn bên kia…", 38), 720, 380, 1)],
    1: [T(600, 600, 110, "?", RED)],
    2: [A("Laugh", 230, 880, 260), A("Laugh", 470, 880, 260)],
    3: [A("Laughing", 820, 860, 320), T(820, 670, 50, "HA HA HA", GOLD)],
  },
  "ZALO:0": {
    0: place(phone("Nhóm Zalo công ty", "300 thành viên"), 540, 660, 1),
    1: [T(460, 950, 32, "Dạ em ch…", GREY), L(370, 950, 550, 950, RED), T(460, 880, 32, "Em là nhân…", GREY), L(380, 880, 545, 880, RED)],
  },
  "ZALO:1": {
    0: [...place(phone("Nhóm Zalo công ty", "300 thành viên"), 540, 660, 1), R(400, 420, 330, 150, { col: BLUE }), T(565, 460, 30, "Dạ em chào mọi người ạ,"), T(565, 500, 30, "em là nhân viên mới,"), T(565, 540, 30, "mong mọi người giúp đỡ ạ")],
    1: [A("Cat 2", 640, 720, 190)],
    2: [...place(burst("GỬI"), 860, 990, 0.6)],
  },
  "ZALO:2": {
    0: [A("Clock", 250, 420, 150), T(250, 530, 40, "1 phút", GOLD), A("Clock", 540, 420, 150), T(540, 530, 40, "5 phút", GOLD), A("Clock", 830, 420, 150), T(830, 530, 40, "10 phút", GOLD)],
    1: [A("Eye 2", 330, 730, 110), T(620, 730, 64, "47 đã xem")],
    2: [T(540, 920, 66, "0 trả lời", RED)],
  },
  "ZALO:3": {
    0: [A("Smartphone 6", 290, 740, 420), A("Heart 2", 560, 470, 140, RED), T(290, 470, 36, "chị nhân sự", GREY)],
    1: [...place(building(), 830, 820, 0.7), A("Ghost", 830, 420, 200), L(800, 550, 780, 640, GREY), L(860, 550, 880, 640, GREY)],
  },
  "TANCA:0": {
    0: [A("Clock", 190, 410, 160), T(190, 530, 46, "18:00", GOLD), A("Waiting 7", 520, 800, 380)],
    1: [A("Clock", 880, 410, 160), T(880, 530, 46, "18:30", GOLD)],
    2: [A("Desktop mouse 2", 860, 940, 130), A("Thinking bubble 1", 840, 730, 200), ...place(bun(), 840, 715, 0.6)],
  },
  "TANCA:1": {
    0: [A("Waiting 4", 250, 720, 300), ...place(bubble(380, 92, "Việc gấp lắm ạ?", 40), 300, 400, 1)],
    1: [A("Computer 1", 790, 720, 280), ...place(bubble(400, 92, "Chờ hết tắc đường", 38), 780, 400, 1)],
    2: [A("Motorbike", 300, 975, 100), A("Motorbike", 540, 975, 100), A("Motorbike", 780, 975, 100), T(960, 940, 44, "BÍP!", RED)],
  },
  "MOTNAMSAU:0": {
    0: [T(540, 330, 70, "+365 ngày", GOLD)],
    1: [A("Waiting 3", 270, 780, 400), ...place(milkTea(), 380, 760, 0.55), ...zzz(290, 540)],
    2: [A("Sitting", 690, 800, 330), ...place(printer(), 930, 860, 0.7), T(730, 560, 52, "7:45", GOLD), ...place(sparkle(), 620, 640, 0.6)],
  },
  "MOTNAMSAU:1": {
    0: [A("Standing 2", 250, 740, 400), A("Sit down 5", 830, 760, 380), L(370, 600, 700, 620, GREY), L(700, 650, 370, 640, GREY)],
    1: [...place(sparkle(), 360, 520, 0.7), ...place(sparkle(), 150, 560, 0.5)],
    2: place(loopArrows(), 540, 380, 0.9),
  },
  "CTA:0": {
    0: [A("Smartphone notification 1", 250, 520, 300), ...place(bubble(440, 100, "Toang ở đoạn nào?", 42), 700, 420, 1)],
    1: place(followButton(), 540, 860, 1.15),
  },
};

const SFX: Sfx[] = [
  { line: "CHOMAY:1:2", offset: 2.0, src: "sfx/funny/record-scratch.mp3", vol: 0.35 },
  { line: "ZALO:1:2", offset: 0.6, src: "sfx/ui/discord-ping.mp3", vol: 0.5 },
  { line: "ZALO:2:2", offset: 0.85, src: "sfx/funny/crickets.mp3", vol: 0.2 },
  { line: "ZALO:3:0", offset: 2.2, src: "sfx/ui/discord-ping.mp3", vol: 0.5 },
  { line: "ZALO:3:1", offset: 1.0, src: "sfx/punch/vine-boom.mp3", vol: 0.45 },
  { line: "TANCA:1:1", offset: 2.7, src: "sfx/punch/emotional-damage.mp3", vol: 0.35 },
];

export const NgayDauWhiteboard: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <WhiteboardVideo timeline={TL} scenes={SCENES} doodles={doodles as Doodles} sfx={SFX} slug="ngay-dau-nhap-mon" footer="ĐỘ KIẾP CÙNG CHỐN CÔNG SỞ" bgm={bgm} />
);
