export type QuoteImageResolution =
  | { status: "loading"; url: null }
  | { status: "image"; url: string }
  | { status: "fallback"; url: null };

export type QuoteImageCacheState = "loaded" | "failed" | unknown;

export interface QuoteImageLike {
  id: string;
  has_image?: boolean | null;
}

export type QuoteImageUrlResolver = (quoteId: string) => string | null;
export type QuoteImageCacheReader = (url: string) => QuoteImageCacheState;

export function getQuoteImageCandidateUrl(
  quote: QuoteImageLike | null,
  resolveUrl: QuoteImageUrlResolver,
): string | null;

export function getQuoteImageKey(
  quote: QuoteImageLike | null,
  resolveUrl: QuoteImageUrlResolver,
): string | null;

export function getQuoteImageResolutionFromCache(
  quote: QuoteImageLike | null,
  resolveUrl: QuoteImageUrlResolver,
  getCacheState: QuoteImageCacheReader,
): QuoteImageResolution;
