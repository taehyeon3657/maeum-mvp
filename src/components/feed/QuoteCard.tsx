import type { Quote } from "@/src/models/feed";

interface Props {
  quote: Quote;
}

export default function QuoteCard({ quote }: Props) {
  return (
    <div className="w-full h-full flex flex-col justify-between rounded-[28px] bg-surface shadow-xl border border-primary/10 p-8 select-none">
      {/* 상단 장식 */}
      <div className="flex justify-start">
        <span className="font-quote text-6xl text-primary/20 leading-none">"</span>
      </div>

      {/* 글귀 본문 */}
      <div className="flex-1 flex items-center px-1">
        <p className="font-quote text-[1.45rem] leading-[1.75] text-textMain break-keep">
          {quote.content}
        </p>
      </div>

      {/* 출처 */}
      <div className="flex flex-col gap-1 pt-4 border-t border-primary/10">
        {quote.author && (
          <p className="font-sans text-sm font-semibold text-textMain">
            — {quote.author}
          </p>
        )}
        {quote.source && (
          <p className="font-sans text-xs text-textMuted italic">
            〈{quote.source}〉
          </p>
        )}
      </div>
    </div>
  );
}
