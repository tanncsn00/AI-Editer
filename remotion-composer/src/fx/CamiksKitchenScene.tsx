/**
 * CamiksKitchenScene — hand-authored primitive list for the kitchen moment
 * (kid pouring salt, mom staring). Rendered via RoughScene for hand-drawn
 * wobble. Composition mirrors the reference photo.
 */

import React from "react";
import { RoughScene, RoughItem } from "./RoughScene";

const SKIN = "#F7E0C3";
const SKIN2 = "#EAC9A3";
const HAIR = "#120808";
const SHIRT = "#FAFAF0";
const PANTS = "#181A22";
const GREY = "#6A6272";
const PAN = "#1B1B1E";
const STOVE = "#2A2A2A";
const RICE = "#FFFBEA";
const YOLK = "#FFB13A";
const TILE = "#E6DDC6";
const TILE_LINE = "#6E6249";
const RED = "#B8453E";
const CURTAIN_DARK = "#7E2C2C";
const WALL = "#EADDBF";
const BASKET = "#B48556";
const BASKET_DARK = "#6E4B2A";
const BG_PAPER = "#EFE4C9";
const INK = "#120808";

// --- background (paper tint) ---
const bg: RoughItem[] = [
  { kind: "rect", x: 0, y: 0, w: 1080, h: 1920, fill: BG_PAPER, fillStyle: "solid", stroke: "none" },
];

// --- wall ---
const wall: RoughItem[] = [
  { kind: "rect", x: 0, y: 0, w: 280, h: 1300, fill: TILE, fillStyle: "solid", stroke: INK, strokeWidth: 3, roughness: 2.2 },
  { kind: "rect", x: 280, y: 0, w: 800, h: 1100, fill: WALL, fillStyle: "solid", stroke: INK, strokeWidth: 3, roughness: 2.2 },
];

// tile grid lines
const tileLines: RoughItem[] = [];
for (let r = 0; r < 6; r++) {
  tileLines.push({ kind: "line", x1: 0, y1: 60 + r * 220, x2: 280, y2: 60 + r * 220, stroke: TILE_LINE, strokeWidth: 2, roughness: 1.6 });
}
for (let c = 0; c < 2; c++) {
  tileLines.push({ kind: "line", x1: 30 + c * 130, y1: 0, x2: 30 + c * 130, y2: 1300, stroke: TILE_LINE, strokeWidth: 2, roughness: 1.6 });
}

// --- hanging basket / lampshade top center ---
const basket: RoughItem[] = [
  { kind: "line", x1: 620, y1: 0, x2: 620, y2: 160, stroke: "#3E2F18", strokeWidth: 4 },
  { kind: "ellipse", cx: 620, cy: 260, rx: 150, ry: 80, fill: BASKET, fillStyle: "solid", stroke: INK, strokeWidth: 4, roughness: 2.2 },
  { kind: "ellipse", cx: 620, cy: 245, rx: 120, ry: 55, fill: BASKET_DARK, fillStyle: "hachure", hachureGap: 6, hachureAngle: 45, stroke: INK, strokeWidth: 3, roughness: 2.0 },
];

// --- clothes/bag hanging --- (the grey shape in reference photo)
const bag: RoughItem[] = [
  { kind: "path", d: "M 760,160 L 720,360 L 900,360 L 860,160 Z", fill: "#F0E6D0", fillStyle: "solid", stroke: INK, strokeWidth: 3, roughness: 1.8 },
  { kind: "line", x1: 760, y1: 160, x2: 860, y2: 160, stroke: INK, strokeWidth: 3 },
];

