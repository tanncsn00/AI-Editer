import React, { useEffect, useState } from "react";
import { AbsoluteFill, cancelRender, continueRender, delayRender } from "remotion";
import { loadFont } from "@remotion/google-fonts/Pangolin";
import rough from "roughjs";
import { Hand } from "./whiteboard/WhiteboardVideo";
import doodles from "./ngay-dau-nhap-mon_doodles.json";

const { fontFamily, waitUntilDone } = loadFont("normal", { weights: ["400"], subsets: ["vietnamese", "latin", "latin-ext"] });

const BG = "#0B0A12";
const INK = "#F2ECE0";
const RED = "#FF4D5E";
const GOLD = "#E5B54C";
const GREY = "#A79FB8";

const gen = rough.generator();

type DoodlePart = { fill: string; rule: string; subs: string[] };
const DOODLES = doodles as Record<string, { w: number; h: number; parts: DoodlePart[] }>;

const Doodle: React.FC<{ name: keyof typeof doodles; x: number; y: number; h: number; col?: string }> = ({ name, x, y, h, col = INK }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <g transform={`translate(${x},${y}) scale(${h / DOODLES[name].h})`}>
      {DOODLES[name].parts.map((part, i) => (
        <path key={i} d={part.subs.join(" ")} fill={part.fill.toLowerCase() === "#ffffff" ? BG : col} fillRule={part.rule as "nonzero" | "evenodd"} />
      ))}
    </g>
  </svg>
);
type Drawable = ReturnType<typeof gen.circle>;

const Sketch: React.FC<{ items: Drawable[] }> = ({ items }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    {items.flatMap((d, i) =>
      gen.toPaths(d).map((p, j) => <path key={`${i}-${j}`} d={p.d} stroke={p.stroke} strokeWidth={p.strokeWidth} fill={p.fill ?? "none"} strokeLinecap="round" strokeLinejoin="round" />),
    )}
  </svg>
);

const ink = (col: string, seed: number, width = 6) => ({ stroke: col, strokeWidth: width, roughness: 1.3, bowing: 1.1, seed });

const emptyChair = (x: number, y: number, seed: number): Drawable[] => [
  gen.rectangle(x - 45, y - 18, 90, 20, ink(GREY, seed, 5)),
  gen.line(x - 40, y + 2, x - 40, y + 64, ink(GREY, seed + 1, 5)),
  gen.line(x + 40, y + 2, x + 40, y + 64, ink(GREY, seed + 2, 5)),
  gen.line(x - 40, y - 18, x - 45, y - 100, ink(GREY, seed + 3, 5)),
  gen.line(x - 45, y - 100, x + 36, y - 100, ink(GREY, seed + 4, 5)),
  gen.line(x + 36, y - 100, x + 40, y - 18, ink(GREY, seed + 5, 5)),
];

const drawing = (): Drawable[] => [
  ...[150, 320, 760, 930].flatMap((x, i) => emptyChair(x, 1230, 10 + i * 10)),
  gen.rectangle(100, 1560, 880, 130, ink(GOLD, 80)),
];

export const NgayDauWhiteboardThumbnail: React.FC = () => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("thumbnail font"));
  useEffect(() => {
    waitUntilDone()
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [handle]);
  if (!ready) return null;
  const text = (top: number, size: number, color: string, value: string, extra: React.CSSProperties = {}) => (
    <div style={{ position: "absolute", top, left: 0, right: 0, textAlign: "center", fontFamily, fontSize: size, color, lineHeight: 1.1, ...extra }}>{value}</div>
  );
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ backgroundImage: `linear-gradient(90deg, ${GOLD}0C 2px, transparent 2px)`, backgroundSize: "120px 100%" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 800px 720px at 50% 24%, ${GOLD}24 0%, transparent 62%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 800px 720px at 50% 80%, ${RED}18 0%, transparent 62%)` }} />
      <Sketch items={drawing()} />
      <Doodle name="Sitting" x={540} y={1200} h={360} />
      <Doodle name="Alarm clock 2" x={860} y={900} h={200} col={GOLD} />
      {text(150, 50, GREY, "CÔNG SỞ GIỚI", { letterSpacing: 6 })}
      {text(260, 140, INK, "NGÀY ĐẦU")}
      {text(420, 190, RED, "ĐI LÀM")}
      {text(700, 120, GOLD, "7:45")}
      {text(1420, 48, GREY, "cả công ty… chưa ai tới")}
      {text(1590, 62, GOLD, "Ngươi toang ở đoạn nào?")}
      {text(1760, 34, `${GREY}AA`, "ĐỘ KIẾP CÙNG CHỐN CÔNG SỞ", { letterSpacing: 4 })}
      <Hand x={975} y={1668} />
    </AbsoluteFill>
  );
};
