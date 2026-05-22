import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccount) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON 환경변수가 없습니다.");

  return initializeApp({ credential: cert(JSON.parse(serviceAccount)) });
}

export const adminMessaging = () => getMessaging(getAdminApp());
