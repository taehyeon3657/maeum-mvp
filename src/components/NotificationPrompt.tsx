"use client";

import { useEffect, useState } from "react";
import { useFCM } from "@/src/hooks/useFCM";

function useDeviceState() {
  const [isIOSNonPWA, setIsIOSNonPWA] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;

    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsIOSNonPWA(isIOS && !isStandalone);

    // 카카오톡·인스타·페북 등 인앱 브라우저 감지 (Android WebView 포함)
    const inApp =
      /KAKAOTALK/i.test(ua) ||
      /Instagram/i.test(ua) ||
      /FBAN|FBAV/i.test(ua) ||
      /; wv\)/.test(ua); // Android Chrome WebView 공통 마커
    setIsInAppBrowser(inApp);
  }, []);

  return { isIOSNonPWA, isInAppBrowser };
}

function openInExternalBrowser() {
  const url = window.location.href;
  // Android Intent: Chrome으로 열기 시도, 실패 시 기본 브라우저
  const intent = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(url)};end`;
  window.location.href = intent;
}

export default function NotificationPrompt() {
  const { permission, requestPermission, supported } = useFCM();
  const { isIOSNonPWA, isInAppBrowser } = useDeviceState();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("fcm-prompt-dismissed") === "1") {
      setDismissed(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem("fcm-prompt-dismissed", "1");
    setDismissed(true);
  };

  if (dismissed) return null;
  if (permission !== "default") return null;

  // 카카오톡 등 인앱 브라우저: Push 미지원 → 외부 브라우저 열기 안내
  if (isInAppBrowser) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg px-5 py-4 flex flex-col gap-3">
          <div>
            <p className="font-bold text-sm text-textMain">알림을 받고 싶다면?</p>
            <p className="text-xs text-gray-500 mt-0.5">
              인앱 브라우저에서는 알림 설정이 불가해요. Chrome 또는 삼성 인터넷으로 열어주세요.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openInExternalBrowser}
              className="flex-1 bg-primary text-white text-sm font-bold py-2 rounded-xl"
            >
              브라우저로 열기
            </button>
            <button
              onClick={dismiss}
              className="flex-1 bg-gray-100 text-gray-500 text-sm py-2 rounded-xl"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // iOS Safari 비-PWA: Web Push 미지원 → 홈 화면 추가 안내
  if (isIOSNonPWA) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg px-5 py-4 flex flex-col gap-3">
          <div>
            <p className="font-bold text-sm text-textMain">알림 받는 방법</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Safari 하단 공유 버튼 → <strong>홈 화면에 추가</strong> 후 앱을 열면 알림을 받을 수 있어요
            </p>
          </div>
          <button
            onClick={dismiss}
            className="w-full bg-gray-100 text-gray-500 text-sm py-2 rounded-xl"
          >
            닫기
          </button>
        </div>
      </div>
    );
  }

  // FCM 미지원 브라우저 (supported 확인 전 깜박임 방지)
  if (supported !== true) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-white rounded-2xl shadow-lg px-5 py-4 flex flex-col gap-3">
        <div>
          <p className="font-bold text-sm text-textMain">오늘의 글귀 알림 받기</p>
          <p className="text-xs text-gray-500 mt-0.5">매일 딱 한 번, 마음을 울리는 글귀를 보내드려요</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={requestPermission}
            className="flex-1 bg-primary text-white text-sm font-bold py-2 rounded-xl"
          >
            허용하기
          </button>
          <button
            onClick={dismiss}
            className="flex-1 bg-gray-100 text-gray-500 text-sm py-2 rounded-xl"
          >
            나중에
          </button>
        </div>
      </div>
    </div>
  );
}
