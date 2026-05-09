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

  const { currentQuote, nextQuote, isLoading, isEmpty, isDepleted, quoteProgress, advance, reset } =
    useFeedQuotes(userId);
  const { isOnCooldown, remainingMs, startCooldown, clearCooldown } = useFeedCooldown();
  const { markCardStart, getContextSnapshot } = useSessionContext();

  const cooldownStartedRef = useRef(false);
  useEffect(() => {
    if (isDepleted && !cooldownStartedRef.current) {
      cooldownStartedRef.current = true;
      startCooldown();
    }
  }, [isDepleted, startCooldown]);

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

  if (isOnCooldown || isDepleted) {
    return <CooldownScreen remainingMs={remainingMs} onResume={handleResume} />;
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-primary/10" />
          </div>
          <p className="font-quote text-xl text-textMuted animate-pulse">
            글귀를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
        <p className="font-quote text-3xl text-textMain">준비 중이에요</p>
        <p className="font-sans text-sm text-textMuted">아직 글귀가 없어요. 조금만 기다려 주세요.</p>
      </div>
    );
  }

  const hasBackCard = tutorialDone ? !!nextQuote : !!currentQuote;

  return (
    <div className="flex-1 flex flex-col">
      {/* 카드 스택 영역 */}
      <div className="flex-1 relative mx-4 my-4">
        {/* 세 번째 배경 카드 */}
        {hasBackCard && (
          <div
            className="absolute inset-0 rounded-[28px] bg-warm/60 border border-primary/8"
            style={{ transform: "scale(0.90) translateY(22px)", zIndex: 0, opacity: 0.5 }}
          />
        )}
        {/* 두 번째 배경 카드 */}
        {hasBackCard && (
          <div
            className="absolute inset-0 rounded-[28px] bg-warm/80 border border-primary/10 shadow-sm"
            style={{ transform: "scale(0.95) translateY(11px)", zIndex: 1 }}
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

      {/* 진행 도트 인디케이터 */}
      {tutorialDone && quoteProgress.total > 0 && (
        <div
          className="flex-none flex items-center justify-center gap-[6px] pt-1"
          style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}
        >
          {Array.from({ length: quoteProgress.total }).map((_, i) => (
            <div
              key={i}
              className="h-[5px] rounded-full transition-all duration-400"
              style={{
                width: i === quoteProgress.current ? "20px" : "5px",
                backgroundColor:
                  i < quoteProgress.current
                    ? "rgba(224,122,95,0.5)"
                    : i === quoteProgress.current
                    ? "#E07A5F"
                    : "rgba(224,122,95,0.15)",
              }}
            />
          ))}
        </div>
      )}
      {!tutorialDone && (
        <div className="flex-none" style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }} />
      )}
    </div>
  );
}
