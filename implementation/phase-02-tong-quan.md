# Báo cáo Tổng quan Hoàn thành — Phase 02: Tối ưu phần Hồ sơ quy hoạch

**Ngày hoàn thành:** 30/09/2026  
**Dự án:** Cổng lấy ý kiến cộng đồng dân cư về đồ án quy hoạch — UBND Phường Tùng Thiện  
**Trạng thái:** ✅ Đã hoàn thành (Phase 02 / 07)

---

## 1. Tóm tắt các công việc đã triển khai trong Phase 02

### 1.1. Chiến lược tối ưu tải & hiển thị tài liệu PDF dung lượng lớn (~39.4MB)
- **Vấn đề trước khi xử lý:** Tài liệu báo cáo quy hoạch gồm 111 trang với nhiều bản đồ màu chi tiết (dung lượng ~39.4MB). Nếu ép iframe tự động tải ngầm trên điện thoại có thể gây đơ lag, tốn dữ liệu di động 4G và khó dùng cử chỉ phóng to (pinch-to-zoom).
- **Giải pháp triển khai:**
  - **Trên Desktop/Tablet ($\ge 768\text{px}$):** Nhúng khung xem PDF trực tiếp (`iframe loading="lazy"`) với kích thước tối ưu (72vh, min-height 520px) cho phép cuộn và đọc mượt mà.
  - **Trên Mobile ($< 768\text{px}$):** Tự động hiển thị **Thẻ giới thiệu tài liệu di động (Mobile Doc Card)** trang trọng, hướng dẫn người dân bấm nút **“Mở toàn màn hình”** (mở tab mới để zoom bản đồ cực kỳ mượt mà) hoặc **“Tải về máy”**. Đồng thời cung cấp nút *“Hiển thị khung xem PDF trực tiếp trên trang”* nếu người dùng muốn đọc nhúng ngay tại landing page.

### 1.2. Bổ sung Mục lục tra cứu nhanh (Quick Shortcuts Navigation)
- Cung cấp danh mục các pill button tra cứu nhanh theo các phần trọng tâm của báo cáo đồ án:
  - 📑 **Trang 01:** Căn cứ pháp lý & Giới thiệu
  - 🗺️ **Trang 14:** Phạm vi & Ranh giới quy hoạch
  - 🏙️ **Trang 35:** Quy hoạch phân khu Đô thị ST3 (1/2000)
  - 🏞️ **Trang 68:** Quy hoạch phân khu vùng hồ Xuân Khanh (1/2000)
  - 🛣️ **Trang 92:** Hạ tầng kỹ thuật & Giao thông
- **Cơ chế hoạt động:**
  - Trên máy tính: Khi bấm vào mục lục, khung PDF tự động nhảy đến đúng trang (`#page=X&view=FitH`) và cuộn mượt đến khung tài liệu.
  - Trên điện thoại: Tự động mở đúng trang tương ứng trong cửa sổ riêng để quan sát bản đồ.

### 1.3. Cảnh báo dung lượng & Hướng dẫn thân thiện cho người dân
- Thêm hộp lưu ý màu vàng dịu mắt (`.doc-size-warning`):  
  *"Tài liệu gồm 111 trang với nhiều bản đồ màu chi tiết. Khi dùng điện thoại di động, quý vị nên chọn nút 'Mở toàn màn hình' hoặc dùng kết nối Wi-Fi để xem rõ nét nhất."*

### 1.4. Tối ưu cơ chế xác nhận đã xem (Review Confirmation Gate)
- Đồng bộ hóa lưu trữ trạng thái với `localStorage` qua 2 key: `tungthienPlanningReviewed` và `tungthien_planning_reviewed`.
- Khi người dân tích chọn:
  - Trạng thái chuyển ngay sang badge màu xanh lá nổi bật: **“✓ Đã xác nhận”**.
  - Trạng thái được duy trì khi người dùng tải lại trang (reload) hoặc quay lại sau.
  - Khi bấm nút *"Bắt đầu góp ý"* ở bất kỳ vị trí nào trên trang, hệ thống sẽ cho phép mở ngay biểu mẫu khảo sát.

### 1.5. Chuẩn hóa liên kết tệp PDF
- Đường dẫn liên kết trực tiếp đến tệp tài liệu: [documents/26.9.25- Bao cao QHPK ST3 XK.pdf](file:///d:/2025/src/qlda_khaosat/documents/26.9.25-%20Bao%20cao%20QHPK%20ST3%20XK.pdf) (mã hóa URL chuẩn RFC tránh lỗi khoảng trắng trên các hệ điều hành và trình duyệt khác nhau).

---

## 2. Bảng đối chiếu tiêu chí hoàn thành Phase 02

| Hạng mục kiểm tra | Tiêu chuẩn đặc tả | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :---: |
| **Mobile PDF Strategy** | Không làm nghẽn trang trên di động, có phương án mở tab ngoài | Đã bổ sung thẻ Mobile Doc Card + Nút Mở toàn màn hình mượt mà | ✅ Đạt |
| **Nút Mở toàn màn hình & Tải về** | Nhãn rõ ràng, hỗ trợ đầy đủ `aria-label` | Có nút "↗ Mở toàn màn hình" và "↓ Tải tài liệu (39MB)" | ✅ Đạt |
| **Mục lục xem nhanh** | Nhảy nhanh đến các trang ST3, Xuân Khanh, Căn cứ pháp lý | Đã tích hợp 5 phím tra cứu nhanh với tham số `#page=X` | ✅ Đạt |
| **Cảnh báo dung lượng** | Thông báo rõ ràng về kích thước 39MB cho người dân | Đã thêm hộp lưu ý dung lượng và khuyến nghị Wi-Fi | ✅ Đạt |
| **Hộp xác nhận đã xem** | Tích chọn và lưu trạng thái vào LocalStorage | Đã lưu `localStorage`, có badge trạng thái trực quan | ✅ Đạt |
| **Fallback cho trình duyệt** | Không khóa người dùng nếu không hỗ trợ iframe | Có nút mở ngoài và tải về luôn hiển thị dự phòng | ✅ Đạt |

---

## 3. Kế hoạch tiếp theo (Phase 03)

Chuyển sang **Phase 03 — Hoàn thiện form khảo sát Mobile-first**:
1. Nâng cấp các nút lựa chọn *Đồng thuận / Chưa đồng thuận* thành **Card lựa chọn lớn (Touch target $\ge 48\text{px}$)**, dễ thao tác 1 tay trên điện thoại.
2. Tối ưu ô nhập ý kiến chi tiết (tự động mở khi chọn *"Chưa đồng thuận"* hoặc khi người dân bấm *"Ghi thêm ý kiến"*).
3. Chuẩn hóa luồng điền form cho lựa chọn *“Cả hai đồ án”* (phân tách rõ ràng ST3 và Xuân Khanh, không bắt nhập lại thông tin cá nhân).
4. Đảm bảo bàn phím ảo (Virtual Keyboard) mở đúng kiểu (`type="tel"`, `type="email"`) và không che khuất các nút điều hướng tiếp tục.
