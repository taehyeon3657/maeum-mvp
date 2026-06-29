import type { Quote } from "@/src/models/feed";

// ─────────────────────────────────────────────────────────────
// 문구별 "개별 배경" 생성기
//
// 561개 문구마다 손으로 이미지를 만드는 대신, 각 문구의 의미·감정을
// 코드로 읽어 그 자리에서 고유한 배경을 합성한다. 순수 CSS/SVG라
// 추가 용량이 사실상 0이며, 문구마다 전부 다른 그림이 나온다.
//
// 구성 3단계:
//   1) 카테고리(감정 태그) → 기본 색 팔레트(무드)
//   2) 문구 내용의 키워드(밤·꽃·바다·빛…) → 모티프 & 색조 보정
//   3) 문구 id 해시 → 그라디언트 각도·색조 변주·블롭 위치·텍스처를
//      문구마다 고유하게 (deterministic = 같은 문구는 항상 같은 배경)
// ─────────────────────────────────────────────────────────────

export interface QuoteBackground {
  /** background-image 에 그대로 넣는 다층 합성 문자열 */
  backgroundImage: string;
  /** 본문 텍스트에 권장하는 색 (대비 보장용) */
  textColor: string;
  /** 보조 텍스트(출처 등) 색 */
  mutedColor: string;
  /** 상단 포인트/워터마크 등 강조용 색 */
  accentColor: string;
  /** 디버그/공유용 카테고리 키 */
  category: CategoryKey;
  /** 디버그/공유용 모티프 키 */
  motif: MotifKey;
}

type CategoryKey =
  | "drama"
  | "love"
  | "motivation"
  | "comfort"
  | "rest"
  | "daily";

type MotifKey =
  | "night"
  | "flower"
  | "water"
  | "sky"
  | "light"
  | "warm"
  | "path"
  | "plain";

// ── 1) 카테고리별 기본 팔레트 (HSL 기반) ───────────────────────
// h: 색조, s: 채도, lTop/lBottom: 밝은 시작 → 깊은 끝 명도
// 텍스트(#37352f) 가독성을 위해 lBottom 은 너무 어둡지 않게 유지.
const CATEGORY_PALETTE: Record<
  CategoryKey,
  { h: number; s: number; lTop: number; lMid: number; lBottom: number }
> = {
  // 명대사 — 라벤더 (감성적 몰입)
  drama: { h: 270, s: 55, lTop: 96, lMid: 86, lBottom: 73 },
  // 사랑/우정 — 로즈
  love: { h: 342, s: 70, lTop: 97, lMid: 87, lBottom: 76 },
  // 동기/도전 — 앰버 (에너지)
  motivation: { h: 38, s: 88, lTop: 97, lMid: 84, lBottom: 70 },
  // 위로/치유/희망 — 피치 (기본값)
  comfort: { h: 20, s: 85, lTop: 97, lMid: 86, lBottom: 74 },
  // 쉼/여유 — 세이지 그린
  rest: { h: 150, s: 40, lTop: 96, lMid: 84, lBottom: 72 },
  // 일상/감사 — 스카이 퍼리윙클
  daily: { h: 214, s: 70, lTop: 97, lMid: 86, lBottom: 75 },
};

