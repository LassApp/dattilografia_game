import { h } from '../dom.js';
import { t } from '../../i18n/index.js';
import { Icon } from './icon.js';
import { popIn } from '../animations.js';
/** 0–3 stelle (miele): piena/vuota, mai solo colore. @param {{value?:number,size?:'sm'|'lg',reveal?:boolean}} props */
export function StarRating(props = {}) {
  const stars = [0, 1, 2].map(() => h('span', { class: 'c-stars__star' }, Icon({ name: 'star' }).el));
  const el = h('span', { class: 'c-stars', role: 'img' }, ...stars); let revealed = false;
  const update = (p = {}) => {
    props = { ...props, ...p }; const v = Math.max(0, Math.min(3, props.value ?? 0));
    el.dataset.size = props.size || 'sm'; el.setAttribute('aria-label', t('results.stars', { n: v }));
    stars.forEach((s, i) => s.toggleAttribute('data-filled', i < v));
    if (props.reveal && !revealed && v > 0) { revealed = true; stars.forEach((s, i) => { if (i < v) popIn(s, 250 + i * 160); }); } // "pop" in sequenza
  };
  update();
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'StarRating', create: StarRating, states: ['def'], variants: [{ label: '0', props: { value: 0 } }, { label: '2', props: { value: 2 } }, { label: '3 lg', props: { value: 3, size: 'lg' } }] };
