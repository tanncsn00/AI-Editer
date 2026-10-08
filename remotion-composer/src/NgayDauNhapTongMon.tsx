import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { InkScape, ScrollRule, Seal, BODY, EMPHASIS, CINNABAR } from "./codophong_ink";
import wordsData from "./ndntm_words.json";
import dropsData from "./ndntm_drops.json";
import sealsData from "./ndntm_seals.json";

loadEBGaramond("normal", { weights: ["400", "500", "600"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300", "400", "600", "700", "800"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FPS = 30;

type Word = { word: string; start: number; end: number };
const words = wordsData as Word[];

type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  for (const w of words) {
    buf.push(w);
    if (/[.!?]$/.test(w.word)) {
      out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
      buf = [];
    }
  }
  if (buf.length) out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
  return out;
})();

const EMPH = new Set<string>([
  "lễ", "nghĩa.", "đéo", "nhận.", "hỏi.", "hỏi,", "đại", "nghiệp",
  "đạo", "tâm.", "nhiều.", "chủ", "động.", "cảnh", "giới.",
  "tẩu", "hỏa", "nhập", "ma.", "người.", "tiền", "bối", "đúng",
  "ngu", "tồn", "tại.", "nhân", "quả", "group", "chat.", "chat",
  "thế", "hệ.", "sai", "lầm.", "nói.", "mai", "tính.", "kiếp",
]);
const isEmph = (w: string): boolean => EMPH.has(w.toLowerCase());

type Drop = { key: string; text: string; sub?: string; start: number; end: number; size?: number };
const DROPS = dropsData as Drop[];

type SealT = { label: string; start: number; end: number };
const SEALS = sealsData as SealT[];

const activeDrop = (t: number): Drop | null => {
  for (const d of DROPS) if (t >= d.start - 0.12 && t <= d.end) return d;
  return null;
};

const Caption: React.FC<{ hide: boolean }> = ({ hide }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let active: Sentence | null = null;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i + 1];
    const boundary = next ? next.start : s.end + 0.7;
    if (t >= s.start - 0.15 && t < boundary) { active = s; break; }
  }
  if (!active || hide) return null;
  const LEAD = 0.1;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", maxWidth: 920, padding: "0 60px" }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [12, 0]);
          const blur = interpolate(sp, [0, 1], [4, 0]);
          const emph = isEmph(w.word);
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontWeight: emph ? 800 : 600,
              fontSize: emph ? 64 : 54,
              color: emph ? EMPHASIS : BODY,
              textShadow: emph ? "0 0 26px rgba(201,162,39,0.6), 0 4px 14px rgba(0,0,0,0.95)" : "0 3px 12px rgba(0,0,0,0.95)",
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

const BigWord: React.FC<{ drop: Drop }> = ({ drop }) => {
  const frame = useCurrentFrame();
  const sf = drop.start * FPS;
  const ef = drop.end * FPS;
  const sp = spring({ frame: frame - sf, fps: FPS, config: { damping: 12, stiffness: 80, mass: 1.5 } });
  const fadeOut = interpolate(frame, [ef - 12, ef], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = sp * fadeOut;
  const scale = interpolate(sp, [0, 1], [1.55, 1.0]);
  const blur = interpolate(sp, [0, 1], [14, 0]);
  const rule = interpolate(sp, [0.35, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)`, padding: "0 70px", maxWidth: 1000 }}>
        <div style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontWeight: 600,
          fontSize: drop.size ?? 150,
          color: BODY,
          letterSpacing: "4px",
          textShadow: "0 0 50px rgba(237,228,206,0.26), 0 0 150px rgba(201,162,39,0.3), 0 10px 30px rgba(0,0,0,0.95)",
          lineHeight: 1.08,
          textAlign: "center",
          textTransform: "uppercase",
          whiteSpace: "pre-line",
        }}>{drop.text}</div>
        <div style={{
          height: 2, marginTop: 30,
          width: `${rule * 72}%`, marginLeft: "auto", marginRight: "auto",
          background: `linear-gradient(to right, rgba(178,58,46,0) 0%, ${CINNABAR} 50%, rgba(178,58,46,0) 100%)`,
          boxShadow: `0 0 18px rgba(178,58,46,0.6)`,
        }} />
        {drop.sub ? (
          <div style={{
            fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
            fontWeight: 300, fontSize: 28, color: "#C4BCA6",
            letterSpacing: "5px", textAlign: "center", marginTop: 26,
            textTransform: "uppercase", textShadow: "0 2px 10px rgba(0,0,0,0.95)",
          }}>{drop.sub}</div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const NgayDauNhapTongMon: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / FPS;
  const globalOpacity = interpolate(
    frame,
    [0, 14, durationInFrames - 16, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const drop = activeDrop(t);
  return (
    <AbsoluteFill style={{ backgroundColor: "#070505", opacity: globalOpacity }}>
      <InkScape />
      <ScrollRule />
      {SEALS.map((s, i) => <Seal key={i} label={s.label} start={s.start} end={s.end} />)}
      <Caption hide={!!drop} />
      {drop ? <BigWord drop={drop} /> : null}
      <Audio src={staticFile("ndntm/voice.mp3")} volume={0.9} />
      {bgm ? <Audio src={staticFile("ndntm/bgm.mp3")} volume={0.07} /> : null}
    </AbsoluteFill>
  );
};
