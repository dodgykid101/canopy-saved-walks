import { sample } from './imperial-route-plots.mjs';

// Illustrative display tuning, not clinical thresholds or a fitted health model.
// The breathing reference is the prediction at departure, not a healthy baseline.
export function currentHealthScore({ pollution, temperature, breathing, referenceBreathing }) {
  if (![pollution, temperature, breathing, referenceBreathing].every(Number.isFinite) ||
      pollution < 0 || breathing <= 0 || referenceBreathing <= 0) return null;
  const pm = pollution / 40;
  const thermal = Math.max(18 - temperature, temperature - 26, 0) / 10;
  const respiratory = Math.abs(breathing - referenceBreathing) / (0.25 * referenceBreathing);
  const burden = 0.45 * pm ** 2 + 0.35 * respiratory ** 2 + 0.20 * thermal ** 2;
  return 100 / (1 + 0.35 * burden);
}

export function routeHealthScore(route, seconds) {
  if (!route.profile?.length || !route.breathing_profile?.length) return null;
  const t = Math.max(0, Math.min(seconds, route.duration_s));
  return currentHealthScore({
    pollution: sample(route.profile, t, 'pollution'),
    temperature: sample(route.profile, t, 'temperature'),
    breathing: sample(route.breathing_profile, t, 'breathing', true),
    referenceBreathing: route.breathing_profile[0].breathing,
  });
}
