import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const PAPER = "#F4EFE6";
export const INK = "#1b1717";
export const DESK = "#2B2522";
const HAND = "'Pangolin', 'Be Vietnam Pro', sans-serif";
const LINE = { stroke: INK, strokeWidth: 7, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const PaperWall: React.FC<{ zoom?: number; x?: number; y?: number; dim?: number }> = ({ zoom = 1, x = 0, y = 0, dim = 0 }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, background: PAPER }}>
    <g transform={`translate(${540 + x} ${960 + y}) scale(${zoom}) translate(-540 -960)`} opacity={0.55}>
      <rect x={90} y={300} width={400} height={520} rx={10} {...LINE} />
      <line x1={290} y1={300} x2={290} y2={820} {...LINE} />
      <line x1={90} y1={560} x2={490} y2={560} {...LINE} />
      <circle cx={800} cy={380} r={90} {...LINE} />
      <line x1={800} y1={380} x2={792} y2={335} {...LINE} />
      <line x1={800} y1={380} x2={845} y2={392} {...LINE} />
      <path d="M640 760 q20 -120 60 -40 q30 -110 60 0 q40 -90 50 40" {...LINE} />
      <rect x={650} y={760} width={150} height={140} rx={14} {...LINE} />
      <rect x={-80} y={980} width={1240} height={20} fill={INK} opacity={0.25} />
    </g>
    {dim > 0 && <rect x={0} y={0} width={1080} height={1920} fill="#0B0A12" opacity={dim} />}
  </svg>
);

export const PaperDesk: React.FC<{ top: number; laptop?: boolean }> = ({ top, laptop }) => (
  <svg viewBox={`0 ${top - 260} 1080 ${2180 - top}`} width={1080} height={2180 - top} style={{ position: "absolute", left: 0, top: top - 260 }}>
    {laptop && (
      <g>
        <path d={`M300 ${top} L360 ${top - 230} L720 ${top - 230} L780 ${top}`} fill="#d9d3c7" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <circle cx={540} cy={top - 120} r={16} fill={INK} />
      </g>
    )}
    <rect x={-20} y={top} width={1120} height={2000} fill={DESK} stroke={INK} strokeWidth={8} />
    <line x1={0} y1={top + 26} x2={1080} y2={top + 26} stroke="#fff" strokeOpacity={0.12} strokeWidth={5} />
  </svg>
);

const pop = (frame: number, at: number, fps: number) => spring({ frame: frame - at * fps, fps, config: { damping: 12, stiffness: 200, mass: 0.5 } });

export const LeaveHistory: React.FC<{ rows: { label: string; at: number }[]; title: string }> = ({ rows, title }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: 70, top: 330, width: 940, height: 980, background: "#fff", border: `10px solid ${INK}`, borderRadius: 28, boxShadow: "16px 16px 0 #1b171733", fontFamily: HAND }}>
      <div style={{ background: "#3F5BA9", color: "#fff", fontSize: 54, padding: "26px 40px", borderRadius: "16px 16px 0 0", fontWeight: 700 }}>{title}</div>
      {rows.map((r, i) => {
        const p = pop(frame, r.at, fps);
        const lit = frame / fps >= r.at;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, margin: "34px 40px 0", padding: "26px 30px", borderRadius: 18, border: `6px solid ${INK}`, background: lit ? "#FFE9A8" : "#fff", transform: `scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: lit ? p : 0.15, fontSize: 60, color: INK }}>
            {r.label}
          </div>
        );
      })}
    </div>
  );
};

export const PhoneStory: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, appearAt, fps);
  return (
    <div style={{ position: "absolute", left: 230, top: 250, width: 620, height: 1180, background: INK, borderRadius: 70, padding: 22, transform: `translateY(${interpolate(p, [0, 1], [900, 0])}px) rotate(-4deg)` }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 52, background: "linear-gradient(160deg,#7FB2FF,#F2C14E)", position: "relative", overflow: "hidden", fontFamily: HAND }}>
        <div style={{ position: "absolute", top: 30, left: 30, right: 30, height: 8, background: "#ffffff88", borderRadius: 4 }} />
        <div style={{ position: "absolute", top: 70, left: 30, fontSize: 40, color: "#fff", fontWeight: 700 }}>tuan.chill · 2 phút</div>
        <Ticket style={{ position: "absolute", top: 330, left: 40 }} name="TRAN VAN TUAN" />
        <div style={{ position: "absolute", bottom: 120, width: "100%", textAlign: "center", fontSize: 62, color: "#fff", fontWeight: 700, textShadow: `0 4px 0 ${INK}` }}>Đà Lạt ơi, anh tới!</div>
      </div>
    </div>
  );
};

export const Ticket: React.FC<{ style?: React.CSSProperties; name: string }> = ({ style, name }) => (
  <div style={{ width: 500, background: "#fff", border: `7px solid ${INK}`, borderRadius: 26, padding: "24px 30px", fontFamily: HAND, color: INK, ...style }}>
    <div style={{ fontSize: 34, color: "#E4574C", fontWeight: 700 }}>✈ BOARDING PASS</div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 76, fontWeight: 700, margin: "6px 0" }}>
      <span>HAN</span>
      <span>→</span>
      <span>DLI</span>
    </div>
    <div style={{ fontSize: 34 }}>THỨ SÁU · 07:00</div>
    <div style={{ fontSize: 30, marginTop: 6, borderTop: `5px dashed ${INK}`, paddingTop: 8 }}>{name}</div>
  </div>
);

export const Suitcase: React.FC<{ style?: React.CSSProperties; color: string }> = ({ style, color }) => (
  <svg viewBox="0 0 300 380" width={300} height={380} style={style}>
    <path d="M110 70 v-40 h80 v40" {...LINE} strokeWidth={14} />
    <rect x={30} y={70} width={240} height={270} rx={30} fill={color} stroke={INK} strokeWidth={12} />
    <line x1={110} y1={100} x2={110} y2={310} stroke={INK} strokeWidth={9} />
    <line x1={190} y1={100} x2={190} y2={310} stroke={INK} strokeWidth={9} />
    <circle cx={80} cy={355} r={18} fill={INK} />
    <circle cx={220} cy={355} r={18} fill={INK} />
  </svg>
);

export const Stamp: React.FC<{ text: string; top: number; appearAt: number; color?: string; size?: number; dark?: boolean }> = ({ text, top, appearAt, color = "#E4574C", size = 70, dark }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = pop(frame, appearAt, fps);
  if (frame / fps < appearAt) return null;
  return (
    <div style={{ position: "absolute", top, left: 50, right: 50, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: size, lineHeight: 1.15, whiteSpace: "pre-line", color, transform: `scale(${interpolate(p, [0, 1], [1.8, 1])}) rotate(-3deg)`, opacity: p, textShadow: dark ? "0 5px 0 #000" : `0 5px 0 ${INK}22` }}>
      {text}
    </div>
  );
};
