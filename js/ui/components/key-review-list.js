import { h } from '../dom.js';
import { t } from '../../i18n/index.js';
import { Key } from './key.js';
/** 3–5 tasti da ripassare con consiglio breve. @param {{items?:{label:string,errors:number,tip:string}[]}} props */
export function KeyReviewList(props = {}) {
  const el = h('div', { class: 'c-keyreview' });
  const update = (p = {}) => {
    props = { ...props, ...p }; const items = props.items || [];
    el.replaceChildren(items.length ? h('ul', {}, ...items.map((i) => h('li', {}, Key({ label: i.label, size: 'sm' }).el,
      h('div', {}, h('b', {}, `${i.label} · ${i.errors === 1 ? t('results.errorOne') : t('results.errorMany', { n: i.errors })}`), h('small', {}, i.tip))))) : h('p', {}, t('results.reviewNone')));
  };
  update();
  return { el, update, destroy() { el.remove(); } };
}
export const meta = { name: 'KeyReviewList', create: KeyReviewList, states: ['def'], variants: [
  { label: 'con tasti', props: { items: [{ label: 'D', errors: 3, tip: 'Il tasto D si preme con il medio sinistro, sulla riga base.' }, { label: 'F', errors: 1, tip: "Il tasto F si preme con l'indice sinistro, sulla riga base." }] } }, { label: 'vuoto', props: { items: [] } } ] };
