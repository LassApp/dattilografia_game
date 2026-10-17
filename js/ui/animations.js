// Animazioni one-shot riutilizzabili (WAAPI): solo transform/opacity. Durate dai token; statiche con prefers-reduced-motion.
import { getToken } from './theme.js';
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const cache = {}; const EASE = 'cubic-bezier(.2,.7,.2,1)';
const ms = (name, fallback) => (cache[name] ??= (parseFloat(getToken(name)) || fallback));
export function ringPulse(ring) { // alone del tasto premuto
  if (reduce.matches || !ring) return;
  ring.animate([{ opacity: .9, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.3)' }], { duration: ms('--dur-quick', 160) * 2, easing: EASE });
}
export function shake(el) { // errore: 3 oscillazioni, ±6 px, ~300 ms
  if (reduce.matches || !el) return;
  el.animate([0, -6, 6, -6, 6, 0].map((x) => ({ transform: `translateX(${x}px)` })), { duration: ms('--dur-error', 300) });
}
export function pulse(el) { // carattere appena completato
  if (reduce.matches || !el) return;
  el.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: ms('--dur-press', 100) * 1.5, easing: EASE });
}
export function popIn(el, delay = 0) { // stelle: comparsa con "pop"
  if (reduce.matches || !el) return;
  el.animate([{ transform: 'scale(.4)', opacity: 0 }, { transform: 'scale(1.2)', opacity: 1, offset: .7 }, { transform: 'scale(1)', opacity: 1 }], { duration: 360, delay, easing: EASE, fill: 'backwards' });
}
/** Conteggio progressivo del testo di `el` da 0 a `to`; restituisce la funzione per annullarlo. Con reduced-motion mostra subito il valore finale. */
export function countUp(el, to, fmt = String, duration = 900) {
  if (reduce.matches || !Number.isFinite(to)) { el.textContent = fmt(to); return () => {}; }
  const t0 = performance.now(); let raf = 0;
  const step = (now) => { const p = Math.min(1, (now - t0) / duration); el.textContent = fmt(to * (1 - (1 - p) ** 3)); if (p < 1) raf = requestAnimationFrame(step); };
  el.textContent = fmt(0); raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}
