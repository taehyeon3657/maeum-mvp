// ─────────────────────────────────────────────────────────────
// 문구 배경 이미지 URL (공개 CDN)
//
// 공개 CDN 베이스 URL 에서 <quote-id>.png 를 가져온다.
// Cloudflare R2 public 버킷(r2.dev) 또는 R2 에 연결한 커스텀 도메인 등
// 어떤 CDN 이든 NEXT_PUBLIC_QUOTE_IMAGE_BASE_URL 만 바꾸면 된다.
// (객체 키 = <id>.png, 버킷명은 공개 URL 에 포함돼 있으므로 경로에 넣지 않음)
//
// 파일이 없으면 QuoteCard 가 로드 실패를 감지해 그라디언트 배경으로 fallback.
//
// 예)
//   NEXT_PUBLIC_QUOTE_IMAGE_BASE_URL=https://pub-xxxxxxxx.r2.dev
//   NEXT_PUBLIC_QUOTE_IMAGE_BASE_URL=https://img.maeum.app
// ─────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_QUOTE_IMAGE_BASE_URL;

/** <id>.png 의 public CDN URL. 환경변수 미설정 시 null. */
export function quoteImageUrl(quoteId: string): string | null {
  if (!BASE_URL || !quoteId) return null;
  const base = BASE_URL.replace(/\/+$/, "");
  return `${base}/${encodeURIComponent(quoteId)}.png`;
}
