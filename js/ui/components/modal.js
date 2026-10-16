import { h } from '../dom.js';
import { Button } from './button.js';
let uid = 0;
/** <dialog> nativo: focus trap, Esc, scrim. open()/close() avvisano il resto dell'app con gli eventi dt:modal-open / dt:modal-close (il gioco va in pausa).
 *  @param {{title:string,body?:Node|string|Node[],actions?:Node[],dismissible?:boolean,onClose?:Function}} props */
export function Modal(props) {
  const id = `modal-${++uid}`;
  const title = h('h2', { class: 'c-modal__title', id }); const body = h('div', { class: 'c-modal__body' }); const actions = h('div', { class: 'c-modal__actions' });
  const el = h('dialog', { class: 'c-modal', 'aria-labelledby': id }, title, body, actions);
  const update = (p = {}) => { props = { ...props, ...p }; title.textContent = props.title ?? ''; body.replaceChildren(...[props.body ?? ''].flat()); actions.replaceChildren(...(props.actions || [])); };
  el.addEventListener('close', () => { document.dispatchEvent(new CustomEvent('dt:modal-close')); props.onClose?.(); });
  el.addEventListener('cancel', (e) => { if (props.dismissible === false) e.preventDefault(); });
  update();
  return {
    el, update,
    open() { if (el.open) return; document.body.append(el); el.showModal(); document.dispatchEvent(new CustomEvent('dt:modal-open')); el.querySelector('[data-autofocus]')?.focus(); },
    close() { if (el.open) el.close(); },
    destroy() { if (el.open) el.close(); el.remove(); },
  };
}
/** Solo per la galleria: un pulsante che apre l'istanza. */
export function openDemo(label, make) {
  const inst = make(); const b = Button({ label, onClick: () => inst.open() });
  return { el: b.el, update() {}, destroy() { inst.destroy(); b.destroy(); } };
}
export const meta = { name: 'Modal', create: (p) => openDemo('Apri modal', () => Modal(p)), states: ['def'], variants: [{ label: 'dialog', props: { title: 'Titolo', body: 'Testo del modal.' } }] };
