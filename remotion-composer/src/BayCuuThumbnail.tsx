import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadEBGaramond("normal", {
  weights: ["400", "500", "600"],
  subsets: ["vietnamese", "latin", "latin-ext"],
});
loadEBGaramond("italic", {
  weights: ["400", "500"],
  subsets: ["vietnamese", "latin", "latin-ext"],
});
loadBeVietnamPro("normal", {
  weights: ["300", "400", "600"],
  subsets: ["vietnamese", "latin", "latin-ext"],
});

export const BayCuuThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Background — winter forest still */}
      <AbsoluteFill>
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: "scale(1.1)",
            filter: "brightness(0.35) saturate(0.55) contrast(1.12)",
          }}
        >
          <OffthreadVideo
            src={staticFile("bay_cuu/winter_forest_dark.mp4")}
            muted
            startFrom={120}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </AbsoluteFill>

      {/* Radial vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 18%, rgba(0,0,0,0.88) 100%)",
        }}
      />

      {/* Title stack */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          {/* TẬP 1 label */}
          <div
            style={{
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontSize: 32,
              fontWeight: 300,
              color: "#C9C9C0",
              letterSpacing: "10px",
              textTransform: "uppercase",
              marginBottom: 40,
              textShadow: "0 2px 10px rgba(0,0,0,0.95)",
            }}
          >
            Tập 1
          </div>

          {/* BẦY CỪU */}
          <div
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 180,
              fontWeight: 500,
              color: "#F5F5F0",
              letterSpacing: "8px",
              lineHeight: 0.95,
              whiteSpace: "nowrap",
              textShadow:
                "0 0 50px rgba(255,255,255,0.18), 0 0 140px rgba(244,184,96,0.22), 0 10px 30px rgba(0,0,0,0.95)",
            }}
          >
            BẦY CỪU
          </div>

          {/* KHÔNG AI CHĂN */}
          <div
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 118,
              fontWeight: 400,
              color: "#F4B860",
              letterSpacing: "10px",
              lineHeight: 1.0,
              marginTop: 18,
              fontStyle: "italic",
              textShadow:
                "0 0 30px rgba(244,184,96,0.35), 0 6px 20px rgba(0,0,0,0.95)",
            }}
          >
            không ai chăn
          </div>

          {/* Thin divider */}
          <div
            style={{
              width: 140,
              height: 1,
              background: "rgba(245,245,240,0.55)",
              margin: "70px auto 40px auto",
            }}
          />

          {/* Hook question */}
          <div
            style={{
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontSize: 44,
              fontWeight: 400,
              color: "#F5F5F0",
              lineHeight: 1.35,
              letterSpacing: "0.5px",
              textShadow: "0 3px 12px rgba(0,0,0,0.95)",
            }}
          >
            6h30 sáng —
            <br />
            ai quyết định bạn dậy?
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
