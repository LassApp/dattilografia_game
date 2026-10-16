import { h } from '../dom.js';
let uid = 0;
/** Scelta esclusiva con radio nativi (tastiera e screen reader gratis). @param {{name:string,label:string,value?:string,options:{value:string,label:string}[],onChange?:(v:string)=>void}} props */
export function SegmentedControl(props) {
  const group = `${props.name}-${++uid}`; const el = h('div', { class: 'c-seg', role: 'radiogroup', 'aria-label': props.label });
  const inputs = props.options.map((o) => {
    const input = h('input', { type: 'radio', name: group, value: o.value, class: 'u-visually-hidden' });
    input.addEventListener('change', () => props.onChange?.(o.value));
    el.append(h('label', { class: 'c-seg__opt' }, input, h('span', {}, o.label))); return input;
  });
  const update = (p = {}) => { props = { ...props, ...p }; inputs.forEach((i) => { i.checked = i.value === props.value; }); };
  update();
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'SegmentedControl', create: SegmentedControl, states: ['def'], variants: [
  { label: 'tema', props: { name: 'tema', label: 'Tema', value: 'light', options: [{ value: 'auto', label: 'Auto' }, { value: 'light', label: 'Chiaro' }, { value: 'dark', label: 'Scuro' }] } },
  { label: 'testo', props: { name: 'testo', label: 'Dimensione', value: 'M', options: ['S', 'M', 'L', 'XL'].map((v) => ({ value: v, label: v })) } } ] };
