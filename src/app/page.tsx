import Link from "next/link";
import { Heart, Quote } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-8">
      {/* 상단: 서비스 로고 및 명확한 액션 제시 */}
      <header className="flex flex-col items-center mt-20 text-center w-full">
        <div className="mb-6 p-3 bg-white rounded-full shadow-sm text-primary">
          <Heart size={32} fill="currentColor" />
        </div>
        <h1 className="text-4xl font-quote text-textMain leading-tight">
          마음<span className="text-primary">.</span>
        </h1>
        <p className="mt-5 text-textMain font-sans tracking-tight leading-relaxed">
          하루 10번, 내 마음을 울린 문구를 골라보세요. <br />
          <span className="text-textMuted text-sm">
            선택이 쌓일수록 나를 더 잘 아는 위로가 찾아옵니다.
          </span>
        </p>
      </header>

      {/* 중간: 틴더식 카드 스와이프 미리보기 UI */}
      <section className="w-full bg-surface p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 my-10 relative">
        {/* 장식용 따옴표 아이콘 */}
        <div className="absolute top-6 left-6 text-gray-200">
          <Quote size={24} fill="currentColor" />
        </div>

        <p className="font-quote text-xl text-textMain leading-relaxed italic mt-6 text-center">
          "잠시 멈춰 서서 <br />
          당신의 마음을 들여다보는 <br />
          시간을 가져보세요."
        </p>
      </section>

      {/* 하단: 온보딩(10개 스와이프) 시작 버튼 */}
      <footer className="w-full mb-12">
        <Link
          href="/onboarding"
          className="flex items-center justify-center w-full py-4 bg-primary text-white rounded-2xl font-sans font-bold text-lg shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          첫 10개 문장 만나보기
        </Link>
        <p className="mt-4 text-center text-xs text-textMuted">
          가입 없이 바로 스와이프를 시작하세요
        </p>
      </footer>
    </div>
  );
}
