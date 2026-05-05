"use client";

import { useEffect, useState } from "react";
import { useFeedQuotes } from "@/src/hooks/useFeedQuotes";
import { useSessionContext } from "@/src/hooks/useSessionContext";
import { saveUserQuote } from "@/src/lib/userQuotes";
import SwipeCard from "./SwipeCard";
import QuoteCard from "./QuoteCard";
import TutorialCard from "./TutorialCard";
import type { SwipeDirection } from "@/src/models/feed";

interface Props {
  userId: string;
  prefEmotions: string[];
}

export default function FeedStack({ userId, prefEmotions }: Props) {
  const [tutorialDone, setTutorialDone] = useState(false);

  const { currentQuote, nextQuote, isLoading, isEmpty, isDepleted, advance } =
    useFeedQuotes(prefEmotions);
  const { markCardStart, getContextSnapshot } = useSessionContext();

  // 카드가 바뀔 때마다 읽기 시작 시간 갱신
  useEffect(() => {
    markCardStart();
  }, [tutorialDone, currentQuote?.id, markCardStart]);

  const handleQuoteSwipe = async (direction: SwipeDirection) => {
    if (!currentQuote) return;
    const ctx = getContextSnapshot();
    advance();
    // UI를 즉시 업데이트하고 DB 저장은 백그라운드 처리
    saveUserQuote({ user_id: userId, quote_id: currentQuote.id, action: direction, ...ctx });
  };

  // ── 로딩 상태 ──
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="font-quote text-2xl text-textMuted animate-pulse">
          글귀를 불러오는 중...
        </p>
      </div>
    );
  }

  // ── 글귀 없음 ──
  if (isEmpty) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
        <p className="font-quote text-3xl text-textMain">준비 중이에요</p>
        <p className="font-sans text-sm text-textMuted">
          아직 글귀가 없어요. 조금만 기다려 주세요.
        </p>
      </div>
    );
  }

  // ── 모두 소진 ──
  if (isDepleted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
        <span className="text-5xl">✦</span>
        <p className="font-quote text-3xl text-textMain">오늘은 여기까지</p>
        <p className="font-sans text-sm text-textMuted">
          새로운 글귀가 곧 찾아올 거예요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 relative mx-4 my-6">
      {/* 배경 카드 (스택 느낌) */}
      {(tutorialDone ? nextQuote : currentQuote) && (
        <div
          className="absolute inset-0 rounded-[28px] bg-surface border border-primary/10 shadow-md"
          style={{ transform: "scale(0.95) translateY(12px)", zIndex: 0 }}
        />
      )}

      {/* 앞 카드 */}
      {!tutorialDone ? (
        <SwipeCard key="tutorial" onSwipe={() => setTutorialDone(true)}>
          <TutorialCard />
        </SwipeCard>
      ) : currentQuote ? (
        <SwipeCard key={currentQuote.id} onSwipe={handleQuoteSwipe}>
          <QuoteCard quote={currentQuote} />
        </SwipeCard>
      ) : null}
    </div>
  );
}
