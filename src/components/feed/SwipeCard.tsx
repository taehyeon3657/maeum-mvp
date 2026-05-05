"use client";

import { useSwipe } from "@/src/hooks/useSwipe";
import type { SwipeDirection } from "@/src/models/feed";

interface Props {
  onSwipe: (direction: SwipeDirection) => void;
  children: React.ReactNode;
}

export default function SwipeCard({ onSwipe, children }: Props) {
  const { cardStyle, likeOpacity, dislikeOpacity, handlers } = useSwipe({ onSwipe });

  return (
    <div
      className="absolute inset-0"
      style={cardStyle}
      {...handlers}
    >
      {/* 좋아요 오버레이 (오른쪽 스와이프) */}
      <div
        className="absolute inset-0 rounded-[28px] z-10 pointer-events-none flex items-start justify-start p-7"
        style={{ opacity: likeOpacity }}
      >
        <span className="border-[3px] border-green-500 text-green-500 font-sans font-extrabold text-2xl tracking-widest px-4 py-2 rounded-xl rotate-[-12deg]">
          좋아요 💚
        </span>
      </div>

      {/* 싫어요 오버레이 (왼쪽 스와이프) */}
      <div
        className="absolute inset-0 rounded-[28px] z-10 pointer-events-none flex items-start justify-end p-7"
        style={{ opacity: dislikeOpacity }}
      >
        <span className="border-[3px] border-rose-500 text-rose-500 font-sans font-extrabold text-2xl tracking-widest px-4 py-2 rounded-xl rotate-[12deg]">
          넘길게요 💔
        </span>
      </div>

      {children}
    </div>
  );
}
