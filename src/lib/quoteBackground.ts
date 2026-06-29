import type { Quote } from "@/src/models/feed";
// 프레임워크 비의존 코어(JS) — 생성 스크립트와 공유. allowJs 로 타입 추론됨.
import { computeQuoteSpec } from "@/src/lib/quoteBackground.core.mjs";
import MAP from "@/src/data/quoteBackgrounds.json";

// ─────────────────────────────────────────────────────────────
// 문구별 배경 — 3레이어 합성
//   레이어1: CSS 그라디언트 (카테고리 무드 + 문구별 색 변주)
//   레이어2: SVG 벡터 모티프 (산 능선·물결·별·꽃잎… 내용 기반, 저채도)
//   레이어3: 미세 그레인/노이즈 (종이 질감, 싸구려감 제거)
//
// 의미값(색·모티프)은 src/data/quoteBackgrounds.json 에 561개가 명시돼 있고
// (없으면 코어에서 즉석 계산 — 절대 안 깨짐), 여기서 CSS로 조립만 한다.
// ─────────────────────────────────────────────────────────────

export interface QuoteSpec {
  category: string;
  motif: string;
  gradient: string;
  motifColor: string;
  textColor: string;
  mutedColor: string;
  accentColor: string;
}

export interface QuoteBackground {
  /** style 에 그대로 펼쳐 넣는 background 다층 속성 */
  style: {
    backgroundImage: string;
    backgroundSize: string;
    backgroundRepeat: string;
    backgroundPosition: string;
  };
  textColor: string;
  mutedColor: string;
  accentColor: string;
  category: string;
  motif: string;
}

const BG_MAP = MAP as Record<string, QuoteSpec>;

