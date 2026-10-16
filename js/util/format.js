// Formattazione dei valori mostrati nell'interfaccia. Funzioni pure.
import { WPM_MIN_MS } from '../config.js';
export const fmtTime = (ms) => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
/** Valori (stringhe) dell'HUD a partire dallo stato della sessione. */
export function hudValues(st) {
  const s = st.stats; const started = st.status !== 'ready' && st.status !== 'idle';
  return {
    time: started ? fmtTime(st.elapsedMs) : '—',
    wpm: started && st.elapsedMs >= WPM_MIN_MS ? String(Math.round(s.wpmNet)) : '—',
    accuracy: s.presses ? `${Math.round(s.accuracy)}%` : '—',
    errors: s.presses ? String(s.errors) : '—',
    state: st.status === 'paused' ? 'paused' : st.status === 'running' || st.status === 'completed' ? 'live' : 'idle',
  };
}
