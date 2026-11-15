import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QuoteLanding from "@/src/components/quote/QuoteLanding";
import { fetchPublicQuote } from "@/src/lib/quotePublic";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ gift?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const quote = await fetchPublicQuote(id);
  if (!quote) return { title: "글귀를 찾을 수 없어요" };

  const title = quote.content.length > 42 ? `${quote.content.slice(0, 42)}…` : quote.content;
  const description = quote.author
    ? `${quote.author} · 마음에서 건넨 문장`
    : "마음에서 건넨 문장";

  return {
    title,
    description,
    alternates: { canonical: `/q/${id}` },
    openGraph: {
      title,
      description,
      url: `/q/${id}`,
      type: "article",
      images: [{ url: `/api/og/quote/${id}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/api/og/quote/${id}`],
    },
  };
}

export default async function QuotePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { gift } = await searchParams;
  const quote = await fetchPublicQuote(id);
  if (!quote) notFound();
  return <QuoteLanding quote={quote} gift={gift === "1"} />;
}
