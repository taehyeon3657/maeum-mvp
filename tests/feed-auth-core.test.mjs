import assert from "node:assert/strict";
import test from "node:test";
import {
  createFeedAuthState,
  getFeedAuthErrorMessage,
} from "../src/lib/feedAuthCore.mjs";

test("feed auth state authenticates when a user id exists", () => {
  assert.deepEqual(
    createFeedAuthState({ userId: "user-1", errorMessage: null }),
    { status: "authenticated", userId: "user-1" },
  );
});

test("feed auth state redirects when no user is available", () => {
  assert.deepEqual(
    createFeedAuthState({ userId: null, errorMessage: null }),
    { status: "redirecting" },
  );
});

test("feed auth state surfaces auth errors before redirecting", () => {
  assert.deepEqual(
    createFeedAuthState({ userId: null, errorMessage: "network failed" }),
    { status: "error", message: "network failed" },
  );
});

test("feed auth error message is normalized from unknown errors", () => {
  assert.equal(getFeedAuthErrorMessage(new Error("boom")), "boom");
  assert.equal(getFeedAuthErrorMessage("plain error"), "plain error");
  assert.equal(getFeedAuthErrorMessage(null), "인증 상태를 확인하지 못했어요.");
});
