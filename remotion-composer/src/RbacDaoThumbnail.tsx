import { AbsoluteFill } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

loadBeVietnamPro("normal", { weights: ["500", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });
loadJetBrains("normal", { weights: ["500", "700"], subsets: ["latin"] });

const BG = "#080B12";
const GOLD = "#E5B54C";
const CYAN = "#5AD1E8";
const RED = "#FF4D5E";
const TEXT = "#F2ECE0";
const MUTE = "#5A6478";

const Node: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <div
    style={{
      fontFamily: "Be Vietnam Pro",
      fontSize: 46,
      fontWeight: 800,
      color,
      border: "3px solid " + color + "66",
      background: color + "14",
      borderRadius: 999,
      padding: "14px 44px",
      letterSpacing: 0.5,
    }}
  >
    {label}
  </div>
);

export const RbacDaoThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(" + CYAN + "0E 1px, transparent 1px), linear-gradient(90deg, " + CYAN + "0E 1px, transparent 1px)",
        backgroundSize: "90px 90px",
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 740px at 50% 24%, " + GOLD + "26 0%, transparent 62%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 820px 740px at 50% 82%, " + RED + "18 0%, transparent 62%)" }} />

    <AbsoluteFill style={{ padding: 62, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 34 }}>
      <div style={{ fontSize: 74 }}>🏯</div>
      <div style={{ fontFamily: "JetBrains Mono", fontSize: 26, color: MUTE, letterSpacing: 8 }}>CODE ĐẠO</div>

      <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 132, fontWeight: 900, color: GOLD, lineHeight: 0.98, letterSpacing: -4, textAlign: "center" }}>
        RBAC
      </div>
      <div style={{ fontFamily: "Be Vietnam Pro", fontSize: 62, fontWeight: 900, color: TEXT, lineHeight: 1, letterSpacing: -1, marginTop: -18 }}>
        ĐẠO
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 14 }}>
        <Node label="User" color={TEXT} />
        <div style={{ fontSize: 34, color: MUTE, lineHeight: 0.7 }}>↓</div>
        <Node label="Role" color={GOLD} />
        <div style={{ fontSize: 34, color: MUTE, lineHeight: 0.7 }}>↓</div>
        <Node label="Permission" color={CYAN} />
      </div>

      <div
        style={{
          fontFamily: "JetBrains Mono",
          fontSize: 58,
          fontWeight: 700,
          color: RED,
          border: "3px solid " + RED,
          background: RED + "16",
          borderRadius: 16,
          padding: "16px 40px",
          marginTop: 10,
        }}
      >
        403 Forbidden
      </div>

      <div
        style={{
          fontFamily: "Be Vietnam Pro",
          fontSize: 38,
          fontWeight: 900,
          color: TEXT,
          border: "3px solid " + TEXT + "3D",
          borderRadius: 999,
          padding: "16px 38px",
          letterSpacing: 0.5,
          marginTop: 6,
        }}
      >
        PHÂN QUYỀN KIỂU TÔNG MÔN
      </div>
    </AbsoluteFill>

    <div
      style={{
        position: "absolute",
        bottom: 44,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: "JetBrains Mono",
        fontSize: 24,
        color: MUTE,
        letterSpacing: 5,
        opacity: 0.65,
      }}
    >
      ĐỘ KIẾP CÙNG BẦN ĐẠO
    </div>
  </AbsoluteFill>
);
