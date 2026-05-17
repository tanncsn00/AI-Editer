import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
} from 'remotion';
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import wordsData from '../public/agi-conspiracy/words.json';

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const PAPER = "#F3EAD8";
const INK = "#1A1820";
const ACCENT = "#E85838";
const GOLD = "#E5A53B";
const YELLOW = "#F4B860";
const IVORY = "#F5F5F0";

type Word = { word: string; start: number; end: number; beat: string };
const words = wordsData as Word[];

// Helper to get beat start/duration from words
const getBeatTiming = (beatIndex: number) => {
  const beatWords = words.filter(w => w.beat === `beat_${beatIndex}`);
  if (beatWords.length === 0) return [0, 0];
  const start = beatWords[0].start;
  const end = beatWords[beatWords.length - 1].end;
  return [start, end] as const;
};

const B = (i: number) => getBeatTiming(i);

const mouthOpenAt = (t: number): number => {
  for (const w of words) {
    if (t >= w.start && t <= w.end) {
      const progress = (t - w.start) / (w.end - w.start);
      return Math.sin(progress * Math.PI);
    }
  }
  return 0;
};

// =============== Background (Paper Cream + Noise) ===============
const Bg: React.FC = () => (
  <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <filter id="ep1PN">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
        <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.18 0" />
      </filter>
      <radialGradient id="ep1Vig" cx="50%" cy="50%" r="75%">
        <stop offset="40%" stopColor={PAPER} stopOpacity="0" />
        <stop offset="100%" stopColor="#7A5838" stopOpacity="0.4" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill={PAPER} />
    <rect width={W} height={H} filter="url(#ep1PN)" />
    <rect width={W} height={H} fill="url(#ep1Vig)" />
  </svg>
);

// =============== Teacher (người que) ===============
const Teacher: React.FC<{ mouthOpen: number; pointing?: boolean; waving?: boolean; thumbs?: boolean }> = ({
  mouthOpen, pointing = false, waving = false, thumbs = false,
}) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 8) * 3;
  const blink = Math.sin(frame / 45) > 0.92;
  const waveAngle = waving ? Math.sin(frame / 4) * 15 : 0;

  return (
    <g transform={`translate(0, ${bob})`}>
      <line x1={-12} y1={30} x2={-18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
      <line x1={12} y1={30} x2={18} y2={75} stroke="#3A3850" strokeWidth={14} strokeLinecap="round" />
      <ellipse cx={-20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
      <ellipse cx={20} cy={80} rx={12} ry={6} fill="#2A2830" stroke={INK} strokeWidth={2} />
      <rect x={-22} y={-25} width={44} height={58} rx={10} fill="#4A7AC8" stroke={INK} strokeWidth={3.5} />
      <path d="M -8 -25 L 0 -15 L 8 -25" fill="#E8E0D0" stroke={INK} strokeWidth={2} />
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
      ) : thumbs ? (
        <>
          <line x1={22} y1={-12} x2={40} y2={-38} stroke="#F8E0D0" strokeWidth={12} strokeLinecap="round" />
          <line x1={22} y1={-12} x2={40} y2={-38} stroke={INK} strokeWidth={2.5} />
          <circle cx={44} cy={-44} r={8} fill="#F8E0D0" stroke={INK} strokeWidth={2} />
          <line x1={44} y1={-52} x2={44} y2={-60} stroke="#F8E0D0" strokeWidth={5} strokeLinecap="round" />
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
      <circle cx={0} cy={-46} r={22} fill="#F8E0D0" stroke={INK} strokeWidth={3.5} />
      <path d="M -22 -52 Q -18 -68 -6 -66 Q 2 -72 14 -68 Q 22 -60 22 -52" fill="#1A1A22" />
      {blink ? (
        <>
          <line x1={-12} y1={-48} x2={-4} y2={-48} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={4} y1={-48} x2={12} y2={-48} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx={-8} cy={-48} r={3} fill={INK} />
          <circle cx={8} cy={-48} r={3} fill={INK} />
        </>
      )}
      {mouthOpen > 0.2 ? (
        <ellipse cx={0} cy={-36} rx={5 * mouthOpen} ry={4 * mouthOpen} fill="#C04030" stroke={INK} strokeWidth={2} />
      ) : (
        <path d="M -6 -38 Q 0 -33 6 -38" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      )}
    </g>
  );
};

// =============== Caption (Sentence-based spring reveal) ===============
type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  const flush = () => {
    if (buf.length) {
      out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
      buf = [];
    }
  };
  for (const w of words) {
    buf.push(w);
    if (/[.!?]$/.test(w.word)) {
      flush();
      continue;
    }
    if (/,$/.test(w.word) && buf.length >= 8) {
      flush();
    }
  }
  flush();
  return out;
})();

