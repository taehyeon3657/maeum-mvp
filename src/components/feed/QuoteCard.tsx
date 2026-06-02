import type { Quote } from "@/src/models/feed";

const CATEGORY_GRADIENTS = {
  drama: "linear-gradient(155deg, #2d1b4e 0%, #1a0f3a 55%, #0d0820 100%)",
  love: "linear-gradient(155deg, #4a2835 0%, #382c4a 55%, #2a1f35 100%)",
  motivation: "linear-gradient(155deg, #4a3d2a 0%, #3d2f1a 55%, #2d2415 100%)",
  comfort: "linear-gradient(155deg, #FFFCF8 0%, #FFF0E6 55%, #FFE2CC 100%)",
  rest: "linear-gradient(155deg, #d9ede0 0%, #c5e1d0 55%, #afd3c0 100%)",
  daily: "linear-gradient(155deg, #FAFDF9 0%, #EDF5F0 55%, #D9EDE0 100%)",
};

function getCategoryFromQuote(quote: Quote): keyof typeof CATEGORY_GRADIENTS {
  const tags = quote.emotion_tags || [];
  const source = quote.source || "";

  if (tags.includes("명대사") && source) {
    return "drama";
  }

  if (tags.includes("사랑") || tags.includes("우정")) {
    return "love";
  }

  if (tags.includes("동기") || tags.includes("성장") || tags.includes("노력") || tags.includes("도전")) {
    return "motivation";
  }

  if (tags.includes("위로") || tags.includes("치유") || tags.includes("희망")) {
    return "comfort";
  }

  if (tags.includes("쉼") || tags.includes("여유") || tags.includes("휴식")) {
    return "rest";
  }

  if (tags.includes("일상") || tags.includes("감사")) {
    return "daily";
  }

  return "comfort";
}

function pickGradient(quote: Quote) {
  const category = getCategoryFromQuote(quote);
  return CATEGORY_GRADIENTS[category];
}

interface Props {
  quote: Quote;
}

export default function QuoteCard({ quote }: Props) {
  const gradient = pickGradient(quote);

  return (
    <div
      className="w-full h-full flex flex-col rounded-[28px] shadow-2xl shadow-primary/10 select-none overflow-hidden animate-scale-in"
      style={{ background: gradient }}
    >
      {/* 상단 포인트 라인 */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* 본문 */}
      <div className="flex-1 flex flex-col px-8 pt-7 pb-6 relative">
        {/* 배경 따옴표 장식 */}
        <div
          className="absolute top-2 left-5 font-quote leading-none text-primary/8 select-none pointer-events-none"
          style={{ fontSize: "110px" }}
          aria-hidden
        >
          &ldquo;
        </div>

        {/* 글귀 본문 — 세로 중앙 */}
        <div className="flex-1 flex items-center justify-center z-10 px-1">
          <p className="font-quote text-[1.45rem] leading-[1.9] text-textMain break-keep text-center font-bold">
            {quote.content}
          </p>
        </div>

        {/* 장식 구분선 */}
        <div className="flex items-center gap-3 my-5 z-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/25" />
          <div className="w-[5px] h-[5px] rounded-sm bg-primary/30 rotate-45 shrink-0" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/25" />
        </div>

        {/* 출처 + 워터마크 */}
        <div className="flex items-end justify-between z-10">
          <div className="flex flex-col gap-0.5">
            {quote.author && (
              <p className="font-quote text-[0.95rem] text-textMain/75 font-semibold">
                — {quote.author}
              </p>
            )}
            {quote.source && (
              <p className="font-sans text-[11px] text-textMuted tracking-wide">
                〈{quote.source}〉
              </p>
            )}
            {!quote.author && !quote.source && (
              <p className="font-sans text-[11px] text-textMuted/50">작자 미상</p>
            )}
          </div>
          <span className="font-quote text-[11px] text-primary/35 font-bold tracking-[0.25em]">
            마음
          </span>
        </div>
      </div>
    </div>
  );
}
