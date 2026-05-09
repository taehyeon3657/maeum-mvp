import type { Quote } from "@/src/models/feed";

const GRADIENTS = [
  "linear-gradient(155deg, #FFFCF8 0%, #FFF0E6 55%, #FFE2CC 100%)",
  "linear-gradient(155deg, #FAFDF9 0%, #EDF5F0 55%, #D9EDE0 100%)",
  "linear-gradient(155deg, #FDFCFF 0%, #F2EDF8 55%, #E6DDF4 100%)",
  "linear-gradient(155deg, #FFFDF4 0%, #FFF5D4 55%, #FFE8A8 100%)",
];

function pickGradient(id: string) {
  const n = id ? [...id].reduce((a, c) => a + c.charCodeAt(0), 0) : 0;
  return GRADIENTS[n % GRADIENTS.length];
}

interface Props {
  quote: Quote;
}

export default function QuoteCard({ quote }: Props) {
  const gradient = pickGradient(quote.id);

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
