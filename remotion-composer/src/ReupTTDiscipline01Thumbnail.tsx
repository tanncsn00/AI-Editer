import { AbsoluteFill } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadEBGaramond("normal", { weights: ["400", "500", "600"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadBeVietnamPro("normal", { weights: ["400", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E03A2A";
const GOLD = "#E5A53B";
const SKIN = "#F5C8A8";

export const ReupTTDiscipline01Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: PAPER }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="thG">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="13" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.22 0" />
          </filter>
          <radialGradient id="thV" cx="50%" cy="50%" r="78%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#thG)" />
        <rect width={W} height={H} fill="url(#thV)" />

        {/* Top hook label */}
        <text
          x={W / 2}
          y={170}
          textAnchor="middle"
          fontFamily="'EB Garamond', serif"
          fontStyle="italic"
          fontWeight={500}
          fontSize={50}
          fill={INK}
          letterSpacing="3"
          opacity={0.85}
        >
          — đang scroll —
        </text>

        {/* TOP — viewer slumped on couch */}
        <g transform="translate(540, 470) scale(2.3)">
          {/* Sofa */}
          <g transform="translate(0, 80)">
            <rect x={-180} y={-50} width={360} height={70} rx={14} fill="#A0605A" stroke={INK} strokeWidth={4} />
            <rect x={-192} y={0} width={384} height={50} rx={12} fill="#A0605A" stroke={INK} strokeWidth={4} />
            <rect x={-160} y={-42} width={140} height={52} rx={6} fill="#8E4A46" stroke={INK} strokeWidth={3} />
            <rect x={20} y={-42} width={140} height={52} rx={6} fill="#8E4A46" stroke={INK} strokeWidth={3} />
          </g>
          {/* Slumped viewer */}
          <g transform="translate(-30, 0)">
            <path
              d="M -75 60 Q -85 -10 -55 -40 L 55 -40 Q 90 -10 75 60 Z"
              fill="#7B8A6E"
              stroke={INK}
              strokeWidth={4}
            />
            <rect x={-15} y={-58} width={30} height={22} fill={SKIN} stroke={INK} strokeWidth={3} />
            <ellipse cx={0} cy={-100} rx={56} ry={62} fill={SKIN} stroke={INK} strokeWidth={4} />
            <path
              d="M -50 -150 Q -40 -170 -20 -160 Q 0 -178 22 -160 Q 42 -172 52 -148 Q 50 -130 30 -135 Q 10 -130 -10 -136 Q -30 -130 -50 -132 Z"
              fill="#3B2A20"
              stroke={INK}
              strokeWidth={3}
            />
            {/* Vacant eyes */}
            <ellipse cx={-18} cy={-105} rx={9} ry={4} fill="#FFF" stroke={INK} strokeWidth={2.5} />
            <ellipse cx={18} cy={-105} rx={9} ry={4} fill="#FFF" stroke={INK} strokeWidth={2.5} />
            <circle cx={-18} cy={-103} r={3} fill={INK} />
            <circle cx={18} cy={-103} r={3} fill={INK} />
            <path d="M -28 -94 Q -18 -88 -8 -94" stroke={INK} strokeWidth={2} fill="none" opacity={0.55} />
            <path d="M 8 -94 Q 18 -88 28 -94" stroke={INK} strokeWidth={2} fill="none" opacity={0.55} />
            <path d="M -16 -75 Q 0 -68 16 -75" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
            {/* Arm + phone */}
            <path
              d="M 50 -10 Q 110 0 140 50 L 130 80 Q 95 35 35 25 Z"
              fill="#7B8A6E"
              stroke={INK}
              strokeWidth={4}
            />
            <ellipse cx={140} cy={70} rx={18} ry={22} fill={SKIN} stroke={INK} strokeWidth={3} />
            <g transform="translate(165, 70)">
              <rect x={-26} y={-44} width={52} height={88} rx={8} fill={INK} />
              <rect x={-22} y={-40} width={44} height={26} fill="#E03A2A" opacity={0.9} />
              <rect x={-22} y={-12} width={44} height={26} fill="#3A8AE0" opacity={0.9} />
              <rect x={-22} y={16} width={44} height={26} fill="#E5A53B" opacity={0.9} />
            </g>
          </g>
        </g>

        {/* DIAGONAL TORN DIVIDER with HÓA RA text */}
        <g>
          <path d="M 0 880 L 1080 820 L 1080 990 L 0 950 Z" fill={INK} />
          <text
            x={W / 2}
            y={920}
            textAnchor="middle"
            fontFamily="'EB Garamond', serif"
            fontStyle="italic"
            fontWeight={600}
            fontSize={72}
            fill={PAPER}
            letterSpacing="6"
          >
            HÓA RA…
          </text>
        </g>

        {/* BOTTOM — Mascot pointing + spit */}
        <g transform="translate(380, 1350) scale(2.7)">
          <path
            d="M -70 60 Q -90 -20 -55 -55 L 55 -55 Q 90 -20 70 60 Z"
            fill="#1F2630"
            stroke={INK}
            strokeWidth={5}
          />
          <path d="M -22 -55 L 0 -25 L 22 -55 Z" fill="#FFF" stroke={INK} strokeWidth={3} />
          <path d="M -8 -25 L 8 -25 L 14 60 L 0 80 L -14 60 Z" fill={ACCENT} stroke={INK} strokeWidth={3} />
          <rect x={-14} y={-72} width={28} height={20} fill={SKIN} stroke={INK} strokeWidth={3} />
          <path
            d="M -52 -110 Q -54 -148 -28 -160 Q 0 -168 28 -160 Q 54 -148 52 -110 Q 50 -88 35 -78 Q 18 -64 0 -62 Q -18 -64 -35 -78 Q -50 -88 -52 -110 Z"
            fill={SKIN}
            stroke={INK}
            strokeWidth={4}
          />
          <path
            d="M -52 -130 Q -45 -170 -8 -172 Q 28 -174 52 -150 Q 50 -135 28 -138 Q 0 -132 -28 -138 Q -48 -132 -52 -130 Z"
            fill="#1A1A22"
            stroke={INK}
            strokeWidth={3}
          />
          <path d="M -32 -128 L -10 -120" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <path d="M 10 -120 L 32 -128" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <ellipse cx={-17} cy={-110} rx={7} ry={5} fill="#FFF" stroke={INK} strokeWidth={2.5} />
          <ellipse cx={17} cy={-110} rx={7} ry={5} fill="#FFF" stroke={INK} strokeWidth={2.5} />
          <circle cx={-17} cy={-110} r={3} fill={INK} />
          <circle cx={17} cy={-110} r={3} fill={INK} />
          {/* Shouting mouth */}
          <ellipse cx={0} cy={-78} rx={18} ry={20} fill="#5A1818" stroke={INK} strokeWidth={3.5} />
          {/* Pointing arm */}
          <path
            d="M 60 -20 Q 130 -10 175 30 L 168 50 Q 120 22 50 10 Z"
            fill="#1F2630"
            stroke={INK}
            strokeWidth={4}
          />
          <ellipse cx={185} cy={40} rx={26} ry={14} fill={SKIN} stroke={INK} strokeWidth={3} />
          <rect x={205} y={36} width={32} height={8} rx={3} fill={SKIN} stroke={INK} strokeWidth={3} />
          {/* Spit */}
          <line x1={20} y1={-78} x2={50} y2={-90} stroke={INK} strokeWidth={2.5} />
          <line x1={22} y1={-72} x2={52} y2={-70} stroke={INK} strokeWidth={2.5} />
          <circle cx={56} cy={-82} r={3} fill={INK} />
          <circle cx={58} cy={-74} r={2.5} fill={INK} />
        </g>

        {/* Big bubble with punchline */}
        <g transform="translate(720, 1280)">
          <rect x={-220} y={-90} width={440} height={170} rx={28} fill="#FFF8EC" stroke={INK} strokeWidth={6} />
          <path d="M -190 80 L -230 130 L -150 80 Z" fill="#FFF8EC" stroke={INK} strokeWidth={6} />
          <foreignObject x={-200} y={-78} width={400} height={146}>
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontWeight: 800,
                fontSize: 56,
                color: INK,
                lineHeight: 1.05,
              }}
            >
              Sống vô hồn!
            </div>
          </foreignObject>
        </g>

        {/* Bottom red banner with HOOK */}
        <g>
          <rect x={0} y={1660} width={W} height={210} fill={ACCENT} />
          <text
            x={W / 2}
            y={1790}
            textAnchor="middle"
            fontFamily="'EB Garamond', serif"
            fontWeight={600}
            fontSize={150}
            fill={PAPER}
            letterSpacing="14"
          >
            DẬY ĐI.
          </text>
          <text
            x={W / 2}
            y={1844}
            textAnchor="middle"
            fontFamily="'Be Vietnam Pro', sans-serif"
            fontWeight={400}
            fontSize={32}
            fill={PAPER}
            letterSpacing="5"
            opacity={0.9}
          >
            KỶ LUẬT MỖI NGÀY
          </text>
        </g>

        {/* Editorial corner marks */}
        <g stroke={INK} strokeWidth={5} fill="none">
          <path d="M 50 50 L 50 130 M 50 50 L 130 50" />
          <path d="M 1030 50 L 1030 130 M 1030 50 L 950 50" />
          <path d="M 50 1620 L 50 1560 M 50 1620 L 130 1620" />
          <path d="M 1030 1620 L 1030 1560 M 1030 1620 L 950 1620" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
