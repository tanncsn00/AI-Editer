/**
 * TimelapseDoiNguoi — "60 giây một đời người". 62s @ 30fps = 1860 frames.
 * 13 SDXL scenes aging same character baby → 80, cross-dissolve transitions,
 * gentle Ken Burns, age counter, philosophical narration, piano music.
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
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

loadBeVietnamPro("normal", { weights: ["300", "400", "600", "700"], subsets: ["vietnamese", "latin"] });
loadPlayfair("normal", { weights: ["400", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

type Scene = { id: string; tin: number; tout: number; age: string };
const SCENES: Scene[] = [
  { id: "A01", tin: 0.0,  tout: 3.0,  age: "0" },
  { id: "A03", tin: 3.0,  tout: 8.0,  age: "1" },
  { id: "A05", tin: 8.0,  tout: 12.0, age: "5" },
  { id: "A10", tin: 12.0, tout: 16.0, age: "10" },
  { id: "A15", tin: 16.0, tout: 20.0, age: "15" },
  { id: "A20", tin: 20.0, tout: 26.0, age: "20" },
  { id: "A30", tin: 26.0, tout: 32.0, age: "30" },
  { id: "A40", tin: 32.0, tout: 37.0, age: "40" },
  { id: "A50", tin: 37.0, tout: 43.0, age: "50" },
  { id: "A60", tin: 43.0, tout: 48.0, age: "60" },
  { id: "A70", tin: 48.0, tout: 53.0, age: "70" },
  { id: "A80", tin: 53.0, tout: 58.0, age: "80" },
  { id: "A99", tin: 58.0, tout: 62.0, age: "∞" },
];

type Sub = { tin: number; tout: number; text: string };
const SUBS: Sub[] = [
  { tin: 1.0,  tout: 2.8,  text: "Một." },
  { tin: 3.0,  tout: 7.6,  text: "Ai cũng bắt đầu bằng tiếng khóc đầu tiên." },
  { tin: 8.0,  tout: 11.6, text: "Năm. Mẹ dạy ta gọi 'ba'." },
  { tin: 12.0, tout: 15.7, text: "Mười. Trường học, cặp sách, điểm mười." },
  { tin: 16.0, tout: 19.7, text: "Mười lăm. Giận cha mẹ vì một điều nhỏ nhặt." },
  { tin: 20.0, tout: 25.5, text: "Hai mươi. Yêu ai đó — lần đầu biết thế nào là mất." },
  { tin: 26.0, tout: 31.5, text: "Ba mươi. Con cái khóc đêm. Vợ ngủ quên." },
  { tin: 32.0, tout: 36.5, text: "Bốn mươi. Ta bắt đầu giống cha mình." },
  { tin: 37.0, tout: 42.5, text: "Năm mươi. Mẹ ra đi trong một buổi sáng rất thường." },
  { tin: 43.0, tout: 47.5, text: "Sáu mươi. Cháu gọi ta là 'ông'." },
  { tin: 48.0, tout: 52.5, text: "Bảy mươi. Bạn thân cuối cùng cũng rời đi." },
  { tin: 53.0, tout: 57.5, text: "Tám mươi. Ta ngồi nhìn hoàng hôn, không còn gì để nói." },
  { tin: 58.0, tout: 61.5, text: "Rồi một ngày — ta nhắm mắt lại." },
];

const SceneLayer: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const sf = s.tin * FPS;
  const ef = s.tout * FPS;
  const fade = 18; // long cross-dissolve for smoothness
  const opacity = interpolate(
    frame,
    [sf - fade, sf + fade, ef - fade, ef + fade],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (opacity <= 0) return null;
  const p = (frame - sf) / Math.max(1, ef - sf);
  const scale = interpolate(p, [0, 1], [1.04, 1.14]);
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        width: "100%", height: "100%",
        transform: `scale(${scale})`,
        filter: "contrast(1.05) saturate(0.85) brightness(0.95)",
      }}>
        <Img src={staticFile(`timelapse/${s.id}.png`)} style={{
          width: "100%", height: "100%", objectFit: "cover",
        }} />
      </div>
    </AbsoluteFill>
  );
};

const AgeCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const active = SCENES.find((s) => t >= s.tin && t < s.tout);
  if (!active) return null;
  const enterP = Math.min(1, (t - active.tin) / 0.4);
  return (
    <div style={{
      position: "absolute", top: 120, right: 70,
      textAlign: "right", opacity: enterP,
    }}>
      <div style={{
        fontFamily: "Playfair Display, serif", fontWeight: 700,
        fontSize: 160, color: "#F6EFDC", lineHeight: 1,
        textShadow: "0 6px 28px rgba(0,0,0,0.95)",
      }}>{active.age}</div>
      <div style={{
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 300,
        fontSize: 28, color: "#D9A048", letterSpacing: "6px", marginTop: -4,
        textShadow: "0 2px 12px rgba(0,0,0,0.95)",
      }}>TUỔI</div>
    </div>
  );
};

const SubLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const active = SUBS.find((s) => t >= s.tin - 0.2 && t <= s.tout + 0.3);
  if (!active) return null;
  const enterP = Math.min(1, (t - active.tin) / 0.4);
  const exitP = Math.min(1, Math.max(0, (t - (active.tout - 0.3)) / 0.3));
  const opacity = Math.min(enterP, 1 - exitP);
  const y = interpolate(enterP, [0, 1], [8, 0]);
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 280,
      textAlign: "center", padding: "0 90px",
      opacity, transform: `translateY(${y}px)`,
    }}>
      <div style={{
        display: "inline-block",
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
        fontSize: 46, color: "#F6EFDC", lineHeight: 1.35, letterSpacing: "0.3px",
        textShadow: "0 3px 18px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.8)",
      }}>{active.text}</div>
    </div>
  );
};

// Top + bottom letterbox for cinematic feel
const Letterbox: React.FC = () => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 110, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 110, background: "#000" }} />
  </>
);

const OpenTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t > 2.5) return null;
  const op = interpolate(t, [0, 0.5, 2.0, 2.5], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: op }}>
      <div style={{ textAlign: "center", background: "rgba(0,0,0,0.35)", padding: "40px 80px" }}>
        <div style={{
          fontFamily: "Playfair Display, serif", fontWeight: 700,
          fontSize: 180, color: "#F6EFDC", letterSpacing: "12px",
        }}>60 GIÂY</div>
        <div style={{
          fontFamily: "Playfair Display, serif", fontStyle: "italic",
          fontSize: 42, color: "#D9A048", marginTop: 12, letterSpacing: "6px",
        }}>một đời người</div>
      </div>
    </AbsoluteFill>
  );
};

const EndTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < 60.0) return null;
  const op = interpolate(t, [60.0, 60.7, 62.0], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: op, background: "rgba(0,0,0,0.55)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "Playfair Display, serif", fontStyle: "italic",
          fontSize: 60, color: "#F6EFDC", letterSpacing: "3px", lineHeight: 1.35,
        }}>
          Sáu mươi giây.<br />
          <span style={{ color: "#D9A048" }}>Một cuộc đời.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)",
  }} />
);

export const TimelapseDoiNguoi: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SCENES.map((s) => <SceneLayer key={s.id} s={s} />)}
    <Vignette />
    <Letterbox />
    <AgeCounter />
    <SubLayer />
    <OpenTitle />
    <EndTitle />
    <Audio src={staticFile("timelapse/narration_full.mp3")} volume={1.0} />
    <Audio src={staticFile("bh_music.mp3")} volume={0.30} />
  </AbsoluteFill>
);
