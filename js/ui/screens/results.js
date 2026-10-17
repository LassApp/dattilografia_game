// Schermata di fine esercizio (Fase 4): esito e stelle, statistiche, grafico, tasti da ripassare, heatmap, azioni. Legge ctx.lastResult (impostato dalla schermata di gioco).
import { h } from '../dom.js';
import { t } from '../../i18n/index.js';
import { Button } from '../components/button.js';
import { ResultSummary } from '../components/result-summary.js';
import { StatCard } from '../components/stat-card.js';
import { SpeedChart } from '../components/speed-chart.js';
import { KeyReviewList } from '../components/key-review-list.js';
import { VirtualKeyboard } from '../components/virtual-keyboard.js';
import { HeatLegend } from '../components/heat-legend.js';
import { heatFromSummary, reviewKeys } from '../../engine/heat.js';
import { fmtTime } from '../../util/format.js';
import { hintText, charName } from '../../util/hint-text.js';
const sign = (n) => (n > 0 ? `+${n}` : n < 0 ? `−${Math.abs(n)}` : '=');
export function ResultsScreen(params = [], ctx = {}) {
  const r = ctx.lastResult;
  if (!r) return { el: h('div', { class: 'l-container l-stack' }, h('p', {}, t('results.empty')), h('a', { href: '#/' }, t('nav.back'))), destroy() {} };
  const { result, evaluation: ev, best, isRecord, soglie, nextExerciseId } = r; const m = result.metrics; const acc = Math.round(m.accuracy);
  const message = ev.stars === 0 ? t(ev.reason === 'accuracy' ? 'results.msgAccuracy' : 'results.msgSpeed')
    : [t(ev.stars === 3 ? 'results.msgPerfect' : 'results.msgPassed'), ev.next ? t('results.nextStar', { accuracy: ev.next.precisione, wpm: ev.next.wpm }) : ''].filter(Boolean).join(' ');
  const title = t(ev.passed ? 'results.passed' : 'results.improve');
  const summary = ResultSummary({ title, message, stars: ev.stars, record: isRecord });
  const dW = best ? Math.round(m.wpmNet) - Math.round(best.wpmNet) : null; const dA = best ? acc - Math.round(best.accuracy) : null;
  const vs = (d) => (d == null ? '' : `${sign(d)} ${t('results.vsBest')}`);
  const main = [StatCard({ label: t('results.wpm'), value: m.wpmNet, format: (n) => String(Math.round(n)), delta: vs(dW), variant: isRecord ? 'record' : 'default', animate: true }),
    StatCard({ label: t('results.accuracy'), value: m.accuracy, format: (n) => `${Math.round(n)}%`, delta: vs(dA), animate: true }),
    StatCard({ label: t('results.errors'), value: m.errors, format: (n) => String(Math.round(n)), animate: true }),
    StatCard({ label: t('results.time'), value: m.elapsedMs, format: fmtTime, animate: true })];
  const extra = [StatCard({ label: t('results.streak'), value: m.maxStreak, format: (n) => String(Math.round(n)), variant: 'compact', animate: true }),
    StatCard({ label: t('results.avgInterval'), value: m.avgInterval, format: (n) => `${Math.round(n)} ms`, variant: 'compact', animate: true }),
    StatCard({ label: t('results.rhythm'), value: m.rhythmStdev, format: (n) => `±${Math.round(n)} ms`, variant: 'compact', animate: true })];
  const chart = SpeedChart({ samples: m.samples, target: soglie.wpmMin });
  const review = KeyReviewList({ items: reviewKeys(m, 5).map((k) => ({ label: charName(k.char), errors: k.errors, tip: hintText(k) })) });
  const heatKb = VirtualKeyboard({ heat: heatFromSummary(m) }); const legend = HeatLegend();
  const sec = (name, ...kids) => h('section', { class: 's-results__sec' }, h('h3', {}, name), ...kids);
  const go = (hash) => () => { location.hash = hash; };
  const actions = [Button({ label: t('results.retry'), icon: 'restart', onClick: go(`#/gioco/${result.levelId}/${result.exerciseId}`) }),
    Button({ label: t('results.levels'), variant: nextExerciseId ? 'secondary' : 'primary', onClick: go('#/') }),
    ...(nextExerciseId ? [Button({ label: t('results.next'), variant: 'primary', onClick: go(`#/gioco/${result.levelId}/${nextExerciseId}`) })] : [])];
  const live = h('p', { class: 'u-visually-hidden', role: 'status' });
  const el = h('div', { class: 's-results l-container' }, h('p', { class: 's-results__level' }, r.levelTitle), summary.el,
    h('div', { class: 's-results__stats' }, ...main.map((c) => c.el)), h('div', { class: 's-results__stats s-results__stats--compact' }, ...extra.map((c) => c.el)),
    h('div', { class: 's-results__cols' }, sec(t('results.chart'), chart.el), sec(t('results.review'), review.el)),
    sec(t('results.heat'), h('div', { class: 's-results__heat' }, heatKb.el), legend.el),
    h('div', { class: 's-results__actions' }, ...actions.map((b) => b.el)), live);
  requestAnimationFrame(() => { summary.heading.focus({ preventScroll: true }); live.textContent = t('results.announce', { outcome: title, stars: ev.stars, wpm: Math.round(m.wpmNet), accuracy: `${acc}%` }); });
  return { el, destroy() { [...main, ...extra].forEach((c) => c.destroy()); } };
}
