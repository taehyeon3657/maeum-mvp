"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase";
import { normalizeCollectionRows } from "@/src/lib/collectionCore.mjs";
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
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

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
        if (cancelled) return;
        setState({ items: [], loading: false, error: error.message });
        return;
      }

      if (cancelled) return;

      setState({
        items: normalizeCollectionRows(data) as CollectionItem[],
        loading: false,
        error: null,
      });
    };

    void fetch();

    return () => {
      cancelled = true;
    };
  }, [userId, requestKey]);

  const retry = useCallback(() => {
    setRequestKey((key) => key + 1);
  }, []);

  return { ...state, retry };
}
