import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";

export const INK = "#111";
const S = { stroke: INK, strokeWidth: 9, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
const HAND = "'Be Vietnam Pro', sans-serif";

export const Doorstep: React.FC<{ zoom?: number; x?: number; y?: number }> = ({ zoom = 1, x = 0, y = 0 }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, background: "#8FD3F4" }}>
    <g transform={`translate(${540 + x} ${960 + y}) scale(${zoom}) translate(-540 -960)`}>
      <rect x={-200} y={380} width={1480} height={1200} fill="#F7D9A6" {...S} />
      <rect x={120} y={560} width={420} height={1020} fill="#A0623A" {...S} />
      <rect x={160} y={610} width={340} height={420} fill="#B97A4C" {...S} strokeWidth={6} />
      <rect x={160} y={1080} width={340} height={440} fill="#B97A4C" {...S} strokeWidth={6} />
      <circle cx={490} cy={1090} r={16} fill="#F2C14E" {...S} strokeWidth={5} />
      <rect x={250} y={470} width={160} height={66} rx={10} fill="#3F5BA9" {...S} strokeWidth={6} />
      <text x={330} y={517} textAnchor="middle" fill="#fff" fontFamily={HAND} fontWeight={800} fontSize={40}>69</text>
      <rect x={700} y={620} width={300} height={260} fill="#CFEFFF" {...S} />
      <line x1={850} y1={620} x2={850} y2={880} {...S} strokeWidth={6} />
      <path d="M760 1580 q-20 -170 40 -230 q30 120 60 -40 q40 140 70 20 q40 110 20 250 z" fill="#4FD1A5" {...S} strokeWidth={6} />
      <rect x={-200} y={1580} width={1480} height={600} fill="#9C9C9C" {...S} />
    </g>
  </svg>
);

export const Rain: React.FC<{ density?: number }> = ({ density = 70 }) => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: density }, (_, i) => {
        const x0 = random(`rx${i}`) * 1300 - 100;
        const speed = 38 + random(`rs${i}`) * 20;
        const y = ((random(`ry${i}`) * 2100 + frame * speed) % 2100) - 100;
        return <line key={i} x1={x0 - y * 0.18} y1={y} x2={x0 - y * 0.18 - 14} y2={y + 70} stroke="#4A6FA5" strokeWidth={5} strokeLinecap="round" opacity={0.7} />;
      })}
    </svg>
  );
};

export const FlatBike: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 560 360" width={560} height={360} style={style}>
    <ellipse cx={110} cy={300} rx={78} ry={44} fill="#333" {...S} />
    <ellipse cx={450} cy={300} rx={78} ry={44} fill="#333" {...S} />
    <path d="M110 260 L200 160 L390 160 L450 260" fill="none" {...S} />
    <path d="M190 160 q90 -60 220 0 l-20 70 h-180 z" fill="#2DBE60" {...S} />
    <path d="M400 150 l40 -90 h50" fill="none" {...S} />
    <rect x={150} y={70} width={150} height={100} rx={12} fill="#2DBE60" {...S} />
    <text x={225} y={133} textAnchor="middle" fill="#fff" fontFamily={HAND} fontWeight={800} fontSize={34}>SHIP</text>
    <text x={110} y={258} textAnchor="middle" fill="#E4574C" fontFamily={HAND} fontWeight={800} fontSize={28}>xẹp</text>
    <text x={450} y={258} textAnchor="middle" fill="#E4574C" fontFamily={HAND} fontWeight={800} fontSize={28}>xẹp</text>
  </svg>
);

export const LegCast: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 220 520" width={220} height={520} style={style}>
    <path d="M40 20 h140 v380 q0 60 -40 80 h-110 q-30 0 -30 -40 v-60 z" fill="#fff" {...S} />
    {[90, 170, 250, 330].map((y) => (
      <path key={y} d={`M40 ${y} q70 30 140 0`} fill="none" {...S} strokeWidth={5} />
    ))}
    <text x={110} y={230} textAnchor="middle" fill="#E4574C" fontFamily={HAND} fontWeight={800} fontSize={30} transform="rotate(-8 110 230)">GÃY</text>
  </svg>
);

export const Crutch: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 120 900" width={120} height={900} style={style}>
    <path d="M20 40 h80" {...S} strokeWidth={22} />
    <path d="M30 40 L50 520 M90 40 L70 520 M50 520 h20 v360" fill="none" {...S} strokeWidth={14} />
  </svg>
);

export const Parcel: React.FC<{ style?: React.CSSProperties; label?: string }> = ({ style, label = "KHÔ" }) => (
  <svg viewBox="0 0 300 240" width={300} height={240} style={style}>
    <path d="M20 70 l130 -50 l130 50 v130 l-130 30 l-130 -30 z" fill="#D9A066" {...S} />
    <path d="M20 70 l130 40 l130 -40 M150 110 v120" fill="none" {...S} strokeWidth={6} />
    <text x={150} y={190} textAnchor="middle" fill={INK} fontFamily={HAND} fontWeight={800} fontSize={36}>{label}</text>
  </svg>
);

