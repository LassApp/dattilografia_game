import { h } from '../dom.js';
import { t } from '../../i18n/index.js';
/** Dito consigliato in forma testuale (mai solo colore). @param {{next?:{finger:string,hand:string,mods:string[]}|null}} props */
export function FingerHint(props = {}) {
  const el = h('div', { class: 'c-fingerhint' });
  const update = (p = {}) => {
    props = { ...props, ...p }; const n = props.next;
    el.toggleAttribute('data-empty', !n);
    if (!n) { el.textContent = ''; return; }
    const parts = [n.finger === 't' ? t('game.thumb') : t('game.finger', { finger: t(`finger.${n.finger}`), hand: t(`hand.${n.hand}`) })];
    const shift = n.mods.find((m) => m.startsWith('Shift'));
    if (shift) parts.push(t('game.shift', { side: t(shift === 'ShiftLeft' ? 'hand.l' : 'hand.r') }));
    if (n.mods.includes('AltRight')) parts.push(t('game.altgr'));
    if (n.mods.includes('CapsLock')) parts.push(t('game.caps'));
    el.textContent = parts.join(' · ');
  };
  update();
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'FingerHint', create: FingerHint, states: ['def'], variants: [
  { label: 'dito', props: { next: { finger: 'm', hand: 'l', mods: [] } } }, { label: 'maiuscola', props: { next: { finger: 'm', hand: 'l', mods: ['ShiftRight'] } } }, { label: 'vuoto', props: {} } ] };
