# Báo cáo Tổng quan Hoàn thành — Phase 05: Validation, Lưu nháp & Chống mất dữ liệu

**Ngày hoàn thành:** 30/09/2026  
**Dự án:** Cổng lấy ý kiến cộng đồng dân cư về đồ án quy hoạch — UBND Phường Tùng Thiện  
**Trạng thái:** ✅ Đã hoàn thành (Phase 05 / 07 — Nhóm ưu tiên P0)

---

## 1. Tóm tắt các công việc đã triển khai trong Phase 05

### 1.1. Hệ thống Inline Validation thông minh & Trực quan
- **Thông tin người đóng góp ý kiến (Bước 2):**
  - **Họ và tên / Đại diện tổ chức:** Bắt buộc điền. Báo lỗi cụ thể: *"Vui lòng nhập họ và tên của Quý vị."*
  - **Địa chỉ cư trú / Trụ sở:** Bắt buộc điền. Báo lỗi cụ thể: *"Vui lòng nhập địa chỉ cư trú hoặc tổ dân phố."*
  - **Số điện thoại liên hệ:** Không bắt buộc. Nếu người dân nhập, hệ thống kiểm tra định dạng độ dài từ 9–12 ký tự số/dấu `+`. Báo lỗi nếu sai cú pháp.
  - **Địa chỉ Email:** Không bắt buộc. Nếu người dân nhập, hệ thống kiểm tra định dạng email tiêu chuẩn (`user@domain.ext`). Báo lỗi nếu thiếu `@` hoặc sai tên miền.
- **Tương tác mượt mà:**
  - Tự động xóa thông báo lỗi và viền đỏ ngay khi người dân bắt đầu nhập lại dữ liệu (`input` event).
  - Khi bấm **[Tiếp tục →]** mà còn lỗi, hệ thống tự động `focus` và cuộn mượt (`scrollIntoView({ behavior: 'smooth', block: 'center' })`) tới ô nhập liệu bị lỗi đầu tiên.

### 1.2. Kiểm soát câu hỏi khảo sát & Tự động điều hướng lỗi (Bước 3)
- **Ràng buộc đầy đủ 5 nội dung đánh giá:** Mỗi câu hỏi bắt buộc người dân phải chọn **✓ Đồng thuận** hoặc **× Chưa đồng thuận**.
- **Chỉ dẫn lỗi tại chỗ (Inline Error Card):**
  - Card câu hỏi bị bỏ sót sẽ chuyển viền đỏ cảnh báo `.has-error` kèm thông báo *"⚠ Vui lòng chọn Đồng thuận hoặc Chưa đồng thuận cho nội dung này."*
  - Tự động cuộn màn hình đến đúng câu hỏi đầu tiên bị thiếu để người dân hoàn thiện nhanh chóng.
- **Hỗ trợ chế độ góp ý "Cả hai đồ án":** Tự động kiểm tra riêng biệt từng đồ án. Nếu đồ án nào chưa điền đủ, hệ thống tự động kích hoạt chuyển Tab tương ứng (Tab ST3 hoặc Tab Vùng hồ Xuân Khanh) và báo rõ câu hỏi còn thiếu.

### 1.3. Cơ chế Lưu nháp tự động (Autosave LocalStorage)
- **Khóa lưu trữ chuyên dụng:** `tungthien_survey_draft_v1`.
- **Cấu trúc dữ liệu nháp toàn diện:**
  ```json
  {
    "step": 3,
    "selectedProject": "both",
    "activeBothTab": "st3",
    "person": {
      "fullName": "Nguyễn Văn A",
      "phone": "0912345678",
      "address": "Tổ dân phố 2, Phường Tùng Thiện",
      "email": "nguyenvana@gmail.com"
    },
    "answers": {
      "st3_q1": "Đồng thuận",
      "st3_q2": "Chưa đồng thuận"
    },
    "comments": {
      "st3_comment2": "Đề xuất mở rộng thêm đường gom dân sinh"
    },
    "otherOpinion": "Kính mong sớm triển khai đúng tiến độ",
    "updatedAt": "2026-09-30T09:20:00.000Z"
  }
  ```
- **Tối ưu hiệu năng bằng Debounce (400ms):** Tự động gom thao tác gõ phím/nhập văn bản, chỉ ghi vào bộ nhớ trình duyệt sau 400ms không thao tác, tránh gây giật lag trình duyệt điện thoại.
- **Lưu tức thì:** Khi chọn phương án Radio, bấm Tab hoặc chuyển Bước khảo sát.

