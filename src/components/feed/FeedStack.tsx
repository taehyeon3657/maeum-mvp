"use client";

import { useEffect, useRef, useState } from "react";
import { useFeedQuotes } from "@/src/hooks/useFeedQuotes";
import { useFeedCooldown } from "@/src/hooks/useFeedCooldown";
import { useSessionContext } from "@/src/hooks/useSessionContext";
import { saveUserQuote } from "@/src/lib/userQuotes";
import SwipeCard from "./SwipeCard";
import QuoteCard from "./QuoteCard";
import TutorialCard from "./TutorialCard";
import CooldownScreen from "./CooldownScreen";
import type { SwipeDirection } from "@/src/models/feed";

interface Props {
  userId: string;
}

export default function FeedStack({ userId }: Props) {
  const [tutorialDone, setTutorialDone] = useState(false);

  const { currentQuote, nextQuote, isLoading, isEmpty, isDepleted, advance, reset } =
    useFeedQuotes(userId);
  const { isOnCooldown, remainingMs, startCooldown, clearCooldown } = useFeedCooldown();
  const { markCardStart, getContextSnapshot } = useSessionContext();

  // 세션 소진 시 쿨다운 시작 (중복 호출 방지)
  const cooldownStartedRef = useRef(false);
  useEffect(() => {
    if (isDepleted && !cooldownStartedRef.current) {
      cooldownStartedRef.current = true;
      startCooldown();
    }
  }, [isDepleted, startCooldown]);

  // 카드가 바뀔 때마다 읽기 시작 시간 갱신
  useEffect(() => {
    markCardStart();
  }, [tutorialDone, currentQuote?.id, markCardStart]);

  const handleQuoteSwipe = async (direction: SwipeDirection) => {
    if (!currentQuote) return;
    const ctx = getContextSnapshot();
    advance();
    saveUserQuote({ user_id: userId, quote_id: currentQuote.id, action: direction, ...ctx });
  };

  const handleResume = () => {
    cooldownStartedRef.current = false;
    clearCooldown();
    reset();
  };

  // ── 쿨다운 중 or 막 소진 됨 ──
  if (isOnCooldown || isDepleted) {
    return <CooldownScreen remainingMs={remainingMs} onResume={handleResume} />;
  }

  // ── 로딩 ──
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
