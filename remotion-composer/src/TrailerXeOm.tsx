/**
 * TrailerXeOm — fake movie trailer "XE ÔM: THE LAST RIDE".
 * 8 SDXL cinematic stills + narrator VO + Ken Burns zoom + title cards +
 * dramatic flashes. 30s @ 30fps = 900 frames.
 */

import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  Sequence,
} from "remotion";
import { loadFont as loadBevn } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

loadBevn("normal", { weights: ["400", "600", "800"], subsets: ["vietnamese", "latin"] });
loadOswald("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

type Scene = { id: string; tin: number; tout: number; pan?: [number, number] };
const SCENES: Scene[] = [
  { id: "S1", tin: 0.0,  tout: 3.8,  pan: [-0.04,  0.04] },
  { id: "S2", tin: 3.8,  tout: 7.0,  pan: [ 0.02, -0.03] },
  { id: "S3", tin: 7.0,  tout: 10.5, pan: [-0.03,  0.05] },
  { id: "S4", tin: 10.5, tout: 14.2, pan: [ 0.04, -0.02] },
  { id: "S5", tin: 14.2, tout: 17.8, pan: [ 0.00,  0.04] },
  { id: "S6", tin: 17.8, tout: 21.0, pan: [ 0.03, -0.03] },
  { id: "S7", tin: 21.0, tout: 24.8, pan: [-0.04, -0.02] },
  { id: "S8", tin: 24.8, tout: 28.5, pan: [ 0.00,  0.03] },
];

type Title = { tin: number; tout: number; text: string; sub: string };
const TITLES: Title[] = [
  { tin: 10.0, tout: 12.5, text: "TỪ NHÀ SẢN XUẤT",  sub: "CỦA NHỮNG GIẤC MƠ SÀI GÒN" },
  { tin: 21.5, tout: 24.0, text: "MÙA HÈ NÀY",       sub: "KHÔNG AI SỐNG SÓT" },
];

const SceneLayer: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const sf = s.tin * FPS;
  const ef = s.tout * FPS;
  const fade = 8;
  const opacity = interpolate(
    frame,
    [sf - fade, sf + fade, ef - fade, ef + fade],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (opacity <= 0) return null;
  // Ken Burns: gentle zoom + pan
  const p = (frame - sf) / Math.max(1, ef - sf);
  const scale = interpolate(p, [0, 1], [1.08, 1.18]);
  const tx = interpolate(p, [0, 1], [0, (s.pan?.[0] ?? 0) * 80]);
  const ty = interpolate(p, [0, 1], [0, (s.pan?.[1] ?? 0) * 80]);
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        width: "100%", height: "100%",
        transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
        filter: "contrast(1.12) saturate(0.85) brightness(0.92)",
      }}>
        <Img src={staticFile(`xe_om/${s.id}.png`)} style={{
          width: "100%", height: "100%", objectFit: "cover",
        }} />
      </div>
    </AbsoluteFill>
  );
};

// Hard cut flashes between scenes for trailer rhythm
const CutFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let strength = 0;
  for (const s of SCENES) {
    const d = Math.abs(t - s.tin);
    if (d < 0.15) strength = Math.max(strength, 1 - d / 0.15);
  }
  if (strength <= 0) return null;
  return <div style={{ position: "absolute", inset: 0, background: "#000", opacity: strength * 0.6 }} />;
};

