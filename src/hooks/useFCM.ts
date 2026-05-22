"use client";

import { useEffect, useState, useCallback } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/src/lib/firebase";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export function useFCM() {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return;

    const result = await Notification.requestPermission();
    setPermission(result);
    if (result !== "granted") return;

    const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log("✅ FCM 토큰 (Firebase 콘솔 테스트에 붙여넣기):", fcmToken);
    setToken(fcmToken);

    // 포그라운드 수신 (앱이 열려있을 때)
    onMessage(messaging, (payload) => {
      console.log("📩 포그라운드 메시지:", payload);
      const { title, body } = payload.notification ?? {};
      // TODO: toast 라이브러리로 교체 권장
      if (title) window.alert(`${title}\n${body ?? ""}`);
    });
  }, []);

  return { token, permission, requestPermission };
}
