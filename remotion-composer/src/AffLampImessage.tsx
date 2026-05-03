/**
 * AffLampImessage — iMessage thread style affiliate video.
 * 2 friends texting. Viewer reads over shoulder.
 * 38s @ 30fps = 1140 frames.
 */

import {
  AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, Sequence,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
loadBeVietnamPro("normal", { weights: ["400","500","600","700"], subsets: ["vietnamese","latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

type Msg =
  | { id: string; who: "you" | "them"; tin: number; typing: number; kind?: "text"; text: string }
  | { id: string; who: "you" | "them"; tin: number; typing: number; kind: "image"; image: string }
  | { id: string; who: "you" | "them"; tin: number; typing: number; kind: "voice_note"; dur: number }
  | { id: string; who: "you" | "them"; tin: number; typing: number; kind: "link";
      link_title: string; link_price: string; link_url: string; link_sold: string };

const MESSAGES: Msg[] = [
  { id: "M01", who: "them", tin: 0.5,  typing: 0.6, text: "Mày còn đọc sách đêm không đấy?" },
  { id: "M02", who: "you",  tin: 2.8,  typing: 0.8, text: "còn mà sao" },
  { id: "M03", who: "you",  tin: 4.3,  typing: 0.4, text: "mắt mỏi vcl 😭" },
  { id: "M04", who: "them", tin: 5.8,  typing: 1.0, text: "do cái đèn trần đấy m" },
  { id: "M05", who: "them", tin: 8.0,  typing: 1.2, text: "tao vứt 3 tháng rồi. Thay cái này" },
  { id: "M06", who: "them", tin: 10.8, typing: 0.4, kind: "image", image: "aff_lamp/product.png" },
  { id: "M07", who: "you",  tin: 13.4, typing: 0.6, text: "ê trông được đấy" },
  { id: "M08", who: "you",  tin: 14.7, typing: 0.4, text: "dùng sao?" },
  { id: "M09", who: "them", tin: 16.0, typing: 0.3, kind: "voice_note", dur: 5.94 },
  { id: "M10", who: "you",  tin: 23.0, typing: 0.6, text: "bao nhiêu vậy m" },
  { id: "M11", who: "them", tin: 24.8, typing: 0.4, text: "125k thôi" },
  { id: "M12", who: "them", tin: 26.0, typing: 1.0, text: "đang sale — hết bây giờ đừng trách tao 👀" },
  { id: "M13", who: "them", tin: 28.8, typing: 0.4, kind: "link",
    link_title: "Đèn LED kẹp bàn — sạc 1 lần / 1 tháng · 3 màu",
    link_price: "125.000₫",
    link_url: "s.shopee.vn/40cq2eNRfY",
    link_sold: "624 đã bán · ★4.6 · Freeship" },
  { id: "M14", who: "you",  tin: 31.5, typing: 0.7, text: "ok đã order 💅" },
  { id: "M15", who: "them", tin: 33.5, typing: 0.3, text: "haha auto 🤌" },
];

const COL_THEM = "#2C2C2E";    // dark grey received (dark mode iMessage)
const COL_YOU  = "#0A84FF";    // iMessage blue sent
const TXT_THEM = "#FFFFFF";
const TXT_YOU  = "#FFFFFF";
const BG       = "#000000";

// Header bar: contact avatar + name + time
const HeaderBar: React.FC = () => (
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0,
    paddingTop: 60, paddingBottom: 16,
    background: "#1C1C1E",
    display: "flex", flexDirection: "column", alignItems: "center",
    borderBottom: "1px solid #2C2C2E",
  }}>
    {/* Dynamic island placeholder */}
    <div style={{
      position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)",
      width: 180, height: 40, background: "#000", borderRadius: 20,
    }} />
    {/* Signal/battery icons at very top */}
    <div style={{
      position: "absolute", top: 22, left: 42,
      color: "#FFF", fontFamily: "'Be Vietnam Pro', sans-serif",
      fontSize: 30, fontWeight: 700,
    }}>22:47</div>
    <div style={{
      position: "absolute", top: 24, right: 42,
      color: "#FFF", display: "flex", alignItems: "center", gap: 10,
    }}>
      <div style={{ fontSize: 22 }}>● ● ● ●</div>
      <div style={{ fontSize: 22 }}>5G</div>
      <div style={{ width: 46, height: 20, border: "2px solid #FFF", borderRadius: 4, position: "relative" }}>
        <div style={{ position: "absolute", top: 2, left: 2, width: 32, height: 12, background: "#34C759" }} />
        <div style={{ position: "absolute", top: 6, right: -6, width: 4, height: 8, background: "#FFF", borderRadius: 1 }} />
      </div>
    </div>
    <div style={{ marginTop: 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{
        width: 110, height: 110, borderRadius: "50%",
        background: "linear-gradient(135deg, #FF6B9D 0%, #FFD86B 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
        fontSize: 56, color: "#FFF",
      }}>M</div>
      <div style={{
        marginTop: 10, color: "#FFF",
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700, fontSize: 38,
      }}>Mai 💅</div>
      <div style={{
        marginTop: 2, color: "#8E8E93",
        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 400, fontSize: 24,
      }}>iMessage</div>
    </div>
  </div>
);

const InputBar: React.FC = () => (
  <div style={{
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: "20px 28px 50px 28px",
    background: "#1C1C1E",
    display: "flex", alignItems: "center", gap: 14,
    borderTop: "1px solid #2C2C2E",
  }}>
    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#2C2C2E",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#0A84FF" }}>+</div>
    <div style={{
      flex: 1, height: 72, borderRadius: 36,
      background: "transparent", border: "2px solid #2C2C2E",
      display: "flex", alignItems: "center", paddingLeft: 26,
      color: "#8E8E93", fontFamily: "'Be Vietnam Pro', sans-serif",
      fontSize: 30,
    }}>iMessage</div>
    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#2C2C2E",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#0A84FF" }}>🎙</div>
  </div>
);

// ---------- BUBBLE ----------
type BubbleProps = {
  msg: Msg; y: number; visible: boolean; sinceAppear: number; frame: number;
};

const TypingDots: React.FC<{ side: "left" | "right" }> = ({ side }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{
      display: "inline-flex", gap: 8, alignItems: "center",
      padding: "18px 22px", borderRadius: 26,
      background: side === "left" ? COL_THEM : COL_YOU,
    }}>
      {[0, 1, 2].map((i) => {
        const p = (Math.sin((frame - i * 6) * 0.25) + 1) / 2;
        return <div key={i} style={{ width: 12, height: 12, borderRadius: "50%",
          background: "#8E8E93", opacity: 0.4 + p * 0.6 }} />;
      })}
    </div>
  );
};

