import { h } from '../dom.js';
import { t } from '../../i18n/index.js';
/** Scala della heatmap: colore + parole + numero sul tasto. */
export function HeatLegend() {
  const el = h('div', { class: 'c-heatlegend' }, ...[1, 2, 3].map((l) => h('span', { class: 'c-heatlegend__item', data: { heat: l } }, h('span', { class: 'c-heatlegend__sw', 'aria-hidden': 'true' }), t(`results.heat${l}`))), h('small', {}, t('results.heatNote')));
  return { el, update() {}, destroy() { el.remove(); } };
}
export const meta = { name: 'HeatLegend', create: HeatLegend, states: ['def'], variants: [{ label: 'scala', props: {} }] };
