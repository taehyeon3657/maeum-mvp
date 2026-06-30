"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase";

export interface AgeRow      { age_group: string; like_count: number; dislike_count: number }
export interface GenderRow   { gender: string;    like_count: number; dislike_count: number }
export interface MbtiRow     { mbti: string;      like_count: number; dislike_count: number; like_rate: number }
export interface CategoryRow { category_name: string; category_color: string; category_emoji: string; like_count: number; dislike_count: number }
export interface HourRow     { hour_of_day: number; like_count: number; dislike_count: number }

export interface TopQuote {
  group: string;
  groupEmoji?: string;
  content: string;
  author: string | null;
  like_count: number;
}

export interface InsightsData {
  age:              AgeRow[];
  gender:           GenderRow[];
  mbti:             MbtiRow[];
  category:         CategoryRow[];
  hour:             HourRow[];
  topQuoteByAge:      TopQuote[];
  topQuoteByGender:   TopQuote[];
  topQuoteByMbti:     TopQuote[];
  topQuoteByCategory: TopQuote[];
}

export function useInsights() {
  const [data, setData]       = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function fetch() {
      try {
        const [age, gender, mbti, category, hour, tqAge, tqGender, tqMbti, tqCategory] =
          await Promise.all([
            supabase.rpc("get_insights_by_age"),
            supabase.rpc("get_insights_by_gender"),
            supabase.rpc("get_insights_by_mbti"),
            supabase.rpc("get_insights_by_category"),
            supabase.rpc("get_insights_by_hour"),
            supabase.rpc("get_top_quote_by_age"),
            supabase.rpc("get_top_quote_by_gender"),
            supabase.rpc("get_top_quote_by_mbti"),
            supabase.rpc("get_top_quote_by_category"),
          ]);

        const anyError = [age, gender, mbti, category, hour, tqAge, tqGender, tqMbti, tqCategory]
          .find((r) => r.error);
        if (anyError?.error) throw new Error("데이터를 불러오는 데 실패했어요.");
        if (cancelled) return;

        type AgeQuoteRaw      = { age_group: string; content: string; author: string | null; like_count: number };
        type GenderQuoteRaw   = { gender: string;    content: string; author: string | null; like_count: number };
        type MbtiQuoteRaw     = { mbti: string;      content: string; author: string | null; like_count: number };
        type CategoryQuoteRaw = { category_name: string; category_emoji: string; content: string; author: string | null; like_count: number };

        setData({
          age:      (age.data      as AgeRow[])      ?? [],
          gender:   (gender.data   as GenderRow[])   ?? [],
          mbti:     (mbti.data     as MbtiRow[])     ?? [],
          category: (category.data as CategoryRow[]) ?? [],
          hour:     (hour.data     as HourRow[])     ?? [],
          topQuoteByAge:    ((tqAge.data as AgeQuoteRaw[]) ?? []).map((r) => ({
            group: r.age_group, content: r.content, author: r.author, like_count: r.like_count,
          })),
          topQuoteByGender: ((tqGender.data as GenderQuoteRaw[]) ?? []).map((r) => ({
            group: r.gender, content: r.content, author: r.author, like_count: r.like_count,
          })),
          topQuoteByMbti:   ((tqMbti.data as MbtiQuoteRaw[]) ?? []).map((r) => ({
            group: r.mbti, content: r.content, author: r.author, like_count: r.like_count,
          })),
          topQuoteByCategory: ((tqCategory.data as CategoryQuoteRaw[]) ?? []).map((r) => ({
            group: r.category_name, groupEmoji: r.category_emoji, content: r.content, author: r.author, like_count: r.like_count,
          })),
        });
        setError(null);
      } catch (e) {
        if (cancelled) return;
        setData(null);
        setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했어요.");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    }

    void fetch();

    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRequestKey((key) => key + 1);
  }, []);

  return { data, loading, error, retry };
}
