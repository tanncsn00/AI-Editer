import { AbsoluteFill } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadEBGaramond("normal", { weights: ["500","600"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["400","600","800"], subsets: ["vietnamese","latin","latin-ext"] });

const GOLD = "#F4B860";
const IVORY = "#F5F5F0";
const DUSK = "#1B130A";
const SHADOW = "#0A0805";

export const DoiDungMuaThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: SHADOW }}>
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 50% 38%, ${DUSK} 0%, #0E0805 55%, ${SHADOW} 100%)`,
      }} />

      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at 75% 20%, rgba(244,184,96,0.22) 0%, rgba(244,184,96,0) 50%)",
      }} />

      {/* Top eyebrow */}
      <div style={{
        position: "absolute",
        top: 220,
        width: "100%",
        textAlign: "center",
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontWeight: 600,
        fontSize: 32,
        letterSpacing: "12px",
        color: GOLD,
        opacity: 0.8,
        textTransform: "uppercase",
      }}>chiêm nghiệm</div>

      <div style={{
        position: "absolute",
        top: 285,
        left: "50%",
        transform: "translateX(-50%)",
        width: 360,
        height: 1.5,
        background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
        opacity: 0.55,
      }} />

      {/* Hero MÙA */}
      <div style={{
        position: "absolute",
        top: 580,
        width: "100%",
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontWeight: 500,
          fontSize: 380,
          color: IVORY,
          letterSpacing: "26px",
          lineHeight: 0.95,
          textShadow: "0 0 60px rgba(244,184,96,0.35), 0 0 200px rgba(244,184,96,0.3), 0 14px 40px rgba(0,0,0,0.9)",
        }}>MÙA</div>
      </div>

      {/* Subtitle italic */}
      <div style={{
        position: "absolute",
        top: 1040,
        width: "100%",
        textAlign: "center",
        fontFamily: "'EB Garamond', Georgia, serif",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: 50,
        color: IVORY,
        opacity: 0.88,
        letterSpacing: "2px",
        textShadow: "0 4px 16px rgba(0,0,0,0.9)",
      }}>của đời người</div>

      {/* Hook question */}
      <div style={{
        position: "absolute",
        bottom: 320,
        left: "50%",
        transform: "translateX(-50%)",
        width: 880,
        textAlign: "center",
        fontFamily: "'Be Vietnam Pro', sans-serif",
        fontWeight: 800,
        fontSize: 56,
        color: GOLD,
        lineHeight: 1.2,
        letterSpacing: "0.5px",
        textShadow: "0 0 24px rgba(244,184,96,0.45), 0 4px 14px rgba(0,0,0,0.95)",
      }}>vì sao chăm chỉ thôi<br/>không đủ để giàu?</div>

      <div style={{
        position: "absolute",
        bottom: 230,
        left: "50%",
        transform: "translateX(-50%)",
        width: 220,
        height: 1.5,
        background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
        opacity: 0.7,
      }} />

      <div style={{
        position: "absolute",
        bottom: 165,
        width: "100%",
        textAlign: "center",
        fontFamily: "'EB Garamond', Georgia, serif",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: 34,
        color: IVORY,
        opacity: 0.7,
        letterSpacing: "3px",
      }}>cây không tự ép quả chín</div>

      <AbsoluteFill style={{
        background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.8) 100%)",
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};
