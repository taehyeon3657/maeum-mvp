# 마음 — Native App Wrapper

기존 Next.js 웹앱을 React Native WebView로 래핑한 Android/iOS 앱입니다.  
네이티브 FCM을 통해 앱이 완전히 종료된 상태에서도 푸시 알림을 수신합니다.

## 구조

```
mobile/
  App.tsx                          # 앱 진입점
  src/
    components/AppWebView.tsx      # WebView + 네이티브 브리지
    hooks/useNativeNotifications.ts # FCM 토큰 획득 & 메시지 수신
```

## 사전 준비

### 1. Firebase 설정 파일 배치
Firebase 콘솔에서 다운로드한 파일을 `mobile/` 폴더에 배치:
- Android: `google-services.json`
- iOS: `GoogleService-Info.plist`

이 파일들은 git에 커밋하지 않고 EAS file 환경변수로 관리합니다.
EAS Build에서는 install/prebuild 전에 아래 환경변수 파일을
`google-services.json` / `GoogleService-Info.plist`로 복사합니다.

```bash
npx eas-cli@latest env:create \
  --name GOOGLE_SERVICES_JSON \
  --type file \
  --value ./google-services.json \
  --visibility secret \
  --scope project \
  --environment development \
  --environment preview \
  --environment production \
  --force \
  --non-interactive

npx eas-cli@latest env:create \
  --name GOOGLE_SERVICE_INFO_PLIST \
  --type file \
  --value ./GoogleService-Info.plist \
  --visibility secret \
  --scope project \
  --environment development \
  --environment preview \
  --environment production \
  --force \
  --non-interactive
```

### 2. 환경변수 설정
```bash
# mobile/.env
EXPO_PUBLIC_WEB_URL=https://maeum-mvp.vercel.app
```

### 3. EAS 프로젝트 ID 설정
```bash
npx eas init
```
또는 `app.json`의 `extra.eas.projectId`를 직접 입력.

### 4. 의존성 설치
```bash
cd mobile
npm install
```

## 빌드 방법

### 개발용 (로컬 테스트)
```bash
# Android APK
npm run build:android -- --profile development

# iOS Simulator
npm run ios
```

### 배포용 빌드 (EAS Build)
```bash
# Android AAB (Play Store 제출용)
npm run build:android -- --profile production

# iOS IPA (App Store 제출용)
npm run build:ios -- --profile production

# 둘 다 한 번에
npm run build:all -- --profile production
```

## 앱 스토어 배포

### Google Play Store
1. EAS로 AAB 빌드
2. Google Play Console에서 내부 테스트 → 프로덕션 제출

### Apple App Store
1. Apple Developer 계정 필요
2. `eas.json`의 `submit.production.ios` 항목 채우기
3. `eas submit --platform ios`

## 웹앱 ↔ 네이티브 통신 구조

```
네이티브 앱 (FCM 수신)
    ↓ injectJavaScript
WebView (Next.js)
    ↓ CustomEvent('native-fcm-token')
useNativeFCMBridge (providers.tsx)
    ↓
Supabase users.fcm_token 업데이트
    ↓
firebase-admin → FCM → 네이티브 푸시 알림
```

앱이 완전히 종료된 상태에서도 OS가 Firebase 백그라운드 핸들러를 깨워 알림을 표시합니다.
