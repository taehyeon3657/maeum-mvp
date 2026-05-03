"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingProgressBar from "@/src/components/onboarding/OnboardingProgressBar";
import OnboardingNav from "@/src/components/onboarding/OnboardingNav";
import OnboardingStep1 from "@/src/components/onboarding/OnboardingStep1";
import OnboardingStep2 from "@/src/components/onboarding/OnboardingStep2";
import OnboardingStep3 from "@/src/components/onboarding/OnboardingStep3";

const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep]         = useState(1);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [time, setTime]         = useState("");
  const [mbti, setMbti]         = useState("");
  const [gender, setGender]     = useState("");
  const [age, setAge]           = useState("");

  const toggleEmotion = (id: string) => {
    setEmotions((prev) =>
      prev.includes(id)
        ? prev.filter((e) => e !== id)
        : prev.length < 4
        ? [...prev, id]
        : prev
    );
  };

  const finish = () => {
    localStorage.setItem("maeum_prefs", JSON.stringify({ emotions, time, mbti, gender, age }));
    router.push("/feed");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[430px] mx-auto px-6">
      <OnboardingProgressBar step={step} total={TOTAL_STEPS} />

      <OnboardingNav
        step={step}
        total={TOTAL_STEPS}
        onBack={() => setStep(step - 1)}
        onSkip={finish}
      />

      {step === 1 && (
        <OnboardingStep1
          emotions={emotions}
          onToggle={toggleEmotion}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <OnboardingStep2
          time={time}
          onSelect={setTime}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <OnboardingStep3
          mbti={mbti}
          gender={gender}
          age={age}
          setMbti={setMbti}
          setGender={setGender}
          setAge={setAge}
          onFinish={finish}
        />
      )}
    </div>
  );
}
