import type { Quote } from "@/src/models/feed";
import type { PixelScene } from "@/src/lib/pixelScene";
import SCENES from "@/src/data/pixelScenes.json";
import OVERRIDES from "@/src/data/quoteSceneOverrides.json";

// ─────────────────────────────────────────────────────────────
// 문구 → 도트 장면 매핑
//
// 우선순위: ① id 강제 지정(quoteSceneOverrides.json)
//          ② 내용 키워드 규칙(SCENE_RULES)
//          ③ 없으면 null → QuoteCard 는 기존 추상 배경으로 fallback
//
// AI 픽셀아트로 장면이 늘어나면 pixelScenes.json 에 장면을 추가하고,
// 여기 규칙(또는 오버라이드)에 연결만 하면 해당 문구들이 자동으로 켜진다.
// ─────────────────────────────────────────────────────────────

const SCENE_MAP = SCENES as Record<string, PixelScene>;
const OVERRIDE_MAP = OVERRIDES as Record<string, string>;

// 키워드 → 장면 키 규칙 (위에서부터 먼저 매칭)
const SCENE_RULES: { scene: string; words: string[] }[] = [
  {
    scene: "tortoise",
    words: ["천천히", "느리게", "느려도", "멈추지", "꾸준", "한 걸음", "더디게"],
  },
];

export function getSceneKey(quote: Quote): string | null {
  const ov = OVERRIDE_MAP[quote.id];
  if (ov && SCENE_MAP[ov]) return ov;

  const content = quote.content || "";
  for (const rule of SCENE_RULES) {
    if (!SCENE_MAP[rule.scene]) continue; // 아직 장면 데이터가 없으면 skip
    if (rule.words.some((w) => content.includes(w))) return rule.scene;
  }
  return null;
}

export function getQuoteScene(quote: Quote): PixelScene | null {
  const key = getSceneKey(quote);
  return key ? SCENE_MAP[key] ?? null : null;
}
