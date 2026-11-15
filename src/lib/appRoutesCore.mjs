export const APP_ROUTES = Object.freeze({
  feed: "/feed",
  collection: "/collection",
  insights: "/insights",
  onboarding: "/onboarding",
  mind: "/mind",
});

export function isKnownAppRoute(route) {
  return Object.values(APP_ROUTES).includes(route);
}
