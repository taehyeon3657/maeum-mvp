/* src/components/onboarding/TimeList.tsx */
"use client";

import { TIME_OPTIONS } from "@/src/models/onboarding";

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

export default function TimeList({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-[9px] mb-7">
      {TIME_OPTIONS.map((opt) => {
        const isOn = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={[
              "flex items-center gap-4 px-[18px] py-[17px] rounded-[15px] border-[1.5px]",
              "cursor-pointer transition-all duration-200 outline-none text-left w-full",
              isOn
                ? "border-primary bg-primary/5"
                : "border-primary/20 bg-surface hover:border-primary/40 hover:bg-warm hover:translate-x-1",
            ].join(" ")}
          >
            <span className="text-[22px] w-[30px] text-center shrink-0">{opt.emoji}</span>
            <span className="font-sans text-[14px] text-textMain font-normal tracking-wide">
              {opt.label}
            </span>

            {/* 라디오 */}
            <span className={[
              "ml-auto shrink-0 w-[19px] h-[19px] rounded-full border-[1.5px]",
              "flex items-center justify-center transition-all duration-200",
              isOn ? "border-primary bg-primary" : "border-primary/30",
            ].join(" ")}>
              {isOn && (
                <span className="w-[7px] h-[7px] rounded-full bg-white block" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}