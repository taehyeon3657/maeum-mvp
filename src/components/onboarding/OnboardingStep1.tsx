"use client";

import EmotionGrid from "./EmotionGrid";

interface Props {
  emotions: string[];
  onToggle: (id: string) => void;
  onNext: () => void;
}

export default function OnboardingStep1({ emotions, onToggle, onNext }: Props) {
  return (
    <div className="flex flex-col flex-1">
      <p className="text-primary text-xs tracking-widest mb-4 font-sans">감정 성향 파악</p>
      <h1 className="font-quote text-4xl font-light text-textMain leading-snug mb-2">
        지금 당신의<br />
        <em className="text-primary italic">마음</em>은 어떤가요?
      </h1>
      <p className="text-textMuted text-sm mb-8 font-sans">최대 4개까지 선택할 수 있어요.</p>

      <EmotionGrid selected={emotions} onToggle={onToggle} />

      <button
        type="button"
        disabled={emotions.length === 0}
        onClick={onNext}
        className="w-full py-5 rounded-2xl font-sans text-sm tracking-wider mt-auto mb-8
          disabled:bg-warm disabled:text-textMuted disabled:cursor-not-allowed
          enabled:bg-textMain enabled:text-background enabled:hover:opacity-90 transition-all"
      >
        다음 →
      </button>
    </div>
  );
}
