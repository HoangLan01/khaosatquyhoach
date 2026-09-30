# Phase 03 (Backend) — Cài đặt Môi trường VPS & Cấu hình Nginx Web Server

## 1. Mục tiêu
Thiết lập toàn diện môi trường phần mềm trên VPS `103.90.227.130` (User: `root`), bao gồm Node.js LTS, PM2 Process Manager, Nginx Web Server, và Certbot SSL, đồng thời cấu hình Nginx Virtual Host tối ưu cho tên miền `khaosatquyhoach.phuongtungthien.vn`.

---

## 2. Thông tin Máy chủ VPS
- **Địa chỉ IP:** `103.90.227.130`
- **Tài khoản quản trị:** `root`
- **Hệ điều hành phổ biến:** Ubuntu 22.04 / 24.04 LTS hoặc Debian 11/12

---

## 3. Các bước cài đặt Môi trường trên VPS

### 3.1. Kết nối SSH & Cập nhật Hệ thống
```bash
ssh root@103.90.227.130
apt update && apt upgrade -y
```

### 3.2. Cài đặt Node.js LTS (v20+) & PM2
```bash
# Cài đặt Node.js v20 LTS từ NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs build-essential

# Kiểm tra phiên bản
node -v
npm -v

# Cài đặt PM2 toàn cục
npm install -g pm2
```

### 3.3. Cài đặt Nginx & Certbot SSL
```bash
# Cài đặt Nginx
apt install -y nginx

# Cài đặt Certbot và plugin Nginx
apt install -y certbot python3-certbot-nginx

# Cho phép cổng qua Firewall UFW (nếu có bật)
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable
```

---

## 4. Cấu hình Nginx Virtual Host

Tạo file cấu hình tại `/etc/nginx/sites-available/khaosatquyhoach.conf`:

```nginx
server {
    listen 80;
    server_name khaosatquyhoach.phuongtungthien.vn;

    # Thư mục chứa giao diện tĩnh và tài liệu PDF
    root /var/www/khaosatquyhoach/public;
    index index.html;

    # Nén Gzip tăng tốc độ tải trang
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # 1. Phục vụ trang chủ và tệp tĩnh trực tiếp qua Nginx (Tối ưu tốc độ)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2. Phục vụ tài liệu PDF 39.4MB và Assets với HTTP Range Requests
    location /documents/ {
        alias /var/www/khaosatquyhoach/documents/;
        add_header Cache-Control "public, max-age=86400";
    }

    location /assets/ {
        alias /var/www/khaosatquyhoach/assets/;
        add_header Cache-Control "public, max-age=604800";
    }

    # 3. Phục vụ Trang quản trị Admin
    location /admin {
        try_files /admin.html =404;
    }

    # 4. Reverse Proxy toàn bộ API về Node.js (cổng 3000)
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Kích hoạt cấu hình Nginx:
```bash
ln -s /etc/nginx/sites-available/khaosatquyhoach.conf /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 5. Tiêu chí hoàn thành (Checklist Phase 03)
- [ ] Node.js v20+ và PM2 đã được cài đặt trên VPS.
- [ ] Nginx và Certbot đã được cài đặt và đang chạy `active (running)`.
- [ ] File cấu hình Virtual Host Nginx đã được tạo và kiểm tra cú pháp `nginx -t` hợp lệ.
- [ ] Thư mục gốc `/var/www/khaosatquyhoach` đã sẵn sàng để tiếp nhận mã nguồn.
