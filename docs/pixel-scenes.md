# 문구 도트(픽셀) 장면 — 제작 워크플로

문구 내용을 그대로 묘사하는 도트 그림(예: "천천히 가도 된다, 멈추지만 말라" → 거북이)을
카드에 얹는 시스템. 순수 SVG 도트라 장면당 1KB 미만, 텍스트 가독성·바이브 유지.

## 구성

| 파일 | 역할 |
|---|---|
| `src/lib/pixelScene.ts` | 장면 데이터 → SVG 도트 렌더러 |
| `src/data/pixelScenes.json` | 장면 라이브러리 (`키 → {w,h,palette,rows}`) |
| `src/lib/quoteScene.ts` | 문구 → 장면 매핑(키워드 규칙 + id 오버라이드) |
| `src/data/quoteSceneOverrides.json` | 특정 문구 id 강제 지정 |
| `scripts/quantize-pixel-scene.mjs` | AI 픽셀아트 PNG → 장면 데이터 변환 |

장면이 없는 문구는 자동으로 기존 추상 배경(그라디언트+모티프)으로 fallback → 절대 안 깨짐.

## 1) AI 픽셀아트 생성 (프롬프트 템플릿)

Midjourney/DALL·E 등에서 아래 톤으로 생성. **투명 배경 PNG, 16색 안팎, 피사체만**.

```
[소재] pixel art, 16-bit retro game sprite, limited palette (~12 colors),
clean flat shading, transparent background, centered single subject,
soft pastel tones, no text, no border, simple and readable silhouette
```

예시 소재:
- 거북이 → `a cute tortoise walking slowly`
- 도전/정상 → `a small flag on a mountain peak`
- 성장 → `a green sprout growing from soil in a small pot`
- 밤/쉼 → `a crescent moon with a few stars`
- 희망/아침 → `a sunrise over rolling hills`
- 한 걸음씩 → `footprints trail on a path`
- 여정 → `a small sailboat on gentle waves`
- 등대/방향 → `a lighthouse beaming light`

서비스 톤에 맞춰 파스텔/저채도로. 캐릭터 일관성을 위해 같은 프롬프트 접두어 유지.

## 2) 도트로 변환 (양자화)

```bash
node scripts/quantize-pixel-scene.mjs ./art/tortoise.png tortoise --w 34 --h 20 --colors 12
```

→ `src/data/pixelScenes.json` 의 `tortoise` 키에 도트 데이터 저장.
가로형은 `--w` 를 크게, 정사각은 w≈h. 격자가 클수록 디테일↑·데이터↑ (24~48 권장).

## 3) 문구에 연결

- 키워드 규칙: `src/lib/quoteScene.ts` 의 `SCENE_RULES` 에 `{ scene, words }` 추가
- 특정 문구만: `src/data/quoteSceneOverrides.json` 에 `"<quote-id>": "<sceneKey>"`

저장하면 매칭되는 문구 카드에 도트 장면이 자동으로 표시된다.

## 미리보기

`/preview/backgrounds` (로컬 전용)에서 전체 문구 배경/장면을 한눈에 확인.
