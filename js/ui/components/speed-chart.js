import { h } from '../dom.js';
import { t } from '../../i18n/index.js';
import { fmtTime } from '../../util/format.js';
const NS = 'http://www.w3.org/2000/svg';
const s = (tag, attrs = {}, text) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (text != null) e.textContent = text; return e; };
/** Velocità (WPM) nel tempo, SVG scritto a mano; colori dai token via CSS. @param {{samples?:{t:number,wpm:number}[],target?:number}} props */
export function SpeedChart(props = {}) {
  const el = h('figure', { class: 'c-speedchart' });
  const update = (p = {}) => {
    props = { ...props, ...p }; const pts = props.samples || []; el.replaceChildren();
    if (pts.length < 2) { el.append(h('p', { class: 'c-speedchart__empty' }, t('results.chartEmpty'))); return; }
    const W = 400, H = 170, L = 34, R = 10, T = 12, B = 28; const maxT = pts[pts.length - 1].t;
    const top = Math.max(5, props.target ?? 0, ...pts.map((x) => x.wpm)) * 1.1;
    const X = (v) => L + (v / maxT) * (W - L - R), Y = (v) => T + (1 - v / top) * (H - T - B);
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': t('results.chartLabel', { from: Math.round(pts[0].wpm), to: Math.round(pts[pts.length - 1].wpm) }) });
    svg.append(s('line', { class: 'c-speedchart__axis', x1: L, y1: Y(0), x2: W - R, y2: Y(0) }), s('line', { class: 'c-speedchart__axis', x1: L, y1: T, x2: L, y2: Y(0) }),
      s('text', { x: L - 6, y: Y(0) + 4, 'text-anchor': 'end' }, '0'), s('text', { x: L - 6, y: Y(top / 1.1) + 4, 'text-anchor': 'end' }, String(Math.round(top / 1.1))),
      s('text', { x: L, y: H - 8 }, '0:00'), s('text', { x: W - R, y: H - 8, 'text-anchor': 'end' }, fmtTime(maxT)));
    if (props.target != null) svg.append(s('line', { class: 'c-speedchart__target', x1: L, y1: Y(props.target), x2: W - R, y2: Y(props.target) }), s('text', { x: W - R, y: Y(props.target) - 4, 'text-anchor': 'end' }, t('results.threshold', { wpm: props.target })));
    svg.append(s('polyline', { class: 'c-speedchart__line', points: pts.map((x) => `${X(x.t).toFixed(1)},${Y(x.wpm).toFixed(1)}`).join(' ') }),
      ...pts.map((x) => s('circle', { class: 'c-speedchart__dot', cx: X(x.t).toFixed(1), cy: Y(x.wpm).toFixed(1), r: 3.5 })));
    const table = h('table', { class: 'u-visually-hidden' }, h('caption', {}, t('results.chart')), h('tbody', {}, ...pts.map((x) => h('tr', {}, h('td', {}, fmtTime(x.t)), h('td', {}, `${Math.round(x.wpm)} WPM`)))));
    el.append(svg, h('figcaption', {}, t('results.chartNote')), table);
  };
  update();
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'SpeedChart', create: SpeedChart, states: ['def'], variants: [
  { label: 'dati', props: { target: 6, samples: [{ t: 3000, wpm: 8 }, { t: 6000, wpm: 11 }, { t: 9000, wpm: 10 }, { t: 12000, wpm: 14 }, { t: 15000, wpm: 15 }] } }, { label: 'troppo breve', props: { samples: [{ t: 3000, wpm: 8 }] } } ] };