const svgUrl = (svg: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

// ── 레이어2: 모티프별 벡터 라인아트 ───────────────────────────
// scene = 카드 전체 배치(no-repeat), tile = 작은 패턴 반복(repeat)
function motifLayer(
  motif: string,
  color: string
): { url: string; size: string; repeat: string; position: string } {
  const c = color;
  switch (motif) {
    case "mountain": {
      // 하단 산 능선 (면 + 라인)
      const svg = `<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg"><path d="M0 488 L70 436 L138 472 L210 414 L286 466 L344 430 L400 458 L400 600 L0 600 Z" fill="${c}" fill-opacity="0.11"/><path d="M0 520 L96 470 L150 500 L235 452 L300 492 L400 448" fill="none" stroke="${c}" stroke-opacity="0.18" stroke-width="2"/><path d="M0 488 L70 436 L138 472 L210 414 L286 466 L344 430 L400 458" fill="none" stroke="${c}" stroke-opacity="0.30" stroke-width="2.2" stroke-linejoin="round"/></svg>`;
      return { url: svgUrl(svg), size: "cover", repeat: "no-repeat", position: "center bottom" };
    }
    case "wave": {
      // 하단 잔잔한 물결 (3겹)
      const svg = `<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg"><path d="M0 500 Q100 472 200 500 T400 500" fill="none" stroke="${c}" stroke-opacity="0.28" stroke-width="2.2"/><path d="M0 524 Q100 552 200 524 T400 524" fill="none" stroke="${c}" stroke-opacity="0.20" stroke-width="2.2"/><path d="M0 548 Q100 522 200 548 T400 548" fill="none" stroke="${c}" stroke-opacity="0.14" stroke-width="2.2"/></svg>`;
      return { url: svgUrl(svg), size: "cover", repeat: "no-repeat", position: "center bottom" };
    }
    case "cloud": {
      // 상단 부드러운 구름 아치
      const svg = `<svg width="400" height="600" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg"><path d="M40 96 Q80 64 130 92 Q170 60 220 90" fill="none" stroke="${c}" stroke-opacity="0.22" stroke-width="2.6" stroke-linecap="round"/><path d="M230 150 Q270 122 320 148 Q350 128 380 150" fill="none" stroke="${c}" stroke-opacity="0.17" stroke-width="2.4" stroke-linecap="round"/></svg>`;
      return { url: svgUrl(svg), size: "cover", repeat: "no-repeat", position: "center top" };
    }
    case "star": {
      // 별/반짝임 타일
      const star = (x: number, y: number, r: number, o: number) =>
        `<path d="M${x} ${y - r} L${x + r * 0.28} ${y - r * 0.28} L${x + r} ${y} L${x + r * 0.28} ${y + r * 0.28} L${x} ${y + r} L${x - r * 0.28} ${y + r * 0.28} L${x - r} ${y} L${x - r * 0.28} ${y - r * 0.28} Z" fill="${c}" fill-opacity="${o}"/>`;
      const svg = `<svg width="130" height="130" xmlns="http://www.w3.org/2000/svg">${star(26, 30, 5, 0.55)}${star(96, 54, 3.4, 0.42)}${star(58, 96, 4.2, 0.46)}<circle cx="110" cy="110" r="1.5" fill="${c}" fill-opacity="0.42"/><circle cx="20" cy="92" r="1.3" fill="${c}" fill-opacity="0.36"/></svg>`;
      return { url: svgUrl(svg), size: "130px 130px", repeat: "repeat", position: "0 0" };
    }
    case "petal": {
      // 꽃잎 타일
      const petal = (x: number, y: number, rot: number, o: number) =>
        `<ellipse cx="${x}" cy="${y}" rx="4.2" ry="1.9" fill="${c}" fill-opacity="${o}" transform="rotate(${rot} ${x} ${y})"/>`;
      const svg = `<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">${petal(28, 26, 25, 0.46)}${petal(92, 48, 110, 0.38)}${petal(54, 90, 200, 0.42)}${petal(100, 104, 60, 0.34)}</svg>`;
      return { url: svgUrl(svg), size: "120px 120px", repeat: "repeat", position: "0 0" };
    }
    case "leaf": {
      // 잎사귀 타일
      const leaf = (x: number, y: number, rot: number, o: number) =>
        `<g transform="rotate(${rot} ${x} ${y})" fill="none" stroke="${c}" stroke-opacity="${o}" stroke-width="1.4"><path d="M${x} ${y} q6 -8 0 -18 q-6 10 0 18"/><line x1="${x}" y1="${y}" x2="${x}" y2="${y - 16}"/></g>`;
      const svg = `<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg">${leaf(30, 40, 15, 0.42)}${leaf(90, 70, -25, 0.34)}${leaf(64, 104, 5, 0.36)}</svg>`;
      return { url: svgUrl(svg), size: "120px 120px", repeat: "repeat", position: "0 0" };
    }
    case "light": {
      // 빛망울 타일 (보케)
      const svg = `<svg width="110" height="110" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="32" r="6.5" fill="${c}" fill-opacity="0.16"/><circle cx="84" cy="60" r="3.8" fill="${c}" fill-opacity="0.22"/><circle cx="54" cy="92" r="4.8" fill="${c}" fill-opacity="0.16"/><circle cx="96" cy="22" r="2.2" fill="${c}" fill-opacity="0.26"/></svg>`;
      return { url: svgUrl(svg), size: "110px 110px", repeat: "repeat", position: "0 0" };
    }
    case "plain":
    default: {
      // 잔잔한 도트 타일
      const svg = `<svg width="22" height="22" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="1.7" fill="${c}" fill-opacity="0.20"/></svg>`;
      return { url: svgUrl(svg), size: "22px 22px", repeat: "repeat", position: "0 0" };
    }
  }
}

// ── 레이어3: 미세 그레인 (종이 질감) ──────────────────────────
const GRAIN_URL = svgUrl(
  `<svg width="120" height="120" xmlns="http://www.w3.org/2000/svg"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/></filter><rect width="120" height="120" filter="url(#g)" opacity="0.045"/></svg>`
);

function specFor(quote: Quote): QuoteSpec {
  return BG_MAP[quote.id] ?? (computeQuoteSpec(quote) as unknown as QuoteSpec);
}

// ── 메인 ───────────────────────────────────────────────────────
export function getQuoteBackground(quote: Quote): QuoteBackground {
  const spec = specFor(quote);
  const m = motifLayer(spec.motif, spec.motifColor);

  // 합성 순서(위 → 아래): 그레인 → 모티프 → 그라디언트
  return {
    style: {
      backgroundImage: `${GRAIN_URL}, ${m.url}, ${spec.gradient}`,
      backgroundSize: `120px 120px, ${m.size}, cover`,
      backgroundRepeat: `repeat, ${m.repeat}, no-repeat`,
      backgroundPosition: `0 0, ${m.position}, center`,
    },
    textColor: spec.textColor,
    mutedColor: spec.mutedColor,
    accentColor: spec.accentColor,
    category: spec.category,
    motif: spec.motif,
  };
}
