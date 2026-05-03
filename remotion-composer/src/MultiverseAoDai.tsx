/**
 * MultiverseAoDai — "6 VŨ TRỤ: Một cô gái, một chiếc xe đạp."
 * Visual flex: same concept rendered in 6 styles, beat-sync 30s.
 *
 * Transition between universes: split-second RGB glitch + white flash at
 * each cut. Style-name label fades in/out top-right. No narration.
 */

import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

loadBeVietnamPro("normal", { weights: ["400","600","700","800"], subsets: ["vietnamese","latin"] });
loadOswald("normal", { weights: ["400","700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

type Universe = { id: string; label: string; accent: string; tin: number; tout: number };
const UNIVERSES: Universe[] = [
  { id: "U1", label: "NEO SAIGON · 2099",  accent: "#22D3EE", tin: 0.0,  tout: 5.0  },
  { id: "U2", label: "VƯƠNG QUỐC · CỔ",    accent: "#E8B54F", tin: 5.0,  tout: 10.0 },
  { id: "U3", label: "THẾ GIỚI · GHIBLI",  accent: "#B5E3A8", tin: 10.0, tout: 15.0 },
  { id: "U4", label: "OÁN LINH",           accent: "#D94A4A", tin: 15.0, tout: 20.0 },
  { id: "U5", label: "8-BIT · VIỆT NAM",   accent: "#F5D142", tin: 20.0, tout: 25.0 },
  { id: "U6", label: "SÀI GÒN · 1940",     accent: "#EAEAEA", tin: 25.0, tout: 30.0 },
];

const UniverseLayer: React.FC<{ u: Universe }> = ({ u }) => {
  const frame = useCurrentFrame();
  const sf = u.tin * FPS;
  const ef = u.tout * FPS;
  // Hard cut with 2-frame flash in, 2-frame fade out
  if (frame < sf - 2 || frame > ef + 2) return null;
  const opacity = interpolate(frame, [sf, sf + 1, ef - 2, ef], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Ken Burns subtle per universe
  const p = (frame - sf) / Math.max(1, ef - sf);
  const scale = interpolate(p, [0, 1], [1.05, 1.15]);
  // Tiny sway per universe direction
  const seed = parseInt(u.id.slice(1));
  const tx = interpolate(p, [0, 1], [0, (seed % 2 ? 20 : -20)]);
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        width: "100%", height: "100%",
        transform: `scale(${scale}) translate(${tx}px, 0)`,
        filter: "contrast(1.08) saturate(1.05)",
      }}>
        <Img src={staticFile(`multiverse/${u.id}.png`)} style={{
          width: "100%", height: "100%", objectFit: "cover",
        }} />
      </div>
    </AbsoluteFill>
  );
};

// White flash + glitch RGB shift at each transition
const CutFX: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let flashStrength = 0;
  for (const u of UNIVERSES) {
    const dt = t - u.tin;
    if (dt >= -0.05 && dt < 0.22) {
      flashStrength = Math.max(flashStrength, 1 - dt / 0.22);
    }
  }
  if (flashStrength <= 0) return null;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: flashStrength * 0.9, mixBlendMode: "screen" }} />
    </>
  );
};

// RGB chromatic aberration bars at each cut
const RGBGlitch: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let active = false;
  for (const u of UNIVERSES) {
    const dt = t - u.tin;
    if (dt >= -0.05 && dt < 0.35) { active = true; break; }
  }
  if (!active) return null;
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => {
        const y = (Math.random() * H) | 0;
        return (
          <div key={i} style={{
            position: "absolute", top: y, left: 0, right: 0, height: 12 + (i * 7),
            background: i % 2 ? "rgba(255,50,80,0.35)" : "rgba(60,220,255,0.35)",
            mixBlendMode: "screen",
          }} />
        );
      })}
    </>
  );
};

