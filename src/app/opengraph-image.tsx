import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "마음 — 매일 당신의 마음을 울리는 글귀";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [fontEB, fontR] = await Promise.all([
    readFile(join(process.cwd(), "src/fonts/NanumSquareRoundEB.ttf")),
    readFile(join(process.cwd(), "src/fonts/NanumSquareRoundR.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #fdf9f5 0%, #f5ede3 60%, #edddd0 100%)",
          fontFamily: "NSR",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative circles — no children, no display needed */}
        <div
          style={{
            position: "absolute",
            right: -60,
            top: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: "1px solid rgba(224,122,95,0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            width: 260,
            height: 260,
            borderRadius: "50%",
            border: "1px solid rgba(224,122,95,0.10)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -100,
            bottom: -100,
            width: 320,
            height: 320,
            borderRadius: "50%",
            border: "1px solid rgba(224,122,95,0.10)",
            display: "flex",
          }}
        />

        {/* Left column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            padding: "72px 60px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
            <div
              style={{
                width: 44,
                height: 44,
                background: "#1a1714",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.38 4.068 1 7.268 1c1.994 0 3.557 1.026 4.732 2.687C13.175 2.026 14.74 1 16.732 1 19.932 1 23 3.38 23 7.191c0 4.105-5.37 8.863-11 14.402z"
                  fill="#e07a5f"
                />
              </svg>
            </div>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#1a1714", letterSpacing: "0.04em" }}>
              마음
            </span>
          </div>

          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 32, height: 2, background: "#e07a5f", borderRadius: 2, display: "flex" }} />
            <span style={{ fontSize: 13, color: "#e07a5f", letterSpacing: "0.15em", fontWeight: 800 }}>
              DAILY QUOTES
            </span>
          </div>

          {/* Headline — flex column so each line is a separate span */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            <span style={{ color: "#1a1714" }}>매일 당신의</span>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <span style={{ color: "#e07a5f" }}>마음</span>
              <span style={{ color: "#1a1714" }}>을 울리는</span>
            </div>
            <span style={{ color: "#1a1714" }}>글귀</span>
          </div>

          {/* Subtitle — each line is a separate span */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 16,
              color: "#8a8178",
              lineHeight: 1.8,
              fontWeight: 400,
              marginBottom: 40,
            }}
          >
            <span>감정을 선택하면 지금 이 순간</span>
            <span>당신에게 꼭 맞는 글귀를 찾아드려요</span>
          </div>

          {/* Progress dots */}
          <div style={{ display: "flex", gap: 8 }}>
            {[true, false, false, false].map((active, i) => (
              <div
                key={i}
                style={{
                  width: active ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: active ? "#e07a5f" : "rgba(224,122,95,0.25)",
                  display: "flex",
                }}
              />
            ))}
          </div>
        </div>

        {/* Right column — quote card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: 420,
            padding: "60px 48px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 28,
              padding: "40px 36px",
              width: "100%",
              boxShadow: "0 16px 64px rgba(224,122,95,0.18)",
              border: "1px solid rgba(201,169,110,0.22)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Top accent line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: "linear-gradient(90deg, transparent, #e07a5f, transparent)",
                display: "flex",
              }}
            />

            {/* Quote mark */}
            <div
              style={{
                fontSize: 72,
                lineHeight: 0.6,
                color: "rgba(224,122,95,0.20)",
                fontWeight: 800,
                marginBottom: 20,
                display: "flex",
              }}
            >
              &quot;
            </div>

            {/* Quote text — each line is a separate span */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 18,
                fontWeight: 800,
                color: "#1a1714",
                lineHeight: 1.85,
                marginBottom: 20,
              }}
            >
              <span>지금 이 순간의 감정도</span>
              <span>당신의 일부입니다.</span>
              <span>있는 그대로 느끼세요.</span>
            </div>

            {/* Author */}
            <div
              style={{
                fontSize: 13,
                color: "#e07a5f",
                fontWeight: 700,
                letterSpacing: "0.06em",
                marginBottom: 24,
                display: "flex",
              }}
            >
              — 마음
            </div>

            {/* Dots */}
            <div style={{ display: "flex", gap: 7 }}>
              {[true, false, false].map((active, i) => (
                <div
                  key={i}
                  style={{
                    width: active ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: active ? "#e07a5f" : "rgba(224,122,95,0.25)",
                    display: "flex",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "NSR", data: fontEB, weight: 800, style: "normal" },
        { name: "NSR", data: fontR, weight: 400, style: "normal" },
      ],
    },
  );
}
