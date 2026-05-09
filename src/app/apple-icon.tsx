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
          background: "linear-gradient(145deg, #2a2420 0%, #1a1714 100%)",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="96" height="96" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.38 4.068 1 7.268 1c1.994 0 3.557 1.026 4.732 2.687C13.175 2.026 14.74 1 16.732 1 19.932 1 23 3.38 23 7.191c0 4.105-5.37 8.863-11 14.402z"
            fill="#e07a5f"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