// --- red curtain right ---
const curtain: RoughItem[] = [
  { kind: "rect", x: 900, y: 0, w: 180, h: 1000, fill: WALL, fillStyle: "solid", stroke: INK, strokeWidth: 3, roughness: 2.0 },
];
for (let i = 0; i < 4; i++) {
  curtain.push({ kind: "path", d: `M ${914 + i * 44},20 Q ${924 + i * 44},500 ${914 + i * 44},980`, fill: RED, fillStyle: "solid", stroke: CURTAIN_DARK, strokeWidth: 6, roughness: 2.2 });
  curtain.push({ kind: "path", d: `M ${928 + i * 44},20 Q ${938 + i * 44},500 ${928 + i * 44},980`, stroke: CURTAIN_DARK, strokeWidth: 3, roughness: 1.8 });
}

// --- MOM (right) torso + legs ---
const mom: RoughItem[] = [
  // back leg black
  { kind: "path", d: "M 720,1200 C 700,1400 820,1560 900,1540 L 1000,1540 C 1070,1500 1080,1360 1000,1240 Z",
    fill: PANTS, fillStyle: "solid", stroke: INK, strokeWidth: 6, roughness: 2.0 },
  // front leg folded
  { kind: "path", d: "M 700,1150 C 660,1320 760,1480 840,1460 L 920,1450 C 970,1420 980,1300 920,1180 Z",
    fill: "#25252E", fillStyle: "solid", stroke: INK, strokeWidth: 5, roughness: 1.9 },
  // torso (grey shirt)
  { kind: "path", d: "M 680,880 C 640,1060 660,1220 780,1230 L 1020,1220 C 1060,1140 1070,970 1020,860 C 980,780 700,800 680,880 Z",
    fill: GREY, fillStyle: "solid", stroke: INK, strokeWidth: 6, roughness: 1.9 },
  // forward arm reaching out
  { kind: "path", d: "M 1010,920 C 1100,900 1160,960 1170,1040 C 1175,1100 1140,1120 1110,1110 L 1080,1110 C 1075,1050 1040,980 1010,990 Z",
    fill: GREY, fillStyle: "solid", stroke: INK, strokeWidth: 5, roughness: 1.9 },
  // hand
  { kind: "ellipse", cx: 1160, cy: 1110, rx: 36, ry: 26, fill: SKIN, fillStyle: "solid", stroke: INK, strokeWidth: 5, roughness: 1.7 },
];

