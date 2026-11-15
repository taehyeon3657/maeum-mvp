"use client";

import { Heart, Star, X } from "lucide-react";
import type { SwipeCommand } from "@/src/hooks/useSwipe";

interface Props {
  disabled?: boolean;
  onAction: (command: SwipeCommand) => void;
}

export default function FeedActionBar({ disabled, onAction }: Props) {
  return (
    <div className="feed-actions">
      <button
        type="button"
        className="action-btn action-btn--nope"
        aria-label="넘기기"
        disabled={disabled}
        onClick={() => onAction("dislike")}
      >
        <X strokeWidth={2.25} aria-hidden />
      </button>
      <button
        type="button"
        className="action-btn action-btn--superlike"
        aria-label="최고예요"
        disabled={disabled}
        onClick={() => onAction("superlike")}
      >
        <Star strokeWidth={2.25} aria-hidden />
      </button>
      <button
        type="button"
        className="action-btn action-btn--like"
        aria-label="좋아요"
        disabled={disabled}
        onClick={() => onAction("like")}
      >
        <Heart strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  );
}
