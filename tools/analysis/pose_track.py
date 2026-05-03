"""MediaPipe Tasks API pose tracker — extract per-frame landmarks → tracking.json

Usage:
    python tools/analysis/pose_track.py <video.mp4> [--out tracking.json]

Output JSON shape:
{
    "video": "input.mp4",
    "fps": 30.0, "width": 1920, "height": 1080,
    "frame_count": 540, "duration": 18.0,
    "joint_names": [...33 names...],
    "frames": [
        { "t": 0.0, "frame": 0,
          "landmarks":       [{name,x,y,z,visibility}, ...33],
          "world_landmarks": [{name,x,y,z}, ...33] },
        ...
    ]
}

Coordinates:
  - landmarks: normalized 0..1, image-space (top-left origin)
  - world_landmarks: meters, hip-relative 3D

Use the JSON in Remotion/R3F to drive VFX overlays attached to body joints.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import cv2
import mediapipe as mp
from mediapipe.tasks import python as mp_python
from mediapipe.tasks.python import vision as mp_vision


JOINT_NAMES = [
    "nose", "left_eye_inner", "left_eye", "left_eye_outer",
    "right_eye_inner", "right_eye", "right_eye_outer",
    "left_ear", "right_ear", "mouth_left", "mouth_right",
    "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
    "left_wrist", "right_wrist",
    "left_pinky", "right_pinky", "left_index", "right_index", "left_thumb", "right_thumb",
    "left_hip", "right_hip", "left_knee", "right_knee",
    "left_ankle", "right_ankle", "left_heel", "right_heel",
    "left_foot_index", "right_foot_index",
]

DEFAULT_MODEL = Path(__file__).resolve().parents[1] / "vendor" / "mediapipe_models" / "pose_landmarker_full.task"


def track_pose(video_path: str, model_path: str | None = None) -> dict:
    if model_path is None:
        model_path = str(DEFAULT_MODEL)
    if not Path(model_path).exists():
        raise FileNotFoundError(
            f"Model not found: {model_path}\n"
            "Download with:\n"
            f"  curl -L -o {model_path} https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task"
        )

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"[pose_track] {video_path} fps={fps:.2f} dims={width}x{height} frames={n}", file=sys.stderr)

    base_options = mp_python.BaseOptions(model_asset_path=model_path)
    options = mp_vision.PoseLandmarkerOptions(
        base_options=base_options,
        running_mode=mp_vision.RunningMode.VIDEO,
        num_poses=1,
        output_segmentation_masks=False,
    )
    landmarker = mp_vision.PoseLandmarker.create_from_options(options)

    frames = []
    fi = 0
    while True:
        ok, fr = cap.read()
        if not ok:
            break
        rgb = cv2.cvtColor(fr, cv2.COLOR_BGR2RGB)
        mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        ts_ms = int(fi * 1000.0 / fps)
        result = landmarker.detect_for_video(mp_img, ts_ms)

        lms_2d = []
        lms_3d = []
        if result.pose_landmarks:
            for i, lm in enumerate(result.pose_landmarks[0]):
                lms_2d.append({
                    "name": JOINT_NAMES[i],
                    "x": round(lm.x, 5), "y": round(lm.y, 5), "z": round(lm.z, 5),
                    "visibility": round(lm.visibility, 4),
                })
        if result.pose_world_landmarks:
            for i, lm in enumerate(result.pose_world_landmarks[0]):
                lms_3d.append({
                    "name": JOINT_NAMES[i],
                    "x": round(lm.x, 5), "y": round(lm.y, 5), "z": round(lm.z, 5),
                })
        frames.append({
            "t": round(fi / fps, 4),
            "frame": fi,
            "landmarks": lms_2d,
            "world_landmarks": lms_3d,
        })

        fi += 1
        if fi % 60 == 0:
            print(f"  ... {fi}/{n}", file=sys.stderr)

    cap.release()
    landmarker.close()

    return {
        "video": str(Path(video_path).resolve()),
        "fps": fps,
        "width": width,
        "height": height,
        "frame_count": fi,
        "duration": round(fi / fps, 3),
        "joint_names": JOINT_NAMES,
        "frames": frames,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video", help="Input video file")
    ap.add_argument("--out", default=None, help="Output JSON path (default: <video>.tracking.json)")
    ap.add_argument("--model", default=None, help="Path to pose_landmarker_*.task")
    args = ap.parse_args()

    out = args.out or str(Path(args.video).with_suffix(".tracking.json"))
    data = track_pose(args.video, model_path=args.model)
    Path(out).write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    n_visible = sum(1 for f in data["frames"] if f["landmarks"])
    print(f"[pose_track] wrote {out} ({len(data['frames'])} frames, {n_visible} with pose)", file=sys.stderr)


if __name__ == "__main__":
    main()
