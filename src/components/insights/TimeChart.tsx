"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import type { HourRow } from "@/src/hooks/useInsights";

const HOUR_LABEL = (h: number) => {
  if (h === 0)  return "자정";
  if (h === 6)  return "새벽";
  if (h === 12) return "정오";
  if (h === 18) return "저녁";
  return `${h}시`;
};

const TIME_ZONE: Record<number, { label: string; emoji: string }> = {
  0: { label: "심야", emoji: "🌙" },
  1: { label: "심야", emoji: "🌙" },
  2: { label: "심야", emoji: "🌙" },
  3: { label: "새벽", emoji: "🌠" },
  4: { label: "새벽", emoji: "🌠" },
  5: { label: "새벽", emoji: "🌠" },
  6: { label: "아침", emoji: "🌅" },
  7: { label: "아침", emoji: "🌅" },
  8: { label: "아침", emoji: "🌅" },
  9: { label: "오전", emoji: "☀️" },
  10: { label: "오전", emoji: "☀️" },
  11: { label: "오전", emoji: "☀️" },
  12: { label: "점심", emoji: "🍱" },
  13: { label: "점심", emoji: "🍱" },
  14: { label: "오후", emoji: "🌤️" },
  15: { label: "오후", emoji: "🌤️" },
  16: { label: "오후", emoji: "🌤️" },
  17: { label: "저녁", emoji: "🌇" },
  18: { label: "저녁", emoji: "🌇" },
  19: { label: "밤", emoji: "🌆" },
  20: { label: "밤", emoji: "🌆" },
  21: { label: "밤", emoji: "🌆" },
  22: { label: "밤늦게", emoji: "🌃" },
  23: { label: "심야", emoji: "🌙" },
};

interface Props { data: HourRow[] }

export default function TimeChart({ data }: Props) {
  // fill 0 for missing hours
  const filled = Array.from({ length: 24 }, (_, h) => {
    const found = data.find((r) => r.hour_of_day === h);
    return {
      hour: h,
      label: HOUR_LABEL(h),
      "좋아요": found?.like_count ?? 0,
      "별로예요": found?.dislike_count ?? 0,
      total: (found?.like_count ?? 0) + (found?.dislike_count ?? 0),
    };
  });

  const peakHour = [...filled].sort((a, b) => b["좋아요"] - a["좋아요"])[0];
  const peakZone = TIME_ZONE[peakHour?.hour ?? 0];

  return (
    <section className="bg-white rounded-3xl p-5 shadow-sm border border-primary/8">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">⏰</span>
        <h2 className="font-quote text-base font-extrabold text-textMain">시간대별 인기도</h2>
      </div>
      <p className="font-sans text-[11px] text-textMuted mb-4 leading-relaxed">
        어떤 시간대에 가장 많이 공감이 갔는지 보여줘요 (KST)
      </p>

      {peakHour && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/6 mb-4">
          <span className="text-base">{peakZone?.emoji}</span>
          <p className="font-sans text-[12px] text-textMain">
            <span className="font-bold text-primary">{peakHour.hour}시 {peakZone?.label}</span>에 글귀 호감이 가장 많았어요
          </p>
        </div>
      )}

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={filled} margin={{ top: 5, right: 5, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="likeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#e07a5f" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#e07a5f" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="dislikeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2d6a4f" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe1" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: "#868e96" }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis tick={{ fontSize: 10, fill: "#868e96" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #f0ebe1", fontSize: 12 }}
            labelFormatter={(label, payload) => {
              const h = payload?.[0]?.payload?.hour;
              return `${h}시 ${TIME_ZONE[h]?.emoji ?? ""} ${TIME_ZONE[h]?.label ?? ""}`;
            }}
          />
          {peakHour && (
            <ReferenceLine
              x={peakHour.label}
              stroke="#e07a5f"
              strokeDasharray="4 2"
              strokeOpacity={0.6}
            />
          )}
          <Area type="monotone" dataKey="좋아요" stroke="#e07a5f" strokeWidth={2} fill="url(#likeGrad)" dot={false} activeDot={{ r: 4, fill: "#e07a5f" }} />
          <Area type="monotone" dataKey="별로예요" stroke="#2d6a4f" strokeWidth={1.5} fill="url(#dislikeGrad)" dot={false} activeDot={{ r: 4, fill: "#2d6a4f" }} />
        </AreaChart>
      </ResponsiveContainer>

      {/* 시간대 구간 요약 */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {[
          { label: "아침\n6-9시",   hours: [6,7,8],          emoji: "🌅" },
          { label: "낮\n9-18시",    hours: [9,10,11,12,13,14,15,16,17], emoji: "☀️" },
          { label: "저녁\n18-22시", hours: [18,19,20,21],     emoji: "🌇" },
          { label: "심야\n22-6시",  hours: [22,23,0,1,2,3,4,5], emoji: "🌙" },
        ].map((zone) => {
          const likes = zone.hours.reduce((s, h) => s + (filled[h]?.["좋아요"] ?? 0), 0);
          return (
            <div key={zone.label} className="flex flex-col items-center gap-1 px-2 py-2.5 rounded-2xl bg-warm/60">
              <span className="text-base">{zone.emoji}</span>
              <span className="font-sans text-[9px] text-textMuted text-center whitespace-pre-line leading-tight">{zone.label}</span>
              <span className="font-sans text-[12px] font-bold text-primary">{likes}</span>
              <span className="font-sans text-[9px] text-textMuted">호감</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
