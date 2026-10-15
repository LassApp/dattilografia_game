import { PROJECT_NAME } from './config.js';
import { applyTheme } from './ui/theme.js';
import { h } from './ui/dom.js';
import { t } from './i18n/index.js';
import { AppShell } from './ui/components/app-shell.js';
import { Topbar } from './ui/components/topbar.js';
import { ThemeToggle } from './ui/components/theme-toggle.js';
import { startRouter } from './router.js';

applyTheme();
const shell = AppShell({ topbar: Topbar({ brand: PROJECT_NAME, actions: [ThemeToggle().el] }).el });
document.getElementById('app').append(shell.el);
const home = () => ({ el: h('div', { class: 'l-container l-stack' }, h('h1', {}, PROJECT_NAME), h('p', {}, t('app.placeholder'))) });
startRouter({ home }, shell.outlet);
