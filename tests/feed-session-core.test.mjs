import assert from "node:assert/strict";
import test from "node:test";
import {
  createSessionCompletionSnapshot,
  getSessionDurationMs,
  selectLongestReadQuote,
} from "../src/lib/feedSessionCore.mjs";

test("feed session selects the longest-read quote for sharing", () => {
  const readQuotes = [
    { quote: { id: "short" }, durationMs: 500 },
    { quote: { id: "long" }, durationMs: 2_000 },
    { quote: { id: "middle" }, durationMs: 1_000 },
  ];

  assert.deepEqual(selectLongestReadQuote(readQuotes), { id: "long" });
});

test("feed session completion returns a non-negative duration and share quote", () => {
  assert.deepEqual(
    createSessionCompletionSnapshot({
      readQuotes: [{ quote: { id: "quote-a" }, durationMs: 100 }],
      startedAt: 1_000,
      now: 4_000,
    }),
    {
      durationMs: 3_000,
      shareQuote: { id: "quote-a" },
    },
  );

  assert.equal(getSessionDurationMs({ startedAt: null, now: 4_000 }), 0);
  assert.equal(getSessionDurationMs({ startedAt: 5_000, now: 4_000 }), 0);
});
