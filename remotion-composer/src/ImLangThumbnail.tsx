import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadEBGaramond("normal", { weights: ["400","500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadEBGaramond("italic", { weights: ["400","500"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["300","400","600"], subsets: ["vietnamese","latin","latin-ext"] });

export const ImLangThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#03060A" }}>
      <AbsoluteFill>
        <div style={{
          width: "100%", height: "100%",
          transform: "scale(1.14)",
          filter: "brightness(0.3) saturate(0.4) contrast(1.18)",
        }}>
          <OffthreadVideo src={staticFile("im_lang/lone_man_window_night.mp4")} muted startFrom={40} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 18%, rgba(0,0,0,0.92) 100%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: 240, fontWeight: 500,
            color: "#EEEEEA",
            letterSpacing: "18px",
            lineHeight: 0.95, whiteSpace: "nowrap",
            textShadow: "0 0 60px rgba(255,255,255,0.25), 0 0 160px rgba(192,204,212,0.35), 0 10px 30px rgba(0,0,0,0.95)",
          }}>IM.</div>
          <div style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: 64, fontWeight: 400,
            color: "#C0CCD4", letterSpacing: "4px",
            lineHeight: 1.2, marginTop: 28,
            fontStyle: "italic",
            textShadow: "0 0 30px rgba(192,204,212,0.4), 0 6px 20px rgba(0,0,0,0.95)",
          }}>kiên nhẫn công cộng<br/>tàn nhẫn riêng tư</div>
          <div style={{ width: 140, height: 1, background: "rgba(238,238,234,0.5)", margin: "72px auto 40px auto" }} />
          <div style={{
            fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
            fontSize: 42, fontWeight: 400,
            color: "#EEEEEA",
            lineHeight: 1.35, letterSpacing: "0.5px",
            textShadow: "0 3px 12px rgba(0,0,0,0.95)",
          }}>bạn đã kể —<br/>quá nhiều.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
