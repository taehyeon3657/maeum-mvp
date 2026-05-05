"use client";

import { useCallback, useEffect, useState } from "react";

const COOLDOWN_KEY = "maeum_feed_cooldown";
const COOLDOWN_MS = 60 * 60 * 1000; // 1시간

function getRemainingMs(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(COOLDOWN_KEY);
  if (!raw) return 0;
  try {
    const { completedAt } = JSON.parse(raw);
    return Math.max(0, COOLDOWN_MS - (Date.now() - completedAt));
  } catch {
    return 0;
  }
}

export function formatCountdown(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}시간 ${m}분`;
  if (m > 0) return `${m}분 ${s}초`;
  return `${s}초`;
}

export function useFeedCooldown() {
  const [remainingMs, setRemainingMs] = useState(0);

  // 클라이언트에서만 초기화
  useEffect(() => {
    setRemainingMs(getRemainingMs());
  }, []);

  // 쿨다운 진행 중일 때 1초마다 갱신
  useEffect(() => {
    if (remainingMs <= 0) return;
    const timer = setInterval(() => {
      const next = getRemainingMs();
      setRemainingMs(next);
      if (next === 0) localStorage.removeItem(COOLDOWN_KEY);
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingMs > 0]); // on/off 전환 시에만 인터벌 재설정

  const startCooldown = useCallback(() => {
    localStorage.setItem(COOLDOWN_KEY, JSON.stringify({ completedAt: Date.now() }));
    setRemainingMs(COOLDOWN_MS);
  }, []);

  const clearCooldown = useCallback(() => {
    localStorage.removeItem(COOLDOWN_KEY);
    setRemainingMs(0);
  }, []);

  return {
    isOnCooldown: remainingMs > 0,
    remainingMs,
    startCooldown,
    clearCooldown,
  };
}
