/**
 * PovBonCau — Pilot brand "Lời thú nhận của đồ vật".
 * Tập 1: POV bồn cầu nhà trọ, giọng Lê Đức, 62s @ 30fps.
 */

import {
  AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
loadBeVietnamPro("normal", { weights: ["300","400","500","600","700","800"], subsets: ["vietnamese","latin"] });
loadPlayfair("normal", { weights: ["400","700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

const BG = "#050405";

type Scene = { id: string; tin: number; tout: number; zoom?: [number, number]; pan?: [number, number] };
const SCENES: Scene[] = [
  { id: "S1", tin: 0.0,  tout: 4.5,  zoom: [1.04, 1.14], pan: [ 0.02,  0.03] },
  { id: "S2", tin: 4.5,  tout: 11.5, zoom: [1.06, 1.18], pan: [ 0.00,  0.04] },
  { id: "S3", tin: 11.5, tout: 17.5, zoom: [1.05, 1.14], pan: [-0.03,  0.02] },
  { id: "S4", tin: 17.5, tout: 23.5, zoom: [1.05, 1.16], pan: [ 0.03, -0.02] },
  { id: "S5", tin: 23.5, tout: 30.5, zoom: [1.08, 1.20], pan: [ 0.00,  0.00] },
  { id: "S6", tin: 30.5, tout: 40.0, zoom: [1.06, 1.18], pan: [-0.03,  0.03] },
  { id: "S7", tin: 40.0, tout: 48.5, zoom: [1.04, 1.14], pan: [ 0.02,  0.00] },
  { id: "S8", tin: 48.5, tout: 55.5, zoom: [1.06, 1.22], pan: [ 0.00, -0.02] },
  { id: "S9", tin: 55.5, tout: 62.0, zoom: [1.05, 1.18], pan: [ 0.03,  0.03] },
];

type Sub = { tin: number; tout: number; text: string; emph?: string[] };
const SUBS: Sub[] = [
  { tin: 0.5,  tout: 4.2,  text: "Tôi là cái bồn cầu. Nhà trọ tầng ba, ngõ 42.", emph: ["bồn", "cầu."] },
  { tin: 4.5,  tout: 11.0, text: "12 năm — tôi đứng im. Chứng kiến 27 chủ nhân đi qua đời mình.", emph: ["12", "năm", "27"] },
  { tin: 11.5, tout: 17.2, text: "Họ đến trong đau khổ. Họ đi trong nhẹ nhõm. Tôi ở giữa — nghe hết.", emph: ["đau", "khổ.", "nhẹ", "nhõm.", "nghe", "hết."] },
  { tin: 17.5, tout: 23.2, text: "Đêm qua, anh chủ mới ăn hủ tiếu cay tập 5. Ngồi trên tôi 47 phút.", emph: ["cay", "tập", "5.", "47", "phút."] },
  { tin: 23.5, tout: 30.2, text: "Đọc 3 chương truyện. Lướt hết Facebook. Gọi điện tâm sự với mẹ. Rồi khóc.", emph: ["khóc."] },
  { tin: 30.5, tout: 39.8, text: "Tháng trước, chị chủ 26 bị chia tay. Ngồi khóc trên tôi 2 tiếng. Tôi không biết an ủi sao — vì tôi là cái bồn cầu.", emph: ["chia", "tay.", "2", "tiếng.", "bồn", "cầu."] },
  { tin: 40.0, tout: 48.2, text: "Có lần — anh sinh viên năm nhất tập tỏ tình trong gương 34 lần. Cuối cùng không dám gọi.", emph: ["34", "lần.", "không", "dám", "gọi."] },
  { tin: 48.5, tout: 55.2, text: "Họ kể tôi nghe nhiều hơn kể bạn thân. Bí mật gì không dám nói — họ thú với tôi.", emph: ["bạn", "thân.", "bí", "mật", "thú"] },
  { tin: 55.5, tout: 62.0, text: "Người ta bỏ đi, tôi ở lại.   Liệu có phải — chính tôi mới là bạn thân của họ?", emph: ["bỏ", "đi,", "ở", "lại.", "bạn", "thân"] },
];

const SceneLayer: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const sf = s.tin * FPS;
  const ef = s.tout * FPS;
  const fade = 16;
  const opacity = interpolate(
    frame, [sf - fade, sf + fade, ef - fade, ef + fade],
    [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (opacity <= 0) return null;
  const p = (frame - sf) / Math.max(1, ef - sf);
  const scale = interpolate(p, [0, 1], s.zoom ?? [1.04, 1.14]);
  const tx = interpolate(p, [0, 1], [0, (s.pan?.[0] ?? 0) * 90]);
  const ty = interpolate(p, [0, 1], [0, (s.pan?.[1] ?? 0) * 90]);
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        width: "100%", height: "100%",
        transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
        filter: "contrast(1.15) saturate(0.75) brightness(0.85)",
      }}>
        <Img src={staticFile(`pov_boncau/${s.id}.png`)} style={{
          width: "100%", height: "100%", objectFit: "cover",
        }} />
      </div>
    </AbsoluteFill>
  );
};

const SubLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const active = SUBS.find((s) => t >= s.tin - 0.2 && t <= s.tout + 0.3);
  if (!active) return null;
  const enterP = Math.min(1, (t - active.tin) / 0.35);
  const exitP = Math.min(1, Math.max(0, (t - (active.tout - 0.3)) / 0.3));
  const opacity = Math.min(enterP, 1 - exitP);
  const y = interpolate(enterP, [0, 1], [14, 0]);
  const words = active.text.split(" ");
  const emphSet = new Set((active.emph ?? []).map((w) => w.toLowerCase()));
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 220,
      textAlign: "center", padding: "0 80px",
      opacity, transform: `translateY(${y}px)`,
    }}>
      <div style={{
        display: "inline-flex", flexWrap: "wrap", justifyContent: "center",
        gap: "0 12px", maxWidth: 960, lineHeight: 1.35,
      }}>
        {words.map((w, i) => {
          const emph = emphSet.has(w.toLowerCase());
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: emph ? 800 : 500,
              fontSize: emph ? 54 : 44,
              color: emph ? "#F5D98A" : "#F0EDE3",
              textShadow: emph
                ? "0 0 24px rgba(245,217,138,0.5), 0 4px 16px rgba(0,0,0,1)"
                : "0 3px 16px rgba(0,0,0,1)",
              letterSpacing: emph ? "0.6px" : "0",
            }}>{w}</span>
          );
        })}
      </div>
    </div>
  );
};

