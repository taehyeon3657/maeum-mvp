import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminMessaging } from "@/src/lib/firebase-admin";

// 로컬 테스트 시 REENGAGE_INACTIVE_MINUTES=1 (.env.local) 으로 1분 비활성으로 단축 가능
const INACTIVE_MS = process.env.REENGAGE_INACTIVE_MINUTES
  ? parseFloat(process.env.REENGAGE_INACTIVE_MINUTES) * 60 * 1000
  : 6 * 60 * 60 * 1000;
const INACTIVE_THRESHOLD = () => new Date(Date.now() - INACTIVE_MS).toISOString();

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
    .lt("last_active_at", INACTIVE_THRESHOLD());

  if (error) {
    console.error("[reengage] Supabase 조회 실패:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const tokens = (users ?? []).map((u) => u.fcm_token as string);
  if (tokens.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  const messaging = adminMessaging();
  const batchResponse = await messaging.sendEachForMulticast({
    tokens,
    webpush: {
      headers: { Urgency: "high", TTL: "86400" },
      notification: {
        title: "오늘의 글귀가 기다리고 있어요",
        body: "지금 내 마음에 꼭 맞는 한 문장을 만나보세요",
        icon: "https://maeum-mvp.vercel.app/favicon.svg",
        badge: "https://maeum-mvp.vercel.app/favicon.svg",
      },
      fcmOptions: { link: "https://maeum-mvp.vercel.app/feed" },
    },
  });

  // 등록 해제된 토큰 DB에서 제거 (만료/재설치 등으로 무효화된 경우)
  const expiredTokens = batchResponse.responses
    .map((r, i) => {
      const code = (r.error as { code?: string } | undefined)?.code ?? "";
      return !r.success && (code === "messaging/registration-token-not-registered" || code === "messaging/invalid-registration-token")
        ? tokens[i]
        : null;
    })
    .filter((t): t is string => t !== null);

  if (expiredTokens.length > 0) {
    await supabase.from("users").update({ fcm_token: null }).in("fcm_token", expiredTokens);
    console.log(`[reengage] 만료 토큰 ${expiredTokens.length}개 삭제`);
  }

  console.log(`[reengage] 전송 완료 — 성공: ${batchResponse.successCount}, 실패: ${batchResponse.failureCount}`);
  return NextResponse.json({ ok: true, sent: batchResponse.successCount, failed: batchResponse.failureCount });
}
