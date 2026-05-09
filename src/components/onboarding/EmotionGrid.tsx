"use client";

import { useState } from "react";
import { EMOTION_OPTIONS } from "@/src/models/onboarding";

const EMOTION_THEMES: Record<string, {
  gradient: string;
  borderOn: string;
  borderOff: string;
}> = {
  comfort:    { gradient: "linear-gradient(145deg, #FFFCF8, #FFE8D5)", borderOn: "#E07A5F", borderOff: "#E07A5F30" },
  motivation: { gradient: "linear-gradient(145deg, #FFF8F5, #FFE0D0)", borderOn: "#C0604A", borderOff: "#C0604A30" },
  rest:       { gradient: "linear-gradient(145deg, #F5FCF7, #D9EDE0)", borderOn: "#2D6A4F", borderOff: "#2D6A4F30" },
  growth:     { gradient: "linear-gradient(145deg, #FAF8FF, #E8DEFF)", borderOn: "#7C6FA0", borderOff: "#7C6FA030" },
};

interface Props {
  onNext: (emotions: string[]) => void;
}

export default function EmotionGrid({ onNext }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((e) => e !== id)
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 스크롤 그리드 */}
      <div className="flex-1 overflow-y-auto mb-4 pr-1">
        <div className="grid grid-cols-2 gap-3">
          {EMOTION_OPTIONS.map((opt, idx) => {
            const isOn = selected.includes(opt.id);
            const theme = EMOTION_THEMES[opt.id];
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => toggle(opt.id)}
                className="relative flex flex-col text-left p-5 rounded-[20px] cursor-pointer outline-none active:scale-95 transition-all duration-200 animate-fade-in-up"
                style={{
                  animationDelay: `${idx * 0.07}s`,
                  background: isOn ? theme.gradient : "#FFFFFF",
                  border: `1.5px solid ${isOn ? theme.borderOn : theme.borderOff}`,
                  boxShadow: isOn ? `0 4px 20px ${theme.borderOn}20` : "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                {/* 선택 체크 */}
                {isOn && (
                  <span
                    className="absolute top-[10px] right-[10px] w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme.borderOn }}
                  >
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                <span className="text-[32px] leading-none mb-3">{opt.emoji}</span>
                <span className="font-sans text-[13.5px] text-textMain leading-snug font-medium">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="pt-4 border-t border-primary/8">
        <p className="text-center mb-4 font-sans text-[11.5px] text-textMuted tracking-wider">
          <span className="font-quote text-primary text-[15px] font-extrabold">{selected.length}</span>
          {" "}/ 4개 선택
        </p>

        <button
          type="button"
          disabled={selected.length === 0}
          onClick={() => onNext(selected)}
          className={`
            w-full py-[18px] rounded-2xl font-sans text-sm font-semibold tracking-wider mb-6 transition-all duration-300
            ${selected.length === 0
              ? "bg-warm text-textMuted/50 cursor-not-allowed"
              : "bg-primary text-white shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98]"
            }
          `}
        >
          다음 →
        </button>
      </div>
    </div>
  );
}
