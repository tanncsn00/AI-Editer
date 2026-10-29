import React from "react";
import { BG, INK, JADE } from "../whiteboard/shapes";

const LINE = { stroke: INK, strokeWidth: 6, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const Clock: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g>
    <circle cx={x} cy={y} r={r} {...LINE} />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <line key={i} x1={x + Math.sin(a) * r * 0.82} y1={y - Math.cos(a) * r * 0.82} x2={x + Math.sin(a) * r * 0.95} y2={y - Math.cos(a) * r * 0.95} {...LINE} strokeWidth={4} />;
    })}
    <line x1={x} y1={y} x2={x - r * 0.08} y2={y + r * 0.5} {...LINE} strokeWidth={8} />
    <line x1={x} y1={y} x2={x - r * 0.1} y2={y - r * 0.78} {...LINE} />
  </g>
);

export const OfficeWall: React.FC<{ zoom?: number; x?: number; y?: number; blur?: number }> = ({ zoom = 1, x = 0, y = 0, blur = 0 }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, background: BG, filter: blur ? `blur(${blur}px)` : undefined }}>
    <g transform={`translate(${540 + x} ${960 + y}) scale(${zoom}) translate(-540 -960)`} opacity={0.42}>
      <rect x={110} y={330} width={420} height={560} rx={8} {...LINE} />
      <line x1={320} y1={330} x2={320} y2={890} {...LINE} />
      <line x1={110} y1={610} x2={530} y2={610} {...LINE} />
      <path d="M130 890 L130 760 L180 760 L180 700 L240 700 L240 800 L290 800 L290 650 L360 650 L360 780 L420 780 L420 720 L470 720 L470 890" {...LINE} strokeWidth={4} />
      <Clock x={790} y={420} r={95} />
      <rect x={720} y={760} width={250} height={520} rx={6} {...LINE} />
      <circle cx={940} cy={1030} r={10} fill={INK} />
      <rect x={760} y={690} width={170} height={46} rx={6} stroke={JADE} strokeWidth={5} fill="none" />
      <text x={845} y={724} textAnchor="middle" fill={JADE} fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} fontSize={30}>EXIT</text>
      <line x1={0} y1={1280} x2={1080} y2={1280} {...LINE} />
    </g>
  </svg>
);

export const Desk: React.FC<{ top: number; papers?: number }> = ({ top, papers = 0 }) => (
  <svg viewBox={`0 ${top} 1080 ${1920 - top}`} width={1080} height={1920 - top} style={{ position: "absolute", left: 0, top }}>
    {Array.from({ length: papers }, (_, i) => (
      <rect key={i} x={640 + (i % 2) * 6} y={top - 26 - i * 22} width={300} height={24} rx={3} fill="#fff" stroke="#000" strokeWidth={6} />
    ))}
    <rect x={-20} y={top} width={1120} height={1920 - top + 20} fill="#17131F" stroke={INK} strokeWidth={8} />
    <line x1={0} y1={top + 40} x2={1080} y2={top + 40} stroke={INK} strokeOpacity={0.25} strokeWidth={4} />
  </svg>
);
