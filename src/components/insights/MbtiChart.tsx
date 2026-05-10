"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from "recharts";
import type { MbtiRow, TopQuote } from "@/src/hooks/useInsights";
import TopQuoteCard from "./TopQuoteCard";

const MBTI_GROUP_COLOR: Record<string, string> = {
  // 분석가 (NT)
  INTJ: "#4a6fa5", INTP: "#4a6fa5", ENTJ: "#4a6fa5", ENTP: "#4a6fa5",
  // 외교관 (NF)
  INFJ: "#9b59b6", INFP: "#9b59b6", ENFJ: "#9b59b6", ENFP: "#9b59b6",
  // 관리자 (SJ)
  ISTJ: "#2d6a4f", ISFJ: "#2d6a4f", ESTJ: "#2d6a4f", ESFJ: "#2d6a4f",
  // 탐험가 (SP)
  ISTP: "#e07a5f", ISFP: "#e07a5f", ESTP: "#e07a5f", ESFP: "#e07a5f",
};

interface Props { data: MbtiRow[]; topQuotes: TopQuote[] }

export default function MbtiChart({ data, topQuotes }: Props) {
  const chartData = data.slice(0, 12).map((r) => ({
    name: r.mbti,
    "호감률(%)": Number(r.like_rate),
    like_count: r.like_count,
    color: MBTI_GROUP_COLOR[r.mbti] ?? "#aaa",
  }));

  const top = chartData[0];

  return (
    <section className="bg-white rounded-3xl p-5 shadow-sm border border-primary/8">
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
            <span className="font-bold text-primary">{top["호감률(%)"]}%</span>로 1위예요
          </p>
        </div>
      )}

      {/* MBTI 그룹 범례 */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
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

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} layout="vertical" barCategoryGap="18%" margin={{ left: 4, right: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe1" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#868e96" }} axisLine={false} tickLine={false} unit="%" />
          <YAxis type="category" dataKey="name" width={36} tick={{ fontSize: 11, fill: "#37352f", fontWeight: 700, fontFamily: "var(--font-nsr)" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #f0ebe1", fontSize: 12 }}
            formatter={(v) => [`${v}%`, "호감률"]}
          />
          <Bar dataKey="호감률(%)" radius={[0, 6, 6, 0]} maxBarSize={18}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} fillOpacity={i === 0 ? 1 : 0.65} />
            ))}
            <LabelList dataKey="호감률(%)" position="right" formatter={(v: unknown) => `${v}%`} style={{ fontSize: 10, fill: "#868e96", fontFamily: "var(--font-nsr)" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <TopQuoteCard quotes={topQuotes.slice(0, 3)} label="MBTI별 최애 글귀 TOP 3" badgeColor="#9b59b6" />
    </section>
  );
}
