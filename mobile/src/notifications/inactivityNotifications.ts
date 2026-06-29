import { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

const INACTIVITY_NOTIFICATION_KIND = "feed-inactivity";
const INACTIVITY_CHANNEL_ID = "maeum-inactivity";

// 마지막으로 앱을 떠난 뒤 이 시간이 지나도록 다시 열지 않으면 재방문 유도 알림 발송.
// 기본 24시간 — 하루 한 번 가볍게 리마인드(쿨다운 1시간, 서버 reengage 6시간과 겹치지 않는 장기 미접속 기준).
// 필요 시 이 값만 조정하면 됨.
export const INACTIVITY_DELAY_MS = 24 * 60 * 60 * 1000;

const DEFAULT_TITLE = "오늘의 글귀가 기다리고 있어요";
const DEFAULT_BODY = "잠깐 쉬어가며 내 마음에 꼭 맞는 한 문장을 만나보세요";

interface InactivityNotificationOptions {
  delayMs?: number;
  title?: string;
  body?: string;
  path?: string;
}

type NotificationData = {
  kind?: unknown;
  path?: unknown;
};

export async function configureInactivityChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(INACTIVITY_CHANNEL_ID, {
    name: "재방문 알림",
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#E07A5F",
  });
}

async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

function isInactivityNotification(
  notification: Notifications.NotificationRequest,
) {
  const data = notification.content.data as NotificationData | null;
  return data?.kind === INACTIVITY_NOTIFICATION_KIND;
}

export async function cancelInactivityNotification() {
  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  await Promise.all(
    scheduledNotifications
      .filter(isInactivityNotification)
      .map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier),
      ),
  );
}

export async function scheduleInactivityNotification({
  delayMs = INACTIVITY_DELAY_MS,
  title = DEFAULT_TITLE,
  body = DEFAULT_BODY,
  path = "/feed",
}: InactivityNotificationOptions = {}) {
  await configureInactivityChannel();
  const hasPermission = await ensureNotificationPermission();
  if (!hasPermission) return;

  // 백그라운드 진입 때마다 재예약되므로, 기존 예약을 지워 중복 방지
  await cancelInactivityNotification();

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
      data: { kind: INACTIVITY_NOTIFICATION_KIND, path },
    },
    trigger: {
      channelId: INACTIVITY_CHANNEL_ID,
      seconds: Math.max(1, Math.ceil(delayMs / 1000)),
    },
  });
}

export function useInactivityNotificationNavigation(
  onNavigate: (path: string) => void,
) {
  useEffect(() => {
    let mounted = true;

    const handleResponse = (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data as NotificationData | null;
      if (
        data?.kind === INACTIVITY_NOTIFICATION_KIND &&
        typeof data.path === "string"
      ) {
        onNavigate(data.path);
      }
    };

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (mounted && response) handleResponse(response);
    });

    const subscription =
      Notifications.addNotificationResponseReceivedListener(handleResponse);

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [onNavigate]);
}
