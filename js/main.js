import { PROJECT_NAME } from './config.js';
import { applyTheme } from './ui/theme.js';
import { h } from './ui/dom.js';
import { t } from './i18n/index.js';
import { AppShell } from './ui/components/app-shell.js';
import { Topbar } from './ui/components/topbar.js';
import { ThemeToggle } from './ui/components/theme-toggle.js';
import { GameScreen } from './ui/screens/game.js';
import { startRouter } from './router.js';

applyTheme();
const shell = AppShell({ topbar: Topbar({ brand: PROJECT_NAME, actions: [ThemeToggle().el] }).el });
document.getElementById('app').append(shell.el);
const home = () => ({ el: h('div', { class: 'l-container l-stack' }, h('h1', {}, PROJECT_NAME), h('p', {}, t('app.placeholder')), h('p', {}, t('app.tryGame')),
  h('ul', { class: 'l-cluster' }, ...['prova-01', 'prova-02', 'prova-03'].map((id) => h('li', {}, h('a', { href: `#/gioco/prova/${id}` }, id)))) ) });
startRouter({ home, gioco: GameScreen }, shell.outlet);
