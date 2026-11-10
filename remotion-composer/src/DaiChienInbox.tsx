import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadBeVietnam } from "@remotion/google-fonts/BeVietnamPro";
import tl from "./dai-chien-inbox-1_timeline.json";

loadAnton("normal", { weights: ["400"], subsets: ["vietnamese", "latin"] });
loadOswald("normal", { weights: ["600", "700"], subsets: ["vietnamese", "latin"] });
loadBeVietnam("normal", { weights: ["500", "600", "700"], subsets: ["vietnamese", "latin"] });

const FPS = 30;
const SLUG = "dai-chien-inbox-1";
const LEAD = 4;
const OUTRO_SEC = 2.8;

const ORANGE = "#FF8A00";
const PILL = "#FF9A0A";
const STROKE = "#3B1D06";
const RED = "#E5322D";
const INK = "#1C1E21";
const MSG_BLUE = "#0A7CFF";
const MSG_GRAY = "#ECEDEF";

const TITLE_FONT = "'Anton', Impact, sans-serif";
const PILL_FONT = "'Oswald', 'Arial Narrow', sans-serif";
const UI_FONT = "'Be Vietnam Pro', system-ui, sans-serif";

type Line = { t: string; kind: string; start: number; end: number };
type Page = { start: number; lines: Line[] };
type Timeline = { total: number; beats: { name: string; pages: Page[] }[] };
const TL = tl as Timeline;
const LINES: Line[] = TL.beats.flatMap((b) => b.pages.flatMap((p) => p.lines));
const PAGES = TL.beats.flatMap((b) => b.pages.map((p, i) => ({ beat: b.name, first: i === 0, lines: p.lines })));

export const DAI_CHIEN_INBOX_FRAMES = Math.ceil((TL.total + OUTRO_SEC) * FPS);
const OUTRO_START = Math.round(TL.total * FPS);

const lineIndex = (prefix: string) => {
  const i = LINES.findIndex((l) => l.t.startsWith(prefix));
  if (i < 0) throw new Error(`script line not found: ${prefix}`);
  return i;
};
const entry = (i: number) => Math.max(0, Math.round(LINES[i].start * FPS) - LEAD);
const entryOf = (prefix: string) => entry(lineIndex(prefix));
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const lerp = (v: number, a: number, b: number) => a + (b - a) * v;
const POP = { damping: 11, stiffness: 210, mass: 0.6 };
const SNAP = { damping: 16, stiffness: 260, mass: 0.5 };

type Ctx = { f: number; at: (prefix: string) => number; atLine: (line: number) => number };
const sp = (f: number, at: number, cfg = SNAP) => spring({ frame: f - at, fps: FPS, config: cfg });

type Chat = { who: "kh" | "shop"; text: string; line: number };
const CHATS: Chat[] = LINES.flatMap((l, line) => {
  if (l.kind !== "chat") return [];
  const [label, ...rest] = l.t.split(": ");
  if (label === "BÌNH LUẬN") return [];
  return [{ who: label === "CHỦ SHOP" ? ("shop" as const) : ("kh" as const), text: rest.join(": "), line }];
});
const chatText = (prefix: string) => LINES[lineIndex(prefix)].t.split(": ").slice(1).join(": ");

const Reserved: React.FC<{ children: React.ReactNode }> = ({ children }) => <div style={{ visibility: "hidden" }}>{children}</div>;

const LINE_MAX_W = 840;
const ANTON_EM = 0.45;
const OSWALD_EM = 0.5;
const Title: React.FC<{ f: number; at: number; text: string; size?: number; color?: string; cps?: number }> = (props) => {
  const { f, at, text, size: wanted = 96, color = ORANGE, cps = 1.4 } = props;
  if (f < at) return <Reserved>{<Title {...props} f={at} />}</Reserved>;
  const size = Math.min(wanted, LINE_MAX_W / (text.length * ANTON_EM));
  const n = Math.min(text.length, Math.floor((f - at) * cps) + 1);
  const typing = n < text.length;
  const cursorOn = typing || Math.floor((f - at) / 8) % 2 === 0;
  return (
    <div style={{ fontFamily: TITLE_FONT, fontSize: size, color, lineHeight: 1.12, textAlign: "center", letterSpacing: 1, WebkitTextStroke: `${size * 0.11}px ${STROKE}`, paintOrder: "stroke fill", textTransform: "uppercase", whiteSpace: "nowrap" }}>
      <span>{text.slice(0, n)}</span>
      <span style={{ position: "relative", display: "inline-block", width: 0 }}>
        {cursorOn && f - at < text.length / cps + 24 ? <span style={{ position: "absolute", left: 4, top: size * 0.12, width: size * 0.06, height: size * 0.9, background: "#fff", boxShadow: `0 0 0 2px ${STROKE}` }} /> : null}
      </span>
      <span style={{ opacity: 0 }}>{text.slice(n)}</span>
    </div>
  );
};

