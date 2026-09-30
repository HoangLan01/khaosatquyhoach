# Kế hoạch triển khai Front-end — Website khảo sát UBND phường Tùng Thiện

## Mục tiêu

Hoàn thiện phần front-end của website lấy ý kiến người dân đối với:
- Quy hoạch phân khu đô thị ST3.
- Quy hoạch phân khu khu chức năng vùng hồ Xuân Khanh và phụ cận.

Định hướng chính: **mobile-first**, ưu tiên người dân truy cập bằng điện thoại qua QR/link.

## Danh sách phase

1. [Phase 01 — Chuẩn hóa cấu trúc và điều hướng](phase-01-cau-truc-dieu-huong.md)
2. [Phase 02 — Tối ưu phần Hồ sơ quy hoạch](phase-02-ho-so-quy-hoach.md)
3. [Phase 03 — Hoàn thiện form khảo sát Mobile-first](phase-03-form-khao-sat-mobile-first.md)
4. [Phase 04 — Responsive & Mobile UX](phase-04-responsive-mobile-ux.md)
5. [Phase 05 — Validation, LocalStorage và chống mất dữ liệu](phase-05-validation-localstorage.md)
6. [Phase 06 — Màn hình rà soát và hoàn tất](phase-06-review-hoan-tat.md)
7. [Phase 07 — QA, Performance & Accessibility](phase-07-qa-performance-accessibility.md)

## Thứ tự triển khai đề xuất

```text
Phase 01
   ↓
Phase 02
   ↓
Phase 03
   ↓
Phase 04
   ↓
Phase 05
   ↓
Phase 06
   ↓
Phase 07
   ↓
Sẵn sàng tích hợp Backend
```

## Ưu tiên

- **P0:** Phase 01, 03, 04
- **P1:** Phase 02, 05, 06
- **P2:** Phase 07

Phase 04 cần được kiểm thử xuyên suốt trong tất cả các phase, không nên để tới cuối mới xử lý responsive.
