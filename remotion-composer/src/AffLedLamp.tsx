/**
 * AffLedLamp v2 — PAS sales script (Pain / Agitate / Solution + FOMO close).
 *
 * 30s @ 30fps = 900 frames. Pain-forward copy, not feature listing.
 *
 *   0.0 — 4.0  HOOK PAIN    : "Bao lâu rồi dùng đèn cổ lỗ sĩ?"
 *   4.0 — 8.8  AGITATE      : "Mắt mỏi · Dây rối · Cúp điện xong"
 *   8.8 — 11.6 DISMISS       : "Tôi vứt hết — thay bằng cái này"  (product reveal)
 *  11.6 — 16.3 VALUE BOMB    : "SẠC 1 LẦN · DÙNG CẢ THÁNG"
 *  16.3 — 21.8 OBJECTION     : "3 màu · bảo vệ mắt · kẹp mọi nơi"
 *  21.8 — 25.8 SOCIAL PROOF  : "624 người chốt · 4.6 ★"
 *  25.8 — 30.0 URGENCY CLOSE : "125K = 3 trà sữa · Link đỏ"
 */

import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadBeVietnamPro("normal", { weights: ["400","600","700","800","900"], subsets: ["vietnamese","latin"] });

const FPS = 30;
const W = 1080;
const H = 1920;

const BG = "#FFF5DE";
const INK = "#150B04";
const RED = "#E52B2B";
const YELLOW = "#FFD019";
const GREEN = "#12B155";

type Sec = { id: string; tin: number; tout: number };
const SECS: Sec[] = [
  { id: "HOOK",    tin: 0.0,  tout: 4.0  },
  { id: "AGIT",    tin: 4.0,  tout: 8.8  },
  { id: "REVEAL",  tin: 8.8,  tout: 11.6 },
  { id: "BOMB",    tin: 11.6, tout: 16.3 },
  { id: "OBJ",     tin: 16.3, tout: 21.8 },
  { id: "PROOF",   tin: 21.8, tout: 25.8 },
  { id: "CLOSE",   tin: 25.8, tout: 30.0 },
];
const sec = (id: string) => SECS.find((s) => s.id === id)!;
const within = (f: number, a: number, b: number) => f >= a * FPS && f < b * FPS;
const sp = (f: number, tin: number) =>
  spring({ frame: f - tin * FPS, fps: FPS, config: { damping: 18, stiffness: 220, mass: 0.5 } });

// Shake helper for pain moments
const shake = (f: number, amp = 4) => ({
  x: (Math.sin(f * 0.9) + Math.sin(f * 1.7)) * amp,
  y: (Math.cos(f * 1.1) + Math.cos(f * 0.6)) * amp,
});

// ========== 1. HOOK PAIN ==========
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const s = sec("HOOK");
  if (!within(f, s.tin, s.tout)) return null;
  const t = sp(f, s.tin);
  const sk = shake(f, 3);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px", textAlign: "center" }}>
      <div style={{ opacity: t, transform: `translate(${sk.x}px, ${sk.y}px)` }}>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
          fontSize: 48, color: "#555", letterSpacing: "3px", marginBottom: 24,
        }}>HỎI THẬT NÀY...</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 900,
          fontSize: 132, color: INK, lineHeight: 1.05, letterSpacing: "-2px",
        }}>Bao lâu rồi bạn<br />còn dùng</div>
        <div style={{
          marginTop: 24, display: "inline-block",
          padding: "14px 38px", background: RED, color: "#FFF",
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 900,
          fontSize: 112, letterSpacing: "2px",
          transform: "rotate(-2deg)",
          boxShadow: "0 12px 0 " + INK,
        }}>ĐÈN CỔ LỖ SĨ?</div>
      </div>
    </AbsoluteFill>
  );
};

