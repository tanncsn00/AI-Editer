import {
  AbsoluteFill, Audio, OffthreadVideo,
  interpolate, spring, staticFile, useCurrentFrame,
} from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import wordsData from "./tinhdao_fb01_words.json";
import beatsData from "./tinhdao_fb01_beats.json";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["400","600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

const FPS = 30;
const EMPHASIS = "#F4B860";
const BODY = "#F5F5F0";

type Word = { word: string; start: number; end: number; beat: number };
const words = wordsData as Word[];
const meta = beatsData as { beats: { index:number; start:number; duration:number }[]; narration_end:number; outro_start:number; outro_end:number };

const SENTENCES = (() => {
  const out: { words: Word[]; start: number; end: number }[] = [];
  let buf: Word[] = [];
  const flush = () => { if (buf.length) { out.push({ words: buf, start: buf[0].start, end: buf[buf.length-1].end }); buf = []; } };
  for (const w of words) {
    buf.push(w);
    if (/[.!?]$/.test(w.word)) flush();
  }
  flush();
  return out;
})();

const EMPH = new Set<string>([
  "hiền,", "phiền", "tiên.",
  "nhiên,", "trời.",
  "vôi,", "dòng.",
  "lòng,", "tâm", "mình.",
]);
const isEmph = (w: string) => EMPH.has(w);

type Cut = { src: string; start: number; end: number; sf?: number; st?: number };
const CUTS: Cut[] = [
  { src: "tinhdao_fb01/cut1.mp4", start: meta.beats[0].start, end: meta.beats[0].start + meta.beats[0].duration + 0.5, sf: 1.02, st: 1.10 },
  { src: "tinhdao_fb01/cut2.mp4", start: meta.beats[1].start, end: meta.beats[1].start + meta.beats[1].duration + 0.5, sf: 1.04, st: 1.12 },
  { src: "tinhdao_fb01/cut3.mp4", start: meta.beats[2].start, end: meta.beats[2].start + meta.beats[2].duration + 0.5, sf: 1.02, st: 1.10 },
  { src: "tinhdao_fb01/cut4.mp4", start: meta.beats[3].start, end: meta.outro_end, sf: 1.04, st: 1.16 },
];

const CutLayer: React.FC<{ cut: Cut }> = ({ cut }) => {
  const frame = useCurrentFrame();
  const sf = cut.start * FPS, ef = cut.end * FPS;
  const fade = 10;
  const opacity = interpolate(frame, [sf-fade, sf+fade, ef-fade, ef+fade], [0,1,1,0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
  if (opacity <= 0) return null;
  const scale = interpolate(frame - sf, [0, ef-sf], [cut.sf ?? 1.02, cut.st ?? 1.1], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ width:"100%", height:"100%", transform:`scale(${scale})`, filter:"brightness(0.38) saturate(0.5) contrast(1.14)" }}>
        <OffthreadVideo src={staticFile(cut.src)} muted style={{ width:"100%", height:"100%", objectFit:"cover" }} />
      </div>
      {/* bottom gradient for caption legibility */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ hide: boolean }> = ({ hide }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let active: typeof SENTENCES[number] | null = null;
  for (let i=0; i<SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i+1];
    const boundary = next ? next.start : s.end + 0.7;
    if (t >= s.start - 0.15 && t < boundary) { active = s; break; }
  }
  if (!active || hide) return null;
  const LEAD = 0.1;
  return (
    <AbsoluteFill style={{ justifyContent:"center", alignItems:"center" }}>
      <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"0 18px", maxWidth:920, padding:"0 60px" }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping:14, stiffness:230, mass:0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0,1], [12,0]);
          const blur = interpolate(sp, [0,1], [4,0]);
          const emph = isEmph(w.word);
          return (
            <span key={i} style={{
              display:"inline-block",
              fontFamily:"'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontWeight: emph ? 800 : 600,
              fontSize: emph ? 64 : 54,
              color: emph ? EMPHASIS : BODY,
              textShadow: emph ? "0 0 26px rgba(244,184,96,0.6), 0 4px 14px rgba(0,0,0,0.95)" : "0 3px 12px rgba(0,0,0,0.95)",
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

const BIG_START = meta.outro_start;
const BIG_END = meta.outro_end;

const BigWord: React.FC = () => {
  const frame = useCurrentFrame();
  const sf = BIG_START * FPS, ef = BIG_END * FPS;
  if (frame < sf - 4) return null;
  const sp = spring({ frame: frame - sf, fps: FPS, config: { damping:12, stiffness:80, mass:1.5 } });
  const fadeOut = interpolate(frame, [ef-20, ef], [1,0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
  const opacity = sp * fadeOut;
  const scale = interpolate(sp, [0,1], [1.8, 1.0]);
  const blur = interpolate(sp, [0,1], [16, 0]);
  return (
    <AbsoluteFill style={{ justifyContent:"center", alignItems:"center", opacity }}>
      <div style={{ transform:`scale(${scale})`, filter:`blur(${blur}px)` }}>
        <div style={{
          fontFamily:"'EB Garamond', Georgia, serif",
          fontWeight: 500, fontSize: 320,
          color: EMPHASIS,
          letterSpacing: "16px",
          textShadow: "0 0 60px rgba(244,184,96,0.4), 0 0 180px rgba(244,184,96,0.35), 0 10px 30px rgba(0,0,0,0.95)",
          lineHeight: 1, textAlign: "center",
        }}>TÂM.</div>
        <div style={{
          fontFamily:"'Be Vietnam Pro', sans-serif",
          fontWeight: 300, fontSize: 26,
          color: "#E8C898", letterSpacing: "5px",
          textAlign: "center", marginTop: 38, textTransform: "uppercase",
        }}>chỗ dựa vững nhất</div>
      </div>
    </AbsoluteFill>
  );
};

export const TinhDaoFB01: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const bigActive = t >= BIG_START - 0.3 && t < BIG_END;
  return (
    <AbsoluteFill style={{ backgroundColor:"#000" }}>
      <Audio src={staticFile("tinhdao_fb01/voice.mp3")} volume={0.92} />
      <Audio src={staticFile("tinhdao_fb01/music.mp3")} volume={0.10} />
      {CUTS.map((c, i) => <CutLayer key={i} cut={c} />)}
      <Caption hide={bigActive} />
      <BigWord />
    </AbsoluteFill>
  );
};
