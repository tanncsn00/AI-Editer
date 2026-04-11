# Video Inpainting Setup — ProPainter

Tool để xoá text/watermark/object trên video.

## Prerequisites (đã check machine bạn)

- Python 3.12 ✅
- PyTorch 2.11 (CPU) ⚠️ — chạy được nhưng chậm (~20x slower vs GPU)
- OpenCV 4.10 ✅
- SciPy ✅
- git ✅
- ffmpeg ✅

**Recommend:** Setup PyTorch CUDA nếu có GPU NVIDIA để tăng tốc ~20x. Không có GPU vẫn dùng được cho clip ngắn (<30s).

## Install steps

```bash
# 1. Clone ProPainter vào tools/vendor/
mkdir -p E:/tvk/OpenMontage/tools/vendor
cd E:/tvk/OpenMontage/tools/vendor
git clone https://github.com/sczhou/ProPainter.git
cd ProPainter

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Download pretrained weights (~500MB, auto lần đầu chạy)
# Hoặc manual: https://github.com/sczhou/ProPainter/releases/tag/v0.1.0

# 4. Test với sample
python inference_propainter.py \
  --video inputs/object_removal/bmx-trees \
  --mask inputs/object_removal/bmx-trees_mask \
  --output results/
```

## Workflow xoá text cho footage licensed

**Bước 1: Tạo mask cho text**
- Option A: Manual trong Photoshop/GIMP — vẽ white trên black background tại vị trí text
- Option B: Auto bằng **Segment Anything Model (SAM)** — click vào text, tự tạo mask
- Option C: Nếu text fixed position → tạo mask tĩnh 1 lần, apply cho tất cả frame

**Bước 2: Chạy ProPainter**
```bash
cd E:/tvk/OpenMontage/tools/vendor/ProPainter
python inference_propainter.py \
  --video ../../../projects/<slug>/source.mp4 \
  --mask ../../../projects/<slug>/mask/ \
  --output ../../../projects/<slug>/inpainted/ \
  --fp16
```

**Bước 3: Re-encode**
```bash
cd E:/tvk/OpenMontage
ffmpeg -i projects/<slug>/inpainted/inpainted.mp4 \
  -c:v libx264 -crf 20 -preset medium \
  projects/<slug>/clean.mp4
```

## Fallback cho case đơn giản (không cần AI)

Nếu text ở góc cố định hoặc bạn chỉ muốn che lên — dùng wrapper script ở `tools/video/video_inpaint.py` — nó có 3 mode:
- `crop` — cắt bỏ vùng chứa text (nhanh nhất)
- `delogo` — ffmpeg built-in inpaint (tốt cho static text)
- `overlay` — đè box đen lên + text VN mới (nhanh nhất cho reuse footage aff)
- `propainter` — AI inpaint (chậm nhưng chất lượng cao nhất, cần setup trên)
