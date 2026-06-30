"use client";

import { useCallback, useRef } from "react";

function detectDeviceType(): string {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone|ipod/i.test(ua)) return "mobile";
  return "desktop";
}

function detectAccessChannel(): string {
  if (typeof window === "undefined") return "direct";
  const ref = document.referrer;
  if (!ref) return "direct";
  if (ref.includes("notification")) return "notification";
  return "feed";
}

export interface ContextSnapshot {
  session_id: string;
  session_position: number;
  device_type: string;
  access_channel: string;
  read_duration_ms: number;
}

export function useSessionContext() {
  const sessionId = useRef<string | null>(null);
  const deviceType = useRef<string>(detectDeviceType());
  const accessChannel = useRef<string>(detectAccessChannel());
  const positionRef = useRef<number>(0);
  const cardStartTime = useRef<number>(0);

  const getSessionId = useCallback(() => {
    if (sessionId.current === null) {
      sessionId.current =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : String(Date.now());
    }
    return sessionId.current;
  }, []);

  // 새 카드가 화면에 올라올 때 호출
  const markCardStart = useCallback(() => {
    cardStartTime.current = Date.now();
  }, []);

  // 스와이프 직전에 호출해서 B+C 스냅샷 반환
  const getContextSnapshot = useCallback((): ContextSnapshot => {
    const now = Date.now();
    positionRef.current += 1;
    return {
      session_id: getSessionId(),
      session_position: positionRef.current,
      device_type: deviceType.current,
      access_channel: accessChannel.current,
      read_duration_ms: now - (cardStartTime.current || now),
    };
  }, [getSessionId]);

  return { markCardStart, getContextSnapshot };
}
