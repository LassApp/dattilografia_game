import test from 'node:test'; import assert from 'node:assert/strict';
import { KEYS, CHAR_MAP, charToKeys } from '../js/data/layout-it.js';
test('i code dei tasti sono univoci', () => assert.equal(new Set(KEYS.map((k) => k.code)).size, KEYS.length));
test('tutti i caratteri attesi sono digitabili', () => {
  for (const c of 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789èéàùòìç .,;:\'"?!()/-_+*=<>%&$£°§@#[]{}€^|\\\n') assert.ok(CHAR_MAP.has(c), `manca ${JSON.stringify(c)}`);
});
test('la maiuscola usa il Shift della mano opposta', () => {
  assert.deepEqual(charToKeys('D').mods, ['ShiftRight']); assert.deepEqual(charToKeys('P').mods, ['ShiftLeft']); assert.deepEqual(charToKeys('d').mods, []);
});
test('AltGr, Blocco maiuscole e dita', () => {
  assert.equal(charToKeys('@').altgr, true); assert.equal(charToKeys('@').code, 'Semicolon');
  assert.deepEqual(charToKeys('È').mods, ['CapsLock']); assert.equal(charToKeys('é').code, 'BracketLeft'); assert.equal(charToKeys('d').finger, 'm'); assert.equal(charToKeys('d').hand, 'l');
});
