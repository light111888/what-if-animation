# What-If Animation Skill (`what-if-animation`)

Skill sản xuất video hoạt hình giải thích giả định khoa học (**What-If Science & Narrative Explainer**) theo quy trình **7 Giai Đoạn (Code-First, Still-First, Self-Checked)** — từ một câu hỏi giả định tạo ra tập phim hoạt hình hoàn chỉnh (từ 30 giây đến **> 8 phút**), đồng bộ âm thanh 3 lớp chuẩn `-14.0 LUFS` và xuất dự án gốc `.styk`.

---

## Tính năng cốt lõi & Các nâng cấp chống lỗi tự động

1. **Strict 1-Cut-1-Unique-Shot (`max_forward_uses == 1`)**:
   - Cấm tuyệt đối việc tái sử dụng cùng một hàm `Shot` (`Sh<N>`) ở nhiều nhát cắt tiến hoặc lách luật bằng `subBeat`.
   - Tập phim dài `140` nhát cắt (`> 8 phút`) bắt buộc có đủ `140` hàm `Sh1..Sh140` độc bản (`count == 1`), được kiểm tra tự động bởi `scripts/plan.py --strict` và `scripts/qa_loop.py`.
2. **All-Pairs Perceptual Still Uniqueness (`mean_rgb_diff >= 4.5`)**:
   - `<Schematic t={t} id={id} />` (`studio/src/engine/sets/schematic.tsx`) tự động băm `id` thành 10 bảng màu blueprint, 5 hình chìm kỹ thuật (DNA, sóng não, radar, lục giác, đồng hồ sinh học) và thanh tiêu đề `<SchBox>` tương phản cao.
   - `scripts/qa_loop.py` kiểm tra toàn bộ `N × (N - 1) / 2` cặp ảnh tĩnh trên toàn tập phim để đảm bảo không có hai cảnh nào nhìn giống nhau.
3. **Chuyển động liên tục 100% thời lượng cảnh (`Continuous Full-Segment Motion`)**:
   - `camZoom(t, s0, s1, dur = 96)` (`studio/src/engine/anim.ts`) giữ chuyển động camera mượt suốt cả nhát cắt.
   - `applyBioLife(p, f, postHoldFrames)` tích hợp trực tiếp trong `poseAt()` (`studio/src/engine/rig.tsx`) tự động duy trì nhịp thở lồng ngực, nghiêng đầu và dao động tay tự nhiên sau keyframe cuối, triệt tiêu hoàn toàn hiện tượng nhân vật đứng bất động ở nửa sau cảnh.
4. **Minh họa động vật & Kính lúp giải phẫu bắt buộc (`ZOO.*`)**:
   - `studio/src/engine/zoo.tsx` hỗ trợ vẽ chuẩn xác hình dáng giải phẫu (`dolphin`, `shark`, `eagle`, `cat`, `human_brain`, `t_rex`...) kèm `ZOO.withAnatomyZoom`, `ZOO.drawAnatomyReticle` và `ZOO.drawOrganInset` + `ZOO.drawOrgan`.
5. **Đa nguồn giọng đọc TTS & Chuẩn hóa số thập phân tiếng Việt bắt buộc**:
   - Hỗ trợ **OmniVoice 24kHz GPU** (mặc định cho tiếng Việt & 600+ ngôn ngữ), **AivisSpeech GPU** (tiếng Nhật), **ElevenLabs**, và **Edge-TTS**.
   - Tự động kiểm tra tách biệt phụ đề hiển thị (`text`) và văn bản đọc TTS (`spoken_text`) đã viết toàn bộ số, số thập phân, phần trăm, đơn vị thành chữ và không bao giờ ngắt câu ở số thập phân (`3.2 triệu năm` -> `ba phẩy hai triệu năm`).
6. **Kết xuất phân đoạn an toàn bộ nhớ cho video dài `> 8 phút` (`scripts/master.py`)**:
   - Tự động chia các tập phim dài (`> 3.600 frames`) thành các phân đoạn `3.000 frames`, kiểm tra `ffprobe` tái sử dụng phân đoạn đạt chuẩn, tự thử lại nếu trình duyệt khởi động chậm và ghép nối không suy hao trước khi chuẩn hóa âm lượng `-14.0 LUFS`.

