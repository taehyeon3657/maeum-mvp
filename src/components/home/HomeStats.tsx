"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/src/lib/supabase";

export default function HomeStats() {
  const [quoteCount, setQuoteCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const supabase = createClient();
      const { count } = await supabase
        .from("quotes")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      if (count !== null) setQuoteCount(count);
    };
    fetchCount();
  }, []);

  const displayCount =
    quoteCount !== null ? `${quoteCount.toLocaleString()}개` : "···";

  return (
    <div className="stats-row">
      <div className="stat-item">
        <div className="stat-num">{displayCount}</div>
        <div className="stat-label">큐레이션 글귀</div>
      </div>
      <div className="stat-item">
        <div className="stat-num">매일</div>
        <div className="stat-label">새 글귀 업데이트</div>
      </div>
      <div className="stat-item">
        <div className="stat-num">무료</div>
        <div className="stat-label">가입 없이 시작</div>
      </div>
    </div>
  );
}
