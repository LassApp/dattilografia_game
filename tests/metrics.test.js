import test from 'node:test'; import assert from 'node:assert/strict';
import { createMetrics, wpm } from '../js/engine/metrics.js'; import { buildResult } from '../js/engine/result.js';
test('WPM: 5 caratteri = 1 parola', () => assert.equal(wpm(50, 60000), 10));
test('metriche incrementali e riepilogo', () => {
  const m = createMetrics();
  m.record({ expected: 'a', ok: true, t: 0 }); m.record({ expected: 's', ok: false, t: 100 }); m.record({ expected: 's', ok: true, t: 200 }); m.record({ expected: 'd', ok: true, t: 600 });
  const s = m.summary(600);
  assert.equal(s.presses, 4); assert.equal(s.errors, 1); assert.equal(s.accuracy, 75); assert.equal(Math.round(s.wpmNet), 60); assert.equal(Math.round(s.wpmGross), 80);
  assert.equal(s.avgInterval, 300); assert.equal(Math.round(s.rhythmStdev), 100); assert.equal(s.maxStreak, 2);
  assert.equal(s.problemKeys[0].char, 's'); assert.equal(s.byFinger.r.errors, 1); assert.equal(s.byHand.l.attempts, 4);
  assert.equal(s.keys.find((k) => k.char === 'd').avgLatencyMs, 400);
});
test('campioni di velocità ogni SAMPLE_MS', () => {
  const m = createMetrics(); for (let i = 0; i <= 10; i++) m.record({ expected: 'a', ok: true, t: i * 600 });
  assert.equal(m.summary(6000).samples.length, 2); assert.equal(m.summary(6000).samples[0].t, 3000);
});
test('result è serializzabile', () => {
  const r = buildResult({ levelId: 'prova', exerciseId: 'prova-01', timestamp: 1, summary: createMetrics().summary(0) });
  assert.deepEqual(JSON.parse(JSON.stringify(r)), r); assert.equal(r.schemaVersion, 1); assert.equal(r.userId, null);
});
