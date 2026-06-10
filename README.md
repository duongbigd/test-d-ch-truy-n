
# Dịch Truyện Real OCR Overlay

Bản v0.4: Upload ảnh truyện → AI Vision OCR + dịch → overlay chữ Việt trực tiếp trên ảnh.

## Cách dùng

1. Upload toàn bộ nội dung trong zip lên GitHub.
2. Redeploy Vercel without build cache.
3. Vào Vercel → Project → Settings → Environment Variables.
4. Thêm `OPENAI_API_KEY`.
5. Redeploy lại.
6. Mở app → Upload ảnh → bấm `OCR + Dịch + Overlay`.

Nếu chưa có `OPENAI_API_KEY`, app vẫn chạy nhưng trả overlay demo để test giao diện.

## Files chính

```text
app/page.jsx
app/globals.css
app/api/vision-translate/route.js
```

## Lưu ý

- Dùng cho nội dung bạn có quyền truy cập/sử dụng và nhu cầu đọc cá nhân.
- Ảnh quá nặng có thể vượt giới hạn serverless. Nên test 1 trang trước, ảnh dưới khoảng 2-4MB.
