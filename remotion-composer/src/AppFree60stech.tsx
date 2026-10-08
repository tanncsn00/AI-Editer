import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import beatsData from "./afs_beats.json";
import T from "./afs_timings.json";
import wordsData from "./afs_words.json";

loadBeVietnamPro("normal", { weights: ["400", "600", "700", "800", "900"], subsets: ["vietnamese", "latin", "latin-ext"] });

const FPS = 30;
const FONT = "'Be Vietnam Pro', 'Inter', system-ui, sans-serif";
const BG = "#0B0B10";
const ACCENT = "#7C6CFF";
const YELLOW = "#FFD43B";
const RED = "#FF4D5E";
const TEXT = "#F5F5F7";
const MUTED = "#9A9AAE";
const EMPHASIS = YELLOW;
const BODY = "#F5F5F0";

type BeatInfo = { index: number; name: string; start: number; duration: number };
const beats = (beatsData as { beats: BeatInfo[]; total_duration: number }).beats;
const at = (name: string) => {
  const b = beats.find((x) => x.name === name)!;
  return { from: Math.round(b.start * FPS), dur: Math.round(b.duration * FPS) };
};
const E = T as Record<string, Record<string, number>>;
const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

type Media = { src: string; kind: "video" | "img"; focus?: string; z?: [number, number]; gray?: boolean; swapAt?: string; swapSrc?: string; swapFocus?: string };
type Item = { key: string; text: string; tone?: "old" | "no" | "hero" };
type Stamp = { key: string; text: string; color?: string; size?: number };
type SceneSpec = { eyebrow?: string; title: string; media?: Media; items: Item[]; layout: "chips" | "list"; stamp?: Stamp };

