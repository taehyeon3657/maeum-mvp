"use client";

import { useRef, useState } from "react";
import type { SwipeDirection } from "@/src/models/feed";

const THRESHOLD = 80;    // 스와이프 확정 최소 거리 (px)
const FLY_DISTANCE = 520; // 카드 날아가는 거리 (px)
const FLY_DURATION = 300; // 날아가는 애니메이션 시간 (ms)

interface UseSwipeOptions {
  onSwipe: (direction: SwipeDirection) => void;
}

export interface SwipeHandlers {
  onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
}

export function useSwipe({ onSwipe }: UseSwipeOptions) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFlying, setIsFlying] = useState(false);

  const startX = useRef(0);
  const onSwipeRef = useRef(onSwipe);
  onSwipeRef.current = onSwipe;

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (isFlying) return;
    startX.current = e.clientX;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDragging || isFlying) return;
    setDragX(e.clientX - startX.current);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragX >= THRESHOLD) {
      setIsFlying(true);
      setDragX(FLY_DISTANCE);
      setTimeout(() => onSwipeRef.current("like"), FLY_DURATION);
    } else if (dragX <= -THRESHOLD) {
      setIsFlying(true);
      setDragX(-FLY_DISTANCE);
      setTimeout(() => onSwipeRef.current("dislike"), FLY_DURATION);
    } else {
      setDragX(0);
    }
  };

  // 드래그 중에는 transition 없이 손가락을 따라가고, 손을 뗄 때만 애니메이션
  const cardStyle: React.CSSProperties = {
    transform: `translateX(${dragX}px) rotate(${dragX * 0.04}deg)`,
    transition: isDragging ? "none" : `transform ${FLY_DURATION}ms ease`,
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
  };

  // 스와이프 방향에 따라 0~1 사이 opacity
  const likeOpacity = Math.min(1, Math.max(0, dragX / THRESHOLD));
  const dislikeOpacity = Math.min(1, Math.max(0, -dragX / THRESHOLD));

  const handlers: SwipeHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
  };

  return { cardStyle, likeOpacity, dislikeOpacity, isFlying, handlers };
}
