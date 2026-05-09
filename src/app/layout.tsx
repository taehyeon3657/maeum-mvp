import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Providers from "../components/providers";
import "./globals.css";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

const TITLE = "마음 — 매일 당신의 마음을 울리는 글귀";
const DESCRIPTION =
  "지금 내 감정에 꼭 맞는 글귀를 매일 만나보세요. 기쁨·슬픔·설렘·외로움… 감정을 선택하면 오늘의 한 문장을 드려요.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: TITLE,
    template: "%s | 마음",
  },
  description: DESCRIPTION,

  keywords: [
    "마음",
    "명언",
    "글귀",
    "감성 글귀",
    "오늘의 명언",
    "감정",
    "힐링",
    "위로",
    "동기부여",
    "좋은 글",
    "짧은 글귀",
    "매일 글귀",
    "감성 앱",
    "마음 치유",
  ],

  authors: [{ name: "마음 팀" }],
  creator: "마음",
  publisher: "마음",
  applicationName: "마음",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: APP_URL,
    siteName: "마음",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "마음 — 매일 당신의 마음을 울리는 글귀",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },

  icons: {
    icon: [
      { url: "/icon", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.webmanifest",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "마음",
  },

  formatDetection: {
    telephone: false,
  },

  category: "lifestyle",

  verification: {
    google: "agtV9KxSbyIvK5-mgKKeKmwcrEAr4lMRfVAbLKsaQfQ",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#fdf9f5" },
  ],
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${APP_URL}/#webapp`,
      name: "마음",
      alternateName: "Maeum",
      url: APP_URL,
      description: DESCRIPTION,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web, iOS, Android",
      inLanguage: "ko",
      browserRequirements: "Requires JavaScript",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "KRW",
      },
      featureList: [
        "감정 기반 글귀 추천",
        "매일 새로운 명언",
        "개인화 피드",
        "PWA 설치 지원",
      ],
    },
    {
      "@type": "Organization",
      "@id": `${APP_URL}/#organization`,
      name: "마음",
      url: APP_URL,
      logo: {
        "@type": "ImageObject",
        url: `${APP_URL}/icon`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      url: APP_URL,
      name: "마음",
      description: DESCRIPTION,
      inLanguage: "ko",
      publisher: { "@id": `${APP_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={nanumSquareRound.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
