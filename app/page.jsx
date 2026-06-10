
'use client';

import { useMemo, useState } from 'react';

const demoLink = 'https://weebcentral.com/series/demo/chapter-1';

export default function Page() {
  const [url, setUrl] = useState('');
  const [style, setStyle] = useState('vietnameseStreet');
  const [mode, setMode] = useState('translatedBelow');
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState('');
  const [readProgress, setReadProgress] = useState(0);

  const translatedCount = useMemo(() => {
    if (!chapter?.pages) return 0;
    return chapter.pages.filter((p) => p.translation).length;
  }, [chapter]);

  async function importChapter(useDemo = false) {
    const targetUrl = useDemo ? demoLink : url.trim();
    if (!targetUrl) return;
    setLoading(true);
    setLog('Đang import chapter...\n');
    setProgress(10);

    const res = await fetch('/api/import-chapter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl }),
    });
    const data = await res.json();
    setChapter(data.chapter);
    setUrl(targetUrl);
    setProgress(100);
    setLog((prev) => `${prev}✓ Import xong: ${data.chapter.title}\n✓ Số trang: ${data.chapter.pages.length}\n`);
    setLoading(false);
    setTimeout(() => setProgress(0), 700);
  }

  async function translateChapter() {
    if (!chapter) return;
    setTranslating(true);
    setProgress(0);
    setLog('Đang dịch toàn bộ chapter...\n');

    const res = await fetch('/api/translate-chapter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapter, style }),
    });
    const data = await res.json();

    for (let i = 0; i < data.pages.length; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 120));
      setProgress(Math.round(((i + 1) / data.pages.length) * 100));
      setLog((prev) => `${prev}✓ Dịch trang ${i + 1}/${data.pages.length}\n`);
    }

    setChapter({ ...chapter, pages: data.pages, translatedAt: new Date().toISOString() });
    setTranslating(false);
    setTimeout(() => setProgress(0), 900);
  }

  function markReading(pageNumber) {
    if (!chapter?.pages?.length) return;
    setReadProgress(Math.round((pageNumber / chapter.pages.length) * 100));
  }

  function saveLocal() {
    if (!chapter) return;
    localStorage.setItem('reader:lastChapter', JSON.stringify(chapter));
    alert('Đã lưu chapter vào trình duyệt này.');
  }

  function loadLocal() {
    const raw = localStorage.getItem('reader:lastChapter');
    if (!raw) return alert('Chưa có chapter đã lưu.');
    setChapter(JSON.parse(raw));
  }

  return (
    <main className="app">
      <div className="topbar">
        <div className="shell row">
          <span className="pill">Reader dịch truyện</span>
          <span className="small">Dán link → Import → Dịch → Lướt đọc trong app</span>
        </div>
      </div>

      <div className="shell">
        <section className="hero">
          <h1>Dịch Truyện Reader</h1>
          <p>Tối ưu cho đọc cá nhân: nhập link chapter, tạo bản dịch tiếng Việt và đọc ngay trên điện thoại/máy tính.</p>
        </section>

        <section className="grid">
          <aside className="stack">
            <div className="card stack">
              <h2>1. Nhập link chapter</h2>
              <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Dán link chapter vào đây..." />
              <button className="btn" disabled={loading || !url.trim()} onClick={() => importChapter(false)}>{loading ? 'Đang import...' : 'Import link'}</button>
              <button className="btn secondary" onClick={() => importChapter(true)}>Dùng demo reader</button>
              <p className="small">Bản này import demo để app chạy ổn trước. Sau đó có thể nối module lấy trang hợp lệ và OCR/dịch thật.</p>
            </div>

            <div className="card stack">
              <h2>2. Cấu hình dịch</h2>
              <label><span className="small">Văn phong</span><select className="select" value={style} onChange={(e) => setStyle(e.target.value)}><option value="literal">Sát nghĩa</option><option value="vietnameseStreet">Dân dã Việt Nam</option><option value="manga">Truyện tranh mượt</option><option value="harshSafe">Giữ độ gắt có kiểm soát</option></select></label>
              <label><span className="small">Cách đọc</span><select className="select" value={mode} onChange={(e) => setMode(e.target.value)}><option value="translatedBelow">Ảnh gốc + bản dịch dưới ảnh</option><option value="translationOnly">Chỉ đọc bản dịch text</option><option value="originalOnly">Chỉ ảnh gốc</option></select></label>
              <button className="btn green" disabled={!chapter || translating} onClick={translateChapter}>{translating ? 'Đang dịch...' : 'Dịch toàn bộ chapter'}</button>
              <div className="progress"><div style={{ width: `${progress}%` }} /></div>
              <textarea className="input" style={{ minHeight: 150 }} value={log} onChange={(e) => setLog(e.target.value)} placeholder="Log xử lý..." />
            </div>

            <div className="card stack warn">
              <b>Lưu ý sử dụng</b>
              <span>App được thiết kế cho nhu cầu đọc cá nhân và nội dung bạn có quyền truy cập/sử dụng. Không nên dùng để phát tán lại nội dung không được phép.</span>
            </div>
          </aside>

          <section className="stack">
            <div className="card">
              <div className="reader-tools">
                <div>
                  <h2 className="chapter-title">{chapter ? chapter.title : 'Chưa có chapter'}</h2>
                  <div className="small">{chapter ? `${chapter.source} • ${chapter.pages.length} trang • Đã dịch ${translatedCount}/${chapter.pages.length}` : 'Import link hoặc dùng demo để bắt đầu.'}</div>
                </div>
                <div className="row">
                  <button className="btn secondary" onClick={loadLocal}>Mở bản lưu</button>
                  <button className="btn indigo" disabled={!chapter} onClick={saveLocal}>Lưu</button>
                </div>
              </div>
              <div className="progress"><div style={{ width: `${readProgress}%` }} /></div>
              <p className="small">Tiến độ đọc: {readProgress}%</p>

              {chapter ? (
                <div className="toc">
                  {chapter.pages.map((page) => <a key={page.number} href={`#page-${page.number}`}>Trang {page.number}</a>)}
                </div>
              ) : <div className="empty"><div><h3>Reader đang chờ dữ liệu</h3><p>Dán link chapter hoặc bấm “Dùng demo reader”.</p></div></div>}
            </div>

            {chapter?.pages?.map((page) => (
              <article className="page-card" key={page.number} id={`page-${page.number}`} onMouseEnter={() => markReading(page.number)} onTouchStart={() => markReading(page.number)}>
                {mode !== 'translationOnly' && <img className="page-img" src={page.imageUrl} alt={`Trang ${page.number}`} />}
                <div className="page-meta">
                  <b>Trang {page.number}</b>
                  {mode !== 'originalOnly' && <div className="translation">{page.translation || 'Chưa dịch trang này. Bấm “Dịch toàn bộ chapter”.'}</div>}
                </div>
              </article>
            ))}
          </section>
        </section>

        <p className="footer">Bản reader import link demo. Bước sau: nối OCR/model dịch thật và module import nguồn hợp lệ.</p>
      </div>
    </main>
  );
}
