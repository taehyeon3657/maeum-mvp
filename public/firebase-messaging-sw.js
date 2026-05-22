importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Service Worker는 process.env 사용 불가 — 값 직접 입력
firebase.initializeApp({
  apiKey: "AIzaSyCWVoK9a20MlWtmdALsXuz31CItHMPnTlo",
  authDomain: "maeum-e19cd.firebaseapp.com",
  projectId: "maeum-e19cd",
  storageBucket: "maeum-e19cd.firebasestorage.app",
  messagingSenderId: "248805446911",
  appId: "1:248805446911:web:96e3de3aa41f800ca728ca",
});

const messaging = firebase.messaging();

// 앱이 백그라운드(다른 탭 보는 중, 최소화)일 때 FCM 수신 처리
messaging.onBackgroundMessage((payload) => {
  const { title, body, image } = payload.notification ?? {};

  self.registration.showNotification(title ?? "마음", {
    body: body ?? "",
    icon: "/favicon.svg",
    image: image,
    badge: "/favicon.svg",
    data: payload.data,
  });
});

// 알림 클릭 시 해당 URL로 이동 (쿨다운 알림: /feed, FCM 알림: data.url)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/feed";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      // 이미 열린 탭이 있으면 포커스
      const existing = list.find((c) => c.url.includes(self.location.origin));
      if (existing) return existing.focus().then((c) => c.navigate(url));
      return clients.openWindow(url);
    })
  );
});
