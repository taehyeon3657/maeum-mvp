import type { Quote } from "@/src/models/feed";

export interface PreviewBackgroundItem {
  quote: Quote;
  category: string;
  motif: string;
  imageUrl: string | null;
}

export interface PreviewBackgroundFilters {
  query: string;
  category: string;
  motif: string;
}

export function normalizeEmotionTags(value: unknown): string[];
export function dedupePreviewItems<T extends PreviewBackgroundItem>(items: readonly T[]): T[];
export function matchesPreviewFilters(
  item: PreviewBackgroundItem,
  filters: PreviewBackgroundFilters,
): boolean;
