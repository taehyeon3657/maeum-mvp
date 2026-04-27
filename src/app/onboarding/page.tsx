// src/app/onboarding/page.tsx
"use client";

import { useUpdateProfile } from "@/src/hooks/useUser";
import { supabase } from "@/src/lib/supabase";
import { useState } from "react";

export default function OnboardingPage() {
  const updateProfile = useUpdateProfile();
  const [step, setStep] = useState(1);

  // 1단계: 로그인 (Supabase Auth 활용)
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao", // 혹은 'google'
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  // 2단계: 성향 저장 (React Query 활용)
  const handleCompleteOnboarding = async (emotions: string[]) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      updateProfile.mutate(
        {
          id: user.id,
          pref_emotion: emotions,
          // MBTI 등 추가 데이터...
        },
        {
          onSuccess: () => {
            window.location.href = "/feed"; // 성공 시 피드로 이동
          },
        },
      );
    }
  };

  return (
    <div className="flex flex-col p-8 items-center">
      {/* 여기에 틴더 카드 방식이나 버튼 방식의 UI를 구현합니다 */}
      <h2 className="text-2xl font-quote text-textMain mb-10">
        당신의 마음 상태를 알려주세요
      </h2>

      {/* 로그인 전이라면 로그인 버튼, 후라면 성향 선택 UI를 보여줌 */}
      <button
        onClick={handleLogin}
        className="w-full py-4 bg-[#FEE500] text-black rounded-2xl font-bold"
      >
        카카오로 3초만에 시작하기
      </button>
    </div>
  );
}
