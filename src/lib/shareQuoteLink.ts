import { quoteOgPath, quotePublicPath, quoteShareText } from "@/src/lib/quoteShareCore.mjs";

export type ShareQuoteResult = "kakao" | "shared" | "copied" | "cancelled";

interface KakaoShareApi {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (options: Record<string, unknown>) => void;
  };
}

type KakaoWindow = Window & { Kakao?: KakaoShareApi };

function origin() {
  return window.location.origin;
}

export function canUseKakaoShare() {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
  return Boolean(key) && window.location.protocol === "https:";
}

function loadKakao(key: string): Promise<KakaoShareApi> {
  const kakaoWindow = window as KakaoWindow;
  if (kakaoWindow.Kakao) {
    if (!kakaoWindow.Kakao.isInitialized()) kakaoWindow.Kakao.init(key);
    return Promise.resolve(kakaoWindow.Kakao);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
    script.async = true;
    script.onload = () => {
      if (!kakaoWindow.Kakao) {
        reject(new Error("Kakao SDK missing"));
        return;
      }
      if (!kakaoWindow.Kakao.isInitialized()) kakaoWindow.Kakao.init(key);
      resolve(kakaoWindow.Kakao);
    };
    script.onerror = () => reject(new Error("Kakao SDK failed"));
    document.head.appendChild(script);
  });
}

async function shareWithKakao(id: string, content: string, url: string) {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
  if (!key) throw new Error("Kakao key missing");
  const kakao = await loadKakao(key);
  const title = content.trim().slice(0, 40) || "마음";
  kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title,
      description: "마음에서 건넨 문장",
      imageUrl: `${origin()}${quoteOgPath(id)}`,
      link: { mobileWebUrl: url, webUrl: url },
    },
    buttons: [
      {
        title: "글귀 보기",
        link: { mobileWebUrl: url, webUrl: url },
      },
    ],
  });
}

export async function shareQuoteLink({
  id,
  content,
  gift = false,
}: {
  id: string;
  content: string;
  gift?: boolean;
}): Promise<ShareQuoteResult> {
  const url = new URL(quotePublicPath(id, { gift }), origin()).href;
  const text = quoteShareText({ content, gift }) as string;

  if (gift && canUseKakaoShare()) {
    try {
      await shareWithKakao(id, content, url);
      return "kakao";
    } catch {
      // 카카오 키가 있어도 미리보기가 거절되면 시스템 공유로 넘긴다.
    }
  }

  if (typeof navigator.share === "function") {
    try {
      await navigator.share({ title: "마음", text, url });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
    }
  }

  await navigator.clipboard.writeText(`${text}\n${url}`);
  return "copied";
}
