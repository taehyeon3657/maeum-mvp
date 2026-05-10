"use client";

import type { TopQuote } from "@/src/hooks/useInsights";

interface Props {
  quotes: TopQuote[];
  badgeColor?: string;
  label?: string;
}

export default function TopQuoteCard({ quotes, badgeColor = "#e07a5f", label = "최애 글귀" }: Props) {
  if (quotes.length === 0) return null;

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "rgba(224,122,95,0.12)" }} />
        <p className="font-sans text-[10px] tracking-[0.18em] uppercase" style={{ color: "rgba(224,122,95,0.6)" }}>
          {label}
        </p>
        <div className="h-px flex-1" style={{ background: "rgba(224,122,95,0.12)" }} />
      </div>

      <div className="flex flex-col gap-2">
        {quotes.map((q) => (
          <div
            key={q.group + q.content}
            className="rounded-2xl px-4 py-3.5 flex flex-col gap-2"
            style={{ background: "rgba(240,235,225,0.6)", border: "1px solid rgba(224,122,95,0.10)" }}
          >
            {/* 배지 + 좋아요 수 */}
            <div className="flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-sans text-[11px] font-bold text-white"
                style={{ background: badgeColor }}
              >
                {q.groupEmoji && <span>{q.groupEmoji}</span>}
                {q.group}
              </span>
              <span className="font-sans text-[10px] text-textMuted flex items-center gap-1">
                <span style={{ color: badgeColor }}>♥</span> {q.like_count.toLocaleString()}회
              </span>
            </div>

            {/* 글귀 내용 */}
            <p
              className="font-quote text-[14px] text-textMain leading-relaxed"
              style={{ wordBreak: "keep-all" }}
            >
              &ldquo;{q.content}&rdquo;
            </p>

            {/* 출처 */}
            {q.author && (
              <p className="font-sans text-[11px] text-textMuted text-right">— {q.author}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
