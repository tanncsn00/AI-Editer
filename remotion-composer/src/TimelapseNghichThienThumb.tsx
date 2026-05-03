/**
 * TimelapseNghichThienThumb — designed thumbnail for NGHỊCH THIÊN CẢI MỆNH.
 * 1080x1920 · 1 frame still. Hero face S09 (sát khí tĩnh lặng) + big gold
 * title + subtitle hook + faint ornament frame.
 */

import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadPlayfair("normal", { weights: ["400","700","800"], subsets: ["latin"] });
loadBeVietnamPro("normal", { weights: ["400","600","700","800"], subsets: ["vietnamese","latin"] });

const W = 1080;
const H = 1920;

export const TimelapseNghichThienThumb: React.FC = () => (
  <AbsoluteFill style={{ background: "#0A0706" }}>
    {/* Hero face */}
    <div style={{
      position: "absolute", inset: 0,
      transform: "scale(1.18) translate(20px, -30px)",
      filter: "contrast(1.15) saturate(0.8) brightness(0.8)",
    }}>
      <Img src={staticFile("nghichthien/S09.png")} style={{
        width: "100%", height: "100%", objectFit: "cover",
      }} />
    </div>

    {/* Dark gradient bottom */}
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 40%, rgba(10,7,6,0.9) 72%, rgba(10,7,6,1) 100%)",
    }} />

    {/* Dark gradient top */}
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 360,
      background: "linear-gradient(to bottom, rgba(10,7,6,0.85), rgba(10,7,6,0))",
    }} />

    {/* Top hook */}
    <div style={{
      position: "absolute", top: 120, left: 0, right: 0,
      textAlign: "center",
    }}>
      <div style={{
        display: "inline-block",
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
        fontSize: 30, color: "#E8B54F",
        letterSpacing: "6px",
        padding: "10px 22px",
        border: "2px solid #E8B54F",
      }}>BÍ MẬT 3 ĐỜI GIA TỘC</div>
      <div style={{
        fontFamily: "Playfair Display, serif", fontStyle: "italic",
        fontSize: 36, color: "#F6EFDC", marginTop: 18,
        letterSpacing: "4px",
        textShadow: "0 3px 16px rgba(0,0,0,1)",
      }}>— một kẻ lật ván cờ —</div>
    </div>

    {/* Big title */}
    <div style={{
      position: "absolute", bottom: 360, left: 0, right: 0,
      textAlign: "center",
    }}>
      <div style={{
        fontFamily: "Playfair Display, serif", fontWeight: 800,
        fontSize: 170, color: "#F6EFDC",
        letterSpacing: "6px", lineHeight: 1,
        textShadow: "0 8px 28px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.9)",
      }}>NGHỊCH<br />THIÊN</div>
      <div style={{
        fontFamily: "Playfair Display, serif", fontWeight: 800,
        fontSize: 140, color: "#E8B54F",
        letterSpacing: "10px", lineHeight: 1.05, marginTop: 10,
        textShadow: "0 0 48px rgba(232,181,79,0.55), 0 6px 24px rgba(0,0,0,1)",
      }}>CẢI MỆNH</div>
    </div>

    {/* Gold ornament line */}
    <div style={{
      position: "absolute", bottom: 300, left: "50%", transform: "translateX(-50%)",
      width: 260, height: 2, background: "#E8B54F", opacity: 0.7,
    }} />
    <div style={{
      position: "absolute", bottom: 294, left: "50%", transform: "translateX(-50%)",
      width: 14, height: 14, background: "#E8B54F", borderRadius: "50%",
    }} />

    {/* Bottom CTA */}
    <div style={{
      position: "absolute", bottom: 180, left: 0, right: 0,
      textAlign: "center",
    }}>
      <div style={{
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600,
        fontSize: 44, color: "#F6EFDC",
        letterSpacing: "0.6px", lineHeight: 1.3,
        textShadow: "0 3px 18px rgba(0,0,0,1)",
      }}>Bạn có phải <span style={{ color: "#E8B54F" }}>kẻ được chọn</span> không?</div>
    </div>

    {/* Bottom handle */}
    <div style={{
      position: "absolute", bottom: 80, left: 0, right: 0,
      textAlign: "center",
    }}>
      <div style={{
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 400,
        fontSize: 26, color: "#A89670", letterSpacing: "8px",
      }}>@vibe.editing</div>
    </div>

    {/* Corner frame accents (gold ticks) */}
    <div style={{ position: "absolute", top: 60, left: 60, width: 40, height: 40,
      borderTop: "3px solid #E8B54F", borderLeft: "3px solid #E8B54F" }} />
    <div style={{ position: "absolute", top: 60, right: 60, width: 40, height: 40,
      borderTop: "3px solid #E8B54F", borderRight: "3px solid #E8B54F" }} />
    <div style={{ position: "absolute", bottom: 60, left: 60, width: 40, height: 40,
      borderBottom: "3px solid #E8B54F", borderLeft: "3px solid #E8B54F" }} />
    <div style={{ position: "absolute", bottom: 60, right: 60, width: 40, height: 40,
      borderBottom: "3px solid #E8B54F", borderRight: "3px solid #E8B54F" }} />
  </AbsoluteFill>
);
