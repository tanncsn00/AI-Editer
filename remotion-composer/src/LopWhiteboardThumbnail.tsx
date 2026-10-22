import React, { useEffect, useState } from "react";
import { AbsoluteFill, cancelRender, continueRender, delayRender } from "remotion";
import { loadFont } from "@remotion/google-fonts/Pangolin";
import rough from "roughjs";
import { Hand } from "./whiteboard/WhiteboardVideo";
import doodles from "./lop_doodles.json";

const { fontFamily, waitUntilDone } = loadFont("normal", { weights: ["400"], subsets: ["vietnamese", "latin", "latin-ext"] });

const BG = "#0B0A12";
const INK = "#F2ECE0";
const RED = "#FF4D5E";
const GOLD = "#E5B54C";
const GREY = "#A79FB8";

const gen = rough.generator();

type DoodlePart = { fill: string; rule: string; subs: string[] };
const DOODLES = doodles as Record<string, { w: number; h: number; parts: DoodlePart[] }>;

const Doodle: React.FC<{ name: keyof typeof doodles; x: number; y: number; h: number }> = ({ name, x, y, h }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <g transform={`translate(${x},${y}) scale(${h / DOODLES[name].h})`}>
      {DOODLES[name].parts.map((part, i) => (
        <path key={i} d={part.subs.join(" ")} fill={part.fill.toLowerCase() === "#ffffff" ? BG : INK} fillRule={part.rule as "nonzero" | "evenodd"} />
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

const spokes = (cx: number, cy: number, r: number, seed: number) =>
  Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return gen.line(cx + Math.cos(a) * r, cy + Math.sin(a) * r, cx + Math.cos(a) * r * 0.82, cy + Math.sin(a) * r * 0.82, ink(INK, seed + i, 5));
  });

const drawing = (): Drawable[] => [
  gen.rectangle(150, 450, 780, 380, ink(RED, 3)),
  gen.rectangle(166, 464, 748, 352, ink(RED, 4)),
  gen.circle(320, 1190, 440, ink(INK, 10)),
  gen.circle(320, 1190, 290, ink(INK, 11)),
  ...spokes(320, 1190, 220, 20),
  gen.rectangle(650, 1120, 280, 96, ink(INK, 63)),
  gen.circle(790, 1170, 430, ink(RED, 70)),
  gen.circle(790, 1170, 390, ink(RED, 71)),
  gen.rectangle(100, 1560, 880, 130, ink(GOLD, 80)),
];

export const LopWhiteboardThumbnail: React.FC = () => {
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
      <Doodle name="Waiting 7" x={320} y={1195} h={250} />
      <Doodle name="smartphone 1" x={790} y={1190} h={330} />
      {text(150, 50, GREY, "TRUYỀN KỲ LUÂN TÔNG", { letterSpacing: 6 })}
      {text(270, 150, INK, "5 CẢNH GIỚI")}
      {text(540, 250, RED, "LỐP")}
      <div style={{ position: "absolute", top: 1126, left: 656, width: 268, height: 84, lineHeight: "84px", background: BG, textAlign: "center", fontFamily, fontSize: 38, color: INK }}>Anh ngủ chưa?</div>
      {text(1590, 62, GOLD, "Ngươi đang ở cảnh giới mấy?")}
      {text(1760, 34, `${GREY}AA`, "ĐỘ KIẾP CÙNG BẦN ĐẠO", { letterSpacing: 4 })}
      <Hand x={975} y={1668} />
    </AbsoluteFill>
  );
};
