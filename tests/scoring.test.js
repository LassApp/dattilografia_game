import test from 'node:test'; import assert from 'node:assert/strict';
import { evaluate } from '../js/engine/scoring.js';
const ev = (accuracy, wpmNet) => evaluate({ accuracy, wpmNet });
test('soglie predefinite: 1★ 60%/6, 2★ 80%/9, 3★ 98%/12', () => {
  assert.equal(ev(59, 20).stars, 0); assert.equal(ev(59, 20).reason, 'accuracy'); assert.equal(ev(90, 5).reason, 'speed');
  assert.equal(ev(60, 6).stars, 1); assert.equal(ev(80, 9).stars, 2); assert.equal(ev(98, 12).stars, 3); assert.equal(ev(98, 8).stars, 1);
});
test('si confrontano i valori arrotondati, come si vedono a schermo', () => { assert.equal(ev(79.6, 9.4).stars, 2); assert.equal(ev(79.4, 9.4).stars, 1); });
test('prossima stella e nessun oltre le 3', () => { assert.deepEqual(ev(60, 6).next, { precisione: 80, wpm: 9 }); assert.equal(ev(99, 30).next, null); });
