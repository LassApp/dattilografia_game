import { h } from '../dom.js';
import { t } from '../../i18n/index.js';
import { StarRating } from './star-rating.js';
import { Badge } from './badge.js';
/** Esito, stelle (con "pop"), badge record e messaggio incoraggiante. @param {{title:string,message?:string,stars?:number,record?:boolean}} props */
export function ResultSummary(props) {
  const heading = h('h2', { class: 'c-resultsummary__title', tabindex: '-1' }); const stars = StarRating({ size: 'lg', reveal: true });
  const slot = h('div', { class: 'c-resultsummary__badge' }); const msg = h('p', { class: 'c-resultsummary__msg' });
  const el = h('section', { class: 'c-resultsummary' }, heading, stars.el, slot, msg);
  const update = (p = {}) => {
    props = { ...props, ...p }; el.dataset.outcome = (props.stars ?? 0) > 0 ? 'passed' : 'improve'; heading.textContent = props.title ?? '';
    stars.update({ value: props.stars ?? 0 }); slot.replaceChildren(...(props.record ? [Badge({ label: t('results.record'), variant: 'record', icon: 'star' }).el] : [])); msg.textContent = props.message ?? '';
  };
  update();
  return { el, heading, update, destroy() { el.remove(); } };
}
export const meta = { name: 'ResultSummary', create: ResultSummary, states: ['def'], variants: [
  { label: 'superato + record', props: { title: 'Esercizio superato', stars: 2, record: true, message: 'Bel lavoro.' } }, { label: 'da migliorare', props: { title: 'Ci sei quasi', stars: 0, message: 'La precisione viene prima della velocità.' } } ] };
