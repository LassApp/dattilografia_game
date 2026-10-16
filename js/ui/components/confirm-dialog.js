import { t } from '../../i18n/index.js';
import { Button } from './button.js';
import { Modal, openDemo } from './modal.js';
/** @param {{title:string,message:string,confirmLabel:string,onConfirm:Function,onCancel?:Function}} props */
export function ConfirmDialog(props) {
  let acted = false;
  const confirm = Button({ label: props.confirmLabel, variant: 'primary', onClick: () => { acted = true; props.onConfirm(); modal.close(); } });
  const cancel = Button({ label: t('confirm.cancel'), onClick: () => modal.close() }); cancel.el.dataset.autofocus = '';
  const modal = Modal({ title: props.title, body: props.message, actions: [confirm.el, cancel.el], onClose: () => { if (!acted) props.onCancel?.(); acted = false; } });
  return { el: modal.el, update() {}, open: modal.open, close: modal.close, destroy() { acted = true; modal.destroy(); } };
}
export const meta = { name: 'ConfirmDialog', create: (p) => openDemo('Apri conferma', () => ConfirmDialog({ onConfirm() {}, ...p })), states: ['def'],
  variants: [{ label: 'ricomincia', props: { title: 'Ricominciare?', message: 'Perderai i progressi di questo esercizio.', confirmLabel: 'Sì, ricomincia' } }] };
