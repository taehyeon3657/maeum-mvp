// ─────────────────────────────────────────────────────────────
// 문구 배경 이미지 URL (공개 CDN)
//
// R2 커스텀 도메인에서 <quote-id>.png 를 가져온다.
// NEXT_PUBLIC_QUOTE_IMAGE_BASE_URL 만 바꾸면 된다.
// (객체 키 = <id>.png, 버킷명은 공개 URL 에 포함돼 있으므로 경로에 넣지 않음)
// r2.dev 개발 URL은 전송 속도가 제한되므로 사용하지 않는다.
//
// 파일이 없으면 이미지 resolve 훅이 로드 실패를 감지해 그라디언트 배경으로 fallback.
//
// 예)
//   NEXT_PUBLIC_QUOTE_IMAGE_BASE_URL=https://img.maeum.stream
// ─────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_QUOTE_IMAGE_BASE_URL;

/** <id>.png 의 public CDN URL. 환경변수 미설정 시 null. */
export function quoteImageUrl(quoteId: string): string | null {
  if (!BASE_URL || !quoteId) return null;
  const base = BASE_URL.replace(/\/+$/, "");
  return `${base}/${encodeURIComponent(quoteId)}.png`;
}
