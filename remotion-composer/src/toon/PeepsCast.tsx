import React from "react";
import { AbsoluteFill } from "remotion";
import Peep from "react-peeps";
import { BG, INK } from "../whiteboard/shapes";

type PeepProps = React.ComponentProps<typeof Peep>;

const BOSS: PeepProps = { hair: "BaldTop", accessory: "GlassRoundThick", facialHair: "MoustacheThin", body: "BlazerBlackTee" };
const STAFF: PeepProps = { hair: "ShortMessy", body: "Hoodie" };

const ROWS: { title: string; base: PeepProps; shots: [string, PeepProps][] }[] = [
  {
    title: "SẾP",
    base: BOSS,
    shots: [
      ["nói: Calm ↔ Explaining", { face: "Calm" }],
      ["", { face: "Explaining" }],
      ["mặt lạnh: Serious", { face: "Serious" }],
      ["dụ dỗ: Cheeky", { face: "Cheeky", body: "Coffee" }],
      ["chỉ việc: PointingUp", { face: "Contempt", body: "PointingUp" }],
      ["khoanh tay", { face: "Suspicious", body: "ArmsCrossed" }],
    ],
  },
  {
    title: "NHÂN VIÊN",
    base: STAFF,
    shots: [
      ["né: Concerned", { face: "Concerned" }],
      ["sợ: ConcernedFear", { face: "ConcernedFear" }],
      ["hớn hở: SmileBig", { face: "SmileBig", body: "Whatever" }],
      ["cười lăn: SmileLol", { face: "SmileLol" }],
      ["sốc: Hectic", { face: "Hectic" }],
      ["đơ: Awe", { face: "Awe", body: "Paper" }],
    ],
  },
];

export const PeepsCast: React.FC = () => (
  <AbsoluteFill style={{ background: BG, padding: 30, gap: 24 }}>
    {ROWS.map((row) => (
      <div key={row.title}>
        <div style={{ color: "#E5B54C", fontFamily: "sans-serif", fontWeight: 800, fontSize: 34, marginBottom: 10 }}>{row.title}</div>
        <div style={{ display: "flex", gap: 14 }}>
          {row.shots.map(([label, props], i) => (
            <div key={i} style={{ width: 300 }}>
              <div style={{ width: 300, height: 340, background: "#F4EFE6", borderRadius: 16, overflow: "hidden" }}>
                <Peep style={{ width: 300, height: 340 }} strokeColor="#111" backgroundColor="#fff" {...row.base} {...props} />
              </div>
              <div style={{ color: INK, fontFamily: "sans-serif", fontSize: 22, marginTop: 6, height: 28 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </AbsoluteFill>
);
