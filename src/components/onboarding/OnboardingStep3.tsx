"use client";

import ProfileForm from "./ProfileForm";

interface Props {
  mbti: string;
  gender: string;
  age: string;
  setMbti: (v: string) => void;
  setGender: (v: string) => void;
  setAge: (v: string) => void;
  onFinish: () => void;
}

export default function OnboardingStep3({
  mbti, gender, age, setMbti, setGender, setAge, onFinish,
}: Props) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <p className="text-primary text-xs tracking-widest mb-4 font-sans">맞춤 추천 강화</p>
      <h2 className="font-quote text-3xl font-light text-textMain leading-snug mb-2">
        선택하신 감정에<br />
        딱 맞는 <em className="text-primary italic">글귀</em>를<br />
        준비했어요! 🎉
      </h2>
      <p className="text-textMuted text-sm mb-8 font-sans">모두 선택 사항이에요.</p>

      <ProfileForm
        mbti={mbti}
        gender={gender}
        age={age}
        setMbti={setMbti}
        setGender={setGender}
        setAge={setAge}
      />

      <button
        type="button"
        onClick={onFinish}
        className="w-full py-5 rounded-2xl bg-textMain text-background font-sans
          text-sm tracking-wider hover:opacity-90 transition-all mb-8"
      >
        나만의 피드 시작하기 ✦
      </button>
    </div>
  );
}