// --- MOM head (turned LEFT, stunned) ---
const momHeadCX = 820;
const momHeadCY = 780;
const momHead: RoughItem[] = [
  // hair back
  { kind: "path", d: `M ${momHeadCX - 170},${momHeadCY - 140} C ${momHeadCX - 190},${momHeadCY - 230} ${momHeadCX + 150},${momHeadCY - 240} ${momHeadCX + 170},${momHeadCY - 130} C ${momHeadCX + 180},${momHeadCY - 40} ${momHeadCX + 120},${momHeadCY + 80} ${momHeadCX + 60},${momHeadCY + 90} L ${momHeadCX - 60},${momHeadCY + 90} C ${momHeadCX - 130},${momHeadCY + 60} ${momHeadCX - 180},${momHeadCY - 40} ${momHeadCX - 170},${momHeadCY - 140} Z`,
    fill: HAIR, fillStyle: "solid", stroke: INK, strokeWidth: 5, roughness: 2.0 },
  // face
  { kind: "ellipse", cx: momHeadCX, cy: momHeadCY, rx: 140, ry: 150, fill: SKIN, fillStyle: "solid", stroke: INK, strokeWidth: 6, roughness: 1.9 },
  // bangs
  { kind: "path", d: `M ${momHeadCX - 130},${momHeadCY - 80} C ${momHeadCX - 100},${momHeadCY - 150} ${momHeadCX + 100},${momHeadCY - 160} ${momHeadCX + 130},${momHeadCY - 70} C ${momHeadCX + 100},${momHeadCY - 40} ${momHeadCX + 50},${momHeadCY - 90} ${momHeadCX},${momHeadCY - 60} C ${momHeadCX - 50},${momHeadCY - 90} ${momHeadCX - 100},${momHeadCY - 40} ${momHeadCX - 130},${momHeadCY - 80} Z`,
    fill: HAIR, fillStyle: "solid", stroke: "none" },
  // eyebrows flat / raised
  { kind: "line", x1: momHeadCX - 100, y1: momHeadCY - 40, x2: momHeadCX - 40, y2: momHeadCY - 44, stroke: INK, strokeWidth: 8 },
  { kind: "line", x1: momHeadCX + 100, y1: momHeadCY - 40, x2: momHeadCX + 40, y2: momHeadCY - 44, stroke: INK, strokeWidth: 8 },
  // eyes (wide, tiny pupils offset LEFT toward kid)
  { kind: "circle", cx: momHeadCX - 52, cy: momHeadCY + 6, r: 36, fill: "#FFFFFF", fillStyle: "solid", stroke: INK, strokeWidth: 5, roughness: 1.8 },
  { kind: "circle", cx: momHeadCX + 52, cy: momHeadCY + 6, r: 36, fill: "#FFFFFF", fillStyle: "solid", stroke: INK, strokeWidth: 5, roughness: 1.8 },
  { kind: "circle", cx: momHeadCX - 68, cy: momHeadCY + 10, r: 11, fill: INK, fillStyle: "solid", stroke: "none" },
  { kind: "circle", cx: momHeadCX + 36, cy: momHeadCY + 10, r: 11, fill: INK, fillStyle: "solid", stroke: "none" },
  // nose
  { kind: "path", d: `M ${momHeadCX - 4},${momHeadCY + 40} Q ${momHeadCX},${momHeadCY + 78} ${momHeadCX + 10},${momHeadCY + 88} Q ${momHeadCX},${momHeadCY + 96} ${momHeadCX - 6},${momHeadCY + 92}`,
    stroke: INK, strokeWidth: 4, fill: "none", roughness: 1.8 },
  // mouth agape (O)
  { kind: "ellipse", cx: momHeadCX, cy: momHeadCY + 118, rx: 18, ry: 26, fill: "#602230", fillStyle: "solid", stroke: INK, strokeWidth: 5, roughness: 1.6 },
  // blush
  { kind: "ellipse", cx: momHeadCX - 100, cy: momHeadCY + 50, rx: 22, ry: 9, fill: "#F5A7A3", fillStyle: "solid", stroke: "none" },
  { kind: "ellipse", cx: momHeadCX + 100, cy: momHeadCY + 50, rx: 22, ry: 9, fill: "#F5A7A3", fillStyle: "solid", stroke: "none" },
];

// --- KID (left) body + legs ---
const kidCX = 310;
const kidBodyY = 1100;
const kid: RoughItem[] = [
  // crossed legs (olive pants)
  { kind: "path", d: `M ${kidCX - 90},${kidBodyY + 180} C ${kidCX - 140},${kidBodyY + 290} ${kidCX - 50},${kidBodyY + 360} ${kidCX + 20},${kidBodyY + 350} L ${kidCX + 120},${kidBodyY + 340} C ${kidCX + 180},${kidBodyY + 320} ${kidCX + 170},${kidBodyY + 230} ${kidCX + 120},${kidBodyY + 190} Z`,
    fill: "#857630", fillStyle: "solid", stroke: INK, strokeWidth: 6, roughness: 1.9 },
  // white t-shirt torso
  { kind: "path", d: `M ${kidCX - 120},${kidBodyY} C ${kidCX - 150},${kidBodyY + 110} ${kidCX - 140},${kidBodyY + 200} ${kidCX - 80},${kidBodyY + 220} L ${kidCX + 120},${kidBodyY + 210} C ${kidCX + 160},${kidBodyY + 180} ${kidCX + 160},${kidBodyY + 60} ${kidCX + 130},${kidBodyY - 10} C ${kidCX + 100},${kidBodyY - 70} ${kidCX - 90},${kidBodyY - 70} ${kidCX - 120},${kidBodyY} Z`,
    fill: SHIRT, fillStyle: "solid", stroke: INK, strokeWidth: 6, roughness: 1.9 },
  // left arm back
  { kind: "path", d: `M ${kidCX - 120},${kidBodyY - 20} C ${kidCX - 170},${kidBodyY + 0} ${kidCX - 190},${kidBodyY + 60} ${kidCX - 170},${kidBodyY + 110} C ${kidCX - 150},${kidBodyY + 130} ${kidCX - 130},${kidBodyY + 120} ${kidCX - 120},${kidBodyY + 100} Z`,
    fill: SKIN, fillStyle: "solid", stroke: INK, strokeWidth: 6, roughness: 1.8 },
  // right arm extended holding bag
  { kind: "path", d: `M ${kidCX + 100},${kidBodyY - 30} C ${kidCX + 190},${kidBodyY - 40} ${kidCX + 260},${kidBodyY + 20} ${kidCX + 280},${kidBodyY + 90} C ${kidCX + 290},${kidBodyY + 130} ${kidCX + 260},${kidBodyY + 150} ${kidCX + 240},${kidBodyY + 150} L ${kidCX + 220},${kidBodyY + 150} C ${kidCX + 215},${kidBodyY + 90} ${kidCX + 180},${kidBodyY + 30} ${kidCX + 100},${kidBodyY + 30} Z`,
    fill: SKIN, fillStyle: "solid", stroke: INK, strokeWidth: 6, roughness: 1.8 },
];

