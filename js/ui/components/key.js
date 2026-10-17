import { h, setVar } from '../dom.js';
/** @param {{label?:string,code?:string,w?:number,size?:'sm',finger?:string,mark?:boolean,hint?:'next'|'shift'|null,down?:'ok'|'error'|'neutral'|null,heat?:1|2|3|null,count?:number|null}} props */
export function Key(props) {
  const ring = h('span', { class: 'c-key__ring' }); const text = h('span'); const count = h('span', { class: 'c-key__count' });
  const el = h('div', { class: 'c-key', data: { code: props.code ?? '' } }, ring, text, count);
  const set = (name, v) => { if (v) el.dataset[name] = v; else delete el.dataset[name]; };
  const update = (p) => {
    props = { ...props, ...p };
    const label = props.label ?? ''; if (text.textContent !== label) text.textContent = label;
    const n = props.count ? String(props.count) : ''; if (count.textContent !== n) count.textContent = n; // heatmap: numero di errori (mai solo colore)
    setVar(el, '--_w', props.w ?? 1); set('finger', props.finger); set('hint', props.hint); set('down', props.down); set('size', props.size); set('heat', props.heat);
    el.toggleAttribute('data-mark', !!props.mark);
  };
  update({});
  return { el, ring, update, destroy() { el.remove(); } };
}
export const meta = { name: 'Key', create: Key, states: ['def'], variants: [
  { label: 'idle', props: { label: 'a', finger: 'p' } }, { label: 'next', props: { label: 'd', hint: 'next', finger: 'm' } },
  { label: 'shift', props: { label: '⇧', hint: 'shift', w: 2 } }, { label: 'down ok', props: { label: 's', down: 'ok' } },
  { label: 'down error', props: { label: 'f', down: 'error', mark: true } }, { label: 'home mark', props: { label: 'j', mark: true } },
  { label: 'sm', props: { label: 'd', size: 'sm' } }, { label: 'heat 1', props: { label: 'a', heat: 1, count: 1 } }, { label: 'heat 2', props: { label: 's', heat: 2, count: 2 } }, { label: 'heat 3', props: { label: 'd', heat: 3, count: 4 } } ] };
