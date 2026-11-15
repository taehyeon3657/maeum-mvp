"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useSwipe, type SwipeCommand } from "@/src/hooks/useSwipe";
import type { SwipeDirection } from "@/src/models/feed";

interface Props {
  onSwipe: (direction: SwipeDirection) => void;
  children: React.ReactNode;
}

export interface SwipeCardHandle {
  swipe: (command: SwipeCommand) => void;
}

const SwipeCard = forwardRef<SwipeCardHandle, Props>(function SwipeCard(
  { onSwipe, children },
  ref,
) {
  const {
    cardStyle,
    likeOpacity,
    dislikeOpacity,
    superLikeOpacity,
    isDragging,
    handlers,
    commit,
  } = useSwipe({ onSwipe });

  useImperativeHandle(ref, () => ({ swipe: commit }), [commit]);

  return (
    <div
      className="swipe-surface absolute inset-0"
      data-dragging={isDragging ? "true" : "false"}
      style={{ zIndex: 2, ...cardStyle }}
      {...handlers}
    >
      <div
        className="absolute inset-0 z-10 pointer-events-none flex items-start justify-start p-7"
        style={{ opacity: likeOpacity }}
      >
        <span
          className="swipe-stamp text-like"
          style={{ transform: `rotate(-12deg) scale(${0.92 + likeOpacity * 0.08})` }}
        >
          좋아요
        </span>
      </div>

      <div
        className="absolute inset-0 z-10 pointer-events-none flex items-start justify-end p-7"
        style={{ opacity: dislikeOpacity }}
      >
        <span
          className="swipe-stamp text-nope"
          style={{ transform: `rotate(12deg) scale(${0.92 + dislikeOpacity * 0.08})` }}
        >
          넘길게요
        </span>
      </div>

      <div
        className="absolute inset-x-0 top-7 z-10 pointer-events-none flex justify-center"
        style={{ opacity: superLikeOpacity }}
      >
        <span
          className="swipe-stamp text-superlike"
          style={{ transform: `scale(${0.92 + superLikeOpacity * 0.08})` }}
        >
          최고예요
        </span>
      </div>

      {children}
    </div>
  );
});

export default SwipeCard;
