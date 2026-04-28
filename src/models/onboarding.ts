export interface OnboardingPrefs {
  pref_emotions: string[];
  pref_time:     string;
  mbti:          string;
  gender:        string;
  age_group:     string;
}

export interface EmotionOption {
  id:    string;
  emoji: string;
  label: string;
  color: string;
}

export interface TimeOption {
  id:    string;
  emoji: string;
  label: string;
}

/* ── 감정 옵션 ── */
export const EMOTION_OPTIONS: EmotionOption[] = [
  { id: "comfort",    emoji: "🤍", label: "위로받고 싶어",  color: "#c9a96e" },
  { id: "motivation", emoji: "🔥", label: "동기가 필요해",  color: "#c0604a" },
  { id: "rest",       emoji: "🌿", label: "그냥 쉬고 싶어", color: "#2d6a4f" },
  { id: "growth",     emoji: "✨", label: "성장하고 싶어",  color: "#7c6fa0" },
];

/* ── 시간대 옵션 ── */
export const TIME_OPTIONS: TimeOption[] = [
  { id: "morning", emoji: "🌅", label: "아침에 일어날 때" },
  { id: "hard",    emoji: "💧", label: "힘든 순간" },
  { id: "night",   emoji: "🌙", label: "자기 전" },
  { id: "anytime", emoji: "☁️", label: "특별히 없어" },
];

/* ── MBTI ── */
export const MBTI_LIST: string[] = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
];

/* ── 성별 ── */
export const GENDER_OPTIONS = ["남성", "여성", "기타"] as const;

/* ── 연령대 ── */
export const AGE_OPTIONS = ["10대", "20대", "30대", "40대", "50대 이상"] as const;

/* ── localStorage 키 ── */
export const PREFS_STORAGE_KEY = "maeum_prefs";

/* ── localStorage 저장 헬퍼 ── */
export const savePrefsLocally = (prefs: OnboardingPrefs): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(prefs));
};

/* ── localStorage 읽기 헬퍼 ── */
export const loadPrefsLocally = (): Partial<OnboardingPrefs> | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PREFS_STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); }
  catch { return null; }
};