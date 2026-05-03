/**
 * MvMinhTao — AI music video "MÌNH TAO". 30s @ 30fps = 900 frames.
 * 8 SDXL urban-night cuts beat-synced to 10 narrated lyric lines.
 * Lyric pops in bottom-third per-line with karaoke word highlight.
 */

import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800"], subsets: ["vietnamese", "latin"] });
loadOswald("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

type Cut = { id: string; tin: number; tout: number; pan?: [number, number]; zoom?: [number, number] };
const CUTS: Cut[] = [
  { id: "M1", tin: 0.0,  tout: 4.0,  pan: [-0.02,  0.03], zoom: [1.05, 1.12] },
  { id: "M2", tin: 4.0,  tout: 8.0,  pan: [ 0.02, -0.02], zoom: [1.08, 1.16] },
  { id: "M3", tin: 8.0,  tout: 12.0, pan: [-0.03,  0.04], zoom: [1.10, 1.20] },
  { id: "M4", tin: 12.0, tout: 16.0, pan: [ 0.02,  0.00], zoom: [1.06, 1.14] },
  { id: "M5", tin: 16.0, tout: 20.0, pan: [ 0.03, -0.02], zoom: [1.08, 1.18] },
  { id: "M6", tin: 20.0, tout: 24.0, pan: [-0.02,  0.03], zoom: [1.10, 1.20] },
  { id: "M7", tin: 24.0, tout: 27.5, pan: [ 0.04, -0.01], zoom: [1.05, 1.15] },
  { id: "M8", tin: 27.5, tout: 30.0, pan: [ 0.00,  0.03], zoom: [1.05, 1.20] },
];

type Lyric = { id: string; time: number; text: string };
const LYRICS: Lyric[] = [
  { id: "V1",  time: 0.5,  text: "Ba giờ sáng, đèn đường nhòe trên kính" },
  { id: "V2",  time: 3.5,  text: "Sài Gòn ngủ, chỉ còn tao thức tỉnh" },
  { id: "V3",  time: 6.5,  text: "Khói thuốc bay, tan vào gió lạnh" },
  { id: "V4",  time: 9.5,  text: "Đời như phim câm, không ai soi ánh" },
  { id: "V5",  time: 12.5, text: "Có lúc mệt, muốn dừng lại thật" },
  { id: "V6",  time: 15.5, text: "Nhưng ngày mai, vẫn phải ra trận" },
  { id: "V7",  time: 18.5, text: "Mình tao đi, mình tao đứng dậy" },
  { id: "V8",  time: 21.5, text: "Thằng đàn ông, không kêu ai cả" },
  { id: "V9",  time: 24.5, text: "Bước tiếp đi — đường dài còn đó" },
  { id: "V10", time: 27.0, text: "Mình tao. Mình tao. Cứ thế mà đi." },
];

const CutLayer: React.FC<{ c: Cut }> = ({ c }) => {
  const frame = useCurrentFrame();
  const sf = c.tin * FPS;
  const ef = c.tout * FPS;
  const fade = 6;
  const opacity = interpolate(
    frame,
    [sf - fade, sf + fade, ef - fade, ef + fade],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (opacity <= 0) return null;
  const p = (frame - sf) / Math.max(1, ef - sf);
  const scale = interpolate(p, [0, 1], c.zoom ?? [1.05, 1.15]);
  const tx = interpolate(p, [0, 1], [0, (c.pan?.[0] ?? 0) * 80]);
  const ty = interpolate(p, [0, 1], [0, (c.pan?.[1] ?? 0) * 80]);
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        width: "100%", height: "100%",
        transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
        filter: "contrast(1.15) saturate(0.95) brightness(0.88)",
      }}>
        <Img src={staticFile(`mv_minhtao/${c.id}.png`)} style={{
          width: "100%", height: "100%", objectFit: "cover",
        }} />
      </div>
    </AbsoluteFill>
  );
};

// Beat-synced flash strip bottom (visual pulse at 84 BPM)
const BeatPulse: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const bps = 84 / 60;
  const beat = (t * bps) % 1;
  const pulse = 1 - Math.pow(beat, 1.6);
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 0,
      height: 6, background: "#E52D4C", opacity: pulse * 0.85,
    }} />
  );
};

// Vignette + grain
const Vignette: React.FC = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5) 100%)",
  }} />
);

const LyricLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let active: Lyric | null = null;
  for (let i = 0; i < LYRICS.length; i++) {
    const l = LYRICS[i];
    const next = LYRICS[i + 1];
    const boundary = next ? next.time : l.time + 3.0;
    if (t >= l.time - 0.15 && t < boundary) { active = l; break; }
  }
  if (!active) return null;
  const words = active.text.split(" ");
  const perWord = 0.12;
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 240,
      textAlign: "center", padding: "0 80px",
    }}>
      <div style={{
        display: "inline-flex", flexWrap: "wrap", justifyContent: "center",
        gap: "0 14px", maxWidth: 980,
      }}>
        {words.map((w, i) => {
          const appearAt = active!.time + i * perWord;
          const sp = spring({
            frame: frame - appearAt * FPS, fps: FPS,
            config: { damping: 16, stiffness: 260, mass: 0.4 },
          });
          const y = interpolate(sp, [0, 1], [14, 0]);
          const blur = interpolate(sp, [0, 1], [5, 0]);
          const isEmph = /tao|MÌNH|mình|dậy|ai|chết|cả\.?$|đi\.?$|trận/i.test(w);
          const fontSize = isEmph ? 68 : 52;
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: isEmph ? 800 : 600,
              fontSize, color: isEmph ? "#E52D4C" : "#F3E4C9",
              textShadow: isEmph
                ? "0 0 20px rgba(229,45,76,0.7), 0 4px 14px rgba(0,0,0,0.98)"
                : "0 4px 14px rgba(0,0,0,0.98)",
              opacity: sp,
              transform: `translateY(${y}px)`,
              filter: `blur(${blur}px)`,
              letterSpacing: isEmph ? "1px" : "0",
              lineHeight: 1.3,
            }}>{w}</span>
          );
        })}
      </div>
    </div>
  );
};

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  // Flash title at 0-1s
  if (frame > FPS * 1.2) return null;
  const p = Math.min(1, frame / (FPS * 0.8));
  const opacity = interpolate(p, [0, 0.2, 0.85, 1], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "Oswald, sans-serif", fontWeight: 700,
          fontSize: 240, color: "#F5EEDC", letterSpacing: "16px",
          textShadow: "0 8px 40px rgba(0,0,0,1)",
        }}>MÌNH TAO</div>
        <div style={{
          fontFamily: "Oswald, sans-serif", fontWeight: 400,
          fontSize: 36, color: "#E52D4C", letterSpacing: "14px", marginTop: 12,
        }}>— SAIGON 3AM —</div>
      </div>
    </AbsoluteFill>
  );
};

export const MvMinhTao: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {CUTS.map((c) => <CutLayer key={c.id} c={c} />)}
    <Vignette />
    <TitleCard />
    <LyricLayer />
    <BeatPulse />
    <Audio src={staticFile("mv_minhtao/narration_full.mp3")} volume={1.0} />
    <Audio src={staticFile("bh_music.mp3")} volume={0.32} />
  </AbsoluteFill>
);
