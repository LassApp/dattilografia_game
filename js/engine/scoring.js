// Esito e stelle (§8). Si confrontano i valori arrotondati: ciò che l'utente vede a schermo coincide con ciò che conta. Nessun DOM.
import { DEFAULT_SOGLIE } from '../config.js';
/** @returns {{passed:boolean,stars:0|1|2|3,next:{precisione:number,wpm:number}|null,reason:'accuracy'|'speed'|null}} */
export function evaluate(summary, soglie = DEFAULT_SOGLIE) {
  const acc = Math.round(summary.accuracy ?? 0), w = Math.round(summary.wpmNet ?? 0);
  const ok = (a, v) => acc >= a && w >= v;
  const { 2: s2, 3: s3 } = soglie.stelle;
  const passed = ok(soglie.precisioneMin, soglie.wpmMin);
  const stars = !passed ? 0 : ok(s3.precisione, s3.wpm) ? 3 : ok(s2.precisione, s2.wpm) ? 2 : 1;
  const next = stars === 0 ? { precisione: soglie.precisioneMin, wpm: soglie.wpmMin } : stars === 1 ? s2 : stars === 2 ? s3 : null;
  return { passed, stars, next, reason: passed ? null : acc < soglie.precisioneMin ? 'accuracy' : 'speed' };
}
