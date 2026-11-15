"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase";
import { useUserCollection } from "@/src/hooks/useUserCollection";
import type { CollectionItem } from "@/src/hooks/useUserCollection";
import {
  createAuthGateState,
  getAuthGateErrorMessage,
  type AuthGateState,
} from "@/src/lib/authGateCore.mjs";
import { APP_ROUTES } from "@/src/lib/appRoutesCore.mjs";
import CollectionCard from "@/src/components/collection/CollectionCard";
import CollectionDetailModal from "@/src/components/collection/CollectionDetailModal";

export default function CollectionPage() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthGateState>({ status: "loading" });
  const [authAttempt, setAuthAttempt] = useState(0);
  const { items, loading, error, retry: retryCollection } = useUserCollection(
    authState.status === "authenticated" ? authState.userId : null,
  );
  const [openItem, setOpenItem] = useState<CollectionItem | null>(null);

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!active) return;

        const nextAuthState = createAuthGateState({
          userId: user?.id ?? null,
          errorMessage: authError?.message ?? null,
        });

        setAuthState(nextAuthState);
        if (nextAuthState.status === "redirecting") {
          router.replace(APP_ROUTES.onboarding);
        }
      } catch (authError) {
        if (!active) return;
        setAuthState({
          status: "error",
          message: getAuthGateErrorMessage(authError),
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
      <CollectionGateLoading
        label={authState.status === "redirecting" ? "온보딩으로 이동 중..." : "마음함을 여는 중..."}
      />
    );
  }

  if (authState.status === "error") {
    return (
      <CollectionGateError message={authState.message} onRetry={retryAuth} />
    );
  }

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--color-background)" }}>
      {/* 헤더 */}
      <header
        className="app-topbar sticky top-0 z-20"
        style={{ borderBottom: "1px solid rgba(253,38,122,0.08)" }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="app-icon-btn"
            aria-label="뒤로가기"
          >
            <span className="text-base text-textMain">←</span>
          </button>
          <span className="font-quote text-base font-extrabold text-textMain tracking-tight">
            내 마음함
          </span>
        </div>
        {!loading && items.length > 0 && (
          <span className="match-badge">{items.length}개</span>
        )}
      </header>

      {/* 히어로 배너 */}
      <div className="px-5 pt-6 pb-4">
        <div
          className="rounded-3xl overflow-hidden px-6 py-5 relative"
          style={{
            background: "var(--gradient-brand-button)",
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <p className="font-quote text-white text-[1.4rem] font-extrabold leading-snug mb-1 relative">
            마음에 담아둔<br />글귀들
          </p>
          <p className="font-sans text-white/80 text-[11px] leading-relaxed relative">
            좋아요를 누른 글귀가<br />여기에 모여요
          </p>
          {!loading && (
            <div className="flex gap-2 mt-3 relative">
              <span
                className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white/90"
                style={{ background: "rgba(255,255,255,0.2)" }}
              >
                💛 {items.length}개 저장됨
              </span>
              <button
                type="button"
                className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white/90"
                style={{ background: "rgba(255,255,255,0.2)" }}
                onClick={() => router.push(APP_ROUTES.mind)}
              >
                ✦ 마음 카드
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 본문 */}
      <main className="flex-1 px-5 pb-10 flex flex-col gap-3">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-primary/10" />
            </div>
            <p className="font-quote text-lg text-textMuted animate-pulse">
              마음함을 여는 중...
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-4xl">😔</span>
            <p className="font-quote text-xl text-textMain">불러올 수 없어요</p>
            <button
              onClick={retryCollection}
              className="brand-fill mt-2 px-5 py-2.5"
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-5xl">🫙</span>
            <p className="font-quote text-xl text-textMain font-extrabold">
              아직 담긴 글귀가 없어요
            </p>
            <p className="font-sans text-sm text-textMuted leading-relaxed">
              글귀를 읽다가 마음에 드는 게 있으면<br />오른쪽으로 스와이프해 보세요
            </p>
            <button
              onClick={() => router.push(APP_ROUTES.feed)}
              className="brand-fill mt-3 px-6 py-3"
            >
              글귀 보러 가기
            </button>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {items.map((item) => (
                <CollectionCard
                  key={`${item.quote.id}-${item.likedAt}`}
                  item={item}
                  onOpen={() => setOpenItem(item)}
                />
              ))}
            </div>

            {/* 하단 CTA */}
            <div className="rounded-3xl bg-warm border border-primary/12 px-5 py-5 flex flex-col items-center gap-3 text-center mt-2">
              <span className="text-2xl">✨</span>
              <p className="font-quote text-[1.1rem] text-textMain font-extrabold leading-snug">
                더 많은 글귀와<br />만나보세요
              </p>
              <button
                onClick={() => router.push(APP_ROUTES.feed)}
                className="brand-fill px-6 py-3"
              >
                오늘의 글귀 보러 가기
              </button>
            </div>
          </>
        )}
      </main>

      {openItem && (
        <CollectionDetailModal item={openItem} onClose={() => setOpenItem(null)} />
      )}
    </div>
  );
}

function CollectionGateLoading({ label }: { label: string }) {
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

function CollectionGateError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="h-dvh flex items-center justify-center bg-background px-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-3 rounded-full bg-primary/20" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-quote text-2xl text-textMain">마음함을 열 수 없어요</p>
          <p className="font-sans text-sm text-textMuted leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onRetry}
          className="brand-fill mt-2 px-6 py-3"
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
}