// ========== 2. AGITATE ==========
const Agit: React.FC = () => {
  const f = useCurrentFrame();
  const s = sec("AGIT");
  if (!within(f, s.tin, s.tout)) return null;
  const t = sp(f, s.tin);
  const items = [
    { i: 0, text: "MẮT MỎI",         emoji: "👁️" },
    { i: 1, text: "DÂY RỐI",         emoji: "🔌" },
    { i: 2, text: "CÚP ĐIỆN LÀ TÈO", emoji: "⚡" },
  ];
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
      <div style={{ textAlign: "center", opacity: t }}>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
          fontSize: 44, color: RED, letterSpacing: "6px", marginBottom: 60,
        }}>ĐANG PHẢI CHỊU ĐỰNG?</div>
        {items.map((it) => {
          const ti = sp(f, s.tin + 0.3 + it.i * 0.5);
          const x = interpolate(ti, [0, 1], [-120, 0]);
          return (
            <div key={it.i} style={{
              opacity: ti,
              transform: `translateX(${x}px)`,
              marginBottom: 36,
              display: "flex", alignItems: "center", gap: 32,
              justifyContent: "flex-start", paddingLeft: 60,
            }}>
              <div style={{
                fontSize: 110, width: 130, height: 130,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "#FFF", borderRadius: 28, border: `5px solid ${INK}`,
                boxShadow: "0 8px 0 " + INK,
              }}>{it.emoji}</div>
              <div style={{
                fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 900,
                fontSize: 100, color: INK, lineHeight: 1, letterSpacing: "-1px",
                position: "relative",
              }}>
                {it.text}
                {ti > 0.9 && (
                  <div style={{
                    position: "absolute", top: "50%", left: 0, right: -20, height: 8,
                    background: RED, transformOrigin: "left",
                    transform: `translateY(-50%) scaleX(${Math.min(1, (ti - 0.9) * 10)})`,
                  }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ========== 3. DISMISSIVE REVEAL ==========
const Reveal: React.FC = () => {
  const f = useCurrentFrame();
  const s = sec("REVEAL");
  if (!within(f, s.tin, s.tout)) return null;
  const t = sp(f, s.tin);
  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute", top: 260, left: 0, right: 0, textAlign: "center",
        opacity: t,
      }}>
        <div style={{
          display: "inline-block", padding: "14px 38px",
          background: INK, color: YELLOW,
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 900,
          fontSize: 78, letterSpacing: "1px", transform: "rotate(-1.5deg)",
        }}>TÔI VỨT HẾT.</div>
        <div style={{ height: 20 }} />
        <div style={{
          display: "inline-block",
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 900,
          fontSize: 92, color: INK, letterSpacing: "-1px",
        }}>THAY BẰNG <span style={{ color: RED }}>CÁI NÀY</span> →</div>
      </div>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        justifyContent: "center", alignItems: "flex-end", paddingBottom: 160,
      }}>
        <div style={{
          width: 720, height: 720,
          transform: `scale(${interpolate(t, [0, 1], [0.5, 1])}) rotate(${interpolate(t, [0, 1], [-12, 0])}deg)`,
          filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.35))",
        }}>
          <Img src={staticFile("aff_lamp/product.png")} style={{
            width: "100%", height: "100%", objectFit: "contain",
          }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ========== 4. VALUE BOMB ==========
const Bomb: React.FC = () => {
  const f = useCurrentFrame();
  const s = sec("BOMB");
  if (!within(f, s.tin, s.tout)) return null;
  const t = sp(f, s.tin);
  const localF = f - s.tin * FPS;
  const pulse = 1 + 0.04 * Math.sin(localF * 0.35);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
      <div style={{ textAlign: "center", opacity: t, transform: `scale(${pulse})` }}>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
          fontSize: 40, color: INK, letterSpacing: "6px", marginBottom: 20,
          padding: "8px 22px", background: YELLOW, display: "inline-block",
        }}>ĐIỀU KHÁC BIỆT</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 900,
          fontSize: 180, color: RED, lineHeight: 0.95, letterSpacing: "-4px",
          textShadow: "6px 6px 0 " + INK,
        }}>SẠC 1 LẦN</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 900,
          fontSize: 180, color: INK, lineHeight: 0.95, letterSpacing: "-4px",
          marginTop: 8,
        }}>DÙNG CẢ</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 900,
          fontSize: 260, color: INK, lineHeight: 0.9, letterSpacing: "-8px",
        }}><span style={{ background: YELLOW, padding: "4px 28px" }}>THÁNG</span></div>
        <div style={{
          marginTop: 36,
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500,
          fontSize: 44, color: "#555", letterSpacing: "3px",
        }}>— không phải nghe nhầm —</div>
      </div>
    </AbsoluteFill>
  );
};

// ========== 5. OBJECTION HANDLING ==========
const Obj: React.FC = () => {
  const f = useCurrentFrame();
  const s = sec("OBJ");
  if (!within(f, s.tin, s.tout)) return null;
  const t = sp(f, s.tin);
  const bullets = [
    { i: 0, text: "3 màu điều chỉnh" },
    { i: 1, text: "Bảo vệ mắt — không chói" },
    { i: 2, text: "Kẹp giường, bàn, kệ — đâu cũng được" },
    { i: 3, text: "Pin lithium chuẩn, sạc USB" },
  ];
  return (
    <AbsoluteFill>
      <div style={{
        position: "absolute", top: 180, left: 60, right: 60,
        opacity: t,
      }}>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 900,
          fontSize: 72, color: INK, letterSpacing: "-1px", marginBottom: 20,
        }}>BẠN SỢ THIẾU TÍNH NĂNG?</div>
        <div style={{ height: 6, background: RED, width: 160, marginBottom: 36 }} />
        {bullets.map((b) => {
          const ti = sp(f, s.tin + 0.3 + b.i * 0.4);
          return (
            <div key={b.i} style={{
              opacity: ti, transform: `translateX(${interpolate(ti, [0, 1], [-60, 0])}px)`,
              display: "flex", alignItems: "center", gap: 24,
              marginBottom: 26,
            }}>
              <div style={{
                width: 72, height: 72, background: GREEN, borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 44, color: "#FFF", fontWeight: 900,
                border: `4px solid ${INK}`,
                boxShadow: "0 6px 0 " + INK,
              }}>✓</div>
              <div style={{
                fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800,
                fontSize: 58, color: INK, letterSpacing: "-0.5px",
              }}>{b.text}</div>
            </div>
          );
        })}
      </div>
      <div style={{
        position: "absolute", bottom: 200, right: 80, width: 360, height: 360,
        opacity: t * 0.9,
      }}>
        <Img src={staticFile("aff_lamp/product.png")} style={{
          width: "100%", height: "100%", objectFit: "contain",
          transform: "rotate(8deg)",
        }} />
      </div>
    </AbsoluteFill>
  );
};

