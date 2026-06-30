"use client";

// ─────────────────────────────────────────────────────────────
// 문구 배경 미리보기 갤러리 (URL 접근 가능 · 조회 전용)
//
// 모든 문구의 배경을 한 화면에서 확인하기 위한 개발용 페이지.
// - quotes 테이블을 "조회(select)만" 한다. insert/update/카운트 증가·스와이프
//   로깅 등 DB 적재는 일절 하지 않는다 (saveUserQuote 등 미사용).
// - 프로덕션 빌드에서는 노출되지 않도록 NODE_ENV 로 가드한다.
// ─────────────────────────────────────────────────────────────

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/src/lib/supabase";
import type { Quote } from "@/src/models/feed";
import QuoteCard from "@/src/components/feed/QuoteCard";
import { getQuoteBackground } from "@/src/lib/quoteBackground";
import { resolveQuoteImages } from "@/src/hooks/useQuoteImage";
import {
  dedupePreviewItems,
  matchesPreviewFilters,
  normalizeEmotionTags,
} from "@/src/lib/previewBackgroundsCore.mjs";

const PAGE_SIZE = 15;

interface PreviewItem {
  quote: Quote;
  category: string;
  motif: string;
  imageUrl: string | null;
}

export default function BackgroundsPreviewPage() {
  const [items, setItems] = useState<PreviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [motif, setMotif] = useState<string>("all");
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef(0);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const mountedRef = useRef(true);

  const loadNextPage = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    const from = offsetRef.current;
    const to = from + PAGE_SIZE - 1;
    const isInitialLoad = from === 0;
    loadingRef.current = true;

    if (mountedRef.current) {
      if (isInitialLoad) setLoading(true);
      else setLoadingMore(true);
    }

    const supabase = createClient();
    // 읽기 전용: 활성 문구를 15개씩 조회하고, 이미지 성공/실패 resolve 후 화면에 붙인다.
    const { data, error, count } = await supabase
      .from("quotes")
      .select("id, content, author, source, emotion_tags, has_image", {
        count: "exact",
      })
      .eq("is_active", true)
      .order("has_image", { ascending: false })
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(from, to);

    if (!mountedRef.current) return;

    if (error) {
      setError(error.message);
      setLoading(false);
      setLoadingMore(false);
      hasMoreRef.current = false;
      setHasMore(false);
      loadingRef.current = false;
      return;
    }

    const normalized: Quote[] = (data ?? []).map((row) => ({
      ...row,
      emotion_tags:
        typeof row.emotion_tags === "string"
          ? normalizeEmotionTags(row.emotion_tags)
          : row.emotion_tags ?? [],
    })) as Quote[];

    const images = await resolveQuoteImages(normalized);
    const resolvedItems = normalized.map((quote, index) => {
      const bg = getQuoteBackground(quote);
      return {
        quote,
        category: bg.category,
        motif: bg.motif,
        imageUrl: images[index]?.url ?? null,
      };
    });

    if (!mountedRef.current) return;

    const nextOffset = from + normalized.length;
    const nextHasMore =
      normalized.length === PAGE_SIZE &&
      (typeof count !== "number" || nextOffset < count);

    setItems((current) => dedupePreviewItems([...current, ...resolvedItems]));
    setTotalCount(count ?? null);
    setError(null);
    setLoading(false);
    setLoadingMore(false);
    setHasMore(nextHasMore);
    offsetRef.current = nextOffset;
    hasMoreRef.current = nextHasMore;
    loadingRef.current = false;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    void loadNextPage();
    return () => {
      mountedRef.current = false;
    };
  }, [loadNextPage]);

  useEffect(() => {
    if (!hasMore) return;
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void loadNextPage();
      },
      { rootMargin: "1200px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadNextPage]);

  const categories = useMemo(
    () => ["all", ...uniqueSorted(items.map((i) => i.category))],
    [items]
  );
  const motifs = useMemo(
    () => ["all", ...uniqueSorted(items.map((i) => i.motif))],
    [items]
  );

  const filtered = useMemo(() => {
    return items.filter((item) =>
      matchesPreviewFilters(item, { query: q, category: cat, motif }),
    );
  }, [items, q, cat, motif]);

  return (
    <div className="min-h-dvh bg-background">
      {/* 헤더 / 컨트롤 — fixed 라 카드 크기에 영향 없음.
          상태바에 겹치지 않게 상단 안전영역만큼 패딩 추가(바 배경은 상태바까지 덮음) */}
      <header
        className="fixed top-0 left-0 right-0 z-30 bg-[rgba(255,254,252,0.92)] backdrop-blur-md border-b border-primary/10 px-5 py-3"
        style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top, 0px))" }}
      >
        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="font-quote text-lg font-extrabold text-textMain tracking-tight">
            배경 미리보기
          </h1>
          <span className="font-sans text-xs text-textMuted">
            {loading && items.length === 0
              ? "불러오는 중…"
              : `${filtered.length} / ${items.length}개 로드${
                  totalCount !== null ? ` (${totalCount}개 중)` : ""
                }`}
          </span>
          <span className="font-sans text-[10px] text-primary/60 ml-auto tracking-wide">
            조회 전용 · DB 적재 없음
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="문구·작가·출처 검색"
            className="flex-1 min-w-[180px] px-3 py-1.5 rounded-lg border border-primary/15 bg-white/70 font-sans text-sm outline-none focus:border-primary/40"
          />
          <Select value={cat} onChange={setCat} options={categories} label="카테고리" />
          <Select value={motif} onChange={setMotif} options={motifs} label="모티프" />
        </div>
      </header>

      {error && (
        <Centered>
          <p className="font-quote text-lg text-textMain">조회할 수 없어요</p>
          <p className="font-sans text-sm text-textMuted mt-2">{error}</p>
        </Centered>
      )}

      {/* 피드와 동일 크기의 카드 — 한 화면에 하나씩, 스크롤로 넘김 */}
      <main>
        {loading && items.length === 0 && !error && (
          <Centered>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
                <div className="absolute inset-3 rounded-full bg-primary/20" />
              </div>
              <p className="font-quote text-xl text-textMuted animate-pulse">
                문구와 이미지를 준비하는 중...
              </p>
            </div>
          </Centered>
        )}

        {filtered.map(({ quote, category, motif, imageUrl }) => (
          <FeedFrame
            key={quote.id}
            quote={quote}
            category={category}
            motif={motif}
            imageUrl={imageUrl}
          />
        ))}

        {!loading && !loadingMore && !error && filtered.length === 0 && (
          <p className="text-center font-sans text-sm text-textMuted py-20">
            조건에 맞는 문구가 없어요.
          </p>
        )}

        {hasMore && (
          <div
            ref={sentinelRef}
            className="flex items-center justify-center py-10"
          >
            {loadingMore && (
              <p className="font-sans text-xs text-textMuted">
                다음 문구를 준비하는 중...
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// 피드(/feed)의 레이아웃 골격을 그대로 복제해 카드를 "완전히 같은 크기"로 렌더.
// 헤더·진행도트 영역은 보이지 않게(invisible) 높이만 차지시켜 카드 영역이
// 피드와 픽셀 단위로 동일해진다. (feed/page.tsx + FeedStack.tsx 구조 일치)
function FeedFrame({
  quote,
  category,
  motif,
  imageUrl,
}: {
  quote: Quote;
  category: string;
  motif: string;
  imageUrl: string | null;
}) {
  return (
    <div className="h-dvh flex flex-col bg-background overflow-hidden relative">
      {/* 피드 헤더와 동일한 높이 확보 (비표시) */}
      <header
        className="flex-none flex items-center justify-center px-6 pt-8 pb-2 invisible"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-0.5">
          <h1 className="font-quote text-[1.5rem] font-extrabold tracking-[0.12em]">
            마음
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-px w-8" />
            <span className="font-sans text-[10px] tracking-[0.2em]">MAEUM</span>
            <div className="h-px w-8" />
          </div>
        </div>
      </header>

      {/* FeedStack 의 카드 스택 영역과 동일한 여백/구조 */}
      <div className="flex-1 min-h-0 flex flex-col overflow-x-hidden">
        <div className="flex-1 min-h-0 relative mx-4 mt-3 mb-2 overflow-hidden">
          {/* 피드의 SwipeCard(absolute inset-0)와 동일하게 채움 */}
          <div className="absolute inset-0">
            <QuoteCard quote={quote} imageUrl={imageUrl} />
          </div>
          {/* 메타 오버레이 (크기에 영향 없음) */}
          <div className="absolute top-2 left-2 z-20 flex items-center gap-2 px-2 py-0.5 rounded-full bg-black/35 backdrop-blur-sm pointer-events-none">
            <span className="font-sans text-[10px] text-white/90 tracking-wide">
              {category} · {motif}
            </span>
            <code className="font-mono text-[9px] text-white/55">
              {quote.id.slice(0, 8)}
            </code>
          </div>
        </div>
        {/* 진행 도트 영역과 동일한 높이 확보 (비표시) */}
        <div
          className="flex-none flex items-center justify-center gap-[6px] py-4 invisible"
          aria-hidden
        >
          <div className="h-[5px] w-5 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ── helpers ────────────────────────────────────────────────────
function uniqueSorted(arr: string[]): string[] {
  return [...new Set(arr)].sort();
}

function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-2.5 py-1.5 rounded-lg border border-primary/15 bg-white/70 font-sans text-sm outline-none focus:border-primary/40"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o === "all" ? `${label}: 전체` : o}
        </option>
      ))}
    </select>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center text-center px-6 bg-background">
      {children}
    </div>
  );
}
