// Normalizza i testi degli esercizi sul layout italiano (apostrofi, virgolette, trattini, spazi, a capo).
import { CHAR_MAP } from '../data/layout-it.js';
const RULES = [[/[\u2018\u2019\u02BC\u00B4]/g, "'"], [/[\u201C\u201D\u00AB\u00BB]/g, '"'], [/[\u2010-\u2015\u2212]/g, '-'],
  [/\u2026/g, '...'], [/[\u00A0\u202F]/g, ' '], [/\r\n?/g, '\n']];
export function normalizeText(s) {
  let t = String(s); for (const [re, to] of RULES) t = t.replace(re, to);
  return t.replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim();
}
/** Caratteri non digitabili sulla tastiera italiana (da segnalare, mai da correggere in silenzio). */
export const findUnsupported = (text) => [...new Set([...text].filter((c) => !CHAR_MAP.has(c)))];
