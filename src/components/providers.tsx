"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/src/lib/firebase";
import { updateLastActive } from "@/src/hooks/useFCM";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

async function initFCM() {
  if (typeof Notification === "undefined") return;
  if (Notification.permission !== "granted") return;

  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) return;

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log("✅ FCM 토큰:", token);

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

  useEffect(() => {
    initFCM();
    updateLastActive(); // 앱 접속 시 last_active_at 갱신
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
