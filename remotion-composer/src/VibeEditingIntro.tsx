import {
  AbsoluteFill,
  Audio,
  Sequence,
  OffthreadVideo,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import wordsData from "./vibe_editing_words.json";

loadBeVietnamPro("normal", { weights: ["400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";

type Word = { word: string; start: number; end: number };
const words = wordsData as Word[];

const mouthOpenAt = (t: number): number => {
  for (const w of words) {
    if (t >= w.start && t <= w.end) {
      const progress = (t - w.start) / (w.end - w.start);
      return Math.sin(progress * Math.PI);
    }
  }
  return 0;
};

// Beat timings from alignment
const B = {
  greet:    [0.0, 1.56],
  intro:    [1.56, 5.82],
  explain:  [5.82, 11.90],
  show1:    [11.90, 16.56],
  show2:    [16.56, 20.02],
  show3:    [20.02, 22.78],
  thumb:    [22.78, 27.64],
  stack:    [27.64, 36.02],
  series:   [36.02, 41.10],
  cta:      [41.10, 46.34],
  meta:     [46.34, 50.28],
} as const;

const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="vePN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="veVig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#vePN)" />
    <rect width={W} height={H} fill="url(#veVig)" />
  </svg>
);

const Teacher: React.FC<{ mouthOpen: number; pointing?: boolean; waving?: boolean }> = ({
  mouthOpen, pointing = false, waving = false,
}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 8) * 3;
  const blink = Math.sin(frame / 45) > 0.92;
  const waveAngle = waving ? Math.sin(frame / 4) * 15 : 0;

  return (
    <g transform={`translate(0, ${bob})`}>
      {/* Legs */}
      <line x1={-12} y1={30} x2={-18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
      <line x1={12} y1={30} x2={18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
      <line x1={-12} y1={30} x2={-18} y2={75} stroke={INK} strokeWidth={2.5} />
      <line x1={12} y1={30} x2={18} y2={75} stroke={INK} strokeWidth={2.5} />
      <ellipse cx={-20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
      <ellipse cx={20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
      {/* Body */}
      <rect x={-22} y={-25} width={44} height={58} rx={10} fill="#4A7AC8" stroke={INK} strokeWidth={3.5} />
      <path d="M -8 -25 L 0 -15 L 8 -25" fill="#E8E0D0" stroke={INK} strokeWidth={2} />
      {/* Arms */}
      {pointing ? (
        <>
          <line x1={22} y1={-12} x2={55} y2={-40} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={22} y1={-12} x2={55} y2={-40} stroke={INK} strokeWidth={2.5} />
          <circle cx={58} cy={-44} r={6} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke={INK} strokeWidth={2.5} />
        </>
      ) : waving ? (
        <>
          <g transform={`rotate(${waveAngle}, 22, -12)`}>
            <line x1={22} y1={-12} x2={50} y2={-50} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
            <line x1={22} y1={-12} x2={50} y2={-50} stroke={INK} strokeWidth={2.5} />
            <circle cx={54} cy={-55} r={7} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
          </g>
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={-22} y1={-8} x2={-35} y2={18} stroke={INK} strokeWidth={2.5} />
        </>
      ) : (
        <>
          <line x1={-22} y1={-8} x2={-38} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={22} y1={-8} x2={38} y2={18} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={-22} y1={-8} x2={-38} y2={18} stroke={INK} strokeWidth={2.5} />
          <line x1={22} y1={-8} x2={38} y2={18} stroke={INK} strokeWidth={2.5} />
        </>
      )}
      {/* Head */}
      <circle cx={0} cy={-46} r={22} fill="#F8E0D0" stroke={INK} strokeWidth={3.5} />
      <path d="M -22 -52 Q -18 -68 -6 -66 Q 2 -72 14 -68 Q 22 -60 22 -52" fill="#1A1A22" />
      {/* Eyes */}
      {blink ? (
        <>
          <line x1={-12} y1={-48} x2={-4} y2={-48} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={4} y1={-48} x2={12} y2={-48} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={-8} cy={-48} r={3} fill={INK} />
          <circle cx={8} cy={-48} r={3} fill={INK} />
          <circle cx={-7} cy={-49} r={1} fill="#FFF" />
          <circle cx={9} cy={-49} r={1} fill="#FFF" />
        </>
      )}
      {/* Mouth */}
      {mouthOpen > 0.2 ? (
        <ellipse cx={0} cy={-36} rx={5 * mouthOpen} ry={4 * mouthOpen} fill="#C04030" stroke={INK} strokeWidth={2} />
      ) : (
        <path d="M -6 -38 Q 0 -33 6 -38" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      )}
    </g>
  );
};

const Whiteboard: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <g>
    <rect x={134} y={244} width={812} height={560} rx={6} fill="#8A7A68" stroke={INK} strokeWidth={3} />
    <rect x={140} y={250} width={800} height={548} rx={4} fill="#FAFAF5" stroke={INK} strokeWidth={2} />
    <line x1={W/2 - 120} y1={798} x2={W/2 - 200} y2={860} stroke="#6A5A48" strokeWidth={6} strokeLinecap="round" />
    <line x1={W/2 + 120} y1={798} x2={W/2 + 200} y2={860} stroke="#6A5A48" strokeWidth={6} strokeLinecap="round" />
    {children}
  </g>
);

const SpeechBubble: React.FC<{ text: string; x: number; y: number; tailX: number; tailY: number }> = ({
  text, x, y, tailX, tailY,
}) => {
  const tw = Math.min(text.length * 15 + 40, 700);
  return (
    <g>
      <rect x={x - tw/2} y={y} width={tw} height={60} rx={16} fill="#FFF" stroke={INK} strokeWidth={3} />
      <polygon points={`${tailX-15},${y + 60} ${tailX},${tailY} ${tailX+15},${y + 60}`} fill="#FFF" stroke={INK} strokeWidth={3} />
      <line x1={tailX - 14} y1={y + 58} x2={tailX + 14} y2={y + 58} stroke="#FFF" strokeWidth={5} />
      <text x={x} y={y + 38} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={600}>
        {text}
      </text>
    </g>
  );
};

// Caption overlay — current sentence
const Caption: React.FC<{ t: number }> = ({ t }) => {
  const sentences = [
    { start: B.greet[0], end: B.intro[1], text: "Chào các vợ yêu của anh" },
    { start: B.intro[0], end: B.intro[1], text: "Gọi là vibe editing" },
    { start: B.explain[0], end: B.explain[1], text: "Ra lệnh cho AI, nó code ra video luôn" },
    { start: B.show1[0], end: B.show1[1], text: "Cái này anh ra lệnh là có đấy" },
    { start: B.show2[0], end: B.show2[1], text: "Cũng ra lệnh là có luôn" },
    { start: B.show3[0], end: B.show3[1], text: "Chồng ra lệnh hết đấy vợ ơi" },
    { start: B.thumb[0], end: B.thumb[1], text: "Thumbnail cũng ra lệnh hết" },
    { start: B.stack[0], end: B.stack[1], text: "Chỉ cần 3 thứ thôi" },
    { start: B.series[0], end: B.series[1], text: "Series hướng dẫn từ zero" },
    { start: B.cta[0], end: B.cta[1], text: "Follow chồng đi nha các vợ" },
    { start: B.meta[0], end: B.meta[1], text: "Video này cũng vibe editing đấy vợ ạ" },
  ];
  const cur = sentences.find(s => t >= s.start && t < s.end);
  if (!cur) return null;
  return (
    <g>
      <rect x={80} y={H - 240} width={W - 160} height={70} rx={12} fill="rgba(0,0,0,0.7)" />
      <text x={W/2} y={H - 195} fontSize={28} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
        {cur.text}
      </text>
    </g>
  );
};

export const VibeEditingIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const mo = mouthOpenAt(t);
  const inBeat = (b: number[]) => t >= b[0] && t < b[1];

  // Title entrance
  const titleScale = spring({ frame, fps, from: 0, to: 1, config: { damping: 12 } });

  return (
    <AbsoluteFill>
      <Audio src={staticFile("vibe_editing_voice.mp3")} />
      <Bg />

      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* === BEAT 1-2: GREET + INTRO === */}
        {t < B.explain[0] && (
          <g>
            {/* Title banner */}
            <g transform={`translate(${W/2}, 300) scale(${titleScale})`}>
              <rect x={-400} y={-70} width={800} height={140} rx={14} fill={ACCENT} stroke={INK} strokeWidth={4} />
              <text x={0} y={0} fontSize={64} fill="#FFF" textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800} letterSpacing="4">
                VIBE EDITING
              </text>
            </g>
            <text x={W/2} y={420} fontSize={26} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={400} opacity={0.7}>
              prompt ra video — không cần biết edit
            </text>
            {/* Teacher center waving */}
            <g transform={`translate(${W/2}, 1100) scale(2.5)`}>
              <Teacher mouthOpen={mo} waving={inBeat(B.greet)} />
            </g>
          </g>
        )}

        {/* === BEAT 3: EXPLAIN === */}
        {inBeat(B.explain) && (
          <g>
            <Whiteboard>
              {/* Concept diagram — centered in whiteboard (140..940 x 250..798) */}
              {/* Row 1: icons */}
              <text x={300} y={460} fontSize={52} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif">💡</text>
              <text x={300} y={510} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Ý tưởng</text>
              <text x={430} y={460} fontSize={44} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→</text>
              <text x={540} y={460} fontSize={52} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif">🤖</text>
              <text x={540} y={510} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>AI</text>
              <text x={670} y={460} fontSize={44} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>→</text>
              <text x={780} y={460} fontSize={52} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif">🎬</text>
              <text x={780} y={510} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>Video</text>
              {/* Row 2: summary text */}
              <text x={540} y={610} fontSize={30} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
                Ra lệnh → Code → Video
              </text>
            </Whiteboard>
            <g transform={`translate(200, 1100) scale(2)`}>
              <Teacher mouthOpen={mo} pointing />
            </g>
            <SpeechBubble text='"Ra lệnh cho AI, nó làm video luôn"' x={600} y={870} tailX={350} tailY={950} />
          </g>
        )}

        {/* === BEAT 4-6: SHOWCASE CLIPS — phone mockup portrait === */}
        {(inBeat(B.show1) || inBeat(B.show2) || inBeat(B.show3)) && (
          <g>
            {/* Phone frame — portrait, centered */}
            <rect x={240} y={120} width={600} height={1068} rx={24} fill="#1A1820" stroke={INK} strokeWidth={6} />
            <rect x={252} y={140} width={576} height={1028} rx={8} fill="#222" />
            {/* Label below phone */}
            <text x={W/2} y={1240} fontSize={28} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
              {inBeat(B.show1) ? "🎬 Cartoon người que" : inBeat(B.show2) ? "🎬 Reup hoạt hình" : "🎬 Video triết lí"}
            </text>
            {/* Teacher small, bottom right */}
            <g transform={`translate(880, 1500) scale(1.6)`}>
              <Teacher mouthOpen={mo} pointing />
            </g>
          </g>
        )}

        {/* === BEAT 7: THUMBNAILS === */}
        {inBeat(B.thumb) && (
          <g>
            <text x={W/2} y={200} fontSize={36} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
              THUMBNAIL — CODE HẾT
            </text>
            {/* Labels under thumbnail slots */}
            {["Hoa và Ong", "Reup Cartoon", "Im Lặng"].map((label, i) => (
              <text key={i} x={W/2 - 300 + i * 300} y={780} fontSize={22} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
                {label}
              </text>
            ))}
            <g transform={`translate(${W/2}, 1200) scale(2)`}>
              <Teacher mouthOpen={mo} />
            </g>
          </g>
        )}

        {/* === BEAT 8: STACK === */}
        {inBeat(B.stack) && (
          <g>
            <text x={W/2} y={350} fontSize={38} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
              CHỈ CẦN 3 THỨ
            </text>
            {[
              { emoji: "🧠", label: "AI", delay: 0 },
              { emoji: "</>" , label: "Framework", delay: 8 },
              { emoji: "🎙️", label: "Voice VN", delay: 16 },
            ].map((item, i) => {
              const s = spring({ frame: frame - B.stack[0] * fps - item.delay, fps, from: 0, to: 1, config: { damping: 10 } });
              return (
                <g key={i} transform={`translate(${220 + i * 260}, 550) scale(${s})`}>
                  <circle cx={0} cy={0} r={70} fill="#FFF" stroke={ACCENT} strokeWidth={4} />
                  <text x={0} y={item.emoji === "</>" ? 10 : 15} fontSize={item.emoji === "</>" ? 36 : 48} textAnchor="middle" fill={INK} fontFamily={item.emoji === "</>" ? "monospace" : undefined} fontWeight={700}>
                    {item.emoji}
                  </text>
                  <text x={0} y={95} fontSize={24} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
                    {item.label}
                  </text>
                </g>
              );
            })}
            <g transform={`translate(${W/2}, 1050) scale(2.2)`}>
              <Teacher mouthOpen={mo} />
            </g>
          </g>
        )}

        {/* === BEAT 9: SERIES === */}
        {inBeat(B.series) && (
          <g>
            <text x={W/2} y={350} fontSize={32} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
              📅 Tháng 4 — Series hướng dẫn từ zero
            </text>
            {["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"].map((label, i) => {
              const s = spring({ frame: frame - B.series[0] * fps - i * 5, fps, from: 0, to: 1, config: { damping: 12 } });
              return (
                <g key={i} transform={`translate(${W/2 - 315 + i * 210}, 480) scale(${s})`}>
                  <rect x={-85} y={-35} width={170} height={70} rx={10} fill={i === 0 ? ACCENT : "#FFF"} stroke={INK} strokeWidth={3} />
                  <text x={0} y={8} fontSize={24} fill={i === 0 ? "#FFF" : INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
                    {label} {i === 0 ? "✓" : ""}
                  </text>
                </g>
              );
            })}
            <g transform={`translate(${W/2}, 1050) scale(2.2)`}>
              <Teacher mouthOpen={mo} />
            </g>
          </g>
        )}

        {/* === BEAT 10: CTA === */}
        {inBeat(B.cta) && (
          <g>
            {(() => {
              const pulse = 1 + Math.sin(frame / 5) * 0.03;
              return (
                <g transform={`translate(${W/2}, 500) scale(${pulse})`}>
                  <rect x={-350} y={-80} width={700} height={160} rx={20} fill={ACCENT} stroke={INK} strokeWidth={5} />
                  <text x={0} y={0} fontSize={56} fill="#FFF" textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
                    FOLLOW CHỒNG
                  </text>
                  <text x={0} y={55} fontSize={24} fill="#FFE0D0" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif">
                    Tập 1 ra tuần này
                  </text>
                </g>
              );
            })()}
            <g transform={`translate(${W/2}, 1050) scale(2.5)`}>
              <Teacher mouthOpen={mo} waving />
            </g>
          </g>
        )}

        {/* === BEAT 11: META === */}
        {inBeat(B.meta) && (
          <g>
            {(() => {
              const s = spring({ frame: frame - B.meta[0] * fps, fps, from: 0, to: 1, config: { damping: 10 } });
              return (
                <g transform={`translate(${W/2}, 450) scale(${s})`}>
                  <rect x={-420} y={-50} width={840} height={100} rx={14} fill={GOLD} stroke={INK} strokeWidth={4} />
                  <text x={0} y={10} fontSize={26} fill={INK} textAnchor="middle" dominantBaseline="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={700}>
                    ⚡ Video này cũng chồng ra lệnh làm hoàn toàn đấy vợ ạ
                  </text>
                </g>
              );
            })()}
            <g transform={`translate(${W/2}, 1050) scale(2.5)`}>
              <Teacher mouthOpen={mo} />
            </g>
          </g>
        )}

        {/* Caption overlay */}
        <Caption t={t} />
      </svg>

      {/* Video overlays inside phone mockup — Sequence resets timeline so video plays from frame 0 */}
      <Sequence from={Math.round(B.show1[0] * FPS)} durationInFrames={Math.round((B.show1[1] - B.show1[0]) * FPS)}>
        <div style={{ position: "absolute", left: 252, top: 140, width: 576, height: 1028, borderRadius: 8, overflow: "hidden" }}>
          <OffthreadVideo src={staticFile("clip_gtl02.mp4")} volume={0} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </Sequence>
      <Sequence from={Math.round(B.show2[0] * FPS)} durationInFrames={Math.round((B.show2[1] - B.show2[0]) * FPS)}>
        <div style={{ position: "absolute", left: 252, top: 140, width: 576, height: 1028, borderRadius: 8, overflow: "hidden" }}>
          <OffthreadVideo src={staticFile("clip_reup.mp4")} volume={0} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </Sequence>
      <Sequence from={Math.round(B.show3[0] * FPS)} durationInFrames={Math.round((B.show3[1] - B.show3[0]) * FPS)}>
        <div style={{ position: "absolute", left: 252, top: 140, width: 576, height: 1028, borderRadius: 8, overflow: "hidden" }}>
          <OffthreadVideo src={staticFile("clip_imlang.mp4")} volume={0} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </Sequence>
      {/* Thumbnail images during thumb beat */}
      {inBeat(B.thumb) && (
        <>
          {[
            { src: "thumb_gtl02.png", color: GOLD },
            { src: "thumb_reup.png", color: ACCENT },
            { src: "thumb_imlang.png", color: "#4A7AC8" },
          ].map((item, i) => {
            const s = spring({ frame: frame - Math.round(B.thumb[0] * FPS) - i * 5, fps, from: 0, to: 1, config: { damping: 12 } });
            return (
              <div key={i} style={{
                position: "absolute",
                left: W/2 - 300 + i * 300 - 120,
                top: 260,
                width: 240,
                height: 480,
                borderRadius: 12,
                overflow: "hidden",
                border: `4px solid ${item.color}`,
                transform: `scale(${s})`,
                transformOrigin: "center center",
              }}>
                <Img src={staticFile(item.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            );
          })}
        </>
      )}
    </AbsoluteFill>
  );
};
