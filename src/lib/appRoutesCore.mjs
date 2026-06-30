export const APP_ROUTES = Object.freeze({
  feed: "/feed",
  collection: "/collection",
  insights: "/insights",
  onboarding: "/onboarding",
});

export function isKnownAppRoute(route) {
  return Object.values(APP_ROUTES).includes(route);
}
