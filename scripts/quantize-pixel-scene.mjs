// AI 픽셀아트 PNG → 도트 장면 데이터 변환기 (양자화)
//
// 사용:
//   node scripts/quantize-pixel-scene.mjs <input.png> <sceneKey> [--w 36] [--h 24] [--colors 16]
//
// 동작:
//   1) 이미지를 w×h 그리드로 축소 (nearest = 또렷한 픽셀)
//   2) 색을 colors 개로 줄임(양자화)
//   3) 투명(알파<128) → '.', 나머지 → palette 문자
//   4) src/data/pixelScenes.json 의 <sceneKey> 에 {w,h,palette,rows} 저장
//
// 권장 워크플로:
//   - Midjourney/DALL·E 등으로 16색 안팎의 정사각/가로형 픽셀아트 생성
//     (프롬프트 템플릿은 docs/pixel-scenes.md 참고)
//   - 배경은 투명 PNG 로 (피사체만 남기면 카드 위에 깔끔히 얹힘)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "src", "data", "pixelScenes.json");

const args = process.argv.slice(2);
const input = args[0];
const key = args[1];
const getOpt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? Number(args[i + 1]) : def;
};
const W = getOpt("w", 36);
const H = getOpt("h", 24);
const COLORS = getOpt("colors", 16);

if (!input || !key) {
  console.error(
    "Usage: node scripts/quantize-pixel-scene.mjs <input.png> <sceneKey> [--w 36] [--h 24] [--colors 16]"
  );
  process.exit(1);
}

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function hex(r, g, b) {
  const h = (v) => v.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

async function main() {
  // 1) 축소 + 2) 색 양자화 (PNG 팔레트) → 다시 raw 로 읽기
  const pngBuf = await sharp(input)
    .resize(W, H, { fit: "fill", kernel: "nearest" })
    .png({ palette: true, colors: COLORS, dither: 0 })
    .toBuffer();

  const { data, info } = await sharp(pngBuf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const ch = info.channels; // 4 (RGBA)
  const palette = {};
  const colorToChar = new Map();
  let next = 0;
  const rows = [];

  for (let y = 0; y < H; y++) {
    let row = "";
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * ch;
      const a = data[i + 3];
      if (a < 128) {
        row += ".";
        continue;
      }
      const c = hex(data[i], data[i + 1], data[i + 2]);
      let sym = colorToChar.get(c);
      if (!sym) {
        sym = CHARS[next++] || "?";
        colorToChar.set(c, sym);
        palette[sym] = c;
      }
      row += sym;
    }
    rows.push(row);
  }

  const scene = { w: W, h: H, palette, rows };

  const db = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
  db[key] = scene;
  fs.writeFileSync(OUT, JSON.stringify(db, null, 2) + "\n", "utf8");

  console.log(
    `✓ ${key}: ${W}×${H}, ${Object.keys(palette).length}색 → ${path.relative(
      process.cwd(),
      OUT
    )}`
  );
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
