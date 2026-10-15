import { h } from '../ui/dom.js';
import { applyTheme } from '../ui/theme.js';
import * as icon from '../ui/components/icon.js';
import * as button from '../ui/components/button.js';
import * as iconButton from '../ui/components/icon-button.js';
import * as themeToggle from '../ui/components/theme-toggle.js';
import * as topbar from '../ui/components/topbar.js';
import * as key from '../ui/components/key.js';
import * as keyboard from '../ui/components/virtual-keyboard.js';
import * as textView from '../ui/components/text-view.js';
import * as fingerHint from '../ui/components/finger-hint.js';
// Aggiungere qui ogni nuovo componente (check-architecture verifica che esporti `meta`).
const MODULES = [icon, button, iconButton, themeToggle, topbar, key, keyboard, textView, fingerHint];
const FORCE = { hov: 'hover', foc: 'focus', act: 'active' };
applyTheme();
const out = document.querySelector('#out');
out.append(h('div', { class: 'l-cluster' }, themeToggle.ThemeToggle().el, h('span', {}, 'Tema')));
for (const { meta } of MODULES) {
  out.append(h('h2', {}, meta.name));
  for (const v of meta.variants) {
    const cell = h('div', { class: 'g-cell' }, h('small', {}, v.label));
    for (const s of meta.states) {
      const c = meta.create({ ...v.props, ...(s === 'dis' ? { disabled: true } : {}) });
      if (FORCE[s]) c.el.dataset.force = FORCE[s];
      cell.append(c.el);
    }
    out.append(cell);
  }
}
