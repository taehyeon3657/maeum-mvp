"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from "recharts";
import type { MbtiRow, TopQuote } from "@/src/hooks/useInsights";

const MBTI_COLOR: Record<string, string> = {
  INTJ: "#4a6fa5", INTP: "#4a6fa5", ENTJ: "#4a6fa5", ENTP: "#4a6fa5",
  INFJ: "#9b59b6", INFP: "#9b59b6", ENFJ: "#9b59b6", ENFP: "#9b59b6",
  ISTJ: "#2d6a4f", ISFJ: "#2d6a4f", ESTJ: "#2d6a4f", ESFJ: "#2d6a4f",
  ISTP: "#e07a5f", ISFP: "#e07a5f", ESTP: "#e07a5f", ESFP: "#e07a5f",
};

const MBTI_GROUP: Record<string, string> = {
  INTJ: "분석가", INTP: "분석가", ENTJ: "분석가", ENTP: "분석가",
  INFJ: "외교관", INFP: "외교관", ENFJ: "외교관", ENFP: "외교관",
  ISTJ: "관리자", ISFJ: "관리자", ESTJ: "관리자", ESFJ: "관리자",
  ISTP: "탐험가", ISFP: "탐험가", ESTP: "탐험가", ESFP: "탐험가",
};

const RANK_MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

interface Props { data: MbtiRow[]; topQuotes: TopQuote[] }