export const Carton: React.FC = () => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <path d="M140 900 L540 760 L940 900 V1560 L540 1700 L140 1560 Z" fill="#D9A066" {...S} />
    <path d="M140 900 L540 1040 L940 900 M540 1040 V1700" fill="none" {...S} />
    <g transform="rotate(-6 340 1300)">
      <rect x={200} y={1220} width={300} height={150} fill="#fff" {...S} strokeWidth={7} />
      <text x={350} y={1288} textAnchor="middle" fill="#E4574C" fontFamily={HAND} fontWeight={800} fontSize={48}>HÀNG</text>
      <text x={350} y={1344} textAnchor="middle" fill="#E4574C" fontFamily={HAND} fontWeight={800} fontSize={48}>DỄ VỠ</text>
    </g>
    <path d="M620 1180 l70 -60 l70 60 h-35 v80 h-70 v-80 z" fill="#fff" {...S} strokeWidth={6} />
  </svg>
);

export const Ambulance: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = Math.floor(frame / 4) % 2 === 0;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, background: "#DDEBF2" }}>
      <rect x={60} y={500} width={960} height={1100} rx={40} fill="#fff" {...S} />
      <rect x={420} y={420} width={240} height={90} rx={20} fill={flash ? "#E4574C" : "#7FB2FF"} {...S} />
      <path d="M470 660 h140 v-90 h80 v90 h140 v80 h-140 v90 h-80 v-90 h-140 z" transform="translate(-200 120)" fill="#E4574C" {...S} strokeWidth={6} />
      <rect x={120} y={1320} width={840} height={70} rx={20} fill="#9C9C9C" {...S} />
    </svg>
  );
};

export const HeartMonitor: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = (frame * 14) % 300;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, background: "#CFE8E0" }}>
      <rect x={560} y={260} width={460} height={340} rx={24} fill="#1d2b24" {...S} />
      <path d={`M${560 + 20 - shift} 450 ${Array.from({ length: 6 }, (_, i) => `h60 l20 -90 l25 160 l20 -70 h55`).join(" ")}`} fill="none" stroke="#4FD1A5" strokeWidth={8} clipPath="url(#mon)" />
      <clipPath id="mon"><rect x={570} y={270} width={440} height={320} /></clipPath>
      <text x={980} y={330} textAnchor="end" fill="#4FD1A5" fontFamily={HAND} fontWeight={800} fontSize={52}>69</text>
      <rect x={60} y={1380} width={960} height={90} rx={24} fill="#fff" {...S} />
    </svg>
  );
};

export const Grave: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const flap = Math.sin(frame / 3) * 14;
  return (
    <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, background: "#B7C9D6" }}>
      <rect x={-20} y={1420} width={1120} height={520} fill="#7BAA6A" {...S} />
      <path d="M300 1440 V820 q240 -220 480 0 V1440 Z" fill="#A9A9A9" {...S} />
      <foreignObject x={340} y={880} width={400} height={500}>
        <div style={{ fontFamily: HAND, fontWeight: 800, fontSize: 54, lineHeight: 1.15, textAlign: "center", color: INK, paddingTop: 60, whiteSpace: "pre-line" }}>{text}</div>
      </foreignObject>
      <g transform="translate(820 480)">
        <path d={`M0 0 l-70 ${-20 - flap} M0 0 l70 ${-20 - flap}`} stroke={INK} strokeWidth={14} strokeLinecap="round" />
        <circle cx={0} cy={6} r={22} fill={INK} />
      </g>
    </svg>
  );
};

export const Underworld: React.FC<{ zoom?: number; x?: number; plaque?: boolean }> = ({ zoom = 1, x = 0, plaque = true }) => (
  <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute", inset: 0, background: "#5B1A1A" }}>
    <g transform={`translate(${540 + x} 960) scale(${zoom}) translate(-540 -960)`}>
      <rect x={-200} y={1500} width={1480} height={600} fill="#3A0E0E" {...S} />
      {[140, 940].map((cx) => (
        <g key={cx}>
          <rect x={cx - 50} y={200} width={100} height={1300} fill="#8B2A2A" {...S} />
          <ellipse cx={cx} cy={420} rx={70} ry={90} fill="#F2C14E" {...S} />
        </g>
      ))}
      {plaque && (
        <g>
          <rect x={300} y={240} width={480} height={150} rx={14} fill="#1b1b1b" stroke="#F2C14E" strokeWidth={10} />
          <text x={540} y={340} textAnchor="middle" fill="#F2C14E" fontFamily={HAND} fontWeight={800} fontSize={64}>DIÊM VƯƠNG</text>
        </g>
      )}
    </g>
  </svg>
);

export const SoupPot: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 420 300" width={420} height={300} style={style}>
    <path d="M40 90 h340 l-30 180 h-280 z" fill="#555" {...S} />
    <ellipse cx={210} cy={90} rx={170} ry={36} fill="#8B6A3E" {...S} />
    <path d="M150 40 q20 -30 0 -60 M230 40 q20 -30 0 -60" fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
  </svg>
);

export const Swirl: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#2B1055", overflow: "hidden" }}>
      <svg viewBox="-540 -960 1080 1920" width={1080} height={1920} style={{ transform: `rotate(${frame * 14}deg) scale(${interpolate(frame, [0, 40], [0.6, 2.2])})` }}>
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={`M0 0 Q ${300} ${-200} ${700} ${100}`} transform={`rotate(${i * 45})`} fill="none" stroke={i % 2 ? "#F2C14E" : "#7FB2FF"} strokeWidth={60} strokeLinecap="round" />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const Crown: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg viewBox="0 0 300 180" width={300} height={180} style={style}>
    <path d="M20 160 L40 40 L100 110 L150 20 L200 110 L260 40 L280 160 Z" fill="#F2C14E" {...S} />
  </svg>
);
