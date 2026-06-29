"use client";

// ─────────────────────────────────────────────────────────────
// 문구 배경 미리보기 갤러리 (로컬 전용)
//
// 모든 문구의 배경을 한 화면에서 확인하기 위한 개발용 페이지.
// - quotes 테이블을 "조회(select)만" 한다. insert/update/카운트 증가·스와이프
//   로깅 등 DB 적재는 일절 하지 않는다 (saveUserQuote 등 미사용).
// - 프로덕션 빌드에서는 노출되지 않도록 NODE_ENV 로 가드한다.
// ─────────────────────────────────────────────────────────────

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/src/lib/supabase";
import type { Quote } from "@/src/models/feed";
import QuoteCard from "@/src/components/feed/QuoteCard";
import { getQuoteBackground } from "@/src/lib/quoteBackground";

const IS_DEV = process.env.NODE_ENV !== "production";

export default function BackgroundsPreviewPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [motif, setMotif] = useState<string>("all");

  useEffect(() => {
    if (!IS_DEV) {
      setLoading(false);
      return;
    }
    (async () => {
      const supabase = createClient();
      // 읽기 전용: 활성 문구 전체 조회 (DB 적재 없음)
      const { data, error } = await supabase
        .from("quotes")
        .select("id, content, author, source, emotion_tags")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        const normalized: Quote[] = (data ?? []).map((row) => ({
          ...row,
          emotion_tags:
            typeof row.emotion_tags === "string"
              ? safeParse(row.emotion_tags)
              : row.emotion_tags ?? [],
        })) as Quote[];
        setQuotes(normalized);
      }
      setLoading(false);
    })();
  }, []);

  // 메타(카테고리·모티프)는 배경 생성기에서 그대로 가져온다
  const items = useMemo(
    () =>
      quotes.map((quote) => {
        const bg = getQuoteBackground(quote);
        return { quote, category: bg.category, motif: bg.motif };
      }),
    [quotes]
  );

  const categories = useMemo(
    () => ["all", ...uniqueSorted(items.map((i) => i.category))],
    [items]
  );
  const motifs = useMemo(
    () => ["all", ...uniqueSorted(items.map((i) => i.motif))],
    [items]
  );

  const filtered = useMemo(() => {
    const needle = q.trim();
    return items.filter((i) => {
      if (cat !== "all" && i.category !== cat) return false;
      if (motif !== "all" && i.motif !== motif) return false;
      if (
        needle &&
        !i.quote.content.includes(needle) &&
        !(i.quote.author || "").includes(needle) &&
        !(i.quote.source || "").includes(needle)
      )
        return false;
      return true;
    });
  }, [items, q, cat, motif]);

  if (!IS_DEV) {
    return (
      <Centered>
        <p className="font-quote text-xl text-textMain">로컬 전용 페이지입니다</p>
        <p className="font-sans text-sm text-textMuted mt-2">
          이 미리보기는 개발 환경에서만 열립니다.
        </p>
      </Centered>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      {/* 헤더 / 컨트롤 */}
      <header className="sticky top-0 z-20 bg-[rgba(255,254,252,0.92)] backdrop-blur-md border-b border-primary/10 px-5 py-3">
        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="font-quote text-lg font-extrabold text-textMain tracking-tight">
            배경 미리보기
          </h1>
          <span className="font-sans text-xs text-textMuted">
            {loading ? "불러오는 중…" : `${filtered.length} / ${items.length}개`}
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

      {/* 그리드 */}
      <main className="px-5 py-6">
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
          {filtered.map(({ quote, category, motif }) => (
            <div key={quote.id} className="flex flex-col gap-1">
              <div className="h-[360px]">
                <QuoteCard quote={quote} />
              </div>
              <div className="flex items-center gap-2 px-1">
                <span className="font-sans text-[10px] text-textMuted/70 tracking-wide">
                  {category} · {motif}
                </span>
                <code className="font-mono text-[9px] text-textMuted/40 ml-auto truncate max-w-[120px]">
                  {quote.id.slice(0, 8)}
                </code>
              </div>
            </div>
          ))}
        </div>

        {!loading && !error && filtered.length === 0 && (
          <p className="text-center font-sans text-sm text-textMuted py-20">
            조건에 맞는 문구가 없어요.
          </p>
        )}
      </main>
    </div>
  );
}

// ── helpers ────────────────────────────────────────────────────
function safeParse(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

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
