export type FeedAuthState =
  | { status: "loading" }
  | { status: "redirecting" }
  | { status: "error"; message: string }
  | { status: "authenticated"; userId: string };

export interface FeedAuthStateInput {
  userId: string | null;
  errorMessage: string | null;
}

export function getFeedAuthErrorMessage(error: unknown): string;
export function createFeedAuthState(input: FeedAuthStateInput): Exclude<FeedAuthState, { status: "loading" }>;
