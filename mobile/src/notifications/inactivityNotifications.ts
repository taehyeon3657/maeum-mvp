import { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

const INACTIVITY_NOTIFICATION_KIND = "feed-inactivity";
const INACTIVITY_CHANNEL_ID = "maeum-inactivity";

const HOUR_MS = 60 * 60 * 1000;

interface InactivityStage {
  delayMs: number;
  title: string;
  body: string;
}

// 앱을 떠난 뒤 경과 시간별 재방문 유도 단계.
// 서버 reengage(Cron, 하루 1회)에 의존하지 않고 네이티브에서 정확한 시점에 로컬로 발송한다.
// 단계만 늘리거나 시간만 바꾸면 손쉽게 조정 가능.
export const INACTIVITY_STAGES: InactivityStage[] = [
  {
    delayMs: 6 * HOUR_MS,
    title: "오늘 한 문장 어떠세요?",
    body: "잠깐 쉬어가며 내 마음에 꼭 맞는 글귀를 만나보세요",
  },
  {
    delayMs: 24 * HOUR_MS,
    title: "오늘의 글귀가 기다리고 있어요",
    body: "지금 내 마음에 꼭 맞는 한 문장을 만나보세요",
  },
];

const DEFAULT_PATH = "/feed";

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

export async function scheduleInactivityNotifications(
  stages: InactivityStage[] = INACTIVITY_STAGES,
  path: string = DEFAULT_PATH,
) {
  await configureInactivityChannel();
  const hasPermission = await ensureNotificationPermission();
  if (!hasPermission) return;

  // 백그라운드 진입 때마다 재예약되므로, 기존 예약을 모두 지워 중복 방지
  await cancelInactivityNotification();

  await Promise.all(
    stages.map((stage) =>
      Notifications.scheduleNotificationAsync({
        content: {
          title: stage.title,
          body: stage.body,
          sound: "default",
          data: { kind: INACTIVITY_NOTIFICATION_KIND, path },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          channelId: INACTIVITY_CHANNEL_ID,
          seconds: Math.max(1, Math.ceil(stage.delayMs / 1000)),
        },
      }),
    ),
  );
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
