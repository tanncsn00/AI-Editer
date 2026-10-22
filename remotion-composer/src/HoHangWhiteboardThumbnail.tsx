import React, { useEffect, useState } from "react";
import { AbsoluteFill, cancelRender, continueRender, delayRender } from "remotion";
import { loadFont } from "@remotion/google-fonts/Pangolin";
import rough from "roughjs";
import { Hand } from "./whiteboard/WhiteboardVideo";
import doodles from "./hht_doodles.json";

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
  gen.rectangle(120, 1000, 600, 110, ink(INK, 3)),
  gen.linearPath([[230, 1110], [200, 1150], [260, 1110]], ink(INK, 4)),
  gen.rectangle(790, 1190, 200, 290, ink(RED, 10)),
  gen.linearPath([[790, 1190], [890, 1270], [990, 1190]], ink(RED, 11)),
  gen.circle(890, 1270, 64, ink(GOLD, 12)),
  gen.rectangle(100, 1590, 880, 130, ink(GOLD, 80)),
];

const EYES = [170, 320, 470, 620, 770, 920].flatMap((x, i) => [x - 34, x + 34].map((ex) => ({ x: ex, y: i === 0 || i === 5 ? 930 : i === 1 || i === 4 ? 900 : 880 })));

export const HoHangWhiteboardThumbnail: React.FC = () => {
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
      {EYES.map((e, i) => (
        <Doodle key={i} name="Eye 2" x={e.x} y={e.y} h={40} col={RED} />
      ))}
      <Doodle name="Table 2" x={430} y={1290} h={380} />
      <Doodle name="Glass of red wine" x={150} y={1330} h={200} />
      {text(150, 50, GREY, "GIA TỘC GIỚI", { letterSpacing: 6 })}
      {text(260, 120, INK, "HỌ HÀNG")}
      {text(400, 120, INK, "NGÀY TẾT")}
      {text(560, 200, RED, "5 CHIÊU")}
      {text(1028, 54, RED, "Bao nhiêu tuổi rồi?", { left: 120, right: 360 })}
      {text(1330, 120, GOLD, "5", { left: 790, right: 90 })}
      {text(1620, 60, GOLD, "Ngươi đỡ được mấy chiêu?")}
      {text(1780, 34, `${GREY}AA`, "ĐỘ KIẾP CÙNG BẦN ĐẠO", { letterSpacing: 4 })}
      <Hand x={975} y={1700} />
    </AbsoluteFill>
  );
};
