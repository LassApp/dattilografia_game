import { h } from '../dom.js';
import { t } from '../../i18n/index.js';
import { StatPill } from './stat-pill.js';
/** Gruppo delle 4 statistiche live (non aria-live: l'esito si annuncia a fine esercizio). update({time,wpm,accuracy,errors,state}) con stringhe già formattate. */
export function Hud(props = {}) {
  const pills = { time: StatPill({ label: t('hud.time') }), wpm: StatPill({ label: t('hud.wpm') }), accuracy: StatPill({ label: t('hud.accuracy') }), errors: StatPill({ label: t('hud.errors') }) };
  const el = h('div', { class: 'c-hud', role: 'group', 'aria-label': t('hud.label') }, ...Object.values(pills).map((p) => p.el));
  const update = (v = {}) => { for (const k of Object.keys(pills)) pills[k].update({ value: v[k], state: v.state }); };
  update(props);
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'Hud', create: Hud, states: ['def'], variants: [
  { label: 'pronto', props: {} }, { label: 'in corso', props: { time: '0:24', wpm: '14', accuracy: '92%', errors: '2', state: 'live' } }, { label: 'pausa', props: { time: '0:24', wpm: '14', accuracy: '92%', errors: '2', state: 'paused' } } ] };
