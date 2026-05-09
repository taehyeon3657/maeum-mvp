import localFont from "next/font/local";
import Providers from "../components/providers";
import "./globals.css";

const nanumSquareRound = localFont({
  src: [
    { path: "../fonts/NanumSquareRoundL.ttf", weight: "300", style: "normal" },
    { path: "../fonts/NanumSquareRoundR.ttf", weight: "400", style: "normal" },
    { path: "../fonts/NanumSquareRoundB.ttf", weight: "700", style: "normal" },
    { path: "../fonts/NanumSquareRoundEB.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-nsr",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={nanumSquareRound.variable}>
      <body className="bg-gray-100 text-textMain font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <main className="max-w-md mx-auto bg-background shadow-2xl relative overflow-x-hidden" style={{ minHeight: "100dvh" }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
