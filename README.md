# Dịch Truyện Ảnh Việt Hóa - Vercel Ready

Project này đã có đủ thư mục `app/`, file `page.jsx`, `layout.jsx`, `globals.css`, và API route `/api/translate` để deploy lên Vercel.

## Cấu trúc đúng

```text
package.json
next.config.mjs
app/
  layout.jsx
  page.jsx
  globals.css
  api/
    translate/
      route.js
README.md
.gitignore
.env.example
```

## Deploy Vercel

1. Giải nén file zip.
2. Upload toàn bộ file/thư mục bên trong lên GitHub repo.
3. Vào Vercel → New Project → Import repo.
4. Framework Preset: Next.js.
5. Build Command: `npm run build`.
6. Output Directory: để trống.
7. Deploy.

## Lưu ý

Bản này là bản demo chạy được trước. API OCR/dịch thật sẽ nối sau trong file `app/api/translate/route.js`.
