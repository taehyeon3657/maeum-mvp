import assert from "node:assert/strict";
import test from "node:test";
import {
  dedupeCollectionItems,
  normalizeCollectionQuote,
  normalizeCollectionRows,
} from "../src/lib/collectionCore.mjs";

test("collection quote normalizes nested quote rows and emotion tags", () => {
  assert.deepEqual(
    normalizeCollectionQuote({
      id: "quote-a",
      content: "문장",
      author: null,
      source: null,
      emotion_tags: '["calm"]',
    }),
    {
      id: "quote-a",
      content: "문장",
      author: null,
      source: null,
      emotion_tags: ["calm"],
    },
  );
  assert.equal(normalizeCollectionQuote(null), null);
});

test("collection rows keep latest liked quote once", () => {
  const rows = [
    {
      created_at: "2026-06-30T10:00:00.000Z",
      quotes: { id: "quote-a", content: "최신", emotion_tags: [] },
    },
    {
      created_at: "2026-06-29T10:00:00.000Z",
      quotes: { id: "quote-a", content: "과거", emotion_tags: [] },
    },
    {
      created_at: "2026-06-28T10:00:00.000Z",
      quotes: { id: "quote-b", content: "다른 글귀", emotion_tags: null },
    },
  ];

  assert.deepEqual(
    normalizeCollectionRows(rows).map((item) => ({
      likedAt: item.likedAt,
      id: item.quote.id,
      content: item.quote.content,
      emotion_tags: item.quote.emotion_tags,
    })),
    [
      {
        likedAt: "2026-06-30T10:00:00.000Z",
        id: "quote-a",
        content: "최신",
        emotion_tags: [],
      },
      {
        likedAt: "2026-06-28T10:00:00.000Z",
        id: "quote-b",
        content: "다른 글귀",
        emotion_tags: [],
      },
    ],
  );
});

test("collection dedupe ignores malformed items", () => {
  assert.deepEqual(
    dedupeCollectionItems([
      { likedAt: "a", quote: { id: "quote-a" } },
      { likedAt: "b", quote: { id: "quote-a" } },
      { likedAt: "c", quote: { id: "" } },
    ]),
    [{ likedAt: "a", quote: { id: "quote-a" } }],
  );
});
