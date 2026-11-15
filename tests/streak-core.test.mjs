import assert from "node:assert/strict";
import test from "node:test";
import { advanceStreak, previousDateKey, seoulDateKey } from "../src/lib/streakCore.mjs";

test("seoul date key and previous day cross month boundaries", () => {
  assert.equal(seoulDateKey(Date.UTC(2026, 0, 1, 15, 30)), "2026-01-02");
  assert.equal(previousDateKey("2026-03-01"), "2026-02-28");
  assert.equal(previousDateKey("2026-01-01"), "2025-12-31");
});

test("streak continues across consecutive days and resets after a gap", () => {
  assert.deepEqual(advanceStreak(null, "2026-11-15"), { lastDate: "2026-11-15", count: 1 });
  assert.deepEqual(
    advanceStreak({ lastDate: "2026-11-15", count: 1 }, "2026-11-15"),
    { lastDate: "2026-11-15", count: 1 },
  );
  assert.deepEqual(
    advanceStreak({ lastDate: "2026-11-15", count: 3 }, "2026-11-16"),
    { lastDate: "2026-11-16", count: 4 },
  );
  assert.deepEqual(
    advanceStreak({ lastDate: "2026-11-10", count: 5 }, "2026-11-15"),
    { lastDate: "2026-11-15", count: 1 },
  );
});
