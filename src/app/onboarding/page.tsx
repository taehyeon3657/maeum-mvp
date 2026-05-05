"use client";

import { useState } from "react";
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

  const handleEmotionNext = (selectedEmotions: string[]) => {
    setEmotions(selectedEmotions);
    setStep(2);
  };

const finish = async () => {
  const supabase = createClient();

  try {
    // 1. 익명 로그인 실행 (사용자에게 아무것도 묻지 않고 즉시 유저 생성 및 세션 발급)
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously();

    // 만약 422 에러가 여전히 뜬다면 대시보드에서 Anonymous 기능을 켰는지 다시 확인하세요.
    if (authError) throw authError;

    const user = authData.user;
    if (!user) throw new Error("유저 생성 실패");

    // 2. 생성된 유저의 ID를 사용하여 users 테이블에 데이터 넣기
    // .upsert()는 해당 ID가 있으면 업데이트, 없으면 삽입합니다.
    const { error: dbError } = await supabase
      .from("users")
      .upsert({
        id: user.id,              // Auth에서 생성된 고유 UUID
        pref_emotions: emotions,
        pref_time: time,
        mbti: mbti,
        gender: gender,
        age_group: age,
        onboarded_at: new Date().toISOString(),
      });

    if (dbError) throw dbError;

    // 3. 로컬 스토리지 저장 및 이동
    localStorage.setItem("maeum_prefs", JSON.stringify({ emotions, time, mbti, gender, age }));
    router.push("/feed");

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    alert("오류가 발생했습니다: " + message);
  }
};

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[430px] mx-auto px-6">
      {/* 진행바 */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-primary/20 z-50 max-w-[430px] mx-auto">
        <div 
          className="h-full bg-primary transition-all duration-500" 
          style={{ width: `${(step / TOTAL) * 100}%` }} 
        />
      </div>

      {/* 상단 네비게이션 */}
      <div className="pt-8 flex items-center justify-between mb-6">
        {step > 1 ? (
          <button onClick={() => setStep(step - 1)} className="w-10 h-10 rounded-full border border-primary/30 bg-surface flex items-center justify-center text-textMain hover:bg-warm transition-colors">←</button>
        ) : (
          <div className="w-10" />
        )}
        <span className="text-textMuted text-sm">{step} / {TOTAL}</span>
        {step === TOTAL ? (
          <button onClick={finish} className="text-textMuted text-sm hover:text-textMain transition-colors">건너뛰기</button>
        ) : (
          <div className="w-16" />
        )}
      </div>

      {/* STEP 1: 감정 선택 */}
      {step === 1 && (
        <div className="flex flex-col flex-1 min-h-0"> 
          <p className="text-primary text-xs tracking-widest mb-4 font-sans">감정 성향 파악</p>
          <h1 className="font-quote text-4xl font-light text-textMain leading-snug mb-2">
            지금 당신의<br />
            <em className="text-primary italic">마음</em>은 어떤가요?
          </h1>
          <p className="text-textMuted text-sm mb-8 font-sans">최대 4개까지 선택할 수 있어요.</p>
          <EmotionGrid onNext={handleEmotionNext} />
        </div>
      )}

      {/* STEP 2: 알림 시간대 */}
      {step === 2 && (
        <div className="flex flex-col flex-1">
          <p className="text-primary text-xs tracking-widest mb-4 font-sans">알림 시간대</p>
          <h2 className="font-quote text-4xl font-light text-textMain leading-snug mb-2">
            언제 <em className="text-primary italic">글귀</em>가<br />생각나세요?
          </h2>
          <p className="text-textMuted text-sm mb-8 font-sans">원하는 시간대에 매일 글귀를 보내드려요.</p>

          <TimeList selected={time} onSelect={setTime} />

          {/* 스타일 수정된 STEP 2 버튼 */}
          <button
            type="button"
            disabled={time === ""}
            onClick={() => setStep(3)}
            className={`
              w-full py-5 rounded-2xl font-sans text-sm font-semibold tracking-wider mt-auto mb-8 transition-all duration-300
              ${time === "" 
                ? "bg-[#F2F2F2] text-[#BCBCBC] cursor-not-allowed" 
                : "bg-primary text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98]"
              }
            `}
          >
            다음 →
          </button>
        </div>
      )}

      {/* STEP 3: 추가 정보 */}
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

          {/* 스타일 수정된 STEP 3 완료 버튼 (활성화 상태로 고정) */}
          <button
            type="button"
            onClick={finish}
            className="w-full py-5 rounded-2xl bg-primary text-white font-sans text-sm font-semibold tracking-wider hover:opacity-90 active:scale-[0.98] shadow-lg shadow-primary/20 transition-all mb-8"
          >
            나만의 피드 시작하기 ✦
          </button>
        </div>
      )}
    </div>
  );
}