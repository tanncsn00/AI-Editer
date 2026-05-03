import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["400","600","800"], subsets: ["vietnamese","latin","latin-ext"] });

const W = 1080, H = 1920;
const EMPHASIS = "#F4B860";
const BODY = "#F5F5F0";

export const TinhDaoFB01Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <div style={{ width:"100%", height:"100%", filter:"brightness(0.32) saturate(0.5) contrast(1.16)" }}>
      <OffthreadVideo src={staticFile("tinhdao_fb01/cut4.mp4")} muted style={{ width:"100%", height:"100%", objectFit:"cover" }} />
    </div>
    <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.7) 100%)" }} />

    <AbsoluteFill style={{ justifyContent:"center", alignItems:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{
          fontFamily:"'Be Vietnam Pro', sans-serif",
          fontWeight: 600, fontSize: 38,
          color: BODY, opacity: 0.85,
          letterSpacing: "3px", textTransform: "uppercase",
          marginBottom: 24,
        }}>chỗ dựa vững nhất</div>
        <div style={{
          fontFamily:"'EB Garamond', Georgia, serif",
          fontWeight: 500, fontSize: 360,
          color: EMPHASIS,
          letterSpacing: "16px",
          textShadow: "0 0 60px rgba(244,184,96,0.5), 0 0 180px rgba(244,184,96,0.4), 0 10px 30px rgba(0,0,0,0.95)",
          lineHeight: 1,
        }}>TÂM.</div>
        <div style={{
          fontFamily:"'Be Vietnam Pro', sans-serif",
          fontWeight: 600, fontSize: 32,
          color: BODY, opacity: 0.7,
          marginTop: 36,
          maxWidth: 880, padding: "0 60px",
          lineHeight: 1.4,
        }}>"Dựa người người đổi thay lòng — chỗ dựa vững nhất là trong tâm mình."</div>
      </div>
    </AbsoluteFill>

    <div style={{
      position:"absolute", bottom: 60, left: 0, right: 0,
      textAlign:"center",
      fontFamily:"'Be Vietnam Pro', sans-serif",
      fontWeight: 700, fontSize: 22,
      color: EMPHASIS, opacity: 0.85,
      letterSpacing: "4px", textTransform: "uppercase",
    }}>tịnh đạo · suy ngẫm</div>
  </AbsoluteFill>
);