const TitleCard: React.FC<{ t: Title }> = ({ t }) => {
  const frame = useCurrentFrame();
  const sf = t.tin * FPS;
  const ef = t.tout * FPS;
  if (frame < sf - 6 || frame > ef + 6) return null;
  const sp = spring({ frame: frame - sf, fps: FPS, config: { damping: 18, stiffness: 180 } });
  const fadeOut = interpolate(frame, [ef - 8, ef], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(sp, fadeOut);
  const scale = interpolate(sp, [0, 1], [0.92, 1]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        <div style={{
          fontFamily: "Oswald, sans-serif", fontWeight: 700,
          fontSize: 96, color: "#F5EEDC", letterSpacing: "6px",
          textShadow: "0 4px 24px rgba(0,0,0,0.95)",
        }}>{t.text}</div>
        <div style={{
          fontFamily: "Oswald, sans-serif", fontWeight: 400,
          fontSize: 44, color: "#D9B48A", letterSpacing: "10px", marginTop: 12,
          textShadow: "0 2px 16px rgba(0,0,0,0.95)",
        }}>{t.sub}</div>
      </div>
    </AbsoluteFill>
  );
};

const FinalTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const sf = 28.5 * FPS;
  if (frame < sf - 6) return null;
  const p = Math.min(1, (frame - sf) / (FPS * 1.2));
  const ease = 1 - Math.pow(1 - p, 3);
  const mainScale = interpolate(ease, [0, 1], [2.2, 1]);
  const mainOp = interpolate(ease, [0, 0.3, 1], [0, 1, 1]);
  const subOp = interpolate(frame - sf, [FPS * 1.0, FPS * 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tagOp = interpolate(frame - sf, [FPS * 1.5, FPS * 2.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "rgba(0,0,0,0.75)", justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "Oswald, sans-serif", fontWeight: 700,
          fontSize: 260, color: "#F5EEDC", letterSpacing: "24px",
          transform: `scale(${mainScale})`, opacity: mainOp,
          textShadow: "0 8px 48px rgba(0,0,0,1)",
        }}>XE ÔM</div>
        <div style={{
          fontFamily: "Oswald, sans-serif", fontWeight: 400,
          fontSize: 58, color: "#D9B48A", letterSpacing: "14px",
          opacity: subOp, marginTop: 8,
        }}>THE LAST RIDE</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 400,
          fontSize: 36, color: "#BFB6A4", marginTop: 48,
          opacity: tagOp, letterSpacing: "2px",
        }}>một cuốc xe — một lần cuối — không đường lui</div>
      </div>
    </AbsoluteFill>
  );
};

// Subtle film grain overlay via animated noise pattern
const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = frame * 23;
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.5) 100%)",
      mixBlendMode: "multiply",
    }} />
  );
};

// Narration voice subtitles (timed, short flashes)
type NarSub = { tin: number; tout: number; text: string };
const NARS: NarSub[] = [
  { tin: 0.3,  tout: 3.5, text: "Anh ta từng là lính đặc nhiệm..." },
  { tin: 3.9,  tout: 6.8, text: "Giờ anh ta chạy xe ôm cho ứng dụng." },
  { tin: 13.5, tout: 18.0, text: "Để cứu đứa con gái mười lăm tuổi..." },
  { tin: 18.2, tout: 22.0, text: "Anh ta phải quay lại... làm người anh đã từng là." },
];

const NarCaption: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const active = NARS.find((n) => t >= n.tin - 0.1 && t < n.tout + 0.3);
  if (!active) return null;
  const sp = spring({ frame: frame - active.tin * FPS, fps: FPS, config: { damping: 18, stiffness: 220 } });
  const fadeOut = interpolate(frame, [active.tout * FPS - 5, active.tout * FPS + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(sp, fadeOut);
  return (
    <div style={{
      position: "absolute", bottom: 260, left: 0, right: 0,
      textAlign: "center", padding: "0 80px",
      opacity, transform: `translateY(${interpolate(sp, [0, 1], [10, 0])}px)`,
    }}>
      <div style={{
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600,
        fontSize: 44, color: "#F3E4C9", letterSpacing: "0.5px", lineHeight: 1.3,
        textShadow: "0 2px 18px rgba(0,0,0,0.98), 0 0 6px rgba(0,0,0,0.7)",
      }}>{active.text}</div>
    </div>
  );
};

export const TrailerXeOm: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SCENES.map((s) => <SceneLayer key={s.id} s={s} />)}
    <CutFlash />
    <FilmGrain />
    {TITLES.map((t, i) => <TitleCard key={i} t={t} />)}
    <NarCaption />
    <FinalTitle />
    <Audio src={staticFile("xe_om/narration_full.mp3")} volume={1.0} />
    <Audio src={staticFile("bh_music.mp3")} volume={0.28} />
  </AbsoluteFill>
);
