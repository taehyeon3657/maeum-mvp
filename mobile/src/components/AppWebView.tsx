import React, { useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";

// 배포된 웹 앱 URL — 환경변수로 관리
const WEB_APP_URL =
  process.env.EXPO_PUBLIC_WEB_URL ?? "https://maeum-mvp.vercel.app";

export interface AppWebViewRef {
  sendFCMToken: (token: string) => void;
}

interface Props {
  onMessage?: (event: WebViewMessageEvent) => void;
}

const AppWebView = forwardRef<AppWebViewRef, Props>(({ onMessage }, ref) => {
  const webViewRef = useRef<WebView>(null);

  // 네이티브 → 웹앱으로 FCM 토큰 전달
  const sendFCMToken = useCallback((token: string) => {
    const js = `
      window.dispatchEvent(new CustomEvent('native-fcm-token', { detail: '${token}' }));
      true;
    `;
    webViewRef.current?.injectJavaScript(js);
  }, []);

  useImperativeHandle(ref, () => ({ sendFCMToken }), [sendFCMToken]);

  // Android 뒤로가기 제스처 처리
  const handleShouldStartLoad = useCallback(
    ({ url }: { url: string }) => {
      // 외부 링크는 차단 (내부 라우팅만 허용)
      return url.startsWith(WEB_APP_URL) || url.startsWith("maeum://");
    },
    []
  );

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_APP_URL }}
        style={styles.webview}
        // 성능 최적화
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        // iOS: 상태표시줄 아래로 내용 내려오지 않도록
        contentInsetAdjustmentBehavior="automatic"
        // Android: 하드웨어 가속
        androidLayerType="hardware"
        onMessage={onMessage}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#8B7355" />
          </View>
        )}
        startInLoadingState
        // 웹뷰 캐시 유지 (앱 재실행 시 빠른 로딩)
        cacheEnabled
        cacheMode="LOAD_DEFAULT"
        // UserAgent에 native 표시 → 웹앱에서 구분 가능
        applicationNameForUserAgent={`MaeumNative/${Platform.OS}`}
      />
    </View>
  );
});

AppWebView.displayName = "AppWebView";
export default AppWebView;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF8F3" },
  webview: { flex: 1 },
  loading: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDF8F3",
  },
});
