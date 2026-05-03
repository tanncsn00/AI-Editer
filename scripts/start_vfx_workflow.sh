#!/usr/bin/env bash
# start_vfx_workflow.sh — one-shot Vibe Coding 3D pipeline initializer.
#
# Usage:
#   bash scripts/start_vfx_workflow.sh <input_video> <slug>
#
# Steps:
#   1) MediaPipe pose-track input video → tracking.json
#   2) Copy source + tracking to remotion-composer/public/<slug>/
#   3) Scaffold <Slug>VFX.tsx from template
#   4) Print snippet to add to Root.tsx
#   5) Open Remotion studio
set -euo pipefail

VIDEO="${1:?usage: $0 <input_video> <slug>}"
SLUG="${2:?usage: $0 <input_video> <slug>}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJ="$ROOT/projects/$SLUG"
PUB="$ROOT/remotion-composer/public/$SLUG"

mkdir -p "$PROJ" "$PUB"

echo "[1/5] Copying source video..."
cp "$VIDEO" "$PROJ/source.mp4"
cp "$VIDEO" "$PUB/source.mp4"

echo "[2/5] Pose tracking (MediaPipe)..."
python "$ROOT/tools/analysis/pose_track.py" "$PROJ/source.mp4" --out "$PROJ/tracking.json"
cp "$PROJ/tracking.json" "$PUB/tracking.json"

echo "[3/5] Scaffolding Remotion composition..."
COMP_NAME="$(echo "$SLUG" | sed -r 's/(^|[-_])(\w)/\U\2/g')VFX"
cat > "$ROOT/remotion-composer/src/${COMP_NAME}.tsx" <<EOF
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { PoseAttachedFX, type Tracking } from "./fx/PoseAttachedFX";
import tracking from "../public/$SLUG/tracking.json";

export const ${COMP_NAME}: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <OffthreadVideo src={staticFile("$SLUG/source.mp4")} />
    <ThreeCanvas
      width={(tracking as Tracking).width}
      height={(tracking as Tracking).height}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.4} />
      <PoseAttachedFX
        tracking={tracking as Tracking}
        attach={[
          { joint: "left_wrist", fx: "fire", color: "#FF8C2E", size: 0.22 },
          { joint: "right_wrist", fx: "fire", color: "#FF8C2E", size: 0.22 },
        ]}
      />
    </ThreeCanvas>
  </AbsoluteFill>
);
EOF

echo "[4/5] Snippet to add to Root.tsx:"
echo "----------------------------------"
cat <<EOF
import { ${COMP_NAME} } from "./${COMP_NAME}";
// ... inside <Root />:
<Composition
  id="${COMP_NAME}"
  component={${COMP_NAME}}
  durationInFrames={Math.ceil(tracking.duration * 30)}
  fps={30}
  width={1080}
  height={1920}
/>
EOF
echo "----------------------------------"

echo "[5/5] Done. Next:"
echo "   - Manually add the snippet above to remotion-composer/src/Root.tsx"
echo "   - Run: cd remotion-composer && npx remotion studio   (live preview)"
echo "   - Render: cd remotion-composer && npx remotion render ${COMP_NAME} ../projects/$SLUG/final.mp4 --codec h264 --crf 19"
