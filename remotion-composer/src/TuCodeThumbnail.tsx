import { AbsoluteFill } from "remotion";
import { loadFont as loadEBGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadEBGaramond("normal", { weights: ["400", "500", "600"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["400", "500"], subsets: ["latin"] });

const INK = "#04070A";
const JADE = "#4ADE80";
const PAPER = "#DCE8E0";
const FAINT = "#5C6F66";

export const TuCodeThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: INK }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 980px 900px at 50% 42%, #0B1218 0%, #04070A 68%)" }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 700px 560px at 50% 40%, ${JADE}14 0%, transparent 64%)` }} />

    <AbsoluteFill style={{ justifyContent: "flex-end" }}>
      <svg width={1080} height={720} viewBox="0 0 1080 720">
        <defs>
          <linearGradient id="tm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F6F45" stopOpacity={0.42} />
            <stop offset="100%" stopColor={INK} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d="M-40 440 L200 220 L380 380 L560 190 L760 400 L940 240 L1120 430 L1120 720 L-40 720 Z" fill="url(#tm)" />
      </svg>
    </AbsoluteFill>

    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 56, gap: 40 }}>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 30, color: JADE, letterSpacing: 9 }}>THƠ ĐẠO LÝ · GIỚI IT</div>

      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontFamily: "EB Garamond", fontSize: 82, fontWeight: 600, color: PAPER, whiteSpace: "nowrap", lineHeight: 1.24 }}>
          <span style={{ color: JADE, textShadow: `0 0 40px ${JADE}66` }}>Code</span> xanh phủ lối ngàn năm,
        </div>
        <div style={{ fontFamily: "EB Garamond", fontSize: 62, fontWeight: 400, color: PAPER, whiteSpace: "nowrap", opacity: 0.9 }}>
          Bóng hình đạo pháp âm thầm bước qua.
        </div>
      </div>

      <div style={{ width: 140, height: 2, background: `linear-gradient(90deg, transparent, ${JADE}77, transparent)` }} />

      <div style={{ fontFamily: "EB Garamond", fontSize: 76, fontWeight: 600, fontStyle: "italic", color: JADE, textShadow: `0 0 46px ${JADE}55` }}>
        Tu code há dễ...
      </div>
    </AbsoluteFill>

    <div
      style={{
        position: "absolute",
        bottom: 74,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "JetBrains Mono",
        fontSize: 24,
        color: FAINT,
        letterSpacing: 5,
        opacity: 0.6,
      }}
    >
      ĐỘ KIẾP CÙNG GIỚI IT
    </div>
  </AbsoluteFill>
);