const EMPH = new Set<string>([
  "AI", "AGI.", "AGI", "âm", "mưu...", "vũ", "khí",
]);
const isEmph = (w: string): boolean => EMPH.has(w);

const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  let active: Sentence | null = null;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i + 1];
    const boundary = next ? next.start : s.end + 0.6;
    if (t >= s.start - 0.15 && t < boundary) {
      active = s;
      break;
    }
  }
  if (!active) return null;
  const LEAD = 0.1;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 160, pointerEvents: "none" }}>
      <div style={{
        display: "flex", flexWrap: "wrap", justifyContent: "center",
        gap: "0 18px", maxWidth: 940, padding: "0 60px",
      }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({
            frame: frame - appearAt * FPS, fps: FPS,
            config: { damping: 14, stiffness: 230, mass: 0.4 },
          });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [12, 0]);
          const blur = interpolate(sp, [0, 1], [4, 0]);
          const emph = isEmph(w.word);
          return (
            <span key={`${active.start}-${i}`} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontWeight: emph ? 800 : 600,
              fontSize: emph ? 62 : 52,
              color: emph ? GOLD : IVORY,
              textShadow: emph
                ? "0 0 26px rgba(229,165,59,0.55), 0 4px 14px rgba(0,0,0,0.95)"
                : "0 3px 12px rgba(0,0,0,0.95)",
              opacity: visible ? sp : 0,
              transform: `translateY(${y}px)`,
              filter: `blur(${blur}px)`,
              letterSpacing: emph ? "0.4px" : "0",
              lineHeight: 1.3,
            }}>{w.word}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// =============== Beat Visuals ===============

// Beat 1: Vấn đề / Hook
const Beat1: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(1);
  const p = Math.max(0, t - a);
  return (
    <g>
      {/* Title */}
      <text x={W / 2} y={300} fontSize={60} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>
        AI VƯỢT QUA CON NGƯỜI?
      </text>
      
      {/* Cửa đóng minh hoạ */}
      {p > 1 && (
        <g transform="translate(290, 400)" opacity={interpolate(p, [1, 1.5], [0, 1], { extrapolateRight: "clamp" })}>
           <rect x={0} y={0} width={500} height={300} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
           <text x={250} y={150} fontSize={100} textAnchor="middle">🚪</text>
           <text x={250} y={230} fontSize={30} fill={INK} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BỊ CHE GIẤU</text>
        </g>
      )}

      <g transform={`translate(${W / 2}, 1400) scale(2.0)`}>
        <Teacher mouthOpen={mo} pointing={p > 2} />
      </g>
    </g>
  );
};