const Pill: React.FC<{ f: number; at: number; text: string; size?: number; icon?: string; color?: string }> = (props) => {
  const { f, at, text, size: wanted = 56, icon, color = PILL } = props;
  if (f < at) return <Reserved>{<Pill {...props} f={at} />}</Reserved>;
  const size = Math.min(wanted, LINE_MAX_W / (text.length * OSWALD_EM + 2.1 + (icon ? 1.5 : 0)));
  const v = sp(f, at, { damping: 13, stiffness: 240, mass: 0.55 });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, background: color, borderRadius: 999, padding: `${size * 0.36}px ${size * 1.05}px`, boxShadow: "0 10px 24px #7a3c0033", transform: `translateX(${lerp(v, -220, 0)}px) rotate(${lerp(v, -16, 0)}deg) scaleX(${lerp(v, 1.25, 1)})`, filter: `blur(${lerp(Math.min(1, v), 10, 0)}px)`, opacity: Math.min(1, v * 2.5) }}>
      {icon ? <Img src={staticFile(`${SLUG}/emoji/${icon}.png`)} style={{ width: size * 1.15, height: size * 1.15 }} /> : null}
      <div style={{ fontFamily: PILL_FONT, fontWeight: 700, fontSize: size, color: "#fff", textTransform: "uppercase", lineHeight: 1.15, textAlign: "center", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

const Sticker: React.FC<{ f: number; at: number; icon: string; size?: number; wipe?: boolean; tilt?: number; style?: React.CSSProperties }> = (props) => {
  const { f, at, icon, size = 260, wipe, tilt = 0, style } = props;
  if (f < at) return <Reserved>{<Sticker {...props} f={at} />}</Reserved>;
  const v = sp(f, at, POP);
  const bob = Math.sin((f - at) / 14) * 6;
  const reveal = wipe ? interpolate(f, [at, at + 9], [100, 0], clamp) : 0;
  return (
    <Img
      src={staticFile(`${SLUG}/emoji/${icon}.png`)}
      style={{ width: size, height: size, objectFit: "contain", transform: `translateY(${bob}px) scale(${wipe ? 1 : lerp(v, 0.2, 1)}) rotate(${tilt + (wipe ? 0 : lerp(v, -18, 0))}deg)`, clipPath: `inset(0 ${reveal}% 0 0)`, filter: "drop-shadow(0 12px 18px #5a3a1a33)", ...style }}
    />
  );
};

const Strike: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const w = interpolate(f, [at, at + 6], [0, 104], clamp);
  return <div style={{ position: "absolute", left: "-2%", top: "50%", width: `${w}%`, height: 14, marginTop: -7, background: RED, borderRadius: 7, transform: "rotate(-4deg)", boxShadow: "0 3px 0 #7a0e0b55" }} />;
};

const IconRow: React.FC<{ f: number; at: number; icon: string; text: string; strikeAt?: number; size?: number }> = (props) => {
  const { f, at, icon, text, strikeAt, size = 70 } = props;
  if (f < at) return <Reserved>{<IconRow {...props} f={at} />}</Reserved>;
  const v = sp(f, at);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: Math.min(1, v * 2), transform: `translateX(${lerp(v, -60, 0)}px)` }}>
      <Sticker f={f} at={at} icon={icon} size={size * 1.7} />
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: TITLE_FONT, fontSize: size, color: ORANGE, WebkitTextStroke: `${size * 0.11}px ${STROKE}`, paintOrder: "stroke fill", textTransform: "uppercase", lineHeight: 1.1 }}>{text}</div>
        {strikeAt !== undefined && f >= strikeAt ? <Strike f={f} at={strikeAt} /> : null}
      </div>
    </div>
  );
};

const Meter: React.FC<{ f: number; at: number; icon: string; label: string; to: number }> = (props) => {
  const { f, at, icon, label, to } = props;
  if (f < at) return <Reserved>{<Meter {...props} f={at} />}</Reserved>;
  const v = sp(f, at);
  const level = interpolate(f, [at + 6, at + 34], [1, to], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const color = level > 0.5 ? "#3FB950" : level > 0.25 ? PILL : RED;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26, opacity: Math.min(1, v * 2), transform: `translateY(${lerp(v, 30, 0)}px)` }}>
      <Sticker f={f} at={at} icon={icon} size={140} />
      <div>
        <div style={{ fontFamily: TITLE_FONT, fontSize: 64, color: ORANGE, WebkitTextStroke: `7px ${STROKE}`, paintOrder: "stroke fill", lineHeight: 1.1 }}>{label}</div>
        <div style={{ width: 560, height: 44, marginTop: 12, border: `6px solid ${STROKE}`, borderRadius: 14, background: "#fff8", overflow: "hidden" }}>
          <div style={{ width: `${level * 100}%`, height: "100%", background: color }} />
        </div>
      </div>
    </div>
  );
};

const Avatar: React.FC<{ size: number; ring?: number }> = ({ size, ring = 0 }) => (
  <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
    <div style={{ width: size, height: size, borderRadius: size, background: "linear-gradient(135deg,#F7B267,#F25C54)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: UI_FONT, fontWeight: 700, color: "#fff", fontSize: size * 0.45 }}>K</div>
    {ring > 0 ? (
      <svg width={size * 1.9} height={size * 1.9} style={{ position: "absolute", left: -size * 0.45, top: -size * 0.45, overflow: "visible" }}>
        <circle cx={size * 0.95} cy={size * 0.95} r={size * 0.82} fill="none" stroke={RED} strokeWidth={9} strokeLinecap="round" strokeDasharray={`${ring * 5.2 * size} ${6 * size}`} transform={`rotate(-90 ${size * 0.95} ${size * 0.95})`} />
      </svg>
    ) : null}
  </div>
);

const PhotoTiles: React.FC<{ v: number }> = ({ v }) => (
  <div style={{ display: "flex", gap: 10, alignSelf: "flex-end", opacity: v, transform: `scale(${lerp(v, 0.7, 1)})`, transformOrigin: "right center" }}>
    {["#2B2B2B", "#F5F3EE", "#D8C3A5"].map((c) => (
      <div key={c} style={{ width: 150, height: 180, borderRadius: 22, background: `linear-gradient(160deg, ${c}, ${c}cc)`, border: "2px solid #0001", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img src={staticFile(`${SLUG}/emoji/package.png`)} style={{ width: 80, height: 80, opacity: 0.85 }} />
      </div>
    ))}
  </div>
);

const Bubble: React.FC<{ f: number; chat: Chat; at: number; seenAt?: number; isLast: boolean }> = ({ f, chat, at, seenAt, isLast }) => {
  const v = at < 0 ? 1 : sp(f, at, SNAP);
  const mine = chat.who === "shop";
  const typing = !mine && at >= 0 && f >= at - 12 && f < at;
  if (f < at && !typing) return null;
  const photos = chat.text.startsWith("Dạ có ạ. Em gửi");
  const seen = isLast && seenAt !== undefined && f >= seenAt;
  const seenV = seen ? sp(f, seenAt!, POP) : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start", gap: 10, maxHeight: lerp(v, 0, 520), overflow: "visible" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexDirection: mine ? "row-reverse" : "row" }}>
        {!mine ? <Avatar size={56} /> : null}
        <div style={{ maxWidth: 470, padding: "18px 26px", borderRadius: 34, background: mine ? MSG_BLUE : MSG_GRAY, color: mine ? "#fff" : INK, fontFamily: UI_FONT, fontWeight: 500, fontSize: 36, lineHeight: 1.3, opacity: Math.min(1, v * 2), transform: `scale(${lerp(v, 0.6, 1)})`, transformOrigin: mine ? "right bottom" : "left bottom" }}>
          {typing ? <span style={{ letterSpacing: 6, fontWeight: 700 }}>{".".repeat(1 + (Math.floor(f / 4) % 3))}</span> : chat.text}
        </div>
      </div>
      {photos ? <PhotoTiles v={at < 0 ? 1 : sp(f, at + 8, POP)} /> : null}
      {seen ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, transform: `scale(${lerp(seenV, 0.3, 1.5)})`, transformOrigin: "right top", marginTop: 8, marginRight: 6 }}>
          <span style={{ fontFamily: UI_FONT, fontWeight: 600, fontSize: 26, color: "#65676B" }}>Đã xem</span>
          <Avatar size={30} />
        </div>
      ) : null}
    </div>
  );
};

