# Phase 03 — Hoàn thiện form khảo sát Mobile-first

## 1. Mục tiêu

Biến form hiện tại thành một **wizard khảo sát hoàn chỉnh**, dễ sử dụng bằng một tay trên điện thoại.

Không hiển thị toàn bộ câu hỏi trên một trang dài.

---

## 2. Luồng khảo sát

```text
Bước 1: Chọn đồ án
       ↓
Bước 2: Thông tin người góp ý
       ↓
Bước 3: Ý kiến về đồ án
       ↓
Bước 4: Ý kiến khác
       ↓
Bước 5: Kiểm tra và xác nhận
```

---

## 3. Bước 1 — Chọn đồ án

Hiển thị 03 lựa chọn dạng card lớn:

### Lựa chọn 1
**Quy hoạch phân khu đô thị ST3**

### Lựa chọn 2
**Quy hoạch phân khu khu chức năng vùng hồ Xuân Khanh và phụ cận**

### Lựa chọn 3
**Góp ý cho cả hai đồ án**

Trên mobile mỗi card chiếm 100% chiều ngang.

Không dùng radio button nhỏ làm vùng click duy nhất.

Toàn bộ card phải click được.

---

## 4. Bước 2 — Thông tin người góp ý

Các trường:

### Bắt buộc
- Họ và tên.
- Địa chỉ.

### Không bắt buộc
- Số điện thoại.
- Email.

### Không đưa vào form online
- Fax.

Lý do: không cần thiết đối với khảo sát trực tuyến hiện tại.

---

## 5. Bước 3 — Ý kiến về quy hoạch

Nhóm câu hỏi:

1. Các căn cứ lập quy hoạch đã đầy đủ hay chưa?
2. Quy mô lập quy hoạch có phù hợp với quy định không?
3. Tính chất và chức năng khu vực có phù hợp không?
4. Phương án quy hoạch có phù hợp không?
5. Có đồng ý với toàn bộ nội dung đồ án để triển khai các bước tiếp theo không?

---

## 6. Thiết kế lựa chọn

Thay vì:

```text
○ Đồng thuận
○ Chưa đồng thuận
```

nên dùng:

```text
┌─────────────────────┐
│ ✓ Đồng thuận        │
└─────────────────────┘

┌─────────────────────┐
│ × Chưa đồng thuận   │
└─────────────────────┘
```

Trên điện thoại:
- Hai nút có thể xếp dọc.
- Chiều cao tối thiểu 48px.
- Toàn vùng button có thể bấm.

Khi được chọn:
- Border đổi màu.
- Background đổi nhẹ.
- Có dấu ✓.

---

## 7. Ý kiến chi tiết

Dưới mỗi câu:

```text
+ Ghi thêm ý kiến
```

Khi bấm mới mở textarea.

Điều này giúp form ngắn và dễ nhìn.

Nếu chọn “Chưa đồng thuận”, có thể tự động mở ô ý kiến chi tiết.

---

## 8. Trường hợp chọn “Cả hai đồ án”

Không bắt người dân nhập thông tin cá nhân hai lần.

Luồng:

```text
Thông tin cá nhân
        ↓
A. Ý kiến đối với ST3
        ↓
B. Ý kiến đối với Xuân Khanh
        ↓
Ý kiến khác
```

Hiển thị tiêu đề rõ ràng để tránh nhầm.

---

## 9. Điều hướng form

Ở mobile sử dụng thanh điều hướng dưới cùng:

```text
[← Quay lại]             [Tiếp tục →]
```

Có thể sticky:

```css
.form-footer {
  position: sticky;
  bottom: 0;
}
```

Lưu ý:
- Không che nội dung.
- Có padding cho iPhone safe-area.

```css
padding-bottom: env(safe-area-inset-bottom);
```

---

## 10. Keyboard UX

Các input cần khai báo đúng type:

```html
<input type="tel">
<input type="email">
```

Điều này giúp điện thoại mở đúng bàn phím.

Nút “Tiếp tục” không được bị keyboard che hoàn toàn.

---

## 11. Tiêu chí hoàn thành

- [ ] Form chạy theo từng bước.
- [ ] Card lựa chọn đủ lớn trên điện thoại.
- [ ] Không nhập lại thông tin khi chọn cả hai đồ án.
- [ ] Có thể quay lại bước trước.
- [ ] Không mất dữ liệu khi chuyển bước.
- [ ] Textarea mở/đóng hợp lý.
- [ ] Nút điều hướng dễ thao tác một tay.
- [ ] Form sử dụng tốt ở 320–430px.
