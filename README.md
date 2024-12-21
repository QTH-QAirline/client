# Dự án Next.js phát triển website đặt vé máy bay

Đây là một dự án [Next.js](https://nextjs.org/) được khởi tạo bằng công cụ [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Bắt đầu

### 1. Cấu hình môi trường

Trước khi chạy ứng dụng, bạn cần tạo một tệp `.env.local` tại thư mục gốc của dự án với nội dung như sau:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

Trong đó:

- `NEXT_PUBLIC_BACKEND_URL` là URL của backend mà ứng dụng sẽ kết nối. Mặc định là `http://localhost:4000`.

### 2. Cài đặt phụ thuộc

Sử dụng lệnh sau để cài đặt các thư viện cần thiết:

```bash
npm install
```

### 3. Chạy ứng dụng ở môi trường phát triển

Sau khi cài đặt xong, bạn có thể chạy server phát triển bằng một trong các lệnh sau:

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
# hoặc
bun dev
```

Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000) để xem kết quả.

Bạn có thể bắt đầu chỉnh sửa các trang bằng cách thay đổi file `app/page.tsx`. Các thay đổi sẽ tự động cập nhật trên trình duyệt khi bạn lưu file.

## Phông chữ

Dự án này sử dụng [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) để tối ưu hóa và tải phông chữ [Geist](https://vercel.com/font), một họ phông chữ mới từ Vercel.

## Tìm hiểu thêm

Để tìm hiểu thêm về Next.js, bạn có thể tham khảo các tài nguyên sau:

- [Next.js Documentation](https://nextjs.org/docs) - tìm hiểu về các tính năng và API của Next.js.
- [Learn Next.js](https://nextjs.org/learn) - một khóa học tương tác về Next.js.
  Bạn cũng có thể ghé thăm [kho GitHub của Next.js](https://github.com/vercel/next.js) - nơi ý kiến phản hồi và đóng góp của bạn được chào đón!

## Triển khai trên Vercel

Cách dễ nhất để triển khai ứng dụng Next.js của bạn là sử dụng [Nền tảng Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) - được tạo bởi đội ngũ phát triển Next.js.

Xem thêm tài liệu về [triển khai Next.js](https://nextjs.org/docs/app/building-your-application/deploying) để biết thêm chi tiết.
