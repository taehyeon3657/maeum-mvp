"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFeedQuotes } from "@/src/hooks/useFeedQuotes";
import { useFeedCooldown } from "@/src/hooks/useFeedCooldown";
import { useSessionContext } from "@/src/hooks/useSessionContext";
import {
  usePreloadQuoteImage,
  useResolvedQuoteImage,
} from "@/src/hooks/useQuoteImage";
import { createSessionCompletionSnapshot } from "@/src/lib/feedSessionCore.mjs";
import { saveUserQuote } from "@/src/lib/userQuotes";
import SwipeCard from "./SwipeCard";
import QuoteCard from "./QuoteCard";
import TutorialCard from "./TutorialCard";
import CooldownScreen from "./CooldownScreen";
import ShareScreen from "./ShareScreen";
import type { Quote, SwipeDirection } from "@/src/models/feed";

interface Props {
  userId: string;
}

const SAVE_FLUSH_TIMEOUT_MS = 3_000;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function FeedStack({ userId }: Props) {
  const [tutorialDone, setTutorialDone] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isFinishingSession, setIsFinishingSession] = useState(false);
  // 카드별 체류시간 추적 { quote, durationMs }
  const readQuotesRef = useRef<{ quote: Quote; durationMs: number }[]>([]);
  const pendingSavesRef = useRef<Promise<void>[]>([]);
  const mountedRef = useRef(true);
  const [shareQuote, setShareQuote] = useState<Quote | null>(null);

  const { isOnCooldown, remainingMs, startCooldown, clearCooldown } = useFeedCooldown();
  const { currentQuote, nextQuote, isLoading, hasError, isEmpty, isDepleted, quoteProgress, advance, reset } =
    useFeedQuotes(userId, isOnCooldown);
  const { markCardStart, getContextSnapshot } = useSessionContext();
  const currentQuoteImage = useResolvedQuoteImage(currentQuote);
  usePreloadQuoteImage(nextQuote);
  const isCurrentQuoteVisualLoading =
    tutorialDone && !!currentQuote && currentQuoteImage.status === "loading";
  const isCurrentQuoteReady =
    !!currentQuote && currentQuoteImage.status !== "loading";

  // 세션 시작 시각 (튜토리얼 완료 후 첫 카드 등장 시점)
  const sessionStartRef = useRef<number | null>(null);
  const [sessionDurationMs, setSessionDurationMs] = useState(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (tutorialDone && isCurrentQuoteReady && sessionStartRef.current === null) {
      sessionStartRef.current = Date.now();
    }
  }, [tutorialDone, isCurrentQuoteReady, currentQuote?.id]);

  useEffect(() => {
    if (tutorialDone && isCurrentQuoteReady) {
      markCardStart();
    }
  }, [tutorialDone, currentQuote?.id, isCurrentQuoteReady, markCardStart]);

  const enqueueQuoteSave = (payload: Parameters<typeof saveUserQuote>[0]) => {
    const savePromise = saveUserQuote(payload);
    pendingSavesRef.current = [...pendingSavesRef.current, savePromise];
    void savePromise.finally(() => {
      pendingSavesRef.current = pendingSavesRef.current.filter(
        (pending) => pending !== savePromise,
      );
    });
    return savePromise;
  };

  const flushPendingSaves = async () => {
    const pending = [...pendingSavesRef.current];
    if (pending.length === 0) return;

    await Promise.race([
      Promise.allSettled(pending),
      wait(SAVE_FLUSH_TIMEOUT_MS),
    ]);
  };

  const completeSession = async () => {
    setIsFinishingSession(true);
    await flushPendingSaves();
    if (!mountedRef.current) return;

    const snapshot = createSessionCompletionSnapshot({
      readQuotes: readQuotesRef.current,
      startedAt: sessionStartRef.current,
      now: Date.now(),
    });
    setSessionDurationMs(snapshot.durationMs);
    setShareQuote(snapshot.shareQuote);
    startCooldown();
    setShowShare(true);
    setIsFinishingSession(false);
  };

  const handleQuoteSwipe = (direction: SwipeDirection) => {
    if (!currentQuote) return;
    const ctx = getContextSnapshot();
    const isLastCard = quoteProgress.current === quoteProgress.total - 1;
    enqueueQuoteSave({ user_id: userId, quote_id: currentQuote.id, action: direction, ...ctx });
    // 모든 카드의 체류시간 기록 (좋아요 여부 무관)
    readQuotesRef.current.push({ quote: currentQuote, durationMs: ctx.read_duration_ms });
    advance();
    if (isLastCard) {
      void completeSession();
    }
  };

  const handleShareContinue = () => {
    setShowShare(false);
    setIsFinishingSession(false);
    setShareQuote(null);
    readQuotesRef.current = [];
    pendingSavesRef.current = [];
    sessionStartRef.current = null;
  };

  const handleResume = () => {
    clearCooldown();
    reset();
  };

  // 공유 화면 (10개 완료 직후)
  // iOS WebKit에서 flex-1+overflow-y:auto가 동작하지 않으므로
  // position:absolute inset:0 패턴으로 스크롤 컨테이너를 별도 구성
  if (showShare) {
    return (
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <div
          className="absolute inset-0 overflow-y-auto"
          style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          <ShareScreen
            sessionDurationMs={sessionDurationMs}
            onContinue={handleShareContinue}
            shareQuote={shareQuote}
          />
        </div>
      </div>
    );
  }

  if (isFinishingSession) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-primary/10" />
          </div>
          <p className="font-quote text-xl text-textMuted animate-pulse">
            기록을 정리하는 중...
          </p>
        </div>
      </div>
    );
  }

  if (isOnCooldown || isDepleted) {
    return <CooldownScreen remainingMs={remainingMs} onResume={handleResume} />;
  }

  if (isLoading || isCurrentQuoteVisualLoading) {
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

  if (hasError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="font-quote text-2xl text-textMain">잠시 연결이 끊겼어요</p>
        <p className="font-sans text-sm text-textMuted">글귀를 불러오지 못했어요.</p>
        <button
          onClick={reset}
          className="mt-2 px-6 py-3 rounded-2xl bg-primary text-white font-sans text-sm font-semibold shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          다시 시도하기
        </button>
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

  // tutorialDone이 true인데 currentQuote가 없는 비정상 상태 방지
  if (tutorialDone && !currentQuote && !isDepleted) {
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

  const hasBackCard = tutorialDone ? !!nextQuote : !!currentQuote;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-x-hidden">
      {/* 카드 스택 영역 */}
      <div className="flex-1 min-h-0 relative mx-4 mt-3 mb-2 overflow-hidden">
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
            <QuoteCard quote={currentQuote} imageUrl={currentQuoteImage.url} />
          </SwipeCard>
        ) : null}
      </div>

      {/* 진행 도트 인디케이터 */}
      {tutorialDone && quoteProgress.total > 0 && (
        <div className="flex-none flex items-center justify-center gap-[6px] py-4">
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
      {!tutorialDone && <div className="flex-none py-4" />}
    </div>
  );
}
