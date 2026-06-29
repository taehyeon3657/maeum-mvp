// ─────────────────────────────────────────────────────────────
// 문구별 배경 "의미 계산" 코어 (프레임워크 비의존, node·next 공용)
//
// 여기서는 색·모티프 같은 "의미값(spec)"만 결정한다.
// 실제 CSS/SVG 합성(3레이어)은 quoteBackground.ts 가 담당.
// 생성 스크립트와 런타임이 같은 코어를 쓰므로 로직이 어긋나지 않는다.
// ─────────────────────────────────────────────────────────────

/** @typedef {{id?:string, content?:string, source?:string|null, emotion_tags?:string[]|null}} Quote */
/** @typedef {{category:string, motif:string, gradient:string, motifColor:string, textColor:string, mutedColor:string, accentColor:string}} QuoteSpec */

// ── 카테고리별 기본 팔레트 (HSL) + 기본 모티프 ────────────────
// lBottom 은 텍스트(#37352f) 가독성을 위해 과하게 어둡지 않게 유지.
export const CATEGORY_PALETTE = {
  // 명대사 — 라벤더 (감성적 몰입) · 기본 모티프: 잔잔한 도트
  drama: { h: 270, s: 56, lTop: 93, lMid: 80, lBottom: 67, motif: "plain" },
  // 사랑/우정 — 로즈 · 꽃잎
  love: { h: 342, s: 72, lTop: 95, lMid: 82, lBottom: 70, motif: "petal" },
  // 동기/도전 — 앰버 · 산 능선
  motivation: { h: 38, s: 90, lTop: 95, lMid: 79, lBottom: 64, motif: "mountain" },
  // 위로/치유/희망 — 피치 (기본값) · 빛망울
  comfort: { h: 20, s: 86, lTop: 95, lMid: 81, lBottom: 67, motif: "light" },
  // 쉼/여유 — 세이지 그린 · 잎사귀
  rest: { h: 150, s: 44, lTop: 93, lMid: 80, lBottom: 66, motif: "leaf" },
  // 일상/감사 — 스카이 퍼리윙클 · 구름
  daily: { h: 214, s: 72, lTop: 95, lMid: 81, lBottom: 68, motif: "cloud" },
};

// ── 키워드 → 모티프 보정 (내용 기반) ──────────────────────────
// 내용에 단어가 있으면 모티프를 바꾸고 색조를 제한적으로만 끌어온다.
export const MOTIF_RULES = [
  // 밤·달·별 → 별/반짝임, 인디고로 살짝 어둑하게
  {
    key: "star",
    words: ["밤", "새벽", "어둠", "어두", "달빛", "별", "깜깜", "캄캄", "은하", "우주"],
    hueShift: -18,
    satShift: 6,
    lightShift: -6,
  },
  // 꽃·봄·벚꽃 → 꽃잎, 채도 ↑
  {
    key: "petal",
    words: ["꽃", "봄", "벚꽃", "장미", "피어", "꽃잎", "정원", "꽃밭"],
    hueShift: 8,
    satShift: 12,
    lightShift: 2,
  },
  // 물·바다·비 → 물결, 블루/틸로
  {
    key: "wave",
    words: ["바다", "강", "물", "파도", "비", "눈물", "젖", "호수", "강물", "흐르", "물결"],
    hueShift: 22,
    satShift: 8,
    lightShift: 0,
  },
  // 하늘·구름·바람 → 구름, 산뜻하게
  {
    key: "cloud",
    words: ["하늘", "구름", "바람", "공기", "푸른 하늘"],
    hueShift: 12,
    satShift: -4,
    lightShift: 4,
  },
  // 빛·햇살·아침 → 빛망울/광원
  {
    key: "light",
    words: ["빛", "햇살", "햇빛", "태양", "노을", "아침", "반짝", "눈부", "밝"],
    hueShift: 4,
    satShift: 10,
    lightShift: 3,
  },
  // 산·길·걸음·정상 → 산 능선
  {
    key: "mountain",
    words: ["산", "정상", "봉우리", "길", "걸음", "발걸음", "오르", "여정", "나아가", "정복"],
    hueShift: 0,
    satShift: 3,
    lightShift: -1,
  },
  // 잎·나무·자연·숲 → 잎사귀
  {
    key: "leaf",
    words: ["잎", "나무", "숲", "새싹", "풀", "자연", "뿌리", "씨앗", "줄기"],
    hueShift: 0,
    satShift: 4,
    lightShift: 1,
  },
];

