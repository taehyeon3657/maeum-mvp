export interface CooldownRemainingInput {
  completedAt: number;
  now: number;
  cooldownMs: number;
}

export interface CooldownNotificationMessageInput {
  remainingMs: number;
  title: string;
  body: string;
  path: string;
}

export interface CooldownNotificationMessage {
  type: "scheduleCooldownNotification";
  delayMs: number;
  title: string;
  body: string;
  path: string;
}

export function getCooldownRemainingMs(input: CooldownRemainingInput): number;
export function shouldScheduleCooldownNotification(remainingMs: number): boolean;
export function createCooldownNotificationMessage(
  input: CooldownNotificationMessageInput,
): CooldownNotificationMessage | null;
