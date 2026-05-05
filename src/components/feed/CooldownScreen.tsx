"use client";

import { formatCountdown } from "@/src/hooks/useFeedCooldown";

interface Props {
  remainingMs: number;
  onResume: () => void;
}

export default function CooldownScreen({ remainingMs, onResume }: Props) {
  const isDone = remainingMs === 0;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-10 text-center">
      <div className="text-6xl">{isDone ? "🌸" : "🌙"}</div>

      {isDone ? (
        <>
          <p className="font-quote text-3xl text-textMain leading-snug">
            새 글귀가<br />
            <em className="text-primary italic">도착했어요</em> ✦
          </p>
          <p className="font-sans text-sm text-textMuted">
            오늘도 마음을 채울 준비가 됐어요.
          </p>
          <button
            onClick={onResume}
            className="mt-2 px-8 py-4 rounded-2xl bg-primary text-white font-sans text-sm font-semibold tracking-wider shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            만나러 가기 →
          </button>
        </>
      ) : (
        <>
          <p className="font-quote text-3xl text-textMain leading-snug">
            오늘의 글귀를<br />모두 만났어요
          </p>
          <p className="font-sans text-sm text-textMuted leading-relaxed">
            마음에 새길 시간이 필요해요. 🌿<br />
            잠시 후 새 글귀가 찾아올 거예요.
          </p>

          {/* 카운트다운 */}
          <div className="flex flex-col items-center gap-1 px-6 py-4 rounded-2xl bg-warm border border-primary/10">
            <p className="font-sans text-xs text-textMuted tracking-wider">다음 글귀까지</p>
            <p className="font-quote text-3xl text-primary tabular-nums">
              {formatCountdown(remainingMs)}
            </p>
          </div>

          <p className="font-sans text-xs text-textMuted">
            1시간 뒤에 또 보러오세요 💛
          </p>
        </>
      )}
    </div>
  );
}