// --- KID head ---
const kidHeadCX = kidCX - 10;
const kidHeadCY = kidBodyY - 160;
const kidHead: RoughItem[] = [
  // hair bob back
  { kind: "path", d: `M ${kidHeadCX - 130},${kidHeadCY - 90} C ${kidHeadCX - 140},${kidHeadCY - 190} ${kidHeadCX + 130},${kidHeadCY - 190} ${kidHeadCX + 130},${kidHeadCY - 80} C ${kidHeadCX + 125},${kidHeadCY - 20} ${kidHeadCX + 70},${kidHeadCY - 60} ${kidHeadCX},${kidHeadCY - 50} C ${kidHeadCX - 70},${kidHeadCY - 60} ${kidHeadCX - 120},${kidHeadCY - 30} ${kidHeadCX - 130},${kidHeadCY - 90} Z`,
    fill: HAIR, fillStyle: "solid", stroke: INK, strokeWidth: 5, roughness: 2.0 },
  // face
  { kind: "ellipse", cx: kidHeadCX, cy: kidHeadCY + 20, rx: 135, ry: 145, fill: SKIN, fillStyle: "solid", stroke: INK, strokeWidth: 6, roughness: 1.9 },
  // fringe
  { kind: "path", d: `M ${kidHeadCX - 120},${kidHeadCY - 40} C ${kidHeadCX - 100},${kidHeadCY - 95} ${kidHeadCX + 100},${kidHeadCY - 110} ${kidHeadCX + 120},${kidHeadCY - 30} C ${kidHeadCX + 100},${kidHeadCY - 10} ${kidHeadCX + 50},${kidHeadCY - 60} ${kidHeadCX + 10},${kidHeadCY - 30} C ${kidHeadCX - 30},${kidHeadCY - 60} ${kidHeadCX - 90},${kidHeadCY - 10} ${kidHeadCX - 120},${kidHeadCY - 40} Z`,
    fill: HAIR, fillStyle: "solid", stroke: "none" },
  // eyebrows playful
  { kind: "path", d: `M ${kidHeadCX - 75},${kidHeadCY - 5} Q ${kidHeadCX - 55},${kidHeadCY - 20} ${kidHeadCX - 30},${kidHeadCY - 5}`, stroke: INK, strokeWidth: 6, fill: "none", roughness: 1.6 },
  { kind: "path", d: `M ${kidHeadCX + 75},${kidHeadCY - 5} Q ${kidHeadCX + 55},${kidHeadCY - 20} ${kidHeadCX + 30},${kidHeadCY - 5}`, stroke: INK, strokeWidth: 6, fill: "none", roughness: 1.6 },
  // eyes (look down-right toward pan)
  { kind: "circle", cx: kidHeadCX - 45, cy: kidHeadCY + 28, r: 28, fill: "#FFFFFF", fillStyle: "solid", stroke: INK, strokeWidth: 5, roughness: 1.7 },
  { kind: "circle", cx: kidHeadCX + 45, cy: kidHeadCY + 28, r: 28, fill: "#FFFFFF", fillStyle: "solid", stroke: INK, strokeWidth: 5, roughness: 1.7 },
  { kind: "circle", cx: kidHeadCX - 37, cy: kidHeadCY + 36, r: 12, fill: INK, fillStyle: "solid", stroke: "none" },
  { kind: "circle", cx: kidHeadCX + 53, cy: kidHeadCY + 36, r: 12, fill: INK, fillStyle: "solid", stroke: "none" },
  // nose tiny
  { kind: "path", d: `M ${kidHeadCX - 4},${kidHeadCY + 55} Q ${kidHeadCX},${kidHeadCY + 70} ${kidHeadCX + 8},${kidHeadCY + 72}`, stroke: INK, strokeWidth: 4, fill: "none", roughness: 1.6 },
  // mouth open smile
  { kind: "path", d: `M ${kidHeadCX - 25},${kidHeadCY + 95} Q ${kidHeadCX},${kidHeadCY + 115} ${kidHeadCX + 25},${kidHeadCY + 95}`, stroke: INK, strokeWidth: 5, fill: "#6B2A3A", roughness: 1.6 },
  // blush
  { kind: "ellipse", cx: kidHeadCX - 85, cy: kidHeadCY + 65, rx: 20, ry: 8, fill: "#F5A7A3", fillStyle: "solid", stroke: "none" },
  { kind: "ellipse", cx: kidHeadCX + 85, cy: kidHeadCY + 65, rx: 20, ry: 8, fill: "#F5A7A3", fillStyle: "solid", stroke: "none" },
];

