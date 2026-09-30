# Phase 05 — Validation, lưu nháp và chống mất dữ liệu

## 1. Mục tiêu

Ngăn các lỗi thường gặp:

- Người dân bỏ sót câu hỏi.
- Điền sai email/số điện thoại.
- Reload trang làm mất toàn bộ dữ liệu.
- Vô tình đóng trình duyệt.
- Quay lại bước trước bị mất câu trả lời.

---

## 2. Validation thông tin

### Họ và tên
Bắt buộc.

```text
Vui lòng nhập họ và tên.
```

### Địa chỉ
Bắt buộc.

```text
Vui lòng nhập địa chỉ.
```

### Điện thoại
Không bắt buộc.

Nếu nhập:
- chỉ chấp nhận định dạng phù hợp;
- không validation quá cứng để tránh từ chối số hợp lệ.

### Email
Không bắt buộc.

Nếu nhập:
- kiểm tra format email.

---

## 3. Validation câu hỏi

Mỗi câu bắt buộc phải có:

- Đồng thuận; hoặc
- Chưa đồng thuận.

Nếu thiếu:

1. Không chuyển bước.
2. Scroll tới câu đầu tiên chưa trả lời.
3. Focus/highlight card.
4. Hiển thị lỗi trực tiếp dưới câu.

Không chỉ hiển thị toast chung.

---

## 4. Inline error

Ví dụ:

```text
Phương án quy hoạch có phù hợp không?

[ Đồng thuận ]
[ Chưa đồng thuận ]

⚠ Vui lòng chọn một phương án.
```

CSS:

```css
.field-error {
  color: #b42318;
  font-size: 13px;
}
```

---

## 5. Lưu nháp LocalStorage

Key đề xuất:

```text
tungthien_survey_draft_v1
```

Object:

```json
{
  "step": 3,
  "project": "st3",
  "person": {
    "fullName": "",
    "address": "",
    "phone": "",
    "email": ""
  },
  "answers": {},
  "otherOpinion": "",
  "updatedAt": ""
}
```

---

## 6. Autosave

Lưu khi:

- thay đổi input;
- chọn radio;
- nhập textarea;
- chuyển bước.

Có debounce khoảng:

```text
300–500ms
```

Không cần ghi `localStorage` mỗi keypress ngay lập tức.

---

## 7. Khôi phục khảo sát

Nếu phát hiện draft:

```text
Bạn có một phiếu góp ý đang làm dở.

[Tiếp tục]
[Làm lại từ đầu]
```

Không tự động nhảy vào giữa form mà không thông báo.

---

## 8. Làm lại từ đầu

Nút:

> Làm lại từ đầu

Khi bấm:

```text
Bạn có chắc muốn xóa nội dung đang làm?
```

Sau xác nhận:
- clear draft;
- reset form;
- về bước 1.

---

## 9. Sau khi gửi thành công

Khi backend được tích hợp:

- chỉ xóa draft sau khi server trả `success`.
- nếu request lỗi, giữ nguyên draft.

Hiện tại front-end demo:
- không xóa draft nếu chỉ “Hoàn tất bản mẫu”.

---

## 10. beforeunload

Nếu người dùng đang có nội dung chưa hoàn tất, có thể sử dụng cảnh báo trình duyệt.

Không tùy chỉnh được nội dung cảnh báo trên trình duyệt hiện đại, nhưng có thể kích hoạt khi phù hợp.

---

## 11. Tiêu chí hoàn thành

- [ ] Validation inline.
- [ ] Auto-scroll tới lỗi.
- [ ] Email được kiểm tra.
- [ ] Câu hỏi bắt buộc được kiểm tra.
- [ ] Form tự lưu nháp.
- [ ] Reload không mất dữ liệu.
- [ ] Có màn khôi phục draft.
- [ ] Có chức năng reset.
- [ ] Không xóa draft ngoài ý muốn.
