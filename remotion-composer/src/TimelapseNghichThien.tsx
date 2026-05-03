/**
 * TimelapseNghichThien v2 — clean version:
 *   - My TTS (EverAI ductrong) instead of scraped audio
 *   - bay_cuu_music orchestral background
 *   - NO top-left brand badge, NO top-right chapter label
 *   - Just scene image + bottom caption + opening title
 */

import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadBeVietnamPro } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

loadBeVietnamPro("normal", { weights: ["300","400","600","700","800"], subsets: ["vietnamese","latin"] });
loadPlayfair("normal", { weights: ["400","700"], subsets: ["latin"] });

const FPS = 30;

type Scene = { id: string; tin: number; tout: number };
const SCENES: Scene[] = [
  { id: "S01", tin: 0.0,  tout: 5.4  },
  { id: "S02", tin: 5.4,  tout: 14.3 },
  { id: "S03", tin: 14.3, tout: 19.8 },
  { id: "S04", tin: 19.8, tout: 25.6 },
  { id: "S05", tin: 25.6, tout: 32.3 },
  { id: "S06", tin: 32.3, tout: 38.2 },
  { id: "S07", tin: 38.2, tout: 43.8 },
  { id: "S08", tin: 43.8, tout: 48.3 },
  { id: "S09", tin: 48.3, tout: 53.3 },
  { id: "S10", tin: 53.3, tout: 57.6 },
  { id: "S11", tin: 57.6, tout: 61.6 },
  { id: "S12", tin: 61.6, tout: 68.3 },
  { id: "S13", tin: 68.3, tout: 72.6 },
  { id: "S14", tin: 72.6, tout: 78.3 },
  { id: "S15", tin: 78.3, tout: 83.0 },
];

type Sub = { tin: number; tout: number; text: string; emph?: string[] };
const SUBS: Sub[] = [
  { tin: 0.4,  tout: 5.4,  text: "Trong vòng ba đời của một gia tộc, ắt sẽ giáng sinh một kẻ nghịch thiên cải mệnh.",
    emph: ["nghịch", "thiên", "cải", "mệnh."] },
  { tin: 5.6,  tout: 10.8, text: "Chí tâm mật ngầm, hành sự dị biệt — đi những nước cờ không ai dám đi.",
    emph: ["không", "ai", "dám", "đi."] },
  { tin: 11.0, tout: 14.3, text: "Tự tay dựng nên cơ đồ từ hai bàn tay trắng.",
    emph: ["hai", "bàn", "tay", "trắng."] },
  { tin: 14.5, tout: 19.8, text: "Thuở thiếu thời — vỏ bọc trầm mặc, nội tâm khép kín.",
    emph: ["trầm", "mặc,", "khép", "kín."] },
  { tin: 20.0, tout: 25.6, text: "Đứng trước ngã rẽ do dự, nhún nhường, không tranh không đoạt với đời.",
    emph: ["do", "dự,", "không", "tranh"] },
  { tin: 25.8, tout: 32.3, text: "Nhưng khi đã làm nên đại sự — tốc độ bứt phá kinh hoàng nhất.",
    emph: ["bứt", "phá", "kinh", "hoàng."] },
  { tin: 32.5, tout: 38.2, text: "Vài kiếp nạn sinh tử — sự nghiệp vùi dập, bạn bè đâm sau lưng,",
    emph: ["vùi", "dập,", "đâm", "sau", "lưng,"] },
  { tin: 38.4, tout: 43.8, text: "tình cảm phản trắc — lột xác như thay xương đổi thịt.",
    emph: ["lột", "xác", "thay", "xương"] },
  { tin: 44.0, tout: 48.3, text: "Phần yếu hèn bị giết chết. Nội tâm được đúc lại bằng thép nguội.",
    emph: ["giết", "chết.", "thép", "nguội."] },
  { tin: 48.5, tout: 53.3, text: "Ánh mắt tĩnh lặng — giấu đầy sát khí của kẻ từng đi qua dông bão.",
    emph: ["sát", "khí", "dông", "bão."] },
  { tin: 53.5, tout: 57.6, text: "Ra tay sát phạt quyết đoán, tuyệt đối không lưu tình.",
    emph: ["sát", "phạt", "không", "lưu", "tình."] },
  { tin: 57.8, tout: 61.6, text: "Cổ nhân có câu — thành công sớm chưa chắc đã là phúc.",
    emph: ["chưa", "chắc", "là", "phúc."] },
  { tin: 61.8, tout: 64.8, text: "Thiếu niên đắc chí — bạo phát rồi bạo tàn.",
    emph: ["bạo", "phát", "bạo", "tàn."] },
  { tin: 65.0, tout: 68.3, text: "Đại khí vãn thành — mới chính là vương đạo.",
    emph: ["vãn", "thành", "vương", "đạo."] },
  { tin: 68.5, tout: 72.6, text: "Đã đến lúc lấy ra cái phách lực của một kẻ cầm quyền.",
    emph: ["phách", "lực", "cầm", "quyền."] },
  { tin: 72.8, tout: 78.3, text: "Bất phá bất lập. Không đập nát cái cũ — vĩnh viễn không thể kiến tạo cái mới.",
    emph: ["bất", "phá", "bất", "lập.", "cái", "mới."] },
  { tin: 78.5, tout: 82.6, text: "Đạp gió rẽ sóng. Xoay chuyển càn khôn.",
    emph: ["đạp", "gió", "rẽ", "sóng.", "càn", "khôn."] },
];

