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

export const GiaTocThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0804" }}>
      <AbsoluteFill>
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: "scale(1.12)",
            filter: "brightness(0.38) saturate(0.75) contrast(1.12) sepia(0.18)",
          }}
        >
          <OffthreadVideo
            src={staticFile("gia_toc/hook_mountain_dawn.mp4")}
            muted
            startFrom={40}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 18%, rgba(0,0,0,0.90) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontSize: 32,
              fontWeight: 300,
              color: "#D4C5A8",
              letterSpacing: "10px",
              textTransform: "uppercase",
              marginBottom: 40,
              textShadow: "0 2px 10px rgba(0,0,0,0.95)",
            }}
          >
            Tập 3
          </div>

          <div
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 190,
              fontWeight: 500,
              color: "#F5F0E4",
              letterSpacing: "8px",
              lineHeight: 0.95,
              whiteSpace: "nowrap",
              textShadow:
                "0 0 50px rgba(255,245,220,0.2), 0 0 140px rgba(212,165,116,0.3), 0 10px 30px rgba(0,0,0,0.95)",
            }}
          >
            NGƯỜI
          </div>
          <div
            style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontSize: 140,
              fontWeight: 500,
              color: "#D4A574",
              letterSpacing: "8px",
              lineHeight: 1.0,
              marginTop: 10,
              fontStyle: "italic",
              textShadow:
                "0 0 40px rgba(212,165,116,0.45), 0 6px 20px rgba(0,0,0,0.95)",
              whiteSpace: "nowrap",
            }}
          >
            được chọn
          </div>

          <div
            style={{
              width: 140,
              height: 1,
              background: "rgba(245,240,228,0.55)",
              margin: "80px auto 42px auto",
            }}
          />

          <div
            style={{
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontSize: 42,
              fontWeight: 400,
              color: "#F5F0E4",
              lineHeight: 1.35,
              letterSpacing: "0.5px",
              textShadow: "0 3px 12px rgba(0,0,0,0.95)",
            }}
          >
            mỗi dòng họ có một người —
            <br />
            là bạn.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
