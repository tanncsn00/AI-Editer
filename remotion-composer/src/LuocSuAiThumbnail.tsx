import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["500", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin"] });

const BG = "#080A11";
const GOLD = "#D9A94E";
const INK = "#6E9BD8";
const TEXT = "#F0E9DA";
const MUTE = "#5D6478";

const NODES: Array<[string, string, string]> = [
  ["30·11·2022", "ChatGPT mở một ô chat", GOLD],
  ["2024", "75% người đi làm đã dùng AI", TEXT],
  ["2025", "88% tổ chức đã nhập cuộc", TEXT],
];

const Node: React.FC<{ year: string; label: string; color: string; last: boolean }> = ({ year, label, color, last }) => (
  <div style={{ display: "flex", gap: 26, alignItems: "flex-start" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28 }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: color, boxShadow: "0 0 26px 6px " + color + "66" }} />
      {last ? null : <div style={{ width: 4, height: 104, background: "linear-gradient(180deg," + color + "99, " + GOLD + "33)" }} />}
    </div>
    <div style={{ marginTop: -10 }}>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 54, fontWeight: 700, color, letterSpacing: 1 }}>{year}</div>
      <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 44, fontWeight: 700, color: TEXT, marginTop: 6, opacity: 0.95 }}>{label}</div>
    </div>
  </div>
);

export const LuocSuAiThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(0deg, " + GOLD + "0C 1px, transparent 1px)", backgroundSize: "100% 92px" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 860px 720px at 50% 20%, " + GOLD + "26 0%, transparent 62%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 860px 700px at 50% 84%, " + INK + "1C 0%, transparent 62%)" }} />

    <AbsoluteFill style={{ padding: "72px 68px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 44 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 74, marginBottom: 26 }}>📜</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 132, fontWeight: 900, color: GOLD, lineHeight: 0.96, letterSpacing: -5 }}>
          LƯỢC SỬ AI
        </div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 50, fontWeight: 800, color: TEXT, lineHeight: 1.14, letterSpacing: -1, marginTop: 18 }}>
          THẾ GIỚI ĐÃ ĐỔI THẾ NÀO
          <br />
          TỪ NGÀY THIÊN CƠ XUẤT THẾ
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0, alignSelf: "center" }}>
        {NODES.map(([y, l, c], i) => (
          <Node key={y} year={y} label={l} color={c} last={i === NODES.length - 1} />
        ))}
      </div>

      <div
        style={{
          alignSelf: "center",
          textAlign: "center",
          fontFamily: "Be Vietnam Pro",
          fontSize: 46,
          fontWeight: 900,
          color: BG,
          background: GOLD,
          borderRadius: 28,
          padding: "22px 40px",
          lineHeight: 1.14,
          letterSpacing: -0.5,
        }}
      >
        ĐIỀU GÌ CÒN THỰC SỰ
        <br />
        THUỘC VỀ CON NGƯỜI?
      </div>
    </AbsoluteFill>

    <div
      style={{
        position: "absolute",
        bottom: 46,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "JetBrains Mono",
        fontSize: 24,
        color: MUTE,
        letterSpacing: 5,
        opacity: 0.7,
      }}
    >
      ĐỘ KIẾP CÙNG BẦN ĐẠO
    </div>
  </AbsoluteFill>
);
