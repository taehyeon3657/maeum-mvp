"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell,
} from "recharts";
import type { AgeRow } from "@/src/hooks/useInsights";

const AGE_ORDER = ["10대", "20대", "30대", "40대", "50대 이상", "미입력"];

interface Props { data: AgeRow[] }

export default function AgeChart({ data }: Props) {
  const sorted = [...data].sort(
    (a, b) => AGE_ORDER.indexOf(a.age_group) - AGE_ORDER.indexOf(b.age_group)
  );

  const chartData = sorted.map((r) => ({
    name: r.age_group,
    "좋아요": r.like_count,
    "별로예요": r.dislike_count,
    likeRate: r.like_count + r.dislike_count > 0
      ? Math.round((r.like_count / (r.like_count + r.dislike_count)) * 100)
      : 0,
  }));

  const topAge = [...chartData].sort((a, b) => b["좋아요"] - a["좋아요"])[0];

  return (
    <section className="bg-white rounded-3xl p-5 shadow-sm border border-primary/8">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">👥</span>
        <h2 className="font-quote text-base font-extrabold text-textMain">연령대별 반응</h2>
      </div>
      <p className="font-sans text-[11px] text-textMuted mb-4 leading-relaxed">
        각 연령대가 글귀에 보인 호감·비호감 반응이에요
      </p>

      {topAge && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/6 mb-4">
          <span className="text-sm">✦</span>
          <p className="font-sans text-[12px] text-textMain">
            <span className="font-bold text-primary">{topAge.name}</span>이 가장 많이 좋아했어요 — 호감률{" "}
            <span className="font-bold text-primary">{topAge.likeRate}%</span>
          </p>
        </div>
      )}

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe1" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#868e96", fontFamily: "var(--font-nsr)" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#868e96" }} axisLine={false} tickLine={false} width={28} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #f0ebe1", fontSize: 12, fontFamily: "var(--font-nsr)" }}
            cursor={{ fill: "rgba(224,122,95,0.05)" }}
          />
          <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-nsr)" }} />
          <Bar dataKey="좋아요" fill="#e07a5f" radius={[6, 6, 0, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill="#e07a5f" fillOpacity={0.85} />)}
          </Bar>
          <Bar dataKey="별로예요" fill="#2d6a4f" radius={[6, 6, 0, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill="#2d6a4f" fillOpacity={0.55} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
