import { h } from '../dom.js';
/** @param {{brand:string,center?:Node|string,actions?:Node[]}} props */
export function Topbar(props) {
  const el = h('header', { class: 'c-topbar' }, h('span', { class: 'c-topbar__brand' }, props.brand),
    h('div', { class: 'c-topbar__center' }, props.center ?? ''), h('div', { class: 'c-topbar__actions' }, ...(props.actions || [])));
  return { el, update() {}, destroy() { el.remove(); } };
}
export const meta = { name: 'Topbar', create: Topbar, states: ['def'], variants: [{ label: 'home', props: { brand: 'NOME_DA_DEFINIRE' } }] };
