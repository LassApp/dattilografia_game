// Progressi e risultati in locale. Sempre con try/catch: lo storage può non essere disponibile.
import { STORAGE_NS, SCHEMA_VERSION } from '../config.js';
const KEY = `${STORAGE_NS}:progress`;
const empty = () => ({ schemaVersion: SCHEMA_VERSION, exercises: {} });
/** @param {Pick<Storage,'getItem'|'setItem'>} [store] iniettabile per i test */
export function createLocalStorageAdapter(store = globalThis.localStorage) {
  const read = () => { try { const d = JSON.parse(store.getItem(KEY) || 'null'); return d && d.schemaVersion === SCHEMA_VERSION ? d : empty(); } catch { return empty(); } };
  const write = (d) => { try { store.setItem(KEY, JSON.stringify(d)); } catch { /* storage non disponibile */ } };
  const id = (levelId, exerciseId) => `${levelId}/${exerciseId}`;
  return {
    getProgress: read,
    getBest: (levelId, exerciseId) => read().exercises[id(levelId, exerciseId)]?.best ?? null,
    saveResult(result, evaluation) {
      const d = read(); const k = id(result.levelId, result.exerciseId); const m = result.metrics;
      const e = d.exercises[k] || { attempts: 0, bestStars: 0, best: null, lastTimestamp: 0 };
      e.attempts++; e.lastTimestamp = result.timestamp; e.bestStars = Math.max(e.bestStars, evaluation.stars);
      if (!e.best || m.wpmNet > e.best.wpmNet) e.best = { wpmNet: m.wpmNet, accuracy: m.accuracy, errors: m.errors, elapsedMs: m.elapsedMs, stars: evaluation.stars, timestamp: result.timestamp }; // record = più WPM netti
      d.exercises[k] = e; write(d);
    },
  };
}
