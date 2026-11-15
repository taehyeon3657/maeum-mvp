"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Share } from "lucide-react";
import { canUseKakaoShare, shareQuoteLink, type ShareQuoteResult } from "@/src/lib/shareQuoteLink";

interface Props {
  id: string;
  content: string;
  gift?: boolean;
  /** icon: 카드 위 원형 버튼. quiet: 본문 아래 한 줄. */
  variant?: "icon" | "quiet";
  /** 사진 위는 밝은 유리, 종이 카드는 옅은 표면. */
  tone?: "photo" | "paper";
}

const QUIET_LABEL: Record<ShareQuoteResult, string | null> = {
  kakao: "보냈어요",
  shared: "보냈어요",
  copied: "복사됨",
  cancelled: null,
};

function subscribeKakao() {
  return () => {};
}

function stopCardGesture(event: React.SyntheticEvent) {
  event.stopPropagation();
}

export default function QuoteSendButton({
  id,
  content,
  gift = true,
  variant = "icon",
  tone = "paper",
}: Props) {
  const [result, setResult] = useState<ShareQuoteResult | null>(null);
  const [pending, setPending] = useState(false);
  const kakaoReady = useSyncExternalStore(subscribeKakao, canUseKakaoShare, () => false);
  const doneLabel = result ? QUIET_LABEL[result] : null;
  const quietLabel = pending ? "건네기" : doneLabel ?? "건네기";
  const ariaLabel = pending ? "보내는 중" : doneLabel ?? (kakaoReady && gift ? "카카오로 건네기" : "건네기");

  const handleClick = async () => {
    if (pending) return;
    setPending(true);
    try {
      const next = await shareQuoteLink({ id, content, gift });
      setResult(next === "cancelled" ? null : next);
      if (next !== "cancelled") {
        window.setTimeout(() => setResult(null), 1600);
      }
    } catch {
      setResult("copied");
      window.setTimeout(() => setResult(null), 1600);
    } finally {
      setPending(false);
    }
  };

  const icon = doneLabel ? (
    <Check strokeWidth={2.25} aria-hidden />
  ) : (
    <Share strokeWidth={2.25} aria-hidden />
  );

  if (variant === "quiet") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-label={ariaLabel}
        className="quote-share-quiet"
      >
        {icon}
        <span>{quietLabel}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onPointerDown={stopCardGesture}
      onPointerUp={stopCardGesture}
      onPointerCancel={stopCardGesture}
      onClick={(event) => {
        stopCardGesture(event);
        void handleClick();
      }}
      disabled={pending}
      aria-label={ariaLabel}
      className={`quote-share ${tone === "photo" ? "quote-share--photo" : "quote-share--paper"}`}
    >
      {icon}
    </button>
  );
}
