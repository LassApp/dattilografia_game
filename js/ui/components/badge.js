import { h } from '../dom.js';
import { Icon } from './icon.js';
/** Etichetta piccola con testo (e icona opzionale). @param {{label:string,variant?:'record'|'done'|'new',icon?:string}} props */
export function Badge(props) {
  const el = h('span', { class: 'c-badge' });
  const update = (p = {}) => { props = { ...props, ...p }; el.dataset.variant = props.variant || 'done'; el.replaceChildren(...[props.icon ? Icon({ name: props.icon, size: 'sm' }).el : null, props.label].filter((x) => x != null)); };
  update();
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'Badge', create: Badge, states: ['def'], variants: [{ label: 'record', props: { label: 'Nuovo record', variant: 'record', icon: 'star' } }, { label: 'done', props: { label: 'Completato', variant: 'done', icon: 'check' } }, { label: 'new', props: { label: 'Nuovo', variant: 'new' } }] };
