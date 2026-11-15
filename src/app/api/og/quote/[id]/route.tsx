import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { fetchPublicQuote } from "@/src/lib/quotePublic";

export const runtime = "nodejs";

function clip(text: string, max: number) {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const quote = await fetchPublicQuote(id);
  if (!quote) return new Response("not found", { status: 404 });

  const [fontEB, fontR] = await Promise.all([
    readFile(join(process.cwd(), "src/fonts/NanumSquareRoundEB.ttf")),
    readFile(join(process.cwd(), "src/fonts/NanumSquareRoundR.ttf")),
  ]);

  const author = [quote.author ? `— ${quote.author}` : null, quote.source ? `〈${quote.source}〉` : null]
    .filter(Boolean)
    .join("  ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #fff8f4 0%, #ffe4d6 58%, #f6cbb8 100%)",
          padding: "72px",
          fontFamily: "NSR",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontWeight: 800, color: "#E07A5F" }}>
          마음
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 54,
            fontWeight: 800,
            lineHeight: 1.45,
            color: "#1A1714",
            letterSpacing: "-0.03em",
          }}
        >
          {clip(quote.content, 78)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 28, color: "#5C534C" }}>{author}</div>
          <div style={{ display: "flex", fontSize: 28, color: "#E07A5F" }}>글귀 한 장</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "NSR", data: fontEB, weight: 800 },
        { name: "NSR", data: fontR, weight: 400 },
      ],
    },
  );
}