const Phone: React.FC<{ f: number; atLine: (line: number) => number; upTo: number; enter: number; seenAt?: number; scale?: number; ghost?: number }> = ({ f, atLine, upTo, enter, seenAt, scale = 1, ghost }) => {
  const v = enter < 0 ? 1 : sp(f, enter, { damping: 18, stiffness: 150, mass: 0.8 });
  const shown = CHATS.filter((c) => c.line <= upTo);
  const relAt = (c: Chat) => {
    const a = atLine(c.line);
    return a < 0 ? -1000 : a;
  };
  const fadeHeader = ghost !== undefined ? interpolate(f, [ghost, ghost + 10], [1, 0.25], clamp) : 1;
  return (
    <div style={{ width: 760, height: 1180, background: "#fff", borderRadius: 64, border: `14px solid ${INK}`, boxShadow: "0 30px 60px #5a3a1a40", overflow: "hidden", display: "flex", flexDirection: "column", transform: `translateY(${lerp(v, 1300, 0)}px) scale(${scale})`, transformOrigin: "center top" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "54px 30px 22px", borderBottom: "2px solid #E4E6EB" }}>
        <div style={{ fontFamily: UI_FONT, fontSize: 44, color: MSG_BLUE, fontWeight: 700 }}>‹</div>
        <div style={{ opacity: fadeHeader }}>
          <Avatar size={70} />
        </div>
        <div style={{ opacity: fadeHeader }}>
          <div style={{ fontFamily: UI_FONT, fontWeight: 700, fontSize: 34, color: INK }}>Khách hàng</div>
          <div style={{ fontFamily: UI_FONT, fontSize: 24, color: "#65676B" }}>Messenger</div>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 18, padding: "20px 26px 34px", overflow: "hidden" }}>
        {shown.map((c, i) => (
          <Bubble key={c.line} f={f} chat={c} at={relAt(c)} seenAt={seenAt} isLast={i === shown.length - 1} />
        ))}
      </div>
      <div style={{ height: 96, borderTop: "2px solid #E4E6EB", display: "flex", alignItems: "center", padding: "0 26px" }}>
        <div style={{ flex: 1, height: 58, borderRadius: 29, background: MSG_GRAY, fontFamily: UI_FONT, fontSize: 26, color: "#8A8D91", display: "flex", alignItems: "center", paddingLeft: 24 }}>Aa</div>
      </div>
    </div>
  );
};

const Notification: React.FC<{ f: number; at: number; title: string; body: string; icon: string }> = ({ f, at, title, body, icon }) => {
  if (f < at) return null;
  const v = sp(f, at, { damping: 15, stiffness: 200, mass: 0.6 });
  return (
    <div style={{ position: "absolute", top: 120, left: 60, right: 60, display: "flex", alignItems: "center", gap: 22, padding: "24px 28px", background: "#ffffffee", borderRadius: 36, boxShadow: "0 18px 40px #5a3a1a40", transform: `translateY(${lerp(v, -320, 0)}px)` }}>
      <Img src={staticFile(`${SLUG}/emoji/${icon}.png`)} style={{ width: 88, height: 88 }} />
      <div>
        <div style={{ fontFamily: UI_FONT, fontWeight: 700, fontSize: 32, color: INK }}>{title}</div>
        <div style={{ fontFamily: UI_FONT, fontWeight: 500, fontSize: 30, color: "#4B4F56" }}>{body}</div>
      </div>
    </div>
  );
};

const CommentPanel: React.FC<{ f: number; enter: number; commentAt: number; ringAt?: number; scale?: number; text: string }> = ({ f, enter, commentAt, ringAt, scale = 1, text }) => {
  const v = enter < 0 ? 1 : sp(f, enter, { damping: 18, stiffness: 150, mass: 0.8 });
  const c = commentAt < 0 ? 1 : f >= commentAt ? sp(f, commentAt, POP) : 0;
  const ring = ringAt !== undefined ? interpolate(f, [ringAt, ringAt + 10], [0, 1], clamp) : 0;
  return (
    <div style={{ width: 900, background: "#fff", borderRadius: 40, boxShadow: "0 24px 50px #5a3a1a40", padding: "34px 36px 40px", transform: `translateY(${lerp(v, 1200, 0)}px) scale(${scale})`, transformOrigin: "center top" }}>
      <div style={{ fontFamily: UI_FONT, fontWeight: 700, fontSize: 36, color: INK, paddingBottom: 22, borderBottom: "2px solid #E4E6EB" }}>Bình luận</div>
      <div style={{ display: "flex", gap: 22, marginTop: 30, opacity: c, transform: `scale(${lerp(c, 0.7, 1)})`, transformOrigin: "left center" }}>
        <Avatar size={84} ring={ring} />
        <div>
          <div style={{ background: MSG_GRAY, borderRadius: 30, padding: "18px 28px" }}>
            <div style={{ fontFamily: UI_FONT, fontWeight: 700, fontSize: 30, color: INK }}>Khách hàng</div>
            <div style={{ fontFamily: UI_FONT, fontWeight: 500, fontSize: 44, color: INK }}>{text}</div>
          </div>
          <div style={{ fontFamily: UI_FONT, fontWeight: 600, fontSize: 26, color: "#65676B", marginTop: 10, marginLeft: 20 }}>Vừa xong · Thích · Phản hồi</div>
        </div>
      </div>
    </div>
  );
};

