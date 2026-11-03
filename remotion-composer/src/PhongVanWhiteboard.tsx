import React from "react";
import timeline from "./phong-van-2026_timeline.json";
import doodles from "./phong-van-2026_doodles.json";
import { Doodles, Keys, Sfx, Timeline, WhiteboardVideo, whiteboardFrames } from "./whiteboard/WhiteboardVideo";
import { A, C, GOLD, GREY, JADE, L, P, R, RED, Scenes, Sh, T, cross, followButton, place, sparkle, speed } from "./whiteboard/shapes";

const TL = timeline as Timeline;

export const PHONGVAN_FRAMES = whiteboardFrames(TL);

const arrow = (x1: number, y1: number, x2: number, y2: number, col = GREY): Sh[] => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = (da: number) => `${(x2 - 24 * Math.cos(a + da)).toFixed(1)},${(y2 - 24 * Math.sin(a + da)).toFixed(1)}`;
  return [L(x1, y1, x2, y2, col), P(`M${h(0.5)} L${x2},${y2} L${h(-0.5)}`, { col })];
};

const linkedList = (): Sh[] => [0, 1, 2].flatMap((i) => [R(-260 + i * 190, -40, 120, 80), L(-200 + i * 190, -40, -200 + i * 190, 40), ...(i < 2 ? arrow(-170 + i * 190, 0, -80 + i * 190, 0, RED) : [T(170, 0, 36, "null", GREY)])]);

const gitGraph = (): Sh[] => [
  L(-240, 0, 240, 0),
  P("M-120,0 Q-80,-90 0,-90 L120,-90 Q180,-90 200,0", { col: RED }),
  ...[-240, -120, 0, 120, 240].map((x) => C(x, 0, 36, { col: GOLD })),
  C(0, -90, 36, { col: RED }),
  C(120, -90, 36, { col: RED }),
];

const halfBar = (): Sh[] => [R(-160, -32, 320, 64), R(-160, -32, 150, 64, { col: JADE, fill: JADE }), L(0, -60, 0, 60, RED)];

const specDoc = (): Sh[] => [
  R(-120, -160, 240, 320),
  ...[0, 1, 2, 3].flatMap((i) => [P(`M-90,${-100 + i * 70} L-70,${-80 + i * 70} L-40,${-120 + i * 70}`, { col: JADE }), L(-20, -100 + i * 70, 90, -100 + i * 70, GREY)]),
];

const toolLoop = (): Sh[] => [
  C(0, -110, 90, { col: GOLD }),
  C(-110, 80, 90, { col: GOLD }),
  C(110, 80, 90, { col: GOLD }),
  ...arrow(40, -80, 90, 20, GREY),
  ...arrow(60, 100, -60, 100, GREY),
  ...arrow(-90, 20, -40, -80, GREY),
];

const marker = (): Sh[] => [R(-110, -24, 180, 48), R(70, -18, 40, 36, { col: RED }), P("M110,-10 L140,0 L110,10", { col: RED })];

const board = (w = 520, h = 300): Sh[] => [R(-w / 2, -h / 2, w, h), L(-w / 2 + 40, h / 2, -w / 2 + 10, h / 2 + 60), L(w / 2 - 40, h / 2, w / 2 - 10, h / 2 + 60)];

const bigCheck = (): Sh[] => [P("M-90,0 L-25,70 L100,-80", { col: JADE })];

const undo = (): Sh[] => [P("M80,60 Q120,-60 0,-70 Q-90,-70 -110,0", { col: RED }), P("M-140,-30 L-110,0 L-80,-30", { col: RED })];

const maxCard = (): Sh[] => [R(-170, -105, 340, 210, { col: GOLD }), T(0, -30, 70, "MAX", GOLD), T(0, 50, 36, "12 tháng", GREY), R(-140, -80, 50, 36)];

