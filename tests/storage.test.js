import test from 'node:test'; import assert from 'node:assert/strict';
import { createLocalStorageAdapter } from '../js/storage/local-storage-adapter.js';
const fake = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }; };
const res = (w, ts) => ({ levelId: 'a', exerciseId: 'b', timestamp: ts, metrics: { wpmNet: w, accuracy: 90, errors: 1, elapsedMs: 5000 } });
test('salva il miglior risultato (più WPM netti), le stelle migliori e i tentativi', () => {
  const s = createLocalStorageAdapter(fake()); assert.equal(s.getBest('a', 'b'), null);
  s.saveResult(res(10, 1), { stars: 1 }); s.saveResult(res(8, 2), { stars: 2 }); s.saveResult(res(12, 3), { stars: 1 });
  const e = s.getProgress().exercises['a/b']; assert.equal(s.getBest('a', 'b').wpmNet, 12); assert.equal(e.attempts, 3); assert.equal(e.bestStars, 2);
});
test('storage non disponibile: nessuna eccezione', () => {
  const s = createLocalStorageAdapter({ getItem() { throw new Error('no'); }, setItem() { throw new Error('no'); } });
  assert.equal(s.getBest('a', 'b'), null); s.saveResult(res(10, 1), { stars: 1 });
});
