import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";

loadBeVietnamPro("normal", {
  weights: ["300", "400", "600", "700", "800", "900"],
  subsets: ["vietnamese", "latin", "latin-ext"],
});

// Affiliate Product Video Template (TikTok 9:16)
// For licensed product footage: 1688 factory media kit, stock purchased, own-filmed.
// Use with AffProductDemoFixture props or override via defaultProps in Root.

const FPS = 30;

export type AffBenefit = { icon?: string; text: string };

export type AffProductProps = {
  // Footage — licensed product video (factory/stock/owned)
  productVideoSrc: string;
  productVideoStart?: number;

  // Hook — opening question/claim (0-3s)
  hookText: string;

  // Headline — main selling message (3-6s)
  headlineText: string;
  headlineAccent?: string; // word to emphasize

  // Benefits — 3-4 short bullets (6-20s)
  benefits: AffBenefit[];

  // Price point
  priceOriginal?: string; // "599K"
  pricePromo?: string;    // "299K"
  priceLabel?: string;    // "GIÁ SỐC HÔM NAY"

  // CTA outro
  ctaText: string;        // "GIỎ HÀNG ↓"
  ctaSubtext?: string;    // "Bấm vào giỏ hàng bên dưới"
  shopName?: string;

  // Audio
  voiceoverSrc?: string;  // Vietnamese TTS narration
  musicSrc?: string;      // Background music
  musicVolume?: number;
};

// ─── Subcomponents ────────────────────────────

const ProductBackground: React.FC<{ src: string; start?: number }> = ({ src, start = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.02, 1.12]);
  return (
    <AbsoluteFill>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
          filter: "brightness(0.75) saturate(1.15) contrast(1.08)",
        }}
      >
        <OffthreadVideo
          src={src.startsWith("http") ? src : staticFile(src)}
          muted
          startFrom={start}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </AbsoluteFill>
  );
};

const HookBanner: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const appear = spring({ frame, fps: FPS, config: { damping: 14, stiffness: 200 } });
  const y = interpolate(appear, [0, 1], [-40, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 140 }}>
      <div
        style={{
          background: "rgba(220, 38, 38, 0.96)",
          padding: "22px 44px",
          borderRadius: 14,
          transform: `translateY(${y}px)`,
          opacity: appear,
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          maxWidth: 900,
        }}
      >
        <div
          style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontWeight: 900,
            fontSize: 56,
            color: "#FFFFFF",
            textAlign: "center",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            lineHeight: 1.1,
            textShadow: "0 3px 10px rgba(0,0,0,0.4)",
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Headline: React.FC<{ text: string; accent?: string }> = ({ text, accent }) => {
  const frame = useCurrentFrame();
  const appear = spring({ frame, fps: FPS, config: { damping: 14, stiffness: 180 } });
  const y = interpolate(appear, [0, 1], [30, 0]);

  let content: React.ReactNode = text;
  if (accent && text.includes(accent)) {
    const [before, after] = text.split(accent);
    content = (
      <>
        {before}
        <span style={{ color: "#FBBF24", fontWeight: 900 }}>{accent}</span>
        {after}
      </>
    );
  }

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          background: "rgba(0,0,0,0.82)",
          padding: "40px 60px",
          borderRadius: 18,
          transform: `translateY(${y}px)`,
          opacity: appear,
          maxWidth: 960,
        }}
      >
        <div
          style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontWeight: 800,
            fontSize: 72,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.2,
            textShadow: "0 4px 14px rgba(0,0,0,0.6)",
          }}
        >
          {content}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const BenefitsList: React.FC<{ benefits: AffBenefit[] }> = ({ benefits }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
      <div
        style={{
          background: "rgba(0,0,0,0.88)",
          padding: "44px 50px",
          borderRadius: 20,
          width: "100%",
          maxWidth: 920,
        }}
      >
        {benefits.map((b, i) => {
          const appearFrame = i * 8;
          const sp = spring({
            frame: frame - appearFrame,
            fps: FPS,
            config: { damping: 14, stiffness: 180 },
          });
          const x = interpolate(sp, [0, 1], [-40, 0]);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                marginBottom: i < benefits.length - 1 ? 28 : 0,
                opacity: sp,
                transform: `translateX(${x}px)`,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  background: "#22C55E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  fontWeight: 900,
                  color: "#FFFFFF",
                }}
              >
                {b.icon ?? "✓"}
              </div>
              <div
                style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontWeight: 700,
                  fontSize: 48,
                  color: "#FFFFFF",
                  lineHeight: 1.25,
                  textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                }}
              >
                {b.text}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const PriceCard: React.FC<{
  original?: string;
  promo?: string;
  label?: string;
}> = ({ original, promo, label }) => {
  const frame = useCurrentFrame();
  const sp = spring({ frame, fps: FPS, config: { damping: 12, stiffness: 140 } });
  const scale = interpolate(sp, [0, 1], [0.7, 1.0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
          padding: "44px 80px",
          borderRadius: 24,
          transform: `scale(${scale})`,
          opacity: sp,
          boxShadow: "0 16px 50px rgba(220,38,38,0.5)",
          textAlign: "center",
        }}
      >
        {label && (
          <div
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 700,
              fontSize: 34,
              color: "#FEF3C7",
              letterSpacing: "4px",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            {label}
          </div>
        )}
        {original && (
          <div
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 500,
              fontSize: 44,
              color: "#FECACA",
              textDecoration: "line-through",
              marginBottom: 10,
            }}
          >
            {original}
          </div>
        )}
        {promo && (
          <div
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 900,
              fontSize: 128,
              color: "#FFFFFF",
              lineHeight: 1,
              textShadow: "0 6px 20px rgba(0,0,0,0.5)",
            }}
          >
            {promo}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const CtaOutro: React.FC<{
  text: string;
  subtext?: string;
  shopName?: string;
}> = ({ text, subtext, shopName }) => {
  const frame = useCurrentFrame();
  const appear = spring({ frame, fps: FPS, config: { damping: 12, stiffness: 150 } });
  const pulse = 1 + 0.04 * Math.sin(frame * 0.25);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity: appear }}>
        {shopName && (
          <div
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 600,
              fontSize: 34,
              color: "#FBBF24",
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: 40,
              textShadow: "0 3px 10px rgba(0,0,0,0.7)",
            }}
          >
            {shopName}
          </div>
        )}
        <div
          style={{
            display: "inline-block",
            background: "#FBBF24",
            padding: "40px 90px",
            borderRadius: 20,
            transform: `scale(${pulse})`,
            boxShadow: "0 16px 50px rgba(251,191,36,0.5)",
          }}
        >
          <div
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 900,
              fontSize: 92,
              color: "#0A0A0A",
              letterSpacing: "2px",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {text}
          </div>
        </div>
        {subtext && (
          <div
            style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 600,
              fontSize: 38,
              color: "#FFFFFF",
              marginTop: 32,
              textShadow: "0 3px 10px rgba(0,0,0,0.7)",
            }}
          >
            {subtext}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ─── Main composition ────────────────────────────