// --- white salt BAG in kid's hand, tilted pouring ---
// Position = kid right hand end ≈ (kidCX+270, kidBodyY+90), rotate 75°
// Author as a series of paths in world coords by precomputing
const rotated = (cx: number, cy: number, ang: number, pts: Array<[number, number]>) => {
  const ca = Math.cos(ang), sa = Math.sin(ang);
  return pts.map(([x, y]) => [cx + (x * ca - y * sa), cy + (x * sa + y * ca)] as [number, number]);
};
const bagCX = kidCX + 260;
const bagCY = kidBodyY + 60;
const bagAng = (75 * Math.PI) / 180;
const bp = (x: number, y: number) => {
  const ca = Math.cos(bagAng), sa = Math.sin(bagAng);
  return [bagCX + (x * ca - y * sa), bagCY + (x * sa + y * ca)];
};
const bagPath = () => {
  // Build bag rectangle + twisted top
  const [p1x, p1y] = bp(-55, -160);
  const [p2x, p2y] = bp(-55, 130);
  const [p3x, p3y] = bp(55, 130);
  const [p4x, p4y] = bp(55, -160);
  return `M ${p1x},${p1y} L ${p2x},${p2y} L ${p3x},${p3y} L ${p4x},${p4y} Z`;
};
const saltBag: RoughItem[] = [
  { kind: "path", d: bagPath(), fill: "#F8F4EE", fillStyle: "solid", stroke: INK, strokeWidth: 5, roughness: 1.8 },
];
// Salt stream: vertical line from bag tip down to pan
const bagTip = bp(0, 130);
const streamEnd = [bagTip[0] + 10, bagTip[1] + 420];
const salt: RoughItem[] = [
  { kind: "path",
    d: `M ${bagTip[0]},${bagTip[1]} C ${bagTip[0] + 30},${bagTip[1] + 100} ${bagTip[0] - 10},${bagTip[1] + 240} ${streamEnd[0]},${streamEnd[1]}`,
    stroke: "#FFFFFF", strokeWidth: 26, fill: "none", roughness: 1.5 },
  { kind: "path",
    d: `M ${bagTip[0]},${bagTip[1]} C ${bagTip[0] + 30},${bagTip[1] + 100} ${bagTip[0] - 10},${bagTip[1] + 240} ${streamEnd[0]},${streamEnd[1]}`,
    stroke: INK, strokeWidth: 3, fill: "none", roughness: 1.6 },
];

