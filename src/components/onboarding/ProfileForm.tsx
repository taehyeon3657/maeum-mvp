/* src/components/onboarding/ProfileForm.tsx */
"use client";

import { MBTI_LIST, GENDER_OPTIONS, AGE_OPTIONS } from "@/src/models/onboarding";

interface Props {
  mbti:      string;
  gender:    string;
  age:       string;
  setMbti:   (v: string) => void;
  setGender: (v: string) => void;
  setAge:    (v: string) => void;
}

function OptBadge() {
  return (
    <span className="bg-textMuted/10 rounded-md px-2 py-0.5 text-[9.5px] text-textMuted
      not-italic tracking-widest align-middle">
      선택
    </span>
  );
}

export default function ProfileForm({ mbti, gender, age, setMbti, setGender, setAge }: Props) {
  return (
    <>
      {/* ── MBTI ── */}
      <div className="mb-6">
        <p className="font-quote text-[15px] text-textMain font-semibold leading-relaxed mb-3 flex flex-wrap items-center gap-2">
          더 정확한 추천을 위해 MBTI를 알려주시겠어요?
          <OptBadge />
        </p>
        <div className="grid grid-cols-4 gap-[6px]">
          {MBTI_LIST.map((m) => {
            const isOn = mbti === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMbti(isOn ? "" : m)}
                className={[
                  "py-[9px] rounded-[10px] border font-quote text-[13px]",
                  "text-center tracking-wider transition-all duration-200 outline-none cursor-pointer",
                  isOn
                    ? "border-primary bg-primary/10 text-textMain font-medium"
                    : "border-primary/20 bg-surface text-textMuted hover:border-primary/40 hover:bg-warm hover:text-textMain",
                ].join(" ")}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-primary/20 my-5" />

      {/* ── 성별 + 연령대 ── */}
      <div className="mb-6">
        <p className="font-quote text-[15px] text-textMain font-semibold leading-relaxed mb-3 flex flex-wrap items-center gap-2">
          더 정확한 분석을 위해 성별과 연령대도 알려주시면 좋아요
          <OptBadge />
        </p>

        {/* 성별 */}
        <div className="flex flex-wrap gap-2 mb-2">
          {GENDER_OPTIONS.map((g) => {
            const isOn = gender === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setGender(isOn ? "" : g)}
                className={[
                  "px-4 py-2 rounded-full border font-sans text-[12.5px]",
                  "transition-all duration-200 outline-none cursor-pointer",
                  isOn
                    ? "border-primary bg-primary/10 text-textMain"
                    : "border-primary/20 bg-surface text-textMuted hover:border-primary/40 hover:bg-warm hover:text-textMain",
                ].join(" ")}
              >
                {g}
              </button>
            );
          })}
        </div>

        {/* 연령대 */}
        <div className="flex flex-wrap gap-2">
          {AGE_OPTIONS.map((a) => {
            const isOn = age === a;
            return (
              <button
                key={a}
                type="button"
                onClick={() => setAge(isOn ? "" : a)}
                className={[
                  "px-4 py-2 rounded-full border font-sans text-[12.5px]",
                  "transition-all duration-200 outline-none cursor-pointer",
                  isOn
                    ? "border-primary bg-primary/10 text-textMain"
                    : "border-primary/20 bg-surface text-textMuted hover:border-primary/40 hover:bg-warm hover:text-textMain",
                ].join(" ")}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}