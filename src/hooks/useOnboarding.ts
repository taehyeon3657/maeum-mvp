"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";
import {
  OnboardingPrefs,
  savePrefsLocally,
} from "@/src/models/onboarding";

export type Step = 1 | 2 | 3;

export function useOnboarding() {
  /* ── step ── */
  const [step, setStep]       = useState<Step>(1);
  const [animKey, setAnimKey] = useState(0);

  /* ── form state ── */
  const [emotions, setEmotions] = useState<string[]>([]);
  const [time, setTime]         = useState<string>("");
  const [mbti, setMbti]         = useState<string>("");
  const [gender, setGender]     = useState<string>("");
  const [age, setAge]           = useState<string>("");

  /* ── navigation ── */
  const goNext = () => { setStep((s) => (s + 1) as Step); setAnimKey((k) => k + 1); };
  const goBack = () => { setStep((s) => (s - 1) as Step); setAnimKey((k) => k + 1); };

  /* ── emotion toggle (최대 4개) ── */
  const toggleEmotion = (id: string) =>
    setEmotions((prev) => {
      if (prev.includes(id)) return prev.filter((e) => e !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });

  /* ── 현재 prefs 객체 ── */
  const currentPrefs: OnboardingPrefs = {
    pref_emotions: emotions,
    pref_time:     time,
    mbti,
    gender,
    age_group:     age,
  };

  /* ── Supabase 저장 mutation ── */
  const saveMutation = useMutation({
    mutationFn: async (prefs: OnboardingPrefs) => {
      const { data: { user } } = await supabase.auth.getUser();

      // 로그인 유저 → DB upsert
      if (user) {
        const { error } = await supabase.from("users").upsert({
          id:            user.id,
          pref_emotions: prefs.pref_emotions,
          pref_time:     prefs.pref_time,
          mbti:          prefs.mbti || null,
          gender:        prefs.gender || null,
          age_group:     prefs.age_group || null,
          onboarded_at:  new Date().toISOString(),
        });
        if (error) throw error;
      }

      // 비로그인 → localStorage (회원가입 시 마이그레이션)
      savePrefsLocally(prefs);
    },
  });

  return {
    /* state */
    step, animKey,
    emotions, time, mbti, gender, age,
    currentPrefs,
    /* actions */
    goNext, goBack,
    toggleEmotion,
    setTime, setMbti, setGender, setAge,
    /* mutation */
    saveMutation,
    isSaving: saveMutation.isPending,
  };
}