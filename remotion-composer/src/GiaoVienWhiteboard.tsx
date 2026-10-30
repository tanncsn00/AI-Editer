import React from "react";
import timeline from "./giaovien_timeline.json";
import doodles from "./giaovien_doodles.json";
import { Doodles, Sfx, Timeline, WhiteboardVideo, whiteboardFrames } from "./whiteboard/WhiteboardVideo";
import { A, BLUE, E, GOLD, GREY, JADE, L, P, R, RED, Scenes, Sh, T, bubble, cross, followButton, place, sparkle, stairs, summon } from "./whiteboard/shapes";

const TL = timeline as Timeline;

export const GIAOVIEN_FRAMES = whiteboardFrames(TL);

const crack = (): Sh[] => [P("M0,-60 L-14,-22 L12,0 L-10,30 L6,60", { col: RED })];

const petBowl = (): Sh[] => [E(0, 0, 220, 60), P("M-110,0 L-90,60 L90,60 L110,0")];

const mountain = (): Sh[] => [P("M-320,120 L-140,-120 L-60,-30 L60,-190 L320,120 Z"), P("M30,-150 L60,-190 L90,-150", { col: GOLD })];

const kitBook = (): Sh[] => [
  R(-160, -210, 320, 420, { col: GOLD }),
  L(-130, -210, -130, 210, GOLD),
  T(15, -120, 46, "GIÁO VIÊN"),
  T(15, -60, 46, "LÀM CHỦ"),
  T(15, 40, 120, "AI", RED),
  T(15, 150, 28, "học liệu giảng dạy", GREY),
];

const commentBox = (): Sh[] => [R(-320, -70, 640, 140, { col: RED }), T(0, 2, 70, "AI TEACHER", RED)];

