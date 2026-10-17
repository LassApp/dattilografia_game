// Metriche (§7): accumulatore incrementale O(1) per battuta + riepilogo a fine esercizio. Nessun DOM.
import { charToKeys } from '../data/layout-it.js';
import { SAMPLE_MS } from '../config.js';
export const wpm = (chars, ms) => (ms > 0 ? (chars / 5) / (ms / 60000) : 0);
export function createMetrics() {
  const m = { presses: 0, correct: 0, errors: 0, streak: 0, maxStreak: 0, lastT: null, sumInt: 0, sumSq: 0, nInt: 0, keys: new Map(), samples: [], sampleCorrect: 0, nextSample: SAMPLE_MS };
  const live = (t) => ({ presses: m.presses, correct: m.correct, errors: m.errors, accuracy: m.presses ? (m.correct / m.presses) * 100 : null,
    wpmNet: wpm(m.correct, t), wpmGross: wpm(m.presses, t), cpm: t > 0 ? m.correct / (t / 60000) : 0, elapsedMs: t });
  return {
    /** @param {{expected:string,ok:boolean,t:number}} e  t = tempo attivo in ms (pause escluse) */
    record({ expected, ok, t }) {
      const k = m.keys.get(expected) || m.keys.set(expected, { char: expected, attempts: 0, errors: 0, latSum: 0, latN: 0 }).get(expected);
      m.presses++; k.attempts++;
      if (!ok) { m.errors++; m.streak = 0; k.errors++; return; }
      m.correct++; m.streak++; m.maxStreak = Math.max(m.maxStreak, m.streak);
      if (m.lastT != null) { const d = t - m.lastT; m.sumInt += d; m.sumSq += d * d; m.nInt++; k.latSum += d; k.latN++; }
      m.lastT = t; m.sampleCorrect++;
      while (t >= m.nextSample) { m.samples.push({ t: m.nextSample, wpm: wpm(m.sampleCorrect, SAMPLE_MS) }); m.sampleCorrect = 0; m.nextSample += SAMPLE_MS; }
    },
    live,
    summary(t) {
      const keys = [...m.keys.values()].map((k) => ({ char: k.char, attempts: k.attempts, errors: k.errors, errorRate: k.attempts ? k.errors / k.attempts : 0, avgLatencyMs: k.latN ? k.latSum / k.latN : null }));
      const problemKeys = keys.filter((k) => k.errors > 0).sort((a, b) => b.errors - a.errors || b.errorRate - a.errorRate);
      const byFinger = {}, byHand = {};
      for (const k of keys) {
        const info = charToKeys(k.char); if (!info) continue;
        for (const [grp, id] of [[byFinger, info.finger], [byHand, info.hand]]) { const g = (grp[id] ||= { attempts: 0, errors: 0 }); g.attempts += k.attempts; g.errors += k.errors; }
      }
      const winStart = m.nextSample - SAMPLE_MS, dur = t - winStart; const samples = m.samples.map((x) => ({ ...x }));
      if (dur >= 500 && m.sampleCorrect > 0) samples.push({ t, wpm: wpm(m.sampleCorrect, dur) }); // ultima finestra, parziale
      const mean = m.nInt ? m.sumInt / m.nInt : 0;
      return { ...live(t), maxStreak: m.maxStreak, avgInterval: mean, rhythmStdev: m.nInt ? Math.sqrt(Math.max(0, m.sumSq / m.nInt - mean * mean)) : 0,
        samples, keys, problemKeys, byFinger, byHand };
    },
  };
}