const SceneLayer: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  const sf = s.tin * FPS;
  const ef = s.tout * FPS;
  const fade = 18;
  const opacity = interpolate(
    frame, [sf - fade, sf + fade, ef - fade, ef + fade],
    [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  if (opacity <= 0) return null;
  const p = (frame - sf) / Math.max(1, ef - sf);
  const scale = interpolate(p, [0, 1], [1.05, 1.14]);
  const tx = interpolate(p, [0, 1], [0, ((parseInt(s.id.slice(1)) % 2) ? 16 : -16)]);
  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        width: "100%", height: "100%",
        transform: `scale(${scale}) translate(${tx}px, 0)`,
        filter: "contrast(1.1) saturate(0.88) brightness(0.92)",
      }}>
        <Img src={staticFile(`nghichthien/${s.id}.png`)} style={{
          width: "100%", height: "100%", objectFit: "cover",
        }} />
      </div>
    </AbsoluteFill>
  );
};

const SubLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const active = SUBS.find((s) => t >= s.tin - 0.15 && t <= s.tout + 0.3);
  if (!active) return null;
  const enterP = Math.min(1, (t - active.tin) / 0.35);
  const exitP = Math.min(1, Math.max(0, (t - (active.tout - 0.3)) / 0.3));
  const opacity = Math.min(enterP, 1 - exitP);
  const y = interpolate(enterP, [0, 1], [12, 0]);
  const words = active.text.split(" ");
  const emphSet = new Set((active.emph ?? []).map((w) => w.toLowerCase()));
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 240,
      textAlign: "center", padding: "0 90px",
      opacity, transform: `translateY(${y}px)`,
    }}>
      <div style={{
        display: "inline-flex", flexWrap: "wrap", justifyContent: "center",
        gap: "0 12px", maxWidth: 960, lineHeight: 1.3,
      }}>
        {words.map((w, i) => {
          const emph = emphSet.has(w.toLowerCase());
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: emph ? 800 : 500,
              fontSize: emph ? 54 : 44,
              color: emph ? "#E8B54F" : "#F6EFDC",
              textShadow: emph
                ? "0 0 24px rgba(232,181,79,0.6), 0 4px 16px rgba(0,0,0,0.98)"
                : "0 3px 16px rgba(0,0,0,1)",
              letterSpacing: emph ? "0.6px" : "0",
            }}>{w}</span>
          );
        })}
      </div>
    </div>
  );
};

const Letterbox: React.FC = () => (
  <>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 110, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 110, background: "#000" }} />
  </>
);

const OpenTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t > 3.5) return null;
  const op = interpolate(t, [0, 0.4, 3.0, 3.5], [0, 1, 1, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: op, background: "rgba(0,0,0,0.4)" }}>
      <div style={{ textAlign: "center", padding: "30px 50px" }}>
        <div style={{
          fontFamily: "Playfair Display, serif", fontStyle: "italic",
          fontSize: 40, color: "#D9A048", marginBottom: 18, letterSpacing: "8px",
        }}>ba đời gia tộc · một kẻ lật ván cờ</div>
        <div style={{
          fontFamily: "Playfair Display, serif", fontWeight: 700,
          fontSize: 110, color: "#F6EFDC", letterSpacing: "10px", lineHeight: 1.1,
        }}>NGHỊCH THIÊN<br /><span style={{ color: "#E8B54F" }}>CẢI MỆNH</span></div>
      </div>
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.5) 100%)",
  }} />
);

export const TimelapseNghichThien: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {SCENES.map((s) => <SceneLayer key={s.id} s={s} />)}
    <Vignette />
    <Letterbox />
    <SubLayer />
    <OpenTitle />
    <Audio src={staticFile("nghichthien/narration_tts.mp3")} volume={1.0} />
    <Audio src={staticFile("bay_cuu_music.mp3")} volume={0.25} />
  </AbsoluteFill>
);
