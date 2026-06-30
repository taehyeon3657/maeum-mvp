import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_QUOTE_IMAGE_BASE_URL;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!BASE_URL) {
    return new NextResponse("image base URL not configured", { status: 503 });
  }

  const { id } = await params;
  if (!id) {
    return new NextResponse("missing id", { status: 400 });
  }

  const upstream = `${BASE_URL.replace(/\/+$/, "")}/${encodeURIComponent(id)}.png`;

  let response: Response;
  try {
    response = await fetch(upstream, { next: { revalidate: 86400 } });
  } catch {
    return new NextResponse("upstream fetch failed", { status: 502 });
  }

  if (!response.ok) {
    return new NextResponse("image not found", { status: 404 });
  }

  const body = await response.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
