import { IconButton } from './icon-button.js';
import { t } from '../../i18n/index.js';
import { getTheme, setThemePref, onThemeChange } from '../theme.js';
/** Variante `icon` (topbar). La variante segmentata Auto/Chiaro/Scuro arriva con SegmentedControl (impostazioni). */
export function ThemeToggle() {
  const btn = IconButton({ icon: 'moon', label: t('theme.toDark'), onClick: () => setThemePref(getTheme() === 'dark' ? 'light' : 'dark') });
  const sync = () => { const dark = getTheme() === 'dark'; btn.update({ icon: dark ? 'sun' : 'moon', label: t(dark ? 'theme.toLight' : 'theme.toDark') }); };
  const off = onThemeChange(sync); sync();
  return { el: btn.el, update: sync, destroy() { off(); btn.destroy(); } };
}
export const meta = { name: 'ThemeToggle', create: ThemeToggle, states: ['def'], variants: [{ label: 'icon', props: {} }] };
