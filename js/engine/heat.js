// Dati per heatmap e "tasti da ripassare" a partire dal riepilogo delle metriche. Nessun DOM.
import { charToKeys } from '../data/layout-it.js';
/** Errori aggregati per tasto fisico → { codice: { level: 1..3, count } }; il livello è relativo al tasto con più errori. */
export function heatFromSummary(summary) {
  const per = new Map();
  for (const k of summary.keys) { if (!k.errors) continue; const info = charToKeys(k.char); if (info) per.set(info.code, (per.get(info.code) || 0) + k.errors); }
  const max = Math.max(0, ...per.values()); const out = {};
  for (const [code, n] of per) out[code] = { level: Math.max(1, Math.ceil((n / max) * 3 - 1e-9)), count: n };
  return out;
}
/** I n caratteri più sbagliati, con dito, mano, riga e tasti accessori. */
export function reviewKeys(summary, n = 5) {
  return summary.problemKeys.slice(0, n).map((k) => { const info = charToKeys(k.char); return info ? { char: k.char, errors: k.errors, attempts: k.attempts, ...info } : null; }).filter(Boolean);
}
