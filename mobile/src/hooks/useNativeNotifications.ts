import { useEffect, useRef } from "react";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { Platform, Alert } from "react-native";

export type TokenReadyCallback = (token: string) => void;
export type MessageCallback = (
  notification: FirebaseMessagingTypes.Notification
) => void;

export function useNativeNotifications(
  onTokenReady: TokenReadyCallback,
  onForegroundMessage?: MessageCallback
) {
  const tokenSent = useRef(false);

  useEffect(() => {
    let unsubscribeForeground: (() => void) | undefined;
    let unsubscribeTokenRefresh: (() => void) | undefined;

    const setup = async () => {
      // 알림 권한 요청
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) return;

      // FCM 토큰 획득 후 WebView 로 전달
      const token = await messaging().getToken();
      if (token && !tokenSent.current) {
        tokenSent.current = true;
        onTokenReady(token);
      }

      // 토큰 갱신 시 재전송
      unsubscribeTokenRefresh = messaging().onTokenRefresh((newToken) => {
        tokenSent.current = false;
        onTokenReady(newToken);
      });

      // 포그라운드 메시지 수신 (앱이 열려있을 때)
      unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
        const notification = remoteMessage.notification;
        if (!notification) return;

        if (onForegroundMessage) {
          onForegroundMessage(notification);
        } else {
          // 기본 Alert 표시
          Alert.alert(
            notification.title ?? "마음",
            notification.body ?? ""
          );
        }
      });

      // iOS: 백그라운드/종료 상태에서 알림 탭했을 때
      if (Platform.OS === "ios") {
        const initialNotification = await messaging().getInitialNotification();
        if (initialNotification?.notification) {
          onForegroundMessage?.(initialNotification.notification);
        }
      }
    };

    setup();

    return () => {
      unsubscribeForeground?.();
      unsubscribeTokenRefresh?.();
    };
  }, [onTokenReady, onForegroundMessage]);
}

// 백그라운드/종료 상태 메시지 핸들러 — App.tsx 최상단에서 등록
export function registerBackgroundHandler() {
  messaging().setBackgroundMessageHandler(async (_remoteMessage) => {
    // 시스템이 자동으로 알림을 표시하므로 별도 처리 불필요
  });
}
