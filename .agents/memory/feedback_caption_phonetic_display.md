---
name: Caption display form (phonetic → English)
description: TTS uses phonetic spelling for VN pronunciation; caption displays English brand/term. Merge phonetic sequences in words.json before render.
type: feedback
originSessionId: ec65b125-7a7a-4b08-aab5-5673b0036876
---
**Rule:** Script cho TTS dùng phonetic (EverAI đọc đúng âm VN). Caption hiển thị dùng **display form** (English thương hiệu/thuật ngữ gốc).

**Why:** Pronunciation và display là 2 mục đích khác nhau. EverAI đọc "vibe editing" sẽ sai hoặc bị vietnamese-ize. Nhưng caption hiển thị "vai bờ ê đít tinh" trông ngớ ngẩn. Tách 2 form, merge trước khi render.

**How to apply:**

1. Viết script với phonetic cho TTS audio input:
   - `vai bờ ê đít tinh` (vibe editing)
   - `ây ai`, `ây pi i`, `ây pi i ki` (AI, API, API key)
   - `em pi bốn` (MP4)
   - `pi pi install`, `en pi em install` (pip install, npm install)
   - `nốt jây es` (Node.js), `ép ép em peg` (FFmpeg)
   - `chấm i en vi` (.env), `chấm r` (-r), `chấm txt` (.txt)
   - `Veo ba`, `Gen bốn` (Veo 3, Gen 4)
   - `Can va` (Canva — space giúp tách 2 âm rõ)

2. Sau whisper forced-align, chạy post-process merge trên `words.json` trước khi render Remotion:
   ```python
   RULES = [
       (["vai","bờ","ê","đít","tinh"], ["vibe","editing"]),
       (["ây","pi","i","ki"], ["API","key"]),
       (["ây","pi","i"], ["API"]),
       (["ây","ai"], ["AI"]),
       (["em","pi","bốn"], ["MP4"]),
       (["pi","pi","install"], ["pip","install"]),
       (["en","pi","em","install"], ["npm","install"]),
       (["nốt","jây","es"], ["Node.js"]),
       (["ép","ép","em","peg"], ["FFmpeg"]),
       (["chấm","i","en","vi"], [".env"]),
       (["chấm","r"], ["-r"]),
       (["chấm","txt"], [".txt"]),
       (["Veo","ba"], ["Veo","3"]),
       (["Gen","bốn"], ["Gen","4"]),
       (["can","va"], ["Canva"]),
   ]
   # Merge: replace matched sequence, distribute start/end by char-length proportional
   ```

3. Cũng fix các hardcoded label trong Remotion tsx (visual text blocks): viết thẳng display form, KHÔNG dùng phonetic trong visuals.
   - ❌ `ÂY AI VIẾT CODE` → ✅ `AI VIẾT CODE`
   - ❌ `EM PI BỐN` → ✅ `MP4`
   - ❌ `CHỌN ÂY AI NÀO` → ✅ `CHỌN AI NÀO`

**Reference implementation:** `projects/vibe-editing-ep1/` — 16 phonetic sequences merged, `remotion-composer/src/vibe_ep1_words.json` shows output form.
