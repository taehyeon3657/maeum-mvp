interface Props {
  step: number;
  total: number;
  onBack: () => void;
  onSkip: () => void;
}

export default function OnboardingNav({ step, total, onBack, onSkip }: Props) {
  return (
    <div className="pt-8 flex items-center justify-between mb-6">
      {step > 1 ? (
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full border border-primary/30 bg-surface
            flex items-center justify-center text-textMain hover:bg-warm transition-colors"
        >
          ←
        </button>
      ) : (
        <div className="w-10" />
      )}

      <span className="text-textMuted text-sm">{step} / {total}</span>

      {step === total ? (
        <button
          onClick={onSkip}
          className="text-textMuted text-sm hover:text-textMain transition-colors"
        >
          건너뛰기
        </button>
      ) : (
        <div className="w-16" />
      )}
    </div>
  );
}
