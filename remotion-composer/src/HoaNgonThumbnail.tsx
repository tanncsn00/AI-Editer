import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["500", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin"] });

const BG = "#08060E";
const HOA = "#A78BFF";
const NGON = "#F0B23C";
const TEXT = "#EDE8F5";
const MUTE = "#5F5876";
const RED = "#FF5470";

const Side: React.FC<{ c: string; icon: string; dao: string; who: string; want: string }> = ({ c, icon, dao, who, want }) => (
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
    <div style={{ fontSize: 118 }}>{icon}</div>
    <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 44, fontWeight: 900, color: c, letterSpacing: 1, whiteSpace: "nowrap" }}>{dao}</div>
    <div
      style={{
        fontFamily: "JetBrains Mono",
        fontSize: 26,
        fontWeight: 700,
        color: TEXT,
        letterSpacing: 2,
        border: "2px solid " + c + "66",
        background: c + "12",
        borderRadius: 12,
        padding: "8px 20px",
      }}
    >
      {who}
    </div>
    <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 32, fontWeight: 600, color: MUTE, textAlign: "center", lineHeight: 1.3, marginTop: 4 }}>{want}</div>
  </div>
);

export const HoaNgonThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill
      style={{
        backgroundImage: "linear-gradient(" + HOA + "10 1px, transparent 1px), linear-gradient(90deg, " + HOA + "10 1px, transparent 1px)",
        backgroundSize: "88px 88px",
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 720px 700px at 26% 44%, " + HOA + "26 0%, transparent 60%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 720px 700px at 74% 44%, " + NGON + "22 0%, transparent 60%)" }} />

    <AbsoluteFill style={{ padding: 54, display: "flex", flexDirection: "column", justifyContent: "center", gap: 44 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "JetBrains Mono", fontSize: 28, color: MUTE, letterSpacing: 8, marginBottom: 20 }}>TRUYỀN KỲ GIỚI IT</div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 92, fontWeight: 900, color: TEXT, lineHeight: 1.06, letterSpacing: -3 }}>
          ĐẠI CHIẾN
        </div>
        <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 70, fontWeight: 900, lineHeight: 1.12, letterSpacing: -2, whiteSpace: "nowrap" }}>
          <span style={{ color: HOA }}>HỌA TU</span> <span style={{ fontSize: 46, color: MUTE }}>vs</span> <span style={{ color: NGON }}>NGÔN TỪ TU</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <Side c={HOA} icon="🎨" dao="HỌA ĐẠO" who="DESIGNER" want={"muốn\nKHOẢNG TRẮNG"} />
        <div style={{ fontSize: 68, alignSelf: "center", paddingTop: 40 }}>⚔️</div>
        <Side c={NGON} icon="✍️" dao="NGÔN TỪ ĐẠO" who="CONTENT" want={"muốn\nNHỒI ĐỦ CHỮ"} />
      </div>

      <div
        style={{
          alignSelf: "center",
          padding: "24px 40px",
          borderRadius: 20,
          background: RED + "18",
          border: "3px solid " + RED,
          fontFamily: "Be Vietnam Pro",
          fontSize: 52,
          fontWeight: 900,
          color: RED,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        “CHỈ SỬA MỘT CHÚT THÔI.”
      </div>
    </AbsoluteFill>

    <div
      style={{
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "JetBrains Mono",
        fontSize: 24,
        color: MUTE,
        letterSpacing: 5,
        opacity: 0.6,
      }}
    >
      ĐỘ KIẾP CÙNG BẦN ĐẠO
    </div>
  </AbsoluteFill>
);
