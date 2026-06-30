import assert from "node:assert/strict";
import test from "node:test";
import {
  dedupeQuotesById,
  mergeSeenQuoteIds,
  normalizeQuoteIds,
  parseSeenQuoteIds,
} from "../src/lib/feedQuotesCore.mjs";

test("feed seen quote ids are parsed as clean string arrays", () => {
  assert.deepEqual(parseSeenQuoteIds('["a","",3,"b"]'), ["a", "b"]);
  assert.deepEqual(parseSeenQuoteIds("{bad json"), []);
  assert.deepEqual(parseSeenQuoteIds(null), []);
  assert.deepEqual(normalizeQuoteIds(["a", null, "b"]), ["a", "b"]);
});

test("feed seen quote ids keep newest unique ids within the max cap", () => {
  assert.deepEqual(
    mergeSeenQuoteIds(["a", "b", "c"], ["b", "d", "e"], 4),
    ["c", "b", "d", "e"],
  );
  assert.deepEqual(
    mergeSeenQuoteIds(["a", "b", "c"], ["b", "d", "e"], 3),
    ["b", "d", "e"],
  );
  assert.deepEqual(mergeSeenQuoteIds(["a"], ["b"], 0), []);
});

test("feed quotes are deduped by id while preserving first occurrence order", () => {
  const quotes = [
    { id: "a", content: "first" },
    { id: "b", content: "second" },
    { id: "a", content: "duplicate" },
  ];

  assert.deepEqual(dedupeQuotesById(quotes), [
    { id: "a", content: "first" },
    { id: "b", content: "second" },
  ]);
});
