"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Quote } from "@/src/models/feed";
import { getQuoteBackground } from "@/src/lib/quoteBackground";
import { useResolvedQuoteImage } from "@/src/hooks/useQuoteImage";
import { createClient } from "@/src/lib/supabase";
import { APP_ROUTES } from "@/src/lib/appRoutesCore.mjs";
import QuoteSendButton from "@/src/components/quote/QuoteSendButton";

interface Props {
  quote: Quote;
  gift: boolean;
}

export default function QuoteLanding({ quote, gift }: Props) {
  const router = useRouter();
  const resolved = useResolvedQuoteImage(quote);
  const bg = getQuoteBackground(quote);
  const imgOk = resolved.status === "image";
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setLoggedIn(Boolean(user));
    };
    void check();
  }, []);

  const textColor = imgOk ? "#ffffff" : bg.textColor;
  const mutedColor = imgOk ? "rgba(255,255,255,0.82)" : bg.mutedColor;
  const textShadow = imgOk ? "0 1px 10px rgba(0,0,0,0.55)" : undefined;
  const rootStyle = imgOk
    ? {
        backgroundImage: `url("${resolved.url}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : bg.style;

  return (
    <div className="min-h-dvh flex flex-col px-5 pt-8 pb-8">
      <p className="font-quote text-sm font-extrabold text-primary tracking-wide mb-4">마음</p>
      <p className="font-sans text-sm text-textMuted mb-5">
        {gift ? "누군가 이 문장을 건넸어요." : "이 문장에서 마음이 잠시 머물렀어요."}
      </p>

      <article
        className="relative flex-1 min-h-[420px] rounded-[28px] overflow-hidden flex flex-col px-7 py-8"
        style={rootStyle}
      >
        {imgOk && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 28%, rgba(0,0,0,0.04) 52%, rgba(0,0,0,0.30) 78%, rgba(0,0,0,0.58) 100%)",
            }}
            aria-hidden
          />
        )}
        <div className="relative flex-1 flex flex-col justify-center">
          <p
            className="font-quote text-[1.65rem] leading-relaxed text-center break-keep"
            style={{ color: textColor, textShadow }}
          >
            {quote.content}
          </p>
          {(quote.author || quote.source) && (
            <p
              className="font-sans text-[13px] text-center mt-6"
              style={{ color: mutedColor, textShadow }}
            >
              {quote.author ? `— ${quote.author}` : ""}
              {quote.source ? `  〈${quote.source}〉` : ""}
            </p>
          )}
        </div>
      </article>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          className="brand-fill w-full py-4"
          onClick={() => router.push(loggedIn ? APP_ROUTES.feed : APP_ROUTES.onboarding)}
        >
          {loggedIn ? "오늘의 글귀 보러가기" : "나도 오늘의 글귀 받기"}
        </button>
        <QuoteSendButton id={quote.id} content={quote.content} gift variant="quiet" />
      </div>
    </div>
  );
}
