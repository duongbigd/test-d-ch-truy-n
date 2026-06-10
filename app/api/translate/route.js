export const runtime = 'nodejs';

export async function POST(req) {
  const form = await req.formData();
  const sourceLang = form.get('sourceLang') || 'auto';
  const targetLang = form.get('targetLang') || 'vi';
  const style = form.get('style') || 'vietnameseStreet';
  const profanityLevel = form.get('profanityLevel') || 'medium';
  const redrawMode = form.get('redrawMode') || 'textOnly';
  const keepNames = form.get('keepNames') || 'true';
  const glossary = form.get('glossary') || '';
  const images = form.getAll('images');

  const text = [
    '=== WEB APP ĐÃ CHẠY ===',
    `Số ảnh nhận được: ${images.length}`,
    `Nguồn: ${sourceLang} → Đích: ${targetLang}`,
    `Văn phong: ${style}`,
    `Mức khẩu ngữ/câu chửi: ${profanityLevel}`,
    `Giữ tên riêng: ${keepNames}`,
    `Cách xuất: ${redrawMode}`,
    '',
    '=== THUẬT NGỮ ===',
    glossary || 'Chưa có',
    '',
    '=== BẢN DỊCH DEMO THEO BÓNG THOẠI ===',
    '[Trang 1 - Bóng thoại 1]',
    'Gốc OCR demo: What the hell are you doing here?!',
    'Dịch: Cậu đang làm cái quái gì ở đây vậy?!',
    '',
    '[Trang 1 - Bóng thoại 2]',
    'Gốc OCR demo: Move! We do not have time!',
    'Dịch: Tránh ra! Không còn thời gian đâu!',
    '',
    'Ghi chú: Đây là API mock để deploy trước. Khi có API key OCR/dịch, thay phần TODO trong app/api/translate/route.js.'
  ].join('\n');

  return Response.json({ ok: true, text });
}