const SCENES: Record<string, SceneSpec> = {
  hook: {
    eyebrow: "60stech Studio", title: "Slide + kịch bản = video",
    media: { src: "afs/c_result.mp4", kind: "video", focus: "50% 45%" },
    layout: "chips",
    items: [{ key: "gv", text: "Giáo viên" }, { key: "cr", text: "Creator" }, { key: "vp", text: "Dân văn phòng" }, { key: "ppt", text: "📊 PowerPoint", tone: "hero" }, { key: "kb", text: "📝 Kịch bản", tone: "hero" }],
    stamp: { key: "khong", text: "KHÔNG CẦN DỰNG", color: RED, size: 92 },
  },
  free: {
    title: "Ném nội dung vào là xong",
    media: { src: "afs/img_editor.png", kind: "img", focus: "45% 40%" },
    layout: "list",
    items: [{ key: "nem", text: "📥 Ném nội dung vào" }, { key: "con", text: "⚙️ App làm phần còn lại" }],
    stamp: { key: "mp", text: "MIỄN PHÍ", color: YELLOW, size: 150 },
  },
  pain: {
    eyebrow: "Trước đây", title: "PowerPoint → video",
    media: { src: "afs/c_family.mp4", kind: "video", gray: true },
    layout: "chips",
    items: [
      { key: "xuat", text: "Xuất từng slide", tone: "old" }, { key: "thu", text: "Thu âm", tone: "old" }, { key: "cat", text: "Cắt lời", tone: "old" },
      { key: "canh", text: "Canh thời gian", tone: "old" }, { key: "them", text: "Thêm phụ đề", tone: "old" }, { key: "keo", text: "Kéo timeline", tone: "old" },
    ],
    stamp: { key: "p30", text: "30 PHÚT GIẢNG = CẢ BUỔI DỰNG", color: RED, size: 64 },
  },
  turn: {
    title: "Đã có PowerPoint?",
    media: { src: "afs/img_editor.png", kind: "img", focus: "50% 45%", z: [1.05, 1.2] },
    layout: "chips",
    items: [{ key: "ppt", text: "📊 PowerPoint", tone: "hero" }],
    stamp: { key: "khac", text: "KHÁC HẲN", color: YELLOW, size: 120 },
  },
  gv1: {
    eyebrow: "Giáo viên", title: "Bài giảng PowerPoint → video",
    media: { src: "afs/c_import.mp4", kind: "video", focus: "50% 40%" },
    layout: "list",
    items: [{ key: "slide", text: "🎬 Mỗi slide = một cảnh" }, { key: "ghichu", text: "📝 Ghi chú slide = lời giảng" }],
  },
  gv2: {
    eyebrow: "Giáo viên", title: "Chuẩn bị bài như bình thường",
    media: { src: "afs/c_paste.mp4", kind: "video", focus: "50% 45%", z: [1.1, 1.3] },
    layout: "list",
    items: [{ key: "notes", text: "① Viết lời vào phần Notes" }, { key: "nem", text: "② Ném file .pptx vào app" }],
    stamp: { key: "xong", text: "XONG.", color: YELLOW, size: 150 },
  },
  gv3: {
    title: "Giữ nguyên bài giảng",
    media: { src: "afs/c_family.mp4", kind: "video", focus: "40% 45%" },
    layout: "list",
    items: [{ key: "phong", text: "🔤 Giữ phông chữ" }, { key: "anim", text: "✨ Animation → hiệu ứng xuất hiện" }, { key: "loidoc", text: "🎙 Mỗi slide có lời đọc riêng" }],
  },
  sync1: {
    eyebrow: "Thứ tôi thích nhất", title: "Hình hiện đúng lúc được nhắc",
    media: { src: "afs/c_effect.mp4", kind: "video", focus: "60% 50%" },
    layout: "list",
    items: [{ key: "hinh", text: "🖼 Một tấm hình" }, { key: "dung", text: "⏱ Hiện đúng lúc giọng đọc nhắc tới" }, { key: "keo", text: "Kéo timeline", tone: "no" }, { key: "soi", text: "Soi từng mili-giây", tone: "no" }],
  },
  sync2: {
    title: "Giọng tới đâu, hình tới đó",
    media: { src: "afs/c_effect2.mp4", kind: "video", focus: "85% 55%", z: [1.25, 1.5] },
    layout: "list",
    items: [
      { key: "cau", text: "Hiện khi: đọc tới câu / từ", tone: "hero" }, { key: "giong", text: "🎙 Giọng nói tới đâu" }, { key: "hinh", text: "🖼 Hình xuất hiện tới đó" },
      { key: "nhin", text: "Như có người dựng từng khung" }, { key: "thucte", text: "Timeline: gần như không đụng" },
    ],
  },
  subs: {
    title: "Phụ đề có luôn",
    media: { src: "afs/c_subs.mp4", kind: "video", focus: "45% 60%", z: [1.1, 1.25] },
    layout: "chips",
    items: [{ key: "cau", text: "Theo câu" }, { key: "tungtu", text: "Từng từ" }, { key: "kara", text: "Karaoke" }, { key: "go", text: "Gõ phím" }],
  },
  voices: {
    title: "Rất nhiều giọng đọc",
    media: { src: "afs/c_voices.mp4", kind: "video", focus: "45% 25%", z: [1.3, 1.5] },
    layout: "chips",
    items: [{ key: "nn", text: "Ngôn ngữ" }, { key: "gt", text: "Giới tính" }, { key: "md", text: "Mục đích" }, { key: "nb", text: "🎙 Giọng nhân bản của bạn", tone: "hero" }],
  },
  creator: {
    eyebrow: "Creator", title: "Template dựng sẵn",
    media: { src: "afs/img_terminal.png", kind: "img", focus: "40% 40%" },
    layout: "chips",
    items: [
      { key: "code", text: "Mẹo code" }, { key: "ai", text: "Tin AI" }, { key: "review", text: "Review thiết bị" },
      { key: "top", text: "Top 5" }, { key: "bm", text: "Cảnh báo bảo mật" }, { key: "tut", text: "Tutorial" },
    ],
  },
  ratio: {
    title: "Dọc hay ngang đều có",
    media: { src: "afs/img_result_vertical.png", kind: "img", focus: "50% 45%", z: [1.3, 1.4], swapAt: "ngang", swapSrc: "afs/img_result_tet.png", swapFocus: "50% 50%" },
    layout: "list",
    items: [{ key: "tiktok", text: "📱 TikTok · Reels · Shorts — dọc 9:16" }, { key: "yt", text: "🖥 YouTube · bài giảng — ngang 16:9" }],
  },
  queue: {
    title: "Làm nhiều video cùng lúc",
    media: { src: "afs/c_queue.mp4", kind: "video", focus: "75% 10%", z: [1.2, 1.4], swapAt: "mp4", swapSrc: "afs/img_result_vertical.png", swapFocus: "20% 50%" },
    layout: "list",
    items: [{ key: "hd", text: "📋 Cho vào hàng đợi" }, { key: "nen", text: "⚙️ App tự dựng ở nền" }, { key: "mp4", text: "📁 Video MP4 nằm sẵn trong thư mục" }],
  },
  brand: {
    title: "Giữ phong cách riêng",
    media: { src: "afs/c_theme.mp4", kind: "video", focus: "85% 40%", z: [1.2, 1.4] },
    layout: "chips",
    items: [{ key: "font", text: "Font riêng" }, { key: "theme", text: "Theme" }, { key: "logo", text: "Logo" }, { key: "tpl", text: "💾 Lưu thành template", tone: "hero" }],
  },
  sum: {
    eyebrow: "Nói đơn giản", title: "Có gì là ra video",
    layout: "list",
    items: [
      { key: "s1", text: "Slide → video" }, { key: "s2", text: "Kịch bản → video" },
      { key: "s3", text: "Giọng đọc → phụ đề tự chạy" }, { key: "s4", text: "Hình → hiện đúng lúc cần" },
    ],
    stamp: { key: "tl", text: "KHÔNG VẬT NHAU VỚI TIMELINE", color: RED, size: 60 },
  },
  who: {
    eyebrow: "Không phải app cho editor", title: "Dành cho người có nội dung",
    media: { src: "afs/img_result_tet.png", kind: "img", focus: "50% 50%" },
    layout: "chips",
    items: [{ key: "gv", text: "Giáo viên · E-learning" }, { key: "cr", text: "Creator · TikTok" }, { key: "tut", text: "Người làm tutorial" }, { key: "vp", text: "Văn phòng · thuyết trình" }],
  },
};

