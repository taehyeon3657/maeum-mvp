import { createClient } from "@supabase/supabase-js";
import type { Quote } from "@/src/models/feed";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function asTags(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  return value.filter((tag): tag is string => typeof tag === "string");
}

export async function fetchPublicQuote(id: string): Promise<Quote | null> {
  if (!UUID_RE.test(id)) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("quotes")
    .select("id, content, author, source, emotion_tags, has_image")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data || typeof data.content !== "string") return null;

  return {
    id: data.id,
    content: data.content,
    author: data.author ?? null,
    source: data.source ?? null,
    emotion_tags: asTags(data.emotion_tags),
    has_image: Boolean(data.has_image),
  };
}
