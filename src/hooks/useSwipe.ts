"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SwipeDirection } from "@/src/models/feed";

const THRESHOLD = 80;
const WIDTH_RATIO = 0.4;
const FLY_DISTANCE = 520;
const FLY_DURATION = 300;
const ROTATE_MAX = 12;

export type SwipeCommand = SwipeDirection | "superlike";

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

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function rotationFor(dragX: number) {
  return Math.max(-ROTATE_MAX, Math.min(ROTATE_MAX, dragX * 0.04));
}

function thresholdFor(width: number) {
  if (width <= 0) return THRESHOLD;
  return Math.min(THRESHOLD, width * WIDTH_RATIO);
}

export function useSwipe({ onSwipe }: UseSwipeOptions) {
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [superLikeOpacity, setSuperLikeOpacity] = useState(0);

  const startX = useRef(0);
  const onSwipeRef = useRef(onSwipe);
  const isDraggingRef = useRef(false);
  const isFlyingRef = useRef(false);
  const dragXRef = useRef(0);

  useEffect(() => {
    onSwipeRef.current = onSwipe;
  }, [onSwipe]);

  const commit = useCallback((command: SwipeCommand) => {
    if (isFlyingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    isFlyingRef.current = true;
    setIsFlying(true);

    const resolved: SwipeDirection = command === "superlike" ? "like" : command;
    if (prefersReducedMotion()) {
      if (command === "superlike") setSuperLikeOpacity(1);
      onSwipeRef.current(resolved);
      return;
    }

    if (command === "superlike") {
      dragXRef.current = 0;
      setDragX(0);
      setDragY(-FLY_DISTANCE);
      setSuperLikeOpacity(1);
    } else if (command === "like") {
      dragXRef.current = FLY_DISTANCE;
      setDragX(FLY_DISTANCE);
      setDragY(0);
    } else {
      dragXRef.current = -FLY_DISTANCE;
      setDragX(-FLY_DISTANCE);
      setDragY(0);
    }

    window.setTimeout(() => onSwipeRef.current(resolved), FLY_DURATION);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (isFlyingRef.current) return;
    startX.current = e.clientX;
    isDraggingRef.current = true;
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* 캡처 실패해도 일반 버블링으로 동작 */
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDraggingRef.current || isFlyingRef.current) return;
    const newDragX = e.clientX - startX.current;
    dragXRef.current = newDragX;
    setDragX(newDragX);
  };

  const handlePointerUp = (e?: React.PointerEvent<HTMLElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    if (e) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* 이미 해제된 경우 무시 */
      }
    }

    const currentDragX = dragXRef.current;
    const threshold = thresholdFor(e?.currentTarget.clientWidth ?? 0);
    if (currentDragX >= threshold) {
      commit("like");
    } else if (currentDragX <= -threshold) {
      commit("dislike");
    } else {
      dragXRef.current = 0;
      setDragX(0);
      setDragY(0);
    }
  };

  const reduced = prefersReducedMotion();
  const cardStyle: React.CSSProperties = {
    transform: `translate(${dragX}px, ${dragY}px) rotate(${rotationFor(dragX)}deg)`,
    transition: isDragging || reduced ? "none" : `transform ${FLY_DURATION}ms ease`,
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
    touchAction: "none",
  };

  const likeOpacity = Math.min(1, Math.max(0, dragX / THRESHOLD));
  const dislikeOpacity = Math.min(1, Math.max(0, -dragX / THRESHOLD));

  const handlers: SwipeHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onPointerCancel: handlePointerUp,
    onDragStart: (e) => e.preventDefault(),
    draggable: false,
  };

  return {
    cardStyle,
    likeOpacity,
    dislikeOpacity,
    superLikeOpacity,
    isDragging,
    isFlying,
    handlers,
    commit,
  };
}