const pop = (f: number, e: number, d = 12) => ({
  opacity: interpolate(f, [e, e + d * 0.6], [0, 1], clamp),
  transform: "scale(" + interpolate(f, [e, e + d * 0.65, e + d], [0.7, 1.08, 1], clamp) + ")",
});

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 90) * 60;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 900px 700px at " + (50 + drift / 10) + "% 18%, " + ACCENT + "33 0%, transparent 65%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 800px 600px at 50% 92%, " + ACCENT + "1F 0%, transparent 60%)" }} />
    </AbsoluteFill>
  );
};

const Header: React.FC<{ eyebrow?: string; title: string }> = ({ eyebrow, title }) => {
  const f = useCurrentFrame();
  const s = { opacity: interpolate(f, [0, 8], [0, 1], clamp), transform: "translateY(" + interpolate(f, [0, 8], [24, 0], clamp) + "px)" };
  return (
    <div style={{ position: "absolute", top: 150, left: 60, right: 60, textAlign: "center", ...s }}>
      {eyebrow ? <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 38, color: ACCENT, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>{eyebrow}</div> : null}
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 74, lineHeight: 1.12, color: TEXT }}>{title}</div>
    </div>
  );
};

const MediaCard: React.FC<{ media: Media; swapFrame?: number }> = ({ media, swapFrame }) => {
  const f = useCurrentFrame();
  const swapped = swapFrame !== undefined && f >= swapFrame;
  const src = swapped && media.swapSrc ? media.swapSrc : media.src;
  const focus = swapped && media.swapFocus ? media.swapFocus : media.focus ?? "50% 50%";
  const [z0, z1] = media.z ?? [1.15, 1.3];
  const local = swapped ? f - swapFrame! : f;
  const scale = interpolate(local, [0, 360], [z0, z1], clamp);
  const appear = interpolate(f, [0, 10], [0, 1], clamp);
  const style: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform: "scale(" + scale + ")", transformOrigin: focus, filter: media.gray ? "grayscale(1) brightness(0.55)" : "none" };
  return (
    <div style={{ position: "absolute", top: 430, left: 60, width: 960, height: 640, borderRadius: 28, overflow: "hidden", border: "3px solid " + ACCENT, boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 60px " + ACCENT + "40", opacity: appear, background: "#000" }}>
      {media.kind === "video" && !swapped ? <OffthreadVideo src={staticFile(src)} muted style={style} /> : <Img src={staticFile(src)} style={style} />}
    </div>
  );
};

const chipStyle = (tone?: Item["tone"]): React.CSSProperties => ({
  fontFamily: FONT, fontWeight: 700, fontSize: 40, padding: "16px 30px", borderRadius: 999,
  color: tone === "old" ? MUTED : TEXT,
  background: tone === "hero" ? ACCENT : tone === "no" ? RED + "22" : "#1B1B26",
  border: "2px solid " + (tone === "hero" ? ACCENT : tone === "no" ? RED : "#34344A"),
  textDecoration: tone === "old" || tone === "no" ? "line-through" : "none",
  textDecorationColor: RED, textDecorationThickness: 4,
});

const Items: React.FC<{ spec: SceneSpec; e: Record<string, number>; top: number }> = ({ spec, e, top }) => {
  const f = useCurrentFrame();
  const list = spec.layout === "list";
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, display: "flex", flexDirection: list ? "column" : "row", flexWrap: "wrap", justifyContent: "center", alignItems: list ? "stretch" : "center", gap: list ? 18 : 18 }}>
      {spec.items.map((it) => (
        <div key={it.key} style={{ ...chipStyle(it.tone), ...(list ? { borderRadius: 20, textAlign: "left", fontSize: spec.media ? 40 : 54, padding: spec.media ? "18px 30px" : "30px 36px" } : {}), ...pop(f, e[it.key] ?? 0) }}>
          {it.tone === "no" ? "✕ " : ""}{it.text}
        </div>
      ))}
    </div>
  );
};