// ========== 6. SOCIAL PROOF ==========
const Proof: React.FC = () => {
  const f = useCurrentFrame();
  const s = sec("PROOF");
  if (!within(f, s.tin, s.tout)) return null;
  const t = sp(f, s.tin);
  const countUp = Math.floor(interpolate(
    f - s.tin * FPS, [0, FPS * 1.8], [0, 624],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  ));
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity: t }}>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
          fontSize: 42, color: "#555", letterSpacing: "6px",
        }}>NGƯỜI VIỆT ĐÃ CHỐT</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 900,
          fontSize: 360, color: RED, lineHeight: 0.9, letterSpacing: "-8px",
          textShadow: "8px 8px 0 " + INK,
          marginTop: 14,
        }}>{countUp}</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 900,
          fontSize: 78, color: INK, letterSpacing: "2px", marginTop: 4,
        }}>ĐƠN HÀNG</div>
        <div style={{ marginTop: 40, fontSize: 80, letterSpacing: 8 }}>
          <span style={{ color: YELLOW }}>★★★★</span><span style={{ color: "#888" }}>★</span>
        </div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
          fontSize: 52, color: INK, marginTop: 10, letterSpacing: "1px",
        }}>4.6 / 5 — thật 100%</div>
      </div>
    </AbsoluteFill>
  );
};

// ========== 7. URGENCY CLOSE ==========
const Close: React.FC = () => {
  const f = useCurrentFrame();
  const s = sec("CLOSE");
  if (!within(f, s.tin, s.tout)) return null;
  const t = sp(f, s.tin);
  const localF = f - s.tin * FPS;
  const bounce = Math.sin(localF * 0.35) * 16;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
      <div style={{ textAlign: "center", opacity: t }}>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
          fontSize: 42, color: "#555", letterSpacing: "6px", marginBottom: 6,
          textDecoration: "line-through",
        }}>giá gốc 250.000₫</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 900,
          fontSize: 300, color: RED, lineHeight: 0.9, letterSpacing: "-8px",
          textShadow: "8px 8px 0 " + INK,
        }}>125K</div>
        <div style={{
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 800,
          fontSize: 56, color: INK, marginTop: 16, letterSpacing: "-0.5px",
        }}>= <span style={{ background: YELLOW, padding: "2px 14px" }}>3 ly trà sữa</span></div>
        <div style={{
          marginTop: 60, display: "inline-block",
          padding: "32px 64px", background: RED, color: "#FFF",
          border: `6px solid ${INK}`,
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 900,
          fontSize: 74, letterSpacing: "3px",
          boxShadow: "0 14px 0 " + INK,
          transform: `translateY(${bounce * 0.3}px)`,
        }}>BẤM LINK ĐỎ ↓</div>
        <div style={{
          marginTop: 24,
          fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
          fontSize: 38, color: INK, letterSpacing: "1px",
        }}>hết đợt này · đừng kêu tôi 😤</div>
      </div>
    </AbsoluteFill>
  );
};

// Flash on cut
const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  let s = 0;
  for (const sec of SECS) {
    const d = t - sec.tin;
    if (d >= 0 && d < 0.14) s = Math.max(s, 1 - d / 0.14);
  }
  if (s <= 0) return null;
  return <div style={{ position: "absolute", inset: 0, background: "#FFF", opacity: s * 0.6 }} />;
};

const BgPaper: React.FC = () => {
  const f = useCurrentFrame();
  const off = Math.sin(f * 0.04) * 4;
  return (
    <div style={{ position: "absolute", inset: 0, background: BG }}>
      <div style={{
        position: "absolute", inset: -40,
        backgroundImage: `radial-gradient(circle at 30% 20%, rgba(255,208,25,0.22) 0%, transparent 45%),
                          radial-gradient(circle at 70% 80%, rgba(229,43,43,0.13) 0%, transparent 48%)`,
        transform: `translate(${off}px, ${off}px)`,
      }} />
    </div>
  );
};

// Bottom progress bar
const Progress: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const p = Math.min(1, t / 30);
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 12, background: "rgba(21,11,4,0.15)" }}>
      <div style={{ width: `${p * 100}%`, height: "100%", background: RED }} />
    </div>
  );
};

export const AffLedLamp: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <BgPaper />
    <Hook />
    <Agit />
    <Reveal />
    <Bomb />
    <Obj />
    <Proof />
    <Close />
    <Flash />
    <Progress />
    <Audio src={staticFile("aff_lamp/narration.mp3")} volume={1.0} />
  </AbsoluteFill>
);
