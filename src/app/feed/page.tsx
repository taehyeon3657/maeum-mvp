"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase";
import FeedStack from "@/src/components/feed/FeedStack";

export default function FeedPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/onboarding"); return; }
      setUserId(user.id);
    };
    init();
  }, [router]);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
            <div className="absolute inset-3 rounded-full bg-primary/20" />
          </div>
          <p className="font-quote text-xl text-textMuted animate-pulse">마음을 여는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background max-w-[430px] mx-auto">
      {/* 헤더 */}
      <header className="flex items-center justify-center px-6 pt-12 pb-3">
        <div className="flex flex-col items-center gap-0.5">
          <h1 className="font-quote text-[1.6rem] text-primary italic tracking-[0.12em]">마음</h1>
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-primary/20" />
            <span className="font-sans text-[10px] text-textMuted/60 tracking-[0.2em]">MAEUM</span>
            <div className="h-px w-8 bg-primary/20" />
          </div>
        </div>
      </header>

      {/* 카드 스택 */}
      <FeedStack userId={userId} />
    </div>
  );
}
