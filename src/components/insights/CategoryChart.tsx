"use client";

import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";
import type { CategoryRow } from "@/src/hooks/useInsights";

interface Props { data: CategoryRow[] }

export default function CategoryChart({ data }: Props) {
  const total = data.reduce((s, r) => s + r.like_count + r.dislike_count, 0) || 1;

  const radarData = data.map((r) => ({
    subject: `${r.category_emoji} ${r.category_name}`,
    "호감": r.like_count,
    "비호감": r.dislike_count,
    likeRate: Math.round((r.like_count / (r.like_count + r.dislike_count || 1)) * 100),
  }));

  const topCategory = [...data].sort((a, b) => b.like_count - a.like_count)[0];

  return (
    <section className="bg-white rounded-3xl p-5 shadow-sm border border-primary/8">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🗂️</span>
        <h2 className="font-quote text-base font-extrabold text-textMain">카테고리별 선호도</h2>
      </div>
      <p className="font-sans text-[11px] text-textMuted mb-4 leading-relaxed">
        어떤 주제의 글귀가 가장 많은 공감을 받았는지 보여줘요
      </p>

      {topCategory && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/6 mb-4">
          <span className="text-sm">✦</span>
          <p className="font-sans text-[12px] text-textMain">
            <span className="font-bold text-primary">{topCategory.category_emoji} {topCategory.category_name}</span> 카테고리가{" "}
            가장 많은 호감을 받았어요 ({topCategory.like_count}회)
          </p>
        </div>
      )}

      {/* Radar chart */}
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="#f0ebe1" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#37352f", fontFamily: "var(--font-nsr)" }} />
          <PolarRadiusAxis tick={false} axisLine={false} />
          <Radar name="호감" dataKey="호감" stroke="#e07a5f" fill="#e07a5f" fillOpacity={0.3} strokeWidth={2} />
          <Radar name="비호감" dataKey="비호감" stroke="#2d6a4f" fill="#2d6a4f" fillOpacity={0.15} strokeWidth={1.5} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #f0ebe1", fontSize: 12 }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* 카테고리 카드 목록 */}
      <div className="flex flex-col gap-2 mt-2">
        {data.map((row) => {
          const likeRate = Math.round((row.like_count / (row.like_count + row.dislike_count || 1)) * 100);
          const shareOfTotal = Math.round(((row.like_count + row.dislike_count) / total) * 100);
          return (
            <div key={row.category_name} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-warm/50">
              <span className="text-xl w-7 text-center flex-none">{row.category_emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-sans text-[12px] font-bold text-textMain truncate">{row.category_name}</span>
                  <span className="font-sans text-[11px] text-primary font-bold ml-2 flex-none">호감 {likeRate}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-primary/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${likeRate}%`, background: row.category_color || "#e07a5f" }}
                  />
                </div>
              </div>
              <span className="font-sans text-[10px] text-textMuted flex-none">{shareOfTotal}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
