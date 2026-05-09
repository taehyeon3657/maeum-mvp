export default function TutorialCard() {
  return (
    <div
      className="w-full h-full flex flex-col rounded-[28px] shadow-2xl shadow-primary/10 select-none overflow-hidden"
      style={{ background: "linear-gradient(155deg, #FFFCF8 0%, #FFF0E6 55%, #FFE2CC 100%)" }}
    >
      {/* 상단 포인트 라인 */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* 본문 */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-10">
        {/* 안내 문구 */}
        <p className="font-quote text-[1.45rem] leading-[1.9] text-textMain text-center animate-fade-in-up">
          마음에 드는 글귀는<br />
          <em className="text-primary">오른쪽으로</em>,<br />
          넘기고 싶으면<br />
          <span className="text-textMuted/70 not-italic">왼쪽으로</span>
        </p>

        {/* 스와이프 방향 힌트 */}
        <div
          className="flex items-center gap-5 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-13 h-13 rounded-2xl border-2 border-rose-300/70 bg-rose-50/80 flex items-center justify-center shadow-sm">
              <span className="text-rose-400 text-xl font-light">←</span>
            </div>
            <span className="font-sans text-[11px] text-textMuted tracking-wide">넘길게요</span>
          </div>

          <div className="flex flex-col items-center gap-1 px-2">
            <div className="w-px h-8 bg-primary/15" />
            <div className="w-[5px] h-[5px] rounded-sm bg-primary/20 rotate-45" />
            <div className="w-px h-8 bg-primary/15" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-13 h-13 rounded-2xl border-2 border-green-300/70 bg-green-50/80 flex items-center justify-center shadow-sm">
              <span className="text-green-500 text-xl font-light">→</span>
            </div>
            <span className="font-sans text-[11px] text-textMuted tracking-wide">좋아요</span>
          </div>
        </div>

        <p
          className="font-sans text-xs text-primary/50 animate-fade-in-up tracking-widest"
          style={{ animationDelay: "0.3s" }}
        >
          스와이프해서 시작하기 →
        </p>
      </div>

      {/* 하단 워터마크 */}
      <div className="flex justify-end px-8 pb-6">
        <span className="font-quote text-[11px] text-primary/30 italic tracking-[0.25em]">마음</span>
      </div>
    </div>
  );
}
