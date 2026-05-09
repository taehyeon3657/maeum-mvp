import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "linear-gradient(145deg, #f0856a 0%, #c85a3e 100%)",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.38 4.068 1 7.268 1c1.994 0 3.557 1.026 4.732 2.687C13.175 2.026 14.74 1 16.732 1 19.932 1 23 3.38 23 7.191c0 4.105-5.37 8.863-11 14.402z"
            fill="white"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
