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

// 앱이 백그라운드(다른 탭 보는 중, 최소화)일 때 수신 처리
messaging.onBackgroundMessage((payload) => {
  const { title, body, image } = payload.notification ?? {};

  self.registration.showNotification(title ?? "마음", {
    body: body ?? "",
    icon: "/favicon.svg",
    image: image,          // Firebase 콘솔에서 입력한 이미지 URL
    badge: "/favicon.svg",
    data: payload.data,
  });
});
