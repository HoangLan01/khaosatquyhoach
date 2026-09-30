# Kế hoạch Triển khai Chi tiết: Backend Node.js, Trang Quản trị & Vận hành trên VPS

**Dự án:** Cổng lấy ý kiến cộng đồng dân cư về đồ án quy hoạch — UBND Phường Tùng Thiện  
**Tên miền:** `khaosatquyhoach.phuongtungthien.vn`  
**Máy chủ (VPS):** `103.90.227.130` (User: `root`)  
**Ngày lập:** 30/09/2026  
**Trạng thái:** 📋 Đang trình duyệt kế hoạch

---

## 1. Mục tiêu & Nguyên tắc thiết kế

1. **Hiệu năng cao & Chịu tải lớn:**
   - Phục vụ tệp tĩnh (HTML/CSS/JS/PDF 39.4MB) trực tiếp qua **Nginx** tốc độ cao, giải phóng $100\%$ tải cho Node.js.
   - Node.js chạy đa luồng (Cluster mode qua **PM2**) tận dụng tối đa số nhân CPU của VPS.
   - Cơ sở dữ liệu **SQLite WAL (Write-Ahead Logging)** siêu nhẹ, ghi đồng thời hàng chục nghìn lượt/giây, toàn bộ dữ liệu gói gọn trong 1 file duy nhất, cực kỳ an toàn và dễ sao lưu.
2. **Không giới hạn IP / Trùng Wi-Fi:**
   - Không áp dụng Rate Limit theo IP ở cổng gửi phiếu khảo sát của người dân (đảm bảo hàng trăm người trong cùng hội trường/nhà văn hóa dùng chung Wi-Fi đều gửi được).
   - Chống spam/bot bằng kỹ thuật vô hình (Honeypot + Timing verification + Data validation).
3. **Trang Quản trị (Admin) Tinh gọn & Thực dụng:**
   - Chạy chung trên cùng tên miền tại đường dẫn: `https://khaosatquyhoach.phuongtungthien.vn/admin`.
   - Thuần túy xem thông tin và thống kê: Tổng số phiếu, tỷ lệ đồng thuận, bảng danh sách ý kiến đóng góp, bộ lọc đồ án và nút **Xuất Excel 1-click**.
   - Bảo mật đăng nhập bằng tài khoản cán bộ (mật khẩu mã hóa bcrypt).

---

## 2. Kiến trúc Hệ thống (System Architecture)