const Stamp: React.FC<{ f: number; at: number; text: string; size?: number; color?: string }> = ({ f, at, text, size = 230, color = RED }) => {
  if (f < at) return null;
  const v = spring({ frame: f - at, fps: FPS, config: { damping: 9, stiffness: 260, mass: 0.7 } });
  return (
    <div style={{ fontFamily: TITLE_FONT, fontSize: size, color, WebkitTextStroke: `${size * 0.07}px ${STROKE}`, paintOrder: "stroke fill", transform: `scale(${lerp(v, 3, 1)}) rotate(-8deg)`, opacity: Math.min(1, v * 3), lineHeight: 1, textShadow: "0 14px 0 #3b1d0633" }}>
      {text}
    </div>
  );
};

const SAFE_TOP = 140;
const SAFE_BOTTOM = 400;
const CONTENT_ZOOM = 1.2;
const Col: React.FC<{ children: React.ReactNode; top?: number; gap?: number; zoom?: number }> = ({ children, top, gap = 40, zoom = top === undefined ? CONTENT_ZOOM : 1 }) => (
  <AbsoluteFill style={{ zoom, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: top === undefined ? "center" : "flex-start", paddingTop: (top ?? SAFE_TOP) / zoom, paddingBottom: (top === undefined ? SAFE_BOTTOM : 0) / zoom, gap }}>{children}</AbsoluteFill>
);
const Row: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 40 }) => <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap }}>{children}</div>;
const fadeOutAt = (f: number, at: number) => interpolate(f, [at - 6, at], [1, 0], clamp);

