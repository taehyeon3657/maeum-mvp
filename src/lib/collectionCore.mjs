export function normalizeCollectionRows(rows) {
  if (!Array.isArray(rows)) return [];

  return dedupeCollectionItems(
    rows
      .map((row) => {
        const quote = normalizeCollectionQuote(row?.quotes);
        if (!quote || typeof row?.created_at !== "string") return null;
        return { likedAt: row.created_at, quote };
      })
      .filter((item) => item !== null),
  );
}

export function normalizeCollectionQuote(value) {
  const quote = Array.isArray(value) ? value[0] : value;
  if (!quote || typeof quote.id !== "string" || quote.id.length === 0) {
    return null;
  }

  return {
    ...quote,
    emotion_tags: normalizeEmotionTags(quote.emotion_tags),
  };
}

export function dedupeCollectionItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const quoteId = item?.quote?.id;
    if (typeof quoteId !== "string" || quoteId.length === 0 || seen.has(quoteId)) {
      return false;
    }
    seen.add(quoteId);
    return true;
  });
}

function normalizeEmotionTags(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
