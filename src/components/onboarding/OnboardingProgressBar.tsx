interface Props {
  step: number;
  total: number;
}

export default function OnboardingProgressBar({ step, total }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-50 max-w-[430px] mx-auto" style={{ background: "rgba(253,38,122,0.16)" }}>
      <div
        className="h-full transition-all duration-500"
        style={{ width: `${(step / total) * 100}%`, background: "var(--gradient-brand)" }}
      />
    </div>
  );
}
