import assert from "node:assert/strict";
import test from "node:test";
import {
  getQuoteImageCandidateUrl,
  getQuoteImageKey,
  getQuoteImageResolutionFromCache,
} from "../src/lib/quoteImageResolution.mjs";

const resolveUrl = (id) => `https://images.example/${encodeURIComponent(id)}.png`;

test("quote image candidate is skipped only when has_image is explicitly false", () => {
  assert.equal(getQuoteImageCandidateUrl(null, resolveUrl), null);
  assert.equal(
    getQuoteImageCandidateUrl({ id: "quote-a", has_image: false }, resolveUrl),
    null,
  );
  assert.equal(
    getQuoteImageCandidateUrl({ id: "quote-a", has_image: true }, resolveUrl),
    "https://images.example/quote-a.png",
  );
  assert.equal(
    getQuoteImageCandidateUrl({ id: "quote-a" }, resolveUrl),
    "https://images.example/quote-a.png",
  );
});

test("quote image key separates explicit no-image quotes from image candidates", () => {
  assert.equal(
    getQuoteImageKey({ id: "same-id", has_image: false }, resolveUrl),
    "same-id:no-image:https://images.example/same-id.png",
  );
  assert.equal(
    getQuoteImageKey({ id: "same-id", has_image: true }, resolveUrl),
    "same-id:maybe-image:https://images.example/same-id.png",
  );
});

test("cached quote image resolution blocks fallback flash before rendering", () => {
  assert.deepEqual(
    getQuoteImageResolutionFromCache(
      { id: "quote-a", has_image: true },
      resolveUrl,
      () => "loaded",
    ),
    { status: "image", url: "https://images.example/quote-a.png" },
  );

  assert.deepEqual(
    getQuoteImageResolutionFromCache(
      { id: "quote-a", has_image: true },
      resolveUrl,
      () => "failed",
    ),
    { status: "fallback", url: null },
  );

  assert.deepEqual(
    getQuoteImageResolutionFromCache(
      { id: "quote-a", has_image: true },
      resolveUrl,
      () => undefined,
    ),
    { status: "loading", url: null },
  );
});
