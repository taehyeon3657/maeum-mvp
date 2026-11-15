export function quotePublicPath(id, { gift = false } = {}) {
  if (typeof id !== "string" || id.length === 0) return "/";
  const path = `/q/${encodeURIComponent(id)}`;
  return gift ? `${path}?gift=1` : path;
}

export function quoteOgPath(id) {
  if (typeof id !== "string" || id.length === 0) return "/";
  return `/api/og/quote/${encodeURIComponent(id)}`;
}

export function quoteShareText({ content = "", gift = false } = {}) {
  const line = String(content).trim();
  const clipped = line.length > 80 ? `${line.slice(0, 80)}…` : line;

  if (gift) {
    return clipped
      ? `이 문장을 건네고 싶었어요.\n“${clipped}”`
      : "이 문장을 건네고 싶었어요.";
  }

  return clipped
    ? `“${clipped}”\n마음에서 만났어요.`
    : "마음에서 글귀 한 장을 만났어요.";
}
