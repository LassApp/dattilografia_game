import { h } from '../dom.js';
import { Icon } from './icon.js';
const ICON = { info: 'info', warning: 'warning', hint: 'lightbulb' };
/** Avviso non modale in uno slot riservato (nessun layout shift). @param {{variant?:'info'|'warning'|'hint',text?:string,visible?:boolean}} props */
export function Banner(props = {}) {
  const icon = Icon({ name: 'info' }); const text = h('span', { class: 'c-banner__text' });
  const el = h('div', { class: 'c-banner', role: 'status', 'aria-live': 'polite' }, icon.el, text);
  const update = (p = {}) => {
    props = { ...props, ...p }; const variant = props.variant || 'info';
    el.dataset.variant = variant; icon.update({ name: ICON[variant] }); el.toggleAttribute('data-visible', !!props.visible);
    const msg = props.visible ? props.text ?? '' : ''; if (text.textContent !== msg) text.textContent = msg; // testo vuoto quando nascosto: l'annuncio parte all'inserimento
  };
  update();
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'Banner', create: Banner, states: ['def'], variants: [
  { label: 'warning', props: { variant: 'warning', visible: true, text: 'Attenzione: Caps Lock attivo' } }, { label: 'hint', props: { variant: 'hint', visible: true, text: 'Suggerimento: usa il medio sinistro per D.' } },
  { label: 'info', props: { variant: 'info', visible: true, text: 'Il tempo parte al primo tasto corretto.' } }, { label: 'nascosto', props: { variant: 'info', visible: false } } ] };
