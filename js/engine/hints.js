// Suggerimento dopo N errori consecutivi sullo stesso carattere bersaglio, con attesa minima tra due suggerimenti. Nessun DOM.
import { charToKeys } from '../data/layout-it.js';
import { HINT_ERRORS, HINT_COOLDOWN_MS } from '../config.js';
export function createHints({ threshold = HINT_ERRORS, cooldownMs = HINT_COOLDOWN_MS, clock = { now: () => performance.now() } } = {}) {
  let target = null, count = 0, lastShown = -Infinity;
  return {
    /** Restituisce il suggerimento da mostrare (o null). */
    onWrong(expected) {
      count = expected === target ? count + 1 : 1; target = expected;
      if (count < threshold || clock.now() - lastShown < cooldownMs) return null;
      const k = charToKeys(expected); if (!k) return null;
      lastShown = clock.now(); return { char: expected, ...k };
    },
    onCorrect() { target = null; count = 0; }, // il contatore si azzera quando il carattere è digitato correttamente
    reset() { target = null; count = 0; lastShown = -Infinity; },
  };
}
