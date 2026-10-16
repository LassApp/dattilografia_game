// Impostazioni del dispositivo (non migrano su backend). Sempre con try/catch.
import { STORAGE_NS } from '../config.js';
const KEY = `${STORAGE_NS}:settings`;
const DEFAULTS = { theme: 'auto', sounds: true, guide: true, fingerTint: false, textSize: 'M' };
const subs = new Set();
export function getSettings() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { ...DEFAULTS }; }
}
export function setSetting(name, value) {
  try { localStorage.setItem(KEY, JSON.stringify({ ...getSettings(), [name]: value })); } catch { /* storage non disponibile */ }
  subs.forEach((cb) => cb(getSettings()));
}
/** Iscrizione ai cambiamenti delle impostazioni; restituisce la funzione per annullarla. */
export const onSettings = (cb) => { subs.add(cb); return () => subs.delete(cb); };
