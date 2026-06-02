"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/src/lib/supabase";

export default function HomeCTA() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setLoggedIn(true);
    };
    check();
  }, []);

  const handleStart = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    router.push(user ? "/feed" : "/onboarding");
  };

  return (
    <div className="cta-section">
      <button onClick={handleStart} className="cta-primary">
        {loggedIn ? "오늘의 글귀 보러가기" : "내 감정 성향 찾기"}
        <svg className="arrow-icon" viewBox="0 0 18 18" fill="none">
          <path
            d="M3 9H15M15 9L9.5 3.5M15 9L9.5 14.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div style={{ display: "flex", gap: "10px", marginBottom: "22px" }}>
        {loggedIn && (
          <button
            onClick={() => router.push("/collection")}
            style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
              padding: "14px 10px", borderRadius: "14px", border: "1.5px solid rgba(224,122,95,0.25)",
              background: "rgba(255,255,255,0.7)", cursor: "pointer",
              fontFamily: "var(--nsr)", fontSize: "13px", fontWeight: 700,
              color: "var(--rust)", transition: "all 0.2s ease",
            }}
          >
            <span>💛</span> 내 마음함
          </button>
        )}
        <button
          onClick={() => router.push("/insights")}
          style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
            padding: "14px 10px", borderRadius: "14px", border: "1.5px solid rgba(224,122,95,0.25)",
            background: "rgba(255,255,255,0.7)", cursor: "pointer",
            fontFamily: "var(--nsr)", fontSize: "13px", fontWeight: 700,
            color: "var(--rust)", transition: "all 0.2s ease",
          }}
        >
          <span>📊</span> 인사이트
        </button>
      </div>

      {!loggedIn && (
        <p className="disclaimer">
          가입 없이 바로 시작 가능 · 개인정보 안전하게 보호<br />
          언제든 탈퇴 가능
        </p>
      )}
    </div>
  );
}
