import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadBeVietnamPro("normal", { weights: ["700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FONT = "'Be Vietnam Pro', 'Inter', system-ui, sans-serif";
const BG = "#0B0B10";
const ACCENT = "#7C6CFF";
const YELLOW = "#FFD43B";
const TEXT = "#F5F5F7";

export const AppFree60stechThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG, fontFamily: FONT }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 900px 800px at 50% 30%, " + ACCENT + "40 0%, transparent 65%)" }} />
    <div style={{ position: "absolute", top: 230, width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ fontWeight: 900, fontSize: 170, color: YELLOW, border: "14px solid " + YELLOW, borderRadius: 30, padding: "6px 46px", background: "rgba(11,11,16,0.9)", transform: "rotate(-5deg)", boxShadow: "0 0 100px " + YELLOW + "77", textShadow: "0 0 40px " + YELLOW + "99" }}>
        MIỄN PHÍ
      </div>
    </div>
    <div style={{ position: "absolute", top: 560, width: "100%", textAlign: "center", fontWeight: 800, fontSize: 72, color: TEXT, lineHeight: 1.15 }}>
      PowerPoint → video
      <br />
      có giọng đọc
    </div>
    <div style={{ position: "absolute", top: 800, left: 60, width: 960, height: 560, borderRadius: 28, overflow: "hidden", border: "4px solid " + ACCENT, boxShadow: "0 0 80px " + ACCENT + "66" }}>
      <Img src={staticFile("afs/img_result_tet.png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.15)" }} />
    </div>
    <div style={{ position: "absolute", top: 1440, width: "100%", textAlign: "center", fontWeight: 800, fontSize: 64, color: TEXT }}>
      Không cần ngồi dựng
    </div>
    <div style={{ position: "absolute", top: 1540, width: "100%", textAlign: "center", fontWeight: 700, fontSize: 44, color: ACCENT }}>60stech Studio</div>
  </AbsoluteFill>
);