const StampLayer: React.FC<{ stamp: Stamp; e: number }> = ({ stamp, e }) => {
  const f = useCurrentFrame();
  if (f < e) return null;
  const sp = spring({ frame: f - e, fps: FPS, config: { damping: 11, stiffness: 180, mass: 0.7 } });
  const color = stamp.color ?? YELLOW;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", top: -200 }}>
      <div style={{
        fontFamily: FONT, fontWeight: 900, fontSize: stamp.size ?? 120, color, padding: "18px 44px", border: "10px solid " + color, borderRadius: 24,
        background: "rgba(11,11,16,0.88)", transform: "rotate(-6deg) scale(" + interpolate(sp, [0, 1], [2.2, 1]) + ")", opacity: Math.min(1, sp * 1.5),
        textAlign: "center", maxWidth: 940, lineHeight: 1.1, boxShadow: "0 0 80px " + color + "66", textShadow: "0 0 30px " + color + "88",
      }}>{stamp.text}</div>
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ name: string }> = ({ name }) => {
  const spec = SCENES[name];
  const e = E[name] ?? {};
  return (
    <AbsoluteFill>
      <Header eyebrow={spec.eyebrow} title={spec.title} />
      {spec.media ? <MediaCard media={spec.media} swapFrame={spec.media.swapAt ? e[spec.media.swapAt] : undefined} /> : null}
      <Items spec={spec} e={e} top={spec.media ? 1110 : 470} />
      {spec.stamp ? <StampLayer stamp={spec.stamp} e={e[spec.stamp.key] ?? 0} /> : null}
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const e = E.cta ?? {};
  const pulse = 1 + Math.max(0, Math.sin((f - (e.follow ?? 0)) / 5)) * 0.05;
  return (
    <AbsoluteFill>
      <StampLayer stamp={{ key: "mp", text: "MIỄN PHÍ", color: YELLOW, size: 160 }} e={e.mp ?? 0} />
      <div style={{ position: "absolute", top: 1020, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ ...chipStyle(), fontSize: 44, ...pop(f, e.zalo ?? 0) }}>🔗 Link tải trong nhóm Zalo</div>
        <div style={{ ...chipStyle("hero"), fontSize: 46, ...pop(f, e.bio ?? 0) }}>Bio → Nhóm Zalo → Tải về</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: BG, background: YELLOW, padding: "24px 70px", borderRadius: 999, marginTop: 30, ...pop(f, e.follow ?? 0), transform: "scale(" + pulse + ")" }}>▶ FOLLOW</div>
      </div>
    </AbsoluteFill>
  );
};

