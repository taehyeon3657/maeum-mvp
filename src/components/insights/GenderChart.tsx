"use client";

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { GenderRow, TopQuote } from "@/src/hooks/useInsights";
import TopQuoteCard from "./TopQuoteCard";

const GENDER_COLOR: Record<string, string> = {
  "남성": "#4a90d9",
  "여성": "#e07a5f",
  "미입력": "#c0b0a0",
  "논바이너리": "#9b59b6",
};

interface Props { data: GenderRow[]; topQuotes: TopQuote[] }

export default function GenderChart({ data, topQuotes }: Props) {
  const likeData = data
    .filter((r) => r.like_count > 0)
    .map((r) => ({
      name: r.gender,
      value: r.like_count,
      color: GENDER_COLOR[r.gender] ?? "#aaa",
      likeRate: r.like_count + r.dislike_count > 0
        ? Math.round((r.like_count / (r.like_count + r.dislike_count)) * 100)
        : 0,
    }));

  const dislikeData = data
    .filter((r) => r.dislike_count > 0)
    .map((r) => ({
      name: r.gender,
      value: r.dislike_count,
      color: GENDER_COLOR[r.gender] ?? "#aaa",
    }));

  const topLiker = [...likeData].sort((a, b) => b.likeRate - a.likeRate)[0];

  return (
    <section className="bg-white rounded-3xl p-5 shadow-sm border border-primary/8">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">♾️</span>
        <h2 className="font-quote text-base font-extrabold text-textMain">성별 선호도</h2>
      </div>
      <p className="font-sans text-[11px] text-textMuted mb-4 leading-relaxed">
        성별로 나뉜 좋아요·별로예요 비율이에요
      </p>

      {topLiker && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/6 mb-4">
          <span className="text-sm">✦</span>
          <p className="font-sans text-[12px] text-textMain">
            <span className="font-bold" style={{ color: topLiker.color }}>{topLiker.name}</span>의 호감률이{" "}
            <span className="font-bold text-primary">{topLiker.likeRate}%</span>로 가장 높아요
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {/* 좋아요 파이 */}
        <div className="flex-1 flex flex-col items-center">
          <p className="font-sans text-[11px] text-textMuted mb-1 font-semibold tracking-wide">좋아요</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={likeData} dataKey="value" cx="50%" cy="50%" innerRadius={34} outerRadius={58} paddingAngle={3}>
                {likeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.88} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #f0ebe1", fontSize: 12 }}
                formatter={(v) => [`${v}회`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1 mt-1">
            {likeData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: d.color }} />
                <span className="font-sans text-[10px] text-textMuted">{d.name} {d.likeRate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 별로예요 파이 */}
        <div className="flex-1 flex flex-col items-center">
          <p className="font-sans text-[11px] text-textMuted mb-1 font-semibold tracking-wide">별로예요</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={dislikeData} dataKey="value" cx="50%" cy="50%" innerRadius={34} outerRadius={58} paddingAngle={3}>
                {dislikeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.45} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #f0ebe1", fontSize: 12 }}
                formatter={(v) => [`${v}회`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1 mt-1">
            {dislikeData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full flex-none opacity-45" style={{ background: d.color }} />
                <span className="font-sans text-[10px] text-textMuted">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TopQuoteCard quotes={topQuotes} label="성별 최애 글귀" badgeColor="#4a90d9" />
    </section>
  );
}
