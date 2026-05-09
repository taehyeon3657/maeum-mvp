"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmotionGrid from "@/src/components/onboarding/EmotionGrid";
import TimeList from "@/src/components/onboarding/TimeList";
import ProfileForm from "@/src/components/onboarding/ProfileForm";
import { createClient } from "@/src/lib/supabase";

const TOTAL = 3;

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [mbti, setMbti] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // 이미 로그인된 유저는 피드로 바로 이동
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.replace("/feed");
    };
    checkAuth();
  }, [router]);

  const handleEmotionNext = (selectedEmotions: string[]) => {
    setEmotions(selectedEmotions);
    setStep(2);
  };

  const finish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError("");
    const supabase = createClient();

    try {
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
      if (authError) throw authError;

      const user = authData.user;
      if (!user) throw new Error("유저 생성 실패");

      const { error: dbError } = await supabase.from("users").upsert({
        id: user.id,
        pref_emotions: emotions,
        pref_time: time,
        mbti: mbti,
        gender: gender,
        age_group: age,
        onboarded_at: new Date().toISOString(),
      });

      if (dbError) throw dbError;

      localStorage.setItem("maeum_prefs", JSON.stringify({ emotions, time, mbti, gender, age }));
      router.push("/feed");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setSubmitError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[430px] mx-auto px-6">
      {/* 진행 바 */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 max-w-[430px] mx-auto bg-primary/10">
        <div
          className="h-full bg-gradient-to-r from-primary/70 to-primary transition-all duration-500"
          style={{ width: `${(step / TOTAL) * 100}%` }}
        />
      </div>

      {/* 상단 네비게이션 */}
      <div className="pt-10 flex items-center justify-between mb-7">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="w-10 h-10 rounded-full border border-primary/25 bg-surface flex items-center justify-center text-textMain hover:bg-warm transition-colors shadow-sm"
          >
            ←
          </button>
        ) : (
          <div className="w-10 h-10 flex items-center justify-start">
            <span className="font-quote text-lg text-primary font-extrabold">마음</span>
          </div>
        )}
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              className="h-[5px] rounded-full transition-all duration-400"
              style={{
                width: i + 1 === step ? "20px" : "5px",
                backgroundColor: i + 1 <= step ? "#E07A5F" : "rgba(224,122,95,0.15)",
              }}
            />
          ))}
        </div>
        {step === TOTAL ? (
          <button onClick={finish} className="text-textMuted text-sm hover:text-textMain transition-colors">
            건너뛰기
          </button>
        ) : (
          <div className="w-16" />
        )}
      </div>

      {/* STEP 1: 감정 선택 */}
      {step === 1 && (
        <div className="flex flex-col flex-1 min-h-0 animate-fade-in-up">
          <p className="text-primary text-[11px] tracking-[0.18em] mb-3 font-sans uppercase">감정 성향 파악</p>
          <h1 className="font-quote text-[2.2rem] font-light text-textMain leading-snug mb-2">
            지금 당신의<br />
            <span className="text-primary font-extrabold">마음</span>은 어떤가요?
          </h1>
          <p className="text-textMuted text-sm mb-6 font-sans">최대 4개까지 선택할 수 있어요.</p>
          <EmotionGrid onNext={handleEmotionNext} />
        </div>
      )}

      {/* STEP 2: 알림 시간대 */}
      {step === 2 && (
        <div className="flex flex-col flex-1 animate-fade-in-up">
          <p className="text-primary text-[11px] tracking-[0.18em] mb-3 font-sans uppercase">글귀 시간대</p>
          <h2 className="font-quote text-[2.2rem] font-light text-textMain leading-snug mb-2">
            언제 <span className="text-primary font-extrabold">글귀</span>가<br />생각나세요?
          </h2>
          <p className="text-textMuted text-sm mb-7 font-sans">선택한 시간에 맞춰 보내드려요.</p>

          <TimeList selected={time} onSelect={setTime} />

          <button
            type="button"
            disabled={time === ""}
            onClick={() => setStep(3)}
            className={`
              w-full py-[18px] rounded-2xl font-sans text-sm font-semibold tracking-wider mt-auto mb-8 transition-all duration-300
              ${time === ""
                ? "bg-warm text-textMuted/50 cursor-not-allowed"
                : "bg-primary text-white shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98]"
              }
            `}
          >
            다음 →
          </button>
        </div>
      )}

      {/* STEP 3: 추가 정보 */}
      {step === 3 && (
        <div className="flex flex-col flex-1 overflow-y-auto animate-fade-in-up">
          <p className="text-primary text-[11px] tracking-[0.18em] mb-3 font-sans uppercase">맞춤 추천 강화</p>
          <h2 className="font-quote text-[2rem] font-light text-textMain leading-snug mb-2">
            딱 맞는<br />
            <span className="text-primary font-extrabold">글귀</span>를<br />
            준비할게요 ✦
          </h2>
          <p className="text-textMuted text-sm mb-7 font-sans">모두 선택 사항이에요.</p>

          <ProfileForm
            mbti={mbti} gender={gender} age={age}
            setMbti={setMbti} setGender={setGender} setAge={setAge}
          />

          {submitError && (
            <p className="font-sans text-xs text-rose-500 text-center mb-3 px-2">
              {submitError}
            </p>
          )}
          <button
            type="button"
            onClick={finish}
            disabled={isSubmitting}
            className={`w-full py-[18px] rounded-2xl font-sans text-sm font-semibold tracking-wider shadow-lg shadow-primary/25 transition-all mb-8 ${
              isSubmitting
                ? "bg-warm text-textMuted/50 cursor-not-allowed"
                : "bg-primary text-white hover:opacity-90 active:scale-[0.98]"
            }`}
          >
            {isSubmitting ? "시작하는 중..." : "나만의 피드 시작하기 ✦"}
          </button>
        </div>
      )}
    </div>
  );
}