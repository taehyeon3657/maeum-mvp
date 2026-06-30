export function selectLongestReadQuote(readQuotes) {
  if (readQuotes.length === 0) return null;

  return readQuotes.reduce((longest, current) =>
    current.durationMs > longest.durationMs ? current : longest,
  ).quote;
}

export function getSessionDurationMs({ startedAt, now }) {
  if (typeof startedAt !== "number") return 0;
  if (!Number.isFinite(startedAt) || !Number.isFinite(now)) return 0;
  return Math.max(0, now - startedAt);
}

export function createSessionCompletionSnapshot({ readQuotes, startedAt, now }) {
  return {
    durationMs: getSessionDurationMs({ startedAt, now }),
    shareQuote: selectLongestReadQuote(readQuotes),
  };
}
