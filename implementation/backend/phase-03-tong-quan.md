# Báo cáo Tổng quan Hoàn thành — Phase 03 (Backend): Cài đặt Môi trường VPS & Cấu hình Nginx

**Ngày hoàn thành:** 30/09/2026  
**Nhánh Git:** `feat/backend-phase-01`  
**Dự án:** Cổng lấy ý kiến cộng đồng dân cư về đồ án quy hoạch — UBND Phường Tùng Thiện  
**Địa chỉ IP VPS:** `103.90.227.130`  
**Trạng thái:** ✅ Đã hoàn thành (Phase 03 / 05 Backend)

---

## 1. Kết quả Rà soát Môi trường VPS

- **Kiểm tra dịch vụ hiện hữu qua `ss -tulpn`:**
  - Nginx đã được cài đặt và đang chạy sẵn sàng tại cổng 80 & 443.
  - Node.js và PM2 (v7.0.3) đã có sẵn trên máy chủ.
  - Các cổng 3000, 3002, 3005 đang chạy ứng dụng khác.
- **Tối ưu hóa tránh xung đột:**
  - Chuyển cổng backend của hệ thống sang cổng riêng biệt: **`3026`** (`http://127.0.0.1:3026`).
  - Toàn bộ các cơ sở dữ liệu (MariaDB 3306, Postgres 5432) và ứng dụng cũ trên VPS được bảo toàn $100\%$, không bị xáo trộn.

---

## 2. Kết quả Cấu hình Nginx Virtual Host

- Đã tạo thư mục dự án: `/var/www/khaosatquyhoach`
- Đã tạo tệp cấu hình Virtual Host: `/etc/nginx/sites-available/khaosatquyhoach.conf`
- Đã kích hoạt liên kết mềm sang `/etc/nginx/sites-enabled/khaosatquyhoach.conf`
- **Kết quả kiểm tra cú pháp Nginx:**
  ```text
  nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
  nginx: configuration file /etc/nginx/nginx.conf test is successful
  ```
- Đã nạp cấu hình mới an toàn bằng `systemctl reload nginx`.

---

## 3. Bảng đối chiếu tiêu chí hoàn thành Phase 03 Backend

| STT | Tiêu chí kỹ thuật | Kết quả thực tế | Trạng thái |
| :-: | :--- | :--- | :---: |
| 1 | **Tạo thư mục dự án** | Đã tạo `/var/www/khaosatquyhoach` | ✅ Đạt |
| 2 | **Cấu hình Virtual Host** | Đã tạo `khaosatquyhoach.conf` proxy sang cổng `3026` | ✅ Đạt |
| 3 | **Kiểm tra `nginx -t`** | `syntax is ok` & `test is successful` | ✅ Đạt |
| 4 | **Reload Nginx** | Đã nạp cấu hình mới thành công, không gián đoạn app cũ | ✅ Đạt |

---

## 4. Kế hoạch tiếp theo (Phase 04 Backend)

Chuyển sang **Phase 04 (Backend) — Đẩy mã nguồn lên VPS & Khởi chạy PM2**:
- Tải mã nguồn lên thư mục `/var/www/khaosatquyhoach` trên VPS.
- Chạy `npm install --production`.
- Khởi động ứng dụng Node.js bằng PM2 với tên tiến trình `khaosat-tungthien` trên cổng `3026`.
