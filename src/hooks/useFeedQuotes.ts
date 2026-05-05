"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/src/lib/supabase";
import type { Quote } from "@/src/models/feed";

const BATCH_SIZE = 20;
const REFETCH_AT_REMAINING = 5; // 남은 카드가 이 수 이하면 추가 로딩

// pref_emotions로 필터링하지 않고 전체 글귀를 노출합니다.
// pref_emotions(성향 데이터)와 emotion_tags(콘텐츠 태그)는 어휘 체계가 달라
// 직접 매칭이 무의미하며, 오히려 bias 없이 수집한 스와이프 행동 데이터와
// pref_emotions를 교차 분석할 때 유의미한 패턴이 나옵니다.
export function useFeedQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);

  const fetchBatch = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;

    const supabase = createClient();
    const query = supabase
      .from("quotes")
      .select("id, content, author, source, emotion_tags")
      .eq("is_active", true)
      .range(offsetRef.current, offsetRef.current + BATCH_SIZE - 1);

    const { data, error } = await query;

    if (!error && data) {
      if (data.length < BATCH_SIZE) setHasMore(false);
      setQuotes((prev) => [...prev, ...data]);
      offsetRef.current += data.length;
    }

    isFetchingRef.current = false;
  }, [hasMore]);

  // 초기 로딩
  useEffect(() => {
    setIsLoading(true);
    fetchBatch().finally(() => setIsLoading(false));
  // fetchBatch는 prefEmotions/hasMore에 의존하지만 초기 1회만 실행하면 됨
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 남은 카드 부족 시 추가 로딩
  useEffect(() => {
    const remaining = quotes.length - currentIndex;
    if (remaining <= REFETCH_AT_REMAINING && hasMore) {
      fetchBatch();
    }
  }, [currentIndex, quotes.length, hasMore, fetchBatch]);

  const advance = useCallback(() => {
    setCurrentIndex((i) => i + 1);
  }, []);

  return {
    currentQuote: quotes[currentIndex] ?? null,
    nextQuote: quotes[currentIndex + 1] ?? null,
    isLoading,
    isEmpty: !isLoading && quotes.length === 0,
    isDepleted: !isLoading && !hasMore && currentIndex >= quotes.length,
    advance,
  };
}
