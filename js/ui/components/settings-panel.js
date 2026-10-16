import { h } from '../dom.js';
import { t } from '../../i18n/index.js';
import { Button } from './button.js';
import { Modal, openDemo } from './modal.js';
import { Switch } from './switch.js';
import { SegmentedControl } from './segmented-control.js';
/** @param {{settings:{theme:string,sounds:boolean,guide:boolean,fingerTint:boolean,textSize:string},onChange:(name:string,value:any)=>void}} props */
export function SettingsPanel(props) {
  const s = props.settings; const on = (name) => (v) => props.onChange?.(name, v);
  const theme = SegmentedControl({ name: 'theme', label: t('settings.theme'), value: s.theme, options: [['auto', 'themeAuto'], ['light', 'themeLight'], ['dark', 'themeDark']].map(([value, k]) => ({ value, label: t(`settings.${k}`) })), onChange: on('theme') });
  const size = SegmentedControl({ name: 'size', label: t('settings.textSize'), value: s.textSize, options: ['S', 'M', 'L', 'XL'].map((v) => ({ value: v, label: v })), onChange: on('textSize') });
  const sounds = Switch({ label: t('settings.sounds'), checked: s.sounds, onChange: on('sounds') });
  const guide = Switch({ label: t('settings.guide'), checked: s.guide, onChange: on('guide') });
  const tint = Switch({ label: t('settings.tint'), checked: s.fingerTint, onChange: on('fingerTint') });
  const row = (label, desc, ctl) => h('div', { class: 'c-setting' }, h('div', {}, label, desc ? h('small', {}, desc) : null), ctl.el);
  const close = Button({ label: t('settings.close'), variant: 'primary', onClick: () => modal.close() }); close.el.dataset.autofocus = '';
  const modal = Modal({ title: t('settings.title'), actions: [close.el], body: [row(t('settings.theme'), null, theme), row(t('settings.sounds'), null, sounds), row(t('settings.guide'), t('settings.guideDesc'), guide), row(t('settings.tint'), t('settings.tintDesc'), tint), row(t('settings.textSize'), null, size)] });
  const update = (p = {}) => { props = { ...props, ...p }; const v = props.settings; theme.update({ value: v.theme }); size.update({ value: v.textSize }); sounds.update({ checked: v.sounds }); guide.update({ checked: v.guide }); tint.update({ checked: v.fingerTint }); };
  return { el: modal.el, update, open: modal.open, close: modal.close, destroy() { modal.destroy(); } };
}
export const meta = { name: 'SettingsPanel', create: (p) => openDemo('Apri impostazioni', () => SettingsPanel({ onChange() {}, ...p })), states: ['def'],
  variants: [{ label: 'impostazioni', props: { settings: { theme: 'auto', sounds: true, guide: true, fingerTint: false, textSize: 'M' } } }] };
