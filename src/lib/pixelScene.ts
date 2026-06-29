// ─────────────────────────────────────────────────────────────
// 도트(픽셀) 장면 렌더러
//
// 장면 데이터({w,h,palette,rows})를 받아 픽셀당 <rect> 로 된 SVG
// data-URI 를 만든다. 데이터는 손으로 작성하거나(시드), AI 픽셀아트 PNG 를
// scripts/quantize-pixel-scene.mjs 로 양자화해 생성한다.
//
// rows: 각 문자 = palette 키, '.' 또는 ' ' = 투명.
// ─────────────────────────────────────────────────────────────

export interface PixelScene {
  w: number;
  h: number;
  palette: Record<string, string>;
  rows: string[];
}

/** 장면 → SVG data-URI (background-image 에 사용). 픽셀 경계는 crispEdges. */
export function pixelSceneUrl(scene: PixelScene): string {
  let rects = "";
  for (let y = 0; y < scene.rows.length; y++) {
    const row = scene.rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === "." || ch === " ") continue;
      const color = scene.palette[ch];
      if (!color) continue;
      rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`;
    }
  }
  const svg = `<svg width="${scene.w}" height="${scene.h}" viewBox="0 0 ${scene.w} ${scene.h}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">${rects}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
