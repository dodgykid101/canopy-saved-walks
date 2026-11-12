import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {findJourney,journeyLabel,readPacked,savedRoot} from '../viewer/3d/pedestrian/saved-journeys.mjs';
import {routeHealthScore} from '../viewer/3d/pedestrian/corridor-health-score.mjs';
import {sample} from '../viewer/3d/pedestrian/imperial-route-plots.mjs';
const catalog=JSON.parse(await readFile(new URL('../saved-routes/catalog.json',import.meta.url)));
test('exactly 15 unique saved choices; arbitrary endpoints are not offered',()=>{
  assert.equal(catalog.journeys.length,15);assert.equal(new Set(catalog.journeys.map(j=>j.id)).size,15);
  assert.throws(()=>findJourney(catalog,'unknown'));
  assert.match(journeyLabel(catalog.journeys[0]),/m/);
});
test('data URLs are repository-relative for GitHub project Pages',()=>{
  const source=new URL('https://example.github.io/canopy-demo/viewer/3d/pedestrian/saved-journeys.mjs');
  assert.equal(new URL('../../../saved-routes/',source).href,'https://example.github.io/canopy-demo/saved-routes/');
  assert.ok(savedRoot.href.endsWith('/saved-routes/'));
});
test('every saved journey supports health, pollution and breathing playback',async()=>{
  for(const j of catalog.journeys){
    const bytes=await readFile(new URL('../saved-routes/'+j.file,import.meta.url));
    const result=JSON.parse(gunzipSync(bytes));const route=result.routes[1];
    for(const t of [0,route.duration_s/2,route.duration_s]){
      const score=routeHealthScore(route,t);assert.ok(score===null||(score>=0&&score<=100));
      assert.ok(Number.isFinite(sample(route.breathing_profile,t,'breathing',true)));
      const pm=sample(route.profile,t,'pollution');assert.ok(pm>=6&&pm<=40);
    }
  }
});
test('browser decoder accepts genuine export and rejects corrupted data',async()=>{
  const row=catalog.journeys[0],bytes=await readFile(new URL('../saved-routes/'+row.file,import.meta.url));
  const original=globalThis.fetch;
  try{
    globalThis.fetch=async()=>new Response(bytes);
    const value=await readPacked(new URL('https://example.test/journey.gz'),row.sha256);
    assert.equal(value.saved_journey.origin,row.origin);
    await assert.rejects(()=>readPacked(new URL('https://example.test/journey.gz'),'0'.repeat(64)),/verification failed/);
  }finally{globalThis.fetch=original;}
});
