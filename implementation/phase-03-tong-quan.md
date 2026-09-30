# Báo cáo Tổng quan Hoàn thành — Phase 03: Hoàn thiện Form khảo sát Mobile-First

**Ngày hoàn thành:** 30/09/2026  
**Dự án:** Cổng lấy ý kiến cộng đồng dân cư về đồ án quy hoạch — UBND Phường Tùng Thiện  
**Trạng thái:** ✅ Đã hoàn thành (Phase 03 / 07)

---

## 1. Tóm tắt các công việc đã triển khai trong Phase 03

### 1.1. Bước 1 — Chọn đồ án dạng Card lớn (Touch target $\ge 64\text{px}$)
- **Trước khi xử lý:** Dùng radio button nhỏ, người dân lớn tuổi khó chạm chính xác trên màn hình cảm ứng.
- **Sau khi nâng cấp:** 
  - Toàn bộ khối đồ án là **Card bấm lớn** (`.project-choice-card`), hỗ trợ chạm vào bất kỳ vị trí nào trên thẻ.
  - Khi được chọn: Card tự động đổi màu viền đỏ chủ đạo, nền ửng hồng (`#fff5f5`), tạo hiệu ứng đổ bóng trực quan.

### 1.2. Bước 2 — Tối ưu Form thông tin & Trải nghiệm Bàn phím ảo (Virtual Keyboard)
- Gắn thẻ HTML chuẩn hỗ trợ hệ điều hành iOS / Android mở đúng kiểu bàn phím:
  - Trường **Số điện thoại:** `type="tel"`, `inputmode="tel"`, `autocomplete="tel"`.
  - Trường **Email:** `type="email"`, `inputmode="email"`, `autocomplete="email"`.
  - Trường **Họ tên & Địa chỉ:** `autocomplete="name"`, `autocomplete="street-address"`.
- Bỏ trường Fax (không phù hợp với biểu mẫu trực tuyến).
- Chiều cao các ô input tối thiểu $48\text{px}$, phông chữ $15\text{px}$ ngăn Safari tự động phóng to màn hình khi focus.

### 1.3. Bước 3 — Biểu mẫu đánh giá Đồ án chuẩn Mobile-First (Trọng tâm)
- **Nâng cấp nút lựa chọn Đồng thuận / Chưa đồng thuận:**
  - Thiết kế 2 nút dạng Card lớn (`.vote-card`, chiều cao $\ge 50\text{px}$):
    - **✓ Đồng thuận:** Nền xanh lá dịu mắt (`--green-soft`), viền xanh đậm, biểu tượng check nổi bật.
    - **× Chưa đồng thuận:** Nền vàng cam cảnh báo (`--amber-soft`), viền cam đậm.
- **Cơ chế mở rộng ô ý kiến chi tiết thông minh (Smart Accordion):**
  - Mặc định form hiển thị cực kỳ ngắn gọn, sạch sẽ.
  - Khi người dân chọn **“× Chưa đồng thuận”**: Ô textarea tự động mở rộng kèm hiệu ứng trượt mượt và placeholder gợi ý: *"Vui lòng nêu rõ lý do chưa đồng thuận hoặc đề xuất phương án phù hợp..."*.
  - Có nút bấm thủ công **“✎ Ghi thêm ý kiến chi tiết” / “▲ Thu gọn”** cho phép người dân chủ động đóng/mở.
- **Xử lý chuyên biệt cho lựa chọn “Cả hai đồ án”:**
  - Tích hợp thanh **Tab Switcher** (Tab A: *Đồ án ST3* — Tab B: *Vùng hồ Xuân Khanh*).
  - Phân tách rõ ràng 5 câu hỏi của từng đồ án, không bắt người dân cuộn qua 10 câu hỏi liên tục gây ngợp thông tin.
  - Khi kiểm tra nếu người dân còn câu chưa chọn ở đồ án nào, hệ thống tự động chuyển đúng tab đó và thông báo nhắc nhở.

### 1.4. Bước 4 & 5 — Màn hình Rà soát tổng hợp & Hoàn tất
- **Màn hình xác nhận (Bước 4):**
  - Tổng hợp đầy đủ: Thông tin người tham gia, lựa chọn Đồng thuận/Chưa đồng thuận (kèm huy hiệu màu sắc trực quan) và hiển thị trích dẫn nguyên văn các ý kiến chi tiết đã điền.
  - Ô nhập ý kiến, đề xuất khác với không gian viết rộng rãi.
- **Màn hình hoàn tất (Bước 5):**
  - Biểu tượng tích xanh thành công, lời cảm ơn trang trọng từ UBND phường Tùng Thiện.

### 1.5. Trải nghiệm cuộn & Safe-area trên điện thoại di động
- Modal tự động chuyển sang chế độ **Full-screen** trên thiết bị di động ($< 768\text{px}$).
- Tích hợp xử lý `padding-bottom: calc(24px + env(safe-area-inset-bottom))` bảo vệ khỏi thanh điều hướng Home Indicator của iPhone.
- Tự động cuộn mượt về đầu modal mỗi khi chuyển bước (`goToStep`).

---

## 2. Bảng đối chiếu tiêu chí hoàn thành Phase 03

| Hạng mục kiểm tra | Tiêu chuẩn đặc tả | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Card chọn đồ án** | Card lớn chiếm 100% width mobile, click toàn vùng | 3 Card đồ án lớn, đổi màu viền và đổ bóng khi chọn | ✅ Đạt |
| **Bàn phím ảo di động** | Mở đúng bàn phím số/email, không auto-zoom | Đã gắn `inputmode`, `type`, `autocomplete` chuẩn | ✅ Đạt |
| **Nút vote lớn** | Nút $\ge 48\text{px}$, xếp cạnh nhau/dọc dễ chạm | 2 Card vote $\ge 50\text{px}$, màu xanh/cam nhận diện cao | ✅ Đạt |
| **Auto-expand ô góp ý** | Tự động mở textarea khi chọn Chưa đồng thuận | Đã kích hoạt kèm placeholder gợi ý viết lý do | ✅ Đạt |
| **Góp ý cả hai đồ án** | Không nhập lại thông tin cá nhân, phân nhóm rõ | Tích hợp Tab A/B chuyển đổi mượt mà giữa 2 đồ án | ✅ Đạt |
| **Điều hướng & Không mất dữ liệu** | Chuyển qua lại giữa các bước không mất nội dung | Dữ liệu được lưu trong biến state và form DOM | ✅ Đạt |

---

## 3. Kế hoạch tiếp theo (Phase 04)

Chuyển sang **Phase 04 — Responsive & Mobile UX**:
1. Rà soát và kiểm thử toàn diện trên các kích thước màn hình phổ biến: 320px, 360px, 375px, 390px, 414px, 430px và 768px+.
2. Đảm bảo triệt tiêu hoàn toàn hiện tượng tràn ngang (zero horizontal overflow) trên toàn trang.
3. Tối ưu hóa cỡ chữ, khoảng cách đệm (padding/margin) và độ tương phản cao cho người dân cao tuổi.
4. Đảm bảo trải nghiệm xoay màn hình (Portrait / Landscape) ổn định.