// Layout (30s video, adjust durationInFrames in Root.tsx):
//   0-3s   : Hook banner (problem/question)
//   3-7s   : Headline (main message)
//   7-18s  : Benefits list
//   18-25s : Price card
//   25-30s : CTA outro

export const AffProductTemplate: React.FC<AffProductProps> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <ProductBackground src={props.productVideoSrc} start={props.productVideoStart} />

      {/* Dim overlay */}
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.28)" }} />

      <Sequence from={0} durationInFrames={3 * FPS}>
        <HookBanner text={props.hookText} />
      </Sequence>

      <Sequence from={3 * FPS} durationInFrames={4 * FPS}>
        <Headline text={props.headlineText} accent={props.headlineAccent} />
      </Sequence>

      <Sequence from={7 * FPS} durationInFrames={11 * FPS}>
        <BenefitsList benefits={props.benefits} />
      </Sequence>

      <Sequence from={18 * FPS} durationInFrames={7 * FPS}>
        <PriceCard
          original={props.priceOriginal}
          promo={props.pricePromo}
          label={props.priceLabel}
        />
      </Sequence>

      <Sequence from={25 * FPS} durationInFrames={5 * FPS}>
        <CtaOutro
          text={props.ctaText}
          subtext={props.ctaSubtext}
          shopName={props.shopName}
        />
      </Sequence>

      {props.voiceoverSrc && (
        <Audio
          src={props.voiceoverSrc.startsWith("http") ? props.voiceoverSrc : staticFile(props.voiceoverSrc)}
          volume={0.95}
        />
      )}
      {props.musicSrc && (
        <Audio
          src={props.musicSrc.startsWith("http") ? props.musicSrc : staticFile(props.musicSrc)}
          volume={props.musicVolume ?? 0.12}
        />
      )}
    </AbsoluteFill>
  );
};

// Example fixture — shows prop shape. Override in Root.tsx defaultProps per video.
export const affProductDemoFixture: AffProductProps = {
  productVideoSrc: "im_lang/lone_walker_night_street.mp4", // placeholder — swap to licensed product clip
  hookText: "Đau lưng mỗi sáng?",
  headlineText: "Đệm massage giải tỏa 99% đau mỏi",
  headlineAccent: "99%",
  benefits: [
    { icon: "✓", text: "15 phút mỗi ngày, hết nhức mỏi" },
    { icon: "✓", text: "6 chế độ rung + nhiệt hồng ngoại" },
    { icon: "✓", text: "Pin 8 tiếng, sạc USB-C" },
    { icon: "✓", text: "Bảo hành 12 tháng chính hãng" },
  ],
  priceOriginal: "599K",
  pricePromo: "299K",
  priceLabel: "GIÁ SỐC HÔM NAY",
  ctaText: "GIỎ HÀNG ↓",
  ctaSubtext: "Bấm vào giỏ hàng bên dưới để đặt ngay",
  shopName: "SHOP SỨC KHOẺ",
  musicSrc: "bay_cuu_music.mp3",
  musicVolume: 0.08,
};
