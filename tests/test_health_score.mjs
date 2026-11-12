import test from 'node:test';
import assert from 'node:assert/strict';
import { currentHealthScore, routeHealthScore } from '../viewer/3d/pedestrian/corridor-health-score.mjs';

const conditions = { pollution: 10, temperature: 22, breathing: 16, referenceBreathing: 16 };
test('masked native temperature cannot become a zero or fabricated health score', () => {
  const route = {duration_s: 20, profile: [{seconds: 0,pollution:10,temperature:22},{seconds:10,pollution:10,temperature:null},{seconds:20,pollution:10,temperature:22}],breathing_profile:[{seconds:0,breathing:16}]};
  assert.equal(routeHealthScore(route,10),null);
  assert.equal(routeHealthScore(route,15),null);
  assert(routeHealthScore(route,0)>90);
  assert.equal(routeHealthScore(route,0),routeHealthScore(route,20));
});
test('each current condition affects score and ordinary scenario scores stay high', () => {
  const initial = currentHealthScore(conditions);
  assert(initial > 90 && initial < 100);
  for (const change of [{ pollution: 40 }, { temperature: 35 }, { temperature: 9 }, { breathing: 20 }, { breathing: 12 }]) {
    const score = currentHealthScore({ ...conditions, ...change });
    assert(score < initial && score > 0 && score <= 100);
  }
  assert.equal(currentHealthScore({ ...conditions, breathing: NaN }), null);
});

test('score recovers with cleaner conditions, ignores cumulative time cost and respects breathing updates', () => {
  const route = {
    duration_s: 600,
    profile: [0, 100, 200, 600].map((seconds, i) => ({
      seconds, pollution: i === 1 ? 40 : 10, temperature: 22, health_cost: seconds * 10,
    })),
    breathing_profile: [{ seconds: 0, breathing: 16 }, { seconds: 300, breathing: 20 }, { seconds: 600, breathing: 16 }],
  };
  assert(routeHealthScore(route, 100) < routeHealthScore(route, 200));
  assert.equal(routeHealthScore(route, 0), routeHealthScore(route, 200));
  assert.equal(routeHealthScore(route, 200), routeHealthScore(route, 299));
  assert(routeHealthScore(route, 300) < routeHealthScore(route, 299));
  assert.equal(routeHealthScore(route, 600), routeHealthScore(route, 0));
  assert.equal(routeHealthScore({ ...route, breathing_profile: [] }, 10), null);
});