// ── 2) 키워드 → 모티프 보정 ────────────────────────────────────
// 문구 내용에 특정 단어가 있으면 색조를 살짝 끌어오고 텍스처를 바꾼다.
// hueShift 는 카테고리 색을 크게 깨지 않도록 제한적으로만 적용.
const MOTIF_RULES: {
  key: MotifKey;
  words: string[];
  hueShift: number;
  satShift: number;
  lightShift: number;
}[] = [
  // 밤·새벽·달·별 → 인디고로 살짝, 어둑하게, 별 텍스처
  {
    key: "night",
    words: ["밤", "새벽", "어둠", "어두", "달", "별", "깜깜", "캄캄", "노을"],
    hueShift: -20,
    satShift: 6,
    lightShift: -7,
  },
  // 꽃·봄·벚꽃 → 채도 ↑, 꽃잎 텍스처
  {
    key: "flower",
    words: ["꽃", "봄", "벚꽃", "장미", "피어", "피우", "꽃잎", "정원"],
    hueShift: 8,
    satShift: 12,
    lightShift: 2,
  },
  // 물·바다·비·눈물 → 블루/틸로, 물결 텍스처
  {
    key: "water",
    words: ["바다", "강", "물", "파도", "비", "눈물", "젖", "강물", "호수", "흐르"],
    hueShift: 24,
    satShift: 8,
    lightShift: 0,
  },
  // 하늘·구름·바람 → 산뜻하게, 구름 텍스처
  {
    key: "sky",
    words: ["하늘", "구름", "바람", "날", "공기", "푸른"],
    hueShift: 12,
    satShift: -4,
    lightShift: 4,
  },
  // 빛·햇살·태양·아침 → 따뜻한 광원 강조
  {
    key: "light",
    words: ["빛", "햇살", "햇빛", "태양", "해", "아침", "반짝", "눈부", "밝"],
    hueShift: 4,
    satShift: 10,
    lightShift: 3,
  },
  // 커피·차·따뜻 → 웜 톤
  {
    key: "warm",
    words: ["커피", "차", "따뜻", "온기", "포근", "불", "촛불"],
    hueShift: -6,
    satShift: 6,
    lightShift: -1,
  },
  // 길·걸음·여정 → 사선 텍스처
  {
    key: "path",
    words: ["길", "걸음", "발걸음", "걷", "여정", "방향", "나아가"],
    hueShift: 0,
    satShift: 2,
    lightShift: 0,
  },
];

// ── 결정적 해시 & PRNG (문구마다 고유하되 항상 동일) ────────────
function hashString(str: string): number {
  let h = 2166136261; // FNV-1a 32bit
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

const hsl = (h: number, s: number, l: number, a = 1) =>
  `hsla(${((h % 360) + 360) % 360}, ${clamp(s, 0, 100)}%, ${clamp(
    l,
    0,
    100
  )}%, ${a})`;

// ── 카테고리 분류 (기존 로직 유지) ─────────────────────────────
export function getCategoryFromQuote(quote: Quote): CategoryKey {
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

function detectMotif(content: string): (typeof MOTIF_RULES)[number] | null {
  for (const rule of MOTIF_RULES) {
    if (rule.words.some((w) => content.includes(w))) return rule;
  }
  return null;
}

// ── 모티프별 텍스처(SVG 패턴) ──────────────────────────────────
function motifTexture(motif: MotifKey, color: string, rnd: () => number): string {
  const enc = (svg: string) =>
    `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

  switch (motif) {
    case "night": {
      // 작은 별/반짝임
      const stars = Array.from({ length: 7 }, () => {
        const x = Math.round(rnd() * 60);
        const y = Math.round(rnd() * 60);
        const r = (0.6 + rnd() * 1.1).toFixed(1);
        return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" fill-opacity="0.5"/>`;
      }).join("");
      return enc(
        `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">${stars}</svg>`
      );
    }
    case "flower": {
      // 작은 꽃잎(타원) 흩뿌림
      const petals = Array.from({ length: 5 }, () => {
        const x = Math.round(rnd() * 54);
        const y = Math.round(rnd() * 54);
        const rot = Math.round(rnd() * 180);
        return `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="1.4" fill="${color}" fill-opacity="0.42" transform="rotate(${rot} ${x} ${y})"/>`;
      }).join("");
      return enc(
        `<svg width="54" height="54" xmlns="http://www.w3.org/2000/svg">${petals}</svg>`
      );
    }
    case "water": {
      // 잔잔한 물결선
      return enc(
        `<svg width="48" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 12 Q 12 4 24 12 T 48 12" fill="none" stroke="${color}" stroke-opacity="0.4" stroke-width="1.3"/></svg>`
      );
    }
    case "sky": {
      // 부드러운 구름 점선
      return enc(
        `<svg width="52" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M6 24 Q 14 14 24 22 Q 34 12 44 24" fill="none" stroke="${color}" stroke-opacity="0.35" stroke-width="1.4" stroke-linecap="round"/></svg>`
      );
    }
    case "path": {
      // 사선
      return enc(
        `<svg width="28" height="28" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="28" x2="28" y2="0" stroke="${color}" stroke-opacity="0.32" stroke-width="1.1"/></svg>`
      );
    }
    case "light": {
      // 작은 빛망울
      const dots = Array.from({ length: 5 }, () => {
        const x = Math.round(rnd() * 44);
        const y = Math.round(rnd() * 44);
        const r = (1 + rnd() * 2).toFixed(1);
        return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" fill-opacity="0.3"/>`;
      }).join("");
      return enc(
        `<svg width="44" height="44" xmlns="http://www.w3.org/2000/svg">${dots}</svg>`
      );
    }
    case "warm":
    case "plain":
    default: {
      // 기본 도트
      return enc(
        `<svg width="22" height="22" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="1.7" fill="${color}" fill-opacity="0.4"/></svg>`
      );
    }
  }
}

