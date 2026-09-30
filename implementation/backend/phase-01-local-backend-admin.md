# Phase 01 (Backend) — Xây dựng Backend Node.js & Trang Quản trị (Admin) tại Local

## 1. Mục tiêu
Xây dựng trọn vẹn khối máy chủ Node.js Express, cơ sở dữ liệu SQLite chế độ WAL, hệ thống API tiếp nhận khảo sát, API quản trị và giao diện Admin Dashboard tối giản tại môi trường cục bộ (Local), sau đó kết nối Front-end `index.html` vào API thực tế.

---

## 2. Kiến trúc & Công nghệ
- **Môi trường:** Node.js (v20+ LTS)
- **Framework:** Express.js
- **Cơ sở dữ liệu:** SQLite (`better-sqlite3` với `PRAGMA journal_mode = WAL;`)
- **Bảo mật:** `bcryptjs` (mã hóa mật khẩu), `jsonwebtoken` (JWT Token xác thực phiên admin), `cors`, `helmet`.
- **Xuất dữ liệu:** Thư viện `xlsx` tạo file Excel native.

---

## 3. Danh sách các API cần xây dựng

### 3.1. API Dành cho Người dân
- `POST /api/survey/submit`:
  - Tiếp nhận thông tin khảo sát: `selectedProject`, `person` (họ tên, địa chỉ, SĐT, email), `answers` (các câu vote), `comments` (ý kiến chi tiết), `otherOpinion` (ý kiến khác).
  - Kiểm tra hợp lệ (Họ tên & Địa chỉ bắt buộc, đủ 5 câu hỏi của đồ án).
  - Tự động sinh mã biên nhận duy nhất: `TT-2026-XXXXXX`.
  - Lưu vào SQLite `data/surveys.db`.
  - Trả về JSON: `{ success: true, receiptCode: "TT-2026-XXXXXX", timestamp: "..." }`.

### 3.2. API Dành cho Quản trị viên (Cán bộ)
- `POST /api/admin/login`: Xác thực tên đăng nhập & mật khẩu, trả về JWT Token và thông tin cán bộ.
- `GET /api/admin/stats`: Trả về số liệu tóm tắt (Tổng số phiếu, số lượng theo ST3 / Xuân Khanh / Cả hai, tỷ lệ Đồng thuận / Chưa đồng thuận).
- `GET /api/admin/surveys`: Danh sách phiếu khảo sát có tìm kiếm (tên, SĐT, mã phiếu) và bộ lọc theo đồ án.
- `GET /api/admin/export`: Xuất và trả về tệp Excel `.xlsx` chứa toàn bộ danh sách khảo sát và ý kiến chi tiết.

---

## 4. Thiết kế Giao diện Trang Quản trị (`public/admin.html`)
- Giao diện đơn giản, nhẹ, tông màu hành chính (đỏ đô & xanh navy).
- **Khối 1:** Màn hình Đăng nhập (nếu chưa có Token).
- **Khối 2:** Dashboard tổng quan gồm 3 Cards số liệu tóm tắt.
- **Khối 3:** Bảng danh sách ý kiến đóng góp của người dân (hiển thị rõ họ tên, địa chỉ, đồ án, mức độ đồng thuận, ý kiến chi tiết).
- **Khối 4:** Bộ lọc theo đồ án và nút **[📥 Xuất file Excel]** 1-click.

---

## 5. Kết nối Front-end (`index.html`)
- Thay thế hàm giả lập gửi phiếu ở Bước 4-5 trong `index.html` bằng lệnh `fetch('/api/survey/submit', ...)` gọi trực tiếp vào API thật.
- Nhận mã biên nhận thật từ máy chủ và hiển thị lên màn hình Biên nhận điện tử Bước 5.

---

## 6. Tiêu chí hoàn thành (Checklist Phase 01)
- [ ] Khởi tạo dự án Node.js với `package.json` và cài đặt đầy đủ dependencies.
- [ ] Database SQLite được cấu hình chế độ WAL, tự động tạo bảng `surveys` và `admins`.
- [ ] API `/api/survey/submit` tiếp nhận phiếu thành công và lưu đúng dữ liệu.
- [ ] API `/api/admin/login`, `/api/admin/stats`, `/api/admin/surveys`, `/api/admin/export` hoạt động chính xác.
- [ ] Giao diện `admin.html` đăng nhập được, xem được số liệu và tải được file Excel.
- [ ] Front-end `index.html` gửi phiếu vào backend thành công end-to-end tại local.
