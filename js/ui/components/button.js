import { h } from '../dom.js';
import { Icon } from './icon.js';
/** @param {{label:string,variant?:'primary'|'secondary'|'ghost',size?:'md'|'lg',icon?:string,disabled?:boolean,onClick?:Function}} props */
export function Button(props) {
  const el = h('button', { class: 'c-btn', type: 'button' });
  const update = (p) => {
    props = { ...props, ...p };
    el.dataset.variant = props.variant || 'secondary'; el.dataset.size = props.size || 'md'; el.disabled = !!props.disabled;
    el.replaceChildren(); if (props.icon) el.append(Icon({ name: props.icon, size: 'sm' }).el); el.append(props.label);
  };
  el.addEventListener('click', (e) => props.onClick && props.onClick(e));
  update({});
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'Button', create: Button, states: ['def', 'hov', 'foc', 'act', 'dis'],
  variants: [{ label: 'primary', props: { label: 'Inizia', variant: 'primary' } }, { label: 'primary lg', props: { label: 'Continua', variant: 'primary', size: 'lg' } },
    { label: 'secondary', props: { label: 'Ricomincia', variant: 'secondary', icon: 'restart' } }, { label: 'ghost', props: { label: 'Esci', variant: 'ghost' } }] };
