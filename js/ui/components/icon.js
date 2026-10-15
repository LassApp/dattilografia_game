import { ICONS } from '../icons.js';
const NS = 'http://www.w3.org/2000/svg';
/** @param {{name:string,size?:'sm'|'md'|'lg',label?:string}} props */
export function Icon(props) {
  const el = document.createElementNS(NS, 'svg'); const path = document.createElementNS(NS, 'path');
  el.setAttribute('viewBox', '0 0 24 24'); el.classList.add('c-icon'); el.append(path);
  const update = (p) => {
    props = { ...props, ...p }; path.setAttribute('d', ICONS[props.name] || '');
    el.dataset.size = props.size || 'md';
    if (props.label) { el.setAttribute('role', 'img'); el.setAttribute('aria-label', props.label); el.removeAttribute('aria-hidden'); }
    else { el.setAttribute('aria-hidden', 'true'); el.removeAttribute('role'); el.removeAttribute('aria-label'); }
  };
  update({});
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'Icon', create: Icon, states: ['def'], variants: Object.keys(ICONS).map((n) => ({ label: n, props: { name: n } })) };