const Label: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const active = UNIVERSES.find((u) => t >= u.tin && t < u.tout);
  if (!active) return null;
  const enterP = Math.min(1, (t - active.tin) / 0.5);
  const stayP = interpolate(t, [active.tin + 3.5, active.tin + 4.6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(enterP, stayP);
  const seed = parseInt(active.id.slice(1));
  return (
    <>
      {/* Corner cut ticks in accent color */}
      <div style={{ position: "absolute", top: 140, left: 50, width: 56, height: 56,
        borderTop: `4px solid ${active.accent}`, borderLeft: `4px solid ${active.accent}`, opacity }} />
      <div style={{ position: "absolute", top: 140, right: 50, width: 56, height: 56,
        borderTop: `4px solid ${active.accent}`, borderRight: `4px solid ${active.accent}`, opacity }} />
      <div style={{ position: "absolute", bottom: 140, left: 50, width: 56, height: 56,
        borderBottom: `4px solid ${active.accent}`, borderLeft: `4px solid ${active.accent}`, opacity }} />
      <div style={{ position: "absolute", bottom: 140, right: 50, width: 56, height: 56,
        borderBottom: `4px solid ${active.accent}`, borderRight: `4px solid ${active.accent}`, opacity }} />

      {/* Counter — universe N/6 */}
      <div style={{
        position: "absolute", top: 120, right: 140,
        textAlign: "right", opacity,
      }}>
        <div style={{
          fontFamily: "Oswald, sans-serif", fontWeight: 700,
          fontSize: 110, color: active.accent, lineHeight: 1, letterSpacing: "2px",
          textShadow: "0 6px 28px rgba(0,0,0,1)",
        }}>0{seed}<span style={{ color: "#FFF", fontSize: 46, opacity: 0.6 }}>/06</span></div>
      </div>

      {/* Label — big bottom title */}
      <div style={{
        position: "absolute", bottom: 180, left: 0, right: 0,
        textAlign: "center", opacity,
      }}>
        <div style={{
          fontFamily: "Oswald, sans-serif", fontWeight: 700,
          fontSize: 88, color: "#F6EFDC", letterSpacing: "8px",
          textShadow: `0 0 40px ${active.accent}aa, 0 6px 24px rgba(0,0,0,1)`,
          lineHeight: 1,
        }}>{active.label}</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 400,
          fontSize: 28, color: active.accent, letterSpacing: "10px", marginTop: 14,
          textShadow: "0 3px 16px rgba(0,0,0,1)",
        }}>◉ UNIVERSE {seed} / 6 ◉</div>
      </div>
    </>
  );
};

const OpenTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t > 2.8) return null;
  const op = interpolate(t, [0, 0.3, 2.2, 2.8], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: op, background: "rgba(0,0,0,0.6)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 400,
          fontSize: 34, color: "#C6B69A", letterSpacing: "12px", marginBottom: 18,
        }}>MỘT CÔ GÁI · MỘT CHIẾC XE ĐẠP</div>
        <div style={{
          fontFamily: "Oswald, sans-serif", fontWeight: 700,
          fontSize: 280, color: "#F6EFDC", letterSpacing: "16px", lineHeight: 1,
          textShadow: "0 0 60px rgba(232,181,79,0.5), 0 12px 40px rgba(0,0,0,1)",
        }}>6 VŨ TRỤ</div>
      </div>
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)",
  }} />
);

// Beat pulse bar bottom
const BeatBar: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const bpm = 120;
  const bps = bpm / 60;
  const beat = (t * bps) % 1;
  const pulse = 1 - Math.pow(beat, 1.5);
  const active = UNIVERSES.find((u) => t >= u.tin && t < u.tout);
  const color = active?.accent ?? "#F5D142";
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 112,
      height: 4, background: color, opacity: pulse * 0.85,
    }} />
  );
};

const Letterbox: React.FC = () => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 110, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 110, background: "#000" }} />
  </>
);

export const MultiverseAoDai: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {UNIVERSES.map((u) => <UniverseLayer key={u.id} u={u} />)}
    <Vignette />
    <Letterbox />
    <Label />
    <RGBGlitch />
    <CutFX />
    <OpenTitle />
    <BeatBar />
    <Audio src={staticFile("bay_cuu_music.mp3")} volume={0.55} />
  </AbsoluteFill>
);
