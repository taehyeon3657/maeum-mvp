import { useEffect, useRef } from "react";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { Alert } from "react-native";

export type TokenReadyCallback = (token: string) => void;
export type MessageCallback = (
  notification: FirebaseMessagingTypes.Notification
) => void;
export type NavigateCallback = (path: string) => void;

function extractPath(data?: Record<string, string>): string | null {
  return data?.path ?? data?.url ?? null;
}

export function useNativeNotifications(
  onTokenReady: TokenReadyCallback,
  onForegroundMessage?: MessageCallback,
  onNavigate?: NavigateCallback
) {
  const tokenSent = useRef(false);

  useEffect(() => {
    let unsubscribeForeground: (() => void) | undefined;
    let unsubscribeTokenRefresh: (() => void) | undefined;
    let unsubscribeOpened: (() => void) | undefined;

    const setup = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) return;

      const token = await messaging().getToken();
      if (token && !tokenSent.current) {
        tokenSent.current = true;
        onTokenReady(token);
      }

      unsubscribeTokenRefresh = messaging().onTokenRefresh((newToken) => {
        tokenSent.current = false;
        onTokenReady(newToken);
      });

      unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
        const notification = remoteMessage.notification;
        if (!notification) return;

        if (onForegroundMessage) {
          onForegroundMessage(notification);
        } else {
          Alert.alert(notification.title ?? "마음", notification.body ?? "");
        }
      });

      // 백그라운드 상태에서 알림 탭 시 (Android + iOS 공통)
      unsubscribeOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
        const path = extractPath(remoteMessage.data as Record<string, string>);
        if (path) onNavigate?.(path);
      });

      // 앱 종료 상태에서 알림 탭으로 실행된 경우
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        const path = extractPath(initialNotification.data as Record<string, string>);
        if (path) onNavigate?.(path);
        else if (initialNotification.notification) {
          onForegroundMessage?.(initialNotification.notification);
        }
      }
    };

    setup();

    return () => {
      unsubscribeForeground?.();
      unsubscribeTokenRefresh?.();
      unsubscribeOpened?.();
    };
  }, [onTokenReady, onForegroundMessage, onNavigate]);
}

export function registerBackgroundHandler() {
  messaging().setBackgroundMessageHandler(async () => {
    // 시스템이 자동으로 알림을 표시하므로 별도 처리 불필요
  });
}
