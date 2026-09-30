# Báo cáo Tổng quan Hoàn thành — Phase 05 (Backend): Kích hoạt Hệ thống & Nghiệm thu Bàn giao

**Ngày hoàn thành:** 30/09/2026  
**Nhánh Git:** `feat/backend-phase-01`  
**Dự án:** Cổng lấy ý kiến cộng đồng dân cư về đồ án quy hoạch — UBND Phường Tùng Thiện  
**Tên miền chính thức:** `http://khaosatquyhoach.phuongtungthien.vn` / `https://khaosatquyhoach.phuongtungthien.vn`  
**Địa chỉ IP VPS:** `103.90.227.130`  
**Trạng thái:** 🏆 Toàn bộ 5 Phase Backend đã hoàn tất $100\%$ và vận hành thực tế

---

## 1. Tổng kết Vận hành Hệ thống

### 1.1. Cổng Khảo sát Dân cư
- **Đường dẫn truy cập:** `http://khaosatquyhoach.phuongtungthien.vn/` (hoặc `https://...`)
- **Tài liệu PDF 39.4MB:** Phục vụ trực tiếp qua Nginx với `Accept-Ranges: bytes` và caching, tải trang siêu tốc.
- **Biểu mẫu khảo sát:** Hỗ trợ 5 bước chuẩn UX, validation inline, lưu nháp LocalStorage, gửi phiếu vào API backend và nhận mã biên nhận điện tử thời gian thực `TT-2026-XXXXXX`.

### 1.2. Phân hệ Quản trị (Admin Dashboard)
- **Đường dẫn truy cập:** `http://khaosatquyhoach.phuongtungthien.vn/admin`
- **Tài khoản quản trị:**
  - **Tên đăng nhập:** `admin`
  - **Mật khẩu:** `TungThien@2026`
- **Chức năng chính:**
  - 📊 Xem thống kê tổng số phiếu, tỷ lệ đồng thuận theo từng đồ án ST3 / Xuân Khanh / Cả hai.
  - 📋 Danh sách toàn bộ ý kiến đóng góp của người dân kèm popup xem chi tiết từng câu.
  - 🔍 Bộ lọc thông minh theo đồ án và ô tìm kiếm theo tên, SĐT, mã biên nhận.
  - 📥 Nút **[Xuất báo cáo Excel (.xlsx)]** tải tệp dữ liệu đầy đủ về máy tính chỉ với 1 cú nhấp chuột.

### 1.3. Máy chủ & Tiến trình (VPS & PM2)
- **Tiến trình Backend:** `khaosat-tungthien` (id: 2) chạy ổn định trên cổng `3026` qua PM2.
- **Cơ sở dữ liệu:** SQLite WAL mode (`data/surveys.db`), an toàn, sao lưu nhanh gọn.
- **Bảo toàn ứng dụng cũ:** Các cổng 80, 443, 3000, 3002, 3005, 3306, 5432 trên VPS không bị xáo trộn.

---

## 2. Bảng đối chiếu Hoàn thành Toàn bộ 5 Phase Backend

| Giai đoạn | Nội dung thực hiện | Kết quả thực tế | Trạng thái |
| :---: | :--- | :--- | :---: |
| **Phase 01** | Xây dựng Backend Node.js, CSDL SQLite WAL, Trang Admin & API | Đầy đủ 5 API cốt lõi & kết nối `index.html` | ✅ Đạt |
| **Phase 02** | Cấu hình DNS trỏ `khaosatquyhoach` về `103.90.227.130` | Phân giải chính xác, độ trễ $35\text{ms}$ | ✅ Đạt |
| **Phase 03** | Cấu hình Virtual Host Nginx trên VPS | Nạp cấu hình Nginx thành công | ✅ Đạt |
| **Phase 04** | Đẩy mã nguồn qua Git & Khởi chạy tiến trình PM2 | Tiến trình `khaosat-tungthien` online trên port `3026` | ✅ Đạt |
| **Phase 05** | Nghiệm thu End-to-End & Bàn giao tài khoản | Đăng nhập Admin và gửi phiếu thành công trên Live | ✅ Đạt |
