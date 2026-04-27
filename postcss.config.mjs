/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // 👈 이 부분이 v4 방식으로 바뀌었습니다!
  },
};

export default config;
