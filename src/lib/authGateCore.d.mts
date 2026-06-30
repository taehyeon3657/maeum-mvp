export type AuthGateState =
  | { status: "loading" }
  | { status: "redirecting" }
  | { status: "error"; message: string }
  | { status: "authenticated"; userId: string };

export interface AuthGateStateInput {
  userId: string | null;
  errorMessage: string | null;
}

export function getAuthGateErrorMessage(error: unknown): string;
export function createAuthGateState(input: AuthGateStateInput): Exclude<AuthGateState, { status: "loading" }>;
