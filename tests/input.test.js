import test from 'node:test'; import assert from 'node:assert/strict';
import { classifyKey } from '../js/engine/input.js'; import { key } from './helpers.js';
test('corretto, errato e Invio come a capo', () => {
  assert.equal(classifyKey(key('a'), 'a').kind, 'correct'); assert.equal(classifyKey(key('s'), 'a').kind, 'wrong');
  assert.equal(classifyKey(key('A'), 'a').kind, 'wrong'); assert.equal(classifyKey(key('Enter'), '\n').kind, 'correct'); assert.equal(classifyKey(key(' '), ' ').kind, 'correct');
});
test('si ignorano ripetizioni, scorciatoie, tasti non stampabili; modificatori e tasti morti hanno un tipo proprio', () => {
  assert.deepEqual(classifyKey(key('a', { repeat: true }), 'a'), { kind: 'ignored', reason: 'repeat' });
  assert.equal(classifyKey(key('c', { ctrl: true }), 'c').reason, 'shortcut'); assert.equal(classifyKey(key('Escape'), 'a').reason, 'non-printing');
  assert.equal(classifyKey(key('Shift'), 'a').kind, 'modifier'); assert.equal(classifyKey(key('Dead'), 'a').kind, 'dead');
});
test('AltGr (Ctrl+Alt su Windows) non è una scorciatoia', () => assert.equal(classifyKey(key('@', { ctrl: true, alt: true, altGraph: true }), '@').kind, 'correct'));
