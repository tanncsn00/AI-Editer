/**
 * DocGheDo — Fake BBC documentary "Ghế Nhựa Đỏ: Biểu tượng bị lãng quên".
 * 44s @ 30fps = 1320 frames. 10 SDXL documentary scenes cross-dissolving
 * between themselves + BBC-style lower-third talking-head titles.
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

loadBeVietnamPro("normal", { weights: ["400", "600", "700"], subsets: ["vietnamese", "latin"] });
loadPlayfair("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// Actual narration timings derived from concat durations (with 0.3s silence):
// N1 0.0-3.4 · N2 3.7-8.4 · N3 8.7-13.9 · N4 14.1-16.2 · N5 16.5-25.7
// N6 26.0-29.8 · N7 30.1-35.1 · N8 35.4-40.3 · N9 40.6-44.2

type Cut = { id: string; tin: number; tout: number; pan?: [number, number]; zoom?: [number, number] };
const CUTS: Cut[] = [
  { id: "D01", tin: 0.0,  tout: 4.0,  zoom: [1.04, 1.12], pan: [-0.02, 0.03] },   // archive
  { id: "D02", tin: 4.0,  tout: 9.0,  zoom: [1.06, 1.14], pan: [ 0.02, 0.00] },   // archival street bw
  { id: "D06", tin: 9.0,  tout: 12.8, zoom: [1.05, 1.10], pan: [-0.01, 0.00] },   // professor
  { id: "D03", tin: 12.8, tout: 14.0, zoom: [1.08, 1.15], pan: [ 0.00, 0.03] },   // aerial
  { id: "D04", tin: 14.0, tout: 16.5, zoom: [1.00, 1.18], pan: [ 0.00, 0.00] },   // chair hero
  { id: "D05", tin: 16.5, tout: 22.0, zoom: [1.05, 1.14], pan: [-0.02, 0.02] },   // factory archival
  { id: "D07", tin: 22.0, tout: 26.0, zoom: [1.05, 1.10], pan: [ 0.01, 0.00] },   // vendor interview
  { id: "D03", tin: 26.0, tout: 30.2, zoom: [1.06, 1.16], pan: [ 0.02, 0.00] },   // reuse aerial
  { id: "D08", tin: 30.2, tout: 35.4, zoom: [1.05, 1.10], pan: [-0.01, 0.00] },   // Oxford prof
  { id: "D09", tin: 35.4, tout: 40.6, zoom: [1.04, 1.16], pan: [ 0.00, 0.02] },   // warehouse
  { id: "D10", tin: 40.6, tout: 44.2, zoom: [1.06, 1.14], pan: [ 0.01, 0.03] },   // abandoned chair
];

type LowerThird = { tin: number; tout: number; name: string; role: string };
const LOWER_THIRDS: LowerThird[] = [
  { tin: 9.5,  tout: 12.5, name: "GS. TRẦN VĂN KHẢO",      role: "Viện Nghiên Cứu Văn Hóa Vỉa Hè" },
  { tin: 22.3, tout: 25.8, name: "BÀ NGUYỄN THỊ TÁM",      role: "Chủ Quán Cóc, Quận 5 — 42 năm" },
  { tin: 30.7, tout: 35.0, name: "DR. MICHAEL WELLINGTON",  role: "Anthropologist, Oxford University" },
];

// Subtitle captions synced to narrator
type Sub = { tin: number; tout: number; text: string };
const SUBS: Sub[] = [
  { tin: 0.3,  tout: 3.6, text: "Mỗi dân tộc đều có biểu tượng của riêng mình." },
  { tin: 3.8,  tout: 8.5, text: "Nhưng có một biểu tượng... mà người Việt chưa từng nhận ra." },
  { tin: 8.8,  tout: 14.0,text: "Nó xuất hiện ở mọi vỉa hè, mọi hàng quán, mọi góc phố." },
  { tin: 14.1, tout: 16.2,text: "Chiếc ghế nhựa đỏ." },
  { tin: 16.5, tout: 25.8,text: "Theo tài liệu không công bố, chiếc ghế đầu tiên ra đời năm 1978, tại một xưởng nhựa Chợ Lớn." },
  { tin: 26.0, tout: 30.0,text: "Không ai biết nguyên mẫu ghế đã thất lạc ở đâu." },
  { tin: 30.2, tout: 35.3,text: "Nhưng ngày nay, cứ bốn người Việt... thì có một chiếc ghế nhựa đỏ." },
  { tin: 35.5, tout: 40.5,text: "Có lẽ... chính chúng ta mới là những kẻ đang ngồi trên lịch sử." },
  { tin: 40.7, tout: 44.2,text: "Ghế Nhựa Đỏ. Biểu tượng bị lãng quên." },
];

const CutLayer: React.FC<{ c: Cut; key2: number }> = ({ c, key2 }) => {
  const frame = useCurrentFrame();
  const sf = c.tin * FPS;
  const ef = c.tout * FPS;
  const fade = 10;
  const opacity = interpolate(
    frame,
    [sf - fade, sf + fade, ef - fade, ef + fade],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (opacity <= 0) return null;
  const p = (frame - sf) / Math.max(1, ef - sf);
  const scale = interpolate(p, [0, 1], c.zoom ?? [1.05, 1.14]);
  const tx = interpolate(p, [0, 1], [0, (c.pan?.[0] ?? 0) * 90]);
  const ty = interpolate(p, [0, 1], [0, (c.pan?.[1] ?? 0) * 90]);
  // B-roll cool tone filter; interview shots get warmer filter
  const isInterview = c.id === "D06" || c.id === "D07" || c.id === "D08";
  const filter = isInterview
    ? "contrast(1.06) saturate(0.9) brightness(0.96) sepia(0.08)"
    : "contrast(1.1) saturate(0.78) brightness(0.93)";
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        width: "100%", height: "100%",
        transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
        filter,
      }}>
        <Img src={staticFile(`doc_ghe/${c.id}.png`)} style={{
          width: "100%", height: "100%", objectFit: "cover",
        }} />
      </div>
    </AbsoluteFill>
  );
};

// 16:9 cinematic letterbox bars (subtle)
const Letterbox: React.FC = () => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 100, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: "#000" }} />
  </>
);

// BBC-style lower third
const LowerThirdLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const active = LOWER_THIRDS.find((l) => t >= l.tin && t <= l.tout);
  if (!active) return null;
  const dur = active.tout - active.tin;
  const localT = t - active.tin;
  const enterP = Math.min(1, localT / 0.5);
  const exitP = Math.min(1, Math.max(0, (localT - (dur - 0.5)) / 0.5));
  const opacity = Math.min(enterP, 1 - exitP);
  const x = interpolate(enterP, [0, 1], [-60, 0]);
  return (
    <div style={{
      position: "absolute", left: 60, bottom: 240,
      opacity, transform: `translateX(${x}px)`,
    }}>
      <div style={{
        fontFamily: "Playfair Display, serif", fontWeight: 700,
        fontSize: 58, color: "#F6EFDC", letterSpacing: "0.5px",
        textShadow: "0 4px 18px rgba(0,0,0,0.95)",
        padding: "10px 24px",
        borderLeft: "6px solid #D9A048",
        background: "rgba(10,8,6,0.55)",
      }}>{active.name}</div>
      <div style={{
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 400,
        fontSize: 30, color: "#D9A048", letterSpacing: "1px",
        textShadow: "0 2px 12px rgba(0,0,0,0.95)",
        padding: "6px 24px", marginTop: 2,
        borderLeft: "6px solid #D9A048",
        background: "rgba(10,8,6,0.45)",
      }}>{active.role}</div>
    </div>
  );
};

// Subtitle at the bottom
const SubLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const active = SUBS.find((s) => t >= s.tin - 0.2 && t <= s.tout + 0.3);
  if (!active) return null;
  const enterP = Math.min(1, (t - active.tin) / 0.3);
  const exitP = Math.min(1, Math.max(0, (t - (active.tout - 0.2)) / 0.2));
  const opacity = Math.min(enterP, 1 - exitP);
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 150,
      textAlign: "center", padding: "0 80px", opacity,
    }}>
      <div style={{
        display: "inline-block",
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
        fontSize: 42, color: "#F6EFDC", lineHeight: 1.35, letterSpacing: "0.3px",
        textShadow: "0 2px 16px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,0.8)",
      }}>{active.text}</div>
    </div>
  );
};

// BBC logo top-left + doc tag
const Branding: React.FC = () => (
  <div style={{ position: "absolute", top: 130, left: 60 }}>
    <div style={{
      fontFamily: "Playfair Display, serif", fontWeight: 700,
      fontSize: 34, color: "#D9A048", letterSpacing: "3px",
      padding: "8px 18px",
      border: "2px solid #D9A048",
    }}>BBC · DOCUMENTARY</div>
    <div style={{
      fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 400,
      fontSize: 22, color: "#C6B69A", marginTop: 8, letterSpacing: "2px",
    }}>BIỂU TƯỢNG BỊ LÃNG QUÊN</div>
  </div>
);

// Opening title + closing title
const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  // Opening at 0-3s (fades out)
  const showOpen = t < 3.5;
  const openOp = interpolate(t, [0, 0.5, 3.0, 3.5], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Closing at 40-44s
  const showClose = t >= 40.5;
  const closeOp = interpolate(t, [40.5, 41.2, 44.0], [0, 1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      {showOpen && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: openOp, background: "rgba(0,0,0,0.25)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "Playfair Display, serif", fontWeight: 700,
              fontSize: 120, color: "#F6EFDC", letterSpacing: "8px",
              textShadow: "0 6px 24px rgba(0,0,0,0.95)",
            }}>GHẾ NHỰA ĐỎ</div>
            <div style={{
              fontFamily: "Playfair Display, serif", fontStyle: "italic",
              fontSize: 36, color: "#D9A048", marginTop: 12, letterSpacing: "4px",
            }}>biểu tượng bị lãng quên của một dân tộc</div>
            <div style={{
              fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 400,
              fontSize: 22, color: "#C6B69A", marginTop: 46, letterSpacing: "6px",
            }}>·  BBC DOCUMENTARY · 2026  ·</div>
          </div>
        </AbsoluteFill>
      )}
      {showClose && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: closeOp, background: "rgba(0,0,0,0.55)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "Playfair Display, serif", fontWeight: 700,
              fontSize: 110, color: "#F6EFDC", letterSpacing: "8px",
            }}>GHẾ NHỰA ĐỎ</div>
            <div style={{
              fontFamily: "Playfair Display, serif", fontStyle: "italic",
              fontSize: 34, color: "#D9A048", marginTop: 12, letterSpacing: "5px",
            }}>— còn tiếp —</div>
          </div>
        </AbsoluteFill>
      )}
    </>
  );
};

// Subtle film grain / vignette
const Vignette: React.FC = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 100%)",
  }} />
);

export const DocGheDo: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {CUTS.map((c, i) => <CutLayer key={`${c.id}-${i}`} c={c} key2={i} />)}
    <Vignette />
    <Letterbox />
    <TitleCard />
    <Branding />
    <LowerThirdLayer />
    <SubLayer />
    <Audio src={staticFile("doc_ghe/narration_full.mp3")} volume={1.0} />
    <Audio src={staticFile("bay_cuu_music.mp3")} volume={0.22} />
  </AbsoluteFill>
);
