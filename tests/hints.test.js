import test from 'node:test'; import assert from 'node:assert/strict';
import { createHints } from '../js/engine/hints.js';
const mk = () => { let t = 0; return { h: createHints({ threshold: 5, cooldownMs: 1000, clock: { now: () => t } }), tick: (ms) => { t += ms; } }; };
test('al quinto errore consecutivo sullo stesso carattere arriva il suggerimento', () => {
  const { h } = mk(); for (let i = 0; i < 4; i++) assert.equal(h.onWrong('d'), null);
  const x = h.onWrong('d'); assert.equal(x.char, 'd'); assert.equal(x.finger, 'm'); assert.equal(x.hand, 'l'); assert.equal(x.row, 2);
});
test('non si ripete a raffica: attesa tra due suggerimenti', () => {
  const { h, tick } = mk(); for (let i = 0; i < 5; i++) h.onWrong('d');
  assert.equal(h.onWrong('d'), null); tick(1000); assert.notEqual(h.onWrong('d'), null);
});
test('il contatore si azzera con il carattere corretto o cambiando bersaglio', () => {
  const { h } = mk(); for (let i = 0; i < 4; i++) h.onWrong('d'); h.onCorrect(); assert.equal(h.onWrong('d'), null);
  for (let i = 0; i < 3; i++) h.onWrong('d'); assert.equal(h.onWrong('f'), null);
});
