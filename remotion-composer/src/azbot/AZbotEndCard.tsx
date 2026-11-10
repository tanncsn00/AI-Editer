import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadBeVietnam } from "@remotion/google-fonts/BeVietnamPro";

loadAnton("normal", { weights: ["400"], subsets: ["vietnamese", "latin"] });
loadBeVietnam("normal", { weights: ["600", "800"], subsets: ["vietnamese", "latin"] });

const FPS = 30;
const DIR = "azbot-brand";
const ORANGE = "#FF8A00";
const PILL = "#FF7A00";
const STROKE = "#3B1D06";
const TITLE_FONT = "'Anton', Impact, sans-serif";
const UI_FONT = "'Be Vietnam Pro', system-ui, sans-serif";
const TAGLINE_WORDS = ["Không", "ai", "bán", "hàng", "một", "mình."];
const HIGHLIGHT = new Set(["một", "mình."]);
const LONG_CTA_CHARS = 28;

export const AZBOT_END_CARD_FRAMES = 90;

export type EndCardProps = { cta: string; keyword?: string; sting: boolean };

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const lerp = (v: number, a: number, b: number) => a + (b - a) * v;
const pop = (f: number, at: number) => spring({ frame: f - at, fps: FPS, config: { damping: 11, stiffness: 200, mass: 0.6 } });

export const AZbotEndCard: React.FC<EndCardProps> = ({ cta, keyword, sting }) => {
  const f = useCurrentFrame();
  const mascot = pop(f, 0);
  const bob = Math.sin(f / 9) * 10;
  const logo = interpolate(f, [6, 16], [100, 0], clamp);
  const pill = pop(f, 46);
  const arrow = Math.abs(Math.sin(f / 5)) * 18;
  return (
    <AbsoluteFill style={{ background: "#E4DDCC" }}>
      <Img src={staticFile(`${DIR}/paper.jpg`)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 700px 600px at 50% 36%, #FFB34733 0%, transparent 70%)" }} />
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 170, paddingBottom: 420 }}>
        <Img
          src={staticFile(`${DIR}/azbot_an_mung.png`)}
          style={{ width: 520, transform: `translateY(${bob + lerp(mascot, 260, 0)}px) scale(${lerp(mascot, 0.3, 1)}) rotate(${lerp(mascot, -14, 0)}deg)`, opacity: Math.min(1, mascot * 2), filter: "drop-shadow(0 26px 30px #5a3a1a40)" }}
        />
        <Img src={staticFile(`${DIR}/azbot_logo.png`)} style={{ width: 430, marginTop: 34, clipPath: `inset(0 ${logo}% 0 0)` }} />
        <div style={{ marginTop: 46, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 22px", maxWidth: 900 }}>
          {TAGLINE_WORDS.map((w, i) => {
            const v = pop(f, 18 + i * 4);
            const hi = HIGHLIGHT.has(w);
            return (
              <span
                key={i}
                style={{ display: "inline-block", fontFamily: TITLE_FONT, fontSize: 112, lineHeight: 1.08, color: hi ? ORANGE : "#FFF6E8", WebkitTextStroke: `13px ${STROKE}`, paintOrder: "stroke fill", textTransform: "uppercase", opacity: Math.min(1, v * 2), transform: `translateY(${lerp(v, 40, 0)}px) scale(${lerp(v, 1.4, 1)})` }}
              >
                {w}
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: 54, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: Math.min(1, pill * 2), transform: `scale(${lerp(pill, 0.6, 1)})` }}>
          <div style={{ background: PILL, borderRadius: 999, padding: "26px 54px", boxShadow: "0 12px 0 #B85500, 0 22px 34px #7a3c0040", fontFamily: UI_FONT, fontWeight: 800, fontSize: cta.length > LONG_CTA_CHARS ? 40 : 50, color: "#fff", textAlign: "center", maxWidth: 940, whiteSpace: "nowrap" }}>
            {cta}
          </div>
          {keyword ? (
            <div style={{ fontFamily: UI_FONT, fontWeight: 600, fontSize: 36, color: STROKE }}>
              Nhắn <span style={{ fontWeight: 800, color: "#fff", background: STROKE, borderRadius: 10, padding: "2px 14px" }}>{keyword}</span> cho mình
            </div>
          ) : null}
          <div style={{ fontSize: 64, transform: `translateY(${arrow}px)` }}>👇</div>
        </div>
      </AbsoluteFill>
      {sting ? <Audio src={staticFile("sfx/ui/iphone-ding.mp3")} volume={0.5} /> : null}
    </AbsoluteFill>
  );
};