const SCENES: Scenes = {
  "HOOK:0": {
    0: [A("School building 1", 540, 520, 330)],
    1: [T(540, 760, 64, "SƯ PHẠM TÔNG", GOLD)],
    2: [...place(sparkle(), 230, 400, 1), ...place(sparkle(), 860, 380, 0.8)],
    3: [A("Moneybag", 860, 930, 140), ...place(cross(), 860, 930, 0.9)],
  },
  "HOOK:1": {
    0: [A("Class presentation", 540, 540, 420), T(900, 330, 56, "x45", GOLD)],
    1: [A("Shout", 210, 910, 200)],
    2: [A("Clock", 540, 930, 140)],
    3: [...place(bubble(300, 90, "lần cuối!", 44, RED), 830, 880, 1), T(830, 1000, 40, "x 3650", GOLD)],
  },
  "VANTHANH:0": {
    0: [T(540, 330, 80, "VẠN THANH", RED)],
    1: [A("Teacher 1", 300, 720, 420), ...place(bubble(280, 90, "ồn ào...", 40), 790, 470, 1)],
    2: [A("Kid 1", 640, 910, 150), A("Kid 2", 800, 910, 150), A("Kid 3", 960, 910, 150)],
    3: [...place(bubble(280, 90, "lại họp!", 40, RED), 790, 680, 1)],
  },
  "VANTHANH:1": {
    0: [A("Waiting 2", 220, 700, 460), ...place(bubble(320, 90, "Đứa nào?", 44), 400, 360, 1)],
    1: [A("Open window", 820, 520, 260), A("Kid 1", 700, 890, 140), A("Kid 2", 850, 890, 140), A("Kid 3", 1000, 890, 140)],
    2: [A("Heart 2", 450, 960, 120, RED), ...place(crack(), 450, 960, 0.9)],
  },
  "VANTHANH:2": {
    0: [A("Pencil", 300, 480, 120, RED)],
    1: [A("Notebook", 760, 600, 320), A("Sad face 1", 300, 800, 150)],
    3: "box",
  },
  "TAPVAN:0": {
    0: [A("House 1", 200, 450, 220)],
    1: [A("Notebook", 520, 470, 170), A("Notebook", 600, 470, 170), A("Notebook", 680, 470, 170), T(600, 600, 44, "x30", GOLD)],
    2: [A("smartphone 1", 910, 470, 200)],
    3: [A("Crown 2", 300, 860, 130, GOLD)],
    4: place(summon(), 760, 860, 0.72),
  },
  "TAPVAN:1": {
    0: [A("Family 6", 300, 520, 300)],
    1: [A("Notebook", 780, 520, 300)],
    2: [A("Relax", 380, 880, 250), ...place(petBowl(), 790, 960, 1), T(790, 860, 64, "BỐ", RED)],
  },
  "TAPVAN:2": {
    0: [A("Eye 2", 540, 330, 110)],
    1: [A("Relax", 260, 620, 260)],
    2: [A("Rice bowl", 790, 640, 160), ...place(bubble(300, 84, "đợi tao tí", 38), 790, 460, 1)],
    3: [A("Smartphone 5", 260, 900, 230)],
    4: [A("Heart 2", 790, 900, 140, RED), T(790, 1010, 38, "vừa vừa", GOLD)],
  },
  "TAPVAN:3": {
    0: [A("Notebook", 470, 600, 400), A("Pencil", 830, 520, 90, RED), T(540, 920, 64, "Chưa phù hợp", RED)],
  },
  "TAPVAN:4": {
    0: [A("Waiting 1", 220, 680, 440)],
    1: [T(480, 420, 70, "...", GREY)],
    2: [A("Eye 2", 480, 580, 80, GOLD)],
    3: [...place(bubble(380, 96, "Đúng từng chữ!", 40, RED), 780, 420, 1)],
    4: [A("Smartphone 5", 790, 820, 330)],
  },
  "TAPVAN:5": {
    0: [A("Fire", 290, 420, 160, RED), A("Eye 1", 540, 420, 170, GOLD), A("Fire", 790, 420, 160, RED)],
    1: [A("Family 6", 540, 780, 260)],
    3: "box",
  },
  "DAVAN:0": {
    0: [A("School building 1", 280, 560, 240), ...place(cross(), 280, 560, 1.2)],
    1: [A("smartphone 1", 770, 620, 420), T(520, 420, 60, "Zalo", BLUE)],
  },
  "DAVAN:1": {
    0: [A("smartphone 2", 260, 600, 360), T(430, 380, 56, "x3", GOLD)],
    1: [A("Moon 1", 700, 360, 120), T(860, 370, 50, "23:00", RED)],
    2: [A("Smartphone notification 1", 780, 800, 320)],
  },
  "DAVAN:2": {
    0: [A("Smartphone notification 3", 230, 560, 320)],
    1: [T(600, 420, 100, "8", RED), T(730, 420, 60, "<"), T(860, 420, 100, "9", JADE)],
    2: [A("Magnifying glass", 730, 640, 160)],
    3: [A("Notebook", 560, 910, 160), A("Notebook", 820, 910, 160), L(640, 910, 740, 910, RED), A("Question mark 2 (thick)", 960, 880, 110, RED)],
  },
  "DAVAN:3": {
    0: [...place(summon(), 540, 600, 0.9), A("Shield", 540, 600, 180, GOLD)],
    2: "box",
  },
  "DUGIO:0": {
    0: [A("Waiting 7", 170, 520, 250), A("Waiting 7", 330, 520, 250), A("Waiting 7", 490, 520, 250), T(330, 330, 40, "ĐOÀN DỰ GIỜ", RED)],
    1: [A("Teacher 1", 820, 520, 300)],
    2: [A("Hand", 330, 830, 150, JADE), T(330, 950, 40, "biết", JADE), A("Hand", 760, 830, 150, RED), T(760, 950, 40, "không biết", RED)],
    3: [...place(sparkle(), 440, 760, 0.8), ...place(cross(), 760, 830, 0.9)],
  },
  "DUGIO:1": {
    0: [A("Class presentation", 540, 450, 300)],
    1: [A("Waiting 7", 170, 820, 260), A("Question mark 2 (thick)", 300, 650, 100, RED)],
    2: [A("Hand", 470, 830, 110, RED), A("Hand", 590, 830, 110, RED), A("Hand", 710, 830, 110, RED), T(590, 930, 40, "TRÁI", RED)],
  },
  "DUGIO:2": {
    0: [A("Waiting 7", 250, 650, 380), ...place(bubble(300, 84, "Để tôi gọi!", 38), 560, 400, 1)],
    1: [L(400, 620, 680, 700, RED), P("M650,680 L684,702 L652,724", { col: RED }), A("Kid 2", 820, 720, 220)],
    2: [A("Hand", 960, 520, 120, RED)],
  },
  "DUGIO:3": {
    0: [A("Ghost", 540, 450, 260), P("M540,600 L540,720", { col: GREY }), A("Sleeping 4", 540, 880, 200)],
  },
  "DUGIO:4": {
    0: [A("Waiting 7", 280, 640, 380), A("Notebook", 520, 720, 150)],
    1: [A("Teacher 1", 810, 700, 300), T(810, 480, 44, "năm 1995", GREY)],
  },
  "HAIMUOI:0": {
    0: [A("Gifts", 300, 420, 200), ...place(sparkle(), 120, 330, 0.7)],
    1: [T(740, 420, 110, "20/11", GOLD)],
    2: [
      A("Cup 1", 180, 700, 120),
      A("Cup 2", 320, 700, 120),
      A("English tea cup", 460, 700, 120),
      A("Cup 1", 600, 700, 120),
      A("Cup 2", 740, 700, 120),
      A("English tea cup", 880, 700, 120),
      T(540, 830, 54, "x17", GOLD),
    ],
    3: [A("Family 1", 540, 960, 150)],
  },
  "HAIMUOI:1": {
    0: [A("Run 2", 230, 560, 300)],
    1: [A("Heart 2", 470, 470, 100, RED), ...place(bubble(320, 84, "Nhớ thầy lắm!", 36), 600, 330, 1)],
    2: [A("Talk 1", 790, 640, 220)],
    3: [A("Question mark 2 (thick)", 790, 900, 150, RED)],
  },
  "CANHGIOI:0": {
    0: [A("Thinking 1", 200, 440, 230), ...place(stairs(), 540, 760, 1.6)],
    1: [T(220, 840, 38, "hạ phẩm", GREY)],
    2: [T(380, 776, 38, "trung", GREY)],
    3: [T(540, 712, 38, "thượng", GREY)],
  },
  "CANHGIOI:1": {
    0: [A("Crown 2", 540, 360, 140, GOLD), T(540, 490, 56, "CỰC PHẨM", GOLD)],
    1: [A("Talk 1", 340, 790, 260), A("Heart 2", 560, 720, 90, RED)],
    2: [A("Book 1", 820, 820, 220, GREY), ...place(cross(), 820, 820, 1)],
  },
  "KET:0": {
    0: [A("Shout", 300, 520, 260), ...place(bubble(320, 90, "lần cuối!", 42, RED), 720, 380, 1)],
    2: [...place(mountain(), 540, 860, 1), T(540, 1010, 40, "9981 kiếp", GOLD)],
  },
  "KIT:0": {
    0: [T(540, 380, 70, "9981 kiếp", RED), ...place(cross(), 540, 380, 1.1)],
    1: [...place(kitBook(), 540, 770, 0.95), ...place(sparkle(), 300, 600, 0.9), ...place(sparkle(), 790, 940, 0.7)],
  },
  "KIT:1": {
    0: [A("Laptop", 200, 420, 160), T(200, 540, 38, "20 prompt", GOLD)],
    1: [A("Notebook", 540, 420, 170), T(540, 540, 38, "5 workflow", GOLD)],
    2: [A("Puzzle piece", 880, 420, 140), T(880, 540, 38, "5 trò chơi", GOLD)],
    3: [A("Rocket 2", 330, 800, 200), T(330, 950, 38, "trước / sau", GOLD)],
    4: [A("Shield", 750, 800, 190, JADE), T(750, 950, 38, "checklist", GOLD)],
  },
  "KIT:2": {
    0: [A("Clock", 300, 560, 220), T(300, 720, 44, "21:59", JADE), A("Relax", 770, 600, 260)],
    1: [T(540, 920, 96, "MIỄN PHÍ", GOLD), ...place(sparkle(), 180, 880, 0.9), ...place(sparkle(), 900, 960, 0.8)],
  },
  "KIT:3": {
    0: [T(540, 340, 40, "Bình luận:", GREY), ...place(commentBox(), 540, 460, 1)],
    1: place(followButton(), 540, 830, 1.15),
  },
};

