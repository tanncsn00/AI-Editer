/**
 * PovBonCauV2 — Lời Thú Nhận Tập 01 v2.
 * Setting: bồn cầu nhà vệ sinh công cộng bến xe Miền Đông.
 * Arc: rant chửi rủa 0-50s → turn quiet 50-58s → lesson 58-85s.
 */

import {
  AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
loadBeVietnamPro("normal", { weights: ["300","400","500","600","700","800","900"], subsets: ["vietnamese","latin"] });
loadPlayfair("normal", { weights: ["400","700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;
const BG = "#050505";

type Scene = { id: string; tin: number; tout: number; zoom?: [number, number]; pan?: [number, number]; rage?: boolean };
const SCENES: Scene[] = [
  { id: "S1",  tin: 0.0,  tout: 6.2,  zoom: [1.05, 1.14], pan: [0, 0.03] },
  { id: "S2",  tin: 6.2,  tout: 13.5, zoom: [1.06, 1.18], pan: [0.02, 0.02], rage: true },
  { id: "S3",  tin: 13.5, tout: 22.5, zoom: [1.05, 1.18], pan: [-0.03, 0.02], rage: true },
  { id: "S4",  tin: 22.5, tout: 31.5, zoom: [1.08, 1.22], pan: [0.02, 0], rage: true },
  { id: "S5",  tin: 31.5, tout: 41.0, zoom: [1.04, 1.16], pan: [-0.02, 0.03], rage: true },
  { id: "S6",  tin: 41.0, tout: 50.5, zoom: [1.05, 1.17], pan: [0.03, 0] },
  { id: "S7",  tin: 50.5, tout: 58.5, zoom: [1.05, 1.16], pan: [0, 0.02] },
  { id: "S8",  tin: 58.5, tout: 66.5, zoom: [1.07, 1.20], pan: [0, 0] },
  { id: "S9",  tin: 66.5, tout: 78.0, zoom: [1.04, 1.16], pan: [0, 0.02] },
  { id: "S10", tin: 78.0, tout: 85.0, zoom: [1.06, 1.14], pan: [0.01, 0.03] },
];

type Sub = { tin: number; tout: number; text: string; emph?: string[]; rage?: boolean };
const SUBS: Sub[] = [
  { tin: 0.3,  tout: 6.0,  text: "Tao là cái bồn cầu. Nhà vệ sinh công cộng — bến xe Miền Đông. 8 năm rồi... chưa một lần được tôn trọng.",
    emph: ["bồn", "cầu.", "công", "cộng", "tôn", "trọng."] },
  { tin: 6.2,  tout: 13.0, text: "Mỗi ngày 340 lượt! 340 lần chê thối! Nhưng không đứa nào chịu chùi!",
    emph: ["340", "lượt!", "340", "chê", "thối!", "chịu", "chùi!"], rage: true },
  { tin: 13.5, tout: 22.0, text: "Chúng mày ỉa cái gì mà thối như thuốc sinh học?! Ai ăn sầu riêng uống bia — đứng lên xưng tên đi!",
    emph: ["thối", "thuốc", "sinh", "học?!", "sầu", "riêng", "uống", "bia", "xưng", "tên"], rage: true },
  { tin: 22.5, tout: 31.0, text: "Sáng qua! Có thằng xả cả hoá đơn Shopee vào tao! Tao là bồn cầu — không phải MÁY XAY GIẤY đâu con!",
    emph: ["hoá", "đơn", "Shopee", "MÁY", "XAY", "GIẤY"], rage: true },
  { tin: 31.5, tout: 40.8, text: "Chiều qua — chị gái giật nguyên cuộn giấy vệ sinh vào lòng tao. 4 cục! Tắc ngay! Chửi như trả thù chồng!",
    emph: ["4", "cục!", "Tắc", "ngay!", "trả", "thù", "chồng!"], rage: true },
  { tin: 41.0, tout: 50.2, text: "Không ai lau. Không ai xả lại. Không ai khoá cửa. Tao sống giữa dư âm của đủ loại người Việt.",
    emph: ["Không", "ai", "dư", "âm", "người", "Việt."] },
  { tin: 50.5, tout: 58.2, text: "Tao giữ im 8 năm. Không gào. Không kiện... Vì tao là cái bồn cầu. Tao chỉ biết nuốt.",
    emph: ["giữ", "im", "8", "năm.", "nuốt."] },
  { tin: 58.5, tout: 66.2, text: "Nhưng nghe đây — cái bồn cầu công cộng... không phải mẹ chúng mày. Nó không dọn theo sau chúng mày đâu.",
    emph: ["mẹ", "chúng", "mày.", "không", "dọn", "theo", "sau"] },
  { tin: 66.5, tout: 77.5, text: "Thứ gì không thuộc về chúng mày — mới là thứ lộ ra chúng mày là ai. Người có ý thức: dùng xong sạch hơn lúc đến. Kẻ còn lại... tự nhìn lại mình.",
    emph: ["không", "thuộc", "về", "lộ", "ra", "chúng", "mày", "là", "ai.", "sạch", "hơn", "lúc", "đến.", "tự", "nhìn", "lại", "mình."] },
  { tin: 78.0, tout: 84.8, text: "Tao là cái bồn cầu công cộng. 8 năm rồi... vẫn chờ một lần, gặp người biết tôn trọng.",
    emph: ["một", "lần,", "tôn", "trọng."] },
];

const SceneLayer: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const sf = s.tin * FPS;
  const ef = s.tout * FPS;
  // Hard snap cuts — 3-frame in/out so scenes don't "pause" at boundaries
  const fade = 3;
  const opacity = interpolate(
    frame, [sf, sf + fade, ef - fade, ef],
    [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (opacity <= 0) return null;
  const p = (frame - sf) / Math.max(1, ef - sf);
  const scale = interpolate(p, [0, 1], s.zoom ?? [1.05, 1.14]);
  const tx = interpolate(p, [0, 1], [0, (s.pan?.[0] ?? 0) * 90]);
  const ty = interpolate(p, [0, 1], [0, (s.pan?.[1] ?? 0) * 90]);
  // Rage shake for angry segments
  let shakeX = 0, shakeY = 0;
  if (s.rage) {
    shakeX = Math.sin(frame * 0.7) * 3 + Math.sin(frame * 1.3) * 2;
    shakeY = Math.cos(frame * 0.9) * 2;
  }
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        width: "100%", height: "100%",
        transform: `scale(${scale}) translate(${tx + shakeX}px, ${ty + shakeY}px)`,
        filter: s.rage
          ? "contrast(1.22) saturate(0.7) brightness(0.82) hue-rotate(-8deg)"
          : "contrast(1.12) saturate(0.78) brightness(0.88)",
      }}>
        <Img src={staticFile(`pov_boncau_v2/${s.id}.png`)} style={{
          width: "100%", height: "100%", objectFit: "cover",
        }} />
      </div>
    </AbsoluteFill>
  );
};

const SubLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const active = SUBS.find((s) => t >= s.tin - 0.15 && t <= s.tout + 0.25);
  if (!active) return null;
  const enterP = Math.min(1, (t - active.tin) / 0.28);
  const exitP = Math.min(1, Math.max(0, (t - (active.tout - 0.25)) / 0.25));
  const opacity = Math.min(enterP, 1 - exitP);
  const words = active.text.split(" ");
  const emphSet = new Set((active.emph ?? []).map((w) => w.toLowerCase()));
  const emphColor = active.rage ? "#FF4040" : "#F5D98A";
  const bodyColor = active.rage ? "#FFF2E0" : "#F0EDE3";
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 220,
      textAlign: "center", padding: "0 70px", opacity,
    }}>
      <div style={{
        display: "inline-flex", flexWrap: "wrap", justifyContent: "center",
        gap: "0 12px", maxWidth: 980, lineHeight: 1.3,
      }}>
        {words.map((w, i) => {
          const emph = emphSet.has(w.toLowerCase());
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: emph ? 900 : 500,
              fontSize: emph ? (active.rage ? 60 : 54) : 44,
              color: emph ? emphColor : bodyColor,
              textShadow: emph
                ? `0 0 24px ${emphColor}70, 0 4px 16px rgba(0,0,0,1)`
                : "0 3px 16px rgba(0,0,0,1)",
              letterSpacing: emph ? "0.6px" : "0",
              textTransform: emph && active.rage ? "uppercase" : undefined,
            }}>{w}</span>
          );
        })}
      </div>
    </div>
  );
};

