# Phase 04 — Responsive & Mobile UX

## 1. Mục tiêu

Đây là phase ưu tiên cao nhất.

Website phải được tối ưu để người dân:
- quét QR;
- mở bằng điện thoại;
- xem hồ sơ;
- điền khảo sát;
- hoàn thành mà không phải zoom hoặc xoay màn hình.

Thiết kế theo **mobile-first**.

---

## 2. Thiết bị cần test

### Mobile nhỏ
- 320 × 568

### Mobile phổ biến
- 360 × 800
- 375 × 812
- 390 × 844
- 393 × 852
- 414 × 896
- 430 × 932

### Tablet
- 768 × 1024

### Desktop
- 1366 × 768
- 1440 × 900
- 1920 × 1080

---

## 3. Typography

### Mobile

```css
body {
  font-size: 16px;
}
```

Khuyến nghị:

| Thành phần | Cỡ chữ |
|---|---:|
| Body | 15–16px |
| Label | 14–15px |
| Button | 15–16px |
| H1 | 32–40px |
| H2 | 26–32px |
| H3 | 20–24px |

Không dùng chữ dưới 12px cho nội dung quan trọng.

---

## 4. Touch target

Mọi vùng thao tác:

```text
Tối thiểu 44 × 44px
```

Khuyến nghị:

```css
button {
  min-height: 48px;
}
```

Khoảng cách giữa các button:
- tối thiểu 8px;
- ưu tiên 12px.

---

## 5. Container

Mobile:

```css
.container {
  width: 100%;
  padding-inline: 16px;
}
```

Mobile rất nhỏ:

```css
@media (max-width: 340px) {
  .container {
    padding-inline: 12px;
  }
}
```

Desktop:

```css
@media (min-width: 1024px) {
  .container {
    max-width: 1160px;
    margin: 0 auto;
  }
}
```

---

## 6. Form layout

Mobile:

```text
Họ và tên
[input]

Số điện thoại
[input]

Địa chỉ
[input]

Email
[input]
```

Không đặt hai input cạnh nhau.

Desktop mới chuyển thành 2 cột.

---

## 7. Survey modal

Bản hiện tại dùng modal.

Trên mobile nên chuyển thành:

```css
@media (max-width: 767px) {
  .modal-backdrop {
    padding: 0;
  }

  .modal {
    width: 100%;
    height: 100dvh;
    border-radius: 0;
    overflow-y: auto;
  }
}
```

Khi đó trải nghiệm giống một trang/app độc lập.

Desktop:
- giữ modal ở giữa.
- max-width khoảng 680–760px.

---

## 8. Safe area iPhone

Các thành phần sticky bottom:

```css
padding-bottom:
  calc(12px + env(safe-area-inset-bottom));
```

Đặc biệt cần test trên iPhone có Dynamic Island/Home Indicator.

---

## 9. Viewport height

Không dùng:

```css
height: 100vh;
```

cho mobile full screen.

Ưu tiên:

```css
min-height: 100dvh;
```

để tránh lỗi thanh địa chỉ Safari/Chrome.

---

## 10. Horizontal overflow

Bắt buộc test:

```javascript
document.documentElement.scrollWidth
```

không được lớn hơn:

```javascript
window.innerWidth
```

Kiểm tra:
- bảng;
- PDF viewer;
- button;
- textarea;
- heading dài.

---

## 11. Hình ảnh

Sử dụng:

```css
img {
  max-width: 100%;
  height: auto;
}
```

Nếu sử dụng cover PDF:

```html
loading="lazy"
```

---

## 12. Sticky action bar

Khi khảo sát:

```text
---------------------------------
← Quay lại        Tiếp tục →
---------------------------------
```

Thanh này luôn nhìn thấy.

Không đặt sticky trên landing page nếu gây che nội dung.

---

## 13. Test xoay màn hình

Test:
- Portrait.
- Landscape.

Không bắt buộc tối ưu landscape hoàn hảo, nhưng:
- không tràn layout;
- vẫn bấm được nút;
- không mất nội dung.

---

## 14. Tiêu chí hoàn thành

- [ ] Chạy tốt ở 320px.
- [ ] Chạy tốt ở 390px.
- [ ] Chạy tốt ở 430px.
- [ ] Không có horizontal scroll.
- [ ] Font dễ đọc.
- [ ] Button ≥44px.
- [ ] Modal mobile full-screen.
- [ ] Keyboard không che thao tác.
- [ ] Safe-area iPhone được xử lý.
- [ ] Desktop vẫn hiển thị đẹp.
