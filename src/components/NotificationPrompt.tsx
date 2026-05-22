"use client";

import { useFCM } from "@/src/hooks/useFCM";

export default function NotificationPrompt() {
  const { permission, requestPermission } = useFCM();

  // 이미 허용되었거나 영구 차단된 경우 표시 안 함
  if (permission !== "default") return null;

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
            onClick={() => {
              // 거절 시 더 이상 안 보이도록 localStorage 처리 가능
              if (typeof window !== "undefined") {
                localStorage.setItem("fcm-prompt-dismissed", "1");
              }
              window.location.reload();
            }}
            className="flex-1 bg-gray-100 text-gray-500 text-sm py-2 rounded-xl"
          >
            나중에
          </button>
        </div>
      </div>
    </div>
  );
}
