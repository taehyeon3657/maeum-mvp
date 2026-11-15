export default function TutorialCard() {
  return (
    <div
      className="quote-card-shell w-full h-full flex flex-col select-none overflow-hidden"
      style={{ background: "linear-gradient(155deg, #FFFCF8 0%, #FFF0E6 55%, #FFE2CC 100%)" }}
    >
      {/* 상단 포인트 라인 */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* 본문 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-10">
        {/* 안내 문구 */}
        <p className="quote-body font-quote text-textMain text-center animate-fade-in-up">
          마음에 드는 글귀는<br />
          <span className="text-like font-extrabold">오른쪽으로</span>,<br />
          넘기고 싶으면<br />
          <span className="text-nope">왼쪽으로</span>
        </p>

        {/* 스와이프 방향 힌트 */}
        <div
          className="flex items-center gap-5 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-13 h-13 rounded-2xl border-2 flex items-center justify-center" style={{ borderColor: "var(--color-nope-border)", background: "#fff1f2" }}>
              <span className="text-nope text-xl font-light">←</span>
            </div>
            <span className="quote-caption font-sans text-text-secondary">넘길게요</span>
          </div>

          <div className="flex flex-col items-center gap-1 px-2">
            <div className="w-px h-8 bg-primary/15" />
            <div className="w-[5px] h-[5px] rounded-sm bg-primary/20 rotate-45" />
            <div className="w-px h-8 bg-primary/15" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-13 h-13 rounded-2xl border-2 flex items-center justify-center" style={{ borderColor: "var(--color-like-border)", background: "#f0fdf4" }}>
              <span className="text-like text-xl font-light">→</span>
            </div>
            <span className="quote-caption font-sans text-text-secondary">좋아요</span>
          </div>
        </div>

        <p
          className="quote-caption font-sans text-text-secondary animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          스와이프하거나 아래 버튼으로 시작하기
        </p>
      </div>

      {/* 하단 워터마크 */}
      <div className="flex justify-end px-8 pb-6">
        <span className="match-badge">마음</span>
      </div>
    </div>
  );
}
