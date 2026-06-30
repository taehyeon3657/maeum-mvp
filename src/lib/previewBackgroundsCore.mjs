export function normalizeEmotionTags(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function dedupePreviewItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.quote.id)) return false;
    seen.add(item.quote.id);
    return true;
  });
}

export function matchesPreviewFilters(item, filters) {
  if (filters.category !== "all" && item.category !== filters.category) return false;
  if (filters.motif !== "all" && item.motif !== filters.motif) return false;

  const needle = filters.query.trim();
  if (!needle) return true;

  return (
    item.quote.content.includes(needle) ||
    (item.quote.author || "").includes(needle) ||
    (item.quote.source || "").includes(needle)
  );
}