// Beat 2: Context
const Beat2: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(2);
  const p = Math.max(0, t - a);
  return (
    <g>
      <text x={W / 2} y={160} fontSize={48} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PHÁT TRIỂN CHÓNG MẶT</text>
      <g transform="translate(140, 300)">
         <rect x={0} y={0} width={800} height={200} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
         <text x={400} y={120} fontSize={60} textAnchor="middle">📈 TỐC ĐỘ</text>
      </g>
      <g transform={`translate(920, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};

// Beat 3: Phiên bản giới hạn
const Beat3: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(3);
  const p = Math.max(0, t - a);
  return (
    <g>
      <text x={W / 2} y={160} fontSize={48} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>PHIÊN BẢN GIỚI HẠN</text>
      <g transform="translate(140, 300)">
         <rect x={0} y={0} width={800} height={200} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
         <text x={400} y={120} fontSize={60} textAnchor="middle">🔒 LIMITED</text>
      </g>
      <g transform={`translate(920, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// Beat 4: Lời cảnh báo
const Beat4: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(4);
  const p = Math.max(0, t - a);
  return (
    <g>
      <text x={W / 2} y={160} fontSize={48} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>LỜI CẢNH BÁO</text>
      <g transform="translate(140, 300)">
         <rect x={0} y={0} width={800} height={200} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
         <text x={400} y={120} fontSize={60} textAnchor="middle">⚠️ AGI WARNING</text>
      </g>
      <g transform={`translate(920, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} />
      </g>
    </g>
  );
};

// Beat 5: Lý do & Cuộc chạy đua
const Beat5: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(5);
  const p = Math.max(0, t - a);
  return (
    <g>
      <text x={W / 2} y={160} fontSize={48} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>TẠI SAO GIẤU?</text>
      <g transform="translate(90, 300)">
         <rect x={0} y={0} width={400} height={180} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
         <text x={200} y={110} fontSize={40} textAnchor="middle">😱 HOẢNG LOẠN</text>
      </g>
      <g transform="translate(590, 300)">
         <rect x={0} y={0} width={400} height={180} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
         <text x={200} y={110} fontSize={40} textAnchor="middle">💰 KINH TẾ</text>
      </g>
      <g transform="translate(340, 520)">
         <rect x={0} y={0} width={400} height={180} rx={20} fill="#FAFAF5" stroke={INK} strokeWidth={4} />
         <text x={200} y={110} fontSize={40} textAnchor="middle">⚔️ VŨ KHÍ</text>
      </g>
      <g transform={`translate(920, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} pointing />
      </g>
    </g>
  );
};

// Beat 6: Outro
const Beat6: React.FC<{ t: number; mo: number }> = ({ t, mo }) => {
  const [a] = B(6);
  const p = Math.max(0, t - a);
  return (
    <g>
      <text x={W / 2} y={260} fontSize={60} fill={ACCENT} textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>BẠN NGHĨ SAO?</text>
      <g transform="translate(240, 400)">
         <rect x={0} y={0} width={600} height={180} rx={20} fill={GOLD} stroke={INK} strokeWidth={4} />
         <text x={300} y={110} fontSize={40} fill="#FFF" textAnchor="middle" fontFamily="'Be Vietnam Pro', sans-serif" fontWeight={800}>👇 COMMENT BÊN DƯỚI</text>
      </g>
      <g transform={`translate(920, 1540) scale(1.4)`}>
        <Teacher mouthOpen={mo} waving />
      </g>
    </g>
  );
};

// =============== Main composition ===============
export const AgiConspiracy: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const mo = mouthOpenAt(t);

  const [, e1] = B(1);
  const [, e2] = B(2);
  const [, e3] = B(3);
  const [, e4] = B(4);
  const [, e5] = B(5);
  const [, e6] = B(6);
  
  // Audio tracks dynamically sequenced
  const audioTracks = [];
  for (let i = 1; i <= 6; i++) {
    const [start, end] = getBeatTiming(i);
    if (end > 0) {
      audioTracks.push(
        <Sequence key={i} from={Math.floor(start * FPS)} durationInFrames={Math.ceil((end - start) * FPS)}>
          <Audio src={staticFile(`agi-conspiracy/beat_${i}.mp3`)} />
        </Sequence>
      );
    }
  }

  return (
    <AbsoluteFill>
      <Bg />
      {audioTracks}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {t < e1 && <Beat1 t={t} mo={mo} />}
        {t >= B(2)[0] && t < e2 && <Beat2 t={t} mo={mo} />}
        {t >= B(3)[0] && t < e3 && <Beat3 t={t} mo={mo} />}
        {t >= B(4)[0] && t < e4 && <Beat4 t={t} mo={mo} />}
        {t >= B(5)[0] && t < e5 && <Beat5 t={t} mo={mo} />}
        {t >= B(6)[0] && t < e6 && <Beat6 t={t} mo={mo} />}
      </svg>
      <Caption />
    </AbsoluteFill>
  );
};
