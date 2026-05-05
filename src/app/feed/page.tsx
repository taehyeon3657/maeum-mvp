"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase";
import { loadPrefsLocally } from "@/src/models/onboarding";
import FeedStack from "@/src/components/feed/FeedStack";

export default function FeedPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [prefEmotions, setPrefEmotions] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/onboarding");
        return;
      }

      setUserId(user.id);

      // localStorage에서 감정 선호도 로드 (빠른 초기화)
      const prefs = loadPrefsLocally();
      if (prefs?.pref_emotions) setPrefEmotions(prefs.pref_emotions);
    };

    init();
  }, [router]);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-quote text-2xl text-textMuted animate-pulse">마음을 여는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-center px-6 pt-10 pb-2">
        <h1 className="font-quote text-2xl text-primary italic tracking-wide">마음</h1>
      </header>

      {/* 카드 스택 */}
      <FeedStack userId={userId} prefEmotions={prefEmotions} />

      {/* 하단 힌트 */}
      <div className="flex justify-center gap-8 pb-8 pt-2">
        <span className="font-sans text-xs text-textMuted">← 넘길게요</span>
        <span className="font-sans text-xs text-textMuted">좋아요 →</span>
      </div>
    </div>
  );
}
