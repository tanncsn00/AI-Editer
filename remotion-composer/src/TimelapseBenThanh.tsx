/**
 * TimelapseBenThanh — 100 năm Chợ Bến Thành qua 12 mốc thời gian. 60s total.
 * Cross-dissolve cảnh, year counter lớn góc phải, map-pin "Saigon" trái,
 * subtitle caption dưới, nhạc phim tài liệu nền.
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

loadBeVietnamPro("normal", { weights: ["300","400","600","700"], subsets: ["vietnamese","latin"] });
loadPlayfair("normal", { weights: ["400","700"], subsets: ["latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

type Scene = { id: string; year: string; tin: number; tout: number };
const SCENES: Scene[] = [
  { id: "Y1914", year: "1914", tin: 0.0,  tout: 5.0  },
  { id: "Y1925", year: "1925", tin: 5.0,  tout: 9.8  },
  { id: "Y1935", year: "1935", tin: 9.8,  tout: 14.6 },
  { id: "Y1950", year: "1950", tin: 14.6, tout: 19.0 },
  { id: "Y1968", year: "1968", tin: 19.0, tout: 24.0 },
  { id: "Y1975", year: "1975", tin: 24.0, tout: 29.0 },
  { id: "Y1985", year: "1985", tin: 29.0, tout: 34.2 },
  { id: "Y1995", year: "1995", tin: 34.2, tout: 39.0 },
  { id: "Y2005", year: "2005", tin: 39.0, tout: 44.4 },
  { id: "Y2020", year: "2020", tin: 44.4, tout: 49.8 },
  { id: "Y2026", year: "2026", tin: 49.8, tout: 54.0 },
  { id: "Y2050", year: "—",    tin: 54.0, tout: 60.0 },
];

type Sub = { tin: number; tout: number; text: string };
const SUBS: Sub[] = [
  { tin: 0.4,  tout: 4.8,  text: "1914 · Người Pháp khánh thành chợ Bến Thành." },
  { tin: 5.0,  tout: 9.5,  text: "1925 · Xe kéo tay vẫn là phương tiện chính của Sài Gòn." },
  { tin: 9.8,  tout: 14.4, text: "1935 · Tháp đồng hồ trở thành biểu tượng của thành phố." },
  { tin: 14.6, tout: 18.8, text: "1950 · Những chiếc xe đạp đầu tiên xuất hiện." },
  { tin: 19.0, tout: 23.8, text: "1968 · Tết Mậu Thân. Sài Gòn chìm trong khói lửa." },
  { tin: 24.0, tout: 28.8, text: "1975 · Thành phố đổi tên. Cuộc sống tiếp diễn." },
  { tin: 29.0, tout: 34.0, text: "1985 · Đổi Mới. Hàng hóa bắt đầu quay lại kệ chợ." },
  { tin: 34.2, tout: 38.8, text: "1995 · Xe máy Nhật phủ kín con đường quanh chợ." },
  { tin: 39.0, tout: 44.2, text: "2005 · Du khách quốc tế xếp hàng chụp ảnh." },
  { tin: 44.4, tout: 49.6, text: "2020 · Đại dịch. Chợ vắng lặng lần đầu trong một thế kỷ." },
  { tin: 49.8, tout: 53.8, text: "2026 · Metro số 1 ngay trước cửa." },
  { tin: 54.2, tout: 59.5, text: "Tháp đồng hồ vẫn đếm từng giờ.  Người thay đổi — chợ ở lại." },
];

const SceneLayer: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const sf = s.tin * FPS;
  const ef = s.tout * FPS;
  const fade = 18;
  const opacity = interpolate(
    frame,
    [sf - fade, sf + fade, ef - fade, ef + fade],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (opacity <= 0) return null;
  const p = (frame - sf) / Math.max(1, ef - sf);
  const scale = interpolate(p, [0, 1], [1.04, 1.12]);
  const tx = interpolate(p, [0, 1], [0, (((sf / FPS) % 2) - 1) * 18]);
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        width: "100%", height: "100%",
        transform: `scale(${scale}) translate(${tx}px, 0)`,
        filter: "contrast(1.08) saturate(0.95) brightness(0.96)",
      }}>
        <Img src={staticFile(`benthanh/${s.id}.png`)} style={{
          width: "100%", height: "100%", objectFit: "cover",
        }} />
      </div>
    </AbsoluteFill>
  );
};

const YearCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const active = SCENES.find((s) => t >= s.tin && t < s.tout);
  if (!active) return null;
  const enterP = Math.min(1, (t - active.tin) / 0.5);
  return (
    <div style={{
      position: "absolute", top: 130, right: 60,
      textAlign: "right", opacity: enterP,
    }}>
      <div style={{
        fontFamily: "Playfair Display, serif", fontWeight: 700,
        fontSize: 130, color: "#F6EFDC", lineHeight: 1,
        textShadow: "0 6px 28px rgba(0,0,0,0.95)",
      }}>{active.year}</div>
      <div style={{
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 300,
        fontSize: 24, color: "#D9A048", letterSpacing: "8px", marginTop: -2,
        textShadow: "0 2px 12px rgba(0,0,0,0.95)",
      }}>SAIGON · NĂM</div>
    </div>
  );
};

const LocationBadge: React.FC = () => (
  <div style={{
    position: "absolute", top: 130, left: 60,
    padding: "10px 22px",
    border: "2px solid #D9A048",
    background: "rgba(0,0,0,0.45)",
  }}>
    <div style={{
      fontFamily: "Playfair Display, serif", fontWeight: 700,
      fontSize: 28, color: "#D9A048", letterSpacing: "4px",
    }}>◉ CHỢ BẾN THÀNH</div>
    <div style={{
      fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 400,
      fontSize: 18, color: "#C6B69A", marginTop: 4, letterSpacing: "2px",
    }}>10.7722°N, 106.6981°E</div>
  </div>
);

const SubLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const active = SUBS.find((s) => t >= s.tin - 0.2 && t <= s.tout + 0.3);
  if (!active) return null;
  const enterP = Math.min(1, (t - active.tin) / 0.4);
  const exitP = Math.min(1, Math.max(0, (t - (active.tout - 0.3)) / 0.3));
  const opacity = Math.min(enterP, 1 - exitP);
  const y = interpolate(enterP, [0, 1], [10, 0]);
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 240,
      textAlign: "center", padding: "0 90px",
      opacity, transform: `translateY(${y}px)`,
    }}>
      <div style={{
        display: "inline-block",
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
        fontSize: 44, color: "#F6EFDC", lineHeight: 1.35, letterSpacing: "0.3px",
        textShadow: "0 3px 18px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.9)",
      }}>{active.text}</div>
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
  if (t > 2.8) return null;
  const op = interpolate(t, [0, 0.5, 2.2, 2.8], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: op, background: "rgba(0,0,0,0.35)" }}>
      <div style={{ textAlign: "center", padding: "30px 60px" }}>
        <div style={{
          fontFamily: "Playfair Display, serif", fontWeight: 700,
          fontSize: 110, color: "#F6EFDC", letterSpacing: "8px",
        }}>CHỢ BẾN THÀNH</div>
        <div style={{
          fontFamily: "Playfair Display, serif", fontStyle: "italic",
          fontSize: 34, color: "#D9A048", marginTop: 14, letterSpacing: "5px",
        }}>một thế kỷ Sài Gòn qua một cái chợ</div>
      </div>
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.35) 100%)",
  }} />
);

export const TimelapseBenThanh: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SCENES.map((s) => <SceneLayer key={s.id} s={s} />)}
    <Vignette />
    <Letterbox />
    <LocationBadge />
    <YearCounter />
    <SubLayer />
    <OpenTitle />
    <Audio src={staticFile("benthanh/narration_full.mp3")} volume={1.0} />
    <Audio src={staticFile("bay_cuu_music.mp3")} volume={0.22} />
  </AbsoluteFill>
);
