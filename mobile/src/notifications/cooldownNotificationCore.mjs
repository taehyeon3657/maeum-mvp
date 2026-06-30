export function getCooldownNotificationTriggerSeconds(delayMs) {
  const seconds = Math.ceil(delayMs / 1000);
  if (!Number.isFinite(seconds) || seconds <= 0) return null;
  return seconds;
}
