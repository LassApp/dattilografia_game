import { h } from '../dom.js';
import { countUp } from '../animations.js';
/** Una statistica con conteggio progressivo. @param {{label:string,value:number|null,format?:(n:number)=>string,delta?:string,variant?:'default'|'record'|'compact',animate?:boolean}} props */
export function StatCard(props) {
  const num = h('b', { 'aria-hidden': 'true' }); const sr = h('span', { class: 'u-visually-hidden' }); const delta = h('small', { class: 'c-statcard__delta' });
  const el = h('div', { class: 'c-statcard' }, h('span', { class: 'c-statcard__label' }, props.label), num, sr, delta); let cancel = () => {};
  const update = (p = {}) => {
    props = { ...props, ...p }; const fmt = props.format || String; el.dataset.variant = props.variant || 'default'; delta.textContent = props.delta ?? '';
    sr.textContent = props.value == null ? '' : fmt(props.value); cancel();
    if (props.value == null) num.textContent = '—'; else if (props.animate) cancel = countUp(num, props.value, fmt); else num.textContent = fmt(props.value);
  };
  update();
  return { el, update, destroy() { cancel(); el.remove(); } };
}
export const meta = { name: 'StatCard', create: StatCard, states: ['def'], variants: [
  { label: 'default', props: { label: 'WPM netti', value: 18, format: (n) => String(Math.round(n)), delta: '+3 rispetto al tuo record' } },
  { label: 'record', props: { label: 'Precisione', value: 96, format: (n) => `${Math.round(n)}%`, variant: 'record' } }, { label: 'compact', props: { label: 'Serie massima', value: 14, variant: 'compact' } } ] };
