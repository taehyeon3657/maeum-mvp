export function getQuoteImageCandidateUrl(quote, resolveUrl) {
  if (!quote || quote.has_image === false) return null;
  return resolveUrl(quote.id);
}

export function getQuoteImageKey(quote, resolveUrl) {
  if (!quote) return null;

  const imageState = quote.has_image === false ? "no-image" : "maybe-image";
  return `${quote.id}:${imageState}:${resolveUrl(quote.id) ?? "no-url"}`;
}

export function getQuoteImageResolutionFromCache(quote, resolveUrl, getCacheState) {
  const url = getQuoteImageCandidateUrl(quote, resolveUrl);
  if (!url) return { status: "fallback", url: null };

  const cached = getCacheState(url);
  if (cached === "loaded") return { status: "image", url };
  if (cached === "failed") return { status: "fallback", url: null };

  return { status: "loading", url: null };
}
