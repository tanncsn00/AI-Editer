import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// DUO COUPLE character design — pilot series "bựa meme"
// Em Mít Ướt (Drama Queen) + Anh Gạch (Straight Man)

const W = 1080;
const H = 1920;

// ------ COLOR PALETTE ------
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const EM_SKIN = "#F8E0D0";
const EM_ACCENT = "#F08BA8";      // pink
const EM_HAIR = "#3A1D10";        // dark brown
const EM_RIBBON = "#F05080";
const AN_SKIN = "#D8CFC0";
const AN_HAIR = "#1A1A1F";
const AN_SHIRT = "#4A4A52";
const AN_PANTS = "#2A2A32";

// ================================================================
// EM MÍT ƯỚT — expressions
// ================================================================
export type EmEmotion = "neutral" | "cry" | "sparkle" | "angry" | "shocked" | "love";

export const EmMituOt: React.FC<{
  x: number;
  y: number;
  scale: number;
  emotion: EmEmotion;
  phase?: number;
}> = ({ x, y, scale, emotion, phase = 0 }) => {
  const bob = Math.sin(phase / 3) * 1.5;
  return (
    <g transform={`translate(${x}, ${y + bob}) scale(${scale})`}>
      {/* ---------- LEGS (short chibi) ---------- */}
      <path d="M -14 95 L -16 138" stroke={EM_SKIN} strokeWidth={16} strokeLinecap="round" />
      <path d="M 14 95 L 16 138" stroke={EM_SKIN} strokeWidth={16} strokeLinecap="round" />
      <ellipse cx={-16} cy={142} rx={11} ry={4} fill={INK} />
      <ellipse cx={16} cy={142} rx={11} ry={4} fill={INK} />

      {/* ---------- DRESS (pink triangle) ---------- */}
      <path
        d="M -38 30 L -50 100 L 50 100 L 38 30 Q 0 20 -38 30 Z"
        fill={EM_ACCENT}
        stroke={INK}
        strokeWidth={4}
      />
      {/* dress heart decoration */}
      <path
        d="M -4 56 Q -12 48 -8 42 Q 0 42 0 50 Q 0 42 8 42 Q 12 48 4 56 Q 0 62 -4 56 Z"
        fill="#FFFFFF"
        opacity={0.85}
      />
      {/* dress hem curve */}
      <path d="M -50 100 Q 0 108 50 100" stroke={INK} strokeWidth={4} fill="none" />

      {/* ---------- ARMS (tiny chibi) ---------- */}
      <path d="M -36 30 Q -48 50 -42 72" stroke={EM_SKIN} strokeWidth={13} strokeLinecap="round" fill="none" />
      <path d="M 36 30 Q 48 50 42 72" stroke={EM_SKIN} strokeWidth={13} strokeLinecap="round" fill="none" />
      <circle cx={-42} cy={74} r={7} fill={EM_SKIN} stroke={INK} strokeWidth={2.5} />
      <circle cx={42} cy={74} r={7} fill={EM_SKIN} stroke={INK} strokeWidth={2.5} />

      {/* ---------- NECK hint ---------- */}
      <rect x={-8} y={12} width={16} height={12} fill={EM_SKIN} stroke={INK} strokeWidth={3} />

      {/* ---------- HEAD (big chibi circle) ---------- */}
      <circle cx={0} cy={-38} r={58} fill={EM_SKIN} stroke={INK} strokeWidth={4} />

      {/* ---------- HAIR base ---------- */}
      {/* top volume */}
      <path
        d="M -58 -52
           Q -66 -95 -30 -104
           Q 0 -110 30 -104
           Q 66 -95 58 -52
           Q 50 -70 30 -72
           Q 10 -78 0 -70
           Q -10 -78 -30 -72
           Q -50 -70 -58 -52 Z"
        fill={EM_HAIR}
      />
      {/* fringe bangs across forehead */}
      <path
        d="M -48 -56
           Q -30 -38 -14 -48
           Q 0 -40 14 -48
           Q 30 -38 48 -56
           Q 44 -72 30 -76
           L -30 -76
           Q -44 -72 -48 -56 Z"
        fill={EM_HAIR}
      />

      {/* ---------- TWIN PIGTAILS with ribbons ---------- */}
      {/* left pigtail */}
      <g transform={`rotate(${-10 + Math.sin(phase/4) * 3} -58 -50)`}>
        <path
          d="M -58 -50
             Q -90 -30 -100 10
             Q -102 30 -92 40
             Q -84 30 -86 10
             Q -82 -10 -72 -30 Z"
          fill={EM_HAIR}
        />
        {/* ribbon */}
        <g transform="translate(-70, -40)">
          <path d="M -10 0 L -16 -8 L -16 8 Z" fill={EM_RIBBON} stroke={INK} strokeWidth={2} />
          <path d="M 10 0 L 16 -8 L 16 8 Z" fill={EM_RIBBON} stroke={INK} strokeWidth={2} />
          <circle cx={0} cy={0} r={5} fill={EM_RIBBON} stroke={INK} strokeWidth={2} />
        </g>
      </g>
      {/* right pigtail */}
      <g transform={`rotate(${10 - Math.sin(phase/4) * 3} 58 -50)`}>
        <path
          d="M 58 -50
             Q 90 -30 100 10
             Q 102 30 92 40
             Q 84 30 86 10
             Q 82 -10 72 -30 Z"
          fill={EM_HAIR}
        />
        <g transform="translate(70, -40)">
          <path d="M -10 0 L -16 -8 L -16 8 Z" fill={EM_RIBBON} stroke={INK} strokeWidth={2} />
          <path d="M 10 0 L 16 -8 L 16 8 Z" fill={EM_RIBBON} stroke={INK} strokeWidth={2} />
          <circle cx={0} cy={0} r={5} fill={EM_RIBBON} stroke={INK} strokeWidth={2} />
        </g>
      </g>

      {/* ---------- EYES (emotion-dependent) ---------- */}
      {emotion === "cry" ? (
        <>
          {/* closed eyes arc */}
          <path d="M -26 -42 Q -16 -50 -6 -42" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M 6 -42 Q 16 -50 26 -42" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
          {/* tears waterfall */}
          <path d="M -18 -32 Q -22 -10 -24 20 Q -20 22 -16 20 Q -14 0 -16 -30 Z" fill="#7CB8F0" stroke={INK} strokeWidth={2} />
          <path d="M 18 -32 Q 22 -10 24 20 Q 20 22 16 20 Q 14 0 16 -30 Z" fill="#7CB8F0" stroke={INK} strokeWidth={2} />
        </>
      ) : emotion === "angry" ? (
        <>
          {/* angry slanted brows */}
          <line x1={-30} y1={-58} x2={-10} y2={-50} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <line x1={30} y1={-58} x2={10} y2={-50} stroke={INK} strokeWidth={5} strokeLinecap="round" />
          {/* slit eyes */}
          <ellipse cx={-18} cy={-40} rx={10} ry={6} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <ellipse cx={18} cy={-40} rx={10} ry={6} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={-18} cy={-39} r={4} fill={INK} />
          <circle cx={18} cy={-39} r={4} fill={INK} />
          {/* anger vein on temple */}
          <path d="M 44 -60 L 48 -66 L 52 -60 L 48 -54 Z" fill="#D0443C" stroke={INK} strokeWidth={2} />
        </>
      ) : emotion === "sparkle" ? (
        <>
          {/* stars for eyes */}
          <g transform="translate(-18, -42)">
            <path d="M 0 -14 L 3 -4 L 13 -3 L 5 3 L 8 13 L 0 7 L -8 13 L -5 3 L -13 -3 L -3 -4 Z" fill="#FFD84D" stroke={INK} strokeWidth={2} />
          </g>
          <g transform="translate(18, -42)">
            <path d="M 0 -14 L 3 -4 L 13 -3 L 5 3 L 8 13 L 0 7 L -8 13 L -5 3 L -13 -3 L -3 -4 Z" fill="#FFD84D" stroke={INK} strokeWidth={2} />
          </g>
        </>
      ) : emotion === "love" ? (
        <>
          {/* heart eyes */}
          <g transform="translate(-18, -42) scale(0.8)">
            <path d="M 0 -8 Q -10 -18 -14 -6 Q -14 6 0 16 Q 14 6 14 -6 Q 10 -18 0 -8 Z" fill="#F05080" stroke={INK} strokeWidth={2.5} />
          </g>
          <g transform="translate(18, -42) scale(0.8)">
            <path d="M 0 -8 Q -10 -18 -14 -6 Q -14 6 0 16 Q 14 6 14 -6 Q 10 -18 0 -8 Z" fill="#F05080" stroke={INK} strokeWidth={2.5} />
          </g>
        </>
      ) : emotion === "shocked" ? (
        <>
          {/* huge wide eyes */}
          <circle cx={-18} cy={-40} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={18} cy={-40} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={-18} cy={-38} r={5} fill={INK} />
          <circle cx={18} cy={-38} r={5} fill={INK} />
          <circle cx={-15} cy={-41} r={2} fill="#FFFFFF" />
          <circle cx={21} cy={-41} r={2} fill="#FFFFFF" />
        </>
      ) : (
        <>
          {/* neutral: big shiny manga eyes */}
          <ellipse cx={-18} cy={-40} rx={11} ry={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <ellipse cx={18} cy={-40} rx={11} ry={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <ellipse cx={-18} cy={-40} rx={7} ry={10} fill={INK} />
          <ellipse cx={18} cy={-40} rx={7} ry={10} fill={INK} />
          {/* shine highlights */}
          <circle cx={-15} cy={-44} r={3} fill="#FFFFFF" />
          <circle cx={21} cy={-44} r={3} fill="#FFFFFF" />
          <circle cx={-20} cy={-38} r={1.5} fill="#FFFFFF" />
          <circle cx={16} cy={-38} r={1.5} fill="#FFFFFF" />
        </>
      )}

      {/* ---------- BLUSH (always on except angry) ---------- */}
      {emotion !== "angry" && (
        <>
          <ellipse cx={-28} cy={-24} rx={9} ry={4} fill={EM_ACCENT} opacity={0.6} />
          <ellipse cx={28} cy={-24} rx={9} ry={4} fill={EM_ACCENT} opacity={0.6} />
        </>
      )}

      {/* ---------- NOSE (tiny dot) ---------- */}
      <circle cx={0} cy={-24} r={1.5} fill={INK} />

      {/* ---------- MOUTH ---------- */}
      {emotion === "cry" ? (
        <path d="M -12 -12 Q 0 2 12 -12 Q 8 -4 0 -4 Q -8 -4 -12 -12 Z" fill="#A84050" stroke={INK} strokeWidth={2.5} />
      ) : emotion === "angry" ? (
        <path d="M -10 -10 Q 0 -6 10 -10" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      ) : emotion === "sparkle" ? (
        <path d="M -10 -14 Q 0 -4 10 -14" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      ) : emotion === "love" ? (
        <path d="M -12 -14 Q 0 0 12 -14" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      ) : emotion === "shocked" ? (
        <ellipse cx={0} cy={-10} rx={6} ry={9} fill="#A84050" stroke={INK} strokeWidth={2.5} />
      ) : (
        <path d="M -6 -14 Q 0 -10 6 -14" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      )}

      {/* ---------- FLOATING DECORATIONS based on emotion ---------- */}
      {emotion === "love" && (
        <>
          <path d="M -70 -110 Q -78 -118 -82 -108 Q -82 -100 -70 -92 Q -58 -100 -58 -108 Q -62 -118 -70 -110 Z" fill={EM_ACCENT} stroke={INK} strokeWidth={2} />
          <path d="M 70 -108 Q 78 -116 82 -106 Q 82 -98 70 -90 Q 58 -98 58 -106 Q 62 -116 70 -108 Z" fill={EM_ACCENT} stroke={INK} strokeWidth={2} />
        </>
      )}
      {emotion === "sparkle" && (
        <>
          <text x={-74} y={-100} fontSize={28} textAnchor="middle">✨</text>
          <text x={74} y={-96} fontSize={28} textAnchor="middle">✨</text>
        </>
      )}
      {emotion === "angry" && (
        <text x={56} y={-108} fontSize={30} textAnchor="middle">💢</text>
      )}
    </g>
  );
};

// ================================================================
// ANH GẠCH — face NEVER changes, that's the joke
// ================================================================
export type AnPose = "idle" | "walk" | "pocket";

export const AnhGach: React.FC<{
  x: number;
  y: number;
  scale: number;
  pose?: AnPose;
  walkPhase?: number;
}> = ({ x, y, scale, pose = "idle", walkPhase = 0 }) => {
  const walking = pose === "walk";
  const sw = Math.sin(walkPhase);
  const bob = walking ? Math.abs(Math.cos(walkPhase)) * 3 : 0;
  const legL = walking ? sw * 18 : -6;
  const legR = walking ? -sw * 18 : 6;
  const armL = walking ? -sw * 10 : 0;
  const armR = walking ? sw * 10 : 0;

  return (
    <g transform={`translate(${x}, ${y - bob}) scale(${scale})`}>
      {/* ---------- LEGS ---------- */}
      <path d={`M -14 108 Q ${-16 + legL * 0.4} 160 ${-16 + legL} 212`} stroke={AN_PANTS} strokeWidth={22} strokeLinecap="round" fill="none" />
      <path d={`M 14 108 Q ${16 + legR * 0.4} 160 ${16 + legR} 212`} stroke={AN_PANTS} strokeWidth={22} strokeLinecap="round" fill="none" />
      <ellipse cx={-16 + legL} cy={216} rx={14} ry={4} fill={INK} />
      <ellipse cx={16 + legR} cy={216} rx={14} ry={4} fill={INK} />

      {/* ---------- TORSO (plain shirt) ---------- */}
      <path
        d="M -44 -20
           L -50 20
           Q -48 90 -42 110
           L 42 110
           Q 48 90 50 20
           L 44 -20
           Q 30 -30 0 -30
           Q -30 -30 -44 -20 Z"
        fill={AN_SHIRT}
        stroke={INK}
        strokeWidth={4}
      />
      {/* tshirt collar hint */}
      <path d="M -10 -28 Q 0 -22 10 -28" stroke={INK} strokeWidth={3} fill="none" />

      {/* ---------- ARMS (if not pocket pose) ---------- */}
      {pose === "pocket" ? (
        <>
          <path d={`M -44 -10 Q -56 20 -48 50 L -26 80`} stroke={AN_SHIRT} strokeWidth={20} fill="none" strokeLinecap="round" />
          <path d={`M 44 -10 Q 56 20 48 50 L 26 80`} stroke={AN_SHIRT} strokeWidth={20} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d={`M -44 -10 Q ${-62 + armL} 30 ${-58 + armL} 80`} stroke={AN_SHIRT} strokeWidth={20} fill="none" strokeLinecap="round" />
          <path d={`M 44 -10 Q ${62 + armR} 30 ${58 + armR} 80`} stroke={AN_SHIRT} strokeWidth={20} fill="none" strokeLinecap="round" />
          <circle cx={-58 + armL} cy={84} r={8} fill={AN_SKIN} stroke={INK} strokeWidth={2.5} />
          <circle cx={58 + armR} cy={84} r={8} fill={AN_SKIN} stroke={INK} strokeWidth={2.5} />
        </>
      )}

      {/* ---------- NECK ---------- */}
      <rect x={-10} y={-40} width={20} height={14} fill={AN_SKIN} stroke={INK} strokeWidth={3} />

      {/* ---------- HEAD (oval, simple) ---------- */}
      <ellipse cx={0} cy={-72} rx={34} ry={40} fill={AN_SKIN} stroke={INK} strokeWidth={4} />

      {/* ---------- HAIR (simple messy) ---------- */}
      <path
        d="M -34 -90
           Q -40 -115 -14 -118
           Q 0 -122 14 -118
           Q 40 -115 34 -90
           Q 30 -100 14 -102
           Q 0 -108 -14 -102
           Q -30 -100 -34 -90 Z"
        fill={AN_HAIR}
      />
      {/* few stray strands */}
      <path d="M -20 -114 L -18 -124" stroke={AN_HAIR} strokeWidth={4} strokeLinecap="round" />
      <path d="M 6 -118 L 8 -128" stroke={AN_HAIR} strokeWidth={4} strokeLinecap="round" />

      {/* ---------- FACE — literally just dots + line, NEVER changes ---------- */}
      {/* eyes */}
      <circle cx={-11} cy={-74} r={2.5} fill={INK} />
      <circle cx={11} cy={-74} r={2.5} fill={INK} />
      {/* mouth — horizontal line */}
      <line x1={-9} y1={-56} x2={9} y2={-56} stroke={INK} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

// ================================================================
// CHARACTER SHEET PREVIEW
// ================================================================
const EM_NAME = "EM MÍT ƯỚT";
const AN_NAME = "ANH GẠCH";

export const CoupleCharSheet: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {/* Paper-ish BG */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="charSheetGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="9" />
            <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
          </filter>
          <radialGradient id="vigSheet" cx="50%" cy="50%" r="75%">
            <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
            <stop offset="100%" stopColor="#7A5838" stopOpacity="0.45" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={PAPER} />
        <rect width={W} height={H} filter="url(#charSheetGrain)" />
        <rect width={W} height={H} fill="url(#vigSheet)" />

        {/* Corner marks */}
        {[[60,60,1,1],[W-60,60,-1,1],[60,H-60,1,-1],[W-60,H-60,-1,-1]].map(([cx,cy,sx,sy], i) => (
          <g key={i} stroke={INK} strokeWidth={3}>
            <line x1={cx} y1={cy} x2={cx + 70 * sx} y2={cy} />
            <line x1={cx} y1={cy} x2={cx} y2={cy + 70 * sy} />
          </g>
        ))}

        {/* Title */}
        <text x={W/2} y={170} fontSize={30} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontStyle="italic" letterSpacing="6" opacity={0.75}>
          — CHARACTER SHEET —
        </text>
        <text x={W/2} y={240} fontSize={62} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} letterSpacing="3">
          DUO COUPLE
        </text>
        <line x1={W/2 - 140} y1={268} x2={W/2 + 140} y2={268} stroke={INK} strokeWidth={1.5} />
        <text x={W/2} y={302} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.7}>
          drama queen × straight man
        </text>

        {/* ---------- MAIN HERO POSES (side by side) ---------- */}
        <EmMituOt x={300} y={620} scale={1.85} emotion="neutral" phase={frame / 2} />
        <AnhGach x={780} y={630} scale={1.65} pose="pocket" />

        {/* Name labels under each */}
        <text x={300} y={920} fontSize={40} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} letterSpacing="3">
          {EM_NAME}
        </text>
        <text x={300} y={956} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.72}>
          Drama Queen · overreact mọi thứ
        </text>

        <text x={780} y={920} fontSize={40} fill={INK} textAnchor="middle" fontFamily="'EB Garamond', serif" fontWeight={600} letterSpacing="3">
          {AN_NAME}
        </text>
        <text x={780} y={956} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.72}>
          Straight Man · mặt đơ vĩnh viễn
        </text>

        {/* Separator */}
        <line x1={120} y1={1000} x2={W - 120} y2={1000} stroke={INK} strokeWidth={1.5} opacity={0.4} />

        {/* ---------- EM EMOTION GRID (6 mini states) ---------- */}
        <text x={W/2} y={1052} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" letterSpacing="5" opacity={0.7}>
          EM — EXPRESSION LIBRARY
        </text>

        {/* 6 mini Em avatars in a row showing emotions */}
        <EmMituOt x={130} y={1230} scale={0.78} emotion="neutral" />
        <EmMituOt x={290} y={1230} scale={0.78} emotion="cry" />
        <EmMituOt x={450} y={1230} scale={0.78} emotion="sparkle" />
        <EmMituOt x={610} y={1230} scale={0.78} emotion="angry" />
        <EmMituOt x={770} y={1230} scale={0.78} emotion="shocked" />
        <EmMituOt x={930} y={1230} scale={0.78} emotion="love" />

        {/* Labels */}
        {[
          [130, "neutral"],
          [290, "cry"],
          [450, "sparkle"],
          [610, "angry"],
          [770, "shocked"],
          [930, "love"],
        ].map(([lx, label], i) => (
          <text key={i} x={lx as number} y={1340} fontSize={18} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" opacity={0.65}>
            {label}
          </text>
        ))}

        <line x1={120} y1={1390} x2={W - 120} y2={1390} stroke={INK} strokeWidth={1.5} opacity={0.4} />

        {/* ---------- ANH EMOTION GRID (joke: all identical) ---------- */}
        <text x={W/2} y={1442} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" letterSpacing="5" opacity={0.7}>
          ANH — EXPRESSION LIBRARY
        </text>

        {/* 6 identical Anhs */}
        {[130, 290, 450, 610, 770, 930].map((ax, i) => (
          <AnhGach key={i} x={ax} y={1600} scale={0.55} pose="pocket" />
        ))}

        {/* All labels say same */}
        {[
          [130, "same"],
          [290, "same"],
          [450, "same"],
          [610, "same"],
          [770, "same"],
          [930, "same"],
        ].map(([lx, label], i) => (
          <text key={i} x={lx as number} y={1680} fontSize={18} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" opacity={0.65}>
            {label}
          </text>
        ))}

        {/* ---------- PALETTE SWATCHES ---------- */}
        <g transform="translate(80, 1760)">
          <text x={0} y={-12} fontSize={18} fill={INK} fontFamily="'Be Vietnam Pro', sans-serif" letterSpacing="3" opacity={0.7}>PALETTE</text>
          {[
            [EM_ACCENT, "em pink"],
            [EM_HAIR, "em hair"],
            [EM_SKIN, "em skin"],
            [AN_SHIRT, "an shirt"],
            [AN_PANTS, "an pants"],
            [AN_SKIN, "an skin"],
          ].map(([col, name], i) => (
            <g key={i} transform={`translate(${i * 155}, 10)`}>
              <rect x={0} y={0} width={140} height={48} fill={col} stroke={INK} strokeWidth={2} />
              <text x={70} y={74} fontSize={14} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" opacity={0.75}>{name}</text>
            </g>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