const RENDERS: Record<string, (c: Ctx) => React.ReactNode> = {
  "MO_DAU:0": ({ f, at, atLine }) => (
    <Col gap={44}>
      <Title f={f} at={at("Lịch sử thế giới")} text="Lịch sử thế giới" size={100} />
      <Row gap={30}>
        <Sticker f={f} at={at("Lịch sử thế giới") + 4} icon="swords" size={170} tilt={-8} />
        <Sticker f={f} at={at("Lịch sử thế giới")} icon="globe" size={320} />
        <Sticker f={f} at={at("Lịch sử thế giới") + 8} icon="bomb" size={170} tilt={10} />
      </Row>
      <Pill f={f} at={at("hai cuộc đại chiến")} text="Thế chiến I" size={64} icon="helmet" />
      <Pill f={f} at={at("hai cuộc đại chiến") + 8} text="Thế chiến II" size={64} icon="collision" />
    </Col>
  ),
  "MO_DAU:1": ({ f, at, atLine }) => (
    <Col gap={70}>
      <IconRow f={f} at={at("Hàng triệu người")} icon="helmet" text="Hàng triệu người" />
      <IconRow f={f} at={at("Vô số thành phố")} icon="house" text="Thành phố tàn phá" />
      <IconRow f={f} at={at("Và những vết thương")} icon="bandage" text="Vết thương nhiều thế hệ" size={62} />
    </Col>
  ),
  "MO_DAU:2": ({ f, at, atLine }) => (
    <Col gap={50}>
      <Title f={f} at={at("Nhưng có một sự thật")} text="Sự thật ít ai biết" size={110} />
      <Row gap={10}>
        <Sticker f={f} at={at("Nhưng có một sự thật") + 2} icon="eyes" size={330} wipe />
        <Sticker f={f} at={at("Nhưng có một sự thật") + 12} icon="thinking" size={200} />
      </Row>
    </Col>
  ),
  "MO_DAU:3": ({ f, at, atLine }) => (
    <Col gap={36}>
      <Sticker f={f} at={at("Trong khi thế giới")} icon="dove" size={260} />
      <Title f={f} at={at("Trong khi thế giới")} text="Thế giới: hòa bình" size={86} />
      <div style={{ height: 40 }} />
      <Row gap={10}>
        <Sticker f={f} at={at("hàng triệu chủ shop")} icon="phone" size={240} />
        <Sticker f={f} at={at("hàng triệu chủ shop") + 6} icon="collision" size={200} />
      </Row>
      <Pill f={f} at={at("hàng triệu chủ shop") + 4} text="Chủ shop: một cuộc chiến khác" size={54} />
    </Col>
  ),
  "MO_DAU:4": ({ f, at, atLine }) => (
    <Col gap={56}>
      <IconRow f={f} at={at("Không tiếng súng")} icon="collision" text="Tiếng súng" strikeAt={at("Không tiếng súng") + 8} size={84} />
      <IconRow f={f} at={at("Không bom đạn")} icon="bomb" text="Bom đạn" strikeAt={at("Không bom đạn") + 6} size={84} />
      <Sticker f={f} at={at("Chỉ có… một ô tin nhắn")} icon="speech" size={300} />
      <Title f={f} at={at("Chỉ có… một ô tin nhắn")} text="Một ô tin nhắn" size={110} />
    </Col>
  ),
  "MO_DAU:5": ({ f, at, atLine }) => (
    <Col gap={40}>
      <Sticker f={f} at={at("ĐẠI CHIẾN INBOX")} icon="swords" size={260} />
      <Title f={f} at={at("ĐẠI CHIẾN INBOX")} text="Đại chiến Inbox" size={150} cps={2} />
      <Pill f={f} at={at("THẾ CHIẾN INBOX I")} text="Thế chiến Inbox I" size={66} />
    </Col>
  ),
  "HOI_1:0": ({ f, at, atLine }) => {
    const phoneIn = at("KHÁCH HÀNG: Shop ơi") - 14;
    return (
      <>
        <AbsoluteFill style={{ opacity: fadeOutAt(f, phoneIn + 6) }}>
          <Col gap={40}>
            <Sticker f={f} at={at("Ngày hôm ấy")} icon="clock" size={300} />
            <Title f={f} at={at("Ngày hôm ấy")} text="9:17 sáng" size={150} />
          </Col>
          <Notification f={f} at={at("Một thông báo xuất hiện")} title="Messenger" body="Bạn có 1 tin nhắn mới" icon="bell" />
        </AbsoluteFill>
        <Col zoom={1}>
          {f >= phoneIn ? <Phone f={f} atLine={atLine} upTo={lineIndex("CHỦ SHOP: Dạ mẫu này")} enter={phoneIn} /> : null}
        </Col>
      </>
    );
  },
  "HOI_1:1": ({ f, at, atLine }) => (
    <Col gap={34}>
      <Title f={f} at={at("Chủ shop lập tức")} text="Trạng thái chiến đấu" size={96} />
      <Row gap={20}>
        <Sticker f={f} at={at("Chủ shop lập tức") + 2} icon="helmet" size={210} />
        <Sticker f={f} at={at("Chủ shop lập tức") + 8} icon="shield" size={190} />
      </Row>
      <Row gap={20}>
        <Sticker f={f} at={at("Một câu hỏi tưởng chừng")} icon="relieved" size={150} />
        <Pill f={f} at={at("Một câu hỏi tưởng chừng")} text="Vô hại?" size={62} />
      </Row>
      <Sticker f={f} at={at("Nhưng không ai biết")} icon="collision" size={280} />
      <Title f={f} at={at("Nhưng không ai biết")} text="Phát súng đầu tiên" size={100} color={RED} />
    </Col>
  ),
  "HOI_1:2": ({ f, at, atLine }) => (
    <Col zoom={1}>
      <Phone f={f} atLine={atLine} upTo={lineIndex("CHỦ SHOP: Dạ chị cho em")} enter={-1} />
    </Col>
  ),
  "HOI_2:0": ({ f, at, atLine }) => (
    <Col gap={40}>
      <Sticker f={f} at={at("15 phút trôi qua")} icon="hourglass" size={250} />
      <Title f={f} at={at("15 phút trôi qua")} text="15 phút trôi qua" size={110} />
      <div style={{ height: 10 }} />
      <Pill f={f} at={at("Chủ shop đã gửi 8")} text="8 bức ảnh" icon="camera" size={62} />
      <Pill f={f} at={at("3 đoạn tư vấn")} text="3 đoạn tư vấn" icon="speech" size={62} />
      <Pill f={f} at={at("và 2 lần kiểm tra")} text="2 lần kiểm tra tồn kho" icon="package" size={62} />
    </Col>
  ),
  "HOI_2:1": ({ f, at, atLine }) => (
    <Col gap={70}>
      <Meter f={f} at={at("Đạn dược gần cạn")} icon="lowbattery" label="ĐẠN DƯỢC" to={0.1} />
      <Meter f={f} at={at("Tinh thần bắt đầu")} icon="chart" label="TINH THẦN" to={0.28} />
      <Row gap={20}>
        <Sticker f={f} at={at("Nhưng đối phương vẫn chưa")} icon="thinking" size={220} />
        <Pill f={f} at={at("Nhưng đối phương vẫn chưa") + 4} text="Chưa quyết định" size={62} />
      </Row>
    </Col>
  ),
  "HOI_2:2": ({ f, at, atLine }) => (
    <Col zoom={1}>
      <Phone f={f} atLine={atLine} upTo={lineIndex("CHỦ SHOP: Dạ vâng ạ")} enter={-1} />
    </Col>
  ),
  "HOI_2:3": ({ f, at, atLine }) => {
    const gone = at("Đối phương biến mất");
    const g = f >= gone ? sp(f, gone, { damping: 20, stiffness: 60, mass: 1 }) : 0;
    return (
      <>
        <Col top={330}>
          <Phone f={f} atLine={atLine} upTo={lineIndex("CHỦ SHOP: Dạ vâng ạ")} enter={-1} ghost={gone} />
        </Col>
        {f >= gone ? (
          <AbsoluteFill style={{ display: "flex", alignItems: "center", paddingTop: 120 }}>
            <div style={{ transform: `translate(${lerp(g, -120, 380)}px, ${lerp(g, 0, -120)}px)`, opacity: interpolate(g, [0, 0.15, 0.85, 1], [0, 1, 1, 0.2]) }}>
              <Sticker f={f} at={gone} icon="ghost" size={260} />
            </div>
            <div style={{ position: "absolute", top: 160 }}>
              <Title f={f} at={gone} text="Biến mất" size={130} />
            </div>
          </AbsoluteFill>
        ) : null}
      </>
    );
  },
  "HOI_2:4": ({ f, at, atLine }) => {
    const phoneIn = at("Chỉ để lại một dòng");
    return (
      <>
        <Col top={210} gap={34}>
          <IconRow f={f} at={at("Không một lời tuyên bố")} icon="whiteflag" text="Đầu hàng" strikeAt={at("Không một lời tuyên bố") + 8} size={76} />
          <IconRow f={f} at={at("Không một lời giải thích")} icon="speech" text="Giải thích" strikeAt={at("Không một lời giải thích") + 6} size={76} />
        </Col>
        <Col top={700}>{f >= phoneIn ? <Phone f={f} atLine={atLine} upTo={lineIndex("CHỦ SHOP: Dạ vâng ạ")} enter={phoneIn} seenAt={at("ĐÃ XEM")} scale={0.92} /> : null}</Col>
        <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 260 }}>
          <Stamp f={f} at={at("ĐÃ XEM")} text="ĐÃ XEM" size={200} />
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 40, top: 1180 }}>
          <Sticker f={f} at={at("ĐÃ XEM") + 4} icon="eyes" size={220} tilt={-10} />
        </div>
      </>
    );
  },
  "HOI_3:0": ({ f, at, atLine }) => (
    <Col gap={44}>
      <Row gap={20}>
        <Sticker f={f} at={at("Chủ shop tưởng rằng")} icon="dove" size={200} />
        <Title f={f} at={at("Chủ shop tưởng rằng")} text="Kết thúc?" size={130} />
      </Row>
      <Pill f={f} at={at("Sau hàng loạt giờ")} text="Hàng loạt giờ tư vấn" icon="hourglass" size={60} />
      <Row gap={80}>
        <Sticker f={f} at={at("Shop thở phào")} icon="relieved" size={260} />
        <Sticker f={f} at={at("tuy có hơi hụt hẫng")} icon="pensive" size={260} />
      </Row>
      <Row gap={130}>
        <Title f={f} at={at("Shop thở phào")} text="Nhẹ nhõm" size={70} />
        <Title f={f} at={at("tuy có hơi hụt hẫng")} text="Hụt hẫng" size={70} />
      </Row>
    </Col>
  ),
  "HOI_3:1": ({ f, at, atLine }) => {
    const panelIn = at("BÌNH LUẬN:") - 10;
    return (
      <>
        <AbsoluteFill style={{ opacity: fadeOutAt(f, panelIn + 6) }}>
          <Col gap={30}>
            <Title f={f} at={at("Nhưng…")} text="Nhưng…" size={170} />
          </Col>
          <Notification f={f} at={at("Khi mở ô bình luận")} title="Thông báo" body="Có bình luận mới trên bài viết" icon="bell" />
        </AbsoluteFill>
        <Col zoom={1} gap={30}>
          {f >= panelIn ? <Sticker f={f} at={panelIn} icon="bell" size={230} tilt={Math.sin(f / 2) * 8} /> : null}
          {f >= panelIn ? <CommentPanel f={f} enter={panelIn} commentAt={at("BÌNH LUẬN:")} text={chatText("BÌNH LUẬN:")} /> : null}
        </Col>
      </>
    );
  },
  "HOI_3:2": ({ f, at, atLine }) => {
    const hit = at("CHÍNH LÀ HẮN");
    const shrink = f >= at("Đối phương không những") ? sp(f, at("Đối phương không những")) : 0;
    return (
      <>
        <Col top={lerp(shrink, 560, 1180)}>
          <CommentPanel f={f} enter={-1} commentAt={-1} ringAt={hit} text={chatText("BÌNH LUẬN:")} scale={lerp(shrink, 1, 0.78)} />
        </Col>
        <Col top={200} gap={30}>
          <Row gap={10}>
            <Sticker f={f} at={hit} icon="detective" size={190} />
            <Title f={f} at={hit} text="Chính là hắn!" size={120} color={RED} cps={2} />
          </Row>
          <Pill f={f} at={at("Đối phương không những")} text="Không rút lui" icon="whiteflag" size={58} />
          <Row gap={14}>
            <Sticker f={f} at={at("Mà còn mở thêm")} icon="swords" size={170} />
            <Title f={f} at={at("Mà còn mở thêm")} text="Mặt trận mới!" size={104} />
            <Sticker f={f} at={at("Mà còn mở thêm") + 6} icon="fire" size={150} />
          </Row>
        </Col>
      </>
    );
  },
  "HOI_3:3": ({ f, at, atLine }) => {
    const ko = at("ĐÒN KO");
    const fall = at("Chủ shop chính thức");
    const tip = f >= fall ? sp(f, fall + 6, { damping: 12, stiffness: 120, mass: 0.9 }) : 0;
    return (
      <Col gap={40}>
        <Row gap={20}>
          <div style={{ transform: `translateX(${f >= at("Một đòn đánh") ? lerp(sp(f, at("Một đòn đánh"), POP), -500, 0) : -500}px)` }}>
            <Sticker f={f} at={at("Một đòn đánh")} icon="glove" size={200} tilt={-20} />
          </div>
          <Title f={f} at={at("Một đòn đánh")} text="Đòn chí mạng" size={86} />
        </Row>
        <Stamp f={f} at={ko} text="K.O!" size={300} />
        <Row gap={30}>
          <div style={{ transform: `rotate(${lerp(tip, 0, 90)}deg) translateY(${lerp(tip, 0, -30)}px)` }}>
            <Sticker f={f} at={fall} icon="dizzyface" size={250} />
          </div>
          <Pill f={f} at={fall} text="Gục ngã" size={68} color={RED} />
        </Row>
      </Col>
    );
  },
  "KET:0": ({ f, at, atLine }) => (
    <Col gap={50}>
      <Sticker f={f} at={at("Và đó là Thế chiến")} icon="swords" size={220} />
      <Title f={f} at={at("Và đó là Thế chiến")} text="Thế chiến Inbox I" size={116} />
      <Pill f={f} at={at("Khách hỏi giá rồi")} text="Hỏi giá → biến mất" icon="ghost" size={60} />
      <Pill f={f} at={at("nhưng vẫn kịp để lại")} text="Chiến tích khắp mọi nơi" icon="medal" size={60} />
    </Col>
  ),
  "KET:1": ({ f, at, atLine }) => {
    const ask = at("Hãy để lại một dấu chấm");
    const dot = f >= ask + 14;
    return (
      <Col gap={46}>
        <Row gap={14}>
          <Sticker f={f} at={at("Anh em chủ shop")} icon="eyes" size={170} />
          <Title f={f} at={at("Anh em chủ shop")} text="Từng gặp chưa?" size={88} />
        </Row>
        {f >= ask ? (
          <div style={{ display: "flex", alignItems: "center", gap: 20, width: 780, padding: "24px 30px", background: "#fff", borderRadius: 40, boxShadow: "0 18px 40px #5a3a1a33", transform: `scale(${lerp(sp(f, ask, POP), 0.6, 1)})` }}>
            <Avatar size={70} />
            <div style={{ flex: 1, fontFamily: UI_FONT, fontSize: 40, color: dot ? INK : "#8A8D91", fontWeight: dot ? 700 : 500 }}>{dot ? "." : "Viết bình luận…"}</div>
            <div style={{ fontFamily: UI_FONT, fontWeight: 700, fontSize: 32, color: MSG_BLUE }}>Gửi</div>
          </div>
        ) : null}
        <Sticker f={f} at={ask + 6} icon="pointdown" size={170} />
        <Pill f={f} at={ask + 10} text="Đã sống sót qua trận chiến" icon="medal" size={56} />
      </Col>
    );
  },
  "KET:2": ({ f, at, atLine }) => (
    <Col gap={46}>
      <Sticker f={f} at={at("ĐẠI CHIẾN INBOX")} icon="swords" size={240} />
      <Title f={f} at={at("ĐẠI CHIẾN INBOX")} text="Đại chiến Inbox" size={150} cps={2} />
      {f >= at("Cuộc chiến tiếp theo") ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <Title f={f} at={at("Cuộc chiến tiếp theo")} text="Cuộc chiến tiếp theo:" size={60} cps={2.5} />
          <Pill f={f} at={at("Cuộc chiến tiếp theo") + 6} text="Trận chiến mặc cả 10 nghìn đồng" size={46} icon="money" />
        </div>
      ) : null}
    </Col>
  ),
};

