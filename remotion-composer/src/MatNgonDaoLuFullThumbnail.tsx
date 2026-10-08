import { AbsoluteFill } from "remotion";
import { BG, GOLD, JADE, RED, TEXT, MUTE } from "./MatNgonDaoLuKit";

const PHRASES: Array<[string, string]> = [
  ["📜", "“Em không sao.”"],
  ["🍜", "“Tùy anh.”"],
  ["🗿", "“Anh sắp tới rồi.”"],
  ["⏳", "“Anh thấy em có gì khác không?”"],
  ["⚡", "“Mình nói chuyện chút được không?”"],
];

export const MatNgonDaoLuFullThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(90deg, " + GOLD + "0C 2px, transparent 2px)", backgroundSize: "120px 100%" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 800px 720px at 50% 20%, " + GOLD + "26 0%, transparent 62%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 900px 800px at 50% 82%, " + RED + "22 0%, transparent 62%)" }} />

    <AbsoluteFill style={{ padding: "0 64px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 44 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 27, color: GOLD, letterSpacing: 8, marginBottom: 18 }}>THIÊN CƠ MẬT NGÔN · ĐẠO LỮ</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 128, fontWeight: 900, color: GOLD, lineHeight: 1.0, letterSpacing: -4, whiteSpace: "pre-line", textShadow: "0 0 60px " + GOLD + "55" }}>
          {"NGŨ ĐẠI\nMẬT NGÔN"}
        </div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 50, fontWeight: 800, color: TEXT, marginTop: 18 }}>của người yêu 💀</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, background: "#15131F", border: "3px solid " + RED + "AA", borderRadius: 48, padding: "40px 44px" }}>
        {PHRASES.map(([icon, t]) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ fontSize: 54 }}>{icon}</div>
            <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 46, fontWeight: 800, color: TEXT, lineHeight: 1.2 }}>{t}</div>
          </div>
        ))}
      </div>

      <div style={{ alignSelf: "center", fontFamily: "Be Vietnam Pro", fontSize: 44, fontWeight: 900, color: JADE, border: "3px solid " + JADE + "66", borderRadius: 999, padding: "20px 40px" }}>
        NGƯỜI YÊU BẠN DÙNG CÂU NÀO?
      </div>
    </AbsoluteFill>

    <div style={{ position: "absolute", bottom: 48, left: 0, right: 0, textAlign: "center", fontFamily: "JetBrains Mono", fontSize: 24, color: MUTE, letterSpacing: 5, opacity: 0.65 }}>
      ĐỘ KIẾP CÙNG BẦN ĐẠO
    </div>
  </AbsoluteFill>
);