### 1.4. Màn hình thông báo & Khôi phục bản nháp (Draft Recovery)
- **Banner thông minh:** Khi mở lại bảng khảo sát, nếu phát hiện có bản nháp chưa gửi, hệ thống hiển thị banner màu xanh nhạt với mốc thời gian lưu gần nhất:
  > *"Hệ thống phát hiện bản nháp khảo sát được lưu gần nhất lúc 09:20 30/09. Bạn có muốn tiếp tục làm không?"*
- **Tùy chọn khôi phục:**
  - **[✓ Tiếp tục làm dở]:** Tự động điền lại toàn bộ thông tin cá nhân, khôi phục các mức độ đồng thuận đã chọn, tự động mở các ô góp ý chi tiết nếu đã có nội dung hoặc chọn *Chưa đồng thuận*, và đưa người dân quay lại đúng bước đang làm dở.
  - **[× Làm lại từ đầu]:** Hiển thị hộp thoại xác nhận an toàn trước khi xóa bản nháp và đưa biểu mẫu về trạng thái mới.

### 1.5. Chống mất dữ liệu do tắt tab / reload trang (`beforeunload`)
- Tích hợp sự kiện bảo vệ `beforeunload` khi người dân đang mở biểu mẫu khảo sát ở Bước 2, Bước 3 hoặc Bước 4 và đã có dữ liệu nhập. Trình duyệt sẽ hiển thị cảnh báo xác nhận trước khi rời trang, ngăn chặn việc vô tình đóng nhầm ứng dụng.

---

## 2. Bảng đối chiếu tiêu chí hoàn thành Phase 05

| STT | Tiêu chuẩn kỹ thuật Phase 05 | Kết quả thực tế trên mã nguồn | Trạng thái |
| :-: | :--- | :--- | :---: |
| 1 | **Validation inline Bước 2** | Họ tên & địa chỉ bắt buộc; SĐT & Email kiểm tra định dạng | ✅ Đạt |
| 2 | **Auto-scroll & focus lỗi** | Tự động focus và cuộn mượt tới input lỗi đầu tiên | ✅ Đạt |
| 3 | **Validation câu hỏi Bước 3** | Bắt buộc chọn Đồng thuận / Chưa đồng thuận cho cả 5 câu | ✅ Đạt |
| 4 | **Chỉ dẫn lỗi tại chỗ** | Card câu hỏi viền đỏ + dòng cảnh báo inline ngay dưới nút vote | ✅ Đạt |
| 5 | **Autosave LocalStorage** | Lưu toàn bộ state vào key `tungthien_survey_draft_v1` | ✅ Đạt |
| 6 | **Debounce 400ms** | Debounce thông minh cho các trường text, textarea | ✅ Đạt |
| 7 | **Banner khôi phục nháp** | Hiển thị rõ mốc thời gian lưu nháp gần nhất | ✅ Đạt |
| 8 | **Phục hồi nguyên vẹn dữ liệu** | Điền lại radio, text, mở đúng tab và các ô góp ý chi tiết | ✅ Đạt |
| 9 | **Chức năng Làm lại từ đầu** | Hộp thoại xác nhận an toàn, reset form sạch sẽ | ✅ Đạt |
| 10 | **Cảnh báo beforeunload** | Cảnh báo trình duyệt khi đang làm dở form | ✅ Đạt |

---

## 3. Kế hoạch tiếp theo (Phase 06)

Tiến hành triển khai **Phase 06 — Màn hình rà soát và hoàn tất**:
1. **Bổ sung nút `[Chỉnh sửa]` trực tiếp:** Tại màn hình Xác nhận (Bước 4), cho phép người dân bấm chỉnh sửa nhanh để quay về đúng Bước 1, Bước 2 hoặc Bước 3 tương ứng.
2. **Trạng thái Gửi phiếu & Chống double-click:** Bổ sung hiệu ứng Loading Spinner khi bấm *"Hoàn tất góp ý"*, tự động vô hiệu hóa (`disabled`) nút bấm để tránh gửi trùng lặp.
3. **Mã số phiếu khảo sát duy nhất:** Màn hình Bước 5 sinh mã biên nhận điện tử ngẫu nhiên (ví dụ: `TT-2026-XXXX`) kèm thời gian tiếp nhận chính xác để người dân lưu lại tra cứu.
