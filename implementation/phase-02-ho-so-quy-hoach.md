# Phase 02 — Tối ưu phần Hồ sơ quy hoạch

## 1. Mục tiêu

Cho phép người dân **xem hồ sơ quy hoạch trước khi làm khảo sát**, đặc biệt thuận tiện trên điện thoại.

Tài liệu hiện tại là báo cáo chung của:

- Quy hoạch phân khu đô thị ST3.
- Quy hoạch phân khu khu chức năng vùng hồ Xuân Khanh và phụ cận.
- Tỷ lệ 1/2000.

Tài liệu dài 111 trang nên không nên ép người dùng điện thoại xem toàn bộ PDF trong một iframe nhỏ.

---

## 2. Giao diện đề xuất

### Mobile

Hiển thị theo cấu trúc:

```text
HỒ SƠ QUY HOẠCH

[Bìa tài liệu]

Báo cáo Đồ án Quy hoạch phân khu ST3,
vùng hồ Xuân Khanh và phụ cận

111 trang · PDF

[Xem hồ sơ]
[Mở toàn màn hình]
[Tải PDF]

☐ Tôi đã xem hồ sơ quy hoạch trước khi góp ý
```

### Desktop

Có thể sử dụng:
- PDF viewer nhúng.
- Chiều cao khoảng 70–80vh.
- Nút mở tab mới.
- Nút tải tài liệu.

---

## 3. Mobile PDF strategy

Trên mobile:

### Ưu tiên 1
Không nhúng PDF trực tiếp nếu trình duyệt xử lý không tốt.

Thay vào đó:

- Hiện ảnh cover.
- Nút “Xem hồ sơ”.
- Mở PDF trong tab/window mới.

### Ưu tiên 2
Nếu trình duyệt hỗ trợ tốt:
- Có thể giữ iframe/object.
- Nhưng vẫn luôn cung cấp nút mở ngoài.

---

## 4. Cảnh báo dung lượng

Hiển thị thông báo:

> Hồ sơ có dung lượng tương đối lớn. Khi sử dụng điện thoại, nên mở tài liệu toàn màn hình để xem rõ các bản đồ và sơ đồ quy hoạch.

Không bắt người dân phải cuộn qua toàn bộ 111 trang để được xác nhận.

---

## 5. Điều hướng nhanh trong hồ sơ

Có thể thêm các shortcut:

```text
[Tổng quan]
[Chỉ tiêu dân số]
[Quy hoạch ST3]
[Quy hoạch Xuân Khanh]
[Kết luận]
```

Khi triển khai PDF viewer hỗ trợ `#page=`, các nút có thể mở đúng trang.

Ví dụ:

```html
<a href="file.pdf#page=14">Quy hoạch ST3</a>
```

Các số trang chính xác sẽ được cấu hình theo tài liệu thực tế.

---

## 6. Xác nhận đã xem

Checkbox:

```text
☐ Tôi đã xem hồ sơ quy hoạch trước khi đóng góp ý kiến
```

Sau khi tích:

- Lưu trạng thái vào `localStorage`.
- Hiển thị badge:

```text
✓ Đã xác nhận
```

Key đề xuất:

```javascript
tungthien_planning_reviewed
```

---

## 7. Không nên làm

- Không nhúng PDF bằng base64 vào HTML.
- Không tải toàn bộ PDF trước khi landing page hiển thị.
- Không khóa người dùng nếu trình duyệt không hỗ trợ PDF viewer.
- Không sử dụng modal PDF nhỏ trên điện thoại.
- Không yêu cầu zoom thủ công để đọc nội dung.

---

## 8. Accessibility

Các nút cần có nhãn rõ:

```html
aria-label="Mở hồ sơ quy hoạch trong cửa sổ mới"
```

Không dùng icon đơn lẻ như:

```text
↗
↓
```

mà không có chữ.

---

## 9. Tiêu chí hoàn thành

- [ ] Người dùng điện thoại có thể xem hồ sơ.
- [ ] Có phương án dự phòng nếu iframe PDF không hoạt động.
- [ ] Có nút mở toàn màn hình.
- [ ] Có nút tải PDF.
- [ ] Có checkbox xác nhận.
- [ ] Trạng thái xác nhận được lưu.
- [ ] PDF không làm landing page tải chậm bất thường.
- [ ] Không có lỗi layout ở màn hình 320–430px.
