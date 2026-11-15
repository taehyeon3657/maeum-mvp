"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase";
import { buildMindCard } from "@/src/lib/mindCardCore.mjs";
import { loadPrefsLocally } from "@/src/models/onboarding";
import { readStreak } from "@/src/lib/streakStorage";
import type { MindCardData } from "@/src/components/mind/MindCardView";

interface MindRow {
  action?: string;
  read_duration_ms?: number | null;
  quotes?: {
    id?: string;
    content?: string;
    author?: string | null;
    emotion_tags?: string[] | null;
  } | {
    id?: string;
    content?: string;
    author?: string | null;
    emotion_tags?: string[] | null;
  }[] | null;
}

function oneQuote(value: MindRow["quotes"]) {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export function useMindCard(userId: string | null) {
  const [card, setCard] = useState<MindCardData | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestKey, setRequestKey] = useState(0);

  const retry = useCallback(() => setRequestKey((key) => key + 1), []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setStreakCount(readStreak().count);

      try {
        const supabase = createClient();
        const [quotesResult, profileResult] = await Promise.all([
          supabase
            .from("user_quotes")
            .select("action, read_duration_ms, quotes(id, content, author, emotion_tags)")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(40),
          supabase.from("users").select("mbti").eq("id", userId).maybeSingle(),
        ]);

        if (quotesResult.error) throw new Error(quotesResult.error.message);
        if (cancelled) return;

        const localPrefs = loadPrefsLocally();
        const mbti = profileResult.data?.mbti || localPrefs?.mbti || "";
        const reads = ((quotesResult.data ?? []) as MindRow[]).map((row) => {
          const quote = oneQuote(row.quotes);
          return {
            action: row.action === "like" ? "like" : "dislike",
            durationMs: row.read_duration_ms ?? 0,
            emotionTags: quote?.emotion_tags ?? [],
            quote: {
              id: quote?.id ?? "",
              content: quote?.content ?? "",
              author: quote?.author ?? null,
            },
          };
        });

        setCard(buildMindCard({ reads, prefs: { mbti } }) as MindCardData);
        setLoading(false);
      } catch (loadError) {
        if (cancelled) return;
        setCard(null);
        setLoading(false);
        setError(loadError instanceof Error ? loadError.message : "마음 카드를 만들지 못했어요.");
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [userId, requestKey]);

  return { card, streakCount, loading, error, retry };
}
