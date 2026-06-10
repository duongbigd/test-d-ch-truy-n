import './globals.css';

export const metadata = {
  title: 'Dịch Truyện Ảnh Việt Hóa',
  description: 'Upload trang truyện, OCR, dịch sát nghĩa và Việt hóa dân dã.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
