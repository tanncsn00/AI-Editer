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

export const DanOngThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Background — car window rain frame */}
      <AbsoluteFill>
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: "scale(1.12)",
            filter: "brightness(0.32) saturate(0.5) contrast(1.14)",
          }}
        >
          <OffthreadVideo
            src={staticFile("dan_ong/hook_red_light.mp4")}
            muted
            startFrom={30}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </AbsoluteFill>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 18%, rgba(0,0,0,0.90) 100%)",
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
          {/* TẬP 2 label */}
          <div
            style={{
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontSize: 32,
              fontWeight: 300,
              color: "#B8C5CB",
              letterSpacing: "10px",
              textTransform: "uppercase",
              marginBottom: 42,
              textShadow: "0 2px 10px rgba(0,0,0,0.95)",
            }}
          >
            Tập 2
          </div>

          {/* ĐÀN ÔNG */}
          <div
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 200,
              fontWeight: 500,
              color: "#F5F5F0",
              letterSpacing: "10px",
              lineHeight: 0.95,
              whiteSpace: "nowrap",
              textShadow:
                "0 0 50px rgba(255,255,255,0.18), 0 0 140px rgba(165,181,188,0.28), 0 10px 30px rgba(0,0,0,0.95)",
            }}
          >
            ĐÀN ÔNG
          </div>

          {/* không khóc */}
          <div
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 120,
              fontWeight: 400,
              color: "#A5B5BC",
              letterSpacing: "8px",
              lineHeight: 1.0,
              marginTop: 18,
              fontStyle: "italic",
              textShadow:
                "0 0 30px rgba(165,181,188,0.4), 0 6px 20px rgba(0,0,0,0.95)",
            }}
          >
            không khóc?
          </div>

          {/* Divider */}
          <div
            style={{
              width: 140,
              height: 1,
              background: "rgba(245,245,240,0.5)",
              margin: "80px auto 42px auto",
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
            lần cuối cùng bạn khóc —
            <br />
            là khi nào?
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
