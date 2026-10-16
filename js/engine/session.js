// Macchina a stati: idle → ready → running ⇄ paused → completed. Il timer parte al primo tasto corretto. Nessun DOM.
import { createEmitter } from '../util/emitter.js';
import { classifyKey } from './input.js';
import { createMetrics } from './metrics.js';
export function createSession({ clock = { now: () => performance.now() } } = {}) {
  const bus = createEmitter(); let s; let metrics = createMetrics();
  const reset = (text) => { metrics = createMetrics(); s = { status: text ? 'ready' : 'idle', text, index: 0, errorActive: false, correct: 0, errors: 0, presses: 0, streak: 0, maxStreak: 0, activeMs: 0, resumedAt: null, pauseReason: null }; };
  reset('');
  const elapsed = () => s.activeMs + (s.status === 'running' ? clock.now() - s.resumedAt : 0);
  const setStatus = (status) => { s.status = status; bus.emit('status', { status }); };
  const api = {
    on: bus.on,
    getState: () => ({ ...s, elapsedMs: elapsed(), expected: s.text[s.index] ?? null, stats: metrics.live(elapsed()) }),
    summary: () => metrics.summary(elapsed()),
    load(text) { reset(text); bus.emit('load', { text }); setStatus('ready'); },
    restart() { if (!s.text) return; reset(s.text); bus.emit('load', { text: s.text }); setStatus('ready'); },
    pause(reason = 'manual') { if (s.status !== 'running') return; s.activeMs = elapsed(); s.resumedAt = null; s.pauseReason = reason; setStatus('paused'); },
    resume() { if (s.status !== 'paused') return; s.resumedAt = clock.now(); s.pauseReason = null; setStatus('running'); },
    key(ev) {
      if (s.status !== 'ready' && s.status !== 'running') return { kind: 'ignored', reason: s.status };
      const expected = s.text[s.index]; const r = classifyKey(ev, expected);
      if (r.kind === 'modifier' || r.kind === 'dead') { bus.emit(r.kind, { code: ev.code }); return r; }
      if (r.kind === 'wrong') { // l'avanzamento resta bloccato finché non si digita il carattere giusto
        s.presses++; s.errors++; s.streak = 0; s.errorActive = true; metrics.record({ expected, ok: false, t: elapsed() });
        bus.emit('wrong', { index: s.index, expected, typed: r.typed, code: ev.code }); return r;
      }
      if (r.kind === 'correct') {
        const typedIndex = s.index; s.presses++; s.correct++; s.streak++; s.maxStreak = Math.max(s.maxStreak, s.streak); s.index++; s.errorActive = false;
        if (s.status === 'ready') { s.resumedAt = clock.now(); setStatus('running'); }
        metrics.record({ expected, ok: true, t: elapsed() });
        bus.emit('correct', { index: typedIndex, char: r.typed, code: ev.code });
        if (s.index >= s.text.length) { s.activeMs = elapsed(); s.resumedAt = null; setStatus('completed'); bus.emit('completed', { ...api.getState(), summary: api.summary() }); }
      }
      return r;
    },
  };
  return api;
}
