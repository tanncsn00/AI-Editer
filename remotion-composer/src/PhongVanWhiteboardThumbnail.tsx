import React, { useEffect, useState } from "react";
import { AbsoluteFill, cancelRender, continueRender, delayRender } from "remotion";
import { loadFont } from "@remotion/google-fonts/Pangolin";
import rough from "roughjs";
import { Hand } from "./whiteboard/WhiteboardVideo";
import doodles from "./phong-van-2026_doodles.json";

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

const drawing = (): Drawable[] => [
  gen.rectangle(100, 1560, 880, 130, ink(GOLD, 80)),
];

export const PhongVanWhiteboardThumbnail: React.FC = () => {
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
      <Doodle name="Teacher 1" x={300} y={1150} h={460} />
      <Doodle name="Sitting" x={830} y={1180} h={400} />
      {text(150, 50, GREY, "TÔNG MÔN CÔNG NGHỆ", { letterSpacing: 6 })}
      {text(260, 130, INK, "PHỎNG VẤN 2026")}
      {text(440, 128, RED, "EM KHÔNG BIẾT.")}
      {text(640, 64, GOLD, "…nhưng em có Claude Max")}
      {text(1590, 62, GOLD, "Phe thuật toán hay vibe code?")}
      {text(1760, 34, `${GREY}AA`, "ĐỘ KIẾP CÙNG GIỚI IT", { letterSpacing: 4 })}
      <Hand x={975} y={1668} />
    </AbsoluteFill>
  );
};