type Word = { word: string; start: number; end: number };
const words = wordsData as Word[];
type Sentence = { words: Word[]; start: number; end: number };
const SENTENCES: Sentence[] = (() => {
  const out: Sentence[] = [];
  let buf: Word[] = [];
  for (const w of words) {
    buf.push(w);
    if (/[.!?…:]$/.test(w.word) || (/,$/.test(w.word) && buf.length >= 8)) {
      out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
      buf = [];
    }
  }
  if (buf.length) out.push({ words: buf, start: buf[0].start, end: buf[buf.length - 1].end });
  return out;
})();

const EMPH = new Set<string>([
  "miễn", "phí.", "phí", "powerpoint.", "powerpoint", "powerpoint,", "slide", "slide…", "video", "video.", "timeline", "timeline…", "xong.",
  "template", "template.", "notes.", ".pptx", "karaoke.", "mp4.", "follow", "creator", "zalo,", "zalo", "khác", "hẳn.",
]);
const isEmph = (w: string): boolean => EMPH.has(w.toLowerCase());

const Caption: React.FC<{ hide: boolean }> = ({ hide }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let active: Sentence | null = null;
  for (let i = 0; i < SENTENCES.length; i++) {
    const s = SENTENCES[i];
    const next = SENTENCES[i+1];
    const boundary = next ? next.start : s.end + 0.7;
    if (t >= s.start - 0.15 && t < boundary) { active = s; break; }
  }
  if (!active || hide) return null;
  const LEAD = 0.1;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 160 }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", maxWidth: 920, padding: "0 60px" }}>
        {active.words.map((w, i) => {
          const appearAt = Math.max(0, w.start - LEAD);
          const sp = spring({ frame: frame - appearAt * FPS, fps: FPS, config: { damping: 14, stiffness: 230, mass: 0.4 } });
          const visible = t >= appearAt;
          const y = interpolate(sp, [0, 1], [12, 0]);
          const blur = interpolate(sp, [0, 1], [4, 0]);
          const emph = isEmph(w.word);
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', 'Inter', system-ui, sans-serif",
              fontWeight: emph ? 800 : 600,
              fontSize: emph ? 64 : 54,
              color: emph ? EMPHASIS : BODY,
              textShadow: emph ? "0 0 26px rgba(255,212,59,0.55), 0 4px 14px rgba(0,0,0,0.95)" : "0 3px 12px rgba(0,0,0,0.95)",
              opacity: visible ? sp : 0,
              transform: `translateY(${y}px)`,
              filter: `blur(${blur}px)`,
              letterSpacing: emph ? "0.4px" : "0",
              lineHeight: 1.3,
            }}>{w.word}</span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SFX: { beat: string; key: string; src: string; vol: number }[] = [
  { beat: "hook", key: "khong", src: "afs/boom.mp3", vol: 0.45 },
  { beat: "free", key: "mp", src: "afs/boom.mp3", vol: 0.5 },
  { beat: "pain", key: "p30", src: "afs/boom.mp3", vol: 0.4 },
  { beat: "turn", key: "khac", src: "afs/whoosh.mp3", vol: 0.5 },
  { beat: "gv2", key: "xong", src: "afs/ding.mp3", vol: 0.45 },
  { beat: "sum", key: "tl", src: "afs/boom.mp3", vol: 0.4 },
  { beat: "cta", key: "mp", src: "afs/boom.mp3", vol: 0.5 },
  { beat: "cta", key: "follow", src: "afs/pop.mp3", vol: 0.6 },
];

export const AppFree60stech: React.FC<{ bgm?: boolean }> = ({ bgm = true }) => (
  <AbsoluteFill style={{ background: BG }}>
    <Backdrop />
    <Audio src={staticFile("afs/voice.mp3")} />
    {bgm ? <Audio src={staticFile("afs/bgm.mp3")} volume={0.12} /> : null}
    {SFX.map((s, i) => (
      <Sequence key={"sfx" + i} from={at(s.beat).from + (E[s.beat]?.[s.key] ?? 0)}>
        <Audio src={staticFile(s.src)} volume={s.vol} />
      </Sequence>
    ))}
    {Object.keys(SCENES).map((name) => {
      const { from, dur } = at(name);
      return (
        <Sequence key={name} from={from} durationInFrames={dur}>
          <Scene name={name} />
        </Sequence>
      );
    })}
    <Sequence from={at("cta").from} durationInFrames={at("cta").dur}>
      <Cta />
    </Sequence>
    <Caption hide={false} />
  </AbsoluteFill>
);
