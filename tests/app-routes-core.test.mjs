import assert from "node:assert/strict";
import test from "node:test";
import { APP_ROUTES, isKnownAppRoute } from "../src/lib/appRoutesCore.mjs";

test("app routes expose stable internal navigation targets", () => {
  assert.deepEqual(APP_ROUTES, {
    feed: "/feed",
    collection: "/collection",
    insights: "/insights",
    onboarding: "/onboarding",
  });
});

test("app route guard accepts only known app routes", () => {
  assert.equal(isKnownAppRoute("/feed"), true);
  assert.equal(isKnownAppRoute("/collection"), true);
  assert.equal(isKnownAppRoute("/external"), false);
});
