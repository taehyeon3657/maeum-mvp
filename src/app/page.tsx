"use client";

import HomeDecorative from "@/src/components/home/HomeDecorative";
import HomeHeader from "@/src/components/home/HomeHeader";
import HomeHero from "@/src/components/home/HomeHero";
import HomeCTA from "@/src/components/home/HomeCTA";
import HomeStats from "@/src/components/home/HomeStats";
import QuoteCarousel from "@/src/components/home/QuoteCarousel";

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Noto+Serif+KR:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --ink: #1a1714;
          --cream: #faf7f2;
          --warm: #f0ebe1;
          --gold: #c9a96e;
          --gold-light: #e8d5b0;
          --rust: #c0604a;
          --muted: #8a8178;
          --border: rgba(201,169,110,0.25);
        }

        body { background: var(--cream); overflow-x: hidden; }

        .page-root {
          min-height: 100vh;
          background: var(--cream);
          position: relative;
          overflow: hidden;
        }

        .cursor-glow {
          position: fixed;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%);
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: left 0.8s ease, top 0.8s ease;
          z-index: 0;
        }

        .grain {
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 1;
          opacity: 0.5;
        }

        .content {
          position: relative;
          z-index: 2;
          max-width: 430px;
          margin: 0 auto;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 0 28px;
        }

        .header {
          padding-top: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          opacity: 0;
          animation: fadeSlideDown 0.9s 0.1s ease forwards;
        }

        .logo-mark {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon {
          width: 34px;
          height: 34px;
          background: var(--ink);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 400;
          color: var(--ink);
          letter-spacing: 0.02em;
        }

        .header-badge {
          background: var(--warm);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.08em;
          font-family: 'Noto Serif KR', serif;
        }

        .hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 0 20px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          opacity: 0;
          animation: fadeSlideUp 0.9s 0.3s ease forwards;
        }

        .eyebrow-line {
          width: 32px;
          height: 1px;
          background: var(--gold);
        }

        .eyebrow-text {
          font-size: 11px;
          color: var(--gold);
          letter-spacing: 0.15em;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
        }

        .hero-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(42px, 10vw, 56px);
          font-weight: 300;
          line-height: 1.18;
          color: var(--ink);
          margin-bottom: 10px;
          opacity: 0;
          animation: fadeSlideUp 0.9s 0.45s ease forwards;
          letter-spacing: -0.01em;
        }

        .hero-headline em {
          font-style: italic;
          color: var(--gold);
        }

        .hero-sub {
          font-family: 'Noto Serif KR', serif;
          font-size: 14px;
          color: var(--muted);
          line-height: 1.9;
          font-weight: 300;
          margin-bottom: 44px;
          opacity: 0;
          animation: fadeSlideUp 0.9s 0.6s ease forwards;
        }

        .quote-card {
          position: relative;
          background: white;
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px 28px;
          margin-bottom: 36px;
          overflow: hidden;
          opacity: 0;
          animation: fadeSlideUp 0.9s 0.75s ease forwards;
          box-shadow: 0 4px 40px rgba(26,23,20,0.05);
        }

        .quote-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }

        .quote-mark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 64px;
          line-height: 0.6;
          color: var(--gold-light);
          margin-bottom: 16px;
          display: block;
          font-weight: 300;
        }

        .quote-text {
          font-family: 'Noto Serif KR', serif;
          font-size: 17px;
          line-height: 1.85;
          color: var(--ink);
          font-weight: 400;
          min-height: 64px;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .quote-text.exiting {
          opacity: 0;
          transform: translateY(-8px);
        }

        .quote-author {
          margin-top: 16px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          color: var(--gold);
          letter-spacing: 0.08em;
          font-style: italic;
        }

        .quote-dots {
          display: flex;
          gap: 6px;
          margin-top: 20px;
        }

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--gold-light);
          transition: all 0.4s ease;
        }

        .dot.active {
          background: var(--gold);
          width: 18px;
          border-radius: 3px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 36px;
          opacity: 0;
          animation: fadeSlideUp 0.9s 0.9s ease forwards;
        }

        .stat-item {
          background: var(--warm);
          padding: 18px 12px;
          text-align: center;
        }

        .stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 400;
          color: var(--ink);
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 10px;
          color: var(--muted);
          font-family: 'Noto Serif KR', serif;
          letter-spacing: 0.04em;
        }

        .cta-section {
          padding-bottom: 44px;
          opacity: 0;
          animation: fadeSlideUp 0.9s 1.05s ease forwards;
        }

        .cta-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 19px 24px;
          background: var(--ink);
          color: var(--cream);
          border: none;
          border-radius: 16px;
          font-family: 'Noto Serif KR', serif;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.04em;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .cta-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(201,169,110,0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cta-primary:hover::before { opacity: 1; }
        .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(26,23,20,0.2); }
        .cta-primary:active { transform: translateY(0); }

        .arrow-icon {
          width: 18px;
          height: 18px;
          transition: transform 0.3s ease;
        }

        .cta-primary:hover .arrow-icon { transform: translateX(4px); }

        .cta-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 16px 24px;
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 16px;
          font-family: 'Noto Serif KR', serif;
          font-size: 13px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
          margin-bottom: 24px;
          letter-spacing: 0.04em;
        }

        .cta-secondary:hover {
          color: var(--ink);
          border-color: var(--gold);
          background: var(--warm);
        }

        .disclaimer {
          text-align: center;
          font-size: 10.5px;
          color: var(--muted);
          font-family: 'Noto Serif KR', serif;
          letter-spacing: 0.04em;
          line-height: 1.8;
          opacity: 0.7;
        }

        .deco-circle {
          position: absolute;
          right: -80px;
          top: 120px;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          border: 1px solid var(--border);
          pointer-events: none;
          opacity: 0;
          animation: fadeIn 1.5s 1.2s ease forwards;
        }

        .deco-circle-inner {
          position: absolute;
          right: -40px;
          top: 160px;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          border: 1px solid rgba(201,169,110,0.15);
          pointer-events: none;
          opacity: 0;
          animation: fadeIn 1.5s 1.4s ease forwards;
        }

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse-gold {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--rust);
          animation: pulse-gold 2s ease infinite;
          display: inline-block;
          margin-right: 6px;
        }
      `}</style>

      <div className="page-root">
        <HomeDecorative />

        <div className="content">
          <HomeHeader />

          <section className="hero">
            <HomeHero />
            <QuoteCarousel />
            <HomeStats />
            <HomeCTA />
          </section>
        </div>
      </div>
    </>
  );
}
