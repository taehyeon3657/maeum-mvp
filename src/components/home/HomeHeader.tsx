export default function HomeHeader() {
  return (
    <header className="header">
      <div className="logo-mark">
        <div className="logo-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 2C9 2 3 5.5 3 9.5C3 12.5 5.5 15 9 15C12.5 15 15 12.5 15 9.5C15 5.5 9 2 9 2Z"
              fill="#c9a96e"
              opacity="0.9"
            />
            <path
              d="M9 5C9 5 6 7.5 6 9.5C6 11 7.3 12 9 12C10.7 12 12 11 12 9.5C12 7.5 9 5 9 5Z"
              fill="#faf7f2"
            />
          </svg>
        </div>
        <span className="logo-text">마음</span>
      </div>
      <div className="header-badge">
        <span className="live-dot" />
        오늘도 위로 중
      </div>
    </header>
  );
}
