import { h } from '../dom.js';
import { Icon } from './icon.js';
/** @param {{icon:string,label:string,variant?:'ghost'|'secondary',size?:'sm'|'md',disabled?:boolean,onClick?:Function}} props */
export function IconButton(props) {
  if (!props.label) throw new Error('IconButton: label (aria-label) obbligatoria');
  const el = h('button', { class: 'c-iconbtn', type: 'button' }); const icon = Icon({ name: props.icon }); el.append(icon.el);
  const update = (p) => {
    props = { ...props, ...p };
    el.dataset.variant = props.variant || 'ghost'; el.dataset.size = props.size || 'md'; el.disabled = !!props.disabled;
    el.setAttribute('aria-label', props.label); icon.update({ name: props.icon });
  };
  el.addEventListener('click', (e) => props.onClick && props.onClick(e));
  update({});
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'IconButton', create: IconButton, states: ['def', 'hov', 'foc', 'act', 'dis'],
  variants: [{ label: 'ghost', props: { icon: 'pause', label: 'Pausa' } }, { label: 'secondary', props: { icon: 'settings', label: 'Impostazioni', variant: 'secondary' } }] };
