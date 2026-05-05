import { createClient } from "@/src/lib/supabase";
import type { UserQuotePayload } from "@/src/models/feed";

export async function saveUserQuote(payload: UserQuotePayload): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("user_quotes").insert(payload);
  if (error) console.error("[userQuotes] insert failed:", error.message);
}
