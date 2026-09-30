# Phase 01 — Chuẩn hóa cấu trúc và điều hướng

## 1. Mục tiêu

Hoàn thiện cấu trúc tổng thể của website khảo sát để người dân có thể hiểu ngay:

1. Đây là trang lấy ý kiến của **UBND phường Tùng Thiện**.
2. Có **02 đồ án quy hoạch** đang được lấy ý kiến:
   - Quy hoạch phân khu đô thị ST3.
   - Quy hoạch phân khu khu chức năng vùng hồ Xuân Khanh và phụ cận.
3. Người dân cần xem hồ sơ quy hoạch trước khi góp ý.
4. Sau đó chọn đồ án muốn góp ý và thực hiện khảo sát theo từng bước.

Thiết kế theo nguyên tắc **mobile-first**, trong đó điện thoại là thiết bị sử dụng chính.

---

## 2. Phạm vi thực hiện

### 2.1. Cấu trúc landing page

Sắp xếp trang theo thứ tự:

1. Header.
2. Hero / Giới thiệu chương trình lấy ý kiến.
3. Danh sách 02 đồ án.
4. Mục tiêu – ý nghĩa.
5. Hồ sơ quy hoạch.
6. Hướng dẫn thực hiện khảo sát.
7. Nút bắt đầu góp ý.
8. Footer.

### 2.2. Luồng điều hướng chính

```text
Landing page
    ↓
Hồ sơ quy hoạch
    ↓
Xác nhận đã xem
    ↓
Bắt đầu góp ý
    ↓
Chọn đồ án
    ↓
Form khảo sát
```

---

## 3. Yêu cầu giao diện

### Header

#### Desktop
- Logo/nhận diện UBND phường Tùng Thiện bên trái.
- Menu:
  - Đồ án.
  - Hồ sơ quy hoạch.
  - Hướng dẫn.
  - Bắt đầu góp ý.
- Nút CTA nổi bật.

#### Mobile
Không sử dụng quá nhiều menu ngang.

Ưu tiên:

```text
UBND PHƯỜNG TÙNG THIỆN              ☰
```

Hoặc:

```text
UBND PHƯỜNG TÙNG THIỆN      [Góp ý]
```

Menu phụ có thể mở bằng hamburger.

---

## 4. CTA chính

Sử dụng thống nhất một nhãn:

> **Bắt đầu góp ý**

Khi người dân bấm:

### Trường hợp chưa xác nhận xem hồ sơ
- Không mở form.
- Scroll tới mục `#tai-lieu`.
- Hiển thị thông báo:

> Vui lòng xem hồ sơ quy hoạch và xác nhận trước khi đóng góp ý kiến.

### Trường hợp đã xác nhận
- Mở luồng khảo sát.

---

## 5. Thanh tiến trình khảo sát

Sau khi bắt đầu form, luôn hiển thị tiến trình.

Đề xuất:

```text
1/5  Chọn đồ án
2/5  Thông tin
3/5  Góp ý
4/5  Ý kiến khác
5/5  Xác nhận
```

Trên mobile có thể hiển thị dạng:

```text
Bước 2/5
Thông tin người góp ý
━━━━━━━━━━━━━━░░░░░
```

Không nên chỉ sử dụng các chấm tròn mà không có nhãn vì người dân lớn tuổi có thể khó hiểu.

---

## 6. Quy tắc URL/anchor

Nên sử dụng các ID:

```html
#top
#do-an
#y-nghia
#tai-lieu
#huong-dan
#khao-sat
```

Mục đích:
- Dễ điều hướng.
- Dễ tạo QR/link trực tiếp.
- Dễ mở rộng sau này.

---

## 7. Responsive

### Breakpoint đề xuất

```css
/* Mobile mặc định */
0px - 767px

/* Tablet */
768px - 1023px

/* Desktop */
1024px+
```

Không thiết kế desktop trước rồi thu nhỏ.

CSS mặc định phải dành cho mobile:

```css
.container {
  width: 100%;
  padding: 0 16px;
}
```

Sau đó mới mở rộng ở desktop.

---

## 8. Tiêu chí hoàn thành

Phase 01 được coi là hoàn thành khi:

- [ ] Trang có cấu trúc rõ ràng.
- [ ] Header hoạt động trên điện thoại.
- [ ] Không xuất hiện thanh cuộn ngang.
- [ ] CTA “Bắt đầu góp ý” hoạt động đúng điều kiện.
- [ ] Các anchor điều hướng đúng vị trí.
- [ ] Luồng khảo sát có thanh tiến trình.
- [ ] Hiển thị tốt từ 320px trở lên.
- [ ] Người dùng có thể quay lại landing page mà không mất trạng thái đang làm.
