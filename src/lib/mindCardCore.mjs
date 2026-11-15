const EMOTIONS = {
  love: { label: "사랑", emoji: "💗" },
  growth: { label: "성장", emoji: "✨" },
  motivation: { label: "동기", emoji: "🔥" },
  comfort: { label: "위로", emoji: "🤍" },
  rest: { label: "쉼", emoji: "🌿" },
  daily: { label: "일상", emoji: "🌤" },
  drama: { label: "몰입", emoji: "🎭" },
};

const PRIORITY = ["love", "growth", "motivation", "comfort", "rest", "daily", "drama"];

const TAG_TO_EMOTION = {
  사랑: "love",
  우정: "love",
  love: "love",
  성장: "growth",
  growth: "growth",
  동기: "motivation",
  노력: "motivation",
  도전: "motivation",
  motivation: "motivation",
  위로: "comfort",
  치유: "comfort",
  희망: "comfort",
  comfort: "comfort",
  쉼: "rest",
  여유: "rest",
  휴식: "rest",
  calm: "rest",
  rest: "rest",
  일상: "daily",
  감사: "daily",
  daily: "daily",
  명대사: "drama",
  drama: "drama",
};

export function emotionIdFromTags(tags) {
  const found = new Set();
  for (const tag of Array.isArray(tags) ? tags : []) {
    const id = TAG_TO_EMOTION[String(tag).trim()];
    if (id) found.add(id);
  }
  return PRIORITY.find((id) => found.has(id)) ?? null;
}

function pickLongest(rows) {
  if (rows.length === 0) return null;
  return rows.reduce((best, row) =>
    Number(row?.durationMs) > Number(best?.durationMs) ? row : best,
  );
}

function quoteFromRow(row) {
  const quote = row?.quote;
  if (!quote || typeof quote.content !== "string" || quote.content.trim().length === 0) {
    return null;
  }
  return {
    id: typeof quote.id === "string" ? quote.id : "",
    content: quote.content.trim(),
    author: typeof quote.author === "string" && quote.author.trim() ? quote.author.trim() : null,
  };
}

export function buildMindCard({ reads, prefs } = {}) {
  const list = Array.isArray(reads) ? reads.filter(Boolean) : [];
  const liked = list.filter((row) => row.action === "like");
  const basis = liked.length > 0 ? liked : list;
  const mbti = typeof prefs?.mbti === "string" ? prefs.mbti.trim() : "";

  const counts = {};
  for (const row of basis) {
    const emotionId = emotionIdFromTags(row.emotionTags);
    if (!emotionId) continue;
    counts[emotionId] = (counts[emotionId] ?? 0) + 1;
  }

  let emotionId = null;
  let dominantCount = 0;
  for (const id of PRIORITY) {
    const count = counts[id] ?? 0;
    if (count > dominantCount) {
      emotionId = id;
      dominantCount = count;
    }
  }

  const emotion = emotionId ? EMOTIONS[emotionId] : null;
  const percent = emotion && basis.length > 0
    ? Math.round((dominantCount / basis.length) * 100)
    : null;

  const matching = emotionId
    ? basis.filter((row) => emotionIdFromTags(row.emotionTags) === emotionId)
    : basis;
  const anchor = pickLongest(matching.length > 0 ? matching : basis);
  const quote = anchor ? quoteFromRow(anchor) : null;

  if (basis.length === 0) {
    return {
      headline: "아직 마음이 모이지 않았어요",
      detail: "글귀를 만나면 여기에 한 장으로 모여요.",
      emoji: "✦",
      emotionId: null,
      percent: null,
      mbti,
      quote: null,
      likeCount: 0,
      readCount: 0,
    };
  }

  if (!emotion || percent === null) {
    return {
      headline: "가장 오래 머문 한 줄",
      detail: mbti
        ? `${mbti}가 가장 오래 머문 문장이에요.`
        : "이번 기록에서 가장 오래 머문 문장이에요.",
      emoji: "✦",
      emotionId: null,
      percent: null,
      mbti,
      quote,
      likeCount: liked.length,
      readCount: list.length,
    };
  }

  return {
    headline: `이번 마음은 ${emotion.label} ${percent}%`,
    detail: `${basis.length}장 가운데 ${dominantCount}장이 ${emotion.label}에 머물렀어요.`,
    emoji: emotion.emoji,
    emotionId,
    percent,
    mbti,
    quote,
    likeCount: liked.length,
    readCount: list.length,
  };
}
