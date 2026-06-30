import assert from "node:assert/strict";
import test from "node:test";
import {
  createCooldownNotificationMessage,
  getCooldownRemainingMs,
  shouldScheduleCooldownNotification,
} from "../src/lib/feedCooldownCore.mjs";
import { getCooldownNotificationTriggerSeconds } from "../mobile/src/notifications/cooldownNotificationCore.mjs";

test("cooldown remaining time is positive only before the cooldown expires", () => {
  assert.equal(
    getCooldownRemainingMs({ completedAt: 1_000, now: 11_000, cooldownMs: 60_000 }),
    50_000,
  );
  assert.equal(
    getCooldownRemainingMs({ completedAt: 1_000, now: 61_000, cooldownMs: 60_000 }),
    0,
  );
  assert.equal(
    getCooldownRemainingMs({ completedAt: Number.NaN, now: 1_000, cooldownMs: 60_000 }),
    0,
  );
});

test("webview cooldown notification message is created only with positive delay", () => {
  assert.equal(shouldScheduleCooldownNotification(1), true);
  assert.equal(shouldScheduleCooldownNotification(0), false);
  assert.equal(shouldScheduleCooldownNotification(-1), false);
  assert.equal(shouldScheduleCooldownNotification(Number.NaN), false);

  assert.deepEqual(
    createCooldownNotificationMessage({
      remainingMs: 12_345,
      title: "title",
      body: "body",
      path: "/feed",
    }),
    {
      type: "scheduleCooldownNotification",
      delayMs: 12_345,
      title: "title",
      body: "body",
      path: "/feed",
    },
  );

  assert.equal(
    createCooldownNotificationMessage({
      remainingMs: 0,
      title: "title",
      body: "body",
      path: "/feed",
    }),
    null,
  );
});

test("native cooldown trigger never schedules invalid immediate notifications", () => {
  assert.equal(getCooldownNotificationTriggerSeconds(1), 1);
  assert.equal(getCooldownNotificationTriggerSeconds(1_001), 2);
  assert.equal(getCooldownNotificationTriggerSeconds(0), null);
  assert.equal(getCooldownNotificationTriggerSeconds(-1), null);
  assert.equal(getCooldownNotificationTriggerSeconds(Number.NaN), null);
});
