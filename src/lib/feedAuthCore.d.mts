export type {
  AuthGateState as FeedAuthState,
  AuthGateStateInput as FeedAuthStateInput,
} from "./authGateCore.mjs";

export {
  createAuthGateState as createFeedAuthState,
  getAuthGateErrorMessage as getFeedAuthErrorMessage,
} from "./authGateCore.mjs";
