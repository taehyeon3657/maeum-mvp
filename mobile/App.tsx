import React, { useCallback, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import AppWebView, { AppWebViewRef } from "@/components/AppWebView";
import { useNativeNotifications, registerBackgroundHandler } from "@/hooks/useNativeNotifications";

// 앱이 종료된 상태에서도 수신되도록 최상단에서 백그라운드 핸들러 등록
registerBackgroundHandler();

export default function App() {
  const webViewRef = useRef<AppWebViewRef>(null);

  // FCM 토큰이 준비되면 WebView 안의 웹앱으로 주입
  const handleTokenReady = useCallback((token: string) => {
    webViewRef.current?.sendFCMToken(token);
  }, []);

  useNativeNotifications(handleTokenReady);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FDF8F3" />
      <AppWebView ref={webViewRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF8F3" },
});
