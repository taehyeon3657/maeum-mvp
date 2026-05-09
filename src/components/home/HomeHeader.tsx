export default function HomeHeader() {
  return (
    <header className="header">
      <div className="logo-mark">
        <div className="logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.38 4.068 1 7.268 1c1.994 0 3.557 1.026 4.732 2.687C13.175 2.026 14.74 1 16.732 1 19.932 1 23 3.38 23 7.191c0 4.105-5.37 8.863-11 14.402z"
              fill="white"
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
