export function getCooldownRemainingMs({ completedAt, now, cooldownMs }) {
  if (
    typeof completedAt !== "number" ||
    typeof now !== "number" ||
    typeof cooldownMs !== "number" ||
    !Number.isFinite(completedAt) ||
    !Number.isFinite(now) ||
    !Number.isFinite(cooldownMs) ||
    cooldownMs <= 0
  ) {
    return 0;
  }

  return Math.max(0, cooldownMs - (now - completedAt));
}

export function shouldScheduleCooldownNotification(remainingMs) {
  return typeof remainingMs === "number" && Number.isFinite(remainingMs) && remainingMs > 0;
}

export function createCooldownNotificationMessage({
  remainingMs,
  title,
  body,
  path,
}) {
  if (!shouldScheduleCooldownNotification(remainingMs)) return null;

  return {
    type: "scheduleCooldownNotification",
    delayMs: remainingMs,
    title,
    body,
    path,
  };
}
