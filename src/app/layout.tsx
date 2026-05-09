import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Providers from "../components/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000"),
  ),
  title: "마음 — 매일 당신의 마음을 울리는 글귀",
  description:
    "감정을 선택하면 지금 이 순간 당신에게 꼭 맞는 글귀를 찾아드려요. 매일 마음을 울리는 한 문장.",
  openGraph: {
    title: "마음 — 매일 당신의 마음을 울리는 글귀",
    description:
      "감정을 선택하면 지금 이 순간 당신에게 꼭 맞는 글귀를 찾아드려요. 매일 마음을 울리는 한 문장.",
    siteName: "마음",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "마음 — 매일 당신의 마음을 울리는 글귀",
    description:
      "감정을 선택하면 지금 이 순간 당신에게 꼭 맞는 글귀를 찾아드려요. 매일 마음을 울리는 한 문장.",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

const nanumSquareRound = localFont({
  src: [
    { path: "../fonts/NanumSquareRoundL.ttf", weight: "300", style: "normal" },
    { path: "../fonts/NanumSquareRoundR.ttf", weight: "400", style: "normal" },
    { path: "../fonts/NanumSquareRoundB.ttf", weight: "700", style: "normal" },
    { path: "../fonts/NanumSquareRoundEB.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-nsr",
  display: "block",
  preload: true,
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
