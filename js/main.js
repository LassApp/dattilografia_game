import { PROJECT_NAME } from './config.js';
import { applyTheme, setThemePref } from './ui/theme.js';
import { getSettings, setSetting } from './storage/settings-store.js';
import { h } from './ui/dom.js';
import { t } from './i18n/index.js';
import { AppShell } from './ui/components/app-shell.js';
import { Topbar } from './ui/components/topbar.js';
import { ThemeToggle } from './ui/components/theme-toggle.js';
import { IconButton } from './ui/components/icon-button.js';
import { SettingsPanel } from './ui/components/settings-panel.js';
import { GameScreen } from './ui/screens/game.js';
import { ResultsScreen } from './ui/screens/results.js';
import { startRouter } from './router.js';

applyTheme();
const settingsPanel = SettingsPanel({ settings: getSettings(), onChange: (name, value) => {
  if (name === 'theme') setThemePref(value); else setSetting(name, value);
  settingsPanel.update({ settings: getSettings() });
} });
const settingsBtn = IconButton({ icon: 'settings', label: t('nav.settings'), onClick: (e) => { e.currentTarget.blur(); settingsPanel.update({ settings: getSettings() }); settingsPanel.open(); } });
const topbar = Topbar({ brand: PROJECT_NAME, actions: [settingsBtn.el, ThemeToggle().el] });
const shell = AppShell({ topbar: topbar.el });
document.getElementById('app').append(shell.el);
const home = () => ({ el: h('div', { class: 'l-container l-stack' }, h('h1', {}, PROJECT_NAME), h('p', {}, t('app.placeholder')), h('p', {}, t('app.tryGame')),
  h('ul', { class: 'l-cluster' }, ...['prova-01', 'prova-02', 'prova-03'].map((id) => h('li', {}, h('a', { href: `#/gioco/prova/${id}` }, id)))) ) });
startRouter({ home, gioco: GameScreen, risultati: ResultsScreen }, shell.outlet, { topbar });
