const DAY_MS = 86_400_000;

export function seoulDateKey(timestamp) {
  if (!Number.isFinite(timestamp)) return null;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(timestamp);
  return /^\d{4}-\d{2}-\d{2}$/.test(parts) ? parts : null;
}

export function previousDateKey(dateKey) {
  if (typeof dateKey !== "string") return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return null;
  const utc = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) - DAY_MS;
  const date = new Date(utc);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function advanceStreak(previous, completedOn) {
  const count = Number.isFinite(previous?.count) ? previous.count : 0;
  const lastDate = typeof previous?.lastDate === "string" ? previous.lastDate : null;

  if (typeof completedOn !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(completedOn)) {
    return { lastDate, count: Math.max(0, count) };
  }

  if (!lastDate || count < 1) return { lastDate: completedOn, count: 1 };
  if (lastDate === completedOn) return { lastDate: completedOn, count };
  if (lastDate === previousDateKey(completedOn)) {
    return { lastDate: completedOn, count: count + 1 };
  }
  return { lastDate: completedOn, count: 1 };
}
