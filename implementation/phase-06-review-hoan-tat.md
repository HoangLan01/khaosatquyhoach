# Phase 06 — Màn hình rà soát và hoàn tất

## 1. Mục tiêu

Trước khi gửi ý kiến, người dân phải có cơ hội kiểm tra lại toàn bộ nội dung.

Không gửi ngay khi bấm xong câu hỏi cuối.

---

## 2. Cấu trúc Review Screen

### Phần 1 — Đồ án

```text
Đồ án góp ý

Quy hoạch phân khu đô thị ST3
```

hoặc:

```text
Cả hai đồ án
- ST3
- Vùng hồ Xuân Khanh và phụ cận
```

Có nút:

```text
[Chỉnh sửa]
```

---

## 3. Phần 2 — Người góp ý

Hiển thị:

```text
Họ và tên:
Địa chỉ:
Số điện thoại:
Email:
```

Có nút:

```text
[Chỉnh sửa]
```

---

## 4. Phần 3 — Nội dung góp ý

Ví dụ:

```text
1. Các căn cứ lập quy hoạch đã đầy đủ hay chưa?

✓ Đồng thuận

Ý kiến chi tiết:
Không có.
```

Các lựa chọn cần hiển thị dạng badge dễ nhận biết.

---

## 5. Nếu góp ý cả hai đồ án

Tách thành:

```text
A. QUY HOẠCH ST3
...

B. QUY HOẠCH VÙNG HỒ XUÂN KHANH
...
```

Không trộn câu trả lời của hai đồ án.

---

## 6. Ý kiến khác

Hiển thị nguyên văn nội dung người dân nhập.

Nếu trống:

```text
Không có ý kiến khác.
```

---

## 7. Nút gửi

Khi chưa có backend:

> **Hoàn tất bản khảo sát mẫu**

Sau khi tích hợp backend:

> **Gửi ý kiến**

Trước khi gửi:
- disable double click.
- hiển thị trạng thái loading.

Ví dụ:

```text
Đang gửi ý kiến...
```

---

## 8. Trạng thái gửi

### Success

```text
✓ GỬI Ý KIẾN THÀNH CÔNG

UBND phường Tùng Thiện trân trọng cảm ơn
ý kiến đóng góp của Quý vị.

[Mở lại trang chủ]
```

Có thể hiển thị:
- mã phiếu;
- thời gian gửi.

---

### Error

```text
Không thể gửi ý kiến lúc này.

Nội dung của bạn vẫn được lưu trên thiết bị.

[Thử lại]
```

Không reset form.

---

## 9. UX mobile

Review screen có thể rất dài.

Cần:
- card gọn;
- heading sticky hoặc rõ ràng;
- nút gửi sticky bottom.

Ví dụ:

```text
[← Chỉnh sửa]          [Gửi ý kiến]
```

---

## 10. Tiêu chí hoàn thành

- [ ] Review hiển thị đầy đủ dữ liệu.
- [ ] Hai đồ án được tách rõ.
- [ ] Có nút chỉnh sửa từng phần.
- [ ] Gửi không bị double-submit.
- [ ] Có loading state.
- [ ] Có success screen.
- [ ] Có error screen.
- [ ] Nếu lỗi không mất dữ liệu.
