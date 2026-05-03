/**
 * AffLampMessenger v2 — PIXEL-ACCURATE Facebook Messenger (dark mode).
 *
 * Story: "Sếp giao deadline 2h sáng — đèn cứu giữ việc"
 */

import {
  AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, Sequence,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
loadInter("normal", { weights: ["400","500","600","700"], subsets: ["vietnamese","latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

// === Messenger dark mode palette (exact values from FB Messenger Android/iOS 2026) ===
const BG          = "#0F0F0F";     // Chat bg (near-black)
const HEADER_BG   = "#0F0F0F";
const INPUT_BG    = "#0F0F0F";
const INPUT_FIELD = "#262729";     // Text field bg (lightened)
const BUBBLE_L    = "#303030";     // Received bubble
const BUBBLE_R    = "#0084FF";     // Facebook blue (sent)
const TXT_L       = "#E4E6EA";
const TXT_R       = "#FFFFFF";
const META        = "#8A8D91";     // Timestamps / Seen
const ACCENT_BLUE = "#0084FF";
const GREEN_DOT   = "#34C759";

// --- font stack Inter feels like FB's SF Pro/Roboto ---
const FF = "Inter, 'Helvetica Neue', Roboto, 'Segoe UI', system-ui, sans-serif";

// ================== Types ==================
type Base = { id: string; who: "me" | "mai"; tin: number; typing?: number; react?: string };
type Text = Base & { kind?: "text"; text: string };
type Img_ = Base & { kind: "image"; image: string };
type Voice = Base & { kind: "voice_note"; dur: number };
type Scn   = Base & { kind: "screenshot"; from: string; time: string; text: string };
type Link  = Base & { kind: "link"; title: string; price: string; url: string; sold: string };
type Divider = { id: string; kind: "divider"; tin: number; label: string };
type Msg = Text | Img_ | Voice | Scn | Link | Divider;

const MESSAGES: Msg[] = [
  { id: "01", who: "me",  tin: 0.5,  typing: 0.4, text: "mày" },
  { id: "02", who: "me",  tin: 1.5,  typing: 0.4, text: "TAO SẮP CHẾT 💀" },
  { id: "03", who: "mai", tin: 3.0,  typing: 1.0, text: "1h52 sáng mày gào cái gì" },
  { id: "04", who: "me",  tin: 5.3,  typing: 0.5, text: "sếp tao vừa nhắn" },
  { id: "05", who: "me",  tin: 6.6,  typing: 0.4, kind: "screenshot",
    from: "Anh Dũng — Sếp", time: "01:49",
    text: "Em — báo cáo quý 3 cần gửi Hội đồng trước 5h sáng. Gấp." },
  { id: "06", who: "mai", tin: 10.2, typing: 0.6, text: "LẬY CHÚA", react: "😱" },
  { id: "07", who: "me",  tin: 11.8, typing: 0.5, text: "và đèn phòng tao vừa cháy bóng" },
  { id: "08", who: "me",  tin: 13.2, typing: 0.4, text: "tao ngồi tối om 💀" },
  { id: "09", who: "mai", tin: 14.7, typing: 1.0, text: "cái đèn kẹp tao tặng mày sinh nhật còn không?" },
  { id: "10", who: "me",  tin: 16.8, typing: 0.4, text: "??? cái pin đó?" },
  { id: "11", who: "mai", tin: 18.2, typing: 0.3, kind: "voice_note", dur: 6.0 },
  { id: "12", who: "me",  tin: 24.8, typing: 0.3, text: "chờ" },
  { id: "13", who: "me",  tin: 25.7, typing: 1.5, text: "tìm thấy rồi 🥹" },
  { id: "14", who: "me",  tin: 27.9, typing: 0.3, kind: "image", image: "aff_lamp/product.png" },
  { id: "15", who: "mai", tin: 30.0, typing: 0.5, text: "=)) 3 tiếng còn lại. viết đi mày", react: "👍" },
  { id: "DIV", kind: "divider", tin: 32.0, label: "04:47 — 3 giờ sau" },
  { id: "16", who: "me",  tin: 33.5, typing: 0.4, text: "ĐÃ NỘP" },
  { id: "17", who: "me",  tin: 34.5, typing: 0.5, text: "sếp chấm 9/10 🥹🥹", react: "❤️" },
  { id: "18", who: "mai", tin: 36.0, typing: 0.8, text: "cái đèn 125k cứu mày 1 tháng lương đấy" },
  { id: "19", who: "me",  tin: 38.0, typing: 0.4, text: "link đâu tao share team" },
  { id: "20", who: "mai", tin: 39.5, typing: 0.3, kind: "link",
    title: "Đèn LED kẹp bàn D-Lighting · pin tích hợp · sạc 1 lần dùng 1 tháng",
    price: "125.000₫", url: "shopee.vn", sold: "624 đã bán · ★ 4.6" },
  { id: "21", who: "me",  tin: 42.0, typing: 0.4, text: "đã forward 8 ng rồi 💅" },
];

// ================== HEADER (Messenger exact) ==================
const Header: React.FC = () => (
  <>
    {/* Phone status bar (minimal — just time/battery, native Android style) */}
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 54,
      background: BG, zIndex: 10,
    }}>
      <div style={{
        position: "absolute", top: 18, left: 40,
        color: "#FFF", fontFamily: FF, fontSize: 22, fontWeight: 600,
      }}>1:52</div>
      <div style={{
        position: "absolute", top: 18, right: 30,
        color: "#FFF", display: "flex", alignItems: "center", gap: 8,
        fontFamily: FF, fontSize: 18, fontWeight: 500,
      }}>
        <span>●●●</span>
        <span>5G</span>
        <div style={{ width: 32, height: 14, border: "2px solid #FFF", borderRadius: 3, position: "relative" }}>
          <div style={{ position: "absolute", top: 1, left: 1, width: 22, height: 8, background: "#FFF" }} />
        </div>
      </div>
    </div>
    {/* Messenger header — 120px tall */}
    <div style={{
      position: "absolute", top: 54, left: 0, right: 0, height: 120,
      background: HEADER_BG,
      display: "flex", alignItems: "center", padding: "0 16px",
      zIndex: 10,
    }}>
      {/* Back chevron — thin blue (2.5px Messenger stroke) */}
      <div style={{
        width: 56, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="30" height="50" viewBox="0 0 24 40">
          <path d="M18 6 L8 20 L18 34" fill="none" stroke={ACCENT_BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* Avatar with active dot */}
      <div style={{ position: "relative", marginLeft: 4 }}>
        <div style={{
          width: 76, height: 76, borderRadius: "50%",
          background: "linear-gradient(135deg, #F06292 0%, #FFB74D 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: FF, fontWeight: 700, fontSize: 36, color: "#FFF",
        }}>M</div>
        <div style={{
          position: "absolute", right: 0, bottom: 0,
          width: 20, height: 20, borderRadius: "50%",
          background: GREEN_DOT, border: `3px solid ${HEADER_BG}`,
        }} />
      </div>
      {/* Name + active status */}
      <div style={{ marginLeft: 16, flex: 1 }}>
        <div style={{ color: "#FFF", fontFamily: FF, fontWeight: 600,
          fontSize: 36, letterSpacing: "-0.3px", lineHeight: 1.1 }}>Mai Trang</div>
        <div style={{ color: META, fontFamily: FF, fontWeight: 400,
          fontSize: 22, marginTop: 4 }}>Đang hoạt động</div>
      </div>
      {/* Right icons — outline call/video */}
      <svg width="46" height="46" viewBox="0 0 24 24" style={{ marginRight: 14 }}>
        <path d="M6.6 10.8 A10 10 0 0 0 13.2 17.4 L15 15.6 A1 1 0 0 1 16 15.3 L19.8 16.5 A1 1 0 0 1 20.4 17.4 V21 A1 1 0 0 1 19.5 22 A18 18 0 0 1 2 4.5 A1 1 0 0 1 3 3.6 H6.6 A1 1 0 0 1 7.5 4.2 L8.7 8 A1 1 0 0 1 8.4 9 Z"
          fill="none" stroke={ACCENT_BLUE} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <svg width="52" height="46" viewBox="0 0 26 24">
        <rect x="2" y="6" width="16" height="12" rx="2" fill="none" stroke={ACCENT_BLUE} strokeWidth="1.6" />
        <path d="M18 9 L24 6 V18 L18 15 Z" fill="none" stroke={ACCENT_BLUE} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  </>
);

// ================== INPUT BAR (Messenger exact) ==================
const InputBar: React.FC = () => (
  <div style={{
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: 140, background: INPUT_BG, paddingBottom: 32,
    display: "flex", alignItems: "center", padding: "20px 18px 44px 18px",
    gap: 16, zIndex: 10,
  }}>
    {/* + button */}
    <div style={{
      width: 60, height: 60, borderRadius: "50%", background: "#262729",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: ACCENT_BLUE, fontSize: 40, fontWeight: 500,
    }}>＋</div>
    {/* camera */}
    <svg width="52" height="52" viewBox="0 0 26 26">
      <path d="M3 8 H8 L10 5 H16 L18 8 H23 V21 H3 Z" fill="none" stroke={ACCENT_BLUE} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="13" cy="14.5" r="4.5" fill="none" stroke={ACCENT_BLUE} strokeWidth="1.8" />
    </svg>
    {/* gallery */}
    <svg width="48" height="48" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke={ACCENT_BLUE} strokeWidth="1.8" />
      <circle cx="8.5" cy="9" r="1.8" fill={ACCENT_BLUE} />
      <path d="M5 18 L10 13 L14 16 L17 13 L21 17" fill="none" stroke={ACCENT_BLUE} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
    {/* mic */}
    <svg width="44" height="52" viewBox="0 0 22 26">
      <rect x="7" y="2" width="8" height="14" rx="4" fill={ACCENT_BLUE} />
      <path d="M4 13 A7 7 0 0 0 18 13 M11 20 V24" fill="none" stroke={ACCENT_BLUE} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
    {/* text field */}
    <div style={{
      flex: 1, height: 72, borderRadius: 36, background: INPUT_FIELD,
      display: "flex", alignItems: "center", paddingLeft: 28,
      color: META, fontFamily: FF, fontSize: 28,
    }}>Aa</div>
    {/* thumbs-up */}
    <div style={{ color: ACCENT_BLUE, fontSize: 52 }}>👍</div>
  </div>
);

// ================== TYPING DOTS ==================
const TypingDots: React.FC<{ side: "left" | "right" }> = ({ side }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{
      display: "inline-flex", gap: 8, alignItems: "center",
      padding: "18px 22px",
      background: side === "left" ? BUBBLE_L : BUBBLE_R,
      borderRadius: 22,
    }}>
      {[0, 1, 2].map((i) => {
        const p = (Math.sin((frame - i * 6) * 0.25) + 1) / 2;
        return <div key={i} style={{ width: 12, height: 12, borderRadius: "50%",
          background: side === "left" ? "#B0B3B8" : "rgba(255,255,255,0.75)",
          opacity: 0.35 + p * 0.65 }} />;
      })}
    </div>
  );
};

// ================== BUBBLE RENDERERS ==================
type BubbleCtx = { item: RenderItem; y: number; isLastInRun: boolean; isFirstInRun: boolean };

// Smart radius: tight corners between consecutive same-sender bubbles
const bubbleRadius = (side: "left" | "right", isFirst: boolean, isLast: boolean): React.CSSProperties => {
  if (side === "left") {
    return {
      borderTopLeftRadius: isFirst ? 22 : 4,
      borderTopRightRadius: 22,
      borderBottomLeftRadius: isLast ? 22 : 4,
      borderBottomRightRadius: 22,
    };
  }
  return {
    borderTopLeftRadius: 22,
    borderTopRightRadius: isFirst ? 22 : 4,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: isLast ? 22 : 4,
  };
};

type RenderItem = { msg: Msg; visible: boolean; typingVisible: boolean; sinceAppear: number; estH: number };

const estimateHeight = (m: Msg): number => {
  if ((m as Divider).kind === "divider") return 72;
  const kind = (m as any).kind ?? "text";
  if (kind === "image") return 480;
  if (kind === "voice_note") return 180;
  if (kind === "link") return 560;
  if (kind === "screenshot") return 240;
  const chars = (m as Text).text?.length ?? 0;
  const lines = Math.max(1, Math.ceil(chars / 22));
  return 76 + lines * 54;
};

const Bubble: React.FC<BubbleCtx> = ({ item, y, isLastInRun, isFirstInRun }) => {
  const frame = useCurrentFrame();
  const { msg, visible, sinceAppear } = item;
  if (!visible) return null;

  // Divider
  if ((msg as Divider).kind === "divider") {
    const m = msg as Divider;
    return (
      <div style={{ position: "absolute", top: y, left: 0, right: 0, textAlign: "center" }}>
        <span style={{ color: META, fontFamily: FF, fontWeight: 500, fontSize: 22, letterSpacing: "0.5px" }}>
          {m.label}
        </span>
      </div>
    );
  }

  const m = msg as Text | Img_ | Voice | Scn | Link;
  const side: "left" | "right" = m.who === "mai" ? "left" : "right";
  const bg = side === "left" ? BUBBLE_L : BUBBLE_R;
  const fg = side === "left" ? TXT_L : TXT_R;

  const sp = spring({ frame: sinceAppear, fps: FPS, config: { damping: 16, stiffness: 300, mass: 0.45 } });
  const scale = interpolate(sp, [0, 1], [0.82, 1]);
  const yOff = interpolate(sp, [0, 1], [20, 0]);

  // Outer positioning (with left 20px avatar gutter on received side)
  const maxW = W - 200;
  const avatarSpace = 64;  // gutter for avatar on left side
  const baseStyle: React.CSSProperties = {
    position: "absolute", top: y + yOff,
    [side === "left" ? "left" : "right"]: side === "left" ? avatarSpace + 18 : 20,
    maxWidth: maxW,
    opacity: sp,
    transform: `scale(${scale})`,
    transformOrigin: side === "left" ? "bottom left" : "bottom right",
  };

  const radius = bubbleRadius(side, isFirstInRun, isLastInRun);
  const kind = (msg as any).kind ?? "text";
  const reaction = (msg as any).react;

  const ReactionBadge = reaction ? (
    <div style={{
      position: "absolute",
      [side === "left" ? "right" : "left"]: -6,
      bottom: -14,
      background: BG, padding: "3px 6px",
      borderRadius: 20, fontSize: 22,
      border: `2px solid ${BG}`,
      boxShadow: `0 0 0 1px ${BUBBLE_L}`,
    }}>{reaction}</div>
  ) : null;

  // ---- AVATAR (only on last received in run) ----
  const AvatarBadge = (side === "left" && isLastInRun) ? (
    <div style={{
      position: "absolute", left: 16, top: y + yOff + item.estH - 52,
      width: 40, height: 40, borderRadius: "50%",
      background: "linear-gradient(135deg, #F06292 0%, #FFB74D 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FF, fontWeight: 700, fontSize: 18, color: "#FFF",
      opacity: sp,
    }}>M</div>
  ) : null;

  // ---- TEXT ----
  if (kind === "text") {
    const t = m as Text;
    return (
      <>
        <div style={baseStyle}>
          <div style={{
            position: "relative",
            background: bg, color: fg,
            padding: "12px 18px", ...radius,
            fontFamily: FF, fontWeight: 400, fontSize: 34, lineHeight: 1.3,
            letterSpacing: "-0.3px", wordBreak: "break-word",
          }}>
            {t.text}
            {ReactionBadge}
          </div>
        </div>
        {AvatarBadge}
      </>
    );
  }

  // ---- IMAGE ATTACH (pure image, no bubble wrap) ----
  if (kind === "image") {
    const t = m as Img_;
    return (
      <>
        <div style={baseStyle}>
          <div style={{
            position: "relative",
            width: 440, height: 440, overflow: "hidden",
            background: "#FFF5DE", borderRadius: 22,
          }}>
            <Img src={staticFile(t.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {ReactionBadge}
          </div>
        </div>
        {AvatarBadge}
      </>
    );
  }

  // ---- SCREENSHOT (forwarded boss message) ----
  if (kind === "screenshot") {
    const t = m as Scn;
    return (
      <>
        <div style={baseStyle}>
          <div style={{
            position: "relative",
            width: 680, background: "#1E1E1E",
            borderRadius: 18, overflow: "hidden",
          }}>
            <div style={{
              padding: "14px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "#6D4C41",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#FFF", fontFamily: FF, fontWeight: 700, fontSize: 22,
              }}>AD</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#FFF", fontFamily: FF, fontWeight: 600, fontSize: 26, letterSpacing: "-0.2px" }}>
                  {t.from}
                </div>
                <div style={{ color: "#E52B2B", fontFamily: FF, fontWeight: 500, fontSize: 18 }}>
                  ● Đang hoạt động
                </div>
              </div>
              <div style={{ color: META, fontFamily: FF, fontSize: 18 }}>{t.time}</div>
            </div>
            <div style={{
              padding: "18px 20px",
              color: "#E4E6EA", fontFamily: FF, fontSize: 30, fontWeight: 400, lineHeight: 1.35,
            }}>{t.text}</div>
          </div>
          {ReactionBadge}
        </div>
        {AvatarBadge}
      </>
    );
  }

  // ---- VOICE NOTE ----
  if (kind === "voice_note") {
    const t = m as Voice;
    const audioStart = msg.tin * FPS + 6;
    const audioFrame = frame - audioStart;
    const playing = audioFrame >= 0 && audioFrame < t.dur * FPS;
    const progress = playing ? Math.min(1, audioFrame / (t.dur * FPS)) : 0;
    const barCount = 30;
    const heights = [10, 16, 28, 22, 12, 24, 36, 20, 10, 22, 30, 16, 10, 22, 34, 26, 14, 20, 30, 16, 10, 24, 32, 18, 14, 10, 22, 18, 12, 20];
    return (
      <>
        <div style={baseStyle}>
          <div style={{
            position: "relative",
            background: bg, color: fg,
            padding: "14px 20px", ...radius,
            display: "flex", alignItems: "center", gap: 14,
            minWidth: 560,
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24">
              <path d="M8 5 L19 12 L8 19 Z" fill="#FFF" />
            </svg>
            <div style={{ flex: 1, height: 48, display: "flex", alignItems: "center", gap: 3 }}>
              {Array.from({ length: barCount }).map((_, i) => {
                const filled = i / barCount <= progress;
                const h = heights[i % heights.length];
                const pulse = playing ? 1 + 0.22 * Math.sin((audioFrame + i * 3) * 0.45) * (filled ? 1 : 0.3) : 1;
                return (
                  <div key={i} style={{
                    width: 4, height: h, borderRadius: 2,
                    background: filled ? "#FFFFFF" : "rgba(255,255,255,0.4)",
                    transform: `scaleY(${pulse})`,
                  }} />
                );
              })}
            </div>
            <div style={{
              fontFamily: FF, fontWeight: 500, fontSize: 22,
              color: "rgba(255,255,255,0.85)",
            }}>0:{String(Math.round(t.dur)).padStart(2,"0")}</div>
            {ReactionBadge}
          </div>
        </div>
        {AvatarBadge}
      </>
    );
  }

  // ---- LINK PREVIEW (OpenGraph card style) ----
  if (kind === "link") {
    const t = m as Link;
    return (
      <>
        <div style={baseStyle}>
          <div style={{
            width: 600, background: BUBBLE_L,
            borderRadius: 22, overflow: "hidden",
          }}>
            <div style={{
              height: 360, background: "#FFF5DE", position: "relative",
            }}>
              <Img src={staticFile("aff_lamp/product.png")} style={{
                width: "85%", height: "85%", objectFit: "contain",
                margin: "18px auto 0", display: "block",
              }} />
              <div style={{
                position: "absolute", top: 16, left: 16,
                background: "#EE4D2D", color: "#FFF",
                padding: "6px 14px", borderRadius: 6,
                fontFamily: FF, fontWeight: 700, fontSize: 20, letterSpacing: "1px",
              }}>SHOPEE</div>
            </div>
            <div style={{ padding: "16px 20px" }}>
              <div style={{
                fontFamily: FF, fontWeight: 400, fontSize: 20,
                color: META, letterSpacing: "0.5px", textTransform: "lowercase",
              }}>{t.url}</div>
              <div style={{
                fontFamily: FF, fontWeight: 600, fontSize: 28, color: TXT_L,
                lineHeight: 1.3, marginTop: 4,
              }}>{t.title}</div>
              <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", gap: 10 }}>
                <div style={{ fontFamily: FF, fontWeight: 700, fontSize: 38, color: "#FF7B35" }}>
                  {t.price}
                </div>
                <div style={{ fontFamily: FF, fontSize: 20, color: META, textDecoration: "line-through" }}>
                  250.000₫
                </div>
              </div>
              <div style={{ marginTop: 4, fontFamily: FF, fontWeight: 400, fontSize: 20, color: META }}>
                {t.sold}
              </div>
            </div>
            {ReactionBadge}
          </div>
        </div>
        {AvatarBadge}
      </>
    );
  }

  return null;
};

// ================== MAIN ==================
export const AffLampMessenger: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  const items: RenderItem[] = MESSAGES.map((m) => {
    const appearAt = m.tin;
    const typing = (m as any).typing ?? 0;
    const typingVisible = typing > 0 && t >= appearAt - typing && t < appearAt && (m as any).kind !== "divider";
    const visible = t >= appearAt;
    const sinceAppear = Math.max(0, frame - appearAt * FPS);
    return { msg: m, visible, typingVisible, sinceAppear, estH: estimateHeight(m) };
  });

  // Compute isFirstInRun / isLastInRun for same-sender consecutive msgs
  const runInfo = items.map((it, i) => {
    const m = it.msg as any;
    if (m.kind === "divider") return { isFirst: true, isLast: true };
    const prev = items[i - 1]?.msg as any;
    const next = items[i + 1]?.msg as any;
    const samePrev = prev && prev.who === m.who && prev.kind !== "divider";
    const sameNext = next && next.who === m.who && next.kind !== "divider";
    return { isFirst: !samePrev, isLast: !sameNext };
  });

  // Anchor latest visible at bottom
  const BOTTOM = H - 320;
  const GAP_SAME = 6;
  const GAP_DIFF = 18;
  const GAP_DIV = 24;
  let latestIdx = -1;
  for (let i = 0; i < items.length; i++) if (items[i].visible) latestIdx = i;
  const ys: number[] = new Array(items.length).fill(0);
  let cursorY = BOTTOM;
  for (let i = latestIdx; i >= 0; i--) {
    ys[i] = cursorY - items[i].estH;
    const prev = items[i - 1];
    let gap = GAP_DIFF;
    if (prev) {
      const prevDiv = (prev.msg as any).kind === "divider";
      const curDiv = (items[i].msg as any).kind === "divider";
      if (prevDiv || curDiv) gap = GAP_DIV;
      else if ((prev.msg as any).who === (items[i].msg as any).who) gap = GAP_SAME;
    }
    cursorY = ys[i] - gap;
  }

  // Typing bubble for next incoming msg
  let typingFor: RenderItem | null = null;
  for (const it of items) if (it.typingVisible) typingFor = it;

  // Seen indicator: small avatar below last "me" if latest visible is from mai
  let seenY = -10000; let showSeen = false;
  const last = items[latestIdx];
  if (last && (last.msg as any).who === "mai" && (last.msg as any).kind !== "divider") {
    for (let i = latestIdx - 1; i >= 0; i--) {
      if ((items[i].msg as any).who === "me") {
        seenY = ys[i] + items[i].estH + 4;
        showSeen = true;
        break;
      }
    }
  }

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Header />
      {items.map((it, i) => (
        <Bubble key={it.msg.id} item={it} y={ys[i]}
          isFirstInRun={runInfo[i].isFirst} isLastInRun={runInfo[i].isLast} />
      ))}
      {showSeen && (
        <div style={{
          position: "absolute", top: seenY, right: 22,
          width: 24, height: 24, borderRadius: "50%",
          background: "linear-gradient(135deg, #F06292 0%, #FFB74D 100%)",
          border: `1.5px solid ${BG}`,
        }} />
      )}
      {typingFor && (() => {
        const side: "left" | "right" = (typingFor.msg as any).who === "mai" ? "left" : "right";
        // Position BELOW latest visible message, not at fixed bottom — prevents overlap
        const latestBottom =
          latestIdx >= 0 ? ys[latestIdx] + items[latestIdx].estH : BOTTOM;
        const typingY = latestBottom + 18;
        // Spring entry
        const typingStartF = typingFor.msg.tin * FPS - (typingFor.typingVisible ? ((typingFor.msg as any).typing ?? 0) * FPS : 0);
        const sinceTyp = Math.max(0, frame - typingStartF);
        const tSp = spring({ frame: sinceTyp, fps: FPS, config: { damping: 16, stiffness: 300, mass: 0.45 } });
        return (
          <>
            {/* Small avatar if received (mai typing) */}
            {side === "left" && (
              <div style={{
                position: "absolute", left: 16, top: typingY + 8,
                width: 40, height: 40, borderRadius: "50%",
                background: "linear-gradient(135deg, #F06292 0%, #FFB74D 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FF, fontWeight: 700, fontSize: 18, color: "#FFF",
                opacity: tSp,
              }}>M</div>
            )}
            <div style={{
              position: "absolute", top: typingY,
              [side === "left" ? "left" : "right"]: side === "left" ? 82 : 22,
              opacity: tSp,
              transform: `scale(${interpolate(tSp, [0, 1], [0.85, 1])})`,
              transformOrigin: side === "left" ? "bottom left" : "bottom right",
            }}>
              <TypingDots side={side} />
            </div>
          </>
        );
      })()}
      <InputBar />

      <Sequence from={Math.round(18.2 * FPS + 6)}>
        <Audio src={staticFile("aff_lamp/voice_note_b.mp3")} volume={1.0} />
      </Sequence>
      <Audio src={staticFile("bh_music.mp3")} volume={0.08} />
    </AbsoluteFill>
  );
};
