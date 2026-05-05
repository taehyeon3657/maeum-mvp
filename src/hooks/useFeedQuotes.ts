"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/src/lib/supabase";
import type { Quote } from "@/src/models/feed";

const SESSION_LIMIT = 10; // 1회 세션당 보여줄 글귀 수

export function useFeedQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setQuotes([]);
    setCurrentIndex(0);

    const fetchQuotes = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("quotes")
        .select("id, content, author, source, emotion_tags")
        .eq("is_active", true)
        .limit(SESSION_LIMIT);

      if (!cancelled && !error && data) setQuotes(data);
      if (!cancelled) setIsLoading(false);
    };

    fetchQuotes();
    return () => { cancelled = true; };
  }, [resetKey]);

  const advance = useCallback(() => setCurrentIndex((i) => i + 1), []);

  const reset = useCallback(() => setResetKey((k) => k + 1), []);

  return {
    currentQuote: quotes[currentIndex] ?? null,
    nextQuote: quotes[currentIndex + 1] ?? null,
    isLoading,
    isEmpty: !isLoading && quotes.length === 0,
    isDepleted: !isLoading && quotes.length > 0 && currentIndex >= quotes.length,
    advance,
    reset,
  };
}
