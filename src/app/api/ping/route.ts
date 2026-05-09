import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase";

// Vercel Cron이 매일 자정 호출 → Supabase 7일 비활성 파우즈 방지
export async function GET() {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("quotes")
      .select("id", { count: "exact", head: true })
      .limit(1);

    if (error) throw error;

    return NextResponse.json({ ok: true, ts: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