// ── 결정적 해시 & PRNG (문구마다 고유하되 항상 동일) ────────────
export function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// ── HSL → HEX ──────────────────────────────────────────────────
function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ── 카테고리 분류 (감정 태그 기반) ─────────────────────────────
export function getCategoryFromQuote(quote) {
  const tags = quote.emotion_tags || [];
  const source = quote.source || "";

  if (tags.includes("명대사") && source) return "drama";
  if (tags.includes("사랑") || tags.includes("우정")) return "love";
  if (
    tags.includes("동기") ||
    tags.includes("성장") ||
    tags.includes("노력") ||
    tags.includes("도전")
  )
    return "motivation";
  if (tags.includes("위로") || tags.includes("치유") || tags.includes("희망"))
    return "comfort";
  if (tags.includes("쉼") || tags.includes("여유") || tags.includes("휴식"))
    return "rest";
  if (tags.includes("일상") || tags.includes("감사")) return "daily";

  return "comfort";
}

export function detectMotifRule(content) {
  for (const rule of MOTIF_RULES) {
    if (rule.words.some((w) => content.includes(w))) return rule;
  }
  return null;
}

// ── 메인: 문구 → 의미 스펙 (결정적) ────────────────────────────
/** @returns {QuoteSpec} */
export function computeQuoteSpec(quote) {
  const category = getCategoryFromQuote(quote);
  const base = CATEGORY_PALETTE[category];

  const rule = detectMotifRule(quote.content || "");
  const motif = rule?.key ?? base.motif;

  // 문구별 "은은한" 색 변주 (결정적: 같은 문구 = 같은 색)
  const rnd = mulberry32(hashString(quote.id || quote.content || "maeum"));
  const hueShift = (rule?.hueShift ?? 0) + (rnd() * 16 - 8); // ±8
  const satShift = (rule?.satShift ?? 0) + (rnd() * 8 - 4);
  const lightShift = (rule?.lightShift ?? 0) + (rnd() * 4 - 2);

  const h = base.h + hueShift;
  const s = clamp(base.s + satShift, 30, 96);
  const lTop = clamp(base.lTop + lightShift * 0.3, 88, 97);
  const lMid = clamp(base.lMid + lightShift, 72, 88);
  const lBottom = clamp(base.lBottom + lightShift, 58, 78);
  const angle = Math.round(125 + rnd() * 55); // 125~180deg

  // 위에서부터 색이 살아있도록 c1 도 충분히 틴트를 준다(거의-흰색 방지).
  const c1 = hslToHex(h, s * 0.62, lTop);
  const c2 = hslToHex(h, s * 0.86, lMid);
  const c3 = hslToHex(h + 6, s, lBottom);
  const gradient = `linear-gradient(${angle}deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;

  return {
    category,
    motif,
    gradient,
    // 레이어2 모티프 라인아트 색 (살짝 짙게 — 위 배경에서 또렷이 보이게)
    motifColor: hslToHex(h, clamp(s + 8, 0, 100), clamp(lBottom - 28, 22, 46)),
    // 본문/보조/강조 텍스트 색 (가독성 보장)
    textColor: hslToHex(h, clamp(s * 0.45, 10, 38), 19),
    mutedColor: hslToHex(h, clamp(s * 0.4, 8, 32), 36),
    accentColor: hslToHex(h, clamp(s, 40, 88), clamp(lBottom - 28, 26, 48)),
  };
}
