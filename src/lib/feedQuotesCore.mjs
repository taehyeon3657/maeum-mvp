export function parseSeenQuoteIds(raw) {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return normalizeQuoteIds(parsed);
  } catch {
    return [];
  }
}

export function normalizeQuoteIds(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((id) => typeof id === "string" && id.length > 0);
}

export function mergeSeenQuoteIds(currentIds, newIds, maxSeen) {
  if (!Number.isFinite(maxSeen) || maxSeen <= 0) return [];

  const merged = [...currentIds, ...newIds];
  const seen = new Set();
  const newestUnique = [];

  for (let index = merged.length - 1; index >= 0; index -= 1) {
    const id = merged[index];
    if (typeof id !== "string" || id.length === 0 || seen.has(id)) continue;

    seen.add(id);
    newestUnique.push(id);
    if (newestUnique.length >= maxSeen) break;
  }

  return newestUnique.reverse();
}

export function dedupeQuotesById(quotes) {
  const seen = new Set();
  return quotes.filter((quote) => {
    if (!quote || typeof quote.id !== "string" || quote.id.length === 0) {
      return false;
    }
    if (seen.has(quote.id)) return false;
    seen.add(quote.id);
    return true;
  });
}
