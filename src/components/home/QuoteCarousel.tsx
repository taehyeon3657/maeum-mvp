"use client";

import { useEffect, useRef, useState } from "react";

const QUOTES = [
  { text: "흘러가는 것들을 붙잡으려 하지 마세요.", author: "릴케" },
  { text: "당신은 충분히 충분합니다.", author: "작자 미상" },
  { text: "오늘 하루도 잘 버텼습니다.", author: "마음" },
  { text: "멈춰도 괜찮아요, 잠시 쉬어가도 돼요.", author: "작자 미상" },
  { text: "상처받은 곳에서 빛이 들어옵니다.", author: "레너드 코헨" },
];

export default function QuoteCarousel() {
  const [displayIndex, setDisplayIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setExiting(true);
      transitionTimeoutRef.current = setTimeout(() => {
        setDisplayIndex((prev) => (prev + 1) % QUOTES.length);
        setExiting(false);
      }, 400);
    }, 3800);

    return () => {
      clearInterval(interval);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const display = QUOTES[displayIndex];

  return (
    <div className="quote-card">
      <span className="quote-mark">&quot;</span>
      <p className={`quote-text ${exiting ? "exiting" : ""}`}>{display.text}</p>
      <p className="quote-author">— {display.author}</p>
      <div className="quote-dots">
        {QUOTES.map((_, i) => (
          <div key={i} className={`dot ${i === displayIndex ? "active" : ""}`} />
        ))}
      </div>
    </div>
  );
}
