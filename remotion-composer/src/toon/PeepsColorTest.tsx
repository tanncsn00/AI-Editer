import React from "react";
import { AbsoluteFill } from "remotion";
import Peep from "react-peeps";

export const PeepsColorTest: React.FC = () => (
  <AbsoluteFill style={{ background: "#F4EFE6", flexDirection: "row", gap: 20, padding: 20 }}>
    <Peep style={{ width: 400, height: 460 }} strokeColor="#111" backgroundColor="#F2C14E" hair="ShortMessy" face="Calm" body="Hoodie" />
    <Peep style={{ width: 400, height: 460 }} strokeColor="#111" backgroundColor="#3F5BA9" hair="BaldTop" face="Serious" body="BlazerBlackTee" accessory="GlassRoundThick" facialHair="MoustacheThin" />
    <Peep style={{ width: 400, height: 460 }} strokeColor="#111" backgroundColor="#E4574C" hair="Bun" face="Smile" body="Device" />
  </AbsoluteFill>
);
