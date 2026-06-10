
# Dịch Truyện Reader - Link Import

Bản này deploy được trên Vercel, có chế độ dán link chapter, import demo, dịch demo, và đọc ngay trong app.

## Cấu trúc

```text
package.json
next.config.mjs
app/
  layout.jsx
  page.jsx
  globals.css
  api/
    import-chapter/route.js
    translate-chapter/route.js
```

## Deploy

- Upload toàn bộ file/thư mục trong zip lên GitHub.
- Vercel Framework Preset: Next.js.
- Build Command: `npm run build`.
- Output Directory: để trống.

## Ghi chú

- Bản hiện tại dùng import/dịch demo để tránh lỗi deploy và đọc thử luồng.
- Khi nối thật, sửa logic tại `app/api/import-chapter/route.js` và `app/api/translate-chapter/route.js`.
- Chỉ sử dụng với nội dung bạn có quyền truy cập và phù hợp với điều khoản của nguồn nội dung.
