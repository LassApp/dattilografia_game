import { h } from '../dom.js';
import { t } from '../../i18n/index.js';
const FINGERS = ['p', 'r', 'm', 'i', 't'];
/** Legenda dei colori delle dita (visibile solo con "Dita colorate"); evidenzia il dito del prossimo tasto. @param {{tint?:boolean,active?:string|null}} props */
export function FingerLegend(props = {}) {
  const items = Object.fromEntries(FINGERS.map((f) => [f, h('li', { data: { finger: f } }, h('span', { class: 'c-fingerlegend__sw', 'aria-hidden': 'true' }), t(`finger.${f}`))]));
  const el = h('div', { class: 'c-fingerlegend', role: 'group', 'aria-label': t('legend.title') }, h('div', { class: 'c-fingerlegend__title' }, t('legend.title')), h('ul', {}, ...Object.values(items)), h('small', {}, t('legend.note')));
  const update = (p = {}) => { props = { ...props, ...p }; el.toggleAttribute('data-visible', !!props.tint); FINGERS.forEach((f) => items[f].toggleAttribute('data-active', props.active === f)); };
  update();
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'FingerLegend', create: FingerLegend, states: ['def'], variants: [{ label: 'visibile', props: { tint: true } }, { label: 'dito attivo', props: { tint: true, active: 'm' } }] };
