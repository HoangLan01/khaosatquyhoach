# Báo cáo Tổng quan Hoàn thành — Phase 04 (Backend): Triển khai Mã nguồn & Khởi chạy PM2

**Ngày hoàn thành:** 30/09/2026  
**Nhánh Git:** `feat/backend-phase-01`  
**Dự án:** Cổng lấy ý kiến cộng đồng dân cư về đồ án quy hoạch — UBND Phường Tùng Thiện  
**Địa chỉ IP VPS:** `103.90.227.130`  
**Tên miền:** `khaosatquyhoach.phuongtungthien.vn`  
**Trạng thái:** ✅ Đã hoàn thành & Đang chạy Online (Phase 04 / 05 Backend)

---

## 1. Kết quả Triển khai & Khởi chạy trên VPS

### 1.1. Kéo mã nguồn từ GitHub & Cài đặt Thư viện
- Đã kéo mã nguồn nhánh `feat/backend-phase-01` về `/var/www/khaosatquyhoach`.
- Cài đặt đầy đủ các gói thư viện production.
- Khởi tạo tài khoản quản trị mặc định ban đầu: `admin_tungthien`.

### 1.2. Trạng thái Tiến trình PM2
```text
┌────┬──────────────────────┬─────────┬──────┬──────────┬────────┬──────────┐
│ id │ name                 │ mode    │ ↺    │ status   │ cpu    │ memory   │
├────┼──────────────────────┼─────────┼──────┼──────────┼────────┼──────────┤
│ 2  │ khaosat-tungthien    │ fork    │ 0    │ online   │ 0%     │ 70.9mb   │
│ 1  │ sipas-survey-phuo... │ cluster │ 2    │ online   │ 0%     │ 131.4mb  │
│ 0  │ tung-thien-backend   │ cluster │ 0    │ online   │ 0%     │ 113.6mb  │
└────┴──────────────────────┴─────────┴──────┴──────────┴────────┴──────────┘
```
- Tiến trình `khaosat-tungthien` (id 2) đang ở trạng thái **`online`**, sử dụng cổng **`3026`**, chiếm dụng chỉ ~70MB RAM và 0% CPU.
- Các tiến trình ứng dụng cũ trên VPS hoàn toàn an toàn và hoạt động bình thường.

### 1.3. Kiểm thử Kết nối Thực tế qua Tên miền
- **Trang chủ người dân:** `http://khaosatquyhoach.phuongtungthien.vn/` $\to$ HTTP 200 OK.
- **Trang quản trị cán bộ:** `http://khaosatquyhoach.phuongtungthien.vn/admin` $\to$ HTTP 200 OK.
- **Tài liệu PDF 39.4MB:** Phục vụ trực tiếp qua Nginx với `Accept-Ranges: bytes` $\to$ HTTP 200 OK.
- **API gửi phiếu khảo sát (`POST /api/survey/submit`):** Đã gửi thử phiếu và ghi nhận thành công vào CSDL SQLite trên VPS với mã biên nhận `TT-2026-4LTNSH`.

---

## 2. Bảng đối chiếu tiêu chí hoàn thành Phase 04 Backend

| STT | Tiêu chí kỹ thuật | Kết quả thực tế trên VPS | Trạng thái |
| :-: | :--- | :--- | :---: |
| 1 | **Tải mã nguồn qua Git** | Clone thành công về `/var/www/khaosatquyhoach` | ✅ Đạt |
| 2 | **Cài đặt dependencies** | `npm install --production` không có lỗi | ✅ Đạt |
| 3 | **Khởi tạo Admin** | Khởi tạo tài khoản `admin_tungthien` | ✅ Đạt |
| 4 | **Khởi chạy PM2** | Tiến trình `khaosat-tungthien` status: `online` | ✅ Đạt |
| 5 | **Kiểm thử API Live** | Gửi phiếu thành công và lưu vào CSDL trên VPS | ✅ Đạt |

---

## 3. Kế hoạch tiếp theo (Phase 05 Backend — Giai đoạn cuối cùng)

Chuyển sang **Phase 05 (Backend) — Cấp Chứng chỉ SSL HTTPS & Nghiệm thu Bàn giao**:
- Chạy lệnh `certbot` trên VPS để cấp chứng chỉ HTTPS (ổ khóa xanh an toàn).
- Nghiệm thu tính năng trên tên miền chính thức `https://khaosatquyhoach.phuongtungthien.vn/`.
