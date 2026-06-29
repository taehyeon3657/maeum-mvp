"use client";

import { useEffect, useState } from "react";
import type { Quote } from "@/src/models/feed";
import { getQuoteBackground } from "@/src/lib/quoteBackground";
import { quoteImageUrl } from "@/src/lib/quoteImage";

interface Props {
  quote: Quote;
}

export default function QuoteCard({ quote }: Props) {
  const bg = getQuoteBackground(quote);
  const imgUrl = quoteImageUrl(quote.id);

  // 이미지 존재 여부는 실제 로드 성공/실패로 판단한다(별도 매니페스트 불필요).
  // 로드 전·실패 시에는 기존 그라디언트 배경을 그대로 쓴다.
  const [imgOk, setImgOk] = useState(false);
  useEffect(() => {
    setImgOk(false);
    if (!imgUrl) return;
    let alive = true;
    const img = new window.Image();
    img.onload = () => alive && setImgOk(true);
    img.onerror = () => alive && setImgOk(false);
    img.src = imgUrl;
    return () => {
      alive = false;
    };
  }, [imgUrl]);

  // 이미지 모드 색상 (어두운 스크림 위 밝은 텍스트)
  const textColor = imgOk ? "#ffffff" : bg.textColor;
  const mutedColor = imgOk ? "rgba(255,255,255,0.82)" : bg.mutedColor;
  const accentColor = imgOk ? "rgba(255,255,255,0.92)" : bg.accentColor;
  const textShadow = imgOk ? "0 1px 10px rgba(0,0,0,0.55)" : undefined;

  const rootStyle = imgOk
    ? {
        backgroundImage: `url("${imgUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : bg.style;

  return (
    <div
      className="w-full h-full flex flex-col rounded-[28px] shadow-2xl shadow-primary/10 select-none overflow-hidden animate-scale-in"
      style={rootStyle}
    >
      {/* 상단 포인트 라인 (이미지 모드에서는 생략) */}
      {!imgOk && (
        <div
          className="h-[3px]"
          style={{
            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
          }}
        />
      )}

      {/* 가독성 스크림 — 상·하단을 어둑하게, 가운데는 그림이 보이게 */}
      {imgOk && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 28%, rgba(0,0,0,0.04) 52%, rgba(0,0,0,0.30) 78%, rgba(0,0,0,0.58) 100%)",
          }}
          aria-hidden
        />
      )}

      {/* 본문 */}
      <div className="flex-1 flex flex-col px-8 pt-7 pb-6 relative">
        {/* 배경 따옴표 장식 (이미지 모드에서는 생략) */}
        {!imgOk && (
          <div
            className="absolute top-2 left-5 font-quote leading-none select-none pointer-events-none"
            style={{ fontSize: "110px", color: accentColor, opacity: 0.12 }}
            aria-hidden
          >
            &ldquo;
          </div>
        )}

        {/* 글귀 본문 — 이미지 모드면 중앙보다 살짝 위, 아니면 정중앙 */}
        <div
          className={`flex-1 flex justify-center z-10 px-1 ${
            imgOk ? "items-start pt-[12%]" : "items-center"
          }`}
        >
          <p
            className="font-quote text-[1.45rem] leading-[1.9] break-keep text-center font-bold"
            style={{ color: textColor, textShadow }}
          >
            {quote.content}
          </p>
        </div>

        {/* 장식 구분선 (이미지 모드에서는 생략 — 그림을 가리지 않게) */}
        {!imgOk && (
          <div className="flex items-center gap-3 my-5 z-10">
            <div
              className="flex-1 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${accentColor}66)`,
              }}
            />
            <div
              className="w-[5px] h-[5px] rounded-sm rotate-45 shrink-0"
              style={{ background: `${accentColor}99` }}
            />
            <div
              className="flex-1 h-px"
              style={{
                background: `linear-gradient(to left, transparent, ${accentColor}66)`,
              }}
            />
          </div>
        )}

        {/* 출처 + 워터마크 */}
        <div className="flex items-end justify-between z-10">
          <div className="flex flex-col gap-0.5">
            {quote.author && (
              <p
                className="font-quote text-[0.95rem] font-semibold"
                style={{ color: textColor, opacity: 0.85, textShadow }}
              >
                — {quote.author}
              </p>
            )}
            {quote.source && (
              <p
                className="font-sans text-[11px] tracking-wide"
                style={{ color: mutedColor, textShadow }}
              >
                〈{quote.source}〉
              </p>
            )}
            {!quote.author && !quote.source && (
              <p
                className="font-sans text-[11px]"
                style={{ color: mutedColor, opacity: 0.6, textShadow }}
              >
                작자 미상
              </p>
            )}
          </div>
          <span
            className="font-quote text-[11px] font-bold tracking-[0.25em]"
            style={{ color: accentColor, opacity: 0.55, textShadow }}
          >
            마음
          </span>
        </div>
      </div>
    </div>
  );
}