const SCENES: Scenes = {
  "HOOK:0": {
    0: [A("Teacher 1", 320, 640, 520), ...place(linkedList(), 760, 330, 0.8)],
    1: [A("Sitting", 830, 790, 380)],
    2: [T(800, 470, 80, "!!", RED)],
  },
  "HOOK:1": {
    0: [A("Boss face", 260, 520, 230), R(380, 820, 320, 16), A("Sit down 5", 800, 700, 420)],
    1: [T(260, 700, 52, "15 năm", GOLD), ...place(sparkle(), 960, 480, 0.8), ...place(sparkle(), 660, 520, 0.6)],
  },
  "THUATTOAN:0": {
    0: [A("Boss face", 220, 460, 220), T(220, 640, 60, "O(n)?", GOLD)],
    1: [A("Sit down 5", 820, 720, 400)],
    2: [A("Brain 3", 520, 460, 180)],
    3: place(cross(), 520, 460, 1.1),
  },
  "THUATTOAN:1": {
    0: place(gitGraph(), 540, 440, 1),
    1: [A("Robot 5", 820, 800, 300)],
    2: [A("Broken heart 1", 280, 800, 220, RED)],
  },
  "AI:0": {
    0: [A("Boss face", 250, 480, 230), T(250, 660, 64, "???", RED)],
    1: [A("Light bulb on", 790, 420, 230)],
    2: [A("Standing 1", 790, 850, 360), ...place(speed(), 700, 850, 0.8)],
  },
  "AI:1": {
    0: [A("Brain 1", 300, 470, 240), ...place(halfBar(), 300, 720, 1)],
    1: place(specDoc(), 790, 560, 1.15),
  },
  "AI:2": {
    0: [A("Robot 5", 190, 470, 260), A("Robot 2", 430, 470, 260), T(190, 640, 40, "viết", GOLD), T(430, 640, 40, "review", GOLD)],
    1: place(toolLoop(), 810, 480, 1),
    2: [...place(marker(), 540, 900, 0.8), ...arrow(540, 840, 540, 760, GREY)],
  },
  "THUTHACH:0": {
    0: [A("Teacher 1", 300, 620, 480)],
    1: [A("Laptop", 800, 480, 220)],
    2: [...place(bigCheck(), 800, 800, 1), T(930, 880, 56, "3s", GOLD)],
  },
  "THUTHACH:1": {
    0: [...place(board(560, 320), 450, 520, 1), ...place(linkedList(), 450, 500, 0.75), T(450, 800, 44, "20 phút", GREY)],
    1: place(undo(), 880, 420, 1.1),
  },
  "THUTHACH:2": {
    0: [A("Moneybag", 250, 480, 220), ...place(maxCard(), 700, 470, 1)],
    1: [T(540, 720, 80, "…", GREY)],
    2: [A("Crown 2", 540, 880, 150, GOLD)],
    3: [A("Boss face", 870, 860, 180), ...place(sparkle(), 980, 760, 0.6)],
  },
  "CTA:0": {
    0: [A("Brain 1", 260, 480, 200), T(540, 480, 90, "vs", RED), A("Robot 5", 820, 480, 260)],
    1: place(followButton(), 540, 860, 1.15),
  },
};

const KEYS: Keys = {
  "HOOK:0:0": "Danh sách liên kết?",
  "HOOK:0:1": "EM KHÔNG BIẾT.",
  "HOOK:1:0": "PHỎNG VẤN 2026",
  "THUATTOAN:0:0": "Big O?",
  "THUATTOAN:0:1": "Không biết.",
  "THUATTOAN:0:2": "Nhị phân?",
  "THUATTOAN:0:3": "Không biết.",
  "THUATTOAN:1:0": "closure? rebase? merge?",
  "THUATTOAN:1:1": "Để AI lo.",
  "AI:0:1": "Hỏi em về AI đi.",
  "AI:1:0": "Context < 50%",
  "AI:1:1": "Đặc tả + test",
  "AI:2:0": "1 agent viết · 1 agent review",
  "AI:2:1": "Claude → Codex → Gemini",
  "THUTHACH:0:2": "3 giây · test xanh",
  "THUTHACH:1:1": "Ctrl Z",
  "THUTHACH:2:0": "Claude Max · 1 năm",
  "THUTHACH:2:2": "ĐƯỢC NHẬN.",
  "THUTHACH:2:3": "…cho anh dùng ké nhé",
  "CTA:0:0": "Thuật toán hay vibe code?",
};

const SFX: Sfx[] = [
  { line: "HOOK:0:1", offset: 0.95, src: "sfx/funny/record-scratch.mp3", vol: 0.3 },
  { line: "AI:0:1", offset: 2.8, src: "sfx/win/level-up.mp3", vol: 0.3 },
  { line: "THUTHACH:0:2", offset: 2.0, src: "sfx/win/ding-correct.mp3", vol: 0.25 },
  { line: "THUTHACH:1:1", offset: 2.8, src: "sfx/punch/vine-boom.mp3", vol: 0.4 },
  { line: "THUTHACH:2:1", offset: 0.0, src: "sfx/funny/crickets.mp3", vol: 0.15 },
  { line: "THUTHACH:2:2", offset: 1.4, src: "sfx/win/cash-register.mp3", vol: 0.3 },
];

export const PhongVanWhiteboard: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <WhiteboardVideo timeline={TL} scenes={SCENES} doodles={doodles as Doodles} sfx={SFX} slug="phong-van-2026" footer="ĐỘ KIẾP CÙNG GIỚI IT" bgm={bgm} keys={KEYS} />
);
