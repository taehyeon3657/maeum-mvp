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
import { recordSessionStreak } from "@/src/lib/streakStorage";
import SwipeCard, { type SwipeCardHandle } from "./SwipeCard";
import QuoteCard from "./QuoteCard";
import TutorialCard from "./TutorialCard";
import CooldownScreen from "./CooldownScreen";
import ShareScreen from "./ShareScreen";
import FeedActionBar from "./FeedActionBar";
import type { SwipeCommand } from "@/src/hooks/useSwipe";
import type { Quote, SwipeDirection } from "@/src/models/feed";

interface SessionRead {
  quote: Quote;
  durationMs: number;
  action: SwipeDirection;
}

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
  const readQuotesRef = useRef<SessionRead[]>([]);
  const pendingSavesRef = useRef<Promise<void>[]>([]);
  const mountedRef = useRef(true);
  const [shareQuote, setShareQuote] = useState<Quote | null>(null);
  const [sessionReads, setSessionReads] = useState<SessionRead[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [actionsLocked, setActionsLocked] = useState(false);
  const cardRef = useRef<SwipeCardHandle>(null);

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

  useEffect(() => {
    setActionsLocked(false);
  }, [tutorialDone, currentQuote?.id]);

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
    setSessionReads([...readQuotesRef.current]);
    setStreakCount(recordSessionStreak().count);
    startCooldown();
    setShowShare(true);
    setIsFinishingSession(false);
  };

  const triggerSwipe = (command: SwipeCommand) => {
    if (actionsLocked) return;
    setActionsLocked(true);
    cardRef.current?.swipe(command);
  };

  const handleQuoteSwipe = (direction: SwipeDirection) => {
    if (!currentQuote) return;
    const ctx = getContextSnapshot();
    const isLastCard = quoteProgress.current === quoteProgress.total - 1;
    enqueueQuoteSave({ user_id: userId, quote_id: currentQuote.id, action: direction, ...ctx });
    // 모든 카드의 체류시간 기록 (좋아요 여부 무관)
    readQuotesRef.current.push({
      quote: currentQuote,
      durationMs: ctx.read_duration_ms,
      action: direction,
    });
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
            sessionReads={sessionReads}
            streakCount={streakCount}
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
          className="brand-fill mt-2 px-6 py-3"
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
      <div className="feed-stage">
        {hasBackCard && (
          <div
            className="feed-back-card absolute inset-0 rounded-[var(--radius-card)] bg-warm/60 border border-primary/8"
            style={{ transform: "scale(0.90) translateY(22px)", zIndex: 0, opacity: 0.5 }}
          />
        )}
        {hasBackCard && (
          <div
            className="feed-back-card absolute inset-0 rounded-[var(--radius-card)] bg-warm/80 border border-primary/10"
            style={{ transform: "scale(0.95) translateY(11px)", zIndex: 1, boxShadow: "var(--shadow-rest)" }}
          />
        )}

        {!tutorialDone ? (
          <SwipeCard ref={cardRef} key="tutorial" onSwipe={() => setTutorialDone(true)}>
            <TutorialCard />
          </SwipeCard>
        ) : currentQuote ? (
          <SwipeCard ref={cardRef} key={currentQuote.id} onSwipe={handleQuoteSwipe}>
            <QuoteCard quote={currentQuote} imageUrl={currentQuoteImage.url} shareable />
          </SwipeCard>
        ) : null}
      </div>

      {tutorialDone && quoteProgress.total > 0 && (
        <div className="flex-none flex items-center justify-center gap-[6px] pt-2">
          {Array.from({ length: quoteProgress.total }).map((_, i) => (
            <div
              key={i}
              className="h-[5px] rounded-full transition-all duration-400"
              style={{
                width: i === quoteProgress.current ? "20px" : "5px",
                background:
                  i === quoteProgress.current
                    ? "var(--gradient-brand)"
                    : i < quoteProgress.current
                    ? "rgba(253, 38, 122, 0.45)"
                    : "rgba(253, 38, 122, 0.16)",
              }}
            />
          ))}
        </div>
      )}

      <FeedActionBar disabled={actionsLocked} onAction={triggerSwipe} />
    </div>
  );
}
