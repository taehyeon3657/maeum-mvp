import "./home.css";
import HomeDecorative from "@/src/components/home/HomeDecorative";
import HomeHeader from "@/src/components/home/HomeHeader";
import HomeHero from "@/src/components/home/HomeHero";
import HomeCTA from "@/src/components/home/HomeCTA";
import HomeStats from "@/src/components/home/HomeStats";
import QuoteCarousel from "@/src/components/home/QuoteCarousel";

export default function HomePage() {
  return (
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
  );
}
