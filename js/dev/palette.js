import { h } from '../ui/dom.js';
import { PAIRS } from './contrast-pairs.js';
const css = await (await fetch('css/tokens.css')).text();
const levels = { L1: [], L2: [], L3: [] }; let cur = 'L1';
for (const line of css.split('\n')) {
  const m = line.match(/\/\*\s*(L[123])/); if (m) cur = m[1];
  for (const n of line.matchAll(/(--[\w-]+)\s*:/g)) if (!levels[cur].includes(n[1])) levels[cur].push(n[1]);
}
const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
function readColor(str) { // converte qualsiasi colore CSS risolto in [r,g,b,a] tramite canvas
  ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = 'transparent'; ctx.fillStyle = str; ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255];
}
const over = (f, b) => [0, 1, 2].map((i) => f[i] * f[3] + b[i] * (1 - f[3]));
const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
function panel(theme) {
  const root = h('section', { class: 'p-panel', 'data-theme': theme }, h('h2', {}, theme === 'light' ? 'Tema chiaro' : 'Tema scuro'));
  document.querySelector('#out').append(root);
  const probe = h('span', { class: 'p-probe' }, 'x'); root.append(probe);
  const cs = getComputedStyle(root);
  for (const [lv, names] of Object.entries(levels)) {
    root.append(h('h3', {}, { L1: 'Livello 1 · primitivi', L2: 'Livello 2 · semantici', L3: 'Livello 3 · componenti' }[lv]));
    for (const n of names) {
      const sw = h('span', { class: 'p-sw' }); sw.style.setProperty('--_sw', `var(${n})`); // dev: riferimento al token, mai un colore
      root.append(h('div', { class: 'p-row' }, sw, h('code', {}, n), h('span', {}, cs.getPropertyValue(n).trim())));
    }
  }
  root.append(h('h3', {}, 'Contrasto testo/sfondo (WCAG AA)'));
  probe.style.setProperty('--_bg', 'var(--bg-page)'); probe.style.setProperty('--_fg', 'var(--text)');
  const page = readColor(getComputedStyle(probe).backgroundColor);
  for (const [fg, bg, min, label] of PAIRS[theme]) {
    probe.style.setProperty('--_fg', `var(${fg})`); probe.style.setProperty('--_bg', `var(${bg})`);
    const pc = getComputedStyle(probe);
    const B = over(readColor(pc.backgroundColor), page); const F = over(readColor(pc.color), B);
    const r = ratio(F, B); const ok = r >= min;
    root.append(h('div', { class: 'p-row' }, h('span', { class: ok ? 'p-pass' : 'p-fail' }, ok ? '✓ AA' : '✗ sotto'), h('code', {}, `${fg} su ${bg}`),
      h('span', {}, `${label} · `, h('span', { class: 'p-ratio' }, `${r.toFixed(2)}:1`), ` (min ${min}:1)`)));
  }
}
panel('light'); panel('dark');
