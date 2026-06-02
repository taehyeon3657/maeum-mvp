"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase";
import { useUserCollection } from "@/src/hooks/useUserCollection";
import type { CollectionItem } from "@/src/hooks/useUserCollection";

const GRADIENTS = [
  "linear-gradient(155deg, #FFFCF8 0%, #FFF0E6 55%, #FFE2CC 100%)",
  "linear-gradient(155deg, #FAFDF9 0%, #EDF5F0 55%, #D9EDE0 100%)",
  "linear-gradient(155deg, #FDFCFF 0%, #F2EDF8 55%, #E6DDF4 100%)",
  "linear-gradient(155deg, #FFFDF4 0%, #FFF5D4 55%, #FFE8A8 100%)",
];

function pickGradient(id: string) {
  const n = id ? [...id].reduce((a, c) => a + c.charCodeAt(0), 0) : 0;
  return GRADIENTS[n % GRADIENTS.length];
}

function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

function CollectionCard({ item }: { item: CollectionItem }) {
  const { quote, likedAt } = item;
  const gradient = pickGradient(quote.id);

  return (
    <div
      className="w-full rounded-3xl overflow-hidden shadow-sm"
      style={{ background: gradient, border: "1px solid rgba(224,122,95,0.08)" }}
    >
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="px-6 py-5">
        <p className="font-quote text-[1.15rem] leading-[1.85] text-textMain font-bold break-keep mb-4">
          {quote.content}
        </p>
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-0.5">
            {quote.author && (
              <p className="font-quote text-[0.85rem] text-textMain/70 font-semibold">
                — {quote.author}
              </p>
            )}
            {quote.source && (
              <p className="font-sans text-[10px] text-textMuted tracking-wide">
                〈{quote.source}〉
              </p>
            )}
            {!quote.author && !quote.source && (
              <p className="font-sans text-[10px] text-textMuted/50">작자 미상</p>
            )}
          </div>
          <span className="font-sans text-[10px] text-textMuted/50 shrink-0 ml-3">
            {formatRelativeDate(likedAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CollectionPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const { items, loading, error } = useUserCollection(userId);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/onboarding"); return; }
      setUserId(user.id);
    };
    init();
  }, [router]);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--color-background)" }}>
      {/* 헤더 */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-5 py-4"
        style={{
          background: "rgba(255,254,252,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(224,122,95,0.08)",
        }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => history.back()}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(224,122,95,0.08)" }}
            aria-label="뒤로가기"
          >
            <span className="text-sm text-primary">←</span>
          </button>
          <span className="font-quote text-base font-extrabold text-textMain tracking-tight">
            내 마음함
          </span>
        </div>
        {!loading && items.length > 0 && (
          <span className="font-sans text-[11px] text-textMuted/70 tracking-widest">
            {items.length}개 ✦
          </span>
        )}
      </header>

      {/* 히어로 배너 */}
      <div className="px-5 pt-6 pb-4">
        <div
          className="rounded-3xl overflow-hidden px-6 py-5 relative"
          style={{
            background: "linear-gradient(135deg, #e07a5f 0%, #f4a261 60%, #e8b4a0 100%)",
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
            </div>
          )}
        </div>
      </div>

      {/* 본문 */}
      <main className="flex-1 px-5 pb-10 flex flex-col gap-3">
        {(loading || !userId) && (
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
              onClick={() => window.location.reload()}
              className="mt-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold"
              style={{ background: "#e07a5f" }}
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
              onClick={() => (window.location.href = "/feed")}
              className="mt-3 px-6 py-3 rounded-2xl text-white font-sans text-sm font-bold tracking-wider shadow-lg"
              style={{ background: "#e07a5f", boxShadow: "0 4px 16px rgba(224,122,95,0.3)" }}
            >
              글귀 보러 가기
            </button>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            {items.map((item) => (
              <CollectionCard key={`${item.quote.id}-${item.likedAt}`} item={item} />
            ))}

            {/* 하단 CTA */}
            <div className="rounded-3xl bg-warm border border-primary/12 px-5 py-5 flex flex-col items-center gap-3 text-center mt-2">
              <span className="text-2xl">✨</span>
              <p className="font-quote text-[1.1rem] text-textMain font-extrabold leading-snug">
                더 많은 글귀와<br />만나보세요
              </p>
              <button
                onClick={() => (window.location.href = "/feed")}
                className="px-6 py-3 rounded-2xl text-white font-sans text-sm font-bold tracking-wider shadow-lg"
                style={{ background: "#e07a5f", boxShadow: "0 4px 16px rgba(224,122,95,0.3)" }}
              >
                오늘의 글귀 보러 가기
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
