import { h, setVar } from '../dom.js';
import { shake, pulse } from '../animations.js';
const GLYPH = { ' ': '␣', '\n': '↵' }; // visibili solo quando sono il carattere corrente
/** Testo da copiare. Char e Cursor sono solo CSS (data-state sul singolo carattere). @param {{text?:string,index?:number,error?:boolean,errorTick?:number,size?:'S'|'M'|'L'|'XL'}} props */
export function TextView(props = {}) {
  const flow = h('div', { class: 'c-textview__flow' }); const el = h('div', { class: 'c-textview', role: 'img' }, flow);
  let chars = [], lineOf = [], text = null, index = -1, error = false, tick = 0, line = -1;
  const paint = () => {
    chars.forEach((c, i) => { const st = i < index ? 'typed' : i === index ? (error ? 'error' : 'current') : 'pending'; if (c.dataset.state !== st) c.dataset.state = st; });
    const l = Math.max(0, (lineOf[index] ?? 0) - 1); if (l !== line) { line = l; setVar(el, '--_line', l); } // riga corrente sempre in 2ª posizione
  };
  const measure = () => { const tops = chars.map((c) => c.offsetTop); const u = [...new Set(tops)].sort((a, b) => a - b); lineOf = tops.map((x) => u.indexOf(x)); paint(); };
  const build = (str) => {
    flow.replaceChildren(); chars = []; let word = null;
    for (const ch of str) {
      const span = h('span', { class: 'c-char', 'aria-hidden': 'true' }, ch === '\n' ? '' : ch);
      if (GLYPH[ch]) span.dataset.glyph = GLYPH[ch];
      chars.push(span);
      if (ch === ' ' || ch === '\n') { word = null; flow.append(span); if (ch === '\n') flow.append(h('br')); }
      else { if (!word) { word = h('span', { class: 'c-word' }); flow.append(word); } word.append(span); }
    }
    el.setAttribute('aria-label', str); measure();
  };
  const update = (p = {}) => {
    props = { ...props, ...p }; if (props.size) el.dataset.size = props.size;
    if ((props.text ?? '') !== text) { text = props.text ?? ''; index = -1; tick = props.errorTick ?? 0; line = -1; build(text); }
    const next = props.index ?? 0;
    if ((props.errorTick ?? 0) > tick) shake(chars[next]); tick = props.errorTick ?? 0;
    if (next === index + 1 && index >= 0 && !props.error) pulse(chars[index]);
    index = next; error = !!props.error; paint();
  };
  const ro = new ResizeObserver(measure); ro.observe(el); document.fonts?.ready.then(measure);
  update();
  return { el, update, destroy() { ro.disconnect(); el.remove(); } };
}
export const meta = { name: 'TextView', create: TextView, states: ['def'], variants: [
  { label: 'in corso', props: { text: 'asdf fdsa asdf', index: 5 } }, { label: 'errore', props: { text: 'asdf fdsa asdf', index: 5, error: true } },
  { label: 'spazio corrente', props: { text: 'ab cd', index: 2 } }, { label: 'size L', props: { text: 'asdf fdsa', index: 2, size: 'L' } } ] };
