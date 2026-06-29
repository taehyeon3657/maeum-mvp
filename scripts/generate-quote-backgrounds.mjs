// 문구별 배경 명시 매핑 파일 생성기
//
// 사용:
//   node scripts/generate-quote-backgrounds.mjs <quotes.json> [out.json]
//
// <quotes.json> 은 DB(quotes 테이블) export — 각 행에 id/content/source/
// emotion_tags 가 있으면 된다 (emotion_tags 는 배열 또는 JSON 문자열 허용).
// 결과: src/data/quoteBackgrounds.json (문구 id → {gradient·motif·색} 명시값).
//
// DB 가 문구 텍스트의 source of truth 이고, 이 파일은 "디자인 매핑"만 보관한다.
// 새 문구가 추가되면 다시 실행해 갱신. (런타임은 빠진 id 를 즉석 계산으로 fallback)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { computeQuoteSpec } from "../src/lib/quoteBackground.core.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const srcPath = process.argv[2];
const outPath =
  process.argv[3] ||
  path.join(__dirname, "..", "src", "data", "quoteBackgrounds.json");

if (!srcPath) {
  console.error("Usage: node scripts/generate-quote-backgrounds.mjs <quotes.json> [out.json]");
  process.exit(1);
}

const rows = JSON.parse(fs.readFileSync(srcPath, "utf8"));

function parseTags(t) {
  if (Array.isArray(t)) return t;
  if (typeof t === "string") {
    try {
      return JSON.parse(t);
    } catch {
      return [];
    }
  }
  return [];
}

const map = {};
for (const row of rows) {
  if (!row?.id) continue;
  const quote = {
    id: row.id,
    content: row.content || "",
    source: row.source ?? null,
    emotion_tags: parseTags(row.emotion_tags),
  };
  map[row.id] = computeQuoteSpec(quote);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(map, null, 2) + "\n", "utf8");

// 분포 요약
const byCat = {};
const byMotif = {};
for (const v of Object.values(map)) {
  byCat[v.category] = (byCat[v.category] || 0) + 1;
  byMotif[v.motif] = (byMotif[v.motif] || 0) + 1;
}
console.log(`✓ ${Object.keys(map).length}개 문구 → ${path.relative(process.cwd(), outPath)}`);
console.log("  카테고리:", byCat);
console.log("  모티프:", byMotif);
