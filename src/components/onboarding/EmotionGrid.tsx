/* src/components/onboarding/EmotionGrid.tsx */
"use client";

import { EMOTION_OPTIONS } from "@/src/models/onboarding";

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
}

export default function EmotionGrid({ selected, onToggle }: Props) {
  return (
    <>
      <div className="grid grid-cols-2 gap-[10px] mb-5">
        {EMOTION_OPTIONS.map((opt) => {
          const isOn = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onToggle(opt.id)}
              className={[
                "relative flex flex-col text-left p-5 rounded-[18px] border-[1.5px]",
                "cursor-pointer transition-all duration-200 outline-none",
                "active:scale-95",
                isOn
                  ? "border-primary bg-primary/10"
                  : "border-primary/20 bg-surface hover:border-primary/40 hover:bg-warm",
              ].join(" ")}
            >
              {/* 체크 뱃지 */}
              {isOn && (
                <span className="absolute top-[10px] right-[10px] w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}

              <span className="text-[30px] leading-none mb-3">{opt.emoji}</span>
              <span className="font-sans text-[13px] font-normal text-textMain leading-relaxed">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-center mb-5 font-sans text-[11.5px] text-textMuted tracking-wider">
        <span className="font-quote text-primary text-[15px] italic">{selected.length}</span>
        {" "}/ 4개 선택
      </p>
    </>
  );
}