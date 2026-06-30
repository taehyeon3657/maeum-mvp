export interface ReadQuoteEntry<QuoteLike = unknown> {
  quote: QuoteLike;
  durationMs: number;
}

export interface SessionDurationInput {
  startedAt: number | null;
  now: number;
}

export interface SessionCompletionInput<QuoteLike = unknown> extends SessionDurationInput {
  readQuotes: readonly ReadQuoteEntry<QuoteLike>[];
}

export interface SessionCompletionSnapshot<QuoteLike = unknown> {
  durationMs: number;
  shareQuote: QuoteLike | null;
}

export function selectLongestReadQuote<QuoteLike>(
  readQuotes: readonly ReadQuoteEntry<QuoteLike>[],
): QuoteLike | null;

export function getSessionDurationMs(input: SessionDurationInput): number;

export function createSessionCompletionSnapshot<QuoteLike>(
  input: SessionCompletionInput<QuoteLike>,
): SessionCompletionSnapshot<QuoteLike>;
