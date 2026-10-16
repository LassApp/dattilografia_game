import { h } from '../dom.js';
import { t } from '../../i18n/index.js';
import { Button } from './button.js';
import { Modal, openDemo } from './modal.js';
/** Riprendi / Ricomincia / Esci. Esc = Riprendi. @param {{onResume:Function,onRestart:Function,onExit:Function}} props  open(reason: 'manual'|'focus'|'idle') */
export function PauseOverlay(props) {
  const msg = h('p'); let acted = false;
  const act = (fn) => () => { acted = true; fn(); modal.close(); };
  const resume = Button({ label: t('pause.resume'), variant: 'primary', icon: 'play', onClick: act(() => props.onResume()) }); resume.el.dataset.autofocus = '';
  const restart = Button({ label: t('pause.restart'), icon: 'restart', onClick: act(() => props.onRestart()) });
  const exit = Button({ label: t('pause.exit'), onClick: act(() => props.onExit()) });
  const modal = Modal({ title: t('pause.title'), body: [msg, h('p', { class: 'c-modal__note' }, t('pause.hint'))], actions: [resume.el, restart.el, exit.el], onClose: () => { if (!acted) props.onResume(); acted = false; } });
  return { el: modal.el, update() {}, open(reason = 'manual') { msg.textContent = t(`pause.${reason}`); modal.open(); }, close() { acted = true; modal.close(); }, destroy() { acted = true; modal.destroy(); } };
}
export const meta = { name: 'PauseOverlay', create: (p) => openDemo('Apri pausa', () => PauseOverlay({ onResume() {}, onRestart() {}, onExit() {}, ...p })), states: ['def'], variants: [{ label: 'pausa', props: {} }] };
