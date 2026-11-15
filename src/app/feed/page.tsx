"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase";
import FeedStack from "@/src/components/feed/FeedStack";
import {
  createFeedAuthState,
  getFeedAuthErrorMessage,
  type FeedAuthState,
} from "@/src/lib/feedAuthCore.mjs";
import { APP_ROUTES } from "@/src/lib/appRoutesCore.mjs";
import { BarChart3, Library } from "lucide-react";

export default function FeedPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<FeedAuthState>({ status: "loading" });
  const [authAttempt, setAuthAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!active) return;

        const nextAuthState = createFeedAuthState({
          userId: user?.id ?? null,
          errorMessage: error?.message ?? null,
        });

        setAuthState(nextAuthState);
        if (nextAuthState.status === "redirecting") {
          router.replace(APP_ROUTES.onboarding);
        }
      } catch (error) {
        if (!active) return;
        setAuthState({
          status: "error",
          message: getFeedAuthErrorMessage(error),
        });
      }
    };
    void init();

    return () => {
      active = false;
    };
  }, [authAttempt, router]);

  const retryAuth = () => {
    setAuthState({ status: "loading" });
    setAuthAttempt((attempt) => attempt + 1);
  };

  if (authState.status === "loading" || authState.status === "redirecting") {
    return (
      <FeedGateLoading
        label={authState.status === "redirecting" ? "온보딩으로 이동 중..." : "마음을 여는 중..."}
      />
    );
  }

  if (authState.status === "error") {
    return (
      <div className="h-dvh flex items-center justify-center bg-background px-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-3 rounded-full bg-primary/20" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-quote text-2xl text-textMain">마음을 열 수 없어요</p>
            <p className="font-sans text-sm text-textMuted leading-relaxed">
              {authState.message}
            </p>
          </div>
          <button
            onClick={retryAuth}
            className="brand-fill mt-2 px-6 py-3"
          >
            다시 시도하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col bg-background overflow-hidden">
      {/* 헤더 */}
      <header className="app-topbar">
        <button
          type="button"
          className="app-icon-btn"
          aria-label="내 마음함"
          onClick={() => router.push(APP_ROUTES.collection)}
        >
          <Library strokeWidth={2} aria-hidden />
        </button>
        <h1 className="app-wordmark font-quote">
          마음
          <span className="app-tab-indicator" aria-hidden />
        </h1>
        <button
          type="button"
          className="app-icon-btn"
          aria-label="인사이트"
          onClick={() => router.push(APP_ROUTES.insights)}
        >
          <BarChart3 strokeWidth={2} aria-hidden />
        </button>
      </header>

      {/* 카드 스택 — 남은 공간 전부 */}
      <FeedStack userId={authState.userId} />
    </div>
  );
}

function FeedGateLoading({ label }: { label: string }) {
  return (
    <div className="h-dvh flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
          <div className="absolute inset-3 rounded-full bg-primary/20" />
        </div>
        <p className="font-quote text-xl text-textMuted animate-pulse">{label}</p>
      </div>
    </div>
  );
}
