// Tema: cambia SOLO l'attributo data-theme su <html>. I colori si leggono dai token.
import { getSettings, setSetting } from '../storage/settings-store.js';
const root = document.documentElement;
const mq = matchMedia('(prefers-color-scheme: dark)');
export const resolveTheme = (pref) => (pref === 'auto' ? (mq.matches ? 'dark' : 'light') : pref);
export const getTheme = () => root.getAttribute('data-theme');
export function getToken(name) { return getComputedStyle(root).getPropertyValue(name).trim(); }
export function onThemeChange(cb) {
  const o = new MutationObserver(cb);
  o.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  return () => o.disconnect();
}
function syncMeta() { // <meta theme-color> vuole un valore letterale: lo ricava dal colore calcolato della pagina
  let m = document.querySelector('meta[name=theme-color]');
  if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.append(m); }
  m.content = getComputedStyle(document.body).backgroundColor;
}
export function applyTheme(pref = getSettings().theme) { root.setAttribute('data-theme', resolveTheme(pref)); syncMeta(); }
export function setThemePref(pref) { setSetting('theme', pref); applyTheme(pref); }
mq.addEventListener('change', () => { if (getSettings().theme === 'auto') applyTheme(); });
