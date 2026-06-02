import type { Quote } from "@/src/models/feed";

// 기존 파스텔 톤(밝은 시작 → 은은한 끝)과 동일한 밝기 범위 안에서
// 감정 카테고리별 색조(hue)만 다르게 변주한다. 텍스트(#37352f) 대비 유지.
const CATEGORY_GRADIENTS = {
  // 드라마/영화 명대사 — 은은한 라벤더
  drama: "linear-gradient(155deg, #FDFCFF 0%, #F2EDF8 55%, #E6DDF4 100%)",
  // 사랑/우정 — 연한 로즈
  love: "linear-gradient(155deg, #FFFCFC 0%, #FCEDF0 55%, #F7DCE2 100%)",
  // 동기/성장/도전 — 연한 살구/옐로
  motivation: "linear-gradient(155deg, #FFFDF4 0%, #FFF5D4 55%, #FFE8A8 100%)",
  // 위로/치유/희망 — 따뜻한 피치 (기본값)
  comfort: "linear-gradient(155deg, #FFFCF8 0%, #FFF0E6 55%, #FFE2CC 100%)",
  // 쉼/여유 — 연한 민트
  rest: "linear-gradient(155deg, #FAFDF9 0%, #EDF5F0 55%, #D9EDE0 100%)",
  // 일상/감사 — 맑은 스카이 크림
  daily: "linear-gradient(155deg, #FCFEFF 0%, #EDF4F8 55%, #DCE9F2 100%)",
};

function getCategoryFromQuote(quote: Quote): keyof typeof CATEGORY_GRADIENTS {
  const tags = quote.emotion_tags || [];
  const source = quote.source || "";

  if (tags.includes("명대사") && source) return "drama";
  if (tags.includes("사랑") || tags.includes("우정")) return "love";
  if (
    tags.includes("동기") ||
    tags.includes("성장") ||
    tags.includes("노력") ||
    tags.includes("도전")
  )
    return "motivation";
  if (tags.includes("위로") || tags.includes("치유") || tags.includes("희망"))
    return "comfort";
  if (tags.includes("쉼") || tags.includes("여유") || tags.includes("휴식"))
    return "rest";
  if (tags.includes("일상") || tags.includes("감사")) return "daily";

  return "comfort";
}

function pickGradient(quote: Quote) {
  return CATEGORY_GRADIENTS[getCategoryFromQuote(quote)];
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
