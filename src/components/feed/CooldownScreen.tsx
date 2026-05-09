"use client";

import { formatCountdown } from "@/src/hooks/useFeedCooldown";

interface Props {
  remainingMs: number;
  onResume: () => void;
}

export default function CooldownScreen({ remainingMs, onResume }: Props) {
  const isDone = remainingMs === 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-7 px-10 text-center animate-fade-in">
      {isDone ? (
        <>
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-4xl">🌸</span>
              </div>
              <div className="absolute -inset-1 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: "2.5s" }} />
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-quote text-[1.9rem] text-textMain leading-snug">
                새 글귀가<br />
                <span className="text-primary font-extrabold">도착했어요</span>
                <span className="text-primary/60"> ✦</span>
              </p>
              <p className="font-sans text-sm text-textMuted leading-relaxed">
                오늘도 마음을 채울 준비가 됐어요.
              </p>
            </div>
          </div>

          <button
            onClick={onResume}
            className="px-10 py-4 rounded-2xl bg-primary text-white font-sans text-sm font-semibold tracking-widest shadow-xl shadow-primary/25 hover:opacity-90 active:scale-[0.97] transition-all"
          >
            만나러 가기 →
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-warm border border-primary/15 flex items-center justify-center">
              <span className="text-4xl">🌙</span>
            </div>

            <div className="flex flex-col gap-2">
              <p className="font-quote text-[1.9rem] text-textMain leading-snug">
                오늘의 글귀를<br />모두 만났어요
              </p>
              <p className="font-sans text-sm text-textMuted leading-relaxed">
                마음에 새길 시간이 필요해요. 🌿<br />
                잠시 후 새 글귀가 찾아올 거예요.
              </p>
            </div>
          </div>

          {/* 카운트다운 */}
          <div className="flex flex-col items-center gap-1.5 w-full px-4 py-5 rounded-2xl bg-warm border border-primary/12">
            <p className="font-sans text-[11px] text-textMuted tracking-[0.15em] uppercase">
              다음 글귀까지
            </p>
            <p className="font-quote text-4xl text-primary tabular-nums">
              {formatCountdown(remainingMs)}
            </p>
            <div className="w-12 h-px bg-primary/15 mt-1" />
          </div>

          <p className="font-sans text-xs text-textMuted/70 tracking-wide">
            1시간 뒤에 또 보러오세요 💛
          </p>
        </>
      )}
    </div>
  );
}
