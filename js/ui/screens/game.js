// Schermata di gioco (Fase 3): HUD nella topbar, testo sopra la tastiera, banner (Caps Lock, suggerimento), pausa/ricomincia, tastiera, testo. La logica sta in engine/ e controllers/.
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
import { createSession } from '../../engine/session.js';
import { createHints } from '../../engine/hints.js';
import { buildResult } from '../../engine/result.js';
import { normalizeText } from '../../engine/text-normalize.js';
import { createGameController } from '../../controllers/game-controller.js';
import { hudValues, fmtTime } from '../../util/format.js';
import { RESTART_CONFIRM_CHARS } from '../../config.js';
const charName = (c) => (c === ' ' ? t('game.space') : c === '\n' ? t('game.enter') : c);
function hintText(x) {
  if (x.finger === 't') return t('hint.thumb', { char: charName(x.char) });
  const shiftSide = x.mods.find((m) => m.startsWith('Shift'));
  return [t('hint.base', { char: charName(x.char), finger: t(`fingerArt.${x.finger}`), hand: t(`hand.${x.hand}`), row: t(`row.${x.row}`) }),
    shiftSide ? t('hint.shift', { side: t(shiftSide === 'ShiftLeft' ? 'hand.l' : 'hand.r') }) : '', t('hint.home')].filter(Boolean).join(' ');
}
export function GameScreen(params = [], ctx = {}) {
  const [levelId = 'prova', exId] = params; const settings = getSettings(); let exerciseId = exId ?? null;
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
  const ctrl = createGameController({ session, hints, textView, keyboard, fingerHint, fingerLegend, hud, ui: {
    setCaps: (v) => { flags.caps = v; showBanner(); }, setHint: (x) => { flags.hint = x; showBanner(); },
    showPause: (reason) => pauseOverlay.open(reason === 'modal' ? 'manual' : reason), hidePause: () => pauseOverlay.close(),
    onStatus: (st) => { pauseBtn.update({ disabled: st.status !== 'running' }); el.toggleAttribute('data-paused', st.status === 'paused'); if (st.status !== 'completed') done.textContent = ''; },
    onCompleted: (st, sum) => {
      done.textContent = `${t('game.done')} ${t('game.summary', { wpm: Math.round(sum.wpmNet), accuracy: `${Math.round(sum.accuracy)}%`, errors: sum.errors, time: fmtTime(sum.elapsedMs) })}`;
      ctx.lastResult = buildResult({ levelId, exerciseId, timestamp: Date.now(), summary: sum }); // Fase 4: schermata dei risultati
    } } });
  const offSettings = onSettings((s) => { keyboard.update({ guide: s.guide, tint: s.fingerTint }); fingerLegend.update({ tint: s.fingerTint }); textView.update({ size: s.textSize }); });
  (async () => {
    try {
      if (!/^[\w-]+$/.test(levelId)) throw new Error('id');
      const level = await (await fetch(`content/levels/${levelId}.json`)).json();
      const i = Math.max(0, level.esercizi.findIndex((x) => x.id === exId)); const ex = level.esercizi[i]; exerciseId = ex.id;
      session.load(normalizeText(ex.testo));
    } catch { done.textContent = t('game.loadError'); }
  })();
  return { el, destroy() { ctrl.destroy(); offSettings(); pauseOverlay.destroy(); confirm.destroy(); ctx.topbar?.update({ center: '', extra: [] }); } };
}
