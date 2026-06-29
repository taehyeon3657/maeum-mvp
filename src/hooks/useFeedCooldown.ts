"use client";

import { useCallback, useEffect, useState } from "react";
import { isNativeApp } from "@/src/hooks/useFCM";

const COOLDOWN_KEY = "maeum_feed_cooldown";
const COOLDOWN_NOTIFICATION_TITLE = "새로운 글귀가 도착했어요!";
const COOLDOWN_NOTIFICATION_BODY = "1시간이 지났어요. 새로운 5개의 문장을 만나보세요.";
// 로컬 테스트 시 NEXT_PUBLIC_COOLDOWN_MS=60000 (.env.local) 으로 1분으로 단축 가능
const COOLDOWN_MS = process.env.NEXT_PUBLIC_COOLDOWN_MS
  ? parseInt(process.env.NEXT_PUBLIC_COOLDOWN_MS, 10)
  : 60 * 60 * 1000;

type NativeBridgeWindow = Window & {
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
};

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

function postNativeMessage(message: Record<string, unknown>): boolean {
  if (typeof window === "undefined" || !isNativeApp()) return false;
  const bridge = (window as NativeBridgeWindow).ReactNativeWebView;
  if (!bridge) return false;

  bridge.postMessage(JSON.stringify(message));
  return true;
}

function scheduleNativeCooldownNotification(delayMs: number) {
  postNativeMessage({
    type: "scheduleCooldownNotification",
    delayMs,
    title: COOLDOWN_NOTIFICATION_TITLE,
    body: COOLDOWN_NOTIFICATION_BODY,
    path: "/feed",
  });
}

function cancelNativeCooldownNotification() {
  postNativeMessage({ type: "cancelCooldownNotification" });
}

async function showCooldownNotification() {
  if (typeof window === "undefined") return;
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;
  if (!("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(COOLDOWN_NOTIFICATION_TITLE, {
      body: COOLDOWN_NOTIFICATION_BODY,
      icon: "/favicon.svg",
      badge: "/favicon.svg",
      data: { url: "/feed" },
    });
  } catch (e) {
    console.error("[cooldown] 알림 오류:", e);
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
  const [remainingMs, setRemainingMs] = useState(() => getRemainingMs());
  const isCoolingDown = remainingMs > 0;

  // 1초마다 카운트다운 갱신
  useEffect(() => {
    if (!isCoolingDown) return;
    const timer = setInterval(() => {
      const next = getRemainingMs();
      setRemainingMs(next);
      if (next === 0) localStorage.removeItem(COOLDOWN_KEY);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCoolingDown]);

  // 쿨다운 시작/재진입 시 남은 시간 후 알림 예약
  useEffect(() => {
    if (!isCoolingDown) return;
    const remaining = getRemainingMs();
    if (remaining <= 0) return;

    if (isNativeApp()) {
      scheduleNativeCooldownNotification(remaining);
      return;
    }

    const notifyTimer = setTimeout(showCooldownNotification, remaining);
    return () => clearTimeout(notifyTimer);
  }, [isCoolingDown]);

  const startCooldown = useCallback(() => {
    localStorage.setItem(COOLDOWN_KEY, JSON.stringify({ completedAt: Date.now() }));
    setRemainingMs(COOLDOWN_MS);
    scheduleNativeCooldownNotification(COOLDOWN_MS);
  }, []);

  const clearCooldown = useCallback(() => {
    localStorage.removeItem(COOLDOWN_KEY);
    setRemainingMs(0);
    cancelNativeCooldownNotification();
  }, []);

  return {
    isOnCooldown: isCoolingDown,
    remainingMs,
    startCooldown,
    clearCooldown,
  };
}