const Bubble: React.FC<BubbleProps> = ({ msg, y, visible, sinceAppear, frame }) => {
  if (!visible) return null;
  const side: "left" | "right" = msg.who === "them" ? "left" : "right";
  const bg = side === "left" ? COL_THEM : COL_YOU;
  const fg = side === "left" ? TXT_THEM : TXT_YOU;

  // Spring entry animation
  const sp = spring({ frame: sinceAppear, fps: FPS, config: { damping: 14, stiffness: 260, mass: 0.5 } });
  const scale = interpolate(sp, [0, 1], [0.5, 1]);
  const offsetY = interpolate(sp, [0, 1], [40, 0]);

  const baseStyle: React.CSSProperties = {
    position: "absolute", top: y + offsetY,
    [side === "left" ? "left" : "right"]: 32, left: side === "left" ? 32 : undefined, right: side === "right" ? 32 : undefined,
    maxWidth: W - 180,
    opacity: sp,
    transform: `scale(${scale})`,
    transformOrigin: side === "left" ? "bottom left" : "bottom right",
  };

  const kind = (msg as any).kind ?? "text";

  if (kind === "text") {
    const m = msg as Extract<Msg, { kind?: "text" }>;
    return (
      <div style={baseStyle}>
        <div style={{
          background: bg, color: fg,
          padding: "18px 28px",
          borderRadius: 34,
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
          fontSize: 40, lineHeight: 1.35, letterSpacing: "-0.3px",
          wordBreak: "break-word",
        }}>{m.text}</div>
      </div>
    );
  }

  if (kind === "image") {
    const m = msg as Extract<Msg, { kind: "image" }>;
    return (
      <div style={baseStyle}>
        <div style={{
          width: 480, height: 480, borderRadius: 30,
          overflow: "hidden", background: "#FFF5DE",
          boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
        }}>
          <Img src={staticFile(m.image)} style={{
            width: "100%", height: "100%", objectFit: "cover",
          }} />
        </div>
      </div>
    );
  }

  if (kind === "voice_note") {
    const m = msg as Extract<Msg, { kind: "voice_note" }>;
    // Waveform that animates during playback
    const audioStart = msg.tin * FPS + 6; // 6f after appearance
    const audioFrame = frame - audioStart;
    const playing = audioFrame >= 0 && audioFrame < m.dur * FPS;
    const barCount = 26;
    const bars = Array.from({ length: barCount });
    return (
      <div style={baseStyle}>
        <div style={{
          background: bg, color: fg,
          padding: "18px 22px",
          borderRadius: 34,
          display: "flex", alignItems: "center", gap: 16,
          minWidth: 560,
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 34,
          }}>▶</div>
          <div style={{ flex: 1, height: 48, display: "flex", alignItems: "center", gap: 4 }}>
            {bars.map((_, i) => {
              // Progress bar fill based on audio playback
              const progress = playing ? Math.min(1, audioFrame / (m.dur * FPS)) : 0;
              const filled = (i / barCount) <= progress;
              // Waveform heights
              const heights = [14, 22, 38, 28, 18, 32, 42, 24, 16, 28, 36, 20, 14, 26, 40, 30, 18, 24, 34, 20, 14, 28, 36, 22, 18, 14];
              const h = heights[i % heights.length];
              const pulseScale = playing
                ? 1 + 0.3 * Math.sin((audioFrame + i * 3) * 0.4) * (filled ? 1 : 0.3)
                : 1;
              return (
                <div key={i} style={{
                  width: 5, height: h, borderRadius: 3,
                  background: filled ? "#FFF" : "rgba(255,255,255,0.35)",
                  transform: `scaleY(${pulseScale})`,
                }} />
              );
            })}
          </div>
          <div style={{
            fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
            fontSize: 26, color: "rgba(255,255,255,0.7)",
          }}>0:{String(Math.round(m.dur)).padStart(2,"0")}</div>
        </div>
        {/* Transcribed caption under voice note for mute viewers */}
        {playing && (
          <div style={{
            marginTop: 14, padding: "10px 18px",
            background: "rgba(255,255,255,0.08)", borderRadius: 16,
            border: "1px dashed rgba(255,255,255,0.25)",
            color: "#DDD",
            fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
            fontSize: 28, lineHeight: 1.35, fontStyle: "italic",
          }}>💬 "Mày, tao mắc cái đèn này lên đầu giường, đọc sách xong ngủ luôn, pin cả tuần mới sạc một lần. Cứu mắt tao thật."</div>
        )}
      </div>
    );
  }

  if (kind === "link") {
    const m = msg as Extract<Msg, { kind: "link" }>;
    return (
      <div style={baseStyle}>
        <div style={{
          width: 620,
          background: "#1C1C1E", color: "#FFF",
          borderRadius: 30, overflow: "hidden",
          border: "1px solid #3A3A3C",
        }}>
          {/* Top image area */}
          <div style={{
            height: 360, background: "#FFF5DE",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            <Img src={staticFile("aff_lamp/product.png")} style={{
              width: "85%", height: "85%", objectFit: "contain",
            }} />
            <div style={{
              position: "absolute", top: 16, left: 16,
              background: "#EE4D2D", color: "#FFF",
              padding: "6px 14px", borderRadius: 8,
              fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
              fontSize: 22, letterSpacing: "1px",
            }}>SHOPEE · SALE</div>
          </div>
          <div style={{ padding: "20px 26px" }}>
            <div style={{
              fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600,
              fontSize: 30, lineHeight: 1.35, color: "#FFF",
            }}>{m.link_title}</div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", gap: 14 }}>
              <div style={{
                fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800,
                fontSize: 50, color: "#FF6B35",
              }}>{m.link_price}</div>
              <div style={{
                fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 400,
                fontSize: 22, color: "#8E8E93", textDecoration: "line-through",
              }}>250.000₫</div>
            </div>
            <div style={{
              marginTop: 6,
              fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
              fontSize: 22, color: "#8E8E93",
            }}>{m.link_sold}</div>
            <div style={{
              marginTop: 14, padding: "14px 0",
              borderTop: "1px solid #2C2C2E",
              fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
              fontSize: 22, color: "#0A84FF",
            }}>🔗 {m.link_url}</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// ---------- MAIN ----------
export const AffLampImessage: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // Compute visible stack of bubbles + running Y offsets
  type RenderItem = { msg: Msg; visible: boolean; typingVisible: boolean; sinceAppear: number; estH: number };
  const items: RenderItem[] = [];
  for (const m of MESSAGES) {
    const appearAt = m.tin;
    const typingStart = appearAt - m.typing;
    const typingVisible = t >= typingStart && t < appearAt;
    const visible = t >= appearAt;
    const sinceAppear = Math.max(0, frame - appearAt * FPS);
    // Rough height estimate per type
    let estH = 110;
    const kind = (m as any).kind ?? "text";
    if (kind === "image") estH = 500;
    else if (kind === "voice_note") estH = 180;  // voice row only (caption bleed OK)
    else if (kind === "link") estH = 600;
    else {
      // Estimate text lines by chars
      const chars = (m as any).text?.length ?? 0;
      const lines = Math.max(1, Math.ceil(chars / 28));
      estH = 80 + lines * 58;
    }
    items.push({ msg: m, visible, typingVisible, sinceAppear, estH });
  }

  // Compute Y positions: stack bubbles from bottom up.
  // Newest at ~bottom-200px, older scroll up.
  const BOTTOM = H - 240;  // above input bar
  const GAP = 22;
  // Determine latest visible index
  let latestIdx = -1;
  for (let i = 0; i < items.length; i++) {
    if (items[i].visible) latestIdx = i;
  }
  // Position messages — anchor latest visible at bottom
  const ys: number[] = new Array(items.length).fill(0);
  let cursorY = BOTTOM;
  for (let i = latestIdx; i >= 0; i--) {
    const h = items[i].estH;
    ys[i] = cursorY - h;
    cursorY = ys[i] - GAP;
  }

  // Typing indicator for next-incoming message (before it's visible)
  let typingFor: RenderItem | null = null;
  for (const it of items) {
    if (it.typingVisible) typingFor = it;
  }

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* soft gradient bg for depth */}
      <div style={{ position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at top, #1A1A1C 0%, #000 80%)" }} />

      <HeaderBar />

      {/* Bubbles area */}
      {items.map((it, i) => (
        <Bubble key={it.msg.id} msg={it.msg} y={ys[i]}
          visible={it.visible} sinceAppear={it.sinceAppear} frame={frame} />
      ))}

      {/* Typing bubble for next message */}
      {typingFor && (
        <div style={{
          position: "absolute",
          [typingFor.msg.who === "them" ? "left" : "right"]: 32,
          bottom: 280,
          opacity: 0.85,
        }}>
          <TypingDots side={typingFor.msg.who === "them" ? "left" : "right"} />
        </div>
      )}

      <InputBar />

      {/* Voice note audio — starts at M09 appearance (16s in) + 0.2s micro-delay */}
      <Sequence from={Math.round(16.2 * FPS)}>
        <Audio src={staticFile("aff_lamp/voice_note.mp3")} volume={1.0} />
      </Sequence>
      <Audio src={staticFile("bh_music.mp3")} volume={0.12} />
    </AbsoluteFill>
  );
};
