import { h } from '../dom.js';
import { Key } from './key.js';
import { ROWS } from '../../data/layout-it.js';
import { ringPulse } from '../animations.js';
const MARK = new Set(['KeyF', 'KeyJ']);
/** @param {{guide?:boolean,tint?:boolean,next?:{code:string,mods:string[]}|null}} props  API: update, press(code,'ok'|'error'|'neutral'), release, releaseAll */
export function VirtualKeyboard(props = {}) {
  const el = h('div', { class: 'c-kb', 'aria-hidden': 'true' }); const keys = new Map(); let hinted = [];
  for (const row of ROWS) {
    const r = h('div', { class: 'c-kb__row' });
    for (const s of row) { const k = Key({ code: s.code, label: s.special ? s.label : s.base, w: s.w, finger: s.finger, mark: MARK.has(s.code) }); keys.set(s.code, k); r.append(k.el); }
    el.append(r);
  }
  const hints = () => {
    hinted.forEach((c) => keys.get(c)?.update({ hint: null })); hinted = [];
    if (!props.guide || !props.next) return;
    const put = (c, hint) => { if (keys.has(c)) { keys.get(c).update({ hint }); hinted.push(c); } };
    put(props.next.code, 'next'); props.next.mods.forEach((c) => put(c, 'shift'));
  };
  const update = (p = {}) => { props = { ...props, ...p }; el.toggleAttribute('data-tint', !!props.tint); hints(); };
  update();
  return {
    el, update,
    press(code, result) { const k = keys.get(code); if (!k) return; k.update({ down: result }); if (result !== 'neutral') ringPulse(k.ring); },
    release(code) { keys.get(code)?.update({ down: null }); },
    releaseAll() { keys.forEach((k) => k.update({ down: null })); },
    destroy() { el.remove(); },
  };
}
export const meta = { name: 'VirtualKeyboard', create: VirtualKeyboard, states: ['def'], variants: [
  { label: 'base', props: {} }, { label: 'guida + dita', props: { guide: true, tint: true, next: { code: 'KeyD', mods: ['ShiftRight'] } } } ] };