type ShotDef = { key: string; start: number; end: number; firstOfBeat: boolean; lines: number[] };
const SHOT_DEFS: ShotDef[] = (() => {
  const counters: Record<string, number> = {};
  const defs = PAGES.map((p) => {
    const n = counters[p.beat] ?? 0;
    counters[p.beat] = n + 1;
    const firstLine = LINES.indexOf(p.lines[0]);
    const lines = p.lines.map((l) => LINES.indexOf(l));
    return { key: `${p.beat}:${n}`, start: firstLine === 0 ? 0 : entry(firstLine), end: 0, firstOfBeat: p.first, lines };
  });
  defs.forEach((d, i) => (d.end = i + 1 < defs.length ? defs[i + 1].start : OUTRO_START));
  const missing = defs.filter((d) => !RENDERS[d.key]).map((d) => d.key);
  if (missing.length) throw new Error(`no render for pages: ${missing.join(", ")}`);
  return defs;
})();

const HITS: { prefix: string; offset: number; amp: number }[] = [
  { prefix: "Nhưng không ai biết", offset: 0.1, amp: 16 },
  { prefix: "ĐÃ XEM", offset: 0, amp: 22 },
  { prefix: "CHÍNH LÀ HẮN", offset: 0, amp: 20 },
  { prefix: "ĐÒN KO", offset: 0, amp: 34 },
  { prefix: "Chủ shop chính thức", offset: 0.3, amp: 12 },
];

