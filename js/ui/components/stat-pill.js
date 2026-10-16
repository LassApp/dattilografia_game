import { h } from '../dom.js';
/** @param {{label:string,value?:string,state?:'idle'|'live'|'paused'}} props */
export function StatPill(props) {
  const val = h('b'); const el = h('div', { class: 'c-statpill' }, h('span', { class: 'c-statpill__label' }, props.label), val);
  const update = (p = {}) => { props = { ...props, ...p }; const v = props.value ?? '—'; if (val.textContent !== v) val.textContent = v; el.dataset.state = props.state || 'idle'; };
  update();
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'StatPill', create: StatPill, states: ['def'], variants: [
  { label: 'idle', props: { label: 'WPM' } }, { label: 'live', props: { label: 'WPM', value: '18', state: 'live' } }, { label: 'paused', props: { label: 'Tempo', value: '0:24', state: 'paused' } } ] };
