"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/src/lib/firebase";
import { updateLastActive, saveTokenToSupabase, useNativeFCMBridge, isNativeApp } from "@/src/hooks/useFCM";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

async function initFCM() {
  // 네이티브 앱 래퍼에서는 WebView 브리지로 토큰을 받으므로 웹 FCM 초기화 생략
  if (isNativeApp()) return;
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;

  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return;

    // SW 등록 후 activated 상태까지 대기해야 getToken이 안정적으로 동작
    let swRegistration: ServiceWorkerRegistration | undefined;
    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        { scope: "/" }
      );
      swRegistration = await navigator.serviceWorker.ready;
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: swRegistration });
    // 앱 재실행 시마다 최신 토큰을 DB에 저장 (토큰 갱신 대응)
    if (token) await saveTokenToSupabase(token);

    onMessage(messaging, (payload) => {
      console.log("📩 포그라운드 메시지:", payload);
    });
  } catch (err) {
    console.error("FCM 초기화 실패:", err);
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  // 네이티브 앱에서 주입된 FCM 토큰 수신
  useNativeFCMBridge();

  useEffect(() => {
    initFCM();
    updateLastActive(); // 앱 접속 시 last_active_at 갱신
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
