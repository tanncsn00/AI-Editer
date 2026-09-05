> Index 42 memory, xếp theo **thứ tự pipeline sản xuất video**. Dọn 2026-08-13.

## 0. User profile


## 1. Gate & quy trình (trước khi viết)

- [Approve script first](feedback_general_approve_script.md) — không skip flow brainstorm → script; phải để user duyệt
- [Pick idea, không tự chọn](feedback_general_pick_ideas.md) — user xin idea thì LIST 5-10 cho chọn, không tự pick rồi chạy
- [User script — VERBATIM](feedback_user_script_verbatim.md) — script user gửi thì dùng NGUYÊN VĂN, không redo hook/restructure
- [⭐ Brain-rot: user viết từng tình huống](feedback_brainrot_user_writes_beats.md) — thể loại bẩn bựa/mất não thì user tự viết gag từng shot; mình chỉ dựng, KHÔNG tự nghĩ tình huống, KHÔNG tự giảm độ bẩn
- [Gated 8-step workflow](feedback_comedy_workflow_gated.md) — character lock → brainstorm → beat sheet → script → voice → storyboard → TTS → render
- [Deliverables checklist](feedback_general_deliverables.md) — BẮT BUỘC mp4 + thumbnail designed (KHÔNG phải frame extract) + caption.md; verify trước khi báo xong
- [⭐ Xuất bản NOBGM để đăng TikTok](feedback_export_nobgm_tiktok.md) — nhúng nhạc bản quyền = **0 view, chặn phân phối** (kiểm chứng 2026-08-14); luôn xuất thêm bản không nhạc, giữ SFX

## 2. Viết script

- [Storytelling, không liệt kê](feedback_script_storytelling.md) — cấm "Số 1, Số 2"; phải personal hook → pain → discovery → wow → insight → CTA
- [Giải pháp phải có CƠ CHẾ](feedback_script_explain_mechanism.md) — vì sao lỗi → chặn ở đâu → cái giá; tách mỗi giải pháp 1 beat nếu cần
- [Việt hóa script](feedback_viet_hoa_script.md) — Việt hóa heavy cho mass appeal; chỉ giữ acronym dev quen (MCP/API/AI)
- [⭐ Persona mặc định: mình-bạn](feedback_minh_ban_voice.md) — neutral universal từ 2026-05-20 (Cowork SME pivot)
- [Persona fallback: chồng-vợ](feedback_chong_vo_voice_v2.md) — 🔻 KHÔNG còn default; chỉ khi user yêu cầu rõ hoặc video confession
- [CTA tagline khớp brand](feedback_cta_tagline_match_brand.md) — IT thuần → "giới IT", office-drama → "chốn công sở"; đừng mặc định
- [Blueprint phải có CTA follow](feedback_blueprint_cta_follow.md) — narration + slide nút FOLLOW; tự thêm beat nếu script thiếu

## 3. Voice & TTS

- [⭐ TTS per-beat pipeline](feedback_tts_per_beat_pipeline.md) — mỗi beat 1 mp3 + concat gap 0.3s; hết hallucination, re-gen isolate 1 beat
- [⭐ Catalog lỗi phát âm EverAI](feedback_tts_pronunciation_pitfalls.md) — nuốt chữ/cụm, lắp chữ, rớt dấu, "bug"→"lỗi", lehoang nuốt "nghìn"; whisper KHÔNG bắt được nuốt → phải isolate-transcribe
- [⭐ RULE phonetic tech](feedback_tts_tech_phonetic.md) — ĐỌC âm tiếng Anh, cấm dịch nghĩa để né phát âm (bug→"bấc" KHÔNG phải "lỗi"); ngoại lệ: tên pháp bảo truyền kỳ có reveal English kèm. Bảng ~90 term tra ở `docs/PHONETIC_DICT.md`
- [⭐ Speed = 1.0](feedback_tts_speed_1x.md) — mặc định `"speed": 1.0` trong script.json từ 2026-08-14 (bỏ 0.95); tự set, đừng hỏi lại
- [Voice library](reference_voice_library.md) — 12 voice ref ở `_shared/voice_refs/`, switch bằng `VOICE_REF=<name>`

## 4. Caption

