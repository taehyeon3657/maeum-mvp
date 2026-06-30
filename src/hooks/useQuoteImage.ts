"use client";

import { useEffect, useState } from "react";
import { quoteImageUrl } from "@/src/lib/quoteImage";
import {
  getQuoteImageCandidateUrl,
  getQuoteImageKey,
  getQuoteImageResolutionFromCache,
} from "@/src/lib/quoteImageResolution.mjs";
import type { Quote } from "@/src/models/feed";

export type QuoteImageResolution =
  | { status: "loading"; url: null }
  | { status: "image"; url: string }
  | { status: "fallback"; url: null };

type CachedImageState = "loaded" | "failed" | Promise<"loaded" | "failed">;

const IMAGE_LOAD_TIMEOUT_MS = 10_000;
const imageCache = new Map<string, CachedImageState>();

function candidateImageUrl(quote: Quote | null): string | null {
  return getQuoteImageCandidateUrl(quote, quoteImageUrl);
}

function imageKey(quote: Quote | null): string | null {
  return getQuoteImageKey(quote, quoteImageUrl);
}

function cachedResolution(quote: Quote | null): QuoteImageResolution {
  return getQuoteImageResolutionFromCache(quote, quoteImageUrl, (url) =>
    imageCache.get(url),
  );
}

function loadImageUrl(url: string): Promise<boolean> {
  const cached = imageCache.get(url);
  if (cached === "loaded") return Promise.resolve(true);
  if (cached === "failed") return Promise.resolve(false);
  if (cached) return cached.then((state) => state === "loaded");

  const promise = new Promise<"loaded" | "failed">((resolve) => {
    const img = new Image();
    let settled = false;
    const timeoutId = window.setTimeout(() => settle("failed"), IMAGE_LOAD_TIMEOUT_MS);

    const settle = (state: "loaded" | "failed") => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      imageCache.set(url, state);
      resolve(state);
    };

    const finishLoaded = () => {
      if (typeof img.decode !== "function") {
        settle("loaded");
        return;
      }
      img.decode().catch(() => undefined).then(() => settle("loaded"));
    };

    img.onload = finishLoaded;
    img.onerror = () => settle("failed");
    img.src = url;

    if (img.complete) {
      if (img.naturalWidth > 0) {
        finishLoaded();
      } else {
        settle("failed");
      }
    }
  });

  imageCache.set(url, promise);
  return promise.then((state) => state === "loaded");
}

export async function resolveQuoteImage(
  quote: Quote | null,
): Promise<QuoteImageResolution> {
  const url = candidateImageUrl(quote);
  if (!url || typeof window === "undefined") {
    return { status: "fallback", url: null };
  }

  const loaded = await loadImageUrl(url);
  return loaded ? { status: "image", url } : { status: "fallback", url: null };
}

export async function resolveQuoteImages(
  quotes: readonly Quote[],
): Promise<QuoteImageResolution[]> {
  return Promise.all(quotes.map((quote) => resolveQuoteImage(quote)));
}

export function useResolvedQuoteImage(quote: Quote | null): QuoteImageResolution {
  const key = imageKey(quote);
  const immediateResolution = cachedResolution(quote);
  const [state, setState] = useState<{
    key: string | null;
    resolution: QuoteImageResolution;
  }>(() => ({
    key,
    resolution: immediateResolution,
  }));

  useEffect(() => {
    let alive = true;
    const currentResolution = cachedResolution(quote);

    if (currentResolution.status !== "loading") return;

    void resolveQuoteImage(quote).then((resolution) => {
      if (!alive) return;
      setState({ key, resolution });
    });

    return () => {
      alive = false;
    };
  }, [key, quote]);

  return state.key === key ? state.resolution : immediateResolution;
}

export function usePreloadQuoteImage(quote: Quote | null) {
  const key = imageKey(quote);

  useEffect(() => {
    if (!key) return;
    void resolveQuoteImage(quote);
  }, [key, quote]);
}