// ── 메인: 문구 하나 → 고유 배경 ────────────────────────────────
export function getQuoteBackground(quote: Quote): QuoteBackground {
  const category = getCategoryFromQuote(quote);
  const base = CATEGORY_PALETTE[category];

  const motifRule = detectMotif(quote.content || "");
  const motif: MotifKey = motifRule?.key ?? "plain";

  // 문구 id(없으면 내용) 해시로 시드 고정
  const seed = hashString(quote.id || quote.content || "maeum");
  const rnd = mulberry32(seed);

  // 모티프 보정 + 문구별 미세 변주
  const hueShift = (motifRule?.hueShift ?? 0) + (rnd() * 24 - 12); // ±12 추가 변주
  const satShift = (motifRule?.satShift ?? 0) + (rnd() * 10 - 5);
  const lightShift = (motifRule?.lightShift ?? 0) + (rnd() * 6 - 3);

  const h = base.h + hueShift;
  const s = clamp(base.s + satShift, 25, 96);
  const lTop = clamp(base.lTop + lightShift * 0.4, 90, 99);
  const lMid = clamp(base.lMid + lightShift, 76, 92);
  const lBottom = clamp(base.lBottom + lightShift, 64, 84);

  // 그라디언트 각도도 문구마다 다르게
  const angle = Math.round(120 + rnd() * 80); // 120~200deg

  const baseGradient = `linear-gradient(${angle}deg, ${hsl(
    h,
    s * 0.55,
    lTop
  )} 0%, ${hsl(h, s * 0.8, lMid)} 52%, ${hsl(h + 6, s, lBottom)} 100%)`;

  // 유기적 깊이감을 주는 라디얼 블롭 2개 (오로라 느낌)
  const blob = (hh: number, ll: number) => {
    const x = Math.round(10 + rnd() * 80);
    const y = Math.round(10 + rnd() * 80);
    const size = Math.round(40 + rnd() * 35);
    return `radial-gradient(circle at ${x}% ${y}%, ${hsl(
      hh,
      s,
      ll,
      0.55
    )} 0%, ${hsl(hh, s, ll, 0)} ${size}%)`;
  };
  const blob1 = blob(h - 14, clamp(lMid + 4, 0, 95));
  const blob2 = blob(h + 26, clamp(lBottom - 4, 0, 95));

  // 텍스처 (모티프별)
  const textureColor = hsl(h, clamp(s + 6, 0, 100), clamp(lBottom - 30, 18, 55));
  const texture = motifTexture(motif, textureColor, rnd);

  // 합성 순서: 텍스처(맨 위) → 블롭 → 베이스 그라디언트
  const backgroundImage = `${texture}, ${blob1}, ${blob2}, ${baseGradient}`;

  // 텍스트 색: 짙은 동일 계열 (가독성 + 통일감)
  const textColor = hsl(h, clamp(s * 0.5, 12, 40), 20);
  const mutedColor = hsl(h, clamp(s * 0.4, 10, 35), 38);
  const accentColor = hsl(h, clamp(s, 40, 90), clamp(lBottom - 28, 28, 52));

  return {
    backgroundImage,
    textColor,
    mutedColor,
    accentColor,
    category,
    motif,
  };
}