```text
[ Người dân & Cán bộ ]
         │
         ▼  HTTPS (Port 443 - SSL Let's Encrypt)
┌─────────────────────────────────────────────────────────────┐
│                      NGINX REVERSE PROXY                    │
│                                                             │
│  ├── / (Static files: index.html, assets, documents/PDF)    │ ──► Phục vụ trực tiếp (Zero load Node.js)
│  ├── /admin (Admin UI: admin.html)                          │ ──► Giao diện quản trị
│  └── /api/* (API Backend: submit, stats, export)            │ ──► Chuyển tiếp về Node.js
└──────────────────────────────┬──────────────────────────────┘
                               │ (Reverse Proxy: localhost:3000)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   NODE.JS BACKEND (PM2 Cluster)             │
│                                                             │
│  ├── POST /api/survey/submit   (Nhận phiếu & sinh mã TT-..) │
│  ├── POST /api/admin/login     (Đăng nhập cán bộ & cấp JWT) │
│  ├── GET  /api/admin/stats     (Thống kê số liệu tóm tắt)   │
│  ├── GET  /api/admin/surveys   (Danh sách ý kiến + bộ lọc)  │
│  └── GET  /api/admin/export    (Xuất dữ liệu ra file Excel) │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            DATABASE: SQLite WAL (data/surveys.db)           │
│   • 1 File duy nhất, backup cực nhanh                       │
│   • Xử lý đọc/ghi đồng thời cực cao                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Cấu trúc Mã nguồn Dự kiến

```text
qlda_khaosat/
├── assets/                      # Biểu trưng logo.png, hình ảnh
├── documents/                   # Báo cáo quy hoạch PDF 39.4MB
├── public/
│   ├── index.html               # Cổng khảo sát cho người dân
│   └── admin.html               # Trang quản trị đơn giản cho cán bộ
├── server/
│   ├── app.js                   # Server chính Node.js Express
│   ├── database.js              # Khởi tạo Database SQLite & các hàm truy vấn
│   ├── auth.js                  # Middleware xác thực đăng nhập cán bộ (JWT)
│   └── package.json             # Danh sách thư viện cần dùng (express, better-sqlite3, xlsx, bcryptjs, jsonwebtoken)
├── data/
│   └── surveys.db               # Tệp cơ sở dữ liệu SQLite (tự động tạo)
├── nginx/
│   └── khaosat.conf             # Tệp cấu hình Nginx mẫu
└── implementation/              # Báo cáo theo dõi các giai đoạn
```

---

## 4. Kế hoạch Triển khai theo 5 Giai đoạn

### 🔹 GIAI ĐOẠN 1: Xây dựng Backend Node.js & Trang Admin tại Local
1. **Khởi tạo mã nguồn Node.js:**
   - Cài đặt các thư viện lõi: `express`, `better-sqlite3`, `xlsx`, `bcryptjs`, `jsonwebtoken`, `cors`, `helmet`.
   - Tạo Database SQLite với 2 bảng:
     - `surveys`: Lưu mã phiếu, họ tên, địa chỉ, SĐT, email, đồ án chọn, điểm vote từng câu, ý kiến chi tiết, ý kiến khác, thời gian gửi, IP.
     - `admins`: Lưu tài khoản và mật khẩu mã hóa của cán bộ quản trị.
2. **Xây dựng các API cốt lõi:**
   - `POST /api/survey/submit`: Tiếp nhận phiếu, kiểm tra dữ liệu, lưu vào database, trả về mã biên nhận `TT-2026-XXXXXX`.
   - `POST /api/admin/login`: Xác thực tài khoản cán bộ, trả về Token đăng nhập an toàn.
   - `GET /api/admin/stats`: Tính toán nhanh tổng số phiếu, tỷ lệ đồng thuận theo từng đồ án.
   - `GET /api/admin/surveys`: Trả về danh sách phiếu khảo sát kèm bộ lọc theo đồ án và phân trang.
   - `GET /api/admin/export`: Tạo và tải về file `.xlsx` danh sách khảo sát.
3. **Xây dựng Trang Quản trị `public/admin.html`:**
   - Thiết kế giao diện hành chính trang nhã, tông màu đồng bộ với cổng chính.
   - Màn hình đăng nhập đơn giản.
   - Dashboard hiển thị 3 Cards số liệu tóm tắt.
   - Bảng hiển thị danh sách ý kiến của người dân với bộ lọc đồ án.
   - Nút **[📥 Xuất báo cáo Excel]** tải file ngay lập tức.
4. **Nối Front-end `index.html` vào API:**
   - Cập nhật nút gửi form ở Bước 4-5 gọi lệnh `fetch('/api/survey/submit')` thực tế.

---

### 🔹 GIAI ĐOẠN 2: Cấu hình DNS Tên miền
- Truy cập trang quản trị tên miền `phuongtungthien.vn`, thêm bản ghi:
  - **Loại bản ghi (Record Type):** `A`
  - **Tên (Host / Name):** `khaosatquyhoach`
  - **Địa chỉ IP (Value):** `103.90.227.130`
  - **TTL:** Mặc định (300 hoặc Auto)

---

### 🔹 GIAI ĐOẠN 3: Cài đặt & Cấu hình Máy chủ VPS `103.90.227.130`
1. Đăng nhập SSH vào VPS: `ssh root@103.90.227.130`.
2. Cập nhật hệ điều hành: `apt update && apt upgrade -y`.
3. Cài đặt môi trường vận hành:
   - **Node.js LTS (v20+)** & **npm**.
   - **PM2**: `npm install -g pm2`.
   - **Nginx Web Server**: `apt install nginx -y`.
   - **Certbot (SSL HTTPS)**: `apt install certbot python3-certbot-nginx -y`.
4. Cấu hình Nginx Virtual Host cho tên miền `khaosatquyhoach.phuongtungthien.vn`:
   - Phục vụ tĩnh thư mục giao diện và tệp PDF.
   - Proxy ngược các yêu cầu `/api/` và `/admin` vào cổng nội bộ `127.0.0.1:3000`.

---

### 🔹 GIAI ĐOẠN 4: Đẩy mã nguồn & Khởi động Dịch vụ (Deploy)
1. Đẩy toàn bộ thư mục dự án lên `/var/www/khaosatquyhoach`.
2. Cài đặt các gói phụ thuộc: `npm install --production`.
3. Khởi tạo tài khoản Admin mặc định ban đầu cho cán bộ.
4. Khởi động Backend bằng PM2 ở chế độ Cluster:
   ```bash
   pm2 start ecosystem.config.js
   # Hoặc: pm2 start server/app.js --name "khaosat-tungthien" -i max
   pm2 startup
   pm2 save
   ```
5. Khởi động lại Nginx: `systemctl restart nginx`.

---

### 🔹 GIAI ĐOẠN 5: Cấp chứng chỉ SSL HTTPS & Kiểm thử Toàn diện (UAT)
1. Kích hoạt chứng chỉ bảo mật SSL Let's Encrypt:
   ```bash
   certbot --nginx -d khaosatquyhoach.phuongtungthien.vn
   ```
   *(Hệ thống sẽ tự động cấu hình HTTPS và tự động gia hạn khi hết hạn).*
2. **Kiểm thử thực tế (End-to-End Test):**
   - [ ] Truy cập `https://khaosatquyhoach.phuongtungthien.vn/` trên điện thoại di động và máy tính.
   - [ ] Xem thử tệp PDF quy hoạch 39.4MB (đảm bảo tải nhanh, mượt).
   - [ ] Gửi thử 1 phiếu đóng góp ý kiến $\to$ nhận mã biên nhận điện tử `TT-2026-XXXXXX`.
   - [ ] Truy cập `https://khaosatquyhoach.phuongtungthien.vn/admin` $\to$ đăng nhập cán bộ $\to$ kiểm tra xem phiếu vừa gửi đã xuất hiện trong bảng chưa.
   - [ ] Bấm nút **Xuất Excel** $\to$ mở file `.xlsx` kiểm tra độ chính xác của các cột dữ liệu.

