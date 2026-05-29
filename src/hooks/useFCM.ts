"use client";

import { useEffect, useState, useCallback } from "react";
import { getToken, onMessage, isSupported } from "firebase/messaging";
import { getFirebaseMessaging } from "@/src/lib/firebase";
import { createClient } from "@/src/lib/supabase";

// React Native WebView에서 주입한 네이티브 FCM 토큰을 감지
export function useNativeFCMBridge() {
  useEffect(() => {
    const handler = async (e: Event) => {
      const token = (e as CustomEvent<string>).detail;
      if (token) await saveTokenToSupabase(token);
    };
    window.addEventListener("native-fcm-token", handler);
    return () => window.removeEventListener("native-fcm-token", handler);
  }, []);
}

// UserAgent로 네이티브 앱 래퍼 여부 판별
export function isNativeApp(): boolean {
  if (typeof navigator === "undefined") return false;
  return /MaeumNative\/(android|ios)/i.test(navigator.userAgent);
}

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export async function saveTokenToSupabase(token: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("users")
    .update({ fcm_token: token, last_active_at: new Date().toISOString() })
    .eq("id", user.id);
}

export async function updateLastActive() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("users")
    .update({ last_active_at: new Date().toISOString() })
    .eq("id", user.id);
}

export function useFCM() {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
    isSupported().then(setSupported).catch(() => setSupported(false));
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") return;

      // SW 등록 후 activated 상태까지 대기해야 getToken이 안정적으로 동작
      let swRegistration: ServiceWorkerRegistration | undefined;
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          { scope: "/" }
        );
        swRegistration = await navigator.serviceWorker.ready;
      }

      const fcmToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swRegistration,
      });
      setToken(fcmToken);
      await saveTokenToSupabase(fcmToken);

      onMessage(messaging, async (payload) => {
        const { title, body } = payload.notification ?? {};
        if (!title) return;
        // window.alert은 iOS PWA에서 차단됨 — SW를 통해 시스템 알림으로 표시
        if ("serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification(title, {
            body: body ?? "",
            icon: "/favicon.svg",
            badge: "/favicon.svg",
            data: payload.data,
          });
        }
      });
    } catch (err) {
      console.error("FCM 권한 요청 실패:", err);
    }
  }, []);

  return { token, permission, requestPermission, supported };
}