const SFX: Sfx[] = [
  { line: "VANTHANH:1:2", offset: 3.1, src: "sfx/punch/bonk.mp3", vol: 0.45 },
  { line: "TAPVAN:1:2", offset: 1.3, src: "sfx/funny/record-scratch.mp3", vol: 0.35 },
  { line: "TAPVAN:4:1", offset: 1.0, src: "sfx/funny/crickets.mp3", vol: 0.25 },
  { line: "TAPVAN:4:3", offset: 2.6, src: "sfx/punch/vine-boom.mp3", vol: 0.5 },
  { line: "DAVAN:1:1", offset: 1.7, src: "sfx/ui/iphone-ding.mp3", vol: 0.5 },
  { line: "DUGIO:2:2", offset: 4.1, src: "sfx/punch/emotional-damage.mp3", vol: 0.45 },
  { line: "DUGIO:3:0", offset: 0.4, src: "sfx/fail/roblox-oof.mp3", vol: 0.4 },
  { line: "HAIMUOI:0:3", offset: 1.1, src: "sfx/funny/record-scratch.mp3", vol: 0.35 },
  { line: "HAIMUOI:1:3", offset: 1.7, src: "sfx/fail/fail-trombone.mp3", vol: 0.4 },
  { line: "KIT:2:1", offset: 0.5, src: "sfx/win/level-up.mp3", vol: 0.45 },
];

export const GiaoVienWhiteboard: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <WhiteboardVideo timeline={TL} scenes={SCENES} doodles={doodles as Doodles} sfx={SFX} slug="giaovien" footer="TRUYỀN KỲ CÁC NGHỀ" bgm={bgm} />
);
