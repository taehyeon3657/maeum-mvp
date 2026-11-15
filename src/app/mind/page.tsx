"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase";
import { APP_ROUTES } from "@/src/lib/appRoutesCore.mjs";
import {
  createAuthGateState,
  getAuthGateErrorMessage,
  type AuthGateState,
} from "@/src/lib/authGateCore.mjs";
import { useMindCard } from "@/src/hooks/useMindCard";
import MindCardView from "@/src/components/mind/MindCardView";
import { generateMindCardImage } from "@/src/lib/generateMindCardImage";
import { shareImage } from "@/src/lib/generateShareImage";

export default function MindPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthGateState>({ status: "loading" });
  const [authAttempt, setAuthAttempt] = useState(0);
  const userId = authState.status === "authenticated" ? authState.userId : null;
  const { card, streakCount, loading, error, retry } = useMindCard(userId);
  const [imageState, setImageState] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    let active = true;
    const init = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (!active) return;
        const next = createAuthGateState({
          userId: user?.id ?? null,
          errorMessage: authError?.message ?? null,
        });
        setAuthState(next);
        if (next.status === "redirecting") router.replace(APP_ROUTES.onboarding);
      } catch (authError) {
        if (!active) return;
        setAuthState({ status: "error", message: getAuthGateErrorMessage(authError) });
      }
    };
    void init();
    return () => {
      active = false;
    };
  }, [authAttempt, router]);

  const shareCard = async () => {
    if (!card || imageState === "loading") return;
    setImageState("loading");
    try {
      const blob = await generateMindCardImage({
        headline: card.headline,
        detail: card.detail,
        emoji: card.emoji,
        mbti: card.mbti,
        quoteContent: card.quote?.content ?? null,
        quoteAuthor: card.quote?.author ?? null,
        streakCount,
      });
      await shareImage(blob, { content: card.headline }, { text: `${card.headline}\n마음에서 만든 카드예요.` });
      setImageState("done");
      window.setTimeout(() => setImageState("idle"), 2000);
    } catch {
      setImageState("error");
      window.setTimeout(() => setImageState("idle"), 2000);
    }
  };

  if (authState.status === "loading" || authState.status === "redirecting") {
    return (
      <div className="h-dvh flex items-center justify-center">
        <p className="font-quote text-xl text-textMuted animate-pulse">마음 카드를 여는 중...</p>
      </div>
    );
  }

  if (authState.status === "error") {
    return (
      <div className="h-dvh flex flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="font-quote text-2xl text-textMain">마음 카드를 열 수 없어요</p>
        <p className="font-sans text-sm text-textMuted">{authState.message}</p>
        <button type="button" className="brand-fill px-6 py-3" onClick={() => setAuthAttempt((n) => n + 1)}>
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--color-background)" }}>
      <header className="app-topbar sticky top-0 z-20" style={{ borderBottom: "1px solid rgba(253,38,122,0.08)" }}>
        <div className="flex items-center gap-2">
          <button type="button" className="app-icon-btn" aria-label="뒤로가기" onClick={() => router.back()}>
            <span className="text-base text-textMain">←</span>
          </button>
          <span className="font-quote text-base font-extrabold text-textMain">나의 마음 카드</span>
        </div>
      </header>

      <main className="flex-1 px-5 pt-6 pb-10 flex flex-col gap-4">
        {loading && <p className="font-quote text-xl text-textMuted animate-pulse text-center py-16">카드를 그리는 중...</p>}
        {error && (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <p className="font-quote text-xl text-textMain">카드를 만들지 못했어요</p>
            <p className="font-sans text-sm text-textMuted">{error}</p>
            <button type="button" className="brand-fill px-5 py-2.5" onClick={retry}>다시 시도</button>
          </div>
        )}
        {card && (
          <>
            <MindCardView card={card} streakCount={streakCount} />
            <button
              type="button"
              className="brand-fill w-full py-4 disabled:opacity-60"
              disabled={imageState === "loading" || card.readCount === 0}
              onClick={shareCard}
            >
              {imageState === "loading"
                ? "이미지 만드는 중..."
                : imageState === "done"
                ? "공유됨"
                : imageState === "error"
                ? "다시 시도해 주세요"
                : "마음 카드 공유하기"}
            </button>
            <button
              type="button"
              className="w-full py-3 font-sans text-sm font-bold text-primary"
              onClick={() => router.push(APP_ROUTES.feed)}
            >
              글귀 더 만나기
            </button>
          </>
        )}
      </main>
    </div>
  );
}
