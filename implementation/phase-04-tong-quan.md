# Báo cáo Tổng quan Hoàn thành — Phase 04: Responsive & Mobile UX

**Ngày hoàn thành:** 30/09/2026  
**Dự án:** Cổng lấy ý kiến cộng đồng dân cư về đồ án quy hoạch — UBND Phường Tùng Thiện  
**Trạng thái:** ✅ Đã hoàn thành (Phase 04 / 07 — Nhóm ưu tiên P0)

---

## 1. Tóm tắt các công việc đã triển khai trong Phase 04

### 1.1. Tối ưu hóa toàn diện đa kích thước màn hình (320px đến 1920px)
- **Màn hình cực nhỏ ($\le 340\text{px}$ như iPhone SE gen 1):**
  - Giảm padding container xuống $12\text{px}$, co giãn tiêu đề $H_1$ linh hoạt ($24-28\text{px}$).
  - Tự động chuyển các nút chọn vote, pill mục lục sang dạng full-width, đảm bảo không bị đè chữ hay tràn viền.
- **Màn hình điện thoại phổ biến ($360\text{px} - 430\text{px}$):**
  - Layout dạng 1 cột tự nhiên, các ô input và card lựa chọn ôm trọn chiều ngang ngón tay.
- **Màn hình Tablet ($768\text{px}$) & Desktop ($1024\text{px}+$):**
  - Chuyển sang bố cục lưới 2 cột hiện đại, nhúng khung đọc PDF 72vh sắc nét, căn giữa modal với max-width $680\text{px}$.

### 1.2. Triệt tiêu hoàn toàn lỗi cuộn ngang (Zero Horizontal Overflow)
- Toàn bộ các thẻ tiêu đề dài, bảng thông tin, ô nhập liệu và khung tài liệu đều được áp dụng `word-break: break-word`, `overflow-wrap: break-word` và `max-width: 100%`.
- Đảm bảo `document.documentElement.scrollWidth === window.innerWidth` trên mọi độ phân giải.

### 1.3. Trải nghiệm Modal khảo sát di động chuẩn Native App
- **Dynamic Viewport Height (`100dvh`):** Khắc phục triệt để lỗi giật nhảy chiều cao khi thanh URL của trình duyệt Safari iOS hoặc Chrome Android tự động ẩn/hiện lúc cuộn.
- **Thanh điều hướng cố định đáy (Sticky Action Bar):**
  - Trên mobile, thanh chứa nút **[← Quay lại]** và **[Tiếp tục →]** được cố định ở đáy màn hình với hiệu ứng kính mờ (`backdrop-filter: blur(12px)`).
  - Tích hợp vùng đệm an toàn `calc(14px + env(safe-area-inset-bottom))` bảo vệ khỏi thanh Home Indicator của iPhone có Dynamic Island.
  - Người dân có thể thao tác chuyển bước bằng ngón tay cái ngay lập tức mà không cần phải cuộn hết form mới thấy nút.

### 1.4. Chuẩn hóa Touch Targets & Trợ năng (Accessibility)
- Tất cả các nút bấm (`.btn`, `.vote-card`, `.project-choice-card`, `.doc-btn`, `.shortcut-pill`) đều có chiều cao $\ge 48-50\text{px}$ và khoảng cách tối thiểu $8-12\text{px}$.
- Thêm đường viền nhận diện bàn phím `:focus-visible` rõ nét phục vụ người dùng sử dụng phím Tab.
- Tích hợp quy tắc `@media (prefers-reduced-motion: reduce)` tắt các hiệu ứng chuyển động mờ/trượt đối với người dùng nhạy cảm với chuyển động trên màn hình.

---

## 2. Bảng đối chiếu tiêu chí hoàn thành Phase 04

| Hạng mục kiểm tra | Tiêu chuẩn đặc tả | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Kích thước 320px** | Không tràn ngang, đọc rõ chữ | Đã tối ưu padding $12\text{px}$, font co giãn mượt | ✅ Đạt |
| **Kích thước 360–430px** | Thao tác 1 tay thuận tiện | Nút vote to bản, form 1 cột ôm ngón tay | ✅ Đạt |
| **Không cuộn ngang** | ScrollWidth $\le$ Window.innerWidth | Zero horizontal overflow trên toàn trang | ✅ Đạt |
| **Touch target $\ge 48\text{px}$** | Mọi vùng chạm tối thiểu 44–48px | Các nút và card đều $\ge 48-50\text{px}$ | ✅ Đạt |
| **Modal Mobile Native** | Chiều cao 100dvh, Sticky Action Bar | Đã có thanh điều hướng đáy mờ kính + Safe Area | ✅ Đạt |
| **Hỗ trợ iPhone Safe-Area** | Không bị che bởi Home Indicator | Đã tích hợp `env(safe-area-inset-bottom)` | ✅ Đạt |
| **Trợ năng & Tương phản** | Chữ dễ đọc cho người cao tuổi, Focus rõ | Tương phản cao, focus outline, reduced-motion | ✅ Đạt |

---

## 3. Kế hoạch tiếp theo (Phase 05)

Chuyển sang **Phase 05 — Validation, lưu nháp (LocalStorage) và chống mất dữ liệu**:
1. Xây dựng cơ chế **Inline Validation**: Báo lỗi cụ thể dưới từng trường bị thiếu (không chỉ báo toast chung chung).
2. Tự động cuộn mượt và highlight câu hỏi chưa được chọn.
3. Tích hợp cơ chế **Auto-save nháp vào LocalStorage** (key: `tungthien_survey_draft_v1`) với debounce thông minh.
4. Màn hình thông báo **Khôi phục bản nháp** khi người dân tải lại trang hoặc vô tình đóng trình duyệt (*"Tiếp tục làm dở"* hoặc *"Làm lại từ đầu"*).
