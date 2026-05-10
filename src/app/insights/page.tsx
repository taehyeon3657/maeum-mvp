"use client";

import { useInsights } from "@/src/hooks/useInsights";
import AgeChart from "@/src/components/insights/AgeChart";
import GenderChart from "@/src/components/insights/GenderChart";
import MbtiChart from "@/src/components/insights/MbtiChart";
import CategoryChart from "@/src/components/insights/CategoryChart";
import TimeChart from "@/src/components/insights/TimeChart";

export default function InsightsPage() {
  const { data, loading, error } = useInsights();

  return (
    <div
      className="min-h-dvh flex flex-col"
      style={{ background: "var(--color-background)" }}
    >
      {/* 헤더 */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-4"
        style={{ background: "rgba(255,254,252,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(224,122,95,0.08)" }}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => history.back()}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(224,122,95,0.08)" }}
            aria-label="뒤로가기"
          >
            <span className="text-sm text-primary">←</span>
          </button>
          <span className="font-quote text-base font-extrabold text-textMain tracking-tight">마음 인사이트</span>
        </div>
        <span className="font-sans text-[11px] text-textMuted/70 tracking-widest">INSIGHTS ✦</span>
      </header>

      {/* 히어로 배너 */}
      <div className="px-5 pt-6 pb-4">
        <div className="rounded-3xl overflow-hidden px-6 py-5 relative"
          style={{ background: "linear-gradient(135deg, #e07a5f 0%, #f4a261 60%, #2d6a4f 100%)" }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <p className="font-quote text-white text-[1.4rem] font-extrabold leading-snug mb-1 relative">
            모두의 마음<br />한눈에 보기
          </p>
          <p className="font-sans text-white/80 text-[11px] leading-relaxed relative">
            글귀에 반응한 모든 사람들의 데이터로<br />만든 인사이트예요
          </p>
          <div className="flex gap-2 mt-3 relative">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white/90"
              style={{ background: "rgba(255,255,255,0.2)" }}>📊 실시간 데이터</span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white/90"
              style={{ background: "rgba(255,255,255,0.2)" }}>🔒 익명 집계</span>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <main className="flex-1 px-5 pb-10 flex flex-col gap-5">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-primary/10" />
            </div>
            <p className="font-quote text-lg text-textMuted animate-pulse">데이터 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-4xl">😔</span>
            <p className="font-quote text-xl text-textMain">데이터를 불러올 수 없어요</p>
            <p className="font-sans text-sm text-textMuted">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold"
              style={{ background: "#e07a5f" }}
            >
              다시 시도
            </button>
          </div>
        )}

        {data && !loading && (
          <>
            {/* 섹션 라벨 */}
            <SectionLabel emoji="🙋" title="누가 공감했을까?" subtitle="연령·성별·MBTI 별로 살펴봐요" />

            {data.age.length > 0 && <AgeChart data={data.age} topQuotes={data.topQuoteByAge} />}

            {data.gender.length > 0 && <GenderChart data={data.gender} topQuotes={data.topQuoteByGender} />}

            {data.mbti.length > 0 && <MbtiChart data={data.mbti} topQuotes={data.topQuoteByMbti} />}

            <SectionLabel emoji="📚" title="어떤 주제가 인기였을까?" subtitle="카테고리별 호감 비율이에요" />

            {data.category.length > 0 && <CategoryChart data={data.category} topQuotes={data.topQuoteByCategory} />}

            <SectionLabel emoji="🕐" title="언제 가장 많이 읽었을까?" subtitle="시간대별 반응 흐름이에요" />

            {data.hour.length > 0 && <TimeChart data={data.hour} />}

            {/* 데이터 없음 안내 */}
            {data.age.length === 0 && data.category.length === 0 && data.hour.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="text-4xl">📭</span>
                <p className="font-quote text-xl text-textMain">아직 데이터가 부족해요</p>
                <p className="font-sans text-sm text-textMuted">
                  글귀를 더 많이 읽을수록<br />더 풍부한 인사이트가 쌓여요
                </p>
              </div>
            )}

            {/* 하단 CTA */}
            <div className="rounded-3xl bg-warm border border-primary/12 px-5 py-5 flex flex-col items-center gap-3 text-center">
              <span className="text-2xl">✨</span>
              <p className="font-quote text-[1.1rem] text-textMain font-extrabold leading-snug">
                내일도 글귀와<br />함께해요
              </p>
              <p className="font-sans text-[12px] text-textMuted leading-relaxed">
                매일 새로운 글귀가 쌓일수록<br />더 풍부한 인사이트를 볼 수 있어요
              </p>
              <button
                onClick={() => (window.location.href = "/feed")}
                className="px-6 py-3 rounded-2xl text-white font-sans text-sm font-bold tracking-wider shadow-lg"
                style={{ background: "#e07a5f", boxShadow: "0 4px 16px rgba(224,122,95,0.3)" }}
              >
                오늘의 글귀 보러 가기
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function SectionLabel({ emoji, title, subtitle }: { emoji: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span className="text-xl">{emoji}</span>
      <div>
        <p className="font-quote text-[15px] font-extrabold text-textMain leading-tight">{title}</p>
        <p className="font-sans text-[11px] text-textMuted">{subtitle}</p>
      </div>
    </div>
  );
}
