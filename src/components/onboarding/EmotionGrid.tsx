"use client";

import { useState } from "react";
import { EMOTION_OPTIONS } from "@/src/models/onboarding";

interface Props {
  onNext: (emotions: string[]) => void;
}

export default function EmotionGrid({ onNext }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

const toggle = (id: string) => {
  console.log("클릭된 ID:", id); // 1. 클릭이 되는가?
  setSelected((prev) => {
    const next = prev.includes(id)
      ? prev.filter((e) => e !== id)
      : prev.length < 4 ? [...prev, id] : prev;
    console.log("다음 상태:", next); // 2. 상태가 변하는가?
    return next;
  });
};

  return (

    // 전체를 flex-col로 감싸고 min-h-0을 주어 부모의 높이를 넘지 않게 함
    <div className="flex flex-col flex-1 min-h-0">
      
      {/* 1. 스크롤되는 그리드 영역 */}
      <div className="flex-1 overflow-y-auto mb-4 pr-1 scrollbar-hide">
        <div className="grid grid-cols-2 gap-[10px]">
          {EMOTION_OPTIONS.map((opt) => {
            const isOn = selected.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggle(opt.id)}
                className={[
                  "relative flex flex-col text-left p-5 rounded-[18px] border-[1.5px]",
                  "cursor-pointer transition-all duration-200 outline-none active:scale-95",
                  isOn
                    ? "border-primary bg-primary/10"
                    : "border-primary/20 bg-surface hover:border-primary/40 hover:bg-warm",
                ].join(" ")}
              >
                {/* 체크 뱃지/이모지/라벨 로직 동일 */}
                {isOn && (
                  <span className="absolute top-[10px] right-[10px] w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                <span className="text-[30px] leading-none mb-3">{opt.emoji}</span>
                <span className="font-sans text-[13px] text-textMain leading-relaxed">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

<div className="bg-background pt-4 border-t border-primary/5">
        <p className="text-center mb-5 font-sans text-[11.5px] text-textMuted tracking-wider">
          <span className="font-quote text-primary text-[15px] italic">{selected.length}</span>
          {" "}/ 4개 선택
        </p>

        <button
          type="button"
          disabled={selected.length === 0}
          onClick={() => onNext(selected)}
          className={`
            w-full py-5 rounded-2xl font-sans text-sm font-semibold tracking-wider mb-8 transition-all duration-300
            ${selected.length === 0 
              ? "bg-[#F2F2F2] text-[#BCBCBC] cursor-not-allowed" // 비활성화: 연한 회색으로 확실히 구분
              : "bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98]" // 활성화: 브랜드 컬러 + 그림자
            }
          `}
        >
          다음 →
        </button>
      </div>
    </div>
  
  );
}
