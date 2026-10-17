// Schermata di gioco: HUD nella topbar, testo sopra la tastiera, banner, pausa/ricomincia. La logica sta in engine/ e controllers/. A fine esercizio salva il risultato e apre #/risultati.
import { h } from '../dom.js';
import { t } from '../../i18n/index.js';
import { Icon } from '../components/icon.js';
import { Button } from '../components/button.js';
import { Hud } from '../components/hud.js';
import { Banner } from '../components/banner.js';
import { TextView } from '../components/text-view.js';
import { VirtualKeyboard } from '../components/virtual-keyboard.js';
import { FingerHint } from '../components/finger-hint.js';
import { FingerLegend } from '../components/finger-legend.js';
import { PauseOverlay } from '../components/pause-overlay.js';
import { ConfirmDialog } from '../components/confirm-dialog.js';
import { getSettings, onSettings } from '../../storage/settings-store.js';
import { storage } from '../../storage/index.js';
import { createSession } from '../../engine/session.js';
import { createHints } from '../../engine/hints.js';
import { buildResult } from '../../engine/result.js';
import { evaluate } from '../../engine/scoring.js';
import { normalizeText } from '../../engine/text-normalize.js';
import { createGameController } from '../../controllers/game-controller.js';
import { hudValues } from '../../util/format.js';
import { hintText } from '../../util/hint-text.js';
import { RESTART_CONFIRM_CHARS, DEFAULT_SOGLIE } from '../../config.js';
export function GameScreen(params = [], ctx = {}) {
  const [levelId = 'prova', exId] = params; const settings = getSettings();
  let exerciseId = exId ?? null, level = null, exIndex = 0, navTimer = null, alive = true;
  const session = createSession(); const hints = createHints();
  const textView = TextView({ size: settings.textSize }); const keyboard = VirtualKeyboard({ guide: settings.guide, tint: settings.fingerTint });
  const fingerHint = FingerHint(); const fingerLegend = FingerLegend({ tint: settings.fingerTint }); const hud = Hud(hudValues(session.getState())); const banner = Banner({ variant: 'warning' });
  const done = h('p', { class: 's-game__done', role: 'status' });
  const flags = { caps: false, hint: null };
  const showBanner = () => (flags.caps ? banner.update({ visible: true, variant: 'warning', text: t('banner.caps') })
    : flags.hint ? banner.update({ visible: true, variant: 'hint', text: hintText(flags.hint) }) : banner.update({ visible: false })); // il Caps Lock ha la precedenza
  const doRestart = () => session.restart();
  const askRestart = () => { const st = session.getState(); if (st.correct >= RESTART_CONFIRM_CHARS && st.status !== 'completed') confirm.open(); else doRestart(); };
  const pauseOverlay = PauseOverlay({ onResume: () => session.resume(), onRestart: askRestart, onExit: () => { location.hash = '#/'; } });
  const confirm = ConfirmDialog({ title: t('confirm.restartTitle'), message: t('confirm.restartBody'), confirmLabel: t('confirm.restart'), onConfirm: doRestart,
    onCancel: () => { if (session.getState().status === 'paused') pauseOverlay.open('manual'); } });
  const pauseBtn = Button({ label: t('game.pause'), icon: 'pause', variant: 'ghost', disabled: true, onClick: (e) => { e.currentTarget.blur(); session.pause('manual'); } });
  const restartBtn = Button({ label: t('game.restart'), icon: 'restart', variant: 'ghost', onClick: (e) => { e.currentTarget.blur(); askRestart(); } });
  const back = h('a', { href: '#/' }, Icon({ name: 'back', size: 'sm' }).el, t('nav.back'));
  ctx.topbar?.update({ center: h('div', { class: 'l-cluster' }, back, hud.el), extra: [pauseBtn.el, restartBtn.el] });
  const el = h('div', { class: 's-game l-container' }, h('div', { class: 's-game__banner' }, banner.el), textView.el, done, fingerHint.el, h('div', { class: 's-game__board' }, fingerLegend.el, keyboard.el));
  const onCompleted = async (st, sum) => {
    done.textContent = t('game.done');
    try {
      const soglie = level?.soglie ?? DEFAULT_SOGLIE; const evaluation = evaluate(sum, soglie);
      const best = await storage.getBest(levelId, exerciseId); const result = buildResult({ levelId, exerciseId, timestamp: Date.now(), summary: sum });
      await storage.saveResult(result, evaluation);
      ctx.lastResult = { result, evaluation, best, soglie, levelTitle: level?.titolo ?? levelId, nextExerciseId: level?.esercizi[exIndex + 1]?.id ?? null,
        isRecord: !!best && evaluation.passed && Math.round(sum.wpmNet) > Math.round(best.wpmNet) };
      if (alive) navTimer = setTimeout(() => { location.hash = '#/risultati'; }, 700); // un attimo per vedere l'ultimo carattere
    } catch { /* il salvataggio non deve mai bloccare il gioco */ }
  };
  const ctrl = createGameController({ session, hints, textView, keyboard, fingerHint, fingerLegend, hud, ui: {
    setCaps: (v) => { flags.caps = v; showBanner(); }, setHint: (x) => { flags.hint = x; showBanner(); },
    showPause: (reason) => pauseOverlay.open(reason === 'modal' ? 'manual' : reason), hidePause: () => pauseOverlay.close(),
    onStatus: (st) => { pauseBtn.update({ disabled: st.status !== 'running' }); el.toggleAttribute('data-paused', st.status === 'paused'); if (st.status !== 'completed') done.textContent = ''; },
    onCompleted } });
  const offSettings = onSettings((s) => { keyboard.update({ guide: s.guide, tint: s.fingerTint }); fingerLegend.update({ tint: s.fingerTint }); textView.update({ size: s.textSize }); });
  (async () => {
    try {
      if (!/^[\w-]+$/.test(levelId)) throw new Error('id');
      level = await (await fetch(`content/levels/${levelId}.json`)).json();
      exIndex = Math.max(0, level.esercizi.findIndex((x) => x.id === exId)); exerciseId = level.esercizi[exIndex].id;
      session.load(normalizeText(level.esercizi[exIndex].testo));
    } catch { done.textContent = t('game.loadError'); }
  })();
  return { el, destroy() { alive = false; clearTimeout(navTimer); ctrl.destroy(); offSettings(); pauseOverlay.destroy(); confirm.destroy(); ctx.topbar?.update({ center: '', extra: [] }); } };
}