export default function MbtiChart({ data, topQuotes }: Props) {
  const [openMbti, setOpenMbti] = useState<string | null>(null);

  const chartData = data.map((r) => ({
    name: r.mbti,
    rate: Number(r.like_rate),
    like_count: r.like_count,
    color: MBTI_COLOR[r.mbti] ?? "#aaa",
  }));

  const chartHeight = Math.max(300, chartData.length * 34 + 50);
  const top = chartData[0];

  // group quotes by MBTI
  const quotesByMbti: Record<string, TopQuote[]> = {};
  topQuotes.forEach((q) => {
    if (!quotesByMbti[q.group]) quotesByMbti[q.group] = [];
    quotesByMbti[q.group].push(q);
  });

  const hasAnyQuotes = topQuotes.length > 0;

  return (
    <section className="bg-white rounded-3xl p-5 shadow-sm border border-primary/8">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🧠</span>
        <h2 className="font-quote text-base font-extrabold text-textMain">MBTI별 호감률 순위</h2>
      </div>
      <p className="font-sans text-[11px] text-textMuted mb-4 leading-relaxed">
        MBTI 유형별로 글귀에 얼마나 공감했는지 보여줘요
      </p>

      {top && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/6 mb-4">
          <span className="text-sm">✦</span>
          <p className="font-sans text-[12px] text-textMain">
            <span className="font-bold text-primary">{top.name}</span>이 호감률{" "}
            <span className="font-bold text-primary">{top.rate}%</span>로 1위예요
          </p>
        </div>
      )}

      {/* 범례 */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
        {[
          { label: "분석가 (NT)", color: "#4a6fa5" },
          { label: "외교관 (NF)", color: "#9b59b6" },
          { label: "관리자 (SJ)", color: "#2d6a4f" },
          { label: "탐험가 (SP)", color: "#e07a5f" },
        ].map((g) => (
          <div key={g.label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm" style={{ background: g.color }} />
            <span className="font-sans text-[10px] text-textMuted">{g.label}</span>
          </div>
        ))}
      </div>

      {/* 바 차트 */}
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={chartData}
          layout="vertical"
          barCategoryGap="20%"
          margin={{ left: 4, right: 52, top: 4, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe1" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#868e96" }}
            axisLine={false}
            tickLine={false}
            unit="%"
          />
          <YAxis
            type="category"
            dataKey="name"
            width={38}
            tick={{ fontSize: 11, fill: "#37352f", fontWeight: 700, fontFamily: "var(--font-nsr)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #f0ebe1", fontSize: 12 }}
            formatter={(v) => [`${v}%`, "호감률"]}
          />
          <Bar dataKey="rate" radius={[0, 6, 6, 0]} maxBarSize={16}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={i === 0 ? 1 : 0.6} />
            ))}
            <LabelList
              dataKey="rate"
              position="right"
              formatter={(v: unknown) => `${v}%`}
              style={{ fontSize: 10, fill: "#868e96", fontFamily: "var(--font-nsr)" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* MBTI별 최애 글귀 아코디언 */}
      {hasAnyQuotes && (
        <div className="mt-6">
          {/* 섹션 구분선 */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1" style={{ background: "rgba(224,122,95,0.15)" }} />
            <p className="font-sans text-[10px] tracking-[0.18em] uppercase" style={{ color: "rgba(224,122,95,0.55)" }}>
              MBTI별 최애 글귀 TOP 3
            </p>
            <div className="h-px flex-1" style={{ background: "rgba(224,122,95,0.15)" }} />
          </div>

          <div className="flex flex-col gap-2">
            {chartData.map((item, idx) => {
              const quotes = quotesByMbti[item.name] ?? [];
              if (quotes.length === 0) return null;

              const color = item.color;
              const rank = idx + 1;
              const medal = RANK_MEDAL[rank];
              const isOpen = openMbti === item.name;

              return (
                <div
                  key={item.name}
                  className="rounded-2xl overflow-hidden transition-shadow duration-200"
                  style={{
                    border: `1px solid ${color}28`,
                    boxShadow: isOpen ? `0 4px 16px ${color}18` : "none",
                  }}
                >
                  {/* 아코디언 헤더 */}
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-150"
                    style={{ background: isOpen ? `${color}14` : `${color}08` }}
                    onClick={() => setOpenMbti(isOpen ? null : item.name)}
                  >
                    <div className="flex items-center gap-2.5">
                      {medal ? (
                        <span className="text-[15px] leading-none">{medal}</span>
                      ) : (
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center font-sans text-[10px] font-bold"
                          style={{ background: `${color}22`, color }}
                        >
                          {rank}
                        </span>
                      )}
                      <span
                        className="px-2.5 py-0.5 rounded-full font-sans text-[11px] font-bold text-white"
                        style={{ background: color }}
                      >
                        {item.name}
                      </span>
                      <span className="font-sans text-[11px] text-textMuted">
                        {MBTI_GROUP[item.name]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[12px] font-bold" style={{ color }}>
                        {item.rate}%
                      </span>
                      <span
                        className="font-sans text-[11px] text-textMuted/60 transition-transform duration-200"
                        style={{ display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                      >
                        ▾
                      </span>
                    </div>
                  </button>

                  {/* 아코디언 본문 */}
                  {isOpen && (
                    <div
                      className="px-3 pt-2 pb-3 flex flex-col gap-2"
                      style={{ background: `${color}07` }}
                    >
                      {quotes.map((q, qi) => (
                        <div
                          key={qi}
                          className="rounded-xl px-3.5 py-3 flex flex-col gap-1.5"
                          style={{
                            background: "rgba(255,255,255,0.85)",
                            border: `1px solid ${color}1a`,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className="font-sans text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: `${color}18`, color }}
                            >
                              TOP {qi + 1}
                            </span>
                            <span className="font-sans text-[10px] text-textMuted flex items-center gap-1">
                              <span style={{ color }}>♥</span>{" "}
                              {q.like_count.toLocaleString()}회
                            </span>
                          </div>
                          <p
                            className="font-quote text-[13.5px] text-textMain leading-relaxed"
                            style={{ wordBreak: "keep-all" }}
                          >
                            &ldquo;{q.content}&rdquo;
                          </p>
                          {q.author && (
                            <p className="font-sans text-[10px] text-textMuted text-right">
                              — {q.author}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 하단 안내 */}
          <p className="font-sans text-[10px] text-textMuted/50 text-center mt-3">
            각 MBTI를 탭하면 최애 글귀를 볼 수 있어요
          </p>
        </div>
      )}
    </section>
  );
}
