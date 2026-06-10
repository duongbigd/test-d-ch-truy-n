'use client';

import { useMemo, useRef, useState } from 'react';

const stylePresets = {
  literal: 'Sát nghĩa',
  vietnameseStreet: 'Dân dã Việt Nam',
  manga: 'Truyện tranh mượt',
  harshSafe: 'Giữ độ gắt có kiểm soát',
};

export default function Page() {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('vi');
  const [style, setStyle] = useState('vietnameseStreet');
  const [profanityLevel, setProfanityLevel] = useState('medium');
  const [redrawMode, setRedrawMode] = useState('textOnly');
  const [keepNames, setKeepNames] = useState(true);
  const [glossary, setGlossary] = useState('baka = đồ ngốc / ngốc thật đấy\nshit = chết tiệt / khỉ thật / cái quái gì\nyou bastard = đồ khốn / tên khốn');
  const [log, setLog] = useState('');
  const [result, setResult] = useState('');
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  const selectedImage = useMemo(() => images.find((x) => x.id === selected) || images[0], [images, selected]);

  function addFiles(list) {
    const files = Array.from(list || []).filter((f) => f.type.startsWith('image/'));
    const mapped = files.map((f) => ({
      id: `${Date.now()}-${f.name}-${Math.random()}`,
      name: f.name,
      url: URL.createObjectURL(f),
      file: f,
    }));
    setImages((prev) => {
      const next = [...prev, ...mapped];
      if (!selected && next[0]) setSelected(next[0].id);
      return next;
    });
  }

  function clearAll() {
    images.forEach((i) => URL.revokeObjectURL(i.url));
    setImages([]);
    setSelected(null);
    setLog('');
    setResult('');
    setProgress(0);
  }

  async function runTranslate() {
    if (!images.length) return;
    setRunning(true);
    setProgress(0);
    setLog('');
    setResult('');

    const steps = ['Upload ảnh', 'Nhận diện vùng chữ', 'OCR chữ trong bóng thoại', 'Dịch sát nghĩa', 'Việt hóa khẩu ngữ', 'Xuất kết quả'];
    for (let i = 0; i < steps.length; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      setProgress(Math.round(((i + 1) / steps.length) * 100));
      setLog((prev) => `${prev}✓ ${steps[i]}\n`);
    }

    const form = new FormData();
    form.append('sourceLang', sourceLang);
    form.append('targetLang', targetLang);
    form.append('style', style);
    form.append('profanityLevel', profanityLevel);
    form.append('redrawMode', redrawMode);
    form.append('keepNames', String(keepNames));
    form.append('glossary', glossary);
    images.forEach((img) => form.append('images', img.file));

    const res = await fetch('/api/translate', { method: 'POST', body: form });
    const data = await res.json();
    setResult(data.text || 'Không có kết quả');
    setRunning(false);
  }

  async function copy() {
    await navigator.clipboard.writeText(result);
  }

  function download() {
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ban-dich-truyen-anh.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="container">
      <section className="hero">
        <div className="hero-row">
          <div>
            <h1>Dịch Truyện Ảnh Việt Hóa</h1>
            <p>Upload trang truyện → OCR → dịch sát nghĩa, dân dã → xuất text/ảnh.</p>
          </div>
          <div className="badge">Mobile + Máy tính</div>
        </div>
      </section>

      <section className="grid">
        <aside className="stack">
          <div className="card stack">
            <h2>Cấu hình dịch</h2>
            <div className="row">
              <label><span>Nguồn</span><select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}><option value="auto">Tự nhận diện</option><option value="ja">Japanese</option><option value="zh">Chinese</option><option value="ko">Korean</option><option value="en">English</option></select></label>
              <label><span>Đích</span><select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}><option value="vi">Tiếng Việt</option><option value="en">English</option></select></label>
            </div>
            <label><span>Văn phong</span><select value={style} onChange={(e) => setStyle(e.target.value)}>{Object.entries(stylePresets).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
            <label><span>Mức câu chửi/khẩu ngữ</span><select value={profanityLevel} onChange={(e) => setProfanityLevel(e.target.value)}><option value="low">Nhẹ</option><option value="medium">Vừa - dân dã</option><option value="high">Mạnh có kiểm soát</option></select></label>
            <label className="check">Giữ tên riêng/địa danh <input type="checkbox" checked={keepNames} onChange={(e) => setKeepNames(e.target.checked)} /></label>
            <label><span>Cách xuất</span><select value={redrawMode} onChange={(e) => setRedrawMode(e.target.value)}><option value="textOnly">Chỉ xuất text</option><option value="overlay">Overlay chữ Việt lên ảnh</option><option value="clean">Xóa chữ cũ rồi chèn lại</option></select></label>
          </div>
          <div className="card note">Tool giữ sắc thái câu chửi theo bản gốc, nhưng không thêm lời miệt thị nhắm vào nhóm người thật. Nên dùng với nội dung bạn có quyền sử dụng.</div>
        </aside>

        <section className="stack">
          <div className="card">
            <div className="hero-row"><h2>Trang truyện ảnh</h2><div><button className="btn" onClick={() => inputRef.current?.click()}>Tải ảnh</button> <button className="btn secondary" onClick={clearAll}>Xóa</button></div></div>
            <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
            <div className="drop" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
              {selectedImage ? <img className="preview" src={selectedImage.url} alt={selectedImage.name} /> : <div><h3>Kéo thả ảnh trang truyện vào đây</h3><p>Hoặc bấm Tải ảnh. Hỗ trợ điện thoại và máy tính.</p></div>}
            </div>
            {!!images.length && <div className="thumbs">{images.map((img, i) => <button key={img.id} className={`thumb ${selectedImage?.id === img.id ? 'active' : ''}`} onClick={() => setSelected(img.id)}><img src={img.url} alt={img.name} /><small>Trang {i + 1}</small></button>)}</div>}
          </div>
          <div className="card stack"><h2>Thuật ngữ & Việt hóa</h2><textarea value={glossary} onChange={(e) => setGlossary(e.target.value)} /></div>
        </section>

        <aside className="stack">
          <div className="card stack">
            <div className="hero-row"><h2>OCR & Dịch</h2><span>{progress}%</span></div>
            <div className="progress"><div style={{ width: `${progress}%` }} /></div>
            <button className="btn" disabled={running || !images.length} onClick={runTranslate}>{running ? 'Đang xử lý...' : 'OCR + Dịch trang truyện'}</button>
            <textarea value={log} onChange={(e) => setLog(e.target.value)} placeholder="Log OCR sẽ hiện ở đây..." />
          </div>
          <div className="card stack"><h2>Bản dịch</h2><textarea style={{ minHeight: 300 }} value={result} onChange={(e) => setResult(e.target.value)} placeholder="Bản dịch theo bóng thoại sẽ hiện ở đây..." />
            <div className="actions"><button className="btn secondary" disabled={!result} onClick={copy}>Copy</button><button className="btn indigo" disabled={!result} onClick={download}>Tải .txt</button></div>
          </div>
        </aside>
      </section>
      <p className="footer">Bản đầu là web app deploy được. API hiện mock; sau đó có thể nối OCR/model dịch thật.</p>
    </main>
  );
}
