import { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { getCooldownNotificationTriggerSeconds } from "./cooldownNotificationCore.mjs";

const COOLDOWN_NOTIFICATION_KIND = "feed-cooldown";
const COOLDOWN_CHANNEL_ID = "maeum-cooldown";

interface CooldownNotificationOptions {
  delayMs: number;
  title?: string;
  body?: string;
  path?: string;
}

type NotificationData = {
  kind?: unknown;
  path?: unknown;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function configureNotificationChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(COOLDOWN_CHANNEL_ID, {
    name: "마음 글귀 알림",
    importance: Notifications.AndroidImportance.HIGH,
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

function isCooldownNotification(notification: Notifications.NotificationRequest) {
  const data = notification.content.data as NotificationData | null;
  return data?.kind === COOLDOWN_NOTIFICATION_KIND;
}

export async function cancelCooldownNotification() {
  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  await Promise.all(
    scheduledNotifications
      .filter(isCooldownNotification)
      .map((notification) =>
        Notifications.cancelScheduledNotificationAsync(notification.identifier),
      ),
  );
}

export async function scheduleCooldownNotification({
  delayMs,
  title = "새로운 글귀가 도착했어요!",
  body = "1시간이 지났어요. 새로운 5개의 문장을 만나보세요.",
  path = "/feed",
}: CooldownNotificationOptions) {
  const seconds = getCooldownNotificationTriggerSeconds(delayMs);
  if (seconds === null) {
    await cancelCooldownNotification();
    return;
  }

  await configureNotificationChannel();
  const hasPermission = await ensureNotificationPermission();
  if (!hasPermission) return;

  await cancelCooldownNotification();

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
      data: { kind: COOLDOWN_NOTIFICATION_KIND, path },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      channelId: COOLDOWN_CHANNEL_ID,
      seconds,
    },
  });
}

export function useCooldownNotificationNavigation(
  onNavigate: (path: string) => void,
) {
  useEffect(() => {
    let mounted = true;

    const handleResponse = (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data as NotificationData | null;
      if (
        data?.kind === COOLDOWN_NOTIFICATION_KIND &&
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
