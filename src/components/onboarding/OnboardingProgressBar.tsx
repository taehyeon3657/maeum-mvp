interface Props {
  step: number;
  total: number;
}

export default function OnboardingProgressBar({ step, total }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-primary/20 z-50 max-w-[430px] mx-auto">
      <div
        className="h-full bg-primary transition-all duration-500"
        style={{ width: `${(step / total) * 100}%` }}
      />
    </div>
  );
}
