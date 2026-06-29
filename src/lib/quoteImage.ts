// ─────────────────────────────────────────────────────────────
// 문구 배경 이미지 URL (Supabase Storage CDN)
//
// 같은 Supabase 프로젝트의 Storage 버킷에 <quote-id>.png 로 업로드된
// 이미지를 public CDN URL 로 가져온다. 파일이 없으면 QuoteCard 가
// 로드 실패를 감지해 기존 그라디언트 배경으로 fallback 한다.
//
// 버킷명은 NEXT_PUBLIC_QUOTE_IMAGE_BUCKET 으로 덮어쓸 수 있다(기본 quotesImage).
// ─────────────────────────────────────────────────────────────

const BUCKET = process.env.NEXT_PUBLIC_QUOTE_IMAGE_BUCKET || "quotesImage";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/** <id>.png 의 public CDN URL. 환경변수 미설정 시 null. */
export function quoteImageUrl(quoteId: string): string | null {
  if (!SUPABASE_URL || !quoteId) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(
    quoteId
  )}.png`;
}
