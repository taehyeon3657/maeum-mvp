"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase";

export interface AgeRow    { age_group: string; like_count: number; dislike_count: number }
export interface GenderRow { gender: string;    like_count: number; dislike_count: number }
export interface MbtiRow   { mbti: string;      like_count: number; dislike_count: number; like_rate: number }
export interface CategoryRow { category_name: string; category_color: string; category_emoji: string; like_count: number; dislike_count: number }
export interface HourRow   { hour_of_day: number; like_count: number; dislike_count: number }

export interface InsightsData {
  age:      AgeRow[];
  gender:   GenderRow[];
  mbti:     MbtiRow[];
  category: CategoryRow[];
  hour:     HourRow[];
}

export function useInsights() {
  const [data, setData]       = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetch() {
      try {
        const [age, gender, mbti, category, hour] = await Promise.all([
          supabase.rpc("get_insights_by_age"),
          supabase.rpc("get_insights_by_gender"),
          supabase.rpc("get_insights_by_mbti"),
          supabase.rpc("get_insights_by_category"),
          supabase.rpc("get_insights_by_hour"),
        ]);

        if (age.error || gender.error || mbti.error || category.error || hour.error) {
          throw new Error("데이터를 불러오는 데 실패했어요.");
        }

        setData({
          age:      (age.data      as AgeRow[])      ?? [],
          gender:   (gender.data   as GenderRow[])   ?? [],
          mbti:     (mbti.data     as MbtiRow[])     ?? [],
          category: (category.data as CategoryRow[]) ?? [],
          hour:     (hour.data     as HourRow[])     ?? [],
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "알 수 없는 오류가 발생했어요.");
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, []);

  return { data, loading, error };
}
