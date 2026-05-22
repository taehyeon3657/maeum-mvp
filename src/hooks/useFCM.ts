"use client";

import { useEffect, useState, useCallback } from "react";
import { getToken, onMessage, isSupported } from "firebase/messaging";
import { getFirebaseMessaging } from "@/src/lib/firebase";
import { createClient } from "@/src/lib/supabase";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

async function saveTokenToSupabase(token: string) {
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

      // 모바일에서 서비스 워커를 명시적으로 등록해 getToken에 전달해야 안정적으로 동작
      let swRegistration: ServiceWorkerRegistration | undefined;
      if ("serviceWorker" in navigator) {
        swRegistration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          { scope: "/" }
        );
      }

      const fcmToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swRegistration,
      });
      setToken(fcmToken);
      await saveTokenToSupabase(fcmToken);

      onMessage(messaging, (payload) => {
        const { title, body } = payload.notification ?? {};
        if (title) window.alert(`${title}\n${body ?? ""}`);
      });
    } catch (err) {
      console.error("FCM 권한 요청 실패:", err);
    }
  }, []);

  return { token, permission, requestPermission, supported };
}