const shakeAt = (frame: number) => {
  let x = 0;
  let y = 0;
  for (const h of HITS) {
    const t = frame - (entryOf(h.prefix) + LEAD + Math.round(h.offset * FPS));
    if (t < 0 || t > 14) continue;
    const decay = h.amp * (1 - t / 14);
    x += Math.sin(t * 2.9) * decay;
    y += Math.cos(t * 3.7) * decay * 0.7;
  }
  return { x, y };
};

const Paper: React.FC<{ shot: number }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const k = shot * 7919;
  const ox = ((k % 90) - 45) + Math.sin(frame / 90) * 10;
  const oy = (((k / 7) % 120) - 60) + Math.cos(frame / 110) * 12;
  return (
    <AbsoluteFill style={{ background: "#E4DDCC", overflow: "hidden" }}>
      <Img src={staticFile(`${SLUG}/paper.jpg`)} style={{ position: "absolute", width: "112%", height: "112%", left: "-6%", top: "-6%", transform: `translate(${ox}px, ${oy}px) rotate(${(shot % 2 ? 1 : -1) * 0.6}deg) scale(${1 + frame * 0.00002})` }} />
    </AbsoluteFill>
  );
};

const Sweep: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < -2 || t > 14) return null;
  const p = interpolate(t, [-2, 14], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: lerp(p, -900, 1300), top: lerp(p, 1500, 300), width: 900, height: 120, borderRadius: 60, background: "linear-gradient(90deg, #FF8A0000, #FFB347 40%, #FFF3D0 55%, #FF8A00 75%, #FF8A0000)", filter: "blur(10px)", transform: "rotate(-38deg)", opacity: 0.95, boxShadow: "0 0 80px #FF9A0A" }} />
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < OUTRO_START) return null;
  const f = frame - OUTRO_START;
  const reveal = interpolate(f, [4, 16], [100, 0], clamp);
  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 50 }}>
      <Img src={staticFile(`${SLUG}/azbot_logo.png`)} style={{ width: 760, clipPath: `inset(0 ${reveal}% 0 0)` }} />
      <Sticker f={f} at={12} icon="speech" size={220} />
    </AbsoluteFill>
  );
};

const ShotLayer: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const d = SHOT_DEFS[index];
  if (frame < d.start || frame >= d.end) return null;
  const f = frame - d.start;
  const atLine = (line: number) => entry(line) - d.start;
  const at = (prefix: string) => {
    const own = d.lines.find((i) => LINES[i].t.startsWith(prefix));
    return own !== undefined ? atLine(own) : entryOf(prefix) - d.start;
  };
  return <AbsoluteFill>{RENDERS[d.key]({ f, at, atLine })}</AbsoluteFill>;
};

const flashAt = (frame: number) => {
  const t = frame - (entryOf("ĐÒN KO") + LEAD);
  return t >= 0 && t < 6 ? interpolate(t, [0, 6], [0.85, 0]) : 0;
};

