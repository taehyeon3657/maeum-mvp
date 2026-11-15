import assert from "node:assert/strict";
import test from "node:test";
import { quoteOgPath, quotePublicPath, quoteShareText } from "../src/lib/quoteShareCore.mjs";

test("quote links point at the public quote page", () => {
  assert.equal(quotePublicPath("quote-1"), "/q/quote-1");
  assert.equal(quotePublicPath("quote-1", { gift: true }), "/q/quote-1?gift=1");
  assert.equal(quotePublicPath(""), "/");
  assert.equal(quoteOgPath("a b"), "/api/og/quote/a%20b");
});

test("quote share text keeps the sentence and the gift framing", () => {
  assert.match(quoteShareText({ content: "천천히 가도 된다", gift: true }), /건네고 싶었어요/);
  assert.match(quoteShareText({ content: "천천히 가도 된다" }), /마음에서 만났어요/);
  assert.equal(quoteShareText({ content: "" }), "마음에서 글귀 한 장을 만났어요.");
});
