# Vibe Coding · Hybrid 2D/3D VFX Workflow

End-to-end pipeline for adding 3D / VFX overlays (chưởng lửa, sấm sét, 3D character replacement) to live-action or stick-figure videos using the local stack.

## Stack (locked)

| Layer | Tool | Status |
|------|------|--------|
| Brain | Claude Code CLI · Cursor IDE · this repo | ✅ |
| Tracking | MediaPipe Pose (33 keypoints) | ✅ pip installed |
| 3D engine | Three.js + React Three Fiber + drei + postprocessing | ✅ npm installed |
| Shaders | GLSL via `<shaderMaterial>` / `useFrame` | ✅ |
| Character source | Mixamo (Adobe acc) · Ready Player Me (free) · Sketchfab CC0 | bro tải GLB tay |
| Compositor | Remotion v4 · `@remotion/three` for Canvas integration | ✅ |
| Encoder | FFmpeg | ✅ |
| Schema enforce | Zod | ✅ npm installed |
| QC visual | Playwright (already wired via skills) | ✅ |

## Input → Output

```
input.mp4 ─► tracking.json ─► R3F overlay ─► Remotion render ─► final.mp4
```

## 5-step workflow

### 1) Pose track

```bash
python tools/analysis/pose_track.py projects/<slug>/source.mp4 \
    --out projects/<slug>/tracking.json
```

Output: 33 landmarks per frame (2D normalized + 3D world meters).
Speed: ~5-15 fps on CPU, ~30 fps on RTX 2060 GPU (auto-detected).

### 2) Copy assets to Remotion public

```bash
cp projects/<slug>/source.mp4 remotion-composer/public/<slug>/source.mp4
cp projects/<slug>/tracking.json remotion-composer/public/<slug>/tracking.json
# Optional 3D asset:
cp ~/Downloads/maria.glb remotion-composer/public/<slug>/maria.glb
```

### 3) Build composition

Create `remotion-composer/src/<Slug>VFX.tsx`:

```tsx
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { PoseAttachedFX, Tracking } from "./fx/PoseAttachedFX";
import tracking from "../public/<slug>/tracking.json";

export const SlugVFX: React.FC = () => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile("<slug>/source.mp4")} />
    <ThreeCanvas width={1080} height={1920}>
      <PoseAttachedFX
        tracking={tracking as Tracking}
        attach={[
          { joint: "left_wrist", fx: "fire", color: "#FF8C2E", size: 0.22 },
          { joint: "right_wrist", fx: "fire" },
          { joint: "left_palm", fx: "lightning" },
        ]}
      />
    </ThreeCanvas>
  </AbsoluteFill>
);
```

Register in `Root.tsx` with appropriate width/height/duration.

### 4) (Optional) 3D character replacement

Use Mixamo / Ready Player Me GLB:
- Auto-rigger: https://www.mixamo.com (Adobe acc, free)
- Free RPM avatars: https://readyplayer.me
- CC0 GLB: https://sketchfab.com (filter free)

Map MediaPipe joints → Mixamo bones (the fragile part):
- MediaPipe `left_shoulder` → Mixamo `mixamorigLeftArm`
- MediaPipe `left_elbow` → `mixamorigLeftForeArm`
- MediaPipe `left_wrist` → `mixamorigLeftHand`
- ...

Use IK solver (`three-ik` or roll your own) to drive the GLB skeleton.

### 5) Render

```bash
cd remotion-composer
npx remotion render <Slug>VFX ../projects/<slug>/final.mp4 --codec h264 --crf 19
```

RTX 2060 budget: ~5-10 fps frame render with R3F + bloom + DOF active. For 30s video at 30fps: ~3-9 minutes.

## Skill assist

Use these existing skills when relevant:
- `threejs-fundamentals` — scene/camera/renderer setup
- `threejs-shaders` — GLSL shader material patterns
- `threejs-animation` — bone animation, mixer, GLTF
- `threejs-loaders` — GLB/GLTF loading
- `threejs-postprocessing` — bloom/DOF/composer

## Troubleshooting

**Video không sync với pose:** check `tracking.json.fps` vs `source.mp4` fps. If different, resample tracking before R3F.

**Pose flicker/jitter:** rerun `pose_track.py` without `--no-smooth`, OR add temporal smoothing in `useJointAtFrame()`.

**RTX 2060 OOM during render:** drop bloom mipLevels, reduce particle count, render at 720x1280 then upscale with ffmpeg `-vf scale=1080:1920:flags=lanczos`.

**Mixamo rig flips arms:** MediaPipe coords need axis flip. Try `lm.x = 1-lm.x` or `lm.z = -lm.z` in the bone driver.

## Phase plan

- **Phase 1 — VFX overlay only** (1-2 ngày): MediaPipe → particle/glow/fire on joints, no 3D character. POC, ra demo nhanh.
- **Phase 2 — 3D character replace** (3-5 ngày): RPM/Mixamo GLB driven by MediaPipe pose, swap actor.
- **Phase 3 — Hybrid Maria** (1-2 tuần): custom character + custom GLSL shader + cinematic camera.

## Quick start (1-line)

```bash
bash scripts/start_vfx_workflow.sh <video.mp4> <slug>
```

That script: pose-tracks → copies assets → scaffolds `<Slug>VFX.tsx` from template → registers in Root → opens Remotion studio for live preview.
