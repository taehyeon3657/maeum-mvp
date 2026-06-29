import React, { useCallback, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, BackHandler, Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import type { WebViewMessageEvent } from "react-native-webview";
import AppWebView, { AppWebViewRef } from "@/components/AppWebView";
import { useNativeNotifications, registerBackgroundHandler } from "@/hooks/useNativeNotifications";
import {
  cancelCooldownNotification,
  configureNotificationChannel,
  scheduleCooldownNotification,
  useCooldownNotificationNavigation,
} from "@/notifications/cooldownNotifications";

SplashScreen.preventAutoHideAsync();
registerBackgroundHandler();

export default function App() {
  const webViewRef = useRef<AppWebViewRef>(null);

  const handleTokenReady = useCallback((token: string) => {
    webViewRef.current?.sendFCMToken(token);
  }, []);

  const handleNavigateTo = useCallback((path: string) => {
    webViewRef.current?.navigateTo(path);
  }, []);

  useNativeNotifications(handleTokenReady, undefined, handleNavigateTo);
  useCooldownNotificationNavigation(handleNavigateTo);

  useEffect(() => {
    void configureNotificationChannel();
  }, []);

  const handleWebViewMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(event.nativeEvent.data) as {
        type?: string;
        delayMs?: unknown;
        title?: string;
        body?: string;
        path?: string;
      };

      if (message.type === "scheduleCooldownNotification") {
        const delayMs =
          typeof message.delayMs === "number" && Number.isFinite(message.delayMs)
            ? message.delayMs
            : 0;

        void scheduleCooldownNotification({
          delayMs,
          title: message.title,
          body: message.body,
          path: message.path,
        });
        return;
      }

      if (message.type === "cancelCooldownNotification") {
        void cancelCooldownNotification();
      }
    } catch {
      // Ignore non-JSON messages from the WebView.
    }
  }, []);

  // WebView 첫 로드 완료 시 스플래시 스크린 숨김
  const handleLoadEnd = useCallback(() => {
    SplashScreen.hideAsync();
  }, []);

  // Android 하드웨어 뒤로가기: WebView 히스토리 있으면 웹 내 뒤로, 없으면 앱 종료
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      return webViewRef.current?.goBack() ?? false;
    });
    return () => handler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FDF8F3" />
      <AppWebView
        ref={webViewRef}
        onMessage={handleWebViewMessage}
        onLoadEnd={handleLoadEnd}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDF8F3" },
});