---

## Cấu trúc thư mục

```text
what-if-animation/
├── SKILL.md                  # Quy trình 7 giai đoạn & quy tắc bắt buộc cho AI Agent
├── README.md                 # Tài liệu hướng dẫn cài đặt & sử dụng
├── LICENSE                   # Giấy phép MIT
├── references/               # Tài liệu tham chiếu chi tiết
│   ├── formula.md            # Cấu trúc kịch bản 7-beat & mở rộng long-form (> 8 phút)
│   ├── kit.md                # API nhân vật (Rig), bối cảnh (Sets), ZOO.* và Camera
│   ├── look.md               # Bảng màu, ánh sáng thực tế (Practical + Rim Light)
│   ├── sound.md              # Thiết kế âm thanh 3 lớp & ngưỡng giọng đọc >= 3 dB
│   └── traps.md              # Danh mục các bẫy thị giác/chuyển động & cách phòng tránh
├── scripts/                  # Bộ công cụ tự động hóa & QA
│   ├── voice.py              # Tạo giọng đọc TTS & căn timestamp từng từ (words.json)
│   ├── plan.py               # Lập timeline.json & kiểm tra Strict 1-Cut-1-Unique-Shot
│   ├── stills.mjs            # Xuất toàn bộ ảnh tĩnh từng cảnh (out/<slug>/board/Sh*.png)
│   ├── board.py              # Ghép bảng Storyboard Contact Sheet (storyboard.jpg)
│   ├── qa_loop.py            # Tự soi lỗi ảnh tĩnh toàn cục & kiểm định chuyển động video
│   ├── sfx.py                # Tổng hợp âm thanh 3 lớp (SFX + Ambience + Music)
│   ├── mixcheck.py           # Kiểm tra độ nổi giọng đọc (>= 3 dB so với nền)
│   ├── styk_export.mjs       # Xuất dự án gốc StykAnimate (.styk)
│   ├── master.py             # Kết xuất video MP4 (hỗ trợ phân đoạn > 8 phút) & chuẩn hóa -14 LUFS
│   └── wi.py                 # Thư viện dùng chung & bộ kiểm tra chuẩn hóa văn bản TTS
└── studio/                   # Remotion + SVG Engine Studio
    ├── package.json
    ├── library/sfx/          # Thư viện hiệu ứng âm thanh dùng chung
    └── src/
        ├── engine/           # Bộ máy Rig, Camera, Ánh sáng, ZOO.* và 12 Bối cảnh (Sets)
        └── episodes/         # Các tập phim mẫu (rewind, copy-paste, zero-sleep-8m)
```

---

## Cài đặt nhanh

```bash
# 1. Clone vào thư mục skills của Claude Code / Antigravity / Gemini
git clone https://github.com/light111888/what-if-animation ~/.claude/skills/what-if-animation

# 2. Cài đặt dependencies cho studio
cd ~/.claude/skills/what-if-animation/studio
npm install
```

## Chuỗi lệnh sản xuất & kiểm định một tập phim

```bash
# Bước 1: Tạo giọng đọc TTS & lấy word timestamps
python scripts/voice.py <slug> --engine omnivoice

# Bước 2: Biên dịch timeline & kiểm tra chống lặp cảnh nghiêm ngặt
python scripts/plan.py <slug> --strict

# Bước 3: Xuất ảnh tĩnh từng cảnh & ghép bảng Storyboard
node scripts/stills.mjs <slug>
python scripts/board.py <slug>

# Bước 4: Chạy QA ảnh tĩnh toàn cục (All-Pairs Perceptual Uniqueness)
python scripts/qa_loop.py <slug> --stills-only

# Bước 5: Tổng hợp âm thanh 3 lớp, kiểm tra mix & xuất file .styk
python scripts/sfx.py <slug> --local
python scripts/mixcheck.py <slug>
node scripts/styk_export.mjs <slug>

# Bước 6: Kết xuất video Master (-14.0 LUFS) & chạy hậu kiểm chuyển động
python scripts/master.py <slug> --concurrency 3 --scale 0.5
python scripts/qa_loop.py <slug> --min-duration 480
```
