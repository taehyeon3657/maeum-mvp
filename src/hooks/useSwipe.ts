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
  onPointerUp: (e: React.PointerEvent<HTMLElement>) => void;
  onPointerCancel: (e: React.PointerEvent<HTMLElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLElement>) => void;
  draggable: boolean;
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
    // 데스크톱에서 카드가 날아가며 언마운트될 때 캡처가 비정상 상태로
    // 남는 것을 방지하기 위해 try/catch로 감싼다.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* 캡처 실패해도 일반 버블링으로 동작 */
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDragging || isFlying) return;
    setDragX(e.clientX - startX.current);
  };

  const handlePointerUp = (e?: React.PointerEvent<HTMLElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (e) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* 이미 해제된 경우 무시 */
      }
    }

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
    touchAction: "none", // 모바일 스와이프 시 페이지 스크롤 간섭 방지
  };

  // 스와이프 방향에 따라 0~1 사이 opacity
  const likeOpacity = Math.min(1, Math.max(0, dragX / THRESHOLD));
  const dislikeOpacity = Math.min(1, Math.max(0, -dragX / THRESHOLD));

  const handlers: SwipeHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
    // 데스크톱 마우스 드래그 시 브라우저 네이티브 드래그가 끼어들어
    // pointercancel을 유발하는 것을 막는다 (PC 스와이프 끊김 방지).
    onDragStart: (e) => e.preventDefault(),
    draggable: false,
  };

  return { cardStyle, likeOpacity, dislikeOpacity, isFlying, handlers };
}
