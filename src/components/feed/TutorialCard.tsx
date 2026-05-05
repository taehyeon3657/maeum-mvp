export default function TutorialCard() {
  return (
    <div className="w-full h-full flex flex-col rounded-[28px] overflow-hidden select-none bg-white border border-gray-200 shadow-xl">
      {/* 상단: 왼쪽(싫어요) 영역 */}
      <div className="flex flex-1 min-h-0">
        {/* 왼쪽 절반 - 싫어요 */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-gray-50 border-r border-gray-100 p-6">
          <span className="text-4xl grayscale">💔</span>
          <p className="font-sans text-xs font-semibold text-gray-400 tracking-widest uppercase">
            싫어요
          </p>
          <div className="flex items-center gap-1 text-gray-300">
            <span className="text-2xl">←</span>
            <span className="font-sans text-xs text-gray-400">왼쪽으로</span>
          </div>
        </div>

        {/* 오른쪽 절반 - 좋아요 */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-gray-50 p-6">
          <span className="text-4xl grayscale">💚</span>
          <p className="font-sans text-xs font-semibold text-gray-400 tracking-widest uppercase">
            좋아요
          </p>
          <div className="flex items-center gap-1 text-gray-300">
            <span className="font-sans text-xs text-gray-400">오른쪽으로</span>
            <span className="text-2xl">→</span>
          </div>
        </div>
      </div>

      {/* 하단: 안내 문구 */}
      <div className="px-7 py-8 text-center border-t border-gray-100 bg-white">
        <p className="font-quote text-xl text-gray-700 leading-relaxed mb-2">
          마음에 드는 글귀는 오른쪽,
          <br />
          넘기고 싶으면 왼쪽으로
        </p>
        <p className="font-sans text-xs text-gray-400 mt-3">
          스와이프해서 시작하기 →
        </p>
      </div>
    </div>
  );
}
