
export const runtime = 'nodejs';

export async function POST(req) {
  const body = await req.json();
  const url = body.url || '';
  const safeTitle = url.includes('weebcentral') ? 'WeebCentral Demo Chapter' : 'Demo Chapter từ link của bạn';

  // Bản demo: dùng ảnh placeholder SVG để reader chạy ngay trên Vercel.
  // Bước sau có thể thay bằng module lấy danh sách ảnh từ nguồn hợp lệ.
  const pages = Array.from({ length: 8 }).map((_, index) => {
    const n = index + 1;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1280" viewBox="0 0 900 1280"><rect width="900" height="1280" fill="#111827"/><rect x="70" y="70" width="760" height="1140" rx="32" fill="#f8fafc"/><rect x="120" y="130" width="660" height="210" rx="24" fill="#e2e8f0"/><text x="450" y="250" font-family="Arial" font-size="42" text-anchor="middle" fill="#0f172a">DEMO PAGE ${n}</text><rect x="120" y="410" width="660" height="280" rx="24" fill="#cbd5e1"/><text x="450" y="560" font-family="Arial" font-size="32" text-anchor="middle" fill="#334155">Original manga image area</text><rect x="120" y="760" width="660" height="180" rx="90" fill="#ffffff" stroke="#0f172a" stroke-width="6"/><text x="450" y="855" font-family="Arial" font-size="30" text-anchor="middle" fill="#0f172a">What are you doing here?!</text><rect x="120" y="1010" width="660" height="120" rx="24" fill="#e2e8f0"/><text x="450" y="1085" font-family="Arial" font-size="30" text-anchor="middle" fill="#0f172a">SFX: BOOM!</text></svg>`;
    const imageUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    return { number: n, imageUrl, ocrText: `What are you doing here?!\nSFX: BOOM!\nPage ${n}` };
  });

  return Response.json({
    ok: true,
    chapter: {
      source: 'Link Import Demo',
      sourceUrl: url,
      title: safeTitle,
      chapterName: 'Chapter demo',
      pages,
      importedAt: new Date().toISOString(),
    },
  });
}
