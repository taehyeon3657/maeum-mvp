import Link from "next/link";

export default function HomeCTA() {
  return (
    <div className="cta-section">
      <Link href="/onboarding" className="cta-primary">
        내 감정 성향 찾기
        <svg className="arrow-icon" viewBox="0 0 18 18" fill="none">
          <path
            d="M3 9H15M15 9L9.5 3.5M15 9L9.5 14.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>

      <p className="disclaimer">
        가입 없이 바로 시작 가능 · 개인정보 안전하게 보호<br />
        언제든 탈퇴 가능
      </p>
    </div>
  );
}