---

## 5. Bảng thông số kỹ thuật & An toàn dữ liệu

| Hạng mục | Giải pháp kỹ thuật | Ưu điểm thực tế |
| :--- | :--- | :--- |
| **Web Server** | Nginx 1.24+ | Xử lý hàng chục nghìn kết nối đồng thời, phục vụ PDF 39.4MB siêu tốc |
| **Backend API** | Node.js Express (PM2 Cluster) | Tận dụng $100\%$ số nhân CPU của VPS, tự phục hồi nếu gặp sự cố |
| **Cơ sở dữ liệu** | SQLite WAL mode | Tốc độ ghi cực nhanh, toàn bộ nằm trong 1 file `surveys.db`, backup 1 giây |
| **Bảo mật kết nối** | HTTPS / TLS 1.3 (Let's Encrypt) | Bảo mật thông tin người dân theo tiêu chuẩn cơ quan nhà nước |
| **Chống nghẽn Wi-Fi** | No IP Rate Limiting on Submit | Hàng trăm người dân cùng Wi-Fi hội trường gửi phiếu đồng thời không bị lỗi |
| **Bảo mật Admin** | Bcrypt Password + JWT Token + Rate Limit login | Chống dò mật khẩu đăng nhập quản trị |
| **Xuất dữ liệu** | Thư viện XLSX Native | Xuất báo cáo Excel ngay lập tức mà không cần cài đặt thêm phần mềm |
