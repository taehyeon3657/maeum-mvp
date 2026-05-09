export default function HomeHero() {
  return (
    <>
      <div className="eyebrow">
        <div className="eyebrow-line" />
        <span className="eyebrow-text">감정 맞춤 글귀 서비스</span>
      </div>

      <h1 className="hero-headline">
        오늘 하루,<br />
        <span className="hero-em">마음</span>은<br />
        어떤가요?
      </h1>

      <p className="hero-sub">
        스와이프 하나로 내 감정을 파악하고,<br />
        딱 맞는 위로의 글귀를 매일 받아보세요.
      </p>
    </>
  );
}
