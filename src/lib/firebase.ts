import { initializeApp, getApps } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

// 클라이언트 공개값 — firebase-messaging-sw.js에도 동일하게 하드코딩되어 있으며 보안 민감 정보가 아님
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyCWVoK9a20MlWtmdALsXuz31CItHMPnTlo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "maeum-e19cd.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "maeum-e19cd",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "maeum-e19cd.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "248805446911",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:248805446911:web:96e3de3aa41f800ca728ca",
};

// HMR 재실행 시 중복 초기화 방지
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Safari 등 FCM 미지원 브라우저 대비
export const getFirebaseMessaging = async () => {
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};
