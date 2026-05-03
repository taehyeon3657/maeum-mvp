import TimeList from "./TimeList";

interface Props {
  time: string;
  onSelect: (id: string) => void;
  onNext: () => void;
}

export default function OnboardingStep2({ time, onSelect, onNext }: Props) {
  return (
    <div className="flex flex-col flex-1">
      <p className="text-primary text-xs tracking-widest mb-4 font-sans">알림 시간대</p>
      <h2 className="font-quote text-4xl font-light text-textMain leading-snug mb-2">
        언제 <em className="text-primary italic">글귀</em>가<br />생각나세요?
      </h2>
      <p className="text-textMuted text-sm mb-8 font-sans">원하는 시간대에 매일 글귀를 보내드려요.</p>

      <TimeList selected={time} onSelect={onSelect} />

      <button
        type="button"
        disabled={time === ""}
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