type Sfx = { prefix: string; offset: number; src: string; vol: number };
const CHAT_PING_LEAD_SEC = -0.3;
const SFX: Sfx[] = [
  { prefix: "hai cuộc đại chiến", offset: 0.05, src: "sfx/ui/whoosh.mp3", vol: 0.35 },
  { prefix: "Chỉ có… một ô tin nhắn", offset: 0.6, src: "sfx/ui/iphone-ding.mp3", vol: 0.4 },
  { prefix: "ĐẠI CHIẾN INBOX", offset: 0, src: "sfx/punch/vine-boom.mp3", vol: 0.32 },
  { prefix: "Một thông báo xuất hiện", offset: 0, src: "sfx/ui/iphone-ding.mp3", vol: 0.45 },
  ...CHATS.map((c) => ({ prefix: LINES[c.line].t, offset: CHAT_PING_LEAD_SEC, src: c.who === "kh" ? "sfx/ui/iphone-ding.mp3" : "sfx/ui/discord-ping.mp3", vol: c.who === "kh" ? 0.24 : 0.16 })),
  { prefix: "Nhưng không ai biết", offset: 0.2, src: "sfx/punch/vine-boom.mp3", vol: 0.3 },
  { prefix: "Chủ shop đã gửi 8", offset: 0, src: "sfx/ui/whoosh.mp3", vol: 0.3 },
  { prefix: "3 đoạn tư vấn", offset: 0, src: "sfx/ui/whoosh.mp3", vol: 0.3 },
  { prefix: "và 2 lần kiểm tra", offset: 0, src: "sfx/ui/whoosh.mp3", vol: 0.3 },
  { prefix: "Đối phương biến mất", offset: 0.2, src: "sfx/funny/crickets.mp3", vol: 0.35 },
  { prefix: "ĐÃ XEM", offset: 0, src: "sfx/punch/vine-boom.mp3", vol: 0.45 },
  { prefix: "Nhưng…", offset: 0, src: "sfx/funny/record-scratch.mp3", vol: 0.4 },
  { prefix: "Khi mở ô bình luận", offset: 0.1, src: "sfx/ui/iphone-ding.mp3", vol: 0.4 },
  { prefix: "CHÍNH LÀ HẮN", offset: 0, src: "sfx/punch/vine-boom.mp3", vol: 0.45 },
  { prefix: "ĐÒN KO", offset: 0, src: "sfx/punch/metal-pipe.mp3", vol: 0.4 },
  { prefix: "Chủ shop chính thức", offset: 0.6, src: "sfx/punch/emotional-damage.mp3", vol: 0.45 },
  { prefix: "Hãy để lại một dấu chấm", offset: 0.4, src: "sfx/ui/typing.mp3", vol: 0.3 },
  { prefix: "Cuộc chiến tiếp theo", offset: 0, src: "sfx/ui/whoosh.mp3", vol: 0.3 },
];

export const DaiChienInbox: React.FC<{ bgm: boolean }> = ({ bgm }) => {
  const frame = useCurrentFrame();
  const shot = Math.max(0, SHOT_DEFS.findIndex((d) => frame >= d.start && frame < d.end));
  const { x, y } = shakeAt(frame);
  const beatStarts = SHOT_DEFS.filter((d) => d.firstOfBeat && d.start > 0).map((d) => d.start);
  const fadeAll = interpolate(frame, [DAI_CHIEN_INBOX_FRAMES - 10, DAI_CHIEN_INBOX_FRAMES], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "#E4DDCC" }}>
      <AbsoluteFill style={{ opacity: fadeAll, transform: `translate(${x}px, ${y}px)` }}>
        <Paper shot={frame >= OUTRO_START ? SHOT_DEFS.length : shot} />
        {SHOT_DEFS.map((_, i) => (
          <ShotLayer key={i} index={i} />
        ))}
        <Outro />
        {[...beatStarts, entryOf("ĐẠI CHIẾN INBOX"), OUTRO_START].map((s) => (
          <Sweep key={s} at={s} />
        ))}
        <AbsoluteFill style={{ background: "#fff", opacity: flashAt(frame) }} />
      </AbsoluteFill>
      {bgm ? <Audio src={staticFile(`${SLUG}/bgm.mp3`)} volume={0.4} /> : null}
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round((LINES[lineIndex(s.prefix)].start + s.offset) * FPS)} layout="none">
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
      <Sequence from={OUTRO_START} layout="none">
        <Audio src={staticFile("sfx/ui/whoosh.mp3")} volume={0.35} />
      </Sequence>
    </AbsoluteFill>
  );
};

const THUMB_F = 1000;

export const DaiChienInboxThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: "#E4DDCC" }}>
    <Img src={staticFile(`${SLUG}/paper.jpg`)} style={{ position: "absolute", width: "100%", height: "100%" }} />
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 34, paddingBottom: 60 }}>
      <Row gap={10}>
        <Sticker f={THUMB_F} at={0} icon="swords" size={170} />
        <Sticker f={THUMB_F} at={0} icon="bomb" size={150} />
      </Row>
      <Title f={THUMB_F} at={0} text="Đại chiến Inbox" size={170} />
      <Pill f={THUMB_F} at={0} text="Khách hỏi giá rồi… biến mất" size={60} icon="ghost" />
      <div style={{ position: "relative", width: 860, marginTop: 20, padding: "36px 34px", background: "#fff", borderRadius: 48, border: `12px solid ${INK}`, boxShadow: "0 30px 60px #5a3a1a40", display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
          <Avatar size={64} />
          <div style={{ padding: "20px 28px", borderRadius: 36, background: MSG_GRAY, fontFamily: UI_FONT, fontWeight: 600, fontSize: 42, color: INK }}>Shop ơi, giá bao nhiêu vậy ạ?</div>
        </div>
        <div style={{ alignSelf: "flex-end", maxWidth: 560, padding: "20px 28px", borderRadius: 36, background: MSG_BLUE, fontFamily: UI_FONT, fontWeight: 600, fontSize: 40, color: "#fff" }}>Dạ mẫu này 299K ạ. Hàng đẹp lắm, bên em đang có sẵn nhé.</div>
        <div style={{ alignSelf: "flex-end", display: "flex", alignItems: "center", gap: 10, fontFamily: UI_FONT, fontWeight: 600, fontSize: 30, color: "#65676B" }}>
          Đã xem <Avatar size={34} />
        </div>
        <div style={{ position: "absolute", left: 120, top: 130 }}>
          <Stamp f={THUMB_F} at={0} text="ĐÃ XEM" size={190} />
        </div>
      </div>
    </AbsoluteFill>
    <div style={{ position: "absolute", right: 40, top: 1130 }}>
      <Sticker f={THUMB_F} at={0} icon="sweat" size={210} tilt={10} />
    </div>
  </AbsoluteFill>
);
