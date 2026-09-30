# Phase 04 (Backend) — Triển khai Mã nguồn & Khởi chạy PM2 Cluster trên VPS

## 1. Mục tiêu
Đẩy toàn bộ mã nguồn hệ thống (Front-end, Backend, Documents, Database) lên thư mục `/var/www/khaosatquyhoach` trên VPS `103.90.227.130`, cài đặt dependencies môi trường production, khởi tạo tài khoản Admin ban đầu và khởi chạy tiến trình Node.js dưới sự giám sát của PM2 ở chế độ Cluster.

---

## 2. Các bước Triển khai Mã nguồn (Deployment Steps)

### 2.1. Đẩy mã nguồn lên VPS
Có thể sử dụng `rsync`, `scp` hoặc `git clone` từ máy tính cục bộ lên VPS:

```bash
# Từ máy tính cục bộ (thư mục qlda_khaosat):
rsync -avz --exclude 'node_modules' --exclude '.git' . root@103.90.227.130:/var/www/khaosatquyhoach/
```

### 2.2. Phân quyền và Cài đặt Thư viện Production
Trên VPS `103.90.227.130`:
```bash
cd /var/www/khaosatquyhoach

# Cài đặt thư viện production
npm install --production

# Phân quyền thư mục ghi dữ liệu SQLite
mkdir -p data
chown -R www-data:www-data data
chmod 755 data
```

### 2.3. Khởi tạo Tài khoản Quản trị viên Mặc định
Chạy script khởi tạo tài khoản cán bộ quản trị ban đầu:
```bash
node server/init-admin.js
```
*(Tạo tài khoản admin mặc định với mật khẩu mã hóa bcrypt an toàn).*

### 2.4. Khởi chạy PM2 ở chế độ Cluster (Tối đa hóa CPU)
```bash
# Khởi động Backend đa luồng tận dụng toàn bộ số nhân CPU của VPS
pm2 start server/app.js --name "khaosat-backend" -i max

# Kiểm tra trạng thái hoạt động
pm2 status
pm2 logs khaosat-backend --lines 20

# Cấu hình PM2 tự động khởi chạy cùng hệ điều hành khi máy chủ reboot
pm2 startup
pm2 save
```

---

## 3. Tiêu chí hoàn thành (Checklist Phase 04)
- [ ] Toàn bộ mã nguồn và tệp tài liệu PDF đã nằm tại `/var/www/khaosatquyhoach`.
- [ ] `npm install --production` hoàn thành không có lỗi.
- [ ] Thư mục `data/` có quyền ghi và Database SQLite được khởi tạo thành công.
- [ ] Tài khoản Admin được khởi tạo an toàn.
- [ ] Tiến trình PM2 `khaosat-backend` đang ở trạng thái `online` (status: active).
- [ ] Máy chủ nội bộ `http://127.0.0.1:3000/api/admin/stats` phản hồi dữ liệu JSON chính xác.
