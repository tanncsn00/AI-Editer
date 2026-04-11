import { AbsoluteFill } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadEBGaramond("normal", { weights: ["500","600","700"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

// Prototype — Blueprint chalk style matching reference "Tâm Sự Người Qua" FB reel
// Scene: kitchen with fridge full of leftover food + lonely figure eating

const W = 1080;
const H = 1920;
const BG_DEEP = "#050E1E";
const BG_MID = "#0A1838";
const BG_GLOW = "#1E4878";
const CHALK = "#F5F7FA";
const YELLOW = "#FFD93D";
const RED = "#FF5542";

export const BlueprintScenePrototype: React.FC = () => {
  return (
    <AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {/* Radial glow blueprint */}
          <radialGradient id="bpGlow" cx="50%" cy="52%" r="55%">
            <stop offset="0%" stopColor={BG_GLOW} stopOpacity="1" />
            <stop offset="55%" stopColor={BG_MID} stopOpacity="1" />
            <stop offset="100%" stopColor={BG_DEEP} stopOpacity="1" />
          </radialGradient>
          {/* Chalk glow filter */}
          <filter id="chalkGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Soft chalk grain */}
          <filter id="chalkGrain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" />
            <feColorMatrix values="0 0 0 0 0.95  0 0 0 0 0.97  0 0 0 0 1  0 0 0 0.08 0" />
          </filter>
          <radialGradient id="vigEdge" cx="50%" cy="50%" r="80%">
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.88" />
          </radialGradient>
        </defs>

        {/* Deep navy background */}
        <rect width={W} height={H} fill={BG_DEEP} />
        {/* Blueprint radial glow centered */}
        <rect width={W} height={H} fill="url(#bpGlow)" />

        {/* ============ TOP TITLE BAR ============ */}
        <g>
          <text
            x={W/2}
            y={250}
            fontSize={58}
            fill={YELLOW}
            textAnchor="middle"
            fontFamily="'Be Vietnam Pro', sans-serif"
            fontWeight={800}
            letterSpacing="2"
            stroke={RED}
            strokeWidth={2}
            paintOrder="stroke"
          >
            GIẢI THÍCH KIỂU LƯỜI
          </text>
        </g>

        {/* ============ MAIN TABLEAU ============ */}
        <g filter="url(#chalkGlow)" stroke={CHALK} strokeLinejoin="round" strokeLinecap="round">
          {/* Floor line */}
          <line x1={80} y1={1380} x2={W - 80} y2={1380} stroke={CHALK} strokeWidth={3} />

          {/* LEFT — Kitchen wall with fridge */}
          <g>
            {/* Wall frame */}
            <line x1={120} y1={650} x2={120} y2={1380} strokeWidth={2} />
            <line x1={120} y1={650} x2={540} y2={650} strokeWidth={2} />

            {/* Fridge — tall double door */}
            <rect x={170} y={800} width={260} height={560} fill="none" strokeWidth={4} />
            <line x1={170} y1={1000} x2={430} y2={1000} strokeWidth={3} />
            <line x1={300} y1={800} x2={300} y2={1000} strokeWidth={2} />
            {/* Handles */}
            <rect x={390} y={840} width={10} height={60} fill="none" strokeWidth={2} />
            <rect x={390} y={1050} width={10} height={60} fill="none" strokeWidth={2} />
            {/* Inside — open showing leftover boxes */}
            <rect x={180} y={810} width={115} height={180} fill="none" strokeWidth={1.5} strokeDasharray="3 4" opacity={0.5} />
            <rect x={180} y={1010} width={240} height={340} fill="none" strokeWidth={1.5} strokeDasharray="3 4" opacity={0.5} />

            {/* Tupperware containers inside */}
            <rect x={200} y={1060} width={70} height={50} fill="none" strokeWidth={2} />
            <rect x={290} y={1080} width={80} height={60} fill="none" strokeWidth={2} />
            <rect x={200} y={1140} width={100} height={50} fill="none" strokeWidth={2} />
            <rect x={320} y={1160} width={60} height={80} fill="none" strokeWidth={2} />
            <rect x={200} y={1210} width={60} height={60} fill="none" strokeWidth={2} />
            <rect x={280} y={1250} width={100} height={50} fill="none" strokeWidth={2} />
            {/* Some content marks on containers */}
            <line x1={215} y1={1075} x2={255} y2={1075} strokeWidth={1.5} opacity={0.6} />
            <line x1={305} y1={1095} x2={355} y2={1095} strokeWidth={1.5} opacity={0.6} />
            <line x1={215} y1={1225} x2={245} y2={1225} strokeWidth={1.5} opacity={0.6} />

            {/* Top shelf with a can and bottle */}
            <ellipse cx={220} cy={880} rx={16} ry={8} fill="none" strokeWidth={2} />
            <rect x={204} y={880} width={32} height={50} fill="none" strokeWidth={2} />
            <rect x={260} y={850} width={18} height={80} fill="none" strokeWidth={2} />
            {/* Egg on top shelf */}
            <ellipse cx={340} cy={920} rx={10} ry={13} fill="none" strokeWidth={2} />

            {/* Cold mist lines coming out */}
            <path d="M 250 780 Q 240 760 260 740" fill="none" strokeWidth={1.5} opacity={0.5} />
            <path d="M 310 780 Q 320 760 300 740" fill="none" strokeWidth={1.5} opacity={0.5} />
            <path d="M 370 780 Q 360 760 380 740" fill="none" strokeWidth={1.5} opacity={0.5} />
          </g>

          {/* CENTER — Table with lonely meal */}
          <g>
            {/* Table */}
            <line x1={540} y1={1200} x2={920} y2={1200} strokeWidth={4} />
            <line x1={540} y1={1200} x2={540} y2={1380} strokeWidth={4} />
            <line x1={920} y1={1200} x2={920} y2={1380} strokeWidth={4} />
            <line x1={560} y1={1380} x2={560} y2={1440} strokeWidth={3} />
            <line x1={900} y1={1380} x2={900} y2={1440} strokeWidth={3} />

            {/* Bowl of leftover rice */}
            <ellipse cx={660} cy={1200} rx={60} ry={12} fill="none" strokeWidth={3} />
            <path d="M 600 1200 Q 600 1240 660 1250 Q 720 1240 720 1200" fill="none" strokeWidth={3} />
            {/* Rice mounds */}
            <path d="M 620 1196 Q 640 1186 660 1196 Q 680 1186 700 1196" fill="none" strokeWidth={2} />
            {/* Steam — weak */}
            <path d="M 660 1185 Q 655 1170 665 1155" fill="none" strokeWidth={1.5} opacity={0.5} />

            {/* Half-eaten braised dish plate */}
            <ellipse cx={820} cy={1195} rx={55} ry={10} fill="none" strokeWidth={3} />
            <path d="M 765 1195 Q 765 1218 820 1222 Q 875 1218 875 1195" fill="none" strokeWidth={2.5} />
            {/* Leftover fish pieces */}
            <ellipse cx={800} cy={1200} rx={12} ry={5} fill="none" strokeWidth={2} />
            <ellipse cx={830} cy={1204} rx={14} ry={5} fill="none" strokeWidth={2} />

            {/* Chopsticks on bowl edge */}
            <line x1={705} y1={1185} x2={760} y2={1160} strokeWidth={3} />
            <line x1={710} y1={1190} x2={762} y2={1165} strokeWidth={3} />

            {/* Small glass of water */}
            <rect x={555} y={1160} width={30} height={40} fill="none" strokeWidth={2.5} />
            <line x1={558} y1={1170} x2={582} y2={1170} strokeWidth={1.5} opacity={0.6} />
          </g>

          {/* RIGHT — Stick figure sitting at table, tired */}
          <g>
            {/* Chair */}
            <line x1={820} y1={1250} x2={820} y2={1380} strokeWidth={3} />
            <line x1={820} y1={1250} x2={820} y2={1140} strokeWidth={3} />
            <line x1={820} y1={1150} x2={900} y2={1150} strokeWidth={3} />

            {/* Body sitting */}
            {/* Head */}
            <circle cx={850} cy={960} r={38} fill="none" strokeWidth={4} />
            {/* Hair tuft messy */}
            <path d="M 830 925 L 828 906 L 836 920 L 842 905 L 848 920 L 856 907 L 862 920 L 870 908" strokeWidth={3} fill="none" />
            {/* Tired eyes — closed lines */}
            <line x1={834} y1={960} x2={844} y2={960} strokeWidth={3} />
            <line x1={856} y1={960} x2={866} y2={960} strokeWidth={3} />
            {/* Eye bag */}
            <path d="M 834 968 Q 839 972 844 968" strokeWidth={1.5} opacity={0.5} />
            <path d="M 856 968 Q 861 972 866 968" strokeWidth={1.5} opacity={0.5} />
            {/* Mouth straight */}
            <line x1={842} y1={982} x2={858} y2={982} strokeWidth={3} />
            {/* Neck */}
            <line x1={850} y1={998} x2={850} y2={1020} strokeWidth={4} />

            {/* Torso — slumped forward */}
            <path d="M 850 1020 Q 846 1080 852 1140" strokeWidth={5} fill="none" />
            {/* Arm holding chopsticks */}
            <path d="M 852 1060 Q 820 1080 780 1120" strokeWidth={5} fill="none" />
            <path d="M 780 1120 Q 770 1130 760 1140" strokeWidth={5} fill="none" />
            {/* Other arm on table */}
            <path d="M 852 1070 Q 880 1100 890 1140" strokeWidth={5} fill="none" />

            {/* Legs sitting under table */}
            <line x1={840} y1={1140} x2={820} y2={1200} strokeWidth={5} />
            <line x1={860} y1={1140} x2={870} y2={1200} strokeWidth={5} />
          </g>

          {/* BACKGROUND — window with moon + hanging clock + wall calendar */}
          <g opacity={0.75}>
            {/* Window frame top-right */}
            <rect x={700} y={700} width={220} height={180} fill="none" strokeWidth={3} />
            <line x1={810} y1={700} x2={810} y2={880} strokeWidth={2} />
            <line x1={700} y1={790} x2={920} y2={790} strokeWidth={2} />
            {/* Moon */}
            <circle cx={760} cy={760} r={22} fill="none" strokeWidth={2} />
            <circle cx={754} cy={755} r={5} fill="none" strokeWidth={1.5} />
            <circle cx={767} cy={765} r={3} fill="none" strokeWidth={1.5} />

            {/* Wall clock — left of window */}
            <circle cx={610} cy={760} r={35} fill="none" strokeWidth={3} />
            <line x1={610} y1={760} x2={610} y2={735} strokeWidth={3} />
            <line x1={610} y1={760} x2={625} y2={770} strokeWidth={3} />
            <line x1={610} y1={730} x2={610} y2={735} strokeWidth={2} />
            <line x1={640} y1={760} x2={635} y2={760} strokeWidth={2} />
            <line x1={610} y1={790} x2={610} y2={785} strokeWidth={2} />
            <line x1={580} y1={760} x2={585} y2={760} strokeWidth={2} />

            {/* Cat silhouette on top of fridge */}
            <ellipse cx={280} cy={790} rx={40} ry={10} fill="none" strokeWidth={2} />
            <circle cx={250} cy={775} r={10} fill="none" strokeWidth={2} />
            <path d="M 244 770 L 240 762 L 246 768" strokeWidth={2} fill="none" />
            <path d="M 256 770 L 260 762 L 254 768" strokeWidth={2} fill="none" />
            <path d="M 310 790 Q 330 760 320 745" strokeWidth={2} fill="none" />
          </g>
        </g>

        {/* ============ VIGNETTE ============ */}
        <rect width={W} height={H} fill="url(#vigEdge)" />

        {/* Chalk grain overlay */}
        <rect width={W} height={H} filter="url(#chalkGrain)" opacity={0.4} mixBlendMode="screen" />

        {/* ============ BOTTOM CAPTION ============ */}
        <g>
          <text
            x={W/2}
            y={1640}
            fontSize={46}
            fill={YELLOW}
            textAnchor="middle"
            fontFamily="'Be Vietnam Pro', sans-serif"
            fontWeight={800}
            letterSpacing="1"
            stroke="#000"
            strokeWidth={4}
            paintOrder="stroke"
          >
            mua tủ lạnh là để ăn đồ tươi
          </text>
          <text
            x={W/2}
            y={1720}
            fontSize={46}
            fill={YELLOW}
            textAnchor="middle"
            fontFamily="'Be Vietnam Pro', sans-serif"
            fontWeight={800}
            letterSpacing="1"
            stroke="#000"
            strokeWidth={4}
            paintOrder="stroke"
          >
            hoá ra toàn đồ thừa
          </text>
        </g>

        {/* Bottom credit */}
        <text x={W/2} y={H - 80} fontSize={18} fill={CHALK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontStyle="italic" opacity={0.5}>
          Giải Thích Kiểu Lười · #1
        </text>
      </svg>
    </AbsoluteFill>
  );
};
