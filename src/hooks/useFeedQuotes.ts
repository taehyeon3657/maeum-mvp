"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase";
import {
  dedupeQuotesById,
  mergeSeenQuoteIds,
  parseSeenQuoteIds,
} from "@/src/lib/feedQuotesCore.mjs";
import type { Quote } from "@/src/models/feed";

const SESSION_LIMIT = 8;
const MAX_SEEN = 100;

type FeedQuotesState =
  | { key: null; status: "idle"; quotes: Quote[] }
  | { key: string; status: "success"; quotes: Quote[] }
  | { key: string; status: "error"; quotes: Quote[] };

interface IndexState {
  key: string | null;
  value: number;
}

function getSeenIds(userId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`maeum_seen_quotes_${userId}`);
    return parseSeenQuoteIds(raw);
  } catch {
    return [];
  }
}

function addSeenIds(userId: string, newIds: string[]) {
  if (typeof window === "undefined") return;
  const current = getSeenIds(userId);
  const merged = mergeSeenQuoteIds(current, newIds, MAX_SEEN);
  localStorage.setItem(
    `maeum_seen_quotes_${userId}`,
    JSON.stringify(merged),
  );
}

export function useFeedQuotes(userId: string, skip = false) {
  const [quoteState, setQuoteState] = useState<FeedQuotesState>({
    key: null,
    status: "idle",
    quotes: [],
  });
  const [indexState, setIndexState] = useState<IndexState>({
    key: null,
    value: 0,
  });
  const [resetKey, setResetKey] = useState(0);
  const requestKey = skip ? null : `${userId}:${resetKey}`;

  useEffect(() => {
    if (!requestKey) return;

    let cancelled = false;

    const fetchQuotes = async () => {
      const supabase = createClient();
      const excludeIds = getSeenIds(userId);

      const { data, error } = await supabase.rpc("get_random_quotes", {
        p_exclude_ids: excludeIds,
        p_limit: SESSION_LIMIT,
      });

      if (cancelled) return;

      if (error) {
        setQuoteState({ key: requestKey, status: "error", quotes: [] });
        return;
      }

      const quotes = dedupeQuotesById((data ?? []) as Quote[]);

      if (quotes.length > 0) {
        addSeenIds(
          userId,
          quotes.map((q) => q.id),
        );
        setQuoteState({ key: requestKey, status: "success", quotes });
        return;
      }

      // seen 목록에 모든 문구가 들어간 경우 → 초기화 후 재시도
      if (quotes.length === 0 && excludeIds.length > 0) {
        localStorage.removeItem(`maeum_seen_quotes_${userId}`);
        const { data: freshData, error: freshError } = await supabase.rpc(
          "get_random_quotes",
          { p_exclude_ids: [], p_limit: SESSION_LIMIT },
        );
        if (cancelled) return;
        if (freshError) {
          setQuoteState({ key: requestKey, status: "error", quotes: [] });
        } else {
          const freshQuotes = dedupeQuotesById((freshData ?? []) as Quote[]);
          if (freshQuotes.length > 0) {
            addSeenIds(
              userId,
              freshQuotes.map((q) => q.id),
            );
            setQuoteState({
              key: requestKey,
              status: "success",
              quotes: freshQuotes,
            });
          } else {
            setQuoteState({ key: requestKey, status: "success", quotes: [] });
          }
        }
        return;
      }

      setQuoteState({ key: requestKey, status: "success", quotes: [] });
    };

    void fetchQuotes();
    return () => {
      cancelled = true;
    };
  }, [requestKey, userId]);

  const quotes =
    requestKey &&
    quoteState.key === requestKey &&
    quoteState.status === "success"
      ? quoteState.quotes
      : [];
  const currentIndex = indexState.key === requestKey ? indexState.value : 0;
  const isLoading = requestKey !== null && quoteState.key !== requestKey;
  const hasError =
    requestKey !== null &&
    quoteState.key === requestKey &&
    quoteState.status === "error";

  const advance = useCallback(() => {
    if (!requestKey) return;
    setIndexState((current) =>
      current.key === requestKey
        ? { key: requestKey, value: current.value + 1 }
        : { key: requestKey, value: 1 },
    );
  }, [requestKey]);

  // reset() 호출 시 즉시 로딩 상태로 전환 → stale isDepleted 방지
  const reset = useCallback(() => {
    setResetKey((k) => k + 1);
  }, []);

  return {
    currentQuote: quotes[currentIndex] ?? null,
    nextQuote: quotes[currentIndex + 1] ?? null,
    isLoading,
    hasError,
    isEmpty: !isLoading && !hasError && quotes.length === 0,
    isDepleted:
      !isLoading && quotes.length > 0 && currentIndex >= quotes.length,
    quoteProgress: { current: currentIndex, total: quotes.length },
    advance,
    reset,
  };
}
