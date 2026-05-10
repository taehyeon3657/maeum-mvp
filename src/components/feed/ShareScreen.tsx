"use client";

import { useState, useEffect } from "react";

interface Props {
  sessionDurationMs: number;
  onContinue: () => void;
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m > 0 && s > 0) return `${m}분 ${s}초`;
  if (m > 0) return `${m}분`;
  if (s > 0) return `${s}초`;
  return "잠깐";
}

export default function ShareScreen({ sessionDurationMs, onContinue }: Props) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");
  const [shareState, setShareState] = useState<"idle" | "done">("idle");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shareUrl = mounted ? window.location.origin : "";
  const shareText = "오늘 마음에서 10개의 글귀를 만났어요 ✨\n글귀 한 장으로 마음을 채워보세요.";
  const shareTitle = "마음 — 글귀 한 장으로 마음을 채워요";

  const canNativeShare =
    mounted &&
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function";

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      setShareState("done");
    } catch {
      // user cancelled — no-op
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2500);
    }
  };

  const duration = formatDuration(sessionDurationMs);

  return (
    <div className="flex-1 flex flex-col items-center px-6 pt-8 pb-8 animate-fade-in overflow-y-auto min-h-0">
      {/* 파티클 효과 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="share-particle"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              background: p.color,
              animationDelay: p.delay,
              animationDuration: p.dur,
              borderRadius: p.round ? "50%" : "2px",
            }}
          />
        ))}
      </div>

      {/* 완료 아이콘 */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center share-icon-pop">
          <span className="text-4xl select-none">✨</span>
        </div>
        <div
          className="absolute inset-0 rounded-full border border-primary/25"
          style={{ animation: "sharePing 2s ease-out infinite" }}
        />
      </div>

      {/* 타이틀 */}
      <div className="flex flex-col items-center gap-2 mb-5 text-center">
        <p className="font-quote text-[1.85rem] text-textMain leading-snug">
          오늘의 글귀를<br />
          <span className="text-primary font-extrabold">모두 읽었어요</span>
          <span className="text-primary/50"> ✦</span>
        </p>
        <p className="font-sans text-sm text-textMuted leading-relaxed">
          마음을 채우는 데{" "}
          <span className="font-semibold text-textMain">{duration}</span>
          를 함께했어요.
        </p>
      </div>

      {/* 세션 타이머 뱃지 */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-warm border border-primary/15 mb-7">
        <span className="text-sm">⏱</span>
        <span className="font-sans text-[12px] text-textMuted tracking-wide">
          오늘 독서 시간
        </span>
        <span className="font-quote text-sm text-primary font-bold">
          {duration}
        </span>
      </div>

      {/* 공유 섹션 */}
      <div className="w-full flex flex-col gap-3 mb-5">
        <p className="font-sans text-[11px] text-textMuted/70 text-center tracking-[0.15em] uppercase">
          마음을 나누고 싶다면
        </p>

        {/* 미리보기 카드 */}
        <div className="w-full rounded-2xl bg-warm border border-primary/12 px-5 py-4 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-quote text-primary font-extrabold text-base tracking-wider">마음</span>
            <div className="h-px flex-1 bg-primary/15" />
            <span className="font-sans text-[10px] text-textMuted/60 tracking-widest">MAEUM</span>
          </div>
          <p className="font-sans text-[12px] text-textMuted leading-relaxed">
            글귀 한 장으로 마음을 채워보세요 ✨
          </p>
          <p className="font-sans text-[11px] text-primary/70 truncate">{shareUrl}</p>
        </div>

        {/* 공유 버튼들 */}
        <div className="flex gap-2.5">
          {/* 링크 복사 */}
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border transition-all active:scale-[0.97]"
            style={{
              background: copyState === "copied" ? "rgba(224,122,95,0.1)" : "white",
              borderColor: copyState === "copied" ? "#E07A5F" : "rgba(224,122,95,0.2)",
              color: copyState === "copied" ? "#E07A5F" : "#868e96",
            }}
          >
            <span className="text-base">
              {copyState === "copied" ? "✓" : copyState === "error" ? "✕" : "🔗"}
            </span>
            <span className="font-sans text-xs font-semibold tracking-wide">
              {copyState === "copied" ? "복사됨!" : copyState === "error" ? "실패" : "링크 복사"}
            </span>
          </button>

          {/* 네이티브 공유 (모바일) 또는 텍스트 복사 */}
          {canNativeShare ? (
            <button
              onClick={handleNativeShare}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl transition-all active:scale-[0.97]"
              style={{
                background: shareState === "done" ? "#E07A5F" : "rgba(224,122,95,0.08)",
                color: shareState === "done" ? "white" : "#E07A5F",
              }}
            >
              <span className="text-base">{shareState === "done" ? "✓" : "↗"}</span>
              <span className="font-sans text-xs font-semibold tracking-wide">
                {shareState === "done" ? "공유됨!" : "공유하기"}
              </span>
            </button>
          ) : (
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
                  setShareState("done");
                  setTimeout(() => setShareState("idle"), 2500);
                } catch {
                  // no-op
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl transition-all active:scale-[0.97]"
              style={{
                background: shareState === "done" ? "#E07A5F" : "rgba(224,122,95,0.08)",
                color: shareState === "done" ? "white" : "#E07A5F",
              }}
            >
              <span className="text-base">{shareState === "done" ? "✓" : "📋"}</span>
              <span className="font-sans text-xs font-semibold tracking-wide">
                {shareState === "done" ? "복사됨!" : "문구 복사"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 인사이트 배너 */}
      <div
        className="w-full rounded-2xl px-4 py-3.5 mb-5 flex items-center gap-3 active:scale-[0.98] transition-all cursor-pointer"
        style={{ background: "linear-gradient(120deg, rgba(224,122,95,0.10) 0%, rgba(45,106,79,0.08) 100%)", border: "1px solid rgba(224,122,95,0.18)" }}
        onClick={() => (window.location.href = "/insights")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && (window.location.href = "/insights")}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-none"
          style={{ background: "rgba(224,122,95,0.12)" }}>
          <span className="text-lg">📊</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[12px] font-bold text-textMain leading-tight">모두의 취향 인사이트 보기</p>
          <p className="font-sans text-[10px] text-textMuted leading-tight mt-0.5">연령·성별·MBTI·카테고리·시간대 분석</p>
        </div>
        <span className="text-primary text-base flex-none">→</span>
      </div>

      {/* 구분선 */}
      <div className="w-full flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-primary/10" />
        <span className="font-sans text-[10px] text-textMuted/50 tracking-widest">또는</span>
        <div className="flex-1 h-px bg-primary/10" />
      </div>

      {/* 계속하기 버튼 */}
      <button
        onClick={onContinue}
        className="w-full py-4 rounded-2xl bg-primary text-white font-sans text-sm font-semibold tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.97] transition-all"
      >
        잠시 쉬어갈게요 🌙
      </button>

      <p className="font-sans text-[11px] text-textMuted/50 mt-3 tracking-wide">
        1시간 뒤 새 글귀가 도착해요
      </p>
    </div>
  );
}

// 파티클 데이터 (정적으로 미리 계산)
const PARTICLES = [
  { x: "12%", y: "8%",  size: "6px",  color: "#e07a5f", delay: "0s",    dur: "3.5s", round: true  },
  { x: "80%", y: "5%",  size: "4px",  color: "#f4a261", delay: "0.3s",  dur: "4s",   round: false },
  { x: "25%", y: "15%", size: "5px",  color: "#2d6a4f", delay: "0.6s",  dur: "3.8s", round: true  },
  { x: "65%", y: "12%", size: "7px",  color: "#e07a5f", delay: "0.2s",  dur: "4.2s", round: false },
  { x: "45%", y: "3%",  size: "4px",  color: "#f4a261", delay: "0.8s",  dur: "3.6s", round: true  },
  { x: "88%", y: "20%", size: "5px",  color: "#2d6a4f", delay: "0.4s",  dur: "4.5s", round: false },
  { x: "5%",  y: "25%", size: "4px",  color: "#e07a5f", delay: "1s",    dur: "3.2s", round: true  },
  { x: "90%", y: "40%", size: "6px",  color: "#f4a261", delay: "0.5s",  dur: "4s",   round: true  },
  { x: "15%", y: "45%", size: "3px",  color: "#2d6a4f", delay: "1.2s",  dur: "3.7s", round: false },
  { x: "70%", y: "8%",  size: "5px",  color: "#e07a5f", delay: "0.7s",  dur: "4.3s", round: true  },
];
