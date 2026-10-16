import { h } from '../dom.js';
/** @param {{brand:string,center?:Node|string,extra?:Node[],actions?:Node[]}} props  update({center, extra}): contesto della schermata corrente */
export function Topbar(props) {
  const center = h('div', { class: 'c-topbar__center' }, props.center ?? ''); const extra = h('div', { class: 'c-topbar__extra' }, ...(props.extra || []));
  const el = h('header', { class: 'c-topbar' }, h('span', { class: 'c-topbar__brand' }, props.brand), center, extra, h('div', { class: 'c-topbar__actions' }, ...(props.actions || [])));
  const update = (p = {}) => {
    if ('center' in p) center.replaceChildren(...[p.center ?? ''].flat());
    if ('extra' in p) extra.replaceChildren(...(p.extra || []));
  };
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'Topbar', create: Topbar, states: ['def'], variants: [{ label: 'home', props: { brand: 'NOME_DA_DEFINIRE' } }, { label: 'con contesto', props: { brand: 'NOME_DA_DEFINIRE', center: 'Riga base — sinistra · 2/6' } }] };
