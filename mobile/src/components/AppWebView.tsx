import React, { useRef, useCallback, forwardRef, useImperativeHandle, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import WebView, { WebViewMessageEvent, WebViewNavigation } from "react-native-webview";

const WEB_APP_URL =
  process.env.EXPO_PUBLIC_WEB_URL ?? "https://maeum-mvp.vercel.app";

export interface AppWebViewRef {
  sendFCMToken: (token: string) => void;
  goBack: () => boolean;
  navigateTo: (path: string) => void;
}

interface Props {
  onMessage?: (event: WebViewMessageEvent) => void;
  onLoadEnd?: () => void;
}

const AppWebView = forwardRef<AppWebViewRef, Props>(({ onMessage, onLoadEnd }, ref) => {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasError, setHasError] = useState(false);

  const sendFCMToken = useCallback((token: string) => {
    const js = `
      window.dispatchEvent(new CustomEvent('native-fcm-token', { detail: '${token}' }));
      true;
    `;
    webViewRef.current?.injectJavaScript(js);
  }, []);

  const goBack = useCallback(() => {
    if (canGoBack) {
      webViewRef.current?.goBack();
      return true;
    }
    return false;
  }, [canGoBack]);

  const navigateTo = useCallback((path: string) => {
    const url = `${WEB_APP_URL}${path}`;
    webViewRef.current?.injectJavaScript(`window.location.href = '${url}'; true;`);
  }, []);

  useImperativeHandle(ref, () => ({ sendFCMToken, goBack, navigateTo }), [
    sendFCMToken,
    goBack,
    navigateTo,
  ]);

  const handleShouldStartLoad = useCallback(({ url }: { url: string }) => {
    return url.startsWith(WEB_APP_URL) || url.startsWith("maeum://");
  }, []);

  const handleNavigationStateChange = useCallback((state: WebViewNavigation) => {
    setCanGoBack(state.canGoBack);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setHasError(false);
    onLoadEnd?.();
  }, [onLoadEnd]);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    webViewRef.current?.reload();
  }, []);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: WEB_APP_URL }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        contentInsetAdjustmentBehavior="automatic"
        androidLayerType="hardware"
        // iOS 스와이프 뒤로가기 제스처
        allowsBackForwardNavigationGestures={Platform.OS === "ios"}
        bounces={false}
        onMessage={onMessage}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        onHttpError={handleError}
        renderLoading={() => (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#8B7355" />
          </View>
        )}
        startInLoadingState
        cacheEnabled
        cacheMode="LOAD_DEFAULT"
        applicationNameForUserAgent={`MaeumNative/${Platform.OS}`}
      />
      {hasError && (
        <View style={styles.overlay}>
          <Text style={styles.errorText}>연결에 실패했습니다</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>다시 시도</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

AppWebView.displayName = "AppWebView";
export default AppWebView;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF8F3" },
  webview: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FDF8F3",
  },
  errorText: {
    fontSize: 16,
    color: "#5C4033",
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#8B7355",
    borderRadius: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
