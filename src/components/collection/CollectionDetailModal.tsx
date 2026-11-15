"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, Share, X } from "lucide-react";
import type { CollectionItem } from "@/src/hooks/useUserCollection";
import { resolveQuoteImage, useResolvedQuoteImage } from "@/src/hooks/useQuoteImage";
import { getQuoteBackground } from "@/src/lib/quoteBackground";
import { generateShareImage, shareImage } from "@/src/lib/generateShareImage";
import { shareQuoteLink } from "@/src/lib/shareQuoteLink";

interface Props {
  item: CollectionItem;
  onClose: () => void;
}

function formatFullDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function CollectionDetailModal({ item, onClose }: Props) {
  const { quote, likedAt } = item;
  const resolved = useResolvedQuoteImage(quote);
  const bg = getQuoteBackground(quote);
  const imgOk = resolved.status === "image";

  const [saveState, setSaveState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [sendState, setSendState] = useState<"idle" | "done">("idle");

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleSave = async () => {
    if (saveState === "loading") return;
    setSaveState("loading");
    try {
      const idSum = [...quote.id].reduce((a, c) => a + c.charCodeAt(0), 0);
      const imgResolved = await resolveQuoteImage(quote);
      const imageUrl =
        imgResolved.status === "image"
          ? `/api/quote-image/${encodeURIComponent(quote.id)}`
          : null;
      const blob = await generateShareImage({
        content: quote.content,
        author: quote.author,
        source: quote.source,
        gradientIndex: idSum,
        imageUrl,
      });
      await shareImage(blob, quote);
      setSaveState("done");
      setTimeout(() => setSaveState("idle"), 2200);
    } catch {
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 2200);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(quote.content);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2200);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2200);
    }
  };

  const handleSend = async () => {
    try {
      const result = await shareQuoteLink({ id: quote.id, content: quote.content, gift: true });
      if (result === "cancelled") return;
      setSendState("done");
      setTimeout(() => setSendState("idle"), 2200);
    } catch {
      setSendState("idle");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col animate-fade-in"
      style={{ background: "rgba(18,14,12,0.78)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex-1 flex flex-col justify-center px-6 py-8 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full max-w-sm mx-auto rounded-[28px] overflow-hidden shadow-2xl relative animate-scale-in"
          style={{ aspectRatio: "3 / 4", ...(imgOk ? {} : bg.style) }}
        >
          {imgOk && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolved.url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {imgOk && (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.06) 58%, rgba(0,0,0,0.58) 100%)",
              }}
              aria-hidden
            />
          )}

          <div className="absolute inset-0 flex flex-col p-7">
            <div className="flex-1 flex items-center">
              <p
                className="font-quote text-[1.3rem] leading-[1.85] font-bold break-keep"
                style={{
                  color: imgOk ? "#ffffff" : bg.textColor,
                  textShadow: imgOk ? "0 1px 10px rgba(0,0,0,0.5)" : undefined,
                }}
              >
                {quote.content}
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              {quote.author && (
                <p
                  className="font-quote text-[0.95rem] font-semibold"
                  style={{
                    color: imgOk ? "#ffffff" : bg.textColor,
                    opacity: 0.88,
                    textShadow: imgOk ? "0 1px 8px rgba(0,0,0,0.5)" : undefined,
                  }}
                >
                  — {quote.author}
                </p>
              )}
              {quote.source && (
                <p
                  className="font-sans text-[11px] tracking-wide"
                  style={{ color: imgOk ? "rgba(255,255,255,0.78)" : bg.mutedColor }}
                >
                  〈{quote.source}〉
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="text-center font-sans text-[11px] text-white/45 mt-4 tracking-wide">
          {formatFullDate(likedAt)}에 마음에 담았어요
        </p>
      </div>

      {/* 액션 바 */}
      <div
        className="px-6 pt-2 flex items-center gap-3 shrink-0"
        style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom, 2rem))" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform"
          style={{ background: "rgba(255,255,255,0.14)" }}
        >
          <X className="w-5 h-5 text-white" strokeWidth={2} />
        </button>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="문구 복사"
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform"
          style={{ background: "rgba(255,255,255,0.14)" }}
        >
          {copyState === "copied" ? (
            <Check className="w-5 h-5 text-white" strokeWidth={2} />
          ) : (
            <Copy className="w-5 h-5 text-white" strokeWidth={2} />
          )}
        </button>

        <button
          type="button"
          onClick={handleSend}
          aria-label="건네기"
          className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform"
          style={{ background: "rgba(255,255,255,0.14)" }}
        >
          {sendState === "done" ? (
            <Check className="w-5 h-5 text-white" strokeWidth={2} />
          ) : (
            <Share className="w-5 h-5 text-white" strokeWidth={2} />
          )}
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saveState === "loading"}
          className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 font-sans text-sm font-bold active:scale-[0.97] transition-all disabled:opacity-70"
          style={{
            background: saveState === "done" ? "#15803d" : "var(--gradient-brand-button)",
            color: "white",
            boxShadow: saveState === "done" ? "none" : "0 8px 24px rgba(253, 38, 122, 0.28)",
          }}
        >
          {saveState === "loading" ? (
            "이미지 만드는 중..."
          ) : saveState === "done" ? (
            <>
              <Check className="w-4 h-4" strokeWidth={2.5} /> 저장 완료
            </>
          ) : saveState === "error" ? (
            "다시 시도해 주세요"
          ) : (
            <>
              <Download className="w-4 h-4" strokeWidth={2.5} /> 이미지로 저장
            </>
          )}
        </button>
      </div>
    </div>
  );
}
