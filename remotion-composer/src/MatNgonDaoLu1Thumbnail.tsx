import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["500", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin"] });

const BG = "#0B0A12";
const GOLD = "#E5B54C";
const RED = "#FF4D5E";
const TEXT = "#F2ECE0";
const MUTE = "#6E6780";
const HER = "#2A2638";
const HIM = "#3B6FE0";

const Bubble: React.FC<{ mine?: boolean; children: React.ReactNode }> = ({ mine = false, children }) => (
  <div style={{ width: "100%", display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
    <div
      style={{
        fontFamily: "Be Vietnam Pro",
        fontSize: 62,
        fontWeight: 700,
        color: "#FFFFFF",
        background: mine ? HIM : HER,
        borderRadius: mine ? "40px 40px 10px 40px" : "40px 40px 40px 10px",
        padding: "26px 40px",
        maxWidth: 760,
        lineHeight: 1.2,
      }}
    >
      {children}
    </div>
  </div>
);

export const MatNgonDaoLu1Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(90deg, " + GOLD + "0C 2px, transparent 2px)", backgroundSize: "120px 100%" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 800px 720px at 50% 24%, " + GOLD + "24 0%, transparent 62%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 900px 800px at 50% 78%, " + RED + "2A 0%, transparent 62%)" }} />

    <AbsoluteFill style={{ padding: "0 70px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 40 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 27, color: GOLD, letterSpacing: 8, marginBottom: 18 }}>THIÊN CƠ MẬT NGÔN · ĐẠO LỮ</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 96, fontWeight: 900, color: TEXT, lineHeight: 1.04, letterSpacing: -3 }}>
          “EM KHÔNG SAO”
        </div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 54, fontWeight: 800, color: GOLD, marginTop: 14 }}>nghĩa thật là gì?</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26, background: "#15131F", border: "3px solid " + RED, borderRadius: 56, padding: "50px 44px", boxShadow: "0 0 90px " + RED + "44" }}>
        <Bubble>Em không sao.</Bubble>
        <Bubble mine>Ừ, vậy anh đi ngủ. 😴</Bubble>
      </div>

      <div style={{ textAlign: "center", fontFamily: "Be Vietnam Pro", fontSize: 108, fontWeight: 900, color: RED, lineHeight: 1.02, letterSpacing: -3, whiteSpace: "pre-line", textShadow: "0 0 60px " + RED + "66" }}>
        {"SAI LẦM\nCHÍ MẠNG ⚡"}
      </div>
    </AbsoluteFill>

    <div style={{ position: "absolute", bottom: 48, left: 0, right: 0, textAlign: "center", fontFamily: "JetBrains Mono", fontSize: 24, color: MUTE, letterSpacing: 5, opacity: 0.65 }}>
      ĐỘ KIẾP CÙNG BẦN ĐẠO
    </div>
  </AbsoluteFill>
);
