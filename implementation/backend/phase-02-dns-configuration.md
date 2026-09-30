# Phase 02 (Backend) — Cấu hình DNS Tên miền `khaosatquyhoach.phuongtungthien.vn`

## 1. Mục tiêu
Trỏ tên miền chính thức của cổng khảo sát `khaosatquyhoach.phuongtungthien.vn` về địa chỉ IP của máy chủ VPS `103.90.227.130` để chuẩn bị cho việc kết nối và cấp chứng chỉ bảo mật HTTPS.

---

## 2. Thông tin Bản ghi DNS cần cấu hình

| Thông số | Giá trị cấu hình | Giải thích |
| :--- | :--- | :--- |
| **Nhà cung cấp DNS** | Đơn vị quản lý tên miền `phuongtungthien.vn` | Trang quản trị DNS của đơn vị / sở TT&TT |
| **Loại bản ghi (Type)** | `A` | Trỏ tên miền về địa chỉ IPv4 máy chủ |
| **Tên bản ghi (Host / Name)** | `khaosatquyhoach` | Tạo subdomain `khaosatquyhoach.phuongtungthien.vn` |
| **Địa chỉ IP đích (Value)** | `103.90.227.130` | Địa chỉ IP của VPS máy chủ |
| **Thời gian sống (TTL)** | `300` (hoặc `Auto` / `Default`) | Thời gian cập nhật DNS toàn cầu nhanh nhất |

---

## 3. Các bước kiểm tra phân giải DNS (DNS Propagation Check)

Sau khi lưu bản ghi DNS, thực hiện các lệnh kiểm tra từ máy tính hoặc terminal:

1. **Lệnh `nslookup`:**
   ```bash
   nslookup khaosatquyhoach.phuongtungthien.vn
   ```
   *Kết quả kỳ vọng:* Trả về `Address: 103.90.227.130`.

2. **Lệnh `ping`:**
   ```bash
   ping khaosatquyhoach.phuongtungthien.vn
   ```
   *Kết quả kỳ vọng:* Nhận phản hồi ping từ IP `103.90.227.130`.

3. **Kiểm tra trực tuyến:**
   - Truy cập trang `https://dnschecker.org/` nhập `khaosatquyhoach.phuongtungthien.vn` kiểm tra xem các DNS Server tại Việt Nam (Viettel, VNPT, FPT, Google 8.8.8.8) đã nhận diện đúng IP `103.90.227.130` hay chưa.

---

## 4. Tiêu chí hoàn thành (Checklist Phase 02)
- [ ] Bản ghi `A` cho subdomain `khaosatquyhoach` đã được tạo trên trang quản lý tên miền.
- [ ] Lệnh `nslookup khaosatquyhoach.phuongtungthien.vn` phân giải chính xác về `103.90.227.130`.
- [ ] Máy chủ VPS sẵn sàng tiếp nhận các kết nối mạng đến từ tên miền này.
