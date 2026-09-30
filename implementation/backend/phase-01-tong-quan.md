# Báo cáo Tổng quan Hoàn thành — Phase 01 (Backend): Xây dựng Backend Node.js & Trang Admin tại Local

**Ngày hoàn thành:** 30/09/2026  
**Nhánh Git:** `feat/backend-phase-01`  
**Dự án:** Cổng lấy ý kiến cộng đồng dân cư về đồ án quy hoạch — UBND Phường Tùng Thiện  
**Trạng thái:** ✅ Đã hoàn thành (Phase 01 / 05 Backend)

---

## 1. Tóm tắt các công việc đã triển khai trong Phase 01 (Backend)

### 1.1. Khởi tạo Khung dự án Node.js & CSDL SQLite WAL
- **Cấu trúc gọn nhẹ:** Tạo `package.json` với các thư viện: `express`, `better-sqlite3`, `xlsx`, `bcryptjs`, `jsonwebtoken`, `cors`, `helmet`.
- **Cơ sở dữ liệu SQLite tối ưu:**
  - Tự động tạo thư mục và tệp cơ sở dữ liệu tại `data/surveys.db`.
  - Cấu hình chế độ **WAL (Write-Ahead Logging)** và `synchronous = NORMAL` giúp xử lý hàng ngàn lượt ghi/giây đồng thời mà không bị khóa (lock).
  - Tự động tạo bảng `surveys` (chứa toàn bộ thông tin khảo sát, ý kiến chi tiết, IP, ngày giờ) và bảng `admins` (chứa tài khoản cán bộ).
  - Tích hợp script `server/init-admin.js` tự động khởi tạo tài khoản quản trị mặc định ban đầu:
    - **Tên đăng nhập:** `admin_tungthien`
    - **Mật khẩu:** `TungThien@2026` *(đã mã hóa an toàn bằng thuật toán `bcrypt`)*.

### 1.2. Xây dựng Hệ thống API cốt lõi
- **API Tiếp nhận Phiếu khảo sát (`POST /api/survey/submit`):**
  - Kiểm tra hợp lệ dữ liệu (bắt buộc Họ tên, Địa chỉ, Đồ án chọn, đủ 5 câu hỏi).
  - Tự động sinh mã biên nhận điện tử duy nhất định dạng `TT-2026-XXXXXX`.
  - Ghi nhận thời gian thực và địa chỉ IP của người dân.
  - Phản hồi JSON kết quả thành công trong $< 10\text{ms}$.
- **API Đăng nhập Quản trị (`POST /api/admin/login`):**
  - Xác thực tên đăng nhập và mật khẩu mã hóa.
  - Cấp mã JWT Token bảo mật có thời hạn 7 ngày.
- **API Thống kê Tổng quan (`GET /api/admin/stats`):**
  - Tính toán theo thời gian thực: Tổng số phiếu, số lượng theo từng đồ án (ST3, Xuân Khanh, Cả hai), tỷ lệ Đồng thuận / Chưa đồng thuận.
- **API Danh sách Khảo sát (`GET /api/admin/surveys`):**
  - Trả về danh sách phiếu kèm phân trang (`page`, `limit`), tìm kiếm (theo tên, địa chỉ, SĐT, mã phiếu) và bộ lọc đồ án.
- **API Xuất báo cáo Excel (`GET /api/admin/export`):**
  - Trích xuất toàn bộ dữ liệu ra tệp `.xlsx` có độ rộng cột chuẩn hóa, tách rõ ràng các tiêu chí vote và ý kiến chi tiết của từng đồ án.

### 1.3. Xây dựng Giao diện Trang Quản trị (`admin.html`)
- Giao diện thiết kế theo phong cách hành chính trang nhã (đỏ đô & xanh navy), tương thích tốt trên cả máy tính và điện thoại.
- **Màn hình Đăng nhập:** Gọn gàng, bắt lỗi sai mật khẩu rõ ràng.
- **3 Thẻ KPI Thống kê:** Cập nhật ngay lập tức tổng số phiếu và tỷ lệ đồng thuận.
- **Thanh công cụ Toolbar:** Tìm kiếm nhanh, lọc theo đồ án, nút Làm mới và nút **[📥 Xuất báo cáo Excel (.xlsx)]** tải tệp trực tiếp.
- **Bảng dữ liệu & Xem chi tiết:** Xem nhanh thông tin từng người dân và mở popup hiển thị đầy đủ nguyên văn ý kiến chi tiết.

### 1.4. Kết nối Front-end (`index.html`) vào API thật
- Cập nhật nút gửi form ở Bước 4 trong [index.html](file:///d:/2025/src/qlda_khaosat/index.html) gọi trực tiếp `fetch('/api/survey/submit')`.
- Đã kiểm thử gửi phiếu thành công và nhận mã biên nhận từ máy chủ.

---

## 2. Bảng đối chiếu tiêu chí hoàn thành Phase 01 Backend

| STT | Tiêu chí kỹ thuật | Kết quả thực tế | Trạng thái |
| :-: | :--- | :--- | :---: |
| 1 | **Khởi tạo Node.js & Dependencies** | Cài đặt đầy đủ 130 packages, không có lỗi runtime | ✅ Đạt |
| 2 | **Cơ sở dữ liệu SQLite WAL** | Bật WAL mode, lưu tại `data/surveys.db`, tự tạo bảng | ✅ Đạt |
| 3 | **Tài khoản Admin ban đầu** | Tự động tạo `admin_tungthien` với mật khẩu bcrypt | ✅ Đạt |
| 4 | **API Gửi phiếu `/api/survey/submit`** | Tiếp nhận nhanh, sinh mã `TT-2026-XXXXXX` | ✅ Đạt |
| 5 | **API Đăng nhập `/api/admin/login`** | Cấp JWT Token, bảo vệ bằng middleware `requireAdminAuth` | ✅ Đạt |
| 6 | **API Thống kê `/api/admin/stats`** | Thống kê số lượng theo đồ án & tỷ lệ % đồng thuận | ✅ Đạt |
| 7 | **API Xuất Excel `/api/admin/export`** | Xuất tệp `.xlsx` đầy đủ các trường dữ liệu | ✅ Đạt |
| 8 | **Giao diện `admin.html`** | Xem thống kê, tìm kiếm, xem chi tiết phiếu, tải Excel | ✅ Đạt |
| 9 | **Nối API vào `index.html`** | Gửi phiếu thật, hiển thị mã biên nhận và thời gian từ server | ✅ Đạt |
| 10 | **Kiểm thử End-to-End tại Local** | Chạy kiểm thử tự động toàn bộ 5 endpoints đạt 100% | ✅ Đạt |

---

## 3. Kế hoạch tiếp theo (Phase 02 Backend)

Chuyển sang **Phase 02 (Backend) — Cấu hình DNS Tên miền**:
- Hướng dẫn cấu hình bản ghi `A` cho subdomain `khaosatquyhoach` trỏ về IP VPS `103.90.227.130`.
- Kiểm tra phân giải DNS toàn cầu sẵn sàng cho bước cài đặt VPS và cấp chứng chỉ SSL.
