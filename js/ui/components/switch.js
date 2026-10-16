import { h } from '../dom.js';
/** @param {{label:string,checked?:boolean,disabled?:boolean,onChange?:(v:boolean)=>void}} props */
export function Switch(props) {
  const el = h('button', { class: 'c-switch', type: 'button', role: 'switch' });
  const update = (p = {}) => { props = { ...props, ...p }; el.setAttribute('aria-checked', String(!!props.checked)); el.setAttribute('aria-label', props.label); el.disabled = !!props.disabled; };
  el.addEventListener('click', () => { const next = el.getAttribute('aria-checked') !== 'true'; update({ checked: next }); props.onChange?.(next); });
  update();
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'Switch', create: Switch, states: ['def', 'hov', 'foc', 'act', 'dis'], variants: [{ label: 'off', props: { label: 'Suoni' } }, { label: 'on', props: { label: 'Suoni', checked: true } }] };
