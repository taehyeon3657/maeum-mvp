export const APP_ROUTES: {
  readonly feed: "/feed";
  readonly collection: "/collection";
  readonly insights: "/insights";
  readonly onboarding: "/onboarding";
};

export type AppRoute = typeof APP_ROUTES[keyof typeof APP_ROUTES];

export function isKnownAppRoute(route: string): route is AppRoute;
