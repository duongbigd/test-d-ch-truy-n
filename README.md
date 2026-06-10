
# Dịch Truyện Ảnh Việt Hóa

Web app Next.js chạy trên điện thoại và máy tính.

## Chạy local

```bash
npm install
npm run dev
```

Mở: http://localhost:3000

## Deploy Vercel

1. Tạo repo GitHub và push toàn bộ project này lên.
2. Vào https://vercel.com → New Project → Import repo.
3. Framework Preset: Next.js.
4. Bấm Deploy.
5. Sau khi deploy sẽ có link dạng `https://ten-project.vercel.app`.

## Ghi chú

- Bản hiện tại là web app deploy được, API dịch/OCR đang là mock.
- File cần nối API thật: `app/api/translate/route.js`.
- Không commit API key thật; hãy đặt trong Vercel Environment Variables.
