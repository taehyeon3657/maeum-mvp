import assert from "node:assert/strict";
import test from "node:test";
import { buildMindCard, emotionIdFromTags } from "../src/lib/mindCardCore.mjs";

test("emotion tags map to one primary feeling", () => {
  assert.equal(emotionIdFromTags(["위로", "성장"]), "growth");
  assert.equal(emotionIdFromTags(["calm"]), "rest");
  assert.equal(emotionIdFromTags(["없는태그"]), null);
});

test("mind card summarizes liked quotes and keeps the matching sentence", () => {
  const card = buildMindCard({
    reads: [
      {
        action: "like",
        durationMs: 400,
        emotionTags: ["위로"],
        quote: { id: "short", content: "짧은 위로", author: "가" },
      },
      {
        action: "like",
        durationMs: 2_000,
        emotionTags: ["위로", "치유"],
        quote: { id: "long", content: "오래 머문 위로", author: null },
      },
      {
        action: "dislike",
        durationMs: 9_000,
        emotionTags: ["동기"],
        quote: { id: "skip", content: "지나간 문장", author: "나" },
      },
    ],
    prefs: { mbti: "INFP" },
  });

  assert.equal(card.headline, "이번 마음은 위로 100%");
  assert.equal(card.percent, 100);
  assert.equal(card.quote.id, "long");
  assert.equal(card.mbti, "INFP");
  assert.equal(card.likeCount, 2);
  assert.equal(card.readCount, 3);
});

test("mind card falls back to the longest sentence when tags are missing", () => {
  const card = buildMindCard({
    reads: [
      { action: "dislike", durationMs: 100, emotionTags: [], quote: { id: "a", content: "하나", author: null } },
      { action: "dislike", durationMs: 800, emotionTags: [], quote: { id: "b", content: "둘", author: null } },
    ],
  });

  assert.equal(card.headline, "가장 오래 머문 한 줄");
  assert.equal(card.quote.content, "둘");
  assert.equal(card.percent, null);
});
