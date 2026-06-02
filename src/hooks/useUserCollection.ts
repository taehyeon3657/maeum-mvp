"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase";
import type { Quote } from "@/src/models/feed";

export interface CollectionItem {
  likedAt: string;
  quote: Quote;
}

interface State {
  items: CollectionItem[];
  loading: boolean;
  error: string | null;
}

export function useUserCollection(userId: string | null) {
  const [state, setState] = useState<State>({ items: [], loading: true, error: null });

  useEffect(() => {
    if (!userId) return;

    const fetch = async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      const supabase = createClient();

      const { data, error } = await supabase
        .from("user_quotes")
        .select("created_at, quotes(id, content, author, source, emotion_tags)")
        .eq("user_id", userId)
        .eq("action", "like")
        .order("created_at", { ascending: false });

      if (error) {
        setState({ items: [], loading: false, error: error.message });
        return;
      }

      const items: CollectionItem[] = (data ?? [])
        .filter((row) => row.quotes !== null)
        .map((row) => ({
          likedAt: row.created_at as string,
          quote: row.quotes as unknown as Quote,
        }));

      setState({ items, loading: false, error: null });
    };

    fetch();
  }, [userId]);

  return state;
}
