import assert from "node:assert/strict";
import test from "node:test";
import {
  dedupePreviewItems,
  matchesPreviewFilters,
  normalizeEmotionTags,
} from "../src/lib/previewBackgroundsCore.mjs";

const item = {
  quote: {
    id: "quote-a",
    content: "오늘 하루도 잘 버텼습니다.",
    author: "마음",
    source: "테스트",
  },
  category: "위로",
  motif: "햇살",
  imageUrl: null,
};

test("preview emotion tags are normalized from string or array input", () => {
  assert.deepEqual(normalizeEmotionTags('["calm","rest"]'), ["calm", "rest"]);
  assert.deepEqual(normalizeEmotionTags(["calm"]), ["calm"]);
  assert.deepEqual(normalizeEmotionTags("{bad json"), []);
  assert.deepEqual(normalizeEmotionTags(null), []);
});

test("preview items keep the first item for each quote id", () => {
  const items = [
    item,
    { ...item, quote: { ...item.quote, content: "중복", id: "quote-a" } },
    { ...item, quote: { ...item.quote, id: "quote-b" } },
  ];

  assert.deepEqual(
    dedupePreviewItems(items).map((previewItem) => previewItem.quote.content),
    ["오늘 하루도 잘 버텼습니다.", "오늘 하루도 잘 버텼습니다."],
  );
});

test("preview filters match category, motif, and visible quote text", () => {
  assert.equal(
    matchesPreviewFilters(item, { query: "하루", category: "위로", motif: "햇살" }),
    true,
  );
  assert.equal(
    matchesPreviewFilters(item, { query: "마음", category: "all", motif: "all" }),
    true,
  );
  assert.equal(
    matchesPreviewFilters(item, { query: "", category: "성장", motif: "햇살" }),
    false,
  );
  assert.equal(
    matchesPreviewFilters(item, { query: "없는말", category: "all", motif: "all" }),
    false,
  );
});
