import type { Quote } from "@/src/models/feed";

export function parseSeenQuoteIds(raw: string | null): string[];
export function normalizeQuoteIds(value: unknown): string[];
export function mergeSeenQuoteIds(
  currentIds: readonly string[],
  newIds: readonly string[],
  maxSeen: number,
): string[];
export function dedupeQuotesById<T extends Pick<Quote, "id">>(
  quotes: readonly T[],
): T[];
