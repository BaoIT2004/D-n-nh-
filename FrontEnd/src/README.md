# Bắt đầu với `src`

Chỉ cần làm quen với các thư mục cơ bản này trước:

```text
src/
├── assets/       # Hình ảnh, biểu tượng
├── components/   # Các phần giao diện nhỏ dùng lại
├── hooks/        # Custom hooks; useState vẫn viết trong component
├── pages/        # Các trang chính của ứng dụng
├── services/     # Gọi API; hàm ở đây có thể dùng với React Query
├── store/        # Redux: cấu hình store và các slice
└── styles/       # CSS
```

## Đặt công nghệ ở đâu?

- **React + TypeScript:** component React viết trong tệp `.tsx`; mã TypeScript
  thông thường viết trong tệp `.ts`.
- **useState:** dùng ngay trong component khi dữ liệu chỉ cần ở component đó.
- **React Hook Form:** dùng trong component/page có biểu mẫu; chưa cần tạo thư
  mục riêng cho form.
- **Redux:** đặt cấu hình store và slice trong `store/`.
- **React Query:** đặt hàm gọi API trong `services/`, rồi gọi hàm đó từ
  `useQuery` hoặc `useMutation` trong component.

Khi chưa cần một thư mục, cứ để trống. Chỉ thêm cấu trúc mới khi dự án thực sự
có thêm nhiều trang hoặc tính năng.
