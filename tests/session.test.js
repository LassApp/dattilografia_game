import test from 'node:test'; import assert from 'node:assert/strict';
import { createSession } from '../js/engine/session.js'; import { key } from './helpers.js';
const mk = (text) => { let t = 0; const s = createSession({ clock: { now: () => t } }); s.load(text); return { s, tick: (ms) => { t += ms; } }; };
test('un errore blocca l\'avanzamento e il timer parte solo al primo tasto corretto', () => {
  const { s } = mk('ab'); s.key(key('x'));
  let st = s.getState(); assert.equal(st.index, 0); assert.equal(st.errors, 1); assert.equal(st.status, 'ready'); assert.equal(st.errorActive, true);
  s.key(key('a')); st = s.getState(); assert.equal(st.index, 1); assert.equal(st.status, 'running'); assert.equal(st.errorActive, false);
});
test('la pausa è esclusa dal tempo e a fine testo la sessione è completata', () => {
  const { s, tick } = mk('ab'); s.key(key('a')); tick(500); s.pause(); tick(10000); s.resume(); tick(500); s.key(key('b'));
  const st = s.getState(); assert.equal(st.status, 'completed'); assert.equal(st.elapsedMs, 1000); assert.equal(s.key(key('a')).kind, 'ignored');
});
test('serie massima, modificatori e restart', () => {
  const { s } = mk('abc'); s.key(key('a')); s.key(key('b')); s.key(key('x')); s.key(key('Shift')); s.key(key('c'));
  assert.equal(s.getState().maxStreak, 2); assert.equal(s.getState().presses, 4); s.restart();
  assert.equal(s.getState().index, 0); assert.equal(s.getState().status, 'ready');
});
