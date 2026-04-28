"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EMOTIONS = [
  { id: "comfort",    emoji: "🤍", label: "위로받고 싶어"  },
  { id: "motivation", emoji: "🔥", label: "동기가 필요해"  },
  { id: "rest",       emoji: "🌿", label: "그냥 쉬고 싶어" },
  { id: "growth",     emoji: "✨", label: "성장하고 싶어"  },
];

const TIMES = [
  { id: "morning", emoji: "🌅", label: "아침에 일어날 때" },
  { id: "hard",    emoji: "💧", label: "힘든 순간"        },
  { id: "night",   emoji: "🌙", label: "자기 전"          },
  { id: "anytime", emoji: "☁️", label: "특별히 없어"      },
];

const MBTIS = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
];

const GENDERS = ["남성", "여성", "기타"];
const AGES    = ["10대", "20대", "30대", "40대", "50대 이상"];

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep]         = useState(1);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [time, setTime]         = useState("");
  const [mbti, setMbti]         = useState("");
  const [gender, setGender]     = useState("");
  const [age, setAge]           = useState("");

  const toggleEmotion = (id: string) => {
    setEmotions((prev) =>
      prev.includes(id)
        ? prev.filter((e) => e !== id)
        : prev.length < 4
        ? [...prev, id]
        : prev
    );
  };

  const finish = () => {
    localStorage.setItem("maeum_prefs", JSON.stringify({ emotions, time, mbti, gender, age }));
    router.push("/feed");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[430px] mx-auto px-6">

      {/* 진행바 */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-primary/20 z-50 max-w-[430px] mx-auto">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* 상단 네비 */}
      <div className="pt-8 flex items-center justify-between mb-6">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="w-10 h-10 rounded-full border border-primary/30 bg-surface
              flex items-center justify-center text-textMain hover:bg-warm transition-colors"
          >
            ←
          </button>
        ) : <div className="w-10" />}

        <span className="text-textMuted text-sm">{step} / 3</span>

        {step === 3 ? (
          <button onClick={finish} className="text-textMuted text-sm hover:text-textMain transition-colors">
            건너뛰기
          </button>
        ) : <div className="w-16" />}
      </div>

      {/* ── STEP 1: 감정 ── */}
      {step === 1 && (
        <div className="flex flex-col flex-1">
          <p className="text-primary text-xs tracking-widest mb-4 font-sans">감정 성향 파악</p>
          <h1 className="font-quote text-4xl font-light text-textMain leading-snug mb-2">
            지금 당신의<br />
            <em className="text-primary italic">마음</em>은 어떤가요?
          </h1>
          <p className="text-textMuted text-sm mb-8 font-sans">최대 4개까지 선택할 수 있어요.</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {EMOTIONS.map((opt) => {
              const on = emotions.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleEmotion(opt.id)}
                  className={`
                    flex flex-col items-start p-5 rounded-2xl border-[1.5px]
                    cursor-pointer transition-all duration-200 text-left
                    ${on
                      ? "border-primary bg-primary/10"
                      : "border-primary/25 bg-surface hover:bg-warm"
                    }
                  `}
                >
                  <span className="text-3xl mb-3 leading-none">{opt.emoji}</span>
                  <span className="text-textMain text-sm font-sans leading-snug">{opt.label}</span>
                  {on && (
                    <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary
                      flex items-center justify-center text-white text-xs">✓</span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-center text-textMuted text-xs mb-6 font-sans">
            <span className="text-primary text-sm font-quote italic">{emotions.length}</span> / 4개 선택
          </p>

          <button
            type="button"
            disabled={emotions.length === 0}
            onClick={() => setStep(2)}
            className="w-full py-5 rounded-2xl font-sans text-sm tracking-wider mt-auto mb-8
              disabled:bg-warm disabled:text-textMuted disabled:cursor-not-allowed
              enabled:bg-textMain enabled:text-background enabled:hover:opacity-90 transition-all"
          >
            다음 →
          </button>
        </div>
      )}

      {/* ── STEP 2: 시간대 ── */}
      {step === 2 && (
        <div className="flex flex-col flex-1">
          <p className="text-primary text-xs tracking-widest mb-4 font-sans">알림 시간대</p>
          <h2 className="font-quote text-4xl font-light text-textMain leading-snug mb-2">
            언제 <em className="text-primary italic">글귀</em>가<br />생각나세요?
          </h2>
          <p className="text-textMuted text-sm mb-8 font-sans">원하는 시간대에 매일 글귀를 보내드려요.</p>

          <div className="flex flex-col gap-3 mb-8">
            {TIMES.map((opt) => {
              const on = time === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTime(opt.id)}
                  className={`
                    flex items-center gap-4 px-5 py-4 rounded-2xl border-[1.5px]
                    cursor-pointer transition-all duration-200 text-left w-full
                    ${on
                      ? "border-primary bg-primary/5"
                      : "border-primary/25 bg-surface hover:bg-warm"
                    }
                  `}
                >
                  <span className="text-2xl w-8 text-center shrink-0">{opt.emoji}</span>
                  <span className="text-textMain text-sm font-sans">{opt.label}</span>
                  <span className={`ml-auto w-5 h-5 rounded-full border-[1.5px] shrink-0
                    flex items-center justify-center transition-all
                    ${on ? "border-primary bg-primary" : "border-primary/30"}`}>
                    {on && <span className="w-2 h-2 rounded-full bg-white block" />}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={time === ""}
            onClick={() => setStep(3)}
            className="w-full py-5 rounded-2xl font-sans text-sm tracking-wider mt-auto mb-8
              disabled:bg-warm disabled:text-textMuted disabled:cursor-not-allowed
              enabled:bg-textMain enabled:text-background enabled:hover:opacity-90 transition-all"
          >
            다음 →
          </button>
        </div>
      )}

      {/* ── STEP 3: 프로필 ── */}
      {step === 3 && (
        <div className="flex flex-col flex-1 overflow-y-auto">
          <p className="text-primary text-xs tracking-widest mb-4 font-sans">맞춤 추천 강화</p>
          <h2 className="font-quote text-3xl font-light text-textMain leading-snug mb-2">
            선택하신 감정에<br />
            딱 맞는 <em className="text-primary italic">글귀</em>를<br />
            준비했어요! 🎉
          </h2>
          <p className="text-textMuted text-sm mb-8 font-sans">모두 선택 사항이에요.</p>

          {/* MBTI */}
          <p className="font-quote italic text-textMain text-sm mb-3">
            MBTI를 알려주시겠어요?{" "}
            <span className="not-italic text-[10px] text-textMuted bg-textMuted/10 rounded px-1.5 py-0.5">선택</span>
          </p>
          <div className="grid grid-cols-4 gap-1.5 mb-6">
            {MBTIS.map((m) => {
              const on = mbti === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMbti(on ? "" : m)}
                  className={`py-2 rounded-xl border text-xs font-sans tracking-wider
                    cursor-pointer transition-all duration-150
                    ${on
                      ? "border-primary bg-primary/10 text-textMain font-medium"
                      : "border-primary/20 bg-surface text-textMuted hover:bg-warm"
                    }`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          <div className="h-px bg-primary/20 my-4" />

          {/* 성별 + 연령 */}
          <p className="font-quote italic text-textMain text-sm mb-3">
            성별과 연령대도 알려주시면 좋아요{" "}
            <span className="not-italic text-[10px] text-textMuted bg-textMuted/10 rounded px-1.5 py-0.5">선택</span>
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {GENDERS.map((g) => {
              const on = gender === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(on ? "" : g)}
                  className={`px-4 py-2 rounded-full border text-xs font-sans
                    cursor-pointer transition-all duration-150
                    ${on
                      ? "border-primary bg-primary/10 text-textMain"
                      : "border-primary/20 bg-surface text-textMuted hover:bg-warm"
                    }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {AGES.map((a) => {
              const on = age === a;
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAge(on ? "" : a)}
                  className={`px-4 py-2 rounded-full border text-xs font-sans
                    cursor-pointer transition-all duration-150
                    ${on
                      ? "border-primary bg-primary/10 text-textMain"
                      : "border-primary/20 bg-surface text-textMuted hover:bg-warm"
                    }`}
                >
                  {a}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={finish}
            className="w-full py-5 rounded-2xl bg-textMain text-background font-sans
              text-sm tracking-wider hover:opacity-90 transition-all mb-8"
          >
            나만의 피드 시작하기 ✦
          </button>
        </div>
      )}
    </div>
  );
}