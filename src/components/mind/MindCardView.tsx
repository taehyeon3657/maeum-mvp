interface MindQuote {
  id: string;
  content: string;
  author: string | null;
}

export interface MindCardData {
  headline: string;
  detail: string;
  emoji: string;
  emotionId: string | null;
  percent: number | null;
  mbti: string;
  quote: MindQuote | null;
  likeCount: number;
  readCount: number;
}

interface Props {
  card: MindCardData;
  streakCount?: number;
}

export default function MindCardView({ card, streakCount = 0 }: Props) {
  return (
    <section
      className="w-full rounded-[28px] px-6 py-6 text-left"
      style={{
        background:
          "linear-gradient(160deg, #fff8f4 0%, #ffe8dc 55%, #f8d2c4 100%)",
        border: "1px solid rgba(253,38,122,0.16)",
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="font-quote text-sm font-extrabold tracking-wide text-primary">마음 카드</span>
        <div className="flex items-center gap-2">
          {streakCount > 0 && (
            <span className="font-sans text-[11px] font-bold text-primary px-2.5 py-1 rounded-full bg-white/70">
              {streakCount}일째
            </span>
          )}
          {card.mbti && (
            <span className="font-sans text-[11px] font-bold text-textMain px-2.5 py-1 rounded-full bg-white/70">
              {card.mbti}
            </span>
          )}
        </div>
      </div>

      <p className="text-3xl leading-none mb-3" aria-hidden>{card.emoji}</p>
      <h2 className="font-quote text-[1.65rem] font-extrabold text-textMain leading-snug">
        {card.headline}
      </h2>
      <p className="font-sans text-sm text-textMuted leading-relaxed mt-2">{card.detail}</p>

      {card.quote && (
        <blockquote className="mt-5 rounded-2xl bg-white/75 px-4 py-4">
          <p className="font-quote text-[1.05rem] text-textMain leading-relaxed">
            {card.quote.content}
          </p>
          {card.quote.author && (
            <footer className="font-sans text-[12px] text-textMuted mt-2">
              — {card.quote.author}
            </footer>
          )}
        </blockquote>
      )}
    </section>
  );
}