// Letterbox
const Letterbox: React.FC = () => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 110, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 110, background: "#000" }} />
  </>
);

// Opening card — brand identity
const OpenTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t > 3.0) return null;
  const op = interpolate(t, [0, 0.4, 2.5, 3.0], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{
      justifyContent: "center", alignItems: "center",
      opacity: op, background: "rgba(0,0,0,0.65)",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "Playfair Display, serif", fontStyle: "italic",
          fontSize: 34, color: "#F5D98A", letterSpacing: "10px",
          marginBottom: 16,
        }}>— LỜI THÚ NHẬN —</div>
        <div style={{
          fontFamily: "Playfair Display, serif", fontWeight: 700,
          fontSize: 96, color: "#F0EDE3", letterSpacing: "6px",
          lineHeight: 1.1,
        }}>TÔI LÀ<br /><span style={{ color: "#F5D98A" }}>CÁI BỒN CẦU</span></div>
        <div style={{
          marginTop: 24,
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 400,
          fontSize: 26, color: "#A89670", letterSpacing: "8px",
        }}>TẬP 01 · NHÀ TRỌ</div>
      </div>
    </AbsoluteFill>
  );
};

// Closing stinger — brand + next episode tease
const CloseCard: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < 60.0) return null;
  const op = interpolate(t, [60.0, 60.7, 62.0], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{
      justifyContent: "center", alignItems: "center",
      opacity: op, background: "rgba(0,0,0,0.75)",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "Playfair Display, serif", fontStyle: "italic",
          fontSize: 44, color: "#F5D98A", letterSpacing: "5px",
          marginBottom: 24,
        }}>Tập 02 tuần sau...</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600,
          fontSize: 58, color: "#F0EDE3", lineHeight: 1.25, letterSpacing: "1px",
        }}>"Tôi là cái nón bảo hiểm cưới<br />của chị chủ..."</div>
        <div style={{ marginTop: 60, fontSize: 32, color: "#8A8070",
          fontFamily: "'Be Vietnam Pro', sans-serif", letterSpacing: "6px" }}>@clawconfess</div>
      </div>
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
  }} />
);

// Channel brand badge top-left
const ChannelBadge: React.FC = () => (
  <div style={{
    position: "absolute", top: 130, left: 40,
    padding: "8px 18px",
    border: "1.5px solid #F5D98A",
    background: "rgba(0,0,0,0.5)",
  }}>
    <div style={{
      fontFamily: "Playfair Display, serif", fontStyle: "italic",
      fontSize: 22, color: "#F5D98A", letterSpacing: "4px",
    }}>lời thú nhận</div>
    <div style={{
      fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600,
      fontSize: 14, color: "#A89670", letterSpacing: "3px", marginTop: 2,
    }}>— của đồ vật —</div>
  </div>
);

export const PovBonCau: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    {SCENES.map((s) => <SceneLayer key={s.id} s={s} />)}
    <Vignette />
    <Letterbox />
    <ChannelBadge />
    <SubLayer />
    <OpenTitle />
    <CloseCard />
    <Audio src={staticFile("pov_boncau/narration_full.mp3")} volume={1.0} />
    <Audio src={staticFile("bh_music.mp3")} volume={0.18} />
  </AbsoluteFill>
);
