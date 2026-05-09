import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "linear-gradient(150deg, #f0856a 0%, #d4624a 55%, #c05238 100%)",
          borderRadius: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top gloss highlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 88,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
            borderRadius: "38px 38px 60% 60%",
            display: "flex",
          }}
        />

        {/* Heart + sparkle in one SVG */}
        <svg
          width="116"
          height="116"
          viewBox="0 0 100 100"
          fill="none"
        >
          {/* Heart */}
          <path
            d="M50 88C27.5 66.5 8 52 8 34.5C8 21.5 17.5 13 28.5 13C35.5 13 41.5 16.8 50 24.5C58.5 16.8 64.5 13 71.5 13C82.5 13 92 21.5 92 34.5C92 52 72.5 66.5 50 88Z"
            fill="white"
          />
          {/* 4-pointed sparkle top-right */}
          <path
            d="M76 18 L77.4 23.6 L83 25 L77.4 26.4 L76 32 L74.6 26.4 L69 25 L74.6 23.6 Z"
            fill="rgba(255,255,255,0.75)"
          />
          {/* Small dot accent */}
          <circle cx="86" cy="15" r="2.2" fill="rgba(255,255,255,0.45)" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
