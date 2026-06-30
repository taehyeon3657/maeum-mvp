const FALLBACK_AUTH_ERROR_MESSAGE = "인증 상태를 확인하지 못했어요.";

export function getFeedAuthErrorMessage(error) {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return FALLBACK_AUTH_ERROR_MESSAGE;
}

export function createFeedAuthState({ userId, errorMessage }) {
  if (errorMessage) {
    return { status: "error", message: errorMessage };
  }

  if (userId) {
    return { status: "authenticated", userId };
  }

  return { status: "redirecting" };
}
