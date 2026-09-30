# Phase 05 (Backend) — Kích hoạt SSL HTTPS & Nghiệm thu Toàn diện (UAT)

## 1. Mục tiêu
Kích hoạt chứng chỉ bảo mật SSL/TLS miễn phí (Let's Encrypt) cho tên miền `khaosatquyhoach.phuongtungthien.vn`, tự động chuyển hướng toàn bộ kết nối HTTP sang HTTPS an toàn, và thực hiện kiểm thử nghiệm thu toàn diện (End-to-End User Acceptance Testing) trước khi chính thức đưa vào phục vụ nhân dân.

---

## 2. Kích hoạt Chứng chỉ SSL HTTPS

Trên VPS `103.90.227.130`:
```bash
# Cấp chứng chỉ SSL tự động và cấu hình vào Nginx
certbot --nginx -d khaosatquyhoach.phuongtungthien.vn --non-interactive --agree-tos --email admin@phuongtungthien.vn --redirect

# Kiểm tra cơ chế tự động gia hạn chứng chỉ
certbot renew --dry-run
```

---

## 3. Kịch bản Kiểm thử Nghiệm thu Toàn diện (End-to-End UAT Checklist)

### 3.1. Kiểm thử Cổng thông tin & Khảo sát Người dân
- [ ] **Bảo mật HTTPS:** Truy cập `http://khaosatquyhoach.phuongtungthien.vn` tự động chuyển sang `https://khaosatquyhoach.phuongtungthien.vn/` với ổ khóa xanh an toàn.
- [ ] **Tài liệu PDF:** Mở tài liệu Báo cáo quy hoạch 39.4MB mượt mà, chuyển trang nhanh qua các nút shortcut, không bị đứng trình duyệt di động.
- [ ] **Cổng kiểm soát:** Bắt buộc xem hồ sơ và tích xác nhận mới mở biểu mẫu góp ý.
- [ ] **Khảo sát Đồ án ST3:** Chọn ST3 $\to$ điền thông tin $\to$ chọn Đồng thuận/Chưa đồng thuận cho 5 câu hỏi $\to$ gửi phiếu $\to$ nhận mã biên nhận `TT-2026-XXXXXX`.
- [ ] **Khảo sát Vùng hồ Xuân Khanh:** Thao tác tương tự đối với đồ án Xuân Khanh $\to$ gửi thành công.
- [ ] **Khảo sát Cả hai đồ án:** Kiểm tra chuyển tab A (ST3) và B (Xuân Khanh), kiểm tra validation cả 2 bộ câu hỏi $\to$ gửi thành công.
- [ ] **Khôi phục bản nháp:** Tắt tab giữa chừng $\to$ mở lại $\to$ xuất hiện banner nhắc khôi phục $\to$ bấm tiếp tục $\to$ giữ nguyên đầy đủ nội dung.
- [ ] **In ấn & Biên nhận:** Bấm nút **[📋 Sao chép]** mã biên nhận và **[🖨 In phiếu xác nhận]** hiển thị bản in A4 sắc nét.

### 3.2. Kiểm thử Trang Quản trị Cán bộ (`/admin`)
- [ ] **Bảo mật Đăng nhập:** Truy cập `https://khaosatquyhoach.phuongtungthien.vn/admin` hiển thị màn hình đăng nhập. Nhập sai mật khẩu báo lỗi; nhập đúng mật khẩu chuyển vào Dashboard.
- [ ] **Thống kê số liệu:** 3 Cards số liệu cập nhật ngay lập tức: Tổng số phiếu, phân bổ theo đồ án, tỷ lệ đồng thuận.
- [ ] **Danh sách ý kiến:** Các phiếu người dân vừa gửi hiển thị đầy đủ trong bảng (Mã phiếu, Họ tên, Địa chỉ, SĐT, Ngày gửi, Đánh giá, Ý kiến chi tiết).
- [ ] **Bộ lọc & Tìm kiếm:** Lọc danh sách theo Đồ án ST3 hoặc Vùng hồ Xuân Khanh; tìm kiếm theo họ tên hoặc mã phiếu.
- [ ] **Xuất báo cáo Excel:** Bấm nút **[📥 Xuất file Excel]** $\to$ tải về tệp `.xlsx` $\to$ mở bằng Microsoft Excel kiểm tra độ sắc nét, đúng cấu trúc cột để làm báo cáo cấp trên.

### 3.3. Kiểm thử Tải cao & Dùng chung Wi-Fi (Multi-Client Test)
- [ ] Thử nghiệm 3–5 thiết bị (điện thoại, laptop) kết nối cùng 1 mạng Wi-Fi và gửi phiếu đồng thời $\to$ tất cả đều nhận mã biên nhận thành công trong $< 1\text{s}$, không thiết bị nào bị lỗi `429 Too Many Requests`.

---

## 4. Bàn giao & Tài liệu Vận hành
- [ ] Bàn giao tài khoản quản trị Admin (Tên đăng nhập & Mật khẩu).
- [ ] Hướng dẫn cán bộ quy trình sao lưu tệp cơ sở dữ liệu `data/surveys.db` định kỳ.
- [ ] Hướng dẫn quy trình xuất báo cáo Excel tổng hợp ý kiến nhân dân.
- [ ] Dự án chính thức hoàn tất và sẵn sàng công bố cho nhân dân phường Tùng Thiện.
