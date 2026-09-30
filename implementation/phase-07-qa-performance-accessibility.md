# Phase 07 — QA, Performance & Accessibility

## 1. Mục tiêu

Đảm bảo front-end sẵn sàng để đưa vào sử dụng thực tế trước khi nối backend chính thức.

---

## 2. Browser cần test

### Android
- Chrome mới nhất.
- Samsung Internet nếu có điều kiện.

### iPhone
- Safari.
- Chrome iOS.

### Desktop
- Chrome.
- Edge.
- Firefox.
- Safari macOS nếu có điều kiện.

---

## 3. Test case chức năng

### Hồ sơ
- [ ] Mở PDF được.
- [ ] Mở tab mới được.
- [ ] Tải PDF được.
- [ ] Trình duyệt không hỗ trợ PDF vẫn có phương án thay thế.

### Xác nhận
- [ ] Chưa xác nhận → không vào form.
- [ ] Đã xác nhận → vào form.
- [ ] Reload → trạng thái vẫn còn.

### Chọn đồ án
- [ ] ST3.
- [ ] Xuân Khanh.
- [ ] Cả hai.

### Form
- [ ] Đi tiếp.
- [ ] Quay lại.
- [ ] Dữ liệu không mất.
- [ ] Validation hoạt động.

### Draft
- [ ] Reload giữa chừng.
- [ ] Khôi phục draft.
- [ ] Reset draft.

### Review
- [ ] Nội dung chính xác.
- [ ] Chỉnh sửa quay đúng bước.

---

## 4. Responsive QA

Test tại:

```text
320px
360px
375px
390px
414px
430px
768px
1024px
1366px
```

Ở mỗi kích thước kiểm tra:

- không tràn ngang;
- không che button;
- textarea không tràn;
- heading không vỡ layout;
- PDF block không vượt viewport.

---

## 5. Network test

Thử:
- Wi-Fi.
- Fast 4G.
- Slow 4G / throttling.

Landing page phải hiển thị trước PDF.

Không preload PDF 38MB nếu chưa cần.

---

## 6. Performance

### Mục tiêu

- HTML/CSS/JS nhẹ.
- Không phụ thuộc library lớn nếu không cần.
- Image sử dụng WebP/AVIF khi phù hợp.
- Lazy load ảnh ngoài viewport.
- PDF chỉ tải khi người dùng mở/xem.

### Không nên dùng
- Bootstrap chỉ để dùng grid.
- jQuery cho thao tác DOM đơn giản.
- framework SPA nếu không có nhu cầu thực tế.

HTML/CSS/JS thuần phù hợp với website này.

---

## 7. Accessibility

### Contrast
Bảo đảm chữ đủ tương phản với nền.

### Focus
Button/input phải có focus state.

```css
:focus-visible {
  outline: 3px solid rgba(...);
}
```

### Label
Mọi input phải có `<label>`.

### Icon
Icon không được là nguồn thông tin duy nhất.

Sai:

```text
✓
```

Đúng:

```text
✓ Đồng thuận
```

---

## 8. Người lớn tuổi

Đây là nhóm cần ưu tiên.

Yêu cầu:

- chữ đủ lớn;
- câu hỏi không quá dài trên một dòng;
- nút lớn;
- tương phản rõ;
- hạn chế animation;
- không dùng thuật ngữ kỹ thuật không cần thiết;
- thông báo lỗi viết bằng tiếng Việt dễ hiểu.

---

## 9. Reduced motion

CSS:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto !important;
    transition: none !important;
  }
}
```

---

## 10. Final checklist

### UI
- [ ] Mobile-first.
- [ ] Không horizontal scroll.
- [ ] Header gọn.
- [ ] CTA rõ.

### Hồ sơ
- [ ] PDF hoạt động.
- [ ] Mobile fallback tốt.

### Form
- [ ] Wizard hoạt động.
- [ ] Cả 3 lựa chọn đồ án hoạt động.
- [ ] Validation hoàn chỉnh.

### Data
- [ ] LocalStorage.
- [ ] Draft restore.
- [ ] Review screen.

### QA
- [ ] Android.
- [ ] iPhone.
- [ ] Desktop.
- [ ] Slow network.

---

## 11. Điều kiện kết thúc front-end

Front-end được coi là **hoàn chỉnh để tích hợp backend** khi:

1. Toàn bộ 7 phase đã hoàn thành.
2. Luồng khảo sát chạy end-to-end mà không cần backend.
3. Dữ liệu có thể tạo thành một JavaScript object hoàn chỉnh.
4. Responsive tốt trên 360–430px.
5. Không có lỗi nghiêm trọng trên Safari iPhone và Chrome Android.
6. Có trạng thái loading/success/error sẵn để backend sử dụng.
