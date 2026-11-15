import { advanceStreak, seoulDateKey } from "@/src/lib/streakCore.mjs";

const STREAK_KEY = "maeum_streak";

export interface StreakState {
  lastDate: string | null;
  count: number;
}

export function readStreak(): StreakState {
  if (typeof window === "undefined") return { lastDate: null, count: 0 };
  const raw = localStorage.getItem(STREAK_KEY);
  if (!raw) return { lastDate: null, count: 0 };
  try {
    const parsed = JSON.parse(raw) as Partial<StreakState>;
    const count = Number(parsed.count);
    return {
      lastDate: typeof parsed.lastDate === "string" ? parsed.lastDate : null,
      count: Number.isFinite(count) ? count : 0,
    };
  } catch {
    return { lastDate: null, count: 0 };
  }
}

export function recordSessionStreak(now = Date.now()): StreakState {
  const next = advanceStreak(readStreak(), seoulDateKey(now)) as StreakState;
  if (typeof window !== "undefined") {
    localStorage.setItem(STREAK_KEY, JSON.stringify(next));
  }
  return next;
}
