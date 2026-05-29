"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase";
import type { Quote } from "@/src/models/feed";

const SESSION_LIMIT = 5;
const MAX_SEEN = 100;

function getSeenIds(userId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`maeum_seen_quotes_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addSeenIds(userId: string, newIds: string[]) {
  if (typeof window === "undefined") return;
  const current = getSeenIds(userId);
  const merged = [...current, ...newIds];
  localStorage.setItem(
    `maeum_seen_quotes_${userId}`,
    JSON.stringify(merged.slice(-MAX_SEEN))
  );
}

export function useFeedQuotes(userId: string, skip = false) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(!skip);
  const [hasError, setHasError] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (skip) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);
    setQuotes([]);
    setCurrentIndex(0);

    const fetchQuotes = async () => {
      const supabase = createClient();
      const excludeIds = getSeenIds(userId);

      const { data, error } = await supabase.rpc("get_random_quotes", {
        p_exclude_ids: excludeIds,
        p_limit: SESSION_LIMIT,
      });

      if (cancelled) return;

      if (error) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setQuotes(data);
        addSeenIds(userId, data.map((q: Quote) => q.id));
        setIsLoading(false);
        return;
      }

      // seen 목록에 모든 문구가 들어간 경우 → 초기화 후 재시도
      if (data?.length === 0 && excludeIds.length > 0) {
        localStorage.removeItem(`maeum_seen_quotes_${userId}`);
        const { data: freshData, error: freshError } = await supabase.rpc(
          "get_random_quotes",
          { p_exclude_ids: [], p_limit: SESSION_LIMIT }
        );
        if (cancelled) return;
        if (freshError) {
          setHasError(true);
        } else if (freshData && freshData.length > 0) {
          setQuotes(freshData);
          addSeenIds(userId, freshData.map((q: Quote) => q.id));
        }
      }

      setIsLoading(false);
    };

    fetchQuotes();
    return () => { cancelled = true; };
  }, [resetKey, userId, skip]);

  const advance = useCallback(() => setCurrentIndex((i) => i + 1), []);

  // reset() 호출 시 즉시 로딩 상태로 전환 → stale isDepleted 방지
  const reset = useCallback(() => {
    setQuotes([]);
    setCurrentIndex(0);
    setIsLoading(true);
    setHasError(false);
    setResetKey((k) => k + 1);
  }, []);

  return {
    currentQuote: quotes[currentIndex] ?? null,
    nextQuote: quotes[currentIndex + 1] ?? null,
    isLoading,
    hasError,
    isEmpty: !isLoading && !hasError && quotes.length === 0,
    isDepleted: !isLoading && quotes.length > 0 && currentIndex >= quotes.length,
    quoteProgress: { current: currentIndex, total: quotes.length },
    advance,
    reset,
  };
}
