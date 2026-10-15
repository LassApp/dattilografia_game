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
