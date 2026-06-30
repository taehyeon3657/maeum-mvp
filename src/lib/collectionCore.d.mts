import type { Quote } from "@/src/models/feed";

export interface CollectionItemLike {
  likedAt: string;
  quote: Quote;
}

export function normalizeCollectionRows(rows: unknown): CollectionItemLike[];
export function normalizeCollectionQuote(value: unknown): Quote | null;
export function dedupeCollectionItems<T extends CollectionItemLike>(items: readonly T[]): T[];
