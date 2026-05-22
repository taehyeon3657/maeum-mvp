import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminMessaging } from "@/src/lib/firebase-admin";

const SIX_HOURS_AGO = () => new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

// Vercel Cron 또는 수동 호출 시 CRON_SECRET으로 인증
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 서비스 롤 키로 RLS 우회 → 모든 유저 읽기
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: users, error } = await supabase
    .from("users")
    .select("id, fcm_token")
    .not("fcm_token", "is", null)
    .lt("last_active_at", SIX_HOURS_AGO());

  if (error) {
    console.error("[reengage] Supabase 조회 실패:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const tokens = (users ?? []).map((u) => u.fcm_token as string);
  if (tokens.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const messaging = adminMessaging();
  const { successCount, failureCount } = await messaging.sendEachForMulticast({
    tokens,
    notification: {
      title: "오늘의 글귀가 기다리고 있어요",
      body: "지금 내 마음에 꼭 맞는 한 문장을 만나보세요",
      imageUrl: "https://maeum-mvp.vercel.app/icon",
    },
    webpush: {
      fcmOptions: { link: "https://maeum-mvp.vercel.app/feed" },
    },
  });

  console.log(`[reengage] 전송 완료 — 성공: ${successCount}, 실패: ${failureCount}`);
  return NextResponse.json({ ok: true, sent: successCount, failed: failureCount });
}
