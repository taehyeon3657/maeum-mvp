"use client";

import { useResolvedQuoteImage } from "@/src/hooks/useQuoteImage";
import { getQuoteBackground } from "@/src/lib/quoteBackground";
import type { CollectionItem } from "@/src/hooks/useUserCollection";

interface Props {
  item: CollectionItem;
  onOpen: () => void;
}

export default function CollectionCard({ item, onOpen }: Props) {
  const { quote } = item;
  const resolved = useResolvedQuoteImage(quote);
  const bg = getQuoteBackground(quote);
  const imgOk = resolved.status === "image";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative w-full aspect-[3/4] rounded-[20px] overflow-hidden text-left shadow-sm active:scale-[0.96] transition-transform duration-200"
      style={imgOk ? undefined : bg.style}
      aria-label={`저장한 글귀: ${quote.content}`}
    >
      {imgOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved.url}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* 하단 가독성 스크림 */}
      <div
        className="absolute inset-0"
        style={{
          background: imgOk
            ? "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 42%, rgba(0,0,0,0.68) 100%)"
            : "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.22) 100%)",
        }}
        aria-hidden
      />

      {/* 문구 */}
      <div className="absolute inset-0 flex flex-col justify-end p-3.5">
        <p
          className="font-quote text-[12.5px] leading-[1.55] font-bold line-clamp-4 break-keep"
          style={{
            color: imgOk ? "#ffffff" : bg.textColor,
            textShadow: imgOk ? "0 1px 8px rgba(0,0,0,0.45)" : undefined,
          }}
        >
          {quote.content}
        </p>
        {(quote.author || quote.source) && (
          <p
            className="font-sans text-[10px] mt-1.5 truncate"
            style={{ color: imgOk ? "rgba(255,255,255,0.75)" : bg.mutedColor }}
          >
            {quote.author ? `— ${quote.author}` : `〈${quote.source}〉`}
          </p>
        )}
      </div>

      {/* 저장 뱃지 */}
      <div
        className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.26)", backdropFilter: "blur(4px)" }}
        aria-hidden
      >
        <span className="text-[11px] leading-none">💛</span>
      </div>
    </button>
  );
}