- [⭐ Caption UNIVERSAL LOCK](feedback_caption_universal_lock.md) — MỌI video VN dùng MỘT style: sentence-based spring reveal copy verbatim từ `ImLangFull.tsx`
- [Phonetic vs display](feedback_caption_phonetic_display.md) — TTS đọc phonetic, caption hiện form English; merge sequence trong words.json trước render
- [Whisper verify](feedback_caption_whisper_verify.md) — whisper sai tiếng Việt; script là ground truth, whisper chỉ cấp timing
- [Tịnh Đạo BigWord + footage lock](feedback_tinhdao_caption_lock.md) — BigWord EB Garamond, palette theo mood, footage filter, audio volume (phần Caption đã chuyển lên universal lock)

## 5. Dựng hình & sync

- [⭐⭐ QUY TRÌNH SYNC BẮT BUỘC](feedback_sync_voice_workflow.md) — 6 bước word-timestamp cho MỌI video; LEAD theo animation; bẫy whisper hallucination + chọn anchor + list/thoại; verify cặp frame
- [Mouth sync theo word timings](feedback_comedy_mouth_sync.md) — parabolic per-word, không sine độc lập; nhân vật cần action mỗi beat
- [Nhân vật phải động](feedback_comedy_stick_animate.md) — mouth sync + eye blink + body bob khi nói, không đứng im
- [Background continuity](feedback_general_bg_continuity.md) — footage trong 1 video phải cùng environment/mood
- [Không label "Tập X"](feedback_general_no_tap_label.md) — không hiện số tập ở thumbnail hay big-word outro

## 6. Skill preset — ĐANG LOAD ĐƯỢC (`.claude/skills/`)

- [The Review](reference_the_review_skill.md) — universal stick-teacher paper-cream: review/tutorial/explainer/comparison; 4 format + 5 persona
- [Tịnh Đạo](reference_tinhdao_skill.md) — video triết lý VN, winter cinematic, minhtriet 0.9x, EB Garamond drops
- [Blueprint tech-video](reference_blueprint_skill.md) — navy+grid+amber engineering, fully animated voice-synced; ⚠️ bug transform+style cùng `<g>`; render cần Node ≥16
- [Truyền kỳ giới IT (script)](reference_truyen_ky_it_skill.md) — công thức VIẾT script tu tiên cho tech khô khan; tầng CHỮ, ghép blueprint để dựng hình
- [Truyền kỳ tu tiên AI](reference_truyen_ky_skill.md) — storytelling 2-3 phút về nhân vật/tech AI; cổ phong; golden ref Karpathy
- [Viral Hook](reference_viral_hook_skill.md) — audit + generate hook theo 7 viral rule; dùng KÈM skill format khác
- [Reup comedy dub](reference_reup_comedy_skill.md) — Douyin/TikTok reup, VN voice + karaoke, 2 mode (faithful / commentary)
- [Reup cartoon dub](reference_reup_cartoon_skill.md) — reup thay visual bằng SVG cartoon + thumbnail designed

## 7. Skill preset — ⚠️ CHƯA MIRROR (chỉ ở `.agents/skills/`, Claude Code không auto-load)

- [Comedy animation](reference_comedy_skill.md) — Em Mít Ướt × Anh Gạch + Sigma/Derp
- [Stick figure catalog](reference_comedy_stickfigure_skill.md) — 34 kỹ thuật + ranking format viral
- [Giải Thích Kiểu Lười](reference_series_giaithichluoi_skill.md) — cast 4 nhân vật deadpan; thư mục thật là `giai-thich-luoi-series`
- [Review Vibe Future](reference_review_vibe_future_skill.md) — dark-tech futuristic (Tron grid + neural orb + animated MC)
- [Lời Thú Nhận đồ vật](feedback_loithunhan_tone.md) — POV đồ vật bựa Gen-Z; gate duyệt script trước TTS+SDXL

- [Blocky POV meme kit](reference_blocky_pov_meme_kit.md) — rig Roblox-style thuần boxGeometry, KHÔNG cần model 3D; helper chặn 4 bug camera; --public-dir rỗng để render nhanh 40x
- [⭐ Roblox Studio pipeline](reference_roblox_studio_pipeline.md) — hướng làm video Roblox THẬT: Studio+MCP+Luau+OBS; Studio cài ở **E:\Roblox qua junction**; OBS websocket 4455 đã bật; ỉa đái phải pose bằng Luau để né kiểm duyệt

## 8. Reference khác

- [Neon POV-nghề style](reference_neon_pov_style.md) — style ngoài blueprint (pov-ktv, pov-creator); dùng `/ui-ux-pro-max` derive design system mới khi user chê blueprint nhàm
- [Claude 2026 specs](reference_claude_2026_specs.md) — verify lại trước khi quote số trong script
- [yt-dlp social download](reference_general_ytdlp_download.md) — pip lib cho TikTok/FB/YT no-watermark
