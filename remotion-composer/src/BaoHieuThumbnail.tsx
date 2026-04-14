import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadEBGaramond("normal", { weights: ["500","700","800"], subsets: ["vietnamese","latin","latin-ext"] });
loadBeVietnamPro("normal", { weights: ["600","700","800"], subsets: ["vietnamese","latin","latin-ext"] });

const W = 1080;
const H = 1920;
const WARM = "#F5F5F0";
const DEEP = "#1A120B";
const GOLD = "#F4B860";

export const BaoHieuThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: DEEP }}>
      {/* BG image — old parent alone */}
      <Img
        src={staticFile("bh_thumb_bg.jpg")}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%", objectFit: "cover",
          filter: "saturate(0.7) contrast(1.1) brightness(0.55)",
        }}
      />

      {/* Top vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.85) 100%)",
      }} />

      {/* Divider */}
      <div style={{
        position: "absolute", top: 180, left: 0, right: 0,
        display: "flex", justifyContent: "center",
      }}>
        <div style={{ width: 280, height: 2, background: WARM, opacity: 0.4 }} />
      </div>

      {/* Big word */}
      <div style={{
        position: "absolute", top: "42%", left: 0, right: 0,
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 260, fontWeight: 800,
          color: GOLD, letterSpacing: 10, lineHeight: 1,
          textShadow: "0 0 40px rgba(232,168,96,0.55)",
        }}>
          BÁO
        </div>
        <div style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 260, fontWeight: 800,
          color: GOLD, letterSpacing: 10, lineHeight: 1,
          textShadow: "0 0 40px rgba(232,168,96,0.55)",
        }}>
          HIẾU
        </div>
      </div>

      {/* Bottom quote */}
      <div style={{
        position: "absolute", bottom: 180, left: 0, right: 0,
        display: "flex", justifyContent: "center",
      }}>
        <div style={{
          padding: "24px 50px",
          border: `3px dashed ${GOLD}`,
          borderRadius: 14,
          fontFamily: "'EB Garamond', serif",
          fontSize: 46, fontStyle: "italic",
          color: WARM,
          fontWeight: 600,
        }}>
          — khi còn có thể
        </div>
      </div>
    </AbsoluteFill>
  );
};
