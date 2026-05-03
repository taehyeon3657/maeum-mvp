"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EmotionGrid from "@/src/components/onboarding/EmotionGrid";
import TimeList from "@/src/components/onboarding/TimeList";
import ProfileForm from "@/src/components/onboarding/ProfileForm";

const TOTAL = 3;

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep]         = useState(1);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [time, setTime]         = useState("");
  const [mbti, setMbti]         = useState("");
  const [gender, setGender]     = useState("");
  const [age, setAge]           = useState("");

  const toggleEmotion = (id: string) =>
    setEmotions((prev) =>
      prev.includes(id)
        ? prev.filter((e) => e !== id)
        : prev.length < 4 ? [...prev, id] : prev
    );

  const finish = () => {
    localStorage.setItem("maeum_prefs", JSON.stringify({ emotions, time, mbti, gender, age }));
    router.push("/feed");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[430px] mx-auto px-6">

      {/* 진행바 */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-primary/20 z-50 max-w-[430px] mx-auto">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / TOTAL) * 100}%` }} />
      </div>

      {/* 상단 네비 */}
      <div className="pt-8 flex items-center justify-between mb-6">
        {step > 1
          ? <button onClick={() => setStep(step - 1)} className="w-10 h-10 rounded-full border border-primary/30 bg-surface flex items-center justify-center text-textMain hover:bg-warm transition-colors">←</button>
          : <div className="w-10" />
        }
        <span className="text-textMuted text-sm">{step} / {TOTAL}</span>
        {step === TOTAL
          ? <button onClick={finish} className="text-textMuted text-sm hover:text-textMain transition-colors">건너뛰기</button>
          : <div className="w-16" />
        }
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="flex flex-col flex-1">
          <p className="text-primary text-xs tracking-widest mb-4 font-sans">감정 성향 파악</p>
          <h1 className="font-quote text-4xl font-light text-textMain leading-snug mb-2">
            지금 당신의<br />
            <em className="text-primary italic">마음</em>은 어떤가요?
          </h1>
          <p className="text-textMuted text-sm mb-8 font-sans">최대 4개까지 선택할 수 있어요.</p>

          <EmotionGrid selected={emotions} onToggle={toggleEmotion} />

          <button
            type="button"
            disabled={emotions.length === 0}
            onClick={() => setStep(2)}
            className="w-full py-5 rounded-2xl font-sans text-sm tracking-wider mt-auto mb-8 transition-all
              disabled:bg-warm disabled:text-textMuted disabled:cursor-not-allowed
              enabled:bg-textMain enabled:text-background enabled:hover:opacity-90"
          >
            다음 →
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="flex flex-col flex-1">
          <p className="text-primary text-xs tracking-widest mb-4 font-sans">알림 시간대</p>
          <h2 className="font-quote text-4xl font-light text-textMain leading-snug mb-2">
            언제 <em className="text-primary italic">글귀</em>가<br />생각나세요?
          </h2>
          <p className="text-textMuted text-sm mb-8 font-sans">원하는 시간대에 매일 글귀를 보내드려요.</p>

          <TimeList selected={time} onSelect={setTime} />

          <button
            type="button"
            disabled={time === ""}
            onClick={() => setStep(3)}
            className="w-full py-5 rounded-2xl font-sans text-sm tracking-wider mt-auto mb-8 transition-all
              disabled:bg-warm disabled:text-textMuted disabled:cursor-not-allowed
              enabled:bg-textMain enabled:text-background enabled:hover:opacity-90"
          >
            다음 →
          </button>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="flex flex-col flex-1 overflow-y-auto">
          <p className="text-primary text-xs tracking-widest mb-4 font-sans">맞춤 추천 강화</p>
          <h2 className="font-quote text-3xl font-light text-textMain leading-snug mb-2">
            선택하신 감정에<br />
            딱 맞는 <em className="text-primary italic">글귀</em>를<br />
            준비했어요! 🎉
          </h2>
          <p className="text-textMuted text-sm mb-8 font-sans">모두 선택 사항이에요.</p>

          <ProfileForm
            mbti={mbti} gender={gender} age={age}
            setMbti={setMbti} setGender={setGender} setAge={setAge}
          />

          <button
            type="button"
            onClick={finish}
            className="w-full py-5 rounded-2xl bg-textMain text-background font-sans text-sm tracking-wider hover:opacity-90 transition-all mb-8"
          >
            나만의 피드 시작하기 ✦
          </button>
        </div>
      )}
    </div>
  );
}
