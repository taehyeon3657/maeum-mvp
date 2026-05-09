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
      style={{ zIndex: 2, ...cardStyle }}
      {...handlers}
    >
      {/* 좋아요 오버레이 */}
      <div
        className="absolute inset-0 rounded-[28px] z-10 pointer-events-none flex items-start justify-start p-7"
        style={{ opacity: likeOpacity }}
      >
        <span className="border-[2.5px] border-green-500 text-green-500 font-quote font-bold text-xl tracking-widest px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm"
          style={{ transform: "rotate(-10deg)" }}>
          좋아요 ✦
        </span>
      </div>

      {/* 넘길게요 오버레이 */}
      <div
        className="absolute inset-0 rounded-[28px] z-10 pointer-events-none flex items-start justify-end p-7"
        style={{ opacity: dislikeOpacity }}
      >
        <span className="border-[2.5px] border-rose-400 text-rose-400 font-quote font-bold text-xl tracking-widest px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm"
          style={{ transform: "rotate(10deg)" }}>
          넘길게요
        </span>
      </div>

      {children}
    </div>
  );
}