// --- PAN + STOVE bottom ---
const pan: RoughItem[] = [
  // stove body
  { kind: "rect", x: 120, y: 1700, w: 720, h: 210, fill: STOVE, fillStyle: "solid", stroke: INK, strokeWidth: 6, roughness: 1.8 },
  // blue flame
  { kind: "path", d: "M 440,1700 Q 460,1640 480,1680 Q 500,1640 520,1700 Z", fill: "#7FC8F0", fillStyle: "solid", stroke: "#0A5AA0", strokeWidth: 3, roughness: 1.6 },
  { kind: "path", d: "M 380,1700 Q 395,1650 410,1685 Q 425,1650 440,1700 Z", fill: "#7FC8F0", fillStyle: "solid", stroke: "#0A5AA0", strokeWidth: 3, roughness: 1.6 },
  { kind: "path", d: "M 530,1700 Q 545,1650 560,1685 Q 575,1650 590,1700 Z", fill: "#7FC8F0", fillStyle: "solid", stroke: "#0A5AA0", strokeWidth: 3, roughness: 1.6 },
  { kind: "path", d: "M 450,1680 Q 480,1660 510,1680 Q 500,1692 480,1686 Q 460,1692 450,1680 Z", fill: "#FFE066", fillStyle: "solid", stroke: "none" },
  // pan oval
  { kind: "ellipse", cx: 480, cy: 1700, rx: 290, ry: 64, fill: PAN, fillStyle: "solid", stroke: INK, strokeWidth: 6, roughness: 1.7 },
  { kind: "ellipse", cx: 480, cy: 1688, rx: 280, ry: 54, fill: "#2E2E32", fillStyle: "solid", stroke: INK, strokeWidth: 3, roughness: 1.6 },
  // pan handle
  { kind: "rect", x: 760, y: 1678, w: 220, h: 32, fill: PAN, fillStyle: "solid", stroke: INK, strokeWidth: 5, roughness: 1.6 },
  // rice pile
  { kind: "ellipse", cx: 420, cy: 1678, rx: 180, ry: 32, fill: RICE, fillStyle: "solid", stroke: "#8E7D4B", strokeWidth: 3, roughness: 1.6 },
  { kind: "ellipse", cx: 420, cy: 1670, rx: 160, ry: 24, fill: "#FFFDF1", fillStyle: "solid", stroke: "none" },
  // yolk
  { kind: "circle", cx: 580, cy: 1680, r: 24, fill: YOLK, fillStyle: "solid", stroke: "#C97A1A", strokeWidth: 3, roughness: 1.5 },
  // salt pile forming in pan where stream lands
  { kind: "ellipse", cx: streamEnd[0], cy: streamEnd[1] - 4, rx: 60, ry: 16, fill: "#FFFFFF", fillStyle: "solid", stroke: "#9E9E9E", strokeWidth: 2, roughness: 1.5 },
];

// --- small signature ---
// (rendered as a plain text node outside rough)

export const CamiksKitchenItems: RoughItem[] = [
  ...bg,
  ...wall,
  ...tileLines,
  ...basket,
  ...bag,
  ...curtain,
  ...mom,
  ...momHead,
  ...kid,
  ...kidHead,
  ...saltBag,
  ...salt,
  ...pan,
];

export const CamiksKitchenScene: React.FC<{ shakePerFrame?: number }> = ({ shakePerFrame = 0 }) => (
  <RoughScene viewBox="0 0 1080 1920" items={CamiksKitchenItems} seedBase={7} shakePerFrame={shakePerFrame} />
);
