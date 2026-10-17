import test from 'node:test'; import assert from 'node:assert/strict';
import { heatFromSummary, reviewKeys } from '../js/engine/heat.js';
const summary = { keys: [{ char: 'd', errors: 2, attempts: 6 }, { char: 'D', errors: 1, attempts: 2 }, { char: 'a', errors: 2, attempts: 5 }, { char: 'f', errors: 1, attempts: 5 }, { char: 's', errors: 0, attempts: 4 }],
  problemKeys: [{ char: 'd', errors: 2, attempts: 6 }, { char: 'a', errors: 2, attempts: 5 }, { char: 'D', errors: 1, attempts: 2 }, { char: 'f', errors: 1, attempts: 5 }] };
test('heatmap: errori aggregati per tasto fisico, livello relativo al massimo', () => {
  const h = heatFromSummary(summary);
  assert.deepEqual(h.KeyD, { level: 3, count: 3 }); assert.deepEqual(h.KeyA, { level: 2, count: 2 }); assert.deepEqual(h.KeyF, { level: 1, count: 1 }); assert.equal(h.KeyS, undefined);
});
test('nessun errore: heatmap vuota', () => assert.deepEqual(heatFromSummary({ keys: [{ char: 'a', errors: 0, attempts: 3 }] }), {}));
test('tasti da ripassare: i più sbagliati, con dito e riga', () => {
  const r = reviewKeys(summary, 2); assert.equal(r.length, 2); assert.equal(r[0].char, 'd'); assert.equal(r[0].finger, 'm'); assert.equal(r[0].row, 2);
});
