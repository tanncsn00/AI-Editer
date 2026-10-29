import React from "react";
import { AbsoluteFill } from "remotion";
import Peep, { BustPose, Face, Hair, SittingPose, StandingPose } from "react-peeps";
import { BG, INK } from "../whiteboard/shapes";

type Sheet = "faces" | "busts" | "bodies" | "hair";

const Cell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ width: 180, height: 230, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ width: 170, height: 190, background: "#F4EFE6", borderRadius: 12, overflow: "hidden" }}>{children}</div>
    <div style={{ color: INK, fontSize: 18, fontFamily: "sans-serif", marginTop: 4 }}>{label}</div>
  </div>
);

export const PeepsSheet: React.FC<{ sheet: Sheet }> = ({ sheet }) => {
  const peep = (props: Partial<React.ComponentProps<typeof Peep>>) => (
    <Peep style={{ width: 170, height: 190 }} strokeColor="#111" backgroundColor="#fff" hair="ShortMessy" face="Calm" body="Shirt" {...props} />
  );
  const cells =
    sheet === "faces"
      ? Object.keys(Face).map((f) => <Cell key={f} label={f}>{peep({ face: f as never, viewBox: { x: "200", y: "0", width: "700", height: "780" } })}</Cell>)
      : sheet === "busts"
        ? Object.keys(BustPose).map((b) => <Cell key={b} label={b}>{peep({ body: b as never })}</Cell>)
        : sheet === "hair"
          ? Object.keys(Hair).map((h) => <Cell key={h} label={h}>{peep({ hair: h as never, viewBox: { x: "100", y: "-80", width: "900", height: "900" } })}</Cell>)
          : [...Object.keys(StandingPose), ...Object.keys(SittingPose)].map((p) => (
              <Cell key={p} label={p}>{peep({ body: p as never, viewBox: { x: "-200", y: "-100", width: "1800", height: "2200" } })}</Cell>
            ));
  return (
    <AbsoluteFill style={{ background: BG, padding: 20, display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: 6 }}>
      {cells}
    </AbsoluteFill>
  );
};
