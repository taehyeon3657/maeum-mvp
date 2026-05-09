import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "마음 — 매일 당신의 마음을 울리는 글귀",
    short_name: "마음",
    description:
      "지금 내 감정에 꼭 맞는 글귀를 매일 만나보세요. 감정을 선택하면 오늘의 한 문장을 드려요.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fdf9f5",
    theme_color: "#e07a5f",
    lang: "ko",
    dir: "ltr",
    categories: ["lifestyle", "health", "social"],
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/opengraph-image",
        sizes: "1200x630",
        type: "image/png",
      },
    ],
  };
}
