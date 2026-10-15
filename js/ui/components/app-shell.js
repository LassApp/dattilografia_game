import { h } from '../dom.js';
import { t } from '../../i18n/index.js';
/** Cornice: skip-link, slot topbar, <main> (outlet del router). */
export function AppShell(props = {}) {
  const outlet = h('main', { class: 'l-shell__main', id: 'main', tabindex: '-1' });
  const slot = h('div');
  const el = h('div', { class: 'l-shell' }, h('a', { class: 'c-skip', href: '#main' }, t('app.skip')), slot, outlet);
  if (props.topbar) slot.append(props.topbar);
  return { el, outlet, update() {}, destroy() { el.remove(); } };
}
export const meta = { name: 'AppShell', create: AppShell, states: ['def'], variants: [] };
