import Providers from "../components/providers";
import "./globals.css";
// (폰트 불러오는 로직 생략: next/font/local 등을 활용하여 폰트 변수 설정)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      {/* 기본 배경은 살짝 어두운 회색으로 덮고, 중앙 컨테이너만 크림색으로 돋보이게 합니다 */}
      <body className="bg-gray-100 text-textMain font-sans antialiased">
        {/* 모바일 화면 사이즈(max-w-md) 고정 컨테이너 */}
        <Providers>
          <main className="max-w-md mx-auto min-h-screen bg-background shadow-2xl relative overflow-x-hidden">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
