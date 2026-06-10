
export const runtime = 'nodejs';

function translateDemo(text, pageNumber, style) {
  const styleLabel = {
    literal: 'sát nghĩa',
    vietnameseStreet: 'dân dã Việt Nam',
    manga: 'truyện tranh mượt',
    harshSafe: 'giữ độ gắt có kiểm soát',
  }[style] || 'dân dã Việt Nam';

  return [
    `[Bản dịch demo - Trang ${pageNumber}]`,
    `Văn phong: ${styleLabel}`,
    '',
    'Cậu đang làm cái quái gì ở đây vậy?!',
    'Hiệu ứng: ẦM!',
    '',
    `OCR demo: ${text}`,
  ].join('\n');
}

export async function POST(req) {
  const body = await req.json();
  const chapter = body.chapter;
  const style = body.style || 'vietnameseStreet';

  const pages = (chapter?.pages || []).map((page) => ({
    ...page,
    translation: translateDemo(page.ocrText || '', page.number, style),
  }));

  return Response.json({ ok: true, pages });
}