const Letterbox: React.FC = () => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 110, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 110, background: "#000" }} />
  </>
);

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
          fontSize: 30, color: "#F5D98A", letterSpacing: "10px", marginBottom: 14,
        }}>— LỜI THÚ NHẬN —</div>
        <div style={{
          fontFamily: "Playfair Display, serif", fontWeight: 700,
          fontSize: 88, color: "#F0EDE3", letterSpacing: "5px", lineHeight: 1.1,
        }}>TÔI LÀ<br /><span style={{ color: "#F5D98A" }}>CÁI BỒN CẦU</span></div>
        <div style={{
          marginTop: 22,
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 400,
          fontSize: 24, color: "#A89670", letterSpacing: "6px",
        }}>TẬP 01 · NHÀ VỆ SINH CÔNG CỘNG</div>
      </div>
    </AbsoluteFill>
  );
};

const CloseCard: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < 82.0) return null;
  const op = interpolate(t, [82.0, 82.8, 85.0], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{
      justifyContent: "center", alignItems: "center",
      opacity: op, background: "rgba(0,0,0,0.78)",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "Playfair Display, serif", fontStyle: "italic",
          fontSize: 40, color: "#F5D98A", letterSpacing: "4px",
          marginBottom: 20,
        }}>Tập 02 tuần sau...</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600,
          fontSize: 52, color: "#F0EDE3", lineHeight: 1.25, letterSpacing: "1px",
        }}>"Tôi là chiếc ghế đỏ quán cóc — 10 năm,<br />chưa một lần được rửa sạch..."</div>
        <div style={{ marginTop: 50, fontSize: 28, color: "#8A8070",
          fontFamily: "'Be Vietnam Pro', sans-serif", letterSpacing: "6px" }}>@clawconfess</div>
      </div>
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.58) 100%)",
  }} />
);

// White flash at each cut for extra snap (3-frame burst)
const CutFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let strength = 0;
  for (const s of SCENES) {
    if (s.tin === 0) continue;
    const d = t - s.tin;
    if (d >= -0.03 && d < 0.12) strength = Math.max(strength, 1 - d / 0.12);
  }
  if (strength <= 0) return null;
  return <div style={{ position: "absolute", inset: 0, background: "#FFF", opacity: strength * 0.35, pointerEvents: "none" }} />;
};

const ChannelBadge: React.FC = () => (
  <div style={{
    position: "absolute", top: 130, left: 40,
    padding: "8px 16px",
    border: "1.5px solid #F5D98A",
    background: "rgba(0,0,0,0.55)",
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

export const PovBonCauV2: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    {SCENES.map((s) => <SceneLayer key={s.id} s={s} />)}
    <CutFlash />
    <Vignette />
    <Letterbox />
    <ChannelBadge />
    <SubLayer />
    <OpenTitle />
    <CloseCard />
    <Audio src={staticFile("pov_boncau_v2/narration_v2.mp3")} volume={1.0} />
    <Audio src={staticFile("bh_music.mp3")} volume={0.14} />
  </AbsoluteFill>
);
