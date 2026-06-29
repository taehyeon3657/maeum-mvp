import type { Quote } from "@/src/models/feed";
import { getQuoteBackground } from "@/src/lib/quoteBackground";
import { getQuoteScene } from "@/src/lib/quoteScene";
import { pixelSceneUrl } from "@/src/lib/pixelScene";

interface Props {
  quote: Quote;
}

export default function QuoteCard({ quote }: Props) {
  // 내용에 맞는 도트 장면이 있으면 추상 모티프 대신 그 장면을 보여준다
  const scene = getQuoteScene(quote);
  const bg = getQuoteBackground(quote, { withMotif: !scene });

  return (
    <div
      className="w-full h-full flex flex-col rounded-[28px] shadow-2xl shadow-primary/10 select-none overflow-hidden animate-scale-in"
      style={bg.style}
    >
      {/* 상단 포인트 라인 */}
      <div
        className="h-[3px]"
        style={{
          background: `linear-gradient(to right, transparent, ${bg.accentColor}, transparent)`,
        }}
      />

      {/* 본문 */}
      <div className="flex-1 flex flex-col px-8 pt-7 pb-6 relative">
        {/* 배경 따옴표 장식 */}
        <div
          className="absolute top-2 left-5 font-quote leading-none select-none pointer-events-none"
          style={{ fontSize: "110px", color: bg.accentColor, opacity: 0.12 }}
          aria-hidden
        >
          &ldquo;
        </div>

        {/* 내용에 맞는 도트 장면 (있을 때만) */}
        {scene && (
          <div
            className="z-10 mt-2 mb-1 h-[34%] min-h-[120px]"
            style={{
              backgroundImage: pixelSceneUrl(scene),
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
              imageRendering: "pixelated",
            }}
            aria-hidden
          />
        )}

        {/* 글귀 본문 — 세로 중앙 */}
        <div className="flex-1 flex items-center justify-center z-10 px-1">
          <p
            className="font-quote text-[1.45rem] leading-[1.9] break-keep text-center font-bold"
            style={{ color: bg.textColor }}
          >
            {quote.content}
          </p>
        </div>

        {/* 장식 구분선 */}
        <div className="flex items-center gap-3 my-5 z-10">
          <div
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${bg.accentColor}66)`,
            }}
          />
          <div
            className="w-[5px] h-[5px] rounded-sm rotate-45 shrink-0"
            style={{ background: `${bg.accentColor}99` }}
          />
          <div
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(to left, transparent, ${bg.accentColor}66)`,
            }}
          />
        </div>

        {/* 출처 + 워터마크 */}
        <div className="flex items-end justify-between z-10">
          <div className="flex flex-col gap-0.5">
            {quote.author && (
              <p
                className="font-quote text-[0.95rem] font-semibold"
                style={{ color: bg.textColor, opacity: 0.85 }}
              >
                — {quote.author}
              </p>
            )}
            {quote.source && (
              <p
                className="font-sans text-[11px] tracking-wide"
                style={{ color: bg.mutedColor }}
              >
                〈{quote.source}〉
              </p>
            )}
            {!quote.author && !quote.source && (
              <p
                className="font-sans text-[11px]"
                style={{ color: bg.mutedColor, opacity: 0.6 }}
              >
                작자 미상
              </p>
            )}
          </div>
          <span
            className="font-quote text-[11px] font-bold tracking-[0.25em]"
            style={{ color: bg.accentColor, opacity: 0.55 }}
          >
            마음
          </span>
        </div>
      </div>
    </div>
  );
}
